const CLE = '741c46b9ea714b1282bc72cd1008c2c2'
const SERVEUR = 'https://facer-face.cognitiveservices.azure.com'
const GROUPE = 'ronan-antoine-lora-alain-macron'
const result_mapping = {	// Mapping between Azure faceId and html files
	'f8858bb5-802d-404b-9a16-66ffe3fab013': 'df94c3d1-3dc7-4915-b8ec-e3fb52f85bae.html',	// Ronan
	'6af1db98-bb55-4a83-b955-43372ae87478': 'e86f7002-7be2-4913-8385-1c4e159b3935.html',	// Antoine
	'80bee6bf-3ece-427d-ae7f-a9b73d5498db': 'f4fe156e-19d3-4903-a33c-5b38966f9b8d.html',	// Lora
	'a345f05d-9181-410f-afc6-941fe4cbe92d': 'f8db36de-089b-47e4-b6bd-8f8bf3e43524.html',	// Alain
	'5a3c1d44-2ba1-40f8-ab98-e16330268682': '2509d676-e49f-4c9e-b799-f815d1bf70a2.html',	// Emmanuel
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
	console.log('/upload-photos called');
	const uploadInfo = req.files.map(file => {
		return {
			sourceName: file.originalname,
			newName: file.filename
		};
	});
	let path = './uploaded-images/' + uploadInfo[0].newName;
	identify(req, res, path);
});

function identify(req, res, path) {
	console.log('identify(' + path + ') called');
	const buffer = fs.readFileSync(path, null, 'r')

	const options = {
		url: SERVEUR + '/face/v1.0/detect?recognitionModel=recognition_02',
		method: 'POST',
		headers: {
			'Ocp-Apim-Subscription-Key': CLE,
	        'Content-Type': 'application/octet-stream',
    	    'Accept': 'application/json'
		},
		body: buffer
	}
	// step 1: detect
	request(options, (err, response) => {
		if (err) {
			console.error('err: ' + err);
			res.send('error1');
			return;
		}
		console.log('detect: ' + response.body);
		const visage_id = JSON.parse(response.body)[0].faceId;
		console.log('visage_id: ' + visage_id);
		const optionsIden = {
			url: SERVEUR + '/face/v1.0/identify',
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
		// step 2: identify
		request(optionsIden, (err, finalResponse) => {
			if (err) {
				console.error('err: ' + err);
				res.send('error2');
				return;
			}
			console.log('identify: ' + finalResponse.body);
			const finded = JSON.parse(finalResponse.body)[0].candidates[0].personId;
			console.log('finded: ' + finded);
			let result = result_mapping[finded];
			console.log('returning: ' + result.toString('utf8'));
			res.send([result.toString('utf8')]);
		})
	})
}

app.get('/list-images', (req, res) => {
	console.log('/list-images called');
	fs.readdir('./uploaded-images/', (err, files) => {
		res.send(files);
	});
});

app.get('/files', function (req, res, next) {
  var options = {
    root: path.join(__dirname, 'clients-files'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.query['file'];
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

app.listen(3000, () => console.log('Listening on port 3000.'));
