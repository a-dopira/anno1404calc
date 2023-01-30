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

import { inhabitantsDB, goodsDB} from "./modules/db";
import calcItself from "./modules/calculator";

window.addEventListener('DOMContentLoaded', () => {

    inhabitantsSetup(inhabitantsDB);
    mainSwitcher();
    individualSwitcher(inhabitantsDB);
    topButtons();
    selectDropdowns(goodsDB);
    tableContainer(goodsDB);
    calcItself();
    closeButton();
    memorizeButton();
    compareButton();
    resetButton();
    
})