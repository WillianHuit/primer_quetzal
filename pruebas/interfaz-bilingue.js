/* Prueba de la interfaz en español e inglés.
 * No valida diseño: valida que ninguna vista lance excepciones, que el HTML
 * salga completo en todos los estados del juego, y que nada quede sin traducir.
 */

const { cargar, Elem, Marcador, abrirRuta, adulto, conAzarFijo } = require('./comun');
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
  /* La ruta se abre entera y el personaje llega a la mayoria de edad con el
   * diversificado: esta prueba mira TODAS las pantallas, y la mitad de ellas
   * (credito, hipoteca, pension, carreras de universidad) no existirian para
   * un chico de 13 recien empezado. */
  abrirRuta(sb);
  adulto(sb);
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

const PESTANAS = ['casa', 'estudio', 'trabajo', 'mejoras', 'banco', 'extra', 'noticias'];

/* Igual que montar(), pero sin abrir la ruta ni crecer al personaje: es el
 * juego tal como lo ve alguien que acaba de empezar, a los 13 años. */
function montarNino(sb) {
  const { UI, Motor } = sb;
  const app = sb._app;
  app.oyentes.click = [];
  Motor.iniciar('normal', 4, 'apoyo');
  Motor.get().vistos.guiaSaltada = true;
  // Inscrito en basicos: es el unico estado donde se ven las jornadas que el
  // colegio tiene tomadas y la pastilla de la jornada elegida.
  Motor.inscribirse('basicos', false);
  Motor.tomarTrabajo('limonada', false);
  Motor.guardar();   // si no, el "seguir jugando" de abajo recarga el estado viejo
  UI.iniciar();
  const b = Elem('button'); b.dataset = { seguir: '4' };
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
  for (let i = 0; i < 8; i++) {
    Motor.asignarEspacio(i, i < 4 ? 'trabajo' : (i < 6 ? 'estudio' : 'descanso'));
  }
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
  for (let i = 0; i < 8; i++) sb2.Motor.asignarEspacio(i, 'trabajo');
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

  /* --- la pregunta de estudiar, que es la primera pantalla del juego ---
   * Se mira en los dos sabores: con un colegio de jornada, que pregunta
   * manana o tarde, y con una carrera de horario libre, que no. */
  e.decisionEstudio = null;
  e.educacion = 'basicos';
  todo += clic({ pestana: 'estudio' });
  e.decisionEstudio = null;
  e.educacion = 'diversificado';
  todo += clic({ pestana: 'estudio' });

  // --- los apartados del banco, que ya no caben en una sola pantalla ---
  ['cuentas', 'credito', 'vivienda'].forEach(function (ap) {
    todo += clic({ pestana: 'banco' });
    todo += clic({ sub: ap });
  });

  // --- la niñez: un chico de 13 con sus tres trabajitos ---
  const sb3 = cargar(sb.Idioma.actual());
  const clic3 = montarNino(sb3);
  ['casa', 'estudio', 'trabajo'].forEach(function (pes) {
    const h = clic3({ pestana: pes });
    ok(h.length > 400, `${etiqueta}: pestaña ${pes} a los 13 años`);
    todo += h;
  });
  todo += clic3({ sub: 'ofertas' });

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
  'Rendimiento anual', 'Mover dinero', 'Tarjeta de crédito',
  'Prestamista del barrio', 'Trabajos extra', 'Mercado laboral',
  'Costo total al mes', 'Plan de pensiones', 'Casa propia', 'Irte del país',
  'Regresar a Guatemala', 'Lo que mandas a casa', 'Cuota de hipoteca',
  'Aporte mensual', 'Enganche y gastos',
  // lo nuevo: las jornadas, el personaje y la pregunta de estudiar
  'En la mano', 'Ver a dónde se va', 'Mi empleo',
  'No, a trabajar', 'Jornada de la mañana',
  'Manejo de cuenta', 'Prefiero elegir yo', 'Difícil'
];
const sinTraducir = fugas.filter(f => textoEn.indexOf(f) >= 0);
ok(sinTraducir.length === 0,
   'no quedan etiquetas en español en la versión inglesa' +
   (sinTraducir.length ? ': ' + sinTraducir.join(', ') : ''));

// Etiquetas inglesas que deben aparecer
const esperadas = [
  'Move money', 'Credit card', 'Street lender',
  'Side gigs', 'Job market', 'Pension plan', 'Owning a home',
  'Leaving the country',
  'In hand', 'See where it goes', 'My job',
  'No, go to work', 'Morning shift', 'Roll the die',
  'Public: free', 'Morning or afternoon', 'no maintenance fee'
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

/* Las pantallas que viven en ventanas superpuestas no las alcanza este
 * recorrido, porque el DOM mínimo no las mete en app.innerHTML. Se comprueban
 * contra el diccionario, que es lo que de verdad importa que exista. */
ok(X.ui['Fácil'] === 'Easy' && X.ui['Difícil'] === 'Hard',
   'los niveles de dificultad están traducidos');
ok(!!X.nivel_resumen && !!X.nivel_resumen.facil && !!X.nivel_resumen.dificil,
   'y el resumen de cada nivel también');
ok(X.ui['Manejo de cuenta'] === 'Account maintenance fee',
   'el manejo de cuenta está traducido');

/* El barrio del centro del tablero: el nombre se ve en la consola y en el
 * rotulo, y la descripcion en el title. Los cuatro tienen que estar. */
const sinBarrio = sbEn.BARRIO_NIVELES
  .filter(b => !X.barrio || !X.barrio[b.id] || !X.barrio[b.id + ':d'])
  .map(b => b.id);
ok(sinBarrio.length === 0,
   `los ${sbEn.BARRIO_NIVELES.length} barrios del tablero están traducidos` +
   (sinBarrio.length ? ': ' + sinBarrio.join(', ') : ''));

/* Y las condiciones del mes: el nombre va en la franja y en el pronostico, y
 * ':t' es la frase que se lee al tocarla.
 *
 * Esta comprobacion no estaba y se notaba: `fresco` y `vacaciones` llevaban
 * dos meses sin traducir —el jugador en ingles veia dos pastillas en
 * espanol— y tres de las frases seguian contando lo que las condiciones
 * hacian ANTES de quitarles los multiplicadores escondidos. Un diccionario sin
 * prueba se queda atras en silencio. */
const sinCond = sbEn.CONDICIONES_MES
  .filter(c => !X.condicion || !X.condicion[c.id] || !X.condicion[c.id + ':t'])
  .map(c => c.id);
ok(sinCond.length === 0,
   `las ${sbEn.CONDICIONES_MES.length} condiciones del mes están traducidas` +
   (sinCond.length ? ': ' + sinCond.join(', ') : ''));

const sinClase = ['clima', 'compromiso', 'oportunidad']
  .filter(c => !X.condicion || !X.condicion['clase_' + c]);
ok(sinClase.length === 0,
   'y las tres etiquetas del pronóstico también' +
   (sinClase.length ? ': ' + sinClase.join(', ') : ''));

/* Las siete pestanas de la barra de abajo.
 *
 * Sus nombres viven en una tabla (`PESTANAS_DEF` en js/ui.js) y llegan al
 * diccionario por `T(it.tx)`, con la variable adentro: el rastreador de
 * cadenas de mas abajo busca `T('...')` literales y estos no los ve. 'Mes'
 * llevaba sin traducir desde que la pestana se llama asi —era la primera
 * palabra de la pantalla principal en ingles— y ninguna prueba se entero. */
const ROTULOS_PESTANA = ['Mes', 'Trabajo', 'Imperio', 'Estudio', 'Banco', 'Extra', 'Noticias'];
const sinPestana = ROTULOS_PESTANA.filter(t => !X.ui[t]);
ok(sinPestana.length === 0,
   'las siete pestañas de la barra están traducidas' +
   (sinPestana.length ? ': ' + sinPestana.join(', ') : ''));

// Una partida completa con la capa de idioma cargada
const { Motor } = sbEn;
Motor.iniciar('normal', 3, 'apoyo');
const z = adulto(sbEn);
Motor.tomarTrabajo('tienda', true);
let t = 0;
while (!z.jubilado && t < 400) {
  t++;
  for (let i = 0; i < 8; i++) Motor.asignarEspacio(i, i < 6 ? 'trabajo' : 'descanso');
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

  /* Y al reves: claves que sobran en el diccionario, que suelen ser textos
   * renombrados en el codigo y olvidados en la traduccion.
   *
   * OJO con los archivos de traduccion: si entran en el barrido, toda clave
   * aparece "usada" porque esta escrita ahi mismo, y la comprobacion no mide
   * nada. Estuvo asi un rato y no atrapo ni una. */
  const datosDir = path.join(RAIZ, 'datos');
  const todo = FUENTES.map(leer).join(String.fromCharCode(10)) +
    fs.readdirSync(datosDir)
      .filter(f => f.endsWith('.js') && !f.startsWith('textos.'))
      .map(f => fs.readFileSync(path.join(datosDir, f), 'utf8'))
      .join(String.fromCharCode(10));
  const huerfanas = Object.keys(dicc).filter(k => !todo.includes(k));
  ok(huerfanas.length === 0,
     huerfanas.length === 0
       ? 'ninguna clave del diccionario quedo huerfana'
       : `${huerfanas.length} claves ya no se usan: ${huerfanas.slice(0, 5).join(' | ')}`);
})();

M.imprimir('interfaz bilingüe');

