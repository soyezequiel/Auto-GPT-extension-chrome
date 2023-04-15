console.log("popup.js");
const form = document.querySelector('#query-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.querySelector('#query').value;
  console.log("Usuario:  " + query);

  enviarMensajeMedianteContent(query);
});


function enviarMensajeMedianteContent(query){

 // enviar la consulta al servidor y esperar la respuesta
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { 
      tipo: "informacion",
      datos: { valor: query }
    });
  });

  // mostrar la respuesta en la interfaz de usuario
      // Escuchar mensajes desde content-script.js
          chrome.runtime.onMessage.addListener(function(mensaje, sender, respuesta) {
            if (mensaje.tipo === "respuesta") {
              const respuesta = mensaje.datos.valor;
              console.log("Respuesta recibida: " + respuesta);
              // Haz lo que necesites con la respuesta en popup.js

                // Obtener referencia al elemento <p> por su id
                const respuestaElemento = document.getElementById('respuesta');

                // Actualizar el contenido del elemento con la respuesta obtenida
                respuestaElemento.textContent = respuesta;
            }
          });
}

















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