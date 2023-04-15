
console.log("popup.js");
const form = document.querySelector('#query-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query1 = document.querySelector('#query1').value; // Obtener el valor del primer campo de consulta
  const query2 = document.querySelector('#query2').value; // Obtener el valor del segundo campo de consulta



  cuerpo(query1, query2);


});

 async function cuerpo(query1, query2) {

  var respuesta = await enviarMensajeMedianteContent(query1);

  var respuesta2 = await  enviarMensajeMedianteContent(query2);

}

function enviarMensajeMedianteContent(query) {
  return new Promise(async (resolve) => {
    // Enviar la consulta al servidor y esperar la respuesta
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      await chrome.tabs.sendMessage(tabs[0].id, { 
        tipo: "informacion",
        datos: { valor: query }
      });

      // Escuchar mensajes desde content-script.js
      chrome.runtime.onMessage.addListener(function handler(mensaje, sender, respuesta) {
        if (mensaje.tipo === "respuesta") {
          const respuestaValor = mensaje.datos.valor;
          console.log("Respuesta recibida: " + respuestaValor);
          // Haz lo que necesites con la respuesta en popup.js

          // Obtener referencia al elemento <p> por su id
          const respuestaElemento = document.getElementById('respuesta');

          // Actualizar el contenido del elemento con la respuesta obtenida
          respuestaElemento.textContent = respuestaValor;

          // Resolver la promesa para indicar que la función ha terminado de ejecutarse
          resolve(respuestaValor);

          // Remover el listener después de recibir la respuesta
          chrome.runtime.onMessage.removeListener(handler);
        }
      });
    });
  });
}










/*
console.log("popup.js");
const form = document.querySelector('#query-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.querySelector('#query').value;
  console.log("Usuario:  " + query);

  enviarMensajeMedianteContent(query);
});
*/










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