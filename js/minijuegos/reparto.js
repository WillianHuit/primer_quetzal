/* Minijuego genérico: Reparto en moto
 * Toca el carril libre antes de que se acabe el tiempo de cada entrega.
 * No enseña nada de finanzas. Paga por entrega, como en la vida real.
 */

Minijuegos.registrar({
  id: 'reparto',
  nombre: 'Reparto en moto',
  icono: '🛵',
  tipo: 'generico',
  descripcion: 'Esquiva el tráfico y entrega los pedidos a tiempo.',
  ensena: null,
  duracion: 40,
  pagoMaximo: 550,
  puntosParaPagoMaximo: 120,

  jugar: function (caja, api) {
    var CARRILES = 3;
    var ronda = 0;
    var temporizador = null;

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      ronda++;
      var libre = Math.floor(Math.random() * CARRILES);
      var margen = Math.max(900, 2100 - ronda * 90); // se acelera

      var html = '<p class="mj-instruccion">Toca el carril libre</p><div class="mj-carriles">';
      for (var i = 0; i < CARRILES; i++) {
        html += '<button class="mj-carril" data-carril="' + i + '">' +
                (i === libre ? '🛣️' : '🚗') + '</button>';
      }
      html += '</div><div class="mj-barra"><div class="mj-barra-relleno" style="animation-duration:' +
              margen + 'ms"></div></div>';
      api.mostrar(html);

      var respondido = false;

      caja.querySelectorAll('[data-carril]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          clearTimeout(temporizador);
          if (parseInt(b.dataset.carril, 10) === libre) {
            api.puntos(10);
            b.classList.add('bien');
          } else {
            api.fallo(5);
            b.classList.add('mal');
          }
          setTimeout(siguiente, 260);
        });
      });

      temporizador = setTimeout(function () {
        if (respondido) return;
        respondido = true;
        api.fallo(4);
        siguiente();
      }, margen);
    }

    siguiente();
  }
});
