/* Mi Primer Quetzal — la ruta que se va abriendo
 *
 * Antes el juego abría con todo a la vista: cinco pestañas y, dentro del
 * banco, once productos financieros de un solo golpe. Para alguien de 18 años
 * que nunca ha pisado un banco eso no es libertad, es parálisis. Y el orden en
 * que descubría las cosas quedaba al azar: podía pedir un préstamo antes de
 * tener dónde recibir el sueldo.
 *
 * Esto lo convierte en una ruta. Al empezar solo existen el mes y el trabajo.
 * Cada peldaño se abre cuando el jugador hace algo que lo justifica, y al
 * abrirse explica qué es y por qué le sirve.
 *
 * El tutorial no es una pantalla aparte: el tutorial ES esta lista. Los
 * primeros peldaños llevan `guia: true` y salen en la cinta de abajo, que
 * señala dónde hay que tocar. Los demás salen como "lo que sigue" en la
 * pestaña del mes, sin estorbar.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada peldaño tiene:
 *
 *   llaves    lo que abre. Los nombres los conoce la interfaz; están en la
 *             tabla de LLAVES de más abajo. Puede ir vacío: un peldaño sin
 *             llaves no abre nada, solo enseña un movimiento.
 *   cuando    la condición. Recibe el estado de la partida (e), el motor (M) y
 *             lo que el jugador está viendo (vista: { pestana, espacioSel }).
 *             Devuelve true o false.
 *   requiere  el id de otro peldaño que tiene que estar abierto antes de que
 *             este ni se evalúe. Existe para un caso concreto: "regresa al
 *             Mes" se cumpliría al arrancar, porque el jugador ya está en el
 *             Mes, y el paso se saltaría solo.
 *
 *             OJO: solo en peldaños SIN llaves. Encadenar uno que abre algo es
 *             meterle una segunda condición escondida, y basta con que el
 *             jugador haga las cosas en otro orden para que ese contenido no se
 *             abra nunca. Ya pasó: con `cuenta` encadenada, abrir la monetaria
 *             antes de repartir el mes dejaba la cuenta de ahorro cerrada para
 *             siempre. pruebas/ruta.js lo comprueba.
 *   pista     qué dice el juego mientras el peldaño sigue cerrado. Si es null,
 *             el peldaño no se persigue: llega solo con el tiempo.
 *   guia      true si la pista va en la cinta del tutorial, abajo, señalando.
 *             Solo para los primeros movimientos: la cinta estorba.
 *   senala    a qué elemento apunta la cinta (un selector de CSS). Puede ser
 *             una función (e, vista) que devuelva el selector, para los pasos
 *             donde lo que hay que tocar cambia a mitad del paso.
 *   pestana   a qué pestaña lleva el botón "Llévame ahí".
 *   titulo    el encabezado de la tarjeta que sale al abrirse. SIN titulo el
 *             peldaño se abre en silencio: es un movimiento del tutorial, no
 *             un desbloqueo, y no merece una ventana encima.
 *   texto     qué es lo que se abrió.
 *   leccion   por qué importa. Es la parte que se queda.
 *
 * Para sacar un peldaño de la ruta, ponle `cuando: function () { return true; }`
 * y nace abierto. Para reordenar la ruta, mueve el bloque completo.
 *
 * REGLA IMPORTANTE al escribir un `cuando`: la ruta pacea el descubrimiento,
 * no esconde contenido para siempre. Un peldaño CON LLAVES que pide algo que el
 * jugador puede no hacer nunca (aceptar un empleo, abrir cuenta, ahorrar, pedir
 * prestado) lleva SIEMPRE una segunda salida por tiempo o por edad. Si no,
 * alguien que juega de otra manera pierde esa parte del juego y nada se lo dice.
 *
 * Los peldaños SIN llaves no la necesitan: son pasos del tutorial, y que a
 * alguien que nunca reparte el mes no se le cierre ese paso es lo correcto.
 *
 * pruebas/ruta.js lo comprueba por los dos lados: juega una vida atenta y falla
 * si algún peldaño quedó inalcanzable, y juega una vida en la que el jugador no
 * hace absolutamente nada y falla si alguna llave se le queda cerrada.
 * ---------------------------------------------------------------------------
 *
 * LLAVES que la interfaz entiende:
 *
 *   estudio   la pestaña de Estudio (nace abierta: es la primera decisión)
 *   trabajo   la pestaña de Trabajo
 *   banco     la pestaña de Banco
 *   ahorro    la cuenta de ahorro, que es la que un menor abre de verdad
 *   monetaria la cuenta monetaria, que es la que pide un patrono para pagarte
 *   extra     la pestaña de trabajos extra
 *   noticias  la pestaña de Noticias: mercado laboral, promociones y bitácora
 *   credito   el préstamo personal del banco
 *   informal  el prestamista del barrio
 *   plazo     el depósito a plazo fijo
 *   tarjeta   la tarjeta de crédito
 *   migrar    irse del país
 *   pension   el plan de pensiones
 *   casa      comprar casa con hipoteca
 *
 * La vivienda (mudarse de la casa familiar a un cuarto) NO se desbloquea:
 * vive dentro de la pestaña de Banco y aparece con ella, porque mudarse sin
 * empleo no es una decisión, es un error.
 */

/* Lo que existe desde el primer segundo.
 *
 * Solo el Estudio. El juego empieza a los 13 años saliendo de primaria, y la
 * primera pantalla tiene que ser la primera decisión de esa vida: estudiar o
 * ponerse a trabajar. El trabajo se abre en cuanto la contesta, sea que diga
 * que sí o que no.
 *
 * Antes esto arrancaba al revés (el trabajo abierto y el estudio ganado a los
 * dos meses), y eso enseñaba justo lo contrario de lo que el juego quiere
 * enseñar: que primero se busca trabajo y luego, si sobra tiempo, se estudia. */
var PROGRESO_INICIAL = ['estudio'];

/* Cuantos turnos son SOLO colegio para quien eligio estudiar.
 *
 * A los trece cada turno es un mes, asi que son los primeros cuatro meses con
 * dos pestanas: Mes y Estudio. En el quinto se abre Trabajo. Es el numero que
 * decide el ritmo de la apertura del juego, y esta aqui arriba para que se
 * pueda mover sin buscarlo. */
var MESES_SOLO_COLEGIO = 4;

/* Y con cuanto en la mano se abre el imperio. El negocio mas barato del juego
 * es un puesto de dulces de Q450: se abre con el doble, para que la pantalla
 * no aparezca ofreciendo algo que no se puede pagar. */
var DINERO_PARA_IMPERIO = 900;

var PROGRESO = [

  // ---------- el tutorial: un toque por paso ----------
  //
  // Diez peldaños, un toque cada uno, en el orden en que se vive: primero el
  // colegio, después el trabajo, después repartir el mes y cerrarlo.
  //
  // Y en medio hay un HUECO a propósito: entre la primera tarea y la apertura
  // del trabajo pasan cuatro meses en los que la cinta se apaga y el jugador
  // reparte solo. Un paso del tutorial es un movimiento; esperar no lo es, y
  // una franja negra que pide esperar es una franja negra que estorba.
  //
  // El tutorial TERMINA ahí, y eso es a propósito. Antes seguía dos pasos más
  // ("entra al Banco", "abre tu cuenta") y con eso le regalaba al jugador de 13
  // años un producto financiero en el minuto cinco, por obediencia y no por
  // necesidad. Es normal no tener cuenta en el banco. La cuenta se abre cuando
  // aparece una razón, y esa razón está más abajo en esta misma lista.
  //
  // NO van encadenados salvo donde se indica: cada condición se cumple sola, y
  // el orden sale de que en la práctica una no se puede cumplir antes que la
  // anterior. Así, alguien que salte el tutorial y haga las cosas en otro orden
  // abre exactamente lo mismo.
  //
  // Los que no traen `titulo` se abren en silencio: son un movimiento, no un
  // desbloqueo, y sacar una ventana por tocar una pestaña sería insoportable.

  {
    id: 'verEstudio',
    llaves: [],
    cuando: function (e, M, vista) { return vista.pestana === 'estudio'; },
    pista: 'Tienes 13 años y acabas de salir de primaria. Toca Estudio: hay algo que decidir.',
    guia: true,
    senala: '[data-pestana="estudio"]'
  },

  {
    id: 'decidirEstudio',
    llaves: [],
    cuando: function (e) { return e.decisionEstudio !== null || e.edad >= 14; },
    pista: 'Tres salidas, y las tres cuestan algo: básicos en pública, en privada, o a trabajar. Elige tú.',
    guia: true,
    senala: '[data-decide]',
    pestana: 'estudio',
    titulo: 'Ya decidiste',
    texto: 'Estudiar no es gratis: se paga con las horas que podrías estar ganando. Y no estudiar tampoco es gratis.',
    leccion: 'En Guatemala un trabajador sin básicos gana alrededor de Q2,400 al mes. Con diversificado, Q3,800. Esa diferencia dura toda la vida, y es lo que estás decidiendo aquí.',
    icono: 'birrete'
  },

  /* La primera tirada del dado, que es aprender a jugar.
   *
   * El mes es un tablero de treinta dias y se recorre con un dado. Eso no se
   * descubre solo: el jugador ve un tablero, unas casillas de colores y un
   * boton, y hace falta una frase que le diga que el mes pasa tirando.
   *
   * Y con la primera tirada aprende lo demas sin que nadie se lo diga, porque
   * la casilla en la que cae le pregunta lo suyo: esta tarea la haces o la
   * dejas. Una decision chica, cerrada, y con su consecuencia en el mismo
   * toque.
   */
  {
    id: 'primeraTirada',
    llaves: [],
    cuando: function (e) {
      if (e.decisionEstudio === null && e.edad < 14) return false;
      return !!(e.tablero && e.tablero.pos > 0);
    },
    pista: 'El mes son treinta días. Tira el dado para recorrerlos: en cada casilla te va a pasar algo.',
    guia: true,
    senala: '#tirar-dado',
    pestana: 'casa',
    titulo: 'Así se juega el mes',
    texto: 'Cada tirada te deja en un día, y ese día te ofrece algo: una tarea, un descanso, un día que se te atraviesa. Lo tomas o lo dejas pasar.',
    leccion: 'Nadie decide un mes entero de una vez. Se decide un día a la vez, y al final del mes resulta que decidiste el mes.',
    icono: 'calendario'
  },

  /* Y llegar al final del mes, que es lo que lo cierra.
   *
   * El mes no se cierra con un boton en cualquier momento: se cierra cuando el
   * dado llega al ultimo dia. Eso hace que cerrar el mes deje de ser un tramite
   * que se puede tocar sin haber hecho nada. */
  {
    id: 'primerMes',
    llaves: [],
    requiere: 'primeraTirada',
    cuando: function (e) { return e.mesesJugados >= 1; },
    pista: 'Sigue tirando hasta el último día. El mes se cierra cuando llegas al final, no antes.',
    guia: true,
    senala: '#tirar-dado',
    pestana: 'casa',
    titulo: 'Cerraste tu primer mes',
    texto: 'Treinta días, ocho tiradas y unas cuantas decisiones. Eso es un mes, y el juego son doscientos.',
    leccion: 'Lo que se te va del mes no se decide el primer día: se decide en los días sueltos, y casi nunca se siente que se está decidiendo nada.',
    icono: 'calendario'
  },

  /* Y el trabajo llega DESPUÉS, no de una.
   *
   * Un chico de trece que acaba de inscribirse en básicos no sale a buscar
   * empleo el mismo mes: va a clases. Así que los primeros cuatro turnos son
   * solo colegio —Mes y Estudio, dos pestañas— y en el quinto se abre Trabajo
   * con lo único que existe a esa edad: los tres trabajitos por cuenta propia,
   * sin contrato y sin patrón.
   *
   * Quien decidió NO estudiar lo abre de una, porque no tiene clases a las que
   * ir y lo único que le queda es buscar con qué mantenerse. Esa es la
   * diferencia entera entre los dos caminos, y el juego la dice sin decirla:
   * el que estudia empieza más despacio.
   */
  {
    id: 'primerTrabajo',
    llaves: ['trabajo'],
    cuando: function (e) {
      if (e.decisionEstudio === null && e.edad < 14) return false;
      // Sin colegio no hay nada que esperar: a buscar con qué comer
      if (!e.estudio) return true;
      return e.mesesJugados >= MESES_SOLO_COLEGIO;
    },
    /* SIN pista y SIN cinta, y es LA decisión de cómo se enseña este juego.
     *
     * Este paso pasó por los tres extremos y los tres estaban mal. Señalando
     * siempre el botón de cerrar, el tutorial le enseñaba al jugador a
     * saltarse el juego: cinco toques al mismo sitio sin repartir nada.
     * Señalando cada casilla de los cuatro meses, lo llevaba de la mano por
     * algo que el paso anterior ya le enseñó. Y dejando la cinta encendida
     * como una nota, el tutorial se quedaba clavado en el paso 4 con la
     * franja negra tapando la pantalla durante cuatro meses seguidos,
     * pidiendo algo que no se puede tocar: esperar.
     *
     * Un paso del tutorial es un MOVIMIENTO. Esto es una espera, así que no
     * es un paso: la cinta se apaga con la primera tarea y no vuelve hasta
     * que se abre el trabajo, que es cuando hay algo nuevo que enseñar.
     *
     * Lo que queda en su lugar es una pista sutil —"Tareas pendientes: 1" en
     * la franja de la calle— y nada más. El jugador reparte estos meses como
     * quiera, incluido no hacer ninguna tarea: eso también es una decisión, y
     * la va a pagar cuando una carrera le pida experiencia que no tiene. */
    pista: null,
    pestana: 'casa',
    titulo: 'Se abrió el trabajo',
    texto: 'Llevas unos meses en clases y ya puedes buscar algo para las tardes. A tu edad no hay sueldos: hay tres trabajitos por tu cuenta, sin contrato y sin patrón.',
    leccion: 'Cada jornada que le pongas al trabajo es una que no le pones a las tareas. Nadie te va a decir cuál conviene, porque depende de a dónde quieras llegar.',
    icono: 'maletin'
  },

  {
    /* Encadenados desde aquí hasta el final del tutorial, y hace falta.
     *
     * En medio del tutorial hay ahora una espera de cuatro meses. Sin la
     * cadena, en cuanto el jugador hace su primera tarea la cinta salta al
     * primer paso que todavía no se cumple y se pone a señalar la pestaña de
     * Trabajo —que no existe— o a pedirle que llene las ocho casillas de un
     * mes que es suyo. La cadena es lo que hace que la cinta se calle durante
     * la espera y vuelva justo cuando el trabajo se abre. */
    id: 'verTrabajo',
    llaves: [],
    requiere: 'primerTrabajo',
    cuando: function (e, M, vista) { return vista.pestana === 'trabajo'; },
    pista: 'Ahora toca Trabajo. A los 13 no hay sueldos, pero sí hay trabajitos.',
    guia: true,
    senala: '[data-pestana="trabajo"]'
  },

  {
    id: 'empleo',
    llaves: [],
    cuando: function (e) { return e.empleo !== null; },
    requiere: 'verTrabajo',
    pista: 'Los tres son tuyos para elegir. Pagan unos pocos quetzales por jornada: eso es lo que hay a tu edad.',
    guia: true,
    senala: '[data-tomar]',
    pestana: 'trabajo'
  },

  {
    id: 'verMes',
    llaves: [],
    requiere: 'empleo',      // si no, se cumple al arrancar y se salta solo
    cuando: function (e, M, vista) { return vista.pestana === 'casa'; },
    pista: 'Regresa a la pestaña Mes. Ahí se reparte el tiempo, que es lo único que de verdad tienes.',
    guia: true,
    senala: '[data-pestana="casa"]'
  },

  /* La tarjeta de la primera tarea, sin cinta y sin pedir nada.
   *
   * No es un paso del tutorial: es la unica cosa del juego que hay que decir en
   * voz alta cuando pasa, y pasa cuando el dado quiera. Sin pista, asi que no
   * se persigue ni sale en "lo que sigue"; su tarjeta salta el dia en que el
   * jugador hace su primera tarea, que puede ser el mes uno o el mes cuatro.
   */
  {
    id: 'primeraTarea',
    llaves: [],
    cuando: function (e) { return (e.totales && e.totales.tareasHechas) > 0; },
    pista: null,
    titulo: 'Hiciste tu primera tarea',
    texto: 'Ese día no te dio un quetzal, y aun así fue el mejor pagado del mes: la experiencia es lo que te va a dejar entrar a las carreras que piden más.',
    leccion: 'El dinero se gasta; lo que aprendiste, no. Es lo único de este juego que, una vez que lo tienes, ya es tuyo.',
    icono: 'birrete'
  },

  /* El imperio, cuando ya hay con qué.
   *
   * Se abría al cerrar el primer mes, y eso era un cañonazo: un chico de trece
   * en su primer mes de básicos abría el juego y le aparecían un negocio y una
   * tienda de mejoras que no puede pagar. Ahora llega cuando la frase tiene
   * sentido: cuando tiene con qué. El puesto de dulces más barato cuesta Q450,
   * así que se abre con el doble en la mano y un trabajo que lo sostenga.
   */
  {
    id: 'imperio',
    llaves: ['extra', 'mejoras'],
    /* Dinero en la mano, o los veinte cumplidos.
     *
     * Lo primero es lo que da sentido a la pantalla: abrirla sin un quetzal
     * seria ofrecerle nueve negocios a quien no puede pagar ninguno. Con qué
     * se juntó ese dinero es asunto del jugador y por eso no se pide trabajo.
     *
     * Y lo segundo es la regla de esta lista: un peldaño CON LLAVES que pide
     * algo que el jugador puede no hacer nunca lleva siempre una segunda
     * salida. Un jugador que solo descansa y cierra meses llega a los sesenta
     * y cinco con Q808 en el mejor momento de su vida —lo mide
     * pruebas/ruta.js— y sin esta salida se moriría sin haber visto que el
     * juego tenía un imperio. Que no pueda pagarlo es su historia; que no sepa
     * que existe seria culpa nuestra. */
    cuando: function (e, M) {
      return M.dineroDisponible() >= DINERO_PARA_IMPERIO || e.edad >= 20;
    },
    pista: null,
    titulo: 'Se abrió tu Imperio',
    texto: 'Ya tienes con qué abrir algo propio. Empieza chico: un puesto de dulces cuesta Q450. Y en Extra hay trabajos sueltos que se pagan aparte.',
    leccion: 'Un negocio se mide con dos números, no con uno: lo que vende y lo que le queda después de pagar el producto y la renta. Un negocio que vende el doble que otro puede ganar la mitad. Ese segundo número es el único que importa.',
    icono: 'trending-up'
  },

  // ---------- de aquí en adelante, metas sin cinta ----------

  /* El banco no llega por tutorial: llega cuando duele no tenerlo.
   *
   * La condición que importa es la primera. `fugaEfectivo` es lo que se le ha
   * ido de la bolsa en cosas que no recuerda: el 8% del efectivo cada mes. En
   * cuanto acumula Q30 perdidos así, el juego le abre el banco y le explica de
   * dónde salió ese agujero. La lección llega DESPUÉS de haberla sentido, que
   * es la única forma en que se queda.
   *
   * Las otras dos son las razones reales por las que la gente abre su primera
   * cuenta: porque un patrono se la pide, o porque cumplió 18.
   */
  {
    id: 'banco',
    llaves: ['banco', 'ahorro'],
    /* Y ninguna de las tres cuenta mientras no entre un quetzal.
     *
     * Un chico en su primer año de básicos no tiene nada que hacer con una
     * cuenta de ahorro: no gana, no gasta lo suyo y no puede mover nada. Se
     * abría igual, porque cuatro meses de clases bastan para que el efectivo
     * se le vaya en gastos hormiga, y aparecía una pestaña de banco delante de
     * alguien que todavía está aprendiendo a restar.
     *
     * El primer intento midió esto con la LLAVE del trabajo, y no alcanzaba:
     * la llave se abre el mes cinco y el banco salía el mismo día, delante de
     * alguien que todavía no había aceptado ningún trabajito. Lo que importa
     * no es poder buscar trabajo, es tener de dónde te entre algo. Por eso se
     * mide con el empleo, y a los 18 se abre igual: a esa edad, tener cuenta
     * ya es parte de la vida aunque no estés ganando. */
    cuando: function (e) {
      /* Un patrono formal te pide cuenta, y a los 18 tener cuenta ya es parte
       * de la vida aunque no estés ganando. Esas dos abren el banco siempre. */
      if (e.empleo && e.empleo.formal) return true;
      if (e.edad >= CONFIG.mayoriaDeEdad) return true;
      /* Y mientras no haya terminado básicos, no. Lo único que existe a esa
       * edad son los tres trabajitos por cuenta propia: informales, en
       * efectivo y de unos pocos quetzales. No hay nada que depositar, no hay
       * a quién pedirle una cuenta siendo menor y sin patrono, y una pestaña
       * de banco delante de eso es una pestaña que se abre y se cierra. */
      if (e.educacion === 'primaria') return false;
      return e.empleo !== null && e.totales && e.totales.fugaEfectivo >= 30;
    },
    pista: 'Fíjate cuánto se te va del efectivo cada mes en el resumen. Cuando eso empiece a doler, el banco va a tener sentido.',
    titulo: 'Se abrió el banco',
    texto: 'Puedes abrir una cuenta de ahorro. Siendo menor de edad se abre con un adulto y con muy poco dinero, y no cobra manejo.',
    leccion: 'Mira los "gastos hormiga" de tus resúmenes: ese es tu dinero yéndose sin que lo decidas. Una cuenta no te hace rico; deja de hacerte pobre sin que te des cuenta.',
    icono: 'banco'
  },

  /* Y la monetaria llega cuando alguien te la pide.
   *
   * Es la diferencia que el juego quiere enseñar: la de ahorro es para guardar
   * y no cuesta nada; la monetaria es para operar, la pide un patrono formal
   * para acreditarte la planilla, y si nadie te acredita planilla el banco te
   * cobra manejo de cuenta cada mes. */
  {
    id: 'monetaria',
    llaves: ['monetaria'],
    cuando: function (e) {
      return (e.empleo !== null && e.empleo.formal) || e.edad >= CONFIG.mayoriaDeEdad;
    },
    pista: 'Con un empleo formal el patrono te va a pedir una cuenta monetaria para pagarte.',
    titulo: 'Se abrió la cuenta monetaria',
    texto: 'Es la cuenta para operar: ahí te deposita el sueldo una empresa, y de ahí sale el gasto. Con dos cuentas puedes separar lo que gastas de lo que guardas.',
    leccion: 'Ojo con el manejo de cuenta. Si tu sueldo lo deposita una empresa, el banco no te lo cobra; si no, son Q12 al mes por tener la cuenta abierta. Un producto que no necesitas no es gratis.',
    icono: 'tarjeta'
  },

  {
    /* Las noticias tampoco, mientras solo se estudie.
     *
     * Salían al segundo mes cerrado, o sea en medio de los cuatro meses en que
     * el juego es Mes y Estudio y nada más. Lo que hay dentro —el mercado
     * laboral, las promociones del banco— no le sirve de nada a alguien que
     * todavía no puede ni buscar trabajo ni abrir cuenta: es una pestaña más
     * que mirar y descartar. Llegan cuando ya hay a qué compararlas. */
    id: 'noticias',
    llaves: ['noticias'],
    cuando: function (e, M) {
      return e.mesesJugados >= 2 && (e.empleo !== null || M.desbloqueado('trabajo'));
    },
    pista: 'Cierra otro mes. Con dos meses de rodaje ya vas a ver qué te alcanza y qué no.',
    titulo: 'Se abrieron las noticias',
    texto: 'El mercado laboral, las promociones que el banco tiene vigentes y todo lo que te ha pasado, mes por mes.',
    leccion: 'El mercado laboral dice qué está pidiendo el país AHORA. Mirarlo antes de elegir carrera es la diferencia entre estudiar cinco años para algo saturado y estudiar dos para algo que nadie encuentra.',
    icono: 'periodico'
  },

  {
    id: 'credito',
    llaves: ['credito', 'informal'],
    cuando: function (e) {
      // Nadie le presta a un menor de edad. La segunda salida es por edad, no
      // por empleo: quien nunca trabaja también tiene que ver esta pantalla.
      return e.edad >= CONFIG.mayoriaDeEdad && (e.empleo !== null || e.edad >= 19);
    },
    pista: 'A los 18 el banco ya te puede mirar como cliente. Con empleo, mejor.',
    titulo: 'Se abrió el crédito',
    texto: 'Aparecen las dos puertas a la vez: el préstamo del banco y el prestamista del barrio.',
    leccion: 'Míralas juntas antes de tocar ninguna. El banco te pide historial y te cobra al año lo que el prestamista te cobra al mes. Esa es toda la diferencia, y es enorme.',
    icono: 'tarjeta'
  },

  {
    id: 'plazo',
    llaves: ['plazo'],
    cuando: function (e) {
      // A la mitad del mínimo: se ve la meta antes de poder alcanzarla.
      // Y a los seis meses igual, para que quien no ahorra sepa que existe.
      return (e.ahorro || 0) >= CONFIG.productos.plazo.aperturaMinima / 2 ||
             e.edad >= CONFIG.mayoriaDeEdad;
    },
    pista: 'Junta algo en la cuenta de ahorro. A la mitad del mínimo del plazo fijo te lo enseño.',
    titulo: 'Se abrió el depósito a plazo',
    texto: 'Dejas un monto quieto un tiempo pactado y rinde bastante más que el ahorro normal.',
    leccion: 'Lo que lo hace rendir es justo lo que lo hace incómodo: no lo puedes tocar. Si lo sacas antes, pierdes lo ganado. Ahí solo va dinero que de verdad no vas a necesitar.',
    icono: 'tendencia'
  },

  {
    id: 'tarjeta',
    llaves: ['tarjeta'],
    cuando: function (e) {
      // Con historial llega antes; al año llega igual, y entonces el propio
      // trámite le explica al jugador por qué no califica todavía.
      return (e.edad >= CONFIG.mayoriaDeEdad && e.puntaje >= CREDITOS.tarjeta.puntajeMinimo) ||
             e.edad >= 20;
    },
    pista: 'Construye historial. Pagar un préstamo a tiempo es lo que sube tu puntaje, y con puntaje llega la tarjeta.',
    titulo: 'Se abrió la tarjeta de crédito',
    texto: 'Tu historial ya alcanza para que el banco te dé una tarjeta.',
    leccion: 'La tarjeta no es dinero tuyo, es dinero prestado carísimo con un mes de gracia. Usada al contado es gratis y construye historial; pagando el mínimo es la deuda más cara que vas a tener en tu vida.',
    icono: 'tarjeta'
  },

  // ---------- estos llegan con la edad o con el historial ----------

  {
    id: 'migrar',
    llaves: ['migrar'],
    cuando: function (e) { return e.edad >= MIGRACION.edadMinima; },
    pista: null,
    titulo: 'Se abrió irse del país',
    texto: 'A tu edad ya puedes intentar el viaje a Estados Unidos.',
    leccion: 'Se gana mucho más en dólares y se gasta mucho más en dólares. No construyes historial aquí, cada envío pierde comisión, y el viaje se paga antes de salir.',
    icono: 'avion'
  },

  {
    id: 'pension',
    llaves: ['pension'],
    cuando: function (e) { return e.edad >= 23; },
    pista: null,
    titulo: 'Se abrió el plan de pensiones',
    texto: 'Un aporte mensual pequeño que no se toca hasta el retiro.',
    leccion: 'Es el único producto del juego donde llegar temprano vale más que poner mucho. Lo que separa una pensión digna de una miseria no es el monto del aporte, son los años que estuvo trabajando.',
    icono: 'palmera'
  },

  {
    id: 'casa',
    llaves: ['casa'],
    cuando: function (e) {
      // Con el historial que el banco pide, o a los 24 de todos modos: la
      // sección enseña casa por casa qué te falta, y esa es media lección.
      return e.puntaje >= HIPOTECA.puntajeMinimo || e.edad >= 25;
    },
    pista: null,
    titulo: 'Se abrió la casa propia',
    texto: 'Tu historial ya llega al mínimo que el banco pide para darte una hipoteca.',
    leccion: 'La casa es tuya el día que terminas de pagarla, no el día que te dan las llaves. Hasta entonces vives en la casa del banco y pagas por el privilegio.',
    icono: 'llave'
  }

];
