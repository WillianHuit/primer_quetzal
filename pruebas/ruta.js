/* Prueba de la ruta que se va abriendo.
 *
 * El juego ya no abre con todo encima: las pestañas y los productos del banco
 * se desbloquean por peldaños (datos/progreso.js). Eso mete un riesgo nuevo y
 * bastante feo: si un peldaño tiene una condición que nunca se cumple, el
 * jugador pierde esa parte del juego PARA SIEMPRE y nada se lo avisa. La
 * partida sigue funcionando; simplemente la hipoteca ya no existe.
 *
 * Lo que más importa de este archivo es la última comprobación: jugar una vida
 * entera y verificar que la ruta se abrió completa.
 */

const { cargar, Marcador, trabajar, conAzarSemilla } = require('./comun');

const M = new Marcador();
const ok = M.ok.bind(M);

const sb = cargar('es');
const { Motor, PROGRESO, PROGRESO_INICIAL, Iconos, TEXTOS_EN } = sb;

// ---------- 1. la ruta está bien escrita ----------

ok(Array.isArray(PROGRESO) && PROGRESO.length >= 8,
   `la ruta tiene ${PROGRESO.length} peldaños`);

const malos = [];
const ids = new Set();
PROGRESO.forEach(function (p) {
  if (ids.has(p.id)) malos.push(p.id + ': id repetido');
  ids.add(p.id);
  if (typeof p.cuando !== 'function') malos.push(p.id + ': cuando no es una función');
  if (!Array.isArray(p.llaves)) malos.push(p.id + ': llaves no es una lista');
  // Un peldaño sin título se abre en silencio: es un paso del tutorial y no
  // necesita tarjeta. Pero si trae título, tiene que traer la tarjeta entera.
  if (p.titulo) {
    if (!p.texto || !p.leccion) malos.push(p.id + ': con título pero sin texto o lección');
    if (!p.icono) malos.push(p.id + ': con título pero sin icono');
    else if (!Iconos.tiene(p.icono)) malos.push(p.id + ': el icono ' + p.icono + ' no existe');
  }
  if (!p.titulo && p.llaves.length && !p.pista) {
    malos.push(p.id + ': abre algo y no lo cuenta ni lo persigue');
  }
  if (p.guia && !p.senala) malos.push(p.id + ': va en la cinta pero no señala nada');
  if (p.guia && !p.pista) malos.push(p.id + ': va en la cinta pero no dice nada');
});
ok(malos.length === 0, malos.length === 0
  ? 'los peldaños están completos y sus iconos existen'
  : malos.join(' | '));

/* Dos peldaños que abren la misma llave dejan al segundo sin efecto visible:
 * su tarjeta sale anunciando algo que ya estaba abierto. */
const repetidas = [];
const vistas = new Set();
PROGRESO.forEach(function (p) {
  p.llaves.forEach(function (k) {
    if (vistas.has(k)) repetidas.push(k);
    vistas.add(k);
  });
});
ok(repetidas.length === 0,
   repetidas.length === 0 ? 'ninguna llave la abren dos peldaños'
                          : 'llaves repetidas: ' + repetidas.join(', '));

/* Encadenar con `requiere` un peldaño que ABRE algo es esconder contenido.
 *
 * El `requiere` es una segunda condición, y no se ve en la pista. Si el jugador
 * hace las cosas en otro orden, el peldaño anterior nunca se cumple y lo que
 * este abría no se abre jamás. Ya pasó una vez: con `cuenta` encadenada a
 * "entra al Banco", abrir la monetaria antes de repartir el mes dejaba la
 * cuenta de ahorro cerrada para siempre. */
const encadenadosConLlaves = PROGRESO
  .filter(p => p.requiere && p.llaves.length)
  .map(p => `${p.id} (requiere ${p.requiere}, abre ${p.llaves.join('+')})`);
ok(encadenadosConLlaves.length === 0,
   encadenadosConLlaves.length === 0
     ? 'ningún peldaño que abra algo depende de otro peldaño'
     : 'peldaños que esconden contenido tras una cadena: ' + encadenadosConLlaves.join(', '));

/* Y todo `requiere` tiene que apuntar a un peldaño que exista y esté antes */
const cadenasMalas = [];
PROGRESO.forEach(function (p, i) {
  if (!p.requiere) return;
  const j = PROGRESO.findIndex(q => q.id === p.requiere);
  if (j < 0) cadenasMalas.push(p.id + ': requiere un peldaño que no existe');
  else if (j >= i) cadenasMalas.push(p.id + ': requiere uno que va después');
});
ok(cadenasMalas.length === 0,
   cadenasMalas.length === 0 ? 'las cadenas del tutorial apuntan hacia atrás'
                             : cadenasMalas.join(' | '));

/* Y al revés: una llave que nadie consulta es un peldaño que no abre nada.
 * La interfaz pregunta siempre con Motor.desbloqueado('...'). */
const fs = require('fs');
const path = require('path');
const ui = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
const consultadas = new Set();
for (const m of ui.matchAll(/Motor\.desbloqueado\('([a-z]+)'\)/g)) consultadas.add(m[1]);
/* La interfaz también pregunta por el id de la pestaña, en ordenVisible().
 * Los ids salen del propio ui.js para que agregar una pestaña no obligue a
 * tocar esta prueba. */
const ordenUi = /var ORDEN = \[([^\]]+)\]/.exec(ui);
ok(!!ordenUi, 'se puede leer el orden de las pestañas de la interfaz');
[...ordenUi[1].matchAll(/'([a-z]+)'/g)].forEach(m => consultadas.add(m[1]));

const declaradas = PROGRESO_INICIAL.concat(
  PROGRESO.reduce((a, p) => a.concat(p.llaves), []));
const sinUso = declaradas.filter(k => !consultadas.has(k));
ok(sinUso.length === 0,
   sinUso.length === 0 ? `las ${declaradas.length} llaves de la ruta se consultan en la interfaz`
                       : 'llaves que nadie consulta: ' + sinUso.join(', '));

// La cinta del tutorial va al principio: es lo primero que se juega
const conGuia = PROGRESO.filter(p => p.guia);
const ultimaGuia = PROGRESO.reduce((n, p, i) => (p.guia ? i : n), -1);
ok(conGuia.length >= 3 && ultimaGuia === conGuia.length - 1,
   `los ${conGuia.length} pasos del tutorial son los primeros de la ruta`);

// ---------- 2. una partida nueva empieza cerrada ----------

Motor.iniciar('normal', 1, 'remesas');
const e = Motor.get();

ok(PROGRESO_INICIAL.every(k => Motor.desbloqueado(k)),
   `lo que nace abierto está abierto (${PROGRESO_INICIAL.join(', ')})`);
ok(!Motor.desbloqueado('trabajo'),
   'el trabajo todavía no: primero hay que decidir si se estudia');
ok(!Motor.desbloqueado('banco') && !Motor.desbloqueado('credito') &&
   !Motor.desbloqueado('casa') && !Motor.desbloqueado('extra'),
   'el banco, el crédito, la casa y los extras empiezan cerrados');
ok(!Motor.desbloqueado('ahorro') && !Motor.desbloqueado('monetaria'),
   'ni ninguna de las dos cuentas: es normal no tener cuenta en el banco');
ok(e.edad === sb.CONFIG.inicio.edad && e.educacion === 'primaria',
   `la partida arranca a los ${e.edad} saliendo de primaria`);
ok(e.decisionEstudio === null, 'y sin haber decidido todavía si va a estudiar');
ok(Motor.peldanosAbiertos() === 0, 'no hay ningún peldaño abierto todavía');

const primero = Motor.siguientePeldano();
ok(!!primero && primero.peldano.id === PROGRESO[0].id,
   'el primer peldaño que se persigue es el primero de la lista');

// ---------- 3. abrir un peldaño abre su llave, y solo una vez ----------

/* Los pasos del tutorial dependen de dónde está el jugador, no solo de su
 * estado de cuenta: por eso revisarProgreso recibe la vista. */
const enEstudio = Motor.revisarProgreso({ pestana: 'estudio', espacioSel: null });
ok(enEstudio.length === 1 && enEstudio[0].id === 'verEstudio',
   'entrar a la pestaña de estudio cierra el primer paso del tutorial');
ok(!enEstudio[0].titulo, 'y lo hace en silencio, sin sacar una ventana');
ok(Motor.revisarProgreso({ pestana: 'estudio' }).length === 0,
   'revisar otra vez no vuelve a abrir lo mismo');

/* Decir que NO también cuenta como decidir: el juego no obliga a estudiar,
 * obliga a contestar. */
Motor.decidirEstudio('no');
const abreTrabajo = Motor.revisarProgreso({ pestana: 'estudio' });

/* Decir que NO abre el trabajo DE UNA, y ese es el reparto entero.
 *
 * Para quien estudia, el trabajo tarda: los primeros cuatro turnos son solo
 * colegio. Para quien no estudia no hay nada que esperar —no tiene clases a
 * las que ir— así que se le abre en el momento en que dice que no. Esa es la
 * diferencia entre los dos caminos, y el juego la dice sin decirla: el que
 * estudia empieza más despacio. Si no fuera así, el que no estudia se quedaría
 * sin trabajo para siempre. */
const idsDecision = abreTrabajo.map(p => p.id);
ok(idsDecision.indexOf('decidirEstudio') >= 0 && idsDecision.indexOf('primerTrabajo') >= 0,
   'a quien dice que no, decidir le abre también el trabajo: no tiene clases que esperar');
ok(Motor.desbloqueado('trabajo'), 'y con él la pestaña de trabajo');
ok(!Motor.desbloqueado('mejoras'),
   'pero NO el imperio: ese llega cuando tenga con qué abrir algo');

Motor.revisarProgreso({ pestana: 'trabajo' });
Motor.tomarTrabajo('limonada', false);
const abre = Motor.revisarProgreso({ pestana: 'trabajo' });
ok(abre.length === 1 && abre[0].id === 'empleo',
   'aceptar un trabajito abre exactamente un peldaño');
ok(!abre[0].titulo, 'y lo hace en silencio: aceptar un trabajito no desbloquea nada');
ok(!Motor.desbloqueado('banco'),
   'el banco NO se abre por aceptar un trabajo: a los 13 no hay razón para tener cuenta');
const abiertosAqui = Motor.peldanosAbiertos();
ok(abiertosAqui === 6, `van ${abiertosAqui} peldaños abiertos`);

const segundo = Motor.siguientePeldano();
ok(!!segundo && segundo.peldano.id === 'verMes',
   'y el tutorial ya apunta al paso siguiente');

/* El banco llega cuando duele no tenerlo: cuando el efectivo ya se le fue en
 * cosas que no recuerda. Es la unica llave del juego que se abre por haber
 * sentido el problema y no por haber hecho un tramite. */
(function elBancoLlegaPorLaFuga() {
  const sb5 = cargar('es');
  const M5 = sb5.Motor;
  M5.iniciar('normal', 6, 'apoyo');
  const z = M5.get();
  ok(!M5.desbloqueado('banco'), 'una partida nueva no tiene banco');
  z.totales.fugaEfectivo = 31;
  const abrio = M5.revisarProgreso();
  ok(abrio.some(p => p.id === 'banco'), 'con Q31 fugados del efectivo, se abre');
  ok(M5.desbloqueado('ahorro') && !M5.desbloqueado('monetaria'),
     'y lo que abre es la cuenta de AHORRO, no la monetaria');
})();

/* Y la monetaria llega cuando alguien la pide: un patrono formal. */
(function laMonetariaLaPideElPatrono() {
  const sb6 = cargar('es');
  const M6 = sb6.Motor;
  M6.iniciar('normal', 7, 'apoyo');
  M6.tomarTrabajo('tienda', false);          // informal: nadie la pide
  M6.revisarProgreso();
  ok(!M6.desbloqueado('monetaria'),
     'un trabajo informal no abre la monetaria: en informal te pagan en efectivo');
  M6.tomarTrabajo('tienda', true);           // formal: el patrono acredita planilla
  const abrio = M6.revisarProgreso();
  ok(abrio.some(p => p.id === 'monetaria'),
     'un empleo formal sí, porque el patrono necesita dónde depositarte');
})();

/* Hacer las cosas en otro orden abre lo mismo. Es la comprobación que sostiene
 * la regla de no encadenar peldaños con llaves: aquí se abre la cuenta sin
 * haber pasado por ningún paso del tutorial. */
(function fueraDeOrden() {
  const sb3 = cargar('es');
  sb3.Motor.iniciar('normal', 3, 'apoyo');
  sb3.Motor.tomarTrabajo('tienda', true);     // empleo formal, sin tocar el tutorial
  sb3.Motor.revisarProgreso();                // sin vista: sin pasos de navegación
  ok(sb3.Motor.desbloqueado('banco') && sb3.Motor.desbloqueado('monetaria'),
     'un empleo formal abre el banco y la monetaria sin pasar por el tutorial');
})();

// ---------- 4. el desbloqueo sobrevive a guardar y cargar ----------

Motor.guardar();
ok(Motor.cargar(1), 'la partida se vuelve a cargar');
ok(Motor.desbloqueado('trabajo') && Motor.peldanosAbiertos() === abiertosAqui,
   'y la ruta quedó como estaba');

/* Una partida guardada ANTES de que la ruta existiera no trae ni desbloqueado
 * ni peldanos. No puede quedarse sin medio juego: al cargarla se le abre todo
 * lo que ya tenía ganado. */
(function partidaVieja() {
  const crudo = JSON.parse(sb._almacen['miPrimerQuetzal.ranura.1']);
  delete crudo.desbloqueado;
  delete crudo.peldanos;
  crudo.mesesJugados = 6;
  crudo.puntaje = 60;
  crudo.edad = 30;
  sb._almacen['miPrimerQuetzal.ranura.1'] = JSON.stringify(crudo);
  ok(Motor.cargar(1), 'una partida vieja, sin la ruta guardada, se puede cargar');
  ok(Motor.desbloqueado('banco') && Motor.desbloqueado('credito') &&
     Motor.desbloqueado('pension') && Motor.desbloqueado('casa'),
     'y se le abre de golpe todo lo que ya se había ganado');
})();

// ---------- 5. lo que de verdad importa: nada queda inalcanzable ----------

/* Una vida entera, jugada como la jugaría alguien atento: abre sus cuentas,
 * aparta en el ahorro y pide un crédito y lo paga. Si al final de esa vida
 * quedó un peldaño cerrado, es que su condición no se puede cumplir jugando y
 * el jugador nunca va a ver esa parte del juego.
 *
 * La semilla fija hace que la corrida se repita igual: si esto falla algún día
 * es por un cambio en las condiciones, no por mala suerte con los eventos.
 */
(function vidaCompleta() {
  const sb2 = cargar('es');
  const M2 = sb2.Motor;
  conAzarSemilla(sb2, 20260907, function () {
    M2.iniciar('normal', 2, 'apoyo');
    const z = M2.get();
    let vueltas = 0;

    while (!z.jubilado && vueltas < 700) {
      vueltas++;
      // Sube la escalera: básicos, diversificado y luego una carrera
      if (!z.estudio) {
        if (z.educacion === 'primaria') M2.inscribirse('basicos', false);
        else if (z.educacion === 'basicos') M2.inscribirse('bachillerato', false, 'am');
        else if (z.educacion === 'diversificado') M2.inscribirse('tecnico', false);
      }
      // El mejor empleo al que ya califica, respetando edad y nivel
      let mejor = null, paga = 0;
      for (const t of sb2.TRABAJOS) {
        if (!M2.puedeAplicar(t).ok) continue;
        const q = M2.salarioEsperado(t, true);
        if (!mejor || q > paga) { mejor = t; paga = q; }
      }
      if (mejor && (!z.empleo || z.empleo.id !== mejor.id)) {
        M2.tomarTrabajo(mejor.id, z.edad >= sb2.CONFIG.mayoriaDeEdad);
      }

      if (z.monetaria === null) M2.abrirCuenta('monetaria', M2.aperturaMinima('monetaria'));
      else if (z.ahorro === null && z.monetaria > M2.aperturaMinima('ahorro')) {
        M2.mover('monetaria', 'efectivo', M2.aperturaMinima('ahorro'));
        M2.abrirCuenta('ahorro', M2.aperturaMinima('ahorro'));
      } else if (z.monetaria > 900) M2.mover('monetaria', 'ahorro', 600);
      // Un crédito pronto y pagado a tiempo es lo que construye el historial
      if (z.edad >= 19 && z.prestamos.length === 0 && (z.ahorro || 0) >= 1200) {
        M2.pedirPrestamo(1000, 12, true);
      }
      // Reparte lo que el colegio deje libre, revisa CON el mes repartido (es
      // cuando la interfaz revisa) y solo entonces cierra el turno.
      const libres = [];
      for (let i = 0; i < sb2.CONFIG.jornadasPorMes; i++) {
        if (!M2.espacioBloqueado(i)) libres.push(i);
      }
      libres.forEach((i, n) => M2.asignarEspacio(i, n < libres.length - 2 ? 'trabajo' : 'descanso'));
      // La vista va rotando: si no, los pasos de navegación del tutorial no se
      // cierran nunca y la ruta parecería incompleta al final.
      ['casa', 'estudio', 'trabajo', 'banco'].forEach(
        pes => M2.revisarProgreso({ pestana: pes, espacioSel: 0 }));
      M2.cerrarTurno();
      M2.revisarProgreso({ pestana: 'casa', espacioSel: null });
    }

    ok(z.jubilado, `la vida llega a la jubilación (${vueltas} turnos)`);

    const cerrados = sb2.PROGRESO.filter(p => !z.peldanos[p.id]).map(p => p.id);
    ok(cerrados.length === 0,
       cerrados.length === 0
         ? `una vida atenta abre los ${sb2.PROGRESO.length} peldaños de la ruta`
         : `quedaron peldaños inalcanzables: ${cerrados.join(', ')}`);
  });
})();

/* Y el caso opuesto: un jugador que no hace NADA.
 *
 * Cierra meses y nada mas. No estudia, no trabaja, no abre cuenta. Los pasos
 * del tutorial se le quedan cerrados —es lo correcto, nunca hizo el
 * movimiento— pero ninguna LLAVE puede quedarse cerrada por eso: si el banco
 * dependiera solo de aceptar un empleo, este jugador llegaria a los 65 con una
 * sola pestaña y el juego no se lo diria nunca.
 */
(function vidaPasiva() {
  const sb4 = cargar('es');
  const M4 = sb4.Motor;
  conAzarSemilla(sb4, 20260907, function () {
    M4.iniciar('normal', 4, 'remesas');
    const z = M4.get();
    let vueltas = 0;
    while (!z.jubilado && vueltas < 700) {
      vueltas++;
      // Lo unico que hace: descansar y cerrar el mes
      for (let i = 0; i < sb4.CONFIG.jornadasPorMes; i++) M4.asignarEspacio(i, 'descanso');
      M4.cerrarTurno();
      M4.revisarProgreso();
    }
    const llaves = sb4.PROGRESO_INICIAL.concat(
      sb4.PROGRESO.reduce((a, p) => a.concat(p.llaves), []));
    const cerradas = llaves.filter(k => !M4.desbloqueado(k));
    ok(cerradas.length === 0,
       cerradas.length === 0
         ? `un jugador que no hace nada igual ve las ${llaves.length} llaves del juego`
         : `llaves que nunca se le abren: ${cerradas.join(', ')}`);
  });
})();

// ---------- 6. la ruta está traducida ----------

const faltan = [];
/* Se pide traducción de lo que el peldaño de verdad tiene: los pasos
 * silenciosos del tutorial solo muestran su pista. */
PROGRESO.forEach(function (p) {
  const pide = { progreso_pista: p.pista, progreso_titulo: p.titulo,
                 progreso_texto: p.texto, progreso_leccion: p.leccion };
  Object.keys(pide).forEach(function (g) {
    if (!pide[g]) return;
    if (!TEXTOS_EN[g] || !TEXTOS_EN[g][p.id]) faltan.push(g + '.' + p.id);
  });
});
ok(faltan.length === 0,
   faltan.length === 0 ? `los ${PROGRESO.length} peldaños están traducidos al inglés`
                       : `faltan traducciones: ${faltan.slice(0, 8).join(', ')}`);

// ---------- 7. las tres listas de scripts dicen lo mismo ----------

/* index.html, pruebas/comun.js y pruebas/vista.html cargan cada uno su propia
 * lista de archivos. Agregar un archivo de datos y olvidar una de las tres es
 * facilisimo, y el sintoma es una pantalla en blanco con un ReferenceError en
 * la consola: nada que una prueba de logica llegue a ver.
 */
(function listasDeScripts() {
  const { ARCHIVOS } = require('./comun');
  const leerRaiz = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

  const deIndex = [...leerRaiz('index.html')
    .matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  const deVista = [...leerRaiz('pruebas/vista.html')
    .matchAll(/'((?:datos|js|vendor)\/[^']+\.js)'/g)].map(m => m[1]);

  const igual = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  ok(igual(deIndex, ARCHIVOS),
     igual(deIndex, ARCHIVOS)
       ? `index.html y pruebas/comun.js cargan los mismos ${deIndex.length} archivos`
       : 'index.html y pruebas/comun.js cargan listas distintas: ' +
         deIndex.filter(f => !ARCHIVOS.includes(f)).concat(
         ARCHIVOS.filter(f => !deIndex.includes(f))).join(', '));
  ok(igual(deVista, ARCHIVOS),
     igual(deVista, ARCHIVOS)
       ? 'y pruebas/vista.html también'
       : 'pruebas/vista.html carga una lista distinta: ' +
         deVista.filter(f => !ARCHIVOS.includes(f)).concat(
         ARCHIVOS.filter(f => !deVista.includes(f))).join(', '));
})();

M.imprimir('la ruta que se va abriendo');
