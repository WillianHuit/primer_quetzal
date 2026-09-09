/* Prueba de las mejoras: las tres cadenas que mejoran a la PERSONA.
 *
 * Son lo único del juego que se compra una vez y rinde para siempre, así que
 * son también la forma más fácil de romper la economía sin darse cuenta: una
 * mejora demasiado buena convierte el juego en "cómprala y espera", y una
 * demasiado mala no la toca nadie.
 *
 * Aquí había una cuarta cadena, `negocio`, y aquí vivía la comprobación de que
 * el tycoon no se come a la escuela. Las dos se mudaron a pruebas/imperio.js
 * cuando los negocios pasaron a ser de verdad: se abren, se les contrata gente
 * y pueden quebrar. Lo que queda en este archivo son las herramientas, los
 * útiles y la cama.
 */

const { cargar, Marcador, adulto, conAzarSemilla } = require('./comun');

const sb = cargar('es');
const { Motor, MEJORAS, CADENAS, Iconos, TEXTOS_EN, CONFIG, AVANCE_POR_JORNADA_ESTUDIO } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- 1. están bien escritas ----------

ok(Array.isArray(MEJORAS) && MEJORAS.length >= 6, `hay ${MEJORAS.length} mejoras`);
ok(Array.isArray(CADENAS) && CADENAS.length >= 3, `en ${CADENAS.length} cadenas`);

const EFECTOS = ['bonoJornada', 'avanceEstudio', 'costoMensual', 'energiaExtra'];
const malas = [];
const ids = new Set();
MEJORAS.forEach(function (m) {
  if (ids.has(m.id)) malas.push(m.id + ': id repetido');
  ids.add(m.id);
  if (!m.nombre) malas.push(m.id + ': sin nombre');
  if (!m.leccion) malas.push(m.id + ': sin lección, que es para lo que existe');
  if (!m.icono) malas.push(m.id + ': sin icono');
  else if (!Iconos.tiene(m.icono)) malas.push(m.id + ': el icono ' + m.icono + ' no existe');
  if (!(m.costo > 0)) malas.push(m.id + ': sin costo');
  if (!CADENAS.some(c => c.id === m.cadena)) malas.push(m.id + ': cadena desconocida ' + m.cadena);
  if (!m.efecto || !Object.keys(m.efecto).length) malas.push(m.id + ': no hace nada');
  else {
    Object.keys(m.efecto).forEach(function (k) {
      if (EFECTOS.indexOf(k) < 0) malas.push(m.id + ': efecto desconocido ' + k);
      if (!(m.efecto[k] > 0)) malas.push(m.id + ': el efecto ' + k + ' no es positivo');
    });
    // Una mejora que solo cobra mantenimiento es un castigo, no una mejora
    const soloCosto = Object.keys(m.efecto).every(k => k === 'costoMensual');
    if (soloCosto) malas.push(m.id + ': solo cuesta, no da nada');
  }
});
ok(malas.length === 0,
   malas.length === 0 ? 'las mejoras están completas y sus iconos existen'
                      : malas.slice(0, 6).join(' | '));

/* Cada cadena tiene que subir: el escalón siguiente cuesta más y da más.
 * Una cadena donde el nivel 2 da menos que el nivel 1 se ve igual en pantalla
 * y es dinero tirado. */
const noSuben = [];
CADENAS.forEach(function (c) {
  const lista = MEJORAS.filter(m => m.cadena === c.id);
  if (lista.length < 2) return;
  for (let i = 1; i < lista.length; i++) {
    if (lista[i].costo <= lista[i - 1].costo) {
      noSuben.push(c.id + ': ' + lista[i].id + ' no cuesta más que el anterior');
    }
    const vale = m => (m.efecto.bonoJornada || 0) * 100 +
                      (m.efecto.avanceEstudio || 0) * 10000 + (m.efecto.energiaExtra || 0) * 50;
    if (vale(lista[i]) <= vale(lista[i - 1])) {
      noSuben.push(c.id + ': ' + lista[i].id + ' no da más que el anterior');
    }
  }
});
ok(noSuben.length === 0,
   noSuben.length === 0 ? `las ${CADENAS.length} cadenas suben en costo y en efecto`
                        : noSuben.join(' | '));

/* Y el estudio no se puede acelerar más allá de lo razonable: con la cadena
 * completa, una jornada no debe valer el doble de lo que vale sin nada. */
const avanceTotal = MEJORAS.filter(m => m.efecto.avanceEstudio)
  .reduce((a, m) => a + m.efecto.avanceEstudio, 0);
ok(avanceTotal < AVANCE_POR_JORNADA_ESTUDIO,
   `con todas las mejoras de estudio una jornada avanza ${
     Math.round(((AVANCE_POR_JORNADA_ESTUDIO + avanceTotal) / AVANCE_POR_JORNADA_ESTUDIO - 1) * 100)
   }% más, no el doble`);

// ---------- 2. están traducidas ----------

const faltan = [];
MEJORAS.forEach(function (m) {
  if (!TEXTOS_EN.datos[m.id] || !TEXTOS_EN.datos[m.id].nombre) faltan.push(m.id + '.nombre');
  if (!TEXTOS_EN.mejora_leccion || !TEXTOS_EN.mejora_leccion[m.id]) faltan.push(m.id + '.leccion');
});
CADENAS.forEach(function (c) {
  if (!TEXTOS_EN.cadena_nombre || !TEXTOS_EN.cadena_nombre[c.id]) faltan.push('cadena.' + c.id);
});
ok(faltan.length === 0,
   faltan.length === 0 ? `las ${MEJORAS.length} mejoras están traducidas al inglés`
                       : 'faltan traducciones: ' + faltan.slice(0, 8).join(', '));

// ---------- 3. comprarlas funciona, y en orden ----------

Motor.iniciar('normal', 1, 'apoyo');
const e = Motor.get();
e.efectivo = 1000;

ok(Motor.nivelDeCadena('oficio') === 0, 'una partida nueva no tiene ninguna mejora');
ok(Motor.siguienteMejora('oficio').id === 'herramienta',
   'y la siguiente de la cadena del oficio es la primera de la lista');

const saltar = Motor.comprarMejora('uniforme');
ok(!saltar.ok && saltar.motivo === 'orden',
   'no se puede saltar un escalón: ' + saltar.razon);

const antes = e.efectivo;
const compra = Motor.comprarMejora('herramienta');
ok(compra.ok, 'la primera mejora se compra');
ok(Math.abs((antes - 220) - e.efectivo) < 0.01,
   `y se paga de verdad (Q${antes} a Q${e.efectivo})`);
ok(Motor.nivelDeCadena('oficio') === 1, 'el nivel de la cadena subió a uno');
ok(Motor.tieneMejora('herramienta'), 'y la mejora queda registrada');
ok(!Motor.comprarMejora('herramienta').ok, 'no se puede comprar dos veces');

ok(Motor.efectosDeMejoras().bonoJornada === 3,
   'los efectos se suman: Q3 más por cada jornada trabajada');

ok(Motor.comprarMejora('uniforme').ok, 'el segundo escalón sí, ya en orden');

const porEdad = Motor.comprarMejora('transporte');
ok(!porEdad.ok && porEdad.motivo === 'edad',
   'la moto no se la venden a un chico de 13: ' + porEdad.razon);

e.edad = 16;
e.efectivo = 50;
const sinPlata = Motor.comprarMejora('transporte');
ok(!sinPlata.ok && sinPlata.motivo === 'dinero',
   'y sin dinero tampoco: ' + sinPlata.razon);
ok(e.efectivo === 50, 'y no le cobran nada al fallar');

// ---------- 4. los efectos se sienten al cerrar el mes ----------

/* La herramienta paga por jornada trabajada, no al mes. */
(function laHerramientaPaga() {
  const sbH = cargar('es');
  const MH = sbH.Motor;
  MH.iniciar('normal', 3, 'apoyo');
  adulto(sbH, { efectivo: 5000 });
  MH.tomarTrabajo('tienda', true);
  MH.comprarMejora('herramienta');
  ok(MH.bonoPorJornada() === 3, 'la herramienta deja Q3 por jornada');

  const sinNada = cargar('es');
  sinNada.Motor.iniciar('normal', 3, 'apoyo');
  adulto(sinNada, { efectivo: 5000 });
  sinNada.Motor.tomarTrabajo('tienda', true);

  /* El turno de un chico de 18 son tres meses, y el reparto se repite en los
   * tres: el bono por jornada se cobra una vez por mes, no una por turno. */
  const conH = conAzarSemilla(sbH, 777, function () {
    for (let i = 0; i < 8; i++) MH.asignarEspacio(i, 'trabajo');
    return MH.cerrarTurno();
  });
  const sinH = conAzarSemilla(sinNada, 777, function () {
    for (let i = 0; i < 8; i++) sinNada.Motor.asignarEspacio(i, 'trabajo');
    return sinNada.Motor.cerrarTurno().salario;
  });
  const esperado = 24 * conH.mesesCubiertos;
  ok(Math.abs((conH.salario - sinH) - esperado) < 1,
     `ocho jornadas con Q3 de bono pagan Q${esperado} más en el turno ` +
     `(${conH.mesesCubiertos} meses, Q${Math.round(conH.salario - sinH)})`);
})();

/* El mantenimiento se cobra cada mes, y se ve.
 *
 * Es el número que delató que el transporte estaba mal tarifado: costaba
 * Q3,200 para dejar Q12 al mes, o sea 267 meses en pagarse. Nadie lo habría
 * comprado nunca. */
(function elMantenimientoSeCobra() {
  const sbM = cargar('es');
  const MM = sbM.Motor;
  MM.iniciar('normal', 4, 'apoyo');
  adulto(sbM, { efectivo: 20000 });
  MM.tomarTrabajo('tienda', true);
  MM.comprarMejora('herramienta');
  MM.comprarMejora('uniforme');
  MM.comprarMejora('transporte');
  ok(MM.efectosDeMejoras().costoMensual === 45,
     'la moto cuesta Q45 al mes de gasolina y mantenimiento');
  const m = conAzarSemilla(sbM, 99, function () {
    for (let i = 0; i < 8; i++) MM.asignarEspacio(i, 'trabajo');
    return MM.cerrarTurno();
  });
  ok(m.mantenimiento === 45 * m.mesesCubiertos,
     `y se cobra cada mes del turno (Q${m.mantenimiento} en ${m.mesesCubiertos})`);
})();

/* Una cama de verdad hace rendir el descanso. */
(function elDescansoRinde() {
  const sbD = cargar('es');
  const MD = sbD.Motor;
  MD.iniciar('normal', 5, 'apoyo');
  /* A los 13 el turno es un mes, y eso es lo que mide esta comprobación: la
   * energía de UN mes de siete jornadas de trabajo y una de descanso. Con un
   * turno de tres meses el mismo reparto la deja en cero y no se ve nada. */
  const z = adulto(sbD, { efectivo: 5000, edad: 13 });
  MD.comprarMejora('escritorio');
  z.energia = 20;
  conAzarSemilla(sbD, 5, function () {
    for (let i = 0; i < 8; i++) MD.asignarEspacio(i, i < 7 ? 'trabajo' : 'descanso');
    MD.cerrarTurno();
  });
  // 7 jornadas de trabajo (-42), una de descanso (+22) y +4 del escritorio
  ok(z.energia > 20 - 42 + 22,
     `el rincón propio suma energía al descansar (quedó en ${Math.round(z.energia)})`);
})();

M.imprimir('las mejoras que te mejoran a ti');
