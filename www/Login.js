var database;
var config = {
     apiKey: "",
    authDomain: "auth-db-9a87f.firebaseapp.com",
    databaseURL: "https://auth-db-9a87f.firebaseio.com",
    projectId: "auth-db-9a87f",
    storageBucket: "auth-db-9a87f.appspot.com",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);
  console.log(firebase);
  database = firebase.firestore(); 

function validate(){
    var usernameEle = document.getElementById("username");
    var passwordEle = document.getElementById("password")
    var username = usernameEle.value;
    var password = passwordEle.value;
    var errorClassName = "credFailed";
    //var password = document.getElementById("password").value;
    var collectionName = "UserLogin";
    if(username == "" && password == ""){
      //window.alert("Please enter username and password");
      message1 = "Please enter Username";
      message2 = "Please enter Password";
      divele1 = document.getElementById("usernameFailed");
      divele2 = document.getElementById("passwordFailed");
      handleCredFailed(message1,divele1,usernameEle,errorClassName);
      handleCredFailed(message2,divele2,passwordEle,errorClassName);
    } else if(username == ""){
      //window.alert("Please enter username");
      message1 = "Please enter username";
      divele1 = document.getElementById("usernameFailed");
      handleCredFailed(message1,divele1,usernameEle,errorClassName);
    } else if(password == ""){
      message1 = "Please enter password";
      divele1 = document.getElementById("passwordFailed");
      handleCredFailed(message1,divele1,passwordEle,errorClassName);
      //window.alert("Please enter password");
    } else {
      validateInput(username,password,collectionName);
    }
 }

 function validateInput(username, password, collectionName){
    var inputele,divele,message;
    var errorClassName = "credFailed";
    var docRef = database.collection(collectionName).doc(username);
    docRef.get().then(function(doc) {
    // var credFailed = document.getElementById("credentialFailure");
    if (doc.exists) {
      var data = doc.data();
      var userpwd = data.password;
      if(password == userpwd){
        window.location.assign("./Review.html");
      } else {
          message = "Incorrect password";
          divele = document.getElementById("passwordFailed");
          inputele = document.getElementById("password");
            handleCredFailed(message,divele,inputele,errorClassName);
      }
      //console.log("Document data:", doc.data());
    } else {
      message = "Incorrect username";
      divele = document.getElementById("usernameFailed");
      inputele = document.getElementById("username");
      handleCredFailed(message,divele,inputele,errorClassName);
    }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
 }

function handleCredFailed(message,divele,inputele,className){
  if(divele){
    divele.innerHTML = message;
    divele.classList.add(className);  
  }
  if(inputele){
    inputele.classList.add(className);
    inputele.focus();
  }
  window.alert(message);
}

function removeErrorDiv(divid,className){
  var errorDiv = document.getElementById(divid);
  var target = window.event.target;
  if(errorDiv){
    errorDiv.innerHTML = "";
  }
  if(target){
    target.classList.remove(className);
  }
}