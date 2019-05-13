const socket = io.connect();

const validMessage = (arg) => {
    return (null != arg &&
        undefined != arg &&
        (typeof arg === 'string' &&
            arg.length > 0));
};

const stripTags = (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, '');
};

// Register name and email with client socket
function registerUser(id) {
    const email = document.querySelector('#email').value;
    const name = document.querySelector('#name').value;
    
    socket.emit('registeruser', { clientId: id, email: email, name: name });
}

// Receive server message
function serverMessage(data, level = 'success') {
    const ico = document.querySelector(`.${level}`);
    const message = ico.firstElementChild;
    message.innerHTML = data;
    ico.classList.add('show', level);
}

// Update connected client sockets
function updateClientList(data) {
    const list = document.querySelector('#client-list');

    if (list.hasChildNodes()) {
        list.childNodes.forEach((n,i) => {
            list.removeChild(list.childNodes[i]);
        });
    }

    let timer = setTimeout(() => {
        JSON.parse(data.clients).forEach(client => {
            const c = document.querySelector('#clientId');
            if (client.id != c.value) {
                const li = document.createElement('li');
                list.appendChild(li);
                li.innerHTML = `<b>${client.name} | ${client.email}</b>`;
                li.setAttribute('id', client.id);
            }
        });
        clearTimeout(timer);
    }, 55);
}

// Handle user message
const handleUserMessage = (data) => {
    const bgColor = (document.querySelector('#clientId').value == data.userId) ? 'me-message' : 'them-message';
    const mh = document.querySelector('#message-handler');
    const div = document.createElement('div');
    const lbl = document.createElement('label');
    const para = document.createElement('p');
    para.innerHTML = `${data.message}`;
    lbl.innerHTML = `<b>${((document.querySelector('#clientId').value == data.userId) ? 'You' : data.name)}</b>`;
    div.setAttribute('class', bgColor);
    para.setAttribute('class', 'user-message');
    lbl.setAttribute('class', 'user-name');
    div.appendChild(lbl);
    div.appendChild(para);
    mh.appendChild(div);
};

// User sent a message
const sendMessage = () => {
    const ed = window.myEditor;
    const message = stripTags(ed.getData()).trim();
    ed.setData('');
    if (validMessage(message)) {
        socket.emit('sendmessage', { message });
    }
};

const button = document.querySelector('#message-button');
button.addEventListener('click', sendMessage);

socket.on('servermessage', (data) => {
    const id = data.id;
    const status = data.status;
    document.querySelector('#clientId').value = id;
    // console.log(`Captured ID: ${id}\n`);
    serverMessage(status,'server-message');
    registerUser(id);
});

socket.on('registereduser', () => {
    serverMessage('You are now registered','primary');
});

socket.on('updateclientlist', (data) => { 
    updateClientList(data);
});

socket.on('usersentmessage', (data) => {
    handleUserMessage(data);
});
