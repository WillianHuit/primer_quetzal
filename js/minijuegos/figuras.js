/* Tarea de básicos: ¿Cuál es distinto?
 *
 * Cuatro figuras, tres iguales y una que no. Es una tarea de primero de
 * primaria y está aquí a propósito, porque lo que entrena no es geometría: es
 * FIJARSE. La diferencia es pequeña —un lado, una esquina, un color— y hay
 * quince segundos.
 *
 * Y no está suelta: es la primera de un hilo que acaba en `Caza-estafas`, la
 * última tarea de básicos, donde lo que hay que ver es que un mensaje se
 * parece mucho al del banco pero no es. El que no se fija, cae.
 */

Minijuegos.registrar({
  id: 'figuras',
  nombre: '¿Cuál es distinto?',
  icono: 'escuadra',
  tipo: 'clase',
  paraCarrera: 'basicos',
  desdeExperiencia: 0,
  descripcion: 'Tres figuras iguales y una que no. Encuéntrala.',
  ensena: 'Fijarse en el detalle chico es lo que después te salva de una estafa.',
  duracion: 15,
  pagoMaximo: 0,
  experienciaMaxima: 12,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 40,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    /* Las formas se dibujan con CSS, no con imágenes: pesan nada y se pueden
     * variar de color y tamaño sin volver a dibujar nada. */
    var FORMAS = ['circulo', 'cuadrado', 'triangulo', 'rombo'];
    var COLORES = ['verde', 'azul', 'ambar', 'rojo'];

    function ronda() {
      var forma = FORMAS[entero(0, FORMAS.length - 1)];
      var color = COLORES[entero(0, COLORES.length - 1)];
      var comun = { forma: forma, color: color };

      // El distinto cambia UNA sola cosa: la forma o el color, nunca las dos
      var raro;
      if (Math.random() < 0.5) {
        var otraForma = forma;
        while (otraForma === forma) otraForma = FORMAS[entero(0, FORMAS.length - 1)];
        raro = { forma: otraForma, color: color };
      } else {
        var otroColor = color;
        while (otroColor === color) otroColor = COLORES[entero(0, COLORES.length - 1)];
        raro = { forma: forma, color: otroColor };
      }

      var cuales = [comun, comun, comun];
      var donde = entero(0, 3);
      cuales.splice(donde, 0, raro);
      return { cuales: cuales, donde: donde };
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var r = ronda();
      var h = '<div class="mj-figuras">';
      r.cuales.forEach(function (f, i) {
        h += '<button class="mj-figura" data-i="' + i + '" aria-label="figura ' + (i + 1) + '">' +
             '<span class="fig ' + f.forma + ' ' + f.color + '"></span></button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = Number(b.dataset.i) === r.donde;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-i]').forEach(function (o) {
              if (Number(o.dataset.i) === r.donde) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 650);
        });
      });
    }

    siguiente();
  }
});
