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
  'datos/glosario.js', 'datos/decisiones.js', 'datos/mejoras.js', 'datos/negocios.js',
  'datos/progreso.js',
  'datos/textos.en.js', 'datos/textos.en.v2.js',
  'vendor/lucide.js', 'vendor/chart.js',
  'js/idioma.js', 'js/iconos.js', 'js/arte.js', 'js/personaje.js', 'js/escena.js',
  'js/sonido.js', 'js/motor.js',
  'js/minijuegos/marco.js', 'js/minijuegos/reparto.js', 'js/minijuegos/tienda.js',
  'js/minijuegos/sumas.js', 'js/minijuegos/mayor.js', 'js/minijuegos/figuras.js',
  'js/minijuegos/contar.js',
  'js/minijuegos/cambio.js', 'js/minijuegos/precios.js',
  'js/minijuegos/estafas.js', 'js/minijuegos/presupuesto.js',
  'js/minijuegos/logica.js', 'js/minijuegos/primeros.js', 'js/minijuegos/margen.js', 'js/minijuegos/centrado.js', 'js/minijuegos/encaja.js', 'js/minijuegos/siembra.js', 'js/minijuegos/explicar.js', 'js/minijuegos/caja.js',
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
      /* Vacio a proposito: este DOM no tiene geometria, asi que el foco del
       * tutorial no se dibuja y la vista tiene que salir igual sin el. Faltaba
       * del doble, y en cuanto la interfaz empezo a pedir TODAS las opciones
       * senaladas en vez de la primera, esta suite se rompio entera. */
      querySelectorAll: () => [],
      // Devuelve null a proposito: no hay canvas de verdad, asi que la
      // grafica no se dibuja y la vista tiene que salir igual.
      getElementById: () => null,
      createElement: (t) => Elem(t),
      body: Elem('body'),
      documentElement: { lang: 'es' }
    },
    // Chart.js pide estas tres solo para cargarse; nunca se dibuja una
    // grafica en las pruebas, porque este DOM no tiene canvas de verdad.
    navigator: { language: idioma === 'en' ? 'en-US' : 'es-GT', userAgent: 'node' },
    requestAnimationFrame: function () { return 0; },
    cancelAnimationFrame: function () {},
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

/* Abre de golpe toda la ruta de datos/progreso.js.
 *
 * El juego se va abriendo por peldanos, lo cual esta bien para jugar y es un
 * estorbo para una prueba que quiere mirar TODAS las pantallas. Esto las abre
 * sin pasar por el juego.
 *
 * Ojo: la prueba de DOM real NO usa esto. Ahi lo que se comprueba es
 * justamente que la ruta se vaya abriendo sola, peldano por peldano.
 */
function abrirRuta(sb) {
  const e = sb.Motor.get();
  if (!e) return;
  e.desbloqueado = e.desbloqueado || {};
  e.peldanos = e.peldanos || {};
  sb.PROGRESO.forEach(function (p) {
    e.peldanos[p.id] = true;
    p.llaves.forEach(function (k) { e.desbloqueado[k] = true; });
  });
  e.vistos.guiaSaltada = true;   // sin la cinta del tutorial encima
  sb.Motor.guardar();
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

/* Reparte el mes: n SEMANAS de trabajo, el resto descanso.
 *
 * Sigue hablando de semanas porque asi piensan las pruebas ("trabaja tres de
 * cuatro"), pero por dentro el mes son ocho jornadas de media semana, asi que
 * cada semana son dos casillas. Las jornadas que el colegio tenga tomadas no
 * se pueden asignar y asignarEspacio las rechaza sola.
 */
function trabajar(Motor, semanas) {
  const s = semanas === undefined ? 3 : semanas;
  const total = 8;
  for (let i = 0; i < total; i++) {
    Motor.asignarEspacio(i, i < s * 2 ? 'trabajo' : 'descanso');
  }
  return Motor.cerrarTurno();
}

/* Salta la ninez y deja al jugador en edad y nivel de adulto.
 *
 * El juego empieza a los 13 saliendo de primaria. Las pruebas de balanceo, de
 * credito y de largo plazo miden vida laboral adulta: un sueldo, unos gastos y
 * unos productos del banco. Jugar cinco anios de colegio antes de llegar ahi
 * no mide nada y ademas tapa lo que se quiere medir.
 *
 * Ojo: esto NO lo usan pruebas/ruta.js ni pruebas/dom-real.js, que existen
 * justamente para comprobar que la ninez y el tutorial funcionan.
 */
function adulto(sb, opciones) {
  const o = opciones || {};
  const e = sb.Motor.get();
  if (!e) return null;
  e.edad = o.edad === undefined ? sb.CONFIG.mayoriaDeEdad : o.edad;
  e.educacion = o.educacion || 'diversificado';
  e.decisionEstudio = 'no';
  e.mesada = 0;                  // ya no le dan mesada en casa
  e.vistos.cumplio18 = true;     // sin la ventana de "cumpliste 18"
  /* Y el efectivo de un recien graduado, no el de un nino de 13.
   * Es el mismo Q1,200 con que arrancaba el juego cuando empezaba a los 18,
   * asi que las corridas de balanceo siguen siendo comparables con las de
   * antes del cambio. */
  e.efectivo = o.efectivo === undefined ? 1200 : o.efectivo;
  sb.Motor.guardar();
  return e;
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

module.exports = { RAIZ, ARCHIVOS, Elem, cargar, Marcador, trabajar, adulto,
                   abrirRuta, conAzarFijo, conAzarSemilla };
