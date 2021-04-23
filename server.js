var fs = require('fs');
 var PeerServer = require('peer').PeerServer;

var options = {
  key: fs.readFileSync('key/server.key'),
  cert: fs.readFileSync('key/server.crt')
}

var server = PeerServer({
  port: 9000,
  ssl: options,
  path:"/"
});

/** 构建html页 */
var https = require('https');
var serveIndex = require('serve-index');
var express = require("express");       
var htmlApp = express();
htmlApp.use(serveIndex('./build'));
htmlApp.use(express.static("./build"))
var httpsServer = https.createServer(options, htmlApp);
httpsServer.listen(8000, "0.0.0.0");

