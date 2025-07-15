import inhabitantsSetup from "./modules/inhabitants";
import mainSwitcher from "./modules/mainSwitcher";
import individualSwitcher from "./modules/individualSwitcher";
import topButtons from "./modules/topButtons";
import selectDropdowns from "./modules/selectDropdowns";
import tableContainer from "./modules/table";
import resetButton from "./modules/resetButton";
import closeButton from "./modules/closeButton";
import memorizeButton from "./modules/memorizeButton";
import compareButton from "./modules/compareButton";
import calcItself from "./modules/calculator";

import { getInhabitants, getGoods } from "./services/service";

window.addEventListener('DOMContentLoaded', () => {

const inhabitantsDB = 'http://localhost:3000/inhabitantsDB',
      goodsDB = 'http://localhost:3000/goodsDB';

    getInhabitants(inhabitantsDB).then(data => {
        inhabitantsSetup(data);
        individualSwitcher(data);
    });
    mainSwitcher();
    topButtons();
    selectDropdowns(() => getGoods(goodsDB));
    tableContainer(() => getGoods(goodsDB));
    calcItself();
    closeButton();
    memorizeButton();
    compareButton();
    resetButton();
    
})