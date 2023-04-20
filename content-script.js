// Abrir la base de datos de profundidad,tarea


console.log("content-script.js");
//variables
var continuar = true;
var ProfundidadConfigurada = 1;


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
