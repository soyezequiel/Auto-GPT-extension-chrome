class MemoryDatabase {
  constructor() {
    this.data = {};
    this.lastId = 0;
  }

  add(obj) {
    const id = ++this.lastId;
    this.data[id] = obj;
    return id;
  }
  pop() {
    const allValues = Object.values(this.data);
    const lastValue = allValues.pop();
    const lastId = Object.keys(this.data).pop();
    delete this.data[lastId];
    this.lastId = lastId - 1;
    return lastValue;
  }

  getAll() {
    
    return Object.values(this.data);
  }

  delete(id) {
    if (this.data.hasOwnProperty(id)) {
      delete this.data[id];
      return true;
    }
    return false;
  }

  clear() {
    this.data = {};
    this.lastId = 0;
  }
}




class BaseDeDatosTarea {
  constructor(nombre, esquema) {
    this.db =  new MemoryDatabase();
  }
  guardarTarea(tarea) {
    this.db.add(tarea);
  }

  borrarBaseDeDatosDeTareas() {
    this.db.clear();
  }

  obtenerArrayDeStringTodasLasTareas() {
    let todos = this.db.getAll();
    const solucionesArray = todos.map(todo => todo.tarea);
    return solucionesArray;

  }
  obtenerStringTareas() {
    return this.obtenerArrayDeStringTodasLasTareas().join(', ');
  }
  borrarTareaEnTope() {
    return this.db.pop();
  }

}
// Abrir la base de datos de profundidad,tarea
const BdTarea = new BaseDeDatosTarea();




  class BaseDeDatosTareaSolucion {
     constructor() {
      this.db =  new MemoryDatabase();
    }
    guardarSolucion(tarea) {
      this.db.add(tarea);
    } 
    borrarBaseDeDatosDeSoluciones() {
      this.db.clear();
    }
    async obtenerarrayDeStringTodasLasSoluciones() {
      let todos = await this.db.getAll();
      const solucionesArray = todos.map(todo => todo.solucion);

      return solucionesArray;
    }

    guardarEnMemoria(parTareaSolucion) {
      //guarda en memoria
      this.guardarSolucion(parTareaSolucion);
  
      //imprimir tareas soluciones
      let soluciones=this.obtenerarrayDeStringTodasLasSoluciones();
        console.log("imprimiendo las tareas que estan en la base de datos: " + soluciones);
    
    }
  }













































    


  const BdTareaSolucion = new BaseDeDatosTareaSolucion();
  


  class TareaSolucion{
      constructor(profundidad,tarea,solucion){
        this.profundidad=profundidad;
        this.tarea=tarea;
        this.solucion=solucion;
      }
  }


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

    BdTarea.borrarBaseDeDatosDeTareas();
    BdTareaSolucion.borrarBaseDeDatosDeSoluciones();
    
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
    let arregloDePar = [];
    for (let i = 0; i < tareasArreglo.length; i++) {
      console.log("tarea ----------->" + tareasArreglo[i]);
      arregloDePar[i]=new TareaSolucion(0,tareasArreglo[i],"");
    }




    console.log("objetivo: " + objetivo);
    console.log("nombre: " + nombre);


    //baseDeDatos1.guardarEnMemoria(0, nombre, objetivo);
    var objsolucion=new TareaSolucion(0,nombre,objetivo);
    BdTareaSolucion.guardarEnMemoria(objsolucion);

    pilaDeTareas(arregloDePar,true);

    //return tareasArreglo;

  }

}
async function pilaDeTareas(arregloDePar,ordenado) {
  console.log("Entrando a la pila de tareas");
  //guarda en la cola de tareas
  let tareaActual;
  for (let i = 0; i < arregloDePar.length; i++) {
    console.log("tarea ----------->" + arregloDePar[i].tarea);
    BdTarea.guardarTarea(arregloDePar[i]);
  }

  let string=BdTarea.obtenerStringTareas()

  console.log('Tareas de la pila de tareas de la base de datos:', await string);



  let parTareaAtratar = await BdTarea.borrarTareaEnTope();
  console.log("tarea a tratar" + parTareaAtratar.tarea);

  if (ordenado) {

    agenteDeEjecucion(parTareaAtratar);
  } else {
    for (let i = 0; i < arregloDePar.length; i++) {
      enviarTexto("Tarea agregada: " + arregloDePar[i].tarea, "green");
    }
    agenteDeEjecucion(parTareaAtratar);    //este no deberia de estar aqui pero como no anda la priorizacion de tarea, estara aqui
    // agentePriorizacionDeTareas();  lo dejo comentado porque me anda mal la priorizacion de tarea

  }
}
async function agenteDeEjecucion(parTareaAtratar) {

  if (continuar) {

    console.log("entrando al agente de ejecucion de tareas");

    try {

      let todasLasSoluciones = await BdTareaSolucion.obtenerarrayDeStringTodasLasSoluciones();
      if (!Array.isArray(todasLasSoluciones)) {
        throw new Error("obtenerarrayDeStringTodasLasSoluciones no devuelve un array");
      }
      console.log("Todas las soluciones de la base de datos :  " + todasLasSoluciones);

      if (typeof parTareaAtratar.tarea !== "string") {
        throw new Error("tarea no es una cadena");
      }

      let contexto = await encontrarTitulosSimilares(todasLasSoluciones, parTareaAtratar.tarea);

      let mensaje = "  " + parTareaAtratar.tarea + " ejecuta la tarea , en caso de no tener información suficiente dime como conseguirla  información:   " + contexto + "";
      var solucion = await gpt.enviarMensaje(mensaje, "ejecucion");
      enviarTexto("Ejecutando tarea: " + parTareaAtratar.tarea + " --> " + solucion, "orange");
      parTareaAtratar.solucion=solucion;


      agenteCreacionDeTareas2(parTareaAtratar, contexto);

    } catch (error) {
      console.error(error);
    }

  }
}



async function agenteCreacionDeTareas2( parTareaSolucion, contexto) {
  let tareasArreglo = [];
  if (parTareaSolucion.profundidad +1 <= ProfundidadConfigurada) {

    enviarTexto("La profundidad de esta tarea es " + parTareaSolucion.profundidad + " que es menor o igual a " + ProfundidadConfigurada, "red");
    let mensaje = "Conociendo esta tarea \n \n " + parTareaSolucion.tarea + "\n información:  \n" + contexto + "  \n su ejecución \n " + parTareaSolucion.solucion + " \n en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo  La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n La respuesta tiene que tener este formato  Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ";
    var respuesta = await gpt.enviarMensaje(mensaje, "creacion");


    let nuevaTarea = respuesta.replace("Tarea: ", "");
    let nuevoParTareaSolucion= new TareaSolucion(parTareaSolucion.profundidad+1,nuevaTarea,"");
    arregloPar = [nuevoParTareaSolucion];
  } else {
    enviarTexto("La profundidad de esta tarea es " + parTareaSolucion.profundidad + "que es mayor a " + ProfundidadConfigurada, "red");
  }
  //baseDeDatos1.guardarEnMemoria(profundidad, tarea, solucion);
  BdTareaSolucion.guardarEnMemoria(parTareaSolucion);

  pilaDeTareas(arregloPar, false);

  //return tareasArreglo;

}

async function agentePriorizacionDeTareas() {


  let cadena = await BdTarea.obtenerArrayDeStringTodasLasTareas().join(", ");

  let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  " + cadena;

  var respuesta = await gpt.enviarMensaje(mensaje, "prioridad");
  // Procesar tareas para convertila en un array de tareas
  const arrayTareas = respuesta.split("\n");
  const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
  const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));

  var arregloDePar;
  for (let i = 0; i < tareasArreglo.length; i++) {
    console.log("tarea ----------->" + tareasArreglo[i]);
    arregloDePar[i]=new TareaSolucion(0,tareasArreglo[i],"");
  }
  //console.log(tareasArreglo);
  //baseDeDatos2.limpiarBaseDeDatos();
  BdTarea.borrarBaseDeDatosDeTareas();
  pilaDeTareas(arregloDePar, true);


}
