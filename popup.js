console.log("popup.js");
const form = document.querySelector('#query-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.querySelector('#query').value;
  console.log("llegue ");
  console.log("lo ingresado es: " + query);



  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { 
      tipo: "informacion",
      datos: { valor: query }
    });
  });
  // enviar la consulta al servidor y esperar la respuesta
  // mostrar la respuesta en la interfaz de usuario
});




















/*

console.log("popup.js");

const boton = document.querySelector("#trabajar");

boton.addEventListener("click", function() {
  const nombre = document.querySelector("#nombre").value;
  const objetivo = document.querySelector("#objetivo").value;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { 
      tipo: "informacion",
      datos: { nombre: nombre, objetivo: objetivo }
    });
  });
});
*/