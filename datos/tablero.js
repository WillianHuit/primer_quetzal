/* Mi Primer Quetzal — el tablero del mes
 *
 * El mes dejó de ser una rejilla de ocho casillas que el jugador rellenaba
 * como un formulario. Ahora es un TABLERO de treinta o treinta y un días —los
 * que trae el mes de verdad— y se recorre tirando un dado.
 *
 * Por qué el cambio, que es el mismo motivo por el que este juego existe: la
 * rejilla le pedía al jugador que planificara un mes antes de saber qué es un
 * mes. Un tablero no pide eso. Pide una cosa a la vez, y cada tirada trae una
 * decisión chica y concreta —esta tarea la hago o la dejo— que se entiende sin
 * que nadie la explique. Al final del mes el jugador ha tomado seis o siete
 * decisiones sin que ninguna le haya pedido pensar en las otras.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada CASILLA de aquí es un tipo de día, no un día concreto. El tablero de
 * cada mes se sortea con estos pesos, así que dos meses nunca son iguales.
 *
 *   id        para el código y para las traducciones
 *   tipo      qué clase de día es. El motor conoce estos:
 *
 *               'libre'      no pasa nada. Un día cualquiera.
 *               'tarea'      te sale una tarea del colegio. La haces o no.
 *               'trabajo'    te sale un día de trabajo. Lo tomas o no.
 *               'extra'      un trabajito suelto de los de Extra.
 *               'descanso'   un día para ti. Recuperas cuerpo.
 *               'dificultad' te pasa algo y te cuesta cuerpo. No se elige.
 *               'comodin'    dos puertas, A y B, y eliges a ciegas.
 *
 *   nombre    lo que dice la casilla
 *   icono     de js/iconos.js
 *   peso      cuántas veces más probable que las demás, POR ETAPA. Una casilla
 *             con peso 0 en una etapa no sale nunca en esa etapa.
 *   requiere  'trabajo' si la casilla solo tiene sentido con la pestaña de
 *             trabajo abierta. Sin eso, su peso es cero aunque diga otra cosa.
 *
 * Las ETAPAS son dos por ahora y salen del estado del jugador, no de la edad:
 *
 *   'colegio'  todavía no se abrió el trabajo. El mes es tareas, descanso y
 *              lo que la vida traiga. No hay una sola casilla de dinero,
 *              porque a esa edad no hay dinero del que hablar.
 *   'trabajo'  ya se abrió. Entran los días de trabajo, los extras y los
 *              pagos.
 *
 * ---------------------------------------------------------------------------
 * Y los COMODINES son la parte que el jugador va a recordar
 * ---------------------------------------------------------------------------
 * Dos opciones, A y B, y ninguna dice lo que va a pasar. Eso es a propósito:
 * son las decisiones de la vida real que se toman sin información, y la
 * lección no está en el resultado de una sino en las diez que va a ver a lo
 * largo de la partida. La mitad de ellas premian la opción prudente y la otra
 * mitad la premian a medias, porque si la prudente ganara siempre no habría
 * nada que decidir.
 *
 * Cada comodín tiene { a: {...}, b: {...} } y cada lado lleva:
 *   texto     lo que el jugador lee ANTES de elegir
 *   resultado lo que se le cuenta después
 *   efecto    { energia, dinero, experiencia }  — lo que suma o resta
 */

var TABLERO_CASILLAS = [
  {
    id: 'dia_libre',
    tipo: 'libre',
    nombre: 'Un día cualquiera',
    icono: 'calendario',
    peso: { colegio: 22, trabajo: 18 }
  },
  {
    id: 'dia_tarea',
    tipo: 'tarea',
    nombre: 'Tarea del colegio',
    icono: 'libro',
    peso: { colegio: 30, trabajo: 14 }
  },
  {
    id: 'dia_descanso',
    tipo: 'descanso',
    nombre: 'Un día para ti',
    icono: 'luna',
    peso: { colegio: 18, trabajo: 14 }
  },
  {
    id: 'dia_trabajo',
    tipo: 'trabajo',
    nombre: 'Te sale trabajo',
    icono: 'maletin',
    requiere: 'trabajo',
    peso: { colegio: 0, trabajo: 22 }
  },
  {
    id: 'dia_extra',
    tipo: 'extra',
    nombre: 'Un trabajito suelto',
    icono: 'mando',
    requiere: 'extra',
    peso: { colegio: 0, trabajo: 8 }
  },
  {
    id: 'dia_dificultad',
    tipo: 'dificultad',
    nombre: 'Se te atravesó el día',
    icono: 'alerta',
    peso: { colegio: 12, trabajo: 10 }
  },
  {
    id: 'dia_comodin',
    tipo: 'comodin',
    nombre: 'Te toca elegir',
    icono: 'mundo',
    peso: { colegio: 14, trabajo: 12 }
  }
];

/* Lo que te pasa cuando el día se te atraviesa. Se aplica solo: no hay nada
 * que elegir, y eso también es la vida. Cuesta CUERPO y no dinero, porque a
 * los trece los golpes de dinero los absorbe la familia y este juego no le va
 * a mentir sobre eso. */
var TABLERO_DIFICULTADES = [
  { id: 'dif_desvelo', texto: 'Te desvelaste viendo el celular.', energia: -12 },
  { id: 'dif_lluvia', texto: 'Se soltó el agua y te empapaste todo el camino.', energia: -10 },
  { id: 'dif_gripe', texto: 'Andas con gripe desde ayer.', energia: -16 },
  { id: 'dif_bus', texto: 'El bus no pasó y te tocó caminar.', energia: -10 },
  { id: 'dif_pleito', texto: 'Pleito en la casa y nadie durmió bien.', energia: -14 },
  { id: 'dif_luz', texto: 'Se fue la luz toda la noche.', energia: -8 },
  { id: 'dif_mandado', texto: 'Te mandaron a hacer mandados todo el día.', energia: -12 }
];

/* Los comodines. A y B, y ninguna dice lo que va a pasar.
 *
 * OJO al escribir uno nuevo: los dos lados tienen que sonar razonables. Un
 * comodín donde una opción es obviamente la buena no es un comodín, es un
 * examen, y el jugador aprende a contestar el examen en vez de a decidir. */
var TABLERO_COMODINES = [
  {
    id: 'com_partido',
    pregunta: 'Hay partido en la cancha y tienes tarea pendiente.',
    a: { texto: 'Ir al partido',
         resultado: 'Jugaste dos horas y llegaste muerto, pero de buenas.',
         efecto: { energia: -6 } },
    b: { texto: 'Quedarte con la tarea',
         resultado: 'Te costó, y algo aprendiste.',
         efecto: { energia: -10, experiencia: 4 } }
  },
  {
    id: 'com_vecina',
    pregunta: 'La vecina te ofrece cuidarle al niño una tarde.',
    a: { texto: 'Aceptar',
         resultado: 'El niño no paró un segundo. Te dio unas monedas.',
         efecto: { energia: -14, dinero: 15 } },
    b: { texto: 'Decir que no',
         resultado: 'Te quedaste tranquilo en casa.',
         efecto: { energia: 6 } }
  },
  {
    id: 'com_primo',
    pregunta: 'Tu primo te presta el celular para pasar la tarde.',
    a: { texto: 'Agarrarlo',
         resultado: 'Se te fue la tarde y no supiste en qué.',
         efecto: { energia: -10 } },
    b: { texto: 'Mejor no',
         resultado: 'Te acostaste temprano por primera vez en semanas.',
         efecto: { energia: 10 } }
  },
  {
    id: 'com_feria',
    pregunta: 'Es la feria del pueblo y todos van.',
    a: { texto: 'Ir con todos',
         resultado: 'Valió la pena. Te acostaste a las dos.',
         efecto: { energia: -16 } },
    b: { texto: 'Quedarte',
         resultado: 'Aprovechaste la casa vacía para adelantar cosas.',
         efecto: { energia: -4, experiencia: 6 } }
  },
  {
    id: 'com_libro',
    pregunta: 'Encuentras un libro viejo de tu hermana en un cajón.',
    a: { texto: 'Ponerte a leerlo',
         resultado: 'No entendiste la mitad, y la otra mitad se te quedó.',
         efecto: { energia: -6, experiencia: 8 } },
    b: { texto: 'Devolverlo al cajón',
         resultado: 'Ahí sigue.',
         efecto: {} }
  },
  {
    id: 'com_tienda',
    pregunta: 'En la tienda de la esquina te ofrecen acomodar cajas.',
    a: { texto: 'Acomodarlas',
         resultado: 'Dos horas de cajas y unas monedas.',
         efecto: { energia: -12, dinero: 12 } },
    b: { texto: 'Pasar de largo',
         resultado: 'Llegaste a tu casa con el día entero.',
         efecto: {} }
  },
  {
    id: 'com_examen',
    pregunta: 'Mañana hay examen y un compañero te ofrece las respuestas.',
    a: { texto: 'Aceptarlas',
         resultado: 'Pasaste el examen. Y no aprendiste nada.',
         efecto: {} },
    b: { texto: 'Estudiar por tu cuenta',
         resultado: 'Te desvelaste, y eso sí se te quedó.',
         efecto: { energia: -14, experiencia: 10 } }
  },
  {
    id: 'com_abuela',
    pregunta: 'Tu abuela te pide que la acompañes al mercado.',
    a: { texto: 'Acompañarla',
         resultado: 'Cargaste bolsas toda la mañana y te contó de cuando era joven.',
         efecto: { energia: -8, experiencia: 3 } },
    b: { texto: 'Inventar una excusa',
         resultado: 'Fue sola. Te quedaste con la tarde y con la culpa.',
         efecto: { energia: 4 } }
  }
];

/* Cuántos días trae cada mes. Enero es 0, como en el resto del juego.
 * Febrero se queda en 28: el juego no modela años bisiestos y meterlos aquí
 * sería el detalle más caro y menos visible que se le puede poner. */
var TABLERO_DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
