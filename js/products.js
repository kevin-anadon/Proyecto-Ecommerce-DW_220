var productsArray = [];


// Función que carga la lista de productos desde un array de objetos json
function showProductsList(products){
    let contenidoHtml = "";
    for(product of products){
        contenidoHtml += `
        <div class="list-group-item list-group-item-action">
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
                </div>
            </div>
        </div>
        `;
        document.getElementById("cat-list-container").innerHTML = contenidoHtml;
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            productsArray = resultObj.data;
            //Muestro los productos
            showProductsList(productsArray);
        }
    });
});
