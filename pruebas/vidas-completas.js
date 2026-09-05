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
function mejorEmpleo(M, e, formal) {
  const actual = e.empleo ? sandbox.TRABAJOS.find(t => t.id === e.empleo.id) : null;
  const anios = e.empleo ? Math.floor(e.empleo.mesesEnPuesto / 12) : 0;
  const ganaHoy = actual
    ? actual.salarioBase * (1 + anios * sandbox.AUMENTO_POR_ANIO_EXPERIENCIA)
    : 0;

  let mejor = null;
  for (const t of sandbox.TRABAJOS) {
    if (actual && t.id === actual.id) continue;
    if (!M.puedeAplicar(t).ok) continue;
    if (t.salarioBase <= ganaHoy) continue;
    if (!mejor || t.salarioBase > mejor.salarioBase) mejor = t;
  }
  if (mejor) M.tomarTrabajo(mejor.id, formal === undefined ? true : formal);
}

function repartir(M, e, trabajoSemanas, estudioSemanas) {
  const descanso = e.energia < 50 ? 1 : 0;
  let i = 0;
  for (let k = 0; k < trabajoSemanas && i < 4 - descanso; k++, i++) M.asignarEspacio(i, 'trabajo');
  for (let k = 0; k < estudioSemanas && i < 4 - descanso; k++, i++) M.asignarEspacio(i, 'estudio');
  while (i < 4) M.asignarEspacio(i++, 'descanso');
}

// A: no estudia, trabaja desde los 18, abre cuentas, plazo fijo
vida('Trabaja desde los 18 y ahorra', 'normal', (M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
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
  if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('ingenieria', false);
  if (!e.estudio && e.educacion === 'licenciatura' && e.edad < 40) M.inscribirse('maestria', false);
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
});

// C: tecnico corto, empieza a trabajar pronto, usa credito formal
vida('Tecnico con credito formal', 'normal', (M, e) => {
  mejorEmpleo(M, e, true);
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('tecnico', false);
  if (e.ahorro > 3000 && e.prestamos.length === 0 && e.puntaje < 40) {
    M.pedirPrestamo(2000, 12, true);
  }
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
});


// D: informal, sin cuentas, recurre al prestamista
vida('Informal y prestamista del barrio', 'dificil', (M, e) => {
  if (!e.empleo) M.tomarTrabajo('repartidor', false);
  if (e.efectivo < 300 && e.prestamos.length === 0) M.pedirInformal(1000, 6);
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
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
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
  'tecnico': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('tecnico', false);
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
  },
  'licenciatura': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('ingenieria', false);
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
  },
  'maestria': (M, e) => {
    mejorEmpleo(M, e, true);
    cuentasBasicas(M, e);
    if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('ingenieria', false);
    if (!e.estudio && e.educacion === 'licenciatura' && e.edad < 40) M.inscribirse('maestria', false);
    repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
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
  let mejor = null;
  for (const t of sandbox.TRABAJOS) {
    if (!t.permiteInformal) continue;
    if (!M.puedeAplicar(t).ok) continue;
    if (!mejor || t.salarioBase > mejor.salarioBase) mejor = t;
  }
  if (mejor && (!e.empleo || e.empleo.id !== mejor.id)) M.tomarTrabajo(mejor.id, false);
  if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('tecnico', false);
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
