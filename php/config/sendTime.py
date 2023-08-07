from datetime import datetime
from mysql.connector import errorcode
import mysql.connector as MySQLdb
import paho.mqtt.publish as mpublish


def connect():
    try:
        db = MySQLdb.connect(user='gemba_user',
            password='CHATEAU_P3_RHQ',
            host='localhost',
            database='gemba_db')
    except MySQLdb.Error as e:
        try:
            print("MySQL Error %s" % e.args[1])
        except IndexError:
            print("MySQL Error: %s" % str(e))

    return db


def getDeviceAndBSList ():
    db = None
    cursor = None
    devicelist = None

    db = connect()
    cursor = db.cursor()

    func = "SELECT node_id `nodeid`, macAddress `basestation` FROM device LEFT JOIN list_device_cluster ON device.deviceCluster_id = list_device_cluster.id WHERE device.state = 1 AND device.isArchived = 0"

    try:
        result_args = cursor.execute(func)
        devicelist = cursor.fetchall()
        db.commit()
    except MySQLdb.Error as e:
        db.rollback()
    else:
        pass
    finally:
        cursor.close()
        db.close()

    return devicelist


def publish(broker, port, topic, msg):
    # if isPortSecure(port):
    #     # set TLS
    #     mpublish.single(topic, payload=msg, qos=1, hostname=broker, port=port, keepalive=60, tls={'ca_certs': "<ca_certs>", 'certfile': config.tlsCertFile, 'keyfile': "<keyfile>"})
    # else:
    #     # do not set TLS
    #     mpublish.single(topic, payload=msg, qos=1, hostname=broker, port=port, keepalive=60)
    print(topic + ' ' + msg)


def getTimeString():
	return 'DATE ' + datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S')


devicelist = getDeviceAndBSList()
for item in devicelist:
	topic = "GEMBA/INPUTDEVICE/COMMAND/" + item[1] + "/" + item[0]
	msg = getTimeString()
	publish('localhost', 1883, topic, msg)

