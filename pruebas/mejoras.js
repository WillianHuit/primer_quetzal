/* Prueba de las mejoras: la capa de tycoon.
 *
 * Son lo único del juego que se compra una vez y rinde para siempre, así que
 * son también la forma más fácil de romper la economía sin darse cuenta: una
 * mejora demasiado buena convierte el juego en "compra la canasta y espera",
 * y una demasiado mala no la toca nadie.
 *
 * Lo que más importa de este archivo es la última comprobación: que **seguir
 * estudiando siga siendo mejor que montar un negocio y dejar el colegio**. Si
 * eso se invierte, el juego enseña lo contrario de lo que quiere enseñar, y
 * ninguna prueba de que "no lanza errores" lo habría notado.
 */

const { cargar, Marcador, adulto, conAzarSemilla } = require('./comun');

const sb = cargar('es');
const { Motor, MEJORAS, CADENAS, Iconos, TEXTOS_EN, CONFIG, AVANCE_POR_JORNADA_ESTUDIO } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- 1. están bien escritas ----------

ok(Array.isArray(MEJORAS) && MEJORAS.length >= 10, `hay ${MEJORAS.length} mejoras`);
ok(Array.isArray(CADENAS) && CADENAS.length >= 3, `en ${CADENAS.length} cadenas`);

const EFECTOS = ['bonoJornada', 'avanceEstudio', 'ingresoPasivo', 'costoMensual', 'energiaExtra'];
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
    const vale = m => (m.efecto.ingresoPasivo || 0) + (m.efecto.bonoJornada || 0) * 100 +
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
e.efectivo = 400;

ok(Motor.nivelDeCadena('negocio') === 0, 'una partida nueva no tiene ninguna mejora');
ok(Motor.siguienteMejora('negocio').id === 'canasta',
   'y la siguiente de la cadena del negocio es la primera de la lista');

const saltar = Motor.comprarMejora('carreta');
ok(!saltar.ok && saltar.motivo === 'orden',
   'no se puede saltar un escalón: ' + saltar.razon);

const antes = e.efectivo;
const compra = Motor.comprarMejora('canasta');
ok(compra.ok, 'la primera mejora se compra');
ok(Math.abs((antes - 180) - e.efectivo) < 0.01,
   `y se paga de verdad (Q${antes} a Q${e.efectivo})`);
ok(Motor.nivelDeCadena('negocio') === 1, 'el nivel de la cadena subió a uno');
ok(Motor.tieneMejora('canasta'), 'y la mejora queda registrada');
ok(!Motor.comprarMejora('canasta').ok, 'no se puede comprar dos veces');

ok(Motor.efectosDeMejoras().ingresoPasivo === 30,
   'los efectos se suman: Q30 al mes de ingreso pasivo');

const porEdad = Motor.comprarMejora('carreta');
ok(!porEdad.ok && porEdad.motivo === 'edad',
   'la carreta no se la venden a un chico de 13: ' + porEdad.razon);

e.edad = 16;
e.efectivo = 50;
const sinPlata = Motor.comprarMejora('carreta');
ok(!sinPlata.ok && sinPlata.motivo === 'dinero',
   'y sin dinero tampoco: ' + sinPlata.razon);
ok(e.efectivo === 50, 'y no le cobran nada al fallar');

// ---------- 4. los efectos se sienten al cerrar el mes ----------

/* El negocio produce sin gastar jornadas. Es la única entrada del juego que no
 * cuesta tiempo, así que es la que hay que comprobar de verdad. */
(function elNegocioProduce() {
  const sbN = cargar('es');
  const MN = sbN.Motor;
  MN.iniciar('normal', 2, 'apoyo');
  const z = adulto(sbN, { efectivo: 5000 });
  MN.tomarTrabajo('tienda', true);
  MN.comprarMejora('canasta');

  const m = conAzarSemilla(sbN, 4242, function () {
    for (let i = 0; i < 8; i++) MN.asignarEspacio(i, 'descanso');   // ni una jornada
    return MN.cerrarTurno();
  });
  ok(m.negocio > 0, `el negocio produjo Q${Math.round(m.negocio)} sin trabajar ni una jornada`);
  ok(Math.abs(m.negocio - 30) < 30 * sbN.NEGOCIO_VARIANZA + 1,
     'y lo que produjo anda dentro de su variación');
})();

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

  const conH = conAzarSemilla(sbH, 777, function () {
    for (let i = 0; i < 8; i++) MH.asignarEspacio(i, 'trabajo');
    return MH.cerrarTurno().salario;
  });
  const sinH = conAzarSemilla(sinNada, 777, function () {
    for (let i = 0; i < 8; i++) sinNada.Motor.asignarEspacio(i, 'trabajo');
    return sinNada.Motor.cerrarTurno().salario;
  });
  ok(Math.abs((conH - sinH) - 24) < 1,
     `ocho jornadas con Q3 de bono pagan Q24 más (Q${Math.round(conH - sinH)})`);
})();

/* El mantenimiento se cobra cada mes, y se ve. */
(function elMantenimientoSeCobra() {
  const sbM = cargar('es');
  const MM = sbM.Motor;
  MM.iniciar('normal', 4, 'apoyo');
  const z = adulto(sbM, { efectivo: 20000 });
  MM.tomarTrabajo('tienda', true);
  MM.comprarMejora('canasta');
  z.edad = 16; MM.comprarMejora('carreta');
  ok(MM.efectosDeMejoras().costoMensual === 20, 'la carreta cuesta Q20 al mes de mantenimiento');
  const m = conAzarSemilla(sbM, 99, function () {
    for (let i = 0; i < 8; i++) MM.asignarEspacio(i, 'trabajo');
    return MM.cerrarTurno();
  });
  ok(m.mantenimiento === 20, `y se cobra en el resumen del mes (Q${m.mantenimiento})`);
})();

/* Una cama de verdad hace rendir el descanso. */
(function elDescansoRinde() {
  const sbD = cargar('es');
  const MD = sbD.Motor;
  MD.iniciar('normal', 5, 'apoyo');
  const z = adulto(sbD, { efectivo: 5000 });
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

// ---------- 5. la escalera educativa sigue siendo la buena ----------

/* La comprobación que sostiene todo el juego.
 *
 * El riesgo de meter una capa de tycoon en un juego sobre educación financiera
 * es obvio: si montar un negocio rinde más que estudiar, el juego enseña que
 * el colegio es una pérdida de tiempo. Aquí se corren las dos vidas completas
 * sobre las mismas semillas y se compara la mediana.
 *
 * Se permite que el negocio quede CERCA —tiene que valer la pena, si no nadie
 * lo toca— pero no que gane.
 */
function mediana(xs) {
  const s2 = xs.slice().sort((a, b) => a - b);
  return s2[Math.floor(s2.length / 2)];
}

function vida(sbV, estrategia, semilla) {
  const MV = sbV.Motor;
  return conAzarSemilla(sbV, semilla, function () {
    MV.iniciar('normal', 8, 'apoyo');
    const z = MV.get();
    let vueltas = 0;
    while (!z.jubilado && vueltas < 700) {
      vueltas++;
      estrategia(MV, z, sbV);
      MV.cerrarTurno();
      // Las decisiones se resuelven siempre con la segunda opción, la sobria
      MV.get().bitacora.slice(-1).forEach(function (m) {
        (m.decisiones || []).forEach(d => MV.aplicarDecision(d.clase, d.ref, 1));
      });
    }
    return MV.reporte().patrimonio;
  });
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

function reparte(MV, z, trabajoSemanas) {
  const descanso = z.energia < 70 ? 2 : 0;
  const libres = [];
  for (let i = 0; i < 8; i++) if (!MV.espacioBloqueado(i)) libres.push(i);
  const tope = Math.max(0, libres.length - descanso);
  let k = 0;
  for (let n = 0; n < trabajoSemanas * 2 && k < tope; n++, k++) MV.asignarEspacio(libres[k], 'trabajo');
  while (k < libres.length) MV.asignarEspacio(libres[k++], 'descanso');
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

/* A: no estudia nunca y mete todo lo que puede en el negocio. */
function tycoonSinEstudiar(MV, z, sbV) {
  if (z.decisionEstudio === null) MV.decidirEstudio('no');
  mejorEmpleo(MV, z, sbV, z.edad >= sbV.CONFIG.mayoriaDeEdad);
  cuentas(MV, z);
  ['negocio', 'oficio', 'casa'].forEach(function (c) {
    const sig = MV.siguienteMejora(c);
    if (sig && !MV.faltaParaMejora(sig.id)) MV.comprarMejora(sig.id);
  });
  reparte(MV, z, 3);
}

/* B: sube la escalera completa y también invierte en mejoras. */
function escaleraConMejoras(MV, z, sbV) {
  if (!z.estudio) {
    if (z.educacion === 'primaria') MV.inscribirse('basicos', false);
    else if (z.educacion === 'basicos') MV.inscribirse('bachillerato', false, 'am');
    else if (z.educacion === 'diversificado') MV.inscribirse('ingenieria', false);
    else if (z.educacion === 'licenciatura' && z.edad < 40) MV.inscribirse('maestria', false);
  }
  mejorEmpleo(MV, z, sbV, z.edad >= sbV.CONFIG.mayoriaDeEdad);
  cuentas(MV, z);
  CADENAS.forEach(function (c) {
    const sig = MV.siguienteMejora(c.id);
    if (sig && !MV.faltaParaMejora(sig.id)) MV.comprarMejora(sig.id);
  });
  reparte(MV, z, z.estudio ? 2 : 3);
}

const SEMILLAS = Array.from({ length: 11 }, (_, i) => 3000 + i * 7919);
const soloNegocio = SEMILLAS.map(s => vida(cargar('es'), tycoonSinEstudiar, s));
const conEscalera = SEMILLAS.map(s => vida(cargar('es'), escaleraConMejoras, s));

const Q = n => 'Q' + Math.round(n).toLocaleString('en-US');
const medNegocio = mediana(soloNegocio);
const medEscalera = mediana(conEscalera);

console.log('\n--- ¿el tycoon se come a la escuela? mediana de 11 vidas ---');
console.log(`  negocio sin estudiar   ${Q(medNegocio)}`);
console.log(`  escalera con mejoras   ${Q(medEscalera)}`);

ok(medNegocio > 0,
   `montar un negocio sin estudiar deja al jugador en positivo (${Q(medNegocio)})`);
ok(medEscalera > medNegocio,
   `y estudiar sigue rindiendo más (${Q(medEscalera)} contra ${Q(medNegocio)})`);
ok(medNegocio > medEscalera * 0.15,
   `pero el negocio vale la pena de verdad: es el ${
     Math.round((medNegocio / medEscalera) * 100)}% de la ruta larga, no una migaja`);

M.imprimir('las mejoras y la capa de tycoon');
