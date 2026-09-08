/* Mi Primer Quetzal — la calle del jugador
 *
 * Lo que hace que esto parezca un tycoon y no una hoja de cálculo.
 *
 * Aquí había un escenario con UN negocio que subía por cuatro escalones
 * dibujados a mano: canasta, carreta, puesto, local. Se quedó corto en cuanto
 * el jugador pudo tener varios negocios a la vez, que es de lo que va el juego
 * ahora. Esto dibuja **una calle**: un local por cada negocio abierto, con su
 * gente parada enfrente, y la calle se alarga conforme el imperio crece.
 *
 * Que la calle se alargue es a propósito y es la mitad del premio. Con un
 * negocio la escena cabe en la tarjeta; con cinco hay que arrastrar para verla
 * toda. El jugador nota que ya no le cabe lo que tiene.
 *
 * ---------------------------------------------------------------------------
 * Un local nuevo no necesita que nadie lo dibuje
 * ---------------------------------------------------------------------------
 * Esto es lo importante del archivo. El local NO está dibujado por tipo de
 * negocio: está dibujado una sola vez, de forma genérica, y crece con el nivel
 * (caja, toldo, rótulo, segundo piso). Lo único que distingue una tortillería
 * de un taller es el **emblema** de su fachada, y ese emblema sale de
 * `js/iconos.js` usando el campo `icono` que el tipo de negocio ya tiene.
 *
 * O sea: quien agregue un negocio a datos/negocios.js no tiene que dibujar
 * nada. Antes sí, y era una trampa: se agregaba un nivel, el jugador lo
 * compraba y la pantalla se veía igual.
 *
 * ---------------------------------------------------------------------------
 * Cómo está dibujado
 * ---------------------------------------------------------------------------
 * SVG propio, en el estilo de los paquetes de arte de juego: formas macizas,
 * esquinas redondas y contorno gordo del color de la tinta. No hay imágenes
 * que cargar ni librería que instalar, y **todos los colores salen de la
 * paleta**: si mañana cambia --verde, cambia el toldo.
 *
 * Se dibuja de atrás hacia adelante: cielo, suelo, cosas del margen, locales,
 * gente, personaje. Cada pieza es una función que devuelve su trozo de SVG y
 * no sabe nada de las demás.
 *
 * ---------------------------------------------------------------------------
 * Las zonas, que es lo único que hay que respetar al agregar una pieza
 * ---------------------------------------------------------------------------
 * Como ninguna pieza sabe de las otras, lo único que evita que se encimen es
 * este reparto del eje horizontal. La primera versión no lo tenía y el rótulo
 * del oficio le quedó cruzado en la cara al personaje.
 *
 *   x: 2    22        70        96      126                    126+46n
 *      |CASA| PERSONA | ESCUELA | OFICIO |  LA CALLE, 46 por local  |
 *
 * El suelo está en y = 96 y todo se para encima. El rótulo colgado del oficio
 * es la única pieza que sale de su zona, y lo hace hacia arriba (y < 42),
 * donde no hay nada.
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

  var X_CALLE = 126;      // donde empieza la calle
  var ANCHO_LOCAL = 46;   // lo que ocupa cada negocio
  var SUELO = 96;         // la línea donde todo se para

  /* Cuatro colores que se van repartiendo entre los locales, para que dos
   * negocios seguidos no salgan del mismo color. */
  var TECHOS = [C.rojo, C.verde, C.azul, C.ambar];

  function anchoDe(cuantos) {
    return Math.max(200, X_CALLE + Math.max(cuantos, 1) * ANCHO_LOCAL + 6);
  }

  // ---------- el fondo ----------

  function suelo(w) {
    return '<rect x="2" y="' + SUELO + '" width="' + (w - 4) + '" height="18" rx="7" fill="' +
             C.claro + '"' + T() + '/>' +
           '<path d="M14 105h20M52 108h16M100 105h16M150 108h18"' +
             ' stroke="' + C.verde + '" stroke-width="2" stroke-linecap="round" opacity=".55"/>';
  }

  function sol(w) {
    var cx = w - 26;
    return '<circle cx="' + cx + '" cy="16" r="10" fill="' + C.ambar + '" opacity=".22"/>' +
           '<circle cx="' + cx + '" cy="16" r="6.5" fill="' + C.ambar + '" opacity=".48"/>';
  }

  // ---------- un local ----------

  /* Lo que mide un local según su nivel. El techo sube: un negocio con
   * sucursal se ve más alto que uno recién abierto, y eso es todo lo que hay
   * que ver. */
  var ALTO_POR_NIVEL = [24, 30, 36, 46];

  function altoDe(nivel) {
    var i = Math.max(0, Math.min((nivel || 1) - 1, ALTO_POR_NIVEL.length - 1));
    return ALTO_POR_NIVEL[i];
  }

  /* El emblema de la fachada, tomado de js/iconos.js.
   *
   * Los trazos de ese archivo no traen color ni grosor —los pone el CSS
   * cuando van dentro de un <svg class="ic">— así que aquí hay que ponérselos
   * a mano en el grupo que los envuelve. */
  function emblema(nombre, cx, cy, lado) {
    if (typeof Iconos === 'undefined') return '';
    var d = Iconos.trazo(nombre);
    if (!d) return '';
    var s = lado / 24;
    return '<g transform="translate(' + (cx - lado / 2) + ',' + (cy - lado / 2) +
             ') scale(' + s.toFixed(3) + ')" fill="none" stroke="' + C.tinta +
             '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
             ' opacity=".85">' + d + '</g>';
  }

  /* El terreno vacío. Sale cuando el jugador todavía no tiene ningún negocio,
   * y sale con el contorno punteado para que se note que ahí falta algo. */
  function terrenoVacio(x0) {
    var x = x0 + 7;
    return '<rect x="' + x + '" y="' + (SUELO - 14) + '" width="32" height="14" rx="3"' +
             ' fill="none" stroke="' + C.linea + '" stroke-width="2.4" stroke-dasharray="5 4"/>';
  }

  /* Un local completo. Genérico: lo único propio del negocio es el emblema.
   *
   *   x0        dónde empieza su hueco en la calle
   *   nivel     1 a 4. Sube el techo y le agrega toldo, rótulo y segundo piso
   *   icono     el emblema de la fachada
   *   color     índice del color de techo
   */
  function local(x0, nivel, icono, color) {
    var n = Math.max(1, Math.min(nivel || 1, ALTO_POR_NIVEL.length));
    var alto = altoDe(n);
    var x = x0 + 7;
    var y = SUELO - alto;
    var techo = TECHOS[color % TECHOS.length];
    var h = '';

    // el segundo piso, que es lo que hace que el nivel 4 se vea de lejos
    if (n >= 4) {
      h += '<rect x="' + (x + 4) + '" y="' + (y - 12) + '" width="24" height="13" rx="3" fill="' +
             C.claro + '"' + T(2.2) + '/>' +
           '<rect x="' + (x + 10) + '" y="' + (y - 9) + '" width="11" height="8" rx="1.5" fill="' +
             C.azul + '" opacity=".35"' + T(1.6) + '/>';
    }

    // el cuerpo y el techo
    h += '<rect x="' + x + '" y="' + y + '" width="32" height="' + alto + '" rx="3" fill="' +
           C.claro + '"' + T(2.4) + '/>';
    h += '<path d="M' + (x - 4) + ' ' + y + 'L' + (x + 16) + ' ' + (y - 9) +
           'L' + (x + 36) + ' ' + y + 'z" fill="' + techo + '" opacity=".85"' + T(2.2) + '/>';

    // el toldo a rayas, desde el nivel 2
    if (n >= 2) {
      h += '<path d="M' + (x - 2) + ' ' + (y + 9) + 'h36l-4 8h-28z" fill="' + C.lona + '"' + T(2) + '/>' +
           '<path d="M' + (x + 6) + ' ' + (y + 9) + 'l-2 8M' + (x + 16) + ' ' + (y + 9) + 'v8M' +
             (x + 26) + ' ' + (y + 9) + 'l2 8" stroke="' + techo +
             '" stroke-width="3" opacity=".75"/>';
    }

    // el rótulo con su nombre, desde el nivel 3
    if (n >= 3) {
      h += '<rect x="' + (x + 3) + '" y="' + (y + 20) + '" width="26" height="8" rx="2" fill="' +
             C.verde + '"' + T(1.8) + '/>' +
           '<path d="M' + (x + 8) + ' ' + (y + 24) + 'h16" stroke="' + C.lona +
             '" stroke-width="2.4" stroke-linecap="round"/>';
    }

    // la puerta, siempre
    h += '<rect x="' + (x + 21) + '" y="' + (SUELO - 15) + '" width="9" height="15" rx="1.5" fill="' +
           C.madera + '"' + T(2) + '/>';

    // y el emblema, que es lo único que dice qué negocio es
    h += emblema(icono, x + 11, SUELO - (n >= 3 ? 9 : 8), 13);
    return h;
  }

  /* La gente que trabaja adentro, parada enfrente.
   *
   * Es la pieza que más se nota al contratar: el jugador paga la planilla y
   * ve aparecer una persona. Se dibujan hasta cuatro y el resto se cuenta con
   * un número, porque a la quinta ya no caben en el hueco. */
  function gente(x0, cuantos) {
    if (!cuantos) return '';
    var h = '';
    var caben = Math.min(cuantos, 4);
    for (var i = 0; i < caben; i++) {
      var x = x0 + 8 + i * 8;
      h += '<g>' +
             '<circle cx="' + x + '" cy="' + (SUELO - 8) + '" r="2.7" fill="' + C.lona + '"' + T(1.4) + '/>' +
             '<path d="M' + (x - 2.6) + ' ' + SUELO + 'v-4a2.6 2.6 0 0 1 5.2 0v4z" fill="' +
               C.azul + '" opacity=".85"' + T(1.4) + '/>' +
           '</g>';
    }
    if (cuantos > caben) {
      h += '<text x="' + (x0 + 8 + caben * 8) + '" y="' + (SUELO - 1) +
             '" font-size="9" font-weight="700" fill="' + C.tinta + '">+' +
             (cuantos - caben) + '</text>';
    }
    return h;
  }

  /* Las monedas que suben de un local que produjo.
   * Es lo único que se mueve sin que el jugador toque nada. */
  function monedas(x0, cuantas) {
    var h = '';
    var sitios = [[x0 + 10, 56], [x0 + 23, 46], [x0 + 34, 58]];
    for (var i = 0; i < Math.min(cuantas, 3); i++) {
      h += '<g class="esc-moneda esc-moneda-' + (i + 1) + '">' +
             '<circle cx="' + sitios[i][0] + '" cy="' + sitios[i][1] + '" r="5.4" fill="' +
               C.ambar + '"' + T(1.8) + '/>' +
             '<path d="M' + (sitios[i][0] - 2.2) + ' ' + sitios[i][1] +
               'h4.4" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
           '</g>';
    }
    return h;
  }

  // ---------- lo que aportan las tres cadenas de mejoras ----------

  /* Zona x: 96 a 118, y el rótulo colgado hacia arriba. */
  var OFICIO = [
    function () { return ''; },
    // caja de herramientas
    function () {
      return '<rect x="96" y="84" width="19" height="12" rx="2" fill="' + C.rojo + '" opacity=".85"' + T(1.8) + '/>' +
             '<path d="M101 84v-4h9v4" fill="none"' + T(1.8) + '/>' +
             '<path d="M96 89h19" stroke="' + C.tinta + '" stroke-width="1.4" opacity=".5"/>';
    },
    // un rótulo colgado, que es lo que hace que te vuelvan a llamar
    function () {
      return '<path d="M96 84h19v12H96z" fill="' + C.rojo + '" opacity=".85"' + T(1.8) + '/>' +
             '<path d="M101 84v-4h9v4" fill="none"' + T(1.8) + '/>' +
             // el poste baja hasta la caja: un rotulo colgado del aire se veia raro
             '<path d="M106 40v44" fill="none"' + T(1.8) + '/>' +
             '<rect x="90" y="24" width="32" height="16" rx="4" fill="' + C.lona + '"' + T(1.8) + '/>' +
             '<path d="M97 32h18" stroke="' + C.verde + '" stroke-width="3" stroke-linecap="round"/>';
    },
    // una bicicleta
    function () {
      return '<path d="M106 40v42" fill="none"' + T(1.8) + '/>' +
             '<rect x="90" y="24" width="32" height="16" rx="4" fill="' + C.lona + '"' + T(1.8) + '/>' +
             '<path d="M97 32h18" stroke="' + C.verde + '" stroke-width="3" stroke-linecap="round"/>' +
             '<circle cx="98" cy="89" r="6.5" fill="none"' + T(2.2) + '/>' +
             '<circle cx="114" cy="89" r="6.5" fill="none"' + T(2.2) + '/>' +
             '<path d="M98 89l7-11h6l3 11M105 78h6M107 89h7" fill="none"' + T(2) + '/>' +
             '<path d="M110 76h5" fill="none"' + T(2) + '/>';
    }
  ];

  /* Zona x: 70 a 94. Los libros van junto al jugador y no al otro lado de la
   * calle, que es donde estaban antes de que la calle existiera. */
  var ESCUELA = [
    function () { return ''; },
    // una mochila en el suelo
    function () {
      return '<path d="M76 78h16v16a2 2 0 0 1-2 2H78a2 2 0 0 1-2-2z" fill="' + C.rojo + '" opacity=".8"' + T(1.8) + '/>' +
             '<path d="M80 78v-4a4 4 0 0 1 8 0v4" fill="none"' + T(1.6) + '/>';
    },
    // libros apilados
    function () {
      return '<rect x="72" y="88" width="24" height="5" rx="1.5" fill="' + C.azul + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="74" y="83" width="20" height="5" rx="1.5" fill="' + C.verde + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="76" y="78" width="17" height="5" rx="1.5" fill="' + C.ambar + '" opacity=".85"' + T(1.4) + '/>';
    },
    // una antena, que es el internet en casa
    function () {
      return '<rect x="72" y="88" width="24" height="5" rx="1.5" fill="' + C.azul + '" opacity=".85"' + T(1.4) + '/>' +
             '<rect x="74" y="83" width="20" height="5" rx="1.5" fill="' + C.verde + '" opacity=".85"' + T(1.4) + '/>' +
             '<path d="M84 78V58" fill="none"' + T(2) + '/>' +
             '<path d="M78 60a9 9 0 0 1 12 0" fill="none"' + T(1.8) + '/>' +
             '<path d="M74 54a15 15 0 0 1 20 0" fill="none"' + T(1.6) + '/>';
    }
  ];

  /* Zona x: 2 a 22, al borde izquierdo. */
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
    var i = Math.max(0, Math.min(nivel || 0, lista.length - 1));
    return lista[i]();
  }

  /* Dibuja la calle completa.
   *
   *   negocios  lista de { icono, nivel, empleados, produce }, uno por local
   *   oficio, escuela, casa   el nivel de cada cadena de mejoras
   *   trabajo   id del empleo, para vestir al personaje
   *   estudia   true si va al colegio
   *   graduado  true si ya terminó algo
   *
   * El ancho del SVG crece con el número de locales, y el `min-width` en
   * línea es lo que hace que la tarjeta le ponga barra de arrastre en vez de
   * encoger todo hasta que no se vea. Con un negocio no hay barra.
   */
  function dibujar(op) {
    var o = op || {};
    var negs = o.negocios || [];
    var w = anchoDe(negs.length);
    var h = '<svg class="escena" viewBox="0 0 ' + w + ' 116" preserveAspectRatio="xMinYMid meet"' +
            ' style="min-width:' + Math.round(w * 1.5) + 'px"' +
            ' aria-hidden="true" focusable="false">';
    h += sol(w);
    h += suelo(w);
    h += pieza(ESCUELA, o.escuela);
    h += pieza(CASA, o.casa);
    h += pieza(OFICIO, o.oficio);

    if (!negs.length) {
      h += terrenoVacio(X_CALLE);
    } else {
      for (var i = 0; i < negs.length; i++) {
        var n = negs[i] || {};
        var x0 = X_CALLE + i * ANCHO_LOCAL;
        h += local(x0, n.nivel, n.icono, i);
        h += gente(x0, n.empleados || 0);
        if (n.produce) h += monedas(x0, (n.nivel || 1));
      }
    }

    h += personaje({ trabajo: o.trabajo, estudia: o.estudia, graduado: o.graduado });
    return h + '</svg>';
  }

  return {
    dibujar: dibujar,
    anchoDe: anchoDe,
    /* Cuántos niveles sabe dibujar de cada cosa.
     *
     * Es lo que la prueba compara contra los datos: una cadena de mejoras más
     * larga que su dibujo, o un negocio con más niveles que ALTO_POR_NIVEL,
     * dejaría de crecer en pantalla sin que nadie se diera cuenta. El jugador
     * pagaría el nivel y no vería nada, que es lo peor que le puede pasar a
     * un tycoon. */
    niveles: {
      negocio: ALTO_POR_NIVEL.length,
      oficio: OFICIO.length - 1,
      escuela: ESCUELA.length - 1,
      casa: CASA.length - 1
    }
  };
})();
