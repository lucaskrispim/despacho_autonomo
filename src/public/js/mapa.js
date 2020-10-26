var socket = io();

socket.on('msgParaCliente', (data) => {
  if (data && data.length > 0) {
    deleteTruck();
    insertTruck(data[data.length - 1].placa, data[data.length - 1].latitude, data[data.length - 1].longitude);
    for (let i = 0; i < data.length; i++) {
      addc(data[i].latitude, data[i].longitude, data[i].placa);
    }
  }
});

function iniciarMissao() {
  socket.emit('msgParaServidor', { msg: 'mission 1' });
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function ellipsoidal_distance(p1, p2) {

  const a = 6378.137; // equatorial radius in meters 
  const f = 1 / 298.257223563; // ellipsoid flattening 
  const b = 6356.7523142;
  const tolerance = 1e-7; // to stop iteration

  const phi1 = degreesToRadians(p1.latitude);
  const phi2 = degreesToRadians(p2.latitude);

  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));
  const L1 = degreesToRadians(p1.longitude);
  const L2 = degreesToRadians(p2.longitude);
  const L = L2 - L1;

  let lambda_new = L + 0;
  let t, sin_sigma, cos_sigma, sigma, sin_alpha, cos_sq_alpha, cos_2sigma_m, C, lambda_old;

  do {
    lambda_old = lambda_new;
    t = (Math.cos(U2) * Math.sin(lambda_old)) ** 2;
    t += (Math.cos(U1) * Math.sin(U2) - Math.sin(U1) * Math.cos(U2) * Math.cos(lambda_old)) ** 2;
    sin_sigma = Math.sqrt(t);
    cos_sigma = Math.sin(U1) * Math.sin(U2) + Math.cos(U1) * Math.cos(U2) * Math.cos(lambda_old);
    sigma = Math.atan2(sin_sigma, cos_sigma);

    sin_alpha = Math.cos(U1) * Math.cos(U2) * Math.sin(lambda_old) / sin_sigma;
    cos_sq_alpha = 1 - sin_alpha ** 2
    cos_2sigma_m = cos_sigma - 2 * Math.sin(U1) * Math.sin(U2) / cos_sq_alpha;
    C = f * cos_sq_alpha * (4 + f * (4 - 3 * cos_sq_alpha)) / 16;

    t = sigma + C * sin_sigma * (cos_2sigma_m + C * cos_sigma * (-1 + 2 * cos_2sigma_m ** 2));
    lambda_new = L + (1 - C) * f * sin_alpha * t;
  } while (Math.abs(lambda_new - lambda_old) > tolerance);


  const u2 = cos_sq_alpha * ((a ** 2 - b ** 2) / b ** 2)
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))
  t = cos_2sigma_m + 0.25 * B * (cos_sigma * (-1 + 2 * cos_2sigma_m ** 2))
  t -= (B / 6) * cos_2sigma_m * (-3 + 4 * sin_sigma ** 2) * (-3 + 4 * cos_2sigma_m ** 2)
  const delta_sigma = B * sin_sigma * t
  const s = b * A * (sigma - delta_sigma)

  return s
}

function distanceInKmBetweenEarthCoordinates(p1, p2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(p2.latitude - p1.latitude);
  var dLon = degreesToRadians(p2.longitude - p1.longitude);

  lat1 = degreesToRadians(p1.latitude);
  lat2 = degreesToRadians(p2.latitude);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

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
  socket.emit('msgParaServidor', { placa: document.getElementById('truck').value });
}

function loadMapScenario() {
  vet = [];
  vet2 = [];
  raio = 2;
  map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
    center: new Microsoft.Maps.Location(-1.295543, -45.755661),
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    zoom: 15
  });
  enviaMsg();
  retiraPonto();
  insertBuldozer({ latitude: -1.295543, longitude: -45.755661 });
  insertWareHouse({ latitude: -1.295543, longitude: -45.762 });
}

function insertTruck(placa, x, y) {
  let loc = new Microsoft.Maps.Location(x, y);
  let pin = new Microsoft.Maps.Pushpin(loc, {
    icon: '/static/img/truck_icon.svg',
    title: placa,
    anchor: new Microsoft.Maps.Point(2, 2)
  });
  //Add the pushpin to the map
  map.entities.push(pin);
}

function insertBuldozer(p1) {
  let loc = new Microsoft.Maps.Location(p1.latitude, p1.longitude);
  var pin = new Microsoft.Maps.Pushpin(loc, {
    icon: '/static/img/bulldozer.svg',
    title: 'Escavadeira',
    anchor: new Microsoft.Maps.Point(2, 2)
  });

  var pin1 = createCirclePushpin(loc, 35, 'rgba(0, 255, 0, 0.2)');
  map.entities.push(pin1);
  map.entities.push(pin);
}

function insertWareHouse(p1) {
  let loc = new Microsoft.Maps.Location(p1.latitude, p1.longitude);
  var pin = new Microsoft.Maps.Pushpin(loc, {
    icon: '/static/img/warehouse.svg',
    title: 'Galpão',
    anchor: new Microsoft.Maps.Point(2, 2)
  });

  var pin1 = createCirclePushpin(loc, 35, 'rgba(0, 0, 255, 0.2)');
  map.entities.push(pin1);

  //Add the pushpin to the map
  map.entities.push(pin);
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
function deleteTruck() {
  const i = map.entities.getLength() - 2;
  const pushpin = map.entities.get(i);
  if (pushpin instanceof Microsoft.Maps.Pushpin) {
    map.entities.removeAt(i);
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