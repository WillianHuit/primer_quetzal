/* Tarea de rama — Industrial, mecánica y construcción: ¿Qué pieza encaja?
 *
 * Un hueco y tres piezas. Solo una entra: las otras dos se pasan o bailan. No
 * hay número escrito en ninguna parte a propósito —hay que medirlo a ojo, que
 * es como se mide en un taller cuando no está la cinta— y las que sobran se
 * diferencian por poco.
 *
 * Es el mismo músculo que el de arte y no es la misma tarea: allá hay que ver
 * si algo está torcido, aquí hay que estimar cuánto mide. Un mecánico que no
 * calcula el hueco a ojo pierde el día yendo y viniendo por el repuesto.
 *
 * En básicos sale como sondeo vocacional; en la rama industrial es la materia.
 */

Minijuegos.registrar({
  id: 'encaja',
  nombre: '¿Qué pieza encaja?',
  icono: 'martillo',
  tipo: 'clase',
  categoria: 'industrial',
  desdeExperiencia: 0,
  descripcion: 'Un hueco y tres piezas. Solo una entra justo. A ojo.',
  ensena: 'Calcular una medida a ojo se aprende, y en un taller ahorra el día.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function ronda() {
      var hueco = entero(70, 190);
      /* La holgura es lo que decide si la ronda es fácil o se pelea, y se
       * sortea: de 22 unidades se ve de lejos, de 10 hay que mirarlo. */
      var holgura = entero(10, 24);
      var piezas = [
        { ancho: hueco, ok: true },
        { ancho: hueco + holgura, ok: false },
        { ancho: hueco - holgura, ok: false }
      ].sort(function () { return Math.random() - 0.5; });
      return { hueco: hueco, piezas: piezas };
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var r = ronda();
      var h = '<div class="mj-mensaje">¿Cuál entra justo en el hueco?</div>';
      h += '<div class="mj-hueco"><span class="mj-hueco-vano" style="width:' +
           r.hueco + 'px"></span></div>';
      h += '<div class="mj-encajes">';
      r.piezas.forEach(function (p, i) {
        h += '<button class="mj-encaje" data-i="' + i + '" data-ok="' + (p.ok ? '1' : '0') +
             '" aria-label="pieza ' + (i + 1) + '">' +
             '<span class="mj-encaje-barra" style="width:' + p.ancho + 'px"></span></button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-i]').forEach(function (b) {
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
          setTimeout(siguiente, 800);
        });
      });
    }

    siguiente();
  }
});
