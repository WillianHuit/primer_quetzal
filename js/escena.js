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
 * Esto es lo importante del archivo, y sigue siendo verdad ahora que los nueve
 * tipos tienen local propio. Un negocio se ve en tres escalones y los tres
 * están vivos:
 *
 *   1. **Su local ilustrado.** `negocio/tortilleria/n3` es una tortillería con
 *      nombre. Es lo que se ve normalmente.
 *   2. **El local genérico ilustrado**, con un SELLO redondo encima que lleva
 *      el emblema del tipo. Es lo que ve un tipo de negocio que todavía no
 *      tiene dibujo: un puesto cualquiera con el rótulo de una tortillería.
 *   3. **El local dibujado aquí**, en SVG, si no hay ninguna ilustración.
 *
 * O sea: quien agregue un negocio a datos/negocios.js no tiene que dibujar
 * nada, y aun así se le va a ver crecer. Antes sí hacía falta, y era una
 * trampa: se agregaba un nivel, el jugador lo compraba y la pantalla se veía
 * igual.
 *
 * El sello es el que se mueve entre escalones, y a propósito. Sobre un puesto
 * genérico es la única cosa que distingue una tortillería de un taller, así
 * que va. Sobre la tortillería ilustrada no dice nada que el dibujo no diga ya,
 * y le tapa el comal, así que no va.
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
 *   x: 2    22        70        96      126                    126+56n
 *      |CASA| PERSONA | ESCUELA | OFICIO |  LA CALLE, 56 por local  |
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
  /* Lo que ocupa cada negocio en la calle.
   *
   * Subió de 46 a 56 cuando entraron los locales por tipo: el nivel 4 mide 58
   * de lado y en un hueco de 46 los locales se pisaban unos a otros. Alargar
   * la calle es el precio, y es un precio que este juego quiere pagar: con
   * ocho negocios la escena mide 580 unidades y hay que arrastrarla para verla
   * toda, que es justo lo que se siente al tener ocho negocios. */
  var ANCHO_LOCAL = 56;
  var SUELO = 96;         // la línea donde todo se para

  /* Cuatro colores que se van repartiendo entre los locales, para que dos
   * negocios seguidos no salgan del mismo color. */
  var TECHOS = [C.rojo, C.verde, C.azul, C.ambar];

  function anchoDe(cuantos) {
    return Math.max(200, X_CALLE + Math.max(cuantos, 1) * ANCHO_LOCAL + 6);
  }

  // ---------- el fondo ----------

  /* El suelo sigue dibujado y no usa `assets/visuales/escena/plataforma.png`.
   *
   * Esa imagen es una plataforma OVALADA, hecha para un objeto centrado. Aqui
   * el suelo es una calle que se alarga con el numero de locales, y estirar un
   * ovalo de 1647x955 a cuatrocientos y pico de ancho por dieciocho de alto lo
   * deja irreconocible. Vale mas un suelo dibujado que uno deformado.
   *
   * El contorno se bajo de 2.4 a 1.6 al entrar las ilustraciones: al lado de
   * un dibujo con sombra suave, una linea gorda de tinta se veia pegada. */
  function suelo(w) {
    return '<rect x="2" y="' + SUELO + '" width="' + (w - 4) + '" height="18" rx="8" fill="' +
             C.claro + '"' + T(1.6) + '/>' +
           '<path d="M14 105h20M52 108h16M100 105h16M150 108h18"' +
             ' stroke="' + C.verde + '" stroke-width="2" stroke-linecap="round" opacity=".45"/>';
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
  function emblema(nombre, cx, cy, lado, color) {
    if (typeof Iconos === 'undefined') return '';
    var d = Iconos.trazo(nombre);
    if (!d) return '';
    var s = lado / 24;
    // El color es opcional: sirve para el emblema que va sobre fondo oscuro,
    // como el de la insignia de tus jornadas, donde la tinta no se ve.
    return '<g transform="translate(' + (cx - lado / 2) + ',' + (cy - lado / 2) +
             ') scale(' + s.toFixed(3) + ')" fill="none" stroke="' + (color || C.tinta) +
             '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
             ' opacity="' + (color ? '1' : '.85') + '">' + d + '</g>';
  }

  /* El terreno vacío: el hueco donde todavía no hay negocio.
   *
   * Sale con el contorno punteado para que se note que ahí FALTA algo, y desde
   * que la calle es la pantalla principal sale siempre —no solo cuando no hay
   * ningún negocio— mientras al jugador le quepa uno más. Es la invitación
   * permanente del juego: un lote vacío al lado de lo que ya tienes.
   *
   * El signo de más va dentro porque el rectángulo punteado solo no se lee
   * como "aquí puedes construir": se lee como un error de dibujo. */
  function terrenoVacio(x0, conMas) {
    var an = 34, al = 17;
    var x = x0 + (ANCHO_LOCAL - an) / 2;
    var y = SUELO - al;
    var h = '<rect class="lote-marco' + (conMas ? ' late' : '') + '"' +
              ' x="' + x + '" y="' + y + '" width="' + an + '" height="' + al + '" rx="3"' +
              ' fill="none" stroke="' + C.linea + '" stroke-width="2.4" stroke-dasharray="5 4"/>';
    if (conMas) h += emblema('mas', x + an / 2, y + al / 2, 11);
    return h;
  }

  /* Lo que mide un local según su nivel, en unidades de la escena.
   *
   * El tope está elegido contra el personaje, que mide 50: una tienda con
   * sucursal le pasa la cabeza —como una tienda de verdad— y un puesto recién
   * abierto le llega a la cintura. Esos dos números son los que cuentan el
   * crecimiento de lejos, cuando la calle tiene cinco locales y ya no se
   * distingue el detalle del dibujo. */
  var LADO_POR_NIVEL = [32, 41, 50, 58];

  /* Un local: el de su tipo, si no el genérico, si no el dibujo.
   *
   * Los tres escalones están explicados en el encabezado. Lo único que hay que
   * saber aquí es por qué el sello depende de `propio`: sobre un puesto
   * genérico el emblema es la única pista del tipo de negocio, y sobre la
   * tortillería ilustrada sería una calcomanía encima del comal. */
  function local(x0, nivel, icono, color, tipo) {
    var n = Math.max(1, Math.min(nivel || 1, LADO_POR_NIVEL.length));
    var img = (typeof Arte !== 'undefined') ? Arte.local(n, tipo) : null;
    if (!img || !img.ruta) return localDibujado(x0, nivel, icono, color);

    var lado = LADO_POR_NIVEL[n - 1];
    var x = x0 + (ANCHO_LOCAL - lado) / 2;
    var y = SUELO + 1 - lado;
    return '<image href="' + img.ruta + '" x="' + x + '" y="' + y +
             '" width="' + lado + '" height="' + lado +
             '" preserveAspectRatio="xMidYMax meet"/>' +
           (img.propio ? '' : sello(icono, x0 + ANCHO_LOCAL - 8, y + 5));
  }

  /* El sello redondo con el emblema del negocio, arriba a la derecha del
   * local. Es un recurso de juego de toda la vida: el rótulo de la tienda. */
  function sello(nombre, cx, cy) {
    if (typeof Iconos === 'undefined' || !Iconos.trazo(nombre)) return '';
    /* El contorno va FINO a proposito. Con el grosor normal de la escena
     * (1.6) el anillo negro se comia el relleno crema y el sello se veia como
     * una bolita oscura pegada al toldo: a veintiocho pixeles de pantalla, un
     * anillo de tres y medio sobre un circulo de catorce no deja ver nada. */
    return '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="' + C.lona +
             '" stroke="' + C.tinta + '" stroke-width="0.9"/>' +
           emblema(nombre, cx, cy, 9);
  }

  function localDibujado(x0, nivel, icono, color) {
    var n = Math.max(1, Math.min(nivel || 1, ALTO_POR_NIVEL.length));
    var alto = altoDe(n);
    var x = x0 + (ANCHO_LOCAL - 32) / 2;
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

  /* La gente que trabaja adentro, contada sobre la plataforma.
   *
   * Es la pieza que más se nota al contratar: el jugador paga la planilla y ve
   * aparecer una persona más.
   *
   * La primera versión los dibujaba como muñequitos parados delante del local,
   * y con las ilustraciones puestas eso dejó de funcionar por dos motivos: se
   * quedaban CORTADOS por el borde de la plataforma —dos cabecitas asomando
   * que parecían un par de ojos— y, al lado de un dibujo con sombra, una
   * figura de palo de catorce unidades no se lee como una persona.
   *
   * Así que ahora es una fila de siluetas sobre el suelo, del ancho del local,
   * como una cuenta. Se leen a cualquier tamaño y no compiten con el dibujo.
   * Hasta cuatro; de ahí en adelante, un número. */
  function gente(x0, cuantos) {
    if (!cuantos) return '';
    if (typeof Iconos === 'undefined' || !Iconos.trazo('persona')) return '';
    var caben = Math.min(cuantos, 4);
    var lado = 9;
    var paso = 9.5;
    // Centrada bajo el local, y apoyada en la cara de la plataforma
    var ancho = caben * paso + (cuantos > caben ? 9 : 0);
    var x = x0 + (ANCHO_LOCAL - ancho) / 2 + paso / 2;
    var y = SUELO + 9;
    var h = '';
    for (var i = 0; i < caben; i++) {
      h += emblema('persona', x + i * paso, y, lado);
    }
    if (cuantos > caben) {
      h += '<text x="' + (x + caben * paso - 2) + '" y="' + (y + 3.4) +
             '" font-size="8.5" font-weight="800" fill="' + C.tinta + '">+' +
             (cuantos - caben) + '</text>';
    }
    return h;
  }

  /* Las jornadas TUYAS que están puestas en ese negocio este mes.
   *
   * Es la mitad que le faltaba a la calle. La fila de siluetas de `gente()`
   * dice a quién le pagas; esta dice dónde estás TÚ, que es la decisión que el
   * juego pide cada mes y la única que no se puede comprar con dinero. Un
   * negocio sin ninguna jornada tuya rinde un 30% menos, y hasta ahora eso
   * solo se veía leyendo un número en otra pestaña.
   *
   * La primera versión eran cuadritos verdes en fila sobre el toldo, y no
   * funcionó: a este tamaño tres cuadros oscuros encima de un techo se leen
   * como paneles solares, y encima chocaban con las monedas. Ahora es una
   * INSIGNIA con la silueta y el número, en la esquina de arriba a la derecha
   * del local. Esa esquina está libre justo porque los locales por tipo ya no
   * llevan sello, y es donde los juegos de este tipo ponen siempre la cuenta
   * de quién está trabajando ahí. */
  function tuyas(x0, cuantas, alto) {
    if (!cuantas) return '';
    var an = cuantas > 9 ? 25 : 21, al = 14;
    /* Pegada al borde derecho del LOCAL, no del hueco. Un puesto de nivel 1
     * mide 32 y el hueco 56, así que anclada al hueco la insignia salía
     * flotando doce unidades al lado del dibujo, como un globo suelto. */
    var lado = alto || 34;
    var x = x0 + (ANCHO_LOCAL + lado) / 2 - an;
    var y = SUELO - lado * 0.78 - al / 2;
    return '<g class="tuyas">' +
      '<rect x="' + x + '" y="' + y + '" width="' + an + '" height="' + al + '" rx="7"' +
        ' fill="' + C.verde + '" stroke="' + C.tinta + '" stroke-width="1.1"/>' +
      emblema('persona', x + 6.5, y + al / 2, 9, '#fff') +
      '<text x="' + (x + an - 6) + '" y="' + (y + al / 2 + 3.4) +
        '" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff">' +
        cuantas + '</text></g>';
  }

  /* El botón de administrar ese negocio, en la esquina de arriba a la
   * IZQUIERDA del local.
   *
   * Dos botones en el mismo edificio, y cada uno tiene su razón. Tocar el
   * local pone una jornada tuya adentro, que es lo que se hace ocho veces al
   * mes; tocar el engranaje abre lo que se hace una vez cada varios meses:
   * subirle el nivel, contratar, traspasarlo. Si lo frecuente costara dos
   * toques para que lo raro costara uno, el juego se sentiría lento en el
   * único sitio donde no se puede permitir.
   *
   * Va en la esquina opuesta a la insignia de tus jornadas, así que en un
   * local de 56 unidades los dos caben sin tocarse. */
  function gestionar(x0, tipo, alto, etiqueta) {
    if (typeof Iconos === 'undefined' || !Iconos.trazo('engranaje')) return '';
    var r = 6.5;
    // Pegado al borde izquierdo del LOCAL, por el mismo motivo que la insignia
    var lado = alto || 34;
    var cx = x0 + (ANCHO_LOCAL - lado) / 2 + r;
    var cy = SUELO - lado * 0.78;
    return '<g class="calle-toque gestion" role="button" tabindex="0"' +
           ' data-gestion="' + tipo + '"><title>' + etiqueta + '</title>' +
           '<circle class="toque" cx="' + cx + '" cy="' + cy + '" r="' + (r + 3) +
             '" fill="transparent"/>' +
           '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + C.lona +
             '" stroke="' + C.tinta + '" stroke-width="1.1"/>' +
           emblema('engranaje', cx, cy, 10) + '</g>';
  }

  /* Las monedas que suben de un local que produjo.
   * Es lo único que se mueve sin que el jugador toque nada. */
  /* Las monedas suben DESDE EL TECHO del local, no desde una altura fija.
   * Con una altura fija, las de un puesto de treinta unidades salían a medio
   * cielo y no se entendía de dónde venían.
   *
   * El 0.78 es el que hace que sigan pegadas al techo ahora que los locales
   * son ilustraciones. La caja del `<image>` es cuadrada y el local viene más
   * ancho que alto, así que con `meet` el dibujo llena el ancho y deja una
   * banda vacía ARRIBA: el techo de verdad está más abajo que el borde de la
   * caja. Sin este factor, las monedas de un puesto recién abierto salían
   * flotando siete unidades por encima del toldo. */
  function monedas(x0, cuantas, alto) {
    var img = (typeof Arte !== 'undefined') ? Arte.moneda() : null;
    var h = '';
    /* Y van por ENCIMA de las insignias, no a su altura. Las dos insignias del
     * local —el engranaje y las jornadas tuyas— se sientan justo en la línea
     * del techo, así que las monedas ahí se les montaban encima y la esquina
     * quedaba ilegible. */
    var techo = SUELO - (alto || 34) * 0.78 - 12;
    var a = ANCHO_LOCAL;
    var sitios = [[x0 + a * 0.28, techo - 4], [x0 + a * 0.52, techo - 12],
                  [x0 + a * 0.74, techo - 2]];
    for (var i = 0; i < Math.min(cuantas, 3); i++) {
      var cx = sitios[i][0], cy = sitios[i][1];
      h += '<g class="esc-moneda esc-moneda-' + (i + 1) + '">';
      if (img) {
        h += '<image href="' + img + '" x="' + (cx - 4.5) + '" y="' + (cy - 4.5) +
             '" width="9" height="9"/>';
      } else {
        h += '<circle cx="' + cx + '" cy="' + cy + '" r="5.4" fill="' + C.ambar + '"' +
               T(1.8) + '/>' +
             '<path d="M' + (cx - 2.2) + ' ' + cy + 'h4.4" stroke="' + C.tinta +
               '" stroke-width="1.6"/>';
      }
      h += '</g>';
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
    /* La escala y el desplazamiento estan calculados para que los PIES caigan
     * sobre el suelo (y = 96) y para que el chico mida lo que tiene que medir
     * al lado de un local.
     *
     * Los dos numeros se recalcularon al entrar las ilustraciones, y los dos
     * estaban mal. Con 0.62 el muneco medía 59.5 unidades y empezaba en y=42,
     * o sea que los pies caían en 101.5: cinco unidades y media ENTERRADO en
     * la plataforma. Y era demasiado grande: el dibujo por piezas ocupaba
     * menos de su lienzo, la ilustración lo llena entero, así que el mismo
     * 0.62 daba un chico que le pasaba la cabeza a una tienda con puerta.
     *
     * A 0.52 mide 50 unidades y el local más grande mide 48: una persona al
     * lado de su tienda. Y 46 + 50 = 96, los pies justo en el suelo. */
    return '<g transform="translate(30, 46) scale(0.52)">' + muneco + '</g>';
  }

  function pieza(lista, nivel) {
    var i = Math.max(0, Math.min(nivel || 0, lista.length - 1));
    return lista[i]();
  }

  /* Las zonas donde se apoyan las piezas de las tres cadenas de mejoras.
   * Son las mismas del mapa de arriba, escritas una sola vez para que la
   * ilustración caiga exactamente donde caía el dibujo. */
  var ZONA = { casa: [2, 24], escuela: [70, 94], oficio: [96, 120] };

  /* Una pieza del margen: la ilustración si existe, y si no el dibujo.
   *
   * Hay una diferencia que conviene saber. El dibujo ACUMULA —al comprar los
   * libros seguía saliendo la mochila— y las ilustraciones no: cada nivel es
   * un objeto y se ve el último. No caben tres cosas en veinte unidades de
   * ancho, y ver el objeto mejorar es lo que un tycoon enseña de todos modos. */
  function piezaDe(cadena, lista, nivel) {
    var img = (typeof Arte !== 'undefined') ? Arte.mejora(cadena, nivel) : null;
    if (!img) return pieza(lista, nivel);
    var z = ZONA[cadena];
    var lado = z[1] - z[0];
    return '<image href="' + img + '" x="' + z[0] + '" y="' + (SUELO + 1 - lado) +
           '" width="' + lado + '" height="' + lado +
           '" preserveAspectRatio="xMidYMax meet"/>';
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
  /* Un local envuelto para que se pueda TOCAR.
   *
   * La zona sensible es un rectángulo transparente que cubre el hueco entero,
   * del suelo al cielo, y no el dibujo: con la silueta del dibujo el jugador
   * falla el toque entre el toldo y la puerta, y en un teléfono eso se siente
   * como que el juego no responde. Va DELANTE de todo lo del local por el
   * mismo motivo.
   *
   * El `data-poner` es el mismo valor que ya usaban los botones de la pestaña
   * del mes —'negocio:dulces'— así que el manejador que lo recibe no cambia y
   * las dos formas de repartir el mes conviven. */
  function tocable(x0, dato, etiqueta, marcado) {
    return '<g class="calle-toque' + (marcado ? ' puesto' : '') + '" role="button" tabindex="0"' +
           ' data-poner="' + dato + '"><title>' + etiqueta + '</title>' +
           '<rect class="toque" x="' + x0 + '" y="6" width="' + ANCHO_LOCAL +
             '" height="' + (SUELO + 16 - 6) + '" rx="8" fill="transparent"/></g>';
  }

  /* La calle.
   *
   * `op.tocable` la convierte de cuadro en tablero: cada local pasa a ser un
   * botón que pone una jornada tuya adentro, y el lote vacío lleva a abrir un
   * negocio. Sin esa opción se dibuja igual pero no responde, que es como la
   * quiere la pestaña del imperio, donde las acciones están en las tarjetas.
   *
   * `aria-hidden` solo cuando NO es tocable: un adorno se le esconde al lector
   * de pantalla, pero unos botones no. */
  function dibujar(op) {
    var o = op || {};
    var negs = o.negocios || [];
    var toca = !!o.tocable;
    // Con un lote libre se dibuja un hueco de más, que es la invitación
    var lote = toca && o.cabeOtro && negs.length ? 1 : 0;
    var w = anchoDe(negs.length + lote);
    var h = '<svg class="escena' + (toca ? ' viva' : '') + '" viewBox="0 0 ' + w + ' 116"' +
            ' preserveAspectRatio="xMinYMid meet"' +
            ' style="min-width:' + Math.round(w * 1.5) + 'px"' +
            (toca ? '' : ' aria-hidden="true"') + ' focusable="false">';
    h += sol(w);
    h += suelo(w);
    h += piezaDe('escuela', ESCUELA, o.escuela);
    h += piezaDe('casa', CASA, o.casa);
    h += piezaDe('oficio', OFICIO, o.oficio);

    for (var i = 0; i < negs.length; i++) {
      var n = negs[i] || {};
      var x0 = X_CALLE + i * ANCHO_LOCAL;
      var alto = LADO_POR_NIVEL[Math.max(0, Math.min((n.nivel || 1) - 1, 3))];
      h += local(x0, n.nivel, n.icono, i, n.tipo);
      h += gente(x0, n.empleados || 0);
      h += tuyas(x0, n.tuyas || 0, alto);
      if (n.produce) h += monedas(x0, (n.nivel || 1), alto);
      if (toca && n.tipo) {
        // Primero la zona grande, y ENCIMA el engranaje: al revés, la zona
        // del local se comería el toque del botón chico.
        h += tocable(x0, 'negocio:' + n.tipo, n.nombre || '', (n.tuyas || 0) > 0);
        h += gestionar(x0, n.tipo, alto, n.textoGestion || '');
      }
    }

    // El lote vacío: el único de la calle que no pone una jornada sino que
    // lleva a abrir un negocio, así que sale con su propio dato.
    if (!negs.length || lote) {
      var xl = X_CALLE + negs.length * ANCHO_LOCAL;
      if (toca) {
        /* El terreno va DENTRO del grupo que se toca. Fuera, el resaltado del
         * dedo era una columna de cielo de cien unidades de alto al lado del
         * último local, y se leía como un panel suelto en vez de como un lote. */
        h += '<g class="calle-toque lote" role="button" tabindex="0" data-lote="1">' +
             '<title>' + (o.textoLote || '') + '</title>' +
             '<rect class="toque" x="' + xl + '" y="' + (SUELO - 34) + '" width="' + ANCHO_LOCAL +
               '" height="' + (34 + 16) + '" rx="8" fill="transparent"/>' +
             terrenoVacio(xl, true) + '</g>';
      } else {
        h += terrenoVacio(xl, false);
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
