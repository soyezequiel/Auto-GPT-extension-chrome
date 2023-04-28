class InterpreteJson {
    obtenerObjetoDesdeString(str) {
  
      const strfiltrado = this._obtenerCadenasEntreCorchetes(str);
      if (strfiltrado.length > 0 ) {
        const array = JSON.parse(strfiltrado);
        let tareas = [];
        for (let i = 0; i < array.length; i++) {
          tareas.push(new TareaSolucion(0, array[i], ""));
        }
        return tareas;
      } else {
          return [];
        
        
      }
    }
    
     async _obtenerCadenasEntreCorchetes(str) {
      const regex = /\[(.*?)\]/g;
      const matches = await  str.match(regex);
      if ( await matches == null){
        console.error("no se obtuvo nada que este dentro de unos corchetes");
      }else{
  
        return matches[0];
      }
  
    }
    
  
  
  /*
    _obtenerCadenasEntreCorchetes(texto) {
      const corchetesAbiertos = [];
      const cadenas = [];
      let cadenaActual = "";
      for (let i = 0; i < texto.length; i++) {
        if (texto[i] === "[") {
          corchetesAbiertos.push(i);
        } else if (texto[i] === "]") {
          if (corchetesAbiertos.length > 0) {
            const indiceCorcheteAbierto = corchetesAbiertos.pop();
            cadenaActual = texto.substring(indiceCorcheteAbierto, i + 1);
            cadenas.push(cadenaActual);
          }
        }
      }
  
      if (corchetesAbiertos.length > 0) {
        console.error("Error: Hay corchetes abiertos que no se cerraron.");
      } else if (cadenas.length === 0) {
        console.error("No se encontraron cadenas entre corchetes.");
        return "error";
      } else {
        return cadenas;
      }
    }
  */
  }
  
  class InterpreteOld {
    obtenerObjetoDesdeString(str) {
  
      const arrayTareas = str.split("\n");
      const tareasArregloConTarea = arrayTareas.filter(tarea => tarea.trim() !== "");
      const tareasArreglo = tareasArregloConTarea.map(tarea => tarea.replace(/^Tarea\d+: /, ''));
      let arreglo = [];
      for (let i = 0; i < tareasArreglo.length; i++) {
        arreglo[i] = new TareaSolucion(0, tareasArreglo[i], "");
      }
      if (this._noMasSubTarea(arreglo[0].tarea)) {
        interfaz.imprimirTareaCompletada(),
          arreglo = [];
      }
      return arreglo;
    }
    _noMasSubTarea(cadena) {
      let palabras = cadena.trim().toLowerCase().replace(/\.+/g, '').split(" ");
      return palabras.length < 4 && palabras.includes("true");
    }
  
  }
  const interpreteJson = new InterpreteJson();
  const interpreteOld = new InterpreteOld();