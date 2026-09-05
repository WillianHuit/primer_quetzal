/* Minijuego avanzado: Decisión de inversión
 * Ruta de maestría. Elegir entre proyectos comparando lo que devuelven contra
 * lo que cuesta el dinero. Es el mismo músculo que decide si vale la pena un
 * préstamo, y aquí se practica sin fórmulas.
 */

Minijuegos.registrar({
  id: 'inversion',
  nombre: 'Decisión de inversión',
  icono: '📊',
  tipo: 'avanzado',
  requiereNivel: 'maestria',
  requiereCarrera: 'maestria',
  descripcion: 'Dos proyectos, un presupuesto. Elige el que de verdad conviene.',
  ensena: 'Un proyecto solo vale la pena si rinde más que lo que cuesta el dinero.',
  duracion: 75,
  pagoMaximo: 420,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {

    function q(n) { return 'Q' + Math.round(n).toLocaleString('es-GT'); }

    function proyecto(nombre) {
      var inversion = Math.round((40 + Math.random() * 160)) * 1000;
      var anios = 2 + Math.floor(Math.random() * 4);
      // retorno total como multiplo de la inversion
      var multiplo = 1.05 + Math.random() * 0.85;
      var retorno = inversion * multiplo;
      var anual = Math.pow(multiplo, 1 / anios) - 1;
      return { nombre: nombre, inversion: inversion, anios: anios, retorno: retorno, anual: anual };
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;

      var a = proyecto('Proyecto A');
      var b = proyecto('Proyecto B');
      // El costo del dinero: la tasa a la que tendrías que pedir prestado
      var costoDinero = 0.10 + Math.random() * 0.12;

      var viables = [a, b].filter(function (p) { return p.anual > costoDinero; });
      var mejor = a.anual >= b.anual ? a : b;
      var correcta = viables.length === 0 ? 'ninguno' : (mejor === a ? 'A' : 'B');

      var html = '<p class="mj-instruccion">El dinero te cuesta <strong>' +
                 (costoDinero * 100).toFixed(1) + '% anual</strong>.</p><table class="mj-tabla">';
      [a, b].forEach(function (p) {
        html += '<tr><td colspan="2"><strong>' + p.nombre + '</strong></td></tr>';
        html += '<tr><td>Inversión</td><td class="num">' + q(p.inversion) + '</td></tr>';
        html += '<tr><td>Devuelve en ' + p.anios + ' años</td><td class="num">' + q(p.retorno) + '</td></tr>';
      });
      html += '</table>';
      html += '<p class="mj-instruccion">¿Cuál tomas?</p><div class="mj-opciones">' +
              '<button class="mj-opcion" data-r="A">Proyecto A</button>' +
              '<button class="mj-opcion" data-r="B">Proyecto B</button>' +
              '<button class="mj-opcion peligro" data-r="ninguno">Ninguno de los dos</button>' +
              '</div><div id="mj-explica"></div>';
      api.mostrar(html);

      var respondido = false;
      caja.querySelectorAll('[data-r]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = btn.dataset.r === correcta;
          if (acerto) { api.puntos(14); btn.classList.add('bien'); }
          else { api.fallo(10); btn.classList.add('mal'); }
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (acerto ? 'Correcto.' : 'No.') + '</strong> ' +
            'A rinde ' + (a.anual * 100).toFixed(1) + '% al año y B rinde ' +
            (b.anual * 100).toFixed(1) + '%. El dinero cuesta ' + (costoDinero * 100).toFixed(1) + '%. ' +
            (correcta === 'ninguno'
              ? 'Ninguno supera el costo del dinero, así que lo sensato es no tomar ninguno.'
              : 'El ' + (correcta === 'A' ? 'Proyecto A' : 'Proyecto B') +
                ' es el único que deja algo después de pagar el costo del dinero.') +
            '</div>';
          setTimeout(siguiente, 2600);
        });
      });
    }

    siguiente();
  }
});
