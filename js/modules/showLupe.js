import { data } from "./db";
import { mountSingleChain } from "./singleChain";

function showLupe(amount) {
    const pChains = document.querySelectorAll('#production_chains td');
    
    pChains.forEach((item, i) => {
        if (+amount[i].textContent > 0) {

            let multiplier = amount[i].textContent;

            item.querySelector('img').style.display = 'block';
            item.querySelector('img').addEventListener('click', (e) => {

                if (e.target == item.querySelector('img') && document.querySelector('.pcFrame').style.display == 'none') {
                    document.querySelector('.pcFrame').style.display = 'block';

                    mountSingleChain(data, i, multiplier);

                } else {
                    document.querySelector('.pcFrame').style.display = 'none';
                    document.querySelector('.single-chain').remove();
                }
            })
        } else {
            item.querySelector('img').style.display = 'none';
        }
    })
}

export {showLupe};