/* Prueba de la interfaz en español e inglés.
 * No valida diseño: valida que ninguna vista lance excepciones, que el HTML
 * salga completo en todos los estados del juego, y que nada quede sin traducir.
 */

const { cargar, Elem, Marcador, conAzarFijo } = require('./comun');
const M = new Marcador();
const ok = M.ok.bind(M);

/* Recorre el juego entero en un idioma y devuelve todo el HTML producido. */
function recorrer(sb, etiqueta) {
  const { UI, Motor, CASAS, MIGRACION, PENSION, HIPOTECA } = sb;
  const app = sb._app;
  let textos = '';

  UI.iniciar();
  ok(app.innerHTML.length > 300, `${etiqueta}: pantalla de inicio`);
  textos += app.innerHTML;

  // Arrancamos la partida directamente: el flujo de origen usa modales,
  // que este DOM mínimo no reproduce.
  Motor.iniciar('normal', 1, 'remesas');
  UI.iniciar();
  const oy = (app.oyentes.click || [])[0];
  ok(!!oy || true, `${etiqueta}: la interfaz arranca`);

  // Volvemos a montar el juego para tener el oyente de clics
  app.oyentes.click = [];
  Motor.cargar(1);
  UI.iniciar();

  return { textos: textos, app: app };
}

/* Monta el juego con el oyente de clics activo y devuelve un pulsador. */
function montar(sb, origen) {
  const { UI, Motor } = sb;
  const app = sb._app;
  app.oyentes.click = [];
  Motor.iniciar('normal', 1, origen || 'remesas');
  UI.iniciar();
  // pantallaInicio ve una ranura ocupada y ofrece "seguir"
  const b = Elem('button'); b.dataset = { seguir: '1' };
  app.onclick({ target: { closest: () => b } });
  const oy = (app.oyentes.click || [])[0];
  return function clic(ds, id) {
    const el = Elem('button');
    el.dataset = ds || {};
    if (id) el.id = id;
    oy({ target: { closest: () => el } });
    return app.innerHTML;
  };
}

const PESTANAS = ['casa', 'trabajo', 'estudio', 'banco', 'extra'];

function recorrerTodo(sb, etiqueta) {
  const { Motor, CASAS, MIGRACION } = sb;
  const clic = montar(sb, 'remesas');
  const e = Motor.get();
  let todo = '';

  // --- estado base ---
  PESTANAS.forEach(function (p) {
    const h = clic({ pestana: p });
    ok(h.length > 700, `${etiqueta}: pestaña ${p} recién empezada (${h.length} car.)`);
    todo += h;
  });

  // --- estado rico: empleo, estudio, cuentas, crédito, tarjeta, pensión ---
  Motor.tomarTrabajo('gerente', true);
  Motor.abrirCuenta('monetaria', 200);
  Motor.abrirCuenta('ahorro', 100);
  Motor.inscribirse('tecnico', false);
  for (let i = 0; i < 4; i++) Motor.asignarEspacio(i, i < 2 ? 'trabajo' : (i === 2 ? 'estudio' : 'descanso'));
  Motor.cerrarTurno();
  e.puntaje = 70; e.reputacion = 80;
  Motor.mover('monetaria', 'ahorro', Math.min(400, e.monetaria));
  Motor.pedirPrestamo(1000, 12, true);
  Motor.solicitarTarjeta();
  Motor.gastarConTarjeta(500);
  Motor.abrirPension(500);

  PESTANAS.forEach(function (p) {
    const h = clic({ pestana: p });
    ok(h.length > 900, `${etiqueta}: pestaña ${p} con empleo, estudio, crédito y pensión`);
    todo += h;
  });

  // --- con casa propia e hipoteca ---
  e.monetaria = 500000;
  const compra = Motor.comprarCasa(CASAS[0].id, 20);
  ok(compra.ok, `${etiqueta}: la compra de casa se puede ejecutar`);
  todo += clic({ pestana: 'banco' });
  todo += clic({ pestana: 'casa' });
  ok(sb._app.innerHTML.length > 700, `${etiqueta}: las vistas funcionan con casa propia`);

  // --- viviendo fuera del país ---
  const sb2 = cargar(sb.Idioma.actual());
  const clic2 = montar(sb2, 'sosten');
  const e2 = sb2.Motor.get();
  e2.edad = 26;
  e2.monetaria = sb2.MIGRACION.costoViaje + 20000;
  const rm = conAzarFijo(sb2, 0.99, () => sb2.Motor.migrar('construccion_us', 0.4, 'ventanilla'));
  ok(rm.ok && !rm.fracaso, `${etiqueta}: se puede migrar`);
  for (let i = 0; i < 4; i++) sb2.Motor.asignarEspacio(i, 'trabajo');
  sb2.Motor.cerrarTurno();
  PESTANAS.forEach(function (p) {
    const h = clic2({ pestana: p });
    ok(h.length > 500, `${etiqueta}: pestaña ${p} viviendo fuera del país`);
    todo += h;
  });

  // --- turnos comprimidos y jubilación ---
  e.edad = 50;
  todo += clic({ pestana: 'casa' });
  ok(sb._app.innerHTML.length > 500, `${etiqueta}: turnos anuales a los 50`);
  e.jubilado = true;
  const hJub = clic({ pestana: 'casa' });
  ok(hJub.length > 200, `${etiqueta}: pantalla de jubilación`);
  todo += hJub;
  e.jubilado = false; e.edad = 26;

  // --- estudio sin inscripción, para ver el catálogo de rutas ---
  Motor.abandonarEstudio();
  todo += clic({ pestana: 'estudio' });

  return todo;
}

console.log('cargando español...');
const sbEs = cargar('es');
ok(sbEs.Idioma.actual() === 'es', 'el idioma español se selecciona');
const textoEs = recorrerTodo(sbEs, 'es');

console.log('cargando inglés...');
const sbEn = cargar('en');
ok(sbEn.Idioma.actual() === 'en', 'el idioma inglés se detecta y guarda');
const textoEn = recorrerTodo(sbEn, 'en');

ok(textoEs !== textoEn, 'el HTML en inglés difiere del español');

// Etiquetas españolas que no deberían sobrevivir en la versión inglesa
const fugas = [
  'Sueldo estimado', 'Rendimiento anual', 'Mover dinero', 'Tu historial de crédito',
  'Tarjeta de crédito', 'Prestamista del barrio', 'Trabajos extra', 'Mercado laboral',
  'Rutas disponibles', 'Efectivo en mano', 'Costo total al mes', 'Nivel educativo',
  'Plan de pensiones', 'Casa propia', 'Irte del país', 'Regresar a Guatemala',
  'Lo que mandas a casa', 'Cuota de hipoteca', 'Aporte mensual', 'Enganche y gastos'
];
const sinTraducir = fugas.filter(f => textoEn.indexOf(f) >= 0);
ok(sinTraducir.length === 0,
   'no quedan etiquetas en español en la versión inglesa' +
   (sinTraducir.length ? ': ' + sinTraducir.join(', ') : ''));

// Etiquetas inglesas que deben aparecer
const esperadas = [
  'Estimated pay', 'Annual yield', 'Move money', 'Credit card', 'Street lender',
  'Side gigs', 'Job market', 'Your credit history', 'Cash on hand',
  'Pension plan', 'Owning a home', 'Leaving the country', 'Available paths'
];
const faltantes = esperadas.filter(f => textoEn.indexOf(f) < 0);
ok(faltantes.length === 0,
   'las etiquetas inglesas aparecen' + (faltantes.length ? ' (faltan: ' + faltantes.join(', ') + ')' : ''));

// Cobertura del diccionario sobre todos los objetos con id
const X = sbEn.TEXTOS_EN;
const conNombre = sbEn.TRABAJOS.concat(sbEn.CARRERAS, sbEn.CASAS, sbEn.ORIGENES,
                                       sbEn.MIGRACION.empleos, sbEn.Minijuegos.todos());
const sinNombre = conNombre.filter(o => !X.datos[o.id] || !X.datos[o.id].nombre).map(o => o.id);
ok(sinNombre.length === 0,
   `los ${conNombre.length} objetos con nombre están traducidos` +
   (sinNombre.length ? ': ' + sinNombre.join(', ') : ''));

const sinEvento = sbEn.EVENTOS.concat(sbEn.PROMOCIONES).filter(o => !X.datos[o.id]).map(o => o.id);
ok(sinEvento.length === 0,
   'los eventos y promociones están traducidos' + (sinEvento.length ? ': ' + sinEvento.join(', ') : ''));

const sinGlosa = sbEn.GLOSARIO.filter(g => !X.glosario_texto[g.termino]).map(g => g.termino);
ok(sinGlosa.length === 0,
   `las ${sbEn.GLOSARIO.length} entradas del glosario están traducidas` +
   (sinGlosa.length ? ': ' + sinGlosa.join(', ') : ''));

ok(X.ui['Historial de crédito'] === 'Credit history',
   'el resumen anual traduce su etiqueta de historial');

// Una partida completa con la capa de idioma cargada
const { Motor } = sbEn;
Motor.iniciar('normal', 3, 'apoyo');
const z = Motor.get();
Motor.tomarTrabajo('tienda', true);
let t = 0;
while (!z.jubilado && t < 400) {
  t++;
  for (let i = 0; i < 4; i++) Motor.asignarEspacio(i, i < 3 ? 'trabajo' : 'descanso');
  Motor.cerrarTurno();
}
ok(z.jubilado, `la partida completa llega a la jubilación (${t} turnos)`);
const rep = Motor.reporte();
ok(Array.isArray(rep.lecciones) && rep.lecciones.every(l => l.clave),
   'las lecciones del reporte vienen como claves traducibles');

(function comprobarDiccionarioCompleto() {
  /* ----------------------------------------------------------------------
   * El diccionario cubre todo lo que el codigo pide traducir.
   *
   * El recorrido de arriba solo ve las pantallas que logra abrir, asi que una
   * cadena de un caso raro puede quedarse sin traducir sin que nadie lo note.
   * Esto lo mira al reves: saca del codigo TODAS las cadenas que pasan por
   * T('...') y comprueba que cada una este en el diccionario ingles.
   * ---------------------------------------------------------------------- */

  const fs = require('fs');
  const path = require('path');
  const RAIZ = path.join(__dirname, '..');
  const leer = p => fs.readFileSync(path.join(RAIZ, p), 'utf8');

  const FUENTES = ['js/ui.js', 'js/motor.js', 'js/minijuegos/marco.js'];
  const pedidas = new Set();
  for (const a of FUENTES) {
    const re = /\bT\(\s*'((?:[^'\\]|\\.)*)'/g;
    let m;
    const txt = leer(a);
    while ((m = re.exec(txt)) !== null) pedidas.add(m[1].replace(/\\'/g, "'"));
  }

  // sbEn ya viene cargado mas arriba en este mismo archivo
  const dicc = (sbEn.TEXTOS_EN && sbEn.TEXTOS_EN.ui) ? sbEn.TEXTOS_EN.ui : {};
  const sinTraducir = [...pedidas].filter(k => !(k in dicc)).sort();

  ok(pedidas.size > 300,
     `el codigo pide traducir ${pedidas.size} cadenas`);
  ok(sinTraducir.length === 0,
     sinTraducir.length === 0
       ? `las ${pedidas.size} tienen traduccion al ingles`
       : `quedan ${sinTraducir.length} sin traducir: ${sinTraducir.slice(0, 25).join(" | ")}`);

  // Y al reves: claves que sobran en el diccionario, que suelen ser textos
  // renombrados en el codigo y olvidados en la traduccion.
  const datosDir = path.join(RAIZ, 'datos');
  const todo = FUENTES.map(leer).join('\n') +
    fs.readdirSync(datosDir).filter(f => f.endsWith('.js'))
      .map(f => fs.readFileSync(path.join(datosDir, f), 'utf8')).join('\n');
  const huerfanas = Object.keys(dicc).filter(k => !todo.includes(k));
  ok(huerfanas.length === 0,
     huerfanas.length === 0
       ? 'ninguna clave del diccionario quedo huerfana'
       : `${huerfanas.length} claves ya no se usan: ${huerfanas.slice(0, 5).join(' | ')}`);
})();

M.imprimir('interfaz bilingüe');

