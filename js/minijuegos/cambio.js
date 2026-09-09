/* Tarea de básicos: Da el cambio
 *
 * La más sencilla del juego y la primera que se abre, a propósito: sumar y
 * restar dinero de verdad, con precios de tienda de esquina. Suena tonto hasta
 * que uno se acuerda de que la mitad de los negocios del país se llevan en la
 * cabeza y sin caja, y que ahí es donde se pierde el margen.
 *
 * Es una CLASE: no paga, da experiencia. Y es GENERAL —`paraCarrera: 'basicos'`
 * pero sin oficio— porque dar cambio no es de ninguna carrera: es de todas.
 */

Minijuegos.registrar({
  id: 'cambio',
  nombre: 'Da el cambio',
  icono: 'moneda',
  tipo: 'clase',
  paraCarrera: 'basicos',
  descripcion: 'Te compran algo y te pagan de más. ¿Cuánto devuelves?',
  ensena: 'Si no sabes cuánto tienes que devolver, no sabes cuánto ganaste.',
  duracion: 70,
  pagoMaximo: 0,
  experienciaMaxima: 20,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {
    /* Precios de tienda, y pagos con los billetes que la gente de verdad
     * saca: 20, 50, 100. El cambio siempre da un número redondo o de cincuenta
     * centavos, porque esto es una clase de básicos y no una de contabilidad. */
    var COMPRAS = [
      { que: 'dos panes y una leche', precio: 12.50, paga: 20 },
      { que: 'una libra de frijol', precio: 8.00,  paga: 20 },
      { que: 'tres jabones', precio: 27.00, paga: 50 },
      { que: 'una gaseosa y un pan', precio: 6.50,  paga: 10 },
      { que: 'dos libras de azúcar', precio: 14.00, paga: 20 },
      { que: 'el recado y una crema', precio: 33.50, paga: 50 },
      { que: 'cinco huevos y tortillas', precio: 11.00, paga: 20 },
      { que: 'una bolsa de arroz', precio: 18.50, paga: 50 },
      { que: 'jabón, cloro y esponja', precio: 46.00, paga: 100 },
      { que: 'dos aguas y un dulce', precio: 9.50,  paga: 20 }
    ];

    var orden = COMPRAS.slice().sort(function () { return Math.random() - 0.5; });
    var i = 0;

    /* Las tres opciones son el cambio correcto y dos errores CREÍBLES: el que
     * sale de restar mal las decenas y el que sale de olvidar los centavos.
     * Un distractor absurdo no enseña nada porque nadie lo elige. */
    function opciones(c) {
      var bien = Math.round((c.paga - c.precio) * 100) / 100;
      var mal1, mal2;
      if (c.precio % 1 === 0) {
        /* Precio redondo: no hay centavos que olvidar, así que los errores
         * creíbles son los de prestar mal al restar, y esos caen a uno de
         * distancia. Poner un distractor de diez de diferencia sería regalar
         * la respuesta: nadie lo elige y el jugador no resta nada. */
        mal1 = bien + 1;
        mal2 = bien - 1 > 0 ? bien - 1 : bien + 2;
      } else {
        // Con centavos, el error de siempre es olvidarlos
        mal1 = Math.round((c.paga - Math.floor(c.precio)) * 100) / 100;
        mal2 = Math.round((bien - 1) * 100) / 100;
        if (mal2 <= 0 || mal2 === mal1) mal2 = Math.round((bien + 1) * 100) / 100;
      }
      var todas = [bien, mal1, mal2].sort(function () { return Math.random() - 0.5; });
      return { bien: bien, todas: todas };
    }

    function q(n) { return 'Q' + n.toFixed(2); }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      if (i >= orden.length) { api.terminar(); return; }
      var c = orden[i++];
      var op = opciones(c);

      var h = '<div class="mj-mensaje">Te compran <strong>' + c.que + '</strong>.<br>' +
              'Cuesta <strong>' + q(c.precio) + '</strong> y te pagan con <strong>' +
              q(c.paga) + '</strong>.</div><div class="mj-opciones">';
      op.todas.forEach(function (v) {
        h += '<button class="mj-opcion" data-v="' + v + '">' + q(v) + '</button>';
      });
      api.mostrar(h + '</div><div id="mj-explica"></div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = Number(b.dataset.v) === op.bien;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else { api.fallo(6); b.classList.add('mal'); }
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (acerto ? 'Bien.' : 'Ojo.') + '</strong> ' +
            q(c.paga) + ' menos ' + q(c.precio) + ' son <strong>' + q(op.bien) + '</strong>.' +
            (acerto ? '' : ' Devolver de más se lo come tu ganancia.') + '</div>';
          setTimeout(siguiente, 1600);
        });
      });
    }

    siguiente();
  }
});
