function utilization(allProducts, allCeiledProducts) {
    
    const utilizations = document.querySelectorAll('.utilization td');

    utilizations.forEach((item, i) => {
        let dashItem = item.querySelector('span'),
            whiteSpace = item.querySelector('.space'),
            coloredSpace = item.querySelector('.colored-space');

        let denominator = allProducts[i] / allCeiledProducts[i];

        whiteSpace.style.height = 50 - (50 * denominator) + 'px';

            if (denominator > 0.60 && denominator < 0.94) {
                coloredSpace.style.backgroundColor = '#f7ffa2'
            } else if (denominator >= 0.94) {
                coloredSpace.style.backgroundColor = '#ff5353'
            } else if (denominator > 0 && denominator <= 0.60) {
                coloredSpace.style.backgroundColor = '#88ff6d'
            } else {
                coloredSpace.style.backgroundColor = '#ffffff';
            }

        dashItem.textContent = denominator ? (Math.round(denominator * 100) + '%') : '-';
    })
}

export {utilization};
