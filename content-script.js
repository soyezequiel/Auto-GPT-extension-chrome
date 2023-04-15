




  /*

chrome.runtime.onMessage.addListener(function(mensaje, sender, respuesta) {
    if (mensaje.tipo === "informacion") {
      const nombre = mensaje.datos.nombre;
      const objetivo = mensaje.datos.objetivo;
  
      // aquí puedes hacer lo que quieras con las variables "nombre" y "objetivo"
      console.log("Nombre del agente: " + nombre);

      console.log("Objetivo: " + objetivo);
  
      principal(nombre,objetivo);
    }
  });



  function principal(nombre,objetivo){

  //  crearChat(nombre + " dijo viva la libertad carajo");

    enviarMensaje("soy un " + nombre + "y mi objetivo es " + objetivo + "quiero que lo analises y me des tres tareas como maximo que me permita completar aquel objetivo");


  }

    
  function enviarMensaje(mensaje) {
    // Obtener el formulario
    const form = document.querySelector('form.stretch');
    if (form !== null) {
      // Obtener los elementos dentro del formulario
      const textarea = form.querySelector('textarea');
      const button = form.querySelector('button');
  
      // Establecer los valores de los elementos
      textarea.value = mensaje;
  
      // Hacer clic en el botón después de 1 segundo
  
        button.click();



    } else {
      console.log('El formulario no existe en la página.');
    }
  }
  


  

async function crearChat(mensaje){

    const boton = document.querySelector('a.flex');
    boton.click();
    console.log("se enviara el mensaje");
    enviarMensaje(mensaje);
    console.log("se envio el mensaje");
    return obtenerNombre();

}
  

function puedoContinuar() {
    if (document.querySelector('.text-2xl span:first-child') !== null) {
      console.log(true); // El elemento existe
      return true;
    } else {
      console.log(false); // El elemento no existe
      return false;
    }
  }
  
  
  




function enviarMensajeEn(mensaje,nombre){
    seleccionarChat(nombre);
    enviarMensaje(mensaje)
}


function seleccionarChat(nombre){
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




setTimeout(function() {
    console.log('El script se está ejecutando');
    enviarMensaje('hola como estas bebe');
    // Aquí va el código que deseas ejecutar después de que la página ha terminado de cargar
  }, 3000);
  
*/

