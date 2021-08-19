function cerrarSesion(){
  let user = {};
  let facebookAuth = {};
  if(localStorage.getItem('recordar') === 'true'){
    user = JSON.parse(localStorage.getItem('user'));
    user.conectado = false;
    localStorage.setItem('user', JSON.stringify(user));
  }else{
    console.log("Session");
    user = JSON.parse(sessionStorage.getItem('user'));
    user.conectado = false;
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  // Google signOut
  if(gapi.auth2 != undefined){googleSignOut();}
  // Facebook signOut
  facebookAuth = JSON.parse(sessionStorage.getItem('fbssls_832729297606995'));
  if(facebookAuth != undefined && facebookAuth.status === 'connected' ){facebookSignOut();};
  location.href = "./login.html";
}
