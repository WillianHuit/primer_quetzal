/* Minijuego temático básico: Caza-estafas
 * Distinguir un mensaje legítimo de uno fraudulento.
 * Solo el 53.3% de los guatemaltecos sabría a quién reclamar si lo estafan,
 * asi que reconocer el fraude es la puerta de entrada a todo lo demas.
 */

Minijuegos.registrar({
  id: 'estafas',
  nombre: 'Caza-estafas',
  icono: 'anzuelo',
  tipo: 'clase',
  descripcion: 'Te llegan mensajes. Decide cuáles son fraude.',
  ensena: 'Ningún banco pide claves por mensaje, y la urgencia es la señal de alarma.',
  duracion: 60,
  /* Una CLASE no paga: da experiencia. Antes esto soltaba Q400 por
   * resolver un presupuesto, y eso decia algo que no es verdad —que
   * hacer la tarea da dinero—. Lo que da la tarea es lo que despues te
   * deja entrar donde quieres entrar. */
  pagoMaximo: 0,
  experienciaMaxima: 25,
  puntosParaPagoMaximo: 100,

  jugar: function (caja, api) {
    var MENSAJES = [
      { t: 'Banco Cardamomo: su cuenta será BLOQUEADA en 2 horas. Confirme su clave aquí: bit.ly/crd-verif',
        fraude: true, por: 'Urgencia falsa, enlace acortado y te piden la clave.' },
      { t: 'Banco Cardamomo: se realizó un retiro de Q450 en cajero Zona 10. Si no lo reconoce, llame al número al reverso de su tarjeta.',
        fraude: false, por: 'Solo informa y te manda al número oficial de tu tarjeta.' },
      { t: 'FELICIDADES! Ganó Q50,000 en el sorteo. Solo deposite Q500 de gestión para liberar su premio.',
        fraude: true, por: 'Nadie cobra por entregarte un premio que ganaste.' },
      { t: 'Su estado de cuenta de septiembre ya está disponible en la app.',
        fraude: false, por: 'No pide nada ni tiene enlaces raros.' },
      { t: 'Soy del Banco Cardamomo. Para cancelar el cargo no reconocido necesito el código que le acaba de llegar por SMS.',
        fraude: true, por: 'El código de un solo uso no se comparte con nadie, ni con el banco.' },
      { t: 'Recordatorio: su cuota de préstamo vence el 5. Puede pagar en la app o en agencia.',
        fraude: false, por: 'Recordatorio normal, sin pedir datos.' },
      { t: 'Su tarjeta fue clonada. Envíe foto del frente y reverso para bloquearla de inmediato.',
        fraude: true, por: 'La foto del reverso entrega el código de seguridad. Nunca se manda.' },
      { t: 'Cambiamos nuestro horario de atención. Consulte agencias en cardamomo.com.gt',
        fraude: false, por: 'Aviso informativo con el dominio real del banco.' },
      { t: 'Oferta EXCLUSIVA hoy: duplicamos su ahorro si transfiere a esta cuenta personal.',
        fraude: true, por: 'Un banco jamás te pide transferir a una cuenta personal.' },
      { t: 'Su solicitud de aumento de límite fue recibida. Le avisaremos en 3 días hábiles.',
        fraude: false, por: 'Responde a algo que tú iniciaste y no pide datos.' }
    ];

    var orden = MENSAJES.slice().sort(function () { return Math.random() - 0.5; });
    var i = 0;

    function siguiente() {
      if (api.tiempoRestante() <= 0) return;
      if (i >= orden.length) { api.terminar(); return; }
      var msg = orden[i++];

      api.mostrar(
        '<div class="mj-mensaje">' + msg.t + '</div>' +
        '<div class="mj-opciones">' +
          '<button class="mj-opcion peligro" data-r="1">' + Ico('bandera') + ' Es estafa</button>' +
          '<button class="mj-opcion" data-r="0">' + Ico('visto') + ' Es legítimo</button>' +
        '</div><div id="mj-explica"></div>'
      );

      var respondido = false;
      caja.querySelectorAll('[data-r]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var dijoFraude = b.dataset.r === '1';
          var acerto = dijoFraude === msg.fraude;
          if (acerto) { api.puntos(10); b.classList.add('bien'); }
          else { api.fallo(8); b.classList.add('mal'); }
          caja.querySelector('#mj-explica').innerHTML =
            '<div class="aprendizaje"><strong>' + (acerto ? 'Bien.' : 'Ojo.') + '</strong> ' + msg.por + '</div>';
          setTimeout(siguiente, 1900);
        });
      });
    }

    siguiente();
  }
});
