console.log('renderer process working');

// Controle Autônomo - Botões
const iniciarMissaoBtn = document.getElementById('iniciarMissaoBtn');
const pararMissaoBtn = document.getElementById('pararMissaoBtn');
const emergenciaBtn = document.getElementById('emergenciaBtn');
const paramBtn = document.getElementById('paramBtn');

// Parâmetros de Veículo
const statusBasc = document.getElementById('statusBasc');
const velReal = document.getElementById('velReal');
const velMissao = document.getElementById('velMissao');
const codErros = document.getElementById('codErros');
const codFalha = document.getElementById('codFalha');
const nivelDiesel = document.getElementById('nivelDiesel');
const pressaoPneus = document.getElementById('pressaoPneus');


iniciarMissaoBtn.addEventListener('click', function () {
    console.log('Iniciar Missão');
    socket.emit('controle-autonomo', 'M,1,?');
})

pararMissaoBtn.addEventListener('click', function () {
    console.log('Parar Missão')
    socket.emit('controle-autonomo', 'M,0,?');
})

emergenciaBtn.addEventListener('click', function () {
    console.log('EMERGÊNCIA')
    socket.emit('controle-autonomo', 'F,1,?');
})

buzinaBtn.addEventListener('click', function () {
    console.log('Buzina')
    socket.emit('controle-autonomo', 'B,1,?');
})

// Status de Comunicação - RF
socket.on('rf-data', function (arg1, arg2, arg3, arg4) {
    console.log(arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4)
    document.getElementById("bytesTX").innerHTML = arg1;
    document.getElementById("bytesRX").innerHTML = arg2;
    document.getElementById("bytesOFF").innerHTML = arg3;
    document.getElementById("bytesPWR").innerHTML = arg4;
});

// Status do Veículo - PR
socket.on('param-data', function (arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    console.log(arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + ", " + arg5 + ", " + arg6 + ", " + arg7)
    statusBasc.innerHTML = arg1;
    velReal.innerHTML = arg2;
    velMissao.innerHTML = arg3;
    codErros.innerHTML = arg4;
    codFalha.innerHTML = arg5;
    nivelDiesel.innerHTML = arg6;
    pressaoPneus.innerHTML = arg7;
});


