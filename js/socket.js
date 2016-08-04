var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    path: '/socket/socket.io'
})

app.get('/', function(req, res) {
    console.log('app.get');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    console.log('io.on connection');
    io.emit('chat message', 'A user has joined');

    socket.on('disconnect', function() {
        io.emit('chat message', 'A user has left');
    });

    socket.on('chat message', function(msg) {
        console.log(msg);
        io.emit('chat message', msg);
    });
});

http.listen(8080, function() {
    console.log('listening on 8080');
});