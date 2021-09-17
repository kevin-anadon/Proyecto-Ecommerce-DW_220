const ORDERNAR_DESC_POR_FECHA = 'Desc-Fecha';
let productoActual = {}
let puntuacionActual = 1;

function crearCarousel(){
  let carousel = `
    <div id="carousel-container" class="col-md-6 carousel slide w-50 h-50" data-ride="carousel">
    <ol class="carousel-indicators">
    `;
  for(let i=0; i<productoActual.images.length; i++){
    let active = i==0 ? 'active' : ''
    carousel += `<li data-target="#carousel-container" data-slide-to="${i}" class="${active}"></li>
    `;
  }
  carousel += `</ol>
    <div class="carousel-inner">`;

  let i=1;
  for(let img of productoActual.images){
    let active = i== 1 ? 'active' : '';
    carousel += `
      <div class="carousel-item ${active}">
        <img class="d-block w-100" src="${img}" alt="${i} slide">
      </div>`;
    i+=1;
  }

  carousel += `
    </div>
        <a class="carousel-control-prev" href="#carousel-container" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carousel-container" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>`;
  return carousel;
}

function mostrarProducto(){
  let carousel = crearCarousel();
  let contenidoHtml = `
            ${carousel}
            <div class="col">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">${productoActual.name}</h4>
              <small class="text-muted">${productoActual.soldCount} vendidos</small>
            </div>
            <div class="d-flex w-100 justify-content-between pt-2">
              <p class="mb-1">${productoActual.description}</p>
            </div>
            <div class="pt-5 d-flex w-100 justify-content-between">
              <h4 class="">${productoActual.cost} ${productoActual.currency}</h4>
            </div>
            </div>`;
  document.getElementById('producto-container').innerHTML = contenidoHtml;
}

function mostrarRelacionados(productos){
  let productosRelacionados = filtarProductosRelacionados(productos);
  let contenidoHtml = ``;
  for (let producto of productosRelacionados){
    contenidoHtml += `<div class="col-md-4">
      <a class="text-dark" style="text-decoration: none;" href="./product-info.html">
      <div class="card card-rel mb-4 box-shadow">
        <img class="card-img-top" src="${producto.imgSrc}">
        <div class="card-body">
          <h4 class="mb-1">${producto.name}</h4>
          <div class="pt-4 d-flex w-100 justify-content-between">
            <h5 class="">${productoActual.cost} ${productoActual.currency}</h5>
          </div>
        </div>
      </div>
    </div>
    </a>`;
  }
  document.getElementById('productos-relacionados').innerHTML = contenidoHtml;
}

function filtarProductosRelacionados(productos){
  let productosRelacionados = [];
  for (let i = 0; i < productos.length; i++) {
    let producto = productos[i];
    for(prodRel of productoActual.relatedProducts){
      if(i == prodRel){
        productosRelacionados.push(producto);
      }
    }
  }
  return productosRelacionados;
}

function traerProductos(){
  getJSONData(PRODUCTS_URL).then( (resultObj) => {
    if(resultObj.status === "ok"){
      mostrarRelacionados(resultObj.data);
    }
  });
}

function ponerEstrellas(score){
  let estrellas = '';
  for(let i = 1; i <=5; i++){
    if(score >= i){
      estrellas += '<i class="fas fa-star fa-sm text-warning"></i>'
    }else if(score < i) {
      estrellas += '<i class="far fa-star fa-sm text-warning"></i>'
    }
  }
  return estrellas;
}

function stringToDate(stringDate){
  let dateFormatted = luxon.DateTime.fromSQL(stringDate);
  return dateFormatted;
}

// ORDENO LOS COMENTARIOS DEL MÁS RECIENTE AL MÁS ANTIGUO
function ordenarComentarios(criterio,comentarios){
  let comentariosOrdenados = [];
  switch(criterio){
    case ORDERNAR_DESC_POR_FECHA:
      comentariosOrdenados = comentarios.sort( (comentarioA,comentarioB) => stringToDate(comentarioA.dateTime) > stringToDate(comentarioB.dateTime) ? -1 : stringToDate(comentarioA.dateTime) < stringToDate(comentarioB.dateTime) ? 1 : 0);
      break;
  }
  return comentariosOrdenados;
}

function mostrarComentarios(comentarios){
  let comentarios_body = document.getElementById('comentarios-body');
  let contenidoHtml = '';
  ordenarComentarios(ORDERNAR_DESC_POR_FECHA,comentarios);
  let usuario = traerUsuario();
  let imgUrl = './img/profileUser.png'
  if(usuario.email == comentarios[0].user){ // TRAIGO INFORMACIÓN DEL USUARIO QUE ENVIO EL COMENTARIO
    imgUrl = usuario.imgUrl;
    comentarios[0].user = usuario.nombre;
  }
  for(let comentario of comentarios) {
    contenidoHtml += `<div class="d-flex flex-start mb-4">
          <img
            class="rounded-circle shadow-1-strong me-3"
            src="${imgUrl}"
            alt="avatar"
            width="50"
            height="50"
          >
          <div class="card w-100 ml-2">
            <div class="card-body p-4">
              <div class="">
                <h5>${comentario.user}</h5>
                <p class="small">${comentario.dateTime}</p>
                <p>${comentario.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">${ponerEstrellas(comentario.score)}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>`;
  }
  if(comentarios_body.value != ''){ // Si el usuario ingresa un comentario, el mismo se mostrará primero
    comentarios_body.insertAdjacentHTML('afterBegin', contenidoHtml);
  }else{
    comentarios_body.innerHTML += contenidoHtml;
  }
}

function estrellas(e){ //SETEO LAS ESTRELLAS DE SOLID A REGULAR O BICEVERSA DEPENDIENDO DEL CASO
  let container = document.querySelector('.rating');
  let items = container.querySelectorAll('.fa-star');
  if(e != undefined){puntuacionActual = e.target.getAttribute('data-rate');}
  for(let i=1; i <= 5; i++){
    if(puntuacionActual >= i){
      items[i-1].classList.replace('far','fa');
      items[i-1].classList.add('checked');
    }else if(puntuacionActual < i){
      items[i-1].classList.replace('fa','far');
      items[i-1].classList.remove('checked');
    }
  }
}

function subirComentario(){
  let comentarios = []
  let comentario = {};
  let mensaje = document.getElementById('textArea-comentario');
  let puntuación = puntuacionActual;
  if(mensaje.value.trim() != ''){ //EN EL CASO DE QUE EL MENSAJE ESTÉ VACIO SE AVISA AL USUARIO
    if(puntuación != 0){
      comentario.score = puntuación;
      comentario.description = mensaje.value;
      comentario.user = traerUsuario().email;
      comentario.dateTime = traerFechaActual();
      comentarios.push(comentario);
      mensaje.value = '';
      puntuacionActual = 1;
      estrellas();
      mostrarComentarios(comentarios);
    }else{
      alert("Ingrese una calificación mayor a 0 estrellas")
    }
  }else{
    //Alerta con SweetAlert
    Swal.fire({
      title: 'Ingrese una opinión',
      text: 'Debe ingresar un comentario válido',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }
}

function traerFechaActual(){
  let fecha = luxon.DateTime.now().toFormat("yyyy'-'MM'-'dd HH':'mm':'ss'");
  return fecha;
}

function traerComentarios(){
  getJSONData(PRODUCT_INFO_COMMENTS_URL).then( (resultObj) => {
    if(resultObj.status === "ok"){
      mostrarComentarios(resultObj.data);
    }
  });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", (e) => {
  getJSONData(PRODUCT_INFO_URL).then( (resultObj) => {
    if(resultObj.status === "ok"){
      productoActual = resultObj.data;
      mostrarProducto();
      traerProductos();
      document.getElementById('img-profile-comment').src = traerUsuario().imgUrl; //Seteo foto de perfil en añadir comentario
      traerComentarios();
    }
  });
});
