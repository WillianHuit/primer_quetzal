/* Prueba de la versión 2: hipoteca, pensión, orígenes y migración. */

const { cargar, Marcador, trabajar, adulto, conAzarFijo } = require('./comun');

const sb = cargar('es');
const { Motor, CONFIG, CASAS, HIPOTECA, PENSION, MIGRACION, ORIGENES, Minijuegos,
        RAMAS_DIVERSIFICADO } = sb;
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
Motor.iniciar('normal', 1, 'apoyo'); adulto(sb);
const gastoApoyo = Motor.gastoMensualVivienda();
Motor.iniciar('normal', 1, 'sosten'); adulto(sb);
const gastoSosten = Motor.gastoMensualVivienda();
ok(gastoSosten > gastoApoyo,
   `sostener a la familia cuesta más al mes (Q${gastoSosten} contra Q${gastoApoyo})`);

// Solo el origen de remesas recibe dinero de fuera
Motor.iniciar('normal', 1, 'apoyo'); adulto(sb);
let a = Motor.get(); Motor.tomarTrabajo('tienda', true);
let recibio = false;
for (let i = 0; i < 24; i++) { const m = trabajar(Motor, 3); if (m.remesa > 0) recibio = true; }
ok(!recibio, 'el origen con apoyo familiar no recibe remesas');

Motor.iniciar('normal', 1, 'remesas'); adulto(sb);
let b = Motor.get(); Motor.tomarTrabajo('tienda', true);
let recibio2 = false;
for (let i = 0; i < 24; i++) { const m = trabajar(Motor, 3); if (m.remesa > 0) recibio2 = true; }
ok(recibio2, 'el origen de remesas sí las recibe');

// ---------- hipoteca ----------
Motor.iniciar('normal', 1, 'apoyo'); adulto(sb);
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
Motor.iniciar('normal', 1, 'apoyo'); adulto(sb);
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
Motor.iniciar('normal', 1, 'sosten'); adulto(sb);
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

/* Dos ejes que no se parecen, y la prueba los mira por separado.
 *
 * Los TRABAJOS de oficio se abren con el título ya en la mano: la conciliación
 * bancaria la hace quien YA es administrador. Las CLASES se abren mientras
 * estás INSCRITO en esa carrera: la tarea de básicos se hace en básicos, no
 * después. Es la diferencia entre "ya lo aprendí" y "lo estoy aprendiendo". */
const cuantos = Minijuegos.todos().length;
ok(cuantos === 21, `hay ${cuantos} minijuegos registrados`);

/* Sin estar inscrito en nada no hay clases: las clases son del colegio. */
const sinColegio = Minijuegos.disponibles('diversificado', [], null);
ok(sinColegio.every(j => j.tipo !== 'clase'),
   'sin colegio no hay ninguna clase disponible, porque las clases son del colegio');
ok(sinColegio.length === 2,
   `y quedan los ${sinColegio.length} trabajos de oficio abiertos a todos`);

/* Básicos dura TRES AÑOS, así que sus tareas también tienen orden.
 *
 * Con la experiencia en cero salen las cuatro de aritmética y ninguna de las
 * de después: no se puede empezar pidiéndole a un chico de trece que calcule
 * el cambio de una compra con centavos. Eso no es la primera clase, es la
 * quinta. */
const CUATRO_DE_PRIMERO = ['contar', 'figuras', 'mayor', 'sumas'];
const alEmpezar = Minijuegos.disponibles('primaria', [], 'basicos', 0)
  .filter(j => j.tipo === 'clase').map(j => j.id).sort();
ok(CUATRO_DE_PRIMERO.every(id => alEmpezar.indexOf(id) >= 0),
   `al empezar básicos están las cuatro de primero: ${CUATRO_DE_PRIMERO.join(', ')}`);
ok(['cambio', 'precios', 'estafas'].every(id => alEmpezar.indexOf(id) < 0),
   'y ninguna de las que piden leer y calcular, que llegan después');

/* Y con ellas las SIETE tareas de rama, que son otra cosa.
 *
 * Están desde el primer día y a propósito: no son la materia de básicos, son
 * el sondeo. La nota que el jugador saque en cada una es la que después va a
 * poner su rama arriba o abajo cuando toque elegir diversificado, y para que
 * eso signifique algo tiene que haber probado las siete. */
const deRama = Minijuegos.todos().filter(j => j.categoria);
ok(deRama.length === RAMAS_DIVERSIFICADO.length,
   `hay una tarea de sondeo por cada una de las ${deRama.length} ramas`);
ok(RAMAS_DIVERSIFICADO.every(r => deRama.some(j => j.categoria === r)),
   'y ninguna rama se queda sin la suya: ' + RAMAS_DIVERSIFICADO.join(', '));
ok(deRama.every(j => alEmpezar.indexOf(j.id) >= 0),
   'las siete se pueden hacer desde el primer día de básicos');

/* Y fuera de básicos cada una sale SOLO en su rama: un chico de comercio no
 * hace la tarea de dibujo técnico. */
const enComercio = Minijuegos.disponibles('basicos', ['basicos'], 'comercio', 500)
  .filter(j => j.categoria).map(j => j.id);
ok(enComercio.length === 1 && Minijuegos.porId(enComercio[0]).categoria === 'comercio',
   `en comercio queda solo la tarea de su rama (${enComercio.join(', ') || 'ninguna'})`);

/* Y las cuatro se pueden REPROBAR. Es lo que las convierte en una tarea y no
 * en un botón que da puntos: si da igual cómo te salga, no estás estudiando. */
const reprobables = Minijuegos.todos().filter(j => j.tipo === 'clase');
ok(reprobables.every(j => j.fallosParaPerder === 3),
   `las ${reprobables.length} clases se reprueban al cuarto error`);

/* Y con experiencia encima se abren las de más arriba, hasta las cuatro. */
const conOficio = Minijuegos.disponibles('primaria', [], 'basicos', 200)
  .filter(j => j.tipo === 'clase').map(j => j.id).sort();
ok(conOficio.length === 14, `con experiencia encima básicos llega a sus ${conOficio.length} tareas`);
ok(conOficio.indexOf('cambio') >= 0 && conOficio.indexOf('estafas') >= 0,
   'y entre ellas las que piden leer y calcular, que son las de después');
ok(conOficio.indexOf('presupuesto') < 0,
   'la de cuadrar el sueldo sigue sin estar: esa es de diversificado');

/* Las primeras tienen que ser CORTAS. Una suma se hace de memoria o no se
 * hace, y darle un minuto la convierte en una pantalla de espera. */
const primeras = Minijuegos.todos().filter(j => CUATRO_DE_PRIMERO.indexOf(j.id) >= 0);
ok(primeras.every(j => j.duracion <= 15),
   `las primeras tareas duran ${primeras.map(j => j.duracion + 's').join(' y ')}, no un minuto`);
/* Y las de rama, que son de pensar y no de contar, tienen medio minuto: son
 * más largas que una suma y siguen sin ser una pantalla de espera. */
ok(deRama.every(j => j.duracion <= 30),
   `y las de rama no pasan de ${Math.max(...deRama.map(j => j.duracion))}s`);

/* Y en diversificado sale la especializada y desaparecen las de básicos. */
const enBachillerato = Minijuegos.disponibles('basicos', ['basicos'], 'comercio', 500)
  .filter(j => j.tipo === 'clase').map(j => j.id);
ok(enBachillerato.indexOf('presupuesto') >= 0,
   'en bachillerato aparece la tarea especializada de cuadrar el sueldo');
ok(enBachillerato.indexOf('cambio') < 0,
   'y las de básicos ya no: esa clase ya se dio');
ok(Minijuegos.disponibles('licenciatura', ['ingenieria']).some(j => j.id === 'obra'),
   'el minijuego de ingeniería se abre al graduarse de ingeniería');
ok(!Minijuegos.disponibles('licenciatura', ['ingenieria']).some(j => j.id === 'conciliacion'),
   'el de administración NO se abre con título de ingeniería');
ok(Minijuegos.disponibles('maestria', ['admin', 'maestria']).some(j => j.id === 'inversion'),
   'el de maestría se abre con la maestría');

M.imprimir('largo plazo: hipoteca, pensión, orígenes y migración');
