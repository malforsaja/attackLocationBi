// use onefirewall public API to get IPs
var geoip = require('geoip-lite');
var request = require('request');

var getIPs_onefirewall = (req, res) => {

    var options = {
        url: 'https://app.onefirewall.com/api/v1/ips',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cyI6MTUyMTY2OTMwOSwiZ3VpZCI6Ik9GQS1HVUlELTM3OTMtNjI1NC0xODkyIiwidG9rZW4iOiJ3c2FqMEM3Mk1aREpPQ2xGIiwiaWF0IjoxNTIxNjY5MzA5fQ.fdU6fIrUjCZbio43NqMHMMVQ0SloIZUln4nMyfjkf-8'
        }
    };

    function callback(error, response) {
        //extract IPs from the response
        var str = response.body
        var IPv4_regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
        var ip_list = str.match(IPv4_regexp);


        //var ip = "185.200.212.102";
        var notLocatedIPs = 0;
        for (let i = 0; i < ip_list.length; i++) {
            var geo = geoip.lookup(ip_list[i]);
            if (geo === null) {
                //list ip that are not mapped to an address
                console.log(ip_list[i])
                notLocatedIPs++;
            } else {                   
                //console.log({lat: geo.ll[0], lng: geo.ll[1]});
            }
            
        }
        //console.log('Number of IPs not converted to locations: ' + notLocatedIPs)
        //console.log(ip_list);
    }
    //callback(createMyJson())
    request(options, callback)
}

function createMyJson(validElements) {
    var arrayList = [],
        resp = JSON.parse(validElements),
        result = resp.result;

    for (var key in result) {
        arrayList.push({
            ip: result[key]
        });
    }
    return arrayList;
};

// array of IPs question
// I want to insert in an array the result of getIPs_onefirewall() function ...
getIPs_onefirewall();


// uses database but it's limited to 99.255.255.255
// to test this module please download the file IP2Location DB24 Sample Bin File from https://www.ip2location.com/developers/nodejs 
/* var ip2loc = require("ip2location-nodejs");
 
//ip2loc.IP2Location_init("./IP-COUNTRY-REGION-CITY-LATITUDE-LONGITUDE-ZIPCODE-TIMEZONE-ISP-DOMAIN-NETSPEED-AREACODE-WEATHER-MOBILE-ELEVATION-USAGETYPE-SAMPLE.BIN");
 
testip = ['8.8.8.8', '88.70.10.10', '185.200.212.102'];
for (var x = 0; x < testip.length; x++) {
    result = ip2loc.IP2Location_get_all(testip[x]);
    for (var key in result) {
        //console.log(key + ": " + result[key]);
    }
} */


// get's all the location not precise but will be deprecated on 1st July
/* var iplocation = require('iplocation')

iplocation('185.200.212.102')
    .then(res => {
        //console.log(res)
        //console.log(res.latitude + ' ' + res.longitude)
    })
    .catch(err => {
        console.error(err)
    }) */

//get the following information about IPs, doesn't include exact position like street address 
/* var where = require('node-where');
 
where.is('202.181.4.0', function(err, result) {
  if (result) {
    console.log('City: ' + result.get('city'));
    console.log('State / Region: ' + result.get('region'));
    console.log('State / Region Code: ' + result.get('regionCode'));
    console.log('Zip: ' + result.get('postalCode'));
    console.log('Country: ' + result.get('country'));
    console.log('Country Code: ' + result.get('countryCode'));
    console.log('Lat: ' + result.get('lat'));
    console.log('Lng: ' + result.get('lng'));
  }
}); */
