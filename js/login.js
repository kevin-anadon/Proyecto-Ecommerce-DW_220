$(function() {

    $('.btn-link[aria-expanded="true"]').closest('.accordion-item').addClass('active');
  $('.collapse').on('show.bs.collapse', function () {
	  $(this).closest('.accordion-item').addClass('active');
	});

  $('.collapse').on('hidden.bs.collapse', function () {
	  $(this).closest('.accordion-item').removeClass('active');
	});



});

function verificarCampos() {
  let usuario = document.getElementById('usuario');
  let contrasenia = document.getElementById('contrasenia');
  // Verifico que los campos no estén vacios
  if(usuario.value.trim() === '' || contrasenia.value.trim() === ''){
    $('#alertaError').modal('show');
  }else{
    location.href = "./index.html"
  }
}
