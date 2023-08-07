import os
import sys

ipKnownList = sys.argv[1]
os.system('sudo python /home/lsp_user/gembaMS/msBrokerFinder.py BCAST ' + ipKnownList)