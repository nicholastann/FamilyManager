// Client ID and API key from the Developer Console
var CLIENT_ID = '330174162479-p2hus8f7bmna5mkmpeo3ittsf6e07jtp.apps.googleusercontent.com';
var API_KEY = 'AIzaSyASo4pYrq_bMRcZlfVerWRgOR6FQREfpi0';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var eventList = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  console.log("initClient");
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    console.log("calendar success auth");
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    console.log("calendar error auth");

    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    // 'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    // 'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    //appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        var desc = event.description;
        var index = when.lastIndexOf("-");
        var time = when.substr(0,index);
        //appendPre(event.summary + ' (' + time + ')' + desc);

        var temp = {
            title: event.summary,
            start: time
        }

        eventList.push(temp);
      }
    } else {
      appendPre('No upcoming events found.');
    }

    console.log(eventList);

    var div = document.createElement("div");
    div.id = "calendar";
    var element = document.getElementById("cal-cont-2");
    div.style.backgroundColor = 'white';
    element.appendChild(div);

    var imported = document.createElement('script');
    imported.src = 'index.js';
    document.body.appendChild(imported);

  });
}

// Make an API call to create an event.  Give feedback to user.
function createEventt() {
  // // First create resource that will be send to server.
  // var resource = {
  //   "summary": "Appointment",
  //   "location": "Somewhere",
  //   "start": {
  //     "dateTime": "2020-04-16T10:00:00.000-07:00"
  //   },
  //   "end": {
  //     "dateTime": "2020-04-16T10:25:00.000-07:00"
  //   }
  // };
  //   // create the request
  //   gapi.client.calendar.events.insert({
  //     'calendarId': 'primary',
  //     'resource': resource
  //   }).then(function(response) {
  //     console.log(resp);
  //     alert("Your event was added to the calendar.");
  //   });
  


  // First create resource that will be send to server.
  var resource = {
    "summary": "Appointment",
    "location": "Somewhere",
    "start": {
      "dateTime": "2020-04-16T10:00:00.000-07:00"
    },
    "end": {
      "dateTime": "2020-04-16T10:25:00.000-07:00"
    }
  };
    // create the request
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': resource
    });
  
    // execute the request and do something with response
    request.execute(function(resp) {
      console.log(resp);
      alert("Your event was added to the calendar.");
    });
  }
   
  

