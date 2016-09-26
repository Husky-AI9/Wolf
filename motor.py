#!/usr/bin/python
from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor
 
import time
import atexit
import sys

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr=0x60)
end = 0
direction = "Stop"

myMotor1 = mh.getMotor(1)
myMotor2 = mh.getMotor(2)
myMotor3 = mh.getMotor(3)
myMotor4 = mh.getMotor(4)
myMotor1.setSpeed(220)
myMotor2.setSpeed(220)
myMotor3.setSpeed(220)
myMotor4.setSpeed(220)

while end!=1: 
 direction = sys.stdin.readline().rstrip('\n')
 if direction == "Forward":
 	myMotor1.run(Adafruit_MotorHAT.FORWARD)
 	myMotor2.run(Adafruit_MotorHAT.FORWARD)
 	myMotor3.run(Adafruit_MotorHAT.FORWARD)
 	myMotor4.run(Adafruit_MotorHAT.FORWARD)
 	time.sleep(.02)
 	myMotor1.run(Adafruit_MotorHAT.RELEASE)
 	myMotor2.run(Adafruit_MotorHAT.RELEASE)
 	myMotor3.run(Adafruit_MotorHAT.RELEASE)
 	myMotor4.run(Adafruit_MotorHAT.RELEASE)
 	direction = "Stop"

 elif direction == "Backward" :
 	myMotor1.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor2.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor3.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor4.run(Adafruit_MotorHAT.BACKWARD)
 	time.sleep(.02)
 	myMotor1.run(Adafruit_MotorHAT.RELEASE)
 	myMotor2.run(Adafruit_MotorHAT.RELEASE)
 	myMotor3.run(Adafruit_MotorHAT.RELEASE)
 	myMotor4.run(Adafruit_MotorHAT.RELEASE)
 	direction = "Stop"

 elif direction == "Left" :
 	myMotor1.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor2.run(Adafruit_MotorHAT.FORWARD)
 	myMotor3.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor4.run(Adafruit_MotorHAT.FORWARD)
 	time.sleep(.02)
 	myMotor1.run(Adafruit_MotorHAT.RELEASE)
 	myMotor2.run(Adafruit_MotorHAT.RELEASE)
 	myMotor3.run(Adafruit_MotorHAT.RELEASE)
 	myMotor4.run(Adafruit_MotorHAT.RELEASE)
 	direction = "Stop"

 elif direction == "Right" :
 	myMotor1.run(Adafruit_MotorHAT.FORWARD)
 	myMotor2.run(Adafruit_MotorHAT.BACKWARD)
 	myMotor3.run(Adafruit_MotorHAT.FORWARD)
 	myMotor4.run(Adafruit_MotorHAT.BACKWARD)
 	time.sleep(.02)
 	myMotor1.run(Adafruit_MotorHAT.RELEASE)
 	myMotor2.run(Adafruit_MotorHAT.RELEASE)
 	myMotor3.run(Adafruit_MotorHAT.RELEASE)
 	myMotor4.run(Adafruit_MotorHAT.RELEASE)
 	direction = "Stop"

 else : 
 	myMotor1.run(Adafruit_MotorHAT.RELEASE)
 	myMotor2.run(Adafruit_MotorHAT.RELEASE)
 	myMotor3.run(Adafruit_MotorHAT.RELEASE)
 	myMotor4.run(Adafruit_MotorHAT.RELEASE)



# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
	mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
	mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
	mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
	mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)
 
atexit.register(turnOffMotors)