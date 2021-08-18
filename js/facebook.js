function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback');
  console.log(response);                   // The current login status of the person.
  let usuario = '' ;
  let nombre = '';
  if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    FB.api('/me',(response) => {
      usuario = response.email;
      nombre = response.name;
    });
    iniciarConFacebook(usuario,nombre);
  } else {                                 // Not logged into your webpage or we are unable to tell.
    //no conectado
  }
}


function checkLoginState() {               // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function(response) {   // See the onlogin handler
    statusChangeCallback(response);
  });
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
