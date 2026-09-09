/* Prueba de las tarjetas de decisión.
 *
 * Son la única parte del juego donde la lección no la explica un párrafo: la
 * explica la consecuencia. Eso las hace la mecánica más fácil de romper sin
 * darse cuenta, porque una tarjeta mal escrita no lanza ningún error:
 *
 *   - una opción que en realidad no hace nada se ve igual que una que sí,
 *   - una tarjeta con edadMinima mayor que edadMaxima nunca sale y nadie
 *     se enteraría,
 *   - una tarjeta sin traducción sale en español dentro del juego en inglés,
 *   - y si el enfriamiento se rompe, salen tres seguidas y dejan de importar.
 *
 * Esto lo mira todo.
 */

const { cargar, Marcador, adulto, conAzarFijo } = require('./comun');

const sb = cargar('es');
const { Motor, DECISIONES, MESES_ENTRE_DECISIONES, Iconos, TEXTOS_EN, CONFIG } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- 1. están bien escritas ----------

ok(Array.isArray(DECISIONES) && DECISIONES.length >= 8,
   `hay ${DECISIONES.length} tarjetas de decisión`);

const malas = [];
const ids = new Set();
DECISIONES.forEach(function (d) {
  if (ids.has(d.id)) malas.push(d.id + ': id repetido');
  ids.add(d.id);
  if (!d.titulo || !d.texto) malas.push(d.id + ': sin título o sin texto');
  if (!d.leccion) malas.push(d.id + ': sin lección, que es para lo que existe');
  if (!d.icono) malas.push(d.id + ': sin icono');
  else if (!Iconos.tiene(d.icono)) malas.push(d.id + ': el icono ' + d.icono + ' no existe');
  if (!(d.prob > 0 && d.prob <= 1)) malas.push(d.id + ': probabilidad fuera de rango');
  if (!Array.isArray(d.opciones) || d.opciones.length < 2) {
    malas.push(d.id + ': una decisión con menos de dos opciones no es una decisión');
  } else {
    d.opciones.forEach(function (o, i) {
      if (!o.etiqueta) malas.push(d.id + ':' + i + ' sin etiqueta');
      if (!o.resultado) malas.push(d.id + ':' + i + ' sin resultado: el jugador no sabría qué pasó');
      if (o.icono && !Iconos.tiene(o.icono)) malas.push(d.id + ':' + i + ' icono inexistente');
    });
  }
  if (d.edadMinima && d.edadMaxima && d.edadMinima > d.edadMaxima) {
    malas.push(d.id + ': la ventana de edad está al revés, nunca va a salir');
  }
});
ok(malas.length === 0,
   malas.length === 0 ? 'las tarjetas están completas y sus iconos existen'
                      : malas.slice(0, 6).join(' | '));

/* Toda tarjeta necesita una salida que no cueste dinero.
 *
 * Si las dos opciones cobran, no es una decisión: es un peaje con dos precios,
 * y al jugador que no tiene nada no le queda ninguna. */
const sinSalida = DECISIONES
  .filter(d => (d.opciones || []).every(o => o.dinero < 0 || o.cargoMensual))
  .map(d => d.id);
ok(sinSalida.length === 0,
   sinSalida.length === 0
     ? 'todas dejan una salida que no cuesta dinero'
     : 'tarjetas donde las dos opciones cobran: ' + sinSalida.join(', '));

/* Y ninguna ventana de edad puede quedar fuera de la vida del juego. */
const fueraDeLaVida = DECISIONES.filter(function (d) {
  const desde = d.edadMinima || CONFIG.inicio.edad;
  const hasta = d.edadMaxima || CONFIG.tiempo.edadJubilacion;
  return desde > CONFIG.tiempo.edadJubilacion || hasta < CONFIG.inicio.edad;
}).map(d => d.id);
ok(fueraDeLaVida.length === 0,
   fueraDeLaVida.length === 0
     ? 'todas caen dentro de la vida que se juega'
     : 'tarjetas inalcanzables por edad: ' + fueraDeLaVida.join(', '));

// ---------- 2. hay tarjetas para las dos mitades de la vida ----------

const deNino = DECISIONES.filter(d => (d.edadMinima || 13) < CONFIG.mayoriaDeEdad);
const deAdulto = DECISIONES.filter(d => !d.edadMaxima || d.edadMaxima >= CONFIG.mayoriaDeEdad);
ok(deNino.length >= 3, `${deNino.length} tarjetas pueden salirle a un menor de edad`);
ok(deAdulto.length >= 3, `${deAdulto.length} le pueden salir de adulto`);

// ---------- 3. están traducidas ----------

const faltan = [];
DECISIONES.forEach(function (d) {
  const t = TEXTOS_EN.datos[d.id];
  if (!t) return faltan.push(d.id);
  ['titulo', 'texto', 'leccion'].forEach(function (c) {
    if (!t[c]) faltan.push(d.id + '.' + c);
  });
  (d.opciones || []).forEach(function (o, i) {
    if (!TEXTOS_EN.opciones[d.id + ':' + i]) faltan.push(d.id + ':' + i);
  });
});
ok(faltan.length === 0,
   faltan.length === 0 ? `las ${DECISIONES.length} tarjetas están traducidas al inglés`
                       : 'faltan traducciones: ' + faltan.slice(0, 8).join(', '));

// ---------- 4. los efectos de verdad ocurren ----------

Motor.iniciar('normal', 1, 'apoyo');
const e = adulto(sb, { efectivo: 5000 });
Motor.tomarTrabajo('tienda', true);

const antesEfectivo = e.efectivo;
Motor.aplicarDecision('decision', 'feria', 0);       // ir a la feria: -Q60
ok(Math.abs((antesEfectivo - 60) - e.efectivo) < 0.01,
   `una opción que cuesta dinero lo cobra (Q${antesEfectivo} a Q${e.efectivo})`);

Motor.aplicarDecision('decision', 'bicicleta', 0);   // +Q3 por jornada, para siempre
ok(e.bonoJornada === 3, `la herramienta deja bono por jornada (Q${e.bonoJornada})`);

/* Y ese bono se cobra de verdad al cerrar el mes: sin esto la bicicleta sería
 * un número decorativo en el estado de la partida. */
(function elBonoSePaga() {
  const sbB = cargar('es');
  const MB = sbB.Motor;
  MB.iniciar('normal', 2, 'apoyo');
  const z = adulto(sbB, { efectivo: 0 });
  MB.tomarTrabajo('tienda', true);
  const turnoB = conAzarFijo(sbB, 0.5, function () {
    z.bonoJornada = 10;
    for (let i = 0; i < 8; i++) MB.asignarEspacio(i, 'trabajo');
    return MB.cerrarTurno();
  });
  const conBono = turnoB.salario;
  const sbS = cargar('es');
  const MS = sbS.Motor;
  MS.iniciar('normal', 2, 'apoyo');
  adulto(sbS, { efectivo: 0 });
  MS.tomarTrabajo('tienda', true);
  const sinBono = conAzarFijo(sbS, 0.5, function () {
    for (let i = 0; i < 8; i++) MS.asignarEspacio(i, 'trabajo');
    return MS.cerrarTurno().salario;
  });
  // El reparto se repite en los tres meses del trimestre, y el bono con el
  const esperadoBono = 80 * turnoB.mesesCubiertos;
  ok(Math.abs((conBono - sinBono) - esperadoBono) < 1,
     `ocho jornadas con Q10 de bono pagan Q${esperadoBono} más en el turno ` +
     `(Q${Math.round(conBono - sinBono)})`);
})();

const cargosAntes = e.cargosRecurrentes.length;
Motor.aplicarDecision('decision', 'motoencuotas', 0);
ok(e.cargosRecurrentes.length === cargosAntes + 1 &&
   e.cargosRecurrentes[cargosAntes].monto === 650,
   'la moto en cuotas deja un cargo mensual con su nombre y su monto');
ok(e.cargosRecurrentes[cargosAntes].nombre.indexOf('moto') >= 0,
   'y el cargo dice de qué es, no "Seguro de vida"');

const repAntes = e.reputacion;
Motor.aplicarDecision('decision', 'tareas', 0);      // hacer trampa: -4 de reputación
ok(e.reputacion < repAntes, `hacer trampa baja la reputación (${Math.round(repAntes)} a ${Math.round(e.reputacion)})`);

/* Una opción que no existe no debe romper nada. */
const nada = Motor.aplicarDecision('decision', 'feria', 99);
ok(nada && nada.texto === '', 'una opción inexistente no revienta el motor');
ok(Motor.aplicarDecision('decision', 'no-existe', 0).texto === '',
   'ni una tarjeta inexistente');

/* Y si la opción cuesta más de lo que hay, queda debiendo en vez de dejar el
 * efectivo en negativo. */
(function noAlcanza() {
  const sb2 = cargar('es');
  const M2 = sb2.Motor;
  M2.iniciar('normal', 3, 'sosten');
  const z = adulto(sb2, { efectivo: 10 });
  const r = M2.aplicarDecision('decision', 'graduacion', 0);   // -Q700
  ok(z.efectivo >= -0.01 && z.deudaHogar > 0,
     `sin dinero, la decisión deja deuda (Q${Math.round(z.deudaHogar)}) y no efectivo negativo`);
  ok(r.texto.indexOf('debiendo') > 0, 'y el resultado se lo dice al jugador');
})();

// ---------- 5. el enfriamiento entre tarjetas ----------

/* Con el azar clavado en casi cero, TODAS las tarjetas cumplen su
 * probabilidad cada mes. Lo único que puede separarlas es el enfriamiento. */
(function enfriamiento() {
  const sb3 = cargar('es');
  const M3 = sb3.Motor;
  M3.iniciar('normal', 4, 'apoyo');
  const z = adulto(sb3, { efectivo: 40000 });
  M3.tomarTrabajo('tienda', true);
  z.mesesJugados = CONFIG.mesesDeGracia;   // fuera del año de gracia

  /* El descanso entre tarjetas se cuenta por MES, no por turno, y a los 18 un
   * turno son tres meses. Así que lo que se puede medir desde fuera es cuántas
   * caen en un mismo turno: con tres meses de cooldown y tres meses de turno,
   * nunca puede haber dos. Si el descanso se rompiera, aquí saldrían dos y
   * tres tarjetas juntas en la misma pantalla, que es el fallo que importa. */
  const porTurno = [];
  let mesesCorridos = 0;
  conAzarFijo(sb3, 0.0001, function () {
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 8; j++) M3.asignarEspacio(j, j < 6 ? 'trabajo' : 'descanso');
      const m = M3.cerrarTurno();
      mesesCorridos += m.mesesCubiertos;
      porTurno.push(m.decisiones.filter(d => d.clase === 'decision').length);
      // Se resuelven eligiendo siempre la primera opción, como haría el jugador
      m.decisiones.forEach(d => M3.aplicarDecision(d.clase, d.ref, 0));
    }
  });

  const cuantas = porTurno.reduce((a, n) => a + n, 0);
  ok(cuantas >= 3, `en ${mesesCorridos} meses cayeron ${cuantas} tarjetas de decisión`);
  const cargados = porTurno.filter(n => n > 1).length;
  ok(cargados === 0,
     cargados === 0
       ? `nunca cayeron dos en el mismo turno (descanso de ${MESES_ENTRE_DECISIONES} meses)`
       : `${cargados} turnos trajeron más de una tarjeta`);

  /* Y las de una sola vez no se repiten nunca, ni forzando el azar. */
  const unaVez = DECISIONES.filter(d => d.unaVez).map(d => d.id);
  const repetidas = unaVez.filter(id =>
    z.decisionesVistas.filter(x => x === id).length > 1);
  ok(repetidas.length === 0,
     repetidas.length === 0
       ? `las ${unaVez.length} tarjetas de una sola vez no se repitieron`
       : 'se repitieron: ' + repetidas.join(', '));
})();

// ---------- 6. a un niño no le caen las de adulto ----------

(function porEdad() {
  const sb4 = cargar('es');
  const M4 = sb4.Motor;
  M4.iniciar('normal', 5, 'apoyo');
  const z = M4.get();
  M4.inscribirse('basicos', false);
  M4.tomarTrabajo('limonada', false);
  z.mesesJugados = CONFIG.mesesDeGracia;

  const salieron = [];
  conAzarFijo(sb4, 0.0001, function () {
    for (let i = 0; i < 36 && z.edad < CONFIG.mayoriaDeEdad; i++) {
      for (let j = 0; j < 8; j++) M4.asignarEspacio(j, j < 6 ? 'trabajo' : 'descanso');
      const m = M4.cerrarTurno();
      m.decisiones.filter(d => d.clase === 'decision').forEach(d => salieron.push(d.ref));
      m.decisiones.forEach(d => M4.aplicarDecision(d.clase, d.ref, 1));
    }
  });

  ok(salieron.length > 0, `a un menor de edad le salieron ${salieron.length} tarjetas`);
  const impropias = salieron.filter(function (id) {
    const d = DECISIONES.find(x => x.id === id);
    return d && d.edadMinima && d.edadMinima >= CONFIG.mayoriaDeEdad;
  });
  ok(impropias.length === 0,
     impropias.length === 0
       ? 'y ninguna era de las que piden mayoría de edad'
       : 'le salieron tarjetas de adulto: ' + impropias.join(', '));

  /* Los golpes de dinero tampoco: a los 13 la cuenta del dentista la paga
   * la casa, y el juego se ocupa de otra cosa. */
  ok(z.deudaHogar === 0 || z.deudaHogar < 100,
     `y no le cayeron imprevistos de adulto (debe Q${Math.round(z.deudaHogar)})`);
})();

M.imprimir('las tarjetas de decisión');
