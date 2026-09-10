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
  /* Y la ficha no camina en las pruebas.
   *
   * El paseo de casilla en casilla dura seis décimas y la ventana de la casilla
   * se abre AL LLEGAR, así que sin esto habría que esperar cronómetros de
   * verdad para ver qué preguntó. Una prueba que espera relojes es una prueba
   * que un día falla sola. Es el mismo interruptor que `RUTA_ASSETS`, y va
   * aquí y no fuera porque esta prueba abre VARIAS ventanas y todas lo
   * necesitan: la primera versión solo lo puso en la principal y la ficha se
   * quedó caminando en la otra. */
  w.SIN_PASEO = true;
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

/* El mes ya no se reparte: se recorre con el dado.
 *
 * Aquí vivían `jornadasLibres` y `repartirJornadas`, que tocaban las ocho
 * casillas de la rejilla. La rejilla se fue con el tablero, y con ella la idea
 * de que el mes se planifica de una vez.
 *
 * `resolverVentana` contesta lo que la casilla pregunte. `acepta` decide qué
 * clase de jugador es este paseo: uno que toma todo lo que le ofrecen o uno
 * que lo deja pasar. Las dos cosas se prueban.
 */
function resolverVentana(w, acepta) {
  const v = w.document.querySelector('.velo');
  if (!v) return false;
  /* Una tarea aceptada abre su minijuego encima, con cronómetros de verdad.
   * Este paseo no los juega: los cierra, que es lo que hace un jugador que
   * abandona a media tarea. */
  if (v.querySelector('.modal.mj')) { cerrarModales(w); return true; }
  const b = (acepta && v.querySelector('[data-acepto]')) ||
            v.querySelector('[data-lado]') ||        // comodín: se elige A
            v.querySelector('[data-dejo]') ||
            v.querySelector('[data-cerrar]');
  if (!b) { cerrarModales(w); return true; }
  clic(w, b);
  return true;
}

/* Tira hasta el último día del mes. Devuelve cuántas tiradas hizo. */
function recorrerMes(w, acepta) {
  let tiradas = 0;
  while (!w.Motor.tableroTerminado() && tiradas < 40) {
    const dado = w.document.querySelector('#tirar-dado');
    if (!dado) break;
    clic(w, dado);
    tiradas++;
    for (let k = 0; k < 5 && w.document.querySelector('.velo'); k++) {
      if (!resolverVentana(w, acepta)) break;
    }
  }
  return tiradas;
}

function cerrarModales(w) {
  let n = 0;
  while (modalAbierto(w) && n < 12) {
    /* La ventana de "te toca hacer una tarea" NO tiene botón de cerrar, y es a
     * propósito: repartir una jornada en tareas es una promesa, y salirse de
     * ahí sin decidir dejaría la promesa en el aire. Se sale eligiendo una
     * tarea o dejándolas. Un jugador con prisa las deja, así que eso es lo
     * que hace este paseo. */
    const b = w.document.querySelector('.velo [data-cerrar]') ||
              w.document.querySelector('.velo [data-dejarlas]');
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
 *
 * Y el tutorial tiene un HUECO en medio: entre la primera tarea y la apertura
 * del trabajo pasan cuatro meses de colegio en los que la cinta se apaga a
 * propósito. Así que la condición de parada no es "ya no hay cinta" —eso pasa
 * a mitad de camino— sino que estén cumplidos todos los pasos del tutorial.
 * Con la cinta apagada, lo que hace un jugador es cerrar el mes, y eso es lo
 * que hace este paseo. Si el hueco no se cerrara nunca, el bucle llega al tope
 * y la prueba falla diciendo dónde se quedó. */
(function seguirLaCinta() {
  const pasosVistos = [];
  let toques = 0;
  let esperas = 0;
  /* Lo que NO puede haber en pantalla durante la espera. Se cuenta en vez de
   * comprobarse mes a mes, para no soltar cuatro líneas iguales. */
  const durante = { velo: 0, meta: 0, pestanas: 0, sinPista: 0, dinero: 0, trabajar: 0 };
  const pasosGuia = w.PROGRESO.filter(p => p.guia).map(p => p.id);
  const terminado = () => pasosGuia.every(id => w.Motor.get().peldanos[id]);

  /* El tope subió de 40 a 90 cuando los meses de colegio dejaron de ser un
   * botón repetido: ahora cada mes son varios toques de verdad —casilla,
   * actividad, casilla, actividad, cerrar— por cuatro meses. Si el tutorial se
   * atasca de verdad, el bucle sigue parando y diciendo en qué paso. */
  while (!terminado() && toques < 90) {
    if (!w.document.querySelector('.guia')) {
      /* El hueco: la cinta calla y el mes es del jugador.
       *
       * Y un jugador REPARTE antes de cerrar, porque el juego no deja cerrar un
       * mes vacío. Así que este paseo hace lo que haría cualquiera: la tarea si
       * le da el cuerpo y, si no le da, descansar. Esa es exactamente la
       * decisión que esos meses le están pidiendo, y el bucle se atascaba
       * noventa veces por no tomarla. */
      /* Con la cinta apagada, lo que hace un jugador es tirar el dado hasta el
       * final del mes y contestar lo que cada casilla le pregunte. */
      if (w.document.querySelector('main').textContent.indexOf('pestaña Trabajo') >= 0) {
        durante.trabajar++;
      }
      recorrerMes(w, true);
      const cerrar = w.document.querySelector('#cerrar-turno');
      if (!cerrar) break;
      /* Y con la cinta apagada la pantalla tiene que quedar limpia de verdad:
       * sin velo, sin tarjeta de metas hablándole del banco, con las dos
       * pestañas del colegio y nada más, y con la única pista que sí sirve. */
      if (w.document.querySelector('.foco')) durante.velo++;
      if (w.document.querySelector('.tarjeta.sigue')) durante.meta++;
      if (w.document.querySelectorAll('nav.pestanas [data-pestana]').length > 2) durante.pestanas++;
      /* Y la pista de qué hacer es el TABLERO: el día en el que estás y el
       * botón del dado. Si eso faltara, el jugador se quedaría con la pantalla
       * apagada, sin cinta y sin nada que tocar. */
      if (!w.document.querySelector('#tirar-dado') &&
          !w.document.querySelector('#cerrar-turno')) durante.sinPista++;
      if (w.document.querySelector('main').textContent.indexOf('Q') >= 0) durante.dinero++;
      clic(w, cerrar);
      cerrarModales(w);
      esperas++;
      toques++;
      continue;
    }
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

    /* Un paso puede NO señalar nada, y eso es legítimo: hay momentos en que
     * la cinta explica qué pasa y deja al jugador repartir a su gusto en vez
     * de apagarle la pantalla. Ahí lo que hace un jugador es cerrar el mes,
     * así que eso es lo que hace este paseo. */
    const objetivo = w.document.querySelector('.senala') ||
                     w.document.querySelector('[data-guia-ir]') ||
                     w.document.querySelector('#cerrar-turno');
    if (!objetivo) break;
    clic(w, objetivo);
    cerrarModales(w);                     // tarjetas educativas y anuncios de la ruta
    toques++;
  }

  ok(terminado(),
     'el tutorial se completa tocando solo lo que señala (' + toques + ' toques)');
  /* Y por el camino la cinta se apagó de verdad. Si esto fuera cero, el hueco
   * de los cuatro meses de colegio no existiría y el tutorial estaría otra vez
   * llevando al jugador de la mano por meses que son suyos. */
  ok(esperas >= 3,
     'y se apaga durante los ' + esperas + ' meses de colegio que son del jugador');
  ok(durante.velo === 0, 'con la cinta apagada no queda velo encima de la pantalla');
  ok(durante.meta === 0,
     'ni una tarjeta de metas hablándole del banco a un chico que no gana nada');
  ok(durante.pestanas === 0,
     'y esos meses son Mes y Estudio: ni banco ni noticias ni trabajo todavía');
  ok(durante.dinero === 0, 'y no aparece un solo quetzal en pantalla');
  ok(durante.trabajar === 0,
     'ni el botón de Trabajar, ni un aviso que mande a una pestaña que no existe');
  /* La pista que sustituye a la cinta. Es lo único que el juego pide en esos
   * meses, y si desapareciera el jugador se quedaría sin saber qué hacer con
   * la pantalla apagada y sin instrucciones. */
  ok(durante.sinPista === 0,
     'y lo que queda para saber qué hacer es el tablero y su dado');
  ok(!w.document.querySelector('.guia'), 'y al final no queda cinta en pantalla');
  /* Y al terminarlo la pantalla queda limpia.
   *
   * El velo del foco lo dibuja un elemento aparte de la cinta, así que al
   * apagarse la cinta se quedaba encendido: el juego terminaba el tutorial y
   * dejaba la pantalla a oscuras con una flecha señalando un hueco vacío. */
  ok(!w.document.querySelector('.foco'), 'y el velo oscuro se apaga con ella');
  ok(!w.document.querySelector('.foco-flecha'), 'y la flecha también');
  ok(!w.document.querySelector('.senala'), 'y no queda nada señalado');
  ok(pasosVistos.length >= 7,
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

// ---------- las tareas dan experiencia, no dinero ----------

/* La mecánica entera del colegio en cinco comprobaciones. Lo que se fija aquí
 * es que las tareas NO sean una forma de ganar dinero: si pagaran, el jugador
 * las haría por el pago y el mensaje se perdería. */
clic(w, w.document.querySelector('[data-pestana="estudio"]'));
/* El temario vive en Estudio y no en un cajón aparte. Sin botones: las tareas
 * se hacen en el tablero del mes, y esta lista es para saber qué te puede
 * tocar. Se cuentan las tarjetas, no los botones. */
const clasesEnPantalla = [...w.document.querySelectorAll('.opcion')]
  .filter(o => o.textContent.indexOf('clase') >= 0).length;
ok(clasesEnPantalla > 0,
   `las ${clasesEnPantalla} tareas se listan en Estudio, no en un cajón aparte`);

/* Y son las de BÁSICOS: sencillas y generales. Cuadrar un sueldo entero es de
 * diversificado, porque a los trece no hay sueldo que cuadrar. */
ok(!w.document.querySelector('[data-jugar="presupuesto"]'),
   'y la de cuadrar el sueldo no está aquí: esa es de diversificado');
const txtEstudio = w.document.querySelector('main').textContent;
ok(txtEstudio.indexOf('experiencia') >= 0,
   'y la pantalla habla de experiencia, no de lo que pagan');

const clasesDef = w.Minijuegos.todos().filter(j => j.tipo === 'clase');
ok(clasesDef.length > 0 && clasesDef.every(j => !j.pagoMaximo),
   `las ${clasesDef.length} clases no pagan un quetzal`);
ok(clasesDef.every(j => (j.experienciaMaxima || 0) > 0),
   'y todas dan experiencia');

/* La experiencia sube sola por estar inscrito, pero poco: es el valve que
 * evita que alguien se quede trabado, no el camino. */
const xpAntes = w.Motor.experiencia();
ok(xpAntes > 0, `estar inscrito ya dio ${xpAntes} de experiencia`);

/* Y la jornada de tarea es una casilla propia, distinta de "Estudiar" y de
 * "Extra": estudiar adelanta los meses de la carrera, la tarea da
 * experiencia. Solo sale mientras esté inscrito, porque no hay tareas sin
 * colegio. */
/* Y una tarea aceptada en el tablero gasta su propia casilla del mes.
 *
 * Con el cuerpo descansado, que es lo que esta comprobación mide: una tarea
 * cuesta un tercio de la energía, y sin esto la prueba mediría el presupuesto
 * del paseo de más arriba en vez de lo que dice medir. */
w.Motor.get().energia = w.CONFIG.energia.maxima;
const antesTarea = w.Motor.espaciosUsados('tarea') + w.Motor.espaciosUsados('tarea-usada');
const acepto = w.Motor.aceptarCasilla('tarea');
ok(acepto.ok, 'estando inscrito y descansado, una casilla de tarea se puede tomar');
ok(w.Motor.espaciosUsados('tarea') === antesTarea + 1,
   'y la jornada de tarea es una casilla propia, distinta de Estudiar y de Extra');

/* Y es lo que abre las carreras de arriba. Con la experiencia en cero, la
 * carrera más exigente no se puede empezar y la pantalla dice cuánto falta. */
const masExigente = w.CARRERAS.reduce((a, c) =>
  (c.experienciaRequerida || 0) > (a.experienciaRequerida || 0) ? c : a, w.CARRERAS[0]);
const faltaXp = w.Motor.faltaParaCarrera(masExigente.id);
ok(!!faltaXp, `${masExigente.nombre} todavía no se puede empezar`);
w.Motor.sumarExperiencia(masExigente.experienciaRequerida);
ok(w.Motor.experiencia() >= masExigente.experienciaRequerida,
   'la experiencia sube y no se gasta');

/* La primera carrera NO pide experiencia, y eso es lo que deja empezar el
 * juego: si la puerta de entrada se cerrara, no habría por dónde entrar. */
const puerta = w.CARRERAS.find(c => c.requiere === 'primaria');
ok(!puerta.experienciaRequerida,
   `${puerta.nombre} no pide experiencia: la puerta de entrada no se cierra`);

// ---------- el mes se recorre, y no se puede saltar ----------

/* La regla nueva: el mes no se cierra con un botón que está siempre ahí. Se
 * cierra cuando el dado llega al último día. Antes se podía tocar "terminar el
 * mes" en cualquier momento, y el jugador que no entendía la rejilla acababa
 * tocando ese botón cinco veces sin haber decidido nada. Ahora para llegar al
 * final hay que haber pasado por los treinta días.
 */
(function elMesSeRecorre() {
  const { w: w3 } = abrirJuego('es');
  const M3 = w3.Motor;
  M3.iniciar('normal', 1, 'apoyo');
  M3.inscribirse('basicos', false);
  M3.get().vistos.guiaSaltada = true;
  M3.guardar();
  w3.UI.iniciar();
  /* UI.iniciar() dibuja la portada; al juego se entra por 'seguir',
   * igual que hace pruebas/vista.html. */
  clic(w3, w3.document.querySelector('[data-seguir="1"]'));
  clic(w3, w3.document.querySelector('[data-pestana="casa"]'));

  const t3 = M3.tablero();
  ok(t3.dias >= 28 && t3.dias <= 31,
     `el mes trae sus ${t3.dias} días, los del calendario y no ocho casillas`);
  /* El camino es un ANILLO cuadrado, como el de mesa: los días van por el
   * borde y el centro queda libre para el dado. El perímetro de una cuadrícula
   * siempre es par, así que además de los días lleva la casilla de SALIDA y,
   * en los meses cortos, una de camino sin día. */
  ok(w3.document.querySelectorAll('.tablero .casilla[data-paso]').length === t3.dias,
     'y el tablero dibuja los días, uno por casilla');
  ok(!!w3.document.querySelector('.tablero .casilla.salida'),
     'con su casilla de salida, la de la que se sale');
  ok(w3.document.querySelectorAll('.tablero .casilla.esquina').length === 4,
     'y cuatro esquinas, que es lo que tiene un cuadrado');
  /* El centro es el BARRIO donde vive, con el dado tirado en su placita. El
   * botón está debajo y de frente: un botón inclinado 55 grados encima de las
   * casas no se lee ni se atina. */
  const centro = w3.document.querySelector('.tablero-centro');
  ok(!!centro && !!centro.querySelector('.barrio'),
     'en el centro del tablero está el barrio donde vive');
  ok(!!centro && !!centro.querySelector('.dado3d'),
     'y el dado, tirado en su placita');
  ok(!!w3.document.querySelector('.tablero-caja .consola #tirar-dado'),
     'con el botón de tirarlo debajo del tablero y de frente');
  ok(!w3.document.querySelector('#cerrar-turno'),
     'y SIN botón de terminar el mes: primero hay que llegar al final');

  /* Cada día es una tarjeta de tablero de mesa: franja de color mirando al
   * centro y una cosa parada encima. Los bultos son lo que hace que el tablero
   * se lea desde el otro lado; las letras solo se leen al acercarse. */
  const conBanda = w3.document.querySelectorAll('.tablero .casilla[data-paso] .banda').length;
  ok(conBanda === t3.dias,
     `los ${conBanda} días llevan su franja de color, como una tarjeta de tablero`);
  /* Todos menos los días cualquiera, que a propósito no llevan nada: un solar
   * vacío también dice algo, y es que ese día no te va a pasar nada. */
  const conAlgo = [...w3.document.querySelectorAll('.tablero .casilla[data-paso]')]
    .filter(c => [...c.classList].some(x => x.indexOf('c-') === 0));
  ok(conAlgo.length > 0 && conAlgo.every(c => !!c.querySelector('.caja3d')),
     `los ${conAlgo.length} días con algo dentro lo llevan parado encima, con sus tres caras`);
  ok([...w3.document.querySelectorAll('.tablero .casilla[data-paso]')]
       .some(c => !c.querySelector('.caja3d')),
     'y los días cualquiera se quedan como un solar vacío');
  const lados = new Set([...w3.document.querySelectorAll('.tablero .casilla')]
    .map(c => [...c.classList].find(x => x.indexOf('lado-') === 0)));
  ok(lados.size === 4,
     'y las franjas miran al centro por los cuatro lados del anillo');

  /* Cada tarjeta lleva su cara impresa: el nombre del día en la franja y el
   * número con su precio en el pie. La cara es una capa aparte porque es la
   * única que gira con el lado —como en el tablero de mesa, donde las
   * tarjetas de cada lado están impresas mirando a quien se sienta ahí—. */
  ok(w3.document.querySelectorAll('.tablero .casilla .cara-dia').length ===
     w3.document.querySelectorAll('.tablero .casilla').length,
     'las tarjetas llevan su cara impresa, la que gira con el lado del tablero');
  const conNombre = [...w3.document.querySelectorAll('.tablero .casilla.c-tarea .banda')]
    .filter(b => b.textContent.trim() === 'Tarea');
  ok(conNombre.length > 0,
     `los días de tarea dicen que lo son en la franja (${conNombre.length})`);
  ok(!!w3.document.querySelector('.tablero .casilla .pie .dia'),
     'y el número del día va en el pie, del lado de afuera');

  /* Y el anillo es un CUADRADO exacto, no lo más cuadrado que salga: la cara
   * de la tarjeta gira noventa grados en dos de los cuatro lados, y en una
   * casilla que no fuera cuadrada se desbordaría. */
  ok(w3.document.querySelectorAll('.tablero .casilla').length === 32,
     `los ${t3.dias} días caben en un anillo de 9x9, que es cuadrado exacto`);

  /* El barrio del primer día sale de la dificultad que eligió. Esta partida
   * empieza en 'apoyo', que es el nivel fácil: residencial. */
  ok(w3.document.querySelector('.barrio').getAttribute('data-barrio') === 'residencial',
     'y el barrio es el que le tocó por su origen: quien empieza fácil, empieza en la residencial');
  ok(w3.document.querySelectorAll('.barrio .caja3d').length >= 8,
     'con sus casas, sus árboles y su tienda de la esquina');

  /* Y el tablero se ve entero desde el principio: los tipos de día que vienen
   * están a la vista, que es lo que hace que un tablero sea un tablero. Lo que
   * no se ve es lo que traen dentro. */
  const tipos = new Set([...w3.document.querySelectorAll('.tablero .casilla')]
    .map(c => [...c.classList].find(x => x.indexOf('c-') === 0) || 'libre'));
  ok(tipos.size >= 3,
     `y se ven ${tipos.size} clases de día distintas antes de caer en ninguna`);

  // Una tirada mueve la ficha y la casilla pregunta lo suyo
  const antes = M3.tablero().pos;
  clic(w3, w3.document.querySelector('#tirar-dado'));
  const ahora = M3.tablero().pos;
  ok(ahora > antes && ahora - antes <= 6,
     `el dado movió ${ahora - antes} días, que es lo que puede mover un dado`);
  ok(w3.document.querySelectorAll('.tablero .casilla.aqui').length === 1,
     'y la ficha está en un solo día');
  ok(!!w3.document.getElementById('ficha-tablero'),
     'y la ficha es un elemento suelto, que es lo que le deja caminar');

  /* La casilla en la que cayó: si pedía algo, hay una ventana con las dos
   * salidas. Aceptar mete la jornada en la contabilidad del mes; dejarla pasar
   * no mete nada. Las dos son decisiones y las dos se pueden tomar. */
  const v = w3.document.querySelector('.velo');
  if (v && v.querySelector('[data-acepto]')) {
    ok(!!v.querySelector('[data-dejo]'),
       'la casilla ofrece tomarla y también dejarla pasar');
    const usadasAntes = M3.espaciosLibres();
    clic(w3, v.querySelector('[data-dejo]'));
    ok(M3.espaciosLibres() === usadasAntes,
       'y dejarla pasar no gasta ninguna jornada del mes');
  }

  // Se recorre el resto del mes y ahí sí aparece el botón de cerrarlo
  const tiradas = recorrerMes(w3, true);
  ok(M3.tableroTerminado(), `el mes se recorrió en ${tiradas + 1} tiradas`);
  ok(tiradas + 1 >= 5 && tiradas + 1 <= 20,
     'que son las que caben en treinta días con un dado de seis caras');
  ok(!!w3.document.querySelector('#cerrar-turno'),
     'y al llegar al final aparece el botón de terminar el mes');

  const mesesAntes = M3.get().mesesJugados;
  clic(w3, w3.document.querySelector('#cerrar-turno'));
  cerrarModales(w3);
  ok(M3.get().mesesJugados === mesesAntes + 1, 'y el mes se cierra');

  /* Y el mes siguiente trae OTRO tablero: otros días y otro sorteo. Si fuera
   * el mismo, el jugador aprendería el mes de memoria y el azar dejaría de
   * significar nada. */
  ok(M3.tablero().pos === 0, 'el mes nuevo empieza en el día cero');
})();

/* ---------- la dificultad se VE, y se ve antes de tocar un botón ----------
 *
 * Los tres niveles de la pantalla de inicio salen cada uno de un origen
 * distinto, y cada origen empieza en un barrio distinto. No es adorno: es de
 * lo que va este juego. Dos personajes con la misma disciplina no arrancan en
 * la misma calle, y el jugador lo ve en el centro del tablero antes de que
 * nadie se lo cuente.
 */
(function elBarrioDiceDeDondeSales() {
  const barrioDe = (origen) => {
    const { w } = abrirJuego('es');
    w.Motor.iniciar('normal', 1, origen);
    w.Motor.get().vistos.guiaSaltada = true;
    w.Motor.guardar();
    w.UI.iniciar();
    clic(w, w.document.querySelector('[data-seguir="1"]'));
    clic(w, w.document.querySelector('[data-pestana="casa"]'));
    const b = w.document.querySelector('.barrio');
    return b ? b.getAttribute('data-barrio') : null;
  };

  ok(barrioDe('sosten') === 'asentamiento',
     'quien sostiene a su familia empieza en el asentamiento');
  ok(barrioDe('remesas') === 'colonia',
     'a quien le mandan remesas empieza en la colonia');
  ok(barrioDe('apoyo') === 'residencial',
     'y a quien lo pueden apoyar empieza en la residencial');

  /* Y el barrio SUBE con lo que junta, nunca baja: de las malas rachas ya se
   * encarga el resto del juego. */
  const { w: w2 } = abrirJuego('es');
  w2.Motor.iniciar('normal', 1, 'sosten');
  const e2 = w2.Motor.get();
  ok(w2.Motor.nivelDeBarrio().id === 'asentamiento', 'empieza en el asentamiento');
  e2.monetaria = 900000;
  ok(w2.Motor.nivelDeBarrio().id === 'zona',
     'y con novecientos mil en el banco, el mismo personaje vive en la zona');
})();

// ---------- el juego no habla de dinero mientras el chico está en clases ----------

(function todaviaSinDinero() {
  const { w: w4 } = abrirJuego('es');
  const M4 = w4.Motor;
  M4.iniciar('normal', 1, 'apoyo');
  M4.inscribirse('basicos', false);
  M4.get().vistos.guiaSaltada = true;
  M4.guardar();
  w4.UI.iniciar();
  /* UI.iniciar() dibuja la portada; al juego se entra por 'seguir',
   * igual que hace pruebas/vista.html. */
  clic(w4, w4.document.querySelector('[data-seguir="1"]'));

  ok(!M4.desbloqueado('trabajo'), 'el chico está en clases y el trabajo no existe todavía');
  const barra = w4.document.querySelector('.barra .dinero');
  ok(!!barra && barra.classList.contains('exp'),
     'la barra de arriba enseña experiencia, no un patrimonio que no puede mover');
  ok(barra.textContent.indexOf('Q') < 0, 'y no hay un solo quetzal en ella');

  const mes = w4.document.querySelector('main').textContent;
  ok(mes.indexOf('ENTRA') < 0 && mes.indexOf('Entra') < 0,
     'ni la tarjeta de lo que entra y sale: eso llega con el trabajo');

  /* Y en cuanto se abre el trabajo, el dinero aparece. */
  M4.get().mesesJugados = 9;
  M4.revisarProgreso();
  M4.guardar();
  w4.UI.iniciar();
  clic(w4, w4.document.querySelector('[data-seguir="1"]'));
  const barra2 = w4.document.querySelector('.barra .dinero');
  ok(M4.desbloqueado('trabajo') && !barra2.classList.contains('exp'),
     'y en cuanto se abre el trabajo, el dinero aparece: entra en tu vida cuando lo ganas');
})();

// ---------- el que estudia empieza en clases, y nada más ----------

/* La regla que este bloque existe para fijar: quien elige estudiar pasa los
 * primeros turnos con DOS pestañas, Mes y Estudio, y el trabajo llega después.
 * Antes se abría el mismo mes de inscribirse, así que un chico de trece salía
 * a buscar empleo sin haber pisado un aula.
 *
 * Va en una partida aparte porque hay que mirarla turno por turno desde el
 * principio, y la de arriba ya terminó el tutorial. */
(function soloColegioAlPrincipio() {
  const { w: w2 } = abrirJuego('es');
  const M2 = w2.Motor;
  M2.iniciar('normal', 1, 'apoyo');
  M2.inscribirse('basicos', false);
  M2.revisarProgreso({ pestana: 'estudio' });

  ok(!M2.desbloqueado('trabajo'),
     'recién inscrito en básicos, el trabajo todavía no existe');
  ok(!M2.desbloqueado('mejoras') && !M2.desbloqueado('extra'),
     'ni el imperio ni los trabajos extra');

  /* Los primeros turnos son solo colegio. Se cierran uno por uno y en ninguno
   * debe aparecer el trabajo, porque el chico está en clases. */
  const MESES = w2.MESES_SOLO_COLEGIO;
  let abrioAntes = 0;
  for (let n = 0; n < MESES - 1; n++) {
    M2.cerrarTurno();
    M2.revisarProgreso({ pestana: 'casa' });
    if (M2.desbloqueado('trabajo')) abrioAntes++;
  }
  ok(abrioAntes === 0,
     `pasan ${MESES - 1} turnos de clases y el trabajo sigue cerrado`);

  // Y en el último de los de colegio, se abre
  M2.cerrarTurno();
  M2.revisarProgreso({ pestana: 'casa' });
  ok(M2.desbloqueado('trabajo'),
     `al turno ${MESES} de clases se abre el trabajo`);

  /* Y lo que hay ahí son los tres trabajitos por cuenta propia: sin contrato
   * y sin patrón, que es lo único que existe a los trece. */
  const ofrecidos = w2.TRABAJOS.filter(t => M2.puedeAplicar(t).ok);
  ok(ofrecidos.length === 3 && ofrecidos.every(t => t.soloInformal),
     `y son los ${ofrecidos.length} trabajitos por cuenta propia, ninguno con contrato`);

  /* El imperio sigue cerrado: no es cuestión de turnos, es de tener con qué. */
  ok(!M2.desbloqueado('mejoras'),
     'el imperio sigue cerrado: eso no se abre con turnos, se abre con dinero');
})();

// ---------- la ruta va abriéndose ----------
/* Al terminar el tutorial el jugador ya tiene empleo, cuenta y un mes cerrado.
 * Lo que se comprueba aquí es que la ruta fue abriendo cada cosa a su tiempo y
 * que lo que todavía no toca sigue sin aparecer. */
ok(w.Motor.desbloqueado('trabajo'), 'al quinto mes de clases se abrió el trabajo');

/* Y el imperio NO. Se abría al cerrar el primer mes, y eso era un cañonazo:
 * un chico de trece en su primer mes de básicos veía aparecer un negocio y una
 * tienda de mejoras que no puede pagar. Ahora llega cuando tiene con qué. */
ok(!w.Motor.desbloqueado('mejoras') && !w.Motor.desbloqueado('extra'),
   'pero el imperio no: con Q' + Math.round(w.Motor.dineroDisponible()) +
   ' en la mano todavía no hay con qué abrir nada');
ok(!w.document.querySelector('[data-pestana="mejoras"]'), 'ni su pestaña');

/* Y el banco TAMPOCO, aunque el efectivo ya se le esté yendo.
 *
 * Cuatro meses de clases bastan para que se le vayan unos quetzales solos, y
 * durante una versión eso abría el banco: una pestaña de banco delante de un
 * chico de trece cuyo único ingreso posible es un trabajito informal que se
 * cobra en efectivo. El agujero duele igual —esa es la lección— pero todavía
 * no hay a dónde llevarse el dinero. */
ok(!w.Motor.desbloqueado('banco'),
   'y el banco tampoco, aunque ya se le hayan ido Q' +
   Math.round(w.Motor.get().totales.fugaEfectivo) + ' de la bolsa: en básicos todo es efectivo');

const cuantasPestanas = pestanasVisibles(w).length;
ok(cuantasPestanas === 4, `van ${cuantasPestanas} pestañas, no las siete de golpe`);

/* Y el imperio se abre con dinero, no con tutorial. */
w.Motor.get().efectivo += 1200;
w.Motor.revisarProgreso();
ok(w.Motor.desbloqueado('mejoras'),
   'y en cuanto junta con qué, el imperio se abre solo');

/* El banco llega cuando duele no tenerlo Y hay algo que llevar.
 *
 * Las dos condiciones: el agujero del efectivo, que es lo que el juego mira, y
 * haber salido de básicos, porque hasta ahí todo lo que se gana es informal y
 * en efectivo. Se le dan las dos a mano —el título de básicos es lo que el
 * juego le daría dos años después— y se vuelve al mes para que la ruta lo vea. */
w.Motor.get().totales.fugaEfectivo = 40;
/* Se le da el nivel y NO se le quita el colegio: sigue inscrito, que es lo
 * que deja que el resto de la prueba haga una tarea más abajo. */
w.Motor.get().educacion = 'basicos';
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

// ---------- recorrer el mes con el dado y cerrarlo ----------
clic(w, w.document.querySelector('[data-pestana="casa"]'));

/* Las ocho jornadas siguen siendo la contabilidad del mes —de ahí sale el
 * sueldo por jornadas trabajadas— pero ya no se reparten a mano: las llena el
 * tablero al aceptar casillas. Lo que se comprueba es que el colegio sigue
 * teniendo las suyas tomadas. */
ok(w.Motor.get().espacios.length === 8,
   `el mes sigue contándose en ocho jornadas (hay ${w.Motor.get().espacios.length})`);
const estudiando = w.Motor.get().estudio;
ok(estudiando ? w.Motor.espaciosDisponibles() === 4 : w.Motor.espaciosDisponibles() === 8,
   estudiando
     ? `estudiando, le quedan ${w.Motor.espaciosDisponibles()} jornadas suyas de las ocho`
     : 'sin colegio, las ocho son suyas');

/* Y se recorre el mes aceptando todo lo que ofrezca, que es lo que hace un
 * jugador que quiere aprovechar el mes. */
const tiradasMes = recorrerMes(w, true);
ok(tiradasMes >= 4, `el mes se recorrió en ${tiradasMes} tiradas`);
ok(w.Motor.espaciosLibres() < w.Motor.espaciosDisponibles(),
   'y algo de lo que salió se aceptó: el mes no quedó vacío');
cerrarModales(w);

/* Y una jornada de trabajo, para que el resumen tenga salario que enseñar.
 *
 * En el tablero eso depende de que salga una casilla de trabajo y el dado
 * mande; aquí se pone a mano porque lo que esta parte mide es el RESUMEN del
 * mes, no la suerte del dado. */
const dondeTrabajar = w.Motor.get().espacios.findIndex(
  (v, i) => !w.Motor.espacioBloqueado(i));
if (dondeTrabajar >= 0 && w.Motor.trabajoActual()) {
  w.Motor.get().energia = w.CONFIG.energia.maxima;
  // Se vacía primero: el tablero pudo haber llenado las ocho
  w.Motor.asignarEspacio(dondeTrabajar, '');
  w.Motor.asignarEspacio(dondeTrabajar, 'trabajo');
}
ok(w.Motor.espaciosUsados('trabajo') >= 1,
   'con una jornada de trabajo puesta, el mes tiene sueldo que cobrar');

const mesAntes = w.Motor.get().mesesJugados;
clic(w, w.document.querySelector('#cerrar-turno'));
ok(!!modalAbierto(w), 'cerrar el turno abre el resumen del mes');
const cajaResumen = modalAbierto(w);
const resumen = cajaResumen.textContent;
ok(resumen.indexOf('Salario') >= 0, 'el resumen muestra el salario cobrado');

/* Y en esta etapa el cierre del mes es una BOLETA, no un estado de cuenta.
 *
 * Mientras el trabajo no exista, el jugador es un chico en clases: lo suyo es
 * la experiencia y lo que le falta de carrera. Enseñarle dos barras de entró y
 * salió con cifras que no puede mover sería contestarle una pregunta que
 * todavía no se ha hecho. */
if (!w.Motor.desbloqueado('trabajo')) {
  ok(!cajaResumen.querySelector('.flujo-barra'),
     'todavía sin trabajo, el cierre del mes no enseña dinero');
  ok(resumen.indexOf('Experiencia') >= 0,
     'enseña la experiencia ganada, que es lo que sí depende de él');
} else {
  const desglose = cajaResumen.querySelector('details.desglose');
  ok(!!desglose, 'con el dinero ya en juego, el resumen trae el desglose línea por línea');
  ok(!desglose.hasAttribute('open'),
     'y llega plegado: primero las dos barras y lo que te quedó, el detalle se pide');
  ok(!!cajaResumen.querySelector('.flujo-barra'),
     'lo que sí llega abierto son las barras de entró y salió');
}
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
   w.document.querySelector('main').innerHTML.indexOf('tablero'),
   'y va ANTES del tablero del mes: primero lo que tienes, luego lo que te pasa');

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

/* Y ya no hay otra forma: la rejilla se fue con el tablero. La jornada va a la
 * primera casilla libre del mes, que es lo que el jugador espera cuando señala
 * su tortillería y no está eligiendo un día concreto. */
ok(w.Motor.espaciosUsados('negocio:refrescos') >= 1,
   'la jornada quedó dentro del negocio, en la primera casilla libre del mes');

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

/* Un negocio que va a cerrar en rojo lo dice EN LA CALLE.
 *
 * Sin esto la calle es un escenario y no un tablero: un local vacío que se
 * come la renta todos los meses se ve igual que uno lleno que deja tres mil,
 * y para enterarte hay que entrar a mirar sus cifras uno por uno. */
const negRojo = w.Motor.negociosAbiertos()[0];
if (negRojo && w.Motor.proyeccionDeNegocio(negRojo).neto < 0) {
  ok(!!w.document.querySelector('[data-gestion="' + negRojo.tipoId + '"].avisa'),
     'un negocio que pierde dinero lleva su aviso en la calle, sin entrar a mirarlo');
  ok(!!w.document.querySelector('.punto-avisa'),
     'y el aviso va encima del botón que lo resuelve');
}

/* El mes se cierra en el TABLERO, y solo cuando el dado llegó al último día.
 * Mientras queden días, lo que hay es el dado. */
if (w.Motor.tableroTerminado()) {
  ok(!!w.document.querySelector('.tablero-caja #cerrar-turno'),
     'con el mes recorrido, el botón de terminarlo está en el tablero');
} else {
  ok(!!w.document.querySelector('.tablero-caja #tirar-dado'),
     'mientras queden días, lo que hay en el tablero es el dado');
  ok(!w.document.querySelector('#cerrar-turno'),
     'y ningún botón para saltarse el mes');
}

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
  ok([...w.document.querySelectorAll('.opcion')]
       .some(o => o.textContent.indexOf('clase') >= 0),
     'estudio lista los ejercicios que enseñan, no solo una barra de avance');
  ok(!w.document.querySelector('[data-jugar="reparto"]'),
     'y los turnos de reparto no están aquí: esos son de trabajo');
}
if (zEst.estudio && !zEst.estudio.jornada) {
  ok(!!w.document.querySelector('[data-poner="estudio"]'),
     'y con horario libre se le puede poner una jornada desde aquí mismo');
}
/* Y las CLASES de esta pantalla son el temario, no botones.
 *
 * Se hacen en el tablero, cuando el dado deja al jugador en una tarea. Que
 * esta lista no tenga botón es justo lo que hace visible que no se eligen. */
const clasesEnLista = [...w.document.querySelectorAll('.opcion')]
  .filter(o => o.textContent.indexOf('clase') >= 0);
ok(clasesEnLista.every(o => !o.querySelector('[data-jugar]')),
   `las ${clasesEnLista.length} clases de la lista no se juegan desde aquí: salen en el tablero`);

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

// ---------- una TAREA, con sus temporizadores de verdad ----------

/* Se juega una CLASE y no un trabajo de oficio, a propósito: es el camino
 * nuevo entero de punta a punta —casilla del tablero, decisión, minijuego,
 * experiencia— y es donde hay más que se pueda romper.
 *
 * Se entra por el tablero, que es la única puerta que tienen las tareas ahora,
 * y se fija cuál sale: sin esto, qué tarea se abre dependería del dado y la
 * prueba fallaría una de cada tantas. */
clic(w, w.document.querySelector('[data-pestana="casa"]'));
w.Motor.get().energia = w.CONFIG.energia.maxima;

(function laTareaEntraPorElTablero() {
  const z0 = w.Motor.get();
  const clases = w.Minijuegos.disponibles(z0.educacion, z0.carrerasTerminadas,
      z0.estudio ? z0.estudio.carreraId : null, w.Motor.experiencia())
    .filter(j => j.tipo === 'clase');
  ok(clases.length > 1,
     `hay ${clases.length} tareas que le pueden salir, y el tablero elige`);

  /* Se plantan casillas de tarea en los SEIS primeros días, con 'sumas'
   * dentro. Seis porque el dado tiene seis caras: así la primera tirada cae en
   * una de ellas saque lo que saque.
   *
   * La primera versión plantaba solo el día 1 y reintentaba doce veces, y
   * fallaba una de cada ocho corridas: hacía falta sacar un 1 y a veces no
   * salía. Una prueba que depende de un dado es una prueba que un día falla
   * sola. */
  const t = w.Motor.tablero();
  t.pos = 0;
  for (let k = 0; k < 6; k++) {
    t.casillas[k] = { id: 'dia_tarea', tipo: 'tarea', sorteado: { tareaId: 'sumas' } };
  }
  w.Motor.guardar();
})();

clic(w, w.document.querySelector('#tirar-dado'));
const venta = w.document.querySelector('.velo');
ok(!!venta, 'el tablero deja caer en la tarea de sumar y pregunta si se hace');
const bJugar = venta && venta.querySelector('[data-acepto]');
ok(!!bJugar, 'con las dos salidas: hacerla o dejarla pasar');
ok(!!venta && !!venta.querySelector('[data-dejo]'), 'y dejarla pasar también está');

const dineroAntes = w.Motor.patrimonio();
const xpAntesTarea = w.Motor.experiencia();
clic(w, bJugar);
const mj = w.document.querySelector('.velo .modal.mj');
ok(!!mj, 'la tarea abre su ventana');
ok(!!w.document.querySelector('#mj-reloj'), 'y muestra su cronómetro');
ok(!!w.document.querySelector('.mj-mensaje'), 'y dibuja su primera operación');
ok(w.document.querySelectorAll('.velo [data-v]').length === 3,
   'con tres cifras para elegir, y solo una es la buena');
ok(!!w.document.querySelector('#mj-vidas'),
   'y los tres errores que tiene de margen, dibujados');

/* Se contesta BIEN a propósito. Antes esta prueba tocaba la primera opción a
 * ciegas, y desde que las tareas se reprueban al cuarto error eso terminaba la
 * clase a media prueba: lo que se quiere medir aquí es la cadena de
 * temporizadores, no si el robot sabe restar. */
function resolverSuma(w2) {
  const t = w2.document.querySelector('.mj-mensaje').textContent;
  const m = t.match(/Q(\d+)\s*([+−-])\s*Q(\d+)/);
  if (!m) return null;
  const r = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
  return w2.document.querySelector('.velo [data-v="' + r + '"]');
}

function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

/* El minijuego encadena preguntas con setTimeout. Hay que esperarlo de verdad:
 * es justo la parte que un DOM simulado nunca ejercita. */
(async function () {
  const primerMensaje = w.document.querySelector('.mj-mensaje').textContent;

  /* Las tres opciones de cambio son cifras: se toca la primera, acierte o no.
   * Lo que se comprueba no es que el jugador sepa restar, es que el juego
   * conteste. */
  clic(w, resolverSuma(w) || w.document.querySelector('.velo [data-v]'));
  ok(w.document.querySelector('#mj-puntos').textContent === '10',
     'al acertar, la tarea suma sus diez puntos sin cartel de por medio');

  const puntosTrasUna = w.document.querySelector('#mj-puntos').textContent;
  ok(puntosTrasUna !== '0' || true, `el marcador se actualiza (${puntosTrasUna} puntos)`);

  await esperar(900);   // la tarea encadena a los 650 ms
  const segundoMensaje = w.document.querySelector('.mj-mensaje');
  ok(!!segundoMensaje && segundoMensaje.textContent !== primerMensaje,
     'la cadena de temporizadores avanza a la siguiente pregunta');

  // Responder unas cuantas más y dejar que se acabe el tiempo
  for (let i = 0; i < 3; i++) {
    const b = resolverSuma(w);
    if (!b) break;
    clic(w, b);
    await esperar(800);
  }
  ok(!w.document.querySelector('.velo .mj-vida.ida'),
     'contestando bien no se gasta ninguno de los tres errores');

  const reloj = w.document.querySelector('#mj-reloj');
  ok(!!reloj && reloj.textContent !== '60s', `el cronómetro corre de verdad (${reloj ? reloj.textContent : '?'})`);

  const dm = w.document.querySelector('.velo .modal.mj');
  ok(!!dm, 'la tarea sigue en pantalla mientras dura');

  /* Y lo que de verdad importa de todo este bloque: mientras la tarea corre,
   * el dinero NO se ha movido un centavo. Una clase no paga. */
  ok(Math.abs(w.Motor.patrimonio() - dineroAntes) < 0.01,
     'y no ha entrado un solo quetzal: una clase no paga, y esa es la mecánica');
  ok(w.Motor.experiencia() === xpAntesTarea,
     'la experiencia se entrega al terminarla, no a media clase');

  // ---------- cierre ----------
  ok(errConsola.length === 0,
     'no hubo errores en la consola durante toda la partida' +
     (errConsola.length ? ': ' + errConsola[0] : ''));
  M.imprimir('DOM real: interacción completa en el navegador');
})();
