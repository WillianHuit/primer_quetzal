/* Minijuego avanzado: Conciliación bancaria
 * Ruta administrativa. Cuadrar lo que dice tu libro contra lo que dice el banco.
 * Enseña por qué el saldo de tu app casi nunca es el saldo que de verdad tienes.
 */

Minijuegos.registrar({
  id: 'conciliacion',
  nombre: 'Conciliación bancaria',
  icono: '📑',
  tipo: 'avanzado',
  requiereNivel: 'licenciatura',
  requiereCarrera: 'admin',
  descripcion: 'Cuadra tu libro contra el estado de cuenta del banco.',
  ensena: 'El saldo que ves en la app no es el dinero que de verdad tienes disponible.',
  duracion: 70,
  pagoMaximo: 340,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {

    function moneda(n) { return 'Q' + n.toFixed(2); }

    var PARTIDAS = [
      { desc: 'Cheque girado, aún no cobrado', signo: -1, enBanco: false },
      { desc: 'Depósito en tránsito', signo: 1, enBanco: false },
      { desc: 'Comisión de mantenimiento', signo: -1, enBanco: true },
      { desc: 'Intereses abonados por el banco', signo: 1, enBanco: true },
      { desc: 'Cheque rechazado de un cliente', signo: -1, enBanco: true },
      { desc: 'Nota de débito por chequera', signo: -1, enBanco: true }
    ];

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;

      var partida = PARTIDAS[Math.floor(Math.random() * PARTIDAS.length)];
      var monto = Math.round((30 + Math.random() * 900) * 4) / 4;
      var libro = Math.round((4000 + Math.random() * 9000) * 4) / 4;

      // Si la partida ya está en el banco pero no en tu libro, ajustas tu libro.
      // Si está en tu libro pero no en el banco, ajustas el saldo del banco.
      var correcta = partida.enBanco ? 'libro' : 'banco';

      var html = '<p class="mj-instruccion">Tu libro dice <strong>' + moneda(libro) + '</strong>.</p>';
      html += '<div class="mj-mensaje">' + partida.desc + ': <strong>' +
              (partida.signo < 0 ? '-' : '+') + moneda(monto) + '</strong><br>' +
              '<span class="sutil">' +
              (partida.enBanco ? 'Ya aparece en el estado de cuenta del banco.'
                               : 'Todavía no aparece en el estado de cuenta del banco.') +
              '</span></div>';
      html += '<p class="mj-instruccion">¿Dónde va el ajuste?</p><div class="mj-opciones">' +
              '<button class="mj-opcion" data-r="libro">Ajusto mi libro</button>' +
              '<button class="mj-opcion" data-r="banco">Ajusto el saldo del banco</button>' +
              '<button class="mj-opcion" data-r="ninguno">No hay que ajustar nada</button>' +
              '</div><div id="mj-explica"></div>';
      api.mostrar(html);

      var respondido = false;
      caja.querySelectorAll('[data-r]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = b.dataset.r === correcta;
          if (acerto) { api.puntos(12); b.classList.add('bien'); }
          else { api.fallo(9); b.classList.add('mal'); }
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (acerto ? 'Correcto.' : 'No.') + '</strong> ' +
            (partida.enBanco
              ? 'El banco ya lo registró y tú no. El ajuste va en tu libro.'
              : 'Tú ya lo registraste y el banco todavía no. El ajuste va del lado del banco.') +
            '</div>';
          setTimeout(siguiente, 2000);
        });
      });
    }

    siguiente();
  }
});
