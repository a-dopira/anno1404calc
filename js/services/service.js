async function getResources(url) {
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Server isn\`t responding, status: ${response.status}.\n Please, try later`)
    }
    return await response.json();
}

function retrieveChains(chains, condition, pos) {
    let result = [];
    let arr = Object.values(chains)

    if (condition === 'title') {

        for (let elem of arr) {
            let items = [];
            for (let item of elem) {
                items.push(Object.keys(item));
            }
    
            let cell = []
            for (let item of items ) {
                cell.push(item[pos]);
            };
            result.push(cell);
        };

    } else if (condition === 'value') {

        for (let elem of arr) {
            let items = [];
            for (let item of elem) {
                items.push(Object.values(item));
            }
    
            let cell = []
            for (let item of items ) {
                cell.push(item[pos]);
            };
            result.push(cell);
        };
    }

    return result; 
}

async function getChains(chainsDB) {
    let chains = await getResources(chainsDB);

    let data = [
        {titles: [...retrieveChains(chains, 'title', 0)]},
        {ratios: [...retrieveChains(chains, 'value', 0)]},
        {paths: [...retrieveChains(chains, 'value', 1)]},
    ];

    return data;
}

async function getInhabitants(inhabitantsDB) {
    return await getResources(inhabitantsDB)
}

async function getGoods(goodsDB) {
    return await getResources(goodsDB)
}

export {getChains, getInhabitants, getGoods};