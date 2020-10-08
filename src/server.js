const express = require('express');
const routes = require('./routes/controllers');
const bodyParser = require('body-parser');
require('./database/index')

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