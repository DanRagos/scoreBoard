#!/usr/bin/python
import config
import paho.mqtt.client as mqtt
import paho.mqtt.publish as mpublish
from datetime import datetime
import dbStore

def pingTopic(nodeId, bsNodeId):
    if bsNodeId == 'DEFAULT':
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.PINGCHANNEL + "/" + nodeId
    else:
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.PINGCHANNEL + "/" + bsNodeId + "/" + nodeId

def toDevTopic(nodeId, bsNodeId):
    if bsNodeId == 'DEFAULT':
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.TODEVCHANNEL + "/" + nodeId
    else:
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.TODEVCHANNEL + "/" + bsNodeId + "/" + nodeId
    
def publish(broker, port, topic, msg):
    if isPortSecure(port):
        # set TLS
        mpublish.single(topic, payload=msg, qos=1, hostname=broker, port=port, keepalive=60, tls={'ca_certs': "<ca_certs>", 'certfile': config.tlsCertFile, 'keyfile': "<keyfile>"})
    else:
        # do not set TLS
        mpublish.single(topic, payload=msg, qos=1, hostname=broker, port=port, keepalive=60)
    # pubMessage = msg + " " + topic
    # print(pubMessage)
    
def setTLSIfSecure(mqttClient, port):
    # print("Checking to see if to set TLS")
    if isPortSecure(port):
        mqttClient.tls_set(config.tlsCertFile)
        # print("Is Secure. TLS Set")
    
def isPortSecure(port):
    return (port == config.securePort) 

def sendJobInfo(jSchedId):
    jobSched = dbStore.callGetJobSchedById(jSchedId)
    
    devId = jobSched[config.jsi_deviceId]
    nodeId = dbStore.getNode(devId)
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    
    prewarn = jobSched[config.jsi_prewarn]
    cycleTime = jobSched[config.jsi_cycleTime]
    prescale = jobSched[config.jsi_prescale]
    target = jobSched[config.jsi_target]
    autoEndFlag = jobSched[config.jsi_autoEndFlag]

    jinfoMsg = config.joinfo + " " + str(prewarn) + "," + str(cycleTime) + "," + str(prescale) + "," + str(target) + "," + str(autoEndFlag)
    topic = toDevTopic(nodeId, bsNodeId)
    
    publish(config.broker, config.port, topic, jinfoMsg)
    print ("success")

def timestampNowStringShort():
    TNow = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S')
    return TNow

def dateNowString():
    TNow = datetime.strftime(datetime.now(), '%Y-%m-%d')
    return TNow

#new job start
def sendSchedToServer(devId, schedId):
    isDeletedNot = dbStore.callisJobNotDeleted(schedId)
    if isDeletedNot <= 0:
        #deleted
        print ("deleted")
        return

    result = dbStore.callGetRunningJob(devId)
    if result:
        #device already has a schedule
        print ("failed")
        return

    jostartMsg = "JOSTART " + str(schedId) + " 0"

    nodeId = dbStore.getNode(devId)
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    if bsNodeId == "0":
        print ("error")
        return

    topic = pingTopic(nodeId, bsNodeId)
    publish(config.broker, config.port, topic, jostartMsg)

    print ("success")

def sendNewSchedToServer(devId, job, model, material, target, prewarn, prescale, cycletime, schedStart, schedEnd, autoEndStatus, operator, wdtEnabled):
    nodeId = dbStore.getNode(devId)
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    if bsNodeId == "0":
        print ("error")
        return

    if schedStart == "now":
        schedStart = timestampNowStringShort()
    
    schedEnd = dateNowString() + " 23:59:59"

    #          1      2    3      4         5       6        7         8          9           10        11             12     13
    args = [devId, job, model, material, target, prewarn, prescale, cycletime, schedStart, schedEnd, autoEndStatus, operator, wdtEnabled]
    schedId = dbStore.callCreateJSchedSP(args)
    if schedId < 1:
        #job creation failed
        # dbStore.callunsetDeviceState(nodeId)
        print ("error")
        return

    result = dbStore.callGetRunningJob(devId)
    if result:
        #device already has a schedule
        print ("failed")
        return

    jostartMsg = "JOSTART " + str(schedId) + " 1"

    topic = pingTopic(nodeId, bsNodeId)
    publish(config.broker, config.port, topic, jostartMsg)

    print (schedId)

def sendEndJobToServer(devId):
    jostartMsg = "JOSTOP"

    nodeId = dbStore.getNode(devId)
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    if bsNodeId == "0":
        print ("error")
        return

    # check if the job is already ended
    result = dbStore.callGetRunningJob(devId)
    if not result:
        #device already has a schedule
        print ("ended")
        return

    topic = pingTopic(nodeId, bsNodeId)
    publish(config.broker, config.port, topic, jostartMsg)

    print ("success")

# not used
def nodeTopic(nodeId, bsNodeId):
    if bsNodeId == 'DEFAULT':
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.NODECHANNEL + "/" + nodeId
    else:
        return config.HEADTOPIC + "/" + config.DEVICETOPIC + "/" + config.NODECHANNEL + "/" + bsNodeId + "/" + nodeId

# def timestampNowString():
#     TNow = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S.%f')[:-3]
#     return TNow

def devOn(nodeId):
    devState(config.devOn, nodeId)
    
def devOff(nodeId):
    devState(config.devOff, nodeId)
    
def devState(state, nodeId): 
    dbStore.updateDevState(state, nodeId)

def sendDateToDevice(nodeId):
    dateMsg = "DATE " + timestampNowStringShort()
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    topic = toDevTopic(nodeId, bsNodeId)
   
    publish(config.broker, config.port, topic, dateMsg)

# def useJobSched(jSchedId):
#     jobSched = dbStore.callGetJobSchedById(jSchedId)
    
#     devId = jobSched[config.jsi_deviceId]
#     nodeId = dbStore.getNode(devId)
    
#     prewarn = jobSched[config.jsi_prewarn]
#     cycleTime = jobSched[config.jsi_cycleTime]
#     prescale = jobSched[config.jsi_prescale]
#     target = jobSched[config.jsi_target]
#     autoEndFlag = jobSched[config.jsi_autoEndFlag]
    
#     dbStore.insertData(timestampNowString(), nodeId, config.jostart)
#     retval = dbStore.callJobStartedSP(jSchedId)
#     if retval == 1:
#         #ALSO SEND JOSTART
#         jostartMsg = config.jostart
#         jinfoMsg = config.joinfo + " " + str(prewarn) + "," + str(cycleTime) + "," + str(prescale) + "," + str(target) + "," + str(autoEndFlag)
#         bsNodeId = dbStore.ms_getBSNodeId(nodeId)
#         topic = toDevTopic(nodeId, bsNodeId)
#         publish(config.broker, config.port, topic, jostartMsg)
#         # publish(config.broker, config.port, topic, jinfoMsg)
#         tally.update(timestampNowString(), nodeId, jostartMsg)
        
#     return jobSched

def createAndUseNewJobSched(devId, job, model, material, target, prewarn, prescale, cycletime, schedStart, schedEnd, autoEndStatus, operator):
    #       1      2    3      4         5       6        7         8          9           10        11             12
    args = [devId, job, model, material, target, prewarn, prescale, cycletime, schedStart, schedEnd, autoEndStatus, operator]
    
    jSchedId = dbStore.callCreateJSchedSP(args)
    useJobSched(jSchedId)
    return 0

def sendJoInfoIfRunning(nodeId):
    result = dbStore.callIsMachineRunning(nodeId)
    if (result[0] == config.notRunning):
        return
        
    prewarn = result[config.mr_prewarn]
    cycleTime = result[config.mr_cycleTime]
    prescale = result[config.mr_prescale]
    target = result[config.mr_target]
    autoEndFlag = result[config.mr_autoEndFlag]
    
    jinfoMsg = "JOINFO " + str(prewarn) + "," + str(cycleTime) + "," + str(prescale) + "," + str(target) + "," + str(autoEndFlag)
    bsNodeId = dbStore.ms_getBSNodeId(nodeId)
    topic = toDevTopic(nodeId, bsNodeId)
    
    publish(config.broker, config.port, topic, jinfoMsg)