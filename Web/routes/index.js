var express = require('express');
var router = express.Router();
var http = require('http');
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VineCache' });
});

/* GET leaderboard page. */
router.get('/leaderboard', function (req, res, next) {
    res.render('leaderboard', { title: 'VineCache -Leaderboard' });
});

/* GET event page. */
router.get('/event', function (req, res, next) {
    res.render('event', { title: 'Event' });
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
