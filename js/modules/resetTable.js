function resetTable() {

    const amountEach = document.querySelectorAll('.amount td'),
          utilizations = document.querySelectorAll('.utilization td'),
          pChains = document.querySelectorAll('#production_chains td');

    amountEach.forEach(item => {
        item.textContent = 0
    });

    pChains.forEach(item => {
        item.querySelector('img').style.display = 'none';
    })

    utilizations.forEach(item => {
        let dashItem = item.querySelector('span'),
            whiteSpace = item.querySelector('.space');

            dashItem.textContent = '-';
            whiteSpace.style.height = '50px';
    })
    
}

export {resetTable};