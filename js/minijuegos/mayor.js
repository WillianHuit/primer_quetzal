/* Tarea de básicos: ¿Cuál es más?
 *
 * Dos cantidades, y hay que decir cuál es mayor. Es lo más simple que hay en
 * todo el juego, a propósito: comparar dos números es lo que hay debajo de
 * absolutamente todo lo demás —cuál sueldo conviene, cuál préstamo cuesta
 * menos, cuál negocio deja más— y si eso no está firme, nada de lo de arriba
 * se sostiene.
 *
 * Se ponen cantidades que a primera vista engañan: Q9 contra Q11 tiene menos
 * dígitos el mayor... no, pero Q90 contra Q100 sí, y Q9.50 contra Q9.05
 * también. Ahí está la clase.
 */

Minijuegos.registrar({
  id: 'mayor',
  nombre: '¿Cuál es más?',
  icono: 'balanza',
  tipo: 'clase',
  paraCarrera: 'basicos',
  desdeExperiencia: 0,
  descripcion: 'Dos cantidades. Toca la más grande.',
  ensena: 'Comparar dos números es lo que hay debajo de todas las demás decisiones.',
  duracion: 15,
  pagoMaximo: 0,
  experienciaMaxima: 12,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 40,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    /* Tres formas de par, y las tres enseñan algo distinto:
     *   enteros    la comparación de siempre
     *   decenas    Q90 contra Q100: gana el que tiene MÁS dígitos
     *   centavos   Q9.50 contra Q9.05: aquí el truco está en el segundo decimal
     */
    function par() {
      var clase = entero(1, 3);
      if (clase === 1) {
        var a = entero(2, 60), b = entero(2, 60);
        while (b === a) b = entero(2, 60);
        return [a, b];
      }
      if (clase === 2) {
        var d = entero(7, 9) * 10;              // 70, 80, 90
        var c = entero(10, 13) * 10;             // 100, 110, 120, 130
        return Math.random() < 0.5 ? [d, c] : [c, d];
      }
      var base = entero(3, 12);
      var x = base + entero(1, 9) / 10;          // Q9.50
      var y = base + entero(1, 9) / 100;         // Q9.05
      return Math.random() < 0.5 ? [x, y] : [y, x];
    }

    function q(n) { return 'Q' + (n % 1 === 0 ? n : n.toFixed(2)); }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var p = par();
      var mayor = Math.max(p[0], p[1]);

      api.mostrar(
        '<div class="mj-versus">' +
          '<button class="mj-opcion mj-lado" data-v="' + p[0] + '">' + q(p[0]) + '</button>' +
          '<button class="mj-opcion mj-lado" data-v="' + p[1] + '">' + q(p[1]) + '</button>' +
        '</div>'
      );

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = Number(b.dataset.v) === mayor;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-v]').forEach(function (o) {
              if (Number(o.dataset.v) === mayor) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 650);
        });
      });
    }

    siguiente();
  }
});
