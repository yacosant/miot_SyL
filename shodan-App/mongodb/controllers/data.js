//Funciones SCRUD contra mongo

var config = require('../models/data.js');

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
    config.find({
        "_id": req.params.id
    }, function (err, config) {
        if (err)
            res.send(err)
        res.json(config);
    })
}

// no creo que se debiese poder modificar una denuncia.
exports.update = function (req, res) {
}

exports.delete = function (req, res) {
    config.remove({
        "_id": req.params.id
    }, function (err, config) {
        if (err)
            res.send(err)
        console.log("eliminado");
    })
}

exports.create = function (req, res) {
    console.log("Data registrada");
    var data = new config(req.body);

    data.save(function (err) {
        if (err) throw err;
    })

    res.json({ message: 'Data Created!' });
}

exports.createMany = function (req, res) {
    console.log("Data registrada");

    config.insertMany(arr, function(error, docs) {});

    res.json({ message: 'Data Created!' });
}

