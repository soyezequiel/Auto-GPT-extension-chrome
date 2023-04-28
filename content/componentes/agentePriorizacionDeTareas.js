
class AgentePriorizacionDeTareas {
    constructor() {
        this.arregloDeTareasOrdenada = [];
    }
    async recibirTareas(arregloDeTareas) {

        const solucionesArray = arregloDeTareas.map(todo => todo.tarea);

        let cadena = solucionesArray.join(", ");

        let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  " + cadena;

        var respuesta = await gpt.enviarMensaje(mensaje, "prioridad");
        
        interfaz.imprimirPriorizando();
        // Procesar tareas para convertila en un array de tareas
        const arrayTareas = respuesta.split("\n");
        const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
        const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));


        for (let i = 0; i < tareasArreglo.length; i++) {
            this.arregloDeTareasOrdenada[i] = new TareaSolucion(0, tareasArreglo[i], "");
        }

        BdTarea.borrarBaseDeDatosDeTareas();


    }
    enviarTareasOrdenadas(pilaDeTareas) {

        console.log("\n AgentePriorizacionDeTareas  ---->  colaDeTareas | tipo:" + typeof this.arregloDeTareasOrdenada.map(todo => todo.tarea).join(", ") + " \n\n Tarea: " + (this.arregloDeTareasOrdenada).map(todo => todo.tarea).join("\n Tarea: "));
        colaDeTareas.recibirTareas(this.arregloDeTareasOrdenada, true);
    }


}
agenteDePriorizacionTareas = new AgentePriorizacionDeTareas();


