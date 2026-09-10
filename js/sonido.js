/* Mi Primer Quetzal — sonido
 * Efectos generados por el navegador. Cero archivos, cero peso, cero descargas.
 * Silenciado por defecto: mucha gente juega en el bus.
 */

var Sonido = (function () {

  var CLAVE = 'miPrimerQuetzal.sonido';
  var ctx = null;
  var activo = false;

  try { activo = localStorage.getItem(CLAVE) === '1'; } catch (e) {}

  var TONOS = {
    acierto:  { notas: [660, 880],        dur: 0.10, tipo: 'sine' },
    error:    { notas: [220, 165],        dur: 0.14, tipo: 'square' },
    moneda:   { notas: [880, 1175, 1568], dur: 0.07, tipo: 'triangle' },
    logro:    { notas: [523, 659, 784, 1047], dur: 0.11, tipo: 'sine' },
    alerta:   { notas: [400, 300, 400],   dur: 0.12, tipo: 'sawtooth' },
    toque:    { notas: [520],             dur: 0.04, tipo: 'sine' },

    /* ---- los del tablero ----
     * El dado: cuatro golpes secos y graves, que es un cubo cayendo en la
     * mesa. No es una nota, es un ruido, y por eso va en cuadrada y bajo.
     *
     * El paso: una sola nota corta. Suena una por casilla y se le pasa un
     * numero de semitonos que sube con cada paso, asi que un seis no suena
     * seis veces igual: suena como una escalerita que sube. El oido cuenta
     * los pasos aunque no los este mirando.
     *
     * Y los dos que dicen que paso, que son los que el jugador va a recordar:
     * `alegre` sube en acorde mayor y `triste` baja en menor. No hacen falta
     * palabras para saber cual de los dos te toco. */
    dado:     { notas: [170, 230, 190, 250], dur: 0.035, tipo: 'square' },
    paso:     { notas: [660],             dur: 0.05, tipo: 'triangle' },
    alegre:   { notas: [587, 740, 880, 1175], dur: 0.09, tipo: 'triangle' },
    triste:   { notas: [494, 440, 370, 294], dur: 0.15, tipo: 'sine' }
  };

  function contexto() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }

  /* `semitonos` sube o baja el tono entero sin tocar la tabla de arriba. Lo
   * usa el paseo de la ficha: el mismo sonido, un semitono mas alto en cada
   * casilla. Doce semitonos son una octava, de ahi el 2^(n/12). */
  function tono(nombre, semitonos) {
    if (!activo) return;
    var def = TONOS[nombre];
    if (!def) return;
    var c = contexto();
    if (!c) return;
    var factor = semitonos ? Math.pow(2, semitonos / 12) : 1;

    def.notas.forEach(function (hz0, i) {
      var hz = hz0 * factor;
      var osc = c.createOscillator();
      var vol = c.createGain();
      osc.type = def.tipo;
      osc.frequency.value = hz;
      var t0 = c.currentTime + i * def.dur;
      vol.gain.setValueAtTime(0.0001, t0);
      vol.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
      vol.gain.exponentialRampToValueAtTime(0.0001, t0 + def.dur);
      osc.connect(vol); vol.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + def.dur + 0.02);
    });
  }

  function alternar() {
    activo = !activo;
    try { localStorage.setItem(CLAVE, activo ? '1' : '0'); } catch (e) {}
    if (activo) tono('toque');
    return activo;
  }

  return {
    tono: tono,
    alternar: alternar,
    activo: function () { return activo; }
  };
})();
