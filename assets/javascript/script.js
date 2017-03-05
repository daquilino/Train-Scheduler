/* 		========================= NEED TO DO =======================================

		BONUS.)
			
			B2.) add update and remove buttons for each train
				UPDATE Button
					glyphicons for buttons

					BOX POPS UP WITH FORM AND SUBMIT OR CANEL BUTTON
					FORM HAS ALL FIELDS POPULATED WITH CURRENT VALUES
	


			B3.) allow only users who log in with their Google or GitHub accounts can use your site

	
	============================= currently ===================================
	
	
*/ //END Notes


// Initialize Firebase
var config = 
{
	apiKey: "AIzaSyBEXITIYqpcDc-re7KgKvhodgiEpKzviL0",
    authDomain: "train-scheduler-a77f7.firebaseapp.com",
    databaseURL: "https://train-scheduler-a77f7.firebaseio.com",
    storageBucket: "train-scheduler-a77f7.appspot.com",
    messagingSenderId: "397554903362"
};
  
 firebase.initializeApp(config);

 //variable to store database name
 var database = firebase.database();

 //Object to store entire firebase database as JSON object 
 var firebaseDataObject = null;


// train object constructor
 function train(name, destination, firstTrainTime, frequency)
 {

 	this.name = name;
 	this.destination = destination;
 	this.firstTrainTime = firstTrainTime;
 	this.frequency = frequency;

 };//END train object constructor


//===================================================================================================

 $(document).ready(function(){

	//When page loads diplays initial current time
	$("#current-time").text(moment().format("MMM DD hh:mm A"));


	//Updates current time on page every 1 minute
	setInterval(function(){

		$("#current-time").text(moment().format("MMM DD hh:mm A"));
		displayTrainSchedule();

	},60000);

	//Firebase database 'event handler' triggered when change in database "value".
	database.ref().on("value",function(data){
		
		firebaseDataObject = data.val();
		displayTrainSchedule();
		
	});

});//END $(document).ready;


//==========================================================================================

$("#submit").on("click", function(event){

 	event.preventDefault();
		
 	var name = $("#name").val().trim();
 	var destination = $("#destination").val().trim();
 	var time = $("#time").val().trim().replace(/\s/g,""); //trims string and removes all white spaces 
 	var frequency = parseInt($("#frequency").val().trim()); 


 	//Tests if 'Train Name' value is empty.
 	if(name === "")
 	{
 		alert("Please Enter A Train Name");
 		$("#name").val("").focus();

 	}
 	//Tests if 'Destination' value is empty.	
 	else if(destination === "")
 	{
 		alert("Please Enter A Destination");
 		$("#destination").val("").focus();
 	}
 	//Tests if "First Train Time" is valid.
 	else if(!checkTime(time))
 	{
 		alert("Please Enter A Valid First Train Time! (HH:MM)");
 		$("#time").val("").focus();
 	}
 	//Tests if "Frequency" is valid.
 	else if(isNaN(frequency))
 	{
 		alert("Please Enter A Frequency");
 		$("#frequency").val("").focus();
 	}	
 	else
 	{
 		//Pads time if hour is single digit
 		//(ex 9:25 becomes 09:25)
 		time = pad(time);

	 	//Creates a string with todays date and time of 'time';
	 	var firstTrainTime = firstTimeString(time);

	 	//Creates a new 'train' object from the user input values 
	 	var newTrain = new train(name, destination, firstTrainTime, frequency);
	 		
	 	//Pushes "newTrain" object to firebase database.
	 	database.ref().push( newTrain ); 		

	 	//Clears out input box fields
	 	$("#name").val("");
	 	$("#destination").val("");
	 	$("#time").val("");   
	 	$("#frequency").val("");
	 		
 	}//END else
 
});//END #submit on."click"

//====================================================================================

//Document .on("click" event handler for .remove buttons
$(document).on("click", ".remove", function(){

	//Gets "key" attribute of button which is trains "key";
	var key = $(this).attr("key");

	//removes 'train' object with "key" from firebase database.
	database.ref().child(key).remove();
});

//====================================================================================

//Document .on("click" event handler for .update buttons
$(document).on("click", ".update", function(){

	//Gets "key" attribute of button which is trains "key";
	var key = $(this).attr("key");

	//PUT UPDATE CODE HERE
});

//====================================================================================

//Checks first train time against current time.
//
function getNextArrival(time, frequency)
{
	
	var nextArrival = moment(time);
 	
 	while(nextArrival < moment()) 	
 	{ 		
 		nextArrival.add(frequency, "minutes"); 

	};

	return nextArrival;

}//END getNextArrival


//====================================================================================

function getMinutesAway(time)
{
	//Returns the difference in minutes bewteen trains next arrival and currrnt time.
	return  ((getNextArrival(time).diff(moment(),"minutes")));

}//END getMinutesAway


//====================================================================================

//update function gets trains from database displays to screen
function displayTrainSchedule(){


	//Clears out table so rows don't repeat.
	$("#schedule").empty();

	//Tests if database
	if(firebaseDataObject !== null)
	{	

	
		Object.keys(firebaseDataObject).forEach(function(key)
		{
		 		
			var name = firebaseDataObject[key].name;
	 		
	 		var destination = firebaseDataObject[key].destination;
	 		var firstTrainTime = 	firebaseDataObject[key].firstTrainTime;
	 		var frequency = firebaseDataObject[key].frequency;	
	 		var nextArrival = getNextArrival(firstTrainTime, frequency) ;
	 		var minutesAway = getMinutesAway(nextArrival);
	 	

	 		var newTableRow = $("<tr>");
	 		
	 		newTableRow.append($("<td>").html(name));
	 		
	 		newTableRow.append($("<td>").html(destination));
	 		
	 		newTableRow.append($("<td>").html(frequency));
	 		
	 		newTableRow.append($("<td>").html(nextArrival.format("MMM DD hh:mm A")));
	 		
	 		newTableRow.append($("<td>").html(minutesAway));

			// Creates 'Update' buttons for each train with attr 'key' of object key
	 		var newButton = $("<button>")
	 		newButton.addClass("remove");
	 		newButton.attr("key", key);
	 		newButton.html("<span class='glyphicon glyphicon-edit'></span>");
			newTableRow.append($("<td>").html(newButton));
			
			// Creates 'Remove' buttons for each train with attr 'key' of object key
	 		var newButton = $("<button>")
	 		newButton.addClass("update");
	 		newButton.attr("key", key);
	 		newButton.html("<span class='glyphicon glyphicon-trash'></span>");
			newTableRow.append($("<td>").html(newButton));


			

	 		$("#schedule").append(newTableRow);

	 	

	 		//============= TEST CODE REMOVE ===================

	 	console.log("name: " + name + " | First Train Time: " + moment(firstTrainTime).format("MMM DD hh:mm A"));


	 		//=================================================
	 				
		});//END Object.keys(firebaseDataObject).forEach(function(key)
	
	}//END if(firebaseDataObject !== null)	

}//END displayTrainSchedule


//====================================================================================

//Creates a moment.js object from the 'first train time' value ('time' HH:mm) enterd by user
function firstTimeString(time)
{
	//Creates a string storing today's date from monent() in YYYY-MM-DD format.
	var currentDateString = moment().format("YYYY-MM-DD");

	console.log("date: " + moment(new Date()))
	//Returns a string with todays date and time of first train.	
	return (currentDateString + "T" + time);

}//end firstTimeString

//=======================================================

//Pads time if hour or minute is single digit (ex 9:25 becomes 09:25)
function pad(time) {

	//splits time (HH:MM) into array of 2 strings (array[0] and array[1]) by ":";
	var array = time.split(":");
	
	//convert first string (array[0]) into integer;
	array[0] = parseInt(array[0]); //HH
	array[1] = parseInt(array[1]); //MM

	//If statments pad if < 10 (ex 1 -> 01)
	if (array[0] < 10)
	{
		array[0] = '0' + array[0];
	}

	if (array[1] < 10)
	{
		array[1] = '0' + array[1];
	}
	
	//Returns string of time in HH:MM format.
    return (array[0] + ":" + array[1]);

}//END pad()
//========================================================================

// checks if time  in put is valid
function checkTime(time)
{
	
	var array = time.split(":");
	
	//If either strings contain non numbers return false.
	if(( isNaN(array[0]) ) || ( isNaN(array[1]) ) )
	{			
		return false;
	}
	
	array[0] = parseInt(array[0]);
	array[1] = parseInt(array[1]);
	
	//Returns true if time is beteen 'hour' between 0 and 23 and 'minute' between 0 and 59;
	return ((array[0] >= 0 && array[0] <= 23) && (array[1] >= 0 && array[1] <= 59)) ? true : false;	
}//END checkTime()

