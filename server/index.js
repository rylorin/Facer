const CLE = '741c46b9ea714b1282bc72cd1008c2c2'
const SERVEUR = 'https://facer-face.cognitiveservices.azure.com'
const GROUPE = 'ronan-antoine-lora-alain-macron'
const people = {
	antoine: "6af1db98-bb55-4a83-b955-43372ae87478",
	ronan: "f8858bb5-802d-404b-9a16-66ffe3fab013",
	lora: "80bee6bf-3ece-427d-ae7f-a9b73d5498db",
	alain: "a345f05d-9181-410f-afc6-941fe4cbe92d",
	macron: "5a3c1d44-2ba1-40f8-ab98-e16330268682"
}

const request = require('request');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: 'uploaded-images/',
	filename(request, file, callback) {
		const extension = path.extname(file.originalname);
		callback(null, path.basename(file.originalname, extension) + Date.now() + extension);
	}
});
const upload = multer({ storage: storage });

const app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/images', express.static('uploaded-images'));

app.post('/upload-photos', upload.array('photos'), function(req, res) {
	console.log('/upload-photos');
	const uploadInfo = req.files.map(file => {
		return {
			sourceName: file.originalname,
			newName: file.filename
		};
	});
	console.log(uploadInfo[0].newName);

	let path = 'uploaded-images/' + uploadInfo[0].newName;
	console.log('Path : ' + path);

	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python3', ["python.py", path]);
	console.log('Calling python script');
	pythonProcess.stdout.on('data', (data) => {
		console.log(data.toString('utf8'));
		let path = data.toString('utf8');
		console.log('Retour Python : ' + path);
		res.send([path])
		//res.send([data.toString('utf8')]);
		//res.send(uploadInfo);
	});
	//res.send(uploadInfo);
});

app.get('/test-reco', (req, res) => {


	const buffer = fs.readFileSync('./uploaded-images/49ad39fe-2ba4-43f5-92c1-9f289fe12a7c1589382152875.jpg', null, 'r')

	const options ={
		url: SERVEUR+'/face/v1.0/detect?recognitionModel=recognition_02',
		method: 'POST',
		headers: {
			'Ocp-Apim-Subscription-Key': CLE,
	        'Content-Type': 'application/octet-stream',
    	    'Accept': 'application/json'
		},
		body: buffer
	}

	request(options, (err, response) => {
		if (err) { return }
		const visage_id = JSON.parse(response.body)[0].faceId
		console.log(visage_id)
		const optionsIden = {
			url: SERVEUR+'/face/v1.0/identify',
			method: 'POST',
			headers: {
				'Ocp-Apim-Subscription-Key': CLE
			},
			body: JSON.stringify({
				personGroupId: GROUPE,
				faceIds: [visage_id],
				maxNumOfCandidatesReturned: 1,
				confidenceThreshold: 0.5			
			})
		}	

		request(optionsIden, (_err, finalResponse) => {
			const finded = JSON.parse(finalResponse.body)[0].candidates[0].personId
			keys = Object.keys(people)
			console.log(keys.find((key) => people[key] == finded))
		})

	})

});



// reponse = requests.post(
//     url='https://facer-face.cognitiveservices.azure.com/face/v1.0/detect',
//     headers={
//         'Ocp-Apim-Subscription-Key': CLE,
//         'Content-Type': 'application/octet-stream',
//         'Accept': 'application/json'
//     },
//     params={'recognitionModel': 'recognition_02'},
//     data=open(sys.argv[1], 'rb').read()
// )
// visages = reponse.json()

function searcherPython() {
	let value = "d";
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python', ["python.py"]);
	console.log('hum');
	pythonProcess.stdout.on('data', (data) => {
		//console.log(data.toString('utf8'));
		return (data.toString('utf8'));
	});
	console.log(value);
}

app.get('/list-images', (req, res) => {
	fs.readdir('./uploaded-images', (err, files) => {
		res.send(files);
	});
});

app.get('/files', function(request, response) {
	console.log(request.query['file']);
	response.sendFile('./clients-files/' + request.query['file'] + '.html');
});

app.listen(3000, () => console.log('Listening on port 3000. Note this is a simple sample uploader and does not have the proper security checks for a production app.'));
