let inhabitantsDB = [
    {img: "images/inhabitants/iconBeggar.png", alt: "iconBeggar", title: "Beggar", ratio: 500},
    {img: "images/inhabitants/iconPeasant.png", alt: "iconPeasant", title: "Peasant", ratio: 8},
    {img: "images/inhabitants/iconCitizen.png", alt: "iconCitizen", title: "Citizen", ratio: 15},
    {img: "images/inhabitants/iconPatrician.png", alt: "iconPatrician", title: "Patrician", ratio: 25},
    {img: "images/inhabitants/iconNobleman.png", alt: "iconNobelman", title: "Nobelman", ratio: 40},
    {img: "images/inhabitants/iconNomad.png", alt: "iconNomad", title: "Nomad", ratio: 15},
    {img: "images/inhabitants/iconEnvoy.png", alt: "iconEnvoy", title: "Envoy", ratio: 25},
]

let goodsDB = [
    {title: "fish", img: "images/goods/iconFisch.png", id: 1},
    {title: "spices", img: "images/goods/iconGewuerze.png", id: 2},
    {title: "bread", img: "images/goods/iconBrot.png", id: 3},
    {title: "meat", img: "images/goods/iconFleisch.png", id: 4},
    {title: "cider", img: "images/goods/iconMost.png", id: 5},
    {title: "beer", img: "images/goods/iconBier.png", id: 6},
    {title: "wine", img: "images/goods/iconWein.png", id: 7},
    {title: "linen_garments", img: "images/goods/iconLeinenkutten.png", id: 8},
    {title: "leather_jerkins", img: "images/goods/iconLederwaemse.png", id: 9},
    {title: "fur_coats", img: "images/goods/iconPelzmaentel.png", id: 10},
    {title: "brocade robes", img: "images/goods/iconBrokatgewaender.png", id: 11},
    {title: "books", img: "images/goods/iconBuecher.png", id: 12},
    {title: "candlesticks", img: "images/goods/iconKerzenleuchter.png", id: 13},
    {title: "glasses", img: "images/goods/iconBrillen.png", id: 14},
    {title: "dates", img: "images/goods/iconDatteln.png", id: 15},
    {title: "milk", img: "images/goods/iconMilch.png", id: 16},
    {title: "carpets", img: "images/goods/iconTeppiche.png", id: 17},
    {title: "coffee", img: "images/goods/iconKaffee.png", id: 18},
    {title: "pearl necklaces", img: "images/goods/iconPerlenketten.png", id: 19},
    {title: "parfumes", img: "images/goods/iconDuftwasser.png", id: 20},
    {title: "marzipans", img: "images/goods/iconMarzipan.png", id: 21},
];

let chains = {
    fish: [{"Fishing lodge": 100, img: "images/goods/iconFisch.png"}],
    spices: [{"Spice farm": 100, img: "images/goods/iconGewuerze.png"}],
    bread: [{"Bakery": 100, img: "images/goods/iconBrot.png"}, {"Mill": 100, img: "images/fabrics/iconFloor.png"}, {"Crop farm": 200, img: "images/fabrics/iconCrop.png"}],
    meat: [{"Butchery": 100, img: "images/goods/iconFleisch.png"}, {"Cattle farm": 200, img: "images/fabrics/iconCattle.png"}, {"Saltworks": 48, img: "images/fabrics/iconSaltworks.png"}, {"Salt mine": 48, img: "images/fabrics/iconSaltmine.png"}, {"Charcoal Burner's Hut": 50, img: "images/fabrics/iconCoal1.png"}],
    cider: [{"Cider farm": 100, img: "images/goods/iconMost.png"}],
    beer: [{"Monastery brewery": 100, img: "images/goods/iconBier.png"}, {"Crop farm": 100, img: "images/fabrics/iconCrop.png"}, {"Monastery garden": 100, img: "images/fabrics/iconMonastery.png"}],
    wine: [{"Wine press": 100, img: "images/goods/iconWein.png"}, {"Vineyard": 300, img: "images/fabrics/iconVineyard.png"}, {"Barrel Cooperage": 100, img: "images/fabrics/iconBarellCooperage.png"}, {"Lumberjacks's hut": 100, img: "images/fabrics/iconWood.png"}, {"Iron Smelter": 50, img: "images/fabrics/iconIronSmelter.png"}, {"Iron Mine": 50, img: "images/fabrics/iconIronMine.png"}, {"Charcoal Burner's Hut": 50, img: "images/fabrics/iconCoal1.png"}],
    linenGarments: [{"Weaver's hut": 100, img: "images/goods/iconLeinenkutten.png"}, {"Hemp plantation": 200, img: "images/fabrics/iconHemp.png"}],
    leatherJerkins: [{"Tannery": 100, img: "images/goods/iconLederwaemse.png"}, {"Pig farm": 100, img: "images/fabrics/iconPig.png"}, {"Saltworks": 50, img: "images/fabrics/iconSaltworks.png"}, {"Salt mine": 50, img: "images/fabrics/iconSaltmine.png"}, {"Charcoal Burner's Hut": 50, img: "images/fabrics/iconCoal1.png"}],
    furCoats: [{"Furrier's Workshop": 100, img: "images/goods/iconPelzmaentel.png"}, {"Trapper's lodge": 100, img: "images/fabrics/iconTrapper.png"}, {"Saltworks": 32, img: "images/fabrics/iconSaltworks.png"}, {"Salt mine": 32, img: "images/fabrics/iconSaltmine.png"}, {"Charcoal Burner's Hut": 32, img: "images/fabrics/iconCoal1.png"}],
    brocadeRobes: [{"Silk Weaving Mill": 100, img: "images/goods/iconBrokatgewaender.png"}, {"Silk Plantation": 200, img: "images/fabrics/iconSilk.png"}, {"Gold Smelter": 100, img: "images/fabrics/iconGoldSmelter.png"}, {"Goldmine": 100, img: "images/fabrics/iconGoldMine.png"}, {"Charcoal Burner's Hut": 75, img: "images/fabrics/iconCoal1.png"}],
    books: [{"Printing House": 100, img: "images/goods/iconBuecher.png"}, {"Indigo farm": 200, img: "images/fabrics/iconIndigo.png"}, {"Paper Mill": 50, img: "images/fabrics/iconPaper.png"}, {"Lumberjacks's hut": 100, img: "images/fabrics/iconWood.png"}],
    candlesticks: [{"Redsmith's Workshop": 100, img: "images/goods/iconKerzenleuchter.png"}, {"Candlemaker's Workshop": 150, img: "images/fabrics/iconCandlemaker.png"}, {"Apiary": 300, img: "images/fabrics/iconApiary.png"}, {"Hemp plantation": 150, img: "images/fabrics/iconHemp.png"}, {"Copper Smelter": 75, img: "images/fabrics/iconCopperSmelter.png"}, {"Copper Mine": 75, img: "images/fabrics/iconCopperMine.png"}, {"Charcoal Burner's Hut": 50, img: "images/fabrics/iconCoal1.png"}],
    glasses: [{"Optician's Workshop": 100, img: "images/goods/iconBrillen.png"}, {"Quarz Quary": 75, img: "images/fabrics/iconQuarz.png"}, {"Copper Smelter": 75, img: "images/fabrics/iconCopperSmelter.png"}, {"Copper Mine": 75, img: "images/fabrics/iconCopperMine.png"}, {"Charcoal Burner's Hut": 50, img: "images/fabrics/iconCoal1.png"}],
    dates: [{"Date plantation": 100, img: "images/goods/iconDatteln.png"}],
    milk: [{"Goat farm": 100, img: "images/goods/iconMilch.png"}],
    carpets: [{"Carpet workshop": 100, img: "images/goods/iconTeppiche.png"}, {"Indigo farm": 100, img: "images/fabrics/iconIndigo.png"}, {"Silk plantation": 100, img: "images/fabrics/iconSilk.png"}],
    coffee: [{"Roasting house": 100, img: "images/goods/iconKaffee.png"}, {"Coffee plantation": 100, img: "images/fabrics/iconCoffeePlantation.png"}],
    pearlNecklaces: [{"Pearl Workshop": 100, img: "images/goods/iconPerlenketten.png"}, {"Pearl Fisher's Hut": 100, img: "images/fabrics/iconPerlFisher.png"}],
    parfumes: [{"Perfumery": 100, img: "images/goods/iconDuftwasser.png"}, {"Rose Nursery": 300, img: "images/fabrics/iconRoseNursery.png"}],
    marzipans: [{"Confectioner's Workshop": 100, img: "images/goods/iconMarzipan.png"}, {"Almond plantation": 200, img: "images/fabrics/iconAlmond.png"}, {"Sugar mill": 100, img: "images/fabrics/iconSugar.png"}, {"Sugarcane Plantation": 200, img: "images/fabrics/iconSugarcane.png"}]
}

function retrieveData(chains, condition, pos) {
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

let data = [
    {titles: [...retrieveData(chains, 'title', 0)]},
    {ratios: [...retrieveData(chains, 'value', 0)]},
    {paths: [...retrieveData(chains, 'value', 1)]},
];

export {inhabitantsDB, goodsDB, data};