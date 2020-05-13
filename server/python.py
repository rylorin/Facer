import requests
import json
from pprint import pprint
import sys

#print(sys.argv);

CLE = '16edd30697fa4fd380600f112854bef7'
SERVEUR = 'https://tester-facer-recognition.cognitiveservices.azure.com'

GROUPE = 'alice-bob-carol-dave-antoine'
PERSONNES = [ 'alice', 'bob', 'carol', 'dave', 'antoine' ]
ATTENTE = 26

reponse = requests.post(
	url = 'https://tester-facer-recognition.cognitiveservices.azure.com/face/v1.0/detect',
	headers = {
        'Ocp-Apim-Subscription-Key': CLE,
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/json'
    },
    params = { 'recognitionModel': 'recognition_02' }, 
    data = open(sys.argv[1], 'rb').read()
)
visages = reponse.json()
print(len(visages))
if (len(visages) != 1):
	print('Pas de visage')
else:
	visages_id = [ visage['faceId'] for visage in visages ]
	#print(visages)

	reponse = requests.post(
	    url = 'https://tester-facer-recognition.cognitiveservices.azure.com/face/v1.0/identify',
	    headers = { 'Ocp-Apim-Subscription-Key': CLE },
	    json = { 
	        'personGroupId' : GROUPE,
	        'faceIds': visages_id,
	        "maxNumOfCandidatesReturned": 1,
	        "confidenceThreshold": 0.5 
	    }
	)

	#print(reponse.json()[0]['candidates'][0]['personId'])



	file = open("clients.json","r")
	txt = file.read()
	json = json.loads(txt)
	for person in json['people']:
		if person['id'] == reponse.json()[0]['candidates'][0]['personId']:
			print(person['name'])
	#print(json['people'])

"""noms = dict.fromkeys(visages_id, '?')
for identite in reponse.json():        
    if len(identite['candidates']) > 0:
        noms[identite['faceId']] = "%s %d%%" % (ids[identite['candidates'][0]['personId']], identite['candidates'][0]['confidence']*100)"""

#pprint(noms)


sys.stdout.flush()