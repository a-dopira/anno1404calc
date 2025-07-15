class DataService {
  constructor() {
    this.data = null;
    this.loaded = false;
  }

  async loadData() {
    if (this.loaded) return this.data;
    
    try {
      const response = await fetch('/db.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      this.loaded = true;
      return this.data;
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    }
  }

  getInhabitants() {
    return this.data?.inhabitantsDB || [];
  }

  getGoods() {
    return this.data?.goodsDB || [];
  }

  getChains() {
    return this.data?.chains || {};
  }

  getInhabitantByIndex(index) {
    const inhabitants = this.getInhabitants();
    return inhabitants[index];
  }

  getGoodById(id) {
    const goods = this.getGoods();
    return goods.find(good => good.id === id);
  }

  getProductionChain(goodTitle) {
    const chains = this.getChains();
    const chainKey = this.titleToChainKey(goodTitle);
    return chains[chainKey];
  }

  titleToChainKey(title) {
    const mapping = {
      'fish': 'fish',
      'spices': 'spices', 
      'bread': 'bread',
      'meat': 'meat',
      'cider': 'cider',
      'beer': 'beer',
      'wine': 'wine',
      'linen_garments': 'linenGarments',
      'leather_jerkins': 'leatherJerkins',
      'fur_coats': 'furCoats',
      'brocade robes': 'brocadeRobes',
      'books': 'books',
      'candlesticks': 'candlesticks',
      'glasses': 'glasses',
      'dates': 'dates',
      'milk': 'milk',
      'carpets': 'carpets',
      'coffee': 'coffee',
      'pearl necklaces': 'pearlNecklaces',
      'parfumes': 'parfumes',
      'marzipans': 'marzipans'
    };
    return mapping[title] || title;
  }

  formatChainData(chainData) {
    if (!chainData) return [];
    
    return chainData.map(building => {
      const buildingName = Object.keys(building)[0];
      const ratio = building[buildingName];
      const img = building.img;
      
      return {
        name: buildingName,
        ratio: ratio,
        img: img
      };
    });
  }

  getInhabitantImage(iconPath) {
    return iconPath;
  }

  getGoodImage(iconPath) {
    return iconPath; 
  }

  getBuildingImage(iconPath) {
    return iconPath; 
  }
}

export const dataService = new DataService();