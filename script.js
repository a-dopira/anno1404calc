window.addEventListener('DOMContentLoaded', () => {

    let inhabitants = [
        {img: "images/inhabitants/iconBeggar.png", alt: "iconBeggar", title: "Beggar"},
        {img: "images/inhabitants/iconPeasant.png", alt: "iconPeasant", title: "Peasant"},
        {img: "images/inhabitants/iconCitizen.png", alt: "iconCitizen", title: "Citizen"},
        {img: "images/inhabitants/iconPatrician.png", alt: "iconPatrician", title: "Patrician"},
        {img: "images/inhabitants/iconNobleman.png", alt: "iconNobelman", title: "Nobelman"},
        {img: "images/inhabitants/iconNomad.png", alt: "iconNomad", title: "Nomad"},
        {img: "images/inhabitants/iconEnvoy.png", alt: "iconEnvoy", title: "Envoy"},
     ]

    //inhabitants

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
                            <input type="radio" name="c${this.title}Radio" class="inhabitantsRadio" value="inhabitants" checked="checked" alt="">
                        </li>
                        <li>
                            <img src="images/inhabitants/iconInhabitants.png" alt="iconInhabitants">
                        </li>
                        <li>
                            <input type="number" name="c${this.title}" value="0" class="cText cTextwidth saveinput inhabitantInput" maxlength="6" tabindex="1" alt="">
                        </li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li><input type="radio" name="c${this.title}Radio" class="HouseRadio" value="House" alt=""></li>
                        <li><img src="images/inhabitants/iconHouse.png" height="22" width="22" alt=""></li>
                        <li><input type="text" name="c${this.title}House" value="0" class="cText cTextwidth saveinput HouseInput" maxlength="6" alt=""></li>
                    </ul>
                </li>
            `;
            this.parentSelector.append(ol)
        }
    }
 
    inhabitants.forEach(({img, alt, title}) => new Inhabitant(img, alt, title, '.inhabitants').render());

    const inhabitantsList = document.querySelectorAll('.inhabitants ol');
    
    function switchAllInputs() 

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