/* Prueba de la versión 2: hipoteca, pensión, orígenes y migración. */

const { cargar, Marcador, trabajar, conAzarFijo } = require('./comun');

const sb = cargar('es');
const { Motor, CONFIG, CASAS, HIPOTECA, PENSION, MIGRACION, ORIGENES, Minijuegos } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- orígenes ----------
ORIGENES.forEach(function (o) {
  Motor.iniciar('normal', 1, o.id);
  const e = Motor.get();
  ok(e.efectivo === o.efectivoInicial && e.origen === o.id,
     `el origen "${o.id}" arranca con ${o.efectivoInicial} y su propia reputación`);
});

// El que sostiene a su familia paga más en casa que el que tiene apoyo
Motor.iniciar('normal', 1, 'apoyo');
const gastoApoyo = Motor.gastoMensualVivienda();
Motor.iniciar('normal', 1, 'sosten');
const gastoSosten = Motor.gastoMensualVivienda();
ok(gastoSosten > gastoApoyo,
   `sostener a la familia cuesta más al mes (Q${gastoSosten} contra Q${gastoApoyo})`);

// Solo el origen de remesas recibe dinero de fuera
Motor.iniciar('normal', 1, 'apoyo');
let a = Motor.get(); Motor.tomarTrabajo('tienda', true);
let recibio = false;
for (let i = 0; i < 24; i++) { const m = trabajar(Motor, 3); if (m.remesa > 0) recibio = true; }
ok(!recibio, 'el origen con apoyo familiar no recibe remesas');

Motor.iniciar('normal', 1, 'remesas');
let b = Motor.get(); Motor.tomarTrabajo('tienda', true);
let recibio2 = false;
for (let i = 0; i < 24; i++) { const m = trabajar(Motor, 3); if (m.remesa > 0) recibio2 = true; }
ok(recibio2, 'el origen de remesas sí las recibe');

// ---------- hipoteca ----------
Motor.iniciar('normal', 1, 'apoyo');
const e = Motor.get();
Motor.tomarTrabajo('gerente', true);      // sueldo alto para poder calificar
Motor.abrirCuenta('monetaria', 200);

const casa = CASAS[0];
let req = Motor.requisitoHipoteca(casa, 20);
ok(!req.ok, 'sin historial de crédito no dan hipoteca: ' + (req.razon || ''));

e.puntaje = 70;
req = Motor.requisitoHipoteca(casa, 20);
ok(!req.ok && req.motivo === 'enganche', 'con historial pero sin enganche, tampoco');

// Junta el enganche
for (let i = 0; i < 40; i++) trabajar(Motor, 4);
const necesita = Motor.efectivoParaEnganche(casa);
ok(Motor.engancheDe(casa) === casa.precio * HIPOTECA.engancheFHA,
   `la casa con apoyo estatal pide 5% de enganche (Q${Math.round(Motor.engancheDe(casa))})`);

const liquido = (e.ahorro || 0) + (e.monetaria || 0) + e.efectivo;
ok(liquido >= necesita, `tras 40 meses hay con qué el enganche (Q${Math.round(liquido)} de Q${Math.round(necesita)})`);

const antes = Motor.patrimonio();
const compra = Motor.comprarCasa(casa.id, 20);
ok(compra.ok, 'se puede comprar la casa: ' + (compra.razon || ''));
ok(e.casa && e.hipoteca, 'quedan registradas la casa y la hipoteca');
ok(Math.abs(Motor.patrimonio() - antes) < casa.precio * 0.06,
   'comprar no cambia el patrimonio de golpe: cambias efectivo por un activo');
ok(compra.totalAPagar > compra.prestado * 1.8,
   `a 20 años se devuelve mucho más de lo prestado (Q${Math.round(compra.prestado)} contra Q${Math.round(compra.totalAPagar)})`);

// Ya no se paga renta
const gastoConCasa = Motor.gastoMensualVivienda();
ok(gastoConCasa < casa.serviciosComida + casa.personal + casa.mantenimiento + 1,
   'con casa propia ya no hay renta, solo mantenimiento y servicios');

// La casa se aprecia y la hipoteca baja
const valorInicial = e.casa.valor;
const saldoInicial = e.hipoteca.saldo;
for (let i = 0; i < 36; i++) trabajar(Motor, 4);
ok(e.casa.valor > valorInicial, `la casa se aprecia (Q${Math.round(valorInicial)} a Q${Math.round(e.casa.valor)})`);
ok(e.hipoteca && e.hipoteca.saldo < saldoInicial,
   `la hipoteca baja pagando (Q${Math.round(saldoInicial)} a Q${Math.round(e.hipoteca.saldo)})`);

// ---------- pensión ----------
Motor.iniciar('normal', 1, 'apoyo');
const p = Motor.get();
Motor.tomarTrabajo('gerente', true);
Motor.abrirCuenta('monetaria', 200);
const rp = Motor.abrirPension(500);
ok(rp.ok, 'se puede abrir el plan de pensiones');
ok(!Motor.abrirPension(500).ok, 'no se puede abrir dos veces');

for (let i = 0; i < 240; i++) trabajar(Motor, 4);   // veinte años
const rendido = p.pension.saldo - p.pension.aportado;
ok(p.pension.aportado > 100000, `en veinte años se aportan Q${Math.round(p.pension.aportado)}`);
ok(rendido > p.pension.aportado * 0.6,
   `el interés compuesto añade Q${Math.round(rendido)} sobre lo aportado, sin poner un quetzal más`);

const edadAntes = p.edad;
const rr = Motor.retirarPension();
ok(rr.ok && (edadAntes < PENSION.edadRetiro ? rr.castigo > 0 : rr.castigo === 0),
   `retirar a los ${edadAntes} ${edadAntes < PENSION.edadRetiro ? 'penaliza Q' + Math.round(rr.castigo) : 'no penaliza'}`);

// ---------- migración ----------
Motor.iniciar('normal', 1, 'sosten');
const g = Motor.get();
Motor.tomarTrabajo('callcenter', true);
Motor.abrirCuenta('monetaria', 200);

let mig = Motor.puedeMigrar();
ok(!mig.ok, 'a los 18 todavía no se puede migrar: ' + (mig.razon || ''));

g.edad = 24;
mig = Motor.puedeMigrar();
ok(!mig.ok && mig.motivo === 'costo', 'con la edad pero sin dinero para el viaje, tampoco');

g.monetaria = MIGRACION.costoViaje + 5000;
ok(Motor.puedeMigrar().ok, 'con edad y dinero ya se puede');

// Forzamos que el viaje salga bien para poder probar el resto
const rm = conAzarFijo(sb, 0.99, () => Motor.migrar('construccion_us', 0.4, 'ventanilla'));
ok(rm.ok && !rm.fracaso, 'el viaje sale bien y quedas fuera del país');
ok(Motor.estaFuera(), 'el motor sabe que estás fuera');
ok(g.empleo === null, 'pierdes tu trabajo local al irte');

for (let i = 0; i < 60; i++) trabajar(Motor, 4);
ok(g.totalEnviado > 0, `mandaste Q${Math.round(g.totalEnviado)} a tu familia en cinco años`);
ok(g.comisionesEnvio > 0, `las comisiones se llevaron Q${Math.round(g.comisionesEnvio)}`);
ok(g.migracion.ahorroDolares > 0, `ahorraste US$${Math.round(g.migracion.ahorroDolares)} allá`);

// El canal barato importa
const comisionVentanilla = g.comisionesEnvio;
const enviadoVentanilla = g.totalEnviado;
Motor.cambiarEnvio(0.4, 'app');
g.comisionesEnvio = 0; g.totalEnviado = 0;
for (let i = 0; i < 60; i++) trabajar(Motor, 4);
const ratioApp = g.comisionesEnvio / g.totalEnviado;
const ratioVent = comisionVentanilla / enviadoVentanilla;
ok(ratioApp < ratioVent / 3,
   `mandar por app cuesta mucho menos (${(ratioApp * 100).toFixed(2)}% contra ${(ratioVent * 100).toFixed(2)}%)`);

const puntajeAntes = g.puntaje = 60;
const rg = Motor.regresar();
ok(rg.ok && rg.traido > 0, `al volver traes Q${Math.round(rg.traido)}`);
ok(g.puntaje < puntajeAntes, `el historial local se enfría al volver (${puntajeAntes} a ${Math.round(g.puntaje)})`);
ok(!Motor.estaFuera(), 'ya no estás fuera');

// ---------- minijuegos por carrera ----------
ok(Minijuegos.todos().length === 8, `hay 8 minijuegos registrados (hay ${Minijuegos.todos().length})`);
ok(Minijuegos.disponibles('bachiller', []).length === 4,
   'con bachillerato se abren los cuatro básicos');
ok(Minijuegos.disponibles('licenciatura', ['ingenieria']).some(j => j.id === 'obra'),
   'el minijuego de ingeniería se abre al graduarse de ingeniería');
ok(!Minijuegos.disponibles('licenciatura', ['ingenieria']).some(j => j.id === 'conciliacion'),
   'el de administración NO se abre con título de ingeniería');
ok(Minijuegos.disponibles('maestria', ['admin', 'maestria']).some(j => j.id === 'inversion'),
   'el de maestría se abre con la maestría');

M.imprimir('largo plazo: hipoteca, pensión, orígenes y migración');
