var mpu9250 = require('mpu9250');
var mpu = new mpu9250({
    UpMagneto: true,
    DEBUG: false,
    GYRO_FS: 0,
    ACCEL_FS: 1
});

var micros = function() {
        return new Date().getTime();
};

var timer = 0;
var kalmanX = new mpu.Kalman_filter();
var kalmanY = new mpu.Kalman_filter();
var kalAngleX = 0,
    kalAngleY = 0,
    kalAngleZ = 0,
    gyroXangle = 0,
    gyroYangle = 0,
    gyroZangle = 0,
    gyroXrate = 0,
    gyroYrate = 0,
    gyroZrate = 0,
    compAngleX = 0,
    compAngleY = 0,
    compAngleZ = 0;

function MPU9250() {
    this.values = 0;
    this.Orientation = {
        roll:0,
        pitch:0,
        heading:0
    }
    
};

MPU9250.prototype.initMPU9250 = function(){
    if (mpu.initialize()) {
        // console.log('MPU VALUE : ', mpu.getMotion9());
        //console.log('Temperature : ' + mpu.getTemperatureCelsius());
        this.values = mpu.getMotion9();
        var pitch = mpu.getPitch(this.values);
        var roll = mpu.getRoll(this.values);
        var yaw = mpu.getYaw(this.values);
        //console.log('pitch value : ', pitch);
        //console.log('roll value : ', roll);
        //console.log('yaw value : ', yaw);
        kalmanX.setAngle(roll);
        kalmanY.setAngle(pitch);

        gyroXangle = roll;
        gyroYangle = pitch;
        gyroZangle = yaw;
        compAngleX = roll;
        compAngleY = pitch;
        compAngleZ = yaw;
    };
};

MPU9250.prototype.Kalman_filter = function() {
    var values = mpu.getMotion9();
    var dt = (micros() - timer) / 1000000;
    timer = micros();

    pitch = mpu.getPitch(values);
    roll = mpu.getRoll(values);
    yaw = mpu.getYaw(values);

    var gyroXrate = values[3] / 131.0;
    var gyroYrate = values[4] / 131.0;
    var gyroZrate = values[5] / 131.0;

    if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90)) {
        kalmanX.setAngle(roll);
        compAngleX = roll;
        kalAngleX = roll;
        gyroXangle = roll;
    } else {
        kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt);
    }

    if (Math.abs(kalAngleX) > 90) {
        gyroYrate = -gyroYrate;
    }
    kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt);

    gyroXangle += gyroXrate * dt;
    gyroYangle += gyroYrate * dt;
    compAngleX = 0.93 * (compAngleX + gyroXrate * dt) + 0.07 * roll;
    compAngleY = 0.93 * (compAngleY + gyroYrate * dt) + 0.07 * pitch;

    if (gyroXangle < -180 || gyroXangle > 180) gyroXangle = kalAngleX;
    if (gyroYangle < -180 || gyroYangle > 180) gyroYangle = kalAngleY;

    var accel = {
        pitch: compAngleY,
        roll: compAngleX
    };

    var Heading = this.calcHeading(values[6], values[7]);
    //console.log(accel.pitch + ' ' + accel.roll + ' ' + Heading);
    this.Orientation.pitch = accel.pitch;
    this.Orientation.roll = accel.roll;
    this.Orientation.heading = Heading;

    return this.Orientation; 

   
};

MPU9250.prototype.calcHeading = function(x, y) {
    var heading = Math.atan2(y, x) * 180 / Math.PI;
    if (heading < -180) {
        heading += 360;
    } else if (heading > 180) {
        heading -= 360;
    }
    return heading;
};

MPU9250.prototype.micros = function() {
    return new Date().getTime();
};

MPU9250.prototype.temperature = function() {
    return mpu.getTemperatureCelsiusDigital();
};

module.exports = exports = MPU9250; 