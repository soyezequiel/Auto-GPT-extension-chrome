console.log("content-script.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'imprimir_base_datos') {
      // Realiza la acción para imprimir la base de datos aquí
      console.log('Imprimir base de datos');
      // Puedes acceder y manipular la base de datos aquí si es posible
      // teniendo en cuenta las restricciones de seguridad del contenido de script
      imprimirInformacionBaseDeDatos();
  }
});



chrome.runtime.onMessage.addListener(function(mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    const prompt = mensaje.datos.valor;
    const tipoInfo = mensaje.datos.tipo; // Obtener el valor del nuevo dato "tipo"
  
    // Llamar a la función principal con los datos recibidos
    principal(prompt, tipoInfo);
  }
});

async function principal(prompt,tipoInfo){
  var respuesta = await enviarMensaje(prompt);

  // Guardar los valores en la base de datos
  guardarEnBaseDeDatos(tipoInfo,prompt, respuesta);
  //  imprimirInformacionBaseDeDatos();
}




async function enviarMensaje(mensaje) {
  console.log("mensaje " + mensaje);
  // Obtener el cuadro de texto
  const textarea = document.querySelector('textarea[placeholder="Send a message..."]');
  if (textarea !== null) {
    // Establecer el valor del cuadro de texto
    textarea.value = mensaje;

    // Crear un evento keydown para simular presionar la tecla Enter
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });

    // Desencadenar el evento keydown
    textarea.dispatchEvent(event);

    // Esperar a que puedoContinuar() devuelva true
    await new Promise((resolve) => {
      const checkContinuar = setInterval(() => {
        if (puedoContinuar()) {
          clearInterval(checkContinuar);
          resolve();
        }
      }, 100);
    });

    const elementos = document.querySelectorAll('.prose');
    const ultimoElemento = elementos[elementos.length - 1];
    const texto = ultimoElemento.textContent.trim();
    //console.log(texto);
    // Enviar mensaje a popup.js
    var respuesta= texto;
chrome.runtime.sendMessage({tipo: "respuesta", datos: {valor: respuesta}});
 // console.log("respuesta:  " + respuesta );
    return texto;
  } else {
    console.log('El cuadro de texto no existe en la página.');
  }
}

//funciones privadas


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
function puedoContinuar() {
  if (document.querySelector('.text-2xl span:first-child') !== null) {
    console.log("espera"); // El elemento existe
    return false;
  } else {
    //console.log("puedoContinuar dice " +  true); // El elemento no existe
    return true;
  }
}


async function guardarEnBaseDeDatos(query, respuesta, tipoInfo = 'espe') {
  // Abrir una conexión con la base de datos
  const db = await obtenerConexionBaseDeDatos();

  // Iniciar una transacción
  const transaction = db.transaction('consultas', 'readwrite');

  // Obtener el objeto de almacén de datos (object store) 'consultas' de la transacción
  const consultasStore = transaction.objectStore('consultas');

  // Crear un nuevo registro con el tipo de información, consulta y respuesta
  const nuevoRegistro = { tipoInfo: tipoInfo, query: query, respuesta: respuesta };
  await consultasStore.add(nuevoRegistro);

  // Completar la transacción
  await transaction.complete;

  console.log(`Consulta '${query}' y respuesta '${respuesta}' guardadas en la base de datos con tipo de información '${tipoInfo}'.`);
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








  /*

function enviarMensaje2(mensaje) {
  // Obtener el cuadro de texto
  const textarea = document.querySelector('textarea[placeholder="Send a message..."]');
  if (textarea !== null) {
    // Establecer el valor del cuadro de texto
    textarea.value = mensaje;

    // Crear un evento keydown para simular presionar la tecla Enter
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });

    // Desencadenar el evento keydown
    textarea.dispatchEvent(event);

  

    const elementos = document.querySelectorAll('.prose');
    const ultimoElemento = elementos[elementos.length - 1];
    const texto = ultimoElemento.textContent.trim();
    console.log(texto);

    
    return texto;
  } else {
    console.log('El cuadro de texto no existe en la página.');
  }
}

chrome.runtime.onMessage.addListener(function(mensaje, sender, respuesta) {
    if (mensaje.tipo === "informacion") {
      const nombre = mensaje.datos.nombre;
      const objetivo = mensaje.datos.objetivo;
  
      // aquí puedes hacer lo que quieras con las variables "nombre" y "objetivo"
      console.log("Nombre del agente: " + nombre);

      console.log("Objetivo: " + objetivo);
  
      principal(nombre,objetivo);
    }
  });



  function principal(nombre,objetivo){

  //  crearChat(nombre + " dijo viva la libertad carajo");

    enviarMensaje("soy un " + nombre + "y mi objetivo es " + objetivo + "quiero que lo analises y me des tres tareas como maximo que me permita completar aquel objetivo");


  }

    
  function enviarMensaje(mensaje) {
    // Obtener el formulario
    const form = document.querySelector('form.stretch');
    if (form !== null) {
      // Obtener los elementos dentro del formulario
      const textarea = form.querySelector('textarea');
      const button = form.querySelector('button');
  
      // Establecer los valores de los elementos
      textarea.value = mensaje;
  
      // Hacer clic en el botón después de 1 segundo
  
        button.click();



    } else {
      console.log('El formulario no existe en la página.');
    }
  }
  


  

async function crearChat(mensaje){

    const boton = document.querySelector('a.flex');
    boton.click();
    console.log("se enviara el mensaje");
    enviarMensaje(mensaje);
    console.log("se envio el mensaje");
    return obtenerNombre();

}
  

function puedoContinuar() {
    if (document.querySelector('.text-2xl span:first-child') !== null) {
      console.log(true); // El elemento existe
      return true;
    } else {
      console.log(false); // El elemento no existe
      return false;
    }
  }
  
  
  




function enviarMensajeEn(mensaje,nombre){
    seleccionarChat(nombre);
    enviarMensaje(mensaje)
}


function seleccionarChat(nombre){
        // codigo para seleccionar un chat segun su nombre-------------
        // Asignar el nombre del elemento a buscar a una variable
        let elementName = nombre;
        // Obtener todos los elementos que contienen el texto
        const elements = document.querySelectorAll('.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative');
        // Iterar sobre los elementos para encontrar el que coincide con el nombre
        let targetElement;
        elements.forEach(element => {
        if (element.textContent.trim() === elementName) {
            targetElement = element;
        }
        });
        // Hacer clic en el elemento seleccionado
        if (targetElement) {
        targetElement.click();
        }
}
function obtenerNombre() {
    const pageTitle = document.title;
    return pageTitle;
}




setTimeout(function() {
    console.log('El script se está ejecutando');
    enviarMensaje('hola como estas bebe');
    // Aquí va el código que deseas ejecutar después de que la página ha terminado de cargar
  }, 3000);
  
*/

