/* Arranque compartido de las pruebas.
 * Carga el juego completo en un entorno sin navegador, con un DOM mínimo.
 * Así las cuatro pruebas no repiten la misma plomería.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..') + '/';

const ARCHIVOS = [
  'datos/config.js', 'datos/trabajos.js', 'datos/carreras.js', 'datos/creditos.js',
  'datos/eventos.js', 'datos/largoplazo.js', 'datos/origenes.js', 'datos/migracion.js',
  'datos/glosario.js', 'datos/textos.en.js', 'datos/textos.en.v2.js',
  'js/idioma.js', 'js/sonido.js', 'js/motor.js',
  'js/minijuegos/marco.js', 'js/minijuegos/reparto.js', 'js/minijuegos/tienda.js',
  'js/minijuegos/estafas.js', 'js/minijuegos/presupuesto.js', 'js/minijuegos/caja.js',
  'js/minijuegos/conciliacion.js', 'js/minijuegos/obra.js', 'js/minijuegos/inversion.js',
  'js/ui.js'
];

function Elem(tag) {
  return {
    tagName: tag || 'div', _html: '', className: '', dataset: {}, style: {},
    hijos: [], oyentes: {}, id: '',
    set innerHTML(v) { this._html = String(v); },
    get innerHTML() { return this._html; },
    addEventListener(t, f) { (this.oyentes[t] = this.oyentes[t] || []).push(f); },
    removeEventListener() {},
    appendChild(c) { this.hijos.push(c); return c; },
    remove() {},
    querySelector() { return Elem('div'); },
    querySelectorAll() { return []; },
    closest() { return null; },
    classList: { add() {}, remove() {}, contains() { return false; } },
    focus() {}, textContent: ''
  };
}

/* Devuelve un juego cargado y aislado. `idioma` es 'es' o 'en'. */
function cargar(idioma) {
  const almacen = {};
  if (idioma) almacen['miPrimerQuetzal.idioma'] = idioma;
  const app = Elem('div');

  const sb = {
    localStorage: {
      setItem: (k, v) => { almacen[k] = v; },
      getItem: (k) => (k in almacen ? almacen[k] : null),
      removeItem: (k) => { delete almacen[k]; }
    },
    console,
    document: {
      querySelector: (s) => (s === '#app' ? app : Elem('div')),
      createElement: (t) => Elem(t),
      body: Elem('body'),
      documentElement: { lang: 'es' }
    },
    navigator: { language: idioma === 'en' ? 'en-US' : 'es-GT' },
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    unescape, escape, encodeURIComponent, decodeURIComponent,
    setTimeout, clearTimeout, setInterval: () => 0, clearInterval,
    location: { reload() {} },
    _app: app, _almacen: almacen
  };
  sb.window = sb;
  vm.createContext(sb);
  for (const f of ARCHIVOS) {
    vm.runInContext(fs.readFileSync(RAIZ + f, 'utf8'), sb, { filename: f });
  }
  return sb;
}

/* Marcador de comprobaciones */
function Marcador() {
  const lineas = [];
  return {
    ok(cond, msg) { lineas.push((cond ? '  OK   ' : '  FALLA ') + msg); return !!cond; },
    imprimir(titulo) {
      console.log('\n=== ' + titulo + ' ===');
      lineas.forEach(l => console.log(l));
      const f = lineas.filter(l => l.startsWith('  FALLA')).length;
      console.log(`\n${lineas.length - f} de ${lineas.length} comprobaciones pasaron.`);
      if (f) process.exitCode = 1;
      return f;
    }
  };
}

/* Reparte las cuatro semanas: n de trabajo, el resto descanso. */
function trabajar(Motor, n) {
  for (let i = 0; i < 4; i++) Motor.asignarEspacio(i, i < (n === undefined ? 3 : n) ? 'trabajo' : 'descanso');
  return Motor.cerrarTurno();
}

/* Fija el azar DENTRO del contexto aislado mientras corre fn.
 *
 * Cada contexto de vm tiene su propio Math, así que sobrescribir Math.random
 * aquí afuera no toca el del juego. Sin esto, las pruebas que dependen de una
 * tirada (migrar, eventos) fallan de vez en cuando y parece un bug del juego.
 */
function conAzarFijo(sb, valor, fn) {
  vm.runInContext(
    '(function(){ globalThis.__azar = Math.random; Math.random = function(){ return ' +
    Number(valor) + '; }; })()', sb);
  try { return fn(); }
  finally {
    vm.runInContext('(function(){ if (globalThis.__azar) Math.random = globalThis.__azar; })()', sb);
  }
}

/* Azar reproducible.
 *
 * conAzarFijo congela Math.random en un solo valor, lo cual sirve para forzar
 * que un evento ocurra o no ocurra, pero mata toda la variedad del juego.
 * Para jugar vidas enteras hace falta azar de verdad que ademas se repita
 * igual en cada corrida: eso es esto.
 *
 * Ojo con la misma trampa de siempre: cada contexto de vm tiene su propio
 * Math, asi que la sustitucion tiene que hacerse DENTRO del sandbox.
 * Generador mulberry32, corto y de calidad suficiente para una simulacion.
 */
function conAzarSemilla(sb, semilla, fn) {
  vm.runInContext(
    '(function(){' +
    '  globalThis.__azar = Math.random;' +
    '  var s = ' + (semilla >>> 0) + ';' +
    '  Math.random = function(){' +
    '    s = s + 0x6D2B79F5 | 0;' +
    '    var t = Math.imul(s ^ s >>> 15, 1 | s);' +
    '    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;' +
    '    return ((t ^ t >>> 14) >>> 0) / 4294967296;' +
    '  };' +
    '})()', sb);
  try { return fn(); }
  finally {
    vm.runInContext('(function(){ if (globalThis.__azar) Math.random = globalThis.__azar; })()', sb);
  }
}

module.exports = { RAIZ, ARCHIVOS, Elem, cargar, Marcador, trabajar, conAzarFijo, conAzarSemilla };
