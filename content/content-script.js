


try {
  var interfaz = new InterfazDeUsuario();
} catch (error) {
  // Manejo del error aquí
}

//Maquina de estados finito
async function principal(nombre, objetivo,retardo) {

  // aqui se enviara al agente de creacion de tareas el nombre y el objetivo para
  interfaz.imprimirInicio(nombre, objetivo)
  interfaz.setNombre(nombre);
  interfaz.setObjetivo(objetivo);
  interfaz.setTiempoEntreMensaje(retardo);
  await interfaz.iniciarProceso(maquina);
  await interfaz.imprimirEstadisticas(maquina, gpt);

}
// Escuchar mensajes enviados desde popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "pausa") {
    // Llamar a la función que deseas ejecutar
 /*    if (interfaz.getContinua()){
      interfaz.pausa();
    }else{
      this.interfaz.continua();
    } */
    interfaz.pausa();
  }
});


//listener para escuchar el boton de iniciar proceso
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "informacion") {
    const nombre = mensaje.datos.nombre; // Obtener el valor del primer campo de consulta
    const objetivo = mensaje.datos.objetivo; // Obtener el valor del segundo campo de consulta
    const retardo = mensaje.datos.retardo;
    const ProfundidadConfigurada = mensaje.datos.numero; // Obtener el valor del campo numérico deslizante
    principal(nombre, objetivo,retardo);
  }
});
//listener para escuchar el boton de descargar
chrome.runtime.onMessage.addListener(function (mensaje, sender, respuesta) {
  if (mensaje.tipo === "txt") {
    interfaz.descargarProceso();
  }
});



