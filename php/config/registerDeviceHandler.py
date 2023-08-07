import os
import sys
import subprocess
import threading
import paho.mqtt.client as mqtt
import json

bsNodeId = ''
topic = "GEMBA/INPUTDEVICE/PING/"
deviceList = []
timerduration = 0
failedReply = ""
listenToOne = False

def exitRoutine(client):
	global deviceList
	client.disconnect()
	if failedReply and len(deviceList) == 0:
		deviceList.append(failedReply)
	print (json.dumps(deviceList))
	sys.exit()

def exitRoutineTimer(client, duration):
	cmd = threading.Timer(duration, exitRoutine, [client])
	cmd.start()

def on_connect(client, userdata, flags, rc):
	# print (topic)
	client.subscribe(topic, 1)

def on_message(client, userdata, msg):
	global deviceList
	payload = msg.payload.decode("utf-8")
	
	if "NEWDEV" in payload:
		if not listenToOne:
			nodeid = ((payload.split(' '))[1]).strip()
			if not (nodeid in deviceList):
				deviceList.append(nodeid)
		# print (nodeid)
	elif "DEVADDED" in payload:
		nodeid = ((payload.split(' '))[1]).strip()
		deviceList.append("Success " + nodeid)
	elif "ACK" in payload:
		if listenToOne:
			deviceList.append(payload)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect('dev.line.com.ph', 1883, 60)

if len(sys.argv) < 2:
	print ("Error")
	sys.exit()
elif sys.argv[2] == "DEFAULT":
	with open('/home/lsp_user/serverInfo.txt', 'r') as file_object:
		for line in file_object:
			if "mac=" in line:
				bsNodeId = ((line.strip()).split('='))[1]
else:
	bsNodeId = sys.argv[2]

if 'start' in sys.argv[1]:
	timerduration = 0.1
	topic += bsNodeId + '/+'
	# function for setting dual AP mode on BS
	client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "STARTAP")
elif 'stop' in sys.argv[1]:
	timerduration = 0.1
	topic += bsNodeId + '/+'
	# function for setting dual AP mode on BS
	client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "CLOSEAP")
elif 'scan' in sys.argv[1]:
	timerduration = 35
	topic += bsNodeId + '/+'
	# function for setting dual AP mode on BS
	# client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "STARTAP")
elif 'add' in sys.argv[1]:
	listenToOne = True
	timerduration = 5
	failedReply = "Failed " + sys.argv[3]
	topic += bsNodeId + '/' + sys.argv[3]
	# function for adding devices on BS : <cmd> <bsnodeid> <nodeid>
	client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "ADDDEV " + bsNodeId + " " + sys.argv[3])
elif 'remove' in sys.argv[1]:
	listenToOne = True
	timerduration = 5
	topic += bsNodeId + '/' + sys.argv[3]
	# function for adding devices on BS : <cmd> <bsnodeid> <nodeid>
	client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "REMDEV " + bsNodeId + " " + sys.argv[3])
	deviceList.append("Success")
elif 'espconfig' in sys.argv[1]:
	listenToOne = True
	timerduration = 20
	topic += bsNodeId + '/' + sys.argv[3]
	failedReply = "Failed " + sys.argv[3]
	# function for sending config to ESP : <cmd> <bsnodeid> <nodeid> <NETWORK SSID,PASS>
	client.publish('GEMBA/BASESTATION/NETCONFIG/' + bsNodeId, "ESPCNF " + bsNodeId + " " + sys.argv[3] + " " + sys.argv[4])
else:
	print ("Error")
	sys.exit()

# function for receiving devonline of devices
exitRoutineTimer(client, timerduration)

try:
    client.loop_forever()
except KeyboardInterrupt:
    pass
finally:
    client.disconnect()

