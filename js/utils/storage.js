export class StorageUtils {
  static STORAGE_KEY = 'anno1404_calculator_state';

  static saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }

  static loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load saved state:', error);
      return null;
    }
  }

  static clearState() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear state:', error);
    }
  }

  static createStateSnapshot(inhabitants, multipliers, memorizedAmounts = []) {
    return {
      inhabitants,
      multipliers,
      memorizedAmounts,
      timestamp: Date.now()
    };
  }
}