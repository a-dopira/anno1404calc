import { dataService } from "../services/dataService.js";

export class TableComponent {
  constructor() {
    this.lupeHandlers = new Map();
  }

  async initialize() {
    await dataService.loadData();
    this.render();
  }

  render() {
    const goods = dataService.getGoods();

    const productsRow = document.querySelector(".products-row");
    const amountsRow = document.querySelector(".amounts-row");
    const diffRow = document.querySelector("#diffFrame");
    const utilizationRow = document.querySelector(".utilization-row");
    const chainsRow = document.querySelector(".chains-row");

    this.clearRowContent(productsRow);
    this.clearRowContent(amountsRow);
    this.clearRowContent(diffRow);
    this.clearRowContent(utilizationRow);
    this.clearRowContent(chainsRow);

    goods.forEach((good, index) => {
      const imagePath = dataService.getGoodImage(good.img);

      const productTd = document.createElement("td");
      productTd.innerHTML = `
        <div class="product-icon" title="${good.title}">
          <img src="${imagePath}" alt="${good.title}" />
        </div>
      `;
      productsRow.appendChild(productTd);

      const amountTd = document.createElement("td");
      amountTd.className = "amount-cell";
      amountTd.innerHTML = '<span class="amount-value">0</span>';
      amountsRow.appendChild(amountTd);

      const diffTd = document.createElement("td");
      diffTd.innerHTML = '<span class="diff-value">-</span>';
      diffRow.appendChild(diffTd);

      const utilizationTd = document.createElement("td");
      utilizationTd.innerHTML = `
        <span class="utilization-percent">-</span>
        <div class="utilization-bar">
          <div class="utilization-fill" style="height: 30px;"></div>
        </div>
      `;
      utilizationRow.appendChild(utilizationTd);

      const chainTd = document.createElement("td");
      chainTd.innerHTML = '<div class="lupe"></div>';
      chainsRow.appendChild(chainTd);
    });
  }

  clearRowContent(row) {
    const cells = row.querySelectorAll("td:not(:first-child)");
    cells.forEach((cell) => cell.remove());
  }

  updateAmountDisplay(amounts) {
    const amountCells = document.querySelectorAll(".amount-value");
    amountCells.forEach((cell, index) => {
      cell.textContent = amounts[index] || 0;
    });
  }

  updateUtilizationDisplay(actualNeeds, ceiledNeeds) {
    const utilizationCells = document.querySelectorAll(
      ".utilization-row td:not(:first-child)",
    );

    utilizationCells.forEach((cell, index) => {
      const percentSpan = cell.querySelector(".utilization-percent");
      const fillDiv = cell.querySelector(".utilization-fill");
      const barDiv = cell.querySelector(".utilization-bar");

      if (!percentSpan || !fillDiv || !barDiv) return;

      const actual = actualNeeds[index];
      const ceiled = ceiledNeeds[index];

      if (!ceiled || ceiled === 0) {
        percentSpan.textContent = "-";
        fillDiv.style.height = "30px";
        barDiv.style.backgroundColor = "#88ff6d";
      } else {
        const utilization = actual / ceiled;
        const percentage = Math.round(utilization * 100);

        percentSpan.textContent = `${percentage}%`;
        fillDiv.style.height = Math.max(0, 30 - 30 * utilization) + "px";

        if (utilization > 0.6 && utilization < 0.94) {
          barDiv.style.backgroundColor = "#f7ffa2";
        } else if (utilization >= 0.94) {
          barDiv.style.backgroundColor = "#ff5353";
        } else if (utilization > 0 && utilization <= 0.6) {
          barDiv.style.backgroundColor = "#88ff6d";
        } else {
          barDiv.style.backgroundColor = "#ffffff";
        }
      }
    });
  }

  updateLupeDisplay(amounts, onLupeClick) {
    const lupes = document.querySelectorAll(
      ".chains-row td:not(:first-child) .lupe",
    );

    this.lupeHandlers.forEach((handler, index) => {
      const lupe = lupes[index];
      if (lupe) {
        lupe.removeEventListener("click", handler);
      }
    });
    this.lupeHandlers.clear();

    lupes.forEach((lupe, index) => {
      if (amounts[index] > 0) {
        lupe.style.display = "block";

        const handler = () => onLupeClick(index, amounts[index]);
        lupe.addEventListener("click", handler);
        this.lupeHandlers.set(index, handler);
      } else {
        lupe.style.display = "none";
      }
    });
  }

  updateDifferenceDisplay(currentAmounts, memorizedAmounts) {
    const diffFrame = document.querySelector("#diffFrame");
    const diffCells = document.querySelectorAll(".diff-value");

    diffFrame.style.display = "table-row";

    diffCells.forEach((cell, index) => {
      const current = currentAmounts[index] || 0;
      const memorized = memorizedAmounts[index] || 0;
      const difference = current - memorized;

      if (difference > 0) {
        cell.textContent = `+${difference}`;
        cell.className = "diff-value diff-positive";
      } else if (difference < 0) {
        cell.textContent = `${difference}`;
        cell.className = "diff-value diff-negative";
      } else {
        cell.textContent = "0";
        cell.className = "diff-value diff-zero";
      }
    });
  }

  hideDifferenceDisplay() {
    const diffFrame = document.querySelector("#diffFrame");
    diffFrame.style.display = "none";

    const diffCells = document.querySelectorAll(".diff-value");
    diffCells.forEach((cell) => {
      cell.textContent = "-";
      cell.className = "diff-value";
    });
  }

  reset() {
    document.querySelectorAll(".amount-value").forEach((cell) => {
      cell.textContent = "0";
    });

    document
      .querySelectorAll(".utilization-row td:not(:first-child)")
      .forEach((cell) => {
        const percentSpan = cell.querySelector(".utilization-percent");
        const fillDiv = cell.querySelector(".utilization-fill");
        const barDiv = cell.querySelector(".utilization-bar");

        if (percentSpan) percentSpan.textContent = "-";
        if (fillDiv) fillDiv.style.height = "30px";
        if (barDiv) barDiv.style.backgroundColor = "#88ff6d";
      });

    document.querySelectorAll(".lupe").forEach((lupe) => {
      lupe.style.display = "none";
    });

    this.hideDifferenceDisplay();

    this.lupeHandlers.forEach((handler, index) => {
      const lupes = document.querySelectorAll(".lupe");
      if (lupes[index]) {
        lupes[index].removeEventListener("click", handler);
      }
    });
    this.lupeHandlers.clear();
  }
}
