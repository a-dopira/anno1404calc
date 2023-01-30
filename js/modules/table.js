function tableContainer(goodsDB) {
    
    const tableBottom = document.querySelector('tbody'),
          tableHead = document.createElement('tr');

    tableHead.classList.add('title_table');

    tableHead.innerHTML = `
        <th></th>
        <td colspan="14" style="background-color:#cdedbf;">Required in the Occident</td>
        <td colspan="7" style="background-color:#fff2ad;">Required in the Orient</td>
    `
    
    tableBottom.prepend(tableHead);

    class TableCells {
        lupe = "images/iconLupe.png";

        constructor(img, parentSelector) {
            this.img = img;
            this.parentSelector = document.querySelector(parentSelector);
        }

        renderImages() {
            const td = document.createElement('td');

            td.innerHTML = `
                <img src=${this.img} height="46" width="46" alt="">
            `
            this.parentSelector.append(td)
        };

        renderAmount() {
            const td = document.createElement('td');
            td.innerHTML = `
                <span class="saveresult">0</span>
            `
            this.parentSelector.append(td)
        };

        renderUtilization() {
            const td = document.createElement('td');
            td.innerHTML = `
                <span>-</span>
                <div class="colored-space" style="height:50px; background-color:#88ff6d;">
                    <div class="space" style="height:50px; background-color:#fff;">&nbsp;</div>
                </div>
            `
            this.parentSelector.append(td);
        }

        renderChains() {
            const td = document.createElement('td');
            td.innerHTML = `
                <td>
                    <img src=${this.lupe} style="display: none; cursor: pointer">
                </td>
            `
            this.parentSelector.append(td)
        }

        renderDiff() {
            const td = document.createElement('td');
            td.textContent = `
                <span>-</span>
            `;

            this.parentSelector.append(td);
        }
    }
    
    goodsDB.forEach(({img}) => new TableCells(img, '.itemsRow').renderImages());
    goodsDB.forEach(() => new TableCells(null, '.amount').renderAmount());
    goodsDB.forEach(() => new TableCells(null, '.utilization').renderUtilization());
    goodsDB.forEach(() => new TableCells(null, '#production_chains').renderChains());
    goodsDB.forEach(() => new TableCells(null, '#diffFrame').renderDiff());

}

export default tableContainer;