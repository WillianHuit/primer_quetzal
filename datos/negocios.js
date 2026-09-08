/* Mi Primer Quetzal — los negocios del jugador
 *
 * Aquí vive el imperio. Es la parte del juego donde el jugador deja de vender
 * su tiempo y empieza a comprar el de otros, que es la única frontera que de
 * verdad separa a quien trabaja de quien acumula.
 *
 * Antes había una sola "cadena de negocio" de cuatro escalones —canasta,
 * carreta, puesto, local— y era un adorno: subía un número y ya. Esto es otra
 * cosa. El jugador **abre negocios**, y cada negocio tiene **plazas** que se
 * llenan con sus propias jornadas o con **gente contratada**. Un negocio con
 * cuatro personas produce cuatro veces, y esas cuatro personas cuestan.
 *
 * ---------------------------------------------------------------------------
 * Las tres cosas que hay que entender antes de tocar los números
 * ---------------------------------------------------------------------------
 *
 * 1. LA UNIDAD ES LA JORNADA, Y UNA JORNADA ES 1/8 DE MES DE UNA PERSONA.
 *
 *    El mes del juego son ocho jornadas (cuatro semanas, mañana y tarde). Ocho
 *    jornadas es un mes completo de trabajo de una persona a tiempo completo.
 *    Así que `ventaPorJornada` multiplicado por ocho es **lo que vende el
 *    negocio en un mes con una sola persona adentro**. Es el número con el que
 *    hay que pensar, y por eso está escrito en el comentario de cada tipo.
 *
 * 2. LO QUE VENDE NO ES LO QUE GANA. Ese es el corazón de la lección.
 *
 *    Un comedor que vende Q20,800 al mes no gana Q20,800: gana lo que queda
 *    después de comprar la comida. `margen` es esa fracción. Es la cifra que
 *    más gente ignora al abrir un negocio y la que decide si el negocio
 *    existe. La pantalla muestra los dos números, siempre, uno al lado del
 *    otro.
 *
 * 3. LOS NEGOCIOS CHICOS SE PAGAN RAPIDÍSIMO Y NO SIRVEN PARA CRECER.
 *
 *    Un puesto de dulces se paga en menos de un mes. No es un error de
 *    balanceo: es economía real, y es la razón por la que hay un puesto de
 *    dulces en cada esquina del país. Lo que no puede es crecer, porque su
 *    límite no es el dinero, es que **solo cabe una persona**. El negocio
 *    grande es al revés: pide mucho capital, tarda dos años en pagarse, y es
 *    el único que aguanta gente adentro.
 *
 *    Que el jugador descubra eso solo —que su primer negocio fue una gran
 *    inversión y aun así lo dejó donde estaba— es más valioso que cualquier
 *    texto que le pongamos.
 *
 * ---------------------------------------------------------------------------
 * Cómo se le pone freno al imperio, sin mentir
 * ---------------------------------------------------------------------------
 * Un tycoon sin techo se vuelve una máquina de dinero y el juego deja de
 * enseñar. Los cuatro frenos de aquí abajo son todos reales, y ninguno es un
 * "no puedes porque no":
 *
 *   TECHO_NEGOCIOS    cuántos negocios puedes llevar a la vez. Depende de tu
 *                     estudio, porque llevar dos negocios a la vez es llevar
 *                     dos contabilidades.
 *   TECHO_EMPLEADOS   cuánta gente puedes administrar en total. Igual: quien
 *                     no sabe llevar una planilla no puede tener planilla.
 *   requiereNivel     los negocios grandes piden colegio terminado. Un taller
 *                     necesita cotizar, facturar y firmar un arrendamiento.
 *   RENDIMIENTO_SIN_DUENO  un negocio al que no le pones ni una jornada rinde
 *                     menos. Delegar funciona; desaparecer, no.
 *
 * Los dos techos son también el motivo por el que este archivo NO rompe el
 * mensaje del juego. Sin colegio se llega a un negocio con una persona
 * adentro; con licenciatura se llega a cinco negocios con catorce. La brecha
 * no la pone un castigo, la pone el tamaño de lo que puedes sostener.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Para agregar un negocio, copia un bloque y cambia:
 *
 *   id              nombre corto sin espacios ni acentos. Único.
 *   nombre          cómo se llama en pantalla. Corto: cabe en una tarjeta.
 *   icono           el dibujo. Ver js/iconos.js para los nombres que existen.
 *   costoApertura   lo que cuesta abrirlo, una sola vez.
 *   ventaPorJornada lo que vende una jornada de trabajo adentro (ver punto 1).
 *   margen          qué fracción de la venta queda después del producto.
 *   costoMensual    renta, luz, agua. Se paga aunque no vendas nada.
 *   plazas          cuánta gente cabe adentro, contándote a ti.
 *   edadMinima      nadie le renta un local a un niño de catorce.
 *   requiereNivel   nivel educativo mínimo, o null si no pide ninguno.
 *   descripcion     una línea. Sale en la tarjeta de oferta.
 *   leccion         qué enseña. Sale al abrirlo.
 *
 * Y si agregas uno, dibújale su pieza en js/escena.js. Si no, el jugador lo
 * compra y no ve nada nuevo en su terreno, que es la peor cosa que le puede
 * pasar a un tycoon. pruebas/imperio.js falla si te lo olvidas.
 */

/* Cuántas jornadas al mes aporta una persona contratada.
 * Ocho es el mes completo: se contrata a tiempo completo o no se contrata. */
var JORNADAS_POR_EMPLEADO = 8;

/* ---------------------------------------------------------------------------
 * Lo que de verdad cuesta contratar a alguien en Guatemala
 * ---------------------------------------------------------------------------
 * Esta es, probablemente, la lección más útil de todo el juego para quien
 * algún día tenga un negocio: **el sueldo no es lo que cuesta un empleado.**
 *
 * El informal cuesta el sueldo y nada más. El formal cuesta el sueldo
 * multiplicado por 1.42, más el bono de ley, porque encima del salario van:
 *
 *   IGSS patronal                     10.67%   [V-sec]
 *   IRTRA                              1.00%
 *   INTECAP                            1.00%
 *   aguinaldo (un sueldo al año)       8.33%
 *   Bono 14 (otro sueldo al año)       8.33%
 *   vacaciones (15 días hábiles)       4.17%
 *   provisión de indemnización         8.33%
 *                                    -------
 *                                     41.83%   -> factor 1.42
 *
 * Más la bonificación incentivo de Q250 al mes, que por ley no lleva IGSS.
 *
 * El sueldo del informal es [V] el ingreso medio de un trabajador informal
 * guatemalteco: Q1,977.3 (microdatos ENEIC IV-2025 del INE), redondeado.
 * El del formal es ESTIMACION cercana al salario mínimo no agrícola.
 *
 * Y contratar informal no es gratis: la gente se va más seguido, y hay
 * inspección. Los dos riesgos están abajo y los dos son el argumento honesto
 * a favor de formalizar, que es justo lo que el juego quiere enseñar.
 */
var PLANILLA = {
  informal: {
    nombre: 'Sin contrato',
    sueldo: 1980,
    factorPrestaciones: 1.00,
    bonoLey: 0,
    // Se va: sin contrato ni prestaciones, nadie se queda por gusto
    riesgoSeVa: 0.06,
    // Y puede caer inspección. La multa son tres sueldos.
    riesgoInspeccion: 0.004,
    multaEnSueldos: 3,
    nota: 'Barato hoy. Se te va, y si cae inspección la multa son tres sueldos.'
  },
  formal: {
    nombre: 'Con contrato',
    sueldo: 3520,
    factorPrestaciones: 1.42,
    bonoLey: 250,
    riesgoSeVa: 0.015,
    riesgoInspeccion: 0,
    multaEnSueldos: 0,
    nota: 'Cuesta el sueldo por 1.42, más Q250. Se queda, y no hay multa que temer.'
  }
};

/* Cuántos negocios se pueden llevar a la vez, según hasta dónde estudiaste.
 * Dos negocios son dos contabilidades, dos patentes y dos planillas.
 *
 * OJO CON EL PRIMER NÚMERO. Aquí decía 1, y era una trampa: un chico de trece
 * abre lo único que puede pagar —un puesto de dulces de Q450— y con un solo
 * espacio ya no puede abrir nada más NUNCA. Al medirlo salió que ese jugador
 * termina más pobre que uno que no abrió nada, porque se queda cincuenta años
 * con un puesto de dulces mientras podría haber tenido una tortillería.
 *
 * Con dos espacios desde el principio siempre hay sitio para crecer sin tener
 * que deshacer. El freno educativo del juego no vive aquí: vive en
 * TECHO_EMPLEADOS, que es el que de verdad decide el tamaño del imperio. */
var TECHO_NEGOCIOS = {
  primaria: 2,
  basicos: 3,
  diversificado: 4,
  tecnico: 5,
  licenciatura: 6,
  maestria: 8
};

/* Cuánta gente se puede administrar en total, sumando todos los negocios.
 * Es el techo que de verdad decide el tamaño del imperio, y por eso es el que
 * más premia haber estudiado. */
var TECHO_EMPLEADOS = {
  primaria: 1,
  basicos: 3,
  diversificado: 6,
  tecnico: 9,
  licenciatura: 14,
  maestria: 20
};

/* Un negocio al que el jugador no le pone ni una jornada este mes rinde esto.
 * Delegar funciona —por eso no es 0— pero el dueño ausente pierde plata. */
var RENDIMIENTO_SIN_DUENO = 0.70;

/* Cuánto varía la venta de un mes a otro.
 * Un negocio tiene meses buenos y meses malos, y verlo es parte de la
 * lección: un ingreso variable no sirve para comprometer gastos fijos. */
var NEGOCIO_VARIANZA = 0.25;

/* ---------------------------------------------------------------------------
 * Un negocio puede quebrar
 * ---------------------------------------------------------------------------
 * Sin esto, cualquier negocio con ganancia compuesto durante cuarenta años se
 * vuelve infinito y el juego deja de parecerse a la vida: la mayoría de los
 * negocios chicos de Guatemala no llega a los cinco años.
 *
 * Se evita con colchón, y ese es el punto: un negocio con tres meses de sus
 * propios costos guardados aguanta los meses malos. Es exactamente la lección
 * que un negocio propio tiene que enseñar, y la única forma honesta de ponerle
 * techo al imperio.
 */
var NEGOCIO_RIESGO_QUIEBRA = 0.006;   // ESTIMACION: uno cada catorce años
var NEGOCIO_MESES_DE_COLCHON = 3;

/* Que fraccion de lo invertido se recupera al traspasar un negocio.
 * La mitad. Un negocio usado vale menos que uno nuevo, y quien lo compra lo
 * sabe. Es la leccion del costo hundido: el dinero que ya pusiste no vuelve
 * completo, asi que la pregunta correcta nunca es "cuanto llevo invertido"
 * sino "cuanto gana de aqui en adelante". */
var TRASPASO_RECUPERA = 0.5;

/* ---------------------------------------------------------------------------
 * Los niveles de un negocio, iguales para todos los tipos
 * ---------------------------------------------------------------------------
 * Genéricos a propósito: el chico de trece sube su puesto de dulces con los
 * mismos cuatro escalones con los que el ingeniero de treinta sube su taller.
 * Es la misma pantalla y la misma decisión.
 *
 *   multiplicador  cuánto multiplica la venta por jornada
 *   plazasExtra    cuánta gente más cabe
 *   costoRelativo  lo que cuesta subir, en veces el costo de apertura
 */
var NIVELES_NEGOCIO = [
  { nombre: 'Recién abierto', multiplicador: 1.00, plazasExtra: 0, costoRelativo: 0 },
  { nombre: 'Con equipo',     multiplicador: 1.35, plazasExtra: 1, costoRelativo: 0.60 },
  { nombre: 'Con nombre',     multiplicador: 1.75, plazasExtra: 2, costoRelativo: 1.40 },
  { nombre: 'Con sucursal',   multiplicador: 2.30, plazasExtra: 4, costoRelativo: 3.00 }
];

var TIPOS_NEGOCIO = [

  /* ---------- los dos que puede abrir un niño ---------- */

  {
    // Con una persona: vende Q1,600 al mes y le quedan Q535. Se paga en menos
    // de un mes, y no crece nunca, porque solo cabe uno.
    id: 'dulces',
    nombre: 'Puesto de dulces',
    icono: 'dulce',
    costoApertura: 450,
    ventaPorJornada: 200,
    margen: 0.35,
    costoMensual: 25,
    plazas: 1,
    edadMinima: 13,
    requiereNivel: null,
    descripcion: 'Una caja de dulces comprada al mayoreo y una esquina.',
    leccion: 'Comprar al mayoreo y vender al menudeo: de cada Q100 que vendes te quedan Q35. Eso es el margen, y es lo primero que hay que saber de cualquier negocio.'
  },
  {
    // Con una persona: vende Q4,960 y le quedan Q1,864, que es casi
    // exactamente lo que gana un trabajador informal guatemalteco.
    id: 'refrescos',
    nombre: 'Venta de refrescos',
    icono: 'limonada',
    costoApertura: 2500,
    ventaPorJornada: 620,
    margen: 0.40,
    costoMensual: 120,
    plazas: 2,
    edadMinima: 13,
    requiereNivel: null,
    descripcion: 'Una hielera, un toldo y un lugar donde pase gente.',
    leccion: 'Este negocio, atendido por ti solo, deja casi lo mismo que gana un trabajador informal en Guatemala. La diferencia es que aquí el negocio es tuyo, y aquí cabe una segunda persona.'
  },

  /* ---------- los que no piden colegio, pero sí edad ---------- */

  {
    // Con una persona: vende Q5,600 y le quedan Q3,110. Margen altísimo
    // porque un servicio no compra producto: solo jabón y agua.
    id: 'lavado',
    nombre: 'Lavado de carros',
    icono: 'auto',
    costoApertura: 7000,
    ventaPorJornada: 700,
    margen: 0.60,
    costoMensual: 250,
    plazas: 3,
    edadMinima: 15,
    requiereNivel: null,
    descripcion: 'Agua, jabón, dos mangueras y ganas.',
    leccion: 'Fíjate en el margen: 60%, casi el doble que el puesto de dulces. Un servicio no tiene que comprar lo que vende. Vender tu trabajo deja más que revender cosas.'
  },
  {
    // Con una persona: vende Q10,400 y le quedan Q2,620. Vende el triple que
    // el lavado y gana menos: el margen manda.
    id: 'tortilleria',
    nombre: 'Tortillería',
    icono: 'sarten',
    costoApertura: 12000,
    ventaPorJornada: 1300,
    margen: 0.30,
    costoMensual: 500,
    plazas: 3,
    edadMinima: 15,
    requiereNivel: null,
    descripcion: 'Maíz, comal y clientela de todos los días.',
    leccion: 'Compara con el lavado de carros: la tortillería vende casi el doble y gana menos. Vender mucho no es ganar mucho. Lo único que importa es lo que queda.'
  },

  /* ---------- los que piden básicos terminados ---------- */

  {
    id: 'papeleria',
    nombre: 'Papelería',
    icono: 'portapapeles',
    costoApertura: 30000,
    ventaPorJornada: 1800,
    margen: 0.35,
    costoMensual: 1100,
    plazas: 4,
    edadMinima: 16,
    requiereNivel: 'basicos',
    descripcion: 'Cuadernos, copias y todo lo que se acaba en enero.',
    leccion: 'Este es el primer negocio que te pide básicos terminados, y no es capricho: hay que llevar inventario, sacar patente y firmar un arrendamiento. Es la primera vez que el colegio se convierte en dinero de forma directa.'
  },
  {
    id: 'comedor',
    nombre: 'Comedor',
    icono: 'plato',
    costoApertura: 60000,
    ventaPorJornada: 2600,
    margen: 0.30,
    costoMensual: 2400,
    plazas: 5,
    edadMinima: 18,
    requiereNivel: 'basicos',
    descripcion: 'Almuerzo corrido para los que trabajan cerca.',
    leccion: 'Q2,400 al mes de renta y luz que se pagan aunque llueva y no venga nadie. Ese es el gasto fijo, y es lo que hunde a los negocios: no vender poco un mes, sino tener que pagar igual.'
  },

  /* ---------- los que piden diversificado ---------- */

  {
    id: 'taller',
    nombre: 'Taller de motos',
    icono: 'llave-inglesa',
    costoApertura: 120000,
    ventaPorJornada: 2250,
    margen: 0.45,
    costoMensual: 3000,
    plazas: 5,
    edadMinima: 18,
    requiereNivel: 'diversificado',
    descripcion: 'Herramienta, repuestos y manos que sepan.',
    leccion: 'Q120,000 para abrirlo, y atendido por ti solo tarda dos años en pagarse. Lleno de gente tarda siete meses. Un negocio grande no se paga con tu trabajo: se paga con el de los demás.'
  },
  {
    id: 'cafeinternet',
    nombre: 'Café internet',
    icono: 'computadora',
    costoApertura: 90000,
    ventaPorJornada: 1900,
    margen: 0.55,
    costoMensual: 3800,
    plazas: 4,
    edadMinima: 18,
    requiereNivel: 'diversificado',
    descripcion: 'Diez máquinas, una impresora y buena señal.',
    leccion: 'Margen alto y gasto fijo alto a la vez. Las máquinas ya están pagadas, así que casi todo lo que entra queda; pero los Q3,800 de renta e internet corren aunque nadie venga.'
  },

  /* ---------- el que pide universidad ---------- */

  {
    // Con una persona no sirve: Q1,152 al mes sobre Q250,000, o sea dieciocho
    // anios en pagarse. Lleno de gente deja Q28,480 al mes. Es el negocio de
    // volumen, y es el que explica por
    // qué existen los negocios de volumen.
    id: 'distribuidora',
    nombre: 'Distribuidora',
    icono: 'warehouse',
    costoApertura: 250000,
    ventaPorJornada: 5200,
    margen: 0.22,
    costoMensual: 8000,
    plazas: 8,
    edadMinima: 21,
    requiereNivel: 'licenciatura',
    descripcion: 'Bodega, camión y una ruta de tiendas que te esperan.',
    leccion: 'Con una sola persona adentro este negocio casi no gana nada: el margen es del 22% y la renta se lo come. Lleno de gente deja Q28,480 al mes. Hay negocios que solo existen si son grandes, y por eso hay que saber cuál es cuál antes de meter el dinero.'
  }
];
