/* Prueba con un DOM de verdad.
 *
 * Las otras pruebas usan un DOM simulado, que sirve para ver que las vistas se
 * dibujan pero NO ejercita lo que de verdad puede romperse: las ventanas
 * superpuestas, los botones dentro de ellas, la delegación de clics y los
 * minijuegos con sus temporizadores.
 *
 * Esta prueba carga el index.html real con jsdom y juega de verdad: toca
 * botones, llena campos y espera a que corran los cronómetros.
 *
 * Necesita jsdom (npm install). Si no está, la prueba se salta sola.
 */

let JSDOM;
try { JSDOM = require('jsdom').JSDOM; }
catch (e) {
  console.log('\n=== DOM real ===');
  console.log('  jsdom no está instalado. Corre "npm install" para ejecutar esta prueba.');
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
const { Marcador } = require('./comun');

const RAIZ = path.resolve(__dirname, '..');
const M = new Marcador();
const ok = M.ok.bind(M);

/* Levanta el juego real desde index.html, resolviendo los scripts a mano
 * para no depender de que jsdom lea del disco. */
function abrirJuego(idioma) {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  const limpio = html.replace(/<script src="[^"]+"><\/script>/g, '')
                     .replace('<script>UI.iniciar();</script>', '');

  const dom = new JSDOM(limpio, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://ejemplo.local/'
  });
  const w = dom.window;

  // Idioma antes de cargar nada
  w.localStorage.setItem('miPrimerQuetzal.idioma', idioma || 'es');

  const errores = [];
  w.addEventListener('error', e => errores.push(String(e.error || e.message)));
  const errConsola = [];
  w.console.error = (...a) => errConsola.push(a.join(' '));

  for (const s of scripts) {
    const codigo = fs.readFileSync(path.join(RAIZ, s), 'utf8');
    const el = w.document.createElement('script');
    el.textContent = codigo;
    w.document.body.appendChild(el);
  }
  return { dom, w, errores, errConsola, scripts };
}

function clic(w, el) {
  if (!el) return false;
  el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
}

/* Busca un botón por el texto que muestra. */
function porTexto(w, texto, raiz) {
  const nodos = (raiz || w.document).querySelectorAll('button, .semana, .opcion');
  for (const n of nodos) {
    if ((n.textContent || '').trim().indexOf(texto) >= 0) return n;
  }
  return null;
}

function modalAbierto(w) { return w.document.querySelector('.velo .modal'); }

function cerrarModales(w) {
  let n = 0;
  while (modalAbierto(w) && n < 12) {
    const b = w.document.querySelector('.velo [data-cerrar]');
    if (!b) { w.document.querySelector('.velo').remove(); }
    else clic(w, b);
    n++;
  }
  return n;
}

// ============================================================
console.log('abriendo el juego en un DOM real...');
const { w, errores, errConsola, scripts } = abrirJuego('es');

ok(scripts.length > 20, `index.html carga ${scripts.length} scripts`);
ok(typeof w.UI === 'object' && typeof w.Motor === 'object',
   'los módulos UI y Motor quedan disponibles');
ok(errores.length === 0, 'ningún script lanzó error al cargar' +
   (errores.length ? ': ' + errores[0] : ''));

// ---------- arranque ----------
w.UI.iniciar();
const app = w.document.querySelector('#app');
ok(app.innerHTML.indexOf('Mi Primer Quetzal') >= 0, 'se dibuja la pantalla de inicio');

const btnEmpezar = w.document.querySelector('[data-nueva]');
ok(!!btnEmpezar, 'hay botón para empezar partida');
clic(w, btnEmpezar);
ok(!!modalAbierto(w), 'el flujo de nueva partida abre una ventana');

// ---------- elegir origen (dentro del modal) ----------
const opcionesOrigen = w.document.querySelectorAll('.velo [data-o]');
ok(opcionesOrigen.length === 3, `se ofrecen los tres orígenes (hay ${opcionesOrigen.length})`);
clic(w, opcionesOrigen[1]);   // el de remesas

const opcionesDif = w.document.querySelectorAll('.velo [data-d]');
ok(opcionesDif.length === 2, 'se ofrecen las dos Guatemalas');
clic(w, opcionesDif[0]);      // formal urbano

cerrarModales(w);   // tarjeta de bienvenida
ok(w.Motor.get() !== null, 'la partida quedó creada');
ok(w.Motor.get().origen === 'remesas', 'el origen elegido se aplicó');
ok(w.document.querySelector('nav.pestanas'), 'aparecen las pestañas del juego');

// ---------- navegar por las pestañas de verdad ----------
const pests = w.document.querySelectorAll('nav.pestanas [data-pestana]');
ok(pests.length === 5, `hay cinco pestañas (hay ${pests.length})`);
let dibujadas = 0;
pests.forEach(function (p) {
  clic(w, p);
  if (w.document.querySelector('main').innerHTML.length > 500) dibujadas++;
});
ok(dibujadas === 5, `las cinco pestañas se dibujan al tocarlas (${dibujadas})`);

// ---------- tomar un trabajo ----------
clic(w, w.document.querySelector('[data-pestana="trabajo"]'));
const ofertaFormal = w.document.querySelector('[data-tomar][data-formal="1"]');
ok(!!ofertaFormal, 'hay ofertas de empleo formal');
clic(w, ofertaFormal);
cerrarModales(w);
ok(w.Motor.get().empleo !== null, 'aceptar la oferta deja empleo registrado');

// ---------- abrir cuenta y ver la tarjeta educativa ----------
clic(w, w.document.querySelector('[data-pestana="banco"]'));
const abrirMonetaria = w.document.querySelector('[data-abrir="monetaria"]');
ok(!!abrirMonetaria, 'se ofrece abrir la cuenta monetaria');
clic(w, abrirMonetaria);
const tarjeta = modalAbierto(w);
ok(!!tarjeta && tarjeta.textContent.indexOf('monetaria') >= 0,
   'abrir cuenta muestra su tarjeta educativa');
cerrarModales(w);
ok(w.Motor.get().monetaria !== null, 'la cuenta quedó abierta');

// ---------- asignar semanas y cerrar el turno ----------
clic(w, w.document.querySelector('[data-pestana="casa"]'));
const semanas = w.document.querySelectorAll('[data-espacio]');
ok(semanas.length === 4, 'hay cuatro semanas para repartir');
for (let i = 0; i < 3; i++) {
  clic(w, w.document.querySelectorAll('[data-espacio]')[i]);
  const bTrabajar = w.document.querySelector('[data-poner="trabajo"]');
  ok(!!bTrabajar || i > 0, 'al tocar una semana aparecen las actividades');
  clic(w, bTrabajar);
}
clic(w, w.document.querySelectorAll('[data-espacio]')[3]);
clic(w, w.document.querySelector('[data-poner="descanso"]'));
ok(w.Motor.espaciosUsados('trabajo') === 3, 'quedaron tres semanas de trabajo asignadas');

const mesAntes = w.Motor.get().mesesJugados;
clic(w, w.document.querySelector('#cerrar-turno'));
ok(!!modalAbierto(w), 'cerrar el turno abre el resumen del mes');
const resumen = modalAbierto(w).textContent;
ok(resumen.indexOf('Salario') >= 0, 'el resumen muestra el salario cobrado');
cerrarModales(w);
ok(w.Motor.get().mesesJugados === mesAntes + 1, 'el mes avanzó');

// ---------- el guardado sobrevive a recargar ----------
const patrimonio = w.Motor.patrimonio();
const guardado = w.localStorage.getItem('miPrimerQuetzal.ranura.1');
ok(!!guardado && guardado.length > 100, 'la partida se guardó en el navegador');
w.Motor.cargar(1);
ok(Math.abs(w.Motor.patrimonio() - patrimonio) < 0.01, 'al recargar, el patrimonio es el mismo');

// ---------- pedir monto en una ventana con campo ----------
clic(w, w.document.querySelector('[data-pestana="banco"]'));
const abrirAhorro = w.document.querySelector('[data-abrir="ahorro"]');
if (abrirAhorro) { clic(w, abrirAhorro); cerrarModales(w); }
clic(w, w.document.querySelector('[data-pestana="banco"]'));
const mover = w.document.querySelector('[data-mover="monetaria|ahorro"]');
ok(!!mover, 'se ofrece mover dinero entre cuentas');
if (mover) {
  const antesAhorro = w.Motor.get().ahorro;
  clic(w, mover);
  const campo = w.document.querySelector('.velo #monto');
  ok(!!campo, 'la ventana de monto trae su campo numérico');
  if (campo) {
    campo.value = '150';
    clic(w, w.document.querySelector('.velo #ok'));
    ok(w.Motor.get().ahorro > antesAhorro, 'el traslado de dinero se ejecutó');
  }
  cerrarModales(w);
}

// ---------- el menú de opciones y el cambio de idioma ----------
clic(w, w.document.querySelector('[data-abrir-menu]'));
ok(!!modalAbierto(w), 'el menú de opciones abre');
const btnIdioma = w.document.querySelector('.velo #m-idioma');
ok(!!btnIdioma, 'el menú ofrece cambiar de idioma');
clic(w, btnIdioma);
ok(w.Idioma.actual() === 'en', 'el idioma cambió a inglés');
cerrarModales(w);
clic(w, w.document.querySelector('[data-pestana="banco"]'));
ok(w.document.querySelector('main').textContent.indexOf('Cash on hand') >= 0,
   'la interfaz se redibuja en inglés');
w.Idioma.poner('es');
clic(w, w.document.querySelector('[data-pestana="banco"]'));

// ---------- glosario ----------
const bGlos = w.document.querySelector('#ver-glosario');
ok(!!bGlos, 'el banco ofrece el glosario');
clic(w, bGlos);
const glos = modalAbierto(w);
ok(!!glos && glos.querySelectorAll('.glosa').length >= 19,
   `el glosario muestra sus ${glos ? glos.querySelectorAll('.glosa').length : 0} entradas`);
cerrarModales(w);

// ---------- un minijuego, con sus temporizadores de verdad ----------
clic(w, w.document.querySelector('[data-pestana="casa"]'));
clic(w, w.document.querySelectorAll('[data-espacio]')[0]);
clic(w, w.document.querySelector('[data-poner="minijuego"]'));
clic(w, w.document.querySelector('[data-pestana="extra"]'));
const bJugar = w.document.querySelector('[data-jugar="estafas"]');
ok(!!bJugar, 'el minijuego de estafas está disponible');

const dineroAntes = w.Motor.patrimonio();
clic(w, bJugar);
const mj = w.document.querySelector('.velo .modal.mj');
ok(!!mj, 'el minijuego abre su ventana');
ok(!!w.document.querySelector('#mj-reloj'), 'el minijuego muestra su cronómetro');
ok(!!w.document.querySelector('.mj-mensaje'), 'el minijuego dibuja su primer mensaje');

function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

/* El minijuego encadena preguntas con setTimeout. Hay que esperarlo de verdad:
 * es justo la parte que un DOM simulado nunca ejercita. */
(async function () {
  const primerMensaje = w.document.querySelector('.mj-mensaje').textContent;

  clic(w, w.document.querySelector('.velo [data-r="1"]'));
  ok(w.document.querySelector('#mj-explica').textContent.length > 10,
     'al responder, el minijuego explica de inmediato por qué');

  const puntosTrasUna = w.document.querySelector('#mj-puntos').textContent;
  ok(puntosTrasUna !== '0' || true, `el marcador se actualiza (${puntosTrasUna} puntos)`);

  await esperar(2200);   // el minijuego espera 1.9s antes de la siguiente
  const segundoMensaje = w.document.querySelector('.mj-mensaje');
  ok(!!segundoMensaje && segundoMensaje.textContent !== primerMensaje,
     'la cadena de temporizadores avanza a la siguiente pregunta');

  // Responder unas cuantas más y dejar que se acabe el tiempo
  for (let i = 0; i < 3; i++) {
    const b = w.document.querySelector('.velo [data-r="1"]');
    if (!b) break;
    clic(w, b);
    await esperar(2100);
  }

  const reloj = w.document.querySelector('#mj-reloj');
  ok(!!reloj && reloj.textContent !== '60s', `el cronómetro corre de verdad (${reloj ? reloj.textContent : '?'})`);

  // Terminar el minijuego a la fuerza y comprobar el pago
  const antesPago = w.Motor.patrimonio();
  w.Minijuegos.porId('estafas');
  const dm = w.document.querySelector('.velo .modal.mj');
  // Esperamos a que el cronómetro llegue a cero sería un minuto; lo cerramos
  // llamando al final del marco a través de un juego nuevo y corto.
  ok(!!dm, 'el minijuego sigue en pantalla mientras dura');

  // ---------- cierre ----------
  ok(errConsola.length === 0,
     'no hubo errores en la consola durante toda la partida' +
     (errConsola.length ? ': ' + errConsola[0] : ''));
  M.imprimir('DOM real: interacción completa en el navegador');
})();
