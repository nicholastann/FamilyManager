const assert = require('chai').assert;
const life360 = require('../index.js');

let credentials;
try {
  credentials = require('./credentials.js');
} catch (e) {
  if (e.constructor === Error && e.code === 'MODULE_NOT_FOUND') {
    console.error('IMPORTANT');
    console.error('Copy the "credentials-example.json" file and rename it to "credentials.json" before running any tests.');
    console.error('Make sure you add your email or phone, and password to the credentials.js file!');
    return;
  } else {
    throw e;
  }
}

(async () => {

  try {
    await life360.login(credentials);
    let circles = await life360.circles()

    let myCircle = circles[0]
    var json = await myCircle.request('/v3/circles/' + myCircle.id + '/members');
    for (var i = 0; i < json.members.length; i++) {
        var child = json.members[i];
        console.log(JSON.stringify(child.firstName));

    }
    
  } catch (e) {
    console.log(e);
  }

})();
