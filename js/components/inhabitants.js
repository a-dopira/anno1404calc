import { dataService } from '../services/dataService.js';

export class InhabitantsComponent {
  constructor() {
    this.container = document.querySelector('.inhabitants-row');
  }

  async initialize() {
    await dataService.loadData();
    this.render();
    this.bindEvents();
  }

  render() {
    const inhabitants = dataService.getInhabitants();
    this.container.innerHTML = '';

    inhabitants.forEach((inhabitant, index) => {
      const imagePath = dataService.getInhabitantImage(inhabitant.img);
      const colors = this.getInhabitantColors(inhabitant.title);

      const group = document.createElement('div');
      group.className = 'inhabitant-group';
      group.innerHTML = `
        <div class="inhabitant-icon" style="background-color: ${colors.bg}">
          <img src="${imagePath}" alt="${inhabitant.alt}" title="${inhabitant.title}" />
        </div>
        <input
          type="number"
          class="inhabitant-input"
          placeholder="0"
          min="0"
          data-type="${inhabitant.title.toLowerCase()}"
          data-index="${index}"
        />
        <small>Inhabitants</small>
        <input
          type="number"
          class="house-input"
          placeholder="0"
          min="0"
          data-type="${inhabitant.title.toLowerCase()}"
          data-index="${index}"
        />
        <small>Houses</small>
        <div class="inhabitant-label">${inhabitant.title}</div>
      `;
      
      this.container.appendChild(group);
    });
  }

  getInhabitantColors(title) {
    const colorMap = {
      'Beggar': { bg: '#8B4513' },
      'Peasant': { bg: '#A0522D' },
      'Citizen': { bg: '#CD853F' },
      'Patrician': { bg: '#D2691E' },
      'Nobelman': { bg: '#DAA520' },
      'Nomad': { bg: '#B8860B' },
      'Envoy': { bg: '#FF8C00' }
    };
    return colorMap[title] || { bg: '#888888' };
  }

  bindEvents() {
    const inhabitantInputs = this.container.querySelectorAll('.inhabitant-input');
    const houseInputs = this.container.querySelectorAll('.house-input');

    inhabitantInputs.forEach(input => {
      input.addEventListener('input', this.onInhabitantChange.bind(this));
    });

    houseInputs.forEach(input => {
      input.addEventListener('input', this.onHouseChange.bind(this));
    });
  }

  onInhabitantChange(event) {
    const input = event.target;
    const index = parseInt(input.dataset.index);
    const inhabitants = parseInt(input.value) || 0;
    const houseInput = this.container.querySelector(
      `.house-input[data-index="${index}"]`
    );

    houseInput.removeEventListener('input', this.onHouseChange.bind(this));

    const inhabitantData = dataService.getInhabitantByIndex(index);
    const houses = inhabitants > 0 
      ? Math.ceil(inhabitants / inhabitantData.ratio)
      : 0;
    
    houseInput.value = houses > 0 ? houses : '';

    setTimeout(() => {
      houseInput.addEventListener('input', this.onHouseChange.bind(this));
    }, 10);
  }

  onHouseChange(event) {
    const input = event.target;
    const index = parseInt(input.dataset.index);
    const houses = parseInt(input.value) || 0;
    const inhabitantInput = this.container.querySelector(
      `.inhabitant-input[data-index="${index}"]`
    );

    inhabitantInput.removeEventListener('input', this.onInhabitantChange.bind(this));

    const inhabitantData = dataService.getInhabitantByIndex(index);
    const inhabitants = houses * inhabitantData.ratio;
    inhabitantInput.value = inhabitants > 0 ? inhabitants : '';

    setTimeout(() => {
      inhabitantInput.addEventListener('input', this.onInhabitantChange.bind(this));
    }, 10);
  }

  getInhabitantValues() {
    const inputs = this.container.querySelectorAll('.inhabitant-input');
    return Array.from(inputs).map(input => parseInt(input.value) || 0);
  }

  setInhabitantValues(values) {
    const inputs = this.container.querySelectorAll('.inhabitant-input');
    inputs.forEach((input, index) => {
      if (values[index] !== undefined) {
        input.value = values[index] || '';
        this.onInhabitantChange({ target: input });
      }
    });
  }

  reset() {
    const inputs = this.container.querySelectorAll('.inhabitant-input, .house-input');
    inputs.forEach(input => {
      input.value = '';
    });
  }
}