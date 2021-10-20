const btnGuardar = document.getElementById('btnGuardarInfo');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const edad = document.getElementById('edad');
const imgUrl = document.getElementById('imgPerfilUser');


btnGuardar.addEventListener('click',() => {
  if(!emailValido(email.value)){
    //Alerta con SweetAlert
    return Swal.fire({
      title: 'Ingrese un mail válido',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
  if(chequarVacio()){
    //Se guardan los datos en el caso de no que estén los campos vacíos
    guardarUsuario({email: email.value, nombre: nombre.value, apellido: apellido.value, conectado: true, imgUrl: imgUrl.src, telefono: telefono.value,edad: edad.value});
    return Swal.fire({
      title: 'Cambios guardados con exito!',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }else{
    //Alerta con SweetAlert
    return Swal.fire({
      title: 'Debe completar todos los campos',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
});

function guardarUsuario(user){
  const recordar= localStorage.getItem('recordar');
  if(recordar === 'true'){
    localStorage.setItem('user',JSON.stringify(user));
  }else{
    sessionStorage.setItem('user',JSON.stringify(user));
  }
}

function chequarVacio(){ // Devuelvo false si hay algún campo vacio
  return nombre.value.trim() != '';
  // return nombre.value.trim() != '' || apellido.value.trim() != '' || email.value.trim() != '' || telefono.value. != 0 || edad.value != 0;
}

function cargarInfoUsuario(){
  let usuario = traerUsuario();
  nombre.value = usuario.nombre;
  apellido.value = usuario.apellido;
  email.value = usuario.email;
  imgUrl.src = usuario.imgUrl;
  if(usuario.telefono != undefined){
    telefono.value = usuario.telefono;
    edad.value = usuario.edad;
  }
}

function darFormatoInputs(){
  let cleave = new Cleave('#telefono', {
    phone: true,
    phoneRegionCode: 'UY'
  });
}

function cambioArchivo(){
  let file = document.getElementById('input_img');
  let form = new FormData();
  form.append("image", file.files[0]);

  let settings = {
      "url": "https://api.imgbb.com/1/upload?key=523c9bd289e96f557707e25ac7b7b9bb",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
   };


   $.ajax(settings).done(function(response) {
      const respuesta = JSON.parse(response);
      let user = traerUsuario();
      user.imgUrl = respuesta.data.url;
      console.log(user);
      guardarUsuario(user);
      cargarInfoUsuario();
   });
}

document.addEventListener("DOMContentLoaded", (e) => {
  cargarInfoUsuario();
  darFormatoInputs();
});
