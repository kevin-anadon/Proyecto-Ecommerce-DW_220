function cerrarSesion(){
  let user = {};
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
  if(gapi.auth2 != undefined){
    googleSignOut();
  }
  location.href = "./login.html";
}
