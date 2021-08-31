const ORDENAR_ASC_POR_NOMBRE = "AZ";
const ORDENAR_DESC_POR_NOMBRE = "ZA";
const ORDENAR_ASC_POR_PRECIO = "AZPRECIO";
const ORDENAR_DESC_POR_PRECIO = "ZAPRECIO";
const ORDENAR_POR_CANTIDAD = "Cant.";
let productosActuales = [];
let criterioActual = undefined;
let minPrecio = undefined;
let maxPrecio = undefined;

// Función que carga la lista de productos desde un array de objetos json
function mostrarProductos(productos){
    let contenidoHtml = "";
    for(product of productos){
        if((minPrecio == undefined || minPrecio != undefined && parseInt(product.cost) >= minPrecio) && (maxPrecio == undefined || maxPrecio != undefined && parseInt(product.cost) <= maxPrecio)) {
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
}

function ordenarMostrarProductos(criterio, productosArray){
  criterioActual = criterio;
  if(productosArray != undefined){productosActuales = productosArray;}
  productosActuales = ordenarProductos(criterioActual, productosActuales);
  mostrarProductos(productosActuales);
}

function ordenarProductos(criterio, productosArray){
  let result = [];
  if (criterio === ORDENAR_ASC_POR_NOMBRE){
      result = productosArray.sort( (a, b) => {
          if ( a.name < b.name ){ return -1; }
          if ( a.name > b.name ){ return 1; }
          return 0;
      });
  }else if (criterio === ORDENAR_DESC_POR_NOMBRE){
      result = productosArray.sort( (a, b) => {
          if ( a.name > b.name ){ return -1; }
          if ( a.name < b.name ){ return 1; }
          return 0;
      });
  }else if (criterio === ORDENAR_ASC_POR_PRECIO){
    result = productosArray.sort( (a, b) => {
        if ( a.cost < b.cost ){ return 1; }
        if ( a.cost > b.cost ){ return -1; }
        return 0;
    });
  }else if (criterio === ORDENAR_DESC_POR_PRECIO){
      result = productosArray.sort( (a, b) => {
          if ( a.cost > b.cost ){ return 1; }
          if ( a.cost < b.cost ){ return -1; }
          return 0;
      });
  }else if (criterio === ORDENAR_POR_CANTIDAD){
      result = productosArray.sort( (a, b) => {
          let aCount = parseInt(a.soldCount);
          let bCount = parseInt(b.soldCount);

          if ( aCount > bCount ){ return -1; }
          if ( aCount < bCount ){ return 1; }
          return 0;
      });
  }

  return result;
}

function buscar(){
  let buscado = document.getElementById('buscador').value.toUpperCase();
  // Filtro productos por su nombre
  let productosBuscados = productosActuales.filter( (producto) => {
    return producto.name.toUpperCase().indexOf(buscado) > -1;
  });
  mostrarProductos(productosBuscados);
}

function filtrar(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad vendidos
    //de productos por producto.
    minPrecio = document.getElementById('rangeFilterCostMin').value;
    maxPrecio = document.getElementById('rangeFilterCostMax').value;

    if(minPrecio != undefined && minPrecio != '' && parseInt(minPrecio) >= 0){
        minPrecio = parseInt(minPrecio);
    }else{
        minPrecio = undefined;
    }

    if(maxPrecio != undefined && maxPrecio != '' && parseInt(maxPrecio) >= 0){
        maxPrecio = parseInt(maxPrecio);
    }else{
        maxPrecio = undefined;
    }

    mostrarProductos(productosActuales);
}

function limpiarFiltro(){
    document.getElementById("rangeFilterCostMin").value = "";
    document.getElementById("rangeFilterCostMax").value = "";
    minPrecio = undefined;
    maxPrecio = undefined;
    mostrarProductos(productosActuales);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then( (resultObj) => {
        if (resultObj.status === "ok"){
            //Muestro los productos
            productosActuales = resultObj.data;
            ordenarMostrarProductos(ORDENAR_ASC_POR_NOMBRE,productosActuales);
        }
    });
});
