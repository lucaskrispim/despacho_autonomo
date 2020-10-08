import socket from "/static/socket.io/socket.io.js"; 
import Microsoft from "https://www.bing.com/api/maps/mapcontrol?key=AhaPUqWVNwVKmsRfCQ1XbJzxbMLcJ42Tzg3Qasjb_vtvBRQUEjbERa-u6R6giITz";

socket.on('msgParaCliente', (data) => {
  for (let i = 0; i < data.length; i++) {
    addc(data[i].latitude, data[i].longitude, data[i].placa);
  }
});

socket.on('msgParaCliente2', (data) => {
  const element = document.createElement("div");
  const d = new Date();
  const msg = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + " " + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + "msg: " + data;

  element.appendChild(document.createTextNode(msg));
  element.classList.add("mt-2");

  const buttonSim = document.createElement('BUTTON');
  const textSim = document.createTextNode("SIM");
  buttonSim.classList.add("btn");
  buttonSim.classList.add("btn-outline-success");
  buttonSim.classList.add("btn-sm");
  buttonSim.classList.add("ml-2");
  buttonSim.appendChild(textSim);
  element.appendChild(buttonSim);

  const buttonNao = document.createElement('BUTTON');
  const textNao = document.createTextNode("Não");
  buttonNao.classList.add("btn");
  buttonNao.classList.add("btn-outline-danger");
  buttonNao.classList.add("btn-sm");
  buttonNao.classList.add("ml-2");
  buttonNao.appendChild(textNao);
  element.appendChild(buttonNao);

  document.getElementById('area-logs').appendChild(element);
});

function enviaMsg() {
  socket.emit('msgParaServidor', { 'msg': 'oi' });
}

function loadMapScenario() {
  enviaMsg();
  vet = [];
  vet2 = [];
  raio = 2;
  map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
    center: new Microsoft.Maps.Location(-1.295543, -45.755661),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 15
  });
  retiraPonto();
}

function selecionaPlaca() {
  retiraPonto();
  var x = document.getElementById("plac").value;
  for (let i = 0; i < vet2.length; i++) {
    if (vet2[i].placa == x) {
      let loc = new Microsoft.Maps.Location(vet2[i].latitude, vet2[i].longitude);
      let pl = vet.findIndex(obj => obj.placa == x);
      let pin1 = createCirclePushpin(loc, raio, 'rgb(' + vet[pl].n1 + ',' + vet[pl].n2 + ',' + vet[pl].n3 + ')');
      map.entities.push(pin1);
    } else if (x == 'all') {
      let loc = new Microsoft.Maps.Location(vet2[i].latitude, vet2[i].longitude);
      let pl = vet.findIndex(obj => obj.placa == vet2[i].placa);
      let pin1 = createCirclePushpin(loc, raio, 'rgb(' + vet[pl].n1 + ',' + vet[pl].n2 + ',' + vet[pl].n3 + ')');
      map.entities.push(pin1);
    }
  }
}

function retiraPonto() {
  for (var i = map.entities.getLength() - 1; i >= 0; i--) {
    var pushpin = map.entities.get(i);
    if (pushpin instanceof Microsoft.Maps.Pushpin) {
      map.entities.removeAt(i);
    }
  }
}

function selectPlaca(placa) {
  var x = document.getElementById("plac");
  var option = document.createElement("option");
  option.text = placa;
  x.add(option);
}

function addc(x, y, placa) {
  let loc = new Microsoft.Maps.Location(x, y);
  vet2.push({ placa: placa, latitude: x, longitude: y });
  if (vet.findIndex(obj => obj.placa == placa) == -1) {
    let n1 = (Math.floor(Math.random() * 256)).toString();
    let n2 = (Math.floor(Math.random() * 256)).toString();
    let n3 = (Math.floor(Math.random() * 256)).toString();
    vet.push({ placa: placa, n1: n1, n2: n2, n3: n3 });
    var pin1 = createCirclePushpin(loc, raio, 'rgb(' + n1 + ',' + n2 + ',' + n3 + ')');
  } else {
    let pl = vet.findIndex(obj => obj.placa == placa);
    var pin1 = createCirclePushpin(loc, raio, 'rgb(' + vet[pl].n1 + ',' + vet[pl].n2 + ',' + vet[pl].n3 + ')');
  }
  map.entities.push(pin1);
}

function createCirclePushpin(location, radius, fillColor, strokeColor, strokeWidth) {
  strokeWidth = strokeWidth || 0;

  //Create an SVG string of a circle with the specified radius and color.
  var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', (radius * 2),
    '" height="', (radius * 2), '"><circle cx="', radius, '" cy="', radius, '" r="',
    (radius - strokeWidth), '" stroke="', strokeColor, '" stroke-width="', strokeWidth, '" fill="', fillColor, '"/></svg>'];

  //Create a pushpin from the SVG and anchor it to the center of the circle.
  return new Microsoft.Maps.Pushpin(location, {
    icon: svg.join(''),
    anchor: new Microsoft.Maps.Point(radius, radius)
  });
}