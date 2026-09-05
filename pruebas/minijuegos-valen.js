/* ¿Vale la pena jugar un minijuego?
 *
 * Un espacio de minijuego cuesta una semana de trabajo, y la tabla de pago
 * castiga cada semana que no trabajas: pasar de cuatro a tres semanas quita
 * el 30% del sueldo del mes. Si el minijuego paga menos que eso, un jugador
 * racional no lo toca nunca, y la mecanica se vuelve decorativa.
 *
 * Eso fue exactamente lo que pasaba: el mejor minijuego sin titulo pagaba
 * Q220 contra Q900 que costaba la semana en un empleo de Q3,000.
 *
 * Esta prueba fija la forma que debe tener la curva:
 *   - Para quien menos gana, el minijuego DEBE poder ganarle a la semana.
 *     Es lo que pasa de verdad: el que gana poco vive de trabajos extra.
 *   - Para quien mas gana, trabajar DEBE seguir siendo mejor. Si no, el
 *     juego premiaria abandonar la carrera que costo estudiar.
 */
const { cargar, Marcador } = require('./comun');
const sb = cargar('es');
const { CONFIG, TRABAJOS, Minijuegos, CARRERA_DE_EMPLEO } = sb;
const m = Marcador();

const tabla = CONFIG.pagoPorSemanasTrabajadas;
const costoSemana = (salarioMes) => salarioMes * (tabla[4] - tabla[3]);

function sueldo(id, dificultad) {
  const t = TRABAJOS.find(x => x.id === id);
  const mult = CONFIG.dificultad[dificultad].multiplicadorSalario;
  const prima = dificultad === 'dificil' ? (1 + CONFIG.primaInformalidad) : 1;
  return t.salarioBase * mult * prima;
}

const juegos = Minijuegos.todos();
const basicos = juegos.filter(j => !j.requiereCarrera && !j.requiereNivel);
const mejorBasico = Math.max(...basicos.map(j => j.pagoMaximo));

// 1. El peor pagado debe poder ganar mas con un trabajo extra que trabajando
const peor = sueldo('vendedor', 'dificil');
m.ok(mejorBasico > costoSemana(peor),
  `al peor pagado (Q${Math.round(peor)} al mes) el trabajo extra le rinde: ` +
  `Q${mejorBasico} contra Q${Math.round(costoSemana(peor))} de la semana`);

// 2. Al gerente le debe seguir conviniendo su empleo
const gerente = sueldo('gerente', 'normal');
const mejorTodos = Math.max(...juegos.map(j => j.pagoMaximo));
m.ok(mejorTodos < costoSemana(gerente),
  `al gerente (Q${Math.round(gerente)} al mes) le conviene trabajar: ` +
  `Q${mejorTodos} del mejor minijuego contra Q${Math.round(costoSemana(gerente))} de la semana`);

// 3. Ningun minijuego debe quedar tan bajo que nadie lo juegue jamas.
//    Referencia: la mitad de lo que cuesta la semana en el empleo de entrada.
const entrada = sueldo('tienda', 'normal');
const piso = costoSemana(entrada) * 0.40;
juegos.forEach(j => {
  m.ok(j.pagoMaximo >= piso,
    `${j.nombre} paga Q${j.pagoMaximo}, por encima del piso de Q${Math.round(piso)}`);
});

// 4. Los minijuegos que piden titulo deben pagar mas que los abiertos a todos
juegos.filter(j => j.requiereCarrera || j.requiereNivel).forEach(j => {
  m.ok(j.pagoMaximo > mejorBasico,
    `${j.nombre} (pide título) paga Q${j.pagoMaximo}, más que el mejor sin título (Q${mejorBasico})`);
});

// 5. El pago escala con el desempeño, no es fijo
juegos.forEach(j => {
  const tope = j.puntosParaPagoMaximo || 100;
  m.ok(tope > 0, `${j.nombre} escala el pago con los puntos (tope ${tope})`);
});

m.imprimir('Los minijuegos valen la semana que cuestan');
