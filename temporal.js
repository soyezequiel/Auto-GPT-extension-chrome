










/*



  // Método para agregar un registro
  async agregar(storeName, registro) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(registro);
    await this._promisifyRequest(request);
  }

  // Método para obtener un registro
  async obtener(storeName, id) {
    const transaction = this.db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    const result = await this._promisifyRequest(request);
    return result;
  }

  // Método para actualizar un registro
  async actualizar(storeName, id, cambios) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const registro = await this.obtener(storeName, id);
    Object.assign(registro, cambios);
    const request = store.put(registro);
    await this._promisifyRequest(request);
  }

  // Método para eliminar un registro
  async eliminar(storeName, id) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    await this._promisifyRequest(request);
  }

  // Método para obtener todos los registros de un store
  async obtenerTodos(storeName) {
    const transaction = this.db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    const result = await this._promisifyRequest(request);
    return result;
  }

  // Método para convertir una solicitud de IndexedDB en una promesa
  _promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  // Método para limpiar todos los registros de un store
  async limpiar(storeName) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    await this._promisifyRequest(request);
  }
  // Método para agregar un registro al final de la pila
  async apilar(storeName, registro) {
    const ultimoRegistro = await this.obtenerUltimo(storeName);
    if (ultimoRegistro) {
      registro.id = ultimoRegistro.id + 1;
    } else {
      registro.id = 1;
    }
    await this.agregar(storeName, registro);
  }

  // Método para obtener el último registro de la pila
  async obtenerUltimo(storeName) {
    const registros = await this.obtenerTodos(storeName);
    return registros.length > 0 ? registros[registros.length - 1] : null;
  }

  // Método para obtener y eliminar el último registro de la pila
  async desapilar(storeName) {
    const ultimoRegistro = await this.obtenerUltimo(storeName);
    if (ultimoRegistro) {
      await this.eliminar(storeName, ultimoRegistro.id);
    }
    return ultimoRegistro;
  }

}


//const db1 = new IndexedDB("fesfvgdghdr", 1, ["store1"],db,store);

*/


































/*


const nombreDeBaseDeDatos = "mi-base-de-datos";
const versionDeLaBaseDeDatos = 1;
const store1 = "memoria";
const store2 = "pila";
const misAlmacenesDeDatos = [store1, store2];




const miBD = new IndexedDB(nombreDeBaseDeDatos, versionDeLaBaseDeDatos, misAlmacenesDeDatos,db,store);


//memoria
class Memoria {
  constructor(store) {
    this.store = store;
  }
  async obtenerTodasLasSoluciones() {
    const objetoTarea = await miBD.obtenerTodos(this.store);
    return objetoTarea.map(objetoTarea => objetoTarea.solucion);
  }


  GuardarEnMemoria(profundidad, tarea, solucion) {
    let objetoTarea = {
      profundidad: profundidad,
      tarea: tarea,
      solucion: solucion
    };
    miBD.apilar(this.store, objetoTarea);
  }
  limpiarBaseDeDatos() {
    miBD.limpiar(this.store);
  }
}

//pila

class Pila {
  constructor(store) {
    this.store = store;
  }
  limpiarBaseDeDatos() {
    miBD.limpiar(this.store);
  }

  guardarTarea(profundidad, tarea) {
    let objetoTarea = {
      profundidad: profundidad,
      tarea: tarea,
      solucion: ""
    };
    miBD.apilar(this.store, objetoTarea);
  }
  async obtenerTodasLasTareas() {
    const objetoTarea = await miBD.obtenerTodos(this.store);
    return objetoTarea.map(objetoTarea => objetoTarea.tarea);
  }

  borrarTareaEnTope() {
    return miBD.desapilar(this.store);
  }

}
const baseDeDatos1 = new Memoria(store1);
const baseDeDatos2 = new Pila(store2);




function testPila() {
  // Crear una pila y guardar algunas tareas
  const pila = new Pila('miTienda');
  pila.guardarTarea(1, 'Tarea 1');
  pila.guardarTarea(2, 'Tarea 2');
  pila.guardarTarea(3, 'Tarea 3');

  // Verificar que se puedan obtener todas las tareas
  const todasLasTareas = pila.obtenerTodasLasTareas();
  console.log('Todas las tareas:', todasLasTareas);
  if (todasLasTareas.length !== 3 || todasLasTareas[0] !== 'Tarea 1' || todasLasTareas[1] !== 'Tarea 2' || todasLasTareas[2] !== 'Tarea 3') {
    console.error('Error en obtenerTodasLasTareas');
  }

  // Verificar que se pueda borrar una tarea en el tope
  const tareaBorrada = pila.borrarTareaEnTope();
  console.log('Tarea borrada:', tareaBorrada);
  if (tareaBorrada.tarea !== 'Tarea 3') {
    console.error('Error en borrarTareaEnTope');
  }

  // Verificar que la base de datos se pueda limpiar
  pila.limpiarBaseDeDatos();
  const todasLasTareasDespuesDeLimpiar = pila.obtenerTodasLasTareas();
  console.log('Todas las tareas después de limpiar:', todasLasTareasDespuesDeLimpiar);
  if (todasLasTareasDespuesDeLimpiar.length !== 0) {
    console.error('Error en limpiarBaseDeDatos');
  }
}

// Ejecutar el test
testPila();


*/












//Esto funciona

class GestionBaseDeDatos {

  //funciones que interactuan con la base de datos de forma directa
  abrirBaseDeDatos(nombre, esquema) {
    const request = indexedDB.open(nombre);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      esquema(db);
    }
    request.onerror = function (event) {
      const errorMessage = "Error al abrir la base de datos: " + event.target.error.message;
      console.error(errorMessage);
      alert(errorMessage);
    };
    return request;
  }
  leerDatos(baseDeDatos, nombreObjectStore, callback) {
    const transaction = baseDeDatos.transaction([nombreObjectStore], 'readonly');
    const objectStore = transaction.objectStore(nombreObjectStore);
    const cursor = objectStore.openCursor();
    const datos = [];
    cursor.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        datos.push(cursor.value);
        cursor.continue();
      } else {
        callback(datos);
      }
    };
  }
  guardarDatos(baseDeDatos, nombreObjectStore, datos) {
    const transaction = baseDeDatos.transaction([nombreObjectStore], 'readwrite');
    const objectStore = transaction.objectStore(nombreObjectStore);
    objectStore.add(datos);
    transaction.oncomplete = function () {
      console.log('Datos guardados con éxito');
    };
    transaction.onerror = function () {
      console.log('Error al guardar los datos');
    };
  }
}
const gestor = new GestionBaseDeDatos();
class BaseDeDatosTareaSolucion {

  constructor(nombre, esquema) {
    // Abrir la base de datos de profundidad,tarea,solucion
    this.db1 = gestor.abrirBaseDeDatos(nombre, esquema);
  }

  obtenerTareasSolucion(callback) {
    gestor.leerDatos(this.db1.result, 'tareas', callback);
  }
  async obtenerTodasLasSoluciones() {
    try {
      const soluciones = await this.obtenersoluciones();
      const solucionesStrings = soluciones.map(solucion => solucion.toString());
      return solucionesStrings;
    } catch (error) {
      console.error('Error al obtener las soluciones: ', error);
    }
  }

  obtenersoluciones() {
    return new Promise((resolve, reject) => {
      const request = gestor.abrirBaseDeDatos('miBaseDeDatos', function (db) { });
      request.onsuccess = function (event) {
        gestor.leerDatos(event.target.result, 'tareas', function (tareas) {
          const soluciones = tareas.map(function (tarea) {
            return tarea.soluciones;
          });
          resolve(soluciones);
        });
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }
  guardarSolucion(profundidad, tarea, soluciones) {
    gestor.guardarDatos(this.db1.result, 'tareas', { profundidad: profundidad, tarea: tarea, soluciones: soluciones });
  }
  borrarBaseDeDatosDeSoluciones() {
    const request = indexedDB.open('miBaseDeDatos');
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tareas'], 'readwrite');
      const objectStore = transaction.objectStore('tareas');
      const requestDelete = objectStore.clear();
      requestDelete.onsuccess = function () {
        console.log('Base de datos borrada con éxito');
      };
      requestDelete.onerror = function (event) {
        console.error('Error al borrar la base de datos', event.target.error);
      };
    };

    request.onupgradeneeded = function (event) {
      // Aquí se puede actualizar el esquema de la base de datos si se requiere
    };

    request.onerror = function (event) {
      console.error('Error al abrir la base de datos', event.target.error);
    };
  }
  guardarEnMemoria(profundidad, objetivo, nombre) {
    //guarda en memoria
    this.guardarSolucion(profundidad, objetivo, nombre);

    //imprimir tareas soluciones
    this.obtenerTareasSolucion(function (tareas) {
      console.log("imprimiendo las tareas que estan en la base de datos:");
      console.log(JSON.stringify(tareas));
    });
  }

}
const BdTareaSolucion = new BaseDeDatosTareaSolucion('miBaseDeDatos', function (db) {
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('profundidad', 'profundidad', { unique: false });
  objectStore.createIndex('soluciones', 'soluciones', { unique: false });
});
class BaseDeDatosTarea {
  constructor(nombre, esquema) {
    this.db2 = gestor.abrirBaseDeDatos(nombre, esquema);
  }
  guardarTarea(profundidad, tarea) {
    gestor.guardarDatos(this.db2.result, 'tareas', { profundidad: profundidad, tarea: tarea });
  }

  borrarBaseDeDatosDeTareas() {
    const request = indexedDB.open('miBaseDeDatosSoloTareas');
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tareas'], 'readwrite');
      const objectStore = transaction.objectStore('tareas');
      const requestDelete = objectStore.clear();
      requestDelete.onsuccess = function () {
        console.log('Base de datos de solo tarea borrada con éxito');
      };
      requestDelete.onerror = function (event) {
        console.error('Error al borrar la base de datos de solo tarea', event.target.error);
      };
    };

    request.onupgradeneeded = function (event) {
      // Aquí se puede actualizar el esquema de la base de datos si se requiere
    };

    request.onerror = function (event) {
      console.error('Error al abrir la base de datos', event.target.error);
    };
  }

  obtenerTodasLasTareas() {
    return new Promise(function (resolve, reject) {
      var transaccion = this.db2.result.transaction(['tareas'], 'readonly');
      var store = transaccion.objectStore('tareas');
      var cursor = store.openCursor();
      var tareas = [];

      cursor.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          tareas.push(cursor.value.descripcion);
          cursor.continue();
        } else {
          resolve(tareas);
        }
      };

      cursor.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }
  obtenerTareas() {
    const instancia = this;
    return new Promise(function (resolve, reject) {
      gestor.leerDatos(instancia.db2.result, 'tareas', function (tareas) {
        resolve(tareas);
      });
    });
  }
  borrarTareaEnTope() {
    const instancia = this;
    return new Promise(function (resolve, reject) {
      instancia.obtenerTareas().then(function (tareas) {
        if (tareas.length > 0) {
          // obtener tarea en tope
          const tareaEnTope = tareas[0];
          // eliminar tarea en tope de la base de datos
          instancia.eliminarDatos(instancia.db2.result, 'tareas', tareaEnTope.id, function () {
            console.log('Tarea en tope eliminada con éxito');
            resolve(tareaEnTope);
          });
        } else {
          console.log('No hay tareas en la pila');
          reject('No hay tareas en la pila');
        }
      }).catch(function (error) {
        console.error('Error al obtener las tareas: ', error);
        reject(error);
      });
    });
  }

  eliminarDatos(db, storeName, id, callback) {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = function (event) {
      console.error('Error al eliminar los datos: ', event.target.error);
    };

    request.onsuccess = function (event) {
      callback();
    };
  }

}
// Abrir la base de datos de profundidad,tarea
const BdTarea = new BaseDeDatosTarea('miBaseDeDatosSoloTareas', function (db) {
  const objectStore = db.createObjectStore('tareas', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('profundidad', 'profundidad', { unique: false });
});
