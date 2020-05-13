
      // Client ID and API key from the Developer Console
      var CLIENT_ID = '998788988002-4ejojb73g5v5os5rfrmmg66pk97b0dq1.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyBw7yQ4t1_JN9ToQuvPvSPmir3H0N355_g';
	  
      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/tasks';

      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');

      //creating lists
      var createButton= document.getElementById('create_button');
	  //var createForm = document.getElementById('creating_list');
	  var titleInput = document.getElementById('new_title');
	  var titleSubmit = document.getElementById('submit_title');
	  var titleCancel = document.getElementById('cancel_title');
	  
	  //adding items to list
	  var addItemButton = document.getElementById('add_item_button');
	   //var selectDropdown = document.getElementById('drop_select');
	  var addItemInput = document.getElementById('new_item');
	  var addItemSubmit = document.getElementById('submit_item');
	  var addItemCancel = document.getElementById('cancel_item');
	 
	  
	  //delete lists attributes
      var deleteButton= document.getElementById('delete_button');
      
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
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

	//**************TASKS ELEMENTS****************************************///
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
		  deleteButton.onclick = deleteList;
		  
		  //creating new list
		  createButton.onclick = createNewList;
		  titleSubmit.onclick = createNewCard;
		  titleCancel.onclick = cancelNewRequest;
		  
		  //adding item to list
		  addItemButton.onclick = createNewItem;
		  addItemSubmit.onclick = addItemToList;
		  addItemCancel.onclick = cancelNewItemRequest;
		  
        }, function(error) {
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
		  createButton.style.display = 'block';
		  addItemButton.style.display = 'block';
          deleteButton.style.display = 'block';
          
          getAllLists();
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
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      //-----make containers----//
      const app = document.getElementById('root');
      const container = document.createElement('div');
      container.setAttribute('class', 'container');
      app.appendChild(container);
      //----end make containers----//

//-------------------------Element: h1 -------------------------------------------------------------------//
	 
      /************* Make cards Show Up **************************/
      function getAllLists() {
        gapi.client.tasks.tasklists.list({
            'maxResults': 10
        }).then(function(response) {
          var taskLists = response.result.items;
          if (taskLists && taskLists.length > 0) {
            for (var i = 0; i < taskLists.length; i++) {
              var taskList = taskLists[i];
			  
              //create a card for this
              const card = document.createElement('div');
			  card.setAttribute('class', 'card');
			  card.id = taskList.id;
			  const h1 = document.createElement('h1');
			  h1.id = taskList.id;

			  const label = document.createElement('label');
			  label.setAttribute('class', 'labelcontainer');
					
					const checkBox = document.createElement('input');
					checkBox.setAttribute('type', 'checkbox');
					checkBox.setAttribute('id', taskList.id);
						
					const checkmark = document.createElement('span');
					checkmark.setAttribute('class', 'checkmark');

			 label.textContent = String(taskList.title);
			 label.id = taskList.id;
			  
              container.appendChild(card);
			  card.appendChild(h1);
			  h1.appendChild(label);
			  label.appendChild(checkBox);
			  label.appendChild(checkmark);

              getItemsInList(card, taskList.id);
              
            }
          } else {
            appendPre('No task lists found.');
          }
        });
      }
	  //--------END getAllLists----------------------------------//
	  
	  //*************GET INPUT TEXT FOR CARD***********************//
		function cancelNewRequest(){
			titleInput.style = 'display: none;';
			titleInput.value = 'Enter Title Here';
			titleSubmit.style = 'display: none;';
			titleCancel.style = 'display: none;';
			createButton.style.display = 'block';
		}
	 //--------------------END INPUT TITLE-----------------------//

	 //*************GET INPUT TEXT FOR CARD***********************//
		function createNewList(){
			createButton.style.display = 'none';
			titleInput.style = 'display: block;';
			titleSubmit.style = 'display: block;';
			titleCancel.style = 'display: block;';
			
		}
	 //--------------------END INPUT TITLE-----------------------//

	 //**************CREATE A CARD FOR NEW LIST****************//
		function createNewCard(){
			createButton.style.display = 'block';
			titleInput.style.display = 'none';
			titleSubmit.style.display = 'none';
			titleCancel.style.display = 'none';
			tasklist = {
				'title': String(titleInput.value) //NEED to edit to let users add their own titles
			}
			gapi.client.tasks.tasklists.insert(tasklist).then(function(response) {
				var taskList = response.result;
				if(taskList){
				   //create a card for this
					  const card = document.createElement('div');
					  card.setAttribute('class', 'card');
					  card.id = taskList.id;
					  const h1 = document.createElement('h1');
					  h1.id = taskList.id;

					  const label = document.createElement('label');
					  label.setAttribute('class', 'labelcontainer');
							
							const checkBox = document.createElement('input');
							checkBox.setAttribute('type', 'checkbox');
							checkBox.setAttribute('id', taskList.id);
								
							const checkmark = document.createElement('span');
							checkmark.setAttribute('class', 'checkmark');

					 label.textContent = String(taskList.title);
					 label.id = taskList.id;
					  
					  container.appendChild(card);
					  card.appendChild(h1);
					  h1.appendChild(label);
					  label.appendChild(checkBox);
					  label.appendChild(checkmark);

					  getItemsInList(card, taskList.id);
					  
					   const selection = document.createElement('option');
						selection.textContent = taskList.title;
						selection.value = taskList.id;
						selectDropdown.appendChild(selection);
				}
				else{
				  appendPre('Error Creating List.');
				}
			});
			titleInput.value = 'Enter Title Here';
		}
	//-----------------END CREATE CARD-----------------------//
	
	 
//-------------------------Element: p -------------------------------------------------------------------//	 
	  
	  //***********Get all items in the list****************//
      function getItemsInList(card, id){
        gapi.client.tasks.tasks.list({
          tasklist: String(id)
        }).then(function(response) {
          var tasksIn = response.result.items;
          if (tasksIn && tasksIn.length > 0) {
            for (var i = 0; i < tasksIn.length; i++) {
              var task = tasksIn[i];
              
			  //create item inside the card 
              const p = document.createElement('p');
              p.id = task.id;
              card.appendChild(p);
			  
					const label = document.createElement('label');
					label.setAttribute('class', 'labelcontainer');
					label.textContent = task.title;	
					
						const checkBox = document.createElement('input');
						checkBox.setAttribute('type', 'checkbox');
						checkBox.setAttribute('id', String(task.id));
						checkBox.setAttribute('value', String(id));
						
						const checkmark = document.createElement('span');
						checkmark.setAttribute('class', 'checkmark');
						
			  //add the children from top to bottom
			  p.appendChild(label);
			  label.appendChild(checkBox);
			  label.appendChild(checkmark);
			  
              //appendPre(task.title);
            }
          } else {
            var noTasks = "This list is empty.";
            const p = document.createElement('p');
            p.textContent = noTasks;
			p.id = 'empty';
            card.appendChild(p);
            //appendPre('No task lists found.');
          }
        });
      }
      //----END get items in list----//


	  //*************GET INPUT ITEM FOR P ACTION GO BACK***********************//
		function cancelNewItemRequest(){
			addItemInput.style = 'display: none;';
			//selectDropdown.style = 'display: none;';
			addItemInput.value = 'Enter Item Here';
			addItemSubmit.style = 'display: none;';
			addItemCancel.style = 'display: none;';
			addItemButton.style.display = 'block';
		}
	 //--------------------END INPUT item-----------------------//

	 //*************GET INPUT ITEM FOR P ACTION GO AHEAD***********************//
		function createNewItem(){
			addItemButton.style.display = 'none';
			//selectDropdown.style = 'display: block;';
			addItemInput.style = 'display: block;';
			addItemSubmit.style = 'display: block;';
			addItemCancel.style = 'display: block;';
			//listTaskLists();
		}
		/* //------Update the contents of dropdown-------//
		  function listTaskLists() {
				
			if(selectDropdown.hasChildNodes() == true){
				Array.prototype.slice.call(document.getElementsByTagName('option')).forEach(
				function(itemList) {
					//console.log(itemList);
					itemList.remove();
				});
			}
			//create default
			const selection = document.createElement('option');
			selection.textContent = 'Select List';
			selection.value = 'default';
			selectDropdown.appendChild(selection);
			//end deafult
			gapi.client.tasks.tasklists.list({
				'maxResults': 10
			}).then(function(response) {
			  var taskLists = response.result.items;
			  if (taskLists && taskLists.length > 0) {
				for (var i = 0; i < taskLists.length; i++) {
				  var taskList = taskLists[i];
				  //add to dropdown for list
				  const selection = document.createElement('option');
				  selection.textContent = taskList.title;
				  selection.value = taskList.id;
				  selectDropdown.appendChild(selection);
				  
				  //appendPre(taskList.title + ' (' + taskList.id + ')');
				}
			  } else {
				appendPre('No task lists found.');
			  }
			});
		  }
      //------end Update of dropdown contents-------// */
	 //--------------------END INPUT TITLE-----------------------//
	  
      //*********ADD P into selected List**********************//
	  function addItemToList(){
		  /* var selectValue = document.getElementById('drop_select');
		  var getID = selectValue.options[selectValue.selectedIndex]; */
		  
		  
		var selectedList = [];
		Array.prototype.slice.call(document.getElementsByTagName('h1')).forEach(
			function(item){
				Array.prototype.slice.call(item.getElementsByTagName('input')).forEach(
					function(checkMark) {
					//console.log(checkMark);
						if(checkMark.checked == true){
							selectedList.push(checkMark.id);
							/* var selectedCard = document.getElementById(checkMark.id);
							selectedCard.remove(); */
						}
				});
		});

		var selectedCard;
		for(i = 0; i < selectedList.length; i++){
			  Array.prototype.slice.call(document.getElementsByClassName('card')).forEach(
				 function(cardItem) {
						if(cardItem.id == selectedList[i]){
							newTask = {
									'tasklist': String(selectedList[i]),
									'title': String(addItemInput.value)
							  }
								gapi.client.tasks.tasks.insert(newTask).then(function(response) {
								  var newTaskMade = response.result;
								  const p = document.createElement('p');
								  p.id = newTaskMade.id;
								  cardItem.appendChild(p);
								  
										const label = document.createElement('label');
										label.setAttribute('class', 'labelcontainer');
										label.textContent = String(newTaskMade.title);	
										
											const checkBox = document.createElement('input');
											checkBox.setAttribute('type', 'checkbox');
											checkBox.setAttribute('id', String(newTaskMade.id));
											checkBox.setAttribute('value', String(cardItem.id));
											
											const checkmark = document.createElement('span');
											checkmark.setAttribute('class', 'checkmark');
											
								  //add the children from top to bottom
								  p.appendChild(label);
								  label.appendChild(checkBox);
								  label.appendChild(checkmark);	
							});
							Array.prototype.slice.call(cardItem.getElementsByTagName('p')).forEach(
								function(pItem) {
									if(pItem.id == 'empty'){
										pItem.remove();
									}
							});//call p
						}//if statement
			 });//function
		}
			  
	}
	  
	  //----------------End adding item-----------------------//
  
	 //*********DELETE SELECTED ELEMENT*********//
      function deleteList(){
		//console.log('Here');
        //go through all h1 and see if their checkbox is checked= true
		var selectedList = [];
		Array.prototype.slice.call(document.getElementsByTagName('h1')).forEach(
			function(item){
				Array.prototype.slice.call(item.getElementsByTagName('input')).forEach(
					function(checkMark) {
					//console.log(checkMark);
						if(checkMark.checked == true){
							selectedList.push(checkMark.id);
							var selectedCard = document.getElementById(checkMark.id);
							selectedCard.remove();
						}
				});
		});

		var selectedTask = [];
		Array.prototype.slice.call(document.getElementsByTagName('p')).forEach(
			function(item){
				Array.prototype.slice.call(item.getElementsByTagName('input')).forEach(
					function(checkMark) {
					//console.log(checkMark);
						if(checkMark.checked == true){
							selectedTask.push(checkMark);
							var p = document.getElementById(checkMark.id);
							p.remove();
						}
					});
		  });
		  //console.log(selectedList);
		  //console.log(selectedTask);
		

		 for(i = 0; i < selectedList.length; i++){
				//console.log(selectedList[i]);
				 task = {
					'tasklist': String(selectedList[i])

				  }
				  gapi.client.tasks.tasklists.delete(task).then(function(response) {
					//var childrens = document.getElementById('drop_select').children;
					Array.prototype.slice.call(document.getElementsByTagName('option')).forEach(
						function(item) {
						if(item.value == selectedList[i]){
							item.remove();
						}
						//listTaskLists();
                // or item.parentNode.removeChild(item); for older browsers (Edge-)
					});
				});
		  }
		  
		  for(i = 0; i < selectedTask.length; i++){
				//console.log(selectedTask[i].value);
				//console.log(selectedTask[i].id);
				list = {
					'tasklist': String(selectedTask[i].value),
					'task': String(selectedTask[i].id)
				}
				 gapi.client.tasks.tasks.delete(list).then(function(response) {
					//var childrens = document.getElementById('drop_select').children;
					
				});
		  }
		  
		  
		  
			
	  }

	//---------------------END DELETE SELECTED ELEMENT------------------------------------------------//        
      