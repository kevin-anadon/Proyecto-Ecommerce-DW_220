let subTotal = 0;
let envio = 0;
let total = 0;
let porcentajeEnvioActual = 0;
let divisaActual = 'UYU'
let carrito = {};
const coordenadasLatu = [-34.878992,-56.076797];
let mapa = null;
let marker = null;

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
  const celdaCostoUnitario = e.target.parentNode.parentNode.cells[4];
  const precioUnitario = inputCantidad.dataset.costo;
  const cantidadActual = inputCantidad.value;
  const cantidadAnterior = inputCantidad.dataset.cant;

  const costoUnitarioCantidadAnterior = precioUnitario * cantidadAnterior;
  const costoUnitarioCantidad = precioUnitario * cantidadActual;
  inputCantidad.dataset.cant = cantidadActual;
  celdaCostoUnitario.innerHTML = `${numberToLocaleString(costoUnitarioCantidad)}`;

  subTotal += (costoUnitarioCantidad - costoUnitarioCantidadAnterior);
  envio = (porcentajeEnvioActual * subTotal);
  total = subTotal + envio;
  mostrarCosto();
}

function numberToLocaleString(numero){
  return numero.toLocaleString('es-UY', {style: 'currency', currency: divisaActual, maximumFractionDigits: 1});
}

function localeStringToNumber(numero){
  return parseFloat(numero.split('$')[1]);
}

function mostrarCosto(){
  document.getElementById('productCostText').innerHTML = subTotal==0 ? '-' :  numberToLocaleString(subTotal);
  document.getElementById('envioText').innerHTML = envio==0 ? '-' : numberToLocaleString(envio);
  document.getElementById('totalCostText').innerHTML = total==0 ? '-' : numberToLocaleString(total);
  document.getElementById('spanTotal').innerHTML = `Total (${divisaActual})`;
}

function cargarCostos(){
  let trArray = document.getElementById('productos').childNodes;
  for (tr of trArray) {
    const inputCantidad = tr.cells[2].childNodes[0];
    const cantidad = inputCantidad.value;
    const precio = inputCantidad.dataset.costo;
    const costoUnitarioCantidad = cantidad * precio;
    tr.cells[4].innerHTML = `${numberToLocaleString(costoUnitarioCantidad)}`;
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
  const filas = document.getElementById('productos').childNodes;
  const currencyAnterior = divisaActual;
  divisaActual = event.target.value;
  for (fila of filas) {
    let celdaPrecio = fila.cells[3];
    let celdaInput = fila.cells[2].childNodes[0];
    const unitCostAnterior = parseFloat(celdaInput.dataset.costo);

    ({unitCost, currency} = transformarMoneda(unitCostAnterior, currencyAnterior));
    celdaPrecio.innerHTML = `${numberToLocaleString(unitCost)}`;
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
    const precioUnitario = numberToLocaleString(unitCost);
    const unitarioPorCantidad = numberToLocaleString(unitCost*count);
    contenidoHtml += `<tr>
    <td class="align-middle"><img height="80" src="${src}"></td>
    <td class="align-middle">${name}</td>
    <td class="align-middle"><input class="form-control text-center" type="number" min="1" style="width: 25%" data-cant=${count} data-costo=${unitCost} value=${count} onChange="cambiarCantidadProducto(event)"></td>
    <td class="align-middle">${precioUnitario}</td>
    <td class="align-middle">${unitarioPorCantidad}</td>
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

function comprar(){
  for (elemento of document.getElementsByClassName('envioForms')){ // Por cada elemento del apartado de envío reviso que no estén vacios
    if(elemento.value.trim() == ''){
      //Alerta con SweetAlert
      return Swal.fire({
        title: 'Debe completar los campos de envío',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
}

function mostrarPaises(paises){
  let contenidoHtml = ``;
  for ({name} of paises) {
    let selected = name == 'Uruguay' ? 'selected' : '';
    contenidoHtml += `<option ${selected} value="${name}">${name}</option>`;
  }
  document.getElementById('pais').innerHTML = contenidoHtml;
}

function traerPaises(){
  getJSONData(PAISES_URL)
  .then( (resultObj) => {
    if(resultObj.status === 'ok'){
      mostrarPaises(resultObj.data);
    }
  });
}

function obtenerDireccion(){
  const coordenadas = navigator.geolocation.getCurrentPosition(({coords}) => {
    cargarMapa([coords.latitude,coords.longitude]);
  });
}

function cargarMapa(coordenadas){
  if(mapa == null){
    mapa = L.map('leafletMap').setView(coordenadas,16);
    // Configuraciones
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessTokenMapBox}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessTokenMapBox: accessTokenMapBox
    }).addTo(mapa);
    marker = L.marker(coordenadas).addTo(mapa);
    mapa.on('click',clickMap);
  }else{
    mapa.setView(coordenadas,16);
    marker.removeFrom(mapa);
    marker = L.marker(coordenadas).addTo(mapa);
  }
}

function clickMap(event){
  mapa.setView(event.latlng,16);
  marker.removeFrom(mapa);
  marker = L.marker(event.latlng).addTo(mapa);
}

document.addEventListener("DOMContentLoaded", (e) => {
  traerCarrito();
  traerPaises();
  cargarMapa(coordenadasLatu);
});
