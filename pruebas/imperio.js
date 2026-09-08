/* Prueba del imperio: los negocios, la gente y los dos techos.
 *
 * Esta es la capa de tycoon del juego, y es la más fácil de romper sin darse
 * cuenta. Un negocio demasiado bueno convierte el juego en "ábrelo y espera";
 * un empleado demasiado barato hace que contratar sea gratis y desaparece la
 * lección; y un techo mal puesto hace que estudiar no sirva de nada.
 *
 * Lo que más importa de este archivo es la última comprobación: que **seguir
 * estudiando siga rindiendo más que dejar el colegio y montar negocios**. Si
 * eso se invierte, el juego enseña exactamente lo contrario de lo que quiere
 * enseñar, y ninguna prueba de que "no lanza errores" lo habría notado. Ya
 * pasó una vez: con la primera calibración, no estudiar llegaba al 80% del
 * patrimonio de quien estudiaba.
 */

const { cargar, Marcador, adulto, conAzarSemilla } = require('./comun');

const sb = cargar('es');
const {
  Motor, TIPOS_NEGOCIO, NIVELES_NEGOCIO, PLANILLA, TECHO_NEGOCIOS, TECHO_EMPLEADOS,
  JORNADAS_POR_EMPLEADO, RENDIMIENTO_SIN_DUENO, TRASPASO_RECUPERA,
  NIVELES_EDUCATIVOS, Iconos, TEXTOS_EN, CONFIG
} = sb;
const M = new Marcador();
const ok = M.ok.bind(M);
const Q = n => 'Q' + Math.round(n).toLocaleString('en-US');

// ---------- 1. los datos están completos ----------

ok(Array.isArray(TIPOS_NEGOCIO) && TIPOS_NEGOCIO.length >= 6,
   `hay ${TIPOS_NEGOCIO.length} tipos de negocio`);

const malos = [];
const ids = new Set();
TIPOS_NEGOCIO.forEach(function (t) {
  if (ids.has(t.id)) malos.push(t.id + ': id repetido');
  ids.add(t.id);
  if (!t.nombre) malos.push(t.id + ': sin nombre');
  if (!t.descripcion) malos.push(t.id + ': sin descripción');
  if (!t.leccion) malos.push(t.id + ': sin lección, que es para lo que existe');
  if (!Iconos.tiene(t.icono)) malos.push(t.id + ': el icono ' + t.icono + ' no existe');
  if (!(t.costoApertura > 0)) malos.push(t.id + ': sin costo de apertura');
  if (!(t.ventaPorJornada > 0)) malos.push(t.id + ': no vende nada');
  if (!(t.margen > 0 && t.margen < 1)) malos.push(t.id + ': margen fuera de 0 a 1');
  if (!(t.costoMensual >= 0)) malos.push(t.id + ': costo mensual raro');
  if (!(t.plazas >= 1)) malos.push(t.id + ': sin plazas, ni el dueño cabe');
  if (t.requiereNivel && NIVELES_EDUCATIVOS.indexOf(t.requiereNivel) < 0) {
    malos.push(t.id + ': requiereNivel desconocido ' + t.requiereNivel);
  }
});
ok(malos.length === 0,
   malos.length === 0 ? 'los tipos de negocio están completos y sus emblemas existen'
                      : malos.slice(0, 6).join(' | '));

/* Un negocio que con una sola persona adentro ya pierde dinero no lo abriría
 * nadie nunca, y si lo abre es por error. Se permite que deje POCO —la
 * distribuidora deja casi nada, y eso es su lección— pero no que hunda al
 * jugador desde el primer mes. */
const enRojo = TIPOS_NEGOCIO.filter(function (t) {
  const mes = t.ventaPorJornada * CONFIG.jornadasPorMes;
  return mes * t.margen - t.costoMensual <= 0;
}).map(t => t.id);
ok(enRojo.length === 0,
   enRojo.length === 0
     ? 'ningún negocio pierde dinero atendido por su propio dueño a tiempo completo'
     : 'negocios en rojo desde el primer mes: ' + enRojo.join(', '));

/* Los niveles suben: cada escalón vende más, cabe más gente y cuesta más.
 * Uno que no suba se ve igual en pantalla y es dinero tirado. */
const noSuben = [];
for (let i = 1; i < NIVELES_NEGOCIO.length; i++) {
  const a = NIVELES_NEGOCIO[i - 1], b = NIVELES_NEGOCIO[i];
  if (b.multiplicador <= a.multiplicador) noSuben.push(b.nombre + ': no vende más');
  if (b.plazasExtra <= a.plazasExtra) noSuben.push(b.nombre + ': no cabe más gente');
  if (b.costoRelativo <= a.costoRelativo) noSuben.push(b.nombre + ': no cuesta más');
}
ok(noSuben.length === 0,
   noSuben.length === 0 ? `los ${NIVELES_NEGOCIO.length} niveles suben en venta, plazas y costo`
                        : noSuben.join(' | '));

/* Los dos techos tienen que subir con el estudio, y no bajar nunca. Si un
 * nivel educativo aguanta menos que el anterior, estudiar castigaría. */
const techosMal = [];
for (let i = 1; i < NIVELES_EDUCATIVOS.length; i++) {
  const ant = NIVELES_EDUCATIVOS[i - 1], hoy = NIVELES_EDUCATIVOS[i];
  if (TECHO_NEGOCIOS[hoy] === undefined) techosMal.push('falta TECHO_NEGOCIOS.' + hoy);
  if (TECHO_EMPLEADOS[hoy] === undefined) techosMal.push('falta TECHO_EMPLEADOS.' + hoy);
  if (TECHO_NEGOCIOS[hoy] < TECHO_NEGOCIOS[ant]) techosMal.push(hoy + ': menos negocios que ' + ant);
  if (TECHO_EMPLEADOS[hoy] < TECHO_EMPLEADOS[ant]) techosMal.push(hoy + ': menos gente que ' + ant);
}
ok(techosMal.length === 0,
   techosMal.length === 0
     ? `los techos suben con el estudio: de ${TECHO_NEGOCIOS.primaria} negocio y ${
         TECHO_EMPLEADOS.primaria} persona con primaria a ${TECHO_NEGOCIOS.maestria} y ${
         TECHO_EMPLEADOS.maestria} con maestría`
     : techosMal.join(' | '));

// ---------- 2. el empleado formal NO cuesta su sueldo ----------

/* La lección más útil de todo el juego para quien algún día tenga un negocio.
 * Si esto se rompe, el juego enseña que contratar formal cuesta el sueldo, que
 * es la creencia que quiebra negocios. */
const costoInf = Motor.costoDeEmpleado('informal');
const costoFor = Motor.costoDeEmpleado('formal');
ok(costoInf === PLANILLA.informal.sueldo,
   `sin contrato cuesta exactamente el sueldo (${Q(costoInf)})`);
ok(costoFor > PLANILLA.formal.sueldo * 1.35,
   `con contrato cuesta ${Q(costoFor)} para un sueldo de ${
     Q(PLANILLA.formal.sueldo)}: un ${
     Math.round((costoFor / PLANILLA.formal.sueldo - 1) * 100)}% más`);
ok(PLANILLA.informal.riesgoSeVa > PLANILLA.formal.riesgoSeVa,
   'y sin contrato la gente se va más seguido, que es el otro lado del trato');
ok(PLANILLA.informal.riesgoInspeccion > 0 && !PLANILLA.formal.riesgoInspeccion,
   'la inspección solo cae sobre quien tiene gente sin contrato');

// ---------- 3. están traducidos ----------

const faltan = [];
TIPOS_NEGOCIO.forEach(function (t) {
  if (!TEXTOS_EN.datos[t.id] || !TEXTOS_EN.datos[t.id].nombre) faltan.push(t.id + '.nombre');
  if (!TEXTOS_EN.datos[t.id] || !TEXTOS_EN.datos[t.id].descripcion) faltan.push(t.id + '.descripcion');
  if (!TEXTOS_EN.negocio_leccion || !TEXTOS_EN.negocio_leccion[t.id]) faltan.push(t.id + '.leccion');
});
NIVELES_NEGOCIO.forEach(function (n) {
  if (!TEXTOS_EN.nivel_negocio || !TEXTOS_EN.nivel_negocio[n.nombre]) faltan.push('nivel.' + n.nombre);
});
Object.keys(PLANILLA).forEach(function (k) {
  if (!TEXTOS_EN.planilla_nombre || !TEXTOS_EN.planilla_nombre[k]) faltan.push('planilla.' + k);
  if (!TEXTOS_EN.planilla_nota || !TEXTOS_EN.planilla_nota[k]) faltan.push('nota.' + k);
});
ok(faltan.length === 0,
   faltan.length === 0 ? `los ${TIPOS_NEGOCIO.length} negocios están traducidos al inglés`
                       : 'faltan traducciones: ' + faltan.slice(0, 8).join(', '));

// ---------- 4. abrir un negocio ----------

Motor.iniciar('normal', 1, 'apoyo');
const e = Motor.get();

ok(Motor.negociosAbiertos().length === 0, 'una partida nueva no tiene ningún negocio');
ok(Motor.techoNegocios() === TECHO_NEGOCIOS.primaria,
   `y saliendo de primaria solo puede llevar ${Motor.techoNegocios()}`);

e.efectivo = 100;
const sinPlata = Motor.faltaParaAbrir('dulces');
ok(sinPlata && sinPlata.motivo === 'dinero', 'sin dinero no se abre: ' + sinPlata.razon);

const porEdad = Motor.faltaParaAbrir('lavado');
ok(porEdad && porEdad.motivo === 'edad',
   'el lavado de carros pide edad: ' + porEdad.razon);

/* La edad se comprueba antes que el estudio, así que para ver el motivo del
 * nivel hay que darle la edad primero. Que la papelería a los 13 diga "hasta
 * los 16" y no "necesitas básicos" es correcto: es lo primero que le falta. */
e.edad = 16;
const porNivel = Motor.faltaParaAbrir('papeleria');
ok(porNivel && porNivel.motivo === 'nivel',
   'y con la edad cumplida, la papelería pide básicos terminados: ' + porNivel.razon);
e.edad = 13;

e.efectivo = 3000;
const antes = e.efectivo;
const abre = Motor.abrirNegocio('dulces');
const tDulces = Motor.tipoDeNegocio('dulces');
ok(abre.ok, 'con dinero y edad se abre el puesto de dulces');
ok(Math.abs((antes - tDulces.costoApertura) - e.efectivo) < 0.01,
   `y se paga de verdad (${Q(antes)} a ${Q(e.efectivo)})`);
ok(Motor.negociosAbiertos().length === 1, 'queda uno abierto');
ok(Motor.negocioDe('dulces').nivel === 1, 'en el nivel uno');

const otraVez = Motor.faltaParaAbrir('dulces');
ok(otraVez && otraVez.motivo === 'repetido', 'no se abren dos del mismo tipo');

/* El techo, que es donde el colegio se convierte en tamaño de empresa.
 *
 * Saliendo de primaria caben DOS negocios, y ese dos no es un adorno: con uno
 * solo, el chico que a los trece abre un puesto de dulces de Q450 se queda
 * atrapado en el puesto de dulces para siempre. Medido, ese jugador terminaba
 * más pobre que uno que no abrió nada. */
e.efectivo = 6000;
ok(Motor.abrirNegocio('refrescos').ok, 'saliendo de primaria caben dos negocios');
e.edad = 16;
e.efectivo = 60000;
const porTecho = Motor.faltaParaAbrir('lavado');
ok(porTecho && porTecho.motivo === 'techo',
   'pero no un tercero: ' + porTecho.razon);

e.educacion = 'basicos';
ok(!Motor.faltaParaAbrir('lavado'),
   'terminar básicos abre el tercero, sin tocar nada más');

/* Y el orden de los motivos importa: con los dos espacios llenos, un negocio
 * que ADEMÁS le queda grande por estudios tiene que decir eso, no "ya vas
 * lleno", que sería mentira. */
e.edad = 20;
const grande = Motor.faltaParaAbrir('taller');
ok(grande && grande.motivo === 'nivel',
   'lo que le queda grande por estudios lo dice así y no como techo: ' + grande.razon);
e.edad = 16;

// ---------- 5. lo que produce, y por qué ----------

/* Las jornadas del dueño son las que hacen producir al negocio, y por eso
 * viven en la misma rejilla de ocho casillas que el trabajo y el estudio:
 * atender tu negocio es tiempo que no estás trabajando para otro. */
ok(Motor.asignarEspacio(0, 'negocio:dulces'), 'una jornada se le puede poner al negocio');
ok(Motor.jornadasDelDueno('dulces') === 1, 'y el negocio la cuenta');
ok(Motor.espaciosUsados('negocio') === 1,
   'espaciosUsados("negocio") cuenta las de cualquier negocio');
ok(Motor.espaciosUsados('negocio:refrescos') === 0, 'y con dos puntos cuenta solo las de ese');

const neg = Motor.negocioDe('dulces');
const pr1 = Motor.proyeccionDeNegocio(neg, 1);
ok(Math.abs(pr1.venta - tDulces.ventaPorJornada) < 1,
   `una jornada vende ${Q(pr1.venta)}`);
ok(Math.abs(pr1.margen - pr1.venta * tDulces.margen) < 1,
   `y de eso le queda ${Q(pr1.margen)}: el margen es el ${
     Math.round(tDulces.margen * 100)}%`);
ok(pr1.venta > pr1.margen,
   'lo que vende y lo que gana son cifras distintas, que es la lección entera');

const pr8 = Motor.proyeccionDeNegocio(neg, 8);
ok(Math.abs(pr8.venta - pr1.venta * 8) < 1, 'ocho jornadas venden ocho veces');

/* Y el dueño que no aparece pierde plata, pero no todo: delegar sí funciona. */
const pr0 = Motor.proyeccionDeNegocio(neg, 0);
ok(pr0.jornadas === 0 && pr0.venta === 0, 'sin nadie adentro no vende nada');

// ---------- 6. contratar y despedir ----------

(function laGente() {
  const sbG = cargar('es');
  const MG = sbG.Motor;
  MG.iniciar('normal', 2, 'apoyo');
  const z = adulto(sbG, { efectivo: 90000 });
  z.educacion = 'diversificado';

  /* En el puesto de dulces solo cabe una persona, y esa es el dueño. Es la
   * forma honesta de decir que ese negocio no crece. */
  MG.abrirNegocio('dulces');
  const sinSitio = MG.faltaParaContratar('dulces', 'informal');
  ok(sinSitio && sinSitio.motivo === 'plazas',
     'en el puesto de dulces no cabe nadie más: ' + sinSitio.razon);

  MG.abrirNegocio('lavado');
  ok(!MG.faltaParaContratar('lavado', 'informal'),
     'en el lavado de carros sí, que tiene tres plazas');

  const negL = MG.negocioDe('lavado');
  ok(MG.contratar('lavado', 'informal').ok, 'se contrata a alguien sin contrato');
  ok(negL.empleados.length === 1, 'y queda apuntado en la planilla');
  ok(MG.planillaDe(negL) === MG.costoDeEmpleado('informal'),
     `la planilla del negocio es ${Q(MG.planillaDe(negL))}`);

  /* Cada persona contratada aporta un mes completo de jornadas: se contrata a
   * tiempo completo o no se contrata. */
  const conUno = MG.proyeccionDeNegocio(negL, 0);
  ok(conUno.jornadas === JORNADAS_POR_EMPLEADO,
     `la persona contratada aporta ${JORNADAS_POR_EMPLEADO} jornadas`);
  ok(conUno.sinDueno, 'y si el dueño no aparece, el negocio lo sabe');
  const conDueno = MG.proyeccionDeNegocio(negL, 1);
  ok(conDueno.venta > conUno.venta / RENDIMIENTO_SIN_DUENO * 0.99,
     `sin el dueño rinde el ${Math.round(RENDIMIENTO_SIN_DUENO * 100)}%: ${
       Q(conUno.venta)} contra ${Q(conDueno.venta)} con una jornada suya`);

  // El techo de gente: diversificado aguanta seis
  ok(MG.techoEmpleados() === TECHO_EMPLEADOS.diversificado,
     `con diversificado puede administrar ${MG.techoEmpleados()}`);
  z.educacion = 'primaria';
  const porTechoG = MG.faltaParaContratar('lavado', 'informal');
  ok(porTechoG && porTechoG.motivo === 'techo',
     'y con primaria ya no puede con la segunda persona: ' + porTechoG.razon);
  z.educacion = 'diversificado';

  // Despedir: al informal gratis, al formal hay que indemnizarlo
  ok(MG.indemnizacionDe({ tipo: 'informal', meses: 40 }) === 0,
     'despedir a alguien sin contrato no cuesta nada');
  const indem = MG.indemnizacionDe({ tipo: 'formal', meses: 36 });
  ok(indem === PLANILLA.formal.sueldo * 3,
     `y al formal se le paga un sueldo por año: ${Q(indem)} por tres años`);

  MG.contratar('lavado', 'formal');
  negL.empleados[1].meses = 24;
  const antesD = MG.dineroDisponible();
  const desp = MG.despedir('lavado', 1);
  ok(desp.ok && desp.indemnizacion === PLANILLA.formal.sueldo * 2,
     `despedir al formal costó ${Q(desp.indemnizacion)}`);
  ok(antesD - MG.dineroDisponible() >= desp.indemnizacion - 1,
     'y se pagó de verdad');

  // Subir el nivel: cuesta un múltiplo de la apertura y agrega plazas
  const plazasAntes = MG.plazasDe(negL);
  const costoSubir = MG.costoDeSubirNivel('lavado');
  const tL = MG.tipoDeNegocio('lavado');
  ok(Math.abs(costoSubir - tL.costoApertura * NIVELES_NEGOCIO[1].costoRelativo) < 1,
     `subir el lavado al nivel dos cuesta ${Q(costoSubir)}`);
  ok(MG.subirNivelNegocio('lavado').ok, 'y se puede subir');
  ok(negL.nivel === 2, 'el nivel subió a dos');
  ok(MG.plazasDe(negL) === plazasAntes + NIVELES_NEGOCIO[1].plazasExtra,
     `y ahora caben ${MG.plazasDe(negL)} en vez de ${plazasAntes}`);

  // Traspasarlo devuelve la mitad de lo invertido, no todo
  const puesto = MG.invertidoEn(negL);
  ok(Math.abs(puesto - (tL.costoApertura + costoSubir)) < 1,
     `lleva ${Q(puesto)} invertidos entre apertura y niveles`);
  MG.asignarEspacio(3, 'negocio:lavado');
  const rt = MG.cerrarNegocio('lavado');
  ok(rt.ok, 'se puede traspasar');
  ok(rt.recupera < puesto,
     `y recupera ${Q(rt.recupera)} de ${Q(puesto)}: lo que ya pusiste no vuelve completo`);
  ok(MG.get().espacios[3] === '', 'traspasarlo le suelta las jornadas que tenía puestas');
  ok(!MG.negocioDe('lavado'), 'y desaparece de la lista');
})();

// ---------- 7. el mes cobra la planilla y la renta ----------

(function elMesCobra() {
  const sbC = cargar('es');
  const MC = sbC.Motor;
  MC.iniciar('normal', 3, 'apoyo');
  const z = adulto(sbC, { efectivo: 120000 });
  z.educacion = 'diversificado';
  MC.abrirNegocio('lavado');
  MC.contratar('lavado', 'formal');
  const tL = MC.tipoDeNegocio('lavado');

  const m = conAzarSemilla(sbC, 4242, function () {
    for (let i = 0; i < 8; i++) MC.asignarEspacio(i, i < 4 ? 'negocio:lavado' : 'descanso');
    return MC.cerrarTurno();
  });

  ok(m.negocioVenta > 0, `el negocio vendió ${Q(m.negocioVenta)}`);
  ok(m.negocio > 0 && m.negocio < m.negocioVenta,
     `y de eso le quedaron ${Q(m.negocio)} después del producto`);
  ok(m.planilla === MC.costoDeEmpleado('formal'),
     `la planilla se cobró aparte y se ve: ${Q(m.planilla)}`);
  ok(m.mantenimiento >= tL.costoMensual,
     `y la renta y la luz también: ${Q(m.mantenimiento)}`);

  /* Que los tres renglones estén separados no es un capricho de contabilidad:
   * es lo que deja al jugador ver EN QUÉ se le fue, en vez de recibir un neto
   * ya digerido. */
  ok(Math.abs(MC.imperio().planilla - MC.costoDeEmpleado('formal')) < 1,
     'el resumen del imperio cuenta la misma planilla');
})();

// ---------- 8. un negocio puede quebrar, y el colchón lo evita ----------

(function laQuiebra() {
  const sbQ = cargar('es');
  const MQ = sbQ.Motor;
  MQ.iniciar('normal', 4, 'apoyo');
  const z = adulto(sbQ, { efectivo: 60000 });
  z.educacion = 'diversificado';
  MQ.abrirNegocio('tortilleria');
  const negT = MQ.negocioDe('tortilleria');
  negT.nivel = 3;

  const caida = MQ.quebrarNegocio(negT);
  ok(!caida.cerro && negT.nivel === 2,
     'quebrar con niveles encima solo tumba uno');

  negT.nivel = 1;
  MQ.asignarEspacio(0, 'negocio:tortilleria');
  const cierre = MQ.quebrarNegocio(negT);
  ok(cierre.cerro && !MQ.negocioDe('tortilleria'),
     'y quebrar en el primer nivel lo cierra, sin recuperar nada');
  ok(MQ.get().espacios[0] === '', 'y le suelta las jornadas');
})();

// ---------- 9. la escalera educativa sigue siendo la buena ----------

/* La comprobación que sostiene todo el juego.
 *
 * El riesgo de meter una capa de tycoon en un juego sobre educación financiera
 * es obvio: si montar negocios rinde más que estudiar, el juego enseña que el
 * colegio es una pérdida de tiempo. Aquí se corren las dos vidas completas
 * sobre las mismas semillas y se compara la mediana.
 *
 * Se permite que el imperio sin estudios quede CERCA —tiene que valer la pena,
 * si no nadie lo toca— pero no que gane.
 */
function mediana(xs) {
  const s2 = xs.slice().sort((a, b) => a - b);
  return s2[Math.floor(s2.length / 2)];
}

function cuentas(MV, z) {
  if (z.monetaria === null && z.efectivo >= MV.aperturaMinima('monetaria')) {
    MV.abrirCuenta('monetaria', MV.aperturaMinima('monetaria'));
  } else if (z.ahorro === null && z.efectivo >= MV.aperturaMinima('ahorro')) {
    MV.abrirCuenta('ahorro', MV.aperturaMinima('ahorro'));
  } else if (z.ahorro !== null && z.monetaria !== null && z.monetaria > 2500) {
    MV.mover('monetaria', 'ahorro', z.monetaria - 2000);
  }
}

function mejorEmpleo(MV, z, sbV, formal) {
  let mejor = null, paga = 0;
  for (const t of sbV.TRABAJOS) {
    if (!MV.puedeAplicar(t).ok) continue;
    const q = MV.salarioEsperado(t, formal);
    if (!mejor || q > paga) { mejor = t; paga = q; }
  }
  if (mejor && (!z.empleo || z.empleo.id !== mejor.id)) MV.tomarTrabajo(mejor.id, formal);
}

/* Construye el imperio como lo haría alguien prudente.
 *
 * Que la estrategia de la prueba sea la prudente es a propósito: si el imperio
 * jugado BIEN no le gana a la escuela, jugado mal tampoco.
 *
 * La primera versión de esta función era la ingenua —abre el negocio más caro
 * que puedas pagar— y las dos vidas terminaron con patrimonio NEGATIVO, la
 * estudiada peor que la otra. No era un fallo del motor: era exactamente lo
 * que el motor tiene que castigar. Abrir una distribuidora de Q250,000 y
 * atenderla tú solo son Q8,000 de renta al mes contra Q1,144 de margen, y eso
 * desangra al jugador hasta que quiebra. El orden de abajo es el que evita
 * eso, y es el orden que un dueño de verdad sigue.
 */
function plazasLibres(MV, neg) {
  // Una plaza es del dueño: solo las demás se contratan
  return MV.plazasDe(neg) - 1 - neg.empleados.length;
}

/* Lo que deja al mes una persona trabajando a tiempo completo en un negocio,
 * ya descontado el producto que vende. Es el número contra el que hay que
 * comparar el costo de contratarla, y no hay otro. */
function dejaUnaPersona(MV, t, multiplicador) {
  return CONFIG.jornadasPorMes * t.ventaPorJornada * (multiplicador || 1) * t.margen;
}

/* Qué contrato aguanta este negocio, o null si no aguanta ninguno.
 *
 * Esta función es la que faltaba, y su ausencia costó las tres primeras
 * medidas de esta prueba: la estrategia contrataba formal en todo, y en un
 * lavado de carros una persona produce Q3,360 y cuesta Q5,248. Contratarla es
 * perder Q1,888 cada mes, durante cuarenta años, en seis negocios a la vez.
 * Con eso, la vida estudiada terminaba con MENOS patrimonio que la otra.
 *
 * Que la respuesta correcta para los negocios chicos sea "sin contrato" no es
 * un atajo de la prueba: es la razón por la que el 65% del país trabaja así, y
 * el juego lo modela con sus dos riesgos —la rotación y la inspección— en vez
 * de esconderlo.
 */
function contratoQueAguanta(MV, neg) {
  const t = MV.tipoDeNegocio(neg.tipoId);
  const deja = dejaUnaPersona(MV, t, MV.nivelDeNegocio(neg).multiplicador);
  // Se exige un 20% de holgura: contratar para empatar no es un negocio
  if (deja > MV.costoDeEmpleado('formal') * 1.2) return 'formal';
  if (deja > MV.costoDeEmpleado('informal') * 1.2) return 'informal';
  return null;
}

/* Lo que dejaría un negocio al mes si estuviera bien llevado: con la gente que
 * el jugador puede administrar y el contrato que ese negocio aguante.
 *
 * Es la cuenta con la que se elige cuál abrir, y la misma que la pantalla le
 * enseña al jugador. `gente`, `mult` y `plazas` se pasan a mano para poder
 * medir con la MISMA regla un negocio que ya tiene (con su nivel y sus plazas
 * de hoy) y uno que todavía no ha abierto.
 */
function netoEsperado(MV, t, gente, mult, plazas) {
  const deja = dejaUnaPersona(MV, t, mult || 1);
  const cf = MV.costoDeEmpleado('formal'), ci = MV.costoDeEmpleado('informal');
  const costo = deja > cf * 1.2 ? cf : (deja > ci * 1.2 ? ci : null);
  const sitios = (plazas || t.plazas) - 1;
  const n = costo === null ? 0 : Math.min(sitios, Math.max(0, gente));
  return deja * (1 + n) - t.costoMensual - (costo || 0) * n;
}

/* Cuánta gente le queda por administrar. */
function genteLibre(MV) {
  return Math.max(0, MV.techoEmpleados() - MV.empleadosTotales());
}

/* Lo que deja hoy un negocio que ya tiene, medido con la misma regla.
 *
 * Aquí estaba el error que costó más caro de esta prueba. Antes se usaba
 * `proyeccionDeNegocio(neg).neto`, y esa función mide las jornadas que el
 * jugador le tiene PUESTAS. Pero construyeImperio corre ANTES de repartir las
 * jornadas del mes, y cerrarTurno las deja limpias, así que todos los negocios
 * salían con cero jornadas y neto NEGATIVO. Con eso, "cambia el peor por algo
 * que deje el doble" se cumplía siempre, y la estrategia traspasaba su mejor
 * negocio cada turno. Traspasar devuelve la mitad, así que la vida terminó
 * tirando Q1.1 millones en pura rotación, y la medida decía que el imperio
 * empobrecía al jugador. No era el motor: era esta comparación.
 */
function netoDeHoy(MV, neg, gente) {
  const t = MV.tipoDeNegocio(neg.tipoId);
  return netoEsperado(MV, t, gente, MV.nivelDeNegocio(neg).multiplicador, MV.plazasDe(neg));
}

function construyeImperio(MV, sbV) {
  const negs = MV.negociosAbiertos();

  /* 1. Primero llenar lo que ya tiene, y solo con el contrato que aguante.
   *    Un negocio con plazas vacías paga la renta completa por un espacio que
   *    nadie usa; pero uno con gente que cuesta más de lo que produce es peor
   *    todavía. */
  negs.forEach(function (neg) {
    const contrato = contratoQueAguanta(MV, neg);
    if (!contrato) return;
    while (plazasLibres(MV, neg) > 0) {
      const costo = MV.costoDeEmpleado(contrato);
      if (MV.faltaParaContratar(neg.tipoId, contrato)) break;
      if (MV.dineroDisponible() < costo * 6) break;   // seis meses de colchón
      if (!MV.contratar(neg.tipoId, contrato).ok) break;
    }
  });

  /* Se considera "lleno" cuando ya no queda nada que hacer contratando: o
   * porque no cabe nadie, o porque en ese negocio una persona más costaría
   * más de lo que produce, o porque ya no puede administrar a nadie más.
   *
   * La tercera condición faltaba y costaba caro: un puesto de dulces subido a
   * nivel dos tiene una plaza libre que NO conviene llenar (una persona ahí
   * produce Q560 y la más barata cuesta Q1,980), así que el jugador se
   * quedaba esperando para siempre a poder llenarla y nunca abría un segundo
   * negocio. */
  const topeGente = MV.empleadosTotales() >= MV.techoEmpleados();
  const llenos = topeGente ||
    negs.every(n => plazasLibres(MV, n) <= 0 || !contratoQueAguanta(MV, n));

  // 2. Con todo lleno, subirle el nivel: más venta y más plazas.
  if (llenos) {
    negs.forEach(function (neg) {
      const subir = MV.costoDeSubirNivel(neg.tipoId);
      if (subir && !MV.faltaParaSubirNivel(neg.tipoId) &&
          MV.dineroDisponible() > subir * 2) MV.subirNivelNegocio(neg.tipoId);
    });
  }

  /* 3. Y solo entonces abrir otro, eligiendo el que MÁS DEJE con la gente que
   *    hoy puede administrar. Ojo: no el más caro. Elegir el más caro fue el
   *    otro error de la primera versión, porque el más caro del catálogo es
   *    una distribuidora, y una distribuidora atendida por su dueño solo son
   *    Q8,000 de renta contra Q1,144 de margen. */
  if (!llenos) return;
  const libres = genteLibre(MV);
  const abribles = sbV.TIPOS_NEGOCIO.filter(function (t) {
    if (MV.faltaParaAbrir(t.id)) return false;
    // El doble del costo: lo que sobra es el colchón que lo protege de quebrar
    return MV.dineroDisponible() > t.costoApertura * 2;
  }).sort((a, b) => netoEsperado(MV, b, libres) - netoEsperado(MV, a, libres));
  if (abribles.length && netoEsperado(MV, abribles[0], libres) > 0) {
    return void MV.abrirNegocio(abribles[0].id);
  }

  /* 4. Y si ya no le caben más pero hay uno bastante mejor al alcance,
   *    traspasar el peor y cambiarlo.
   *
   *    Es lo que haría un dueño de verdad, y es la única salida del jugador
   *    que a los trece abrió un puesto de dulces y a los veinte ya podría con
   *    una tortillería. Se exige que el nuevo deje MÁS DEL DOBLE, porque
   *    traspasar cuesta la mitad de lo invertido y cambiar por poco es perder. */
  const peor = negs.slice().sort(function (a, b) {
    return netoDeHoy(MV, a, libres) - netoDeHoy(MV, b, libres);
  })[0];
  if (!peor) return;

  /* Al traspasar se libera también la gente que trabajaba ahí, así que el
   * candidato se mide con esa gente disponible. */
  const conLoLiberado = libres + peor.empleados.length;
  const mejores = sbV.TIPOS_NEGOCIO.filter(function (t) {
    const f = MV.faltaParaAbrir(t.id);
    return f && f.motivo === 'techo' && netoEsperado(MV, t, conLoLiberado) > 0;
  }).sort((a, b) => netoEsperado(MV, b, conLoLiberado) - netoEsperado(MV, a, conLoLiberado));
  if (!mejores.length) return;

  const gana = netoEsperado(MV, mejores[0], conLoLiberado);
  const hoy = netoDeHoy(MV, peor, conLoLiberado);
  const caja = MV.dineroDisponible() + MV.valorDeTraspaso(peor.tipoId);
  if (gana > hoy * 2 && caja > mejores[0].costoApertura * 2) {
    MV.cerrarNegocio(peor.tipoId);
    MV.abrirNegocio(mejores[0].id);
  }
}

/* Reparte las ocho jornadas del mes, por orden de prioridad:
 *
 *   1. dos al estudio, si lleva una carrera de horario libre. La universidad
 *      no bloquea jornadas, así que si no se le asignan a mano NO AVANZA; y
 *      un jugador que no avanza en la carrera se queda estancado para
 *      siempre, con lo que la vida "estudiada" mediría lo mismo que la otra.
 *   2. una a cada negocio, para que no le caiga el castigo del dueño ausente
 *   3. lo que sobre, al negocio donde una jornada suya deje más quetzales que
 *      una del empleo, mientras ahí todavía quepa
 *   4. el resto al empleo
 *   5. y dos de descanso si viene cansado
 *
 * El descanso va al final y solo cuando hace falta, igual que en las otras
 * suites de vidas completas: reservarlo siempre le quitaba al jugador la mitad
 * de sus jornadas de colegio y la comparacion medía la enfermedad en vez de la
 * estrategia.
 */
function reparte(MV, z, pagaPorJornada) {
  const libres = [];
  for (let i = 0; i < CONFIG.jornadasPorMes; i++) if (!MV.espacioBloqueado(i)) libres.push(i);
  const descanso = z.energia < 70 ? 2 : 0;
  const tope = Math.max(0, libres.length - descanso);
  let k = 0;

  if (z.estudio && !z.estudio.jornada) {
    const aEstudio = Math.ceil(libres.length / 2);
    for (let n = 0; n < aEstudio && k < tope; n++) MV.asignarEspacio(libres[k++], 'estudio');
  }

  const negs = MV.negociosAbiertos();
  negs.forEach(function (neg) {
    if (k < tope) MV.asignarEspacio(libres[k++], 'negocio:' + neg.tipoId);
  });

  const cupo = negs.map(function (neg) {
    const t = MV.tipoDeNegocio(neg.tipoId);
    const pr = MV.proyeccionDeNegocio(neg);
    return {
      id: neg.tipoId,
      deja: t.ventaPorJornada * MV.nivelDeNegocio(neg).multiplicador * t.margen,
      hueco: MV.plazasDe(neg) * CONFIG.jornadasPorMes - pr.jornadas
    };
  }).filter(c => c.hueco > 0 && c.deja > (pagaPorJornada || 0))
    .sort((a, b) => b.deja - a.deja);

  cupo.forEach(function (c) {
    for (let n = 0; n < c.hueco && k < tope; n++) {
      MV.asignarEspacio(libres[k++], 'negocio:' + c.id);
    }
  });

  while (k < tope) MV.asignarEspacio(libres[k++], 'trabajo');
  while (k < libres.length) MV.asignarEspacio(libres[k++], 'descanso');
}

/* Lo que le deja al jugador una jornada de su empleo. Es con lo que se compara
 * una jornada metida en su propio negocio, que es la decisión de verdad. */
function pagaDeUnaJornada(MV, z, sbV) {
  const t = MV.trabajoActual();
  if (!t) return 0;
  return MV.salarioEsperado(t, z.empleo && z.empleo.formal) / CONFIG.jornadasPorMes +
         MV.bonoPorJornada();
}

/* Con TRAZA=1 en el entorno, cada vida imprime de donde salio su dinero.
 * No es adorno: fue lo unico que dejo ver que el imperio estaba RESTANDO
 * patrimonio en vez de sumarlo, y por que. */
const TRAZA = !!process.env.TRAZA;

function vida(sbV, estrategia, semilla, nombre) {
  const MV = sbV.Motor;
  return conAzarSemilla(sbV, semilla, function () {
    MV.iniciar('normal', 8, 'apoyo');
    const z = MV.get();
    const t = { salario: 0, bruto: 0, planilla: 0, renta: 0, quiebras: 0, jorNeg: 0, jorTrab: 0,
                vivienda: 0, colegiatura: 0, enfermedad: 0, imprevistos: 0, fuga: 0,
                manejo: 0, intereses: 0, mesada: 0, remesa: 0, extras: 0 };
    let vueltas = 0;
    while (!z.jubilado && vueltas < 700) {
      vueltas++;
      estrategia(MV, z, sbV);
      if (TRAZA) {
        t.jorNeg += MV.espaciosUsados('negocio');
        t.jorTrab += MV.espaciosUsados('trabajo');
      }
      const m = MV.cerrarTurno();
      if (TRAZA) {
        t.salario += (m.salario || 0) + (m.bono || 0);
        t.bruto += m.negocio || 0;
        t.planilla += m.planilla || 0;
        t.renta += m.mantenimiento || 0;
        if (m.quebro) t.quiebras++;
        ['vivienda','colegiatura','enfermedad','imprevistos','fuga','manejo',
         'intereses','mesada','remesa','extras'].forEach(k => { t[k] += m[k] || 0; });
        // Y TODO lo demas, para poder cuadrar la caja sin dejar nada fuera
        t.todo = t.todo || {};
        Object.keys(m).forEach(function (k) {
          if (typeof m[k] === 'number') t.todo[k] = (t.todo[k] || 0) + m[k];
        });
      }
      MV.get().bitacora.slice(-1).forEach(function (m2) {
        (m2.decisiones || []).forEach(d => MV.aplicarDecision(d.clase, d.ref, 1));
      });
    }
    if (TRAZA && semilla === 3000) {
      console.log(`
[${nombre}] sueldo=${Q(t.salario)} brutoNeg=${Q(t.bruto)}` +
        ` planilla=${Q(t.planilla)} renta=${Q(t.renta)}` +
        ` netoNeg=${Q(t.bruto - t.planilla - t.renta)}` +
        ` | jornadas neg=${t.jorNeg} trab=${t.jorTrab} quiebras=${t.quiebras}` +
        ` | negocios=${MV.negociosAbiertos().map(n => n.tipoId + ':' + n.nivel + '/' + n.empleados.length).join(',') || '-'}` +
        ` educ=${z.educacion}`);
      console.log(`   gastos: viv=${Q(t.vivienda)} coleg=${Q(t.colegiatura)}` +
        ` enf=${Q(t.enfermedad)} imprev=${Q(t.imprevistos)} fuga=${Q(t.fuga)}` +
        ` manejo=${Q(t.manejo)} | entradas extra: int=${Q(t.intereses)}` +
        ` mesada=${Q(t.mesada)} remesa=${Q(t.remesa)} extras=${Q(t.extras)}` +
        ` | deuda final=${Q(MV.get().deudaHogar)} patr=${Q(MV.patrimonio())}`);
      console.log('   todo: ' + Object.keys(t.todo).filter(k => Math.abs(t.todo[k]) > 500)
        .sort((a2, b2) => Math.abs(t.todo[b2]) - Math.abs(t.todo[a2]))
        .map(k => k + '=' + Q(t.todo[k])).join(' '));
    }
    return MV.reporte().patrimonio;
  });
}

/* A: deja el colegio y se dedica a montar negocios. */
function imperioSinEstudiar(MV, z, sbV) {
  if (z.decisionEstudio === null) MV.decidirEstudio('no');
  mejorEmpleo(MV, z, sbV, z.edad >= sbV.CONFIG.mayoriaDeEdad);
  cuentas(MV, z);
  construyeImperio(MV, sbV);
  sbV.CADENAS.forEach(function (c) {
    const sig = MV.siguienteMejora(c.id);
    if (sig && !MV.faltaParaMejora(sig.id)) MV.comprarMejora(sig.id);
  });
  reparte(MV, z, pagaDeUnaJornada(MV, z, sbV));
}

/* B: sube la escalera completa y también monta negocios. */
function escaleraConImperio(MV, z, sbV) {
  if (!z.estudio) {
    if (z.educacion === 'primaria') MV.inscribirse('basicos', false);
    else if (z.educacion === 'basicos') MV.inscribirse('bachillerato', false, 'am');
    else if (z.educacion === 'diversificado') MV.inscribirse('ingenieria', false);
    else if (z.educacion === 'licenciatura' && z.edad < 40) MV.inscribirse('maestria', false);
  }
  mejorEmpleo(MV, z, sbV, z.edad >= sbV.CONFIG.mayoriaDeEdad);
  cuentas(MV, z);
  construyeImperio(MV, sbV);
  sbV.CADENAS.forEach(function (c) {
    const sig = MV.siguienteMejora(c.id);
    if (sig && !MV.faltaParaMejora(sig.id)) MV.comprarMejora(sig.id);
  });
  reparte(MV, z, pagaDeUnaJornada(MV, z, sbV));
}

/* C: ni estudia ni monta nada. Solo un empleo, toda la vida. Es la vida
 * contra la que hay que medir si el imperio sirve para algo. */
function niEstudiaNiMonta(MV, z, sbV) {
  if (z.decisionEstudio === null) MV.decidirEstudio('no');
  mejorEmpleo(MV, z, sbV, z.edad >= sbV.CONFIG.mayoriaDeEdad);
  cuentas(MV, z);
  sbV.CADENAS.forEach(function (c) {
    const sig = MV.siguienteMejora(c.id);
    if (sig && !MV.faltaParaMejora(sig.id)) MV.comprarMejora(sig.id);
  });
  reparte(MV, z, pagaDeUnaJornada(MV, z, sbV));
}

const SEMILLAS = Array.from({ length: 11 }, (_, i) => 3000 + i * 7919);
const soloEmpleo = SEMILLAS.map(s => vida(cargar('es'), niEstudiaNiMonta, s, 'solo empleo'));
const soloImperio = SEMILLAS.map(s => vida(cargar('es'), imperioSinEstudiar, s, 'imperio sin escuela'));
const conEscalera = SEMILLAS.map(s => vida(cargar('es'), escaleraConImperio, s, 'escalera + imperio'));

const medEmpleo = mediana(soloEmpleo);
const medImperio = mediana(soloImperio);
const medEscalera = mediana(conEscalera);

console.log('\n--- mediana de 11 vidas completas, de los 13 a los 65 ---');
console.log(`  sin estudiar y sin negocios   ${Q(medEmpleo)}`);
console.log(`  sin estudiar, con negocios    ${Q(medImperio)}`);
console.log(`  escalera completa y negocios  ${Q(medEscalera)}`);

/* 1. La que sostiene todo el juego. */
ok(medEscalera > medImperio,
   `estudiar rinde más que montar negocios sin estudiar (${
     Q(medEscalera)} contra ${Q(medImperio)})`);

/* 2. Y el imperio tiene que valer la pena, o nadie lo va a tocar.
 *
 * Ojo con cómo se mide esto. Antes se comparaba contra la ruta larga y se
 * exigía un 15%, pero ese umbral estaba calibrado contra una escalera que en
 * realidad NO AVANZABA: la prueba vieja nunca le asignaba jornadas de estudio
 * a una carrera de horario libre, así que el jugador "estudiado" se quedaba en
 * diversificado para siempre y terminaba con Q3M en vez de Q10M. Arreglado
 * eso, exigirle al dueño de un lavado de carros el 15% del patrimonio de un
 * ingeniero con maestría y cinco negocios no mide nada.
 *
 * Lo que sí mide algo es esto: para quien no estudió, ¿montar negocios le
 * cambia la vida o no? */
ok(medImperio > medEmpleo * 1.5,
   `y para quien no estudió, montar negocios le multiplica el patrimonio por ${
     (medImperio / Math.max(1, medEmpleo)).toFixed(1)} (${
     Q(medEmpleo)} a ${Q(medImperio)})`);

/* 3. Y ninguna de las tres puede terminar en rojo: un juego donde la vida
 *    prudente acaba en números negativos no está midiendo decisiones. */
ok(medEmpleo > 0 && medImperio > 0 && medEscalera > 0,
   'las tres vidas prudentes terminan en positivo');

M.imprimir('el imperio: negocios, planilla y techos');
