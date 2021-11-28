var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express


 // pour obtenir des informations sur l'exécution
                   // des requêtes SQL (utile pour le débug)
/* 
app.get('/*', function(req, res) {
    console.log(req.url);
    res.sendFile(__dirname + req.url);
});
 */




var config = {
 "ville": {
    "nom": "Gif-sur-Yvette",
    "pays": "Fr"
    },
  "temp": {
    "unite": 0,
    "state": 1
    },
 "pression": {
    "unite": 0,
    "state": 0
 },
 "nuage": {
    "visib": {
       "unite": 1,
       "state": 0
    },
    "status": 0
 },
 "vent": {
    "unite": 1,
    "state": 1
 }
}






app.get('/set', function(req, res) {
  // Mise à jour de la variable config
  if(req.query.ms == undefined){config.vent.unite=1;}
  if(req.query.kmh == undefined){config.vent.unite=0;}
  else{config.vent.unite=1;}
  if(req.query.celsius !== undefined){config.temp.unite=0;}
  if(req.query.fahrneit !== undefined){config.temp.unite=1;}
  if(req.query.kelvin !== undefined){config.temp.unite=2;}



  if(req.query.tempc !== undefined){config.temp.state=0;}
  if(req.query.tempc == undefined){config.temp.state=1;}
  if(req.query.visc !== undefined){config.nuage.visib.state=0;}
  if(req.query.visc == undefined){config.nuage.visib.state=1;}
  if(req.query.vitc !== undefined){config.vent.state=0;}
  if(req.query.vitc == undefined){config.vent.state=1;}
  if(req.query.couvc !== undefined){config.nuage.status=0;}
  if(req.query.couvc == undefined){config.nuage.status=1;}

  if(req.query.gif !== undefined){config.ville.nom="Gif-sur-Yvette";}
  if(req.query.paris !== undefined){config.ville.nom="Paris";}
  if(req.query.palaiseau !== undefined){config.ville.nom="Palaiseau";}
  if(req.query.orsay !== undefined){config.ville.nom="Orsay";}
  if(req.query.gif == undefined && req.query.paris == undefined && req.query.palaiseau == undefined && req.query.orsay == undefined ){
  config.ville.nom = req.query.ville;
  }

  
  // Redirigez vers config.html
  res.redirect("/index.html");
});




app.get('/config', function(req, res) {
res.json(config);
});

app.get('/*', function(req, res) {
  console.log(req.url);
  if (req.url == "/") {
    res.sendFile(__dirname + "/index.html");
  } else {
    res.sendFile(__dirname + req.url);
  }
});










app.listen(8000); //commence à accepter les requêtes
console.log("App listening on port 8000...");
console.log(config.ville.nom)


