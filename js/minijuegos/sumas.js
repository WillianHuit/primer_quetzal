/* Tarea de básicos, la primera de todas: Suma rápida
 *
 * Sumar y restar quetzales de una cifra o dos. Nada más. Es deliberadamente
 * la tarea más tonta del juego, porque es la primera que ve un chico de trece
 * recién salido de primaria, y la anterior primera tarea le pedía calcular el
 * cambio de una compra con centavos: eso no es la primera clase, es la quinta.
 *
 * Dura QUINCE SEGUNDOS. Una tarea de este nivel se hace de memoria o no se
 * hace; darle un minuto la convierte en un trámite y al jugador en un lector
 * de pantallas de espera.
 */

Minijuegos.registrar({
  id: 'sumas',
  nombre: 'Suma rápida',
  icono: 'mas',
  tipo: 'clase',
  paraCarrera: 'basicos',
  desdeExperiencia: 0,
  descripcion: 'Sumas y restas de quetzales, contra reloj.',
  ensena: 'Todo lo demás del dinero se apoya en esto.',
  duracion: 15,
  pagoMaximo: 0,
  experienciaMaxima: 12,
  /* Cuatro aciertos llenan la barra. Con quince segundos no da para diez, y
   * dejar el tope en cien haría que la tarea nunca pague completo. */
  puntosParaPagoMaximo: 40,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    /* Se generan al vuelo y no salen de una lista: son operaciones, no
     * contenido, y una lista fija se aprende de memoria en tres partidas. */
    function pregunta() {
      var suma = Math.random() < 0.55;
      var a, b;
      if (suma) {
        a = entero(3, 25); b = entero(2, 20);
        return { t: 'Q' + a + ' + Q' + b, r: a + b };
      }
      // En la resta el primero SIEMPRE es mayor: a esta edad no hay negativos
      a = entero(8, 40); b = entero(2, a - 1);
      return { t: 'Q' + a + ' − Q' + b, r: a - b };
    }

    function opciones(r) {
      var v = [r];
      while (v.length < 3) {
        // Los errores creíbles caen cerca: prestar mal, contar de más
        var d = entero(1, 4) * (Math.random() < 0.5 ? -1 : 1);
        var x = r + d;
        if (x > 0 && v.indexOf(x) < 0) v.push(x);
      }
      return v.sort(function () { return Math.random() - 0.5; });
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var q = pregunta();
      var h = '<div class="mj-mensaje mj-grande">' + q.t + '</div><div class="mj-opciones">';
      opciones(q.r).forEach(function (v) {
        h += '<button class="mj-opcion" data-v="' + v + '">Q' + v + '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = Number(b.dataset.v) === q.r;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else { api.fallo(5); b.classList.add('mal'); }
          /* Sin explicación: la respuesta correcta se marca y se pasa. En una
           * suma no hay nada que explicar, y un cartel de dos segundos se
           * comería la mitad de los quince que dura la tarea. */
          if (!acerto) {
            caja.querySelectorAll('[data-v]').forEach(function (o) {
              if (Number(o.dataset.v) === q.r) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 650);
        });
      });
    }

    siguiente();
  }
});
