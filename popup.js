console.log("popup.js");
const form = document.querySelector('#formulario');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nombre = document.querySelector('#nombre').value; // Obtener el valor del primer campo de consulta
  const objetivo = document.querySelector('#objetivo').value; // Obtener el valor del segundo campo de consulta

  cuerpo(nombre, objetivo); // Pasar los valores obtenidos a la función "cuerpo" con el tipo seleccionado

});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.texto) {
    console.log('Texto recibido desde content_script.js:', request.texto);
    mostrarTexto(request.texto);
    sendResponse({confirmacion: 'Texto recibido correctamente'});
  }
});




async function cuerpo(nombre, objetivo) {
  const miArreglo = [nombre, objetivo];
  enviarMensajeMedianteContent(miArreglo);
}



function imprimirEnConsola(texto) {
  // Obtenemos el ID de la pestaña activa
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;

    // Validamos que el mensaje sea una cadena de texto
    if (typeof texto === "string") {
      // Enviamos el mensaje al content_script
      chrome.tabs.sendMessage(tabId, { texto });
    } else {
      console.error("El mensaje no es una cadena de texto");
    }
  });
}


function enviarMensajeAGPT(mensajeAenviar) {
  return new Promise(async (resolve) => {
    // Enviar la consulta al servidor y esperar la respuesta
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      await chrome.tabs.sendMessage(tabs[0].id, {
        tipo: "informacion",
        datos: { valor: mensajeAenviar }
      });

      /*
      // Escuchar mensajes desde content-script.js
      chrome.runtime.onMessage.addListener(function handler(mensaje, sender, respuesta) {
        if (mensaje.tipo === "respuesta") {
          const respuestaValor = mensaje.datos.valor;

          // Haz lo que necesites con la respuesta en popup.js

          

          // Resolver la promesa para indicar que la función ha terminado de ejecutarse
          resolve(respuestaValor);

          // Remover el listener después de recibir la respuesta
          chrome.runtime.onMessage.removeListener(handler);
        }
      }); */
    });
  });
}
function mostrarTexto2(texto) {
  document.getElementById("respuesta").innerHTML = texto;
}


function mostrarTexto2(texto) {
  var p = document.createElement("p"); // creamos un elemento <p>
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  p.appendChild(contenido); // agregamos el nodo de texto al elemento <p>
  document.getElementById("respuesta").appendChild(p); // agregamos el elemento <p> al elemento con id "respuesta"
}


function mostrarTexto(texto) {
  var chat = document.createElement("div"); // creamos un elemento <div> para el chat
  chat.classList.add("chat"); // agregamos la clase "chat" al elemento <div>
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  chat.appendChild(contenido); // agregamos el nodo de texto al elemento <div>
  document.getElementById("respuesta").appendChild(chat); // agregamos el elemento <div> al elemento con id "respuesta"
}









/*
document.getElementById('btnImprimir').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'imprimir_base_datos'});
  });
});
*/



function enviarMensajeMedianteContent(query, tipoInfo) {
  return new Promise(async (resolve) => {
    // Enviar la consulta al servidor y esperar la respuesta
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      await chrome.tabs.sendMessage(tabs[0].id, {
        tipo: "informacion",
        datos: {
          valor: query,
          tipo: tipoInfo // Aquí puedes establecer el valor del dato "tipo" que deseas enviar
        }
      });
/*
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
      }); */
    });
  });
}




/*
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

*/
