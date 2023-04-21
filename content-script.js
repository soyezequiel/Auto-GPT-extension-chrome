var continuar = true;
var ProfundidadConfigurada = 1;

//Maquina de estados finito
async function principal(nombre, objetivo) {
  continuar=true;
  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para
  let texto = "Nombre: " + nombre + '\n' + "Objetivo: " + objetivo;
  enviarTexto(texto, "blue");
  await agenteCreadorDeTareas.crearApartirDelObjetivo(nombre, objetivo);
  await maquina();
   enviarTexto("Rendimiento: "+await gpt.rendimiento()  + " consultas por minuto a chatGPT ","white");
   enviarTexto("Cantidad de consultas: " +  await gpt.contador + " a chatGPT ","white");
   enviarTexto( "Tiempo de sesión:  "+ await gpt.tiempo() + " minutos  ","white");

}
async function maquina(){
  if (continuar) {
    await agenteCreadorDeTareas.enviarTareas(colaDeTareas);
    ordenado = true; //se lo forza a activado devido a que el agente de priorizacion de tareas no funciona de forma estable
    if (ordenado) {
      let todasLasSoluciones = await BdTareaSolucion.obtenerarrayDeStringTodasLasSoluciones();
      await colaDeTareas.moverTareaMasPrioritaria(agenteDeEjecucionDeTareas, todasLasSoluciones);
    } else {
      await colaDeTareas.enviarTareas(agenteDePriorizacionTareas);
      await agenteDePriorizacionTareas.enviarTareasOrdenadas(colaDeTareas);
    }
    await agenteDeEjecucionDeTareas.enviarParTareaSolucion(agenteCreadorDeTareas);

    await maquina();
  }

}















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
    //   console.log(mensaje.texto); // Hola desde popup.js
  } else {
    // console.error("El mensaje recibido no es una cadena de texto");
  }
});
// En content_script.js
/*
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
*/

