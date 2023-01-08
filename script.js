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
                            <input type="number" name="c${this.title}" value=0 placeholder=0 class="cText cTextwidth saveinput inhabitantInput" maxlength="6" tabindex="1" alt="">
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

    tableHead.innerHTML = `
                 <th></th>
                <td colspan="14" style="background-color:#cdedbf;">Required in the Occident</td>
                <td colspan="7" style="background-color:#fff2ad;">Required in the Orient</td>
        `
    
    tableBottom.prepend(tableHead);

})

