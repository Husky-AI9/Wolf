//---MPU9250 Register Map ---//

const MPU9250_ADDRESS  =0x68  // Device address when ADO = 
const PWR_MGMT_1       =0x6B  // Power Control Default to sleep 
const CONFIG           =0x1A
const SMPLRT_DIV       =0x19
const GYRO_CONFIG      =0x1B
const ACCEL_CONFIG     =0x1C
const ACCEL_CONFIG2    =0x1D
const INT_PIN_CFG      =0x37
const INT_ENABLE       =0x38
const DMP_INT_STATUS   =0x39  // Check DMP interrupt
const INT_STATUS       =0x3A

//Magnetometer Registers
const AK8963_ADDRESS   =0x0C // Address of magnetometer
const WHO_AM_I_AK8963  =0x00 // should return 0x48
const INFO             =0x01
const AK8963_ST1       =0x02  // data ready status bit 0
const AK8963_XOUT_L    =0x03  // data
const AK8963_XOUT_H    =0x04
const AK8963_YOUT_L    =0x05
const AK8963_YOUT_H    =0x06
const AK8963_ZOUT_L    =0x07
const AK8963_ZOUT_H    =0x08
const AK8963_ST2       =0x09  // Data overflow bit 3 and data read error status bit 2
const AK8963_CNTL      =0x0A  // Power down (0000), single-measurement (0001), self-test (1000) and Fuse ROM (1111) modes on bits 3:0
const AK8963_ASTC      =0x0C  // Self test control
const AK8963_I2CDIS    =0x0F  // I2C disable
const AK8963_ASAX      =0x10  // Fuse ROM x-axis sensitivity adjustment value
const AK8963_ASAY      =0x11  // Fuse ROM y-axis sensitivity adjustment value
const AK8963_ASAZ      =0x12  // Fuse ROM z-axis sensitivity adjustment value
//Temperature
const TEMP_OUT_H       =0x41
const TEMP_OUT_L       =0x42

AccelData = [0x3B,0x3C,0x3D,0x3E,0x3F,0x40]; //xH,xL,yH,yL,zH,zL
GyroData  = [0x43,0x44,0x45,0x46,0x47,0x48]; //xH,xL,yH,yL,zH,zL
ComData   = [0x04,0x03,0x06,0x05,0x08,0x07]; //xH,xL,yH,yL,zH,zL

var i2c = require('i2c-bus'),
var sleep = require('sleep'),

function MPU9250 {
	this.I2C1 = i2c.openSync(1);
	this.accelValue {
		rawX:0,
		rawY:0,
		rawZ:0
	}
	this.gyroValue {
		rawX:0,
		rawY:0,
		rawZ:0
	}
	this.comValue {
		rawX:0,
		rawY:0,
		rawZ:0
	}
	this.temp = 0
}
	
MPU9250.prototype.initMPU9250 = function(){
  
	this.I2C.writeByteSync(MPU9250_ADDRESS,PWR_MGMT_1,0x00); // Clear sleep mode bit (6), enable all sensors 
	this.sleep.usleep(10000);

	this.I2C.writeByteSync(MPU9250_ADDRESS,PWR_MGMT_1,0x01);// Auto select clock source to be PLL gyroscope reference for stable clock source
	this.sleep.usleep(10000);

	this.I2C.writeByteSync(MPU9250_ADDRESS,CONFIG, 0x03); //  gyro bandwidth to 41 and 42 Hz, delay = 5.9ms = 170 Hz
	this.I2C.writeByteSync(MPU9250_ADDRESS,SMPLRT_DIV, 0x04); // / Set sample rate = gyroscope output rate/(1 + SMPLRT_DIV) , 200Hz rate

	var uint8 = new Uint8Array(1);
	// Set gyroscope full scale range
	uint8 = readByteSync(MPU9250_ADDRESS, GYRO_CONFIG); // get current GYRO_CONFIG register value
	uint8 = uint8 & ~0x02; // Clear Fchoice bits [1:0]
	uint8 = uint8 & ~0x18; // Clear AFS bits [4:3]
	uint8 = uint8 | Gscale << 3; // Set full scale range for the gyro
	this.I2C.writeByteSync(MPU9250_ADDRESS, GYRO_CONFIG, uint8); // Write new GYRO_CONFIG value to register
	// Set accelerometer full-scale range configuration
  	uint8 = readByteSync(MPU9250_ADDRESS, ACCEL_CONFIG); // get current GYRO_CONFIG register value
	uint8 = uint8 & ~0x18; // Clear AFS bits [4:3]
	uint8 = uint8 | Ascale << 3; // Set full scale range for the gyro
	this.I2C.writeByteSync(MPU9250_ADDRESS, ACCEL_CONFIG, uint8); // Write new GYRO_CONFIG value to regist
	//Set Accell sample rate 
	uint8 = readByteSync(MPU9250_ADDRESS, ACCEL_CONFIG2);
	uint8 = uint8  & ~0x0F;// Clear accel_fchoice_b (bit 3) and A_DLPFG (bits [2:0])
	uint8 = | 0x03;  // Set accelerometer rate to 1 kHz and bandwidth to 41 Hz
	this.I2C.writeByteSync(MPU9250_ADDRESS, ACCEL_CONFIG2, uint8); // Write new GYRO_CONFIG value to regist
	// Configure Interrupts and Bypass Enable
	this.I2C.writeByteSync(MPU9250_ADDRESS, INT_PIN_CFG, 0x22);  // Set interrupt pin active high, push-pull, hold interrupt pin level HIGH until interrupt cleared,
	this.I2C.writeByteSync(MPU9250_ADDRESS, INT_ENABLE, 0x01); // Enable data ready (bit 0) interrupt
	this.sleep.usleep(10000);
}	

MPU9250.prototype.accRawMPU9250 = function(){
	var Byte = new Uint8Array(6);
	for (var i=0;i<6;i++){
		Byte[i] = readByteSync(MPU9250_ADDRESS, AccelData[i]);
	}
	this.accelValue.rawX = new Int16Array([Byte[0] << | Byte[1]])[0];
	this.accelValue.rawY = new Int16Array([Byte[2] << | Byte[3]])[0];
	this.accelValue.rawZ = new Int16Array([Byte[4] << | Byte[5]])[0];
}

MPU9250.prototype.gyroRawMPU9250 = function(){
	var Byte = new Uint8Array(6);
	for (var i=0;i<6;i++){
		Byte[i] = readByteSync(MPU9250_ADDRESS, GyroData[i]);
	}
	this.gyroValue.rawX = new Int16Array([Byte[0] << | Byte[1]])[0];
	this.gyroValue.rawY = new Int16Array([Byte[2] << | Byte[3]])[0];
	this.gyroValue.rawZ = new Int16Array([Byte[4] << | Byte[5]])[0];
}

MPU9250.prototype.comRawMPU9250 = function(){
	var Byte = new Uint8Array(6);
	for (var i=0;i<6;i++){
		Byte[i] = readByteSync(MPU9250_ADDRESS, ComData[i]);
	}
	this.comValue.rawX = new Int16Array([Byte[0] << | Byte[1]])[0];
	this.comValue.rawY = new Int16Array([Byte[2] << | Byte[3]])[0];
	this.comValue.rawZ = new Int16Array([Byte[4] << | Byte[5]])[0];
}

MPU9250.prototype.ReadTemp = function() {
	var Byte = new Uint8Array(2);
	Byte[0] = readByteSync(MPU9250_ADDRESS, TEMP_OUT_H );
	Byte[1] = readByteSync(MPU9250_ADDRESS, TEMP_OUT_L);
	this.temp = new Int16Array([Byte[0] << | Byte[1]])[0];
};

MPU9250.prototype.accelgyrocalMPU9250 = function() {
	var data = new Uint8Array(12); 
	var ii   = new Uint16Array(1);
	var packet_count = new Uint16Array(1);
	var fifo_count = new Uint16Array(1);
    //reset device 
    writeByteSync(MPU9250_ADDRESS,PWR_MGMT_1,0x01); // toggle reset 
    usleep(10000);

    //need work
}

MPU9250.prototype.MadgwickQuartenion = function(){
 	//neeed work 
}
