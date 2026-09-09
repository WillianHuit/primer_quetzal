/* Tarea de básicos: ¿Cuánto hay?
 *
 * Reconocer los billetes y las monedas de Guatemala y sumarlos. Es la otra
 * mitad de "sumar y restar" a esta edad: identificar la figura antes de poder
 * operar con ella.
 *
 * Se dibujan con formas, no con números sueltos, porque lo que se practica es
 * RECONOCER: el billete de veinte no se lee, se ve.
 *
 * Quince segundos, igual que la suma.
 */

Minijuegos.registrar({
  id: 'contar',
  nombre: '¿Cuánto hay?',
  icono: 'billete',
  tipo: 'clase',
  paraCarrera: 'basicos',
  desdeExperiencia: 0,
  descripcion: 'Mira los billetes y las monedas, y di cuánto suman.',
  ensena: 'Contar lo que tienes es lo primero. Nadie cuida lo que no sabe contar.',
  duracion: 15,
  pagoMaximo: 0,
  experienciaMaxima: 12,
  puntosParaPagoMaximo: 40,

  jugar: function (caja, api) {
    // Las piezas que existen de verdad en la bolsa de un chico
    var PIEZAS = [
      { v: 1,  clase: 'moneda', txt: 'Q1' },
      { v: 5,  clase: 'moneda', txt: 'Q5' },
      { v: 10, clase: 'billete', txt: 'Q10' },
      { v: 20, clase: 'billete', txt: 'Q20' },
      { v: 50, clase: 'billete', txt: 'Q50' }
    ];

    function entero(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function reparto() {
      var cuantas = entero(2, 4);
      var puestas = [];
      var total = 0;
      for (var i = 0; i < cuantas; i++) {
        var p = PIEZAS[entero(0, PIEZAS.length - 1)];
        puestas.push(p);
        total += p.v;
      }
      return { puestas: puestas, total: total };
    }

    function opciones(r) {
      var v = [r];
      var pasos = [1, 5, 10, 20];
      while (v.length < 3) {
        var d = pasos[entero(0, pasos.length - 1)] * (Math.random() < 0.5 ? -1 : 1);
        var x = r + d;
        if (x > 0 && v.indexOf(x) < 0) v.push(x);
      }
      return v.sort(function () { return Math.random() - 0.5; });
    }

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      var r = reparto();
      var h = '<div class="mj-plata">';
      r.puestas.forEach(function (p) {
        h += '<span class="mj-pieza ' + p.clase + '">' + p.txt + '</span>';
      });
      h += '</div><div class="mj-opciones">';
      opciones(r.total).forEach(function (v) {
        h += '<button class="mj-opcion" data-v="' + v + '">Q' + v + '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var acerto = Number(b.dataset.v) === r.total;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else {
            api.fallo(5); b.classList.add('mal');
            caja.querySelectorAll('[data-v]').forEach(function (o) {
              if (Number(o.dataset.v) === r.total) o.classList.add('bien');
            });
          }
          setTimeout(siguiente, 650);
        });
      });
    }

    siguiente();
  }
});
