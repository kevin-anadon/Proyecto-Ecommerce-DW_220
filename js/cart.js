let subTotal = 0;
let envio = 0;
let total = 0;
let porcentajeEnvioActual = 0;
let divisaActual = 'UYU'
let carrito = {};
const radioButtons = document.getElementsByClassName('custom-control-input');

for (rBtn of radioButtons) { //Añado para cada radio button un addEventListener
  rBtn.addEventListener('change', (event) => {
    let porcentajeRbtn = event.target.value;
    porcentajeEnvioActual = porcentajeRbtn;
    envio = Math.round(porcentajeEnvioActual * subTotal);
    total = subTotal + envio;
    mostrarCosto();
  });
}

function cambiarCantidadProducto(e){
  let inputCantidad = e.target;
  let precioUnitario = inputCantidad.dataset.costo;
  let cantidadActual = inputCantidad.value;
  let cantidadAnterior = inputCantidad.dataset.cant;

  let costoUnitarioCantidadAnterior = precioUnitario * cantidadAnterior;
  let costoUnitarioCantidad = precioUnitario * cantidadActual;
  inputCantidad.dataset.cant = cantidadActual;
  console.log(inputCantidad.dataset.cant);

  subTotal += (costoUnitarioCantidad - costoUnitarioCantidadAnterior);
  envio = (porcentajeEnvioActual * subTotal);
  total = subTotal + envio;
  mostrarCosto();
}

function numeroConPuntoYDivisa(numero){
  return numero.toLocaleString('es-UY', {style: 'currency', currency: divisaActual, maximumFractionDigits: 0});
}

function mostrarCosto(){
  document.getElementById('productCostText').innerHTML = subTotal==0 ? '-' :  numeroConPuntoYDivisa(subTotal);
  document.getElementById('envioText').innerHTML = envio==0 ? '-' : numeroConPuntoYDivisa(envio);
  document.getElementById('totalCostText').innerHTML = total==0 ? '-' : numeroConPuntoYDivisa(total);
  document.getElementById('spanTotal').innerHTML = `Total (${divisaActual})`;
}

function cargarCostos(){
  let trArray = document.getElementById('productos').childNodes;
  for (tr of trArray) {
    let inputCantidad = tr.cells[2].childNodes[0];
    let costoUnitarioCantidad = inputCantidad.dataset.costo * inputCantidad.value;
    subTotal += costoUnitarioCantidad;
  }
  for (rBtn of radioButtons) {
    if(rBtn.checked){
      const envioPorSubtotal = Math.round(rBtn.value * subTotal);
      porcentajeEnvioActual = rBtn.value;
      envio = rBtn.checked ? envioPorSubtotal : envio;
    }
  }
  total = subTotal + envio;
}

function cotizarPrecio(precio, divisaAnterior, divisaCambiar){
  if(divisaAnterior === 'UYU' && divisaCambiar === 'USD'){
    return (precio / 40);
  }else if(divisaAnterior === 'USD' && divisaCambiar === 'UYU'){
    return (precio * 40);
  }
}

function transformarMoneda(unitCost, currency){
  switch (currency) {
    case 'USD':
      if(divisaActual === 'UYU'){
        unitCost = cotizarPrecio(unitCost, currency, divisaActual);
        currency = 'UYU';
      }
      return {unitCost, currency};
      break;
    case 'UYU':
      if(divisaActual === 'USD'){
        unitCost = cotizarPrecio(unitCost, currency, divisaActual);
        currency = 'USD';
      }
      return {unitCost, currency};
      break;
  }
}

function actualizarCotizacion(event){
  divisaActual = event.target.value;
  let filas = document.getElementById('productos').childNodes;
  for (fila of filas) {
    let celdaPrecio = fila.cells[3];
    let celdaInput = fila.cells[2].childNodes[0];
    let palabraSeparada = celdaPrecio.innerHTML.split(' ',2);
    let unitCostAnterior = parseFloat(palabraSeparada[0]);
    let currencyAnterior = palabraSeparada[1];
    ({unitCost, currency} = transformarMoneda(unitCostAnterior, currencyAnterior));
    celdaPrecio.innerHTML = `${unitCost} ${currency}`;
    celdaInput.dataset.costo = unitCost;
    subTotal = 0;
    cargarCostos();
    mostrarCosto();
  }
}

function eliminarProducto(event){
  let td = event.target.parentNode;
  let tr = td.parentNode;
  let inputCantidad = tr.cells[2].childNodes[0];
  let costoUnitarioCantidad = inputCantidad.dataset.costo * inputCantidad.value;
  subTotal -= (costoUnitarioCantidad);
  envio -= Math.round(porcentajeEnvioActual * costoUnitarioCantidad);
  total = (subTotal + envio);
  let tBody = tr.parentNode;
  tBody.removeChild(tr);
  mostrarCosto();
}

function iconoRojo(event){
  event.target.className = 'far fa-trash-alt fa-2x text-danger';
}

function iconoNegro(event){
  event.target.className = 'far fa-trash-alt fa-2x';
}

function mostrarProductos(){
  let contenidoHtml = ``;
  for ({name, count, unitCost, currency, src} of carrito.articles) {
    ({unitCost, currency} = transformarMoneda(unitCost, currency)); //Cotizo el costo unitario y la moneda
    contenidoHtml += `<tr>
    <td class="align-middle"><img height="80" src="${src}"></td>
    <td class="align-middle">${name}</td>
    <td class="align-middle"><input class="form-control text-center" type="number" min="1" style="width: 20%" data-cant=${count} data-costo=${unitCost} value=${count} onChange="cambiarCantidadProducto(event)"></td>
    <td class="align-middle">${unitCost} ${currency}</td>
    <td class="align-middle"><i class="far fa-trash-alt fa-2x" onmouseleave="iconoNegro(event)" onmouseover="iconoRojo(event)" onclick="eliminarProducto(event)"></i></td>
    </tr>`;
  }
  document.getElementById('productos').innerHTML = contenidoHtml;
}

function traerCarrito(){
  getJSONData(CART_URL)
  .then( (resultObj) => {
    if(resultObj.status === 'ok'){
      carrito = resultObj.data;
      mostrarProductos();
      cargarCostos();
      mostrarCosto();
    }
  });
}

document.addEventListener("DOMContentLoaded", (e) => {
  traerCarrito();
});
