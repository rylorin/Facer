const https = require("https");
console.log('hey');

const SERVEUR = 'https://tester-facer-recognition.cognitiveservices.azure.com';
const CLE = '16edd30697fa4fd380600f112854bef7';
const GROUPE = 'alice-bob-carol-dave-antoine';

function train(){
   var delete_options = {
      host: 'tester-facer-recognition.cognitiveservices.azure.com',
      port: '443',
      path: '/face/v1.0/persongroups/alice-bob-carol-dave-antoine/train',
      method: 'POST',
      headers: {
          'Ocp-Apim-Subscription-Key': CLE
          
      }
  };

let deleter =  https.request(delete_options,function(res) {
  res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
});

deleter.write('');
deleter.end();
}

function search(){

const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["python.py",arg1 = "ahh"]);
console.log('hum');
pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString('utf8'));
});

}



search();
//, arg1, arg2, ...