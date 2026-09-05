/* Minijuego avanzado: Cierre de caja
 * Ruta contable y emprendedora. Cuadrar ingresos, egresos y encontrar el descuadre.
 * Es la muestra del patrón: en la versión 2 va uno de estos por carrera.
 */

Minijuegos.registrar({
  id: 'caja',
  nombre: 'Cierre de caja',
  icono: '🧮',
  tipo: 'avanzado',
  requiereNivel: 'tecnico',
  descripcion: 'Cuadra la caja del día y encuentra el descuadre.',
  ensena: 'Llevar cuentas es lo que separa un negocio de un pasatiempo.',
  duracion: 70,
  pagoMaximo: 320,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {

    function moneda(n) { return 'Q' + n.toFixed(2); }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;

      var apertura = Math.round((200 + Math.random() * 300) * 4) / 4;
      var lineas = [];
      var nVentas = 3 + Math.floor(Math.random() * 3);
      for (var i = 0; i < nVentas; i++) {
        lineas.push({ tipo: 'venta', desc: 'Venta ' + (i + 1),
                      monto: Math.round((15 + Math.random() * 180) * 4) / 4 });
      }
      var nGastos = 2 + Math.floor(Math.random() * 2);
      for (var j = 0; j < nGastos; j++) {
        lineas.push({ tipo: 'gasto',
                      desc: ['Proveedor', 'Bolsas', 'Recarga', 'Limpieza'][j % 4],
                      monto: Math.round((10 + Math.random() * 90) * 4) / 4 });
      }

      var esperado = apertura;
      lineas.forEach(function (l) { esperado += l.tipo === 'venta' ? l.monto : -l.monto; });
      esperado = Math.round(esperado * 100) / 100;

      // A veces la caja cuadra, a veces no
      var hayDescuadre = Math.random() < 0.6;
      var descuadre = hayDescuadre
        ? (Math.random() < 0.5 ? -1 : 1) * Math.round((5 + Math.random() * 60) * 4) / 4
        : 0;
      var contado = Math.round((esperado + descuadre) * 100) / 100;

      var html = '<p class="mj-instruccion">Caja del día</p><table class="mj-tabla">';
      html += '<tr><td>Apertura</td><td class="num">' + moneda(apertura) + '</td></tr>';
      lineas.forEach(function (l) {
        html += '<tr><td>' + l.desc + '</td><td class="num ' + (l.tipo === 'gasto' ? 'neg' : '') + '">' +
                (l.tipo === 'gasto' ? '-' : '') + moneda(l.monto) + '</td></tr>';
      });
      html += '<tr class="total"><td>Contado en caja</td><td class="num">' + moneda(contado) + '</td></tr>';
      html += '</table>';
      html += '<p class="mj-instruccion">¿Cuadra la caja?</p><div class="mj-opciones">' +
              '<button class="mj-opcion" data-r="cuadra">Cuadra</button>' +
              '<button class="mj-opcion peligro" data-r="falta">Falta dinero</button>' +
              '<button class="mj-opcion" data-r="sobra">Sobra dinero</button>' +
              '</div><div id="mj-explica"></div>';
      api.mostrar(html);

      var correcta = descuadre === 0 ? 'cuadra' : (descuadre < 0 ? 'falta' : 'sobra');
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
            'Debía haber ' + moneda(esperado) + ' y hay ' + moneda(contado) + '. ' +
            (descuadre === 0 ? 'La caja cuadra exacto.'
              : (descuadre < 0 ? 'Faltan ' + moneda(Math.abs(descuadre)) + '.'
                               : 'Sobran ' + moneda(descuadre) + '.')) + '</div>';
          setTimeout(siguiente, 2100);
        });
      });
    }

    siguiente();
  }
});
