// Prueba del motor sin navegador: simula 24 meses en varias estrategias.
const { cargar, adulto, conAzarSemilla } = require('./comun');
const sandbox = cargar('es');
const { Motor, CONFIG } = sandbox;

// Semilla fija para que la corrida sea reproducible. Sin esto los numeros
// bailaban miles de quetzales entre ejecuciones y no servian para comparar
// un antes con un despues.
const SEMILLA = 20260904;

function correr(nombre, dificultad, estrategia) {
  return conAzarSemilla(sandbox, SEMILLA, () => correrSinSemilla(nombre, dificultad, estrategia));
}

function correrSinSemilla(nombre, dificultad, estrategia, callado) {
  Motor.iniciar(dificultad, 1);
  // Esta prueba mide vida laboral, no ninez: arranca a los 18 con diversificado
  const e = adulto(sandbox);
  let errores = [];

  for (let mes = 0; mes < 24; mes++) {
    try {
      estrategia(mes, Motor, e);
      Motor.cerrarTurno();
    } catch (err) {
      errores.push(`mes ${mes}: ${err.message}`);
      break;
    }
    const p = Motor.patrimonio();
    if (!isFinite(p) || isNaN(p)) { errores.push(`mes ${mes}: patrimonio no numerico (${p})`); break; }
    if (e.energia < 0 || e.energia > CONFIG.energia.maxima) errores.push(`mes ${mes}: energia fuera de rango (${e.energia})`);
    if (e.efectivo < -0.01) errores.push(`mes ${mes}: efectivo negativo (${e.efectivo.toFixed(2)})`);
  }

  const f = Motor.get();
  console.log(`\n=== ${nombre} (${dificultad}) ===`);
  console.log(`  edad final          ${f.edad}   meses ${f.mesesJugados}`);
  console.log(`  efectivo            Q${f.efectivo.toFixed(2)}`);
  console.log(`  monetaria           ${f.monetaria === null ? 'sin abrir' : 'Q' + f.monetaria.toFixed(2)}`);
  console.log(`  ahorro              ${f.ahorro === null ? 'sin abrir' : 'Q' + f.ahorro.toFixed(2)}`);
  console.log(`  PATRIMONIO          Q${Motor.patrimonio().toFixed(2)}`);
  console.log(`  ingresos totales    Q${f.totales.ingresos.toFixed(2)}`);
  console.log(`  gastos totales      Q${f.totales.gastos.toFixed(2)}`);
  console.log(`  intereses ganados   Q${f.totales.interesesGanados.toFixed(2)}`);
  console.log(`  fuga de efectivo    Q${f.totales.fugaEfectivo.toFixed(2)}`);
  console.log(`  energia final       ${Math.round(f.energia)}`);
  if (errores.length) console.log('  PROBLEMAS:\n   - ' + errores.join('\n   - '));
  else console.log('  sin errores');
  return Motor.patrimonio();
}

// Reparte las ocho jornadas cuidando la energia: descansa cuando anda baja.
// Los descansos van en semanas completas (dos jornadas) para que los numeros
// sigan siendo comparables con las corridas de antes.
function semanasCuidandoEnergia(M, e) {
  const descansos = e.energia < 45 ? 4 : (e.energia < 70 ? 2 : 0);
  for (let i = 0; i < 8; i++) M.asignarEspacio(i, i < 8 - descansos ? 'trabajo' : 'descanso');
}

// A: nunca abre cuenta, trabaja las 4 semanas siempre, guarda todo en efectivo
const a = correr('Todo en efectivo, sin descansar nunca', 'normal', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  for (let i = 0; i < 8; i++) M.asignarEspacio(i, 'trabajo');
});

// B: mismo trabajo, pero abre cuentas y cuida la energia
const b = correr('Con cuentas y energia cuidada', 'normal', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  if (mes === 0) M.abrirCuenta('monetaria', 200);
  if (mes === 1 && e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 1500) {
    M.mover('monetaria', 'ahorro', e.monetaria - 1200);
  }
  semanasCuidandoEnergia(M, e);
});

// C: efectivo, cuidando energia, para aislar el efecto de bancarizarse
const c = correr('Sin cuentas pero cuidando energia', 'normal', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  semanasCuidandoEnergia(M, e);
});

// D: modo dificil, informal
const d = correr('Informal en modo dificil', 'dificil', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('repartidor', false);
  semanasCuidandoEnergia(M, e);
});

// E: se muda al cuarto compartido apenas puede
const f = correr('Se independiza temprano', 'normal', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('callcenter', true);
  if (mes === 0) M.abrirCuenta('monetaria', 200);
  if (mes === 2 && e.vivienda === 'familiar') M.mudarse('cuarto');
  semanasCuidandoEnergia(M, e);
});

console.log('\n--- comparacion a 24 meses ---');
console.log(`  4 semanas siempre, sin cuentas   Q${a.toFixed(2)}`);
console.log(`  con cuentas, energia cuidada     Q${b.toFixed(2)}`);
console.log(`  sin cuentas, energia cuidada     Q${c.toFixed(2)}`);
console.log(`  informal en modo dificil         Q${d.toFixed(2)}`);
console.log(`  independizado (call center)      Q${f.toFixed(2)}`);
console.log(`\n  ventaja neta de bancarizarse:    Q${(b - c).toFixed(2)}`);
console.log(`  ahorro promedio al mes (B):      Q${(b / 24).toFixed(2)}`);


/* ----------------------------------------------------------------------
 * La ventaja de bancarizarse, medida en serio.
 *
 * Una sola corrida no alcanza: con azar libre este numero oscilaba entre
 * Q4 mil y Q11 mil segun la ejecucion, asi que no servia para saber si un
 * cambio en la economia lo habia movido. Aqui se comparan las mismas dos
 * estrategias sobre veintiun semillas, aislando el unico factor que las
 * distingue: tener cuentas o guardar todo en efectivo.
 * ---------------------------------------------------------------------- */

const SEMILLAS = Array.from({ length: 21 }, (_, i) => 1000 + i * 7919);

const conCuentas = (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  if (mes === 0) M.abrirCuenta('monetaria', 200);
  if (mes === 1 && e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 1500) {
    M.mover('monetaria', 'ahorro', e.monetaria - 1200);
  }
  semanasCuidandoEnergia(M, e);
};

const soloEfectivo = (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  semanasCuidandoEnergia(M, e);
};

function mediana(xs) {
  const s = xs.slice().sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
}

const parejas = SEMILLAS.map(s => ({
  banco: conAzarSemilla(sandbox, s, () => correrSinSemilla('con cuentas', 'normal', conCuentas, true)),
  efectivo: conAzarSemilla(sandbox, s, () => correrSinSemilla('solo efectivo', 'normal', soloEfectivo, true))
}));

/* La misma semilla para las dos estrategias, asi que la diferencia de cada
 * pareja aisla el efecto de bancarizarse... casi.
 *
 * Casi, y aqui esta el matiz: lo que le SALE al jugador depende de lo que
 * tiene. Una dificultad de Q350 no le cae a quien no los tiene, y hay
 * comodines y trampas que solo salen con dinero en la mano. O sea que la vida
 * bancarizada y la de solo efectivo no consumen los mismos numeros del azar
 * aunque arranquen de la misma semilla: a partir del primer sorteo que dependa
 * del dinero, los dos tableros se separan.
 *
 * Por eso esto ya no puede exigir 21 de 21. Lo que tiene que seguir siendo
 * cierto —y lo es— es que la ventaja MEDIANA sea grande y que bancarizarse
 * gane en la inmensa mayoria. Exigir la unanimidad seria medir el ruido del
 * tablero, no el efecto del banco. */
const ventajas = parejas.map(p => p.banco - p.efectivo);
const gana = ventajas.filter(v => v > 0).length;
const Q = n => 'Q' + Math.round(n).toLocaleString('en-US');

console.log('\n--- ventaja de bancarizarse, 21 semillas pareadas ---');
console.log(`  mediana con cuentas    ${Q(mediana(parejas.map(p => p.banco)))}`);
console.log(`  mediana solo efectivo  ${Q(mediana(parejas.map(p => p.efectivo)))}`);
console.log(`  ventaja mediana        ${Q(mediana(ventajas))}`);
console.log(`  gana en ${gana} de ${SEMILLAS.length} semillas   ` +
            `(peor caso ${Q(Math.min(...ventajas))}, mejor ${Q(Math.max(...ventajas))})`);

const medianaVentaja = mediana(ventajas);
const MINIMO_QUE_GANA = Math.ceil(SEMILLAS.length * 0.9);   // 19 de 21

if (gana < MINIMO_QUE_GANA || medianaVentaja <= 0) {
  console.log('  INCENTIVO AL REVES: bancarizarse no compensa');
  process.exitCode = 1;
} else if (gana < SEMILLAS.length) {
  console.log(`  bancarizarse gana en ${gana} de ${SEMILLAS.length}, ` +
              `con ${Q(medianaVentaja)} de ventaja mediana`);
} else {
  console.log('  bancarizarse gana siempre');
}
