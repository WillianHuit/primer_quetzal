// Prueba completa: varias vidas jugadas hasta la jubilacion a los 65.
const { cargar } = require('./comun');
const sandbox = cargar('es');
const { Motor, CONFIG, NIVELES_EDUCATIVOS } = sandbox;

function vida(nombre, dificultad, estrategia) {
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
  if (!e.empleo) {
    const orden = ['gerente','ingeniero','soporte','callcenter','tienda'];
    for (const id of orden) { if (M.puedeAplicar({id, requisito: (id==='gerente'?'maestria':id==='ingeniero'?'licenciatura':id==='soporte'?'tecnico':'bachiller')}).ok) { M.tomarTrabajo(id, true); break; } }
  }
  if (e.monetaria === null && e.efectivo >= 200) M.abrirCuenta('monetaria', 200);
  else if (e.ahorro === null && e.efectivo >= 100) M.abrirCuenta('ahorro', 100);
  if (!e.estudio && e.educacion === 'bachiller') M.inscribirse('ingenieria', false);
  if (!e.estudio && e.educacion === 'licenciatura' && e.edad < 40) M.inscribirse('maestria', false);
  if (e.ahorro !== null && e.monetaria !== null && e.monetaria > 2500) M.mover('monetaria','ahorro', e.monetaria - 2000);
  repartir(M, e, e.estudio ? 2 : 3, e.estudio ? 1 : 0);
});

// C: tecnico corto, empieza a trabajar pronto, usa credito formal
vida('Tecnico con credito formal', 'normal', (M, e) => {
  if (!e.empleo) {
    if (e.educacion === 'tecnico') M.tomarTrabajo('soporte', true);
    else M.tomarTrabajo('repartidor', true);
  }
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
