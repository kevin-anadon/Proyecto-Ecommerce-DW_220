function googleSignOut(){
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut();
}

function onLoad() {
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
}
