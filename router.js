var express = require('express');
var router = express.Router();

var ipLoc = require('./app')
router.get('/getiploc', ipLoc.getIPLocation)

module.exports = router;