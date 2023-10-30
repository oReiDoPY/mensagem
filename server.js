const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar o Express para servir arquivos estáticos a partir do diretório atual
app.use(express.static(__dirname));

// Gerencia a conexão de um cliente
io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  // Manipula mensagens de chat
  socket.on('chat message', (msg) => {
    if (msg.username !== socket.username) {
      // Emitir a mensagem apenas para outros clientes, não para o remetente
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
  });
});

// Rota principal para servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor e ouvir na porta 3000
server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
