class controlador {
    constructor(web) {
      this.inicio = null;
      this.contador = 0;
      this.final = null;
      this.tiempoDeRetardo = 3000;
      this.web = web;
    }
    establecerRetardo(retardo) {
      this.tiempoDeRetardo = retardo;
    }
    getRetardo() {
      return this.tiempoDeRetardo;
    }
    async enviarPrompt(prompt, chat) {
      const mensaje = await prompt.devolverMensaje();
      const respuesta = await this.enviarMensaje(mensaje, chat);
      const objeto = await prompt.interprete.obtenerObjetoDesdeString(respuesta);
      return objeto;
    }
  
    async enviarMensaje(mensaje, chat) {
      interfaz.imprimirPensando();
      let tiempo=1000;
      if (this.inicio == null) {
        this.inicio = new Date();
      } else {
        this.final = new Date();
        tiempo=this.tiempoDeRetardo;
      }
      this.contador++;
  
      await new Promise((resolve) => {
        //  clickButton();
        this.web.seleccionarChat(chat);
        setTimeout(() => {
          resolve();
        }, tiempo);
      });
  
      // código que se ejecutará después de 3 segundos
  
     
      // Obtener el cuadro de texto
  
      this.web.identificarEntradaDeTexto();
      if (this.web.existeElElemento()) {
        // Establecer el valor del cuadro de texto
        this.web.ingresarTexto(mensaje);
  
        this.web.presionarAceptar();
  
  
        // Esperar a que puedoContinuar() devuelva true
        await new Promise((resolve) => {
          const checkContinuar = setInterval(() => {
            if (this.web.puedoContinuar()) {
              clearInterval(checkContinuar);
              resolve();
            }
          }, 100);
        });
        var respuesta;
        const resultado = this.web.obtenerRespuesta();
        if (resultado.error) {
          console.error(resultado.error); // muestra el mensaje de error en la consola
        } else {
          respuesta = resultado.respuesta;
        }
  
  
        //  chrome.runtime.sendMessage({ tipo: "respuesta", datos: { valor: respuesta } });
       
        return respuesta;
      } else {
       
      }
  
    }
    rendimiento() {
      return Math.round((this.contador / this.tiempo()));
    }
    tiempo() {
      return Math.round((this.final - this.inicio) / (1000 * 60));
    }
  }
  

const gpt = new controlador(web);
