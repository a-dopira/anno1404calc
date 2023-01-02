window.addEventListener('DOMContentLoaded', () => {
   
    // "images/inhabitants/iconBeggar.png"
    // "iconBeggar"
    //Beggar

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
                            <input type="number" name="cBeggar" value="0" class="cText cTextwidth saveinput inhabitantInput" maxlength="6" tabindex="1" alt="">
                        </li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li><input type="radio" name="cBeggarRadio" class="HouseRadio" value="House" alt=""></li>
                        <li><img src="images/inhabitants/iconHouse.png" height="22" width="22" alt=""></li>
                        <li><input type="text" name="cBeggarHouse" value="0" class="cText cTextwidth saveinput HouseInput" maxlength="6" alt=""></li>
                    </ul>
                </li>
            `;
            this.parentSelector.append(ol)
        }
    }

    new Inhabitant("images/inhabitants/iconBeggar.png", "iconBeggar", "Beggar", '.inhabitants').render()
})