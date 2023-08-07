import sys
import os
import json

fileUrl = '/home/lsp_user/foundBasestations.txt'
bsCollection = []

with open(fileUrl, 'r') as file_object:
	for line in file_object:
		bsCollection.append(json.loads(line.strip()))

print(json.dumps(bsCollection))