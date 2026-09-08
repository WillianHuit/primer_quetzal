/* Mi Primer Quetzal — el personaje
 *
 * El juego lo va a jugar alguien de 12 a 18 años y hasta ahora todo lo que
 * pasaba en pantalla estaba escrito. "Eres dependiente de tienda" era una
 * línea de texto entre otras diez líneas de texto.
 *
 * Esto lo dibuja. Es un muñeco armado por piezas: cuerpo, cara, y encima lo
 * que le corresponde según lo que esté haciendo — el casco si está en la
 * construcción, los audífonos si está en el call center, la mochila si está
 * en el colegio, la jarra si está vendiendo limonada.
 *
 * Sigue siendo SVG de trazo propio, sin librería ni imágenes que cargar, y
 * sigue tomando los colores de la paleta del juego con var(). Nada de colores
 * nuevos: el uniforme de cada oficio se arma con el verde, el azul, el ámbar y
 * el rojo que ya existían.
 *
 * ---------------------------------------------------------------------------
 * Cómo vestir un trabajo nuevo
 * ---------------------------------------------------------------------------
 * Se agrega una entrada a ROPA con el id del trabajo (el mismo de
 * datos/trabajos.js) y hasta cuatro piezas:
 *
 *   playera   color del torso.
 *   cabeza    lo que lleva puesto: 'gorra', 'casco', 'cascomoto',
 *             'audifonos', 'birrete', 'redecilla' o nada.
 *   encima    lo que lleva sobre la playera: 'mandil', 'corbata',
 *             'chaleco' o nada.
 *   sostiene  lo que trae en la mano: 'jarra', 'periodico', 'canasta',
 *             'ladrillo', 'caja', 'libro', 'llave', 'tableta' o nada.
 *
 * Un trabajo sin entrada sale con ropa de calle, que es una respuesta
 * perfectamente válida.
 * ---------------------------------------------------------------------------
 */

var Personaje = (function () {

  // Los cuatro colores de la paleta, con respaldo fijo por si acaso
  var C = {
    verde: 'var(--verde, #1f7a5a)',
    azul:  'var(--azul, #2c5f8a)',
    ambar: 'var(--ambar, #b5811f)',
    rojo:  'var(--rojo, #b8422e)',
    tinta: 'var(--tinta, #16211d)',
    linea: 'var(--linea, #dbe4e0)',
    claro: 'var(--verde-claro, #e6f3ee)',
    piel:  '#d9a675',
    pelo:  '#3a2a20'
  };

  var ROPA = {
    // ---- los trabajitos de niño ----
    limonada:   { playera: C.ambar, cabeza: 'gorra',      sostiene: 'jarra' },
    periodicos: { playera: C.azul,  cabeza: 'gorra',      sostiene: 'periodico' },
    dulces:     { playera: C.rojo,  cabeza: 'gorra',      sostiene: 'canasta' },

    // ---- empleos de adulto ----
    repartidor:   { playera: C.rojo,  cabeza: 'cascomoto',  sostiene: 'caja' },
    tienda:       { playera: C.verde, encima: 'mandil',     sostiene: 'canasta' },
    construccion: { playera: C.ambar, cabeza: 'casco',      encima: 'chaleco', sostiene: 'ladrillo' },
    vendedor:     { playera: C.azul,  encima: 'corbata',    sostiene: 'tableta' },
    callcenter:   { playera: C.verde, cabeza: 'audifonos',  sostiene: 'tableta' },
    tiendapropia: { playera: C.ambar, encima: 'mandil',     sostiene: 'caja' },
    auxcontable:  { playera: C.azul,  encima: 'corbata',    sostiene: 'tableta' },
    refrigeracion:{ playera: C.azul,  cabeza: 'casco',      encima: 'chaleco', sostiene: 'llave' },
    soporte:      { playera: C.verde, cabeza: 'audifonos',  sostiene: 'tableta' },
    docente:      { playera: C.verde, encima: 'corbata',    sostiene: 'libro' },
    contador:     { playera: C.azul,  encima: 'corbata',    sostiene: 'tableta' },
    ingeniero:    { playera: C.ambar, cabeza: 'casco',      encima: 'chaleco', sostiene: 'tableta' },
    gerente:      { playera: C.tinta, encima: 'corbata',    sostiene: 'tableta' },

    // ---- trabajando fuera del país ----
    construccion_us: { playera: C.ambar, cabeza: 'casco', encima: 'chaleco', sostiene: 'ladrillo' },
    restaurante_us:  { playera: C.claro, cabeza: 'redecilla', encima: 'mandil' },
    limpieza_us:     { playera: C.azul,  encima: 'mandil' },
    tecnico_us:      { playera: C.azul,  cabeza: 'casco', encima: 'chaleco', sostiene: 'llave' }
  };

  // Lo que se pone encima de todo cuando está estudiando
  var ESTUDIANTE = { cabeza: 'mochila' };

  // ---------- las piezas ----------

  function cuerpo(color) {
    return '<path d="M16 92V64c0-9 5.4-14 16-14s16 5 16 14v28" fill="' + color + '" ' +
             'stroke="' + C.tinta + '" stroke-width="2.2" stroke-linejoin="round"/>' +
           // brazos
           '<path d="M16 68 8 82" stroke="' + color + '" stroke-width="7" stroke-linecap="round"/>' +
           '<path d="M48 68 56 82" stroke="' + color + '" stroke-width="7" stroke-linecap="round"/>' +
           '<circle cx="8" cy="83" r="3.4" fill="' + C.piel + '" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
           '<circle cx="56" cy="83" r="3.4" fill="' + C.piel + '" stroke="' + C.tinta + '" stroke-width="1.6"/>';
  }

  function cara() {
    return '<circle cx="32" cy="34" r="16" fill="' + C.piel + '" stroke="' + C.tinta + '" stroke-width="2.2"/>' +
           // pelo
           '<path d="M16.4 30c1-9 7.6-14 15.6-14s14.6 5 15.6 14c-4-3.4-9-5-15.6-5s-11.6 1.6-15.6 5z" ' +
             'fill="' + C.pelo + '"/>' +
           // ojos
           '<circle cx="26" cy="34" r="1.9" fill="' + C.tinta + '"/>' +
           '<circle cx="38" cy="34" r="1.9" fill="' + C.tinta + '"/>' +
           // sonrisa
           '<path d="M27 41.5c2.6 2.4 7.4 2.4 10 0" fill="none" stroke="' + C.tinta + '" ' +
             'stroke-width="2" stroke-linecap="round"/>';
  }

  var CABEZA = {
    gorra: function (c) {
      return '<path d="M15 26c1.4-8.6 8-13.4 17-13.4S48 17.4 49 26z" fill="' + c + '" ' +
               'stroke="' + C.tinta + '" stroke-width="2"/>' +
             '<path d="M49 26h9" stroke="' + C.tinta + '" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M49 25.4h8.6" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
    },
    casco: function () {
      return '<path d="M14 27c0-10 8-16 18-16s18 6 18 16z" fill="' + C.ambar + '" ' +
               'stroke="' + C.tinta + '" stroke-width="2"/>' +
             '<path d="M11 27h42" stroke="' + C.tinta + '" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M32 11v14" stroke="' + C.tinta + '" stroke-width="1.8"/>';
    },
    cascomoto: function () {
      return '<path d="M14 34c0-11 8-19 18-19s18 8 18 19z" fill="' + C.rojo + '" ' +
               'stroke="' + C.tinta + '" stroke-width="2"/>' +
             '<path d="M20 32h24" stroke="' + C.tinta + '" stroke-width="1.8"/>' +
             '<path d="M22 24.5c2.6-3.4 6-5 10-5s7.4 1.6 10 5" fill="#cfe0ea" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>';
    },
    audifonos: function () {
      return '<path d="M17 34v-4a15 15 0 0 1 30 0v4" fill="none" stroke="' + C.tinta + '" stroke-width="2.4"/>' +
             '<rect x="13" y="31" width="7" height="12" rx="3" fill="' + C.tinta + '"/>' +
             '<rect x="44" y="31" width="7" height="12" rx="3" fill="' + C.tinta + '"/>' +
             '<path d="M20 40c4 0 6 3 6 6" fill="none" stroke="' + C.tinta + '" stroke-width="1.8"/>';
    },
    birrete: function () {
      return '<path d="M32 10 54 19l-22 9-22-9z" fill="' + C.tinta + '" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6" stroke-linejoin="round"/>' +
             '<path d="M50 20.4v9" stroke="' + C.ambar + '" stroke-width="2.2" stroke-linecap="round"/>' +
             '<circle cx="50" cy="30.4" r="2.2" fill="' + C.ambar + '"/>';
    },
    redecilla: function () {
      return '<path d="M15.6 27c1-9.4 7.8-14.4 16.4-14.4S47.4 17.6 48.4 27z" fill="none" ' +
               'stroke="' + C.tinta + '" stroke-width="2"/>' +
             '<path d="M19 22h26M23 16.6h18M17 26.4h30" stroke="' + C.tinta + '" stroke-width="1.2"/>';
    },
    // La mochila va detrás del cuerpo, pero se declara aquí porque es "lo que
    // lleva puesto" y así el que agregue una carrera lo encuentra junto.
    mochila: function () {
      return '';
    }
  };

  var ENCIMA = {
    mandil: function () {
      return '<path d="M24 52h16v26a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3z" fill="#f4f1e6" ' +
               'stroke="' + C.tinta + '" stroke-width="1.8"/>' +
             '<path d="M26 52c0-3 2.6-5 6-5s6 2 6 5" fill="none" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M27 66h10" stroke="' + C.tinta + '" stroke-width="1.4"/>';
    },
    corbata: function () {
      return '<path d="M28 51h8l-2.6 4.4L36 70l-4 4-4-4 2.6-14.6z" fill="' + C.rojo + '" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6" stroke-linejoin="round"/>' +
             '<path d="M25 50.6 32 56l7-5.4" fill="#fff" stroke="' + C.tinta + '" stroke-width="1.6"/>';
    },
    chaleco: function () {
      return '<path d="M17 60h30v8H17z" fill="' + C.ambar + '" opacity=".55"/>' +
             '<path d="M17 62.4h30M17 66h30" stroke="#f4f1e6" stroke-width="2"/>';
    }
  };

  var SOSTIENE = {
    jarra: function () {
      return '<path d="M2 74h11l-1.2 12H3.2z" fill="' + C.ambar + '" opacity=".7" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M13 77c3 0 3 5 0 5" fill="none" stroke="' + C.tinta + '" stroke-width="1.6"/>';
    },
    periodico: function () {
      return '<path d="M1 74h13v11H2.6A1.6 1.6 0 0 1 1 83.4z" fill="#f4f1e6" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M3.4 77.4h8M3.4 80h8M3.4 82.6h5" stroke="' + C.tinta + '" stroke-width="1.2"/>';
    },
    canasta: function () {
      return '<path d="M1 76h14l-2 10H3z" fill="' + C.ambar + '" opacity=".65" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M4 76c0-3.4 1.8-5 4-5s4 1.6 4 5" fill="none" stroke="' + C.tinta + '" stroke-width="1.6"/>';
    },
    ladrillo: function () {
      return '<rect x="1" y="76" width="14" height="8" rx="1.4" fill="' + C.rojo + '" opacity=".8" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M5.6 76v8M10.4 76v8" stroke="' + C.tinta + '" stroke-width="1.2"/>';
    },
    caja: function () {
      return '<rect x="48" y="74" width="15" height="12" rx="1.6" fill="' + C.ambar + '" opacity=".6" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M48 78.4h15M55.4 74v12" stroke="' + C.tinta + '" stroke-width="1.4"/>';
    },
    libro: function () {
      return '<path d="M48 75h14v11H48z" fill="' + C.verde + '" opacity=".75" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M55 75v11" stroke="' + C.tinta + '" stroke-width="1.4"/>';
    },
    llave: function () {
      return '<path d="M50 84.6 60 74.4" stroke="' + C.tinta + '" stroke-width="2.6" stroke-linecap="round"/>' +
             '<circle cx="49" cy="86" r="3.4" fill="none" stroke="' + C.tinta + '" stroke-width="2.2"/>';
    },
    tableta: function () {
      return '<rect x="48" y="73" width="13" height="15" rx="2" fill="#f4f1e6" ' +
               'stroke="' + C.tinta + '" stroke-width="1.6"/>' +
             '<path d="M50.6 77h8M50.6 80.4h8M50.6 83.8h5" stroke="' + C.tinta + '" stroke-width="1.2"/>';
    }
  };

  function mochila() {
    return '<path d="M11 62c0-7 4-11 8-11v30c-4 0-8-4-8-11z" fill="' + C.rojo + '" opacity=".85" ' +
             'stroke="' + C.tinta + '" stroke-width="1.8"/>' +
           '<path d="M12 70h7" stroke="' + C.tinta + '" stroke-width="1.4"/>';
  }

  /* Dibuja el muñeco.
   *
   *   trabajo   id del empleo, para el uniforme. Puede ir vacío.
   *   estudia   true si además va al colegio: le pone la mochila.
   *   graduado  true si ya terminó una carrera: le pone el birrete.
   *   clase     clases de CSS extra para el <svg>.
   */
  /* Devuelve el muñeco: la ilustración si hay una para este estado, y si no
   * el dibujo por piezas de siempre.
   *
   * Quién decide eso es js/arte.js, no este archivo, y el dibujo NO es código
   * muerto: es lo que hace que un empleo nuevo en datos/trabajos.js funcione
   * el mismo día, con su uniforme, sin esperar a que alguien lo ilustre.
   *
   * El lienzo mide 64x96, o sea exactamente 2:3, que es la proporción en la
   * que están hechas las ilustraciones. Así entra sin deformarse. Y va anclada
   * abajo (`YMax`) porque el chico se para en el suelo de la escena: centrarla
   * lo dejaba flotando. */
  function dibujar(op) {
    var o = op || {};

    var envoltura = '<svg class="muneco' + (o.clase ? ' ' + o.clase : '') +
                    '" viewBox="0 0 64 96" aria-hidden="true" focusable="false">';

    if (typeof Arte !== 'undefined') {
      var ilustracion = Arte.personaje(o);
      if (ilustracion) {
        return envoltura + '<image href="' + ilustracion + '" x="0" y="0" ' +
               'width="64" height="96" preserveAspectRatio="xMidYMax meet"/></svg>';
      }
    }

    var r = ROPA[o.trabajo] || {};
    var playera = r.playera || C.claro;

    var h = envoltura;

    if (o.estudia) h += mochila();
    h += cuerpo(playera);
    if (r.encima && ENCIMA[r.encima]) h += ENCIMA[r.encima]();
    h += cara();

    // El birrete gana sobre la gorra: haberse graduado se ve antes que el turno
    var puesto = o.graduado ? 'birrete' : r.cabeza;
    if (puesto && CABEZA[puesto]) h += CABEZA[puesto]();
    if (r.sostiene && SOSTIENE[r.sostiene]) h += SOSTIENE[r.sostiene]();

    return h + '</svg>';
  }

  return { dibujar: dibujar, ROPA: ROPA, viste: function (id) { return !!ROPA[id]; } };
})();

/* Atajo, como Ico() para los iconos */
function Muneco(op) { return Personaje.dibujar(op); }
