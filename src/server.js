const express = require('express');
const routes = require('./routes/controllers');
const databaseService = require('./services/database');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const xbee_api = require('xbee-api');

require('./database/index');

const app = express();

app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('views','./src/views');

app.use('/static',express.static('./src/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());
app.use('/api',routes);


const server = require('http').createServer(app) 

const io = require('socket.io').listen(server)

server.listen(process.env.PORT || 2004, () => {
    console.log('Servidor On!')
}); 

setInterval(async () => {
    try {
      const {user, truck, position} = await databaseService.getLocal();
      await databaseService.sendGlobal(user, truck, position);
    } catch (err) {
      console.log(err);
    }
  }, 30000);

io.on('connection', (socket) => { // Toda vez que um novo cliente se conectar ao nosso socket o que será feito?
    console.log(`Socket conectado: ${socket.id}`); // imprime a mensagem com o id de quem conectou

    socket.on('disconnect', (socket) => {
        console.log('Socket desconectado.');
    });

    socket.on('controle-autonomo', (data) => {
        console.log("Controle Autônomo");
        console.log(data);
        var frame = {
            type: C.FRAME_TYPE.TX_REQUEST_64,
            destination64: "000000000000FFFF",
            options: 0x00, // optional, 0x00 is default
            data: data 
        };
    
        serialport.write(xbeeAPI.buildFrame(frame), function (err, res) {
            if (err) return (err);
            else console.log("written bytes: ", frame);
        });
    });
});

    // Comunicação Serial - XBee

/*
// Esse trecho é a comunicação com a porta serial
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/pts/3', { baudRate: 9600 });

// Analisador sintático - Leitura de dados 
const parser_port = new Readline();
port.pipe(parser_port);
port.write('Porta COM Funcionando\n');

io.on('connection', (socket) => { // comunicação com socket
    console.log('usuário conectou!');
    socket.on('disconnect', () => {
        console.log('usuário desconectou');
    });
    socket.on('msgParaServidor', (data) => { // mensagem recebida do frontend
        console.log(data);
        socket.emit('msgParaCliente',[{'placa':'CR1020','latitude':-1.295543,'longitude':-45.755661}]);   // emitimos esse dados para o cliente
    });
});

parser_port.on('data', (line) => {
    console.log(line);
    io.emit('msgParaCliente2', line);                       
});
*/