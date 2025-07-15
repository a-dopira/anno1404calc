import { dataService } from './services/dataService.js';
import { CalculationService } from './services/calculationService.js';
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
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
});