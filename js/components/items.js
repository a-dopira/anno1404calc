import { dataService } from '../services/dataService.js';

export class ItemsComponent {
  constructor() {
    this.container = document.querySelector('.items-row');
    this.multipliers = [];
  }

  async initialize() {
    await dataService.loadData();
    this.render();
    this.bindEvents();
  }

  render() {
    const goods = dataService.getGoods();
    this.container.innerHTML = '';

    goods.forEach((good, index) => {
      const imagePath = dataService.getGoodImage(good.img);
      
      const group = document.createElement('div');
      group.className = 'item-group';
      group.innerHTML = `
        <div class="item-icon" title="${good.title}">
          <img src="${imagePath}" alt="${good.title}" />
        </div>
        <select class="item-select" data-id="${index}">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <span class="multiplier-display">+0%</span>
      `;
      
      this.container.appendChild(group);
    });
  }

  bindEvents() {
    const selects = this.container.querySelectorAll('.item-select');
    selects.forEach(select => {
      select.addEventListener('change', this.updateMultiplierDisplay.bind(this));
    });
  }

  updateMultiplierDisplay(event) {
    const select = event.target;
    const multiplierValue = parseInt(select.value) * 25;
    const display = select.nextElementSibling;
    display.textContent = `+${multiplierValue}%`;

    const id = parseInt(select.dataset.id);
    this.multipliers[id] = multiplierValue;
  }

  getMultipliers() {
    return this.multipliers;
  }

  setMultipliers(multipliers) {
    this.multipliers = [...multipliers];
    const selects = this.container.querySelectorAll('.item-select');
    
    selects.forEach((select, index) => {
      const multiplier = multipliers[index] || 0;
      const selectValue = multiplier / 25;
      select.value = selectValue.toString();
      
      const display = select.nextElementSibling;
      display.textContent = `+${multiplier}%`;
    });
  }

  reset() {
    const selects = this.container.querySelectorAll('.item-select');
    selects.forEach(select => {
      select.value = '0';
      const display = select.nextElementSibling;
      display.textContent = '+0%';
    });
    this.multipliers = [];
  }
}