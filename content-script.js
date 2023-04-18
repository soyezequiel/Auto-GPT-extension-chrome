console.log("content-script.js");
//constantes
var continuar = true;

//listener
//escuchador para resivir el mensaje desde popup.js que a su ves lo recibe desde la vista
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    borrarBaseDeDatosDeSoluciones();
    borrarBaseDeDatosDeTareas();
    const mensajeAenviar = mensaje.datos.valor;


    principal(mensajeAenviar);
  }
});
// escuchadores
chrome.runtime.onMessage.addListener(function (mensaje, sender, sendResponse) {
  if (typeof mensaje.texto === "string") {
    console.log(mensaje.texto); // Hola desde popup.js
  } else {
    // console.error("El mensaje recibido no es una cadena de texto");
  }
});
// En content_script.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.continuar) {
    console.log('Continuar ejecución');
    // Continuar ejecución aquí
    //   continuar=true;
  } else {
    console.log('Detener ejecución');
    // Detener ejecución aquí
    // continuar=false;
  }
});


//Maquina de estados finito

async function principal(mensajeAenviar) {

  let nombre = mensajeAenviar[0];
  let objetivo = mensajeAenviar[1];
  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para

  let texto = "Nombre: " + nombre + '\n' + "Objetivo: " + objetivo;
  enviarTexto(texto, "blue");
  let tareas = await agenteCreacionDeTareas(nombre, objetivo); //aqui recibe un array de string que contienen las tareas creadas por el agente
}
async function agenteCreacionDeTareas(nombre, objetivo) {
  if (continuar) {

    let mensaje = "Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres " + nombre + " y el objetivo es " + objetivo + ".   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp";
    var respuesta = await enviarMensaje(mensaje, "creacion");

    // Procesar tareas para convertila en un array de tareas
    const arrayTareas = respuesta.split("\n");
    const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
    const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));


    //console.log("llegue");
    /*
    enviarTexto("Tarea agregada 1: " + tareasArreglo[0]);
    enviarTexto("Tarea agregada 2:" + tareasArreglo[1]);
    enviarTexto("Tarea agregada 3: " + tareasArreglo[2]);
    */
    //console.log("Tarea agregada 1: " + tareasArreglo[0]);
    //console.log("Tarea agregada 2:" + tareasArreglo[1]);
    //console.log("Tarea agregada 3: " + tareasArreglo[2]);


    console.log("objetivo: " + objetivo);
    console.log("nombre: " + nombre);


    GuardarEnMemoria(0, nombre, objetivo);

    pilaDeTareas(0, tareasArreglo, false);

    //return tareasArreglo;

  }

}
function pilaDeTareas(titulo, tareasArreglo, ordenado) {

  //guarda en la cola de tareas
  for (let i = 0; i < tareasArreglo.length; i++) {
    guardarTarea(titulo, tareasArreglo[i]);
  }
  // imprimir tareas sin solucion
  // Llamada a la función para obtener las tareas y luego imprimirlas
  obtenerTareas().then(function (tareas) {
    // hacer algo con las tareas
    console.log('Tareas de la pila de tareas de la base de datos:', tareas);
  }).catch(function (error) {
    // manejar el error
  });


  let tareaAtratar = tareasArreglo[0];
  //funcion para eliminar elemento
  borrarTareaEnTope();

  if (ordenado) {
    //   for (let i = 0; i < tareasArreglo.length; i++) {
    //   enviarTexto("Tarea agregada: " + tareasArreglo[i]);
    // }
    agenteDeEjecucion(tareaAtratar);
  } else {
    for (let i = 0; i < tareasArreglo.length; i++) {
      enviarTexto("Tarea agregada: " + tareasArreglo[i], "green");
    }
    agenteDeEjecucion(tareaAtratar);    //este no deberia de estar aqui pero como no anda la priorizacion de tarea, estara aqui
    // agentePriorizacionDeTareas();  lo dejo comentado porque me anda mal la priorizacion de tarea

  }
}
async function agenteDeEjecucion(tarea) {

  if (continuar) {


    console.log("entrando al agente de ejecucion de tareas");


    let todasLasSoluciones = await obtenersoluciones();
    console.log("Todas las soluciones de la base de datos :  " + todasLasSoluciones);
    let soluciones = await encontrarTitulosSimilares(todasLasSoluciones, tarea);


    let mensaje = "  " + tarea + " ejecuta la tarea , en caso de no tener información suficiente dime como conseguirla  información:   " + soluciones + "";
    var solucion = await enviarMensaje(mensaje, "ejecucion");
    enviarTexto("Ejecutando tarea: " + tarea + " --> " + solucion, "orange");

    // let mensaje2 = "  dame un titulo que resuma esto \n " + solucion;
    //var titulo = await enviarMensaje(mensaje2,"ejecucion");

    agenteCreacionDeTareas2(tarea.titulo + 1, tarea, solucion, soluciones);

  }

}
async function agenteCreacionDeTareas2(titulo, tarea, solucion, informacion) {
  let mensaje = "Conociendo esta tarea \n \n " + tarea + "\n información:  \n" + informacion + "  \n su ejecución \n " + solucion + " \n en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo  La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n La respuesta tiene que tener este formato  Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ";
  var respuesta = await enviarMensaje(mensaje, "creacion");

  // const tareasArreglo = respuesta.match(/Tarea.*?(?=zzz|$)/gs).map(tarea => tarea.trim());
  /*
  enviarTexto("Tarea agregada 1: " + tareasArreglo[0]);
  enviarTexto("Tarea agregada 2:" + tareasArreglo[1]);
  enviarTexto("Tarea agregada 3: " + tareasArreglo[2]);
  */
  //console.log("Tarea agregada 1: " + tareasArreglo[0]);
  //console.log("Tarea agregada 2:" + tareasArreglo[1]);
  //console.log("Tarea agregada 3: " + tareasArreglo[2]);


  GuardarEnMemoria(titulo, tarea, solucion);

  let nuevaTarea = respuesta.replace("Tarea: ", "");
  let tareasArreglo = [nuevaTarea];

  pilaDeTareas(titulo + 1, tareasArreglo, false);

  //return tareasArreglo;

}
async function agentePriorizacionDeTareas() {

  let cadena = await obtenerTodasLasTareas()

  let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  " + cadena;

  var respuesta = await enviarMensaje(mensaje, "prioridad");
  // Procesar tareas para convertila en un array de tareas
  const arrayTareas = respuesta.split("\n");
  const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
  const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));


  //console.log(tareasArreglo);
  borrarBaseDeDatosDeTareas();
  pilaDeTareas(tareasArreglo, true);


}




//funciones de apoyo
function enviarTexto(texto, color) {

  if (chrome.runtime && chrome.runtime.sendMessage) {
    var mensaje = {
      texto: texto,
      color: color // Agregamos el color al objeto de mensaje
    };
    chrome.runtime.sendMessage(mensaje, function (response) {
      //  console.log('Texto enviado a popup.js');
    });
  }
}
function encontrarTitulosSimilares(indice, tarea) {
  // Creamos un objeto para almacenar los puntajes de similitud de cada título
  const similitud = {};

  // Recorremos todos los títulos en el índice
  indice.forEach(function (titulo) {
    // Calculamos el puntaje de similitud entre el título y la tarea
    const puntaje = calcularPuntajeSimilitud(titulo, tarea);

    // Almacenamos el puntaje de similitud en el objeto
    similitud[titulo] = puntaje;
  });

  // Ordenamos los títulos según su puntaje de similitud en orden descendente
  const titulosOrdenados = Object.keys(similitud).sort(function (a, b) {
    return similitud[b] - similitud[a];
  });

  // Devolvemos los 3 títulos con el puntaje de similitud más alto
  return titulosOrdenados.slice(0, 3);
}
function calcularPuntajeSimilitud(cadena1, cadena2) {
  // Convertimos ambas cadenas a minúsculas y eliminamos los caracteres no alfabéticos
  const str1 = cadena1.toLowerCase().replace(/[^a-zA-Z]+/g, '');
  const str2 = cadena2.toLowerCase().replace(/[^a-zA-Z]+/g, '');

  // Calculamos el puntaje de similitud
  const puntaje = new Set(str1.split('')).size + new Set(str2.split('')).size - new Set([...str1, ...str2]).size;

  return puntaje;
}




//funciones que interactuan con la base de datos de forma directa
function abrirBaseDeDatos(nombre, esquema) {
  const request = indexedDB.open(nombre);
  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    esquema(db);
  }
  return request;
}
function leerDatos(baseDeDatos, nombreObjectStore, callback) {
  const transaction = baseDeDatos.transaction([nombreObjectStore], 'readonly');
  const objectStore = transaction.objectStore(nombreObjectStore);
  const cursor = objectStore.openCursor();
  const datos = [];
  cursor.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      datos.push(cursor.value);
      cursor.continue();
    } else {
      callback(datos);
    }
  };
}
function guardarDatos(baseDeDatos, nombreObjectStore, datos) {
  const transaction = baseDeDatos.transaction([nombreObjectStore], 'readwrite');
  const objectStore = transaction.objectStore(nombreObjectStore);
  objectStore.add(datos);
  transaction.oncomplete = function () {
    console.log('Datos guardados con éxito');
  };
  transaction.onerror = function () {
    console.log('Error al guardar los datos');
  };
}

// Abrir la base de datos de profundidad,tarea,solucion
const db1 = abrirBaseDeDatos('miBaseDeDatos', function (db) {
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('profundidad', 'profundidad', { unique: false });
  objectStore.createIndex('soluciones', 'soluciones', { unique: false });
});
function obtenerTareasSolucion(callback) {
  leerDatos(db1.result, 'tareas', callback);
}
async function obtenerTodasLasSoluciones() {
  try {
    const soluciones = await obtenersoluciones();
    console.log('soluciones: ', soluciones);
  } catch (error) {
    console.error('Error al obtener las soluciones: ', error);
  }
}
function obtenersoluciones() {
  return new Promise((resolve, reject) => {
    const request = abrirBaseDeDatos('miBaseDeDatos', function (db) { });
    request.onsuccess = function (event) {
      leerDatos(event.target.result, 'tareas', function (tareas) {
        const soluciones = tareas.map(function (tarea) {
          return tarea.soluciones;
        });
        resolve(soluciones);
      });
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
function guardarSolucion(profundidad, tarea, soluciones) {
  guardarDatos(db1.result, 'tareas', { profundidad: profundidad, tarea: tarea, soluciones: soluciones });
}
function borrarBaseDeDatosDeSoluciones() {
  const request = indexedDB.open('miBaseDeDatos');
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareas'], 'readwrite');
    const objectStore = transaction.objectStore('tareas');
    const requestDelete = objectStore.clear();
    requestDelete.onsuccess = function () {
      console.log('Base de datos borrada con éxito');
    };
    requestDelete.onerror = function (event) {
      console.error('Error al borrar la base de datos', event.target.error);
    };
  };

  request.onupgradeneeded = function (event) {
    // Aquí se puede actualizar el esquema de la base de datos si se requiere
  };

  request.onerror = function (event) {
    console.error('Error al abrir la base de datos', event.target.error);
  };
}
function GuardarEnMemoria(titulo, objetivo, nombre) {
  //guarda en memoria
  guardarSolucion(titulo, objetivo, nombre);

  //imprimir tareas soluciones
  obtenerTareasSolucion(function (tareas) {
    console.log("imprimiendo las tareas que estan en la base de datos:");
    console.log(JSON.stringify(tareas));
  });
}

// Abrir la base de datos de profundidad,tarea
const db2 = abrirBaseDeDatos('miBaseDeDatosSoloTareas', function (db) {
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('profundidad', 'profundidad', { unique: false });
});

function obtenerTareas() {
  return new Promise(function (resolve, reject) {
    leerDatos(db2.result, 'tareas', function (tareas) {
      resolve(tareas);
    });
  });
}
function guardarTarea(profundidad, tarea) {
  guardarDatos(db2.result, 'tareas', { profundidad: profundidad, tarea: tarea });
}

function borrarBaseDeDatosDeTareas() {
  const request = indexedDB.open('miBaseDeDatosSoloTareas');
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['tareas'], 'readwrite');
    const objectStore = transaction.objectStore('tareas');
    const requestDelete = objectStore.clear();
    requestDelete.onsuccess = function () {
      console.log('Base de datos de solo tarea borrada con éxito');
    };
    requestDelete.onerror = function (event) {
      console.error('Error al borrar la base de datos de solo tarea', event.target.error);
    };
  };

  request.onupgradeneeded = function (event) {
    // Aquí se puede actualizar el esquema de la base de datos si se requiere
  };

  request.onerror = function (event) {
    console.error('Error al abrir la base de datos', event.target.error);
  };
}

function obtenerTodasLasTareas() {
  return new Promise(function (resolve, reject) {
    var transaccion = db2.result.transaction(['tareas'], 'readonly');
    var store = transaccion.objectStore('tareas');
    var cursor = store.openCursor();
    var tareas = [];

    cursor.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        tareas.push(cursor.value.descripcion);
        cursor.continue();
      } else {
        resolve(tareas);
      }
    };

    cursor.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
function borrarTareaEnTope() {
  obtenerTareas().then(function (tareas) {
    if (tareas.length > 0) {
      // obtener tarea en tope
      const tareaEnTope = tareas[0];
      // eliminar tarea en tope de la base de datos
      eliminarDatos(db2.result, 'tareas', tareaEnTope.id, function () {
        console.log('Tarea en tope eliminada con éxito');
      });
    } else {
      console.log('No hay tareas en la pila');
    }
  }).catch(function (error) {
    console.error('Error al obtener las tareas: ', error);
  });
}
function eliminarDatos(db, storeName, id, callback) {
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  const request = store.delete(id);

  request.onerror = function (event) {
    console.error('Error al eliminar los datos: ', event.target.error);
  };

  request.onsuccess = function (event) {
    callback();
  };
}



//funciones que interactuan con la pagina de forma directa
function puedoContinuar() {
  if (document.querySelector('.text-2xl span:first-child') !== null) {
    console.log("espera"); // El elemento existe
    return false;
  } else {
    //console.log("puedoContinuar dice " +  true); // El elemento no existe
    return true;
  }
}
function clickButton() {
  const button = document.querySelector('a.flex');
  button.click();

}
function seleccionarChat(nombre) {
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
async function enviarMensaje(mensaje, chat) {
  await new Promise((resolve) => {
    //  clickButton();
    seleccionarChat(chat);
    setTimeout(() => {
      resolve();
    }, 3000);
  });

  // código que se ejecutará después de 3 segundos

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
