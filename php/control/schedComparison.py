#!/usr/bin/python
# import os
# import logging
# import config
import dbStore
# import methods
import sys
# import tally

#sys.argv[1] - device id | sys.argv[2] - schedule id
schedId = int(sys.argv[2])
result = dbStore.callGetRunningJob(int(sys.argv[1]))
if result:
    if result[0] != schedId:
        #device already has a schedule that is not the same with the provided schedule id
        print ("false")
    else:
    	print ("true")
else:
	print ("false")