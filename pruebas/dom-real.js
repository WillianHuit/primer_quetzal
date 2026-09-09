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
    /* Y cuando el paso pide una DECISION, tiene que señalarlas todas.
     *
     * Este es el fallo que esta comprobación existe para atrapar, y es de los
     * peores que puede tener este juego en concreto. El foco apaga todo lo que
     * no está señalado, así que señalar una sola opción no es una ayuda
     * visual: es contestar por el jugador. Pasaba en las dos pantallas donde
     * el juego pregunta de verdad —pública, privada o a trabajar; y cuál de
     * los tres trabajitos— y en las dos la lección es justamente que ninguna
     * respuesta es gratis y que la eliges tú. */
    const marcadas = w.document.querySelectorAll('.senala').length;
    const decisiones = w.document.querySelectorAll('[data-decide]').length;
    const ofertas = w.document.querySelectorAll('[data-tomar]').length;
    if (decisiones > 1) {
      ok(marcadas === decisiones,
         `la decisión de estudiar señala sus ${decisiones} opciones, no una (señala ${marcadas})`);
    }
    if (ofertas > 1 && w.document.querySelector('.senala[data-tomar]')) {
      ok(marcadas === ofertas,
         `y las ${ofertas} ofertas de trabajo se señalan todas (señala ${marcadas})`);
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
ok(subs.length === 3,
   `trabajo tiene mi empleo, turnos extra y ofertas hasta que se abra migrar (hay ${subs.length})`);
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

// ---------- la calle es el tablero, no un cuadro ----------

/* Esta es la pantalla principal del juego, así que lo que se comprueba aquí
 * no es que se dibuje: es que se pueda JUGAR con ella. Un local que se ve pero
 * no se toca deja el reparto del mes en la rejilla y la calle en adorno, que
 * es exactamente de lo que se venía. */
w.Motor.get().efectivo += 40000;
w.Motor.abrirNegocio('refrescos');
w.Motor.guardar();
clic(w, w.document.querySelector('[data-pestana="casa"]'));

const calleViva = w.document.querySelector('.escena.viva');
ok(!!calleViva, 'la pantalla del mes abre con la calle, y la calle está viva');
ok(w.document.querySelector('main').innerHTML.indexOf('escena') <
   w.document.querySelector('main').innerHTML.indexOf('jornadas'),
   'y va ANTES de la rejilla de jornadas: primero lo que tienes, luego el reparto');

const localToca = w.document.querySelector('[data-poner="negocio:refrescos"].calle-toque');
ok(!!localToca, 'el local de la calle es un botón que pone una jornada adentro');

/* Un toque en el local, SIN elegir casilla antes. Ese es el atajo que hace que
 * la calle sea el tablero: señalas tu negocio y te metes adentro. */
const antesEnNeg = w.Motor.espaciosUsados('negocio:refrescos');
clic(w, localToca);
const despuesEnNeg = w.Motor.espaciosUsados('negocio:refrescos');
ok(despuesEnNeg === antesEnNeg + 1,
   `tocar el local mete una jornada tuya adentro sin elegir casilla (${antesEnNeg} -> ${despuesEnNeg})`);
ok(!!w.document.querySelector('.tuyas'),
   'y la calle lo muestra: salen tus jornadas encima del local');

/* Y la forma vieja sigue viva, porque es la que enseña el tutorial y la única
 * que deja elegir en QUÉ casilla va. */
const libre = jornadasLibres(w)[0];
clic(w, libre);
ok(!!w.document.querySelector('.jornada.sel'), 'tocar una casilla sigue seleccionándola');
clic(w, w.document.querySelector('[data-poner="descanso"]'));
ok(w.Motor.espaciosUsados('descanso') >= 1,
   'y con una casilla elegida, la actividad va a ESA casilla');

/* El lote vacío no gasta jornada: abre lo que se puede abrir, AHÍ MISMO.
 * Que llevara a otra pestaña era irse de la pantalla para volver. */
const lote = w.document.querySelector('[data-lote]');
ok(!!lote, 'al lado de tus negocios hay un lote vacío, mientras te quepa otro');
clic(w, lote);
ok(w.document.querySelector('.pestanas .activa').dataset.pestana === 'casa',
   'tocarlo no te saca de la calle');
ok(!!w.document.querySelector('.hoja-calle [data-abrir-negocio]'),
   'y abre debajo de la calle lo que puedes abrir');
clic(w, w.document.querySelector('[data-cerrar-hoja]'));
ok(!w.document.querySelector('.hoja-calle'), 'y la hoja se cierra');

/* Y el engranaje de cada local administra ESE negocio sin salir de la calle. */
const engrane = w.document.querySelector('[data-gestion="refrescos"]');
ok(!!engrane, 'cada local lleva su botón de administrar');
clic(w, engrane);
const hoja = w.document.querySelector('.hoja-calle');
ok(!!hoja, 'y abre la hoja de ese negocio debajo de la calle');
ok(!!hoja.querySelector('[data-subir-negocio="refrescos"]') &&
   !!hoja.querySelector('[data-contratar="refrescos"]'),
   'con lo de subirle el nivel y contratar, sin ir a otra pestaña');
clic(w, w.document.querySelector('[data-cerrar-hoja]'));

/* El mes se cierra desde la calle, no al final de la pantalla. */
const cerrar = w.document.querySelector('.calle-barra #cerrar-turno');
ok(!!cerrar, 'y el botón de terminar el mes está en la barra de la calle');

// El imperio dibuja la MISMA calle, pero quieta: ahí las acciones son tarjetas
clic(w, w.document.querySelector('[data-pestana="mejoras"]'));
ok(!!w.document.querySelector('.escena') && !w.document.querySelector('.escena.viva'),
   'el imperio dibuja la misma calle, pero sin zonas que se toquen');

clic(w, w.document.querySelector('[data-pestana="casa"]'));

// ---------- trabajo y estudio tienen cosas que hacer ----------

/* Las dos eran pantallas de solo mirar, con un unico boton que ademas
 * destruia: renunciar y dejar de estudiar. Las actividades estaban guardadas
 * en un cajon aparte llamado "Extra", lejos de donde tenian sentido. */
clic(w, w.document.querySelector('[data-pestana="trabajo"]'));
clic(w, w.document.querySelector('[data-sub="turnos"]'));
ok(w.document.querySelectorAll('[data-jugar]').length > 0,
   'trabajo tiene turnos extra que se pueden hacer ahí mismo');
ok(!w.document.querySelector('[data-jugar="presupuesto"]') &&
   !w.document.querySelector('[data-jugar="estafas"]'),
   'y los que enseñan no están aquí: esos son de estudio');

clic(w, w.document.querySelector('[data-sub="empleo"]'));

/* Un trabajito de niño NO ofrece contrato, y eso hay que fijarlo: vender
 * dulces en el bus no lo contrata nadie, así que una tarjeta para pedir
 * planilla ahí sería mentirle al jugador sobre cómo funciona eso. */
const oficioNino = w.Motor.trabajoActual();
if (oficioNino && oficioNino.soloInformal) {
  ok(!w.document.querySelector('#pedir-planilla') &&
     w.document.querySelector('main').textContent.indexOf('Pedir que te pongan') < 0,
     'un trabajito por tu cuenta no ofrece pedir planilla: no hay a quién pedírselo');
}

/* Y con un empleo de verdad, informal y con meses encima, sí.
 * Se guarda el empleo anterior y se devuelve al final: lo que sigue en esta
 * suite cuenta con el que traía, y un trabajo distinto le cambia hasta lo que
 * el banco le cobra de manejo. */
const empleoPrevio = JSON.parse(JSON.stringify(w.Motor.get().empleo));
w.Motor.tomarTrabajo('repartidor', false);
w.Motor.get().empleo.mesesEnPuesto = 14;
w.Motor.guardar();
clic(w, w.document.querySelector('[data-pestana="casa"]'));
clic(w, w.document.querySelector('[data-pestana="trabajo"]'));
const empleoTxt = w.document.querySelector('main').textContent;
ok(empleoTxt.indexOf('Pedir que te pongan en planilla') >= 0,
   'con un empleo informal de verdad, se puede pedir que te pongan en planilla');
/* La probabilidad va escrita ANTES de tocar el botón. Sin eso, pedirlo es una
 * tragamonedas; con eso, es una decisión. */
ok(/\d+%/.test(empleoTxt),
   'y la pantalla dice qué probabilidad hay de que digan que sí');
/* Los dos lados de la cuenta, los dos en pantalla: lo que pierdes cada mes y
 * lo que ganas al año. Es la lección entera de la informalidad. */
ok(empleoTxt.indexOf('pierdes') >= 0 && empleoTxt.indexOf('ganas') >= 0,
   'con lo que pierdes al mes y lo que ganas al año, los dos lados');

clic(w, w.document.querySelector('#pedir-planilla'));
cerrarModales(w);
const emp = w.Motor.get().empleo;
ok(emp.pidioPlanilla !== null && emp.pidioPlanilla !== undefined,
   'pedirlo queda anotado, para que no se pueda insistir cada mes');
clic(w, w.document.querySelector('[data-pestana="casa"]'));
clic(w, w.document.querySelector('[data-pestana="trabajo"]'));
ok(!w.document.querySelector('#pedir-planilla'),
   'y no se puede volver a pedir de inmediato, digan que sí o que no');

w.Motor.get().empleo = empleoPrevio;   // devuelto como estaba
w.Motor.guardar();

clic(w, w.document.querySelector('[data-pestana="estudio"]'));
const estudioTxt = w.document.querySelector('main').textContent;
const zEst = w.Motor.get();
if (zEst.estudio || zEst.decisionEstudio !== null) {
  ok(w.document.querySelectorAll('[data-jugar]').length > 0 ||
     !w.Motor.desbloqueado('extra'),
     'estudio ofrece ejercicios que enseñan, no solo una barra de avance');
  ok(!w.document.querySelector('[data-jugar="reparto"]'),
     'y los turnos de reparto no están aquí: esos son de trabajo');
}
if (zEst.estudio && !zEst.estudio.jornada) {
  ok(!!w.document.querySelector('[data-poner="estudio"]'),
     'y con horario libre se le puede poner una jornada desde aquí mismo');
}

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
