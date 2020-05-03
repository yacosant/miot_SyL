//Funciones SCRUD contra mongo

//var config = require('../models/shodan.js');
const util  = require('util');
const client = require('shodan-client');
var config = require('./../config.json');

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


