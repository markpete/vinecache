var express = require('express');
var router = express.Router();
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VineCache' });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
    socket.on('push notification', function(msg){
    io.emit('push notification', msg);
  });
});

module.exports = router;
