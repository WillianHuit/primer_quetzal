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
        TABLERO_COMODINES, TABLERO_TRAMPAS, TABLERO_VIAJES, TABLERO_ESQUINAS } = sb;
const M = new Marcador();
const ok = M.ok.bind(M);

// ---------- 1. los datos están bien escritos ----------

const TIPOS = ['libre', 'tarea', 'trabajo', 'extra', 'descanso', 'dificultad',
               'comodin', 'trampa', 'viaje'];
const CONDICIONES = ['estudia', 'trabaja', 'dinero'];

const tiposMalos = TABLERO_CASILLAS.filter(c => TIPOS.indexOf(c.tipo) < 0).map(c => c.id);
ok(tiposMalos.length === 0,
   `las ${TABLERO_CASILLAS.length} casillas usan tipos que el motor conoce` +
   (tiposMalos.length ? ': ' + tiposMalos.join(', ') : ''));

const siMalos = TABLERO_CASILLAS.concat(TABLERO_DIFICULTADES, TABLERO_COMODINES,
                                        TABLERO_TRAMPAS)
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

/* Las cuatro esquinas, que son sitios y no dias. */
ok(TABLERO_ESQUINAS.length === 4,
   'el anillo tiene sus cuatro esquinas, ni una mas ni una menos');
ok(TABLERO_ESQUINAS[0].tipo === 'salida',
   'y la primera es la salida, que es por donde se empieza');

/* LA VARIEDAD, que es lo que hace que un mes no se sienta el anterior.
 *
 * Los dias que no piden nada —libre y descanso— no pueden ser la mitad del
 * mes. Lo eran: con el jugador sin estudiar, entre los dos se llevaban el 44%
 * de las casillas y el mes se sentia una fila de dias iguales. */
const pesoDe = (id, etapa) => {
  const c = TABLERO_CASILLAS.find(x => x.id === id);
  return (c && c.peso && c.peso[etapa]) || 0;
};
['colegio', 'trabajo'].forEach(function (etapa) {
  const total = TABLERO_CASILLAS.reduce((n, c) => n + ((c.peso && c.peso[etapa]) || 0), 0);
  const vacios = pesoDe('dia_libre', etapa) + pesoDe('dia_descanso', etapa);
  ok(vacios / total <= 0.22,
     `en ${etapa}, los días que no piden nada son el ${Math.round(100 * vacios / total)}% del mes`);
});
ok(TABLERO_COMODINES.length >= 25,
   `hay ${TABLERO_COMODINES.length} comodines, que son los que el jugador recuerda`);
ok(TABLERO_TRAMPAS.length >= 5,
   `y ${TABLERO_TRAMPAS.length} trampas, donde SÍ hay una respuesta buena`);

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

// ---------- 5. como viene el mes ----------

/* Hasta tres condiciones por mes —llueve, hay feria, se fue la luz— que
 * cambian que dias salen y cuanto cansa cada jornada. Es lo que hace que
 * marzo no se sienta igual que febrero. */
const { CONDICIONES_MES, CONDICIONES_POR_MES } = sb;

ok(CONDICIONES_MES.length >= 6,
   `hay ${CONDICIONES_MES.length} condiciones distintas que le pueden tocar a un mes`);
ok(CONDICIONES_MES.every(c => c.nombre.split(' ').length <= 2),
   'y todas se llaman con dos palabras o menos: van en una franja de pocos píxeles');

/* Lo que quitan y lo que dan tiene que compensarse. Con solo meses malos, las
 * condiciones dejan de ser "cómo viene el mes" y pasan a ser un impuesto: en
 * una vida de cincuenta años eso decide la partida, y el modo difícil dejaba
 * cuatro de veintiuna vidas en negativo. */
const balance = CONDICIONES_MES.reduce((n, c) => n + (c.peso || 1) * (c.energiaExtra || 0), 0);
const pesoTotal = CONDICIONES_MES.reduce((n, c) => n + (c.peso || 1), 0);
ok(Math.abs(balance / pesoTotal) < 0.35,
   `lo que quitan y lo que dan de cuerpo se compensa (${(balance / pesoTotal).toFixed(2)} por condición)`);

Motor.iniciar('normal', 3, 'apoyo');
const q = Motor.get();
q.vistos.guiaSaltada = true;
Motor.inscribirse('basicos', false);

let cuantas = [], repetidas = 0;
for (let m = 0; m < 40; m++) {
  const t = Motor.generarTablero();
  const ids = t.condiciones || [];
  cuantas.push(ids.length);
  if (new Set(ids).size !== ids.length) repetidas++;
}
ok(Math.max(...cuantas) <= (CONDICIONES_POR_MES.maximo || 3),
   `un mes trae ${Math.max(...cuantas)} condiciones como mucho: más no se leen de un vistazo`);
ok(Math.min(...cuantas) === 0, 'y algunos meses no traen ninguna: los tranquilos hacen que se noten los otros');
ok(repetidas === 0, 'y nunca se repite una en el mismo mes');

/* Y el mes MANDA sobre el sorteo de los días: en mes de exámenes salen casi el
 * doble de tareas. Esto es lo que hace que la condición se note jugando y no
 * solo en la franja. */
q.tablero.condiciones = ['examen'];
ok(Motor.efectoDelMes('pesos', 'tarea') > 1.5,
   'en mes de exámenes, las tareas salen casi el doble');
q.tablero.condiciones = ['gripe'];
ok(Motor.energiaDeEspacio('trabajo') < CONFIG.energia.porEspacio.trabajo,
   'y con gripe, cada jornada cuesta más cuerpo del normal');

/* Lo que se acumula se limita: tres condiciones razonables juntas dejan de
 * serlo. Con gripe, calor y lluvia a la vez cada jornada costaba diez de
 * cuerpo más, y el modo difícil se volvía una trampa sin salida. */
q.tablero.condiciones = ['gripe', 'calor', 'lluvia'];
ok(Motor.efectoDelMes('energiaExtra') >= -6,
   `tres meses malos a la vez no pasan de -6 de cuerpo (dan ${Motor.efectoDelMes('energiaExtra')})`);

M.imprimir('el tablero del mes');
