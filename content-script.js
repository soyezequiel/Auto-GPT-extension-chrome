class IndexedDB {
  constructor(dbName, version, storeNames) {
    this.dbName = dbName; // Nombre de la base de datos
    this.version = version; // Versión de la base de datos
    this.storeNames = storeNames; // Nombres de los stores
    this.db = null; // Objeto de base de datos
    this.store = {}; // Objeto de stores
    this.open(); // Método para abrir la base de datos
  }

  // Método para abrir la base de datos
  open() {
    const request = window.indexedDB.open(this.dbName, this.version);
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      for (let i = 0; i < this.storeNames.length; i++) {
        this.store[this.storeNames[i]] = this.db.createObjectStore(this.storeNames[i], { keyPath: "id" });
      }
    };
    request.onsuccess = (event) => {
      this.db = event.target.result;
      for (let i = 0; i < this.storeNames.length; i++) {
        this.store[this.storeNames[i]] = this.db.transaction(this.storeNames[i], "readwrite").objectStore(this.storeNames[i]);
      }
    };
  }

  // Método para agregar un registro
  async agregar(storeName, registro) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(registro);
    await this._promisifyRequest(request);
  }

  // Método para obtener un registro
  async obtener(storeName, id) {
    const transaction = this.db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    const result = await this._promisifyRequest(request);
    return result;
  }

  // Método para actualizar un registro
  async actualizar(storeName, id, cambios) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const registro = await this.obtener(storeName, id);
    Object.assign(registro, cambios);
    const request = store.put(registro);
    await this._promisifyRequest(request);
  }

  // Método para eliminar un registro
  async eliminar(storeName, id) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    await this._promisifyRequest(request);
  }

  // Método para obtener todos los registros de un store
  async obtenerTodos(storeName) {
    const transaction = this.db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    const result = await this._promisifyRequest(request);
    return result;
  }

  // Método para convertir una solicitud de IndexedDB en una promesa
  _promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  // Método para limpiar todos los registros de un store
  async limpiar(storeName) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    await this._promisifyRequest(request);
  }
  // Método para agregar un registro al final de la pila
  async apilar(storeName, registro) {
    const ultimoRegistro = await this.obtenerUltimo(storeName);
    if (ultimoRegistro) {
      registro.id = ultimoRegistro.id + 1;
    } else {
      registro.id = 1;
    }
    await this.agregar(storeName, registro);
  }

  // Método para obtener el último registro de la pila
  async obtenerUltimo(storeName) {
    const registros = await this.obtenerTodos(storeName);
    return registros.length > 0 ? registros[registros.length - 1] : null;
  }

  // Método para obtener y eliminar el último registro de la pila
  async desapilar(storeName) {
    const ultimoRegistro = await this.obtenerUltimo(storeName);
    if (ultimoRegistro) {
      await this.eliminar(storeName, ultimoRegistro.id);
    }
    return ultimoRegistro;
  }

}


const nombreDeBaseDeDatos = "mi-base-de-datos";
const versionDeLaBaseDeDatos = 1;
const store1="memoria";
const store2="pila";
const misAlmacenesDeDatos = [store1, store2];
const miBD = new IndexedDB(nombreDeBaseDeDatos, versionDeLaBaseDeDatos, misAlmacenesDeDatos);








//memoria
class Memoria{
  constructor(store){
    this.store=store;
  }
async  obtenerTodasLasSoluciones() {
  const objetoTarea = await miBD.obtenerTodos(this.store);
  return objetoTarea.map(objetoTarea => objetoTarea.solucion);
}


 GuardarEnMemoria(profundidad, tarea, solucion) {
  let objetoTarea = {
    profundidad: profundidad,
    tarea: tarea,
    solucion: solucion
  };
  miBD.apilar(this.store, objetoTarea);
}
limpiarBaseDeDatos() {
  miBD.limpiar(this.store);
}
}

//pila

class Pila {
  constructor(store){
    this.store=store;
  }
  limpiarBaseDeDatos() {
    miBD.limpiar(this.store);
      }

       guardarTarea(profundidad, tarea) {
        let objetoTarea = {
          profundidad: profundidad,
          tarea: tarea,
          solucion: ""
        };
        miBD.apilar(this.store, objetoTarea);
      }
  async     obtenerTodasLasTareas() {   
        const objetoTarea = await miBD.obtenerTodos(this.store);   
        return objetoTarea.map(objetoTarea => objetoTarea.tarea);
      }

       borrarTareaEnTope() {    
        return miBD.desapilar(this.store);
      }

}
const baseDeDatos1 = new Memoria(store1);
const baseDeDatos2 = new Pila(store2);
















class ChatGPT {

  async enviarMensaje(mensaje, chat) {
    await new Promise((resolve) => {
      //  clickButton();
      this.#seleccionarChat(chat);
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
          if (this.#puedoContinuar()) {
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
  #puedoContinuar() {
    if (document.querySelector('.text-2xl span:first-child') !== null) {
      console.log("espera"); // El elemento existe
      return false;
    } else {
      //console.log("puedoContinuar dice " +  true); // El elemento no existe
      return true;
    }
  }
  #seleccionarChat(nombre) {
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
  /*
#clickButton() {
  const button = document.querySelector('a.flex');
  button.click();

} */
  /*
  #obtenerNombre() {
    const pageTitle = document.title;
    return pageTitle;
  } */

}

console.log("content-script.js");
//variables
var continuar = true;
var ProfundidadConfigurada = 1;
const gpt = new ChatGPT();

//listener
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    baseDeDatos1.limpiarBaseDeDatos();
    baseDeDatos2.limpiarBaseDeDatos();

    const nombre = mensaje.datos.nombre; // Obtener el valor del primer campo de consulta
    const objetivo = mensaje.datos.objetivo; // Obtener el valor del segundo campo de consulta
    const numero = mensaje.datos.numero; // Obtener el valor del campo numérico deslizante
    ProfundidadConfigurada = numero;
    principal(nombre, objetivo);
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

async function principal(nombre, objetivo) {

  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para

  let texto = "Nombre: " + nombre + '\n' + "Objetivo: " + objetivo;
  enviarTexto(texto, "blue");

  let tareas = await agenteCreacionDeTareas(nombre, objetivo); //aqui recibe un array de string que contienen las tareas creadas por el agente
}
async function agenteCreacionDeTareas(nombre, objetivo) {
  if (continuar) {

    let mensaje = "Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres " + nombre + " y el objetivo es " + objetivo + ".   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp";
    var respuesta = await gpt.enviarMensaje(mensaje, "creacion");

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


    baseDeDatos1.GuardarEnMemoria(0, nombre, objetivo);

    pilaDeTareas(0, tareasArreglo, false);

    //return tareasArreglo;

  }

}
async function pilaDeTareas(profundidad, tareasArreglo, ordenado) {

  //guarda en la cola de tareas
  for (let i = 0; i < tareasArreglo.length; i++) {
    baseDeDatos2.guardarTarea(profundidad, tareasArreglo[i]);
  }
  // imprimir tareas sin solucion
  // Llamada a la función para obtener las tareas y luego imprimirlas
  tareas= await baseDeDatos2.obtenerTodasLasTareas()
    // hacer algo con las tareas
    console.log('Tareas de la pila de tareas de la base de datos:', tareas);
 

  let tareaAtratar = await baseDeDatos2.borrarTareaEnTope();
  console.log("tarea a tratar" + tareaAtratar);
  console.log(tareaAtratar.tarea);

  if (ordenado) {
    //   for (let i = 0; i < tareasArreglo.length; i++) {
    //   enviarTexto("Tarea agregada: " + tareasArreglo[i]);
    // }
    agenteDeEjecucion(tareaAtratar.profundidad, tareaAtratar.tarea);
  } else {
    for (let i = 0; i < tareasArreglo.length; i++) {
      enviarTexto("Tarea agregada: " + tareasArreglo[i], "green");
    }
    agenteDeEjecucion(tareaAtratar.profundidad, tareaAtratar.tarea);    //este no deberia de estar aqui pero como no anda la priorizacion de tarea, estara aqui
    // agentePriorizacionDeTareas();  lo dejo comentado porque me anda mal la priorizacion de tarea

  }
}
async function agenteDeEjecucion(profundidad, tarea) {

  if (continuar) {

    console.log("entrando al agente de ejecucion de tareas");

    try {
      let todasLasSoluciones = await baseDeDatos1.obtenerTodasLasSoluciones();
      if (!Array.isArray(todasLasSoluciones)) {
        throw new Error("obtenerTodasLasSoluciones no devuelve un array");
      }
      console.log("Todas las soluciones de la base de datos :  " + todasLasSoluciones);

      if (typeof tarea !== "string") {
        throw new Error("tarea no es una cadena");
      }

      let soluciones = await encontrarTitulosSimilares(todasLasSoluciones, tarea);

      let mensaje = "  " + tarea + " ejecuta la tarea , en caso de no tener información suficiente dime como conseguirla  información:   " + soluciones + "";
      var solucion = await gpt.enviarMensaje(mensaje, "ejecucion");
      enviarTexto("Ejecutando tarea: " + tarea + " --> " + solucion, "orange");

      agenteCreacionDeTareas2(profundidad + 1, tarea, solucion, soluciones);

    } catch (error) {
      console.error(error);
    }

  }
}



async function agenteCreacionDeTareas2(profundidad, tarea, solucion, informacion) {
  let tareasArreglo = [];
  if (profundidad <= ProfundidadConfigurada) {

    enviarTexto("La profundidad de esta tarea es " + profundidad + " que es menor o igual a " + ProfundidadConfigurada, "red");
    let mensaje = "Conociendo esta tarea \n \n " + tarea + "\n información:  \n" + informacion + "  \n su ejecución \n " + solucion + " \n en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo  La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n La respuesta tiene que tener este formato  Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ";
    var respuesta = await gpt.enviarMensaje(mensaje, "creacion");

    // const tareasArreglo = respuesta.match(/Tarea.*?(?=zzz|$)/gs).map(tarea => tarea.trim());
    /*
    enviarTexto("Tarea agregada 1: " + tareasArreglo[0]);
    enviarTexto("Tarea agregada 2:" + tareasArreglo[1]);
    enviarTexto("Tarea agregada 3: " + tareasArreglo[2]);
    */
    //console.log("Tarea agregada 1: " + tareasArreglo[0]);
    //console.log("Tarea agregada 2:" + tareasArreglo[1]);
    //console.log("Tarea agregada 3: " + tareasArreglo[2]);

    let nuevaTarea = respuesta.replace("Tarea: ", "");
    tareasArreglo = [nuevaTarea];
  } else {
    enviarTexto("La profundidad de esta tarea es " + profundidad + "que es mayor a " + ProfundidadConfigurada, "red");
  }
  baseDeDatos1.GuardarEnMemoria(profundidad, tarea, solucion);

  pilaDeTareas(profundidad, tareasArreglo, false);

  //return tareasArreglo;

}

async function agentePriorizacionDeTareas() {

  let cadena = await baseDeDatos2.obtenerTodasLasTareas()

  let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  " + cadena;

  var respuesta = await gpt.enviarMensaje(mensaje, "prioridad");
  // Procesar tareas para convertila en un array de tareas
  const arrayTareas = respuesta.split("\n");
  const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
  const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));


  //console.log(tareasArreglo);
  baseDeDatos2.limpiarBaseDeDatos();
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
function encontrarTitulosSimilares(soluciones, tarea) {
  // Creamos un objeto para almacenar los puntajes de similitud de cada título
  const similitud = {};

  // Recorremos todos los títulos en el índice
  soluciones.forEach(function (titulo) {
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