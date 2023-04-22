//import { enviarMensaje } from './gpt.js';
console.log("popup.js");
const form = document.querySelector('#formulario');

/* Este código agrega un listener al evento "submit" de un formulario y previene su comportamiento por defecto. Luego, se obtienen los valores de los campos "nombre", "objetivo" y "numero" del formulario usando el método "querySelector". Finalmente, se envía un mensaje a la pestaña activa del navegador usando la API de Chrome con los valores de los campos como datos del mensaje.
*/
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nombre = document.querySelector('#nombre').value; // Obtener el valor del primer campo de consulta
  const objetivo = document.querySelector('#objetivo').value; // Obtener el valor del segundo campo de consulta
 // const numero = document.querySelector('#numero').value; // Obtener el valor del campo numérico deslizante
  const retardo = document.querySelector('#retardo').value; // Obtener el valor del campo numérico deslizante
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    await chrome.tabs.sendMessage(tabs[0].id, {
      tipo: "informacion",
      datos: {
        nombre: nombre,
        objetivo: objetivo,
   //     numero: numero,
        retardo:retardo
      }
    });
  });
});



// listener para escribir la respuesta
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.texto && request.color) { // Verificamos si se recibió el texto y el color en el mensaje
    console.log('Texto recibido desde content_script.js:', request.texto);
    console.log('Color recibido desde content_script.js:', request.color);
    mostrarTexto(request.texto, request.color,false); // Pasamos el texto y el color a la función mostrarTexto
    sendResponse({ confirmacion: 'Texto recibido correctamente' });
  }
});




function mostrarTexto2(texto, color) {
  var chat = document.createElement("div"); // creamos un elemento <div> para el chat
  chat.classList.add("chat"); // agregamos la clase "chat" al elemento <div>
  chat.style.backgroundColor = color; // establecemos el color de fondo del elemento <div> con el valor del parámetro "color"
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  chat.appendChild(contenido); // agregamos el nodo de texto al elemento <div>
  document.getElementById("respuesta").appendChild(chat); // agregamos el elemento <div> al elemento con id "respuesta"
}


function mostrarTexto(texto, color, esUsuario) {
  var chat = document.createElement("div"); // creamos un elemento <div> para el chat
  chat.classList.add("chat"); // agregamos la clase "chat" al elemento <div>
  if (esUsuario) {
    chat.classList.add("sent"); // agregamos la clase "sent" si el mensaje es enviado por el usuario
  } else {
    chat.style.backgroundColor = color; // establecemos el color de fondo del elemento <div> con el valor del parámetro "color"
  }
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  chat.appendChild(contenido); // agregamos el nodo de texto al elemento <div>
  document.getElementById("respuesta").appendChild(chat); // agregamos el elemento <div> al elemento con id "respuesta"
}






/*
function guardarEnPDF() {
  // Obtener el contenido HTML de la página actual del popup
  let contenido = document.documentElement.outerHTML;

  // Crear un objeto de tipo blob con el contenido HTML
  let blob = new Blob([contenido], {type: 'text/html'});

  // Crear un objeto de tipo URL a partir del objeto blob
  let url = URL.createObjectURL(blob);

  // Crear un objeto de tipo ventana con el URL del objeto blob
  let ventana = window.open(url);

  // Esperar un segundo para que la ventana se cargue completamente
  setTimeout(() => {
    // Imprimir la ventana actual a PDF
    ventana.print();

    // Cerrar la ventana actual
    ventana.close();

    // Liberar la memoria utilizada por el objeto URL
    URL.revokeObjectURL(url);
  }, 1000);
}
*/











const btnOpcionesAvanzadas = document.getElementById('btn-opciones-avanzadas');
const camposAvanzados = document.getElementById('campos-avanzados');

btnOpcionesAvanzadas.addEventListener('click', () => {
  camposAvanzados.style.display = camposAvanzados.style.display === 'none' ? 'block' : 'none';
});
