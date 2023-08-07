import sys
import os
import json

msConfig = {
	'ip': '',
	'ssid': '',
	'pass': '',
	'bssid': '',
	'mac': '',	
}

os.system('sudo python /home/lsp_user/gemba/getConfig.py')

with open('/home/lsp_user/serverInfo.txt', 'r') as file_object:
	for line in file_object:
		if "bssid=" in line:
			msConfig["bssid"] = ((line.strip()).split('='))[1]
		elif "ssid=" in line:
			msConfig["ssid"] = ((line.strip()).split('='))[1]
		elif "pass=" in line:
			msConfig["pass"] = ((line.strip()).split('='))[1]
		elif "ip=" in line:
			msConfig["ip"] = ((line.strip()).split('='))[1]
		elif "mac=" in line:
			msConfig["mac"] = ((line.strip()).split('='))[1]

print(json.dumps(msConfig))