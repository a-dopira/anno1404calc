function mountSingleChain(data, id, multiplier) {
    let titles = data[0]["titles"],
        ratios = data[1]["ratios"],
        paths = data[2]["paths"];

    let chains = document.querySelector('.pcDisplay'),
        singleChain = document.createElement('div');

    singleChain.classList.add('single-chain');
    
    chains.append(singleChain)

    for (let i = 0; i < titles[id].length; i++) {
        let div = document.createElement('ol'),
            plus = document.createElement('div');

        plus.textContent = '+';
        plus.style.width = '25px';
        plus.style.display = 'inline-block'

        let numberOfPlants = Math.ceil(multiplier * ratios[id][i] / 100),
            percentageValue = (multiplier * ratios[id][i] / numberOfPlants).toFixed(1);

        div.innerHTML = `
            <li>${numberOfPlants}x</li>
            <li><img src=${paths[id][i]}></li>
            <li>${titles[id][i]}</li>
            <li>(${percentageValue}%)</li>
        `
        singleChain.append(div);

        titles[id][i + 1] ? div.insertAdjacentElement('afterend', plus) : null;
    }

}

export {mountSingleChain};