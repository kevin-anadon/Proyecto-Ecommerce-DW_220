const btnGuardar = document.getElementById('btnGuardarInfo');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const edad = document.getElementById('edad');


btnGuardar.addEventListener('click',() => {
  if(!chequarVacio()){
    //Se guardan los datos en el caso de no que estén los campos vacíos
    alert("Campos")
  }
});

function chequarVacio(){ // Devuelvo true si hay algún campo vacio
  return nombre.value.trim() === '' || apellido.value.trim() === '' || email.value.trim() === '' || telefono.value. == 0 || edad.value == 0;
}

function cargarInfoUsuario(){
  let usuario = traerUsuario();
  nombre.value = usuario.nombre;
  apellido.value = usuario.apellido;
  email.value = usuario.email;
  document.getElementById('imgPerfilUser').src = usuario.imgUrl;
}

function darFormatoInputs(){
  let cleave = new Cleave('#telefono', {
    phone: true,
    phoneRegionCode: 'UY'
  });
}

document.addEventListener("DOMContentLoaded", (e) => {
  cargarInfoUsuario();
  darFormatoInputs();
});
