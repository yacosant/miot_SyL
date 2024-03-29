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
var ObjectVulnerable = require('../../mongodb/models/vulnerable.js');


//Pendiente de implementar busquedas concretas. 
//->>comprobar si el _id se obtiene en los persons de getAll.

exports.get = function (req, res) {
  var filtro =config.filtro;
    const searchOpts = {
        //facets: 'port:100,country:100',
        minify: true,
      };

      client
        .search(filtro, config.SHODANAPIKEY, searchOpts)
        .then(res1 => {
          console.log('[SHODAN]Buscando');
          
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
            toBD.type=filtro;
            //toBD.test=false;
            array.push(toBD);
          }
          res.json(array);
          console.log('[SHODAN]Formateo Hecho');
          ObjectData.insertMany(array, function(error, docs) {});
          console.log('[SHODAN]Array insertado en Mongo');
        })
        .catch(err => {
          console.log('[SHODAN]Error:');
          console.log(err);
        });
}


checkURL = function (ip, port, user, pass){

  Browser.localhost('https://'+ip+'/cgi-bin/luci', port);
  const browser = new Browser();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Para poder acceder a https autofirmados
  browser.visit('https://'+ip+'/cgi-bin/luci', function() {

    console.log(browser.html());
    browser.fill('input[name=luci_username]', user);
    browser.fill('input[name=luci_password]', pass);

    browser.pressButton('Login', function() {
    if(browser.text('title')=='myCi40 - Overview - LuCI'){
      console.log('[GET_WEB]Dentro! Ha accedido a '+ip);
      return true;      
    }    
      return false;
    });
  });

}

exports.play = function (req, res) {
  var lista;
  var cont=0;
  var listaVuln= [];
  var form= req.body.form;

  ObjectData.find({'test': 'true' //, 'tried': 'false',  type!!!
  }, function (err, config) {
      if (err)
          res.send(err)
      lista =config;
      console.log("[PLAY] Cargados dispositivos para escanear");
 

  for(i=0; i<lista.length; i++){

    objeto = lista[i];
    
    console.log("[PLAY] Probando:"+objeto.ip_str); //debug

    if(checkURL(objeto.ip_str, objeto.puerto,form.user, form.pass)){
      cont++;
      //actualizar dispostivo
      objeto.vulnerable=true;
      
      //generar vulnerable
      var vuln= {}
      vuln.ip = objeto.ip;
      vuln.ip_str = objeto.ip_str;
      vuln.port = objeto.port;
      vuln.id_device = objeto._id;
      vuln.type = objeto.type;
      vuln.user = form.user;
      vuln.pass = form.pass;
      console.log(vuln);
      listaVuln.push(vuln);
    }

    objeto.tried=true;
    objeto.save(function (err, objeto) {
        if (err) return console.error(err);
        console.log("[PLAY]"+objeto.ip_str + " actualizado");
    });
  }

  ObjectVulnerable.insertMany(listaVuln);

  respuesta = {}
  respuesta.code = 'ok';
  respuesta.type= req.body.type;
  respuesta.num=  cont;
  console.log(lista[0]);
  
  res.json(respuesta);
  });
}

