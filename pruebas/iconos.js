/* Prueba del juego de iconos.
 *
 * Los iconos son dibujos propios que se piden por nombre: Ico('banco') o el
 * campo `icono` de un dato. Eso tiene una trampa: un nombre mal escrito no
 * lanza ningún error, simplemente no dibuja nada y queda un hueco. Nadie se
 * da cuenta hasta que alguien abre esa pantalla.
 *
 * Esto lo vigila por los dos lados: que todo nombre pedido exista, y que todo
 * icono definido se use. Y comprueba que no volvió a entrar un emoji, que era
 * lo que había antes y se veía distinto en cada teléfono.
 */

const fs = require('fs');
const path = require('path');
const { cargar, Elem, Marcador, abrirRuta } = require('./comun');

const RAIZ = path.resolve(__dirname, '..');
const M = new Marcador();
const ok = M.ok.bind(M);

const sb = cargar('es');
const { Iconos } = sb;
const definidos = new Set(Iconos.nombres());

const leer = (p) => fs.readFileSync(path.join(RAIZ, p), 'utf8');
const jsDe = (dir) => fs.readdirSync(path.join(RAIZ, dir))
  .filter(f => f.endsWith('.js')).map(f => dir + '/' + f);

const FUENTES = ['js/ui.js', 'js/iconos.js', 'js/motor.js']
  .concat(jsDe('js/minijuegos'), jsDe('datos'));

ok(definidos.size > 50, `hay ${definidos.size} iconos dibujados`);

// ---------- 1. todo nombre pedido existe ----------

/* Los nombres llegan por dos caminos: Ico('x') en el código, y el campo
 * `icono` de los datos (trabajos, eventos, carreras, minijuegos...). */
const pedidos = new Map();   // nombre -> de dónde salió

function pedir(nombre, donde) {
  if (!pedidos.has(nombre)) pedidos.set(nombre, donde);
}

/* js/iconos.js queda fuera de este barrido: su comentario de cabecera trae un
 * Ico('nombre') de ejemplo que no es una llamada de verdad. */
for (const a of FUENTES.filter(f => f !== 'js/iconos.js')) {
  const txt = leer(a);
  // El argumento puede ser un literal o un ternario: Ico(libre ? 'a' : 'b')
  for (const m of txt.matchAll(/\bIco\(([^)]*)\)/g)) {
    for (const n of m[1].matchAll(/'([a-z-]+)'/g)) pedir(n[1], a);
  }
}
// Los mapas internos de ui.js: iconos: { trabajo: 'maletin', ... } y las pestañas
for (const m of leer('js/ui.js').matchAll(/\bic:\s*'([a-z-]+)'/g)) pedir(m[1], 'js/ui.js (pestañas)');
for (const m of leer('js/ui.js').matchAll(/var iconos = \{([\s\S]*?)\};/g)) {
  // Solo los valores: las claves ('minijuego-usado') son estados, no iconos
  for (const n of m[1].matchAll(/:\s*'([a-z-]+)'/g)) pedir(n[1], 'js/ui.js (semanas)');
}
// pastilla('icono', 'dato') es la otra forma de pedir un icono en la interfaz
for (const m of leer('js/ui.js').matchAll(/\bpastilla\('([a-z-]+)'/g)) {
  pedir(m[1], 'js/ui.js (pastillas)');
}
// Y el segundo argumento de tarjetaEducativa, que también es un nombre de icono
for (const m of leer('js/ui.js').matchAll(/tarjetaEducativa\('[a-z]+',\s*'([a-z-]+)'/g)) {
  pedir(m[1], 'js/ui.js (tarjetas educativas)');
}

const datos = []
  .concat(sb.TRABAJOS, sb.CARRERAS, sb.CASAS, sb.ORIGENES, sb.EVENTOS,
          sb.PROMOCIONES, sb.CREDITOS, sb.MIGRACION.empleos,
          sb.Minijuegos.todos(), [sb.PENSION])
  .filter(Boolean);
datos.forEach(o => { if (o.icono) pedir(o.icono, 'datos (' + o.id + ')'); });
// Las categorías del minijuego de presupuesto viven dentro de su propio archivo
for (const m of leer('js/minijuegos/presupuesto.js').matchAll(/icono:\s*'([a-z-]+)'/g)) {
  pedir(m[1], 'js/minijuegos/presupuesto.js');
}

ok(pedidos.size > 55, `la interfaz y los datos piden ${pedidos.size} iconos distintos`);

/* Un nombre pedido tiene que existir en alguno de los dos juegos: los dibujos
 * propios de js/iconos.js o el respaldo de Lucide de vendor/lucide.js. */
const sinDibujo = [...pedidos].filter(([n]) => !Iconos.tiene(n));
ok(sinDibujo.length === 0,
   sinDibujo.length === 0
     ? 'todos los nombres pedidos tienen dibujo, propio o de respaldo'
     : `${sinDibujo.length} nombres no existen: ` +
       sinDibujo.map(([n, d]) => `${n} (${d})`).join(', '));

// ---------- 2. y todo icono dibujado se usa ----------

/* Y al reves, solo con los PROPIOS: un dibujo hecho a mano que nadie usa es
 * trabajo tirado. Los de Lucide no cuentan aqui, porque el respaldo esta justo
 * para tener a mano nombres que todavia no se usan. */
const huerfanos = [...definidos].filter(n => !pedidos.has(n));
ok(huerfanos.length === 0,
   huerfanos.length === 0
     ? 'ningún icono quedó dibujado sin usarse'
     : `${huerfanos.length} iconos ya no se usan: ${huerfanos.join(', ')}`);

// ---------- 3. no volvió a entrar un emoji ----------

/* Solo pictogramas. Los signos tipográficos (el ▸ de "Efectivo ▸ Ahorro", el
 * − de los botones, el ⋯) no son emoji: se dibujan con la tipografía del
 * sistema, toman el color del texto y se ven igual en todas partes. */
const EMOJI = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[☀-➿⬀-⯿️]|[⏩-⏺]/;

const conEmoji = FUENTES.concat('index.html', 'css/estilo.css')
  .filter(a => EMOJI.test(leer(a)));
ok(conEmoji.length === 0,
   conEmoji.length === 0
     ? 'ningún archivo del juego trae emoji'
     : `queda emoji en: ${conEmoji.join(', ')}`);

// ---------- 4. cada dibujo está bien formado ----------

const TAGS = /<(\/?)(path|circle|rect|ellipse|line|polyline|polygon|g)\b/g;
const malos = [];
for (const n of definidos) {
  const d = Iconos.TRAZOS[n];
  // Etiquetas permitidas y balanceadas: cada apertura cierra con /> o con </tag>
  const abiertas = (d.match(/<[a-z]/g) || []).length;
  const cerradas = (d.match(/\/>/g) || []).length + (d.match(/<\/[a-z]+>/g) || []).length;
  const desconocidas = d.replace(TAGS, '').match(/<\/?[a-z]+/g);
  if (abiertas === 0) malos.push(n + ': vacío');
  else if (abiertas !== cerradas) malos.push(n + ': etiquetas sin cerrar');
  else if (desconocidas) malos.push(n + ': etiqueta no permitida ' + desconocidas[0]);
  else if (/\sd="(?![Mm])/.test(d)) malos.push(n + ': un trazo no empieza en M');
  else if (/\s(fill|stroke)="(?!currentColor|none)/.test(d)) malos.push(n + ': color fijo');
}
ok(malos.length === 0,
   malos.length === 0
     ? `los ${definidos.size} dibujos están bien formados y sin colores fijos`
     : malos.slice(0, 6).join(' | '));

// El svg que sale envuelve el dibujo y no filtra nada raro
const uno = Iconos.svg('banco');
ok(uno.indexOf('<svg class="ic"') === 0 && uno.indexOf('viewBox="0 0 24 24"') > 0,
   'Ico() devuelve un svg de 24x24 con la clase que lo dimensiona');
ok(uno.indexOf('aria-hidden="true"') > 0,
   'los iconos quedan ocultos al lector de pantalla, porque el texto ya está al lado');
ok(Iconos.svg('esto-no-existe') === '',
   'un nombre inventado devuelve cadena vacía en vez de romper la vista');

// ---------- 5. la interfaz de verdad dibuja iconos y no emoji ----------

/* Monta el juego y devuelve un pulsador, igual que hace la prueba bilingüe. */
function montar(origen) {
  const app = sb._app;
  app.oyentes.click = [];
  sb.Motor.iniciar('normal', 1, origen || 'remesas');
  abrirRuta(sb);        // con la ruta cerrada solo habria dos pestañas
  sb.UI.iniciar();
  const b = Elem('button'); b.dataset = { seguir: '1' };
  app.onclick({ target: { closest: () => b } });
  const oy = (app.oyentes.click || [])[0];
  return function clic(ds) {
    const el = Elem('button');
    el.dataset = ds || {};
    oy({ target: { closest: () => el } });
    return app.innerHTML;
  };
}

const clic = montar('remesas');
const PESTANAS = ['casa', 'estudio', 'trabajo', 'mejoras', 'banco', 'extra', 'noticias'];
let htmlTodo = '';
let sinIconos = [];
PESTANAS.forEach(function (p) {
  const h = clic({ pestana: p });
  htmlTodo += h;
  if ((h.match(/<svg class="ic"/g) || []).length < 6) sinIconos.push(p);
});
ok(sinIconos.length === 0,
   sinIconos.length === 0
     ? `las ${PESTANAS.length} pestañas dibujan sus iconos`
     : `pestañas con muy pocos iconos: ${sinIconos.join(', ')}`);
ok(!EMOJI.test(htmlTodo), 'el HTML de todas las pestañas no trae emoji');

// ---------- 6. el cambio de pestaña se anima hacia el lado correcto ----------

const hDer = clic({ pestana: 'banco' });      // veníamos de noticias, la última
ok(hDer.indexOf('vista-entra') > 0, 'al cambiar de pestaña la vista entra animada');
ok(hDer.indexOf('desde-izq') > 0,
   'de extra a banco la vista entra por la izquierda');
const hIzq = clic({ pestana: 'extra' });
ok(hIzq.indexOf('desde-der') > 0,
   'de banco a extra la vista entra por la derecha');
const hMismo = clic({ pestana: 'extra' });
ok(hMismo.indexOf('vista-entra') < 0,
   'tocar la pestaña en la que ya estás no la vuelve a animar');

// La marca deslizante lleva de dónde viene y a dónde va
const marca = /--desde:(\d+);--hasta:(\d+)/.exec(clic({ pestana: 'casa' }));
ok(!!marca && marca[1] === '5' && marca[2] === '0',
   'la marca de la pestaña viaja de la posición anterior a la nueva' +
   (marca ? ` (${marca[1]} a ${marca[2]})` : ''));
ok(clic({ pestana: 'trabajo' }).indexOf('--pestanas:7') > 0,
   'la barra declara cuántas pestañas tiene, para que el CSS reparta el ancho');

// ---------- 7. el respaldo de Lucide ----------

/* Los dibujos propios son los que mandan, y detras hay un respaldo con los
 * iconos de Lucide que vendor/lucide.js trae recortados. Sirve para agregar
 * contenido nuevo sin dibujar cada icono a mano.
 *
 * Lo que se comprueba es que el respaldo este cableado y que NO tape a los
 * dibujos propios: si un nombre esta en los dos, tiene que ganar el propio. */
ok(typeof sb.LUCIDE_TRAZOS === 'object' && Object.keys(sb.LUCIDE_TRAZOS).length > 40,
   `el respaldo de Lucide trae ${Object.keys(sb.LUCIDE_TRAZOS || {}).length} iconos`);

const deRespaldo = Iconos.nombresDeRespaldo();
const pisados = deRespaldo.filter(n => Iconos.propio(n));
ok(pisados.length === 0,
   pisados.length === 0
     ? 'ningun nombre esta en los dos juegos a la vez'
     : `nombres repetidos entre propios y Lucide: ${pisados.join(', ')}`);

const unoDeLucide = deRespaldo[0];
ok(!Iconos.propio(unoDeLucide) && Iconos.tiene(unoDeLucide),
   `un nombre solo de Lucide ("${unoDeLucide}") se resuelve por el respaldo`);
ok(Iconos.svg(unoDeLucide).indexOf('<svg class="ic"') === 0,
   'y sale envuelto igual que los propios, con la misma clase');
ok(Iconos.svg('nombre-que-no-existe-en-ninguno') === '',
   'y un nombre que no esta en ninguno de los dos sigue devolviendo vacio');

/* Y los dibujos propios no cambiaron: es la razon de que Lucide entre como
 * respaldo y no como reemplazo. */
ok(Iconos.propio('moneda') && Iconos.svg('moneda').indexOf('circle') > 0,
   'los iconos dibujados a mano siguen siendo los que se usan');

// ---------- 8. el personaje se viste de lo que hace ----------

/* El muñeco de js/personaje.js se arma por piezas. Una entrada de ROPA que
 * pida una pieza que no existe no rompe nada: dibuja un muñeco sin gorra, y
 * nadie se entera de que el uniforme quedó incompleto. Esto lo mira. */
const P = sb.Personaje;
const PIEZAS_CABEZA = ['gorra', 'casco', 'cascomoto', 'audifonos', 'birrete',
                       'redecilla', 'mochila'];
const PIEZAS_ENCIMA = ['mandil', 'corbata', 'chaleco'];
const PIEZAS_MANO = ['jarra', 'periodico', 'canasta', 'ladrillo', 'caja',
                     'libro', 'llave', 'tableta'];

const ropaMala = [];
Object.keys(P.ROPA).forEach(function (id) {
  const r = P.ROPA[id];
  if (r.cabeza && PIEZAS_CABEZA.indexOf(r.cabeza) < 0) ropaMala.push(id + ': cabeza ' + r.cabeza);
  if (r.encima && PIEZAS_ENCIMA.indexOf(r.encima) < 0) ropaMala.push(id + ': encima ' + r.encima);
  if (r.sostiene && PIEZAS_MANO.indexOf(r.sostiene) < 0) ropaMala.push(id + ': sostiene ' + r.sostiene);
});
ok(ropaMala.length === 0,
   ropaMala.length === 0
     ? `los ${Object.keys(P.ROPA).length} uniformes usan piezas que existen`
     : ropaMala.join(' | '));

/* Y todo empleo del juego tiene con qué vestirse: sin entrada en ROPA el
 * personaje sale en ropa de calle, que está bien para un trabajito de la
 * calle pero no para un ingeniero. */
const sinRopa = sb.TRABAJOS.concat(sb.MIGRACION.empleos)
  .filter(t => !P.viste(t.id)).map(t => t.id);
ok(sinRopa.length === 0,
   sinRopa.length === 0
     ? `los ${sb.TRABAJOS.length + sb.MIGRACION.empleos.length} empleos tienen uniforme`
     : 'empleos sin uniforme: ' + sinRopa.join(', '));

const munecoDesnudo = P.dibujar({});
const munecoVestido = P.dibujar({ trabajo: 'construccion', estudia: true });
ok(munecoDesnudo.indexOf('<svg class="muneco"') === 0,
   'el personaje sale como un svg propio, sin trabajo y sin nada');
ok(munecoVestido.length > munecoDesnudo.length,
   'vestido de un oficio y con mochila trae más piezas que en ropa de calle');
ok(munecoVestido.indexOf('var(--ambar') > 0,
   'y sus colores salen de la paleta del juego, no de colores nuevos');
ok(!EMOJI.test(leer('js/personaje.js')), 'el personaje no trae emoji');

// ---------- 9. la calle crece con el imperio ----------

/* Las tres cadenas de mejoras dibujan un nivel distinto por cada escalon. Si
 * alguien agrega un cuarto escalon a una cadena de datos/mejoras.js y no
 * dibuja su pieza, la escena deja de crecer y nadie se entera: el jugador
 * compra el nivel, le suben los numeros y la pantalla se ve igual. */
const cortos = sb.CADENAS.filter(function (c) {
  const escalones = sb.MEJORAS.filter(m => m.cadena === c.id).length;
  return sb.Escena.niveles[c.id] < escalones;
}).map(c => c.id + ': ' + sb.MEJORAS.filter(m => m.cadena === c.id).length +
             ' escalones y ' + sb.Escena.niveles[c.id] + ' dibujos');
ok(cortos.length === 0,
   cortos.length === 0
     ? 'el escenario tiene un dibujo por cada escalon de cada cadena'
     : 'cadenas que crecen mas de lo que se dibuja: ' + cortos.join(' | '));

/* Y lo mismo con los niveles de un negocio: NIVELES_NEGOCIO y los altos de
 * escena.js tienen que medir igual. Si alguien agrega un quinto nivel sin
 * dibujarlo, el local se deja de ver mas grande al subirlo. */
ok(sb.Escena.niveles.negocio === sb.NIVELES_NEGOCIO.length,
   'la calle sabe dibujar los ' + sb.NIVELES_NEGOCIO.length +
   ' niveles que puede tener un negocio');

/* Un tipo de negocio sin icono dibujable saldria como un local sin emblema, o
 * sea indistinguible de los demas. */
const sinEmblema = sb.TIPOS_NEGOCIO.filter(t => !sb.Iconos.tiene(t.icono))
                                   .map(t => t.id + ' -> ' + t.icono);
ok(sinEmblema.length === 0,
   sinEmblema.length === 0
     ? 'cada tipo de negocio tiene un emblema que se puede dibujar'
     : 'negocios sin emblema: ' + sinEmblema.join(' | '));

const vacia = sb.Escena.dibujar({});
const llena = sb.Escena.dibujar({
  negocios: [{ icono: 'dulce', nivel: 4, empleados: 3, produce: true },
             { icono: 'sarten', nivel: 2, empleados: 1, produce: true }],
  oficio: 3, escuela: 3, casa: 2, trabajo: 'construccion', estudia: true
});
ok(vacia.indexOf('<svg class="escena"') === 0, 'la escena sale como un svg propio');
ok(llena.length > vacia.length * 1.6,
   'y con el imperio montado trae bastante mas que vacia');
ok(llena.indexOf('esc-moneda') > 0, 'con los negocios produciendo salen las monedas');
ok(vacia.indexOf('esc-moneda') < 0, 'y sin negocios no');

/* La calle se alarga con el numero de negocios, y eso es la mitad del premio:
 * el jugador nota que ya no le cabe lo que tiene. */
ok(sb.Escena.anchoDe(5) > sb.Escena.anchoDe(1),
   'la calle se alarga cuando hay mas negocios');

/* El emblema de la fachada sale de js/iconos.js, no de un dibujo aparte: es
 * lo que permite agregar un negocio nuevo sin dibujar nada. */
ok(llena.indexOf(sb.Iconos.trazo('sarten').slice(0, 40)) > 0,
   'el emblema del local es el icono del negocio, tomado de iconos.js');

ok(llena.indexOf('var(--verde') > 0 && !EMOJI.test(leer('js/escena.js')),
   'la escena usa la paleta y no trae emoji');

M.imprimir('juego de iconos y transiciones');
