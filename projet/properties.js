const request = require('request');
const cheerio = require('cheerio');

const hotelId = function(link) {
    return new Promise(async (resolve, reject) => {
        const sup = "https://www.relaischateaux.com/fr/france";
        var tempUrl = "https://www.relaischateaux.com/fr/etablissement/rooms/0" + link.substring(sup.length, link.length);
        var compteur = 0;
        var id = 0;
        request(tempUrl, function(err, res, body) {
            if (res.statusCode == 200) { 
                var $ = cheerio.load(body);
                id = $('.startEndDate').attr('data-id-entity');
                compteur++;
            }
            if (compteur == 1) {
                resolve(id);
            }
        });
    }) 
}

const restaurantLink = function(hotelLink) {
    return new Promise(async (resolve, reject) => {
        var compteur = 0;
        var restaurantLinkCastle = "";
        request(hotelLink, function(err, res, body) {
            if (res.statusCode == 200) { 
                var $ = cheerio.load(body);
                const link = $('.jsSecondNavMain').html();           
                compteur++;
                const t = cheerio.load(link);
                const p = t('li:not(.active)').html();
                $ = cheerio.load(p);
                restaurantLinkCastle = $('a').attr('href');
            }
            else {
                compteur++;
            }
            if (compteur == 1) {
                resolve(restaurantLinkCastle);
            }
        });
    })
}

const restaurantName = function(restoLink, staredRestaurants) {
    return new Promise(async (resolve, reject) => {
        var compteur = 0;
        var restoNameRet = "";
        request(restoLink, function(err, res, body) {
            if (res.statusCode == 200) { 
                var $ = cheerio.load(body);
                const temp = $('.hotelTabsHeaderTitle').html();
                compteur++;
                 if (temp != null) {
                    $ = cheerio.load(temp);
                    var restoName = $('.mainTitle2').text();
                    staredRestaurants.forEach(element => {
                        if(restoName.includes(element)) {
                            restoNameRet = restoName.trim();
                        }
                    });
                }
            }
            if(compteur == 1) {
                resolve(restoNameRet);
            }
        });
    });
}

const price = function(id, month, day) {
    return new Promise(async (resolve, reject) => {
        var price = "";
        var compteur = 0;
        const tempUrl = "https://www.relaischateaux.com/fr/search/availability/check?month=" + month + "&idEntity=" + id + "&pax=2&room=1";
        request({url:tempUrl, headers : { 'X-Requested-With' : 'XMLHttpRequest' }}, function(err, res, body) {
            if (res.statusCode == 200) { 
                compteur++;
                const json = JSON.parse(body);
                const prices = json[month].pricesPerDay;
                const priceTemp = prices[day];
                if (priceTemp != undefined) {
                    price = priceTemp.substring(3, priceTemp.length);
                }
            }
            else {
                compteur++;
            }
            if (compteur == 1) {
                resolve(price.trim());
            }
        });
    })
}

module.exports = {hotelId, restaurantLink, restaurantName, price};