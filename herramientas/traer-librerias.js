/* Trae las librerías externas al repositorio, una sola vez.
 *
 * ---------------------------------------------------------------------------
 * Por qué existe este script
 * ---------------------------------------------------------------------------
 * El juego promete tres cosas: se abre con doble clic, funciona sin internet y
 * no hay nada que instalar. Un `<script src="https://cdn...">` rompe las dos
 * últimas, y un `npm install` rompe la tercera.
 *
 * La salida son archivos normales dentro de `vendor/`, que se suben al
 * repositorio y se cargan como cualquier otro script. Quien juega no descarga
 * nada; quien programa tampoco, salvo que quiera regenerarlos.
 *
 * Uso (solo hace falta si se quiere actualizar o agregar iconos):
 *
 *   npm install --no-save lucide-static chart.js
 *   node herramientas/traer-librerias.js
 *
 * Si `vendor/` ya está en el repositorio, esto NO hace falta para nada.
 *
 * ---------------------------------------------------------------------------
 * Qué se trae y qué no
 * ---------------------------------------------------------------------------
 *   lucide-static (ISC)  Se recortan SOLO los iconos que el juego nombra en
 *                        ICONOS_PEDIDOS, más abajo. El paquete trae 1,815 y el
 *                        juego usa unas decenas: meterlos todos serían 400 KB
 *                        de dibujos que nadie va a ver.
 *   chart.js (MIT)       Se copia el bundle UMD tal cual. Es lo que dibuja las
 *                        gráficas del negocio y del patrimonio.
 *
 * Y lo que se decidió NO traer, para que no se vuelva a preguntar:
 *
 *   howler.js     Envuelve la reproducción de ARCHIVOS de audio, y el juego no
 *                 tiene archivos de audio: js/sonido.js sintetiza los tonos con
 *                 la Web Audio API, que es algo que Howler no hace. Serían 30 KB
 *                 sin una sola línea de uso.
 *   day.js        Sirve para fechas de verdad. El juego lleva un contador de mes
 *                 (0 a 11) y un año entero, y los nombres de los meses ya están
 *                 traducidos en el diccionario. No hay nada que formatear.
 *   dicebear      Sus paquetes son solo ESM y no traen build UMD, y un
 *                 `<script type="module">` sobre file:// lo bloquea el navegador
 *                 por CORS: rompería el doble clic. Además genera avatares a
 *                 partir de una semilla, y lo que este juego necesita es lo
 *                 contrario: un personaje que se VISTA del oficio que eligió el
 *                 jugador. Eso lo hace js/personaje.js y DiceBear no puede.
 *   kenney assets Son descargas .zip de kenney.nl, que desde esta red no
 *                 responde, y son PNG: pesan y no toman el color de la paleta.
 *                 Lo que sí se tomó de ahí es el ESTILO —trazo gordo, formas
 *                 macizas, esquinas redondas— y está dibujado a mano en
 *                 js/escena.js.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const VENDOR = path.join(RAIZ, 'vendor');
const NL = String.fromCharCode(10);

/* Los iconos de Lucide que el juego nombra.
 *
 * Ojo: js/iconos.js sigue teniendo sus propios dibujos y esos NO se tocan.
 * Lucide entra como respaldo, para lo que se agregue de aquí en adelante sin
 * tener que dibujarlo a mano. Agregar uno es escribir su nombre aquí y volver
 * a correr el script. */
const ICONOS_PEDIDOS = [
  // el negocio y sus niveles
  'store', 'shopping-cart', 'shopping-basket', 'warehouse', 'building-2',
  'package', 'boxes', 'truck', 'bike', 'tent',
  // herramientas y oficios
  'hammer', 'wrench', 'hard-hat', 'shirt', 'scissors', 'paint-roller',
  // estudio
  'backpack', 'book-open', 'graduation-cap', 'laptop', 'wifi', 'pencil',
  // casa y descanso
  'bed', 'sofa', 'lamp', 'house', 'coffee',
  // dinero
  'piggy-bank', 'banknote', 'coins', 'wallet', 'receipt', 'credit-card',
  'landmark', 'hand-coins',
  // progreso y premio, que es lo que un tycoon celebra
  'trending-up', 'chart-column', 'chart-line', 'sparkles', 'party-popper',
  'trophy', 'medal', 'star', 'crown', 'flame', 'target', 'rocket',
  'lightbulb', 'gauge', 'layers', 'arrow-up-right',
  // varios
  'clock', 'sun', 'sunset', 'moon', 'users', 'user', 'briefcase', 'key',
  'gift', 'shield', 'lock', 'circle-check', 'circle-alert', 'plus', 'minus'
];

function traerLucide() {
  const origen = path.join(RAIZ, 'node_modules', 'lucide-static');
  const nodos = JSON.parse(fs.readFileSync(path.join(origen, 'icon-nodes.json'), 'utf8'));
  const licencia = fs.readFileSync(path.join(origen, 'LICENSE'), 'utf8')
    .split(NL).slice(0, 3).join(' ').trim();

  const faltan = ICONOS_PEDIDOS.filter(n => !nodos[n]);
  if (faltan.length) {
    console.log('  OJO: estos nombres no existen en Lucide: ' + faltan.join(', '));
  }

  /* Cada icono de Lucide es una lista de nodos [etiqueta, atributos]. Se
   * convierten al mismo formato que usa js/iconos.js: el interior del SVG,
   * sin relleno y sin color, para que herede el del texto. */
  const lineas = [];
  ICONOS_PEDIDOS.forEach(function (nombre) {
    const nodo = nodos[nombre];
    if (!nodo) return;
    const interior = nodo.map(function (par) {
      const etiqueta = par[0];
      const attrs = par[1] || {};
      const partes = Object.keys(attrs)
        .filter(k => k !== 'key')
        .map(k => k + '="' + String(attrs[k]).replace(/"/g, '&quot;') + '"');
      return '<' + etiqueta + (partes.length ? ' ' + partes.join(' ') : '') + '/>';
    }).join('');
    lineas.push("    '" + nombre + "': '" + interior.replace(/'/g, "\\'") + "'");
  });

  const salida = [
    '/* Iconos de Lucide, recortados para este juego. NO SE EDITA A MANO.',
    ' *',
    ' * Generado por herramientas/traer-librerias.js a partir del paquete',
    ' * lucide-static. Para agregar un icono, escribe su nombre en la lista',
    ' * ICONOS_PEDIDOS de ese script y vuelve a correrlo.',
    ' *',
    ' * ' + licencia,
    ' * https://lucide.dev',
    ' *',
    ' * Son ' + lineas.length + ' iconos de los 1,815 que trae el paquete. js/iconos.js',
    ' * los usa como respaldo: si un nombre no esta dibujado a mano, se busca aqui.',
    ' */',
    '',
    'var LUCIDE_TRAZOS = (function () {',
    '  return {',
    lineas.join(',' + NL),
    '  };',
    '})();',
    ''
  ].join(NL);

  fs.writeFileSync(path.join(VENDOR, 'lucide.js'), salida, 'utf8');
  console.log('  vendor/lucide.js  ' + lineas.length + ' iconos, ' +
              Math.round(salida.length / 1024) + ' KB');
}

function traerChart() {
  const origen = path.join(RAIZ, 'node_modules', 'chart.js', 'dist', 'chart.umd.min.js');
  const licencia = path.join(RAIZ, 'node_modules', 'chart.js', 'LICENSE.md');
  const cuerpo = fs.readFileSync(origen, 'utf8');
  const cabecera = [
    '/* Chart.js 4, bundle UMD. NO SE EDITA A MANO.',
    ' * Copiado por herramientas/traer-librerias.js. Licencia MIT.',
    ' * https://www.chartjs.org',
    ' *',
    ' * El juego lo usa para las graficas del negocio y del patrimonio, y SIEMPRE',
    ' * comprobando `typeof Chart !== "undefined"`: si este archivo no esta, el',
    ' * juego se dibuja igual sin graficas.',
    ' */',
    ''
  ].join(NL);
  fs.writeFileSync(path.join(VENDOR, 'chart.js'), cabecera + cuerpo, 'utf8');
  if (fs.existsSync(licencia)) {
    fs.copyFileSync(licencia, path.join(VENDOR, 'chart.js.LICENSE.md'));
  }
  console.log('  vendor/chart.js   ' + Math.round(cuerpo.length / 1024) + ' KB');
}

if (!fs.existsSync(VENDOR)) fs.mkdirSync(VENDOR);
console.log('trayendo librerias a vendor/');
traerLucide();
traerChart();
console.log('listo. vendor/ se sube al repositorio: quien juega no descarga nada.');
