var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

console.log('ServerOn');


var serverID;

//var messages = [];

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
  if(msg == false){
      msg = "     ";
    }


    io.emit('chat message', msg);
    console.log(msg);

   

    var clientID = socket.id;
    var messages = [];
    messages.push({clientID: clientID, message:msg});

    if(serverID){
    	io.to(serverID).emit('clientEvent',messages);
    }
    else{
    	console.log('No Server connected');
    }

  });


  socket.on('ServerConnect', function(msg){
    //io.emit('chat message', msg);
    console.log( socket.id +" :"+msg);
    serverID = socket.id;

  });



  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
















function prepareMessage(id,message) {	
	toneParams = {
		tone_input: { id: message },
		content_type: 'application/json',
	};

}

