#!/usr/bin/python
# import os
# import logging
# import config
import dbStore
# import methods
import sys
# import tally

result = dbStore.callGetRunningJob(int(sys.argv[1]))
if result:
	print ('true')
else:
	print ('false')