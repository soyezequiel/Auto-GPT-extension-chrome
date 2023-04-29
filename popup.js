const form = document.querySelector('#formulario');
var continuar=true;
const respuesta = document.querySelector('#respuesta');
function mostrarTexto(texto, color, esUsuario) {
  // Mostrar el respuesta
  if (continuar){
    respuesta.classList.remove('oculto');

  
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

  // Guardamos el estado del chat en el almacenamiento local
  var chatsGuardados = JSON.parse(localStorage.getItem("chats")) || [];
  chatsGuardados.push(chat.outerHTML);
  localStorage.setItem("chats", JSON.stringify(chatsGuardados));
}
}

// Función para recuperar los chats guardados del almacenamiento local
function recuperarChats() {
  var chatsGuardados = JSON.parse(localStorage.getItem("chats")) || [];
  for (var i = 0; i < chatsGuardados.length; i++) {
    var chat = document.createElement("div");
    chat.innerHTML = chatsGuardados[i];
    document.getElementById("respuesta").appendChild(chat);
  }
}

// Llamamos a la función recuperarChats() cuando se abre el popup
  recuperarChats();

// Agregamos un controlador de eventos para el botón de limpiar
document.getElementById("limpiar").addEventListener("click", function () {
  continuar=false;


 // respuesta.classList.add('oculto');
  // Borramos todos los chats guardados del almacenamiento local
  localStorage.removeItem("chats");
  // Borramos todos los chats del chat en pantalla
  document.getElementById("respuesta").innerHTML = "";
});



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



// Obtener referencia al botón de pausa
const pausaBtn = document.getElementById("pausa-btn");
// Agregar evento click al botón de pausa
pausaBtn.addEventListener("click", function () {
    continuar=false;
    // Mostrar el formulario

  // Obtener la ID de la pestaña activa
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    // Enviar mensaje a content_script.js en la pestaña activa
    chrome.tabs.sendMessage(activeTab.id, { action: "pausa" });
  });
});


// Este código agrega un listener al evento "submit" de un formulario y previene su comportamiento por defecto. Luego, se obtienen los valores de los campos "nombre", "objetivo" y "numero" del formulario usando el método "querySelector". Finalmente, se envía un mensaje a la pestaña activa del navegador usando la API de Chrome con los valores de los campos como datos del mensaje.

form.addEventListener('submit', async (event) => {
  pausaBtn.classList.remove("oculto");
  continuar=true;
  event.preventDefault();
  const nombre = document.querySelector('#nombre').value; // Obtener el valor del primer campo de consulta
  const objetivo = document.querySelector('#objetivo').value; // Obtener el valor del segundo campo de consulta
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



