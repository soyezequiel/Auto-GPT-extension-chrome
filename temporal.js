  // Crear una instancia de la clase BaseDeDatosTarea
  const bdTareaa = new BaseDeDatosTarea();

  // Agregar una tarea
  const tarea1 = { tarea: "Hacer la compra" };
  bdTareaa.guardarTarea(tarea1);
  
  // Obtener todas las tareas en formato de array de strings
  const arrayDeTareas = bdTareaa.obtenerArrayDeStringTodasLasTareas();
  console.log("testeando obtenerArrayDeStringTodasLasTareas() " + arrayDeTareas); // ["Hacer la compra"]
  
  // Agregar otra tarea
  const tarea2 = { tarea: "Llamar al médico" };
  bdTareaa.guardarTarea(tarea2);
  
  // Obtener todas las tareas en formato de string
  const tareasEnString = bdTareaa.obtenerStringTareas();
  console.log("testeando obtenerStringTareas() " +  tareasEnString); // "Hacer la compra,Llamar al médico"
  
  // Eliminar la última tarea agregada
  const tareaEliminada = bdTareaa.borrarTareaEnTope();
  console.log(tareaEliminada); // { tarea: "Llamar al médico" }
    