class AgenteCreacionDeTareas {
    constructor() {
        this.arregloDePar = [];
    }
    reiniciar(){
        this.arregloDePar = [];
    }
    async crearApartirDelObjetivo(nombre, objetivo) {
            this.reiniciar();
            this.arregloDePar= await this._enviarPromptEmpezar(nombre,objetivo,gpt,promptDeEmpezarObjetivo);
            console.log("objetivo: "+ objetivo);
            console.log("nombre: "  + nombre  );
            this._guardarObjetivo(nombre, objetivo,BdTareaSolucion);      
    }
    _guardarObjetivo(nombre, objetivo,BdTareaSolucion){
        var objsolucion = new TareaSolucion(0, nombre, objetivo);
        BdTareaSolucion.guardarEnMemoria(objsolucion);
    }
    async _enviarPromptEmpezar(nombre,objetivo,gpt,prompt){
        prompt.asignarVariable("nombre",nombre);
        prompt.asignarVariable("objetivo",objetivo);
        let arreglo=gpt.enviarPrompt(prompt,"creacion");       
        return arreglo;
    }

    async _enviarPromptCrearTareas(parTareaSolucion,contexto,gpt,prompt,tareas){
        promptDeCrearTarea.asignarVariable("objetivo",tareas[0]);
        promptDeCrearTarea.asignarVariable("tareas",tareas);
        promptDeCrearTarea.asignarVariable("ultimaTarea",parTareaSolucion.tarea);
        promptDeCrearTarea.asignarVariable("resultado",parTareaSolucion.solucion);


        var arreglo = await gpt.enviarPrompt(prompt,"creacion");
        return arreglo;
    }
    async crearTareasApartirDeSoluciones(parTareaSolucion, contexto) { 
        this.reiniciar();        
        const tareas= BdTareaSolucion.obtenerArrayDeStringTodasLasTareas();
        this.arregloDePar= await this._enviarPromptCrearTareas(parTareaSolucion,contexto,gpt,promptDeCrearTarea,tareas);  
        await BdTareaSolucion.guardarEnMemoria(parTareaSolucion);
        this.arregloDePar; 
    }
    async enviarTareas(colaDeTareas) {
        console.log("\n AgenteCreacionDeTareas  ---->   colaDeTareas | Tipo: " + typeof await this.arregloDePar.map(todo => todo.tarea).join("\n Tarea:") + " Son  " + this.arregloDePar.length + "  \n\n  Tarea: " + (this.arregloDePar).map(todo => todo.tarea).join("\n Tarea: "));
        colaDeTareas.recibirTareas(this.arregloDePar, true);
    }

}














