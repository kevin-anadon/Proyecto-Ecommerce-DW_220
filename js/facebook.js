function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback');
  console.log(response);                   // The current login status of the person.
  let usuario = '' ;
  let nombre = '';
  if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    testAPI();
    //FB.api('/me',(response) => {
    //  usuario = response.email;
    //  nombre = response.name;
    });
    console.log(usuario);
    //iniciarConFacebook(usuario,nombre);
  } else {                                 // Not logged into your webpage or we are unable to tell.
    //no conectado
  }
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '832729297606995',
    cookie     : true,                     // Enable cookies to allow the server to access the session.
    xfbml      : true,                     // Parse social plugins on this webpage.
    version    : 'v3.2'           // Use this Graph API version for this call.
  });


  FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
    statusChangeCallback(response);        // Returns the login status.
  });
};

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
   console.log('Welcome!  Fetching your information.... ');
   FB.api('/me', function(response) {
     return console.log('Successful login for: ' + response.name);
   });
 }
