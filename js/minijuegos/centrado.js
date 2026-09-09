/* Tarea de rama — Arte, diseño y comunicación: ¿Cuál está centrado?
 *
 * Cuatro recuadros con una figura adentro y solo una está de verdad en el
 * centro. Las otras están corridas dos, tres o cinco unidades, que es poco: lo
 * suficiente para que se vea mal y no lo suficiente para que se note sin
 * mirar. Eso es exactamente el trabajo de un diseñador y por eso está aquí.
 *
 * Y trae suerte de la buena: cuánto se corren las malas se sortea cada ronda.
 * Una ronda con las tres corridas cinco unidades se resuelve de un vistazo;
 * una con dos corridas y algo se pelea. Dos partidas no valen lo mismo, y esa
 * es la parte de suerte que hace que la nota haya que ganársela varias veces.
 *
 * No se parece a `¿Cuál es distinto?` de básicos aunque las dos sean de mirar:
 * allí la diferencia es de categoría —otro color, otra forma— y aquí es de
 * grado. Ver que algo está torcido es otra cosa que ver que algo es otro.
 */

Minijuegos.registrar({
  id: 'centrado',
  nombre: '¿Cuál está centrado?',
  icono: 'paleta',
  tipo: 'clase',
  categoria: 'arte',
  desdeExperiencia: 0,
  descripcion: 'Cuatro recuadros. En uno solo la figura está justo en medio.',
  ensena: 'El ojo que ve dos milímetros de más es el oficio entero del diseño.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    var COLORES = ['verde', 'azul', 'ambar', 'rojo'];
    var FORMAS = ['circulo', 'cuadrado', 'rombo'];

    function ronda() {
      var color = COLORES[entero(0, COLORES.length - 1)];
      var forma = FORMAS[entero(0, FORMAS.length - 1)];
      // Cuánto se corren las malas. Cuanto más chico, más difícil la ronda.
      var salto = entero(3, 7);
      var buena = entero(0, 3);
      var celdas = [];
      for (var i = 0; i < 4; i++) {
        if (i === buena) { celdas.push({ x: 0, y: 0 }); continue; }
        // Siempre corrida de verdad: nada de desvíos de media unidad
        var dx = entero(-1, 1) * salto;
        var dy = entero(-1, 1) * salto;
        if (dx === 0 && dy === 0) dx = salto;
        celdas.push({ x: dx, y: dy });
      }
      return { celdas: celdas, buena: buena, color: color, forma: forma };
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var r = ronda();
      var h = '<div class="mj-mensaje">¿En cuál está justo en medio?</div>' +
              '<div class="mj-figuras">';
      r.celdas.forEach(function (c, i) {
        h += '<button class="mj-figura mj-marco" data-i="' + i +
             '" aria-label="recuadro ' + (i + 1) + '">' +
             '<span class="fig ' + r.forma + ' ' + r.color +
             '" style="transform:translate(' + c.x + 'px,' + c.y + 'px)"></span>' +
             '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          if (Number(b.dataset.i) === r.buena) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-i]').forEach(function (o) {
              if (Number(o.dataset.i) === r.buena) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 800);
        });
      });
    }

    siguiente();
  }
});
