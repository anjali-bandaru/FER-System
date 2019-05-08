var database = firebase.firestore();
var angerfeedback = {'joy':"UNLIKELY", 'sorrow':"UNLIKELY","anger":"VERY_LIKELY","surprise":"UNLIKELY"};
var surprisefeedback = {'joy':"UNLIKELY", 'sorrow':"UNLIKELY","anger":"UNLIKELY","surprise":"VERY_LIKELY"};
var joyfeedback = {'joy':"VERY_LIKELY", 'sorrow':"UNLIKELY","anger":"UNLIKELY","surprise":"UNLIKELY"};
var sorrowfeedback = {'joy':"UNLIKELY", 'sorrow':"VERY_LIKELY","anger":"UNLIKELY","surprise":"UNLIKELY"};
addValuesTodb(angerfeedback);
addValuesTodb(surprisefeedback);
addValuesTodb(joyfeedback);
addValuesTodb(sorrowfeedback);
addValuesTodb(joyfeedback);
addValuesTodb(joyfeedback);
function addValuesTodb(feedback){            
    for(i=0;i<5;i++){
         database.collection("Expressions").add(feedback).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
    }
    
};