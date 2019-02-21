const request = require('request');
const cheerio = require('cheerio');
var staredRestos = [];

const staredRestaurants = function() {
    return new Promise(async (resolve, reject) => {
        var compteur = 0;
        for(var x = 1; x < 339; x++) {
            var url = 'https://restaurant.michelin.fr/restaurants/france/page-' + x;
            await restosPage(url);
            compteur++;
            if(compteur == 338) {
                resolve(staredRestos);
            }
        }
    })
}

function restosPage (url) {
    return new Promise(async (resolve, reject) => {
        var compteur = 0;
        var restos = [];
        request(url, function (err, res, body) {
            if (res.statusCode == 200) { 
                compteur++;
                var $ = cheerio.load(body);
                $('body').find('.ds-1col').each(function (index, element) {
                    const temp = cheerio.load(element);
                    const div = temp('span').attr('class');
                    const name = $(element).attr('attr-gtm-title');
                    if (typeof(div) != "undefined") {
                        if (div.includes('icon-cotation1etoile') || div.includes('icon-cotation2etoiles') || div.includes('icon-cotation3etoiles')) {
                            staredRestos.push(name);
                        }
                    }
                });
            }
            else {
                compteur++;
            }
            if (compteur == 1) {
                resolve();
            }
        });
    })
}

module.exports = staredRestaurants;