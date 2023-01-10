window.addEventListener('DOMContentLoaded', () => {

    let inhabitantsDB = [
        {img: "images/inhabitants/iconBeggar.png", alt: "iconBeggar", title: "Beggar"},
        {img: "images/inhabitants/iconPeasant.png", alt: "iconPeasant", title: "Peasant"},
        {img: "images/inhabitants/iconCitizen.png", alt: "iconCitizen", title: "Citizen"},
        {img: "images/inhabitants/iconPatrician.png", alt: "iconPatrician", title: "Patrician"},
        {img: "images/inhabitants/iconNobleman.png", alt: "iconNobelman", title: "Nobelman"},
        {img: "images/inhabitants/iconNomad.png", alt: "iconNomad", title: "Nomad"},
        {img: "images/inhabitants/iconEnvoy.png", alt: "iconEnvoy", title: "Envoy"},
     ]

    //inhabitants

    const inhabitants = document.querySelector('.inhabitants');

    class Inhabitant {
        constructor(src, alt, title, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.parentSelector = document.querySelector(parentSelector);
        }

        render() {
            const ol = document.createElement('ol');
            ol.innerHTML = `
                <li>
                    <ul>
                        <li>
                            <img src=${this.src} alt=${this.alt}>
                        </li>
                        <li>${this.title}</li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li>
                            <input type="radio" name="c${this.title}Radio" class="inhabitantsRadio" value="inhabitants" alt="" checked="checked">
                        </li>
                        <li>
                            <img src="images/inhabitants/iconInhabitants.png" alt="iconInhabitants">
                        </li>
                        <li>
                            <input type="text" name="c${this.title}" value=0 placeholder=0 class="cText cTextwidth saveinput inhabitantInput" maxlength="6" tabindex="1" alt="">
                        </li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li><input type="radio" name="c${this.title}Radio" class="houseRadio" value="House" alt=""></li>
                        <li><img src="images/inhabitants/iconHouse.png" height="22" width="22" alt=""></li>
                        <li><input type="number" name="c${this.title}House" value=0 placeholder=0 class="cText cTextwidth saveinput houseInput"  maxlength="6" alt="" style="color: rgb(10, 10, 10); background-color: rgb(241, 241, 241);" disabled></li>
                    </ul>
                </li>
            `;
            this.parentSelector.append(ol)
        }
    }
 
    inhabitantsDB.forEach(({img, alt, title}) => new Inhabitant(img, alt, title, '.inhabitants').render());

    //main switcher

    const mainSwitcher = inhabitants.querySelectorAll('[name="switchRadio"]'),
          allInhabitants = inhabitants.querySelectorAll('.inhabitantsRadio'),
          allInhabitantsInputs = inhabitants.querySelectorAll('.inhabitantInput'),
          allHouses = inhabitants.querySelectorAll('.houseRadio'),
          allHousesInputs = inhabitants.querySelectorAll('.houseInput');

    mainSwitcher.forEach(item => {
        item.addEventListener('click', (e) => {
            if  (e.target.value == "inhabitants") {

                allInhabitants.forEach(item => {
                    item.checked = true;
                })
                allInhabitantsInputs.forEach(item => {
                    item.removeAttribute('disabled')
                    item.style.cssText = 'color: #000; background-color: #FFFFFF';
                })
    
                allHousesInputs.forEach(item => {
                    item.setAttribute("disabled", "disabled");
                    item.style.cssText = 'color: #0A0A0A; background-color: #F1F1F1';
                })
                allHouses.forEach(item => {
                    item.checked = false;
                })
            } else {

                allHouses.forEach(item => {
                    item.checked = true;
                })
                allHousesInputs.forEach(item => {
                    item.removeAttribute('disabled')
                    item.style.cssText = 'color: #000; background-color: #FFFFFF';
                })
    
                allInhabitantsInputs.forEach(item => {
                    item.setAttribute("disabled", "disabled");
                    item.style.cssText = 'color: #0A0A0A; background-color: #F1F1F1';
                })
                allInhabitants.forEach(item => {
                    item.checked = false;
                })
            }
        })
    })

    //individual switcher

    function inputSettings(nameRadio, nameInhabitant, nameHouse) {
        const cNameRadio = document.querySelectorAll(`[name="${nameRadio}"]`),
              cNameHouse = document.querySelector(`[name="${nameHouse}"]`),
              cNameInhabitant = document.querySelector(`[name="${nameInhabitant}"]`);

        cNameHouse.setAttribute("disabled", "disabled");
        cNameHouse.style.cssText = 'color: #0A0A0A; background-color: #F1F1F1';

        cNameRadio.forEach(item => {
            item.addEventListener('change', () => {
                if (item.checked && item.value == 'inhabitants') {
                    cNameHouse.setAttribute("disabled", "disabled");
                    cNameInhabitant.removeAttribute("disabled");
                    cNameHouse.style.cssText = 'color: #0A0A0A; background-color: #F1F1F1';
                    cNameInhabitant.style.cssText = 'color: #000; background-color: #FFFFFF';
                } else {
                    cNameInhabitant.setAttribute('disabled', "disabled");
                    cNameHouse.removeAttribute('disabled');
                    cNameInhabitant.style.cssText = 'color: #0A0A0A; background-color: #F1F1F1';
                    cNameHouse.style.cssText = 'color: #000; background-color: #FFFFFF';
                }
            })
        })
    }

    function inputSettingsAll() {
        for (let key of inhabitantsDB) {
            inputSettings(`c${key["title"]}Radio`, `c${key["title"]}`, `c${key["title"]}House`)
        }
    }
    
    inputSettingsAll();

    // top buttons

    const topButtons = document.querySelectorAll('.top-buttons_item'),
          topButtonsParent = document.querySelector('.top-buttons');

    function removeActiveButton() {
        topButtons.forEach(item => {
            item.removeAttribute('style');
            item.classList.remove('fade');
        })
    }

    function setActiveButton(i = 0) {
        topButtons[i].style.backgroundColor = '#373028';
        topButtons[i].style.border = '2px solid #cecece;';
        topButtons[i].style.color = '#D0BAA3';
        topButtons[i].classList.add('fade')
    }
   
    removeActiveButton()
    setActiveButton()

    topButtonsParent.addEventListener('click', (event) => {
        const target = event.target;
        if(target) {
            topButtons.forEach((btn, i) => {
                if(target == btn) {
                    removeActiveButton();
                    setActiveButton(i);
                }
            })
        }
    })
    //select dropdowns

    let goodsDB = [
        {title: "fish", img: "images/goods/iconFisch.png", id: 1,},
        {title: "spices", img: "images/goods/iconGewuerze.png", id: 2,},
        {title: "bread", img: "images/goods/iconBrot.png", id: 3,},
        {title: "meat", img: "images/goods/iconFleisch.png", id: 4,},
        {title: "cider", img: "images/goods/iconMost.png", id: 5,},
        {title: "beer", img: "images/goods/iconBier.png", id: 6,},
        {title: "wine", img: "images/goods/iconWein.png", id: 7,},
        {title: "linen garments", img: "images/goods/iconLeinenkutten.png", id: 8,},
        {title: "leather jerkins", img: "images/goods/iconLederwaemse.png", id: 9,},
        {title: "fur coats", img: "images/goods/iconPelzmaentel.png", id: 10,},
        {title: "brocade robes", img: "images/goods/iconBrokatgewaender.png", id: 11,},
        {title: "books", img: "images/goods/iconBuecher.png", id: 12,},
        {title: "candlesticks", img: "images/goods/iconKerzenleuchter.png", id: 13,},
        {title: "glasses", img: "images/goods/iconBrillen.png", id: 14,},
        {title: "dates", img: "images/goods/iconDatteln.png", id: 15,},
        {title: "milk", img: "images/goods/iconMilch.png", id: 16,},
        {title: "carpets", img: "images/goods/iconTeppiche.png", id: 17,},
        {title: "coffee", img: "images/goods/iconKaffee.png", id: 18,},
        {title: "pearl necklaces", img: "images/goods/iconPerlenketten.png", id: 19,},
        {title: "parfumes", img: "images/goods/iconDuftwasser.png", id: 20,},
        {title: "marzipans", img: "images/goods/iconMarzipan.png", id: 21,},
    ];

    class GoodsSelection {
        constructor(title, img, id, parentSelector) {
            this.title = title;
            this.img = img;
            this.id = id;
            this.parentSelector = document.querySelector(parentSelector);
        };

        render() {
            const ol = document.createElement('ol');
            ol.innerHTML = `
                <li><img src=${this.img} height="32" width="32" alt=${this.title}></li>
                    <li>
                        <select name="itemselect_${this.id}" id="itemselect_${this.id}" class="itemselect saveinput">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </li>
                <li>&#43;<span id="itemresult_${this.id}" class="itemresult">0</span>&#37;</li>
            `
            this.parentSelector.append(ol);
        }
    }

    goodsDB.forEach(({title, img, id}) => new GoodsSelection(title, img, id, '.items').render())

    function goodsDropdownSelection(id) {

        const itemResult = document.getElementById(`itemresult_${id}`),
              itemSelect = document.getElementById(`itemselect_${id}`);

        itemSelect.addEventListener('click', () => {
            itemResult.textContent = itemSelect.value * 25;
        })
    }

    function adjustAllItemSelections() {
        for (let item of goodsDB) {
            goodsDropdownSelection(item["id"])
        }
    }

    adjustAllItemSelections()

    //table

    const tableBottom = document.querySelector('tbody');
    const tableHead = document.createElement('tr');
    tableHead.classList.add('title_table');

    tableHead.innerHTML = `
                 <th></th>
                <td colspan="14" style="background-color:#cdedbf;">Required in the Occident</td>
                <td colspan="7" style="background-color:#fff2ad;">Required in the Orient</td>
        `
    
    tableBottom.prepend(tableHead);

    class TableCells {
        constructor(id, img, parentSelector) {
            this.id = id;
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
                <span id="resultAmount_${this.id}" class="saveresult">0</span>
            `
            this.parentSelector.append(td)
        };

        renderUtilization() {
            const td = document.createElement('td');
            td.innerHTML = `
                -
                <div id="utilization_${this.id}" style="height:50px; background-color:#88ff6d;">
                    <div style="height:50px; background-color:#fff;">&nbsp;</div>
                </div>
            `
            this.parentSelector.append(td);
        }
    }
    
    goodsDB.forEach(({img}) => new TableCells(null, img, '.itemsRow').renderImages())
    goodsDB.forEach(({id}) => new TableCells(id, null, '.amount').renderAmount());
    goodsDB.forEach(({id}) => new TableCells(id, null, '.utilization').renderUtilization())

    // calc itself

    const inhabitantsRadio = document.querySelectorAll('.inhabitantInput');
    const amountEach = document.querySelectorAll('.amount td');

    function calc() {
        let product = [];
       
        inhabitantsRadio.forEach(item => product.push(item.value))

        let fish = (product[0] / 285) + (product[1] / 200) + (product[2] / 500) + (product[3] / 909) + (product[4] / 1250),
            spices = (product[2] / 500) + (product[3] / 909) + (product[4] / 1250),
            bread = (product[3] / 727) + (product[4] / 1025),
            meat = (product[4] / 1136),
            cider = (product[0] / 500) + (product[1]>=60 && (product[2] || product[3] || product[4]) ? (product[1] / 340  + (product[2] / 340) + (product[3] / 652) + (product[4] / 1153)) : (product[1] / 500)),
            beer = product[3]>=510 || product[4] ? ((product[3] / 625) + (product[4] / 1071)) : (product[3] / 625),
            wine = product[4]>=1500 ? (product[4] / 1000) : 0,
            linenGarments = (product[2] / 476) + (product[3] / 1052) + (product[4] / 2500),
            leatherJerkins = product[3]>=690 || product[4] ? ((product[3] / 1428) + (product[4] / 2500)) : product[3] / 690,
            furCoats = product[4]>=950 ? (product[4] / 1562) : 0,
            brocadeRobes = product[4] ? (product[4] / 2112) : 0,
            books = product[3]>=940 || product[4] ? (product[3] / 1875) + (product[4] / 3333) : product[3] / 1875,
            candlesticks = product[4] >= 3000 ? ((product[3] / 2500) + (product[4] / 3333)) : (product[4] / 3333),
            glasses = product[4]>=1709 ? (product[4] / 1709) : 0,
            dates = (product[5] / 450) + (product[6] / 600),
            milk = product[5]>=145 || product[6] ? (product[5] / 436) + (product[6] / 666) : product[5] / 436,
            carpets = product[5]>=295 ? (product[5] / 909) + (product[6] / 1500) : product[5] / 295,
            coffee = (product[6] / 1000),
            pearlNecklaces = product[6] >= 1040 ? (product[6] / 751) : 0,
            parfumes = product[6] >= 2600 ? (product[6] / 1250) : 0,
            marzipans = product[6] >= 4360 ? (product[6] / 2453) : 0;

        let allProducts = [fish, spices, bread, meat, cider, beer, wine, linenGarments, leatherJerkins, furCoats, brocadeRobes,
            books, candlesticks, glasses, dates, milk, carpets, coffee, pearlNecklaces, parfumes, marzipans].map(item => Math.ceil(item));
        
        amountEach.forEach(item => item.textContent = "0");
        amountEach.forEach((item, i) => item.textContent = allProducts[i])
    };
    
    const calcButton = document.querySelector('.button_2__calculate');
    calcButton.addEventListener('click', calc);

})