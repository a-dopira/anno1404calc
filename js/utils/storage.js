export class StorageUtils {
    static STORAGE_KEY = 'anno1404_calculator_state';
    static MAX_STORAGE_AGE = 24 * 60 * 60 * 1000; // 24 hours

    static createStateSnapshot(inhabitants, multipliers, memorizedAmounts = []) {
      return {
          inhabitants: inhabitants || [],
          multipliers: multipliers || [],
          memorizedAmounts: memorizedAmounts,
          timestamp: Date.now(),
      };
    }

    static saveState(state) {
      try {
          const dataToSave = {
              ...state,
              timestamp: Date.now()
          };
          
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
          
      } catch (error) {
          
          if (error.name === 'QuotaExceededError') {
              this.clearOldData();
              try {
                  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
              } catch (retryError) {
                  console.error('Smth weny wrong with saving state:', retryError);
              }
          }
      }
    }

    static loadState() {
      try {
          const savedData = localStorage.getItem(this.STORAGE_KEY);
          if (!savedData) {
              return null;
          }

          const state = JSON.parse(savedData);
          
          if (this.isStateExpired(state)) {
              this.clearState();
              return null;
          }

          if (!this.validateState(state)) {
              this.clearState();
              return null;
          }

          return state;
          
      } catch (error) {
          this.clearState();
          return null;
      }
    }

    static isStateExpired(state) {
      if (!state.timestamp) return true;
      
      const age = Date.now() - state.timestamp;
      return age > this.MAX_STORAGE_AGE;
    }

    static validateState(state) {
      if (!state || typeof state !== 'object') return false;
      
      if (!Array.isArray(state.inhabitants)) return false;
      if (!Array.isArray(state.multipliers)) return false;
      
      if (state.inhabitants.length !== 7) return false;
      if (state.multipliers.length > 21) return false;
      
      if (!state.inhabitants.every(val => typeof val === 'number' && val >= 0)) return false;
      if (!state.multipliers.every(val => typeof val === 'number' && val >= 0 && val <= 100)) return false;
      
      return true;
    }

    static clearState() {
      try {
          localStorage.removeItem(this.STORAGE_KEY);
      } catch (error) {
          console.error('Smth weny wrong with saving state:', error);
      }
    }

    static clearOldData() {

      const keysToCheck = [
          'anno1404_cache',
          'anno1404_old_state',
          'anno1404_backup',
          'anno1404_temp'
      ];
      
      keysToCheck.forEach(key => {
          try {
              localStorage.removeItem(key);
          } catch (error) {
              console.warn('Smth weny wrong with clearing old data:', error);
          }
      });
    }

    static getStorageInfo() {
      try {
          const used = new Blob(Object.values(localStorage)).size;
          const savedState = localStorage.getItem(this.STORAGE_KEY);
          
          return {
              totalUsed: used,
              stateSize: savedState ? new Blob([savedState]).size : 0,
              hasState: !!savedState,
              stateAge: savedState ? Date.now() - JSON.parse(savedState).timestamp : null
          };
      } catch (error) {
          return null;
      }
    }

    static importState(jsonString) {
      try {
          const importedData = JSON.parse(jsonString);
          
          if (!this.validateState(importedData)) {
              throw new Error('Invalid state format');
          }

          this.saveState(importedData);
          
          return true;
          
      } catch (error) {
          throw new Error('Failed to import state: ' + error.message);
      }
    }

    static createBackup() {
      try {
          const currentState = this.loadState();
          if (!currentState) {
              throw new Error('No state to backup');
          }

          const backupKey = `${this.STORAGE_KEY}_backup_${Date.now()}`;
          localStorage.setItem(backupKey, JSON.stringify(currentState));
          
          return backupKey;
          
      } catch (error) {
          throw error;
      }
    }

    static restoreFromBackup(backupKey) {
      try {
          const backupData = localStorage.getItem(backupKey);
          if (!backupData) {
              throw new Error('Backup not found');
          }

          const state = JSON.parse(backupData);
          if (!this.validateState(state)) {
              throw new Error('Invalid backup format');
          }

          this.saveState(state);
          return true;
          
      } catch (error) {
          throw error;
      }
    }
}