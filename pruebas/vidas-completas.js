// Prueba completa: varias vidas jugadas hasta la jubilacion a los 65.
const { cargar, conAzarSemilla } = require('./comun');
const sandbox = cargar('es');
const { Motor, CONFIG, NIVELES_EDUCATIVOS } = sandbox;

// Semilla fija: la misma corrida da siempre el mismo resultado. Antes no era
// asi y el patrimonio de una misma vida oscilaba entre Q465 mil y Q2.5
// millones segun la corrida, asi que los numeros no servian para comparar nada.
const SEMILLA = 20260904;

function vida(nombre, dificultad, estrategia) {
  return conAzarSemilla(sandbox, SEMILLA, () => vidaSinSemilla(nombre, dificultad, estrategia));
}

function vidaSinSemilla(nombre, dificultad, estrategia, callado) {
  Motor.iniciar(dificultad, 1);
  const e = Motor.get();
  const problemas = [];
  let turnos = 0, decisiones = 0, graduaciones = 0;

  while (!e.jubilado && turnos < 700) {
    turnos++;
    try { estrategia(Motor, e, turnos); } catch (err) {
      problemas.push(`turno ${turnos} estrategia: ${err.message}`); break;
    }
    let m;
    try { m = Motor.cerrarTurno(); } catch (err) {
      problemas.push(`turno ${turnos} cierre: ${err.message}\n${err.stack.split('\n')[1]}`); break;
    }
    decisiones += m.decisiones.length;
    if (m.graduacion) graduaciones++;
    // resolver decisiones eligiendo siempre la primera opcion
    m.decisiones.forEach(d => {
      try { Motor.aplicarDecision(d.clase, d.ref, 0); }
      catch (err) { problemas.push(`decision ${d.ref}: ${err.message}`); }
    });
    const p = Motor.patrimonio();
    if (isNaN(p)) { problemas.push(`turno ${turnos}: patrimonio NaN`); break; }
    if (e.energia < 0 || e.energia > 100) problemas.push(`turno ${turnos}: energia ${e.energia}`);
    if (e.puntaje < 0 || e.puntaje > 100) problemas.push(`turno ${turnos}: puntaje ${e.puntaje}`);
    if (e.efectivo < -0.01) problemas.push(`turno ${turnos}: efectivo ${e.efectivo.toFixed(2)}`);
  }

  const r = Motor.reporte();
  if (callado) {
    // callado no significa silenciar fallos: solo omitir el detalle de una vida sana
    if (problemas.length) console.log(`  PROBLEMAS en ${nombre}:\n   - ` + problemas.slice(0,3).join('\n   - '));
    return r.patrimonio;
  }
  console.log(`\n=== ${nombre} (${dificultad}) ===`);
  console.log(`  turnos jugados      ${turnos}   edad ${r.edad}   jubilado: ${e.jubilado}`);
  console.log(`  educacion final     ${r.educacion}  (${graduaciones} graduaciones)`);
  const emp = r.empleoId ? sandbox.TRABAJOS.find(t => t.id === r.empleoId) : null;
  console.log(`  empleo final        ${emp ? emp.nombre : 'sin trabajo'}`);
  console.log(`  PATRIMONIO          Q${r.patrimonio.toFixed(2)}`);
  console.log(`  deuda               Q${r.deuda.toFixed(2)}`);
  console.log(`  puntaje credito     ${r.puntaje} (${r.tramo})`);
  console.log(`  intereses ganados   Q${r.totales.interesesGanados.toFixed(2)}`);
  console.log(`  intereses pagados   Q${r.totales.interesesPagados.toFixed(2)}`);
  console.log(`  fuga efectivo       Q${r.totales.fugaEfectivo.toFixed(2)}`);
  console.log(`  decisiones vistas   ${decisiones}`);
  console.log(`  resumenes anuales   ${e.resumenesAnuales.length}`);
  console.log(`  lecciones: ${r.lecciones.length}`);
  if (problemas.length) console.log('  PROBLEMAS:\n   - ' + problemas.slice(0,6).join('\n   - '));
  else console.log('  sin errores');
  return r.patrimonio;
}

// Busca el mejor empleo al que el jugador ya califica y se cambia si conviene.
// Cambiar reinicia la antiguedad, asi que solo vale la pena si el sueldo base
// nuevo supera al que ya se gana con experiencia incluida.
/* Compara por el sueldo mensual que el motor calcula, no por el campo
 * salarioBase.
 *
 * Los trabajitos de nino no tienen salarioBase: se cobran por jornada. Con la
 * comparacion vieja quedaban con sueldo `undefined` y el jugador se quedaba
 * vendiendo limonada los cincuenta anios siguientes. */
function mejorEmpleo(M, e, formal) {
  const actual = e.empleo ? sandbox.TRABAJOS.find(t => t.id === e.empleo.id) : null;
  const ganaHoy = actual ? M.salarioEsperado(actual, !!e.empleo.formal) : 0;

  let mejor = null, mejorPaga = 0;
  for (const t of sandbox.TRABAJOS) {
    if (actual && t.id === actual.id) continue;
    if (!M.puedeAplicar(t).ok) continue;
    const paga = M.salarioEsperado(t, formal === undefined ? true : formal);
    if (paga <= ganaHoy) continue;
    if (!mejor || paga > mejorPaga) { mejor = t; mejorPaga = paga; }
  }
  if (mejor) M.tomarTrabajo(mejor.id, formal === undefined ? true : formal);
}

/* La escalera educativa completa.
 *
 * El juego ya no arranca con el diversificado en la mano: arranca a los 13
 * saliendo de primaria. Cualquier estrategia que quiera un titulo tiene que
 * pasar por basicos y por el diversificado, y ese peaje es justo lo que esta
 * prueba tiene que medir: cuantos anios se pierden y si aun asi conviene.
 *
 * destino: 'ninguno' | 'tecnico' | 'ingenieria' | 'maestria'
 */
function subirEscalera(M, e, destino) {
  if (e.estudio || destino === 'ninguno') return;
  if (e.educacion === 'primaria') return void M.inscribirse('basicos', false);
  if (e.educacion === 'basicos') return void M.inscribirse('bachillerato', false, 'am');
  if (e.educacion === 'diversificado') {
    return void M.inscribirse(destino === 'maestria' ? 'ingenieria' : destino, false);
  }
  if (e.educacion === 'licenciatura' && destino === 'maestria' && e.edad < 40) {
    M.inscribirse('maestria', false);
  }
}

/* Reparte las ocho jornadas del mes, respetando las que tenga tomadas el
 * colegio y guardando las de descanso que hagan falta para no enfermarse.
 *
 * Los dos primeros parametros siguen en SEMANAS porque asi se lee mejor la
 * estrategia; dentro son dos jornadas cada una. */
/* Lo que un chico aplicado saca de una tarea.
 *
 * Las tareas son minijuegos y no se pueden jugar sin pantalla, asi que aqui se
 * simula el resultado: 18 de los 25 que da una tarea perfecta, o sea alguien
 * que la hace bien pero no impecable. La jornada SI se gasta, que es lo que
 * hace honesta la simulacion: la experiencia se paga con tiempo que no se
 * trabaja, igual que en el juego. */
const XP_POR_TAREA = 18;

/* Si a la carrera que viene todavia le falta experiencia.
 *
 * Sin esto la simulacion se queda atascada donde el juego ahora pide tareas:
 * ingenieria pide 240 y la maestria 400, y estar sentado en el pupitre solo da
 * 3 por mes. Un chico que quiere una maestria hace las tareas; uno que no las
 * hace, no llega, y eso es justo lo que la mecanica quiere decir. */
function faltaExperiencia(M, e, destino) {
  if (!e.estudio || destino === 'ninguno') return false;
  const orden = { tecnico: ['tecnico'], diversificado: ['bachillerato'],
                  ingenieria: ['ingenieria'], maestria: ['ingenieria', 'maestria'] };
  const metas = orden[destino] || [];
  return metas.some(function (id) {
    const c = sandbox.CARRERAS.find(x => x.id === id);
    return c && (c.experienciaRequerida || 0) > M.experiencia();
  });
}

function repartir(M, e, trabajoSemanas, estudioSemanas, tareas) {
  // Cada jornada de trabajo o estudio cuesta 6 de energia y cada descanso
  // devuelve 22: con dos descansos se sostiene un mes de trabajo completo.
  const descanso = e.energia < 70 ? 2 : 0;
  const libres = [];
  for (let i = 0; i < sandbox.CONFIG.jornadasPorMes; i++) {
    if (!M.espacioBloqueado(i)) libres.push(i);
  }
  const tope = Math.max(0, libres.length - descanso);
  // Las jornadas extra de estudio solo existen en la universidad: basicos y
  // diversificado son de jornada fija y el motor las rechaza.
  const estudioLibre = e.estudio && !e.estudio.jornada;
  let k = 0;
  for (let n = 0; n < (tareas || 0) && k < tope; n++, k++) {
    M.asignarEspacio(libres[k], 'tarea');
    M.sumarExperiencia(XP_POR_TAREA);
  }
  for (let n = 0; n < trabajoSemanas * 2 && k < tope; n++, k++) M.asignarEspacio(libres[k], 'trabajo');
  if (estudioLibre) {
    for (let n = 0; n < estudioSemanas * 2 && k < tope; n++, k++) M.asignarEspacio(libres[k], 'estudio');
  }
  while (k < libres.length) M.asignarEspacio(libres[k++], 'descanso');
}

// A: no estudia nunca, trabaja desde que alguien lo contrate, abre cuentas
vida('Nunca estudia y ahorra', 'normal', (M, e) => {
  mejorEmpleo(M, e, true);
  if (e.monetaria === null && e.efectivo >= M.aperturaMinima('monetaria')) {
    M.abrirCuenta('monetaria', M.aperturaMinima('monetaria'));
  } else if (e.ahorro === null && e.efectivo >= M.aperturaMinima('ahorro')) {
    M.abrirCuenta('ahorro', M.aperturaMinima('ahorro'));
  }
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  if (!e.plazo && e.ahorro > 20000) M.abrirPlazo(10000);
  repartir(M, e, 3, 0);
});

// B: estudia ingenieria publica y luego maestria
vida('Universitario hasta maestria', 'normal', (M, e) => {
  // Se cambia de empleo cuando el titulo nuevo le abre uno mejor. Sin esto la
  // prueba jamas comprobaba que estudiar sirva de algo.
  mejorEmpleo(M, e, true);
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  subirEscalera(M, e, 'maestria');
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
});

// C: tecnico corto, empieza a trabajar pronto, usa credito formal
vida('Tecnico con credito formal', 'normal', (M, e) => {
  mejorEmpleo(M, e, true);
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  subirEscalera(M, e, 'tecnico');
  if (e.ahorro > 3000 && e.prestamos.length === 0 && e.puntaje < 40) {
    M.pedirPrestamo(2000, 12, true);
  }
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
});


// D: informal, sin cuentas, recurre al prestamista
vida('Informal y prestamista del barrio', 'dificil', (M, e) => {
  mejorEmpleo(M, e, false);
  if (e.edad >= sandbox.CONFIG.mayoriaDeEdad && e.efectivo < 300 && e.prestamos.length === 0) {
    M.pedirInformal(1000, 6);
  }
  repartir(M, e, 3, 0);
});


/* ----------------------------------------------------------------------
 * ¿Estudiar rinde?
 *
 * Es la promesa central del juego y no habia nada que la comprobara. Una
 * sola vida no alcanza: con azar libre el patrimonio de la misma estrategia
 * oscilaba cinco a uno entre corridas. Aqui se corre cada ruta sobre
 * veintiuna semillas y se compara la MEDIANA, que aguanta los extremos.
 * ---------------------------------------------------------------------- */

const SEMILLAS = Array.from({ length: 21 }, (_, i) => 1000 + i * 7919);

function cuentasBasicas(M, e) {
  // El minimo de apertura es mas bajo siendo menor de edad, y el chico de 13
  // gana Q40 al mes: con el minimo de adulto no abriria cuenta hasta los 18.
  if (e.monetaria === null && e.efectivo >= M.aperturaMinima('monetaria')) {
    M.abrirCuenta('monetaria', M.aperturaMinima('monetaria'));
  } else if (e.ahorro === null && e.efectivo >= M.aperturaMinima('ahorro')) {
    M.abrirCuenta('ahorro', M.aperturaMinima('ahorro'));
  }
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) {
    M.mover('monetaria', 'ahorro', e.monetaria - 2000);
  }
}

const RUTAS = {
  'sin estudiar': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    repartir(M, e, 3, 0);
  },
  'diversificado': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    subirEscalera(M, e, 'diversificado');
    repartir(M, e, e.estudio ? 2 : 3, 0);
  },
  'tecnico': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    subirEscalera(M, e, 'tecnico');
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0,
             faltaExperiencia(M, e, 'tecnico') ? 1 : 0);
  },
  'licenciatura': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    subirEscalera(M, e, 'ingenieria');
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0,
             faltaExperiencia(M, e, 'ingenieria') ? 1 : 0);
  },
  'maestria': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    subirEscalera(M, e, 'maestria');
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0,
             faltaExperiencia(M, e, 'maestria') ? 1 : 0);
  }
};

function mediana(xs) {
  const s = xs.slice().sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

const Q = n => 'Q' + Math.round(n).toLocaleString('en-US');

console.log('\n--- ¿estudiar rinde? mediana de 21 vidas por ruta ---');
const medianas = {};
for (const [nombre, estrategia] of Object.entries(RUTAS)) {
  const patrimonios = SEMILLAS.map(s =>
    conAzarSemilla(sandbox, s, () => vidaSinSemilla(nombre, 'normal', estrategia, true)));
  medianas[nombre] = mediana(patrimonios);
  const min = Math.min(...patrimonios), max = Math.max(...patrimonios);
  console.log(`  ${nombre.padEnd(14)} mediana ${Q(medianas[nombre]).padStart(12)}   ` +
              `rango ${Q(min)} a ${Q(max)}`);
}

const fallos = [];
function exigir(cond, texto) { if (!cond) fallos.push(texto); }

exigir(medianas['diversificado'] > medianas['sin estudiar'],
  `terminar el diversificado (${Q(medianas['diversificado'])}) deberia superar a no estudiar nunca (${Q(medianas['sin estudiar'])})`);
exigir(medianas['tecnico'] > medianas['sin estudiar'],
  `el tecnico (${Q(medianas['tecnico'])}) deberia superar a no estudiar (${Q(medianas['sin estudiar'])})`);
exigir(medianas['maestria'] > medianas['licenciatura'],
  `la maestria (${Q(medianas['maestria'])}) deberia superar a la licenciatura sola (${Q(medianas['licenciatura'])})`);
exigir(medianas['maestria'] > medianas['sin estudiar'] * 2,
  `la maestria (${Q(medianas['maestria'])}) deberia mas que duplicar a no estudiar (${Q(medianas['sin estudiar'])})`);

if (fallos.length) {
  console.log('\n  INCENTIVO AL REVES:');
  fallos.forEach(f => console.log('   - ' + f));
  process.exitCode = 1;
} else {
  console.log('  el incentivo apunta en la direccion correcta');
}


/* ----------------------------------------------------------------------
 * ¿Se puede salir del modo dificil?
 *
 * En la economia informal TODOS los empleos que no piden titulo dejan
 * margen negativo contra el gasto fijo de la casa familiar:
 *   repartidor -Q289 · tienda -Q152 · construccion -Q425 · vendedor -Q971
 * Solo dos escapan, y ninguno esta disponible al empezar: la tienda propia
 * pide Q8,000 de capital, y el tecnico en refrigeracion pide un titulo.
 *
 * O sea que el modo dificil es un hoyo del que solo se sale estudiando, y
 * se tarda una decada en volver a numeros negros. Es duro a proposito y es
 * fiel a la investigacion, pero tiene que seguir siendo POSIBLE. Esto lo
 * fija: si algun cambio lo vuelve una trampa sin salida, la suite falla.
 * ---------------------------------------------------------------------- */

function vidaDificilQueEstudia(M, e) {
  let mejor = null, mejorPaga = 0;
  for (const t of sandbox.TRABAJOS) {
    if (!t.permiteInformal) continue;
    if (!M.puedeAplicar(t).ok) continue;
    const paga = M.salarioEsperado(t, false);
    if (!mejor || paga > mejorPaga) { mejor = t; mejorPaga = paga; }
  }
  if (mejor && (!e.empleo || e.empleo.id !== mejor.id)) M.tomarTrabajo(mejor.id, false);
  subirEscalera(M, e, 'tecnico');
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
}

const salidas = SEMILLAS.map(s =>
  conAzarSemilla(sandbox, s, () => vidaSinSemilla('escape dificil', 'dificil', vidaDificilQueEstudia, true)));

const salen = salidas.filter(p => p > 0).length;
console.log('\n--- ¿se puede salir del modo dificil estudiando? ---');
console.log(`  patrimonio mediano a los 65   ${Q(mediana(salidas))}`);
console.log(`  termina en positivo en ${salen} de ${SEMILLAS.length} semillas`);

if (salen < SEMILLAS.length) {
  console.log(`  TRAMPA SIN SALIDA: el modo dificil deja a ${SEMILLAS.length - salen} vidas en negativo`);
  process.exitCode = 1;
} else {
  console.log('  el modo dificil es duro pero tiene salida');
}
