class Maquina{
    constructor(){   
      this.agenteCreadorDeTareas=new AgenteCreacionDeTareas(); 
      this.colaDeTareas= new ColaDeTareas();
      this.agenteDeEjecucionDeTareas= new AgenteDeEjecucionDeTareas();
      //  this.memoria =
      this.continuar=false;
      
    }
  
    async empezar(nombre, objetivo){
      this.reiniciar();
      await this.agenteCreadorDeTareas.crearApartirDelObjetivo(nombre, objetivo);
      this.continuar=true;
      await this.recursivo();
    }
    pausa(){
    this.continuar=false;
    }
    getContinua(){
      return this.continuar;
    }
    continua(){
      this.continuar=true;
      this.recursivo();
    }
  
    async recursivo(){
        
     
        await this.agenteCreadorDeTareas.enviarTareas(this.colaDeTareas,this);
      //  await colaDeTareas.enviarTareas(agenteDePriorizacionTareas);
      //  await agenteDePriorizacionTareas.enviarTareasOrdenadas(colaDeTareas);     
      let  todasLasSoluciones = await BdTareaSolucion.obtenerarrayDeStringTodasLasSoluciones();
      console.log(todasLasSoluciones);
      if (this.continuar) {
        await this.colaDeTareas.moverTareaMasPrioritaria(this.agenteDeEjecucionDeTareas, todasLasSoluciones,this);
        if (this.continuar) {        await this.agenteDeEjecucionDeTareas.enviarParTareaSolucion(this.agenteCreadorDeTareas); } 
        await this.recursivo();
    
      }
    }
    reiniciar(){
    this.agenteCreadorDeTareas.reiniciar();
    this.colaDeTareas.reiniciar();
    this.agenteDeEjecucionDeTareas.reiniciar();
    }


    getTareasTotales(){
        return this.colaDeTareas.getTareasTotales();
    }
    getTareasEjecutadas(){
        return this.agenteDeEjecucionDeTareas.getTareasEjecutadas();
    }



  
  }
  
  
var maquina=new Maquina();


