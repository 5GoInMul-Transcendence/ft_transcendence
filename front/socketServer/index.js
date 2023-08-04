'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new nodeStatic.Server();
var app = http
  .createServer(function (req, res) {
    fileServer.serve(req, res);
  })
  .listen(8080);

var io = socketIO(app);
io.sockets.on('connection', function (socket) {
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('client', (clientMessage) => {
    console.log(socket.id + ' send Message');
    const message = {
      socketId: socket.id,
      message: socket.id.slice(0, 5) + ': ' + clientMessage,
    };
    io.emit('server', message);
  });
});
