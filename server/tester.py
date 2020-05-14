import json

file = open("clients.json","r")
txt = file.read()
json = json.loads(txt)
for person in json['people']:
	if person['id'] == "fddcd762-eebe-49bc-a994-2167ee6a0471":
		print(person['name'])
#print(json['people'])
#print(json['people'][0])