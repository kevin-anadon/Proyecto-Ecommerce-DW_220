const btnGuardar = document.getElementById('btnGuardarInfo');
const btnEditar = document.getElementById('btnEditarImg');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const edad = document.getElementById('edad');
const imgUrl = document.getElementById('imgPerfilUser');


btnEditar.addEventListener('click', () => {
  document.getElementById('input_img').click();
});

btnGuardar.addEventListener('click',() => {
  if(chequarVacio()){
    //Se guardan los datos en el caso de no que estén los campos vacíos
    if(!emailValido(email.value)){
      //Alerta con SweetAlert en caso de que no sea un email válido
      return Swal.fire({
        title: 'Ingrese un mail válido',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }else{
      if(telefonoValido()){
        if(edadValida()){
          const user = {email: email.value, nombre: nombre.value, apellido: apellido.value, conectado: true, imgUrl: imgUrl.src, telefono: telefono.value,edad: edad.value};
          guardarUsuario(user);
          mostrarUsuario(user);
          return Swal.fire({
            title: 'Cambios guardados con exito!',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }else{
          return Swal.fire({
            title: 'Ingrese una edad válida',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
    }else{
      return Swal.fire({
        title: 'Número de teléfono no válido',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
  }else{
    //Alerta con SweetAlert
    return Swal.fire({
      title: 'Debe completar todos los campos',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
});

function chequarVacio(){ // Devuelvo false si hay algún campo vacio
  return edad.value != 0 && telefono.value != 0 && email.value.trim() != '' && apellido.value.trim() != '' && nombre.value.trim() != '';
}

function edadValida(){ // Devuelvo false si la edad es negativa o nula
  return edad.value > 0 && edad.value < 200;
}

function telefonoValido(){ // Devuelvo false en el caso que no sea válido (respondiendo al formato uruguayo)
  const telString = telefono.value.toString().split(' ').join('').length;
  return telString == 9;
}

function guardarUsuario(user){
  const recordar= localStorage.getItem('recordar');
  if(recordar === 'true'){
    localStorage.setItem('user',JSON.stringify(user));
  }else{
    sessionStorage.setItem('user',JSON.stringify(user));
  }
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
      mostrarUsuario(user);
   });
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
