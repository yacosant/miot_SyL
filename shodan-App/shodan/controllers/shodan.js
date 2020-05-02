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
        console.log("loading persons ");
    })
}

//Pendiente de implementar busquedas concretas. 
//->>comprobar si el _id se obtiene en los persons de getAll.

exports.get = function (req, res) {
    const searchOpts = {
        fields: 'ip_str,port,org,hostnames',
        facets: 'port:100,country:100',
        minify: true,
      };

      client
        .search('luci country:ES', config.SHODANAPIKEY, searchOpts)
        .then(res1 => {
          console.log('Search');
          //console.log(util.inspect(res, { depth: 6 }));
          //res.json(util.inspect(res1, { depth: 6 }));
          res.json(res1);
          tam= res1.matches.length;
          var array=[];
          for(var i=0; i<tam; i++){
            toBD = {}
            toBD.ip= res1.matches[i].ip;
            toBD.ip_str= res1.matches[i].ip_str;
            toBD.port= res1.matches[i].port;
            toBD.isp= res1.matches[i].isp;
            toBD.timestamp_shodan= res1.matches[i].timestamp_shodan;
            toBD.tried = false;
            toBD.vulnerable = false;
            array.push(toBD);
          }
          console.log('Formateo Hecho');
          ObjectData.insertMany(array, function(error, docs) {});
          console.log('Array insertado en Mongo');
        })
        .catch(err => {
          console.log('Error:');
          console.log(err);
        });
}

exports.create = function (req, res) {
    console.log("Persona registrada");
    var person = new config(req.body);

    person.save(function (err) {
        if (err) throw err;
    })

    res.json({ message: 'Person Created!' });
}

