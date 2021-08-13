$(function() {

    $('.btn-link[aria-expanded="true"]').closest('.accordion-item').addClass('active');
  $('.collapse').on('show.bs.collapse', function () {
	  $(this).closest('.accordion-item').addClass('active');
	});

  $('.collapse').on('hidden.bs.collapse', function () {
	  $(this).closest('.accordion-item').removeClass('active');
	});



});

const iniciarSesion = () => {
  let user = {}
  // En caso de que esté seleccionada la casilla de Recordarme
  // Guardo en la variable recordarSesion, localStorage de no ser así guardo sessionStorage
  let storage =  document.getElementById('chkRecordar').checked ? window.localStorage : window.sessionStorage;
  let usuario = document.getElementById('usuario').value;
  let contrasenia = document.getElementById('contrasenia').value;
  if(verificarCampos(usuario, contrasenia)){
    $('#alertaError').modal('show');
  }else{
    if(emailValido(usuario)){
      $('#btnIniciar').popover('hide');
      user.email = usuario;
      user.contrasenia = contrasenia;
      user.connected = true;
      console.log("Prueba1");
      storage.setItem('user',JSON.stringify(user));
      return console.log("Prueba2");
      location.href = "./index.html"
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
