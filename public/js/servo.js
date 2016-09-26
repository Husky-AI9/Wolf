"use strict";

var PololuMaestro = require("node-pololumaestro");
var maestro = new PololuMaestro("/dev/ttyACM0");
function SERVO(){
	this.Offset = [284.5,175.5,447.75,-232,-68.75,49.25,-830,529.25,-395,284.5,-340.5,447.75];
}


SERVO.prototype.initSERVO=function() {
 maestro.on("ready", function(){ // Set servo speed and some servo position 
  console.log("connection made");
 }); 
 for (var i=0;i<14;i++){
  maestro.setSpeed(i, 60);
 };
}

SERVO.prototype.homeSERVO=function() {
//All servo home value is 1500
 for (var i=0;i<12;i++){
  maestro.setTarget(i, 1500+this.Offset[i]);
 }
}

SERVO.prototype.roverSERVO=function() {
//All servo home value is 1500
 maestro.setTarget(0, 1900+this.Offset[0]);
 maestro.setTarget(3, 1100+this.Offset[3]);
 maestro.setTarget(6, 1900+this.Offset[6]);
 maestro.setTarget(9, 1900+this.Offset[9]);
}


module.exports = SERVO;
