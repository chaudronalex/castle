const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.relaischateaux.com/fr/update-destination-results';
const {hotelId, restaurantLink, restaurantName, price} = require('./properties');
var hotelsWithStarredRestaurants = [];
const staredRestaurantsMichelin = require('./michelin');
var staredRestaurants = [];

async function printPrices() {
  staredRestaurants = await staredRestaurantsMichelin();
  console.log("HOTELS WITH STARRED RESTAURANTS :")
  for(var x = 1; x < 8; x++)
  {
	  const options = {
        url: url,
        headers: { 
          'Host': 'www.relaischateaux.com', 
          'Connection': 'keep-alive', 
          'Content-Length': 16, 
          'Accept': '/*', 
          'Origin': 'https://www.relaischateaux.com', 
          'X-Requested-With': 'XMLHttpRequest', 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36', 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 
          'Referer': '://www.relaischateaux.com/fr/destinations/europe/france', 
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7', 
          'Cookie': 'favoriteLanguage=en_US; device_view=full; _ga=GA1.2.721263744.1548084077; __utmz=179322407.1548084078.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); rc_cnil=%7B%22googleAnalytics%22%3Atrue%2C%22rtbMakazi%22%3Atrue%2C%22twitterAds%22%3Atrue%2C%22adwords%22%3Atrue%2C%22cloudfront%22%3Atrue%2C%22yahoo%22%3Atrue%2C%22makazi%22%3Atrue%2C%22doubleClick%22%3Atrue%2C%22twitter%22%3Atrue%2C%22facebook%22%3Atrue%2C%22linkedin%22%3Atrue%2C%22pinterest%22%3Atrue%2C%22gplus%22%3Atrue%2C%22piksel%22%3Atrue%2C%22googleMaps%22%3Atrue%2C%22bookatable%22%3Atrue%2C%22abTasty%22%3Atrue%7D; _ni=19012116220285894; pa-session=c2cee0421481d2001e2a0e9856953b822cdc8d96; pa-user=d56a54a99f4cd8cfbc7e5c73c7b547196ef17b20; _gid=GA1.2.2095484987.1548685516; PHPSESSID=7cd5dea24914e82c96eaf4ed5a862dbf; _sp_ses.1d1b=*; __utma=179322407.721263744.1548084077.1548685517.1548688085.5; __utmc=179322407; __utmt_UA-49756601-1=1; __utmb=179322407.2.10.1548688085; _sp_id.1d1b=94f0291b-039b-412e-b667-824fe60a34ee.1548084122.5.1548688456.1548685517.fe795a88-a58f-44f5-968c-fac80bc958c2; ABTasty=uid%3D19012116220285894%26fst%3D1548084122176%26pst%3D1548685516990%26cst%3D1548688084547%26ns%3D5%26pvt%3D23%26pvis%3D2%26th%3D109957.154594.1.0.5.0.1548084122185.1548084122185.1_118878.166572.27.2.5.1.1548084122217.1548688455807.1_179024.247045.27.2.5.1.1548084122223.1548688455814.1_201390.276412.27.2.5.1.1548084122227.1548688455819.1_245086.329413.2.0.5.0.1548084868419.1548085005601.1_277428.369812.1.0.5.0.1548084791555.1548084791555.1_369423.477604.15.1.5.0.1548084772240.1548688084594.1; ABTastySession=sen%3D9__referrer%3D__landingPage%3Dhttps%3A//www.relaischateaux.com/fr/destinations/europe/france__referrerSent%3Dtrue; _gat_UA-48266488-34=1; _gat_UA-59289041-3=1' 
        },
        form: { 
          page: x, 
          areaId: 78 
        }
    };

    request.post(options, function(err, res, body) {
      const temp = JSON.parse(body);
      const $ = cheerio.load(temp.html);
      $('div').find('.mainTitle3').each(async function (index, element) {
          if (element != null) {
              const a = cheerio.load(element);
              var hotelLink = a('a').attr('href');
              var hotelName = a('a').text();
              var id = await hotelId(hotelLink);
              var hotelRestaurantLink = await restaurantLink(hotelLink);
              var hotelStaredRestaurantName = await restaurantName(hotelRestaurantLink, staredRestaurants);
              var hotelWithStarredRestaurantPrice = 0;
              if (id != 0 && hotelStaredRestaurantName != "") {
                hotelWithStarredRestaurantPrice = await price(id, '2019-02', '8');
                if (hotelWithStarredRestaurantPrice != "") {
                  hotelsWithStarredRestaurants.push(hotelName);
                  console.log("Name of the hotel : " + hotelName);
                  console.log("Name of the stared restaurant : " + hotelStaredRestaurantName);
                  console.log("Price for the 08/02/2019 : " + hotelWithStarredRestaurantPrice + '€\n');
                }               
              }
          }
      });
    });
  }
}

printPrices();