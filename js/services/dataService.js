class DataService {
  constructor() {
    this.data = null;
    this.loaded = false;
  }

  async loadData() {
    if (this.loaded) return this.data;

    try {
      const response = await fetch("db.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      this.loaded = true;
      return this.data;
    } catch (error) {
      console.error("Failed to load data:", error);
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

  getProductionRequirements() {
    return this.data?.productionRequirements || {};
  }

  calculateGoodRequirement(goodTitle, inhabitants) {
    const requirements = this.getProductionRequirements()[goodTitle];
    if (!requirements) return 0;

    let totalNeeded = 0;

    requirements.consumers.forEach((consumer) => {
      const population = inhabitants[consumer.index] || 0;

      if (population === 0) return;

      if (consumer.condition) {
        if (this.evaluateCondition(consumer.condition, inhabitants)) {
          totalNeeded += population / consumer.ratio;
        } else if (consumer.fallbackRatio) {
          totalNeeded += population / consumer.fallbackRatio;
        }
      } else {
        totalNeeded += population / consumer.ratio;
      }
    });

    return totalNeeded;
  }

  evaluateCondition(condition, inhabitants) {
    if (!condition) return true;

    switch (condition.type) {
      case "AND":
        return condition.conditions.every((cond) =>
          this.evaluateSingleCondition(cond, inhabitants),
        );

      case "OR":
        return condition.conditions.some((cond) =>
          this.evaluateSingleCondition(cond, inhabitants),
        );

      default:
        return this.evaluateSingleCondition(condition, inhabitants);
    }
  }

  evaluateSingleCondition(condition, inhabitants) {
    const population = inhabitants[condition.inhabitant] || 0;

    switch (condition.operator) {
      case ">=":
        return population >= condition.value;
      case ">":
        return population > condition.value;
      case "<=":
        return population <= condition.value;
      case "<":
        return population < condition.value;
      case "==":
      case "=":
        return population === condition.value;
      case "!=":
        return population !== condition.value;
      default:
        console.warn(`Unknown operator: ${condition.operator}`);
        return false;
    }
  }

  calculateAllRequirements(inhabitants) {
    const goods = this.getGoods();
    return goods.map((good) =>
      this.calculateGoodRequirement(good.title, inhabitants),
    );
  }

  createSupplyMatrix() {
    const inhabitants = this.getInhabitants();
    const goods = this.getGoods();
    const requirements = this.getProductionRequirements();

    const matrix = [];

    inhabitants.forEach((inhabitant) => {
      const row = {
        inhabitant: inhabitant,
        consumption: {},
        conditionalConsumption: {},
      };

      goods.forEach((good) => {
        const req = requirements[good.title];
        if (req) {
          const consumers = req.consumers.filter(
            (c) => c.type === inhabitant.title,
          );

          consumers.forEach((consumer) => {
            if (consumer.condition) {
              row.conditionalConsumption[good.title] = {
                primary: consumer.ratio,
                fallback: consumer.fallbackRatio || null,
                condition: consumer.condition,
              };
            } else {
              row.consumption[good.title] = {
                ratio: consumer.ratio,
              };
            }
          });
        }
      });

      matrix.push(row);
    });

    return matrix;
  }

  formatChainData(chainData) {
    if (!chainData) return [];

    return chainData.map((building) => {
      const buildingName = Object.keys(building).find((key) => key !== "img");
      const ratio = building[buildingName];
      const img = building.img;

      return {
        name: buildingName,
        ratio: ratio,
        img: img,
      };
    });
  }

  getProductionChain(goodTitle) {
    const chains = this.getChains();
    return chains[goodTitle] || null;
  }

  validateInhabitants(inhabitants) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(inhabitants)) {
      errors.push("Inhabitants must be an array");
      return { valid: false, errors, warnings };
    }

    if (inhabitants.length !== 7) {
      errors.push("Inhabitants array must have exactly 7 elements");
    }

    inhabitants.forEach((population, index) => {
      if (typeof population !== "number" || population < 0) {
        errors.push(`Invalid population at index ${index}: ${population}`);
      }

      if (population > 100000) {
        warnings.push(`Very high population at index ${index}: ${population}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
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

  getGoodById(id) {
    const goods = this.getGoods();
    return goods.find((good) => good.id === id) || null;
  }

  getInhabitantByIndex(index) {
    const inhabitants = this.getInhabitants();
    return inhabitants[index] || null;
  }
}

export const dataService = new DataService();
