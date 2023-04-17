# Auto-GPT-extension-chrome
La extensión en Chrome interactúa con ChatGPT y guarda respuestas en una base de datos. Requiere interfaz de usuario, enviar varios prompts, crear base de datos, enviar consultas y guardar respuestas. Escrita en JavaScript, usa jQuery y API de Chrome. No tiene autenticación. Se puede configurar nombre de base de datos y tabla. 


El software que estoy desarrollando es un autómata basado en chat GPT, también conocido como AutoGPT. Esta herramienta se presenta como una extensión para Chrome. Al hacer clic en el icono de la extensión, se abrirá un popup que mostrará un formulario con los siguientes campos: "Cómo", "Quiero". En el campo "Cómo", el usuario deberá ingresar la persona o el rol que tiene la necesidad. En el campo "Quiero", se ingresará lo que se desea obtener, ya sea una funcionalidad, característica, etc. Una vez que se hayan ingresado estos campos, se podrá presionar el botón "Trabajar", el cual comenzará a mostrar una serie de resultados parciales, que será la resolución del problema original.

Aquí te muestro un ejemplo de cómo se verán los resultados parciales:
Problema: Problema ingresado en el formulario
Tarea 1: Una de las tareas que se generaron para solucionar el problema.
Tarea 2: Una de las tareas que se generaron para solucionar el problema.
Tarea 3: Una de las tareas que se generaron para solucionar el problema.
Ejecución de tarea 1 (se ejecutó pero la tarea no se resolvió): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.
tarea añadida 1-1: Una de las tareas que se generaron para solucionar el problema de que la tarea original no se resolvió.
tarea añadida 1-2: Una de las tareas que se generaron para solucionar el problema de que la tarea original no se resolvió.
Ejecución de tarea 2 (tarea ejecutada con éxito): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.
Ejecución de tarea 3 (tarea ejecutada exitosamente, pero se puede mejorar completando esta tarea opcional): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.
Tarea opcional 3-1: Una de las tareas que se generaron para solucionar el problema de que la tarea original no se resolvió.
Ejecución de tarea 1-1 (tarea ejecutada exitosamente): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.
Ejecución de tarea 1-2 (tarea ejecutada exitosamente): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.
Ejecución de tarea opcional 3-1 (tarea ejecutada exitosamente): Aquí se muestra el resultado proporcionado por chatGPT para la tarea propuesta.

Pueden haber tantos resultados parciales como tareas se requieran para solucionar el problema, incluyendo las tareas subyacentes.

El problema se considerará resuelto cuando se completen todas las tareas. Sin embargo, es posible que el problema no se resuelva, en cuyo caso se deberá detener la ejecución manualmente.

Una vez que el problema se haya solucionado o se haya detenido la ejecución, se mostrará un botón para guardar en PDF todos los resultados parciales existentes.



El tratamiento del problema se realizará ejecutando las siguientes acciones:

El problema llega al agente de creación de tareas.
El agente de creación de tareas, utilizando ChatGPT, busca las tareas necesarias para llevar a cabo la solución del problema.
Las tareas identificadas se guardan en una base de datos llamada "memoria", junto con el problema.
Las tareas son enviadas desde el agente de creación de tareas a la cola de tareas.
Las tareas en la cola de tareas son enviadas al agente de priorización de tareas, que las ordena según su prioridad y correlatividad.
La lista de tareas ordenadas se envía de nuevo a la cola de tareas.
La tarea que está en la primera posición de la cola de tareas es tomada y enviada al agente de ejecución.
El agente de ejecución le solicita a la base de datos "memoria" el índice de datos relacionado con la tarea a ejecutar, especificando qué información del índice necesita.
La base de datos "memoria" envía al agente de ejecución la información solicitada junto con la tarea a ejecutar.
Una vez obtenida la información completa, el agente de ejecución ejecuta la tarea.
El agente de ejecución envía la tarea ejecutada y su resultado al agente de creación de tareas.
Si la tarea no se ha cumplido, se crean nuevas tareas en el agente de creación de tareas.
Se guarda la tarea original y su ejecución en la base de datos "memoria".
Las tareas creadas se envían a la cola de tareas desde el agente de creación de tareas.
Las tareas en la cola de tareas son enviadas al agente de priorización de tareas y el ciclo se repite.







Prompt posibles a utilizar

Agente de ejecución
	Tarea:  “Tarea”

ejecuta la tarea , en caso de no tener información suficiente dime cómo conseguirla
información: 
"
información
"
	
	luego se le pide un título
	dame un título para tu respuesta, que resuma toda la misma

Agente de priorización de tareas
prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra
	“tareas”
Agente de creación de tareas	

Cuando se recibe un problema
“
Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo
tu eres  “nombre” y el objetivo es  “objetivo”.
cada tarea no debe de superar los 280 caracteres
La primera tarea debe de ser la tarea inicial.
La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo
se conciso“
tarea
"
“tarea”
"


información: 
"
“información”"
"

 su ejecución
"
ejecución
"
en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo

La tarea debe ser concisa y específicas para cumplir la tarea
La tarea no debe de superar los 280 caracteres
se conciso




Aqui se llevará una simulación de la ejecución de una auto tarea

Como Actor 
quiero  conseguir el papel protagónico de "Casablanca 2"


El problema llega al agente de creación de tareas.
Como Actor quiero  conseguir el papel protagónico de "Casablanca 2"
El agente de creación de tareas, utilizando ChatGPT, busca las tareas necesarias para llevar a cabo la solución del problema.
El prompt que se utilizó fue
Crea un plan de 3 tareas concisas y específicas para alcanzar el objetivo
tu eres  Actor y el objetivo es  conseguir el papel protagónico de "Casablanca 2”.
cada tarea no debe de superar los 280 caracteres
La primera tarea debe de ser la tarea inicial.
La tercera tarea debe ser la última que se debe de completar para cumplir el objetivo
se conciso
Las tareas generadas fueron
Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.
Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.

El problema se guarda en una base de datos llamada "memoria".
Las tareas son enviadas desde el agente de creación de tareas a la cola de tareas.
Las tareas en la cola de tareas son enviadas al agente de priorización de tareas, que las ordena según su prioridad y correlatividad.
Se le proporcionó este prompt
prioriza las tareas teniendo en cuenta su prioridad y su correlatividad. sin agregar texto extra
Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.
Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.
dando como resultado
Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.
Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.

La lista de tareas ordenadas se envía de nuevo a la cola de tareas.
La tarea que está en la primera posición de la cola de tareas es tomada y enviada al agente de ejecución.
	Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.

El agente de ejecución le solicita a la base de datos "memoria" el índice de datos relacionado con la tarea a ejecutar, especificando qué información del índice necesita.
	1- Problema
La base de datos "memoria" envía al agente de ejecución la información solicitada junto con la tarea a ejecutar.
información solicitada: Como Actor quiero  conseguir el papel protagónico de "Casablanca 2"

	Tarea a ejecutar:  Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.
Una vez obtenida la información completa, el agente de ejecución ejecuta la tarea.
prompt
Tarea:  Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.

ejecuta la tarea , en caso de no tener información suficiente dime como conseguirla
información: 
"
Como Actor quiero  conseguir el papel protagónico de "Casablanca 2"
"
resultado
	Lamentablemente, como modelo de lenguaje, no tengo acceso a información actualizada sobre guiones de películas que se hayan estrenado después de mi fecha de corte de conocimiento en septiembre de 2021. Hasta donde yo sé, no existe una película titulada "Casablanca 2" que haya sido producida oficialmente como secuela de la icónica película clásica "Casablanca" de 1942 dirigida por Michael Curtiz. Es posible que la información que buscas sea ficticia o relacionada con una posible idea o rumor sobre una continuación no oficial o una propuesta de guión no confirmada.
Si deseas obtener información más actualizada y precisa sobre el guión de "Casablanca 2", te recomiendo buscar en fuentes confiables, como sitios web de noticias de la industria del cine, blogs especializados en cine, o consultar con profesionales de la industria cinematográfica o estudios de cine autorizados. También puedes buscar en bibliotecas o bases de datos especializadas en guiones de películas, o contactar directamente a los estudios de cine o productores involucrados en la posible producción de "Casablanca 2" para obtener información oficial sobre la trama, el personaje protagónico y sus motivaciones.

luego se le pidio un titulo
dame un título para tu respuesta, que resuma toda la misma
resultado
Título: "No se encontró evidencia de un guión oficial de "Casablanca 2": busca fuentes confiables para obtener información actualizada sobre posibles secuelas o propuestas de guiones no confirmadas"
El agente de ejecución envía el título, la tarea ejecutada y su resultado al agente de creación de tareas.
Título: "No se encontró evidencia de un guión oficial de "Casablanca 2": busca fuentes confiables para obtener información actualizada sobre posibles secuelas o propuestas de guiones no confirmadas"

Tarea:  Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.

Resultado
	Lamentablemente, como modelo de lenguaje, no tengo acceso a información actualizada sobre guiones de películas que se hayan estrenado después de mi fecha de corte de conocimiento en septiembre de 2021. Hasta donde yo sé, no existe una película titulada "Casablanca 2" que haya sido producida oficialmente como secuela de la icónica película clásica "Casablanca" de 1942 dirigida por Michael Curtiz. Es posible que la información que buscas sea ficticia o relacionada con una posible idea o rumor sobre una continuación no oficial o una propuesta de guión no confirmada.
Si deseas obtener información más actualizada y precisa sobre el guión de "Casablanca 2", te recomiendo buscar en fuentes confiables, como sitios web de noticias de la industria del cine, blogs especializados en cine, o consultar con profesionales de la industria cinematográfica o estudios de cine autorizados. También puedes buscar en bibliotecas o bases de datos especializadas en guiones de películas, o contactar directamente a los estudios de cine o productores involucrados en la posible producción de "Casablanca 2" para obtener información oficial sobre la trama, el personaje protagónico y sus motivaciones.


Si la tarea no se ha cumplido, se crean nuevas tareas en el agente de creación de tareas.
	prompt
	tarea
"
tarea:  Investigar y estudiar el guión de "Casablanca 2" para comprender la trama, el personaje protagónico y sus motivaciones.
"


información: 
"
Como Actor quiero  conseguir el papel protagónico de "Casablanca 2"
"

 su ejecución
"
Lamentablemente, como modelo de lenguaje, no tengo acceso a información actualizada sobre guiones de películas que se hayan estrenado después de mi fecha de corte de conocimiento en septiembre de 2021. Hasta donde yo sé, no existe una película titulada "Casablanca 2" que haya sido producida oficialmente como secuela de la icónica película clásica "Casablanca" de 1942 dirigida por Michael Curtiz. Es posible que la información que buscas sea ficticia o relacionada con una posible idea o rumor sobre una continuación no oficial o una propuesta de guión no confirmada.

Si deseas obtener información más actualizada y precisa sobre el guión de "Casablanca 2", te recomiendo buscar en fuentes confiables, como sitios web de noticias de la industria del cine, blogs especializados en cine, o consultar con profesionales de la industria cinematográfica o estudios de cine autorizados. También puedes buscar en bibliotecas o bases de datos especializadas en guiones de películas, o contactar directamente a los estudios de cine o productores involucrados en la posible producción de "Casablanca 2" para obtener información oficial sobre la trama, el personaje protagónico y sus motivaciones.
"
en caso de que la tarea no se encuentre completada proporcione un objetivo nuevo que me permita completar este objetivo

La tarea debe ser concisa y específicas para cumplir la tarea
La tarea no debe de superar los 280 caracteres
se conciso


respuesta
El nuevo objetivo es investigar y analizar el guión original de "Casablanca" de 1942 para comprender la trama, el personaje protagónico y sus motivaciones. Esto te ayudará a estar preparado si surge una oportunidad de audición para una posible continuación en el futuro.
Se guarda la tarea original y su ejecución en la base de datos "memoria".
Las tareas creadas se envían a la cola de tareas desde el agente de creación de tareas.
El nuevo objetivo es investigar y analizar el guión original de "Casablanca" de 1942 para comprender la trama, el personaje protagónico y sus motivaciones. Esto te ayudará a estar preparado si surge una oportunidad de audición para una posible continuación en el futuro..
Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.
Las tareas en la cola de tareas son enviadas al agente de priorización de tareas y el ciclo se repite.
	prompt
	ordena las tareas según su prioridad sin modificar el texto
"
1 - El nuevo objetivo es investigar y analizar el guión original de "Casablanca" de 1942 para comprender la trama, el personaje protagónico y sus motivaciones. Esto te ayudará a estar preparado si surge una oportunidad de audición para una posible continuación en el futuro..
2- Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
3 -Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.
"
resultado
1 - El nuevo objetivo es investigar y analizar el guión original de "Casablanca" de 1942 para comprender la trama, el personaje protagónico y sus motivaciones. Esto te ayudará a estar preparado si surge una oportunidad de audición para una posible continuación en el futuro.
2 - Preparar y ensayar una escena de audición convincente que muestre mi habilidad para interpretar al personaje protagónico de "Casablanca 2".
3 - Presentar la audición al director de casting de "Casablanca 2", demostrando confianza, habilidad actoral y enfoque en el personaje protagónico.


