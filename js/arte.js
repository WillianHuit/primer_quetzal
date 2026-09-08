/* Mi Primer Quetzal — dónde viven las ilustraciones y cuáles existen
 *
 * El juego tiene dos formas de dibujarse y las dos siguen vivas.
 *
 *   1. **Dibujo propio en SVG.** `js/iconos.js`, `js/personaje.js` y
 *      `js/escena.js` saben pintar todo con trazos y formas. Toma los colores
 *      de la paleta, pesa nada y no hay archivo que se pueda perder.
 *   2. **Ilustraciones.** `assets/juego/` trae 37 imágenes: el mismo chico en
 *      23 estados, los cuatro niveles de un local, las ocho piezas de las
 *      cadenas de mejoras y la moneda.
 *
 * Este archivo es lo único que sabe qué ilustraciones hay. Todo lo demás
 * pregunta, y **si la respuesta es que no hay, dibuja**. Eso no es un adorno
 * defensivo: es lo que permite agregar un empleo a `datos/trabajos.js` y verlo
 * funcionar el mismo día, sin esperar a que alguien ilustre el uniforme. Con
 * ilustración se ve mejor; sin ilustración se ve.
 *
 * ---------------------------------------------------------------------------
 * Los maestros no son estos archivos
 * ---------------------------------------------------------------------------
 * `assets/visuales/` son los PNG maestros que se entregaron: 90 MB, entre 2 y
 * 3.6 MB cada uno, a 1024×1536 y 1254×1254. El navegador **no** carga esos.
 * `herramientas/preparar-imagenes.py` escribe `assets/juego/` a partir de
 * ellos: WebP, al tamaño en que se ven, con el cuadriculado horneado quitado.
 * Las 37 juntas pesan 604 KB, y por eso el juego sigue abriendo con doble clic.
 *
 * ---------------------------------------------------------------------------
 * La ruta
 * ---------------------------------------------------------------------------
 * `index.html` está en la raíz, así que `assets/juego/` sirve tal cual. Una
 * página que viva en otra carpeta —`pruebas/vista.html`— declara
 * `RUTA_ASSETS` antes de cargar los scripts y esto la respeta. Es la misma
 * idea que ya usaban los `<script src>` de esa página, escrita una sola vez.
 */

var Arte = (function () {

  var BASE = (typeof RUTA_ASSETS !== 'undefined' && RUTA_ASSETS) || 'assets/juego/';

  /* Los 23 estados del personaje que están ilustrados: neutro, estudiante,
   * graduado y uno por cada oficio de `ROPA` en js/personaje.js.
   *
   * Esta lista tiene que coincidir con lo que hay en el disco, y no se
   * comprueba a ojo: `pruebas/arte.js` la cruza con los archivos y con `ROPA`,
   * así que sobra o falta un nombre y la suite lo dice. */
  var PERSONAJE = [
    'base', 'estudiante', 'graduado',
    // los tres trabajitos de niño
    'limonada', 'periodicos', 'dulces',
    // servicios y oficios
    'repartidor', 'tienda', 'construccion', 'vendedor', 'callcenter', 'tiendapropia',
    // técnicos y profesionales
    'auxcontable', 'refrigeracion', 'soporte', 'docente', 'contador',
    'ingeniero', 'gerente',
    // trabajar en Estados Unidos
    'construccion_us', 'restaurante_us', 'limpieza_us', 'tecnico_us'
  ];

  /* Cuántos niveles de local hay ilustrados.
   *
   * Las cuatro imágenes se dibujaron para la cadena vieja de mejoras —canasta,
   * carreta, puesto, local— que ya no existe. Encajan igual, y mejor: son
   * exactamente los cuatro niveles que puede tener CUALQUIER negocio, y leídas
   * en fila cuentan el crecimiento sin una palabra. Una canasta es un negocio
   * recién abierto; un local con puerta es uno con sucursal. */
  var NIVELES_LOCAL = 4;

  /* Y las piezas de las tres cadenas que mejoran a la persona. */
  var MEJORAS = { oficio: 3, escuela: 3, casa: 2 };

  function ruta(clave) { return BASE + clave + '.webp'; }

  /* La ilustración que le toca a un estado del personaje, o null si hay que
   * dibujarlo.
   *
   * Un PNG es un personaje COMPLETO, así que los estados ya no se suman. Antes
   * un chico que trabajaba y estudiaba salía con la ropa del trabajo Y la
   * mochila, y un graduado con el birrete encima del uniforme. Con las
   * ilustraciones hay que elegir una sola, y gana **lo que está haciendo
   * ahora**: primero el oficio, después el estudio, después la graduación.
   *
   * Ojo con el orden del final: un oficio que existe pero no está ilustrado
   * devuelve null para que se DIBUJE con su uniforme, en vez de caer al
   * personaje neutro. Salir de calle sería perder información que el juego sí
   * tiene. */
  function personaje(op) {
    var o = op || {};
    if (o.trabajo && tiene(o.trabajo)) return ruta('personaje/' + o.trabajo);
    if (o.trabajo) return null;
    if (o.estudia && tiene('estudiante')) return ruta('personaje/estudiante');
    if (o.graduado && tiene('graduado')) return ruta('personaje/graduado');
    return tiene('base') ? ruta('personaje/base') : null;
  }

  function tiene(clave) { return PERSONAJE.indexOf(clave) >= 0; }

  function local(nivel) {
    var n = Math.max(1, Math.min(nivel || 1, NIVELES_LOCAL));
    return NIVELES_LOCAL ? ruta('negocio/n' + n) : null;
  }

  function mejora(cadena, nivel) {
    if (!nivel || !MEJORAS[cadena]) return null;
    var n = Math.min(nivel, MEJORAS[cadena]);
    return ruta('mejoras/' + cadena + '-' + n);
  }

  function moneda() { return ruta('escena/moneda'); }

  return {
    ruta: ruta,
    personaje: personaje,
    tienePersonaje: tiene,
    local: local,
    mejora: mejora,
    moneda: moneda,
    // Lo que las pruebas cruzan contra el disco
    PERSONAJE: PERSONAJE,
    NIVELES_LOCAL: NIVELES_LOCAL,
    MEJORAS: MEJORAS,
    base: function () { return BASE; }
  };
})();
