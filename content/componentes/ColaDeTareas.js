
class ColaDeTareas {
    constructor() {
        this.ordenado = false;
        this.arregloDeTareas = [];
        this.tareasTotales=0;
    }
    reiniciar(){
        this.ordenado = false;
        this.arregloDeTareas = [];
        this.tareasTotales=0;
    }
   async getTareasTotales(){
        return this.tareasTotales;
    }
    async recibirTareas(arregloDePar, ordenado) {
        if (arregloDePar.length > 0){
            console.log("la cantidad de tareas nuevas son " + arregloDePar.length );
            this.ordenado = ordenado;
            //guarda en la cola de tareas
            for (let i = arregloDePar.length -1 ; i >=0 ; i--) {
        
                await BdTarea.guardarTarea(arregloDePar[i]);
                
            }
            let string = await BdTarea.obtenerStringTareas();
            for (let i = 0; i < arregloDePar.length; i++) {
                this.tareasTotales++;
                interfaz.imprimirTarea(this.tareasTotales,arregloDePar[i].tarea);
                
            }
        }else{
            console.log("No hay tareas nuevas");
        }
    }
    estanOrdenadas() {
        return this.ordenado;
    }
    async moverTareaMasPrioritaria(agenteDeEjecucionDeTareas, informacion,maquina) {
        this.arregloDeTareas = await BdTarea.obtenerTodasLasTareas();
        console.log("La cantidad de todas las tareas que estan en la base de datos son  " +  this.arregloDeTareas.length );
        if (this.arregloDeTareas.length > 0){
        let parTareaAtratar = await BdTarea.borrarTareaEnTope();
        console.log("\n ColaDeTareas  ----> agenteDeEjecucionDeTareas | Tipo: " + typeof parTareaAtratar.tarea + " \n\n" + parTareaAtratar.tarea);
        await agenteDeEjecucionDeTareas.recibirTarea(parTareaAtratar, informacion);
     }else{
        interfaz.imprimirNoHayTareas();
        this.maquina.pausa();
    }
    }
    async enviarTareas(agenteDePriorizacionTareas,maquina) {
        this.arregloDeTareas = await BdTarea.obtenerTodasLasTareas();
        if (this.arregloDeTareas.length > 0){
        console.log("\n ColaDeTareas  ---->  agenteDePriorizacionTareas | Tipo: " + typeof this.arregloDeTareas.map(todo => todo.tarea).join(", ") + "\n \n  Tarea: " + (this.arregloDeTareas).map(todo => todo.tarea).join("\n Tarea: "));
        agenteDePriorizacionTareas.recibirTareas(this.arregloDeTareas);
    }else{
        interfaz.imprimirNoHayTareas();
        this.maquina.pausa();
    }
}
}