/* Prueba de las ilustraciones.
 *
 * El fallo que esta suite existe para atrapar no lanza ningún error y no se ve
 * en ninguna consola: **una imagen que falta deja un hueco vacío**. El juego
 * sigue funcionando, las otras once suites siguen pasando, y en la pantalla no
 * hay nada donde debería estar el chico.
 *
 * Así que lo que se comprueba aquí es la correspondencia entre tres cosas que
 * viven en sitios distintos y tienen que decir lo mismo:
 *
 *   1. el inventario declarado en `js/arte.js`
 *   2. los archivos que hay en `assets/juego/`
 *   3. lo que los datos del juego piden: los oficios de `ROPA`, los niveles de
 *      un negocio y los escalones de cada cadena de mejoras
 *
 * Y una cuarta cosa, que es la que de verdad protege la promesa del proyecto:
 * que las imágenes que el navegador carga **sigan pesando poco**. Los maestros
 * de `assets/visuales/` pesan 90 MB. Si alguien conecta esos por error, el
 * juego deja de abrirse con doble clic en un teléfono y nadie se entera hasta
 * que lo prueba con datos móviles.
 */

const fs = require('fs');
const path = require('path');
const { cargar, Marcador } = require('./comun');

const RAIZ = path.join(__dirname, '..');
const JUEGO = path.join(RAIZ, 'assets', 'juego');
const MAESTROS = path.join(RAIZ, 'assets', 'visuales');

const sb = cargar('es');
const { Arte, Personaje, TRABAJOS, MIGRACION, CADENAS, MEJORAS, NIVELES_NEGOCIO } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

const hay = p => fs.existsSync(path.join(RAIZ, p));
const kb = p => fs.statSync(path.join(RAIZ, p)).size / 1024;

// ---------- 1. lo declarado está en el disco ----------

/* Arte.personaje() y compañía devuelven rutas relativas a la página. Para
 * mirarlas en el disco hay que quitarles el prefijo, que en las pruebas es el
 * de index.html. */
const base = Arte.base();
const enDisco = ruta => hay(ruta);

const faltanArchivos = [];

Arte.PERSONAJE.forEach(function (clave) {
  const r = base + 'personaje/' + clave + '.webp';
  if (!enDisco(r)) faltanArchivos.push(r);
});
for (let n = 1; n <= Arte.NIVELES_LOCAL; n++) {
  const r = base + 'negocio/n' + n + '.webp';
  if (!enDisco(r)) faltanArchivos.push(r);
}
Object.keys(Arte.MEJORAS).forEach(function (cadena) {
  for (let n = 1; n <= Arte.MEJORAS[cadena]; n++) {
    const r = base + 'mejoras/' + cadena + '-' + n + '.webp';
    if (!enDisco(r)) faltanArchivos.push(r);
  }
});
if (!enDisco(base + 'escena/moneda.webp')) faltanArchivos.push(base + 'escena/moneda.webp');

const declaradas = Arte.PERSONAJE.length + Arte.NIVELES_LOCAL +
  Object.keys(Arte.MEJORAS).reduce((a, c) => a + Arte.MEJORAS[c], 0) + 1;

ok(faltanArchivos.length === 0,
   faltanArchivos.length === 0
     ? `las ${declaradas} ilustraciones declaradas están en assets/juego/`
     : 'declaradas pero no están en el disco: ' + faltanArchivos.slice(0, 5).join(', '));

// ---------- 2. y lo que está en el disco está declarado ----------

/* Al revés también importa, pero por otro motivo: un archivo que nadie usa es
 * peso muerto que se sube al repositorio y nadie se atreve a borrar porque no
 * sabe si hace falta. */
function listar(dir, prefijo) {
  const p = path.join(JUEGO, dir);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter(f => f.endsWith('.webp'))
           .map(f => prefijo + f.slice(0, -5));
}
const enElDisco = [].concat(
  listar('personaje', 'personaje/'),
  listar('negocio', 'negocio/'),
  listar('mejoras', 'mejoras/'),
  listar('escena', 'escena/'));

const declaradasSet = new Set(
  Arte.PERSONAJE.map(c => 'personaje/' + c)
    .concat(Array.from({ length: Arte.NIVELES_LOCAL }, (_, i) => 'negocio/n' + (i + 1)))
    .concat(Object.keys(Arte.MEJORAS).flatMap(c =>
      Array.from({ length: Arte.MEJORAS[c] }, (_, i) => 'mejoras/' + c + '-' + (i + 1))))
    .concat(['escena/moneda', 'escena/plataforma']));

const sobran = enElDisco.filter(c => !declaradasSet.has(c));
ok(sobran.length === 0,
   sobran.length === 0
     ? `y las ${enElDisco.length} de assets/juego/ están todas declaradas`
     : 'en el disco pero sin declarar en js/arte.js: ' + sobran.join(', '));

// ---------- 3. cada oficio del juego tiene con qué verse ----------

/* Un oficio sin ilustración NO es un fallo: se dibuja por piezas, y eso es a
 * propósito. Lo que sí se cuenta es cuántos van por cada camino, porque si
 * mañana alguien agrega diez empleos y ninguno se ilustra, conviene saberlo
 * antes de que la pantalla se vea a dos estilos. */
const empleos = TRABAJOS.concat(MIGRACION.empleos).map(t => t.id);
const ilustrados = empleos.filter(id => Arte.tienePersonaje(id));
const dibujados = empleos.filter(id => !Arte.tienePersonaje(id));
ok(ilustrados.length === empleos.length,
   ilustrados.length === empleos.length
     ? `los ${empleos.length} empleos del juego tienen ilustración`
     : `${dibujados.length} se dibujan por piezas: ${dibujados.join(', ')}`);

/* Y todo lo ilustrado tiene que corresponder a algo que el juego pida: un
 * `personaje/mecanico.webp` que ningún empleo use no se va a ver nunca. */
const especiales = new Set(['base', 'estudiante', 'graduado']);
const huerfanas = Arte.PERSONAJE.filter(c => !especiales.has(c) && empleos.indexOf(c) < 0);
ok(huerfanas.length === 0,
   huerfanas.length === 0
     ? 'y ninguna ilustración de oficio sobra'
     : 'ilustraciones de oficios que no existen: ' + huerfanas.join(', '));

// ---------- 4. los niveles cuadran con los datos ----------

ok(Arte.NIVELES_LOCAL === NIVELES_NEGOCIO.length,
   `hay una ilustración por cada uno de los ${NIVELES_NEGOCIO.length} niveles de un negocio`);

const cadenasCortas = CADENAS.filter(function (c) {
  const escalones = MEJORAS.filter(m => m.cadena === c.id).length;
  return (Arte.MEJORAS[c.id] || 0) < escalones;
}).map(c => c.id + ': ' + MEJORAS.filter(m => m.cadena === c.id).length +
            ' escalones y ' + (Arte.MEJORAS[c.id] || 0) + ' ilustraciones');
ok(cadenasCortas.length === 0,
   cadenasCortas.length === 0
     ? 'y una por cada escalón de las tres cadenas de mejoras'
     : 'cadenas con más escalones que ilustraciones: ' + cadenasCortas.join(' | '));

// ---------- 5. y siguen pesando poco ----------

/* La promesa del proyecto es que el juego abre con doble clic y funciona sin
 * internet. Los maestros pesan 90 MB; estas son las que el navegador carga. */
const TOPE_UNA = 90;        // KB
const TOPE_TODAS = 1500;    // KB

let total = 0;
const gordas = [];
enElDisco.forEach(function (c) {
  const r = 'assets/juego/' + c + '.webp';
  if (!hay(r)) return;
  const k = kb(r);
  total += k;
  if (k > TOPE_UNA) gordas.push(`${c} (${Math.round(k)} KB)`);
});
ok(gordas.length === 0,
   gordas.length === 0
     ? `ninguna pasa de ${TOPE_UNA} KB`
     : `ilustraciones demasiado pesadas: ${gordas.join(', ')}`);
ok(total < TOPE_TODAS,
   `las ${enElDisco.length} juntas pesan ${Math.round(total)} KB, menos del tope de ${TOPE_TODAS}`);

/* Y que nadie conecte los maestros por error. Si una ruta de assets/visuales/
 * aparece en el código del juego, el navegador se va a descargar 2 MB para
 * pintar 64 px. */
const FUENTES = ['js/arte.js', 'js/escena.js', 'js/personaje.js', 'js/ui.js', 'index.html'];
/* Se busca la ruta ENTRE COMILLAS SIMPLES O DOBLES, que es como el juego
 * escribe una ruta de verdad. Ni la palabra sola ni el acento invertido de un
 * comentario cuentan: js/arte.js explica en su cabecera por que NO carga los
 * maestros, y esa frase no es un fallo. */
const RUTA_MAESTRA = /['"]assets\/visuales/;
const conMaestros = FUENTES.filter(f =>
  RUTA_MAESTRA.test(fs.readFileSync(path.join(RAIZ, f), 'utf8')));
ok(conMaestros.length === 0,
   conMaestros.length === 0
     ? 'y el juego no carga ningún maestro de assets/visuales/'
     : 'estos apuntan a los maestros de 2 MB: ' + conMaestros.join(', '));

// ---------- 6. la ruta se puede mover ----------

/* Una página que no viva en la raíz —pruebas/vista.html— declara RUTA_ASSETS.
 * Si eso se rompe, esa página se ve sin imágenes y nadie lo nota, porque la
 * suite de DOM real no mira archivos. */
const vista = fs.readFileSync(path.join(RAIZ, 'pruebas', 'vista.html'), 'utf8');
ok(/RUTA_ASSETS\s*=\s*'\.\.\/assets\/juego\/'/.test(vista) &&
   vista.indexOf("'js/arte.js'") > 0,
   'pruebas/vista.html declara su propia ruta de imágenes y carga js/arte.js');

const conArte = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
ok(conArte.indexOf('js/arte.js') > 0 &&
   conArte.indexOf('js/arte.js') < conArte.indexOf('js/personaje.js'),
   'e index.html carga js/arte.js antes de personaje.js, que es quien pregunta');

// ---------- 7. los maestros siguen ahí ----------

/* No los carga nadie, pero son el original: si se pierden, no se puede volver
 * a generar assets/juego/ con otro tamaño ni arreglar una imagen. */
const maestros = fs.existsSync(MAESTROS)
  ? fs.readdirSync(MAESTROS, { recursive: true }).filter(f => String(f).endsWith('.png')).length
  : 0;
ok(maestros >= 37, `los ${maestros} PNG maestros siguen en assets/visuales/`);

M.imprimir('las ilustraciones y su peso');
