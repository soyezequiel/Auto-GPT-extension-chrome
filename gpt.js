class ChatGPT {
  constructor(){
    this.inicio=null;
    this.contador=0;
    this.final=null;
  }

    async enviarMensaje(mensaje, chat) {
      if(this.inicio == null){
        this.inicio=new Date();
      }else{
        this.final=new Date();
      }
      this.contador++;

      await new Promise((resolve) => {
        //  clickButton();
        this.#seleccionarChat(chat);
        setTimeout(() => {
          resolve();
        }, 3000);
      });
  
      // código que se ejecutará después de 3 segundos
  
      // console.log("mensaje " + mensaje);
      // Obtener el cuadro de texto
  
      const textarea = document.querySelector('textarea[placeholder="Send a message."]');
      if (textarea !== null) {
        // Establecer el valor del cuadro de texto
        textarea.value = mensaje;
  
        // Crear un evento keydown para simular presionar la tecla Enter
        const event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });
  
        // Desencadenar el evento keydown
        textarea.dispatchEvent(event);
  
  
        // Esperar a que puedoContinuar() devuelva true
        await new Promise((resolve) => {
          const checkContinuar = setInterval(() => {
            if (this.#puedoContinuar()) {
              clearInterval(checkContinuar);
              resolve();
            }
          }, 100);
        });
  
        const elementos = document.querySelectorAll('.prose');
        const ultimoElemento = elementos[elementos.length - 1];
        const texto = ultimoElemento.textContent.trim();
        //console.log(texto);
        // Enviar mensaje a popup.js
        var respuesta = texto;
        chrome.runtime.sendMessage({ tipo: "respuesta", datos: { valor: respuesta } });
        // console.log("respuesta:  " + respuesta );
        return texto;
      } else {
        console.log('El cuadro de texto no existe en la página.');
      }
      
    }
    #puedoContinuar() {
      if (document.querySelector('.text-2xl span:first-child') !== null) {
        console.log("espera"); // El elemento existe
        return false;
      } else {
        //console.log("puedoContinuar dice " +  true); // El elemento no existe
        return true;
      }
    }
    #seleccionarChat(nombre) {
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
     detectIcon() {
      const icon = document.querySelector('.absolute.w-4.h-4.rounded-full.text-[10px].flex.justify-center.items-center.right-0.top-[20px].-mr-2.border.border-white.bg-red-500.text-white');
      if (icon) {
        return true;
      } else {
        return false;
      }
    }
    rendimiento(){
      
      return Math.round((this.contador/this.tiempo()));
    }
    tiempo(){
      return Math.round((this.final - this.inicio)/(1000*60));
    }
  
  
  
    /*
  #clickButton() {
    const button = document.querySelector('a.flex');
    button.click();
  
  } */
    /*
    #obtenerNombre() {
      const pageTitle = document.title;
      return pageTitle;
    } */
  
  }

  const gpt = new ChatGPT();