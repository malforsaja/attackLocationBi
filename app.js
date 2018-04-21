// use onefirewall public API to get IPs
var geoip = require('geoip-lite'),
    request = require('request'),
    _ = require('underscore'),
    options = {
        url: 'https://app.onefirewall.com/api/v1/ips',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cyI6MTUyMTY2OTMwOSwiZ3VpZCI6Ik9GQS1HVUlELTM3OTMtNjI1NC0xODkyIiwidG9rZW4iOiJ3c2FqMEM3Mk1aREpPQ2xGIiwiaWF0IjoxNTIxNjY5MzA5fQ.fdU6fIrUjCZbio43NqMHMMVQ0SloIZUln4nMyfjkf-8'
        }
    };

var getIPs_onefirewall = function (callback) {
    request(options, function (error, response) {
        //extract IPs from the response
        var str = response.body,
            IPv4_regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
            ip_list = str.match(IPv4_regexp);

        callback(extractedLocatedIPs(ip_list));
    });
};

function extractedLocatedIPs(ip_list) {
    var notLocatedIPs = 0,
        ip_listForMap = [];

    _.map(ip_list, function (item) {
        var geo = geoip.lookup(item);

        if (geo == null) {
            //console.log('notLocatedIP  ' + item);
            notLocatedIPs++;
        } else {
            ip_listForMap.push({
                lat: geo.ll[0],
                lng: geo.ll[1]
            });
        }
    });
    //console.log('Total notLocatedIPs  ' + notLocatedIPs);
    return ip_listForMap;
};

getIPs_onefirewall(
    function callback(ip_listForMap) {
        //console.log(JSON.stringify(ip_listForMap));
    });

var getIPLocation = (req, res) => {
    var options = {
        url: 'https://app.onefirewall.com/api/v1/ips',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cyI6MTUyMTY2OTMwOSwiZ3VpZCI6Ik9GQS1HVUlELTM3OTMtNjI1NC0xODkyIiwidG9rZW4iOiJ3c2FqMEM3Mk1aREpPQ2xGIiwiaWF0IjoxNTIxNjY5MzA5fQ.fdU6fIrUjCZbio43NqMHMMVQ0SloIZUln4nMyfjkf-8'
        }
    };
    //extract IPs from the response
    function callback(error, response) {
        //extract IPs from the response
        var objectRes = JSON.parse(response.body).body
        let ip_and_score = [];

        // iterate through an array of objects
        objectRes.forEach(function (keys) {
            //console.log(keys.score)
            ip_and_score.push({ip: keys.ip, score: keys.score})
        });
        //console.log(ip_and_score);
        
        var str = response.body,
            IPv4_regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
            ip_list = str.match(IPv4_regexp);
        //console.log(ip_list)

        var notLocatedIPs = 0;
        var ip_listForMap = [];
        for (let i = 0; i < ip_list.length; i++) {
            var geo = geoip.lookup(ip_list[i]);
            //console.log(geo)
            if (geo == null) {
                console.log('notLocatedIP  ' + ip_list[i]);
                notLocatedIPs++;
            } else {
                ip_listForMap.push({
                    lat: geo.ll[0],
                    lng: geo.ll[1]
                });
            }
        }
        console.log('Total notLocatedIPs  ' + notLocatedIPs);
        res.status(200).json({iploc: ip_listForMap, ipscores: ip_and_score});
    };

    request(options, callback)
}

module.exports = {
    getIPLocation
}