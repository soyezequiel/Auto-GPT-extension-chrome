class InterfazDeUsuario {
  constructor() {
    this.nombre = null;
    this.objetivo = null;
    this.proceso = [];
    this.tiempoEntreMensaje = 3000;
    this.maquina=null;
  }
  async iniciarProceso(maquina) {
    this.maquina=maquina;
    BdTarea.borrarBaseDeDatosDeTareas();
    BdTareaSolucion.borrarBaseDeDatosDeSoluciones();
    await maquina.empezar(this.nombre, this.objetivo);
  }
  pausa(){
    this.maquina.pausa();

  console.log("boton de pausa precionado continua? " + this.maquina.continuar);
}
  getContinua(){
    this.maquina.getContinua();
  }
  continua(){
    console.log("boton de continuar precionado continua? " + this.maquina.continuar);
    this.maquina.continua();
  }
 async  getProceso(){
    return this.proceso.map(actual => actual.texto);
  }
/*
  imprimirProceso(){
    for (let i= 0 ; i<this.proceso.length ; i++){
      let actual= this.proceso[i];
      
      this._imprimirSinPushProceso(actual.texto, actual.color);
      console.log(i);
    }
    console.log(this.proceso.length +"dawdawdawdwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwawdawddawdawdawdwada");


    
  }
  _imprimirSinPushProceso(texto, color) {   //antes llamado enviarTexto


    // Tu código que produce el error
    if (  chrome.runtime && chrome.runtime.sendMessage) {
      var mensaje = {
        texto: texto,
        color: color // Agregamos el color al objeto de mensaje
      };

      chrome.runtime.sendMessage(mensaje, function (response) { });
    }

  }*/
  _imprimir(texto, color) {   //antes llamado enviarTexto

    this.proceso.push({texto: texto , color: color});

    // Tu código que produce el error
    if (  chrome.runtime && chrome.runtime.sendMessage) {
      var mensaje = {
        texto: texto,
        color: color // Agregamos el color al objeto de mensaje
      };

      chrome.runtime.sendMessage(mensaje, function (response) { });
    }

  }
  imprimirTarea(numeroDeTarea, tarea) {
    this._imprimir("Tarea " + numeroDeTarea + " agregada: " + tarea, "green");
  }
  imprimirInicio(nombre, objetivo) {
    this._imprimir("Nombre: " + nombre + '\n' + "Objetivo: " + objetivo, "blue");
  }
  imprimirEjecucion(parTareaSolucion) {
    this._imprimir("Ejecutando tarea: " + parTareaSolucion.tarea + " --> " + parTareaSolucion.solucion, "orange");
  }
  imprimirPensando() {
    this._imprimir("Pensando", "gray");
  }
  async imprimirEstadisticas(maquina, controlador) {
    this._imprimir("Rendimiento: " + await controlador.rendimiento() + " consultas por minuto a chatGPT ", "white");
    this._imprimir("Cantidad de consultas: " + await controlador.contador + " a chatGPT ", "white");
    this._imprimir("Tiempo de sesión:  " + await controlador.tiempo() + " minutos  ", "white");
    this._imprimir("Tareas creadas:  " + await maquina.getTareasTotales(), "white");
    this._imprimir("Tareas ejecutadas:  " + await maquina.getTareasEjecutadas(), "white");
    console.log( (await this.getProceso()).join(" \n\n"));
   
  }
  imprimirNoHayTareas() {
    console.log("No hay mas tareas, felicitaciones");
    this._imprimir("Se terminaron las tareas", "red");
  }

  imprimirTareaCompletada() {
    this._imprimir("tarea completada ", "blue");
    console.log("Tarea completada");
  }

  imprimirPriorizando() {
    _imprimir("Ordenando", "white");
  }
 async descargarProceso() {

    let texto = (await this.getProceso()).join(" \n\n ");
    // Creamos un objeto de texto con la información que queremos descargar


    // Creamos un objeto de archivo de texto
    var archivo = new Blob([texto], { type: "text/plain" });

    // Creamos un objeto de URL para el archivo
    var urlArchivo = URL.createObjectURL(archivo);

    // Creamos un objeto de enlace de descarga y lo hacemos invisible
    var enlaceDescarga = document.createElement("a");
    enlaceDescarga.style.display = "none";

    // Asignamos la URL del archivo al objeto de enlace de descarga
    enlaceDescarga.href = urlArchivo;

    // Asignamos un nombre de archivo al objeto de enlace de descarga
    enlaceDescarga.download = "archivo.txt";

    // Añadimos el objeto de enlace de descarga al documento
    document.body.appendChild(enlaceDescarga);

    // Hacemos clic en el objeto de enlace de descarga para descargar el archivo
    enlaceDescarga.click();

    // Eliminamos el objeto de enlace de descarga del documento
    document.body.removeChild(enlaceDescarga);
  }
  setNombre(nombre) {
    this.nombre = nombre;
  }
  setObjetivo(objetivo) {
    this.objetivo = objetivo;
  }
  setTiempoEntreMensaje(retardo) {
    gpt.establecerRetardo((retardo * 1000) + Math.floor(Math.random() * 2000));
  }
  getNombre(nombre) {
    return this.nombre;
  }
  getObjetivo(objetivo) {
    return this.objetivo;
  }
  getTiempoEntreMensaje(retardo) {
    gpt.getRetardo();
  }
}

