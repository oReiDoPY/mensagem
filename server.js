const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar o Express para servir arquivos estáticos a partir do diretório atual
app.use(express.static(__dirname));

let isBotActive = false;
const botUsername = 'Bot';
const botInactiveTimeout = 60000; // 1 minuto em milissegundos

let botInactivityTimer; // Declare a variável fora do evento 'connection'

function activateBot() {
  isBotActive = true;
}

function deactivateBot() {
  isBotActive = false;
}

function botActivityTimeout() {
  if (isBotActive) {
    deactivateBot();
    displayMessage(botUsername, 'O bot está inativo agora.');
  }
}

// Gerencia a conexão de um cliente
io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  // Iniciar o temporizador de inatividade do bot
  botInactivityTimer = setTimeout(botActivityTimeout, botInactiveTimeout);

  // Manipula mensagens de chat
  socket.on('chat message', (msg) => {
    if (msg.username === botUsername) {
      // Evite que as mensagens do bot ativem o bot novamente
      return;
    }

    if (!isBotActive) {
      activateBot();
      displayMessage(botUsername, 'Desculpe, estou ocupado no momento.');
    }

    // Reiniciar o temporizador de inatividade do bot
    clearTimeout(botInactivityTimer);
    botInactivityTimer = setTimeout(botActivityTimeout, botInactiveTimeout);

    if (msg.username !== socket.username) {
      socket.broadcast.emit('chat message', msg);
    }
  });

  // Define o nome de usuário para o cliente
  socket.on('set username', (username) => {
    socket.username = username;
  });

  // Lidar com desconexões de clientes
  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou');
    // Certifique-se de desativar o bot quando um cliente se desconectar
    if (socket.username === botUsername) {
      deactivateBot();
    }
  });
});

function displayMessage(username, message) {
  io.emit('chat message', { username, message });
}

// Rota principal para servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor e ouvir na porta 3000
server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
