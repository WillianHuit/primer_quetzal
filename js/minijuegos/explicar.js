/* Tarea de rama — Educación: Explícaselo a un niño
 *
 * Una cosa que hay que explicar y tres formas de explicarla. Las tres son
 * ciertas: una es correcta y larga, otra es corta y no dice nada, y la tercera
 * es corta Y se entiende. Esa es la buena, y esa es la materia entera de
 * magisterio: no saber, sino hacer que otro entienda.
 *
 * Y es la tarea más tramposa del juego en el mejor sentido: lo que hay que
 * explicar es SIEMPRE algo de plata —el interés, el enganche, el plazo fijo—
 * así que el jugador que la hace por vocación docente acaba repasando el
 * temario del propio juego sin darse cuenta.
 */

Minijuegos.registrar({
  id: 'explicar',
  nombre: 'Explícaselo a un niño',
  icono: 'libros',
  tipo: 'clase',
  categoria: 'magisterio',
  desdeExperiencia: 0,
  descripcion: 'Tres explicaciones ciertas. Solo una se entiende de primera.',
  ensena: 'Enseñar no es saber: es encontrar la frase con la que el otro lo ve.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    /* `b` es clara y corta. De las malas, una es cierta pero enredada y la
     * otra es cierta pero vacía: ninguna es mentira, y por eso duele. */
    var CASOS = [
      { t: '¿Qué es el interés de un préstamo?',
        b: 'Lo que pagas de más por usar plata que no es tuya',
        m: ['Es el rédito calculado sobre el saldo insoluto según la tasa pactada',
            'Es un cobro que hace el banco'] },
      { t: '¿Qué es ahorrar?',
        b: 'Gastar hoy menos de lo que te entró, para tenerlo después',
        m: ['Es la porción del ingreso no destinada al consumo corriente',
            'Es guardar dinero'] },
      { t: '¿Qué es un enganche?',
        b: 'La parte que pagas de una vez, para deber menos',
        m: ['Es el pago inicial que reduce el monto financiado del bien',
            'Es un pago que se hace al principio'] },
      { t: '¿Por qué el aguinaldo no es plata extra?',
        b: 'Es un sueldo tuyo que te lo dan junto en diciembre',
        m: ['Es una prestación laboral de pago diferido y devengo mensual',
            'Porque ya estaba contemplado'] },
      { t: '¿Qué es la inflación?',
        b: 'Que con los mismos Q100 cada año te alcanza para menos',
        m: ['Es el incremento sostenido y generalizado del nivel de precios',
            'Es cuando suben los precios'] },
      { t: '¿Qué es un plazo fijo?',
        b: 'Dejas la plata quieta un tiempo y por eso te pagan más',
        m: ['Es un instrumento de captación a término con penalización por retiro anticipado',
            'Es un tipo de cuenta que da más intereses'] },
      { t: '¿Por qué pagar el mínimo de la tarjeta sale caro?',
        b: 'Bajas poquito la deuda y el resto sigue cobrando cada mes',
        m: ['Porque la amortización de capital es marginal frente al costo financiero',
            'Porque no conviene'] },
      { t: '¿Qué es un presupuesto?',
        b: 'Decidir en qué se va tu plata antes de que se vaya sola',
        m: ['Es la asignación anticipada de recursos por rubro de gasto',
            'Es un plan de gastos'] },
      { t: '¿Qué es el historial de crédito?',
        b: 'La lista de si pagaste a tiempo o no, y todos la ven',
        m: ['Es el registro consolidado del comportamiento de pago del sujeto de crédito',
            'Es información que tiene el banco'] },
      { t: '¿Por qué un empleo formal paga menos en la mano?',
        b: 'Porque parte de tu sueldo se guarda para el seguro y el aguinaldo',
        m: ['Porque se aplican descuentos de ley sobre el salario ordinario',
            'Porque le quitan cosas'] },
      { t: '¿Qué es la ganancia de un negocio?',
        b: 'Lo que te queda después de pagar todo lo que costó',
        m: ['Es el excedente resultante de deducir los costos totales del ingreso',
            'Es lo que gana el negocio'] },
      { t: '¿Para qué sirve un fondo de emergencia?',
        b: 'Para que un problema no te obligue a pedir prestado',
        m: ['Es una reserva de liquidez ante contingencias no previstas',
            'Sirve para las emergencias'] }
    ];

    var pendientes = CASOS.slice();

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      if (!pendientes.length) pendientes = CASOS.slice();
      var c = pendientes.splice(Math.floor(Math.random() * pendientes.length), 1)[0];
      var ops = [c.b].concat(c.m).sort(function () { return Math.random() - 0.5; });

      var h = '<div class="mj-mensaje">' + c.t + '</div><div class="mj-opciones">';
      ops.forEach(function (o, i) {
        h += '<button class="mj-opcion" data-v="' + i + '" data-ok="' +
             (o === c.b ? '1' : '0') + '">' + o + '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          if (b.dataset.ok === '1') { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-ok="1"]').forEach(function (o) {
              o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 1100);
        });
      });
    }

    siguiente();
  }
});
