// a global variable pointing to the Ginsberg API
var apiPath = "https://api.project-ginsberg.com";

// jquery's document.ready event
$().ready(function(){

	//make an ajax POST call to signin
	$.ajax({
    url: apiPath+"/users/login",
    type: "POST",
    // pass the username and password
    data: {"username": "allen@project-ginsberg.com", "password": "howl"},
    // on success, call fetchUserAccount
    success: fetchUserAccount
	});
});

function fetchUserAccount(authorisationData)
{
  // make an ajax GET call to the user account
  // associated with the uid from the log in process
  $.ajax({
    url: apiPath+"/users/"+authorisationData.uid,
    type: "GET",
    
    // you MUST add the xhrField "withCredentials" to the call
    // if you don't add this, the cookie stored during the login
    // process will not be sent to the API, and you will receive
    // and unauthorised access error
    xhrFields: {
      withCredentials: true
    },
    
    // on success, fetch all the fitness records associated with the id
    success: function(data)
    {
      fetchFitnessRecords(data.id);
    }
  });
}

function fetchFitnessRecords(uid)
{
  // make an ajax GET call to the obj-fitness collection
  // with a query for the uid
  $.ajax({
    url: apiPath+"/obj-fitness?{\"uid\":\""+uid+"\"}",
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    
    // on success, build a ginsberg record and send it
    success: function(data)
    {
      var timeNow = Math.floor(new Date().getTime()/1000);
      // woah, woah, woah! why are you dividing getTime() by 1000?
      // because javascript's getTime() function returns a timestamp
      // in milliseconds, as opposed to seconds (which is what the ginsberg
      // API deals in), so we have to divide it by 1000 to get the correct timestamp
      
      var timeInOneHour = Math.floor((new Date().getTime()/1000)+3600);
      insertFitnessRecord(uid, timeNow, timeInOneHour, 5, "Running");
    }
  });
}

function insertFitnessRecord(
  uid,
  startTimestamp,
  endTimestamp,
  totalDistance,
  type)
{
  $.ajax({
    url: apiPath+"/obj-fitness",
    type: "POST",
    data: {
      "uid": uid,
      "startTimestamp": startTimestamp,
      "endTimestamp": endTimestamp,
      "totalDistance": totalDistance,
      "type": type
    },
    xhrFields: {
      withCredentials: true
    },
    success: function(data)
    {
      console.log(data);
    }
  });
}