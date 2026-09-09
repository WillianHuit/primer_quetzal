// Prueba del ciclo de credito: fiador, garantia, puntaje, tarjeta, prestamista.
const { cargar, adulto } = require('./comun');
const sandbox = cargar('es');
const { Motor } = sandbox;

/* Todas las partidas de esta prueba son de un adulto con empleo: el ciclo de
 * credito no existe antes de los 18. */
function nueva(dificultad, ranura, origen) {
  Motor.iniciar(dificultad, ranura, origen);
  return adulto(sandbox);
}

const check = [];
function ok(cond, msg) { check.push((cond?'  OK   ':'  FALLA ') + msg); }

function trabajar(M, e, n) {
  // n sigue siendo semanas; el mes son ocho jornadas de media semana
  const s = n === undefined ? 3 : n;
  for (let i=0;i<8;i++) M.asignarEspacio(i, i < s * 2 ? 'trabajo' : 'descanso');
  return M.cerrarTurno();
}

/* Y esto cierra turnos hasta cubrir los MESES que dice la frase.
 *
 * Un turno dejo de ser un mes: a los 13 lo es, de los 14 en adelante son tres.
 * Todas las cuentas de este archivo estan escritas en meses —"doce cuotas",
 * "pagando el minimo doce meses"— y contando turnos median tres anios. La
 * tarjeta bajaba de Q1000 a Q104 y la prueba decia que "casi no baja". */
function correrMeses(M, e, meses, n) {
  let corridos = 0, ultimo = null, vueltas = 0;
  while (corridos < meses && vueltas < 500) {
    ultimo = trabajar(M, e, n);
    corridos += ultimo.mesesCubiertos || 1;
    vueltas++;
  }
  return ultimo;
}

nueva('normal', 1);
const e = Motor.get();
Motor.tomarTrabajo('callcenter', true);
Motor.abrirCuenta('monetaria', 200);

// --- mes 1: sin historial no debe poder pedir ---
let req = Motor.requisitoPrestamo();
ok(!req.ok && req.necesitaGarantia, 'sin historial ni fiador, te piden garantia');

// --- avanzar 24 meses para construir reputacion ---
correrMeses(Motor, e, 24, 3);
ok(e.reputacion >= 55, `tras 2 años de aportar, la reputacion sube (${Math.round(e.reputacion)})`);
req = Motor.requisitoPrestamo();
ok(req.ok && req.conFiador, 'con reputacion alta ya te consiguen fiador');

// --- credito con garantia desde cero ---
nueva('normal', 2);
const g = Motor.get();
Motor.tomarTrabajo('callcenter', true);
Motor.abrirCuenta('monetaria', 200);
correrMeses(Motor, g, 6, 3);
Motor.abrirCuenta('ahorro', 100);
Motor.mover('monetaria','ahorro', 4000);
const antesAhorro = g.ahorro;
let r = Motor.pedirPrestamo(2000, 12, true);
ok(r.ok, 'se puede pedir con garantia sin historial: ' + (r.razon||''));
ok(Math.abs(g.ahorro - (antesAhorro - 2000)) < 1, 'la garantia congela el mismo monto del ahorro');
ok(g.prestamos.length === 1, 'queda un prestamo activo');
const cuota = g.prestamos[0].cuota;
ok(cuota > 180 && cuota < 200, `la cuota de Q2000 a 12 meses es razonable (Q${cuota.toFixed(2)})`);

// --- pagar 12 cuotas y ver subir el puntaje ---
const puntajeAntes = g.puntaje;
correrMeses(Motor, g, 13, 3);
ok(g.puntaje > puntajeAntes, `pagar cuotas sube el puntaje (${puntajeAntes} a ${Math.round(g.puntaje)})`);
ok(g.prestamos.length === 0, 'el prestamo se liquida al terminar el plazo');
ok(g.ahorro > antesAhorro - 2000, 'la garantia se devuelve al liquidar');

// --- tarjeta ---
let rt = Motor.solicitarTarjeta();
ok(rt.ok, 'con historial ya dan tarjeta: ' + (rt.razon||''));
if (rt.ok) {
  ok(g.tarjeta.limite > 0, `el limite depende del puntaje (Q${g.tarjeta.limite})`);
  Motor.gastarConTarjeta(1000);
  const saldoInicial = g.tarjeta.saldo;
  g.tarjeta.pagarMinimo = true;
  correrMeses(Motor, g, 12, 3);
  ok(g.tarjeta.saldo > saldoInicial * 0.45,
     `pagando solo el minimo la deuda casi no baja (Q${saldoInicial} a Q${g.tarjeta.saldo.toFixed(2)} en 12 meses)`);
}

// --- prestamista informal ---
nueva('normal', 3);
const p = Motor.get();
Motor.tomarTrabajo('tienda', true);
const ri = Motor.pedirInformal(1000, 6);
ok(ri.ok, 'el prestamista presta sin preguntar nada');
ok(ri.cuota > 280, `la cuota informal es brutal (Q${ri.cuota.toFixed(2)} al mes por Q1000)`);
const totalInformal = ri.cuota * 6;
ok(totalInformal > 1700, `por Q1000 devuelves Q${totalInformal.toFixed(0)} en 6 meses`);

// --- mora baja el puntaje ---
nueva('normal', 1);
const m = Motor.get();
Motor.tomarTrabajo('callcenter', true);
Motor.abrirCuenta('monetaria', 200);
correrMeses(Motor, m, 10, 3);
Motor.abrirCuenta('ahorro', 100);
Motor.mover('monetaria','ahorro', 3000);
Motor.pedirPrestamo(2500, 12, true);
correrMeses(Motor, m, 4, 3);
const antesMora = m.puntaje;
Motor.renunciar();                 // se queda sin ingreso
m.monetaria = 0; m.efectivo = 0; m.ahorro = 0;
correrMeses(Motor, m, 3, 0);
ok(m.puntaje < antesMora, `la mora hunde el puntaje (${Math.round(antesMora)} a ${Math.round(m.puntaje)})`);

// --- deposito a plazo e interes compuesto ---
nueva('normal', 1);
const z = Motor.get();
Motor.tomarTrabajo('gerente', true);   // sueldo alto para acumular rapido
Motor.abrirCuenta('monetaria', 200);
Motor.abrirCuenta('ahorro', 100);
for (let i=0;i<12;i++) { trabajar(Motor, z, 4); Motor.mover('monetaria','ahorro', Math.max(0, z.monetaria - 500)); }
const rp = Motor.abrirPlazo(5000);
ok(rp.ok, 'se puede abrir deposito a plazo: ' + (rp.razon||''));
if (rp.ok) {
  correrMeses(Motor, z, 12, 3);
  ok(z.plazo === null, 'el plazo vence a los 12 meses y se abona');
}

console.log('\n=== ciclo de credito ===');
check.forEach(l => console.log(l));
const fallas = check.filter(l => l.startsWith('  FALLA')).length;
console.log(`\n${check.length - fallas} de ${check.length} comprobaciones pasaron.`);
