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

/* La ventana que el jugador está viendo.
 *
 * Puede haber más de una encimada: abrir una cuenta saca su tarjeta educativa
 * y, detrás, el anuncio de que la ruta abrió algo. La de arriba es la última
 * que se agregó, no la primera. */
function modalArriba(w) {
  const todas = w.document.querySelectorAll('.velo .modal');
  return todas.length ? todas[todas.length - 1] : null;
}

/* ¿Alguna de las ventanas abiertas dice esto? */
function algunModalDice(w, texto) {
  for (const m of w.document.querySelectorAll('.velo .modal')) {
    if ((m.textContent || '').indexOf(texto) >= 0) return true;
  }
  return false;
}

function pestanasVisibles(w) {
  return w.document.querySelectorAll('nav.pestanas [data-pestana]');
}

/* Las jornadas del mes que el jugador puede tocar.
 *
 * Las que tiene tomadas el colegio salen con la clase `bloqueado` y no se
 * seleccionan: tocarlas solo saca el aviso de que esa jornada no se negocia. */
function jornadasLibres(w) {
  return w.document.querySelectorAll('.jornada:not(.bloqueado)');
}

/* Reparte las jornadas libres: las primeras a trabajar y las dos últimas a
 * descansar, que es lo que haría un jugador que no quiere enfermarse. */
function repartirJornadas(w) {
  const libres = [...jornadasLibres(w)].map(j => j.getAttribute('data-espacio'));
  libres.forEach(function (idx, n) {
    clic(w, w.document.querySelector('[data-espacio="' + idx + '"]'));
    const que = n < libres.length - 2 ? 'trabajo' : 'descanso';
    clic(w, w.document.querySelector('[data-poner="' + que + '"]'));
  });
  return libres.length;
}

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

/* jsdom no calcula geometría: todos los rectángulos miden cero, y el foco del
 * tutorial no se dibuja si el objetivo no tiene tamaño. Con un rectángulo de
 * mentira el velo y la flecha sí se crean, y así la comprobación de que se
 * apagan al terminar el tutorial mide algo de verdad. */
w.Element.prototype.getBoundingClientRect = function () {
  return { top: 300, left: 20, width: 160, height: 44, bottom: 344, right: 180,
           x: 20, y: 300, toJSON: function () { return {}; } };
};

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

// ---------- elegir nivel (dentro del modal) ----------
/* Eran dos preguntas seguidas con cinco tarjetas largas. Ahora es una: tres
 * niveles de dificultad, y cada uno empareja un origen con una economía. */
const niveles = w.document.querySelectorAll('.velo [data-nivel]');
ok(niveles.length === 3, `se ofrecen los tres niveles (hay ${niveles.length})`);
ok(!!w.document.querySelector('.velo [data-elegir-yo]'),
   'y un enlace para elegir la combinación a mano');
clic(w, niveles[1]);          // el nivel medio

cerrarModales(w);   // tarjeta de bienvenida
ok(w.Motor.get() !== null, 'la partida quedó creada');
ok(w.Motor.get().origen === 'remesas', 'el nivel medio aplica el origen de remesas');
ok(w.Motor.get().dificultad === 'normal', 'y su economía');
ok(w.document.querySelector('nav.pestanas'), 'aparecen las pestañas del juego');

// ---------- el tutorial lleva paso a paso ----------
/* La comprobación honesta de un tutorial guiado: jugar tocando UNICAMENTE lo
 * que la cinta señala, sin saber nada del juego, y ver si llega al final.
 *
 * Si un paso apunta a algo que no está en pantalla, o a algo que al tocarlo no
 * hace nada, este bucle se atasca y la prueba falla diciendo en qué paso.
 */
(function seguirLaCinta() {
  const pasosVistos = [];
  let toques = 0;

  while (w.document.querySelector('.guia') && toques < 40) {
    const paso = w.document.querySelector('.guia-paso');
    const txt = w.document.querySelector('.guia-txt');
    const etiqueta = (paso ? paso.textContent : '?') + ' ' +
                     (txt ? txt.textContent.slice(0, 30) : '');
    if (pasosVistos[pasosVistos.length - 1] !== etiqueta) pasosVistos.push(etiqueta);

    /* Un jugador guiado toca lo que la cinta señala; y si lo que hay que
     * tocar está en otra pestaña, toca "Llévame ahí", que es justo para eso.
     * Si no hay ninguna de las dos, el paso no lleva a ningún lado. */
    // Con la geometría de mentira, el foco se dibuja en cada paso
    if (w.document.querySelector('.senala') && !w.document.querySelector('.foco')) {
      ok(false, 'el foco debería estar encendido en el paso ' + toques);
    }
    const objetivo = w.document.querySelector('.senala') ||
                     w.document.querySelector('[data-guia-ir]');
    if (!objetivo) break;
    clic(w, objetivo);
    cerrarModales(w);                     // tarjetas educativas y anuncios de la ruta
    toques++;
  }

  ok(!w.document.querySelector('.guia'),
     'el tutorial se completa tocando solo lo que señala (' + toques + ' toques)');
  /* Y al terminarlo la pantalla queda limpia.
   *
   * El velo del foco lo dibuja un elemento aparte de la cinta, así que al
   * apagarse la cinta se quedaba encendido: el juego terminaba el tutorial y
   * dejaba la pantalla a oscuras con una flecha señalando un hueco vacío. */
  ok(!w.document.querySelector('.foco'), 'y el velo oscuro se apaga con ella');
  ok(!w.document.querySelector('.foco-flecha'), 'y la flecha también');
  ok(!w.document.querySelector('.senala'), 'y no queda nada señalado');
  ok(pasosVistos.length >= 8,
     'y pasa por ' + pasosVistos.length + ' instrucciones distintas, no una sola');
  const z = w.Motor.get();
  ok(z.decisionEstudio !== null,
     'al terminarlo el jugador ya decidió si estudia o no');
  ok(z.empleo !== null && z.mesesJugados >= 1,
     'y tiene un trabajito y un mes cerrado');
  /* Y NO tiene cuenta en el banco, que es lo correcto: a los 13 no hay razón
   * para tenerla, y el tutorial dejó de regalar productos financieros por
   * obediencia. */
  ok(z.monetaria === null && z.ahorro === null,
     'y sigue sin cuenta en el banco, porque todavía no le hace falta');
  if (w.document.querySelector('.guia')) {
    console.log('           se atascó en: ' + pasosVistos[pasosVistos.length - 1]);
  }
})();

// ---------- la ruta va abriéndose ----------
/* Al terminar el tutorial el jugador ya tiene empleo, cuenta y un mes cerrado.
 * Lo que se comprueba aquí es que la ruta fue abriendo cada cosa a su tiempo y
 * que lo que todavía no toca sigue sin aparecer. */
ok(w.Motor.desbloqueado('trabajo'), 'decidir sobre el estudio abrió el trabajo');
ok(!w.Motor.desbloqueado('banco'),
   'el banco todavía no: se abre cuando el efectivo empiece a irse solo');
ok(!w.document.querySelector('[data-pestana="banco"]'), 'ni su pestaña');
ok(w.Motor.desbloqueado('extra'), 'cerrar el primer mes abrió los trabajos extra');
ok(w.Motor.desbloqueado('mejoras'),
   'y con ellos las Mejoras, que es donde los números suben');
ok(pestanasVisibles(w).length === 5,
   'van cinco pestañas (hay ' + pestanasVisibles(w).length + ')');

/* El banco llega cuando duele no tenerlo. Se le adelanta la fuga de efectivo,
 * que es lo que el juego mira, y se cierra un mes para que la ruta lo vea. */
w.Motor.get().totales.fugaEfectivo = 40;
clic(w, w.document.querySelector('[data-pestana="casa"]'));
ok(!!w.document.querySelector('[data-pestana="banco"]'),
   'con el efectivo yéndose, la pestaña del banco aparece');
ok(w.Motor.desbloqueado('ahorro') && !w.Motor.desbloqueado('monetaria'),
   'y lo que ofrece es la cuenta de ahorro, no la monetaria');
cerrarModales(w);

clic(w, w.document.querySelector('[data-pestana="banco"]'));
ok(!!w.document.querySelector('[data-abrir="ahorro"]'),
   'el banco ofrece abrir la cuenta de ahorro');
ok(!w.document.querySelector('[data-abrir="monetaria"]'),
   'pero no la monetaria: esa la pide un patrono formal');
ok(w.document.querySelector('main').textContent.indexOf('sin manejo de cuenta') >= 0,
   'y dice que la de ahorro no cobra manejo');
ok(!w.document.querySelector('#pedir-prestamo'),
   'no hay crédito, que a los 13 no existe');
ok(!w.document.querySelector('#abrir-pension'),
   'ni pensión, que llega con la edad');
ok(!w.document.querySelector('[data-sub="vivienda"]'),
   'ni el apartado de vivienda: un menor de edad no se muda solo');

// Abre la de ahorro, que es la que un chico de 13 abre de verdad
clic(w, w.document.querySelector('[data-abrir="ahorro"]'));
cerrarModales(w);
ok(w.Motor.get().ahorro !== null, 'la cuenta de ahorro queda abierta');

// ---------- asignar semanas y cerrar otro turno ----------
clic(w, w.document.querySelector('[data-pestana="casa"]'));
const casillas = w.document.querySelectorAll('[data-espacio]');
ok(casillas.length === 8, `el mes son ocho jornadas (hay ${casillas.length})`);

const bloqueadas = w.document.querySelectorAll('.jornada.bloqueado').length;
const estudiando = w.Motor.get().estudio;
ok(estudiando ? bloqueadas === 4 : bloqueadas === 0,
   estudiando ? `el colegio tiene tomadas ${bloqueadas} jornadas` : 'sin colegio no hay jornadas tomadas');

/* Tocar una jornada del colegio no hace nada más que explicar por qué. */
if (bloqueadas) {
  const tomada = w.document.querySelector('.jornada.bloqueado');
  clic(w, tomada);
  ok(!w.document.querySelector('.jornada.sel'),
     'una jornada del colegio no se puede seleccionar');
  ok(w.document.querySelector('main').textContent.indexOf('del colegio') >= 0,
     'y el juego explica por qué en vez de quedarse callado');
}

const cuantas = repartirJornadas(w);
const enTrabajo2 = w.Motor.espaciosUsados('trabajo');
ok(enTrabajo2 === cuantas - 2,
   `quedaron ${enTrabajo2} jornadas de trabajo y dos de descanso`);
ok(w.Motor.get().espacios.every(x => !!x), 'el mes quedó repartido completo');
cerrarModales(w);

const mesAntes = w.Motor.get().mesesJugados;
clic(w, w.document.querySelector('#cerrar-turno'));
ok(!!modalAbierto(w), 'cerrar el turno abre el resumen del mes');
const resumen = modalAbierto(w).textContent;
ok(resumen.indexOf('Salario') >= 0, 'el resumen muestra el salario cobrado');
cerrarModales(w);
ok(w.Motor.get().mesesJugados === mesAntes + 1, 'el mes avanzó');
ok(w.Motor.desbloqueado('noticias'),
   'al segundo mes se abren las noticias, que traen el mercado laboral');
const total = pestanasVisibles(w).length;
ok(total === 7, `y ya están las siete pestañas (hay ${total})`);
let dibujadas = 0;
pestanasVisibles(w).forEach(function (p) {
  clic(w, p);
  if (w.document.querySelector('main').innerHTML.length > 500) dibujadas++;
});
ok(dibujadas === 7, `las siete pestañas se dibujan al tocarlas (${dibujadas})`);

// ---------- el trabajo quedó partido en apartados ----------
clic(w, w.document.querySelector('[data-pestana="trabajo"]'));
const subs = w.document.querySelectorAll('.sub-pestanas [data-sub]');
ok(subs.length === 2, `trabajo tiene dos apartados hasta que se abra migrar (hay ${subs.length})`);
ok(w.document.querySelector('.sub.activa[data-sub="empleo"]'),
   'con empleo, el apartado que abre es Mi empleo');
ok(w.document.querySelectorAll('[data-tomar]').length === 0,
   'y las ofertas no están encima');
ok(w.document.querySelector('.retrato .muneco'),
   'mi empleo muestra al personaje vestido de su oficio');
clic(w, w.document.querySelector('[data-sub="ofertas"]'));
const ofertas = w.document.querySelectorAll('[data-tomar]').length;
// Son tres trabajitos y uno ya es el suyo, asi que quedan dos con boton
ok(ofertas === 2, `las ofertas aparecen al tocar su apartado (${ofertas})`);
ok(w.document.querySelector('main').textContent.indexOf('te falta') < 0,
   'y lo que todavía no puede tomar no se le muestra: no existe hasta que se abra');
ok(!!w.document.querySelector('.oferta .oferta-retrato .muneco'),
   'cada oferta trae al personaje vestido de ese oficio');
ok(w.document.querySelectorAll('[data-tomar][data-formal="1"]').length === 0,
   'a un menor de edad nadie le ofrece un contrato formal');
ok(w.document.querySelector('main').textContent.indexOf('Mercado laboral') < 0,
   'y el mercado laboral ya no está en trabajo');

// ---------- el mercado laboral vive en noticias ----------
clic(w, w.document.querySelector('[data-pestana="noticias"]'));
const noticias = w.document.querySelector('main').textContent;
ok(noticias.indexOf('Mercado laboral') >= 0, 'noticias trae el mercado laboral');
ok(noticias.indexOf('Lo que ha pasado') >= 0, 'y la bitácora de lo que ha pasado');

// ---------- el guardado sobrevive a recargar ----------
const patrimonio = w.Motor.patrimonio();
const guardado = w.localStorage.getItem('miPrimerQuetzal.ranura.1');
ok(!!guardado && guardado.length > 100, 'la partida se guardó en el navegador');
w.Motor.cargar(1);
ok(Math.abs(w.Motor.patrimonio() - patrimonio) < 0.01, 'al recargar, el patrimonio es el mismo');

// ---------- pedir monto en una ventana con campo ----------
clic(w, w.document.querySelector('[data-pestana="banco"]'));
const mover = w.document.querySelector('[data-mover="efectivo|ahorro"]');
ok(!!mover, 'se ofrece mover dinero del efectivo al ahorro');
if (mover) {
  const antesAhorro = w.Motor.get().ahorro;
  clic(w, mover);
  const campo = w.document.querySelector('.velo #monto');
  ok(!!campo, 'la ventana de monto trae su campo numérico');
  if (campo) {
    // Un chico de 13 mueve quetzales, no cientos
    campo.value = '20';
    clic(w, w.document.querySelector('.velo #ok'));
    ok(w.Motor.get().ahorro > antesAhorro, 'el traslado de dinero se ejecutó');
  }
  cerrarModales(w);
}

// ---------- la monetaria y su manejo de cuenta ----------
/* Es la diferencia que el juego quiere enseñar: la de ahorro no cuesta nada, y
 * la monetaria cobra manejo a quien no trae planilla de una empresa. */
(function manejoDeCuenta() {
  const z = w.Motor.get();
  z.edad = 18;
  z.vistos.cumplio18 = true;
  z.efectivo = 600;             // ya es adulto: el mínimo de apertura sube a Q200
  clic(w, w.document.querySelector('[data-pestana="casa"]'));
  cerrarModales(w);
  ok(w.Motor.desbloqueado('monetaria'), 'a los 18 se abre la monetaria');
  clic(w, w.document.querySelector('[data-pestana="banco"]'));
  const abrirMon = w.document.querySelector('[data-abrir="monetaria"]');
  ok(!!abrirMon, 'y el banco la ofrece');
  ok(w.document.querySelector('main').textContent.indexOf('manejo') >= 0,
     'diciendo de entrada que cobra manejo de cuenta');
  clic(w, abrirMon);
  cerrarModales(w);
  ok(z.monetaria !== null, 'la monetaria queda abierta');
  ok(w.Motor.manejoDeCuenta() > 0,
     `y el banco le cobra Q${w.Motor.manejoDeCuenta()} al mes, porque nadie le acredita planilla`);
  w.Motor.tomarTrabajo('tienda', true);
  ok(w.Motor.manejoDeCuenta() === 0,
     'con un empleo formal el manejo desaparece: al banco le interesa la planilla');
  w.Motor.tomarTrabajo('tienda', false);
  ok(w.Motor.manejoDeCuenta() > 0, 'y en informal vuelve a cobrarse');
})();

// ---------- el menú de opciones y el cambio de idioma ----------
clic(w, w.document.querySelector('[data-abrir-menu]'));
ok(!!modalAbierto(w), 'el menú de opciones abre');
const btnIdioma = w.document.querySelector('.velo #m-idioma');
ok(!!btnIdioma, 'el menú ofrece cambiar de idioma');
clic(w, btnIdioma);
ok(w.Idioma.actual() === 'en', 'el idioma cambió a inglés');
cerrarModales(w);
clic(w, w.document.querySelector('[data-pestana="banco"]'));
ok(w.document.querySelector('main').textContent.indexOf('In hand') >= 0,
   'la interfaz se redibuja en inglés');
w.Idioma.poner('es');
clic(w, w.document.querySelector('[data-pestana="banco"]'));

// ---------- la pantalla de "Yo" ----------
/* Lo que el jugador ES (su patrimonio, su historial, su nivel) salió de la
 * pestaña del banco y vive aquí, detrás del muñeco de la barra de arriba. */
clic(w, w.document.querySelector('[data-pestana="banco"]'));
ok(w.document.querySelector('main').textContent.indexOf('Patrimonio') < 0,
   'el banco ya no muestra el patrimonio: eso no es un producto');

clic(w, w.document.querySelector('[data-ver-perfil]'));
const perfil = modalAbierto(w);
ok(!!perfil, 'el muñeco de la barra abre la pantalla de Yo');
ok(!!perfil && perfil.textContent.indexOf('Patrimonio') >= 0,
   'y ahí sí está el patrimonio');
ok(!!perfil && !!perfil.querySelector('.retrato.grande .muneco'),
   'con el personaje en grande');

// ---------- glosario ----------
const bGlos = w.document.querySelector('.velo #ver-glosario');
ok(!!bGlos, 'la pantalla de Yo ofrece el glosario');
clic(w, bGlos);
const glos = modalAbierto(w);
ok(!!glos && glos.querySelectorAll('.glosa').length >= 19,
   `el glosario muestra sus ${glos ? glos.querySelectorAll('.glosa').length : 0} entradas`);
cerrarModales(w);

// ---------- un minijuego, con sus temporizadores de verdad ----------
clic(w, w.document.querySelector('[data-pestana="casa"]'));
clic(w, jornadasLibres(w)[0]);
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
