class PaginaWeb {
    identificarEntradaDeTexto() {
      this.textarea = document.querySelector('textarea[placeholder="Send a message."]');
    }
    ingresarTexto(mensaje) {
      this.textarea.value = mensaje;
    }
    presionarAceptar() {
      // Crear un evento keydown para simular presionar la tecla Enter
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
      });
      // Desencadenar el evento keydown
      this.textarea.dispatchEvent(event);
    }
    obtenerRespuesta() {
      const elementos = document.querySelectorAll('.prose');
  
      if (!elementos.length) {
        return { error: 'No se encontraron elementos con la clase "prose" ' };
      } else {
  
        const ultimoElemento = elementos[elementos.length - 1];
        return { respuesta: ultimoElemento.textContent.trim() };
      }
  
  
    }
    seleccionarChat(nombre) {
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
    puedoContinuar() {
      if (document.querySelector('.text-2xl span:first-child') !== null) {
        console.log("espera"); // El elemento existe
        return false;
      } else {
        return true;
      }
    }
    existeElElemento() {
      return (this.textarea !== null);
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
  
  var web = new PaginaWeb();