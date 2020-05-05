
function createBool(op){
  celda = document.createElement("td");
    textoCelda = document.createElement('a');

    var a=document.createElement('i');
    if(op==true){
      a.className="fa fa-check-circle";
      a.style="color: green";
    } 
    else if (op==false){
      a.className="fa fa-times-circle";
      a.style="color: red";
    }
    else if(op==2){
      a.className="fa fa-question-circle";
      a.style="color: black";
    }
    textoCelda.appendChild(a);

    celda.appendChild(textoCelda);
    return celda;
}


createRow = function(i){
  var row = document.createElement("tr");
  row.id="row";
  row.num=i;

    var celda = document.createElement("th");
    var textoCelda = document.createTextNode(i+1);
    celda.appendChild(textoCelda);
    row.appendChild(celda);


    celda = document.createElement("td");
    textoCelda = document.createElement('a');
    textoCelda.href  = "http://"+devices[i].ip_str +":"+ devices[i].port;
    textoCelda.target="_blank";

    var a=document.createTextNode(devices[i].ip_str);
    textoCelda.appendChild(a);

    celda.appendChild(textoCelda);
    row.appendChild(celda);

    celda = document.createElement("td");
    textoCelda = document.createTextNode(devices[i].port);
    celda.appendChild(textoCelda);
    row.appendChild(celda);

    celda = document.createElement("td");
    textoCelda = document.createTextNode(devices[i].isp);
    celda.appendChild(textoCelda);
    row.appendChild(celda);

    celda = document.createElement("td");
    textoCelda = document.createTextNode(devices[i].pais);
    celda.appendChild(textoCelda);
    row.appendChild(celda);

    celda = document.createElement("td");
    textoCelda = document.createTextNode(devices[i].timestamp_shodan);
    celda.appendChild(textoCelda);
    row.appendChild(celda);

    celda = createBool(devices[i].tried);
    row.appendChild(celda);

    var val=0;
    if(!devices[i].tried)val=2;
    else val= devices[i].vulnerable;
    celda = createBool(val);
    row.appendChild(celda);
    
    row.appendChild(celda);

    return row;
}

function loadList() {
  putLoadder();
  $.get("http://"+location.host+"/data/all", function (data, status) {
    devices = data;
  
  var bodyTabla = (document.getElementById('tablaData'));
  
  for (var i = 0;  i<devices.length; i++) {
        bodyTabla.appendChild(createRow(i));
  }
  removeLoader();
 });
}

function putLoadder(){
  $('#centro').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
}

function removeLoader(){
  $( "#loadingDiv" ).fadeOut(500, function() {
    // fadeOut complete. Remove the loading div
    $( "#loadingDiv" ).remove(); //makes page more lightweight 
});  
}

function postGetDevices(){
  putLoadder();
  $.post("/get",{},  
    function(data, status){
      removeLoader();
      text = '<h6> Se han recuperado <h4>'+data.length +'</h4> dispositivos</h6>'
      $('#result').append(text);
     
      console.log("Data: " + data + "\nStatus: " + status);
  });
}

function postGetVulnerables(){
  putLoadder();
  $.post("/play",{},  
    function(data, status){
      removeLoader();
      text = '<h6> Se han recuperado <h4>'+data.length +'</h4> dispositivos vulnerables</h6>'
      $('#result').append(text);
     
      console.log("Vulnerables: " + data + "\nStatus: " + status);
  });
}