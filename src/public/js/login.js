var socket = io();

socket.on('msgParaCliente', (data) => {
  console.log('veio');
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      addc(data[i].latitude, data[i].longitude, data[i].placa);
    }
    //insertTruck(data[data.length - 1].placa, data[data.length - 1].latitude, data[data.length - 1].longitude);
  }
});

function iniciar() {
  console.log(socket);
  socket.emit('msgParaServidor', { msg: {} });
}


