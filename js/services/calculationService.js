export class CalculationService {
  constructor() {
    this.multipliers = [];
  }

  setMultipliers(multipliers) {
    this.multipliers = multipliers;
  }

  calculateProductionNeeds(inhabitants) {
    const [
      beggars,
      peasants,
      citizens,
      patricians,
      nobles,
      nomads,
      envoys,
    ] = inhabitants;

    return [
      // Fish
      beggars / 285 +
        peasants / 200 +
        citizens / 500 +
        patricians / 909 +
        nobles / 1250,
      // Spices
      citizens / 500 + patricians / 909 + nobles / 1250,
      // Bread
      patricians / 727 + nobles / 1025,
      // Meat
      nobles / 1136,
      // Cider
      beggars / 500 +
        (peasants >= 60 || citizens || patricians || nobles
          ? peasants / 340 +
            citizens / 340 +
            patricians / 652 +
            nobles / 1153
          : peasants / 500),
      // Beer
      patricians >= 510 || nobles
        ? patricians / 625 + nobles / 1071
        : patricians / 625,
      // Wine
      nobles >= 1500 ? nobles / 1000 : 0,
      // Linen garments
      citizens / 476 + patricians / 1052 + nobles / 2500,
      // Leather jerkins
      patricians >= 690 || nobles
        ? patricians / 1428 + nobles / 2500
        : patricians / 690,
      // Fur coats
      nobles >= 950 ? nobles / 1562 : 0,
      // Brocade robes
      nobles ? nobles / 2112 : 0,
      // Books
      patricians >= 940 || nobles
        ? patricians / 1875 + nobles / 3333
        : patricians / 1875,
      // Candlesticks
      nobles >= 3000 ? patricians / 2500 + nobles / 3333 : nobles / 3333,
      // Glasses
      nobles >= 1709 ? nobles / 1709 : 0,
      // Dates
      nomads / 450 + envoys / 600,
      // Milk
      nomads >= 145 || envoys ? nomads / 436 + envoys / 666 : nomads / 436,
      // Carpets
      nomads >= 295 ? nomads / 909 + envoys / 1500 : nomads / 295,
      // Coffee
      envoys / 1000,
      // Pearl necklaces
      envoys >= 1040 ? envoys / 751 : 0,
      // Parfumes
      envoys >= 2600 ? envoys / 1250 : 0,
      // Marzipan
      envoys >= 4360 ? envoys / 2453 : 0,
    ];
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
      return actual / ceiled;
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
      const utilization = requiredBuildings / actualBuildings;

      return {
        ...building,
        required: requiredBuildings,
        actual: actualBuildings,
        utilization: utilization,
        utilizationPercent: Math.round(utilization * 100)
      };
    });
  }
}