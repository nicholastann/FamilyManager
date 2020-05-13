// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
var apiKey = 'AIzaSyCQo0u7RGEewVysPlG0eQ_10BfaLTJeCGo';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = '513294065660-uqgt131kfvg6ubu18rgnprqc95rq8ivv.apps.googleusercontent.com';

var clientSecret = 'uBue2el7gVUyKTAzr8ZmMa9j';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'https://www.googleapis.com/auth/photoslibrary.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

var albumsAreVisible = false;
var albumsWereListed = false;

function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: apiKey,
    clientId: clientId,
    discoveryDocs: discoveryDocs,
    scope: scopes,
    clientSecret: clientSecret
  }).then(function () {
    //console.log("hey");

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    //console.log("success333");

  }, function (error) {
    console.log("error authenticating google photos");
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    //listAlbums(isSignedIn);
    //listMediaItems(isSignedIn);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  console.log("sign in");
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  console.log("sign out");

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

// Load the API and make an API call.  Display the results on the screen.
function listAlbums(isSignedIn) {
  //console.log("in albums");
  if (isSignedIn) {
    gapi.client.request({
      'path': 'https://photoslibrary.googleapis.com/v1/albums',
      'method': 'GET'
    }).then(function (response) {
      console.log(response);

      var albums = response.result.albums;
      showAlbums(albums);
      //listMediaItemsByAlbumId(isSignedIn, response.result.albums[0].id);

    }, function (reason) {
      console.log(reason);
    });
  }
}
function listMediaItems(isSignedIn) {
  const filters = { contentFilter: {}, mediaTypeFilter: { mediaTypes: ['PHOTO'] } };
  //console.log("testing: " + gapi);
  if (isSignedIn) {
    gapi.client.request({
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      'method': 'POST'
    }).then(function (response) {
      console.log(response); 
      showPreview(filters, response.result.mediaItems);

    }, function (reason) {
      //console.log("error in listMediaItems");
      console.log(reason);
    });
  }
}

function listMediaItemsByAlbumId(isSignedIn, id) {
  const filters = { contentFilter: {}, mediaTypeFilter: { mediaTypes: ['PHOTO'] } };
  const body = { albumId: id };
  //console.log("testing: " + gapi);
  if (isSignedIn) {
    gapi.client.request({
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      'method': 'POST',
      'body': body
    }).then(function (response) {
      console.log(response); 
      showPreview(filters, response.result.mediaItems);

    }, function (reason) {
      //console.log("error in listMediaItems");
      console.log(reason);
    });
  }
}

function displayImage(id) {
  listMediaItemsByAlbumId(true, id);
  hideAlbums();
}

function albumsClicked(){
  if (albumsAreVisible == false){
    displayAlbumList();
  }
  else{
    hideAlbums();  
  }
}


function displayAlbumList() {
  if (albumsWereListed == false){
    listAlbums(true);
  }
  else {
    var albums = document.getElementById("albums");
    albums.style.display = 'block';
  }
  albumsWereListed = true;
  albumsAreVisible = true;

  var rightArrow = document.getElementById("rightArrow");
  rightArrow.style.display = 'none';

  var downArrow = document.getElementById("downArrow");
  downArrow.style.display = 'inline-block';

}

function hideAlbums() {
  var albums = document.getElementById("albums");
  albums.style.display = 'none';

  var rightArrow = document.getElementById("rightArrow");
  rightArrow.style.display = 'inline-block';

  var downArrow = document.getElementById("downArrow");
  downArrow.style.display = 'none';

  albumsAreVisible = false;

}
