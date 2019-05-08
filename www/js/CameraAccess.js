
var config;
var database;
var billnum;
var feedback;
var fData;
var finalTrans='';


config = {
    apiKey: "AIzaSyDDL5kjqDbiVqBaAxSzJ7lk2scdpf82wrM",
    authDomain: "expression-db.firebaseapp.com",
    databaseURL: "https://expression-db.firebaseio.com",
    projectId: "expression-db",
    storageBucket: "expression-db.appspot.com",
    messagingSenderId: "587015352878"

  };

  firebase.initializeApp(config);
  console.log(firebase);
  database = firebase.firestore(); 

function add_review_to_db() {
    var urlParams = new URLSearchParams(location.search);
    billnum = urlParams.get('bill_num');
  var joy = feedback["joy"];
  var sorrow = feedback["sorrow"];
  var anger = feedback["anger"];
  var surprise = feedback["surprise"];
  var unlikely = false;
  var veryunlikely = false;
  for(val in feedback){
    if (feedback[val] == "VERY_UNLIKELY"){
      veryunlikely = true;
    } else {
      veryunlikely = false;
      break;
    }
  }
  for(val in feedback){
    if (feedback[val] == "UNLIKELY"){
      unlikely = true;
    } else {
      unlikely = false;
      break;
    }
  }
    if(veryunlikely || unlikely){
    window.location.assign("./ResultSuccess.html?bill_num=" + billnum);
  } else{
    database.collection("Feedback").doc(billnum).set({
      expressions: feedback
  }).then(function(docRef) {
        console.log("Document written with ID: ", billnum);
        window.location.assign("./ResultSuccess.html?bill_num=" + billnum);
    })
    }
  }


function sendToSpeech() {
  billnum = document.getElementById("billNum").value;
  console.log('bill ' + billnum);
  window.location.assign("speechTotext.html?bill_num=" + billnum);
}
  
function sendTodb(){
    var urlParams = new URLSearchParams(location.search);
    billnum = urlParams.get('bill_num');
    console.log(urlParams.get('bill_num'));
    var bill=billnum;
    console.log(billnum);
    var res= document.getElementById("result");
    var val = res.innerText;
    
        database.collection('Feedback').doc(bill).set({
             text: val
        }, { merge: true })
         .then(function() {
          window.location.assign("ResultFailure.html");
         })
         .catch(function(error) {
             console.error("Error writing document: ", error);
         });
}
function billNumGet(){
  var billNumber= document.getElementById("userbill");
  console.log("billdfedf",billNumber.value);
  window.location.assign("webcam.html?bill_num="+billNumber.value);
}


function triggerCamera(){
 var cameraAccessDiv = document.getElementById("CameraAccess");
 if(cameraAccessDiv){
 	cameraAccessDiv.style = "visibility:visible";
 	cameraTrigger();
 }
}

function blobToBase64(blob, cb) {
  var reader = new window.FileReader();
  reader.readAsDataURL(blob); 
  reader.onloadend = function() {           
    cb(reader.result);
  }
}

function canvasToBase64(canvas, cb) {
  canvas.toBlob(function(blob) {
    blobToBase64(blob, cb);
  }, 'image/jpeg');
}

function cameraTrigger(){
	var video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia;

	if(navigator.getUserMedia){
		navigator.getUserMedia({video:true}, streamWebCam, throwError);
	}
}

function streamWebCam (stream) {
	video.srcObject = stream;
	video.play();
	setTimeout(function(){ snap();}, 2000);
}

function throwError(e){
	alert(e.name);
}

function snap() {
	var video = document.getElementById('video');
  var fBSubmit = document.getElementById('fBSubmit');
  var fBRedo = document.getElementById('fBRedo');
	canvas.width = video.clientWidth;
	canvas.height = video.clientHeight;
	var context = canvas.getContext('2d');
	context.drawImage(video, 10, 5, 950, 700);
  fBSubmit.style = "visibility:visible;";
fBRedo.style = "visibility:visible;";
	video.style = "visibility: hidden;width :0px; height:0px;";
  canvas.style="visibility:visible;";
	imageUpload(canvas)


}

function redo(){
	var canvas = document.getElementById('canvas');
	canvas.style="visibility: hidden;";
	var video = document.getElementById('video');
	video.style = "visibility:visible; width: 90%; height: auto;";
	setTimeout(function(){ snap();}, 2000);
	
}

function speechTotext(){   
  if('webkitSpeechRecognition'in window){
      var speech =new webkitSpeechRecognition();
      speech.continuous= true;
      speech.interimResults= true;
      speech.lang="en-IN";
      speech.start();
      speech.onresult= function(event){
          
          var interimTrans='';
          for(var i=event.resultIndex; i<event.results.length; i++){
              var transcript= event.results[i][0].transcript;
              transcript.replace("\n", "<br>");
              if(event.results[i].isFinal){
                  finalTrans += transcript;
              }
              else{
                  interimTrans += transcript;
              }
          }
          r.innerHTML= finalTrans + '<span style="color:#999">' + interimTrans + '</span>';
      };
      speech.onerror= function(event){

      };
  }
  else{
      r.innerHTML=" Browser not supported";
  }
 
}

function imageUpload(canvas) {
    canvasToBase64(canvas, function(b64) {
      b64 = b64.replace('data:image/jpeg;base64,', ''); // remove content type
      request = {
        "requests":[
          {
            "image":{ "content": b64 },
            "features":[
              {
                "type":"FACE_DETECTION",
                "maxResults":1
              }
            ]
          }
        ]
      };
      
      $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCyIeX-vvXPtWefRjNApj4AH7yckQ3K4eA',
        contentType: 'application/json',
        data: JSON.stringify(request),
        processData: false,
        success: function(data){
          output = data;
          var faceData = data.responses[0].faceAnnotations[0];
          console.log('joy: ' + faceData.joyLikelihood);
          console.log('sorrow: ' + faceData.sorrowLikelihood);
          console.log('anger: ' + faceData.angerLikelihood);
          console.log('surprise: ' + faceData.surpriseLikelihood);
          feedback = {
            "joy":faceData.joyLikelihood,
            "sorrow" : faceData.sorrowLikelihood,
            "anger" : faceData.angerLikelihood,
            "surprise" : faceData.surpriseLikelihood
          };
          //add_review_to_db(faceData.joyLikelihood, faceData.sorrowLikelihood, faceData.angerLikelihood, faceData.surpriseLikelihood);
        },
        error: function (data, textStatus, errorThrown) {
          console.log('error: ' + data);
        }
      })
    }) 
}

