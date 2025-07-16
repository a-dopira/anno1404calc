import { dataService } from '../services/dataService.js';

export class ModalComponent {
  constructor() {
    this.modal = document.querySelector('.modal');
    this.chainDetails = document.querySelector('.chain-details');
    this.closeBtn = document.querySelector('.close-btn');
    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', this.close.bind(this));
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.close();
      }
    });
  }

  async show(goodIndex, amount) {
    const goods = dataService.getGoods();
    const good = goods[goodIndex];

    const chainData = dataService.getProductionChain(good.title);

    const formattedChain = dataService.formatChainData(chainData);
    this.renderChain(good, formattedChain, amount);
    this.modal.style.display = 'flex';
  }

  renderChain(good, chainData, amount) {
    this.chainDetails.innerHTML = '';

    const chainTitle = document.createElement('h4');
    chainTitle.textContent = `${good.title} Production Chain`;
    chainTitle.style.color = '#f4e4c1';
    chainTitle.style.marginBottom = '20px';
    chainTitle.style.fontSize = '16px';
    chainTitle.style.textAlign = 'center';
    this.chainDetails.appendChild(chainTitle);

    const totalInfo = document.createElement('div');
    totalInfo.style.textAlign = 'center';
    totalInfo.style.marginBottom = '20px';
    totalInfo.style.padding = '10px';
    totalInfo.style.background = 'rgba(0,255,0,0.1)';
    totalInfo.style.borderRadius = '5px';
    totalInfo.innerHTML = `
      <div style="font-size: 14px; color: #4CAF50; font-weight: bold;">
        Total Production: ${amount}x ${good.title}
      </div>
    `;
    this.chainDetails.appendChild(totalInfo);

    chainData.forEach((building, index) => {
      const buildingMultiplier = amount;
      const buildingRatio = building.ratio / 100;
      const requiredBuildings = buildingMultiplier * buildingRatio;
      const actualBuildings = Math.ceil(requiredBuildings);
      const utilization = requiredBuildings / actualBuildings;
      const utilizationPercent = Math.round(utilization * 100);

      const buildingItem = document.createElement('div');
      buildingItem.className = 'chain-item';
      buildingItem.style.display = 'flex';
      buildingItem.style.justifyContent = 'space-between';
      buildingItem.style.alignItems = 'center';
      buildingItem.style.padding = '12px';
      buildingItem.style.margin = '8px 0';
      buildingItem.style.background = this.getUtilizationColor(utilization, 0.1);
      buildingItem.style.border = `1px solid ${this.getUtilizationColor(utilization, 1)}`;
      buildingItem.style.borderRadius = '5px';

      buildingItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <img src="${building.img}" alt="${building.name}" style="max-width: 100%; max-height: 100%;" />
          </div>
          <div>
            <div style="font-weight: bold; color: #f4e4c1;">${building.name}</div>
            <div style="font-size: 10px; color: #a49484;">Ratio: ${building.ratio}%</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; color: #4CAF50; font-size: 14px;">${actualBuildings}x</div>
          <div style="font-size: 10px; color: ${this.getUtilizationColor(utilization, 1)};">
            ${utilizationPercent}% load
          </div>
          <div style="font-size: 9px; color: #a49484;">
            (${requiredBuildings.toFixed(2)} needed)
          </div>
        </div>
      `;

      this.chainDetails.appendChild(buildingItem);

      if (index < chainData.length - 1) {
        const arrow = document.createElement('div');
        arrow.style.textAlign = 'center';
        arrow.style.fontSize = '16px';
        arrow.style.color = '#4CAF50';
        arrow.style.margin = '5px 0';
        this.chainDetails.appendChild(arrow);
      }
    });
  }

  getUtilizationColor(utilization, alpha = 1) {
    if (utilization >= 0.94) {
      return alpha === 1 ? '#ff5353' : 'rgba(255,83,83,0.1)';
    } else if (utilization > 0.6) {
      return alpha === 1 ? '#f7ffa2' : 'rgba(247,255,162,0.1)';
    } else {
      return alpha === 1 ? '#88ff6d' : 'rgba(136,255,109,0.1)';
    }
  }

  close() {
    this.modal.style.display = 'none';
  }
}