let subTotal = 0;
let envio = 0;
let total = 0;
let porcentajeEnvioActual = 0;
let divisaActual = 'UYU'
let carrito = {};
let mapa = null;
let marker = null;

const inputsMetPagoTarjeta = document.getElementsByClassName('tarjetaInputs');
const inputsMetPagoBanco = document.getElementsByClassName('bancoInputs');
const radioButtons = document.getElementsByClassName('rbtns');
const forms = document.getElementsByClassName('needs-validation');

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

function checkEnvioVacio(){
  for (elemento of document.getElementsByClassName('envioForms')){ // Por cada elemento del apartado de envío reviso que no estén vacios
    if(elemento.value.trim() == '' && !document.getElementById('chkMapa').checked){
      return false;
    }
  }
  return true
}

function checkMetPagoVacio(){
  //Compruebo que el usuario haya elegido un método de pago
  let check = true;
  for (const inputBanco of inputsMetPagoBanco) {
    if (inputBanco.parentNode.parentNode.style.display !== 'none'){
      if(inputBanco.value.trim() == 0 || inputBanco.value.trim() === ''){
        check = false;
      }
    }
  }

  for (const inputTarjeta of inputsMetPagoTarjeta) {
    const rowInput = Array.from(inputTarjeta.className.split(' ')).find( clase => clase == 'rowInput');
    let divContainer = inputTarjeta.parentNode.parentNode;

    if(rowInput){
      divContainer = divContainer.parentNode;
    }

    if (divContainer.style.display !== 'none'){
      if(inputTarjeta.value.trim() == 0 || inputTarjeta.value.trim() === ''){
        check = false;
      }
    }
    }
    return check;
}

function comprar(){
  if(!checkEnvioVacio()){
    return Swal.fire({
      title: 'Debe completar los campos de envío',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }else if (!checkMetPagoVacio()) {
    return Swal.fire({
      title: 'Debe seleccionar un método de pago',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
  return Swal.fire({
    title: 'Compra realizada con éxito',
    icon: 'success',
    confirmButtonText: 'Ok'
  });
}

function activarOpcionModal(event){
  const metodoPago = event.target.value;
  const tarjeta = document.getElementById('tarjeta-container');
  const banco = document.getElementById('banco-container');
  switch (metodoPago) {
    case 'tarjeta':
      banco.style = 'display:none;';
      tarjeta.style.display = null;
    break;

    case 'banco':
      banco.style.display = null;
      tarjeta.style = 'display:none;';
    break;
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

function obtenerDireccion(event){
  let leafletMap = document.getElementById('leafletMap');
  let formEnviar = document.getElementById('form-envio');
  if(event.target.checked){
    leafletMap.style.height = '34vh';
    // Traigo las coordenadas y las cargo al mapa
    navigator.geolocation.getCurrentPosition( ({coords}) => {
      cargarMapa([coords.latitude,coords.longitude]);
    });
    formEnviar.style.pointerEvents = 'none'
    formEnviar.className = 'transparente';
  }else{
    leafletMap.style.height = '0px';
    formEnviar.style.pointerEvents = null;
    formEnviar.classList.remove('transparente');
  }
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
    mapa.setView(false);
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

function activarTooltips(){
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
}

function formatearInputs(){
  const imgLogo = document.getElementById('logoCard');
  const tarjeta = new Cleave('#nro-tarjeta', {
    creditCard: true,
    onCreditCardTypeChanged: (type) => {
       if(type !== 'unknown'){
         imgLogo.style.display = null;
       }
       switch (type) { // Seteo el logo de la tarjeta según el tipo
         case 'mastercard':
          imgLogo.src = './img/logo-Mastercard.png';
         break;

         case 'visa':
          imgLogo.src = './img/logo-Visa.png';
         break;

         case 'diners':
          imgLogo.src = './img/logo-Diners.png';
         break;

         case 'amex':
          imgLogo.src = './img/logo-Amex.png';
         break;

         case 'discover':
          imgLogo.src = './img/logo-Discover.png';
         break;

         case 'jcb':
          imgLogo.src = './img/logo-Jcb.png';
         break;

         case 'uatp':
          imgLogo.src = './img/logo-Uatp.png';
         break;

         case 'instapayment':
          imgLogo.src = './img/logo-Instapayment.png';
         break;

         case 'mir':
          imgLogo.src = './img/logo-Mir.png';
         break;

         case 'unionPay':
          imgLogo.src = './img/logo-Unionpay.png';
         break;

         default:
          imgLogo.style.display = 'none'
         break;
       }
    }
  });

  const vencimiento = new Cleave('#fecha-tarjeta',{
    date: true,
    datePattern: ['m', 'Y']
  });
}

function setValidForms(){
  for (const form of forms) {
    form.addEventListener('submit',(event) => {
      comprar();
      if(!document.getElementById('chkMapa').checked){
        form.classList.add('was-validated');
      }
      event.preventDefault();
      event.stopPropagation();
    });
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  traerCarrito();
  traerPaises();
  activarTooltips();
  formatearInputs();
  setValidForms();
});
