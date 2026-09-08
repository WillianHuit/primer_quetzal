/* Mi Primer Quetzal — mejoras
 *
 * La capa de tycoon del juego, y la razón por la que un chico de trece años
 * sigue jugando después del tercer mes.
 *
 * Hasta aquí el juego pedía repartir jornadas y mirar cómo bajaba el saldo. Es
 * fiel a la vida y es aburrido: no había nada que construir, nada que subiera
 * de nivel, nada que se viera crecer. Las mejoras son eso. Se compran con el
 * mismo dinero de todo lo demás, así que comprarlas es dejar de tener ese
 * dinero, y ahí está la lección: **una mejora no es un gasto, es una
 * inversión, y una inversión se mide en cuántos meses se paga sola.**
 *
 * ---------------------------------------------------------------------------
 * Genéricas a propósito
 * ---------------------------------------------------------------------------
 * No son mejoras "de vendedor de dulces" ni "de ingeniero": son cuatro cadenas
 * que sirven en TODAS las etapas de la vida, y en cada etapa el siguiente
 * escalón cuesta más y da más. El chico de 13 mejora su canasta de dulces y sus
 * útiles escolares; el ingeniero de 30 mejora su taller y su certificación. Es
 * la misma pantalla y la misma decisión.
 *
 *   escuela   lo que te hace estudiar más rápido
 *   oficio    lo que te hace ganar más por jornada trabajada
 *   negocio   lo que produce dinero SIN gastar jornadas
 *   casa      lo que te hace descansar mejor
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada mejora tiene:
 *
 *   cadena      a qué grupo pertenece (arriba). Dentro de una cadena, el orden
 *               de esta lista ES el orden de los niveles.
 *   requiereNivel  nivel educativo mínimo. Los dos escalones grandes del
 *               negocio lo piden, y no es un adorno: es lo que evita que el
 *               juego enseñe que el colegio es una pérdida de tiempo. Sin
 *               básicos se llega a la carreta y ahí se para.
 *   nombre      cómo se llama. Corto: cabe en una tarjeta.
 *   icono       el dibujo. Es lo que el jugador va a ver crecer.
 *   costo       lo que cuesta comprarla, una sola vez.
 *   edadMinima  opcional. Nadie le renta un local a un niño de catorce.
 *   efecto      qué hace, para siempre:
 *
 *      bonoJornada    quetzales extra por cada jornada TRABAJADA
 *      avanceEstudio  meses de carrera extra por cada jornada ESTUDIADA
 *      ingresoPasivo  quetzales al mes que entran sin gastar jornadas
 *      costoMensual   lo que cuesta mantenerla cada mes (los negocios lo tienen)
 *      energiaExtra   energía extra por cada jornada de DESCANSO
 *
 *   leccion     lo que enseña. Sale al comprarla.
 *
 * OJO al agregar una: el `costo` dividido entre lo que da al mes es el número
 * que de verdad importa, porque es lo que el juego le enseña a calcular. Debajo
 * de seis meses de retorno la mejora es obvia y no se decide nada; arriba de
 * treinta, nadie la compra nunca. El punto dulce anda entre ocho y quince.
 */

/* Cuanto varia lo que produce el negocio de un mes a otro.
 * Un negocio tiene meses buenos y meses malos, y verlo es parte de la
 * leccion: un ingreso variable no sirve para comprometer gastos fijos. */
var NEGOCIO_VARIANZA = 0.25;

/* ---------------------------------------------------------------------------
 * El negocio puede quebrar
 * ---------------------------------------------------------------------------
 * Sin esto, cualquier ingreso pasivo positivo compuesto durante cuarenta anios
 * se vuelve una maquina de dinero y el juego deja de parecerse a la vida: la
 * mayoria de los negocios chicos no llega a los cinco anios.
 *
 * La probabilidad es por mes y solo aplica al negocio ya montado. Y se puede
 * evitar: un negocio con colchon de capital de trabajo aguanta los meses
 * malos. Eso es exactamente la leccion que un negocio propio tiene que
 * enseniar, y es la unica forma honesta de poner un techo.
 */
var NEGOCIO_RIESGO_QUIEBRA = 0.006;      // ESTIMACION: uno cada 14 anios
var NEGOCIO_MESES_DE_COLCHON = 3;        // meses de venta guardados que lo protegen

var CADENAS = [
  {
    id: 'negocio',
    nombre: 'Tu negocio',
    icono: 'carrito',
    descripcion: 'Produce dinero sin gastarte jornadas. Es lo único que trabaja cuando tú no.'
  },
  {
    id: 'oficio',
    nombre: 'Tus herramientas',
    icono: 'llave-inglesa',
    descripcion: 'Te hacen ganar más por cada jornada que trabajas.'
  },
  {
    id: 'escuela',
    nombre: 'Tu estudio',
    icono: 'mochila',
    descripcion: 'Te hacen avanzar más rápido por cada jornada que estudias.'
  },
  {
    id: 'casa',
    nombre: 'Tu descanso',
    icono: 'luna',
    descripcion: 'Te hacen recuperar más energía por cada jornada de descanso.'
  }
];

var MEJORAS = [

  // ---------- negocio: la cadena larga, la que se ve crecer ----------
  {
    id: 'canasta',
    cadena: 'negocio',
    nombre: 'Una canasta propia',
    icono: 'canasta',
    costo: 180,
    efecto: { ingresoPasivo: 30 },
    leccion: 'Q180 que te devuelven Q30 al mes se pagan solos en seis meses. Ese número —cuántos meses tarda en pagarse— es el único que hay que calcular antes de comprar algo para trabajar.'
  },
  {
    id: 'carreta',
    cadena: 'negocio',
    nombre: 'Una carreta',
    icono: 'carrito',
    costo: 1000,
    edadMinima: 15,
    efecto: { ingresoPasivo: 120, costoMensual: 20 },
    leccion: 'Fíjate que ahora hay un costo mensual. Todo negocio tiene gastos fijos, y lo que importa no es lo que entra: es lo que queda.'
  },
  {
    id: 'puesto',
    cadena: 'negocio',
    nombre: 'Un puesto en el mercado',
    icono: 'tienda',
    costo: 4500,
    edadMinima: 16,
    requiereNivel: 'basicos',
    efecto: { ingresoPasivo: 430, costoMensual: 130 },
    leccion: 'Un puesto pide básicos terminados, y no por capricho: hay que llevar cuentas, firmar un arrendamiento y sacar una patente. Es la primera vez que el colegio se convierte en dinero de forma directa.'
  },
  {
    id: 'local',
    cadena: 'negocio',
    nombre: 'Un local con puerta',
    icono: 'edificio',
    costo: 22000,
    edadMinima: 18,
    requiereNivel: 'diversificado',
    efecto: { ingresoPasivo: 1350, costoMensual: 430 },
    leccion: 'Q22,000 que dejan Q920 limpios al mes se pagan en dos años. Un depósito a plazo con los mismos Q22,000 te daría Q116 al mes. El negocio propio rinde mucho más que el banco, y a cambio puede quebrar: guarda tres meses de venta y aguanta los meses malos.'
  },

  // ---------- oficio: lo que hace rendir la jornada ----------
  {
    id: 'herramienta',
    cadena: 'oficio',
    nombre: 'Tu propia herramienta',
    icono: 'martillo',
    costo: 220,
    efecto: { bonoJornada: 3 },
    leccion: 'Con herramienta prestada ganas lo que te dejen ganar. Es el gasto más chico que sube lo que cobras por hora.'
  },
  {
    id: 'uniforme',
    cadena: 'oficio',
    nombre: 'Ropa de trabajo',
    icono: 'etiqueta',
    costo: 700,
    efecto: { bonoJornada: 6 },
    leccion: 'Presentarse bien no es vanidad: es lo que hace que te vuelvan a llamar. En trabajo por encargo, la mitad del ingreso es que te recomienden.'
  },
  {
    id: 'transporte',
    cadena: 'oficio',
    nombre: 'Cómo moverte',
    icono: 'moto',
    costo: 1800,
    edadMinima: 16,
    efecto: { bonoJornada: 18, costoMensual: 45 },
    leccion: 'Moverte por tu cuenta te abre el doble de trabajos, y te mete un gasto fijo de gasolina y mantenimiento. Casi todas las mejoras grandes son así: suben el ingreso y suben el piso. Mira los dos números, no solo el primero.'
  },

  // ---------- escuela: lo que hace rendir el estudio ----------
  {
    id: 'utiles',
    cadena: 'escuela',
    nombre: 'Útiles completos',
    icono: 'portapapeles',
    costo: 120,
    efecto: { avanceEstudio: 0.02 },
    leccion: 'Estudiar sin útiles es estudiar a medias. Es la inversión más barata del juego y la que menos gente hace.'
  },
  {
    id: 'libros',
    cadena: 'escuela',
    nombre: 'Tus propios libros',
    icono: 'libros',
    costo: 550,
    efecto: { avanceEstudio: 0.05 },
    leccion: 'Los libros no caducan y sirven para el hermano que viene detrás. Hay gastos que se usan una vez y gastos que se quedan.'
  },
  {
    id: 'internet',
    cadena: 'escuela',
    nombre: 'Internet en casa',
    icono: 'computadora',
    costo: 1800,
    efecto: { avanceEstudio: 0.08, costoMensual: 230 },
    leccion: 'Q230 al mes para siempre. Antes de firmar cualquier cosa con cuota mensual, multiplícala por los meses que la vas a pagar: son Q2,760 al año.'
  },

  // ---------- casa: lo que hace rendir el descanso ----------
  {
    id: 'escritorio',
    cadena: 'casa',
    nombre: 'Un rincón para ti',
    icono: 'casa',
    costo: 260,
    efecto: { energiaExtra: 4 },
    leccion: 'Descansar mejor no es un lujo: es lo que te deja trabajar una jornada más sin enfermarte, y enfermarse cuesta más que cualquier mejora.'
  },
  {
    id: 'cama',
    cadena: 'casa',
    nombre: 'Una cama de verdad',
    icono: 'luna',
    costo: 1400,
    efecto: { energiaExtra: 9 },
    leccion: 'La salud es el activo que no aparece en ningún estado de cuenta y el único que, si se rompe, se lleva todos los demás.'
  }
];

/* Cuánto sube el precio de una mejora cuando la compras siendo mayor.
 * No existe: los precios son los mismos toda la vida. Se deja escrito para
 * que quede claro que es a propósito y no un olvido. */
var MEJORAS_SUBEN_CON_LA_EDAD = false;
