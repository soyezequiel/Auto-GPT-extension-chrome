console.log("content-script.js");

//escuchador para resivir el mensaje desde popup.js que a su ves lo recibe desde la vista
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    borrarBaseDeDatos();
    borrarBaseDeDatos2();
    const mensajeAenviar = mensaje.datos.valor;


    principal(mensajeAenviar);
  }
});




async function principal(mensajeAenviar) {

  let nombre = mensajeAenviar[0];
  let objetivo = mensajeAenviar[1];
  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para

  let texto = "Nombre: " + nombre + '\n' + "Objetivo: " + objetivo;
  enviarTexto(texto);
  let tareas = await agenteCreacionDeTareas(nombre, objetivo); //aqui recibe un array de string que contienen las tareas creadas por el agente

  console.log("ezequiel");




}


function enviarTexto(texto) {
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ texto: texto }, function (response) {
      console.log('Texto enviado a popup.js');
    });
  }
}



async function agenteCreacionDeTareas(nombre, objetivo) {

  let mensaje = "Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres " + nombre + " y el objetivo es " + objetivo + ".   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, quiero que la respuesta este en este formato y agrega zzz antes y despues de cada tarea ";
  var respuesta = await enviarMensaje(mensaje);
  const tareasArreglo = respuesta.match(/Tarea.*?(?=zzz|$)/gs).map(tarea => tarea.trim());
  console.log("llegue");
  enviarTexto("Tarea agregada 1: " + tareasArreglo[0]);
  enviarTexto("Tarea agregada 2:" + tareasArreglo[1]);
  enviarTexto("Tarea agregada 3: " + tareasArreglo[2]);

  //console.log("Tarea agregada 1: " + tareasArreglo[0]);
  //console.log("Tarea agregada 2:" + tareasArreglo[1]);
  //console.log("Tarea agregada 3: " + tareasArreglo[2]);

 




  console.log("objetivo: " + objetivo);
  console.log("nombre: " + nombre);


  GuardarEnMemoria(objetivo,nombre)

  pilaDeTareas(tareasArreglo,false);
  
  //return tareasArreglo;

}

function GuardarEnMemoria(objetivo,nombre){
   //guarda en memoria
   guardarTarea("objetivo", objetivo, nombre);
     //imprimir tareas soluciones
  obtenerTareas(function (tareas) {
    console.log(tareas);
  });
}

function pilaDeTareas(tareasArreglo, ordenado) {

  //guarda en la cola de tareas
  for (let i = 0; i < tareasArreglo.length; i++) {
    guardarTareaSinSolucion(" no deberia de haber titulo ", tareasArreglo[i]);
  }
  // imprimir tareas sin solucion
  // Llamada a la función para obtener las tareas y luego imprimirlas
  obtenerTareasSinSolucion().then(tareas => {
    console.log('Tareas sin solución:');
    console.log(tareas);
  }).catch(error => {
    console.log(error);
  });



  if (ordenado) {


  }else{
    agentePriorizacionDeTareas();

  }

  

}

async function agentePriorizacionDeTareas() {

let cadena= await obtenerTodasLasTareas()
 
let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, solo agrega zzz antes y despues de cada tarea" + cadena;

var respuesta = await enviarMensaje(mensaje);
const tareasArreglo = await respuesta.match(/Tarea.*?(?=zzz|$)/gs).map(tarea => tarea.trim());
console.log(tareasArreglo);
borrarBaseDeDatos2();
pilaDeTareas(tareasArreglo, true);


}


function obtenerTodasLasTareas() {
  return new Promise((resolve, reject) => {
    obtenerTareasSinSolucion().then(tareas => {
      let cadena = "";
      tareas.forEach(tarea => {
        cadena += tarea.tarea + "\n";
      });
      resolve(cadena);
    }).catch(error => {
      reject(error);
    });
  });
}





// escuchadores
chrome.runtime.onMessage.addListener(function (mensaje, sender, sendResponse) {
  if (typeof mensaje.texto === "string") {
    console.log(mensaje.texto); // Hola desde popup.js
  } else {
    // console.error("El mensaje recibido no es una cadena de texto");
  }
});





//funciones privadas











// Abrir la base de datos de titulo,tarea,solucion
const request = indexedDB.open('miBaseDeDatos');


// Crear el esquema de la base de datos
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('titulo', 'titulo', { unique: false });
  objectStore.createIndex('soluciones', 'soluciones', { unique: false });
};

function obtenerTareas(callback) {
  const request = indexedDB.open('miBaseDeDatos');
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareas'], 'readonly');
    const objectStore = transaction.objectStore('tareas');
    const cursor = objectStore.openCursor();
    const tareas = [];
    cursor.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        tareas.push(cursor.value);
        cursor.continue();
      } else {
        callback(tareas);
      }
    };
  };
}

function guardarTarea(titulo, tarea, soluciones) {
  const request = indexedDB.open('miBaseDeDatos');
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareas'], 'readwrite');
    const objectStore = transaction.objectStore('tareas');
    const nuevaTarea = { titulo: titulo, tarea: tarea, soluciones: soluciones };
    objectStore.add(nuevaTarea);
    transaction.oncomplete = function () {
      console.log('Tarea guardada con éxito');
    };
    transaction.onerror = function () {
      console.log('Error al guardar la tarea');
    };
  };
}


function borrarBaseDeDatos() {
  const request = indexedDB.open('miBaseDeDatos');
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareas'], 'readwrite');
    const objectStore = transaction.objectStore('tareas');
    objectStore.clear();
    transaction.oncomplete = function () {
      console.log('Base de datos borrada con éxito');
    };
    transaction.onerror = function () {
      console.log('Error al borrar la base de datos');
    };
  };
}



//base de datos de tarea
const request2 = indexedDB.open('miBaseDeDatos2');
request2.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Crea el esquema de la base de datos existente
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('titulo', 'titulo', { unique: false });
  objectStore.createIndex('soluciones', 'soluciones', { unique: false });

  // Crea el esquema de la nueva base de datos
  const tareasObjectStore = db.createObjectStore('tareasSinSoluciones', { keyPath: 'id', autoIncrement: true });
  tareasObjectStore.createIndex('titulo', 'titulo', { unique: false });
  tareasObjectStore.createIndex('tarea', 'tarea', { unique: false });
};

function guardarTareaSinSolucion(titulo, tarea) {
  const request2 = indexedDB.open('miBaseDeDatos2');
  request2.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareasSinSoluciones'], 'readwrite');
    const objectStore = transaction.objectStore('tareasSinSoluciones');
    const nuevaTarea = { titulo: titulo, tarea: tarea };
    objectStore.add(nuevaTarea);
    transaction.oncomplete = function () {
      console.log('Tarea sin solución guardada con éxito');
    };
    transaction.onerror = function () {
      console.log('Error al guardar la tarea sin solución');
    };
  };
}

function borrarBaseDeDatos2() {
  const request2 = indexedDB.open('miBaseDeDatos2');
  request2.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareasSinSoluciones'], 'readwrite');
    const objectStore = transaction.objectStore('tareasSinSoluciones');
    objectStore.clear();
    transaction.oncomplete = function () {
      console.log('Base de datos borrada con éxito');
    };
    transaction.onerror = function () {
      console.log('Error al borrar la base de datos');
    };
  };
}
function obtenerTareasSinSolucion() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('miBaseDeDatos2');

    request.onerror = function (event) {
      reject('Error al abrir la base de datos');
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tareasSinSoluciones'], 'readonly');
      const objectStore = transaction.objectStore('tareasSinSoluciones');
      const tareas = [];

      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
          const tarea = { id: cursor.key, titulo: cursor.value.titulo, tarea: cursor.value.tarea };
          tareas.push(tarea);
          cursor.continue();
        } else {
          resolve(tareas);
        }
      };

      transaction.onerror = function () {
        reject('Error al leer la base de datos');
      };
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



//funciones que interactuan con la pagina

function puedoContinuar() {
  if (document.querySelector('.text-2xl span:first-child') !== null) {
    console.log("espera"); // El elemento existe
    return false;
  } else {
    //console.log("puedoContinuar dice " +  true); // El elemento no existe
    return true;
  }
}
async function enviarMensaje(mensaje) {
  // console.log("mensaje " + mensaje);
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
    var respuesta = texto;
    chrome.runtime.sendMessage({ tipo: "respuesta", datos: { valor: respuesta } });
    // console.log("respuesta:  " + respuesta );
    return texto;
  } else {
    console.log('El cuadro de texto no existe en la página.');
  }
}
