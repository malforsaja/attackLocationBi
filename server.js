const express = require('express')
var router = express.Router();

const http = require('http')
const bodyParser = require('body-parser')
var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var ipLoc = require('./router')

app.use('/', ipLoc)

const port = 3000
const server = http.createServer(app)

server.listen(port, () => console.log(`Running on localhost:${port}`))