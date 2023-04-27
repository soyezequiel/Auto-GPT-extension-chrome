class MemoryDatabase {
    constructor() {
        this.data = {};
        this.lastId = 0;
    }

    add(obj) {
        const id = ++this.lastId;
        this.data[id] = obj;
        return id;
    }
    pop() {
        const allValues = Object.values(this.data);
        const lastValue = allValues.pop();
        const lastId = Object.keys(this.data).pop();
        delete this.data[lastId];
        this.lastId = lastId - 1;
        return lastValue;
    }
    push(obj) {
        return this.add(obj);
    }

    getAll() {

        return Object.values(this.data);
    }

    delete(id) {
        if (this.data.hasOwnProperty(id)) {
            delete this.data[id];
            return true;
        }
        return false;
    }

    clear() {
        this.data = {};
        this.lastId = 0;
    }
}
class BaseDeDatosTarea {
    constructor(nombre, esquema) {
        this.db = new MemoryDatabase();
    }
    guardarTarea(tarea) {
        this.db.push(tarea);
    }

    borrarBaseDeDatosDeTareas() {
        this.db.clear();
    }
    obtenerTodasLasTareas(){
       return this.db.getAll();
    }

    obtenerArrayDeStringTodasLasTareas() {
        let todos = this.db.getAll();
        const solucionesArray = todos.map(todo => todo.tarea);
        return solucionesArray;

    }
    obtenerStringTareas() {
        return this.obtenerArrayDeStringTodasLasTareas().join(', ');
    }
    borrarTareaEnTope() {
        return this.db.pop();
    }

}
class BaseDeDatosTareaSolucion {
    constructor() {
        this.db = new MemoryDatabase();
    }
    obtenerArrayDeStringTodasLasTareas() {
        let todos = this.db.getAll();
        const solucionesArray = todos.map(todo => todo.tarea);
        return solucionesArray;

    }
    guardarSolucion(tarea) {
        this.db.push(tarea);
    }
    borrarBaseDeDatosDeSoluciones() {
        this.db.clear();
    }
    async obtenerarrayDeStringTodasLasSoluciones() {
        let todos = await this.db.getAll();
        const solucionesArray = todos.map(todo => todo.solucion);

        return solucionesArray;
    }

    async guardarEnMemoria(parTareaSolucion) {
        //guarda en memoria
        this.guardarSolucion(parTareaSolucion);

        //imprimir tareas soluciones
        let soluciones = this.obtenerarrayDeStringTodasLasSoluciones();
        //     console.log("imprimiendo las tareas que estan en la base de datos: " + await soluciones);

    }
}

class TareaSolucion {
    constructor(profundidad, tarea, solucion) {
        this.profundidad = profundidad;
        this.tarea = tarea;
        this.solucion = solucion;
    }
}

const BdTarea = new BaseDeDatosTarea();
const BdTareaSolucion = new BaseDeDatosTareaSolucion();