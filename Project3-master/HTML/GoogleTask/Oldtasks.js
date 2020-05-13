// [START tasks_quickstart]
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly',
'https://www.googleapis.com/auth/tasks',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
function runTasks(){
  fs.readFile('client_secret_998788988002-vc5hticldhstmi2qkirhfq3uiujv317u.apps.googleusercontent.com.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Tasks API.
    authorize(JSON.parse(content), listTaskLists);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var client_secret = "KxKBymGg5O0GKc3tzvI2iEuR"; 
  var client_id = "998788988002-9fas4s1aiemsuuqc4u5s95k6kb9u7u44.apps.googleusercontent.com"; 
  var redirect_uris = "http://localhost:8000";
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//**********START OF ACCESSING LIST ************/
/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function listTaskLists() {
  (async () => {
  
      try {
      //TRY TO ADD TO CONTAINERS
<<<<<<< HEAD:HTML/GoogleTask/tasks.js
        const app = document.getElementById('taskid');
=======
        const app = document.getElementById('root');
>>>>>>> d72d92d3b473d57a2f6e931070e62518af27c4ed:HTML/HTML/GoogleTask/Oldtasks.js
        const container = document.createElement('div');
        container.setAttribute('class', 'container');
        app.appendChild(container);
      //************************************ */

      const service = google.tasks({version: 'v1', auth});
      service.tasklists.list({
        maxResults: 10,
      }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);

        const taskLists = res.data.items;

        if (taskLists) {
          console.log('Task lists:');

          //go through each list a user has
          taskLists.forEach((taskList) => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            const h1 = document.createElement('h1');
            h1.textContent = taskList.title;
            container.appendChild(card);
            card.appendChild(h1);

            console.log(`${taskList.title} (${taskList.id})`);
            console.log('Tasks in list:');
            tasksInList(auth,`${taskList.id}`);
            
          });
        } else {
          console.log('No task lists found.');
        }
      });
    }
    catch (e) {
      console.log(e);
    }
  
  })();
}

function tasksInList(auth, id){
  const service = google.tasks({version: 'v1', auth});
  service.tasks.list({
      tasklist: `${id}`
    }, (err, res) => {
      if (err) return console.error('The API returned an error: ' + err);
      const tasksIn= res.data.items;
      if (tasksIn) {
        tasksIn.forEach((task) => {
          const p = document.createElement('p');
          p.textContent = `${task.title}`;
          card.appendChild(p);

          console.log(`${task.title}`);
        });
      } else {
        console.log('No task lists found.');
      }
   });
}//end function

var request = new XMLHttpRequest();
request.onload = runTasks();
request.send();
<<<<<<< HEAD:HTML/GoogleTask/tasks.js
=======

>>>>>>> d72d92d3b473d57a2f6e931070e62518af27c4ed:HTML/HTML/GoogleTask/Oldtasks.js
// [END family manager]

module.exports = {
  SCOPES,
  listTaskLists,
  tasksInList,
};