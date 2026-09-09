/* Tarea de rama — Salud y ciencias biológicas: ¿Qué se hace primero?
 *
 * Una situación de tres líneas y tres cosas que se podrían hacer. Solo una es
 * la primera. Es primeros auxilios de escuela, y está aquí por dos razones:
 * porque es lo que de verdad se estudia en esa rama, y porque las tres
 * respuestas siempre suenan razonables. Lo que se mide no es si sabe medicina,
 * es si sabe cuál va ANTES.
 *
 * Los casos están escritos con lo que hay en una casa guatemalteca —una estufa
 * de gas, una tortilla en el comal, un patojo que se cae en el patio— y no con
 * el material de un hospital.
 *
 * En básicos sale como sondeo vocacional; en la rama de salud es la materia.
 */

Minijuegos.registrar({
  id: 'primeros',
  nombre: '¿Qué se hace primero?',
  icono: 'salvavidas',
  tipo: 'clase',
  categoria: 'salud',
  desdeExperiencia: 0,
  descripcion: 'Alguien se lastimó. De tres cosas sensatas, ¿cuál va primero?',
  ensena: 'En una emergencia lo que se decide no es qué hacer, es qué hacer primero.',
  duracion: 30,
  pagoMaximo: 0,
  experienciaMaxima: 15,
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 50,

  jugar: function (caja, api) {
    /* `b` es la buena y las otras dos NO son disparates: son lo que la gente
     * hace de verdad y por eso enseñan algo al descartarse. */
    var CASOS = [
      { t: 'Tu hermanito se quemó la mano con el comal. Está rojo pero no hay ampolla.',
        b: 'Ponerle la mano bajo agua fría un buen rato',
        m: ['Untarle pasta de dientes', 'Reventarle lo que salga y vendarlo'] },
      { t: 'Se cortó con un cuchillo y la sangre no para.',
        b: 'Apretar con un trapo limpio y levantar la mano',
        m: ['Echarle alcohol y soplar', 'Lavar la herida con agua del tonel'] },
      { t: 'Un compañero se desmayó en la formación del colegio.',
        b: 'Acostarlo y levantarle las piernas',
        m: ['Sentarlo rápido y darle agua', 'Darle unas palmadas en la cara'] },
      { t: 'Alguien se atragantó comiendo y no puede toser ni hablar.',
        b: 'Abrazarlo por detrás y apretar arriba del ombligo',
        m: ['Darle agua para que pase', 'Meterle los dedos a la boca'] },
      { t: 'Se torció el tobillo jugando y ya se está hinchando.',
        b: 'Hielo envuelto en un trapo y el pie en alto',
        m: ['Sobárselo fuerte para acomodarlo', 'Ponerle agua caliente'] },
      { t: 'Le entró jabón industrial en el ojo.',
        b: 'Enjuagar con agua limpia y sin parar varios minutos',
        m: ['Taparlo con un pañuelo para que descanse', 'Frotarlo hasta que salga'] },
      { t: 'Un niño lleva dos días con diarrea y está flojo.',
        b: 'Suero oral, poquito y seguido',
        m: ['Dejar de darle líquidos para que corte', 'Darle una gaseosa'] },
      { t: 'Se golpeó la cabeza y quedó mareado, pero hablando.',
        b: 'Dejarlo quieto y vigilarlo por si vomita o se duerme raro',
        m: ['Hacerlo caminar para que reaccione', 'Ponerle un huevo crudo en el chichón'] },
      { t: 'Le picó un alacrán en el pie.',
        b: 'Mantener el pie quieto y bajo, y buscar puesto de salud',
        m: ['Chupar el veneno', 'Amarrar fuerte arriba de la picadura'] },
      { t: 'Una señora mayor se cayó y le duele mucho la cadera.',
        b: 'No moverla y pedir ayuda',
        m: ['Levantarla entre dos y sentarla', 'Darle una pastilla para el dolor'] }
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
