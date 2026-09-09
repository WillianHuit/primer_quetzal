/* Tarea de rama — Agricultura y turismo: ¿Cuándo se siembra?
 *
 * Un cultivo y tres momentos. Solo uno es el bueno. Todo el contenido es de
 * Guatemala y de lo que de verdad se siembra aquí: el maíz con las primeras
 * lluvias de mayo, el café que se corta de noviembre a febrero, la milpa de
 * postrera. Un chico del interior ya sabe la mitad de estas respuestas, y esa
 * es justamente la gracia: es la única tarea del juego donde saber de dónde
 * vienes es una ventaja.
 *
 * Va con turismo en la misma rama porque en las dos se vive del calendario:
 * quien no sabe cuándo llueve no siembra y tampoco llena un hotel.
 */

Minijuegos.registrar({
  id: 'siembra',
  nombre: '¿Cuándo se siembra?',
  icono: 'palmera',
  tipo: 'clase',
  categoria: 'agro',
  desdeExperiencia: 0,
  descripcion: 'El campo se mueve con el calendario. ¿Cuándo toca cada cosa?',
  ensena: 'El que trabaja la tierra o el turismo no vende un producto: vende una temporada.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    var CASOS = [
      { t: '¿Cuándo se siembra el maíz de primera en el altiplano?',
        b: 'Con las primeras lluvias, en mayo',
        m: ['En plena seca, en febrero', 'Cuando ya llovió todo, en octubre'] },
      { t: 'La cosecha de café en Guatemala se corta sobre todo…',
        b: 'De noviembre a febrero',
        m: ['De mayo a julio', 'Todo el año por igual'] },
      { t: 'Sembraste frijol y las hojas se pusieron amarillas desde abajo.',
        b: 'Le falta alimento en la tierra',
        m: ['Le sobra sol', 'Está lista para cosechar'] },
      { t: '¿Qué conviene hacer con el rastrojo después de la cosecha?',
        b: 'Dejarlo sobre la tierra para que la cubra',
        m: ['Quemarlo para limpiar rápido', 'Sacarlo todo y dejar la tierra pelada'] },
      { t: 'Un hotel en Antigua llena más…',
        b: 'En Semana Santa y en fin de año',
        m: ['En plena lluvia de septiembre', 'Los lunes de cualquier mes'] },
      { t: '¿Por qué se siembra en curvas de nivel en la ladera?',
        b: 'Para que el agua no se lleve la tierra',
        m: ['Para que se vea ordenado', 'Para caminar más cómodo'] },
      { t: 'La milpa de postrera se siembra…',
        b: 'A finales de la lluvia, por agosto o septiembre',
        m: ['En diciembre, con el frío', 'En marzo, antes de que llueva'] },
      { t: 'Vas a vender aguacate y todos cosechan el mismo mes.',
        b: 'El precio se cae: hay más del que se puede vender',
        m: ['El precio sube porque hay más para escoger', 'El precio no se mueve'] },
      { t: '¿Para qué sirve rotar el cultivo de un año a otro?',
        b: 'Para que la tierra no se canse y bajen las plagas',
        m: ['Para confundir a los compradores', 'Para no aburrirse'] },
      { t: 'Un tour de un día a un pueblo del lago se vende mejor…',
        b: 'Reservado con tiempo y en temporada seca',
        m: ['De un día para otro en octubre', 'Solo a quien pase caminando'] }
    ];

    var pendientes = CASOS.slice();

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      if (!pendientes.length) pendientes = CASOS.slice();
      var c = pendientes.splice(Math.floor(Math.random() * pendientes.length), 1)[0];
      var ops = [c.b].concat(c.m).sort(function () { return Math.random() - 0.5; });

      var h = '<div class="mj-mensaje">' + c.t + '</div><div class="mj-opciones">';
      ops.forEach(function (o, i) {
        h += '<button class="mj-opcion" data-v="' + i + '" data-ok="' +
             (o === c.b ? '1' : '0') + '">' + o + '</button>';
      });
      api.mostrar(h + '</div>');

      var respondido = false;
      caja.querySelectorAll('[data-v]').forEach(function (b) {
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
          setTimeout(siguiente, 1000);
        });
      });
    }

    siguiente();
  }
});
