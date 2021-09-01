const ORDENAR_ASC_POR_NOMBRE = "AZ";
const ORDENAR_DESC_POR_NOMBRE = "ZA";
const ORDENAR_MAYOR_PRECIO = "MAYOR_PRECIO";
const ORDENAR_MENOR_PRECIO = "MENOR_PRECIO";
const ORDENAR_POR_RELEVANCIA = "Relev.";
let productosActuales = [];

// Función que carga la lista de productos desde un array de objetos json
function mostrarProductos(criterio,productos){
    if(criterio != undefined) {productos = ordenarProductos(criterio);} // Ordeno según el criterio dado
    if(productos == undefined) {productos = productosActuales;} // Si no paso una lista en especifico uso la actual
    let contenidoHtml = "";
    for(product of productos){
      contenidoHtml += `
      <a href="product-info.html" class="list-group-item list-group-item-action">
          <div class="row">
              <div class="col-3">
                  <img src="` + product.imgSrc + `" alt="` + product.desc + `" class="img-thumbnail">
              </div>
              <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                      <h4 class="mb-1">`+ product.name +`</h4>
                      <small class="text-muted">` + product.soldCount + ` artículos</small>
                  </div>
                  <div class="d-flex w-100 justify-content-between">
                      <p class="mb-1">`+ product.description +`</p>
                  </div>
                  <div class="pt-5 d-flex w-100 justify-content-between">
                      <h5 class="">`+ product.cost +` ` + product.currency + `</h5>
                  </div>
              </div>
          </div>
      </a>
      `;
    }
    document.getElementById("cat-list-container").innerHTML = contenidoHtml;
}

function buscar(){
  let buscado = document.getElementById('buscador').value.toUpperCase();
  // Filtro productos por su nombre
  let productosBuscados = productosActuales.filter( producto => producto.name.toUpperCase().indexOf(buscado) != -1);
  mostrarProductos(undefined,productosBuscados);
}

function verificarMinMaxFiltros(minPrecio,maxPrecio){
  let min_max = [];
  min_max.push(minPrecio != undefined && minPrecio != '' && parseInt(minPrecio) >= 0 ? parseInt(minPrecio) : 0);
  min_max.push(maxPrecio != undefined && maxPrecio != '' && parseInt(maxPrecio) >= 0 ? parseInt(maxPrecio) : Infinity);
  return min_max;
}

function filtrar(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad vendidos
    //de productos por producto.
    let minPrecio = document.getElementById('rangeFilterCostMin').value;
    let maxPrecio = document.getElementById('rangeFilterCostMax').value;
    let min_max = verificarMinMaxFiltros(minPrecio, maxPrecio);
    minPrecio = min_max[0];
    maxPrecio = min_max[1];
    let productosFiltrados = productosActuales.filter( producto => producto.cost >= minPrecio && producto.cost <= maxPrecio );
    mostrarProductos(undefined,productosFiltrados);
}

function limpiarFiltro(){
    document.getElementById("rangeFilterCostMin").value = "";
    document.getElementById("rangeFilterCostMax").value = "";
    mostrarProductos();
}

function ordenarProductos(criterio){
  let productosOrdenados = [];
  switch(criterio){
    case ORDENAR_ASC_POR_NOMBRE || criterio == undefined:
      productosOrdenados = productosActuales.sort( (productoA,productoB) => productoA.name < productoB.name ? -1 : productoA.name > productoB.name ? 1 : 0 )
      break;
    case ORDENAR_DESC_POR_NOMBRE:
      productosOrdenados = productosActuales.sort( (productoA,productoB) => productoA.name > productoB.name ? -1 : productoA.name < productoB.name ? 1 : 0 );
      break;
    case ORDENAR_MAYOR_PRECIO:
      productosOrdenados = productosActuales.sort( (productoA,productoB) => productoA.cost > productoB.cost ?  -1 : productoA.cost < productoB.cost ? 1 : 0 );
      break;
    case ORDENAR_MENOR_PRECIO:
      productosOrdenados = productosActuales.sort( (productoA,productoB) => productoA.cost < productoB.cost ?  -1 : productoA.cost > productoB.cost ? 1 : 0 );
      break;
    case ORDENAR_POR_RELEVANCIA:
      productosOrdenados = productosActuales.sort( (productoA,productoB) => productoA.soldCount > productoB.soldCount ?  -1 : productoA.soldCount < productoB.soldCount ? 1 : 0 );
      break;
  }
  return productosOrdenados;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then( (resultObj) => {
        if (resultObj.status === "ok"){
            //Muestro los productos
            productosActuales = resultObj.data;
            mostrarProductos(ORDENAR_ASC_POR_NOMBRE);
        }
    });
});
