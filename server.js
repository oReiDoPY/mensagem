const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar o Express para servir arquivos estáticos a partir do diretório atual
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('Um cliente se conectou');

  socket.on('chat message', (msg) => {
    // Verifica se o remetente da mensagem é o mesmo que está enviando
    if (msg.username !== socket.username) {
      io.emit('chat message', msg);
    }
  });

  socket.on('set username', (username) => {
    socket.username = username;
  });

  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
