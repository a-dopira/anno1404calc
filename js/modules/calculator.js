import { utilization } from "./utilization";
import { showLupe } from "./showLupe";
import { resetTable } from "./resetTable";

function calcItself() {
    const calcButton = document.querySelector('.button_2__calculate');

    function calc() {
        const amountEach = document.querySelectorAll('.amount td'),
              allInhabitantsInputs = document.querySelectorAll('.inhabitantInput');

        resetTable();

        let product = [];
       
        allInhabitantsInputs.forEach(item => product.push(item.value));

        const tableBottom = document.querySelector('tbody');

        if(!(product.every(i => +i > 0))) {
            tableBottom.classList.contains('fade') ? tableBottom.classList.remove('fade') : tableBottom.classList.add('fade');
        } else {
            tableBottom.classList.add('fade');
        }

        let fish = (product[0] / 285) + (product[1] / 200) + (product[2] / 500) + (product[3] / 909) + (product[4] / 1250),
            spices = (product[2] / 500) + (product[3] / 909) + (product[4] / 1250),
            bread = (product[3] / 727) + (product[4] / 1025),
            meat = (product[4] / 1136),
            cider = (product[0] / 500) + (product[1]>=60 || (product[2] || product[3] || product[4]) ? (product[1] / 340  + (product[2] / 340) + (product[3] / 652) + (product[4] / 1153)) : (product[1] / 500)),
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
            books, candlesticks, glasses, dates, milk, carpets, coffee, pearlNecklaces, parfumes, marzipans]

        let allCeiledProducts = allProducts.map(item => Math.ceil(item));

        amountEach.forEach((item, i) => item.textContent = allCeiledProducts[i])

        utilization(allProducts, allCeiledProducts);
        showLupe(amountEach)
    };

    calcButton.addEventListener('click', calc);
}

export default calcItself;