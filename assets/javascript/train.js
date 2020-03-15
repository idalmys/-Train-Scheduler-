
$(document).ready(function() { 
    $("#DivError").hide();
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA_hm_g5ldD2sSsquS8oOB7L17tOlSjI34",
    authDomain: "train-scheduler-607f8.firebaseapp.com",
    databaseURL: "https://train-scheduler-607f8.firebaseio.com",
    projectId: "train-scheduler-607f8",
    storageBucket: "train-scheduler-607f8.appspot.com",
    messagingSenderId: "23379987080",
    appId: "1:23379987080:web:01b86ce6b3fc9672a3ed3d",
    measurementId: "G-F8DVZ7LR10"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//  firebase.analytics();

// Initializa variable

var db = firebase.database().ref("/train");

var firstTimeConverted="";
var diffTime="";
var tRemainder="";
var nextTrain="";
var trains="";
var upd="";
var keys=""

//object Train
function train(name,destination,frequency,first_ttime){

    //Attributes
    this.name=name;
    this.destination=destination;
    this.frequency=frequency;
    this.first_ttime=first_ttime;
   
 
}

function trainTime(frecuency, firstTime){
    frequency =   frecuency;
    first_ttime = firstTime;
    firstTimeConverted = moment(first_ttime, "hh:mm");
    currentTime = moment();
    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    tRemainder = diffTime % frequency;
    tMinutesTillTrain = frequency - tRemainder;
    nextTrain = moment().add(tMinutesTillTrain, "minutes");
}
//Add train to firebase

function AddTrain(t){
   
if(t.name =="" && t.destination =="" && t.frequency== "" && t.first_ttime == ""  ){
   
    $("#DivError").show();
    $("#error").text("Enter Data")

}else{ 
    db.push(t)
    $("#DivError").hide();;
}
          
}

//Get values from firebase

function GetTrain(){

   db.on("value",function(data){
   
    $("#loadTrain").empty();
    trains=data.val();   
        
    if(data.val()==null){
        $("#DivError").show();
        $("#error").text("Enter Data")
    }else{
      
        keys = Object.keys(trains);   
        for(var i=0; i< keys.length;i++){

                name=trains[keys[i]].name;
                destination=trains[keys[i]].destination;
                frequency=trains[keys[i]].frequency;
                first_ttime=trains[keys[i]].first_ttime;
                trainTime(frequency,first_ttime)
    
            var btnsD=$("<button >");
                btnsD.addClass("btn btn-danger");
                btnsD.attr("id",keys[i]);
            var ImgT=$("<img>");
                ImgT.attr("src","assets/images/trash.png");
                btnsD.append(ImgT); 
            var btnsU=$("<button>");
               btnsU.addClass("btn btn-warning");
               btnsU.attr("id",keys[i]);
            var ImgU=$("<img>");
                ImgU.attr("src","assets/images/edit.png");
                btnsU.append(ImgU);  
          
            var tr=$("<tr>").append(
                $("<td>").text(name),
                $("<td>").text(destination),
                $("<td>").text(frequency),
                $("<td>").text(moment(nextTrain).format("hh:mm")),
                $("<td>").text(tMinutesTillTrain),
                $("<td>").append(btnsU),
                $("<td>").append(btnsD));       
    
                $("#loadTrain").append(tr);
                $("#DivError").hide();

        }
    }
  });
}   
GetTrain();

// Delete train
function deleteTrain(){
    var id=$(this).attr("id");
    
    db.child(id).remove();
 
    }
    
   

 //update train
function updateTrain(){
   
    var id=$(this).attr("id");
    var tu=firebase.database().ref("/train").child(id);
  
    tu.once("value",function(snapshot){
  
        trains=snapshot.val();
        name=snapshot.val().name;
        destination=snapshot.val().destination;
        frequency=snapshot.val().frequency;
        first_ttime=snapshot.val().first_ttime;

        $("#tname").val(name);
        $("#tdestination").val(destination);
        $("#tfrecuency").val(frequency);
        $("#ttime").val(first_ttime);
        var t=new train(name,destination,frequency,first_ttime); 
       console.log(tu);
       tu.update(name );   
    
    });

 }
 

// Restart Values
function restart(){
    $("#tname").val("");
    $("#tdestination").val("");
    $("#tfrecuency").val("");
    $("#ttime").val("");

}

//Get HTML values

function HtmlValues(){

    name=$("#tname").val().trim();
    destination=$("#tdestination").val().trim();
    frequency=$("#tfrecuency").val().trim();
    first_ttime=$("#ttime").val().trim();
}



// onclick event from submit button

$("#add").on("click",function(event){
    event.preventDefault();

    HtmlValues();
  
    var t=new train(name,destination,frequency,first_ttime);  
    AddTrain(t); 
    
    restart();
    
});
$("#update").on("click",function(event){
    event.preventDefault();

    //HtmlValues();
   updateTrain();
    
    //restart();
    
});


$(document).on("click", ".btn-danger", deleteTrain);
//$(document).on("click", ".btn-warning", updateTrain);

});