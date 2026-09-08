/* Mi Primer Quetzal — el escenario que crece
 *
 * Lo que le faltaba al juego para parecer un tycoon.
 *
 * Las mejoras ya subían de nivel y ya cambiaban los números, pero el jugador
 * no veía nada: leía "Nivel 2 de 4" y tenía que imaginárselo. Un tycoon se
 * mira. Esto dibuja el negocio del jugador y le va agregando cosas conforme
 * compra: la canasta en el suelo, después la carreta con sus ruedas, después el
 * puesto con su toldo, y al final un local con puerta, ventana y rótulo.
 *
 * Las otras tres cadenas también aparecen, alrededor: la mochila y los libros
 * si está estudiando, la caja de herramientas y la bicicleta si compró
 * herramientas, el banquito y la lámpara si arregló su casa. La escena de
 * alguien que lleva veinte niveles comprados está llena de cosas, y eso —que se
 * vea lleno— es todo el premio.
 *
 * ---------------------------------------------------------------------------
 * Cómo está dibujado
 * ---------------------------------------------------------------------------
 * SVG propio, de una sola cuadrícula de 200x116, en el estilo de los paquetes
 * de arte de juego: formas macizas, esquinas redondas y contorno gordo del
 * color de la tinta. No hay imágenes que cargar ni librería que instalar, y
 * **todos los colores salen de la paleta**: si mañana cambia --verde, cambia
 * el toldo del puesto.
 *
 * Se dibuja por capas y de atrás hacia adelante: suelo, negocio, cosas
 * alrededor, personaje. Cada pieza es una función que devuelve su trozo de SVG
 * y no sabe nada de las demás.
 *
 * ---------------------------------------------------------------------------
 * Las zonas, que es lo único que hay que respetar al agregar una pieza
 * ---------------------------------------------------------------------------
 * Como ninguna pieza sabe de las otras, lo único que evita que se encimen es
 * este reparto del eje horizontal. La primera versión no lo tenía y el rótulo
 * del oficio le quedó cruzado en la cara al personaje.
 *
 *      x: 2         26          70    92              168      198
 *         |  CASA   | PERSONAJE | OFI |    NEGOCIO     | ESCUELA |
 *
 * El rótulo colgado del oficio es la única pieza que sale de su zona, y lo
 * hace hacia arriba (y < 42), donde no hay nada.
 */

var Escena = (function () {

  var C = {
    verde:  'var(--verde, #1f7a5a)',
    claro:  'var(--verde-claro, #e6f3ee)',
    azul:   'var(--azul, #2c5f8a)',
    ambar:  'var(--ambar, #b5811f)',
    rojo:   'var(--rojo, #b8422e)',
    tinta:  'var(--tinta, #16211d)',
    linea:  'var(--linea, #dbe4e0)',
    madera: '#b8895a',
    lona:   '#f4f1e6'
  };

  // El contorno gordo que le da el aire de juego a todo
  function T(g) { return ' stroke="' + C.tinta + '" stroke-width="' + (g || 2.4) +
                         '" stroke-linejoin="round" stroke-linecap="round"'; }

  // ---------- el suelo ----------

  function suelo() {
    return '<rect x="2" y="96" width="196" height="18" rx="7" fill="' + C.claro + '"' + T() + '/>' +
           '<path d="M14 105h20M52 108h16M120 105h22M158 108h14"' +
             ' stroke="' + C.verde + '" stroke-width="2" stroke-linecap="round" opacity=".55"/>';
  }

  function sol() {
    return '<circle cx="152" cy="16" r="10" fill="' + C.ambar + '" opacity=".22"/>' +
           '<circle cx="152" cy="16" r="6.5" fill="' + C.ambar + '" opacity=".48"/>';
  }

  // ---------- el negocio, nivel por nivel ----------

  var NEGOCIO = [
    // 0: todavía nada. Un cajón vacío en el suelo, para que se note el hueco.
    function () {
      return '<rect x="112" y="82" width="30" height="14" rx="3" fill="none"' +
             ' stroke="' + C.linea + '" stroke-width="2.4" stroke-dasharray="5 4"/>';
    },
    // 1: una canasta
    function () {
      return '<path d="M108 78h34l-4 18h-26z" fill="' + C.ambar + '" opacity=".75"' + T() + '/>' +
             '<path d="M115 78c0-7 4-11 10-11s10 4 10 11" fill="none"' + T(2) + '/>' +
             '<path d="M110 85h30" stroke="' + C.tinta + '" stroke-width="1.6" opacity=".5"/>' +
             '<circle cx="120" cy="90" r="2.6" fill="' + C.rojo + '"' + T(1.4) + '/>' +
             '<circle cx="130" cy="90" r="2.6" fill="' + C.rojo + '"' + T(1.4) + '/>';
    },
    // 2: una carreta con ruedas
    function () {
      return '<path d="M100 70h48l-3 18h-42z" fill="' + C.madera + '"' + T() + '/>' +
             '<path d="M103 78h42" stroke="' + C.tinta + '" stroke-width="1.6" opacity=".45"/>' +
             '<path d="M148 74l12-6" fill="none"' + T(2.2) + '/>' +
             '<circle cx="112" cy="93" r="7" fill="' + C.tinta + '"/>' +
             '<circle cx="112" cy="93" r="2.6" fill="' + C.linea + '"/>' +
             '<circle cx="138" cy="93" r="7" fill="' + C.tinta + '"/>' +
             '<circle cx="138" cy="93" r="2.6" fill="' + C.linea + '"/>' +
             '<rect x="106" y="60" width="12" height="10" rx="2" fill="' + C.rojo + '" opacity=".8"' + T(1.8) + '/>' +
             '<rect x="122" y="62" width="14" height="8" rx="2" fill="' + C.verde + '" opacity=".8"' + T(1.8) + '/>';
    },
    // 3: un puesto con toldo y mostrador
    function () {
      return '<path d="M96 60h56v6H96z" fill="' + C.madera + '"' + T() + '/>' +
             // el toldo a rayas
             '<path d="M92 60l8-18h48l8 18z" fill="' + C.lona + '"' + T() + '/>' +
             '<path d="M104 42l-5 18M118 42l-3 18M132 42l3 18M146 42l5 18"' +
               ' stroke="' + C.rojo + '" stroke-width="4" opacity=".8"/>' +
             // patas y mostrador
             '<path d="M99 66v30M149 66v30"' + T(2.6) + '/>' +
             '<rect x="96" y="80" width="56" height="10" rx="2" fill="' + C.madera + '"' + T() + '/>' +
             '<rect x="104" y="70" width="12" height="9" rx="2" fill="' + C.verde + '" opacity=".85"' + T(1.8) + '/>' +
             '<rect x="122" y="70" width="12" height="9" rx="2" fill="' + C.ambar + '" opacity=".85"' + T(1.8) + '/>' +
             '<circle cx="144" cy="75" r="4" fill="' + C.rojo + '" opacity=".85"' + T(1.6) + '/>';
    },
    // 4: un local con puerta, ventana y rótulo
    function () {
      return '<rect x="96" y="38" width="68" height="58" rx="4" fill="' + C.claro + '"' + T(2.6) + '/>' +
             // techo
             '<path d="M90 38l40-15 40 15z" fill="' + C.rojo + '" opacity=".85"' + T(2.6) + '/>' +
             // rótulo
             '<rect x="104" y="43" width="50" height="13" rx="3" fill="' + C.verde + '"' + T(2) + '/>' +
             '<path d="M112 49.5h34" stroke="' + C.lona + '" stroke-width="3" stroke-linecap="round"/>' +
             // ventana
             '<rect x="103" y="63" width="22" height="20" rx="2" fill="' + C.azul + '" opacity=".35"' + T(2) + '/>' +
             '<path d="M114 63v20M103 73h22" stroke="' + C.tinta + '" stroke-width="1.8"/>' +
             // puerta
             '<rect x="134" y="64" width="22" height="32" rx="2" fill="' + C.madera + '"' + T(2.2) + '/>' +
             '<circle cx="139" cy="81" r="1.8" fill="' + C.tinta + '"/>';
    }
  ];

  // ---------- lo que aportan las otras cadenas ----------

  /* Zona x: 70 a 90, y el rótulo colgado hacia arriba. */
  var OFICIO = [
    function () { return ''; },
    // caja de herramientas
    function () {
      return '<rect x="70" y="84" width="19" height="12" rx="2" fill="' + C.rojo + '" opacity=".85"' + T(1.8) + '/>' +
             '<path d="M75 84v-4h9v4" fill="none"' + T(1.8) + '/>' +
             '<path d="M70 89h19" stroke="' + C.tinta + '" stroke-width="1.4" opacity=".5"/>';
    },
    // un rótulo colgado, que es lo que hace que te vuelvan a llamar
    function () {
      return '<path d="M70 84h19v12h-19z" fill="' + C.rojo + '" opacity=".85"' + T(1.8) + '/>' +
             '<path d="M75 84v-4h9v4" fill="none"' + T(1.8) + '/>' +
             '<path d="M80 14v10" fill="none"' + T(1.8) + '/>' +
             '<rect x="64" y="24" width="32" height="16" rx="4" fill="' + C.lona + '"' + T(1.8) + '/>' +
             '<path d="M71 32h18" stroke="' + C.verde + '" stroke-width="3" stroke-linecap="round"/>';
    },
    // una bicicleta
    function () {
      return '<path d="M80 14v10" fill="none"' + T(1.8) + '/>' +
             '<rect x="64" y="24" width="32" height="16" rx="4" fill="' + C.lona + '"' + T(1.8) + '/>' +
             '<path d="M71 32h18" stroke="' + C.verde + '" stroke-width="3" stroke-linecap="round"/>' +
             '<circle cx="72" cy="89" r="6.5" fill="none"' + T(2.2) + '/>' +
             '<circle cx="88" cy="89" r="6.5" fill="none"' + T(2.2) + '/>' +
             '<path d="M72 89l7-11h6l3 11M79 78h6M81 89h7" fill="none"' + T(2) + '/>' +
             '<path d="M84 76h5" fill="none"' + T(2) + '/>';
    }
  ];

  var ESCUELA = [
    function () { return ''; },
    // una mochila en el suelo
    function () {
      return '<path d="M174 78h16v16a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2z" fill="' + C.rojo + '" opacity=".8"' + T(1.8) + '/>' +
             '<path d="M178 78v-4a4 4 0 0 1 8 0v4" fill="none"' + T(1.6) + '/>';
    },
    // libros apilados
    function () {
      return '<rect x="170" y="88" width="24" height="5" rx="1.5" fill="' + C.azul + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="172" y="83" width="20" height="5" rx="1.5" fill="' + C.verde + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="174" y="78" width="17" height="5" rx="1.5" fill="' + C.ambar + '" opacity=".85"' + T(1.4) + '/>';
    },
    // una antena, que es el internet en casa
    function () {
      return '<rect x="170" y="88" width="24" height="5" rx="1.5" fill="' + C.azul + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="172" y="83" width="20" height="5" rx="1.5" fill="' + C.verde + '" opacity=".85"' + T(1.4) + '/>' +
             '<path d="M182 78V58" fill="none"' + T(2) + '/>' +
             '<path d="M176 60a9 9 0 0 1 12 0" fill="none"' + T(1.8) + '/>' +
             '<path d="M172 54a15 15 0 0 1 20 0" fill="none"' + T(1.6) + '/>';
    }
  ];

  /* Zona x: 2 a 26, al borde izquierdo. */
  var CASA = [
    function () { return ''; },
    // un banquito
    function () {
      return '<rect x="5" y="86" width="17" height="4.5" rx="1.5" fill="' + C.madera + '"' + T(1.6) + '/>' +
             '<path d="M8 90.5v6M19 90.5v6" fill="none"' + T(1.8) + '/>';
    },
    // una lámpara de pie, con su banquito abajo
    function () {
      return '<rect x="5" y="86" width="17" height="4.5" rx="1.5" fill="' + C.madera + '"' + T(1.6) + '/>' +
             '<path d="M8 90.5v6M19 90.5v6" fill="none"' + T(1.8) + '/>' +
             '<path d="M13.5 86V58" fill="none"' + T(2) + '/>' +
             '<path d="M5 58h17l-4.5-11h-8z" fill="' + C.ambar + '" opacity=".8"' + T(1.8) + '/>' +
             '<circle cx="13.5" cy="62" r="2.6" fill="' + C.ambar + '"/>';
    }
  ];

  /* Las monedas que suben del negocio. Solo salen si el negocio produce, y es
   * la parte que hace que la pantalla se sienta viva: es lo único que se mueve
   * sin que el jugador toque nada. */
  function monedas(cuantas) {
    var h = '';
    var sitios = [[104, 56], [126, 48], [146, 58]];
    for (var i = 0; i < Math.min(cuantas, 3); i++) {
      h += '<g class="esc-moneda esc-moneda-' + (i + 1) + '">' +
             '<circle cx="' + sitios[i][0] + '" cy="' + sitios[i][1] + '" r="6" fill="' + C.ambar + '"' + T(1.8) + '/>' +
             '<path d="M' + (sitios[i][0] - 2.5) + ' ' + sitios[i][1] +
               'h5" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
           '</g>';
    }
    return h;
  }

  /* El personaje, encogido y puesto de pie en el suelo de la escena.
   * Se reusa js/personaje.js entero: aquí solo se lo coloca. */
  function personaje(op) {
    if (typeof Personaje === 'undefined') return '';
    var muneco = Personaje.dibujar(op).replace('<svg class="muneco"',
      '<svg x="0" y="0" width="64" height="96" viewBox="0 0 64 96"');
    /* La escala y el desplazamiento estan calculados para que los pies caigan
     * justo sobre el suelo (y = 100) y el muneco quepa entero: a 0.78 salia
     * enorme y con las piernas cortadas por la plataforma. */
    return '<g transform="translate(28, 42) scale(0.62)">' + muneco + '</g>';
  }

  function pieza(lista, nivel) {
    var i = Math.max(0, Math.min(nivel, lista.length - 1));
    return lista[i]();
  }

  /* Dibuja la escena completa.
   *
   *   negocio, oficio, escuela, casa   el nivel de cada cadena
   *   produce   true si el negocio esta dando dinero: saca las monedas
   *   trabajo   id del empleo, para vestir al personaje
   *   estudia   true si va al colegio
   */
  function dibujar(op) {
    var o = op || {};
    var h = '<svg class="escena" viewBox="0 0 200 116" aria-hidden="true" focusable="false">';
    h += sol();
    h += suelo();
    h += pieza(ESCUELA, o.escuela || 0);
    h += pieza(NEGOCIO, o.negocio || 0);
    h += pieza(CASA, o.casa || 0);
    h += pieza(OFICIO, o.oficio || 0);
    if (o.produce) h += monedas((o.negocio || 0) + 1);
    h += personaje({ trabajo: o.trabajo, estudia: o.estudia, graduado: o.graduado });
    return h + '</svg>';
  }

  return {
    dibujar: dibujar,
    // Cuántos niveles sabe dibujar de cada cadena, que es lo que la prueba
    // compara contra datos/mejoras.js: una cadena más larga que su dibujo
    // dejaría de crecer en pantalla sin que nadie se diera cuenta.
    niveles: {
      negocio: NEGOCIO.length - 1,
      oficio: OFICIO.length - 1,
      escuela: ESCUELA.length - 1,
      casa: CASA.length - 1
    }
  };
})();
