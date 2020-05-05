//Funciones SCRUD contra mongo

//var config = require('../models/shodan.js');
const util  = require('util');
const client = require('shodan-client');
var config = require('./../config.json');
const request = require('request');
var https = require('https');
var querystring = require('querystring');
const Browser = require('zombie');

var ObjectData = require('../../mongodb/models/data.js');

exports.getAll = function (req, res) {
    config.find({
        
    }, function (err, config) {
        if (err)
            res.send(err)
        res.json(config);
        console.log("loading devices ");
    })
}

//Pendiente de implementar busquedas concretas. 
//->>comprobar si el _id se obtiene en los persons de getAll.

exports.get = function (req, res) {
    const searchOpts = {
        facets: 'port:100,country:100',
        minify: true,
      };

      client
        .search('luci country:ES', config.SHODANAPIKEY, searchOpts)
        .then(res1 => {
          console.log('Search');
          
          tam= res1.matches.length;
          var array=[];
          for(var i=0; i<tam; i++){
            toBD = {}
            toBD.ip= res1.matches[i].ip;
            toBD.ip_str= res1.matches[i].ip_str;
            toBD.port= res1.matches[i].port;
            toBD.isp= res1.matches[i].isp;
            toBD.pais= res1.matches[i].location.country_name;
            toBD.timestamp_shodan= res1.matches[i].timestamp;
            toBD.tried = false;
            toBD.vulnerable = false;
            array.push(toBD);
          }
          res.json(array);
          console.log('Formateo Hecho');
          ObjectData.insertMany(array, function(error, docs) {});
          console.log('Array insertado en Mongo');
        })
        .catch(err => {
          console.log('Error:');
          console.log(err);
        });
}


exports.play = function (req1, res1) {


  // We're going to make requests to http://example.com/signup
  // Which will be routed to our test server localhost:3000
  Browser.localhost('https://192.168.1.91/cgi-bin/luci', 80);
  const browser = new Browser();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  browser.visit('https://192.168.1.91/cgi-bin/luci', function() {

    /*if(browser.text('title')=="Error de privacidad"){
      browser
    .pressButton('#details-button').clickLink('#proceed-link');
    }
    document = browser.document;*/

    console.log(browser.html());
    browser
    //.fill('luci_username', 'root')
    .fill('input[name=luci_password]', 'root');

    browser.pressButton('Login', function() {
    if(browser.text('title')=='myCi40 - Overview - LuCI') console.log('Dentro!');
    
    res1.json("'ok':'ok'");
    });
  });

 /*
  describe('User visits signup page', function() {
  
    const browser = new Browser();
  
    before(function(done) {
      browser.visit('/', done);
    });
  
    describe('submits form', function() {
  
      before(function(done) {
        browser
          .fill('luci_username', 'root')
          .fill('luci_password', 'root')
          .pressButton('Login', done);
      });
  
      it('should be successful', function() {
        browser.assert.success();
      });
  
      it('should see welcome page', function() {
        browser.assert.text('title', 'myCi40 - Overview - LuCI');
        res1.json("'ok':'ok'");
      });
    });
    console.log("finish");
  });*/

}


exports.play3 = function (req1, res1) {
  

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        // form data
        var postData = "luci_username=root&luci_password=root";/*querystring.stringify({
          luci_username: "root",
          luci_password: "root"
        });*/
        
        // request option
        /*
        var options = {
          host: 'http://192.168.1.91/cgi-bin/luci/',
          port: 80,
          method: 'POST',
          path: '/',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
          }
        };*/
        var options = {
          'method': 'POST',
          'url': 'https://192.168.1.91/cgi-bin/luci/',
          //port: 80,
          headers: {
            'Host': '192.168.1.91',
            'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
            'Accept': ' text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': ' es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': ' gzip, deflate, br',
            'Content-Type': ' application/x-www-form-urlencoded',
            'Content-Length':  Buffer.byteLength(postData),//' 37',
            'Origin': 'https://192.168.1.91',
            'DNT': ' 1',
            'Connection': ' keep-alive',
            'Upgrade-Insecure-Requests': ' 1',
            'Pragma': ' no-cache',
            'Cache-Control': ' no-cache'
            },rejectUnauthorized: false
          };
        
        // request object
        var req = https.request(options, function (res) {
          var result = '';
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

          console.log('statusCode:', res.statusCode);
          console.log('statusCode: ${res.statusCode}');
          console.log('headers:', res.headers);

          res.on('data', function (chunk) {
            result += chunk;
          });
          res.on('end', function () {
            console.log(result);
          });
          res.on('error', function (err) {
            console.log(err);
          })
        });
        
        // req error
        req.on('error', function (err) {
          console.log(err);
        });
        
        //send request witht the postData form
        //req.write(postData);
        //req.end();
          
        res1.json(postData);
        console.log("finish");
          
          
  
   

}