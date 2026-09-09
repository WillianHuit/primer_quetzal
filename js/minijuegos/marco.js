/* Mi Primer Quetzal — marco común de minijuegos
 *
 * Agregar un minijuego nuevo es escribir un archivo y llamar a registrar().
 * El marco se encarga del contenedor, el cronómetro, el marcador y el pago.
 *
 * Contrato de cada minijuego:
 *   { id, nombre, icono, tipo, descripcion, enseña, pagoMaximo,
 *     requiereNivel (opcional), jugar(caja, api) }
 *
 * La funcion jugar() recibe:
 *   caja  elemento donde dibujar
 *   api   { puntos(n), terminar(), tiempoRestante(), mostrar(html) }
 */

var Minijuegos = (function () {

  var registro = [];

  function registrar(def) { registro.push(def); }

  function todos() { return registro.slice(); }

  function porId(id) {
    for (var i = 0; i < registro.length; i++) if (registro[i].id === id) return registro[i];
    return null;
  }

  /* Que puede hacer el jugador ahora mismo.
   *
   * Hay dos ejes y no se parecen:
   *
   *   requiereNivel / requiereCarrera  son de los TRABAJOS de oficio. Se
   *       abren con el titulo ya en la mano: la conciliacion bancaria la hace
   *       quien YA es administrador.
   *   paraCarrera  es de las CLASES. Se abre mientras estas INSCRITO en esa
   *       carrera, no despues: la tarea de basicos se hace en basicos. Una
   *       clase sin `paraCarrera` es general y sale en cualquier carrera.
   *
   * Es la diferencia entre "ya lo aprendi" y "lo estoy aprendiendo", y por eso
   * son dos campos y no uno.
   */
  function disponibles(nivelEducativo, carrerasTerminadas, carreraActual, experiencia) {
    var orden = NIVELES_EDUCATIVOS;
    var hechas = carrerasTerminadas || [];
    var xp = experiencia || 0;
    return registro.filter(function (j) {
      if (j.requiereNivel && orden.indexOf(nivelEducativo) < orden.indexOf(j.requiereNivel)) return false;
      if (j.requiereCarrera && hechas.indexOf(j.requiereCarrera) < 0) return false;
      if (j.paraCarrera) {
        var para = [].concat(j.paraCarrera);
        if (!carreraActual || para.indexOf(carreraActual) < 0) return false;
      }
      /* Y las clases de una misma carrera tienen su propio orden.
       *
       * Basicos dura tres anos y no puede empezar con la tarea de calcular el
       * cambio de una compra con centavos: eso no es la primera clase, es la
       * quinta. Se empieza sumando, y las de mas arriba se abren con la
       * experiencia que dieron las de abajo. */
      if (j.desdeExperiencia && xp < j.desdeExperiencia) return false;
      return true;
    });
  }

  /* Lanza un minijuego. Llama alTerminar({ puntos, aciertos, total, pago, texto }). */
  function lanzar(id, caja, alTerminar) {
    var def = porId(id);
    if (!def) return;

    var puntos = 0, aciertos = 0, total = 0, terminado = false;
    var duracion = def.duracion || 45;
    var restante = duracion;

    caja.innerHTML =
      '<div class="mj-cabecera">' +
        '<span class="mj-nombre">' + Ico(def.icono) + ' ' + def.nombre + '</span>' +
        '<span class="mj-reloj" id="mj-reloj">' + duracion + 's</span>' +
      '</div>' +
      '<div class="mj-marcador"><span id="mj-puntos">0</span> puntos</div>' +
      '<div class="mj-lienzo" id="mj-lienzo"></div>';

    var lienzo = caja.querySelector('#mj-lienzo');
    var elReloj = caja.querySelector('#mj-reloj');
    var elPuntos = caja.querySelector('#mj-puntos');

    var cronometro = setInterval(function () {
      restante--;
      elReloj.textContent = restante + 's';
      if (restante <= 5) elReloj.classList.add('urgente');
      if (restante <= 0) terminar();
    }, 1000);

    var api = {
      puntos: function (n, acerto) {
        puntos += n;
        total++;
        if (acerto !== false) aciertos++;
        if (puntos < 0) puntos = 0;
        elPuntos.textContent = puntos;
        Sonido.tono(acerto === false ? 'error' : 'acierto');
      },
      fallo: function (n) { api.puntos(-Math.abs(n || 0), false); },
      tiempoRestante: function () { return restante; },
      mostrar: function (html) { lienzo.innerHTML = html; },
      lienzo: lienzo,
      terminar: function () { terminar(); }
    };

    function terminar() {
      if (terminado) return;
      terminado = true;
      clearInterval(cronometro);
      var precision = total > 0 ? aciertos / total : 0;
      var pago = Math.round(def.pagoMaximo * Math.max(0, Math.min(1, puntos / (def.puntosParaPagoMaximo || 100))));
      alTerminar({
        id: def.id, puntos: puntos, aciertos: aciertos, total: total,
        precision: precision, pago: pago, def: def
      });
    }

    def.jugar(lienzo, api);
  }

  return { registrar: registrar, todos: todos, porId: porId, disponibles: disponibles, lanzar: lanzar };
})();
