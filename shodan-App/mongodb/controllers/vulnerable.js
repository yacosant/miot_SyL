//Funciones SCRUD contra mongo

var config = require('../models/vulnerable.js');

exports.getAll = function (req, res) {
    config.find({
        
    }, function (err, config) {
        if (err)
            res.send(err)
        res.json(config);
        console.log("loading vulnerables ");
    })
}

//Pendiente de implementar busquedas concretas. 
//->>comprobar si el _id se obtiene en los persons de getAll.

exports.get = function (req, res) {
    config.find({
        "_id": req.params.id
    }, function (err, config) {
        if (err)
            res.send(err)
        res.json(config);
    })
}


exports.create = function (req, res) {
    console.log("Vulnerable"+req.body.ip_str + "registrada");
    var data = new config(req.body);

    data.save(function (err) {
        if (err) throw err;
    })

    res.json({ message: 'Data Created!' });
}

exports.createMany = function (req, res) {
    console.log("Vulnerables registrados");

    config.insertMany(arr, function(error, docs) {});

    res.json({ message: 'Vulnerables registrados!' });
}

