console.log("popup.js");
const form = document.querySelector('#formulario');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nombre = document.querySelector('#nombre').value; // Obtener el valor del primer campo de consulta
  const objetivo = document.querySelector('#objetivo').value; // Obtener el valor del segundo campo de consulta
  



  cuerpo(nombre, objetivo); // Pasar los valores obtenidos a la función "cuerpo" con el tipo seleccionado

});


async function cuerpo(nombre, objetivo) {



  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para
  let tareas = await agenteCreacionDeTareas(nombre,objetivo); //aqui recibe un array de string que contienen las tareas creadas por el agente

}

function imprimirEnConsola(texto){
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




async function agenteCreacionDeTareas(nombre, objetivo) {

  let mensaje="Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres " + nombre + " y el objetivo es " + objetivo + ".   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, quiero que la respuesta este en este formato y agrega zzz antes y despues de cada tarea ";
  var respuesta = await enviarMensajeAGPT(mensaje);





  const tareasArreglo = respuesta.match(/Tarea.*?(?=zzz|$)/gs).map(tarea => tarea.trim());



  imprimirEnConsola("llegue");
  mostrarTexto("Tarea agregada 1: " + tareasArreglo[0]);
  mostrarTexto("Tarea agregada 2:" + tareasArreglo[1]);
  mostrarTexto("Tarea agregada 3: " + tareasArreglo[2]);


  return tareasArreglo;

}



function enviarMensajeAGPT(mensajeAenviar) {
  return new Promise(async (resolve) => {
    // Enviar la consulta al servidor y esperar la respuesta
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      await chrome.tabs.sendMessage(tabs[0].id, { 
        tipo: "informacion",
        datos: {  valor: mensajeAenviar     }
      });

      // Escuchar mensajes desde content-script.js
      chrome.runtime.onMessage.addListener(function handler(mensaje, sender, respuesta) {
        if (mensaje.tipo === "respuesta") {
          const respuestaValor = mensaje.datos.valor;
  
          // Haz lo que necesites con la respuesta en popup.js

          mostrarTexto(respuestaValor);

          // Resolver la promesa para indicar que la función ha terminado de ejecutarse
          resolve(respuestaValor);

          // Remover el listener después de recibir la respuesta
          chrome.runtime.onMessage.removeListener(handler);
        }
      });
    });
  });
}

function mostrarTexto2(texto) {
  document.getElementById("respuesta").innerHTML = texto;
}


function mostrarTexto(texto) {
  var p = document.createElement("p"); // creamos un elemento <p>
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  p.appendChild(contenido); // agregamos el nodo de texto al elemento <p>
  document.getElementById("respuesta").appendChild(p); // agregamos el elemento <p> al elemento con id "respuesta"
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