/*	Two ways to do this.

		1.)  Using "push" sent each.

				have to create hash or index key for each object

				research for each on firebase.
				remove or delete on firebase.



		2.) Using set.
				Have array of train objects.
				"set" and "get" like localStorage Assignment. 


	========================= NEED TO DO ========================================

		
			3.) Minutes Away
			5.) check input for time and frequency
			

			BONUS.)
				B1.) update your "minutes to arrival" and "next train time" text once every minute.
				B2.) add update and remove buttons for each train
				B3.) allow only users who log in with their Google or GitHub accounts can use your site

	interval timer to update "Minutes Away" and "Next Arrival"
			first calculate "Next Arrival", use that to calculate "Minutes Away"

	============================= currently ===================================

	validate frequency for "e" and decimals use Math.round();
	
	********* Validate all input boxes***************
			check that they are not ""

			see html input for frequency
			modify html input for time only allow "numbers" and ":" and "enter"

	
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

 //
 var database = firebase.database();

 //Object to store firebase database JSON 
 var firebaseDataObject = {};


// train object constructor
 function train(name, destination, firstTrainTime, frequency)
 {

 	this.name = name;
 	this.destination = destination;
 	this.firstTrainTime = firstTrainTime;
 	this.frequency = frequency;


 	//BONUS: ADD A KEY For modification and Deletion

 };//END train object constructor



 $(document).ready(function(){

	//When page loads diplays initial current time
	$("#current-time").text(moment().format("MMM DD hh:mm A"));


	//Updates current time on page every 1 minute
	setInterval(function(){

		$("#current-time").text(moment().format("MMM DD hh:mm A"));

	},60000);

//
database.ref().on("value",function(data){
	firebaseDataObject = data.val();
	displayTrainSchedule();
	
});


/*   MAY NOT NEED THESE 

//
database.ref().on("child_added",function(data){

});


//
database.ref().on("child_removed",function(data){

});

//
// database.ref().on("child_changed",function(data){

// });
*/		

$("#submit").on("click", function(event){

 	event.preventDefault();
		
 		var name = $("#name").val().trim();
 		var destination = $("#destination").val().trim();
 		var time = $("#time").val().trim().replace(/\s/g,""); //trims string and removes all white spaces 
 		var frequency = parseInt($("#frequency").val().trim()); 


 		if(!checkTime(time))
 		{
 			alert("Please Enter A Valid First Train Time! (HH:MM)");
 			$("#time").val("").focus();
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
	 		$("#time").val("");    // Need To parse time? check moment documentation
	 		$("#frequency").val("");
	 		
 		}//END else
 
 });//END #submit on."click"

});//END $(document).ready;

//====================================================================================

function getNextArrival(time, frequency)
{
	var currentTime = moment(); 

	var nextArrival = moment(time);
 	
 	do 	
 	{ 		
 		nextArrival.add(frequency, "minutes"); 

	}while(nextArrival < currentTime);

	return nextArrival;

}//END getNextArrival


//====================================================================================

function getMinutesAway(time)
{
	//Returns the difference in minutes bewteen trains next arrival and currrnt time.
	return  (Math.round((getNextArrival(time) - moment())/60000));

}//END getMinutesAway


//====================================================================================

//update function gets trains from database displays to screen
function displayTrainSchedule(){

	//
	$("#schedule").empty();

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

	/*	//CODE For Remove Button
		
		// ADD Remove Button
 		var newButton = $("<button>")
 		newButton.addClass("remove");
 		newButton.attr("key", key);
 		newButton.html("X");
		newTableRow.append(newButton);
 	*/	
 		

 		$("#schedule").append(newTableRow);


 		//============= TEST CODE REMOVE ===================

 			console.log("name: " + name + " | First Train Time: " + moment(firstTrainTime).format("MMM DD hh:mm A"));


 		//==================================================

 				
	});

}//END displayTrainSchedule


//====================================================================================

//Creates a moment.js object from the first train time value (time HH:mm) enterd by user
function firstTimeString(time)
{
	//Creates a string storing today's date from monent() in YYYY-MM-DD format.
	var currentDateString = moment().format("YYYY-MM-DD");

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
	
	//checks if time is beteen 0 and 2359 
	return ((array[0] >= 0 && array[0] <= 23) && (array[1] >= 0 && array[1] <= 59)) ? true : false;	
}//END checkTime()

