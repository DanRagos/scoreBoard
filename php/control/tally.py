#/usr/bin/python2
import os
import logging
import dbStore
import config


logging.basicConfig(format = config.logformat, level = config.loglevel)
log = logging.getLogger(__name__)

NODOWNTIME = config.talCdt_noDowntime
DOWNTIME1 = config.talCdt_downtime1
DOWNTIME2 = config.talCdt_downtime2
WATCHDOG = config.talCdt_watchDogDT

def fileName(nodeId):
    return config.tallyLoc + nodeId + '.txt'
    
def isRelevant(msg):
    return msg in config.tal_relevantStats
    
def extractUpToSeconds(timestring):
    if len(timestring) < 23:
        log.error("Malformed timeString. Failed")
        return ""
    return timestring[0:19]

def extractMillis(timestring):
    if len(timestring) < 23:
        log.error("Malformed timeString. Failed")
        return 0
    return int(timestring[20:])
    
def extractValue(line, removeMe):
    modifyString = line.replace(removeMe, '')
    modifyString = modifyString.replace('\r\n', '')
    return int(modifyString)
    
def update(timeNow, nodeId, msg):
    if not isRelevant(msg):
        log.debug("EVENT not accepted")
        return
    
    log.debug(msg)

    status_inhibit = 0
    status_dt1 = 0
    status_dt2 = 0
    status_wdt = 0
    
    current_dt = 0
    priority = 0
    
    filename = fileName(nodeId)

    if os.path.isfile(filename):
        f = open(filename, 'r')
        for line in f:
            if line.find("INHIBIT=") != -1:
                status_inhibit = extractValue(line, "INHIBIT=")
            elif line.find("DT1=") != -1:
                status_dt1 = extractValue(line, "DT1=")
            elif line.find("DT2=") != -1:
                status_dt2 = extractValue(line, "DT2=")
            elif line.find("WDT=") != -1:
                status_wdt = extractValue(line, "WDT=")     
            elif line.find("current_dt=") != -1:
                current_dt = extractValue(line, "current_dt=")
            elif line.find("priority=") != -1:
                priority = extractValue(line, "priority=")
        f.close()
    
    timestamp = extractUpToSeconds(timeNow)
    millis = extractMillis(timeNow)
    
    if msg == config.trigger:
        dbStore.callTriggerActivated(nodeId, timestamp, millis)
        current_dt = 0

    elif msg == config.jostop:
        dbStore.callDowntimeEnded(current_dt, nodeId, timestamp)
        current_dt = 0
        dbStore.callJobEnded(nodeId)

    elif msg == config.output:
        log.debug("config.output")
        if status_inhibit == 0 and status_dt1 == 0 and status_dt2 == 0 and status_wdt == 0:
            dbStore.callIncrementCountValue(nodeId)

    elif msg == config.reject:
        log.debug("config.reject")
        log.debug(status_inhibit + status_dt1 + status_dt2 + status_wdt)
        if status_inhibit == 0: #
            dbStore.callIncrementRejectValue(nodeId)

    elif msg == config.inhibitOn:
        status_inhibit = 1

    elif msg == config.inhibitOff:
        status_inhibit = 0

    elif msg == config.downtime1On:
        status_dt1 = 1
        
        if status_dt2 == 0:
            priority = 1
        elif status_dt2 == 1 and priority == 0:
            priority = 2

    elif msg == config.downtime1Off:
        status_dt1 = 0
        
        if priority == 1:
            priority = 0

    elif msg == config.downtime2On:
        status_dt2 = 1
        
        if status_dt1 == 0:
            priority = 2
        elif status_dt1 == 1 and priority == 0:
            priority = 1

    elif msg == config.downtime2Off:
        status_dt2 = 0
        
        if priority == 2:
            priority = 0

    elif msg == config.watchDogDTOn:
        status_wdt = 1

    elif msg == config.watchDogDTOff:
        status_wdt = 0
    
    # DOWNTIME CONDITIONS
        # current_dt Values
        # 0 No Downtime
        # 1 DT1
        # 2 DT2
        # 3 WDT
        # Heirarchy
        # (DT1=DT2) > WDT > NoDT
        # on an overlap of DT1 and DT2 whoever is early has priority
        # the latecomer needs to wait for the early one to finish 
        # before starting
    if msg == config.jostop:
        log.info("JOB ENDED")
    elif current_dt == 0:
        if status_dt1 == 1 and priority != 2:
            current_dt = 1
            dbStore.callDowntimeStarted(1, nodeId, timestamp)
        elif status_dt2 == 1 and priority != 1:
            current_dt = 2
            dbStore.callDowntimeStarted(2, nodeId, timestamp)
        elif status_wdt == 1:
            current_dt = 3
            dbStore.callDowntimeStarted(3, nodeId, timestamp)
    elif current_dt == 1:
        if status_dt1 == 0 and status_dt2 == 1:
            current_dt = 2
            dbStore.callDowntimeEnded(1, nodeId, timestamp)
            dbStore.callDowntimeStarted(2, nodeId, timestamp)
        elif status_dt1 == 0 and status_wdt == 1:
            current_dt = 3
            dbStore.callDowntimeEnded(1, nodeId, timestamp)
            dbStore.callDowntimeStarted(3, nodeId, timestamp)
        elif status_dt1 == 0:
            current_dt = 0
            dbStore.callDowntimeEnded(1, nodeId, timestamp)
    elif current_dt == 2:
        if status_dt2 == 0 and status_dt1 == 1:
            current_dt = 1
            dbStore.callDowntimeEnded(2, nodeId, timestamp)
            dbStore.callDowntimeStarted(1, nodeId, timestamp)
        elif status_dt2 == 0 and status_wdt == 1:
            current_dt = 3
            dbStore.callDowntimeEnded(2, nodeId, timestamp)
            dbStore.callDowntimeStarted(3, nodeId, timestamp)
        elif status_dt2 == 0:
            current_dt = 0
            dbStore.callDowntimeEnded(2, nodeId, timestamp)
    elif current_dt == 3:
        if status_dt1 == 1 and priority != 2:
            current_dt = 1
            dbStore.callDowntimeEnded(3, nodeId, timestamp)
            dbStore.callDowntimeStarted(1, nodeId, timestamp)
        elif status_dt2 == 1 and priority != 1:
            current_dt = 2
            dbStore.callDowntimeEnded(3, nodeId, timestamp)
            dbStore.callDowntimeStarted(2, nodeId, timestamp)
        elif status_wdt == 0:
            current_dt = 0
            dbStore.callDowntimeEnded(3, nodeId, timestamp)
    
    config_inhibit = "INHIBIT=" + str(status_inhibit) + '\r\n'
    config_dt1 = "DT1=" + str(status_dt1) + '\r\n' 
    config_dt2 = "DT2=" + str(status_dt2) + '\r\n'
    config_wdt = "WDT=" + str(status_wdt) + '\r\n'
    config_current_dt = "current_dt=" + str(current_dt) + '\r\n'
    config_priority = "priority=" + str(priority) + '\r\n'

    f = open(filename, 'w+')

    f.write(config_inhibit)
    f.write(config_dt1)
    f.write(config_dt2)
    f.write(config_wdt)
    f.write(config_current_dt)
    f.write(config_priority)

    f.close()
    log.debug("exiting updatetally")