/* Tarea de rama — Tecnología e informática: Sigue la secuencia
 *
 * Cuatro números con una regla detrás y hay que decir cuál viene después. No
 * enseña a programar: enseña lo único que hay debajo de programar, que es ver
 * el patrón antes de escribir nada.
 *
 * Sale en dos sitios y por dos motivos distintos. En BÁSICOS, porque es donde
 * el juego averigua para qué es bueno el jugador: la nota que saque aquí es la
 * que después va a poner Tecnología arriba o abajo en la lista de carreras. Y
 * en su propia rama, porque ahí ya es la materia.
 *
 * Y trae algo de suerte, a propósito. Las reglas no salen todas igual de
 * fáciles —sumar de tres en tres no es alternar dos series— así que dos
 * partidas de la misma tarea no valen lo mismo. Es lo que hace que la nota
 * tenga que ganarse varias veces y no de una.
 */

Minijuegos.registrar({
  id: 'logica',
  nombre: 'Sigue la secuencia',
  icono: 'engranaje',
  tipo: 'clase',
  categoria: 'tecnologia',
  desdeExperiencia: 0,
  descripcion: 'Cuatro números con una regla escondida. ¿Cuál sigue?',
  ensena: 'Ver el patrón antes de tocar nada es la mitad de programar.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    /* Cinco reglas, de la más obvia a la que hay que mirar dos veces.
     * Cada una devuelve la serie y el número que sigue. */
    function serie() {
      var clase = entero(1, 5);
      var a, p, s, i;

      if (clase === 1) {                       // sumar siempre lo mismo
        a = entero(2, 9); p = entero(2, 6);
        s = [a, a + p, a + 2 * p, a + 3 * p];
        return { s: s, r: a + 4 * p };
      }
      if (clase === 2) {                       // doblar
        a = entero(1, 5);
        s = [a, a * 2, a * 4, a * 8];
        return { s: s, r: a * 16 };
      }
      if (clase === 3) {                       // restar siempre lo mismo
        p = entero(2, 5); a = p * 5 + entero(1, 6);
        s = [a, a - p, a - 2 * p, a - 3 * p];
        return { s: s, r: a - 4 * p };
      }
      if (clase === 4) {                       // el paso crece: 1, 2, 3, 4...
        a = entero(1, 6); s = [a]; var n = a;
        for (i = 1; i <= 3; i++) { n += i; s.push(n); }
        return { s: s, r: n + 4 };
      }
      // Dos series metidas una dentro de otra: la de las posiciones impares
      // sube y la de las pares baja. Esta es la que separa.
      var x = entero(2, 8), y = entero(12, 20), q = entero(2, 4);
      s = [x, y, x + q, y - q];
      return { s: s, r: x + 2 * q };
    }

    function opciones(r) {
      var v = [r];
      var intentos = 0;
      while (v.length < 3 && intentos < 40) {
        intentos++;
        var d = entero(1, 4) * (Math.random() < 0.5 ? -1 : 1);
        var x = r + d;
        if (x > 0 && v.indexOf(x) < 0) v.push(x);
      }
      while (v.length < 3) v.push(r + v.length * 7);
      return v.sort(function () { return Math.random() - 0.5; });
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var q = serie();
      var h = '<div class="mj-mensaje mj-grande">' + q.s.join('  ·  ') + '  ·  ?</div>' +
              '<div class="mj-opciones">';
      opciones(q.r).forEach(function (v) {
        h += '<button class="mj-opcion" data-v="' + v + '">' + v + '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          if (Number(b.dataset.v) === q.r) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-v]').forEach(function (o) {
              if (Number(o.dataset.v) === q.r) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 750);
        });
      });
    }

    siguiente();
  }
});
