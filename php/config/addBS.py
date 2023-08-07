import sys
import subprocess

ip = sys.argv[1]
cmd = "sudo python /home/lsp_user/gembaMS/msBrokerFinder.py ADD " + ip
res = (subprocess.Popen(cmd,
                        stdout=subprocess.PIPE,
                        shell=True))

# print (res.stdout.read())
print((res.stdout.readlines()[-1]).decode('utf-8').strip())