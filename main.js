require('dotenv').config();
const { PORT } = require('./config/keys');
const server = require('http').createServer(require('./expressApp'));
const io = require('socket.io')(server);

// nsp, server, adapter, id, client, conn, rooms, acks, connected, disconnected, handshake, fns, flags, _rooms
const clients = [];
const sockets = [];

server.listen(PORT, () => {
    console.log(`\n\t\tServer listening on port ${PORT}\n`);
});

io.sockets.on('connection', (socket) => {

    const updateClientList = () => {
        io.sockets.emit('updateclientlist', { clients: JSON.stringify(clients) });
    };

    const addSocket = (socket) => {
        sockets.push({
            id: socket.id,
            sock: socket
        });
    };

    const addClient = (socket) => {
        clients.push({
            id: socket.id
        });

        addSocket(socket);

        console.log(`\n\tAdded Client ID ${socket.id}!\n\tClient Count: ${clients.length}\n`);
    };

    const removeClient = (id) => {
        clients.splice(clients.findIndex(x => x.id == id), 1);
        sockets.splice(sockets.findIndex(x => x.id == id), 1);
        console.log(`\n\tRemoved Client ID ${id}!\n\tClient Count: ${clients.length}`);
        console.log(`\n\tRemoved Socket ID ${id}!\n\tSocket Count: ${sockets.length}\n`);
    };

    const getClient = (id) => {
        const index = sockets.findIndex(x => x.id == id);
        if (index > -1) {
            return sockets[index].sock;
        }
        return null;
    };

    const registerClient = (id, name, email) => {
        const index = clients.findIndex(x => x.id == id);
        const client = clients[index];
        client.email = email;
        client.name = name;
        let s = null;

        if (null !== (s = getClient(id))) {
            s.emit('registereduser');
        }
        s = null;
        console.log(`\nRegistered Client!
            ID: ${id}
            Name: ${name}
            Email: ${email}\nClients: ${JSON.stringify(clients)}\n`);

    };

    // On Connection
    addClient(socket);

    socket.emit('servermessage', { status: 'connected', id: socket.id });

    // On registration
    socket.on('registeruser', (data) => {
        console.log(`Registering ---> Socket ID: ${data.clientId}, Name: ${data.name} and Email: ${data.email}`);
        registerClient(data.clientId, data.name, data.email);
        updateClientList();
    });

    // On client disconnection
    socket.on('disconnect', (reason) => {
        console.log(`\n\tClient disconnected\n\tReason: ${reason}\n`);
        removeClient(socket.id);
        updateClientList();
    });

    // On client send message
    socket.on('sendmessage', function (data) {
        const userIndex = clients.findIndex(x => x.id == socket.id);
        const user = clients[userIndex];
        console.log(`\n\tUser: ${user.name} sent ${data.message}\n`);
        io.sockets.emit('usersentmessage', { name: user.name, message: data.message, userId: socket.id });
    });

    // On client send message to specific client
    socket.on('privatemessage', (data) => {
        console.log(data.data);
    });

    // On server broadcast message
    socket.on('broadcast', function (data) {
        console.log('Broadcast Message: ' + data.message + '  Fade Time: ' + data.time + ' Message Level: ' + data.level);
        io.sockets.emit('receive server message', { 'from': 'Admin', 'message': data.message, 'time': data.time, 'level': data.level.toLowerCase() });
    });
});