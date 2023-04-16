console.log("popup.js");
const form = document.querySelector('#query-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query1 = document.querySelector('#query1').value; // Obtener el valor del primer campo de consulta
  const query2 = document.querySelector('#query2').value; // Obtener el valor del segundo campo de consulta
  const tipo = document.querySelector('#tipo').value; // Obtener el valor del tipo seleccionado en el select



  cuerpo(query1, query2, tipo); // Pasar los valores obtenidos a la función "cuerpo" con el tipo seleccionado

});

async function cuerpo(query1, query2, tipo) {
  // Aquí puedes hacer lo que necesites con los valores obtenidos del formulario
  var respuesta = await enviarMensajeMedianteContent(query1,tipo);
  var respuesta2 = await enviarMensajeMedianteContent(query2,tipo);

}


document.getElementById('btnImprimir').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'imprimir_base_datos'});
  });
});







function enviarMensajeMedianteContent(query, tipoInfo) {
  return new Promise(async (resolve) => {
    // Enviar la consulta al servidor y esperar la respuesta
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      await chrome.tabs.sendMessage(tabs[0].id, { 
        tipo: "informacion",
        datos: { 
          valor: query,
          tipo: tipoInfo // Aquí puedes establecer el valor del dato "tipo" que deseas enviar
        }
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




