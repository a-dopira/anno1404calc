import { resetTable } from "./resetTable";

function resetButton() {
    
    const resetButton = document.querySelector('.button_2__reset');
    resetButton.addEventListener('click', resetTable);
    
}

export default resetButton;