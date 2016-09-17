var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , url= require('url')
  , fs = require('fs')

app.listen(5000); // Use local port 5000

var PythonShell = require('python-shell');
var pyshell = new PythonShell('motor.py');

var PololuMaestro = require("node-pololumaestro");
var maestro = new PololuMaestro("/dev/ttyACM0");
var yaw = 1200;
var pitch = 1800;
var direction = "Forward";
var size = "none"
var target = [1200,2300]
//wait until connection is ready
maestro.on("ready", function() { // Set servo speed and some servo position 
 console.log("connection made");
 maestro.setSpeed(0, 60);
 maestro.setSpeed(1, 60);
 maestro.setSpeed(2, 60);
 maestro.setSpeed(3, 60);
 maestro.setSpeed(4, 60);
 maestro.setSpeed(5, 60);
 maestro.setSpeed(6, 60);
 maestro.setSpeed(7, 60);
 maestro.setSpeed(8, 60);
 maestro.setSpeed(9, 60);
 maestro.setSpeed(10, 60);
 maestro.setSpeed(11, 60);
 maestro.setSpeed(12, 60);
 maestro.setSpeed(13, 60);
 maestro.setTarget(12, 1200); 
 maestro.setTarget(13, 1800);
});

 maestro.setTarget(6,1200);
 maestro.setTarget(6,2300);

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
/*--------------------------------------------------Servo Position Mapping -----------------------------------------------------------------*/



/*-----------------------------------------------------------------Servo Function----------------------------------------------------------------*/
function CameraRight(){
    yaw = yaw+100;
    maestro.setTarget(12, yaw); 
}
function CameraLeft(){
    yaw = yaw-100;
    maestro.setTarget(12, yaw); 
}
function CameraUp(){
    pitch = pitch+100;
    maestro.setTarget(13, pitch); 
}
function CameraDown(){
    pitch = pitch-100;
    maestro.setTarget(13, pitch); 
}
function Rest(){
    //Bot Rest postion
    maestro.setTarget(0, 1900);
    maestro.setTarget(1, 700); 
    maestro.setTarget(2, 800);
    maestro.setTarget(3, 1350); 
    maestro.setTarget(4, 2300); 
    maestro.setTarget(5, 2250);
    maestro.setTarget(6, 1300);  
    maestro.setTarget(7, 1800); 
    maestro.setTarget(8, 2300);
    maestro.setTarget(9, 1700);
    maestro.setTarget(10, 1200); 
    maestro.setTarget(11, 1300);
}     
function Idle(){
    maestro.setTarget(0, 1611);
    maestro.setTarget(1, 950); 
    maestro.setTarget(2, 2300);
    maestro.setTarget(3, 1552); 
    maestro.setTarget(4, 800); 
    maestro.setTarget(5, 1700);
    maestro.setTarget(6, 1500);  
    maestro.setTarget(7, 2150); 
    maestro.setTarget(8, 1300);
    maestro.setTarget(9, 1622);
    maestro.setTarget(10, 1570); 
    maestro.setTarget(11, 2280); 
}


/*------------------------------------------------------------------Motor Function ------------------------------------------------------------------*/

function Motor(){
  pyshell.send(direction);
}
function Motor_LR(){
  maestro.setTarget(6,1200);
  maestro.setTarget(6,2300);
  if (size == 'L'){
    target[0] += 100;
    target[1] -= 100;
    maestro.setTarget(6,target[0]);
    maestro.setTarget(9,target[1]);
  }
  else{
    target[0] -= 100;
    target[1] += 100;
    maestro.setTarget(6,target[0]);
    maestro.setTarget(9,target[1]);
  }
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
      Idle();
      setTimeout(function(){
          socket.emit("Idle");
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
  });
  socket.on('CR', function(data) {
      console.log("CameraRight");
      CameraRight();   
  });
   socket.on('CL', function(data) {
      console.log("CameraLeft");
      CameraLeft();   
  });
    socket.on('CU', function(data) {
      console.log("CameraUp");
      CameraUp();   
  });
     socket.on('CD', function(data) {
      console.log("CameraDown");
      CameraDown();   
  });
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
   

   

/* setInterval(function(){
    //console.log("sending compass info");
    compass();
    socket.emit('compass', bearing);   
  },500); */
});