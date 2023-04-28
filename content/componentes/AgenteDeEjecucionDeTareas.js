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



class AgenteDeEjecucionDeTareas {
    constructor() {
        this.parTareaSolucion = null;
        this.contexto = null;
        this.tareasEjecutadas=0;
    }
    reiniciar(){
        this.parTareaSolucion = null;
        this.contexto = null;
        this.tareasEjecutadas=0;
    }

   async getTareasEjecutadas(){
        return this.tareasEjecutadas;
    }

    async recibirTarea(parTareaAtratar, informacion) {
        try {
            if (!parTareaAtratar || typeof parTareaAtratar.tarea !== "string") {
                throw new Error("tarea no es una cadena");
            }
            this.contexto = await encontrarTitulosSimilares(informacion, parTareaAtratar.tarea);
            let mensaje = " Ejecuta esta tarea \" " + parTareaAtratar.tarea + " \" \n\n aqui tienes información: \n\n \"  " + this.contexto + "  \" \n\n  En caso de no tener información suficiente dime como conseguirla";
            var solucion = await gpt.enviarMensaje(mensaje, "ejecucion");
            
            parTareaAtratar.solucion = await solucion;
            interfaz.imprimirEjecucion(parTareaAtratar);
            this.parTareaSolucion = await parTareaAtratar;
            this.tareasEjecutadas++;
        } catch (error) {
            console.error(error);
        }
    }

   async enviarParTareaSolucion(agenteCreadorDeTareas) {

        console.log("\n AgenteDeEjecucionDeTareas   ---->   agenteCreadorDeTareas | Tipo: " + typeof this.parTareaSolucion + " \n \n" + this.parTareaSolucion.tarea + "\n" + this.parTareaSolucion.solucion);
        await agenteCreadorDeTareas.crearTareasApartirDeSoluciones(this.parTareaSolucion, this.contexto);
         
    }



}
