
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
  var respuesta2 = await enviarMensajeMedianteContent(query2);

}


 async function guardarEnBaseDeDatos(query, respuesta) {
  // Abrir una conexión con la base de datos
  const db = await obtenerConexionBaseDeDatos();

  // Iniciar una transacción
  const transaction = db.transaction('consultas', 'readwrite');

  // Obtener el objeto de almacén de datos (object store) 'consultas' de la transacción
  const consultasStore = transaction.objectStore('consultas');

  // Crear un nuevo registro con la consulta y la respuesta
  const nuevoRegistro = { query: query, respuesta: respuesta };
  await consultasStore.add(nuevoRegistro);

  // Completar la transacción
  await transaction.complete;

  console.log(`Consulta '${query}' y respuesta '${respuesta}' guardadas en la base de datos.`);
}

function obtenerConexionBaseDeDatos() {
  // Abrir una conexión con la base de datos utilizando la API de IndexedDB
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('miBasedeDatos', 1);

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Crear un objeto de almacén de datos (object store) llamado 'consultas'
      const consultasStore = db.createObjectStore('consultas', { keyPath: 'query' });

      console.log('Base de datos creada correctamente.');
    };
  });
}




async function imprimirInformacionBaseDeDatos() {
  try {
    // Obtener conexión a la base de datos
    const db = await obtenerConexionBaseDeDatos();

    // Iniciar una transacción de lectura en el objeto de almacén de datos 'consultas'
    const transaction = db.transaction('consultas', 'readonly');
    const consultasStore = transaction.objectStore('consultas');

    // Obtener todos los registros del objeto de almacén de datos
    const request = consultasStore.getAll();

    request.onerror = (event) => {
      console.error('Error al obtener los registros:', event.target.error);
    };

    request.onsuccess = (event) => {
      const registros = event.target.result;
      if (Array.isArray(registros)) {
        // Iterar sobre los registros e imprimir la información en la consola
        registros.forEach((registro) => {
          console.log(`Consulta: ${registro.query}, Respuesta: ${registro.respuesta}`);
        });
      }
    };
  } catch (error) {
    console.error('Error al imprimir la información de la base de datos:', error);
  }
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