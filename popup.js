console.log("popup.js");
const form = document.querySelector('#formulario');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nombre = document.querySelector('#nombre').value; // Obtener el valor del primer campo de consulta
  const objetivo = document.querySelector('#objetivo').value; // Obtener el valor del segundo campo de consulta
  const miArreglo = [nombre, objetivo];

  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    await chrome.tabs.sendMessage(tabs[0].id, {
      tipo: "informacion",
      datos: { valor: miArreglo }
    });
  });

});


// listener para escribir la respuesta
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.texto && request.color) { // Verificamos si se recibió el texto y el color en el mensaje
    console.log('Texto recibido desde content_script.js:', request.texto);
    console.log('Color recibido desde content_script.js:', request.color);
    mostrarTexto(request.texto, request.color); // Pasamos el texto y el color a la función mostrarTexto
    sendResponse({ confirmacion: 'Texto recibido correctamente' });
  }
});


//listener desde el htlm para detener la ejecucion
document.getElementById('detener').addEventListener('click', function () {

  // En popup.js
  const continuar = false;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { continuar: continuar }, function (response) {
      console.log('Mensaje enviado a content_script.js');
    });
  });

});

function mostrarTexto(texto, color) {
  var chat = document.createElement("div"); // creamos un elemento <div> para el chat
  chat.classList.add("chat"); // agregamos la clase "chat" al elemento <div>
  chat.style.backgroundColor = color; // establecemos el color de fondo del elemento <div> con el valor del parámetro "color"
  var contenido = document.createTextNode(texto); // creamos un nodo de texto con el contenido recibido
  chat.appendChild(contenido); // agregamos el nodo de texto al elemento <div>
  document.getElementById("respuesta").appendChild(chat); // agregamos el elemento <div> al elemento con id "respuesta"
}