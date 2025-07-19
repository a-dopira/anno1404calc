import { BasePage } from "./BasePage.js";
import { dataService } from "../services/dataService.js";

export class SupplyPage extends BasePage {
  constructor() {
    super();
    this.supplyMatrix = null;
    this.showEfficiencyColors = false;
  }

  async onInit() {
    await dataService.loadData();
    this.createSupplyMatrix();
  }

  async getHTML() {
    return `
            <div class="section-title">Supply Requirements Matrix</div>
            <div class="section-subtitle">
                Production efficiency: how many inhabitants can be satisfied by one production building
            </div>

            <div style="margin-bottom: 20px;">
                <button class="btn" id="export-matrix">Export Matrix</button>
            </div>

            <div class="supply-table-container">
                <table class="supply-table" id="supply-matrix">
                    <thead>
                        <tr>
                            <th class="header-row">Population \\ Goods</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>

            <style>
                .supply-table-container {
                    overflow-x: auto;
                    border-radius: 10px;
                    background: rgba(0, 0, 0, 0.3);
                }

                .supply-table th,
                .supply-table td {
                    padding: 8px 12px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    white-space: nowrap;
                }

                .supply-table th {
                    background: rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                    color: #f4e4c1;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .inhabitant-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: flex-start;
                    min-width: 120px;
                    font-weight: bold;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 8px;
                    position: sticky;
                    left: 0;
                    z-index: 5;
                }

                .good-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    min-width: 80px;
                }

                .inhabitant-img,
                .good-img {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                    border-radius: 3px;
                }

                .ratio-value {
                    font-weight: bold;
                    color: #4CAF50;
                    font-size: 13px;
                }

                @media (max-width: 768px) {
                    .supply-controls {
                        justify-content: center;
                    }
                    
                    .supply-table th,
                    .supply-table td {
                        padding: 4px 6px;
                        font-size: 12px;
                    }
                    
                    .inhabitant-img,
                    .good-img {
                        width: 20px;
                        height: 20px;
                    }
                }
            </style>
        `;
  }

  bindEvents() {
    this.addEventListener(
      this.querySelector("#export-matrix"),
      "click",
      this.exportMatrix.bind(this),
    );
  }

  async onRendered() {
    this.renderMatrix();
  }

  createSupplyMatrix() {
    const inhabitants = dataService.getInhabitants();
    const goods = dataService.getGoods();

    this.supplyMatrix = {
      inhabitants,
      goods,
      matrix: this.calculateConsumptionMatrix(inhabitants, goods),
    };
  }

  calculateConsumptionMatrix(inhabitants, goods) {
    const matrix = [];

    inhabitants.forEach((inhabitant) => {
      const row = {
        inhabitant,
        consumption: {},
      };

      goods.forEach((good, goodIndex) => {
        const consumption = this.getConsumptionForInhabitantAndGood(
          inhabitant,
          goodIndex,
        );
        if (consumption) {
          row.consumption[good.title] = consumption;
        }
      });

      matrix.push(row);
    });

    return matrix;
  }

  getConsumptionForInhabitantAndGood(inhabitant, goodIndex) {
    const consumptionMap = {
      0: {
        // Beggar
        0: 285, // fish
        4: 500, // cider
      },
      1: {
        // Peasant
        0: 200, // fish
        4: 340, // cider (conditional)
      },
      2: {
        // Citizen
        0: 500, // fish
        1: 500, // spices
        4: 340, // cider
        7: 476, // linen_garments
      },
      3: {
        // Patrician
        0: 909, // fish
        1: 909, // spices
        2: 727, // bread
        4: 652, // cider
        5: 625, // beer
        7: 1052, // linen_garments
        8: 1428, // leather_jerkins
        11: 1875, // books
        12: 2500, // candlesticks (conditional)
      },
      4: {
        // Nobelman
        0: 1250, // fish
        1: 1250, // spices
        2: 1025, // bread
        3: 1136, // meat
        4: 1153, // cider
        5: 1071, // beer
        6: 1000, // wine (conditional)
        7: 2500, // linen_garments
        8: 2500, // leather_jerkins
        9: 1562, // fur_coats (conditional)
        10: 2112, // brocade_robes
        11: 3333, // books
        12: 3333, // candlesticks
        13: 1709, // glasses (conditional)
      },
      5: {
        // Nomad
        14: 450, // dates
        15: 436, // milk
        16: 909, // carpets (conditional)
      },
      6: {
        // Envoy
        14: 600, // dates
        15: 666, // milk
        16: 1500, // carpets
        17: 1000, // coffee
        18: 751, // pearl_necklaces (conditional)
        19: 1250, // parfumes (conditional)
        20: 2453, // marzipans (conditional)
      },
    };

    return consumptionMap[inhabitant.index]?.[goodIndex] || null;
  }

  renderMatrix() {
    if (!this.supplyMatrix) return;

    const table = this.querySelector("#supply-matrix");
    const headerRow = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");

    headerRow.innerHTML = "<th>Population \\ Goods</th>";

    this.supplyMatrix.goods.forEach((good) => {
      const th = document.createElement("th");
      th.innerHTML = `
                <div class="good-header">
                    <img src="${good.img}" alt="${good.title}" class="good-img" 
                         onerror="this.style.display='none'">
                    <span style="font-size: 11px;">${this.formatGoodTitle(good.title)}</span>
                </div>
            `;
      headerRow.appendChild(th);
    });

    tbody.innerHTML = "";

    this.supplyMatrix.matrix.forEach((row) => {
      const tr = document.createElement("tr");

      const inhabitantCell = document.createElement("td");
      inhabitantCell.innerHTML = `
                <div class="inhabitant-header">
                    <img src="${row.inhabitant.img}" alt="${row.inhabitant.title}" 
                         class="inhabitant-img" onerror="this.style.display='none'">
                    <span>${row.inhabitant.title}</span>
                </div>
            `;
      tr.appendChild(inhabitantCell);

      this.supplyMatrix.goods.forEach((good) => {
        const cell = document.createElement("td");
        const consumption = row.consumption[good.title];

        if (consumption) {
          cell.innerHTML = `<span class="ratio-value">${consumption}</span>`;
        } else {
          cell.innerHTML = '<span class="no-consumption">-</span>';
        }

        tr.appendChild(cell);
      });

      tbody.appendChild(tr);
    });
  }

  formatGoodTitle(title) {
    return title
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  exportMatrix() {
    if (!this.supplyMatrix) {
      this.showNotification("No data to export", "warning");
      return;
    }

    try {
      let csv =
        "Population," +
        this.supplyMatrix.goods
          .map((g) => this.formatGoodTitle(g.title))
          .join(",") +
        "\n";

      this.supplyMatrix.matrix.forEach((row) => {
        const values = [row.inhabitant.title];
        this.supplyMatrix.goods.forEach((good) => {
          values.push(row.consumption[good.title] || "-");
        });
        csv += values.join(",") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anno1404_supply_matrix_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      this.showNotification("Supply matrix exported successfully!", "success");
    } catch (error) {
      this.showNotification(
        "Failed to export matrix: " + error.message,
        "error",
      );
    }
  }

  async onDestroy() {
    this.supplyMatrix = null;
  }
}
