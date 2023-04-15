/*

console.log("popup.js");

const boton = document.querySelector("#trabajar");

boton.addEventListener("click", function() {
  const nombre = document.querySelector("#nombre").value;
  const objetivo = document.querySelector("#objetivo").value;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { 
      tipo: "informacion",
      datos: { nombre: nombre, objetivo: objetivo }
    });
  });
});
*/