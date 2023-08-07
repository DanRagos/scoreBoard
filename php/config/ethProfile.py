#!/usr/bin/python
from mysql.connector import errorcode
import mysql.connector as MySQLdb
import os
import re
import string
import subprocess
import sys

# set <static/dhcp> <ip> <gateway> <dns>
# getInfo
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

def getDBClusterList ():
    db = None
    cursor = None
    clusterList = None

    db = connect()
    cursor = db.cursor()

    func = "SELECT ipAddress FROM list_device_cluster WHERE isArchived = 0 AND id > 1"

    try:
        result_args = cursor.execute(func)
        clusterList = cursor.fetchall()
        db.commit()
    except MySQLdb.Error as e:
        db.rollback()
    else:
        pass
    finally:
        cursor.close()
        db.close()

    return clusterList


if sys.argv[1] == 'set':
	preamble="hostname\nduid\npersistent\noption rapid_commit\noption domain_name_servers, domain_name, domain_search, host_name\n"
	preamble=preamble + "option classless_static_routes\noption interface_mtu\nrequire dhcp_server_identifier\nslaac private\nnoipv4ll\n"
	content=""

	if sys.argv[2] == 'static':
		content="interface enp2s0\n"
		content=content + "static ip_address=" + sys.argv[3] + '/24\n'
		content=content + "static routers=" + sys.argv[4] + '\n'
		content=content + "static domain_name_servers=" + sys.argv[5] + '\n'

	f = open("/etc/dhcpcd.conf", 'w+')
	f.write(preamble)
	f.write(content)
	f.close()

	os.system("sudo chmod 777 /etc/dhcpcd.conf")
	os.system("sudo systemctl restart dhcpcd")

	line1 = "Description='A basic static ethernet connection'" + "\n"
	line2 = "Interface=enp2s0" + "\n"
	line3 = "Connection=ethernet" + "\n"
	line4 = "IP=" + sys.argv[2] + "\n"
	line8 = "ExcludeAuto=no"

	if sys.argv[2] == 'static':
		line5 = "Address=('" + sys.argv[3] + "/24')" + "\n"
		line6 = "Gateway='" + sys.argv[4] + "'" + "\n"
		line7 = "DNS=('" + sys.argv[5] + "' '8.8.8.8')" + "\n"
	else:
		line5 = "#Address=" + "\n"
		line6 = "#Gateway=" + "\n"
		line7 = "#DNS=" + "\n"

	f = open("/etc/netctl/enp2s0", 'w')
	f.write(line1)
	f.write(line2)
	f.write(line3)
	f.write(line4)
	f.write(line5)
	f.write(line6)
	f.write(line7)
	f.write(line8)
	f.close()

	os.system("sudo chmod 777 /etc/netctl/enp2s0")

	# D Update serverInfo.txt
	cmd = "sudo python /home/lsp_user/gemba/getConfig.py"
	res = (subprocess.check_call(cmd,
	                        stdout=subprocess.PIPE,
	                        shell=True))
	# D Send new IP to BS
	retList = getDBClusterList()
	retVal = []
	for i in range(0,len(retList)):
		# print("Send to " + str(retList[i][0]))
		cmd = "sudo python /home/lsp_user/gembaMS/msBrokerFinder.py ADD " + str(retList[i][0])
		res = (subprocess.check_call(cmd,
		                        stdout=subprocess.PIPE,
		                        shell=True))

	os.system("sudo reboot")

elif sys.argv[1] == 'getInfo':
	ipmode = 'ipmode=dhcp\n'
	addr = '\n'
	gw = '\n'

	for line in open("/etc/dhcpcd.conf",'r').readlines():
		if "interface enp2s0" in line:
			ipmode = 'ipmode=static\n'
		elif "static ip_address=" in line:
			addr = line
		elif "static routers=" in line:
			gw = line

	print (ipmode + addr + gw)
