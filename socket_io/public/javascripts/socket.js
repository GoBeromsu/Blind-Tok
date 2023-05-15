const socket = io();

const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('messages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.m.value
    socket.emit('chat message', message);
    e.target.m.value = '';
})

socket.on('chat message', (message) => {
    chatBox.appendChild(makeMessage(message));
})

const makeMessage = (message) => {
    const msgBox = document.createElement('div');
    msgBox.className = "message-wrapper";
    msgBox.innerText = message;
    return msgBox;
}