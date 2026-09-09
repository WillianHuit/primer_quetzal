/* Minijuego temático básico: Cuadra el mes
 * Repartes un sueldo entre categorías y a media ronda cae un imprevisto.
 * Enseña que un presupuesto sin holgura no es un presupuesto.
 */

Minijuegos.registrar({
  id: 'presupuesto',
  nombre: 'Cuadra el mes',
  icono: 'recibo',
  tipo: 'clase',
  /* Cuadrar un sueldo entero es de diversificado, no de basicos: a los
   * trece no hay sueldo que cuadrar. Es la primera clase ESPECIALIZADA,
   * y las dos carreras de diversificado la comparten porque las dos
   * llevan contabilidad basica. */
  paraCarrera: ['bachillerato', 'perito'],
  desdeExperiencia: 0,
  descripcion: 'Reparte el sueldo. Van a caer imprevistos.',
  ensena: 'Sin un colchón, cualquier imprevisto se vuelve deuda.',
  duracion: 75,
  /* Una CLASE no paga: da experiencia. Antes esto soltaba Q420 por
   * resolver un presupuesto, y eso decia algo que no es verdad —que
   * hacer la tarea da dinero—. Lo que da la tarea es lo que despues te
   * deja entrar donde quieres entrar. */
  pagoMaximo: 0,
  experienciaMaxima: 25,
  // Al cuarto error se reprueba: la jornada se gasta y no da nada
  fallosParaPerder: 3,
  puntosParaPagoMaximo: 90,

  jugar: function (caja, api) {
    var CATEGORIAS = [
      { id: 'renta',      nombre: 'Renta y servicios', icono: 'casa', minimo: 0.35, esencial: true },
      { id: 'comida',     nombre: 'Comida',            icono: 'plato', minimo: 0.20, esencial: true },
      { id: 'transporte', nombre: 'Transporte',        icono: 'bus', minimo: 0.08, esencial: true },
      { id: 'ocio',       nombre: 'Gustos',            icono: 'confeti', minimo: 0,    esencial: false },
      { id: 'colchon',    nombre: 'Fondo de emergencia', icono: 'salvavidas', minimo: 0,  esencial: false }
    ];

    var IMPREVISTOS = [
      { t: 'Se te descompuso el celular', costo: 0.12 },
      { t: 'Cumpleaños en la familia', costo: 0.07 },
      { t: 'Subió el pasaje', costo: 0.05 },
      { t: 'Consulta médica', costo: 0.10 },
      { t: 'Se quemó el foco de la sala y hay que llamar al electricista', costo: 0.06 }
    ];

    var ronda = 0;

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      ronda++;
      var sueldo = 2500 + Math.round(Math.random() * 30) * 50;
      var asignado = {};
      CATEGORIAS.forEach(function (c) { asignado[c.id] = 0; });

      dibujar();

      function restante() {
        var usado = 0;
        CATEGORIAS.forEach(function (c) { usado += asignado[c.id]; });
        return sueldo - usado;
      }

      function dibujar() {
        var html = '<p class="mj-instruccion">Sueldo del mes: <strong>Q' + sueldo +
                   '</strong><br><span class="sutil">Te queda por repartir: <strong id="mj-resta">Q' +
                   restante() + '</strong></span></p><div class="mj-presu">';
        CATEGORIAS.forEach(function (c) {
          html += '<div class="mj-cat">' +
            '<div class="mj-cat-nom">' + Ico(c.icono) + ' ' + c.nombre +
              (c.esencial ? ' <span class="etiqueta">mínimo Q' + Math.round(sueldo * c.minimo) + '</span>' : '') +
            '</div>' +
            '<div class="mj-cat-ctrl">' +
              '<button data-menos="' + c.id + '">−</button>' +
              '<span class="mj-cat-val" id="v-' + c.id + '">Q' + asignado[c.id] + '</span>' +
              '<button data-mas="' + c.id + '">+</button>' +
            '</div></div>';
        });
        html += '</div><button class="btn-primario" id="mj-listo">Cerrar el mes</button>';
        api.mostrar(html);

        caja.querySelectorAll('[data-mas]').forEach(function (b) {
          b.addEventListener('click', function () {
            var paso = 100;
            if (restante() >= paso) { asignado[b.dataset.mas] += paso; refrescar(); }
          });
        });
        caja.querySelectorAll('[data-menos]').forEach(function (b) {
          b.addEventListener('click', function () {
            var id = b.dataset.menos;
            if (asignado[id] >= 100) { asignado[id] -= 100; refrescar(); }
          });
        });
        caja.querySelector('#mj-listo').addEventListener('click', evaluar);
      }

      function refrescar() {
        CATEGORIAS.forEach(function (c) {
          var el = caja.querySelector('#v-' + c.id);
          if (el) el.textContent = 'Q' + asignado[c.id];
        });
        var r = caja.querySelector('#mj-resta');
        if (r) r.textContent = 'Q' + restante();
      }

      function evaluar() {
        var falla = null;
        for (var i = 0; i < CATEGORIAS.length; i++) {
          var c = CATEGORIAS[i];
          if (c.esencial && asignado[c.id] < sueldo * c.minimo) {
            falla = 'No cubriste lo mínimo de ' + c.nombre.toLowerCase() + '.';
            break;
          }
        }
        var imp = IMPREVISTOS[Math.floor(Math.random() * IMPREVISTOS.length)];
        var costo = Math.round(sueldo * imp.costo);
        var colchon = asignado.colchon;
        var texto, gano;

        if (falla) {
          api.fallo(10); texto = falla; gano = false;
        } else if (colchon >= costo) {
          api.puntos(15); gano = true;
          texto = imp.t + ' costó Q' + costo + '. Tu fondo de emergencia lo cubrió sin despeinarte.';
        } else if (colchon + asignado.ocio >= costo) {
          api.puntos(6); gano = true;
          texto = imp.t + ' costó Q' + costo + '. Alcanzó, pero tuviste que sacrificar tus gustos.';
        } else {
          api.fallo(8); gano = false;
          texto = imp.t + ' costó Q' + costo + ' y no tenías con qué. Eso se paga con deuda cara.';
        }

        api.mostrar('<div class="aprendizaje"><strong>' + (gano ? 'Bien.' : 'Ahí está.') + '</strong> ' +
                    texto + '</div>');
        setTimeout(siguiente, 2400);
      }
    }

    siguiente();
  }
});
