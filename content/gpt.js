class plantillaDePrompt{
  constructor(plantilla,variablesDeEntradaPlantilla){
    const objeto = {};
    for (let i = 0; i < variablesDeEntradaPlantilla.length; i++) {
      objeto[variablesDeEntradaPlantilla[i]] = null;
    }
    this.plantilla=plantilla;
    this.variablesDeEntrada=objeto;
    this.variablesDeEntradaPlantilla=variablesDeEntradaPlantilla;
  }
  reiniciar(){
    const objeto = {};
    for (let i = 0; i < this.variablesDeEntradaPlantilla.length; i++) {
      objeto[this.variablesDeEntradaPlantilla[i]] = null;
    }
  }
  devolverMensaje(){
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

  asignarVariable(variable, valor){
    if(this.variablesDeEntrada.hasOwnProperty(variable)){
      this.variablesDeEntrada[variable] = valor;
    } else {
      console.log(`La variable ${variable} no existe en esta plantilla`);
    }
  }


  
}



//const  promptDeEmpezarObjetivo=new plantillaDePrompt("Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"]);
const  promptDeEmpezarObjetivo=new plantillaDePrompt("jueguemos un juego de roles Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse() Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"]);
promptDeEmpezarObjetivo.asignarVariable("objetivo","comprar pan");
console.log(promptDeEmpezarObjetivo.devolverMensaje());


const  promptDeEjecutarTarea=new plantillaDePrompt( "jueguemos un juego de roles Eres una Inteligencia Artificial autónoma de ejecución de tareas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Tienes la siguiente tarea {tarea}. Ejecuta la tarea y devuelve la respuesta como una cadena de texto.", ["objetivo", "tarea"]);
promptDeEjecutarTarea.asignarVariable("objetivo","comprar pan");
promptDeEjecutarTarea.asignarVariable("tarea","ir a la panaderia");
console.log(promptDeEjecutarTarea.devolverMensaje());


const  promptDeCrearTarea=new plantillaDePrompt( "jueguemos un juego de roles  Eres un agente de creación de tareas de IA.Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse(). Tienes el siguiente objetivo {objetivo}. Tienes las siguientes tareas incompletas {tareas} y acabas de ejecutar la siguiente tarea {ultimaTarea} y has recibido el siguiente resultado {resultado}. Basándote en esto, crea una nueva tarea que sea completada por tu sistema de IA SÓLO SI ES NECESARIO para que tu objetivo se alcance más de cerca o se alcance por completo. Regresa la respuesta como una matriz de cadenas que se pueden usar en JSON.parse() y NADA MÁS.", ["objetivo", "tareas", "ultimaTarea", "resultado"]);
promptDeCrearTarea.asignarVariable("objetivo","comprar pan");
promptDeCrearTarea.asignarVariable("tareas",["bbuscar pan","comer pan", "ir a la pana"]);
promptDeCrearTarea.asignarVariable("ultimaTarea","ir a la panaderia");
promptDeCrearTarea.asignarVariable("resultado","se intento ir pero la puerta estaba cerrada");
console.log(promptDeCrearTarea.devolverMensaje());

class ChatGPT {
  constructor(){
    this.inicio=null;
    this.contador=0;
    this.final=null;
    this.tiempoDeRetardo=3000;
  }
  establecerRetardo(retardo){
    this.tiempoDeRetardo=retardo;
  }

  async enviarPrompt(prompt,chat){
    return await this.obtenerObjetoDesdeString(await this.enviarMensaje(await prompt.devolverMensaje(),chat));
  }
   obtenerObjetoDesdeString(str) {
    const strfiltrado=obtenerCadenasEntreCorchetes(str);
    if (strfiltrado.length > 0 ){
      return JSON.parse(strfiltrado);
    }else{
      return [];
    }
    
  }
  
  
  
  
    async enviarMensaje(mensaje, chat) {
      enviarTexto("Pensando","gray");
      if(this.inicio == null){
        this.inicio=new Date();
      }else{
        this.final=new Date();
      }
      this.contador++;

      await new Promise((resolve) => {
        //  clickButton();
        this.#seleccionarChat(chat);
        setTimeout(() => {
          resolve();
        }, this.tiempoDeRetardo);
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
     detectIcon() {
      const icon = document.querySelector('.absolute.w-4.h-4.rounded-full.text-[10px].flex.justify-center.items-center.right-0.top-[20px].-mr-2.border.border-white.bg-red-500.text-white');
      if (icon) {
        return true;
      } else {
        return false;
      }
    }
    rendimiento(){
      
      return Math.round((this.contador/this.tiempo()));
    }
    tiempo(){
      return Math.round((this.final - this.inicio)/(1000*60));
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

  const gpt = new ChatGPT();


  function obtenerCadenasEntreCorchetes(str) {
    const regex = /\[(.*?)\]/g; // Expresión regular para buscar los corchetes
  
    const matches = str.match(regex); // Buscamos todas las coincidencias
  
    if (matches) {
      return matches; // Devolvemos el array con todas las coincidencias encontradas
    } else {
      return []; // Si no se encontraron coincidencias, devolvemos un array vacío
    }
  }
  



   const str="Claro, aquí te presento una lista de tareas que podrían ser útiles para lograr el objetivo de comprar agua:  css  Copy code  [  \"Identificar las tiendas cercanas que venden agua\",  \"Verificar la disponibilidad de agua en las tiendas seleccionadas\",  \"Seleccionar la tienda con el mejor precio/calidad y comprar el agua necesaria\"]  Espero que esto te ayude a lograr tu objetivo de comprar agua. Si tienes alguna otra pregunta, no dudes en preguntar.";
  //const str=" [  \"Identificar las tiendas cercanas que venden agua\",  \"Verificar la disponibilidad de agua en las tiendas seleccionadas\",  \"Seleccionar la tienda con el mejor precio/calidad y comprar el agua necesaria\"]  ";

/*
  console.log(strfiltrado);
  //const obj  =gpt.obtenerObjetoDesdeString(str);
  const obj  =  

  console.log("respuesta: " + JSON.stringify(obj));
  */