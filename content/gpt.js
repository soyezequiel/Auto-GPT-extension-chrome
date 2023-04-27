class InterpreteJson {
  obtenerObjetoDesdeString(str) {

    const strfiltrado = this._obtenerCadenasEntreCorchetes(str);
    if (strfiltrado.length > 0 ) {
      console.log("resultado de strfiltraado  " + strfiltrado);
      const array = JSON.parse(strfiltrado);
      console.log("resultado de objeto json  " + array.join("\n ----->") + " \n \ n o " + array[0]);
      let tareas = [];
      for (let i = 0; i < array.length; i++) {
        tareas.push(new TareaSolucion(0, array[i], ""));
      }
      return tareas;
    } else {
        return [];
      
      
    }
  }
  
   async _obtenerCadenasEntreCorchetes(str) {
    const regex = /\[(.*?)\]/g;
    const matches = await  str.match(regex);
    console.log("entrada: " + typeof str);
    if ( await matches == null){
      console.error("no se obtuvo nada que este dentro de unos corchetes");
    }else{

      console.log("salida:   " + matches[0]);
      return matches[0];
    }

  }
  


/*
  _obtenerCadenasEntreCorchetes(texto) {
    const corchetesAbiertos = [];
    const cadenas = [];
    let cadenaActual = "";
    console.log("cantidad de caracteres "+texto.length);
    for (let i = 0; i < texto.length; i++) {
      if (texto[i] === "[") {
        corchetesAbiertos.push(i);
      } else if (texto[i] === "]") {
        if (corchetesAbiertos.length > 0) {
          const indiceCorcheteAbierto = corchetesAbiertos.pop();
          cadenaActual = texto.substring(indiceCorcheteAbierto, i + 1);
          cadenas.push(cadenaActual);
        }
      }
    }

    if (corchetesAbiertos.length > 0) {
      console.error("Error: Hay corchetes abiertos que no se cerraron.");
    } else if (cadenas.length === 0) {
      console.error("No se encontraron cadenas entre corchetes.");
      return "error";
    } else {
      return cadenas;
    }
  }
*/
}

class InterpreteOld {
  obtenerObjetoDesdeString(str) {

    const arrayTareas = str.split("\n");
    const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
    const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));
    let arreglo = [];
    for (let i = 0; i < tareasArreglo.length; i++) {
      arreglo[i] = new TareaSolucion(0, tareasArreglo[i], "");
    }
    if (this._noMasSubTarea(arreglo[0].tarea)) {
      interfaz.imprimirTareaCompletada(),
        arreglo = [];
    }
    return arreglo;
  }
  _noMasSubTarea(cadena) {
    let palabras = cadena.trim().toLowerCase().replace(/\.+/g, '').split(" ");
    return palabras.length < 4 && palabras.includes("true");
  }

}
const interpreteJson = new InterpreteJson();
const interpreteOld = new InterpreteOld();

class PlantillaDePrompt {
  constructor(plantilla, variablesDeEntradaPlantilla, interprete) {
    this.interprete = interprete;
    const objeto = {};
    for (let i = 0; i < variablesDeEntradaPlantilla.length; i++) {
      objeto[variablesDeEntradaPlantilla[i]] = null;
    }
    this.plantilla = plantilla;
    this.variablesDeEntrada = objeto;
    this.variablesDeEntradaPlantilla = variablesDeEntradaPlantilla;
  }
  _reiniciar() {
    const objeto = {};
    for (let i = 0; i < this.variablesDeEntradaPlantilla.length; i++) {
      objeto[this.variablesDeEntradaPlantilla[i]] = null;
    }
  }
  devolverMensaje() {
    let mensaje = this.plantilla;
    const variables = this.variablesDeEntrada;

    for (const variable in variables) {
      if (Array.isArray(variables[variable])) {
        variables[variable] = variables[variable].join(" , ");
      }
      mensaje = mensaje.replace(`{${variable}}`, variables[variable]);
    }

    return mensaje;
  }

  asignarVariable(variable, valor) {
    if (this.variablesDeEntrada.hasOwnProperty(variable)) {
      this.variablesDeEntrada[variable] = valor;
    } else {
      console.log(`La variable ${variable} no existe en esta plantilla`);
    }
  }



}
/* */
//const  promptDeEmpezarObjetivo=new PlantillaDePrompt("Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"],interpreteOld);
const promptDeEmpezarObjetivo = new PlantillaDePrompt("Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres {nombre} y el objetivo es {objetivo} .   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp", ["nombre", "objetivo"],interpreteOld);

promptDeEmpezarObjetivo.asignarVariable("nombre", "este es el nombre");
promptDeEmpezarObjetivo.asignarVariable("objetivo", "este es el objetivo");
//console.log(promptDeEmpezarObjetivo.devolverMensaje());


const promptDeEjecutarTarea = new PlantillaDePrompt("jueguemos un juego de roles Eres una Inteligencia Artificial autónoma de ejecución de tareas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Tienes la siguiente tarea {tarea}. Ejecuta la tarea y devuelve la respuesta como una cadena de texto.", ["objetivo", "tarea"], interpreteOld);
promptDeEjecutarTarea.asignarVariable("objetivo", "comprar pan");
promptDeEjecutarTarea.asignarVariable("tarea", "ir a la panaderia");
//console.log(promptDeEjecutarTarea.devolverMensaje());


const promptDeCrearTarea = new PlantillaDePrompt("Conociendo esta tarea \n \n \"  {tarea} \" \n\n usa esta información:  \n \"   {contexto}  \"  \n\n su ejecución \n\n  {solucion} \n\n en caso de que la tarea no se encuentre completada proporcione una tarea nueva que me permita completar este objetivo, caso contrario contesta \" true \" \n\n La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n\n La respuesta tiene que tener este formato \n\n Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ", ["tarea", "contexto", "solucion"],interpreteOld);
promptDeCrearTarea.asignarVariable("tarea", "comprar pan");
promptDeCrearTarea.asignarVariable("contexto", "ir a la panaderia");
promptDeCrearTarea.asignarVariable("solucion", "se intento ir pero la puerta estaba cerrada");
//console.log(promptDeCrearTarea.devolverMensaje());


/*
//prompt nuevos y experimentales -----------------------------------------------------------------------------------------------------------------------------------------------
//const  promptDeEmpezarObjetivo=new PlantillaDePrompt("Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"]),interpreteJson;
const promptDeEmpezarObjetivo = new PlantillaDePrompt("jueguemos un juego de roles Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse() Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"], interpreteJson);
promptDeEmpezarObjetivo.asignarVariable("objetivo", "comprar pan");
//console.log(promptDeEmpezarObjetivo.devolverMensaje());


const  promptDeEjecutarTarea=new PlantillaDePrompt( "jueguemos un juego de roles Eres una Inteligencia Artificial autónoma de ejecución de tareas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Tienes la siguiente tarea {tarea}. Ejecuta la tarea y devuelve la respuesta como una cadena de texto.", ["objetivo", "tarea"],interpreteJson);
promptDeEjecutarTarea.asignarVariable("objetivo","comprar pan");
promptDeEjecutarTarea.asignarVariable("tarea","ir a la panaderia");
//console.log(promptDeEjecutarTarea.devolverMensaje());


const promptDeCrearTarea = new PlantillaDePrompt("jueguemos un juego de roles  Eres un agente de creación de tareas de IA.Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse() ej [\"string\",\"string\",\"string\"]. Tienes el siguiente objetivo {objetivo}. Tienes las siguientes tareas incompletas {tareas} y acabas de ejecutar la siguiente tarea {ultimaTarea} y has recibido el siguiente resultado {resultado}. Basándote en esto, crea una nueva tarea que sea completada por tu sistema de IA SÓLO SI ES NECESARIO para que tu objetivo se alcance más de cerca o se alcance por completo. Regresa la respuesta como una matriz de cadenas que se pueden usar en JSON.parse() y NADA MÁS.", ["objetivo", "tareas", "ultimaTarea", "resultado"], interpreteJson);
promptDeCrearTarea.asignarVariable("objetivo", "comprar pan");
promptDeCrearTarea.asignarVariable("tareas", ["bbuscar pan", "comer pan", "ir a la pana"]);
promptDeCrearTarea.asignarVariable("ultimaTarea", "ir a la panaderia");
promptDeCrearTarea.asignarVariable("resultado", "se intento ir pero la puerta estaba cerrada");
//console.log(promptDeCrearTarea.devolverMensaje());

*/


class PaginaWeb {
  identificarEntradaDeTexto() {
    this.textarea = document.querySelector('textarea[placeholder="Send a message."]');
  }
  ingresarTexto(mensaje) {
    this.textarea.value = mensaje;
  }
  presionarAceptar() {
    // Crear un evento keydown para simular presionar la tecla Enter
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    // Desencadenar el evento keydown
    this.textarea.dispatchEvent(event);
  }
  obtenerRespuesta() {
    const elementos = document.querySelectorAll('.prose');

    if (!elementos.length) {
      return { error: 'No se encontraron elementos con la clase "prose" ' };
    } else {

      const ultimoElemento = elementos[elementos.length - 1];
      return { respuesta: ultimoElemento.textContent.trim() };
    }


  }
  seleccionarChat(nombre) {
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
  detectIcon() {
    const icon = document.querySelector('.absolute.w-4.h-4.rounded-full.text-[10px].flex.justify-center.items-center.right-0.top-[20px].-mr-2.border.border-white.bg-red-500.text-white');
    if (icon) {
      return true;
    } else {
      return false;
    }
  }
  puedoContinuar() {
    if (document.querySelector('.text-2xl span:first-child') !== null) {
      console.log("espera"); // El elemento existe
      return false;
    } else {
      //console.log("puedoContinuar dice " +  true); // El elemento no existe
      return true;
    }
  }
  existeElElemento() {
    return (this.textarea !== null);
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

var web = new PaginaWeb();

class controlador {
  constructor(web) {
    this.inicio = null;
    this.contador = 0;
    this.final = null;
    this.tiempoDeRetardo = 3000;
    this.web = web;
  }
  establecerRetardo(retardo) {
    this.tiempoDeRetardo = retardo;
  }
  getRetardo() {
    return this.tiempoDeRetardo;
  }
  async enviarPrompt(prompt, chat) {
    const mensaje = await prompt.devolverMensaje();
    const respuesta = await this.enviarMensaje(mensaje, chat);
    const objeto = await prompt.interprete.obtenerObjetoDesdeString(respuesta);
    return objeto;
  }

  async enviarMensaje(mensaje, chat) {
    interfaz.imprimirPensando();
    if (this.inicio == null) {
      this.inicio = new Date();
    } else {
      this.final = new Date();
    }
    this.contador++;

    await new Promise((resolve) => {
      //  clickButton();
      this.web.seleccionarChat(chat);
      setTimeout(() => {
        resolve();
      }, this.tiempoDeRetardo);
    });

    // código que se ejecutará después de 3 segundos

    // console.log("mensaje " + mensaje);
    // Obtener el cuadro de texto

    this.web.identificarEntradaDeTexto();
    if (this.web.existeElElemento()) {
      // Establecer el valor del cuadro de texto
      this.web.ingresarTexto(mensaje);

      this.web.presionarAceptar();


      // Esperar a que puedoContinuar() devuelva true
      await new Promise((resolve) => {
        const checkContinuar = setInterval(() => {
          if (this.web.puedoContinuar()) {
            clearInterval(checkContinuar);
            resolve();
          }
        }, 100);
      });
      var respuesta;
      const resultado = this.web.obtenerRespuesta();
      if (resultado.error) {
        console.error(resultado.error); // muestra el mensaje de error en la consola
      } else {
        respuesta = resultado.respuesta;
      }


      //  chrome.runtime.sendMessage({ tipo: "respuesta", datos: { valor: respuesta } });
      // console.log("respuesta:  " + respuesta );
      return respuesta;
    } else {
      console.log('El cuadro de texto no existe en la página.');
    }

  }
  rendimiento() {
    return Math.round((this.contador / this.tiempo()));
  }
  tiempo() {
    return Math.round((this.final - this.inicio) / (1000 * 60));
  }
}


/*
class controladorOld extends controlador {

  constructor(web) {
    super(web);
  }
  async enviarPrompt(prompt, chat) {
    return await this._obtenerObjetoDesdeString(await this.enviarMensaje(await prompt.devolverMensaje(), chat));
  }
}  */


const gpt = new controlador(web);
//const gptOld = new controladorOld(web);