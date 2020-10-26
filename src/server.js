const express = require('express');
const routes = require('./routes/controllers');
const databaseService = require('./services/database');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const PositionService = require('./services/position');
//const xbee_api = require('xbee-api');

require('./database/index');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './src/views');

app.use('/static', express.static('./src/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api', routes);


const server = require('http').createServer(app)

const io = require('socket.io').listen(server)

app.set('io', io);

server.listen(process.env.PORT || 2005, () => {
	console.log('Servidor On!')
});

/*
setInterval(async () => {
		try {
			const {user, truck, position} = await databaseService.getLocal();
			await databaseService.sendGlobal(user, truck, position);
		} catch (err) {
			console.log(err);
		}
	}, 30000);
*/
// Esse trecho é a comunicação com a porta serial

const port = new SerialPort('/dev/pts/2', { baudRate: 9600 });

// Analisador sintático - Leitura de dados 
const parser_port = new Readline();
port.pipe(parser_port);
//port.write('Porta COM Funcionando\n');

io.on('connection', (socket) => { // comunicação com socket
	console.log('usuário conectou! ');

	socket.on('msgParaServidor', async (data) => { // mensagem recebida do frontend
		console.log("ordem ", socket.id, " ", data)
		switch (data.msg) {
			case 'mission 1':
				const mission = '{"type": "go", "latitude": "-1.295543", "longitude": "-45.755661"}'
				console.log(mission);
				port.write(mission + '\n');
				break;
			case 'mission 2':

				break;
			default:
				if (data && data.placa) {
					const positions = await PositionService.getByTruck(data.placa);
					socket.emit('msgParaCliente', positions);
				}
				break;
		}
	});
	socket.on('disconnect', () => {
		console.log('usuário desconectou ', socket.id);
	});
});

parser_port.on('data', (data) => {
	console.log(data);
	io.emit('msgParaCliente', [JSON.parse(data)]);
});

