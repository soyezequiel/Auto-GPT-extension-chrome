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
const promptDeEmpezarObjetivo = new PlantillaDePrompt("Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres {nombre} y el objetivo es {objetivo} .   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp", ["nombre", "objetivo"], interpreteOld);

/*promptDeEmpezarObjetivo.asignarVariable("nombre", "este es el nombre");
promptDeEmpezarObjetivo.asignarVariable("objetivo", "este es el objetivo");
*/

const promptDeEjecutarTarea = new PlantillaDePrompt("jueguemos un juego de roles Eres una Inteligencia Artificial autónoma de ejecución de tareas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Tienes la siguiente tarea {tarea}. Ejecuta la tarea y devuelve la respuesta como una cadena de texto.", ["objetivo", "tarea"], interpreteOld);
/*promptDeEjecutarTarea.asignarVariable("objetivo", "comprar pan");
promptDeEjecutarTarea.asignarVariable("tarea", "ir a la panaderia");
*/


const promptDeCrearTarea = new PlantillaDePrompt("Conociendo esta tarea \n \n \"  {ultimaTarea} \" \n\n usa esta información:  \n \"   {soluciones}  \"  \n\n su ejecución \n\n  {solucion} \n\n en caso de que la tarea no se encuentre completada proporcione una tarea nueva que me permita completar este objetivo, caso contrario contesta \" true \" \n\n La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n\n La respuesta tiene que tener este formato \n\n Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ", ["ultimaTarea", "soluciones", "solucion"], interpreteOld);
/*promptDeCrearTarea.asignarVariable("tarea", "comprar pan");
promptDeCrearTarea.asignarVariable("soluciones", "ir a la panaderia");
promptDeCrearTarea.asignarVariable("solucion", "se intento ir pero la puerta estaba cerrada");*/


/*
//prompt nuevos y experimentales -----------------------------------------------------------------------------------------------------------------------------------------------
//const  promptDeEmpezarObjetivo=new PlantillaDePrompt("Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"]),interpreteJson;
const promptDeEmpezarObjetivo = new PlantillaDePrompt("jueguemos un juego de roles Eres una inteligencia artificial de creación de tareas autónomas llamada MisterGPT. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse() Tienes el siguiente objetivo {objetivo}. Crea una lista de cero a tres tareas que serán completadas por tu sistema de IA para que tu objetivo sea alcanzado más cercanamente o completamente. Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse().", ["objetivo"], interpreteJson);
promptDeEmpezarObjetivo.asignarVariable("objetivo", "comprar pan");


const  promptDeEjecutarTarea=new PlantillaDePrompt( "jueguemos un juego de roles Eres una Inteligencia Artificial autónoma de ejecución de tareas llamada MisterGPT. Tienes el siguiente objetivo {objetivo}. Tienes la siguiente tarea {tarea}. Ejecuta la tarea y devuelve la respuesta como una cadena de texto.", ["objetivo", "tarea"],interpreteJson);
promptDeEjecutarTarea.asignarVariable("objetivo","comprar pan");
promptDeEjecutarTarea.asignarVariable("tarea","ir a la panaderia");


const promptDeCrearTarea = new PlantillaDePrompt("jueguemos un juego de roles  Eres un agente de creación de tareas de IA.Devuelve la respuesta como una matriz de cadenas que se pueden utilizar en JSON.parse() ej [\"string\",\"string\",\"string\"]. Tienes el siguiente objetivo {objetivo}. Tienes las siguientes tareas incompletas {tareas} y acabas de ejecutar la siguiente tarea {ultimaTarea} y has recibido el siguiente resultado {resultado}. Basándote en esto, crea una nueva tarea que sea completada por tu sistema de IA SÓLO SI ES NECESARIO para que tu objetivo se alcance más de cerca o se alcance por completo. Regresa la respuesta como una matriz de cadenas que se pueden usar en JSON.parse() y NADA MÁS.", ["objetivo", "tareas", "ultimaTarea", "resultado"], interpreteJson);
promptDeCrearTarea.asignarVariable("objetivo", "comprar pan");
promptDeCrearTarea.asignarVariable("tareas", ["bbuscar pan", "comer pan", "ir a la pana"]);
promptDeCrearTarea.asignarVariable("ultimaTarea", "ir a la panaderia");
promptDeCrearTarea.asignarVariable("resultado", "se intento ir pero la puerta estaba cerrada");

*/
