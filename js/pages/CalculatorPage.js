import { BasePage } from './BasePage.js';
import { InhabitantsComponent } from '../components/inhabitants.js';
import { ItemsComponent } from '../components/items.js';
import { TableComponent } from '../components/table.js';
import { ModalComponent } from '../components/modal.js';
import { CalculationService } from '../services/calculationService.js';
import { dataService } from '../services/dataService.js';
import { StorageUtils } from '../utils/storage.js';

export class CalculatorPage extends BasePage {
    constructor() {
        super();
        
        this.calculationService = new CalculationService();
        
        this.inhabitants = null;
        this.items = null;
        this.table = null;
        this.modal = null;
        
        // state
        this.currentAmounts = [];
        this.memorizedAmounts = [];
        this.isCalculated = false;
        
        // binding event handlers to context
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.validateInputs = this.validateInputs.bind(this);
    }

    async onInit() {
        await dataService.loadData();
        this.calculationService.setDataService(dataService);
    }

    async getHTML() {
        return `
            <div class="input-section">
                <div class="inhabitants-row">
                    <!-- inhabitants component -->
                </div>
                
                <div class="items-row">
                    <!-- items component -->
                </div>

                <div class="controls">
                    <button class="btn btn-save">Save</button>
                    <button class="btn btn-load">Load</button>
                    <button class="btn btn-reset">Reset</button>
                    <button class="btn btn-calculate">Calculate</button>
                </div>
            </div>

            <div class="section-title">Production needs</div>
            <div class="section-subtitle">
                Shows the number of production chains needed to satisfy your inhabitants demands
            </div>

            <div class="result-controls" style="display: none;">
                <button class="btn memorize">Memorize</button>
                <button class="btn compare">Compare</button>
            </div>

            <table class="data-table">
                <tbody>
                    <tr class="header-row">
                        <th></th>
                        <th colspan="14" class="section-header occident">
                            Required in the Occident
                        </th>
                        <th colspan="7" class="section-header orient">
                            Required in the Orient
                        </th>
                    </tr>
                    <tr class="products-row">
                        <th>Product</th>
                    </tr>
                    <tr class="amounts-row">
                        <th>Amount</th>
                    </tr>
                    <tr id="diffFrame" class="diff-row">
                        <th>Difference</th>
                    </tr>
                    <tr class="utilization-row">
                        <th>Utilization</th>
                    </tr>
                    <tr class="chains-row">
                        <th>Production chains</th>
                    </tr>
                </tbody>
            </table>

            <!-- modal window with related factories -->
            <div class="modal">
                <div class="modal-content">
                    <button class="close-btn">&times;</button>
                    <h3 style="margin-bottom: 15px; color: #f4e4c1; font-size: 14px">
                        Production Chain Details
                    </h3>
                    <div class="chain-details"></div>
                </div>
            </div>
        `;
    }

    async initializeComponents() {

        try {
            this.inhabitants = new InhabitantsComponent();
            this.inhabitants.container = this.querySelector('.inhabitants-row');
            await this.inhabitants.initialize();
            this.registerComponent(this.inhabitants);

            this.items = new ItemsComponent();
            this.items.container = this.querySelector('.items-row');
            await this.items.initialize();
            this.registerComponent(this.items);

            this.table = new TableComponent();
            await this.table.initialize();
            this.registerComponent(this.table);

            this.modal = new ModalComponent();
            this.registerComponent(this.modal);

        } catch (error) {
            this.showNotification('Failed to initialize components: ' + error.message, 'error');
        }
    }

    bindEvents() {
        const calculateBtn = this.querySelector('.btn-calculate');
        if (calculateBtn) {
            this.addEventListener(calculateBtn, 'click', this.calculate.bind(this));
        }

        const resetBtn = this.querySelector('.btn-reset');
        if (resetBtn) {
            this.addEventListener(resetBtn, 'click', this.reset.bind(this));
        }

        const saveBtn = this.querySelector('.btn-save');
        if (saveBtn) {
            this.addEventListener(saveBtn, 'click', this.saveToXML.bind(this));
        }

        const loadBtn = this.querySelector('.btn-load');
        if (loadBtn) {
            this.addEventListener(loadBtn, 'click', this.loadFromXML.bind(this));
        }

        const memorizeBtn = this.querySelector('.memorize');
        if (memorizeBtn) {
            this.addEventListener(memorizeBtn, 'click', this.memorizeAmounts.bind(this));
        }

        const compareBtn = this.querySelector('.compare');
        if (compareBtn) {
            this.addEventListener(compareBtn, 'click', this.compareAmounts.bind(this));
        }

        this.addEventListener(this.container, 'change', this.autoSave.bind(this));
        this.addEventListener(this.container, 'input', this.autoSave.bind(this));

        this.addEventListener(document, 'keydown', this.handleKeyboard);

        this.addEventListener(this.container, 'input', this.validateInputs);

    }

    async onRendered() {
        this.loadState();
    }

    calculate() {
        try {
            if (!this.inhabitants || !this.items) {
                this.showNotification('Components not initialized', 'error');
                return;
            }

            const inhabitants = this.inhabitants.getInhabitantValues();
            
            if (inhabitants.every(val => val === 0)) {
                this.reset();
                this.showNotification('Please set at least some population to calculate production needs.', 'warning');
                return;
            }

            const multipliers = this.items.getMultipliers();
            this.calculationService.setMultipliers(multipliers);

            const needs = this.calculationService.calculateProductionNeeds(inhabitants);
            const adjustedNeeds = this.calculationService.applyMultipliers(needs);
            const ceiledNeeds = adjustedNeeds.map(need => Math.ceil(need));

            this.table.updateAmountDisplay(ceiledNeeds);
            this.table.updateUtilizationDisplay(adjustedNeeds, ceiledNeeds);
            this.table.updateLupeDisplay(ceiledNeeds, this.showProductionChain.bind(this));

            this.currentAmounts = ceiledNeeds;
            this.isCalculated = true;

            const resultControls = this.querySelector('.result-controls');
            if (resultControls) {
                resultControls.style.display = 'flex';
            }

            const totalProduction = ceiledNeeds.reduce((sum, need) => sum + need, 0);
            this.showNotification(
                `Calculation complete! Total production buildings needed: ${totalProduction}`,
                'success'
            );

        } catch (error) {
            this.showNotification(`Calculation failed: ${error.message}`, 'error');
        }
    }

    async showProductionChain(goodIndex, amount) {
        try {
            if (this.modal) {
                await this.modal.show(goodIndex, amount);
            }
        } catch (error) {
            this.showNotification('Failed to load production chain details', 'error');
        }
    }

    reset() {
        try {
            if (this.inhabitants) this.inhabitants.reset();
            if (this.items) this.items.reset();
            if (this.table) this.table.reset();

            this.currentAmounts = [];
            this.memorizedAmounts = [];
            this.isCalculated = false;

            const resultControls = this.querySelector('.result-controls');
            if (resultControls) {
                resultControls.style.display = 'none';
            }

            if (this.modal) this.modal.close();
            this.clearSavedState();
            
            this.showNotification('Calculator reset to default state', 'info');
        } catch (error) {
            this.showNotification('Error during reset: ' + error.message, 'error');
        }
    }

    memorizeAmounts() {
        if (!this.isCalculated) {
            this.showNotification('Please calculate production needs first', 'warning');
            return;
        }

        this.memorizedAmounts = [...this.currentAmounts];

        const button = this.querySelector('.memorize');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Memorized!';
            button.style.background = '#4a7c59';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }

        this.showNotification('Current production requirements memorized for comparison', 'success');
    }

    compareAmounts() {
        if (!this.isCalculated) {
            this.showNotification('Please calculate production needs first', 'warning');
            return;
        }

        if (this.memorizedAmounts.length === 0) {
            this.showNotification('Please memorize a configuration first using the Memorize button', 'warning');
            return;
        }

        if (this.table) {
            this.table.updateDifferenceDisplay(this.currentAmounts, this.memorizedAmounts);
            this.showNotification('Comparison with memorized configuration displayed', 'info');
        }
    }

    async saveToXML() {
        try {
            if (!this.inhabitants || !this.items) {
                this.showNotification('Components not initialized', 'error');
                return;
            }

            const { xmlService } = await import('../services/xmlService.js');
            
            const data = {
                inhabitants: this.inhabitants.getInhabitantValues(),
                multipliers: this.items.getMultipliers(),
                calculationResults: this.currentAmounts,
                memorizedAmounts: this.memorizedAmounts
            };

            const errors = xmlService.validateXMLData(data);
            if (errors.length > 0) {
                this.showNotification('Data validation failed: ' + errors.join(', '), 'error');
                return;
            }

            const xmlContent = xmlService.exportToXML(data);
            const filename = `anno1404_${new Date().toISOString().split('T')[0]}.xml`;
            
            xmlService.downloadXML(xmlContent, filename);
            
            this.showNotification('Data saved successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to save data: ' + error.message, 'error');
        }
    }

    async loadFromXML() {
        try {
            if (!this.inhabitants || !this.items) {
                this.showNotification('Components not initialized', 'error');
                return;
            }

            const { xmlService } = await import('../services/xmlService.js');
            
            const data = await xmlService.loadXML();
            
            if (data.inhabitants) {
                this.inhabitants.setInhabitantValues(data.inhabitants);
            }

            if (data.multipliers) {
                this.items.setMultipliers(data.multipliers);
            }

            if (data.memorizedAmounts) {
                this.memorizedAmounts = data.memorizedAmounts;
            }

            if (data.calculationResults && data.calculationResults.some(val => val > 0)) {
                this.currentAmounts = data.calculationResults;
                this.isCalculated = true;
                
                this.updateDisplayFromLoadedData(data);
                
                const resultControls = this.querySelector('.result-controls');
                if (resultControls) {
                    resultControls.style.display = 'flex';
                }
            }

            this.showNotification('Data loaded successfully!', 'success');
            
        } catch (error) {
            if (error.message.includes('cancelled') || error.message.includes('No file selected')) {
                return;
            }
            this.showNotification('Failed to load data: ' + error.message, 'error');
        }
    }

    updateDisplayFromLoadedData(data) {
        if (!this.table || !this.inhabitants || !this.items) return;

        try {
            this.table.updateAmountDisplay(this.currentAmounts);
            
            const inhabitants = this.inhabitants.getInhabitantValues();
            const multipliers = this.items.getMultipliers();
            this.calculationService.setMultipliers(multipliers);
            
            const needs = this.calculationService.calculateProductionNeeds(inhabitants);
            const adjustedNeeds = this.calculationService.applyMultipliers(needs);
            
            this.table.updateUtilizationDisplay(adjustedNeeds, this.currentAmounts);
            this.table.updateLupeDisplay(this.currentAmounts, this.showProductionChain.bind(this));
        } catch (error) {
            console.error(error);
        }
    }

    autoSave() {
        if (!this.inhabitants || !this.items) return;

        const state = StorageUtils.createStateSnapshot(
                this.inhabitants.getInhabitantValues(),
                this.items.getMultipliers(),
                this.memorizedAmounts
            );
        StorageUtils.saveState(state);
    }

    loadState() {
        if (!this.inhabitants || !this.items) return;

        const state = StorageUtils.loadState();
        if (!state) return;

        if (state.inhabitants) {
            this.inhabitants.setInhabitantValues(state.inhabitants);
        }

        if (state.multipliers) {
            this.items.setMultipliers(state.multipliers);
        }

        if (state.memorizedAmounts) {
            this.memorizedAmounts = state.memorizedAmounts;
        }
    }
    clearSavedState() {
        StorageUtils.clearState();
    }

    // hotkeys
    handleKeyboard(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'Enter':
                    event.preventDefault();
                    this.calculate();
                    break;
                case 'r':
                    event.preventDefault();
                    this.reset();
                    break;
                case 'm':
                    event.preventDefault();
                    this.memorizeAmounts();
                    break;
                case 'c':
                    event.preventDefault();
                    this.compareAmounts();
                    break;
                case 's':
                    event.preventDefault();
                    this.saveToXML();
                    break;
                case 'o':
                    event.preventDefault();
                    this.loadFromXML();
                    break;
            }
        }
    }

    validateInputs(event) {
        const input = event.target;
        if (input.type === 'number' && input.value < 0) {
            input.value = 0;
        }
    }

    importState(state) {
        if (!state || !this.inhabitants || !this.items) return;

        try {
            if (state.inhabitants) {
                this.inhabitants.setInhabitantValues(state.inhabitants);
            }

            if (state.multipliers) {
                this.items.setMultipliers(state.multipliers);
            }

            if (state.memorizedAmounts) {
                this.memorizedAmounts = state.memorizedAmounts;
            }

            if (state.currentAmounts && state.isCalculated) {
                this.currentAmounts = state.currentAmounts;
                this.isCalculated = true;
                this.updateDisplayFromCalculatedAmounts();
            }

            this.showNotification('State imported successfully!', 'success');

        } catch (error) {
            console.error('[CalculatorPage] Import state error:', error);
            this.showNotification('Failed to import state: ' + error.message, 'error');
        }
    }

    updateDisplayFromCalculatedAmounts() {
        if (!this.table || !this.inhabitants || !this.items) return;

        try {
            this.table.updateAmountDisplay(this.currentAmounts);
            
            const inhabitants = this.inhabitants.getInhabitantValues();
            const multipliers = this.items.getMultipliers();
            this.calculationService.setMultipliers(multipliers);
            
            const needs = this.calculationService.calculateProductionNeeds(inhabitants);
            const adjustedNeeds = this.calculationService.applyMultipliers(needs);
            
            this.table.updateUtilizationDisplay(adjustedNeeds, this.currentAmounts);
            this.table.updateLupeDisplay(this.currentAmounts, this.showProductionChain.bind(this));

            const resultControls = this.querySelector('.result-controls');
            if (resultControls) {
                resultControls.style.display = 'flex';
            }
        } catch (error) {
            console.error('[CalculatorPage] Error updating display from calculated amounts:', error);
        }
    }

    onWindowResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.container.classList.add('mobile-layout');
        } else {
            this.container.classList.remove('mobile-layout');
        }
        if (this.table && typeof this.table.onResize === 'function') {
            this.table.onResize();
        }
    }

    // hotkeys help
    getKeyboardShortcuts() {
        return {
            'Ctrl+Enter': 'Calculate production needs',
            'Ctrl+R': 'Reset calculator',
            'Ctrl+M': 'Memorize current results',
            'Ctrl+C': 'Compare with memorized',
            'Ctrl+S': 'Save to XML file',
            'Ctrl+O': 'Load from XML file'
        };
    }

    showKeyboardHelp() {
        const shortcuts = this.getKeyboardShortcuts();
        const helpText = Object.entries(shortcuts)
            .map(([key, description]) => `${key}: ${description}`)
            .join('\n');

        this.showNotification(`Keyboard Shortcuts:\n${helpText}`, 'info');
    }

    async onDestroy() {

        this.autoSave();
        
        document.removeEventListener('keydown', this.handleKeyboard);
        
        if (this.modal) {
            this.modal.close();
        }
        
        this.inhabitants = null;
        this.items = null;
        this.table = null;
        this.modal = null;

        this.currentAmounts = [];
        this.memorizedAmounts = [];
        this.isCalculated = false;
        
    }
}