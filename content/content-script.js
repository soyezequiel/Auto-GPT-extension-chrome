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
   enviarTexto("Cantidad de consultas: "+ await gpt.contador + " a chatGPT ","white");
   enviarTexto( "Tiempo de sesión:  "   + await gpt.tiempo() + " minutos  ","white");
   enviarTexto( "Tareas creadas:  "     + await colaDeTareas.getTareasTotales() ,"white");
   enviarTexto( "Tareas ejecutadas:  "  + await agenteDeEjecucionDeTareas.getTareasEjecutadas() ,"white");

   console.log(proceso.join(" \n\n"));

}
async function maquina(){
  if (continuar) {

    await agenteCreadorDeTareas.enviarTareas(colaDeTareas);
  //  await colaDeTareas.enviarTareas(agenteDePriorizacionTareas);
  //  await agenteDePriorizacionTareas.enviarTareasOrdenadas(colaDeTareas);     
    let todasLasSoluciones = await BdTareaSolucion.obtenerarrayDeStringTodasLasSoluciones();
    await colaDeTareas.moverTareaMasPrioritaria(agenteDeEjecucionDeTareas, todasLasSoluciones);
    await agenteDeEjecucionDeTareas.enviarParTareaSolucion(agenteCreadorDeTareas);
    await maquina();

  }
}



//listener
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    BdTarea.borrarBaseDeDatosDeTareas();
    BdTareaSolucion.borrarBaseDeDatosDeSoluciones();
    agenteCreadorDeTareas.reiniciar();
    colaDeTareas.reiniciar();
    agenteDeEjecucionDeTareas.reiniciar();

    const nombre = mensaje.datos.nombre; // Obtener el valor del primer campo de consulta
    const objetivo = mensaje.datos.objetivo; // Obtener el valor del segundo campo de consulta
    const retardo =mensaje.datos.retardo;
    console.log("retardo establecido: " + retardo);
    gpt.establecerRetardo((retardo * 1000)+ Math.floor(Math.random() * 2000));


    const numero = mensaje.datos.numero; // Obtener el valor del campo numérico deslizante
   // ProfundidadConfigurada = numero;
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


chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "txt") {
    descargarArchivo2(proceso.join(" \n\n "));

  }
});



function descargarArchivo2(texto) {
  // Creamos un objeto de texto con la información que queremos descargar


  // Creamos un objeto de archivo de texto
  var archivo = new Blob([texto], {type: "text/plain"});

  // Creamos un objeto de URL para el archivo
  var urlArchivo = URL.createObjectURL(archivo);

  // Creamos un objeto de enlace de descarga y lo hacemos invisible
  var enlaceDescarga = document.createElement("a");
  enlaceDescarga.style.display = "none";

  // Asignamos la URL del archivo al objeto de enlace de descarga
  enlaceDescarga.href = urlArchivo;

  // Asignamos un nombre de archivo al objeto de enlace de descarga
  enlaceDescarga.download = "archivo.txt";

  // Añadimos el objeto de enlace de descarga al documento
  document.body.appendChild(enlaceDescarga);

  // Hacemos clic en el objeto de enlace de descarga para descargar el archivo
  enlaceDescarga.click();

  // Eliminamos el objeto de enlace de descarga del documento
  document.body.removeChild(enlaceDescarga);
}