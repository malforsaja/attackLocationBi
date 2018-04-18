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
            ip_list = str.match(IPv4_regexp),
            notLocatedIPs = 0,
            ip_listForMap = [];

        _.map(ip_list, function (item) {
            var geo = geoip.lookup(item);
            if (geo == null) {
                console.log('notLocatedIP  ' + item);
                notLocatedIPs++;
            } else {                   
                ip_listForMap.push({
                    lat: geo.ll[0],
                    lng: geo.ll[1]
                });
            }
        });
        console.log('Total notLocatedIPs  ' + notLocatedIPs);
        callback(ip_listForMap);
    });
};

getIPs_onefirewall(
    function callback (ip_listForMap) {
        console.log(JSON.stringify(ip_listForMap));
});
