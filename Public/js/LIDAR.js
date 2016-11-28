const Lidar_Address             = 0x62;
const Lidar_Control             = 0x00;
const Lidar_Distance_HighByte   = 0x0f;
const Lidar_Distance_LowByte    = 0x10;

var i2c = require('i2c-bus'),
  i2c1 = i2c.openSync(1);

var Byte = new Uint8Array(2);
var Distance = 0;

function LIDAR() {  
};

MPU9250.prototype.Distance = function(){
	setInterval(function(){
		setTimeout(function(){
			i2c1.writeByteSync(Lidar_Address,Lidar_Control,0x04);
			setTimeout(function(){
			          Byte[0] = i2c1.readByteSync(Lidar_Address,Lidar_Distance_HighByte);
			          Byte[1] = i2c1.readByteSync(Lidar_Address,Lidar_Distance_LowByte);
			          Distance = new Int16Array([Byte[0] << 8 | Byte[1]])[0]; 
			           console.log("Distance: "+Distance+" cm");
			          return Distance;
			}, 20);
		}, 20);           
	},300);
};

module.exports = exports = LIDAR; 