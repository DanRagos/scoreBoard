#!/usr/bin/env python
import logging

#Database Configuration
dbhost = 'localhost'
dbuser = 'gemba_user'
dbpasswd = 'CHATEAU_P3_RHQ'
dbname = 'gemba_db'

#getJobScheduleById Indexes
jsi_deviceId = 1
jsi_prewarn = 6
jsi_cycleTime = 8
jsi_prescale = 7
jsi_target = 5
jsi_autoEndFlag = 11

#isMachineRunning
mr_prewarn = 2
mr_cycleTime = 4
mr_prescale = 3
mr_target = 1
mr_autoEndFlag = 5

#Log Configuration
logLoc = '/home/lsp_user/gemba/logs/'

loglevel = logging.DEBUG 
# logging.DEBUG
# logging.INFO
# logging.WARNING
# logging.ERROR
# logging.CRITICAL

logformat = '%(asctime)s %(levelname)s: %(funcName)s:%(lineno)d: %(message)s'

#Statuses
trigger = "TRIGGER"
output = "OUTPUT"
reject = "REJECT"
jostop = "JOSTOP"
inhibitOff = "INHIBITOFF"
inhibitOn = "INHIBITON"
downtime1Off = "DT1OFF"
downtime1On = "DT1ON"
downtime2Off = "DT2OFF"
downtime2On = "DT2ON"
watchDogDTOff = "WDTOFF"
watchDogDTOn = "WDTON"

jostart = "JOSTART"

joinfo = "JOINFO"

devOn = 1
devOff = 0

notRunning = 0
running = 1


#Tally Method Constants
tal_relevantStats = [downtime1On,
                downtime1Off,
                downtime2On,
                downtime2Off,
                inhibitOn,
                inhibitOff,
                jostart,
                jostop,
                output,
                reject,
                trigger,
                watchDogDTOn,
                watchDogDTOff]
                
talCdt_noDowntime = 0
talCdt_downtime1 = 1
talCdt_downtime2 = 2
talCdt_watchDogDT = 3
#Tally File Configuration
tallyLoc = '/home/lsp_user/gemba/'

#MQTT
broker = 'dev.line.com.ph'
#port = 8883
port = 1883
tlsCertFile = '/etc/mosquitto/certs/mqtt_ca.crt'

unsecurePort = 1883
securePort = 8883

#MQTT TOPICS
HEADTOPIC = "GEMBA"

DEVICETOPIC = "INPUTDEVICE"

NODECHANNEL = "DATA"
PINGCHANNEL = "PING"
TODEVCHANNEL = "COMMAND"

#MQTT MESSAGES
