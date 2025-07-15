import { dataService } from './services/dataService.js';
import { CalculationService } from './services/calculationService.js';
import { xmlService } from './services/xmlService.js';
import { InhabitantsComponent } from './components/inhabitants.js';
import { ItemsComponent } from './components/items.js';
import { TableComponent } from './components/table.js';
import { ModalComponent } from './components/modal.js';
import { StorageUtils } from './utils/storage.js';

class App {
  constructor() {
    this.calculationService = new CalculationService();
    this.inhabitantsComponent = new InhabitantsComponent();
    this.itemsComponent = new ItemsComponent();
    this.tableComponent = new TableComponent();
    this.modalComponent = new ModalComponent();
    
    this.currentAmounts = [];
    this.memorizedAmounts = [];
    this.isCalculated = false;
  }

  async initialize() {
    try {
      await dataService.loadData();
      
      await this.inhabitantsComponent.initialize();
      await this.itemsComponent.initialize();
      await this.tableComponent.initialize();
      
      this.bindEvents();
      
      this.loadState();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load application data. Please refresh the page.');
    }
  }

  bindEvents() {
    document.querySelector('.btn-calculate')
      .addEventListener('click', this.calculate.bind(this));

    document.querySelector('.btn-reset')
      .addEventListener('click', this.reset.bind(this));

    document.querySelector('.memorize')
      .addEventListener('click', this.memorizeAmounts.bind(this));

    document.querySelector('.compare')
      .addEventListener('click', this.compareAmounts.bind(this));

    document.querySelector('.btn-save')
      .addEventListener('click', this.saveToXML.bind(this));

    document.querySelector('.btn-load')
      .addEventListener('click', this.loadFromXML.bind(this));

    const importBtn = document.querySelector('.btn-import');
    if (importBtn) {
      importBtn.addEventListener('click', this.importFromXML.bind(this));
    }

    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item')
          .forEach((nav) => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });

    document.addEventListener('change', this.autoSave.bind(this));
    document.addEventListener('input', this.autoSave.bind(this));

    document.addEventListener('keydown', this.handleKeyboard.bind(this));

    document.addEventListener('input', this.validateInputs);
  }

  calculate() {
    const inhabitants = this.inhabitantsComponent.getInhabitantValues();
    
    if (inhabitants.every(val => val === 0)) {
      this.reset();
      return;
    }

    const multipliers = this.itemsComponent.getMultipliers();
    this.calculationService.setMultipliers(multipliers);

    const needs = this.calculationService.calculateProductionNeeds(inhabitants);
    const adjustedNeeds = this.calculationService.applyMultipliers(needs);
    const ceiledNeeds = adjustedNeeds.map(need => Math.ceil(need));

    this.tableComponent.updateAmountDisplay(ceiledNeeds);
    this.tableComponent.updateUtilizationDisplay(adjustedNeeds, ceiledNeeds);
    this.tableComponent.updateLupeDisplay(ceiledNeeds, this.showProductionChain.bind(this));

    this.currentAmounts = ceiledNeeds;
    this.isCalculated = true;
  }

  async showProductionChain(goodIndex, amount) {
    await this.modalComponent.show(goodIndex, amount);
  }

  reset() {
    this.inhabitantsComponent.reset();
    this.itemsComponent.reset();
    this.tableComponent.reset();

    this.currentAmounts = [];
    this.isCalculated = false;

    this.modalComponent.close();
    
    localStorage.clear();
  }

  memorizeAmounts() {
    if (!this.isCalculated) return;

    this.memorizedAmounts = [...this.currentAmounts];

    const button = document.querySelector('.memorize');
    const originalText = button.textContent;
    button.textContent = 'Memorized!';
    button.style.background = '#4a7c59';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1000);
  }

  compareAmounts() {
    if (!this.isCalculated || this.memorizedAmounts.length === 0) return;

    this.tableComponent.updateDifferenceDisplay(
      this.currentAmounts, 
      this.memorizedAmounts
    );
  }

  async saveToXML() {
    try {
      const data = {
        inhabitants: this.inhabitantsComponent.getInhabitantValues(),
        multipliers: this.itemsComponent.getMultipliers(),
        calculationResults: this.currentAmounts,
        memorizedAmounts: this.memorizedAmounts
      };

      const errors = xmlService.validateXMLData(data);
      if (errors.length > 0) {
        this.showError('Data validation failed: ' + errors.join(', '));
        return;
      }

      const xmlContent = xmlService.exportToXML(data);
      const filename = `anno1404_${new Date().toISOString().split('T')[0]}.xml`;
      
      xmlService.downloadXML(xmlContent, filename);
      
      this.showSuccess('Data saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      this.showError('Failed to save data: ' + error.message);
    }
  }

  async loadFromXML() {
    try {
      const data = await xmlService.loadXML();
      
      if (data.inhabitants) {
        this.inhabitantsComponent.setInhabitantValues(data.inhabitants);
      }

      if (data.multipliers) {
        this.itemsComponent.setMultipliers(data.multipliers);
      }

      if (data.memorizedAmounts) {
        this.memorizedAmounts = data.memorizedAmounts;
      }

      if (data.calculationResults && data.calculationResults.some(val => val > 0)) {
        this.currentAmounts = data.calculationResults;
        this.isCalculated = true;
        
        this.updateDisplayFromLoadedData(data);
      }

      this.showSuccess('Data loaded successfully!');
      
      if (data.metadata) {
        console.log('Loaded file metadata:', data.metadata);
      }
      
    } catch (error) {
      console.error('Load error:', error);
      if (error.message.includes('cancelled') || error.message.includes('No file selected')) {
        return;
      }
      this.showError('Failed to load data: ' + error.message);
    }
  }

  async importFromXML() {
    await this.loadFromXML();
  }

  updateDisplayFromLoadedData(data) {
    this.tableComponent.updateAmountDisplay(this.currentAmounts);
    
    const inhabitants = this.inhabitantsComponent.getInhabitantValues();
    const multipliers = this.itemsComponent.getMultipliers();
    this.calculationService.setMultipliers(multipliers);
    
    const needs = this.calculationService.calculateProductionNeeds(inhabitants);
    const adjustedNeeds = this.calculationService.applyMultipliers(needs);
    
    this.tableComponent.updateUtilizationDisplay(adjustedNeeds, this.currentAmounts);
    this.tableComponent.updateLupeDisplay(this.currentAmounts, this.showProductionChain.bind(this));
  }

  autoSave() {
    const state = StorageUtils.createStateSnapshot(
      this.inhabitantsComponent.getInhabitantValues(),
      this.itemsComponent.getMultipliers(),
      this.memorizedAmounts
    );
    StorageUtils.saveState(state);
  }

  loadState() {
    const state = StorageUtils.loadState();
    if (!state) return;

    try {
      if (state.inhabitants) {
        this.inhabitantsComponent.setInhabitantValues(state.inhabitants);
      }

      if (state.multipliers) {
        this.itemsComponent.setMultipliers(state.multipliers);
      }

      if (state.memorizedAmounts) {
        this.memorizedAmounts = state.memorizedAmounts;
      }
    } catch (error) {
      console.warn('Failed to restore state:', error);
    }
  }

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
      }
    }
  }

  validateInputs(event) {
    const input = event.target;
    if (input.type === 'number' && input.value < 0) {
      input.value = 0;
    }
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      max-width: 300px;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    switch (type) {
      case 'error':
        notification.style.background = '#e74c3c';
        notification.style.color = 'white';
        break;
      case 'success':
        notification.style.background = '#27ae60';
        notification.style.color = 'white';
        break;
      case 'warning':
        notification.style.background = '#f39c12';
        notification.style.color = 'white';
        break;
      default:
        notification.style.background = '#3498db';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Анимация появления
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, type === 'error' ? 7000 : 3000); 
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
});