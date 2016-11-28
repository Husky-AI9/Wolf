var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , url= require('url')
  , fs = require('fs')

app.listen(5000); // Use local port 5000
//Orientation
var mpu = require('./public/js/MPU9250.js');
var MPU = new mpu();
MPU.initMPU9250();
//Lidar
var lidar = require('./public/js/LIDAR.js');
var LIDAR = new lidar();
//python script
var PythonShell = require('python-shell');
var pyshell = new PythonShell('motor.py');
//servo class
var servo = require('./public/js/Servo.js');
var Servo = new servo();
//
var direction = "Forward";
var size = "none"

Servo.initCameraSERVO();

// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;

    // Managing the root route
    if (path == '/') {
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }
}


/*------------------------------------------------------------------Motor Function ------------------------------------------------------------------*/

function Motor(){
  pyshell.send(direction);
}

/*-------------------------------------------------------------------Handling Request----------------------------------------------------------------*/
// Web Socket Connection
io.sockets.on('connection', function (socket) {
  socket.on('Rest', function(data) {
      console.log("Rest Position");
      Rest();
      setTimeout(function(){
          socket.emit("Rest");
      }, 1000);
  });
  socket.on('Idle', function(data) {
      console.log("Idle Position");
      Servo.homeSERVO();
      setTimeout(function(){
          socket.emit("Idle Mode Enable");
      }, 1000);
  });
  socket.on('Rover', function(data) {
      console.log("Rover Position");
      Servo.roverSERVO();
      setTimeout(function(){
          socket.emit("Rover Mode Enable");
      }, 1000);
  });
  socket.on('F', function(data) {
      console.log("Forward");
      Forward();
      setTimeout(function(){
          socket.emit("F");
      }, 1000);
  });
  socket.on('B', function(data) {
      console.log("Backward");
      setTimeout(function(){
          socket.emit("B");
      }, 1000);
  });
  socket.on('L', function(data) {
      console.log("Left");
      Unverse();
      setTimeout(function(){
          socket.emit("L");
      }, 1000);
  });
  socket.on('R', function(data) {
      console.log("Right");
      Reverse();
      setTimeout(function(){
          socket.emit("R");
      }, 1000);

/*---------------------------------------------------------------------------------------------------------*/
  });
  socket.on('CR', function(data) {
      console.log("CameraRight");
      Servo.RightCameraSERVO();

  });
   socket.on('CL', function(data) {
      console.log("CameraLeft");
      Servo.LeftCameraSERVO();
  });
    socket.on('CU', function(data) {
      console.log("CameraUp");
      Servo.UpCameraSERVO();

  });
     socket.on('CD', function(data) {
      console.log("CameraDown");
      Servo.DownCameraSERVO();

  });

/*---------------------------------------------------------------------------------------------------------*/



  socket.on('MF', function(data) {
      direction = "Forward";
      Motor(direction);
  });
  socket.on('MB', function(data) {
      direction = "Backward"
      Motor(direction);  
  });
   socket.on('ML', function(data) {
      direction = "Left";
      Motor(direction);
         });
   socket.on('MR', function(data) {
      direction = "Right";
      Motor(direction);
  });
    socket.on('SY', function(data) {
     sideway = 'yes';
     Sideway();
  });
     socket.on('SN', function(data) {
     sideway = 'no';
     Sideway();
  });
   
  /*---------------------------------------------------------------------------------------------------------*/

 setInterval(function(){
    //console.log("sending compass info");
    var Orientation = MPU.Kalman_filter();
    //console.log(Orientation.roll);
    socket.emit('Orientation', Orientation);   
  },500); 

setInterval(function(){
    //console.log("sending compass info");
    var Distance = LIDAR.Distance();
    socket.emit('Lidar', Distance);   
  },300); 

 
});

