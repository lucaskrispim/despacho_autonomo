const express = require('express');
const routes = require('./routes/controllers');
const databaseService = require('./services/database');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const PositionService = require('./services/position');
const Path = require('./services/minimum-path');
//const xbee_api = require('xbee-api');

require('./database/index');

const app = express();

app.engine('html', require('ejs').renderFile); // engine de views html
app.set('view engine', 'html');
app.set('views', './src/views'); // seta a pasta de view

app.use('/static', express.static('./src/public')); // Pasta de arquivos publicos estáticos
app.use(bodyParser.urlencoded({ extended: true })); // parser de mensagens (JSON)

app.use(express.json());
app.use('/api', routes); // porta de entrada para a api (localhost://porta/api ...)

const server = require('http').createServer(app) // Cria o servidor

const io = require('socket.io').listen(server) // socket fica atrelato a ele


server.listen(process.env.PORT || 2005, () => { // Escutar a porta 2005
	console.log('Servidor On!')
});

/*
setInterval(async () => { // função que faz o espelhamento do banco de dados (está comentada porque estamos em teste)
	try {
		const { user, truck, position } = await databaseService.getLocal();
		await databaseService.sendGlobal(user, truck, position);
	} catch (err) {
		console.log(err);
	}
}, 30000);
*/

// Esse trecho é a comunicação com a porta serial

const port = new SerialPort('/dev/pts/5', { baudRate: 9600 }); // porta serial de escuta

// Analisador sintático - Leitura de dados 
const parser_port = new Readline();
port.pipe(parser_port);
//port.write('Porta COM Funcionando\n');
let msg = { msg: 'go' }; // mensagem padrão para o caminhão (ir... seguir)

io.on('connection', (socket) => { // comunicação com socket
	console.log('usuário conectou! ');

	socket.on('msgParaServidor', async (data) => { // mensagem recebida do frontend
		console.log("ordem ", socket.id, " ", data)
		switch (data.msg) { // switch de mensagens para caminhão
			case 'mission 1': // caso missão 1
				if (msg.msg !== 'stop' && msg.msg !== 'go home') {
					const lastPosition = await PositionService.getOneByTruck(data.placa);
					const mission = new Path(lastPosition, { latitude: -1.2885924819211995, longitude: -45.75902985452271 });
					
					msg = { msg: 'go' }; // mensagem padrão de seguir
					port.write(JSON.stringify(mission.getRoute()) + '\n'); // envia a missão
				} else {
					port.write(JSON.stringify({ msg: 'go' }) + '\n');
					msg = { msg: 'go' };
				}
				break;
			case 'stop mission': // Parar missão
				msg = { msg: 'stop' }; // Mensagem padrão para parar
				break;
			case 'go home': // Voltar para base
				if (msg.msg == 'stop') port.write(JSON.stringify({ msg: 'go home' }) + '\n'); // envia mensagem para voltar para base
				msg = { msg: 'go home' };
				break;
			case 'change dt':
				port.write(JSON.stringify({ msg: 'change dt', dt: String(data.dt) }) + '\n'); // mensagem para trocar o espaçamento temporal das mensagens
				break;
			default:
				if (data && data.placa) { // mensagem em branco. Envia os dados guardados no banco para o front
					const positions = await PositionService.getByTruck(data.placa); // pega os pontos do banco 
					socket.emit('msgParaCliente', positions); // envia para o front
				}
				break;
		}
	});
	socket.on('disconnect', () => { // verificação de encerramento do front end
		console.log('usuário desconectou ', socket.id);
	});
});

parser_port.on('data', async (data) => { // recebe dados do caminhão e envia para o front
	let response = null;
	try {
		response = await PositionService.create(JSON.parse(data)); // envia dados de posição para o banco
	} catch (err) {
		console.log(err);
	}
	response.dataValues.velReal = JSON.parse(data).velReal;
	response.dataValues.statusBasc = JSON.parse(data).statusBasc;
	response.velReal = JSON.parse(data).velReal;
	response.statusBasc = JSON.parse(data).statusBasc;
	io.emit('msgParaCliente', [response]); // envia para o front
	port.write(JSON.stringify(msg) + '\n'); // envia uma mensagem padrão para o caminhão (ir/voltar/parar)
});

