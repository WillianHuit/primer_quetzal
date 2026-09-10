/* Prueba del TABLERO DEL MES: lo que sale, a quién le sale y cuánto cuesta.
 *
 * El tablero es la parte del juego que más va a crecer —cada dificultad, cada
 * comodín y cada viaje nuevo es una línea en datos/tablero.js— y también la
 * más fácil de romper sin darse cuenta. Este archivo es la red debajo de eso.
 *
 * Tres cosas cuida, y las tres salieron de errores de verdad:
 *
 *   1. QUE NO LE SALGA A QUIEN NO LE TOCA. El tablero le sacaba tareas del
 *      colegio a quien no estudia y comodines que decían "tienes tarea
 *      pendiente" a quien no tiene ninguna. Una decisión sobre algo que no
 *      existe no es una decisión, es un error.
 *   2. QUE NO COBRE LO QUE NO HAY. Ni dinero que el jugador no tiene —una
 *      dificultad no puede dejar a nadie en números rojos: para eso están los
 *      préstamos, que son una decisión y no un accidente— ni experiencia que
 *      todavía no ganó.
 *   3. QUE EL VIAJE EN EL TIEMPO SEA JUSTO. Solo da lo que el jugador ya
 *      tiene de dónde recibir: ni quetzales de la nada al que no maneja
 *      dinero, ni sabiduría al que no estudia.
 *
 * Quien agregue contenido al tablero: ver docs/como-crecer-el-tablero.md.
 */

const { cargar, Marcador } = require('./comun');

const sb = cargar('es');
const { Motor, CONFIG, TABLERO_CASILLAS, TABLERO_DIFICULTADES,
        TABLERO_COMODINES, TABLERO_VIAJES } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- 1. los datos están bien escritos ----------

const TIPOS = ['libre', 'tarea', 'trabajo', 'extra', 'descanso', 'dificultad',
               'comodin', 'viaje'];
const CONDICIONES = ['estudia', 'trabaja', 'dinero'];

const tiposMalos = TABLERO_CASILLAS.filter(c => TIPOS.indexOf(c.tipo) < 0).map(c => c.id);
ok(tiposMalos.length === 0,
   `las ${TABLERO_CASILLAS.length} casillas usan tipos que el motor conoce` +
   (tiposMalos.length ? ': ' + tiposMalos.join(', ') : ''));

const siMalos = TABLERO_CASILLAS.concat(TABLERO_DIFICULTADES, TABLERO_COMODINES)
  .filter(x => x.si && CONDICIONES.indexOf(x.si) < 0).map(x => x.id);
ok(siMalos.length === 0,
   'todas las condiciones son estudia, trabaja o dinero' +
   (siMalos.length ? ': ' + siMalos.join(', ') : ''));

/* Las dificultades siempre quitan, nunca dan: para dar están los comodines y
 * el viaje. Una "dificultad" que regala es un premio con mal nombre. */
const regalonas = TABLERO_DIFICULTADES.filter(
  d => (d.energia || 0) > 0 || (d.dinero || 0) > 0 || (d.experiencia || 0) > 0
).map(d => d.id);
ok(regalonas.length === 0,
   `las ${TABLERO_DIFICULTADES.length} dificultades quitan, ninguna da` +
   (regalonas.length ? ': ' + regalonas.join(', ') : ''));

/* Y las que cuestan dinero o experiencia piden su condición. Sin ella, una
 * dificultad de Q350 le puede caer a un chico de trece que no ha visto un
 * quetzal en el juego. */
const sinCondicion = TABLERO_DIFICULTADES.filter(
  d => (d.dinero && d.si !== 'dinero' && d.si !== 'trabaja') ||
       (d.experiencia && d.si !== 'estudia')
).map(d => d.id);
ok(sinCondicion.length === 0,
   'las que cuestan dinero o experiencia piden la condición que les toca' +
   (sinCondicion.length ? ': ' + sinCondicion.join(', ') : ''));

const sinTexto = TABLERO_VIAJES.filter(v => !v.id || !v.texto).map(v => v.id);
ok(TABLERO_VIAJES.length >= 4 && sinTexto.length === 0,
   `hay ${TABLERO_VIAJES.length} viajes en el tiempo distintos, todos con texto`);

// ---------- 2. no le sale a quien no le toca ----------

/* Un chico de trece que decidió NO estudiar. El tablero no le puede sacar
 * tareas del colegio: no hay ninguna que hacer. */
Motor.iniciar('normal', 1, 'apoyo');
const e = Motor.get();
e.vistos.guiaSaltada = true;

let tareasSinEstudiar = 0;
for (let m = 0; m < 25; m++) {
  const t = Motor.generarTablero();
  tareasSinEstudiar += t.casillas.filter(c => c.tipo === 'tarea').length;
}
ok(tareasSinEstudiar === 0,
   'sin estar inscrito en nada, el tablero no saca una sola tarea del colegio');

/* Ni comodines que hablen de tareas. Este es el que el jugador vio: "hay
 * partido en la cancha y tienes tarea pendiente", sin tener ninguna. */
const deColegio = TABLERO_COMODINES.filter(c => c.si === 'estudia');
ok(deColegio.length >= 2,
   `${deColegio.length} comodines hablan del colegio y piden estar inscrito`);
ok(deColegio.every(c => !Motor.cumpleCondicion(c.si)),
   'y sin estar inscrito, ninguno de ellos puede salir');

// Inscrito, las tareas vuelven
Motor.inscribirse('basicos', false);
let tareasEstudiando = 0;
for (let m = 0; m < 10; m++) {
  const t = Motor.generarTablero();
  tareasEstudiando += t.casillas.filter(c => c.tipo === 'tarea').length;
}
ok(tareasEstudiando > 0,
   `y estando inscrito vuelven a salir (${tareasEstudiando} en diez meses)`);
ok(Motor.cumpleCondicion('estudia'), 'la condición de estudiar se cumple');

// ---------- 3. no cobra lo que no hay ----------

/* El dinero: una dificultad no puede dejar a nadie en rojo. */
e.efectivo = 40;
e.monetaria = null;
const cobro = Motor.aplicarEfecto({ dinero: -500 });
ok(e.efectivo === 0, 'cobrar más de lo que hay deja la cartera en cero, no en rojo');
ok(cobro.dinero === -40, `y avisa de lo que de verdad se cobró (${cobro.dinero})`);

/* Y la condición 'dinero' evita el caso antes de que pase: no sale una
 * dificultad de Q350 si el jugador tiene Q80. */
e.efectivo = 80;
e.empleo = null;
ok(!Motor.cumpleCondicion('dinero', 350),
   'con Q80 en la mano, una dificultad de Q350 no puede salir');

/* La experiencia: lo que sabes no se puede deber. Lo que falte se cobra en
 * dinero por tres y en cuerpo por medio. */
e.experiencia = 5;
e.efectivo = 1000;
e.energia = 90;
const antesDinero = e.efectivo;
const golpe = Motor.aplicarEfecto({ experiencia: -12 });
const f = CONFIG.experiencia.deuda;
ok(e.experiencia === 0, 'la experiencia baja hasta cero y no más');
ok(!!golpe.deuda && golpe.deuda.experiencia === 7,
   `los ${golpe.deuda ? golpe.deuda.experiencia : '?'} que faltaron quedan apuntados`);
ok(antesDinero - e.efectivo === 7 * f.dinero,
   `y se cobran en dinero por ${f.dinero}: ${antesDinero - e.efectivo} quetzales`);
ok(90 - e.energia === Math.round(7 * f.energia),
   `y en cuerpo por ${f.energia}: ${90 - e.energia} puntos`);

/* Si le alcanza, no hay deuda ni cobro. */
e.experiencia = 40;
e.efectivo = 1000;
const suave = Motor.aplicarEfecto({ experiencia: -12 });
ok(e.experiencia === 28 && !suave.deuda && e.efectivo === 1000,
   'y al que sí tenía qué perder no se le cobra un solo quetzal');

// ---------- 4. el viaje en el tiempo es justo ----------

/* Al que no estudia no le cae sabiduría del futuro, y al que no maneja dinero
 * no le aparecen quetzales que no sabría de dónde salieron. */
Motor.iniciar('dificil', 2, 'sosten');
const z = Motor.get();
z.vistos.guiaSaltada = true;
let conXp = 0, conPlata = 0;
for (let n = 0; n < 60; n++) {
  const v = Motor.sortearViaje();
  if (v.experiencia > 0) conXp++;
  if (v.dinero > 0) conPlata++;
  if (v.energia < 0 || v.energia > 100) conXp = -999;
}
ok(conXp === 0, 'sin estudiar, el viaje en el tiempo no regala experiencia');
ok(conPlata === 0, 'y en la etapa de colegio no regala dinero: la pantalla ni lo menciona');

Motor.inscribirse('basicos', false);
let dioXp = 0, energias = [];
for (let n = 0; n < 60; n++) {
  const v = Motor.sortearViaje();
  if (v.experiencia > 0) dioXp++;
  energias.push(v.energia);
}
ok(dioXp === 60, 'estudiando, siempre trae algo aprendido');
ok(Math.min(...energias) >= 0 && Math.max(...energias) <= 100,
   `y el cuerpo que devuelve va de 0 a 100 (salió entre ${Math.min(...energias)} y ${Math.max(...energias)})`);

M.imprimir('el tablero del mes');
