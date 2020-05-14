const CLE = '16edd30697fa4fd380600f112854bef7';
const SERVEUR = 'https://tester-facer-recognition.cognitiveservices.azure.com';

const GROUPE = 'alice-bob-carol-dave-antoine';
const PERSONNES = [ 'alice', 'bob', 'carol', 'dave', 'antoine' ];
const ATTENTE = 26;

const http = require('request');



const express = require('express');
const server_html = express();
const fs = require('fs');
const multer  = require('multer');
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

app.post('/upload-photos', upload.array('photos'), function (req, res) {
  console.log('/upload-photos');
  const uploadInfo = req.files.map(file => {

    return {
      sourceName: file.originalname,
      newName: file.filename
    };
  });



  console.log(uploadInfo[0].newName);

  let path = 'uploaded-images/'+uploadInfo[0].newName;
  console.log('Path : '+path);

    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["python.py",path]);
    console.log('Calling python script');
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString('utf8'));
      let path = data.toString('utf8');
      console.log('Retour Python : '+path);
      res.send([path])
      //res.send([data.toString('utf8')]);
      //res.send(uploadInfo);
      
    });
  //res.send(uploadInfo);
});

function test(){
	console.log('test');
	

}

app.get('/test-reco',(req, res) => {
  
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["python.py",'uploaded-images/49ad39fe-2ba4-43f5-92c1-9f289fe12a7c1589382152875']);
    console.log('hum');
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString('utf8'));
;
      //res.send(data.toString('utf8'));
      
    });
  //console.log(value);




  //console.log(send);
  //res.send('bwa');


});

function searcherPython(){

  let value = "d";
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["python.py"]);
  console.log('hum');
  pythonProcess.stdout.on('data', (data) => {
      //console.log(data.toString('utf8'));
      return(data.toString('utf8'));
      
  });
  console.log(value);
}

app.get('/list-images', (req, res) => {
  fs.readdir('./uploaded-images', (err, files) => {
    res.send(files);
  });
});

app.get('/files', function(request,response){
  console.log(request.query['file']);

  response.sendfile('./clients-files/'+request.query['file']+'.html');
});



app.listen(3000, () => console.log('Listening on port 3000. Note this is a simple sample uploader and does not have the proper security checks for a production app.'));
