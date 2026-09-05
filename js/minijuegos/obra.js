/* Minijuego avanzado: Presupuesto de obra
 * Ruta de ingeniería. Cotizar materiales sin quedarse corto ni inflar el precio.
 * Enseña el margen: cotizar exacto es perder, cotizar de más es no ganar el trabajo.
 */

Minijuegos.registrar({
  id: 'obra',
  nombre: 'Presupuesto de obra',
  icono: '📐',
  tipo: 'avanzado',
  requiereNivel: 'licenciatura',
  requiereCarrera: 'ingenieria',
  descripcion: 'Cotiza el material justo. Ni corto ni inflado.',
  ensena: 'Un presupuesto sin margen es un presupuesto que pierde plata.',
  duracion: 70,
  pagoMaximo: 1200,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {

    var MATERIALES = [
      { nombre: 'Bloques', unidad: 'unidades', porM2: 12.5, precio: 5.50 },
      { nombre: 'Cemento', unidad: 'sacos', porM2: 0.8, precio: 82 },
      { nombre: 'Arena', unidad: 'metros cúbicos', porM2: 0.06, precio: 190 },
      { nombre: 'Hierro', unidad: 'quintales', porM2: 0.09, precio: 460 }
    ];

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;

      var mat = MATERIALES[Math.floor(Math.random() * MATERIALES.length)];
      var area = 20 + Math.floor(Math.random() * 60);
      var desperdicio = [0.05, 0.10, 0.15][Math.floor(Math.random() * 3)];

      var exacto = area * mat.porM2;
      var conMargen = exacto * (1 + desperdicio);
      var costo = conMargen * mat.precio;

      // Tres cotizaciones: corta, correcta e inflada
      var opciones = [
        { etq: 'Sin margen', valor: exacto * mat.precio, tipo: 'corta' },
        { etq: 'Con ' + Math.round(desperdicio * 100) + '% de desperdicio', valor: costo, tipo: 'correcta' },
        { etq: 'Con 40% de sobra', valor: exacto * 1.40 * mat.precio, tipo: 'inflada' }
      ].sort(function () { return Math.random() - 0.5; });

      var html = '<p class="mj-instruccion">Obra de <strong>' + area + ' m²</strong>.<br>' +
                 'Material: <strong>' + mat.nombre + '</strong> a Q' + mat.precio.toFixed(2) +
                 ' por ' + mat.unidad.replace(/s$/, '') + '.<br>' +
                 '<span class="sutil">El desperdicio esperado en esta obra es del ' +
                 Math.round(desperdicio * 100) + '%.</span></p>';
      html += '<p class="mj-instruccion">¿Qué cotizas?</p><div class="mj-opciones">';
      opciones.forEach(function (o, i) {
        html += '<button class="mj-opcion" data-i="' + i + '">' + o.etq +
                ' · <strong>Q' + o.valor.toFixed(2) + '</strong></button>';
      });
      html += '</div><div id="mj-explica"></div>';
      api.mostrar(html);

      var respondido = false;
      caja.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var o = opciones[parseInt(b.dataset.i, 10)];
          var texto;
          if (o.tipo === 'correcta') {
            api.puntos(12); b.classList.add('bien');
            texto = 'Cotizaste el material más el desperdicio real. Así se gana el trabajo y no se pierde plata.';
          } else if (o.tipo === 'corta') {
            api.fallo(10); b.classList.add('mal');
            texto = 'Te quedaste corto. El material que falte sale de tu bolsa, no de la del cliente.';
          } else {
            api.fallo(6); b.classList.add('mal');
            texto = 'Inflaste la cotización. Es seguro para ti, pero el cliente se va con otro.';
          }
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (o.tipo === 'correcta' ? 'Bien.' : 'Ojo.') +
            '</strong> ' + texto + '</div>';
          setTimeout(siguiente, 2100);
        });
      });
    }

    siguiente();
  }
});
