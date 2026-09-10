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
 *               'dificultad' te pasa algo y te cuesta. No se elige.
 *               'comodin'    dos puertas, A y B, y eliges a ciegas.
 *               'viaje'      un día que no debería existir. Ver abajo.
 *
 *   nombre    lo que dice la casilla
 *   icono     de js/iconos.js
 *   peso      cuántas veces más probable que las demás, POR ETAPA. Una casilla
 *             con peso 0 en una etapa no sale nunca en esa etapa.
 *   requiere  'trabajo' si la casilla solo tiene sentido con la pestaña de
 *             trabajo abierta. Sin eso, su peso es cero aunque diga otra cosa.
 *   si        una CONDICIÓN del jugador, no de la ruta. Las tres que hay:
 *
 *               'estudia'  solo si está inscrito en algo
 *               'trabaja'  solo si tiene empleo
 *               'dinero'   solo si ya maneja dinero y le alcanza
 *
 *             La misma palabra vale para las casillas, las dificultades y los
 *             comodines. Está porque el tablero le sacaba tareas del colegio a
 *             quien no estudia, y un comodín que dice "tienes tarea pendiente"
 *             a quien no tiene ninguna no es una decisión: es un error.
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
 * Un comodín también puede pedir una CONDICIÓN con `si`, igual que las
 * casillas y las dificultades: `si: 'estudia'` es el de los dos que hablan del
 * colegio. Sin eso, a quien no está inscrito en nada le salía "tienes tarea
 * pendiente", y una tarea que no existe no se puede dejar para después.
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
    /* Solo si está estudiando. Sin esto el tablero le sacaba tareas del
     * colegio a quien no está inscrito en nada, y una tarea que no existe no
     * se puede hacer ni dejar pasar. */
    si: 'estudia',
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
  },
  {
    id: 'dia_viaje',
    tipo: 'viaje',
    nombre: 'Un día que no existió',
    icono: 'reloj',
    /* Peso bajo a propósito: un día que regala cosas deja de ser un regalo en
     * cuanto sale seguido. Uno cada dos o tres meses es una historia; uno cada
     * semana es una nómina. */
    peso: { colegio: 3, trabajo: 3 }
  }
];

/* ---------------------------------------------------------------------------
 * Lo que te pasa cuando el día se te atraviesa
 * ---------------------------------------------------------------------------
 * Se aplica solo: no hay nada que elegir, y eso también es la vida.
 *
 * Cada una puede quitar TRES cosas, y las tres a la vez si hace falta:
 *
 *   energia      cuerpo. Lo que cuesta cualquier día malo.
 *   dinero       quetzales. Negativo, siempre.
 *   experiencia  lo que sabes. Negativo. Tiene truco, ver abajo.
 *
 * Y cada una puede pedir una condición con `si` ('estudia', 'trabaja' o
 * 'dinero'). Sin condición sale siempre. Las que quitan dinero llevan casi
 * todas `si: 'dinero'`: a los trece la pantalla todavía no habla de quetzales
 * y quitarle unos que no ve es peor que no quitárselos; y quitarle los que no
 * tiene, peor todavía.
 *
 * EL TRUCO DE LA EXPERIENCIA. Lo que sabes no se puede deber. Si una
 * dificultad te quita 12 y solo tienes 5, los 7 que faltan se cobran donde sí
 * hay de dónde: en dinero por TRES y en cuerpo por MEDIO (los factores están
 * en CONFIG.experiencia.deuda, en datos/config.js). Un mes sin abrir el
 * cuaderno se paga caro justamente cuando no hay nada guardado, que es cuando
 * de verdad duele.
 * --------------------------------------------------------------------------- */
var TABLERO_DIFICULTADES = [
  // --- las que solo cuestan cuerpo: pasan a cualquier edad ---
  { id: 'dif_desvelo', texto: 'Te desvelaste viendo el celular.', energia: -12 },
  { id: 'dif_lluvia', texto: 'Se soltó el agua y te empapaste todo el camino.', energia: -10 },
  { id: 'dif_gripe', texto: 'Andas con gripe desde ayer.', energia: -16 },
  { id: 'dif_bus', texto: 'El bus no pasó y te tocó caminar.', energia: -10 },
  { id: 'dif_pleito', texto: 'Pleito en la casa y nadie durmió bien.', energia: -14 },
  { id: 'dif_luz', texto: 'Se fue la luz toda la noche.', energia: -8 },
  { id: 'dif_mandado', texto: 'Te mandaron a hacer mandados todo el día.', energia: -12 },
  { id: 'dif_cola', texto: 'Cuatro horas de cola para un papel de dos minutos.', energia: -13 },

  // --- las que además cuestan dinero: solo cuando ya hay de dónde ---
  { id: 'dif_celular', texto: 'Se te quebró la pantalla del celular.',
    energia: -4, dinero: -350, si: 'dinero' },
  { id: 'dif_zapatos', texto: 'Se te rompieron los zapatos y no aguantan otro mes.',
    energia: -3, dinero: -180, si: 'dinero' },
  { id: 'dif_medicina', texto: 'Te tocó comprar medicina para la casa.',
    energia: -6, dinero: -120, si: 'dinero' },
  { id: 'dif_pasaje', texto: 'Subió el pasaje y todo el mes se te va en camioneta.',
    energia: -5, dinero: -75, si: 'dinero' },
  { id: 'dif_cumple', texto: 'Cumpleaños en la familia y te tocó poner.',
    energia: -4, dinero: -100, si: 'dinero' },
  { id: 'dif_gotera', texto: 'Se metió el agua por el techo y hubo que taparlo.',
    energia: -9, dinero: -250, si: 'dinero' },
  { id: 'dif_robo', texto: 'Te robaron en la parada. No fue mucho, pero fue.',
    energia: -11, dinero: -200, si: 'dinero' },
  { id: 'dif_herramienta', texto: 'Se te arruinó una herramienta del trabajo.',
    energia: -5, dinero: -160, si: 'trabaja' },

  // --- las que cuestan lo que sabes: solo si está estudiando ---
  { id: 'dif_cuaderno', texto: 'No abriste el cuaderno en toda la semana.',
    energia: -2, experiencia: -10, si: 'estudia' },
  { id: 'dif_falte', texto: 'Faltaste tres días seguidos y perdiste el hilo.',
    energia: -4, experiencia: -14, si: 'estudia' },
  { id: 'dif_copia', texto: 'Te copiaste en el examen. Lo pasaste y no te quedó nada.',
    experiencia: -12, si: 'estudia' },
  { id: 'dif_apuntes', texto: 'Perdiste los apuntes del trimestre.',
    energia: -6, experiencia: -16, si: 'estudia' },
  { id: 'dif_pantalla', texto: 'Se te fue el mes en la pantalla y no repasaste nada.',
    energia: -5, experiencia: -8, si: 'estudia' }
];

/* ---------------------------------------------------------------------------
 * El día que no existió: el viaje en el tiempo
 * ---------------------------------------------------------------------------
 * La casilla rara del tablero, y la única que solo da. Cae poco (peso 3) y
 * cuando cae, el jugador se acuerda.
 *
 * Lo que da NO está escrito aquí, y a propósito: se sortea, y depende de lo
 * que el jugador ya tenga. Ver `sortearViaje` en js/motor.js.
 *
 *   dinero       solo si ya tiene. Un porcentaje de lo suyo, no una cifra:
 *                así el regalo crece con la partida y no desbalancea el
 *                principio, que es donde una cifra fija rompería el juego.
 *   experiencia  solo si está estudiando. Lo que aprendería en unas semanas.
 *   cuerpo       siempre, de 0 a 100. Puede no darte nada y puede devolverte
 *                el mes entero.
 *
 * Aquí solo van los TEXTOS, que es lo que hace que no se repita. Agregar uno
 * es escribir una línea. */
var TABLERO_VIAJES = [
  { id: 'via_futuro', texto: 'Te dormiste en la camioneta y despertaste tres meses adelante. ' +
                             'Nadie te lo va a creer.' },
  { id: 'via_reloj', texto: 'El reloj de la iglesia dio trece campanadas y el día se repitió.' },
  { id: 'via_abuelo', texto: 'Soñaste con tu abuelo. Te contó lo que iba a pasar, y acertó.' },
  { id: 'via_apagon', texto: 'Un apagón de dos horas, y cuando volvió la luz era la semana siguiente.' },
  { id: 'via_bus', texto: 'Te subiste a la camioneta equivocada y te dejó en otro mes.' },
  { id: 'via_lluvia', texto: 'Llovió sin parar y el calendario se saltó unos días.' }
];

/* Los comodines. A y B, y ninguna dice lo que va a pasar.
 *
 * OJO al escribir uno nuevo: los dos lados tienen que sonar razonables. Un
 * comodín donde una opción es obviamente la buena no es un comodín, es un
 * examen, y el jugador aprende a contestar el examen en vez de a decidir. */
var TABLERO_COMODINES = [
  {
    id: 'com_partido',
    si: 'estudia',
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
    si: 'estudia',
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
