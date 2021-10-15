const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const PAISES_URL = "./resources/paises.json";
const accessTokenMapBox = 'sk.eyJ1Ijoia2V2aW4tYW5hZG9uIiwiYSI6ImNrdXJtOGZ4MzNvZmwydXJ1amNnNG91azYifQ.GC6LK8lqJhg3vmDygZ6ANA';

const showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

const hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

const getJSONData = (url) => {
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then( (response) => {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch( (error) => {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", (e) =>{
  let user = traerUsuario();
  verificarPagina(user);
  mostrarUsuario(user);
});

function mostrarUsuario(user){
  document.getElementById('userProfile').src = user.imgUrl;
  document.getElementById('userName').innerHTML = user.nombre;
}

function verificarPagina(user){
  if(user != null){
    if(!user.conectado && location.href.indexOf('login') == -1){
      location.href = './login.html';
    }else if(user.conectado && location.href.indexOf('login') != -1){
      location.href = './index.html';
    }
  }else{
    if(location.href.indexOf('login') == -1){
      location.href = './login.html';
    }
  }
}

function traerUsuario(){
  let recordar = localStorage.getItem('recordar');
  let user = {};
  if(recordar === 'true'){
    user = JSON.parse(localStorage.getItem('user'));
  }else{
    user = JSON.parse(sessionStorage.getItem('user'));
  }
  return user;
}
