// Prueba del motor sin navegador: simula 24 meses en varias estrategias.
const { cargar } = require('./comun');
const sandbox = cargar('es');
const { Motor, CONFIG } = sandbox;

function correr(nombre, dificultad, estrategia) {
  Motor.iniciar(dificultad, 1);
  const e = Motor.get();
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

// Reparte semanas cuidando la energia: descansa cuando anda baja.
function semanasCuidandoEnergia(M, e) {
  const descansos = e.energia < 45 ? 2 : (e.energia < 70 ? 1 : 0);
  for (let i = 0; i < 4; i++) M.asignarEspacio(i, i < 4 - descansos ? 'trabajo' : 'descanso');
}

// A: nunca abre cuenta, trabaja las 4 semanas siempre, guarda todo en efectivo
const a = correr('Todo en efectivo, sin descansar nunca', 'normal', (mes, M, e) => {
  if (!e.empleo) M.tomarTrabajo('tienda', true);
  for (let i = 0; i < 4; i++) M.asignarEspacio(i, 'trabajo');
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
