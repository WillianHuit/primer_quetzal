/* Tarea de básicos: ¿Cuál conviene?
 *
 * Dos presentaciones del mismo producto, distinto tamaño y distinto precio.
 * Hay que decir cuál sale más barato POR UNIDAD, que es la única comparación
 * que sirve y la que casi nadie hace en la tienda.
 *
 * Y a propósito no siempre gana la bolsa grande: en la tienda de la esquina el
 * paquete familiar a veces sale más caro por libra que el chico. Si el juego
 * premiara siempre "compra el grande" estaría enseñando una regla falsa.
 *
 * Es una CLASE de básicos: no paga, da experiencia.
 */

Minijuegos.registrar({
  id: 'precios',
  nombre: '¿Cuál conviene?',
  icono: 'balanza',
  tipo: 'clase',
  paraCarrera: 'basicos',
  descripcion: 'Dos tamaños, dos precios. Elige el que sale más barato.',
  ensena: 'Lo barato no es el precio: es el precio por unidad. Y el paquete grande no siempre gana.',
  duracion: 70,
  pagoMaximo: 0,
  experienciaMaxima: 20,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {
    var PARES = [
      { que: 'Arroz',   a: { t: '1 libra',    p: 7.00,  u: 1 },  b: { t: '5 libras',   p: 32.00, u: 5 } },
      { que: 'Jabón',   a: { t: '1 barra',    p: 6.50,  u: 1 },  b: { t: '3 barras',   p: 21.00, u: 3 } },
      { que: 'Aceite',  a: { t: '400 ml',     p: 12.00, u: 400 }, b: { t: '900 ml',    p: 24.00, u: 900 } },
      { que: 'Frijol',  a: { t: '1 libra',    p: 8.00,  u: 1 },  b: { t: '4 libras',   p: 34.00, u: 4 } },
      { que: 'Papel',   a: { t: '4 rollos',   p: 18.00, u: 4 },  b: { t: '12 rollos',  p: 60.00, u: 12 } },
      { que: 'Leche',   a: { t: '1 litro',    p: 11.00, u: 1 },  b: { t: '2 litros',   p: 23.00, u: 2 } },
      { que: 'Azúcar',  a: { t: '2 libras',   p: 13.00, u: 2 },  b: { t: '5 libras',   p: 30.00, u: 5 } },
      { que: 'Café',    a: { t: '100 gramos', p: 9.00,  u: 100 }, b: { t: '450 gramos', p: 45.00, u: 450 } }
    ];

    var orden = PARES.slice().sort(function () { return Math.random() - 0.5; });
    var i = 0;

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      if (i >= orden.length) { api.terminar(); return; }
      var par = orden[i++];
      var ua = par.a.p / par.a.u;
      var ub = par.b.p / par.b.u;
      var gana = ua <= ub ? 'a' : 'b';

      function texto(o) { return o.t + ' por Q' + o.p.toFixed(2); }

      api.mostrar(
        '<div class="mj-mensaje"><strong>' + par.que + '</strong>. ¿Cuál sale más barato?</div>' +
        '<div class="mj-opciones">' +
          '<button class="mj-opcion" data-r="a">' + texto(par.a) + '</button>' +
          '<button class="mj-opcion" data-r="b">' + texto(par.b) + '</button>' +
        '</div><div id="mj-explica"></div>'
      );

      var respondido = false;
      caja.querySelectorAll('[data-r]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = b.dataset.r === gana;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else { api.fallo(6); b.classList.add('mal'); }
          /* La explicación siempre da los DOS precios por unidad, acierte o
           * no: lo que hay que aprender es la división, no la respuesta.
           *
           * Y se expresa en una medida que se pueda leer. Un aceite a
           * "Q0.030 por mililitro" no le dice nada a nadie; a "Q3.00 por cada
           * 100 ml", sí. Se escala cuando la unidad es chica. */
          var escala = Math.max(par.a.u, par.b.u) > 10 ? 100 : 1;
          var comoSeLlama = escala === 100 ? 'cada 100' : 'unidad';
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (acerto ? 'Bien.' : 'Ojo.') + '</strong> ' +
            texto(par.a) + ' son Q' + (ua * escala).toFixed(2) + ' por ' + comoSeLlama + '; ' +
            texto(par.b) + ' son Q' + (ub * escala).toFixed(2) + '. ' +
            (gana === 'a' ? 'Gana el chico.' : 'Gana el grande.') + '</div>';
          setTimeout(siguiente, 2100);
        });
      });
    }

    siguiente();
  }
});
