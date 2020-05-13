
const life360 = require('../maps/life360-node-api-master/index.js');

let credentials;
var circles;
try {
  credentials = {
  email: window.life360username,
  password: window.life360password,
}

} catch (e) {
  if (e.constructor === Error && e.code === 'MODULE_NOT_FOUND') {
    console.error('credentials are not correct');
    return;
  } else {
    throw e;
  }
}
var gmarkers = [];
function loadmap(name) {
(async () => {

  try {
    
    let myCircle;
    for (var i = 0; i < circles.length; i++) {
        if (circles[i].name.toLowerCase() == window.circle.toLowerCase()) {
            myCircle = circles[i];
            break;
        }
    }
    var names = []
    var lati = []
    var longi = []
    var image = []
    var battery = []
    var address1 = []
    var address2 = []
    var driving = []
    var drive
    var json = await myCircle.request('/v3/circles/' + myCircle.id + '/members');
    for (var i = 0; i < json.members.length; i++) {
        var child = json.members[i];
        names.push(child.firstName);
        lati.push(child.location.latitude);
        longi.push(child.location.longitude);
        image.push(child.avatar);
        battery.push(child.location.battery);
        address1.push(child.location.address1);
        address2.push(child.location.address2);
        driving.push(child.driving);
    }
    var index;
    for (var i = 0; i < names.length; i++) {
        if(names[i] == name){
            index = i;
            break;
        }
    }
    
    if (driving[index]) {
        drive = " is "
    }
    else {
        drive = " is not "
    }
    var custom_marker = {
        url: image[index],
        // This marker is 20 pixels wide by 32 pixels high.
        //size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
        scaledSize: new google.maps.Size(50, 50)
    };
    const center = new google.maps.LatLng(lati[index], longi[index]);
    window.map.panTo(center);
    if (gmarkers.length != 0){
        gmarkers[0].setMap(null);
        gmarkers = [];
    }
    var marker = new google.maps.Marker({
        position: center,
        map: window.map,
        title: name,
        animation: google.maps.Animation.DROP,
        icon: custom_marker
    });
    gmarkers.push(marker);

    document.getElementById('address').innerHTML = "Address: " + address1[index] + ", " + address2[index];
    document.getElementById('batteryLevel').innerHTML = "Battery Level: " + battery[index] + "%";
    document.getElementById('driving').innerHTML = name + drive + "currently driving";
  
  } catch (e) {
    console.log(e);
  }

})();
}

function getNames() {
(async () => {

  try {
    await life360.login(credentials);
    circles = await life360.circles()
    

    let myCircle;
    for (var i = 0; i < circles.length; i++) {
        if (circles[i].name.toLowerCase() == window.circle.toLowerCase()) {
            myCircle = circles[i];
            break;
        }
    }
    var names = []
    var json = await myCircle.request('/v3/circles/' + myCircle.id + '/members');
    for (var i = 0; i < json.members.length; i++) {
        var child = json.members[i];
        
        var newDiv = document.createElement("div");
        newDiv.classList.add('hero-single-btn-container"');
        
        var btn = document.createElement("button");
        btn.classList.add("button");
        btn.innerHTML = child.firstName;
        newDiv.appendChild(btn);
        var familybt = document.getElementById('familyButtons');
        familybt.appendChild(newDiv);
        
        btn.onclick = (e) => {loadmap(e.currentTarget.innerHTML)};
    }


  } catch (e) {
    var newDiv = document.createElement("div");
    newDiv.classList.add('hero-single-btn-container"');

    var btn = document.createElement("button");
    btn.classList.add("button");
    btn.innerHTML = "Connect Life360 Account";
    newDiv.appendChild(btn);
    var familybt = document.getElementById('familyButtons');
    familybt.appendChild(newDiv);

    btn.onclick = function () {
        location.href = "../connectlife360.php";
    };
    document.getElementById('infoPanel').innerHTML = "Ensure your information was inputted correctly";
    
    console.log(e);
  }

})();

}
getNames(); 
