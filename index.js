var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users=[];
var userCount = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/forsida.html');
});

app.get('/12345', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/*', function(req, res){
  res.write("Denied")
  res.end()
});

io.on('connection', function (socket) {
  userCount++;
  io.emit('userCount', userCount);
  socket.on('disconnect', function() {
    userCount--;
    io.emit('userCount', userCount);

  });
  socket.on('chat message',function(msg){
    if(socket.nickName != undefined){
    io.emit('chat message',socket.nickName+ ' skrifadi: '+msg);
  }
  else{
    io.emit('chat message',msg);
  }
    console.log(' a user wrote:'+msg);
  });
  socket.on('chooseNick',function(nick){
  socket.nickName = nick;
  users.push(socket.nickName);
  io.emit('upDateUser', users);

  });
});






http.listen(3000, function(){
  console.log('listening on *:3000');
});