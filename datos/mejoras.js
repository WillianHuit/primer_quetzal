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
 * Estas son mejoras PARA TI. Los negocios están en datos/negocios.js
 * ---------------------------------------------------------------------------
 * Aquí hubo una cuarta cadena, `negocio`, con cuatro escalones: canasta,
 * carreta, puesto y local. Se fue, y con razón: era un negocio de mentira, un
 * número que subía. El negocio de verdad —abrirlo, subirle el nivel, contratar
 * gente, verlo quebrar— vive ahora en datos/negocios.js.
 *
 * Lo que queda aquí son las tres cadenas que mejoran a la PERSONA, y esas
 * siguen teniendo todo el sentido: son genéricas a propósito, sirven en TODAS
 * las etapas de la vida, y en cada etapa el siguiente escalón cuesta más y da
 * más. El chico de 13 compra sus útiles; el ingeniero de 30 compra su
 * certificación. Es la misma pantalla y la misma decisión.
 *
 *   escuela   lo que te hace estudiar más rápido
 *   oficio    lo que te hace ganar más por jornada trabajada
 *   casa      lo que te hace descansar mejor
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada mejora tiene:
 *
 *   cadena      a qué grupo pertenece (arriba). Dentro de una cadena, el orden
 *               de esta lista ES el orden de los niveles.
 *   requiereNivel  nivel educativo mínimo, si lo pide alguna. Ninguna de las
 *               tres cadenas de aquí lo usa hoy; el freno educativo del juego
 *               vive en los techos de datos/negocios.js.
 *   nombre      cómo se llama. Corto: cabe en una tarjeta.
 *   icono       el dibujo. Es lo que el jugador va a ver crecer.
 *   costo       lo que cuesta comprarla, una sola vez.
 *   edadMinima  opcional. Nadie le renta un local a un niño de catorce.
 *   efecto      qué hace, para siempre:
 *
 *      bonoJornada    quetzales extra por cada jornada TRABAJADA
 *      avanceEstudio  meses de carrera extra por cada jornada ESTUDIADA
 *      costoMensual   lo que cuesta mantenerla cada mes (el transporte)
 *      energiaExtra   energía extra por cada jornada de DESCANSO
 *
 *   leccion     lo que enseña. Sale al comprarla.
 *
 * OJO al agregar una: el `costo` dividido entre lo que da al mes es el número
 * que de verdad importa, porque es lo que el juego le enseña a calcular. Debajo
 * de seis meses de retorno la mejora es obvia y no se decide nada; arriba de
 * treinta, nadie la compra nunca. El punto dulce anda entre ocho y quince.
 */

var CADENAS = [
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
