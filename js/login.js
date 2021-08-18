$(function() {

    $('.btn-link[aria-expanded="true"]').closest('.accordion-item').addClass('active');
  $('.collapse').on('show.bs.collapse', function () {
	  $(this).closest('.accordion-item').addClass('active');
	});

  $('.collapse').on('hidden.bs.collapse', function () {
	  $(this).closest('.accordion-item').removeClass('active');
	});
});

function recordarSesion(user,recordar){
  if(recordar){
    localStorage.setItem('recordar', 'true');
    localStorage.setItem('user',JSON.stringify(user));
  }else{
    localStorage.setItem('recordar', 'false');
    sessionStorage.setItem('user',JSON.stringify(user));
  }
}

function crearUsuario(usuario,contrasenia){
  let user = {}
  user.email = usuario;
  user.contrasenia = contrasenia;
  user.conectado = true;
  recordarSesion(user,document.getElementById('chkRecordar').checked);
}

function iniciarConGoogle(googleUser) {
      /* PARA UTILIZAR LUEGO
      // The ID token you need to pass to your backend:
      var id_token = googleUser.getAuthResponse().id_token;
      */
      // Variable que contiene al usuario de google
      let profile = googleUser.getBasicProfile();
      crearUsuario(profile.getEmail(),profile.getName());
      location.href = "./index.html";
}

function iniciarConFacebook(facebookUser) {
  // Completar luego
}

function iniciarSesion(){
  let usuario = document.getElementById('usuario').value;
  let contrasenia = document.getElementById('contrasenia').value;
  if(verificarCampos(usuario, contrasenia)){
    $('#alertaError').modal('show');
  }else{
    if(emailValido(usuario)){
      $('#btnIniciar').popover('hide');
      crearUsuario(usuario,contrasenia);
      location.href = "./index.html";
    }else{
      $('#btnIniciar').popover('show');
    }
  }
}

function emailValido(email){
  // Expresion regular que evalua que las tres partes que componen a una direccion de correo sean válidas
  const expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  // Devuelvo true si es válido
  return expReg.test(email);
}

function verificarCampos(usuario,contrasenia) {
  // Devuelvo true si los campos están vacios
  return usuario.trim() === '' || contrasenia.trim() === ''
}
