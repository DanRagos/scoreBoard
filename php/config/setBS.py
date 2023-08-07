import sys
import os
import paho.mqtt.client as mqtt
from random import randint
from datetime import datetime
import threading
import json

taskFlag = 1
cycleTime = 0
SEND_INTERVAL = 2
broker = 'localhost'
port = 1883
retval = ''


def mqttTopic(bsnode):
	return 'GEMBA/BASESTATION/NETCONFIG/' + bsnode


# The callback for when the client receives a CONNACK response from the server.    
def on_connect(client, userdata, flags, rc):
	topicPing = mqttTopic("+")
	client.subscribe(topicPing, 1)

	data = json.loads(sys.argv[1])
	topic = mqttTopic(data[0]["mac"])
	msg = "CONFIG " + json.dumps(data)
	client.publish(topic, msg, 1)

	replyTimer()


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
	global retval, taskFlag
	payload = msg.payload.decode("utf-8")

	if "NETCONFIG ACK" in payload:
		taskFlag = 0
		# retval = "success"
		print("success")
		client.disconnect()
		sys.exit()


def check_success():
	if taskFlag == 1:
		print("failed")
	client.disconnect()
	sys.exit()


def replyTimer():
	global taskFlag, cycleTime, retval
	task = threading.Timer(SEND_INTERVAL, check_success)
	task.start()


#---------------------------------Main-----------------------------------------#        


client = mqtt.Client("ms " + str(randint(0, 99999)))
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker, port, 60)

client.loop_forever()