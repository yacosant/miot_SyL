var express  = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var config = require('./config.json');

//**App uses this modules from parse the petitions*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//*************************//
//MONGODB CONNECTION CONFIG//
//*************************//

//CONNECTION WITH MONGODB PREFERENCES DATABASE
mongoose.connect(
  "mongodb+srv://"+config.mongoUser + ":"+ config.mongoPass + "@"+ config.mongoUrl,
  function(err) {
    //callback error
    if (err) throw err;
  },
  config.mongoOptions
); //options

//CATCH MONGODB EXCEPTION BEFORE CONNECTION
var db = mongoose.connection;
db.on("error", function(err) {
  console.log("[MONGO]connection error: %s", err);
  mongoose.disconnect();
  process.exit();
});
db.once("open", function() {
  console.log("[MONGO]Successfully connected to mongodb");
  app.emit("dbopen");
});
require("./mongodb/routes.js")(app);
require("./shodan/routes.js")(app);
//******************END MONGODB****************//


//***********************************************//
//*********************ROUTING*******************//
//***********************************************//

app.use("/public", express.static("public")); //->Ponemos un directorio virtual llamado 'public' en el que están todos nuestros contenidos
//estaticos, los cuales se encuentran en app/public

app.get("/", function(req, res) {
  //Renderizamos el index cuando nos encontremos en la pagina de inicio '/'
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/list", function(req, res){
  res.sendFile(__dirname + "/public/site/list-data.html");
});

app.get("/get", function(req, res){
  res.sendFile(__dirname + "/public/site/get-shodan.html");
});

app.get("/play", function(req, res){
  res.sendFile(__dirname + "/public/site/play.html");
});

//POSTs
app.post("*", function (req, res) {});



//***********************************************//
//*********************EJECUTION*****************//
//***********************************************//
http.Server(app).listen(80);
console.log("[SERVER]Corriendo Servidor en: HTTP en 80.");


//***********************************************//
//*********************CLOSE*********************//
//***********************************************//
//Para cerrar la conexion con la BD y que no quede abierta.

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
    mongoose.disconnect();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
