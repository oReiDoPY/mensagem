const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatOutput = document.getElementById("chat-output");

const modal = document.getElementById('modal');
const usernameInput = document.getElementById('username-input');
const setUsernameButton = document.getElementById('set-username-button');
let username = "";

// Função para exibir o modal
function showModal() {
    modal.style.display = 'block';
}

// Event listener para exibir o modal quando a página carregar
document.addEventListener('DOMContentLoaded', showModal);

setUsernameButton.addEventListener('click', () => {
    username = usernameInput.value;
    modal.style.display = 'none';

    // Exiba a mensagem de boas-vindas.
    displayMessage('Sistema', `Bem-vindo(a) ao chat, ${username}!`);
});

sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message.trim() !== "") {
        displayMessage(username, message);
        socket.emit('chat message', { username, message });
        messageInput.value = "";
    }
});

function displayMessage(username, message) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    chatOutput.appendChild(messageElement);
}

// Inicializa o WebSocket
const socket = io();

// Recebe mensagens do servidor WebSocket
socket.on('chat message', (data) => {
    displayMessage(data.username, data.message);
});
