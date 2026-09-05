/* Minijuego genérico: Turno en la tienda
 * Dar el cambio correcto contrarreloj. Aritmética simple bajo presión.
 */

Minijuegos.registrar({
  id: 'tienda',
  nombre: 'Turno en la tienda',
  icono: '🏪',
  tipo: 'generico',
  descripcion: 'Atiende clientes y da el cambio correcto.',
  ensena: 'Manejar efectivo sin equivocarte.',
  duracion: 50,
  pagoMaximo: 500,
  puntosParaPagoMaximo: 110,

  jugar: function (caja, api) {
    var BILLETES = [1, 5, 10, 20, 50, 100, 200];

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;

      var cuenta = Math.round((5 + Math.random() * 85) * 100) / 100;
      cuenta = Math.round(cuenta * 4) / 4; // multiplos de 0.25
      var paga = BILLETES.filter(function (b) { return b > cuenta; })[0] ||
                 Math.ceil(cuenta / 100) * 100;
      var cambio = Math.round((paga - cuenta) * 100) / 100;

      // Tres opciones, una correcta
      var opciones = [cambio];
      while (opciones.length < 3) {
        var ruido = (Math.random() < 0.5 ? 1 : -1) * (Math.round(Math.random() * 40) / 4 + 0.25);
        var falsa = Math.round((cambio + ruido) * 100) / 100;
        if (falsa > 0 && opciones.indexOf(falsa) === -1) opciones.push(falsa);
      }
      opciones.sort(function () { return Math.random() - 0.5; });

      var html = '<p class="mj-instruccion">La cuenta es <strong>Q' + cuenta.toFixed(2) +
                 '</strong> y te pagan con <strong>Q' + paga + '</strong>.</p>' +
                 '<p class="mj-instruccion">¿Cuánto cambio das?</p><div class="mj-opciones">';
      opciones.forEach(function (o) {
        html += '<button class="mj-opcion" data-valor="' + o + '">Q' + o.toFixed(2) + '</button>';
      });
      html += '</div>';
      api.mostrar(html);

      var respondido = false;
      caja.querySelectorAll('[data-valor]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          if (Math.abs(parseFloat(b.dataset.valor) - cambio) < 0.01) {
            api.puntos(10); b.classList.add('bien');
          } else {
            api.fallo(6); b.classList.add('mal');
          }
          setTimeout(siguiente, 320);
        });
      });
    }

    siguiente();
  }
});
