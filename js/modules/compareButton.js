function compareButton() {

    const compareButton = document.querySelector('.compare'),
          diffFrame = document.querySelector('#diffFrame'),
          diffTable = document.querySelectorAll('#diffFrame td'),
          amountEach = document.querySelectorAll('.amount td');

    function compareAmount() {
        diffFrame.style.display = 'table-row';

        diffTable.forEach((item, i) => {
            let difference =  amountEach[i].textContent - localStorage.getItem(i);

            item.textContent = difference > 0 ? `+${difference}` : difference < 0 ? `-${difference}` : 0;

        })

        localStorage.clear();
    }

    compareButton.addEventListener('click', compareAmount);
}

export default compareButton;