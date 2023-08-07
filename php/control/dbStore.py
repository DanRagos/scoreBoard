#!/usr/bin/python
import mysql.connector as MySQLdb
from mysql.connector import errorcode
import config

def connect():
    try:
        db = MySQLdb.connect(user=config.dbuser,
            password=config.dbpasswd,
            host=config.dbhost,
            database=config.dbname)
    except MySQLdb.Error as e:
        pass

    return db

def createArgString(args):
    count = 0
    num = len(args)
    argList = []
    while count < num:
        argList.append("%s")
        count += 1
    
    return ', '.join(argList)
    
def executeFunction(functionName, args):
    db = connect()
    cursor = db.cursor()
    try:
        argString = createArgString(args)
        func = "SELECT " + functionName + "(" + argString + ")"
        cursor.execute(func, args)
        db.commit()
    except MySQLdb.Error as e:
        db.rollback()
        print(cursor._last_executed)
    cursor.close()
    db.close()

def executeFunctionReturnOne(functionName, args):
    db = connect()
    cursor = db.cursor()
    try:
        argString = createArgString(args)
        func = "SELECT " + functionName + "(" + argString + ")"
        # print(func)
        cursor.execute(func, args)
        results = cursor.fetchone()
        db.commit()
    except MySQLdb.Error as e:
        db.rollback()
        print(cursor._last_executed)
    finally:
        cursor.close()
        db.close()
    return results

def ms_getBSNodeId(nodeId):
    args = [nodeId]
    funcName = "ms_getBSNodeId"
    results = executeFunctionReturnOne(funcName, args)
    node = results[0]
    return node

def getNode(devId):
    args = [devId]
    funcName = "server_getNode"
    results = executeFunctionReturnOne(funcName, args)
    node = results[0]
    return node

def callCreateJSchedSP(args):
    jSchedId = -1
    db = connect()
    cursor = db.cursor()

    try:
        # func = "SELECT create_jobSchedule(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        func = "SELECT create_jobSchedule_schedPage(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        result_args = cursor.execute(func, args)
        jSchedId = cursor.fetchone()
        db.commit()
    except MySQLdb.Error as e:
        print("Failed")
    finally:
        cursor.close()
        db.close()

    return jSchedId[0]

def callGetJobSchedById(jSchedId):
    db = connect()
    cursor = db.cursor()
    args = [jSchedId]
    jobSched = []
    try:
        result_args = cursor.callproc('getJobScheduleById', args)
    except MySQLdb.Error as e:
        print("Failed")
    finally:
        for results in cursor.stored_results():
            jobSched = results.fetchone()
        cursor.close()
        db.close()
    
    return jobSched

def callGetRunningJob(devId):
    db = connect()
    cursor = db.cursor()
    args = [devId]
    jobInfo = []
    try: 
        result_args = cursor.callproc('getRunningJob', args)
    except MySQLdb.Error as e:
        print("Failed")
    finally:
        for results in cursor.stored_results():
            jobInfo = results.fetchone()
        cursor.close()
        db.close()

    return jobInfo

def callisJobNotDeleted(schedId):
    retval = 0
    args = [schedId]
    funcName = "mobile_isJobNotDeleted"
    results = executeFunctionReturnOne(funcName, args)
    if (results[0] <= 0):
        #deleted
        retval = 0
    else:
        #not deleted
        retval = 1

    return retval

    # retval = ''
    # db = connect()
    # cursor = db.cursor()
    # args = [schedId]
    # results = []
    # try:
    #     func = "SELECT mobile_isJobNotDeleted(%s)"
    #     result_args = cursor.execute(func, (args,))
    #     results = cursor.fetchone()
    #     db.commit()
    #     if (results[0] <= 0):
    #         #deleted
    #         retval = 0
    #     else:
    #         #not deleted
    #         retval = 1
    # except MySQLdb.Error as e:
    #     print("Failed")
    # finally:
    #     cursor.close()
    #     db.close()

    # return retval

# not used
def insertData(dtime, dnode, dstat):
    if len(dtime)<23:
        return malformed

    args = [dtime[0:19], dstat, dnode,int(dtime[20:])]
    funcName = "server_insertData"
    executeFunction(funcName, args)

def checkExist(nodeID):
    yes = 0
    args = [nodeID]
    funcName = "server_checkExist"
    results = executeFunctionReturnOne(funcName, args)
    yes = results[0]
    return yes

def registerDevice(nodeID, nodeType, noderefcode):
    args = [nodeID, nodeType, noderefcode]
    funcName = "server_registerDevice"
    executeFunction(funcName, args)

def getDevId(node):
    args = [node]
    funcName = "server_getDevId"
    results = executeFunctionReturnOne(funcName, args)
    devId = results[0]
    return devId

def updateDevState(state, nodeId):
    args = [state, nodeId]
    funcName = "server_updateDevState"
    executeFunction(funcName, args)
    
def callJobStartedSP(jSchedId):
    retval = ''
    db = connect()
    cursor = db.cursor()
    args = [jSchedId,]
    try:
        func = "SELECT job_started('%s')"
        result_args = cursor.execute(func, (jSchedId,))
        db.commit()
    except MySQLdb.Error as e:
        print("Failed")
    results = cursor.fetchone()
    cursor.close()
    db.close()
    if results[0] == 0:
        print("fail")
        retval = 0
    else:
        print("success")
        retval = 1
    return retval
    
def callIsMachineRunning(nodeId):
    db = connect()
    cursor = db.cursor()
    args = [nodeId]
    results = []
    try: 
        result_args = cursor.callproc('isMachineRunning', args)
    except MySQLdb.Error as e:
        print("Failed")
    results = cursor.fetchone()
    cursor.close()
    db.close()
    
    return results

def callsetDeviceState(devId):
    retval = 0
    db = connect()
    cursor = db.cursor()
    args = [devId]
    results = []
    try:
        func = "SELECT mobile_setDeviceState(%s)"
        result_args = cursor.execute(func, (args,))
        db.commit()
        results = cursor.fetchone()
        if (results[0] <= 0):
            retval = 0
        else:
            retval = 1
    except MySQLdb.Error as e:
        print("Failed")
    cursor.close()
    db.close()
    return retval

def callunsetDeviceState(nodeId):
    retval = 0
    db = connect()
    cursor = db.cursor()
    args = [nodeId]
    results = []
    try:
        func = "SELECT mobile_unsetDeviceState(%s)"
        result_args = cursor.execute(func, (args,))
        db.commit()
        results = cursor.fetchone()
        if (results[0] <= 0):
            retval = 0
        else:
            retval = 1
    except MySQLdb.Error as e:
        print("Failed")
    cursor.close()
    db.close()
    return retval

def callTriggerActivated(nodeId, timestamp, millis):
    args = [nodeId, timestamp, millis]
    funcName = "trigger_activated"
    executeFunction(funcName, args)

def callJobEnded(nodeId):
    args = [nodeId]
    funcName = "job_ended"
    executeFunction(funcName, args)

def callDowntimeStarted(dtSource, nodeId, timestamp):
    args = [dtSource, nodeId, timestamp]
    funcName = "downtime_started"
    executeFunction(funcName, args)
    # updateDB("SELECT downtime_started(" + str(f_dtSource) + ", '" + str(f_nodeId) + "', '" + str(f_timestamp) + "')")

def callDowntimeEnded(dtSource, nodeId, timestamp):
    args = [dtSource, nodeId, timestamp]
    funcName = "downtime_ended"
    executeFunction(funcName, args)
    # updateDB("SELECT downtime_ended(" + str(f_dtSource) + ", '" + str(f_nodeId) + "', '" + str(f_timestamp) + "')")

def callIncrementCountValue(nodeId):
    args = [nodeId]
    funcName = "increment_countValue"
    executeFunction(funcName, args)
    # updateDB("SELECT increment_countValue('" + f_nodeId + "')")

def callIncrementRejectValue(nodeId):
    args = [nodeId]
    funcName = "increment_rejectValue"
    executeFunction(funcName, args)
    # updateDB("SELECT increment_rejectValue('" + f_nodeId + "')")

def call_delete_jobSchedule(schedId):
    # print("dbStore.call_delete_jobSchedule")
    args = [schedId]
    funcName = "delete_jobSchedule"
    executeFunction(funcName, args)