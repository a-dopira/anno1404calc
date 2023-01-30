function memorizeButton() {
    const memorizeButton = document.querySelector('.memorize'),
          amountEach = document.querySelectorAll('.amount td');

    function memorizeAmount() {
        localStorage.clear();

        amountEach.forEach((item, i) => {
            localStorage.setItem(i, item.textContent)
        })
    }

    memorizeButton.addEventListener('click', memorizeAmount)
}

export default memorizeButton;