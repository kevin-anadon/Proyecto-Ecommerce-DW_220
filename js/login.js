$(function() {
    $('.btn-link[aria-expanded="true"]').closest('.accordion-item').addClass('active');
  $('.collapse').on('show.bs.collapse', function () {
	  $(this).closest('.accordion-item').addClass('active');
	});

  $('.collapse').on('hidden.bs.collapse', function () {
	  $(this).closest('.accordion-item').removeClass('active');
	});
});

function verificarEnter(e){
  let tecla = (document.all) ? e.keyCode : e.which;
  if(tecla == 13) { iniciarSesion(); }
}

function recordarSesion(user,recordar){
  if(recordar){
    localStorage.setItem('recordar', 'true');
    localStorage.setItem('user',JSON.stringify(user));
  }else{
    localStorage.setItem('recordar', 'false');
    sessionStorage.setItem('user',JSON.stringify(user));
  }
}

function crearUsuario(usuario,nombre,imgUrl){
  let user = {}
  user.email = usuario;
  user.nombre = nombre;
  user.conectado = true;
  user.imgUrl = imgUrl;
  recordarSesion(user,document.getElementById('chkRecordar').checked);
}

function iniciarConGoogle(googleUser) {
      /* PARA UTILIZAR LUEGO
      // The ID token you need to pass to your backend:
      var id_token = googleUser.getAuthResponse().id_token;
      */
      // Variable que contiene al usuario de google
      let profile = googleUser.getBasicProfile();
      crearUsuario(profile.getEmail(),profile.getName(),profile.getImageUrl());
      location.href = "./index.html";
}

function iniciarConFacebook(facebookUser) {
  crearUsuario(facebookUser.email,`${facebookUser.first_name} ${facebookUser.last_name}`,`${facebookUser.picture.data.url}`);
  location.href = "./index.html";
}

function iniciarSesion(){
  let usuario = document.getElementById('usuario').value;
  let contrasenia = document.getElementById('contrasenia');
  if(verificarCampos(usuario, contrasenia.value)){
    $('#alertaError').modal('show');
  }else{
    if(emailValido(usuario)){
      $('#btnIniciar').popover('hide');
      hash = encriptar(contrasenia.value); // En un caso real lo guaradaría en la base de datos y luego en el login compararía con bycrptSync.compare
      crearUsuario(usuario,'Juan Pérez','./img/profileUser.png'); // Nombre de prueba e imagen por defecto, ya que en un caso real los datos los traigo de una base de datos
      location.href = "./index.html";
    }else{
      $('#btnIniciar').popover('show');
    }
  }
}

function encriptar(texto){
  let bycrypt = dcodeIO.bcrypt;
  let salt = bycrypt.genSaltSync(10);
  let hash = bycrypt.hashSync(texto,salt);
  return hash;
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
