//funciones de apoyo
function enviarTexto(texto, color) {

    if (chrome.runtime && chrome.runtime.sendMessage) {
        var mensaje = {
            texto: texto,
            color: color // Agregamos el color al objeto de mensaje
        };
        chrome.runtime.sendMessage(mensaje, function (response) {

        });
    }
}
function encontrarTitulosSimilares(soluciones, tarea) {
    // Creamos un objeto para almacenar los puntajes de similitud de cada título
    const similitud = {};

    // Recorremos todos los títulos en el índice
    soluciones.forEach(function (titulo) {
        // Calculamos el puntaje de similitud entre el título y la tarea
        const puntaje = calcularPuntajeSimilitud(titulo, tarea);

        // Almacenamos el puntaje de similitud en el objeto
        similitud[titulo] = puntaje;
    });

    // Ordenamos los títulos según su puntaje de similitud en orden descendente
    const titulosOrdenados = Object.keys(similitud).sort(function (a, b) {
        return similitud[b] - similitud[a];
    });

    // Devolvemos los 3 títulos con el puntaje de similitud más alto
    return titulosOrdenados.slice(0, 3);
}
function calcularPuntajeSimilitud(cadena1, cadena2) {
    // Convertimos ambas cadenas a minúsculas y eliminamos los caracteres no alfabéticos
    const str1 = cadena1.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    const str2 = cadena2.toLowerCase().replace(/[^a-zA-Z]+/g, '');

    // Calculamos el puntaje de similitud
    const puntaje = new Set(str1.split('')).size + new Set(str2.split('')).size - new Set([...str1, ...str2]).size;

    return puntaje;
}





class AgenteCreacionDeTareas {
    constructor() {
        this.arregloDePar = [];

    }



    async crearApartirDelObjetivo(nombre, objetivo) {
        
            let mensaje = "Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo   tu eres " + nombre + " y el objetivo es " + objetivo + ".   cada tarea no debe de superar los 280 caracteres   La primera tarea debe de ser la tarea inicial.   La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo   se conciso, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp";
            var respuesta = await gpt.enviarMensaje(mensaje, "creacion");
            // Procesar tareas para convertila en un array de tareas
            const arrayTareas = respuesta.split("\n");
            const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
            const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));
            this.arregloDePar = [];
            for (let i = 0; i < tareasArreglo.length; i++) {
                //     console.log("tarea ----------->" + tareasArreglo[i]);
                this.arregloDePar[i] = new TareaSolucion(0, tareasArreglo[i], "");
            }
            console.log("objetivo: " + objetivo);
            console.log("nombre: " + nombre);
            //baseDeDatos1.guardarEnMemoria(0, nombre, objetivo);
            var objsolucion = new TareaSolucion(0, nombre, objetivo);
            BdTareaSolucion.guardarEnMemoria(objsolucion);
            //return tareasArreglo;
        
    }

    async enviarTareas(colaDeTareas) {



        //    console.log("AgenteCreacionDeTareas enviara : " + (await this.arregloDePar).map(todo => todo.tarea).join(", "));

        console.log("\n AgenteCreacionDeTareas  ---->   colaDeTareas | Tipo: " + typeof this.arregloDePar.map(todo => todo.tarea).join("\n Tarea:") + "  \n\n  Tarea: " + (this.arregloDePar).map(todo => todo.tarea).join("\n Tarea: "));
        colaDeTareas.recibirTareas(this.arregloDePar, true);
        //   pilaDeTareas(this.arregloDePar,true);

    }


    async CrearTareasApartirDeSoluciones(parTareaSolucion, contexto) {
        let tareasArreglo = [];
        if (parTareaSolucion.profundidad + 1 <= ProfundidadConfigurada) {

            enviarTexto("La profundidad de esta tarea es " + parTareaSolucion.profundidad + " que es menor o igual a " + ProfundidadConfigurada, "red");
            let mensaje = "Conociendo esta tarea \n \n " + parTareaSolucion.tarea + "\n información:  \n" + contexto + "  \n su ejecución \n " + parTareaSolucion.solucion + " \n en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo  La tarea debe ser concisa y específicas para cumplir la tarea  La tarea no debe de superar los 280 caracteres   se conciso  \n La respuesta tiene que tener este formato  Tarea: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  ";
            var respuesta = await gpt.enviarMensaje(mensaje, "creacion");


            let nuevaTarea = respuesta.replace("Tarea: ", "");
            let nuevoParTareaSolucion = new TareaSolucion(parTareaSolucion.profundidad + 1, nuevaTarea, "");
            this.arregloPar = [nuevoParTareaSolucion];
        } else {
            enviarTexto("La profundidad de esta tarea es " + parTareaSolucion.profundidad + "que es mayor a " + ProfundidadConfigurada, "red");
        }
        //baseDeDatos1.guardarEnMemoria(profundidad, tarea, solucion);
        BdTareaSolucion.guardarEnMemoria(parTareaSolucion);

        //return tareasArreglo;

    }
}
var agenteCreadorDeTareas = new AgenteCreacionDeTareas();


class ColaDeTareas {
    constructor() {
        this.ordenado = false;
        this.arregloDeTareas = [];
    }
    async recibirTareas(arregloDePar, ordenado) {
        this.ordenado = ordenado;
        this.arregloDeTareas = arregloDePar;
        //    console.log("Entrando a la pila de tareas");
        //guarda en la cola de tareas
        let tareaActual;
        for (let i = 0; i < this.arregloDeTareas.length; i++) {
            //      console.log("tarea ----------->" + this.arregloDeTareas[i].tarea);
            await BdTarea.guardarTarea(this.arregloDeTareas[i]);
        }

        let string = await BdTarea.obtenerStringTareas();

        //      console.log('Tareas de la pila de tareas de la base de datos:',  string);

        for (let i = 0; i < this.arregloDeTareas.length; i++) {
            enviarTexto("Tarea agregada: " + this.arregloDeTareas[i].tarea, "green");
        }

    }

    estanOrdenadas() {
        return this.ordenado;
    }

    async moverTareaMasPrioritaria(agenteDeEjecucionDeTareas, informacion) {
        let parTareaAtratar = await BdTarea.borrarTareaEnTope();


        console.log("\n ColaDeTareas  ----> agenteDeEjecucionDeTareas | Tipo: " + typeof parTareaAtratar.tarea + " \n\n" + parTareaAtratar.tarea);

        await agenteDeEjecucionDeTareas.recibirTarea(parTareaAtratar, informacion);
    }
    enviarTareas(agenteDePriorizacionTareas) {

        console.log("\n ColaDeTareas  ---->  agenteDePriorizacionTareas | Tipo: " + typeof this.arregloDeTareas.map(todo => todo.tarea).join(", ") + "\n \n  Tarea: " + (this.arregloDeTareas).map(todo => todo.tarea).join("\n Tarea: "));
        agenteDePriorizacionTareas.recibirTareas(this.arregloDeTareas);
    }
}
var colaDeTareas = new ColaDeTareas();


class AgenteDeEjecucionDeTareas {
    constructor() {
        this.parTareaSolucion = null;
        this.contexto = null;
    }


    async recibirTarea(parTareaAtratar, informacion) {
        //    console.log("entrando al agente de ejecucion de tareas");
        try {
            //  console.log("tipo de dato : " + typeof  parTareaAtratar);
            if (!parTareaAtratar || typeof parTareaAtratar.tarea !== "string") {
                throw new Error("tarea no es una cadena");
            }
            this.contexto = await encontrarTitulosSimilares(informacion, parTareaAtratar.tarea);
            let mensaje = "  " + parTareaAtratar.tarea + " ejecuta la tarea , en caso de no tener información suficiente dime como conseguirla  información:   " + this.contexto + "";
            var solucion = await gpt.enviarMensaje(mensaje, "ejecucion");
            enviarTexto("Ejecutando tarea: " + parTareaAtratar.tarea + " --> " + solucion, "orange");
            parTareaAtratar.solucion = solucion;
            this.parTareaSolucion = parTareaAtratar;
        } catch (error) {
            console.error(error);
        }
    }

    enviarParTareaSolucion(agenteCreadorDeTareas) {

        console.log("\n AgenteDeEjecucionDeTareas   ---->   agenteCreadorDeTareas | Tipo: " + typeof this.parTareaSolucion + " \n \n" + this.parTareaSolucion.tarea + "\n" + this.parTareaSolucion.solucion);
        agenteCreadorDeTareas.CrearTareasApartirDeSoluciones(this.parTareaSolucion, this.contexto);
    }



}
agenteDeEjecucionDeTareas = new AgenteDeEjecucionDeTareas();







class AgentePriorizacionDeTareas {
    constructor() {
        this.arregloDeTareasOrdenada = [];
    }
    async recibirTareas(arregloDeTareas) {

        const solucionesArray = arregloDeTareas.map(todo => todo.tarea);

        let cadena = solucionesArray.join(", ");

        let mensaje = await "prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra, \n La respuesta tiene que tener este formato  Tarea1: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea2: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  Tarea3: pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp  " + cadena;

        var respuesta = await gpt.enviarMensaje(mensaje, "prioridad");
        // Procesar tareas para convertila en un array de tareas
        const arrayTareas = respuesta.split("\n");
        const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
        const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));


        for (let i = 0; i < tareasArreglo.length; i++) {
            //  console.log("tarea ----------->" + tareasArreglo[i]);
            this.arregloDeTareasOrdenada[i] = new TareaSolucion(0, tareasArreglo[i], "");
        }

        BdTarea.borrarBaseDeDatosDeTareas();


    }
    enviarTareasOrdenadas(pilaDeTareas) {

        console.log("\n AgentePriorizacionDeTareas  ---->  colaDeTareas | tipo:" + typeof this.arregloDeTareasOrdenada.map(todo => todo.tarea).join(", ") + " \n\n Tarea: " + (this.arregloDeTareasOrdenada).map(todo => todo.tarea).join("\n Tarea: "));
        console.log("\n AgentePriorizacionDeTareas  ---->  colaDeTareas | tipo:" + typeof this.arregloDeTareasOrdenada.map(todo => todo.tarea));
        console.log("\n AgentePriorizacionDeTareas  ---->  colaDeTareas | tipo:" + typeof this.arregloDeTareasOrdenada.map(todo => todo.tarea) + " \n\n Tarea: " + this.arregloDeTareasOrdenada[0].tarea);
        colaDeTareas.recibirTareas(this.arregloDeTareasOrdenada, true);
    }


}
agenteDePriorizacionTareas = new AgentePriorizacionDeTareas();


