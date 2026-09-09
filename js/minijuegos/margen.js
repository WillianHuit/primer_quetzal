/* Tarea de rama — Administración, finanzas y comercio: ¿Cuál deja más?
 *
 * Dos productos con lo que cuestan y a cómo se venden. Hay que decir cuál deja
 * más por unidad. Es la cuenta más importante de todo el juego y la que más
 * gente hace mal: lo que deja un negocio no es lo que vende, es la diferencia,
 * y el que vende más caro no siempre es el que gana más.
 *
 * Los pares están armados para que la respuesta obvia sea la equivocada más o
 * menos la mitad de las veces: el producto de precio alto suele tener el costo
 * alto pegado detrás.
 *
 * En básicos sale como sondeo; en la rama de comercio es la materia, y es la
 * misma cuenta que después decide si su tortillería del imperio sirve o no.
 */

Minijuegos.registrar({
  id: 'margen',
  nombre: '¿Cuál deja más?',
  icono: 'etiqueta',
  tipo: 'clase',
  categoria: 'comercio',
  desdeExperiencia: 0,
  descripcion: 'Dos productos con su costo y su precio. ¿Cuál te deja más?',
  ensena: 'Lo que gana un negocio no es lo que vende: es lo que le queda.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    var COSAS = ['Refresco', 'Pan dulce', 'Tortillas', 'Jabón', 'Chicles',
                 'Huevos', 'Café', 'Recarga', 'Bolsa de agua', 'Champú',
                 'Cuaderno', 'Lapiceros', 'Aceite', 'Frijol', 'Azúcar'];

    function producto(margen) {
      var costo = entero(3, 40);
      return { nombre: '', costo: costo, precio: costo + margen };
    }

    function ronda() {
      /* Tres formas de armar el par, y las tres enseñan otra cosa:
       *   1  el caro deja menos: el precio alto arrastra un costo alto
       *   2  el barato deja menos: a veces sí es lo que parece
       *   3  precios parecidos y márgenes muy distintos */
      var clase = entero(1, 3);
      var m1, m2, a, b;
      if (clase === 1) {
        m1 = entero(2, 5); m2 = entero(8, 15);
        a = { costo: entero(30, 60), margen: m1 };     // caro y con poco margen
        b = { costo: entero(4, 12), margen: m2 };      // barato y con mucho
      } else if (clase === 2) {
        m1 = entero(10, 18); m2 = entero(2, 6);
        a = { costo: entero(25, 50), margen: m1 };
        b = { costo: entero(4, 12), margen: m2 };
      } else {
        var base = entero(12, 30);
        m1 = entero(2, 5); m2 = entero(9, 16);
        a = { costo: base, margen: m1 };
        b = { costo: base + entero(-2, 2), margen: m2 };
      }

      var bolsa = COSAS.slice();
      var n1 = bolsa.splice(entero(0, bolsa.length - 1), 1)[0];
      var n2 = bolsa.splice(entero(0, bolsa.length - 1), 1)[0];
      var uno = { n: n1, c: a.costo, p: a.costo + a.margen, m: a.margen };
      var dos = { n: n2, c: b.costo, p: b.costo + b.margen, m: b.margen };
      return Math.random() < 0.5 ? [uno, dos] : [dos, uno];
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var par = ronda();
      var mejor = par[0].m >= par[1].m ? 0 : 1;

      var h = '<div class="mj-mensaje">¿Cuál te deja más por unidad?</div>' +
              '<div class="mj-opciones">';
      par.forEach(function (p, i) {
        h += '<button class="mj-opcion" data-v="' + i + '">' +
             '<strong>' + p.n + '</strong><br>' +
             '<span class="sutil">te cuesta Q' + p.c + ' · lo vendes a Q' + p.p + '</span>' +
             '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var elegido = Number(b.dataset.v);
          if (elegido === mejor) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-v]').forEach(function (o) {
              if (Number(o.dataset.v) === mejor) o.classList.add('bien');
            });
          }
          // Aquí sí se explica: el número que hay que ver es la resta, y si no
          // se enseña, el que falló no sabe por qué falló.
          api.mostrar(caja.innerHTML +
            '<p class="sutil centrado">' + par[0].n + ' deja Q' + par[0].m + ' · ' +
            par[1].n + ' deja Q' + par[1].m + '</p>');
          setTimeout(siguiente, 1100);
        });
      });
    }

    siguiente();
  }
});
