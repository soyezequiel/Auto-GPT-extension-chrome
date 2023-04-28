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




function descargarArchivo() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    await chrome.tabs.sendMessage(tabs[0].id, {
      tipo: "txt",
      datos: {
        nombre: ""
      }
    });
  });
}




// Obtener el botón por su ID
const btn = document.getElementById('txt');
// Agregar un Event Listener para el evento 'click'
btn.addEventListener('click', () => {
  // Aquí puedes agregar el código que deseas ejecutar cuando se hace clic en el botón
  descargarArchivo();
});

// Este código agrega un listener al evento "submit" de un formulario y previene su comportamiento por defecto. Luego, se obtienen los valores de los campos "nombre", "objetivo" y "numero" del formulario usando el método "querySelector". Finalmente, se envía un mensaje a la pestaña activa del navegador usando la API de Chrome con los valores de los campos como datos del mensaje.
const form = document.querySelector('#formulario');
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
        retardo: retardo
      }
    });
  });
});

// listener para escribir la respuesta
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.texto && request.color) { // Verificamos si se recibió el texto y el color en el mensaje
      console.log('Texto recibido desde content_script.js:', request.texto);
      console.log('Color recibido desde content_script.js:', request.color);
      mostrarTexto(request.texto, request.color, false); // Pasamos el texto y el color a la función mostrarTexto     
      sendResponse({ confirmacion: 'Texto recibido correctamente' });

    }
});

const btnOpcionesAvanzadas = document.getElementById('btn-opciones-avanzadas');
const camposAvanzados = document.getElementById('campos-avanzados');

btnOpcionesAvanzadas.addEventListener('click', () => {
  camposAvanzados.style.display = camposAvanzados.style.display === 'none' ? 'block' : 'none';
});
