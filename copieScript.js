function cacheTout(){
  $(".contenant").each(function(){
    $(this).hide();
  })
}




function montre(tab){
  for(i in tab){
    var string = "#" + tab[i]
    $(string).each(function(){
    $(this).show();
  })
  }
}


var villeCourante = {
    nom : "Gif-sur-Yvette",
    pays: "Fr"
} 


var unitesPossibles = {
  temp : ["degrés", "F", "K"],
  vent : ["km/h", "m/s"],
};


var unitesChoisies = {
  temp : 0,
  vent : 1
};


var valeursCourantes = {
  temp : 12,
  vent : 40
};

function afficher(){
$("#vtemp").find(".contenu").text(valeursCourantes.temp);
$("#vvent").find(".contenu").text(valeursCourantes.vent);
$("#ville").text(villeCourante.nom);
if(unitesChoisies.temp == 1){
  var tf = valeursCourantes.temp*(9/5)+32;
  $("#vtemp").find(".contenu").text(tf);
  $("#vtemp").find(".unite").text(unitesPossibles.temp[1]);
}
if(unitesChoisies.temp == 2){
  var tk = valeursCourantes.temp+273.15;
  $("#vtemp").find(".contenu").text(tk);
  $("#vtemp").find(".unite").text(unitesPossibles.temp[2]);
}
if(unitesChoisies.vent == 1){
  var ms = valeursCourantes.vent/3.6;
  $("#vvent").find(".contenu").text(ms);
  $("#vvent").find(".unite").text(unitesPossibles.vent[1]+" ");
}
};



function litDonnees(callback){
  $.ajax({
    url: "fichier.xml",dataType: "xml",
    type: "GET",
    error: function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
    success: function(xmlDocument) {
       // Fait quelque chose avec la variable xmlDocument
       // Rappel: il s'agit d'un objet DOM !
      var t = $(xmlDocument).find("temp").text();
      valeursCourantes.temp = t;
      var v = $(xmlDocument).find("vent").text();
      valeursCourantes.vent = v;
      afficher();
      callback();






    }
  });
}


function cache(s){
var string = "#" + s;
$(string).hide();
}


function litConfig(callback){
  $.ajax({
    url: "/config",dataType:"json",
    type:"GET",
    error:function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
    success:function(jsonDocument){
      const configstring = JSON.stringify(jsonDocument);
      const config = JSON.parse(configstring);
      unitesChoisies.temp = config.temp.unite;
      unitesChoisies.vent= config.vent.unite;
      if(config.temp.state == 0){
        cache("temp");
        cache("vtemp");
        
      }
      if(config.vent.state == 0){
        cache("vent");
        cache("vvent");
      }
      if(config.nuage.visib.state == 0){
        cache("vis");
        cache("vvis");
      }
      if(config.nuage.status == 0){
        cache("couv");
        cache("vcouv");
      }
      if(config.temp.state == 1){
        montre(["temp","vtemp"]);
        
      }
      if(config.vent.state == 1){
        montre(["vent","vvent"]);
      }
      if(config.nuage.visib.state == 1){
        montre(["vis","vvis"])
      }
      if(config.nuage.status == 1){
        montre(["couv","vcouv"])
      }






      afficher();
      callback();







  }
  });
}





function litDonneesweb(callback){
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    data: { 
      q: villeCourante.nom+","+villeCourante.pays, 
      appid: "612d325e0f8d067f7aceeac5844400f0",
      lang : "fr",
      units : "metric"
    },
    dataType: "json",
    type: "GET",
    error: function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
    success: function(ville) {
       // Fait quelque chose avec la variable xmlDocument
       // Rappel: il s'agit d'un objet DOM !
       
      var t = ville.main.temp;
      valeursCourantes.temp = t;
      var v = ville.wind.speed;
      valeursCourantes.vent = v*3.6;
      var icon = "#"+"icon";
      $(icon).attr("src","http://openweathermap.org/img/wn/"+ville.weather[0].icon + "@2x.png")
      $(icon).css("display","block");
      $(icon).css("margin-left","auto");
      $(icon).css("margin-right","auto");
      

var linkicon="http://openweathermap.org/img/wn/"+ville.weather[0].icon + "@2x.png";





      var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var lat = ville.coord.lat;
  var lon = ville.coord.lon;
  var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

  $("#uneJoliCarte").empty();
  map = new OpenLayers.Map("uneJoliCarte");
  var mapnik = new OpenLayers.Layer.OSM();
  map.addLayer(mapnik);

  var size = new OpenLayers.Size(70, 50);
  var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
  var icon = new OpenLayers.Icon(linkicon, size, offset);

  var marker = new OpenLayers.Marker(position, icon.clone());

  var markers = new OpenLayers.Layer.Markers();
  map.addLayer(markers);
  markers.addMarker(marker);

  var zoom = 10;
  map.setCenter(position, zoom);


  


      afficher();
      callback();

      



    }
  });
}


function description(){
$.ajax({
  url : "https://fr.wikipedia.org/w/api.php",
  data:{
    format:"xml",
    origin : "*",
    action : "query",
    prop : "extracts",
    exintro : "",
    explaintext : "",
    titles:villeCourante.nom,
  },
  dataType : "xml",
  type:"GET",
  error: function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
  success:function(xmlDocument){
    var t = $(xmlDocument).find("extract").text();
    console.log(t);
      $("#descriptionville").text(t);
    
      
  }

})
}

function ville(callback){
  $.ajax({
    url: "/config",dataType:"json",
    type:"GET",
    error:function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
    success:function(jsonDocument){
      const configstring = JSON.stringify(jsonDocument);
      const config = JSON.parse(configstring);
      villeCourante.nom = config.ville.nom;
      villeCourante.pays = config.ville.pays;
      unitesChoisies.temp= config.temp.unite;
      unitesChoisies.vent= config.vent.unite;
      
      
      if(config.temp.state == 0){
        cache("temp");
        cache("vtemp");
        
      }
      if(config.vent.state == 0){
        cache("vent");
        cache("vvent");
      }
      if(config.nuage.visib.state == 0){
        cache("vis");
        cache("vvis");
      }
      if(config.nuage.status == 0){
        cache("couv");
        cache("vcouv");
      }
      if(config.temp.state == 1){
        montre(["temp","vtemp"]);
        
      }
      if(config.vent.state == 1){
        montre(["vent","vvent"]);
      }
      if(config.nuage.visib.state == 1){
        montre(["vis","vvis"])
      }
      if(config.nuage.status == 1){
        montre(["couv","vcouv"])
      }
      afficher();
      callback();
    }

  })
}




ville(function(){
  litDonneesweb(function(){
    description();
  });

});


function remplissage(){
$.ajax({
    url: "/config",dataType:"json",
    type:"GET",
    error:function(jqXHR, textStatus, errorThrown) { console.log(errorThrown + " : " + textStatus); },
    success:function(jsonDocument){
      const configstring = JSON.stringify(jsonDocument);
      const config = JSON.parse(configstring);
      if (config.ville.nom=="Gif-sur-Yvette"){
    $("[name=gif]").attr("checked", true);
  }
        if (config.ville.nom=="Paris"){
    $("[name=paris]").attr("checked", true);
  }
        if (config.ville.nom=="Palaiseau"){
    $("[name=palaiseau]").attr("checked", true);
  }
        if (config.ville.nom=="Orsay"){
    $("[name=orsay]").attr("checked", true);
  }
  if(config.vent.unite==0){
    $("[name=kmh]").attr("checked", true);

  }
   if(config.vent.unite==1){
    $("[name=ms]").attr("checked", true);

  }
   if(config.temp.unite==0){
    $("[name=celsius]").attr("checked", true);

  }
   if(config.temp.unite==1){
    $("[name=fahrneit]").attr("checked", true);

  }
  if(config.temp.unite==2){
    $("[name=kelvin]").attr("checked", true);

  }
if(config.temp.state==1){
    $("[name=tempc]").attr("checked", false);

  }
  if(config.temp.state==0){
    $("[name=tempc]").attr("checked", true);

  }
  if(config.vent.state==1){
    $("[name=vitc]").attr("checked", false);

  }
  if(config.vent.state==0){
    $("[name=vitc]").attr("checked", true);

  }
  if(config.nuage.status==1){
    $("[name=couvc]").attr("checked", false);

  }
  if(config.nuage.status==0){
    $("[name=couvc]").attr("checked", true);

  }
  if(config.nuage.visib.state==1){
    $("[name=visc]").attr("checked", false);

  }
  if(config.nuage.visib.state==0){
    $("[name=visc]").attr("checked", true);

  }

afficher();
     
    }

  })




  
}





var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.8566, lng: 2.3522},
      zoom: 8
    });

    var geocoder = new google.maps.Geocoder();

    map.addListener('click', (event) => {
      geocoder.geocode({
        location: event.latLng,
      }, (results, status) => {
        if(status === 'OK') {
            if(results && results.length) {
                var filtered_array = results.filter(result => result.types.includes("locality")); 
                var addressResult = filtered_array.length ? filtered_array[0]: results[0];

                if(addressResult.address_components) {
                    addressResult.address_components.forEach((component) => {
                        if(component.types.includes('locality')) {
                            console.log(component.long_name);
                            $("[name=ville]").attr("value",component.long_name);
      
                        }
                    });
                }
            }
        }
    });
  });
} 

function table(jour,ind){
  $('.jour').each(function(){
    $(this).hide();
  })
  $('.contenant').each(function(){
    $(this).hide();
  })

  var template ="auto "; 
  for (i in jour){
    template += "auto "
  }

  $(".wrapper").css("grid-template-columns",template)

  for(i in jour){
    $(jour[i]).each(function(){
    $(this).show();
  })
  }
  for(i in ind){
    $(ind[i]).each(function(){
    $(this).show();
  })

  }
  var jourComp =['.Ajd','.Demain','.2jours'];
  var indComp = ['.tempTab','.couvTab','.ventTab','.visTab'];

  for(i in jourComp){
    if(jour.includes(jourComp[i])){}
    else {$(jourComp[i]).each(function(){
    $(this).hide();
  })}
  }

  for(i in indComp){
    if(ind.includes(indComp[i])){}
    else {$(indComp[i]).each(function(){
    $(this).hide();
  })}
  }

  
}








remplissage();




console.log(villeCourante.pays);

