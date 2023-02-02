import { getChains } from "../services/service";
import { mountSingleChain } from "./singleChain";

function showLupe(amount) {
    const pChains = document.querySelectorAll('#production_chains td'),
          chainsDB = 'http://localhost:3000/chains';

    let data = getChains(chainsDB);
    
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