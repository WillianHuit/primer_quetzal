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
 *               'trampa'     alguien te quiere ver la cara. Aquí SÍ hay una
 *                            respuesta buena, y esa es la diferencia con el
 *                            comodín: un comodín enseña a decidir sin saber,
 *                            una trampa enseña a desconfiar.
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
  /* OJO CON LOS PESOS. De aquí sale si el mes se siente vivo o se siente una
   * fila de días iguales, y la primera versión se sentía lo segundo: con el
   * jugador sin estudiar, la mitad del mes eran días cualquiera y descansos.
   * Un descanso es bueno cuando te hace falta, no cuando sale cada tres días.
   *
   * La regla al tocarlos: los días que NO piden nada —libre y descanso— no
   * deberían pasar de una quinta parte del mes entre los dos. */
  {
    id: 'dia_libre',
    tipo: 'libre',
    nombre: 'Un día cualquiera',
    icono: 'calendario',
    peso: { colegio: 10, trabajo: 8 }
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
    peso: { colegio: 26, trabajo: 12 }
  },
  {
    id: 'dia_descanso',
    tipo: 'descanso',
    nombre: 'Un día para ti',
    icono: 'luna',
    peso: { colegio: 10, trabajo: 9 }
  },
  {
    id: 'dia_trabajo',
    tipo: 'trabajo',
    nombre: 'Te sale trabajo',
    icono: 'maletin',
    requiere: 'trabajo',
    peso: { colegio: 0, trabajo: 20 }
  },
  {
    id: 'dia_extra',
    tipo: 'extra',
    nombre: 'Un trabajito suelto',
    icono: 'mando',
    requiere: 'extra',
    peso: { colegio: 0, trabajo: 10 }
  },
  {
    id: 'dia_dificultad',
    tipo: 'dificultad',
    nombre: 'Se te atravesó el día',
    icono: 'alerta',
    peso: { colegio: 16, trabajo: 14 }
  },
  {
    id: 'dia_trampa',
    tipo: 'trampa',
    nombre: 'Te quieren ver la cara',
    icono: 'anzuelo',
    peso: { colegio: 9, trabajo: 9 }
  },
  {
    id: 'dia_comodin',
    tipo: 'comodin',
    nombre: 'Te toca elegir',
    icono: 'mundo',
    peso: { colegio: 20, trabajo: 16 }
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
  },
  {
    id: 'com_aguacero',
    pregunta: 'Cae un aguacero justo cuando vas a salir.',
    a: { texto: 'Esperar a que baje',
         resultado: 'Llegaste tarde, pero seco y de buen humor.',
         efecto: { energia: 5 } },
    b: { texto: 'Salir de una vez',
         resultado: 'Llegaste a tiempo y pasaste el resto del día mojado.',
         efecto: { energia: -8 } }
  },
  {
    id: 'com_bus_lleno',
    pregunta: 'La camioneta viene llena y la siguiente tarda media hora.',
    a: { texto: 'Subirte como puedas',
         resultado: 'Llegaste pronto, pero el viaje te dejó molido.',
         efecto: { energia: -9 } },
    b: { texto: 'Esperar la siguiente',
         resultado: 'Viajaste sentado y perdiste buena parte de la mañana.',
         efecto: { energia: -3 } }
  },
  {
    id: 'com_corte_luz',
    pregunta: 'Se fue la luz en todo el barrio al caer la tarde.',
    a: { texto: 'Buscar velas y seguir',
         resultado: 'Avanzaste a medias y terminaste con dolor de cabeza.',
         efecto: { energia: -8, experiencia: 3 } },
    b: { texto: 'Dar el día por terminado',
         resultado: 'Dormiste temprano y amaneciste como nuevo.',
         efecto: { energia: 10 } }
  },
  {
    id: 'com_bici_pinchada',
    pregunta: 'Una bicicleta tirada tiene la llanta pinchada y nadie aparece.',
    a: { texto: 'Quedarte a esperar al dueño',
         resultado: 'Volvió preocupado y aprendiste a poner un parche.',
         efecto: { energia: -5, experiencia: 5 } },
    b: { texto: 'Seguir tu camino',
         resultado: 'Llegaste temprano. Nunca supiste de quién era.',
         efecto: { energia: 4 } }
  },
  {
    id: 'com_mudanza',
    pregunta: 'Una familia nueva está bajando muebles frente a tu casa.',
    a: { texto: 'Ayudar a cargar',
         resultado: 'Terminaste cansado y ya conoces a los nuevos vecinos.',
         efecto: { energia: -10, experiencia: 4 } },
    b: { texto: 'Saludar y seguir',
         resultado: 'Fuiste amable sin regalar la tarde entera.',
         efecto: { energia: 2 } }
  },
  {
    id: 'com_fiesta_barrio',
    pregunta: 'En la cuadra organizaron música y comida para esta noche.',
    a: { texto: 'Quedarte hasta el final',
         resultado: 'Bailaste, comiste y al día siguiente no querías levantarte.',
         efecto: { energia: -13 } },
    b: { texto: 'Ir solo un rato',
         resultado: 'Compartiste con todos y todavía dormiste bien.',
         efecto: { energia: 4 } }
  },
  {
    id: 'com_arreglo_vecino',
    pregunta: 'Un vecino está arreglando el techo y te pide una mano.',
    a: { texto: 'Subirte a ayudar',
         resultado: 'Acabaron antes de la lluvia y aprendiste un par de trucos.',
         efecto: { energia: -12, experiencia: 6 } },
    b: { texto: 'Prestarle una herramienta',
         resultado: 'Le sirvió bastante y tú conservaste la tarde.',
         efecto: { energia: 3 } }
  },
  {
    id: 'com_perro_perdido',
    pregunta: 'Un perro con collar te sigue desde hace tres cuadras.',
    a: { texto: 'Buscar a su familia',
         resultado: 'Te tomó horas, pero volvió a casa moviendo la cola.',
         efecto: { energia: -10, experiencia: 4 } },
    b: { texto: 'Dejarlo en una tienda conocida',
         resultado: 'Lo cuidaron mientras tú seguiste con tu día.',
         efecto: { energia: -2 } }
  },
  {
    id: 'com_grupo_estudio',
    si: 'estudia',
    pregunta: 'Tus compañeros proponen estudiar juntos para el examen.',
    a: { texto: 'Reunirte con ellos',
         resultado: 'Hablaron demasiado, pero una explicación te destrabó el tema.',
         efecto: { energia: -8, experiencia: 7 } },
    b: { texto: 'Estudiar por tu cuenta',
         resultado: 'Avanzaste en silencio y te quedaron un par de dudas.',
         efecto: { energia: -6, experiencia: 5 } }
  },
  {
    id: 'com_presentacion',
    si: 'estudia',
    pregunta: 'El grupo no se pone de acuerdo para la presentación de mañana.',
    a: { texto: 'Tomar el mando',
         resultado: 'La sacaste adelante y cargaste con casi todo.',
         efecto: { energia: -14, experiencia: 9 } },
    b: { texto: 'Repartir una última vez',
         resultado: 'No quedó perfecta, pero todos hicieron su parte.',
         efecto: { energia: -7, experiencia: 5 } }
  },
  {
    id: 'com_apuntes',
    si: 'estudia',
    pregunta: 'Alguien que faltó te pide tus apuntes antes de clase.',
    a: { texto: 'Explicárselos también',
         resultado: 'Perdiste el recreo y entendiste mejor al enseñarlo.',
         efecto: { energia: -6, experiencia: 6 } },
    b: { texto: 'Prestarle el cuaderno',
         resultado: 'Copió rápido y te lo devolvió justo a tiempo.',
         efecto: { experiencia: 2 } }
  },
  {
    id: 'com_beca_formulario',
    si: 'estudia',
    pregunta: 'Apareció una beca y el formulario vence esta noche.',
    a: { texto: 'Llenarlo con calma',
         resultado: 'Te desvelaste revisando cada dato y enviaste una buena solicitud.',
         efecto: { energia: -12, experiencia: 8 } },
    b: { texto: 'Mandarlo de prisa',
         resultado: 'Lo entregaste a tiempo, aunque se te fue un error.',
         efecto: { energia: -4, experiencia: 3 } }
  },
  {
    id: 'com_bus_tarea',
    si: 'estudia',
    pregunta: 'Te falta terminar una tarea y todavía queda un viaje largo en bus.',
    a: { texto: 'Hacerla en el camino',
         resultado: 'La letra salió torcida, pero resolviste lo importante.',
         efecto: { energia: -7, experiencia: 5 } },
    b: { texto: 'Descansar durante el viaje',
         resultado: 'Llegaste despejado y con la tarea todavía pendiente.',
         efecto: { energia: 8 } }
  },
  {
    id: 'com_turno_extra',
    si: 'trabaja',
    pregunta: 'Faltó un compañero y te ofrecen cubrir parte de su turno.',
    a: { texto: 'Cubrirlo',
         resultado: 'El día se hizo eterno, pero notaron que respondiste.',
         efecto: { energia: -14, dinero: 90, experiencia: 4 } },
    b: { texto: 'Mantener tu horario',
         resultado: 'Saliste a tu hora. Mañana también hay trabajo.',
         efecto: { energia: 5 } }
  },
  {
    id: 'com_error_caja',
    si: 'trabaja',
    pregunta: 'Al cerrar, la caja no cuadra y todos quieren irse.',
    a: { texto: 'Quedarte a revisar',
         resultado: 'Encontraste un recibo mal puesto después de media hora.',
         efecto: { energia: -9, experiencia: 6 } },
    b: { texto: 'Dejarlo para mañana',
         resultado: 'Descansaste, pero el problema amaneció esperándote.',
         efecto: { energia: 5 } }
  },
  {
    id: 'com_herramienta',
    si: 'trabaja',
    pregunta: 'Un compañero te pide prestada tu mejor herramienta para el turno.',
    a: { texto: 'Prestársela',
         resultado: 'La devolvió gastada, pero terminó un trabajo difícil.',
         efecto: { energia: -3, experiencia: 5 } },
    b: { texto: 'Trabajar juntos',
         resultado: 'Fueron más lentos y ambos aprendieron algo.',
         efecto: { energia: -8, experiencia: 7 } }
  },
  {
    id: 'com_jefe_favor',
    si: 'trabaja',
    pregunta: 'Tu jefe te pide resolver algo que no estaba en tu puesto.',
    a: { texto: 'Intentarlo',
         resultado: 'Te costó bastante y ahora sabes hacer una cosa más.',
         efecto: { energia: -12, experiencia: 8 } },
    b: { texto: 'Pedir que te enseñen',
         resultado: 'Tardaron más, pero no tuviste que improvisar a ciegas.',
         efecto: { energia: -6, experiencia: 6 } }
  },
  {
    id: 'com_curso_sabado',
    si: 'trabaja',
    pregunta: 'Ofrecen un curso gratuito el sábado sobre algo que usas en el trabajo.',
    a: { texto: 'Inscribirte',
         resultado: 'Perdiste el descanso y saliste con ideas útiles.',
         efecto: { energia: -12, experiencia: 10 } },
    b: { texto: 'Guardar el sábado',
         resultado: 'Dormiste hasta tarde y volviste con la cabeza fresca.',
         efecto: { energia: 12 } }
  },
  {
    id: 'com_prestamo_compa',
    si: 'trabaja',
    pregunta: 'Un compañero te pide prestado hasta la próxima quincena.',
    a: { texto: 'Prestarle',
         resultado: 'Te pagó unos días tarde y ahora te debe un favor.',
         efecto: { dinero: -120, experiencia: 4 } },
    b: { texto: 'Decir que no',
         resultado: 'Lo entendió, aunque la conversación quedó incómoda.',
         efecto: { energia: -2 } }
  },
  {
    id: 'com_vuelto',
    si: 'dinero',
    pregunta: 'En el mercado notas que te dieron vuelto de más.',
    a: { texto: 'Regresarlo',
         resultado: 'La vendedora todavía no había notado el error.',
         efecto: { energia: -2, experiencia: 4 } },
    b: { texto: 'Guardarlo',
         resultado: 'Ganaste unas monedas y pensaste en eso todo el camino.',
         efecto: { dinero: 25, energia: -3 } }
  },
  {
    id: 'com_cuotas',
    si: 'dinero',
    pregunta: 'Te ofrecen algo que quieres en cuotas pequeñas y sin explicar el total.',
    a: { texto: 'Preguntar el precio completo',
         resultado: 'Era mucho más caro de lo que sonaba por mes.',
         efecto: { energia: -2, experiencia: 7 } },
    b: { texto: 'Aceptar la cuota',
         resultado: 'Saliste contento y el primer cobro llegó antes de lo esperado.',
         efecto: { dinero: -180, energia: 3 } }
  },
  {
    id: 'com_reparacion',
    si: 'dinero',
    pregunta: 'Tu celular falla y te ofrecen repararlo hoy sin revisar qué tiene.',
    a: { texto: 'Pedir diagnóstico',
         resultado: 'Esperaste un día y la falla era más sencilla de lo que parecía.',
         efecto: { dinero: -60, energia: -3, experiencia: 5 } },
    b: { texto: 'Pagar la reparación rápida',
         resultado: 'Funcionó de una vez, aunque pagaste por la urgencia.',
         efecto: { dinero: -160, energia: 5 } }
  }
];

/* ---------------------------------------------------------------------------
 * Las cuatro esquinas
 * ---------------------------------------------------------------------------
 * Como en el tablero de mesa: las esquinas no son días, son SITIOS. Son más
 * grandes que las tarjetas de los días —cuadradas, no rectangulares— y no
 * avanzan el calendario: caer en una no gasta un día del mes, te pasa algo y
 * sigues.
 *
 * Van en este orden alrededor del anillo, empezando por la salida y girando
 * en el sentido en que camina la ficha. Son cuatro y tienen que ser cuatro:
 * la quinta no tendría dónde ponerse.
 *
 *   tipo    lo que hace. El motor conoce estos cuatro:
 *
 *             'salida'  donde empieza el mes. No hace nada: es el sitio del
 *                       que se sale y al que no se vuelve.
 *             'reto'    un trabajito suelto con premio. Se juega y se cobra.
 *             'respiro' descanso que NO gasta jornada. El único del juego.
 *                       Se llama así y no 'libre' porque 'libre' ya es el día
 *                       cualquiera, y dos cosas distintas con el mismo nombre
 *                       acaban siendo la misma por accidente: la esquina le
 *                       prestaba su cama a todos los días vacíos del mes.
 *             'atraso'  te devuelve unos pasos. El mes no se acaba solo.
 *
 *   pasos   solo para 'atraso': cuántos pasos te devuelve.
 * --------------------------------------------------------------------------- */
var TABLERO_ESQUINAS = [
  {
    id: 'esq_salida', tipo: 'salida', nombre: 'Salida', icono: 'bandera',
    texto: 'Aquí empieza el mes.'
  },
  {
    id: 'esq_reto', tipo: 'reto', nombre: 'Reto', icono: 'mando',
    texto: 'Te sale un trabajito con premio. No gasta día del mes: es un rato ' +
           'que sacas de donde no había.'
  },
  {
    id: 'esq_libre', tipo: 'respiro', nombre: 'Descanso libre', icono: 'luna',
    texto: 'Un día que no le debes a nadie. Descansas sin gastar jornada.'
  },
  {
    id: 'esq_atraso', tipo: 'atraso', nombre: 'Se te fue el mes', icono: 'reloj',
    pasos: 4,
    texto: 'Entre una cosa y otra se te fueron unos días y no sabes en qué.'
  }
];

/* ---------------------------------------------------------------------------
 * Las trampas: alguien te quiere ver la cara
 * ---------------------------------------------------------------------------
 * Tienen la misma forma que un comodín —dos puertas, A y B— y son lo
 * contrario: aquí SÍ hay una respuesta buena. Un comodín enseña a decidir sin
 * información; una trampa enseña a desconfiar de quien te apura.
 *
 * Por eso el castigo de caer no es enorme y el premio de acertar tampoco: lo
 * que se lleva el jugador es haber visto la forma de la estafa. Las de dinero
 * piden `si: 'dinero'`; las otras dos salen desde los trece, porque a los
 * trece también te llaman.
 *
 * Al escribir una: que la opción mala suene RAZONABLE. Una estafa que se ve
 * venir no enseña nada, y las de verdad nunca se ven venir.
 * --------------------------------------------------------------------------- */
var TABLERO_TRAMPAS = [
  {
    id: 'tra_clave',
    pregunta: 'Te llaman del banco. Dicen que hay un cargo raro y te piden tu clave para bloquearlo.',
    si: 'dinero',
    a: { texto: 'Darles la clave',
         resultado: 'No era el banco. El banco nunca pide la clave, ni por teléfono ni por nada.',
         efecto: { dinero: -300, energia: -8 } },
    b: { texto: 'Colgar y llamar tú al banco',
         resultado: 'No había ningún cargo. Era una llamada falsa.',
         efecto: { experiencia: 6 } }
  },
  {
    id: 'tra_doble',
    pregunta: 'Un conocido te ofrece doblar tu dinero en una semana. Ya le funcionó a otros, dice.',
    si: 'dinero',
    a: { texto: 'Meter algo',
         resultado: 'La primera semana pagó. La segunda desapareció, y con él tu dinero.',
         efecto: { dinero: -400 } },
    b: { texto: 'Pedirle que te explique de dónde sale',
         resultado: 'No supo explicarlo. Ahí estaba la respuesta.',
         efecto: { experiencia: 8 } }
  },
  {
    id: 'tra_rifa',
    pregunta: 'Un mensaje dice que ganaste una rifa. Solo hay que pagar Q75 de envío.',
    si: 'dinero',
    a: { texto: 'Pagar el envío',
         resultado: 'No llegó nada. Nunca llega nada.',
         efecto: { dinero: -75, energia: -5 } },
    b: { texto: 'Borrar el mensaje',
         resultado: 'Uno no gana rifas en las que no jugó.',
         efecto: { experiencia: 5 } }
  },
  {
    id: 'tra_celular',
    pregunta: 'Te venden un celular sellado en la calle, a mitad de precio y sin factura.',
    si: 'dinero',
    a: { texto: 'Comprarlo',
         resultado: 'La caja traía un ladrillo envuelto en papel.',
         efecto: { dinero: -250, energia: -10 } },
    b: { texto: 'Pedir abrirlo antes de pagar',
         resultado: 'El vendedor se fue rápido. Eso lo dijo todo.',
         efecto: { experiencia: 5 } }
  },
  {
    id: 'tra_cadena',
    pregunta: 'Un amigo te mete en un grupo donde ganas si metes a tres personas más.',
    a: { texto: 'Meter a tus amigos',
         resultado: 'Los últimos en entrar pierden, y tus amigos entraron por ti.',
         efecto: { energia: -14, experiencia: 2 } },
    b: { texto: 'Preguntar qué se vende',
         resultado: 'No se vendía nada. Solo entraba gente nueva.',
         efecto: { experiencia: 7 } }
  },
  {
    id: 'tra_tarea',
    pregunta: 'Alguien vende las respuestas del examen por unas monedas.',
    si: 'estudia',
    a: { texto: 'Comprarlas',
         resultado: 'Eran de otro examen. Pagaste por nada y no estudiaste.',
         efecto: { energia: -6, experiencia: -6 } },
    b: { texto: 'Estudiar lo que puedas',
         resultado: 'Te fue regular, y lo que estudiaste te quedó.',
         efecto: { energia: -8, experiencia: 8 } }
  },
  {
    id: 'tra_cambio',
    pregunta: 'En la tienda te dan un billete de cambio que se siente distinto.',
    a: { texto: 'Guardarlo sin ver',
         resultado: 'Era falso. Lo descubriste cuando ya no te lo recibieron.',
         efecto: { energia: -7 } },
    b: { texto: 'Revisarlo ahí mismo',
         resultado: 'Era falso y te lo cambiaron sin discutir.',
         efecto: { experiencia: 6 } }
  }
];

/* Cuántos días trae cada mes. Enero es 0, como en el resto del juego.
 * Febrero se queda en 28: el juego no modela años bisiestos y meterlos aquí
 * sería el detalle más caro y menos visible que se le puede poner. */
var TABLERO_DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
