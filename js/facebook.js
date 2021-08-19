function statusChangeCallback(response) {                      // Called with the results from FB.getLoginStatus().
  if (response.status === 'connected') return fbUserLogin();   // Logged into your webpage and Facebook.
}


function checkLoginState() {               // Called when a person is finished with the Login Button.
  FB.getLoginStatus( (response) => {       // See the onlogin handler
    statusChangeCallback(response);
  });
}


window.fbAsyncInit = () => {
  FB.init({
    appId      : '832729297606995',
    cookie     : false,                    // Enable cookies to allow the server to access the session.
    xfbml      : true,                     // Parse social plugins on this webpage.
    version    : 'v11.0'                   // Use this Graph API version for this call.
  });


  FB.getLoginStatus( (response) => {   // Called after the JS SDK has been initialized.
    statusChangeCallback(response);        // Returns the login status.
  });
};

function fbUserLogin() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  FB.api('/me', 'GET',{"fields":"email,first_name,last_name,id,gender"},
  (response) => {
    iniciarConFacebook(response);
  });
}

function facebookSignOut(){
  FB.logout( (response) => {
    console.log("Usuario desconectado");
  });
}
