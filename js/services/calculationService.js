export class CalculationService {
  constructor(dataService = null) {
    this.multipliers = [];
    this.dataService = dataService;
  }

  setDataService(dataService) {
    this.dataService = dataService;
  }

  setMultipliers(multipliers) {
    this.multipliers = multipliers;
  }

  calculateProductionNeeds(inhabitants) {
    return this.dataService.calculateAllRequirements(inhabitants);
  }

  applyMultipliers(needs) {
    return needs.map((need, index) => {
      const multiplier = this.multipliers[index] || 0;
      if (multiplier > 0) {
        return (need * 100) / (100 + multiplier);
      }
      return need;
    });
  }

  calculateFinalNeeds(inhabitants) {
    const needs = this.calculateProductionNeeds(inhabitants);
    const adjustedNeeds = this.applyMultipliers(needs);
    return adjustedNeeds.map((need) => Math.ceil(need));
  }

  calculateUtilization(actualNeeds, ceiledNeeds) {
    return actualNeeds.map((actual, index) => {
      const ceiled = ceiledNeeds[index];
      if (!ceiled || ceiled === 0) {
        return 0;
      }
      return Math.min(actual / ceiled, 1);
    });
  }

  calculateBuildingRequirements(chainData, amount) {
    if (!chainData || !Array.isArray(chainData)) {
      return [];
    }

    return chainData.map((building) => {
      const buildingMultiplier = amount;
      const buildingRatio = building.ratio / 100;
      const requiredBuildings = buildingMultiplier * buildingRatio;
      const actualBuildings = Math.ceil(requiredBuildings);
      const utilization =
        actualBuildings > 0 ? requiredBuildings / actualBuildings : 0;

      return {
        ...building,
        required: requiredBuildings,
        actual: actualBuildings,
        utilization: utilization,
        utilizationPercent: Math.round(utilization * 100),
      };
    });
  }
}
