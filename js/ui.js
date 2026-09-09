/* Mi Primer Quetzal — interfaz
 *
 * Pestañas abajo, tarjetas superpuestas para las decisiones.
 * Todo texto visible pasa por T(). La clave es la frase en español, así que
 * el juego funciona completo aunque falte una traducción.
 */

var UI = (function () {

  var pestana = 'casa';
  var espacioSel = null;
  /* Qué hoja de negocio está abierta debajo de la calle, si alguna.
   * Un id de tipo administra ese negocio; 'abrir' muestra qué se puede abrir.
   *
   * Es una hoja DENTRO de la pantalla y no una ventana encima a propósito:
   * subir de nivel o contratar vuelven a pintar la pantalla entera, y una
   * ventana flotante se quedaría con las cifras viejas debajo del dedo. */
  var hojaNegocio = null;
  var app;

  /* El orden importa: de el sale el sentido en que se desliza la vista al
   * cambiar de pestaña. Tocar una pestaña de la derecha entra desde la
   * derecha, y al revés. Sin eso el cambio no se siente como un lugar al que
   * te moviste, solo como un parpadeo. */
  /* El estudio va antes que el trabajo porque ese es el orden en que se
   * viven: a los 13 la decisión es el colegio, y el trabajo viene después. */
  var ORDEN = ['casa', 'estudio', 'trabajo', 'mejoras', 'banco', 'extra', 'noticias'];
  var sentido = 0;        // -1 izquierda, +1 derecha, 0 sin animación
  var pestanaPrevia = 'casa';

  /* Las pestañas que hoy existen. El mes está siempre; las demás se abren por
   * la ruta de datos/progreso.js. Todo lo que reparte ancho o calcula el
   * sentido del deslizamiento se cuenta sobre ESTA lista, no sobre las cinco,
   * porque si no la marca de la pestaña activa apunta a un hueco. */
  function ordenVisible() {
    return ORDEN.filter(function (id) {
      return id === 'casa' || Motor.desbloqueado(id);
    });
  }

  /* Cambia de pestaña calculando el sentido. Lo usan tanto la barra de abajo
   * como la guía del primer turno, para que las dos se vean igual. */
  function irAPestana(id) {
    if (!id || id === pestana) { sentido = 0; return; }
    var orden = ordenVisible();
    var de = orden.indexOf(pestana), a = orden.indexOf(id);
    sentido = (de < 0 || a < 0 || a > de) ? 1 : -1;
    pestanaPrevia = pestana;
    pestana = id;
    espacioSel = null;
    subDe.trabajo = null; subDe.banco = null; verDetalle = false;
  }

  // Plantillas de las lecciones del reporte. El motor devuelve clave y datos.
  var LECCIONES = {
    fuga: 'Se te fueron {0} en gastos hormiga del efectivo. Ese dinero no compró nada que recuerdes.',
    intereses: 'Pagaste {0} de intereses y ganaste solo {1}. El crédito te costó mucho más de lo que el ahorro te dio.',
    remesas: 'Las comisiones de las remesas te costaron {0}. Cobrarlas en cuenta cuesta la mitad.',
    sinHistorial: 'Tu historial de crédito quedó corto. Sin historial, cuando de verdad necesites un préstamo, la única puerta abierta va a ser la cara.',
    licenciatura: 'Te graduaste de licenciatura. En Guatemala eso sube el ingreso mediano apenas 13% sobre un bachiller. El salto real está en la maestría.',
    informal: 'Terminaste en empleo informal. Ganaste más en la mano cada mes, pero sin Bono 14, sin aguinaldo, sin seguro y sin forma de comprobar ingresos.',
    casaPagada: 'Terminaste de pagar tu casa y vale {0}. Es lo más grande que va a construir la mayoría de la gente, y lo lograste.',
    casaConDeuda: 'Tienes casa propia pero todavía debes {0} de hipoteca. La casa es tuya el día que termines de pagarla, no el día que te dan las llaves.',
    pension: 'Aportaste {0} a tu pensión y terminaste con {1}. La diferencia no la pusiste tú, la puso el tiempo.',
    comisionesEnvio: 'Las comisiones de tus envíos se llevaron {0} de los {1} que mandaste. Mandar por app en vez de ventanilla cuesta la cuarta parte.',
    bien: 'Vas bien. Sigue apartando antes de gastar y cuidando tu historial.'
  };

  /* El signo va antes de la Q. "Q-2,312" se lee como un codigo; "-Q2,312"
   * se lee como lo que es. */
  function Q(n) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    var loc = Idioma.actual() === 'en' ? 'en-US' : 'es-GT';
    var v = Number(n);
    return (v < 0 ? '-Q' : 'Q') +
           Math.abs(v).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function Q0(n) {
    var loc = Idioma.actual() === 'en' ? 'en-US' : 'es-GT';
    var v = Math.round(Number(n) || 0);
    return (v < 0 ? '-Q' : 'Q') + Math.abs(v).toLocaleString(loc);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pct(n) { return Math.round(n * 100) + '%'; }

  /* Una pastilla: icono + dato, sin etiqueta.
   *
   * Reemplaza a las filas de "Etiqueta ....... valor" en las listas largas.
   * Tres pastillas se leen de un vistazo; tres filas de texto hay que leerlas.
   */
  function pastilla(icono, texto, clase) {
    return '<span class="pastilla' + (clase ? ' ' + clase : '') + '">' +
           (icono ? Ico(icono) : '') + '<b>' + texto + '</b></span>';
  }
  function pastillas(lista) {
    return '<div class="pastillas">' + lista.filter(Boolean).join('') + '</div>';
  }

  /* Un párrafo de los que enseñan, guardado detrás de un toque.
   *
   * El juego tiene mucho que explicar y quien lo juega tiene 14 años. La
   * explicación no se borra: se esconde, y sale cuando la pide. */
  function porQue(clave, cuerpo, etiqueta) {
    return '<div class="porque' + (abiertos[clave] ? ' abierto' : '') + '">' +
      '<button class="porque-btn" data-porque="' + clave + '">' +
        Ico('libro') + ' ' + (etiqueta || T('¿Por qué?')) + '</button>' +
      (abiertos[clave] ? '<div class="porque-cuerpo">' + cuerpo + '</div>' : '') +
      '</div>';
  }
  var abiertos = {};   // qué explicaciones dejó abiertas el jugador
  function fila(etq, val, cls) {
    return '<div class="fila"><span class="etq">' + etq + '</span>' +
           '<span class="val ' + (cls || '') + '">' + val + '</span></div>';
  }
  function buscar(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }
  function nombreMes(i) { return K('meses', String(i), Motor.nombreMes(i)); }
  function nivel(n) { return K('niveles', n, n); }
  function turnoNombre() { return K('turnos', Motor.etapaActual().turno, Motor.etapaActual().turno); }

  function leccionTexto(l) {
    var plantilla = LECCIONES[l.clave] || '';
    return Idioma.T.apply(null, [plantilla].concat(l.args || []));
  }

  // =============== barra superior ===============

  /* Los primeros meses el juego no habla de dinero.
   *
   * Mientras el trabajo no exista, el jugador es un chico de trece en clases:
   * lo suyo es la experiencia y lo que le falta para la carrera, no un
   * patrimonio de Q120 que no puede mover ni gastar en nada. Enseñarle una
   * cifra de dinero antes de que tenga forma de cambiarla es enseñarle a
   * mirar un número que no responde.
   *
   * Se acaba cuando se abre el trabajo, y ahí el dinero aparece de golpe. Eso
   * también dice algo: el dinero entra en tu vida cuando empiezas a ganarlo.
   *
   * Va atado a la LLAVE y no a la cinta del tutorial a propósito: quien se
   * salta el tutorial pero sigue en clases tampoco tiene nada que hacer con
   * un número de dinero. */
  function sinDineroTodavia() { return !Motor.desbloqueado('trabajo'); }

  function barra() {
    var e = Motor.get();
    var t = Motor.trabajoActual();
    var energiaPct = Math.round((e.energia / CONFIG.energia.maxima) * 100);
    var baja = e.energia < CONFIG.energia.umbralRiesgo ? ' baja' : '';
    var etapa = Motor.etapaActual();
    var deuda = Motor.deudaTotal();

    return '' +
      '<div class="barra">' +
        '<div class="fecha">' +
          T('{0} {1} · {2} años', nombreMes(e.mes), e.anio, e.edad) +
          (etapa.mesesPorTurno > 1 ? ' · ' + T('turnos por {0}', turnoNombre()) : '') +
          '<button class="barra-btn" data-abrir-menu>' + Ico('puntos') + '</button>' +
        '</div>' +
        '<div class="cifras">' +
          // El muñeco es el botón de "Yo": lo que el jugador es, aparte de
          // lo que el jugador hace.
          '<button class="avatar" data-ver-perfil="1" aria-label="' + T('Yo') + '">' +
            Muneco({ trabajo: t ? t.id : null, estudia: !!e.estudio,
                     graduado: e.carrerasTerminadas.length > 0 && !e.estudio }) +
          '</button>' +
          (sinDineroTodavia()
            ? '<span class="dinero exp">' + Ico('birrete') + ' ' + Motor.experiencia() + '</span>'
            : '<span class="dinero">' + Q0(Motor.patrimonio()) + '</span>') +
          '<span class="chip">' + Ico('rayo') + ' ' + Math.round(e.energia) + '</span>' +
          (deuda > 0 && !sinDineroTodavia()
            ? '<span class="chip alerta">' + T('debe {0}', Q0(deuda)) + '</span>' : '') +
        '</div>' +
        '<div class="energia-barra"><div class="energia-relleno' + baja +
          '" style="width:' + energiaPct + '%"></div></div>' +
      '</div>';
  }

  // =============== pestaña: el mes ===============

  /* La meta que sigue, en una tarjeta discreta.
   *
   * Es el tutorial cuando el tutorial ya no estorba: mientras la cinta de
   * abajo esté diciendo lo mismo, esto se calla. Cuando la cinta termina, la
   * ruta sigue existiendo y esta tarjeta es la única que la menciona. */
  function tarjetaLoQueSigue() {
    var e = Motor.get();
    /* Mientras el juego no hable de dinero, esta tarjeta se calla del todo.
     *
     * En los meses de colegio la cinta está apagada a propósito, así que el
     * siguiente peldaño que se puede perseguir es el del banco, y la tarjeta
     * se ponía a hablarle de cuánto efectivo se le fuga al mes a un chico de
     * trece que no gana un quetzal y no tiene la pestaña de banco abierta.
     * Ahí lo único que hay que hacer son las tareas, y eso ya lo dice la
     * franja de la calle con dos palabras. */
    if (sinDineroTodavia()) return '';
    /* Con el tutorial saltado, los pasos que solo enseñan a navegar ("toca la
     * pestaña Estudio") no son una meta: son una instruccion que ya nadie
     * pidio. Se persiguen solo los peldaños que abren algo. */
    var sig = Motor.siguientePeldano(!!e.vistos.guiaSaltada);
    if (!sig) return '';
    if (sig.peldano.guia && !e.vistos.guiaSaltada) return '';   // ya lo dice la cinta
    return '<div class="tarjeta sigue">' +
      '<div class="titulo">' + Ico('bandera-meta') + ' ' + T('Lo que sigue') + '</div>' +
      '<p class="sutil" style="margin:7px 0 0">' +
        esc(K('progreso_pista', sig.peldano.id, sig.peldano.pista)) + '</p>' +
      '</div>';
  }

  /* El mes, dibujado: cuatro semanas de dos jornadas.
   *
   * Antes eran cuatro cuadros y una semana entera era la unidad más chica que
   * el jugador podía mover, así que "estudio por la mañana y trabajo por la
   * tarde" —que es como vive medio país— no se podía representar. Ahora la
   * fila de arriba son las mañanas y la de abajo las tardes.
   *
   * Las casillas del colegio salen marcadas y no se pueden tocar: eso no es
   * una limitación de la interfaz, es la regla. */
  /* La calle, que es la pantalla principal del juego.
   *
   * Se dibuja en dos sitios y con la MISMA función a propósito: arriba del mes,
   * donde se toca para repartir las jornadas, y arriba del imperio, donde solo
   * se mira porque las acciones están en las tarjetas de abajo. Que sea una
   * sola función es lo que evita que las dos se separen: un negocio nuevo, un
   * nivel nuevo o una ilustración nueva salen en las dos el mismo día.
   *
   * `viva` es la diferencia: con ella cada local es un botón que mete una
   * jornada tuya adentro, y el lote vacío lleva a abrir un negocio.
   */
  function calle(viva) {
    var e = Motor.get();
    var t = Motor.trabajoActual();
    var negs = Motor.negociosAbiertos();
    var cabe = negs.length < Motor.techoNegocios();

    var h = '<div class="escena-caja' + (escenaCrecio ? ' crecio' : '') +
            (viva ? ' viva' : '') + '">';
    escenaCrecio = false;
    h += Escena.dibujar({
      tocable: !!viva,
      // El lote solo se ofrece si el imperio ya está abierto: la ruta se
      // enseña no dibujando lo que todavía no toca, no prohibiéndolo.
      cabeOtro: cabe && Motor.desbloqueado('mejoras'),
      textoLote: T('Abrir un negocio'),
      negocios: negs.map(function (n) {
        var tn = Motor.tipoDeNegocio(n.tipoId);
        return {
          tipo: n.tipoId,
          nombre: tn ? esc(D(tn, 'nombre')) : '',
          icono: tn ? tn.icono : 'tienda',
          nivel: n.nivel,
          empleados: n.empleados.length,
          // Las jornadas TUYAS de este mes, que es lo que la calle no decía
          tuyas: Motor.espaciosUsados('negocio:' + n.tipoId),
          textoGestion: T('Administrar este negocio'),
          /* Si tal como está el mes ese negocio va a cerrar en rojo. Es lo que
           * pinta el punto de aviso en la calle, y es la diferencia entre un
           * escenario y un tablero: un local vacío que se come la renta se veía
           * igual que uno lleno que deja tres mil al mes. */
          pierde: Motor.proyeccionDeNegocio(n).neto < 0,
          produce: (n.gananciaUltimoMes || 0) > 0
        };
      }),
      oficio: Motor.nivelDeCadena('oficio'),
      escuela: Motor.nivelDeCadena('escuela'),
      casa: Motor.nivelDeCadena('casa'),
      trabajo: t ? t.id : null,
      estudia: !!e.estudio,
      graduado: e.carrerasTerminadas.length > 0 && !e.estudio
    });
    return h + '</div>';
  }

  /* La franja de debajo de la calle: lo único que el juego te está pidiendo.
   *
   * Empezó contando el mes —"te quedan 4 jornadas", "sin tareas"— y eso era
   * ruido: las jornadas que faltan se ven en los cuadros vacíos de la rejilla,
   * y las tareas puestas se ven al ponerlas. Repetir en palabras lo que ya
   * está dibujado no informa; entrena a no leer la franja.
   *
   * Lo que queda es lo que NO se ve en ningún otro sitio: cuántas tareas te
   * dejó el colegio y todavía no has puesto. Esa es la pista sutil que
   * sustituye a media cinta de tutorial. Sin nada pendiente, no dice nada. */
  function barraDeCalle(e) {
    var libres = 0;
    for (var i = 0; i < e.espacios.length; i++) if (!e.espacios[i]) libres++;

    /* El botón de cerrar el mes vive AQUÍ, pegado a la calle.
     *
     * Estaba al final de la pantalla, después de la rejilla, de la ruta y de
     * las tres cifras: en un teléfono, a dos pantallazos de scroll de lo que
     * el jugador acababa de decidir. La acción que cierra el ciclo del juego
     * —reparto el mes, lo cierro, entra el dinero, abro otro negocio— no puede
     * estar donde hay que ir a buscarla.
     *
     * Y cambia de cara según si queda mes por repartir, porque son dos
     * momentos distintos: uno dice "te falta", el otro dice "ya, dale". */
    /* Las tareas que el colegio dejó y todavía no tienen jornada.
     *
     * Cuenta las puestas Y las ya hechas, porque una tarea hecha deja de estar
     * pendiente: si no, la franja seguiría pidiendo lo que el jugador acaba de
     * hacer. Sin colegio no hay tareas, y con las del mes cubiertas la franja
     * se calla en vez de felicitar. */
    var pendientes = Motor.tareasPendientes();

    /* Y el contador es un BOTON, no un cartel.
     *
     * Decirle al jugador que le quedan tareas pendientes y obligarlo a bajar a
     * la rejilla, tocar una casilla y buscar "Tarea" entre seis actividades es
     * dar una instruccion en vez de una salida. Tocarlo pone la jornada. */
    var h = '<div class="calle-barra' + (libres ? '' : ' listo') + '">';
    if (pendientes) {
      h += '<button class="pendientes" data-poner-tarea="1">' + Ico('libro') + ' ' +
           T('Tareas pendientes: {0}', pendientes) + '</button>';
    } else if (!libres) {
      h += '<span class="listo">' + Ico('visto') + ' ' + T('Mes repartido') + '</span>';
    }
    /* El botón solo grita cuando el mes ya está repartido.
     *
     * Subirlo a la calle lo puso encima de las cifras, y con ocho jornadas sin
     * repartir eso era una trampa: un botón verde enorme invitando a cerrar un
     * mes en el que no trabajas —o sea, a cerrarlo en pérdida— antes de que el
     * jugador haya visto lo que va a pasar. Sigue estando, porque cerrar un mes
     * a medias es una decisión legítima, pero deja de ser la invitación. */
    h += '<button class="' + (libres ? 'btn-chico' : 'btn-primario chico') +
         '" id="cerrar-turno">' + T('Terminar el {0}', turnoNombre()) + ' ▸</button>';
    return h + '</div>';
  }

  /* La primera jornada libre que se puede usar, o null si no queda ninguna.
   *
   * Salta las del colegio: están bloqueadas y asignarlas no hace nada, así que
   * sin este salto tocar un negocio con la primera casilla ocupada por clases
   * se sentiría como que el juego no responde. */
  function primeraLibre() {
    var e = Motor.get();
    for (var i = 0; i < e.espacios.length; i++) {
      if (!e.espacios[i] && !Motor.espacioBloqueado(i)) return i;
    }
    return null;
  }

  /* La hoja que se abre debajo de la calle al tocar el engranaje de un
   * negocio, o el lote vacío.
   *
   * No dibuja nada propio: reusa `tarjetaNegocio` y `ofertasDeNegocio`, que
   * son las mismas del imperio. Eso importa más de lo que parece: son las
   * pantallas que enseñan la planilla formal contra la informal y lo que
   * cuesta de verdad un empleado, y tener dos versiones de eso sería tener
   * dos sitios donde equivocarse. */
  function hojaDeNegocio() {
    if (!hojaNegocio) return '';
    var cuerpo;
    if (hojaNegocio === 'abrir') {
      cuerpo = ofertasDeNegocio(Motor.imperio()) ||
        ('<p class="sutil">' + T('Por ahora no hay nada que puedas abrir.') + '</p>');
    } else {
      var neg = Motor.negocioDe(hojaNegocio);
      if (!neg) { hojaNegocio = null; return ''; }
      cuerpo = tarjetaNegocio(neg);
    }
    return '<div class="tarjeta hoja-calle">' +
             '<button class="hoja-cerrar" data-cerrar-hoja="1" aria-label="' + T('Cerrar') + '">' +
               Ico('flecha') + '</button>' + cuerpo + '</div>';
  }

  function rejillaJornadas(e) {
    var iconos = { trabajo: 'maletin', estudio: 'birrete', minijuego: 'mando',
                   'minijuego-usado': 'visto', tarea: 'libro', 'tarea-usada': 'visto',
                   descanso: 'luna', '': 'mas' };
    var claves = { trabajo: 'Trabajo', estudio: 'Estudio', minijuego: 'Extra',
                   'minijuego-usado': 'Hecho', tarea: 'Tarea', 'tarea-usada': 'Hecha',
                   descanso: 'Descanso', '': 'Libre' };

    /* Una casilla puede decir 'negocio:dulces'. Se dibuja con el icono de ESE
     * negocio y con su nombre, no con un genérico: cuando el jugador tiene
     * tres, tiene que ver de un golpe a cuál le puso cada jornada. */
    function pintaCasilla(v) {
      var tn = Motor.negocioDeEspacio(v);
      if (!tn) return { ic: iconos[v], nom: T(claves[v]) };
      var t = Motor.tipoDeNegocio(tn);
      return t ? { ic: t.icono, nom: esc(D(t, 'nombre')) }
               : { ic: 'tienda', nom: T('Tu negocio') };
    }
    var semanas = CONFIG.jornadasPorMes / CONFIG.jornadasPorSemana;

    var h = '<div class="jornadas" style="--semanas:' + semanas + '">';
    h += '<div class="jor-eje"></div>';
    for (var c = 0; c < semanas; c++) h += '<div class="jor-cab">' + T('Sem {0}', c + 1) + '</div>';

    ['am', 'pm'].forEach(function (j) {
      var icoJornada = j === 'am' ? 'manana' : 'tarde';
      h += '<div class="jor-eje" title="' + (j === 'am' ? T('Mañana') : T('Tarde')) + '">' +
           Ico(icoJornada) + '</div>';
      for (var sm = 0; sm < semanas; sm++) {
        var i = Motor.indiceDe(sm, j);
        var tipo = e.espacios[i];
        var bloq = Motor.espacioBloqueado(i);
        var pin = pintaCasilla(tipo);
        h += '<div class="jornada' + (tipo ? ' lleno' : '') + (bloq ? ' bloqueado' : '') +
             (espacioSel === i ? ' sel' : '') + '" data-espacio="' + i + '">' +
             '<div class="ic-caja">' + Ico(bloq ? 'birrete' : pin.ic) + '</div>' +
             '<div class="nom">' + pin.nom + '</div></div>';
      }
    });
    return h + '</div>';
  }

  /* Lo que va a pasar al cerrar el mes, en tres cifras.
   *
   * Eran doce filas de texto. Un chico de catorce años no lee doce filas: lee
   * "entra tanto, sale tanto, te queda tanto" y, si quiere, abre el detalle. */
  function tarjetaLoQueViene(e, t, v, puedeTrabajar) {
    var espT = Motor.espaciosUsados('trabajo');
    var entra = 0;
    if (e.migracion && espT > 0) {
      var empM = buscar(MIGRACION.empleos, e.migracion.empleoId);
      entra = empM.sueldoDolares * CONFIG.tipoCambio * Motor.proporcionPago(espT);
    } else if (t && espT > 0) {
      entra = Motor.salarioEsperado(t, e.empleo.formal) * Motor.proporcionPago(espT, t) +
              Motor.bonoPorJornada() * espT;
    }
    if (Motor.esMenor()) entra += e.mesada || 0;

    /* Lo que van a dejar los negocios. Se cuenta en bruto arriba y la
     * planilla y la renta bajan como gasto, a propósito: el jugador tiene que
     * ver la planilla como un renglón que sale, no recibir un neto ya
     * digerido. Es la diferencia entre saber que ganó poco y saber en qué se
     * le fue. */
    var imp = Motor.imperio();
    entra += imp.margen;

    var efM = Motor.efectosDeMejoras();
    var detalle = [];
    if (imp.planilla) detalle.push([T('Planilla de tu gente'), imp.planilla]);
    if (imp.costos) detalle.push([T('Renta y luz de tus negocios'), imp.costos]);
    if (efM.costoMensual) detalle.push([T('Mantenimiento de tus mejoras'), efM.costoMensual]);

    var nombreVivienda = e.migracion ? T('Vivir en Estados Unidos')
                       : (e.casa ? D(buscar(CASAS, e.casa.id), 'nombre')
                                 : K('vivienda_nombre', e.vivienda, v ? v.nombre : ''));
    var gasto = Motor.gastoMensualVivienda();
    detalle.push([Motor.esMenor() && !e.migracion ? T('Tus gastos') : T('{0} y gastos', esc(nombreVivienda)),
                  gasto]);
    if (e.estudio) detalle.push([T('Colegiatura'), Motor.costoMensualEstudio()]);
    if (Motor.manejoDeCuenta() > 0) detalle.push([T('Manejo de cuenta'), Motor.manejoDeCuenta()]);
    if (e.hipoteca) detalle.push([T('Cuota de hipoteca'), e.hipoteca.cuota]);
    if (e.pension && e.pension.aporteMensual > 0) detalle.push([T('Aporte a pensión'), e.pension.aporteMensual]);
    var cuotas = 0;
    for (var k = 0; k < e.prestamos.length; k++) cuotas += e.prestamos[k].cuota;
    if (cuotas > 0) detalle.push([T('Cuotas de crédito'), cuotas]);
    if (e.tarjeta && e.tarjeta.saldo > 0) {
      detalle.push([T('Pago de tarjeta'),
        Math.max(50, e.tarjeta.saldo * CREDITOS.tarjeta.pagoMinimoPorcentaje)]);
    }
    if (e.deudaHogar > 0) detalle.push([T('Lo que quedaste debiendo'), e.deudaHogar]);
    if (e.efectivo > 0) {
      detalle.push([T('Se te irá del efectivo'),
        Math.min(e.efectivo * CONFIG.efectivo.fugaMensual, CONFIG.efectivo.fugaMaxima)]);
    }
    var sale = detalle.reduce(function (a, d) { return a + d[1]; }, 0);
    var queda = entra - sale;

    var h = '<div class="tarjeta resumen-mes">';
    h += '<div class="tres-cifras">' +
      '<div><span class="etq">' + T('Entra') + '</span><b class="pos">' + Q0(entra) + '</b></div>' +
      '<div><span class="etq">' + T('Sale') + '</span><b class="neg">' + Q0(sale) + '</b></div>' +
      '<div class="queda"><span class="etq">' + T('Queda') + '</span><b class="' +
        (queda >= 0 ? 'pos' : 'neg') + '">' + Q0(queda) + '</b></div>' +
      '</div>';
    if (puedeTrabajar && espT > 0 && espT < CONFIG.jornadasPorMes) {
      h += '<p class="sutil">' +
        T('Trabajas {0} de {1} jornadas: cobras el {2} del sueldo.',
          espT, CONFIG.jornadasPorMes, pct(Motor.proporcionPago(espT, t))) + '</p>';
    }
    h += '<button class="porque-btn" data-detalle="1">' + Ico(verDetalle ? 'visto' : 'mas') + ' ' +
         (verDetalle ? T('Ocultar el detalle') : T('Ver a dónde se va')) + '</button>';
    if (verDetalle) {
      h += '<div class="porque-cuerpo">';
      detalle.forEach(function (d) { h += fila(d[0], '-' + Q(d[1]), 'neg'); });
      h += '</div>';
    }
    return h + '</div>';
  }

  var verDetalle = false;
  var avisoBloqueo = false;

  function vistaCasa() {
    var e = Motor.get();
    var t = Motor.trabajoActual();
    var v = CONFIG.vivienda[e.vivienda];
    var etapa = Motor.etapaActual();
    var h = '';

    if (e.jubilado) {
      return '<h2>' + T('Te jubilaste') + '</h2><div class="tarjeta"><p>' +
        T('Llegaste a los {0} años. Tu vida financiera terminó y el reporte ya está listo.',
          CONFIG.tiempo.edadJubilacion) + '</p>' +
        '<button class="btn-primario" id="ver-reporte-final">' + T('Ver mi reporte de vida') +
        '</button></div>';
    }

    /* LA CALLE VA PRIMERO, y esa es la decisión de diseño más grande de esta
     * pantalla. Antes lo primero que se veía al abrir el juego era una rejilla
     * de ocho casillas vacías: un formulario. Ahora es lo que tienes —tu casa,
     * tu escuela, tus negocios— y un lote vacío al lado invitando a llenarlo.
     *
     * Y no está de adorno: cada local es un botón que mete una jornada tuya
     * adentro. El reparto del mes se hace señalando tus cosas, no eligiendo de
     * una lista. La rejilla se queda debajo, que es donde le toca: ya no es
     * donde se juega, es donde se comprueba en qué se fue el mes. */
    h += '<h2>' + T('Tu {0}', turnoNombre()) + '</h2>';

    h += '<div class="tarjeta escenario mando">';
    h += calle(true);
    h += barraDeCalle(e);
    h += '</div>';

    // Y justo debajo, si el jugador tocó un negocio o el lote
    h += hojaDeNegocio();

    /* Aquí iba un aviso de que el primer año no trae imprevistos.
     *
     * Se quitó porque anunciar que no va a pasar nada malo es contar el final:
     * el año de gracia existe para que el jugador agarre el ritmo sin saberlo,
     * y el día que empiecen a caer imprevistos lo va a notar sin que nadie se
     * lo diga. Los meses de gracia siguen en CONFIG.mesesDeGracia; lo que se
     * fue es el cartel. */

    h += '<div class="tarjeta">';
    if (etapa.mesesPorTurno > 1) {
      h += '<p class="sutil">' +
        T('Este reparto se repite los {0} meses del {1}.', etapa.mesesPorTurno, turnoNombre()) +
        '</p>';
    }
    h += rejillaJornadas(e);

    var puedeTrabajar = t || e.migracion;
    if (avisoBloqueo) {
      h += '<p class="aviso">' + T('Esa jornada es del colegio. Mientras estés inscrito no se puede vaciar.') + '</p>';
      avisoBloqueo = false;
    }
    if (espacioSel !== null) {
      h += '<div class="btn-fila acciones-jornada">';
      h += '<button class="btn-chico" data-poner="trabajo"' + (puedeTrabajar ? '' : ' disabled') + '>' + Ico('maletin') + ' ' + T('Trabajar') + '</button>';
      /* Un botón por cada negocio abierto. Es donde el jugador decide a cuál
       * de sus negocios le pone la cara este mes, y esa decisión importa: al
       * que no le pone ninguna jornada le rinde menos. */
      Motor.negociosAbiertos().forEach(function (neg) {
        var tneg = Motor.tipoDeNegocio(neg.tipoId);
        if (!tneg) return;
        h += '<button class="btn-chico" data-poner="negocio:' + neg.tipoId + '">' +
             Ico(tneg.icono) + ' ' + esc(D(tneg, 'nombre')) + '</button>';
      });
      // Estudiar solo tiene sentido con una carrera de horario libre: en el
      // colegio las jornadas ya vienen puestas y no se agregan a mano.
      if (e.estudio && !e.estudio.jornada) {
        h += '<button class="btn-chico" data-poner="estudio">' + Ico('birrete') + ' ' + T('Estudiar') + '</button>';
      }
      /* La tarea es una jornada aparte de "Estudiar", y la diferencia importa:
       * estudiar adelanta los meses de la carrera, la tarea da experiencia.
       * Solo sale mientras esté inscrito, porque no hay tareas sin colegio. */
      if (e.estudio) {
        h += '<button class="btn-chico" data-poner="tarea">' + Ico('libro') + ' ' +
             T('Tarea') + '</button>';
      }
      if (Motor.desbloqueado('extra')) {
        h += '<button class="btn-chico" data-poner="minijuego">' + Ico('mando') + ' ' + T('Extra') + '</button>';
      }
      h += '<button class="btn-chico" data-poner="descanso">' + Ico('luna') + ' ' + T('Descansar') + '</button>';
      h += '<button class="btn-chico" data-poner="">' + T('Vaciar') + '</button>';
      h += '</div>';
      if (!puedeTrabajar) h += '<p class="aviso">' + T('Todavía no tienes trabajo. Búscalo en la pestaña Trabajo.') + '</p>';
    }
    h += '</div>';

    h += tarjetaLoQueSigue();

    /* Las tres cifras van DEBAJO de la rejilla y ya no encima del botón de
     * cerrar, porque el botón se subió a la calle. Siguen aquí y no se quitan:
     * son la consecuencia de lo que se acaba de repartir, y quien quiera
     * mirarlas antes de cerrar las tiene a un dedo de scroll. */
    // Mientras el juego no hable de dinero, esta tarjeta no tiene qué decir
    if (!sinDineroTodavia()) h += tarjetaLoQueViene(e, t, v, puedeTrabajar);

    /* Y aquí iba "Adelantar hasta que pase algo".
     *
     * Saltaba hasta veinticuatro turnos repartiendo el mes por su cuenta. En
     * un juego que pregunta una sola cosa —en qué se te va el tiempo— un botón
     * que gasta el tiempo por ti no es una comodidad: es jugar sin jugar, y
     * encima con un reparto que el jugador no eligió. */
    return h;
  }

  // =============== pestaña: trabajo ===============

  /* Tres apartados en vez de una sola lista larga.
   *
   * Esta era la pantalla más larga del juego: el empleo actual, el mercado
   * laboral, las trece ofertas y la decisión de irse del país, todo seguido.
   * La decisión que de verdad importa —aceptar una oferta— quedaba enterrada a
   * dos pantallazos de scroll. El mercado laboral se fue a Noticias, porque no
   * es algo que se hace sino algo que se lee, y el resto quedó en apartados.
   */
  var SUB_TRABAJO = [
    { id: 'empleo',  ic: 'maletin',      tx: 'Mi empleo' },
    { id: 'turnos',  ic: 'mando',        tx: 'Turnos' },
    { id: 'ofertas', ic: 'portapapeles', tx: 'Ofertas' },
    { id: 'migrar',  ic: 'avion',        tx: 'Irme del país' }
  ];

  /* Qué apartado tiene abierto cada pestaña que está partida en apartados.
   * null = el que tenga sentido según el estado de la partida. */
  var subDe = { trabajo: null, banco: null };

  function subTrabajoActivo() {
    var e = Motor.get();
    var visibles = SUB_TRABAJO.filter(function (sp) {
      if (sp.id === 'migrar') return Motor.desbloqueado('migrar');
      if (sp.id === 'turnos') return Motor.desbloqueado('extra');
      return true;
    });
    // Sin empleo, la pantalla útil es la de ofertas y no la de "no tienes nada"
    var elegido = subDe.trabajo || (e.empleo ? 'empleo' : 'ofertas');
    var existe = visibles.some(function (sp) { return sp.id === elegido; });
    return { id: existe ? elegido : visibles[0].id, visibles: visibles };
  }

  /* Barra de apartados dentro de una pestaña. Genérica a propósito: si mañana
   * otra pestaña se parte, se dibuja igual. */
  function subPestanas(sub) {
    /* Con cuatro apartados los rótulos no caben en un teléfono y salían todos
     * cortados —"Mi em…", "Turno…", "Irme …"—, que es peor que no ponerlos.
     * Apretado, el activo lleva su nombre entero y los demás solo su icono:
     * el que importa se lee, y los otros siguen siendo reconocibles. */
    var h = '<div class="sub-pestanas' + (sub.visibles.length > 3 ? ' apretado' : '') + '">';
    sub.visibles.forEach(function (sp) {
      h += '<button class="sub' + (sub.id === sp.id ? ' activa' : '') +
           '" data-sub="' + sp.id + '">' + Ico(sp.ic) +
           '<span>' + T(sp.tx) + '</span></button>';
    });
    return h + '</div>';
  }

  function vistaTrabajo() {
    var e = Motor.get();
    var h = '<h2>' + T('Trabajo') + '</h2>';

    // Viviendo fuera del país no hay apartados: la vida laboral es una sola
    if (e.migracion) return h + trabajoFuera();

    var sub = subTrabajoActivo();
    h += subPestanas(sub);
    h += sub.id === 'empleo' ? trabajoMiEmpleo()
       : sub.id === 'turnos' ? trabajoTurnos()
       : sub.id === 'ofertas' ? trabajoOfertas()
       : trabajoIrme();
    return h;
  }

  /* Pedir que te pongan en planilla.
   *
   * Aquí el jugador está del otro lado de la decisión que ya toma como patrón
   * en su imperio, y la cuenta es la misma vista al revés: informal le dan un
   * 5% más en la mano cada mes; formal le dan Bono 14 y aguinaldo, que son dos
   * sueldos más al año, más IGSS y más historial para que un banco le preste.
   *
   * La probabilidad va ESCRITA en la pantalla antes de tocar el botón. Sin
   * eso, pedirlo sería una tragamonedas; con eso, es una decisión. */
  function tarjetaPlanilla(e, actual) {
    if (e.empleo.formal) return '';
    var falta = Motor.faltaParaPlanilla();
    /* Y no se dibuja donde no tiene sentido: en modo informal no hay contratos
     * que pedir, y un trabajito de niño no lo contrata nadie. Una tarjeta que
     * solo sirve para decir que no, sobra. */
    if (falta && (falta.motivo === 'modo' || falta.motivo === 'sinEmpleo' ||
                  falta.motivo === 'soloInformal')) return '';

    var p = Motor.probabilidadPlanilla();
    var enMano = Motor.salarioEsperado(actual, false) - Motor.salarioEsperado(actual, true);
    var alAno = Motor.salarioEsperado(actual, true) * 2;   // Bono 14 + aguinaldo

    var h = '<div class="tarjeta">';
    h += '<div class="titulo">' + Ico('portapapeles') + ' ' + T('Pedir que te pongan en planilla') + '</div>';
    h += pastillas([
      pastilla('moneda', T('pierdes {0} al mes', Q0(enMano)), 'mal'),
      pastilla('billete', T('ganas {0} al año', Q0(alAno)), 'ok'),
      pastilla('banco', T('y empiezas historial'), 'ok')
    ]);
    h += '<p class="sutil">' +
      T('Bono 14 y aguinaldo son dos sueldos más al año. En la mano recibes menos cada mes; en el año recibes bastante más, y el banco por fin puede comprobar lo que ganas.') +
      '</p>';
    if (falta) {
      h += '<p class="aviso">' + esc(K('planilla_falta', falta.motivo, falta.razon)) + '</p>';
      h += '<button class="btn-primario" disabled>' + T('Pedirlo') + '</button>';
    } else {
      h += '<div class="progreso"><div class="progreso-relleno" style="width:' +
           Math.round(p * 100) + '%"></div></div>';
      h += '<div class="fila"><span class="etq sutil">' +
           T('Con {0} meses aquí, la probabilidad de que digan que sí es', e.empleo.mesesEnPuesto) +
           '</span><span class="val">' + Math.round(p * 100) + '%</span></div>';
      h += '<button class="btn-primario" id="pedir-planilla">' + Ico('portapapeles') + ' ' +
           T('Pedirlo') + '</button>';
    }
    return h + '</div>';
  }

  // ----- apartado: turnos extra -----

  function trabajoTurnos() {
    var lista = listaMinijuegos(esDeTrabajo);
    if (!lista) {
      return '<div class="vacio">' +
        T('Todavía no hay turnos extra para ti. Se abren al subir de nivel educativo.') + '</div>';
    }
    return '<p class="sutil">' +
      T('Trabajos sueltos que se pagan aparte del sueldo. Cada uno cuesta una jornada de Extra.') +
      '</p>' + lista;
  }

  // ----- apartado: mi empleo -----

  function trabajoMiEmpleo() {
    var e = Motor.get();
    var actual = Motor.trabajoActual();
    if (!actual) {
      return '<div class="vacio">' +
        '<div class="retrato">' + Muneco({ estudia: !!e.estudio }) + '</div>' +
        T('Todavía no trabajas. Mira las Ofertas.') +
        '</div>';
    }

    /* El personaje vestido del oficio.
     *
     * Es la única parte de la pantalla que le dice al jugador qué es lo que
     * hace, sin que la tenga que leer. */
    var h = '<div class="tarjeta acento centrado">';
    h += '<div class="retrato">' + Muneco({
      trabajo: actual.id, estudia: !!e.estudio,
      graduado: e.carrerasTerminadas.length > 0 && !e.estudio
    }) + '</div>';
    h += '<div class="titulo centrado-fila">' + Ico(actual.icono) + ' ' + esc(D(actual, 'nombre')) + '</div>';
    h += '<div class="moneda-mes">' + Q0(Motor.salarioEsperado(actual, e.empleo.formal)) +
         '<span>' + T('al mes, mes completo') + '</span></div>';
    h += pastillas([
      pastilla(e.empleo.formal ? 'visto' : 'alerta',
               e.empleo.formal ? T('Formal') : T('Informal'),
               e.empleo.formal ? 'ok' : 'mal'),
      pastilla('reloj', T('{0} meses aquí', e.empleo.mesesEnPuesto)),
      Motor.multiplicadorMercado(actual.id) !== 1
        ? pastilla('tendencia', T('Mercado: {0}', pct(Motor.multiplicadorMercado(actual.id))),
                   Motor.multiplicadorMercado(actual.id) >= 1 ? 'ok' : 'mal')
        : '',
      Motor.bonoPorJornada() > 0
        ? pastilla('llave-inglesa', T('+{0} por jornada', Q0(Motor.bonoPorJornada())), 'ok') : ''
    ]);
    h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="renunciar">' +
         T('Renunciar') + '</button></div></div>';

    h += tarjetaPlanilla(e, actual);

    if (!e.empleo.formal) {
      h += porQue('informal',
        '<p>' + T('En informal ganas más en la mano cada mes, pero sin Bono 14, sin aguinaldo, sin seguro y sin forma de comprobar ingresos cuando pidas un crédito.') + '</p>',
        T('Qué te falta por ser informal'));
    }
    return h;
  }

  // ----- apartado: ofertas -----

  /* Las ofertas: solo las que el jugador puede tomar hoy, con su dibujo.
   *
   * Cada oferta es una tarjeta con el personaje vestido de ese oficio, su
   * descripción y lo que paga. Un chico de 13 años no compara tres filas de
   * texto; compara tres dibujos.
   *
   * Y lo que todavía no alcanza NO se muestra. Estuvo un rato abajo, en una
   * lista de "para estos te falta", y era la misma parálisis en versión corta:
   * trece renglones de cosas que no puede hacer. El juego se descubre por la
   * ruta; lo que no está abierto no existe todavía. */
  function trabajoOfertas() {
    var e = Motor.get();
    var actual = Motor.trabajoActual();
    var abiertas = TRABAJOS.filter(function (tr) { return Motor.puedeAplicar(tr).ok; });

    var h = '';
    abiertas.forEach(function (tr) {
      var esActual = actual && actual.id === tr.id;
      h += '<div class="opcion oferta' + (esActual ? ' activa' : '') + '">';
      h += '<div class="oferta-retrato">' + Muneco({ trabajo: tr.id }) + '</div>';
      h += '<div class="oferta-cuerpo">';
      h += '<div class="titulo">' + Ico(tr.icono) + ' ' + esc(D(tr, 'nombre'));
      if (esActual) h += '<span class="etiqueta ok">' + T('actual') + '</span>';
      h += '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(tr, 'descripcion')) + '</p>';
      h += pastillas([
        pastilla('moneda', tr.pagoPorJornada
          ? T('{0} por jornada', Q0(tr.pagoPorJornada))
          : T('{0} al mes', Q0(Motor.salarioEsperado(tr, true))), 'ok'),
        tr.varianza >= 0.5 ? pastilla('alerta', T('ingreso variable'), 'mal') : '',
        tr.capitalRequerido ? pastilla('billete', T('capital {0}', Q0(tr.capitalRequerido))) : ''
      ]);
      if (!esActual) h += botonesTomar(e, tr);
      h += '</div></div>';
    });

    if (!abiertas.length) {
      h += '<div class="vacio">' + T('Ahora mismo no hay nada que puedas tomar.') + '</div>';
    }
    return h;
  }

  /* Los botones de aceptar.
   *
   * Un contrato formal no se le puede dar a un menor de edad, y los
   * trabajitos de niño no existen en formal ni en la vida real: por eso
   * `soloInformal`. Lo que queda es un botón, no dos. */
  function botonesTomar(e, tr) {
    var puedeFormal = CONFIG.dificultad[e.dificultad].permiteFormal &&
                      !tr.soloInformal && !Motor.esMenor();
    var h = '<div class="btn-fila" style="margin-top:10px">';
    if (puedeFormal) {
      h += '<button class="btn-chico" data-tomar="' + tr.id + '" data-formal="1">' +
           Ico('visto') + ' ' + T('Aceptar formal') + '</button>';
    }
    if (tr.permiteInformal) {
      h += '<button class="btn-chico" data-tomar="' + tr.id + '" data-formal="0">' +
           (puedeFormal ? T('Informal (+{0})', pct(CONFIG.primaInformalidad)) : T('Aceptar')) +
           '</button>';
    }
    if (!puedeFormal && !tr.permiteInformal) {
      h += '<button class="btn-chico" data-tomar="' + tr.id + '" data-formal="0">' + T('Aceptar') + '</button>';
    }
    return h + '</div>';
  }

  // ----- apartado: irme del país -----

  function trabajoIrme() {
    var mig = Motor.puedeMigrar();
    var h = '<div class="opcion">';
    h += '<div class="titulo">' + Ico('avion') + ' ' + T('Migrar a Estados Unidos') + '</div>';
    h += '<p class="sutil" style="margin:6px 0">' +
      T('Se gana mucho más en dólares y se gasta mucho más. No construyes historial aquí, y cada envío pierde comisión.') +
      '</p>';
    h += fila(T('Cuesta el viaje'), Q0(MIGRACION.costoViaje), 'neg');
    h += fila(T('Riesgo de que no salga'), pct(MIGRACION.riesgoFracaso), 'neg');
    if (!mig.ok) h += '<p class="aviso">' + esc(mig.razon) + '</p>';
    else h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="migrar">' +
              T('Ver qué implica') + '</button></div>';
    h += '</div>';
    return h;
  }

  // ----- viviendo fuera del país -----

  function trabajoFuera() {
    var e = Motor.get();
    var g = e.migracion;
    var emp = buscar(MIGRACION.empleos, g.empleoId);
    var canal = MIGRACION.canales[g.canal];
    var h = '<div class="tarjeta acento"><div class="titulo">' + Ico(emp.icono) + ' ' +
            esc(D(emp, 'nombre')) + '</div>';
    h += '<p class="sutil" style="margin:6px 0">' + T('Estás en Estados Unidos.') + '</p>';
    h += fila(T('Sueldo'), 'US$' + emp.sueldoDolares.toLocaleString());
    h += fila(T('Costo de vida allá'), '-US$' + MIGRACION.costoVidaDolares.toLocaleString(), 'neg');
    h += fila(T('Tiempo fuera'), T('{0} meses', g.mesesFuera));
    h += fila(T('Ahorro que llevas allá'), Q(g.ahorroDolares * CONFIG.tipoCambio), 'pos');
    h += '</div>';

    h += '<h3>' + T('Lo que mandas a casa') + '</h3><div class="tarjeta">';
    h += fila(T('Mandas'), pct(g.enviaPorcentaje) + ' ' + T('de lo que te sobra'));
    h += fila(T('Por'), esc(K('canal_nombre', g.canal, canal.nombre)));
    h += fila(T('Comisión'), pct(canal.comision), 'neg');
    h += fila(T('Enviado hasta hoy'), Q(e.totalEnviado), 'pos');
    h += fila(T('Se lo llevaron las comisiones'), Q(e.comisionesEnvio), 'neg');
    if (e.comisionesEnvio > 2000 && g.canal === 'ventanilla') {
      h += '<div class="aprendizaje">' + esc(K('varios', 'leccionEnvio', MIGRACION.leccion)) + '</div>';
    }
    h += '<div class="btn-fila" style="margin-top:10px">';
    MIGRACION.enviosSugeridos.forEach(function (pp) {
      h += '<button class="btn-chico' + (g.enviaPorcentaje === pp ? ' activa' : '') +
           '" data-envio="' + pp + '">' + T('Mandar {0}', pct(pp)) + '</button>';
    });
    h += '</div><div class="btn-fila" style="margin-top:8px">';
    Object.keys(MIGRACION.canales).forEach(function (id) {
      h += '<button class="btn-chico' + (g.canal === id ? ' activa' : '') +
           '" data-canal="' + id + '">' +
           esc(K('canal_nombre', id, MIGRACION.canales[id].nombre)) + '</button>';
    });
    h += '</div></div>';

    h += '<div class="btn-fila" style="margin-top:14px"><button class="btn-chico" id="regresar" style="flex:1">' +
         Ico('avion') + ' ' + T('Regresar a Guatemala') + '</button></div>';
    return h;
  }

  // =============== pestaña: noticias ===============

  /* Lo que se lee, separado de lo que se hace.
   *
   * El mercado laboral estaba metido entre el empleo actual y las ofertas, y
   * ahí estorbaba: es información de contexto, no una decisión. Junto con las
   * promociones vigentes y la bitácora de lo que ha pasado forma un apartado
   * con sentido propio, y de paso las promociones dejan de ser invisibles en
   * cuanto se cierra la ventana que las ofreció.
   */
  function vistaNoticias() {
    var e = Motor.get();
    var h = '<h2>' + T('Noticias') + '</h2>';

    // ----- mercado laboral -----
    h += '<h3>' + T('Mercado laboral') + '</h3><div class="tarjeta"><p class="sutil">' +
         T('La demanda cambia con los años. Investiga antes de estudiar, y aun así no des nada por seguro.') +
         '</p>';
    for (var c = 0; c < CARRERAS.length; c++) {
      var car = CARRERAS[c];
      var et = etiquetaDemanda(e.mercado[car.id]);
      h += '<div class="fila"><span class="etq">' + Ico(car.icono) + ' ' + esc(D(car, 'nombre')) + '</span>' +
           '<span class="etiqueta ' + et.clase + '">' + T(et.texto) + '</span></div>';
    }
    h += '</div>';

    // ----- promociones vigentes -----
    var vigentes = (e.promosActivas || []).filter(function (pa) {
      return !!buscar(PROMOCIONES, pa.id);
    });
    if (vigentes.length) {
      h += '<h3>' + T('Promociones vigentes') + '</h3>';
      vigentes.forEach(function (pa) {
        var def = buscar(PROMOCIONES, pa.id);
        h += '<div class="opcion"><div class="titulo">' + Ico(def.icono) + ' ' +
             esc(D(def, 'titulo')) + '</div>';
        h += fila(T('Le quedan'), T('{0} meses', pa.mesesRestantes));
        if (def.letraChica) {
          h += '<div class="letra-chica">' + esc(D(def, 'letraChica')) + '</div>';
        }
        h += '</div>';
      });
    }

    // ----- lo que ha pasado -----
    h += '<h3>' + T('Lo que ha pasado') + '</h3>';
    var conEventos = (e.bitacora || []).filter(function (m) {
      return m.eventos && m.eventos.length;
    }).slice(-8).reverse();

    if (!conEventos.length) {
      h += '<div class="vacio">' +
        T('Todavía no ha pasado nada digno de contarse. Los imprevistos y las promociones van a aparecer aquí.') +
        '</div>';
    } else {
      conEventos.forEach(function (m) {
        h += '<div class="tarjeta"><div class="titulo" style="text-transform:capitalize">' +
             Ico('calendario') + ' ' + esc(m.mes) + ' ' + m.anio + '</div>';
        h += '<ul class="eventos">';
        m.eventos.forEach(function (t) { h += '<li>' + esc(t) + '</li>'; });
        h += '</ul></div>';
      });
    }
    return h;
  }

  // =============== pestaña: estudio ===============

  /* Todo lo que el jugador puede estudiar ahora mismo.
   *
   * Antes esta pantalla ofrecía UNA sola opción, la que SIGUIENTE_CARRERA
   * decía que tocaba, y eso convertía la decisión en un trámite: el juego ya
   * había elegido el diversificado por él. Cuando hay dos caminos —el
   * bachillerato es un año más corto, el perito sale con oficio— tiene que
   * poder verlos juntos y compararlos. */
  function carrerasPosibles(e) {
    return CARRERAS.filter(function (c) {
      var i = NIVELES_EDUCATIVOS.indexOf.bind(NIVELES_EDUCATIVOS);
      return i(e.educacion) >= i(c.requiere) && i(e.educacion) < i(c.nivelQueOtorga);
    });
  }

  function vistaEstudio() {
    var e = Motor.get();
    var h = '<h2>' + T('Estudio') + '</h2>';

    if (e.estudio) return h + estudioEnCurso(e) + tarjetaExperiencia() + estudioPracticar();
    if (e.decisionEstudio === null) return h + estudioDecidir(e);
    return h + estudioRutas(e) + tarjetaExperiencia() + estudioPracticar();
  }

  /* La primera pantalla del juego: estudias, y qué, o no estudias.
   *
   * Es la única decisión que el juego pregunta de frente, y ninguna opción
   * dice "recomendado". Vuelve a salir cada vez que el jugador se gradúa. */
  /* Cuando la lista de carreras es larga, primero las que se te dieron bien.
   *
   * El diversificado son siete ramas y diecinueve titulos, y soltarle los
   * diecinueve de golpe a alguien de dieciseis es la misma paralisis que tenia
   * el banco al abrir con once productos. Pero recortar la lista tampoco: la
   * gracia de este momento es que se ve TODO lo que hay, porque en la vida
   * real tambien esta todo y nadie te lo ordena.
   *
   * Asi que se ordena, no se recorta. Arriba van las ramas donde sacaste mejor
   * nota en las tareas de basicos, con la nota delante para que se entienda de
   * donde sale; debajo, un boton que abre las demas. Nadie le dice que estudie
   * eso: se le ensena lo que ya hizo, y decide el. */
  var verTodasLasRamas = false;
  var tituloSel = null;

  function estudioDecidir(e) {
    var opciones = carrerasPosibles(e);
    var esPrimera = e.educacion === 'primaria';

    var h = '<div class="tarjeta decidir">';
    h += '<div class="retrato chico">' + Muneco({ estudia: true, trabajo: e.empleo ? e.empleo.id : null }) + '</div>';
    h += '<h3>' + (esPrimera ? T('Saliste de primaria. ¿Y ahora?')
                             : T('Te graduaste. ¿Sigues estudiando?')) + '</h3>';
    h += '<p class="sutil">' + (opciones.length > 1
      ? T('Puedes estudiar cualquiera de estas, o ponerte a trabajar. Las dos se pueden.')
      : T('Puedes estudiar o ponerte a trabajar. Las dos se pueden.')) + '</p>';
    h += '</div>';

    if (!opciones.length) {
      h += '<div class="tarjeta centrado"><p class="sutil">' +
           T('Ya llegaste hasta donde llega la escalera. Nada más que estudiar.') + '</p>' +
           '<button class="btn-primario" data-decide="1" data-no-estudiar="1">' +
           Ico('maletin') + ' ' + T('A trabajar') + '</button></div>';
      return h;
    }

    h += listaDeCarreras(e, opciones, true);

    /* `data-decide` va también aquí, y es la mitad del arreglo. No estudiar es
     * una de las tres opciones de verdad de esta pantalla —pública, privada o
     * a trabajar— y sin la marca el tutorial la dejaba a oscuras, como si no
     * existiera. */
    h += '<button class="btn-primario claro" data-decide="1" data-no-estudiar="1" style="margin-top:6px">' +
         Ico('maletin') + ' ' + T('No, a trabajar') + '</button>';
    h += '<p class="sutil centrado" style="margin-top:10px">' +
      T('Puedes cambiar de opinión después. Esta pantalla no se cierra nunca.') + '</p>';
    h += porQue('estudiar',
      '<p>' + T('En Guatemala un trabajador sin básicos gana alrededor de Q2,400 al mes. Con diversificado, Q3,800. Con licenciatura, Q4,300, que es apenas 13% más. Con maestría, Q10,000.') + '</p>' +
      '<p>' + T('O sea que los saltos grandes están al principio y al final de la escalera, no en el medio.') + '</p>',
      T('Qué se gana con cada nivel'));
    return h;
  }

  /* La lista de carreras, con las recomendadas arriba si hay notas.
   *
   * Se usa en las dos pantallas que ofrecen carreras —la decision de recien
   * graduado y la lista de rutas— para que las dos ordenen igual. */
  function listaDeCarreras(e, opciones, decidible) {
    var apt = Motor.aptitudes().filter(function (a) {
      return opciones.some(function (c) { return c.id === a.rama; });
    });
    // Sin notas no hay nada que recomendar: la lista entera y ya
    if (apt.length < 2 || opciones.length < 4) {
      var todo = '';
      opciones.forEach(function (c) { todo += tarjetaCarrera(e, c, decidible); });
      return todo;
    }

    var arriba = apt.slice(0, 3).map(function (a) { return a.rama; });
    var notaDe = {};
    apt.forEach(function (a) { notaDe[a.rama] = a; });

    var h = '<div class="titulo-seccion">' + Ico('bandera-meta') + ' ' +
            T('Lo que se te dio mejor') + '</div>';
    h += '<p class="sutil" style="margin:0 0 8px">' +
      T('Sale de tus notas en las tareas del colegio. Es una pista, no una orden.') + '</p>';
    /* En orden de NOTA, no en el orden en que están escritas en los datos: la
     * primera de la lista tiene que ser la que mejor se le dio, o el orden no
     * dice nada y la palabra "mejor" del encabezado es mentira. */
    arriba.forEach(function (id) {
      var c = buscar(opciones, id);
      if (c) h += tarjetaCarrera(e, c, decidible, notaDe[id]);
    });

    // Y las demás, también por nota: las que nunca probó van al final
    var resto = opciones.filter(function (c) { return arriba.indexOf(c.id) < 0; })
      .sort(function (x, y) {
        return ((notaDe[y.id] && notaDe[y.id].nota) || -1) -
               ((notaDe[x.id] && notaDe[x.id].nota) || -1);
      });
    if (!resto.length) return h;
    if (!verTodasLasRamas) {
      var cuantos = resto.reduce(function (n, c) {
        return n + (c.titulos ? c.titulos.length : 1);
      }, 0);
      h += '<button class="btn-chico" data-ver-ramas="1" style="width:100%;margin-top:6px">' +
           Ico('mas') + ' ' + T('Ver las otras {0} carreras', cuantos) + '</button>';
      return h;
    }
    h += '<div class="titulo-seccion">' + Ico('libros') + ' ' + T('Todas las demás') + '</div>';
    resto.forEach(function (c) { h += tarjetaCarrera(e, c, decidible, notaDe[c.id]); });
    return h;
  }

  /* Una carrera, con lo que cuesta y sus botones para inscribirse.
   *
   * `decidible` marca los botones que forman la decisión que el tutorial está
   * pidiendo, y van TODOS. Antes se marcaba solo el primero de la primera
   * carrera, para que la cinta apuntara a un botón concreto, y eso resultó ser
   * un error de fondo: el foco apaga todo lo que no está marcado, así que el
   * tutorial dejaba a oscuras la privada y el "a trabajar" y contestaba por el
   * jugador la única pregunta que esta pantalla existe para hacerle. */
  function tarjetaCarrera(e, c, decidible, nota) {
    var et = c.sinMercado ? null : etiquetaDemanda(e.mercado[c.id]);
    var h = '<div class="opcion">';
    h += '<div class="titulo">' + Ico(c.icono) + ' ' + esc(D(c, 'nombre')) +
         (nota ? '<span class="etiqueta ok">' + T('nota {0}', nota.nota) + '</span>' : '') +
         (et ? '<span class="etiqueta ' + et.clase + '">' + T(et.texto) + '</span>' : '') + '</div>';
    h += '<p class="sutil" style="margin:6px 0">' + esc(D(c, 'descripcion')) + '</p>';
    h += pastillas([
      // Una rama con varios titulos no tiene UNA duración: la tiene cada título
      c.titulos ? '' : pastilla('calendario', T('{0} años', Math.round(c.mesesRequeridos / 12))),
      pastilla(c.horario === 'fijo' ? 'manana' : (c.horario === 'jornada' ? 'tarde' : 'calendario'),
               c.horario === 'fijo' ? T('Toma tus mañanas')
                                    : (c.horario === 'jornada' ? T('Mañana o tarde') : T('Horario libre'))),
      pastilla('moneda', c.costoAnualPublico === 0 ? T('Pública: gratis')
                                                   : T('{0} al año', Q0(c.costoAnualPublico)), 'ok'),
      pastilla('billete', T('Privada: {0}', Q0(c.costoAnualPrivado)), 'mal')
    ]);
    if (nota && nota.hechas) {
      h += '<p class="sutil" style="margin:0 0 6px">' + (nota.hechas === 1
        ? T('Sacaste {0} de 100 en la única tarea que hiciste de esta rama.', nota.nota)
        : T('Sacaste {0} de 100 en {1} tareas de esta rama.', nota.nota, nota.hechas)) +
        '</p>';
    }
    /* Lo que pide de experiencia, con barra, ANTES de los botones.
     *
     * Es la mitad de la mecánica: sin esto, el jugador toca "Pública" y el
     * juego le dice que no sin haberle avisado nunca. Una barra que sube es
     * una meta; un "no te alcanza" al tocar es un muro. */
    var faltaC = Motor.faltaParaCarrera(c.id);
    if (c.experienciaRequerida) {
      var xp = Motor.experiencia();
      var pc = Math.round(Math.min(1, xp / c.experienciaRequerida) * 100);
      h += '<div class="progreso mejora-barra"><div class="progreso-relleno' +
           (xp >= c.experienciaRequerida ? ' tope' : '') + '" style="width:' + pc + '%"></div></div>';
      h += '<div class="fila"><span class="etq sutil">' + Ico('birrete') + ' ' +
           T('Pide {0} de experiencia', c.experienciaRequerida) +
           '</span><span class="val sutil">' + xp + ' / ' + c.experienciaRequerida + '</span></div>';
    }
    if (faltaC && faltaC.motivo === 'experiencia') {
      h += '<p class="aviso">' + esc(K('carrera_falta', faltaC.motivo, faltaC.razon)) + '</p>';
      return h + '</div>';
    }

    /* Una rama del diversificado no se cursa: se cursa uno de sus títulos, y
     * hasta que el jugador elige cuál no hay nada que inscribir. */
    if (c.titulos && c.titulos.length) {
      h += '<div class="titulos">';
      c.titulos.forEach(function (t) {
        var sel = tituloSel === c.id + ':' + t.id;
        h += '<button class="titulo-op' + (sel ? ' elegido' : '') + '" data-titulo="' +
             c.id + ':' + t.id + '">' +
             '<span class="titulo-nombre">' + esc(D(t, 'nombre')) + '</span>' +
             '<span class="titulo-anios">' + T('{0} años', Math.round(t.meses / 12)) + '</span>' +
             '</button>';
        if (!sel) return;
        if (t.nota) {
          h += '<p class="sutil titulo-nota">' + esc(D(t, 'nota')) + '</p>';
        }
        h += botonesInscribir(c, decidible, t.id);
      });
      h += '</div>';
      return h + '</div>';
    }

    h += botonesInscribir(c, decidible);
    return h + '</div>';
  }

  /* Mientras está inscrito. */
  function estudioEnCurso(e) {
    var car = buscar(CARRERAS, e.estudio.carreraId);
    // Lo que se cursa es el TÍTULO, y es el nombre que el jugador eligió y el
    // que va a llevar puesto: la rama es solo la carpeta donde está guardado.
    var tit = tituloDeCarrera(car, e.estudio.tituloId);
    var total = mesesDeCarrera(car, e.estudio.tituloId);
    var avance = Math.min(1, e.estudio.mesesAvanzados / total);
    var faltan = Math.max(0, Math.ceil(total - e.estudio.mesesAvanzados));
    var h = '<div class="tarjeta acento">';
    h += '<div class="retrato chico">' + Muneco({ estudia: true, trabajo: e.empleo ? e.empleo.id : null }) + '</div>';
    h += '<div class="titulo">' + Ico(car.icono) + ' ' +
         esc(tit ? D(tit, 'nombre') : D(car, 'nombre')) + '</div>';
    h += '<div class="progreso"><div class="progreso-relleno" style="width:' + (avance * 100) + '%"></div></div>';
    h += pastillas([
      pastilla('calendario', T('Faltan {0} meses', faltan)),
      pastilla(e.estudio.jornada === 'pm' ? 'tarde' : 'manana',
               e.estudio.jornada ? (e.estudio.jornada === 'pm' ? T('Jornada de la tarde') : T('Jornada de la mañana'))
                                 : T('Horario libre')),
      pastilla('moneda', e.estudio.privada ? '-' + Q0(Motor.costoMensualEstudio()) + T(' al mes')
                                           : T('gratis'),
               e.estudio.privada ? 'mal' : 'ok')
    ]);

    if (e.estudio.jornada) {
      h += '<p class="sutil">' +
        T('El colegio te toma esa jornada de las cuatro semanas y no se puede vaciar. La otra jornada es tuya.') +
        '</p>';
    } else {
      h += '<p class="sutil">' +
        T('Cada jornada que le dedicas avanza un cuarto de mes de carrera. Cuatro al mes es el ritmo normal.') +
        '</p>';
    }

    /* Y el botón que faltaba: adelantar la carrera desde aquí.
     *
     * Con horario libre la carrera avanza con las jornadas que le pongas, y
     * hasta ahora eso solo se podía hacer volviendo a la pestaña del mes,
     * tocando una casilla y buscando "Estudiar" entre las actividades. Desde
     * la pantalla donde el jugador está mirando cuánto le falta, un toque.
     *
     * Con horario fijo no sale: el colegio ya tiene tomadas sus jornadas y
     * ponerle más no adelanta nada. Dibujar un botón que no hace nada es peor
     * que no dibujarlo. */
    if (!e.estudio.jornada) {
      var puestas = Motor.espaciosUsados('estudio');
      var libres = Motor.espaciosLibres();
      h += '<div class="fila"><span class="etq">' + Ico('birrete') + ' ' +
           T('Jornadas de estudio este mes') + '</span><span class="val">' + puestas + '</span></div>';
      h += '<div class="btn-fila" style="margin-top:8px">';
      h += '<button class="btn-chico" data-poner="estudio"' + (libres ? '' : ' disabled') + '>' +
           Ico('mas') + ' ' + T('Ponerle una jornada') + '</button>';
      h += '<button class="btn-chico peligro" id="abandonar">' + T('Dejar de estudiar') + '</button>';
      h += '</div></div>';
      return h;
    }

    h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico peligro" id="abandonar">' +
         T('Dejar de estudiar') + '</button></div></div>';
    return h;
  }

  /* Practicar: los dos minijuegos que ENSEÑAN.
   *
   * `presupuesto` y `estafas` no son trabajos, son ejercicios: repartir un
   * sueldo entre lo que hay que pagar, y reconocer una estafa antes de caer.
   * Estaban en el cajón de "Extra" junto a los turnos de reparto, y su sitio
   * es este: pagan poco a propósito, porque lo que dan es la lección. */
  /* Lo que sabe, y para qué le va a servir.
   *
   * Una cifra sola no dice nada: 108 de experiencia no significa nada si no
   * sabes qué se abre con eso. Así que va con la siguiente carrera que la
   * pide y cuánto falta. Un número que no lleva a ningún lado es adorno.
   */
  function tarjetaExperiencia() {
    var xp = Motor.experiencia();
    // La carrera más barata de las que todavía le piden experiencia
    var meta = null;
    CARRERAS.forEach(function (c) {
      var pide = c.experienciaRequerida || 0;
      if (pide <= xp) return;
      if (!meta || pide < meta.experienciaRequerida) meta = c;
    });

    var h = '<div class="tarjeta">';
    h += '<div class="fila"><span class="etq">' + Ico('birrete') + ' ' +
         T('Tu experiencia') + '</span><span class="val"><strong>' + xp + '</strong></span></div>';
    if (meta) {
      var pide = meta.experienciaRequerida;
      var pc = Math.round(Math.min(1, xp / pide) * 100);
      h += '<div class="progreso"><div class="progreso-relleno" style="width:' + pc + '%"></div></div>';
      h += '<div class="fila"><span class="etq sutil">' +
           T('Con {0} más se abre {1}', pide - xp, esc(D(meta, 'nombre'))) +
           '</span><span class="val sutil">' + xp + ' / ' + pide + '</span></div>';
    } else {
      h += '<p class="sutil">' +
        T('Te alcanza para cualquier carrera del juego. Las tareas ya hicieron su trabajo.') + '</p>';
    }
    h += '<p class="sutil">' +
      T('Se gana haciendo tareas, y más despacio con solo estar inscrito. No se gasta y no se pierde nunca.') +
      '</p>';
    return h + '</div>';
  }

  function estudioPracticar() {
    var e = Motor.get();
    var lista = listaMinijuegos(esDeEstudio);
    var h = '<h3>' + T('Las tareas') + '</h3>';

    /* Sin carrera en curso no hay tareas, y eso no es un hueco: es que las
     * tareas son del colegio. Se dice, en vez de dejar la sección vacía. */
    if (!e.estudio) {
      return h + '<div class="vacio">' +
        T('Las tareas son del colegio. Inscríbete en algo y aparecen.') + '</div>';
    }
    if (!lista) {
      /* Y una carrera que todavía no tiene tarea propia también se dice. Es
       * el estado honesto de un juego que se llena por partes: mejor que el
       * jugador sepa que aquí va a haber algo que dejarle un blanco. */
      var car = buscar(CARRERAS, e.estudio.carreraId);
      return h + '<div class="vacio">' +
        T('{0} todavía no tiene tareas propias. La experiencia sigue subiendo por estar inscrito.',
          esc(D(car, 'nombre'))) + '</div>';
    }
    return h +
      '<p class="sutil">' +
      T('No pagan nada: dan experiencia, y la experiencia es lo que te deja entrar a las carreras que piden más. Cada una cuesta una jornada.') +
      '</p>' + lista;
  }

  /* Dijo que no, o ya terminó algo: la lista de lo que puede estudiar. */
  function estudioRutas(e) {
    var h = '<div class="tarjeta">';
    h += fila(T('Tu nivel'), '<strong>' + esc(nivel(e.educacion)) + '</strong>');
    h += '</div>';

    var opciones = carrerasPosibles(e);
    h += listaDeCarreras(e, opciones, false);

    if (!opciones.length) {
      h += '<div class="vacio">' + T('Ya llegaste hasta donde llega la escalera.') + '</div>';
    }
    h += porQue('estudiar',
      '<p>' + T('En Guatemala la licenciatura sube el ingreso mediano apenas 13% sobre un bachiller. La maestría lo sube 133%. La ruta larga paga solo si la terminas.') + '</p>',
      T('Qué se gana con cada nivel'));
    return h;
  }

  /* Los botones para inscribirse.
   *
   * Con horario de jornada hay que elegir mañana o tarde ANTES de inscribirse,
   * porque esa elección decide en qué jornada va a poder trabajar los próximos
   * años. Con horario libre basta pública o privada. */
  function botonesInscribir(c, decidible, tituloId) {
    var marca = decidible ? ' data-decide="1"' : '';
    var tit = tituloId ? ' data-titulo-id="' + tituloId + '"' : '';
    var h = '<div class="btn-fila" style="margin-top:10px">';
    if (c.horario === 'jornada') {
      h += '<button class="btn-chico"' + marca + tit + ' data-inscribir="' + c.id + '" data-priv="0" data-jornada="am">' +
           Ico('manana') + ' ' + T('Mañana') + '</button>';
      h += '<button class="btn-chico"' + marca + tit + ' data-inscribir="' + c.id + '" data-priv="0" data-jornada="pm">' +
           Ico('tarde') + ' ' + T('Tarde') + '</button>';
      h += '<button class="btn-chico"' + marca + tit + ' data-inscribir="' + c.id + '" data-priv="1" data-jornada="am">' +
           T('Privada') + '</button>';
    } else {
      h += '<button class="btn-chico"' + marca + tit + ' data-inscribir="' + c.id + '" data-priv="0">' +
           T('Pública') + '</button>';
      h += '<button class="btn-chico"' + marca + tit + ' data-inscribir="' + c.id + '" data-priv="1">' +
           T('Privada') + '</button>';
    }
    return h + '</div>';
  }

  // =============== pestaña: banco ===============

  /* El banco, partido en tres apartados.
   *
   * Era la pantalla más larga del juego con diferencia: el estado de cuenta,
   * el historial de crédito, las cuentas, el plazo, los préstamos, la tarjeta,
   * el prestamista, la pensión, las casas en venta y el alquiler, todo seguido
   * en un solo scroll de siete pantallazos.
   *
   * Lo que era información del jugador (cuánto tiene, cómo va su historial) se
   * fue a la pantalla de "Yo", que se abre desde la barra de arriba: no es algo
   * que se hace en el banco, es algo que se consulta. Lo que quedó son las tres
   * cosas que sí se hacen aquí.
   */
  var SUB_BANCO = [
    { id: 'cuentas',  ic: 'banco',   tx: 'Cuentas' },
    { id: 'credito',  ic: 'tarjeta', tx: 'Crédito' },
    { id: 'vivienda', ic: 'casa',    tx: 'Vivienda' }
  ];

  function subBancoActivo() {
    var e = Motor.get();
    var hayCredito = e.prestamos.length > 0 || !!e.tarjeta;
    var visibles = SUB_BANCO.filter(function (sp) {
      if (sp.id === 'credito') {
        return Motor.desbloqueado('credito') || Motor.desbloqueado('tarjeta') || hayCredito;
      }
      // A un menor de edad no se le ofrece mudarse: no es una decisión suya
      if (sp.id === 'vivienda') return !Motor.esMenor() || !!e.casa;
      return true;
    });
    var elegido = subDe.banco || 'cuentas';
    var existe = visibles.some(function (sp) { return sp.id === elegido; });
    return { id: existe ? elegido : visibles[0].id, visibles: visibles };
  }

  function vistaBanco() {
    var h = '<h2>' + T('Banco Cardamomo') + '</h2>';
    var sub = subBancoActivo();
    if (sub.visibles.length > 1) h += subPestanas(sub);
    return h + (sub.id === 'cuentas' ? bancoCuentas()
              : sub.id === 'credito' ? bancoCredito()
              : bancoVivienda());
  }

  function bancoCuentas() {
    var e = Motor.get();
    var h = '';
    h += tarjetaSaldos(e);
    /* Primero la de ahorro, que es la que un menor abre de verdad, y después
     * la monetaria, que llega cuando un patrono formal la pide. Cada una tiene
     * su propia llave en la ruta: no se regalan juntas. */
    var cuentasOfrecidas = [];
    if (Motor.desbloqueado('ahorro')) cuentasOfrecidas.push('ahorro');
    if (Motor.desbloqueado('monetaria')) cuentasOfrecidas.push('monetaria');

    if (cuentasOfrecidas.some(function (t2) { return e[t2] === null; })) {
      h += '<h3>' + T('Abrir cuenta') + '</h3>';
      cuentasOfrecidas.forEach(function (tipo) {
        if (e[tipo] !== null) return;
        var p = CONFIG.productos[tipo];
        var icoCuenta = tipo === 'monetaria' ? 'tarjeta' : 'banco';
        var minimo = Motor.aperturaMinima(tipo);
        h += '<div class="opcion"><div class="titulo">' + Ico(icoCuenta) +
             ' ' + esc(K('producto_nombre', tipo, p.nombre)) + '</div>';
        h += '<p class="sutil" style="margin:6px 0">' + esc(K('producto_desc', tipo, p.descripcion)) + '</p>';
        h += pastillas([
          pastilla('tendencia', T('{0}% al año', (p.tasaAnual * 100).toFixed(2)),
                   p.tasaAnual >= 0.02 ? 'ok' : ''),
          pastilla('cartera', T('abres con {0}', Q0(minimo))),
          p.manejoMensual
            ? pastilla('recibo', T('manejo {0} al mes', Q0(p.manejoMensual)), 'mal')
            : pastilla('visto', T('sin manejo de cuenta'), 'ok')
        ]);
        if (p.manejoMensual) {
          h += porQue('manejo' + tipo,
            '<p>' + T('El manejo de cuenta se te cobra cada mes solo por tenerla abierta. Va de Q10 a Q15 según el banco.') + '</p>' +
            '<p>' + T('Si tu sueldo lo deposita una empresa no te lo cobran, porque al banco le interesa tener tu planilla. El que lo paga es justo el que abrió la cuenta sin necesitarla.') + '</p>',
            T('Qué es el manejo de cuenta'));
        }
        if (Motor.esMenor()) {
          h += '<p class="sutil" style="margin:6px 0 0">' +
               T('Siendo menor de edad la abres con un adulto, y con menos dinero.') + '</p>';
        }
        h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-abrir="' +
             tipo + '">' + T('Abrir con {0}', Q0(minimo)) + '</button></div></div>';
      });
    }

    if (e.monetaria !== null || e.ahorro !== null) {
      h += '<h3>' + T('Mover dinero') + '</h3><div class="tarjeta"><div class="btn-fila">';
      if (e.monetaria !== null) {
        h += '<button class="btn-chico" data-mover="efectivo|monetaria">' + T('Efectivo ▸ Monetaria') + '</button>';
        h += '<button class="btn-chico" data-mover="monetaria|efectivo">' + T('Monetaria ▸ Efectivo') + '</button>';
      }
      if (e.ahorro !== null) {
        h += '<button class="btn-chico" data-mover="efectivo|ahorro">' + T('Efectivo ▸ Ahorro') + '</button>';
        if (e.monetaria !== null) h += '<button class="btn-chico" data-mover="monetaria|ahorro">' +
                                       T('Monetaria ▸ Ahorro') + '</button>';
        h += '<button class="btn-chico" data-mover="ahorro|efectivo">' + T('Ahorro ▸ Efectivo') + '</button>';
      }
      h += '</div></div>';
    }

    if (Motor.desbloqueado('plazo') && (e.ahorro !== null || e.monetaria !== null)) {
      h += '<h3>' + T('Depósito a plazo') + '</h3>';
      if (e.plazo) {
        h += '<div class="tarjeta acento">';
        h += fila(T('Monto'), Q(e.plazo.monto));
        h += fila(T('Tasa'), (e.plazo.tasa * 100).toFixed(2) + '%');
        h += fila(T('Rendimiento acumulado'), Q(e.plazo.ganado), 'pos');
        h += fila(T('Le faltan'), T('{0} meses', e.plazo.mesesRestantes));
        h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="romper-plazo">' +
             T('Sacarlo antes (pierdes lo ganado)') + '</button></div></div>';
      } else {
        h += '<div class="opcion"><div class="titulo">' + Ico('tendencia') + ' ' +
             esc(K('producto_nombre', 'plazo', CONFIG.productos.plazo.nombre)) + '</div>';
        h += '<p class="sutil" style="margin:6px 0">' +
             esc(K('producto_desc', 'plazo', CONFIG.productos.plazo.descripcion)) + '</p>';
        h += fila(T('Rendimiento anual'), (CONFIG.productos.plazo.tasaAnual * 100).toFixed(2) + '%', 'pos');
        h += fila(T('Mínimo'), Q0(CONFIG.productos.plazo.aperturaMinima));
        h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="abrir-plazo">' +
             T('Abrir') + '</button></div></div>';
      }
    }

    // La sección de crédito existe si la ruta la abrió, o si ya hay algo
    // vivo que el jugador tiene que poder ver y pagar.

    // ----- pensión -----
    if (Motor.desbloqueado('pension') || e.pension) {
    h += '<h3>' + T('Plan de pensiones') + '</h3>';
    if (e.pension) {
      var ganado = e.pension.saldo - e.pension.aportado;
      h += '<div class="tarjeta acento">';
      h += fila(T('Acumulado'), Q(e.pension.saldo), 'pos');
      h += fila(T('De eso pusiste tú'), Q(e.pension.aportado));
      h += fila(T('Lo puso el tiempo'), Q(ganado), 'pos');
      h += fila(T('Aporte mensual'), Q(e.pension.aporteMensual));
      h += fila(T('Rendimiento'), (PENSION.rendimientoAnual * 100).toFixed(2) + '%', 'pos');
      if (ganado > e.pension.aportado * 0.5) {
        h += '<div class="aprendizaje">' +
          T('Fíjate en la proporción. Lo que ganaste sin hacer nada ya se acerca a lo que aportaste.') +
          '</div>';
      }
      h += '<div class="btn-fila" style="margin-top:10px">' +
           '<button class="btn-chico" id="cambiar-pension">' + T('Cambiar aporte') + '</button>' +
           '<button class="btn-chico peligro" id="retirar-pension">' +
           (e.edad < PENSION.edadRetiro ? T('Retirar antes de tiempo') : T('Retirar')) +
           '</button></div></div>';
    } else {
      h += '<div class="opcion"><div class="titulo">' + Ico(PENSION.icono) + ' ' +
           esc(K('producto_nombre', 'pension', PENSION.nombre)) + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' +
           esc(K('producto_desc', 'pension', PENSION.descripcion)) + '</p>';
      h += fila(T('Rendimiento anual'), (PENSION.rendimientoAnual * 100).toFixed(2) + '%', 'pos');
      h += fila(T('Aporte mínimo'), Q0(PENSION.aporteMinimo));
      h += fila(T('Se retira a los'), T('{0} años', PENSION.edadRetiro));
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="abrir-pension">' +
           T('Abrir plan') + '</button></div></div>';
    }

    }


    return h;
  }

  function bancoCredito() {
    var e = Motor.get();
    var h = '';
    var hayCredito = e.prestamos.length > 0 || !!e.tarjeta;
    if (Motor.desbloqueado('credito') || Motor.desbloqueado('tarjeta') || hayCredito) {
    h += '<h3>' + T('Crédito') + '</h3>';
    for (var i = 0; i < e.prestamos.length; i++) {
      var p = e.prestamos[i];
      h += '<div class="opcion' + (p.tipo === 'informal' ? ' peligro' : '') + '">';
      h += '<div class="titulo">' + (p.tipo === 'informal' ? Ico('bandera') + ' ' + T('Préstamo del barrio')
                                                           : Ico('banco') + ' ' + T('Préstamo personal')) + '</div>';
      h += fila(T('Saldo'), Q(p.saldo), 'neg');
      h += fila(T('Cuota'), Q(p.cuota));
      // Nominal y efectiva juntas a proposito: es el concepto que el glosario
      // marca como el peor entendido del pais, y verlas lado a lado lo ensena.
      var efectiva = (Math.pow(1 + p.tasaMensual, 12) - 1) * 100;
      h += fila(T('Tasa nominal'), T('{0}% anual', (p.tasaMensual * 12 * 100).toFixed(2)));
      h += fila(T('Tasa efectiva'), T('{0}% anual', efectiva.toFixed(2)),
                p.tipo === 'informal' ? 'neg' : '');
      h += fila(T('Le faltan'), T('{0} cuotas', p.mesesRestantes));
      if (p.atrasos) h += '<p class="aviso">' + T('Llevas {0} cuota(s) de atraso.', p.atrasos) + '</p>';
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-abonar="' + i +
           '">' + T('Abonar de más') + '</button></div></div>';
    }

    if (e.tarjeta) {
      var usoPct = e.tarjeta.limite ? Math.round((e.tarjeta.saldo / e.tarjeta.limite) * 100) : 0;
      h += '<div class="opcion"><div class="titulo">' + Ico('tarjeta') + ' ' + T('Tarjeta de crédito') + '</div>';
      h += fila(T('Saldo'), Q(e.tarjeta.saldo), e.tarjeta.saldo > 0 ? 'neg' : '');
      h += fila(T('Límite'), Q0(e.tarjeta.limite));
      h += fila(T('Usado'), usoPct + '%');
      h += fila(T('Tasa'), T('{0}% anual', (CREDITOS.tarjeta.tasaAnual * 100).toFixed(2)), 'neg');
      h += '<div class="fila"><span class="etq">' + T('Cada mes pago') + '</span><span class="val">' +
           '<button class="btn-chico" id="alternar-minimo">' +
           (e.tarjeta.pagarMinimo ? T('solo el mínimo') : T('todo el saldo')) + '</button></span></div>';
      if (e.tarjeta.pagarMinimo && e.tarjeta.saldo > 0) {
        h += '<div class="aprendizaje">' +
          T('Pagando solo el mínimo, esta deuda casi no baja y los intereses se acumulan sobre los intereses.') +
          '</div>';
      }
      h += '<div class="btn-fila" style="margin-top:10px">' +
           '<button class="btn-chico" id="gastar-tarjeta">' + T('Comprar con la tarjeta') + '</button>' +
           '<button class="btn-chico" id="pagar-tarjeta">' + T('Abonar') + '</button></div></div>';
    }

    h += '<div class="btn-fila" style="margin-bottom:12px">';
    if (Motor.desbloqueado('credito')) {
      h += '<button class="btn-chico" id="pedir-prestamo">' + Ico('banco') + ' ' + T('Pedir préstamo') + '</button>';
    }
    if (Motor.desbloqueado('tarjeta') && !e.tarjeta) {
      h += '<button class="btn-chico" id="pedir-tarjeta">' + Ico('tarjeta') + ' ' + T('Pedir tarjeta') + '</button>';
    }
    if (Motor.desbloqueado('informal')) {
      h += '<button class="btn-chico peligro" id="pedir-informal">' + Ico('bandera') + ' ' + T('Prestamista del barrio') + '</button>';
    }
    h += '</div>';
    }


    return h;
  }

  function bancoVivienda() {
    var e = Motor.get();
    var h = '';
    // ----- casa propia e hipoteca -----
    if (Motor.desbloqueado('casa') || e.casa) {
    h += '<h3>' + T('Casa propia') + '</h3>';
    if (e.casa) {
      var casaDef = buscar(CASAS, e.casa.id);
      h += '<div class="tarjeta acento"><div class="titulo">' + Ico(casaDef.icono) + ' ' +
           esc(D(casaDef, 'nombre')) + '</div>';
      h += fila(T('Vale hoy'), Q(e.casa.valor), 'pos');
      if (e.hipoteca) {
        h += fila(T('Debes de hipoteca'), Q(e.hipoteca.saldo), 'neg');
        h += fila(T('Cuota'), Q(e.hipoteca.cuota));
        h += fila(T('Le faltan'), T('{0} cuotas', e.hipoteca.mesesRestantes));
        h += fila(T('Es tuyo de verdad'), Q(e.casa.valor - e.hipoteca.saldo),
                  (e.casa.valor - e.hipoteca.saldo) > 0 ? 'pos' : 'neg');
        if (e.hipoteca.atrasos) {
          h += '<p class="aviso">' + T('Llevas {0} cuota(s) de atraso. Con la casa de por medio, esto termina en embargo.', e.hipoteca.atrasos) + '</p>';
        }
      } else {
        h += '<div class="aprendizaje">' + T('La casa está pagada. Es completamente tuya.') + '</div>';
      }
      h += '</div>';
    } else if (!e.migracion) {
      h += '<p class="sutil">' + T('La decisión financiera más grande de una vida. El banco pide historial, ingreso comprobable y enganche.') + '</p>';
      for (var ci = 0; ci < CASAS.length; ci++) {
        var casa = CASAS[ci];
        var chkH = Motor.requisitoHipoteca(casa, HIPOTECA.plazos[1]);
        h += '<div class="opcion' + (chkH.ok ? '' : ' bloqueada') + '">';
        h += '<div class="titulo">' + Ico(casa.icono) + ' ' + esc(D(casa, 'nombre'));
        if (casa.apoyoFHA) h += '<span class="etiqueta ok">' + T('enganche 5%') + '</span>';
        h += '</div><p class="sutil" style="margin:6px 0">' + esc(D(casa, 'descripcion')) + '</p>';
        h += fila(T('Precio'), Q0(casa.precio));
        h += fila(T('Enganche y gastos'), Q0(Motor.efectivoParaEnganche(casa)), 'neg');
        h += fila(T('Cuota a {0} años', HIPOTECA.plazos[1]),
                  Q0(Motor.cuotaHipoteca(casa, HIPOTECA.plazos[1])));
        if (!chkH.ok) h += '<p class="aviso">' + esc(chkH.razon) + '</p>';
        else h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-casa="' +
                  casa.id + '">' + T('Ver la hipoteca') + '</button></div>';
        h += '</div>';
      }
    }

    }


    h += '<h3>' + T('Vivienda') + '</h3>';
    if (e.casa || e.migracion) {
      h += '<p class="sutil">' + (e.casa ? T('Vives en tu propia casa.')
                                         : T('Vives fuera del país.')) + '</p>';
    } else
    Object.keys(CONFIG.vivienda).forEach(function (id) {
      var v = CONFIG.vivienda[id];
      var esActual = e.vivienda === id;
      h += '<div class="opcion' + (esActual ? ' activa' : '') + '">';
      h += '<div class="titulo">' + Ico('casa') + ' ' + esc(K('vivienda_nombre', id, v.nombre)) +
           (esActual ? '<span class="etiqueta ok">' + T('actual') + '</span>' : '') + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(K('vivienda_desc', id, v.descripcion)) + '</p>';
      h += fila(T('Costo total al mes'), Q0(v.renta + v.serviciosComida + v.personal), 'neg');
      if (v.requisitoIngreso) h += fila(T('Ingreso exigido'), Q0(v.requisitoIngreso));
      if (!esActual) h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-mudar="' +
                          id + '">' + T('Mudarse aquí') + '</button></div>';
      h += '</div>';
    });


    return h;
  }

  /* Los saldos, cortos: lo que hay en cada lugar y nada más.
   *
   * El patrimonio y el historial ya no van aquí: van en "Yo". */
  function tarjetaSaldos(e) {
    var h = '<div class="tarjeta saldos">';
    h += fila(Ico('cartera') + ' ' + T('En la mano'), Q(e.efectivo));
    if (e.monetaria !== null || Motor.desbloqueado('monetaria')) {
      h += fila(Ico('tarjeta') + ' ' + T('Monetaria'),
                e.monetaria === null ? '<span class="sutil">' + T('sin abrir') + '</span>' : Q(e.monetaria));
    }
    h += fila(Ico('banco') + ' ' + T('Ahorro'),
              e.ahorro === null ? '<span class="sutil">' + T('sin abrir') + '</span>' : Q(e.ahorro));
    if (e.plazo) {
      h += fila(Ico('tendencia') + ' ' + T('Plazo fijo'),
                Q(e.plazo.monto) + ' · ' + T('{0} meses', e.plazo.mesesRestantes));
    }
    /* Y si el banco le está cobrando manejo, se dice aquí y no en la letra
     * chica: es un cargo que el jugador puede evitar y tiene que poder verlo. */
    var manejo = Motor.manejoDeCuenta();
    if (manejo > 0) {
      h += '<div class="fila"><span class="etq">' + Ico('recibo') + ' ' +
           T('Manejo de cuenta') + '</span><span class="val neg">-' + Q(manejo) +
           T(' al mes') + '</span></div>';
      h += '<p class="sutil" style="margin:6px 0 0">' +
           T('No te lo cobrarían si una empresa te depositara el sueldo.') + '</p>';
    }
    return h + '</div>';
  }

  // =============== la pantalla de "Yo" ===============

  /* Todo lo que el jugador es, en un solo lugar.
   *
   * Se abre tocando el muñeco de la barra de arriba. Está aparte del banco a
   * propósito: mezclar "cuánto tengo" con "qué producto contrato" es lo que
   * hacía que la pestaña del banco fuera ilegible. */
  /* La ventana de "Yo". Se conecta a mano porque vive fuera de #app y la
   * delegacion de clics de la aplicacion no la alcanza. */
  function mostrarPerfil() {
    var dm = modal(vistaPerfil());
    var g = dm.querySelector('#ver-glosario');
    if (g) g.addEventListener('click', function () { dm.remove(); mostrarGlosario(); });
    var r = dm.querySelector('#ver-reporte');
    if (r) r.addEventListener('click', function () { dm.remove(); mostrarReporte(); });
    return dm;
  }

  function vistaPerfil() {
    var e = Motor.get();
    var t = Motor.trabajoActual();
    var h = '<div class="retrato grande">' + Muneco({
      trabajo: t ? t.id : (e.migracion ? e.migracion.empleoId : null),
      estudia: !!e.estudio,
      graduado: e.carrerasTerminadas.length > 0 && !e.estudio
    }) + '</div>';
    h += '<h2 class="centrado">' + T('{0} años', e.edad) + '</h2>';
    h += pastillas([
      pastilla('birrete', esc(nivel(e.educacion))),
      pastilla('maletin', t ? esc(D(t, 'nombre')) : T('sin trabajo')),
      pastilla('rayo', Math.round(e.energia) + '/' + CONFIG.energia.maxima,
               e.energia < CONFIG.energia.umbralRiesgo ? 'mal' : 'ok'),
      Motor.esMenor() ? pastilla('persona', T('menor de edad')) : ''
    ]);

    h += '<div class="tarjeta">';
    h += fila(T('Efectivo en mano'), Q(e.efectivo));
    h += fila(T('Cuenta monetaria'), e.monetaria === null ? T('sin abrir') : Q(e.monetaria));
    h += fila(T('Cuenta de ahorro'), e.ahorro === null ? T('sin abrir') : Q(e.ahorro));
    if (e.plazo) h += fila(T('Depósito a plazo'), Q(e.plazo.monto) + ' · ' + T('{0} meses', e.plazo.mesesRestantes));
    var deuda = Motor.deudaTotal();
    if (deuda > 0) h += fila(T('Lo que debes'), '-' + Q(deuda), 'neg');
    h += '<div class="fila total"><span class="etq"><strong>' + T('Patrimonio') + '</strong></span>' +
         '<span class="val">' + Q(Motor.patrimonio()) + '</span></div></div>';

    var tr = Motor.tramoPuntaje();
    h += '<div class="tarjeta"><h3 style="margin-top:0">' + T('Tu historial de crédito') + '</h3>';
    h += '<div class="medidor"><div class="medidor-relleno" style="width:' + e.puntaje + '%"></div></div>';
    h += '<div class="fila"><span class="etq">' + T('{0} de 100', Math.round(e.puntaje)) + '</span>' +
         '<span class="etiqueta ' + tr.clase + '">' + K('tramos', tr.nombre, tr.nombre) + '</span></div>';
    h += '<p class="sutil">' + esc(K('tramos_nota', tr.nombre, tr.nota)) + '</p>';
    if (e.puntaje < 1) {
      h += '<div class="aprendizaje">' +
        T('No pedir nunca nada prestado tampoco construye historial. Por eso mucha gente responsable no califica cuando de verdad lo necesita.') +
        '</div>';
    }
    h += fila(T('Te firmarían de fiador'), Motor.tieneFiador() ? T('sí') : T('todavía no'),
              Motor.tieneFiador() ? 'pos' : 'neg');
    h += '</div>';


    h += '<div class="btn-fila" style="margin-top:14px">' +
         '<button class="btn-chico" id="ver-glosario" style="flex:1">' + Ico('libro') + ' ' + T('Glosario') + '</button>' +
         '<button class="btn-chico" id="ver-reporte" style="flex:1">' + Ico('tendencia') + ' ' + T('Cómo voy') + '</button></div>';
    h += '<button class="btn-primario" data-cerrar style="margin-top:10px">' + T('Cerrar') + '</button>';
    return h;
  }

  // =============== pestaña: mejoras ===============

  /* La capa de tycoon.
   *
   * Es la única pantalla del juego donde los números suben. Todo lo demás mide
   * lo que se va —la renta, la colegiatura, los gastos hormiga— y para alguien
   * de trece años eso es un juego sin premio. Aquí se compra algo, se ve el
   * nivel subir y el mes siguiente entra más dinero.
   *
   * Y sigue siendo educación financiera, sin trampa: el dinero de las mejoras
   * es el mismo dinero de todo lo demás, así que comprar una es no tener eso.
   * Lo que la pantalla enseña a leer es **en cuántos meses se paga sola**, que
   * es el único cálculo que hay que hacer antes de comprar una herramienta.
   */
  /* =============== pestaña: el imperio ===============
   *
   * Esta pantalla es la respuesta a "no parece un tycoon".
   *
   * Antes eran cuatro tarjetas de mejoras con un "Nivel 2 de 4" escrito y un
   * número que subía. Ahora es lo que un tycoon tiene que ser: la calle con
   * tus locales, la gente que trabaja adentro, lo que vendieron, lo que se
   * fue en planilla y lo que quedó limpio.
   *
   * El orden de la pantalla es el orden en que un chico la va a leer:
   *
   *   1. la calle          lo que ya tiene, dibujado
   *   2. el marcador       vende / planilla / queda limpio
   *   3. los dos techos    cuántos negocios y cuánta gente aguanta HOY, y eso
   *                        depende de hasta dónde estudió. Es el sitio donde
   *                        el colegio se convierte en tamaño de empresa, y
   *                        está a la vista a propósito.
   *   4. sus negocios      uno por uno, con lo que se puede hacer con cada uno
   *   5. lo que puede abrir
   *   6. las mejoras para él mismo
   */
  function vistaImperio() {
    var e = Motor.get();
    var t = Motor.trabajoActual();
    var imp = Motor.imperio();
    var negs = Motor.negociosAbiertos();
    var h = '<h2>' + T('Tu imperio') + '</h2>';

    // --- 1. la calle, la misma que la del mes pero quieta ---
    h += '<div class="tarjeta escenario">';
    h += calle(false);

    // --- 2. el marcador ---
    var sale = imp.planilla + imp.costos;
    h += '<div class="tres-cifras">' +
      '<div><span class="etq">' + T('Venden') + '</span><b class="' +
        (imp.venta > 0 ? 'pos' : '') + '">' + Q0(imp.venta) + '</b></div>' +
      '<div><span class="etq">' + T('Sale') + '</span><b class="' +
        (sale > 0 ? 'neg' : '') + '">' + Q0(sale) + '</b></div>' +
      '<div class="queda"><span class="etq">' + T('Queda limpio') + '</span><b class="' +
        (imp.neto >= 0 ? 'pos' : 'neg') + '">' + Q0(imp.neto) + '</b></div>' +
      '</div>';
    h += '<p class="sutil" style="margin:0">' +
      T('Tienes {0} para invertir.', Q0(Motor.dineroDisponible())) + '</p>';
    h += '</div>';

    // --- 3. los dos techos, que es donde el colegio se vuelve tamaño ---
    h += tarjetaTechos(imp);

    // --- 4. sus negocios ---
    if (negs.length) {
      h += '<h3>' + T('Tus negocios') + '</h3>';
      negs.forEach(function (neg) { h += tarjetaNegocio(neg); });
    }

    // --- 5. lo que puede abrir ---
    h += ofertasDeNegocio(imp);

    /* La gráfica va DESPUÉS de los negocios, no antes.
     *
     * Es lo único de esta pantalla que no se puede tocar: cuenta cómo te ha
     * ido, y eso se mira, no se decide. Estaba encima de las tarjetas, así que
     * para llegar a lo accionable había que pasar por delante de ella. */
    h += graficaNegocio(e);

    // --- 6. las mejoras para él mismo ---
    h += '<h3>' + T('Mejoras para ti') + '</h3>';
    CADENAS.forEach(function (cad) { h += tarjetaCadena(e, cad); });

    h += porQue('mejoras',
      '<p>' + T('Un negocio se mide con dos números, no con uno: lo que vende y lo que le queda. Un negocio que vende el doble que otro puede ganar la mitad.') + '</p>' +
      '<p>' + T('Y una mejora no es un gasto: es una inversión, y una inversión se mide en cuántos meses tarda en pagarse sola. Divide lo que cuesta entre lo que te deja al mes.') + '</p>',
      T('Cómo se lee un negocio'));
    return h;
  }

  /* Los dos techos del imperio, con su barra.
   *
   * Está arriba y no escondido porque es el corazón del juego: el jugador ve
   * que puede con dos negocios y tres personas, y ve que el número sube
   * cuando termina de estudiar. Ningún texto convence tanto como esa barra. */
  function tarjetaTechos(imp) {
    function barra(ico, etq, hay, techo) {
      var pc = techo > 0 ? Math.min(100, Math.round((hay / techo) * 100)) : 0;
      return '<div class="techo">' +
        '<div class="fila"><span class="etq">' + Ico(ico) + ' ' + etq + '</span>' +
        '<span class="val">' + hay + ' ' + T('de') + ' ' + techo + '</span></div>' +
        '<div class="progreso"><div class="progreso-relleno' + (hay >= techo ? ' tope' : '') +
          '" style="width:' + pc + '%"></div></div></div>';
    }
    var h = '<div class="tarjeta techos">';
    h += barra('tienda', T('Negocios a la vez'), imp.negocios, imp.techoNegocios);
    h += barra('personas', T('Gente que puedes administrar'), imp.empleados, imp.techoEmpleados);
    h += '<p class="sutil">' +
      T('Los dos suben cuando terminas de estudiar. Llevar dos negocios son dos contabilidades, y una planilla hay que saber llevarla.') +
      '</p>';
    return h + '</div>';
  }

  /* Un negocio: lo que produce y todo lo que se puede hacer con él. */
  function tarjetaNegocio(neg) {
    var tn = Motor.tipoDeNegocio(neg.tipoId);
    if (!tn) return '';
    var pr = Motor.proyeccionDeNegocio(neg);
    var esc0 = Motor.nivelDeNegocio(neg);
    var mias = Motor.jornadasDelDueno(neg.tipoId);

    var h = '<div class="cadena negocio activa">';
    h += '<div class="cadena-alto">';
    h += '<span class="cadena-ic">' + Ico(tn.icono) + '</span>';
    h += '<span class="cadena-nom">' + esc(D(tn, 'nombre')) +
         '<small>' + esc(K('nivel_negocio', esc0.nombre, esc0.nombre)) + '</small></span>';
    h += '</div>';

    // los puntos del nivel
    h += '<div class="niveles">';
    for (var i = 0; i < NIVELES_NEGOCIO.length; i++) {
      h += '<span class="punto' + (i < (neg.nivel || 1) ? ' lleno' : '') + '"></span>';
    }
    h += '<span class="niveles-txt">' +
         T('Nivel {0} de {1}', neg.nivel || 1, NIVELES_NEGOCIO.length) + '</span>';
    h += '</div>';

    /* Los dos números que importan, uno al lado del otro. Que "vende" y
     * "queda" sean cifras distintas es la lección entera de este archivo. */
    h += '<div class="tres-cifras chico">' +
      '<div><span class="etq">' + T('Vende') + '</span><b>' + Q0(pr.venta) + '</b></div>' +
      '<div><span class="etq">' + T('Le sale') + '</span><b class="neg">' +
        Q0(pr.costoMensual + pr.planilla) + '</b></div>' +
      '<div class="queda"><span class="etq">' + T('Le queda') + '</span><b class="' +
        (pr.neto >= 0 ? 'pos' : 'neg') + '">' + Q0(pr.neto) + '</b></div>' +
      '</div>';

    h += pastillas([
      pastilla('personas', T('{0} de {1} plazas llenas',
        neg.empleados.length + (mias > 0 ? 1 : 0), pr.plazas)),
      pastilla('manana', T('{0} jornadas tuyas', mias), mias > 0 ? 'ok' : 'mal')
    ]);

    /* Un negocio sin jornadas y sin gente no vende NADA y la renta corre
     * igual. En pantalla eso salía como un "Vende Q0" sin explicación, que es
     * la peor forma de enseñar algo: el jugador ve el número raro y no sabe
     * qué hacer. */
    if (mias === 0 && !neg.empleados.length) {
      h += '<p class="aviso">' +
        T('Vacío no vende nada y la renta corre igual. Ponle una jornada en la pestaña del mes, o contrata a alguien.') +
        '</p>';
    } else if (pr.sinDueno) {
      h += '<p class="aviso">' +
        T('No le pusiste ninguna jornada este mes, así que rinde {0}% menos. Delegar funciona; desaparecer, no.',
          Math.round((1 - RENDIMIENTO_SIN_DUENO) * 100)) + '</p>';
    }
    if (pr.llena && pr.plazas > 1) {
      h += '<p class="sutil">' + T('Está lleno: no cabe una jornada más. Súbele el nivel.') + '</p>';
    }

    // --- subir de nivel ---
    var sig = (neg.nivel || 1) < NIVELES_NEGOCIO.length ? NIVELES_NEGOCIO[neg.nivel] : null;
    if (sig) {
      var costo = Motor.costoDeSubirNivel(neg.tipoId);
      var faltaN = Motor.faltaParaSubirNivel(neg.tipoId);
      h += '<div class="mejora-sig">';
      h += '<div class="titulo">' + Ico('trending-up') + ' ' +
           esc(K('nivel_negocio', sig.nombre, sig.nombre)) + '</div>';
      h += pastillas([
        pastilla('tendencia', T('vende {0}% más',
          Math.round((sig.multiplicador / esc0.multiplicador - 1) * 100)), 'ok'),
        pastilla('personas', T('+{0} plazas', sig.plazasExtra), 'ok')
      ]);
      h += barraDeMeta(costo);
      if (faltaN) {
        h += '<p class="aviso">' + esc(K('mejora_falta', faltaN.motivo, faltaN.razon)) + '</p>';
        h += '<button class="btn-primario" disabled>' + T('Subir por {0}', Q0(costo)) + '</button>';
      } else {
        h += '<button class="btn-primario" data-subir-negocio="' + neg.tipoId + '">' +
             Ico('mas') + ' ' + T('Subir por {0}', Q0(costo)) + '</button>';
      }
      h += '</div>';
    }

    // --- la gente ---
    h += tarjetaGente(neg, pr);

    // --- traspasarlo, discreto y al final ---
    var vale = Motor.valorDeTraspaso(neg.tipoId);
    h += '<button class="porque-btn" data-traspasar="' + neg.tipoId + '">' +
         Ico('adelantar') + ' ' +
         (vale >= 0 ? T('Traspasarlo y recuperar {0}', Q0(vale))
                    : T('Cerrarlo (te cuesta {0})', Q0(-vale))) + '</button>';

    return h + '</div>';
  }

  /* La planilla de un negocio: quién trabaja ahí y qué cuesta.
   *
   * Los dos botones de contratar están uno al lado del otro con su precio
   * completo, y ahí está la lección más útil de todo el juego para quien
   * algún día tenga un negocio: el formal NO cuesta su sueldo. */
  function tarjetaGente(neg, pr) {
    var h = '<div class="gente">';
    h += '<div class="fila"><span class="etq">' + Ico('personas') + ' ' + T('Tu gente') +
         '</span><span class="val">' + (neg.empleados.length
           ? '-' + Q0(pr.planilla) + ' ' + T('al mes') : T('nadie todavía')) + '</span></div>';

    neg.empleados.forEach(function (emp, k) {
      var pl = PLANILLA[emp.tipo] || PLANILLA.informal;
      var indem = Motor.indemnizacionDe(emp);
      h += '<div class="empleado">' +
        '<span class="emp-nom">' + Ico('persona') + ' ' +
          esc(K('planilla_nombre', emp.tipo, pl.nombre)) +
          '<small>' + Q0(Motor.costoDeEmpleado(emp.tipo)) + ' ' + T('al mes') + '</small></span>' +
        '<button class="btn-chico" data-despedir="' + neg.tipoId + '" data-emp="' + k + '">' +
          (indem > 0 ? T('Despedir ({0})', Q0(indem)) : T('Despedir')) + '</button>' +
        '</div>';
    });

    // Y los dos contratos, con su precio de verdad
    ['informal', 'formal'].forEach(function (tipo) {
      var pl = PLANILLA[tipo];
      var faltaC = Motor.faltaParaContratar(neg.tipoId, tipo);
      // Si no cabe nadie o no puede administrar más, no se ofrece: se explica
      if (faltaC && (faltaC.motivo === 'plazas' || faltaC.motivo === 'techo')) return;
      var costo = Motor.costoDeEmpleado(tipo);
      h += '<div class="contrato' + (tipo === 'formal' ? ' formal' : '') + '">';
      h += '<div class="fila"><span class="etq">' +
             esc(K('planilla_nombre', tipo, pl.nombre)) + '</span>' +
             '<span class="val">-' + Q0(costo) + ' ' + T('al mes') + '</span></div>';
      h += '<p class="sutil">' + esc(K('planilla_nota', tipo, pl.nota)) + '</p>';
      if (tipo === 'formal') {
        h += '<p class="sutil">' +
          T('Le pagas {0} de sueldo y te cuesta {1}: encima van el IGSS, el aguinaldo, el Bono 14 y las vacaciones.',
            Q0(pl.sueldo), Q0(costo)) + '</p>';
      }
      if (faltaC) {
        h += '<p class="aviso">' + esc(K('mejora_falta', faltaC.motivo, faltaC.razon)) + '</p>';
      } else {
        h += '<button class="btn-chico" data-contratar="' + neg.tipoId +
             '" data-contrato="' + tipo + '">' + Ico('mas') + ' ' +
             T('Contratar') + '</button>';
      }
      h += '</div>';
    });

    return h + '</div>';
  }

  /* Los negocios que puede abrir hoy.
   *
   * Se esconde todo lo que no está a su alcance por edad o por estudio, que
   * es la regla del juego: lo que no has desbloqueado no existe. Lo único que
   * SÍ se muestra sin poder comprarse es lo que solo le falta dinero, porque
   * eso no es una traba, es una meta, y la barra la hace visible. */
  function ofertasDeNegocio(imp) {
    var abre = [];
    var topado = false;
    TIPOS_NEGOCIO.forEach(function (tn) {
      var falta = Motor.faltaParaAbrir(tn.id);
      if (!falta || falta.motivo === 'dinero') { abre.push([tn, falta]); return; }
      if (falta.motivo === 'techo') topado = true;
    });

    if (topado && !abre.length) {
      return '<div class="tarjeta"><p class="aviso">' +
        T('Ya llevas los {0} negocios que puedes administrar. Para llevar más, hay que estudiar más.',
          imp.techoNegocios) + '</p></div>';
    }
    if (!abre.length) return '';

    var h = '<h3>' + T('Abrir un negocio') + '</h3>';
    abre.forEach(function (par) {
      var tn = par[0], falta = par[1];
      // Lo que dejaría con una sola persona adentro, que es como va a empezar
      var mes = tn.ventaPorJornada * CONFIG.jornadasPorMes;
      var queda = Math.round(mes * tn.margen - tn.costoMensual);
      var meses = queda > 0 ? Math.ceil(tn.costoApertura / queda) : 0;

      h += '<div class="cadena oferta">';
      h += '<div class="cadena-alto">';
      h += '<span class="cadena-ic">' + Ico(tn.icono) + '</span>';
      h += '<span class="cadena-nom">' + esc(D(tn, 'nombre')) +
           '<small>' + esc(D(tn, 'descripcion')) + '</small></span>';
      h += '</div>';
      h += pastillas([
        pastilla('tendencia', T('vende {0} al mes', Q0(mes))),
        pastilla('moneda', T('le quedan {0}', Q0(queda)), queda > 0 ? 'ok' : 'mal'),
        pastilla('balanza', T('margen del {0}%', Math.round(tn.margen * 100))),
        pastilla('personas', tn.plazas === 1 ? T('cabe una persona')
                                             : T('caben {0}', tn.plazas)),
        meses ? pastilla('calendario', meses === 1 ? T('se paga en un mes')
                                                   : T('se paga en {0} meses', meses)) : null
      ].filter(Boolean));
      h += '<p class="sutil">' + T('Esas cifras son con una sola persona adentro: tú.') + '</p>';
      h += barraDeMeta(tn.costoApertura);
      if (falta) {
        h += '<p class="aviso">' + esc(K('mejora_falta', falta.motivo, falta.razon)) + '</p>';
        h += '<button class="btn-primario" disabled>' +
             T('Abrir por {0}', Q0(tn.costoApertura)) + '</button>';
      } else {
        h += '<button class="btn-primario" data-abrir-negocio="' + tn.id + '">' +
             Ico('mas') + ' ' + T('Abrir por {0}', Q0(tn.costoApertura)) + '</button>';
      }
      h += '</div>';
    });
    return h;
  }

  /* La barra de cuánto le falta para juntar una cantidad.
   *
   * Es lo que convierte "no te alcanza" en una meta. En un tycoon el jugador
   * tiene que poder VER que se está acercando; si solo lee que no le alcanza,
   * cierra la pantalla. */
  function barraDeMeta(costo) {
    if (!costo) return '';
    var tiene = Math.min(Motor.dineroDisponible(), costo);
    var pc = Math.round((tiene / costo) * 100);
    return '<div class="progreso mejora-barra"><div class="progreso-relleno" style="width:' +
             pc + '%"></div></div>' +
           '<div class="fila"><span class="etq sutil">' +
             T('Llevas {0} de {1}', Q0(tiene), Q0(costo)) + '</span>' +
             '<span class="val sutil">' + pc + '%</span></div>';
  }

  /* Una cadena de mejoras: el nivel que lleva y lo que sigue. */
  function tarjetaCadena(e, cad) {
    var lista = Motor.mejorasDeCadena(cad.id);
    var nivel = Motor.nivelDeCadena(cad.id);
    var sig = Motor.siguienteMejora(cad.id);
    var actual = nivel > 0 ? lista[nivel - 1] : null;

    var h = '<div class="cadena' + (nivel > 0 ? ' activa' : '') + '">';
    h += '<div class="cadena-alto">';
    h += '<span class="cadena-ic">' + Ico(actual ? actual.icono : cad.icono) + '</span>';
    h += '<span class="cadena-nom">' + esc(K('cadena_nombre', cad.id, cad.nombre)) +
         '<small>' + (actual ? esc(D(actual, 'nombre'))
                             : T('todavía nada')) + '</small></span>';
    h += '</div>';

    // Los puntos del nivel: es lo que hace que se sienta un tycoon
    h += '<div class="niveles">';
    for (var i = 0; i < lista.length; i++) {
      h += '<span class="punto' + (i < nivel ? ' lleno' : '') + '"></span>';
    }
    h += '<span class="niveles-txt">' + T('Nivel {0} de {1}', nivel, lista.length) + '</span>';
    h += '</div>';

    if (!sig) {
      h += '<div class="al-maximo">' + Ico('crown') + ' ' +
           T('Al máximo. No hay nada más que mejorar aquí.') + '</div>';
      return h + '</div>';
    }

    h += '<div class="mejora-sig">';
    h += '<div class="titulo">' + Ico(sig.icono) + ' ' + esc(D(sig, 'nombre')) + '</div>';
    h += pastillas(pastillasDeMejora(sig));
    var falta = Motor.faltaParaMejora(sig.id);
    if (!falta || falta.motivo === 'dinero') h += barraDeMeta(sig.costo);

    if (falta) {
      h += '<p class="aviso">' + esc(K('mejora_falta', falta.motivo, falta.razon)) + '</p>';
      h += '<button class="btn-primario" disabled>' + T('Comprar por {0}', Q0(sig.costo)) + '</button>';
    } else {
      h += '<button class="btn-primario" data-mejora="' + sig.id + '">' +
           Ico('mas') + ' ' + T('Comprar por {0}', Q0(sig.costo)) + '</button>';
    }
    h += '</div>';
    return h + '</div>';
  }

  /* La gráfica de lo que ha producido el negocio, mes por mes.
   *
   * Se dibuja con Chart.js, que vive en vendor/ dentro del repositorio. Y
   * SIEMPRE comprobando que exista: si ese archivo faltara, la pantalla se
   * dibuja igual sin la gráfica en vez de quedarse en blanco.
   *
   * El lienzo se llena después de pintar, porque Chart.js necesita el elemento
   * ya metido en la página para medirlo.
   */
  var graficaViva = null;
  var escenaCrecio = false;

  function graficaNegocio(e) {
    if (typeof Chart === 'undefined') return '';
    var meses = (e.bitacora || []).slice(-12);
    var conNegocio = meses.filter(function (m) { return (m.negocio || 0) > 0; });
    // Con menos de dos meses de historia la gráfica no dice nada
    if (conNegocio.length < 2) return '';
    /* El lienzo va dentro de una caja de alto FIJO.
     *
     * Chart.js con `maintainAspectRatio: false` estira el lienzo hasta llenar
     * a su padre, y el padre no tenía alto: la gráfica salía de casi quinientos
     * píxeles para dibujar dos barras. El atributo `height` del canvas no la
     * frena, hace falta que el padre mida. */
    return '<div class="tarjeta grafica-caja">' +
      '<h3 style="margin-top:0">' + T('Lo que han dejado tus negocios') + '</h3>' +
      '<div class="lienzo"><canvas id="grafica-negocio"></canvas></div></div>';
  }

  /* Llena el lienzo de la gráfica. Se llama al final de pintar(). */
  function pintarGraficaNegocio() {
    if (typeof Chart === 'undefined') return;
    /* Todo aquí adentro va protegido. Una gráfica es un adorno: si el
     * navegador no puede dibujarla —o si esto corre en un DOM de prueba que no
     * tiene canvas— la pantalla tiene que quedar igual, no en blanco. */
    try {
      if (!document.getElementById) return;
      var lienzo = document.getElementById('grafica-negocio');
      if (!lienzo) return;
      var e = Motor.get();
      if (!e) return;
      var meses = (e.bitacora || []).slice(-12);
      if (graficaViva) { graficaViva.destroy(); graficaViva = null; }
      graficaViva = new Chart(lienzo, {
        type: 'bar',
        data: {
          labels: meses.map(function (m) { return String(m.mes || '').slice(0, 3); }),
          datasets: [{
            label: T('Tus negocios'),
            data: meses.map(function (m) { return Math.round(m.negocio || 0); }),
            backgroundColor: colorDePaleta('--verde', '#1f7a5a'),
            borderRadius: 5,
            maxBarThickness: 26
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 500 },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { beginAtZero: true, ticks: { font: { size: 10 }, maxTicksLimit: 4 },
                 grid: { color: colorDePaleta('--linea', '#dbe4e0') } }
          }
        }
      });
    } catch (err) { graficaViva = null; }
  }

  /* El valor de verdad de una variable de la paleta.
   * Chart.js dibuja en un canvas y ahí no llegan las variables de CSS: hay
   * que resolverlas a mano. */
  function colorDePaleta(nombre, respaldo) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(nombre);
      return (v && v.trim()) || respaldo;
    } catch (e) { return respaldo; }
  }

  /* Lo que da una mejora, en pastillas, más el dato que importa: en cuántos
   * meses se paga sola. */
  function pastillasDeMejora(m) {
    var ef = m.efecto || {};
    var lista = [];
    if (ef.bonoJornada) {
      lista.push(pastilla('maletin', T('+{0} por jornada', Q0(ef.bonoJornada)), 'ok'));
    }
    if (ef.avanceEstudio) {
      var pct2 = Math.round((ef.avanceEstudio / AVANCE_POR_JORNADA_ESTUDIO) * 100);
      lista.push(pastilla('birrete', T('estudias {0}% más rápido', pct2), 'ok'));
    }
    if (ef.energiaExtra) {
      lista.push(pastilla('rayo', T('+{0} de energía al descansar', ef.energiaExtra), 'ok'));
    }
    if (ef.costoMensual) {
      lista.push(pastilla('recibo', T('-{0} al mes de mantenimiento', Q0(ef.costoMensual)), 'mal'));
    }
    var meses = mesesEnPagarse(m);
    if (meses) lista.push(pastilla('calendario', T('se paga en {0} meses', meses)));
    return lista;
  }

  /* En cuántos meses se paga sola una mejora.
   *
   * Es el número que el juego quiere que el jugador aprenda a calcular, así
   * que lo calcula a la vista y no lo esconde. Solo tiene sentido cuando la
   * mejora produce dinero: las de energía y de estudio pagan en tiempo. */
  function mesesEnPagarse(m) {
    var ef = m.efecto || {};
    var alMes = -(ef.costoMensual || 0);
    // Una herramienta paga por jornada: se cuenta un mes de trabajo completo
    if (ef.bonoJornada) alMes += ef.bonoJornada * CONFIG.jornadasPorMes;
    if (alMes <= 0) return 0;
    return Math.ceil(m.costo / alMes);
  }

  // =============== pestaña: extra ===============

  /* La lista de trabajos extra, filtrada por para qué sirve cada uno.
   *
   * Los ocho minijuegos vivían todos juntos en una pestaña llamada "Extra",
   * que era un cajón de sastre: mientras tanto, Trabajo y Estudio eran dos
   * pantallas de solo mirar con un único botón, y ese botón destruía
   * —renunciar, dejar de estudiar—. Las actividades estaban guardadas lejos de
   * los sitios donde tenían sentido.
   *
   * Ahora los de trabajo salen en Trabajo y los que enseñan salen en Estudio.
   * Es el mismo `data-jugar` de siempre y la misma jornada de Extra: lo que
   * cambia es dónde se encuentran. */
  function listaMinijuegos(filtro) {
    var e = Motor.get();
    /* La carrera EN CURSO, que es lo que decide qué clases hay.
     * Las clases van con la carrera que estás haciendo, no con el título que
     * ya tienes: la tarea de básicos se hace en básicos. */
    var lista = Minijuegos.disponibles(e.educacion, e.carrerasTerminadas,
        e.estudio ? e.estudio.carreraId : null, Motor.experiencia())
      .filter(filtro || function () { return true; });
    if (!lista.length) return '';

    var h = '';
    lista.forEach(function (j) {
      /* Una CLASE cuesta una jornada de tarea y da experiencia; un oficio
       * cuesta una de Extra y paga. Son dos monedas distintas y dos casillas
       * distintas, y la tarjeta tiene que decir cuál es cuál sin que haya que
       * leerla dos veces. */
      var clase = j.tipo === 'clase';
      var libres = Motor.espaciosUsados(clase ? 'tarea' : 'minijuego');
      var etiqueta = clase ? T('clase')
                   : (j.tipo === 'generico' ? T('paga') : T('de tu profesión'));
      h += '<div class="opcion"><div class="titulo">' + Ico(j.icono) + ' ' + esc(D(j, 'nombre')) +
           '<span class="etiqueta">' + etiqueta + '</span></div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(j, 'descripcion')) + '</p>';
      h += pastillas([
        clase ? pastilla('birrete', T('hasta +{0} de experiencia', j.experienciaMaxima || 0), 'ok')
              : pastilla('moneda', T('hasta {0}', Q0(j.pagoMaximo)), 'ok'),
        j.ensena ? pastilla('libro', esc(D(j, 'ensena'))) : ''
      ]);
      /* En `sutil` y no en `aviso`: no es un error, es una instrucción. El
       * rojo de aviso está para cuando algo va mal, y gastarlo en "te falta
       * una jornada" es gritar donde solo hacía falta decir. */
      if (libres === 0) {
        h += '<p class="sutil">' + (clase
          ? T('Ponle una jornada a las tareas en la pestaña del mes.')
          : T('Ponle una jornada a Extra en la pestaña del mes.')) + '</p>';
      }
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-jugar="' +
           j.id + '"' + (libres > 0 ? '' : ' disabled') + '>' +
           Ico(clase ? 'libro' : 'mando') + ' ' + T('Hacerlo') + '</button></div></div>';
    });
    return h;
  }

  var esDeTrabajo = function (j) { return j.tipo !== 'clase'; };
  /* Una CLASE, y de las que el colegio dejó este turno.
   *
   * No están todas las que existen: cada turno el colegio deja unas cuantas al
   * azar. Es lo que hace que el colegio se sienta un colegio y no un menú —no
   * eliges qué tarea te toca— y, con las tareas de rama, es de donde sale el
   * perfil que después ordena la lista de carreras. */
  var esDeEstudio = function (j) {
    return j.tipo === 'clase' && Motor.tareasDelMes().indexOf(j.id) >= 0;
  };

  /* La pestaña Extra: los ocho juntos.
   *
   * Desde que los de trabajo salen en Trabajo y los que enseñan salen en
   * Estudio, esta pantalla ya no es donde se encuentran: es donde se ven
   * TODOS de un vistazo, incluidos los que todavía no están abiertos. Sirve
   * para saber qué hay más adelante, que es distinto de servir para jugarlos.
   */
  function vistaExtra() {
    var h = '<h2>' + T('Trabajos extra') + '</h2>';
    h += '<p class="sutil">' +
      T('Los de oficio salen también en Trabajo y los que enseñan en Estudio, al lado de lo que tienen que ver. Aquí están todos.') +
      '</p>';
    h += listaMinijuegos(null);

    var bloqueados = Minijuegos.todos().length -
      Minijuegos.disponibles(Motor.get().educacion, Motor.get().carrerasTerminadas,
        Motor.get().estudio ? Motor.get().estudio.carreraId : null, Motor.experiencia()).length;
    if (bloqueados > 0) {
      h += '<p class="sutil centrado">' +
        T('Hay {0} más que se abren al subir de nivel educativo.', bloqueados) + '</p>';
    }
    return h;
  }

  // =============== pestañas ===============

  var PESTANAS_DEF = {
    casa:    { ic: 'calendario', tx: 'Mes' },
    trabajo: { ic: 'maletin', tx: 'Trabajo' },
    /* La llave sigue llamándose 'mejoras' porque es la que usa
     * datos/progreso.js y la que ya tienen guardada las partidas viejas.
     * Lo que cambió es lo que hay dentro: ahora es el imperio.
     *
     * 'trending-up' viene del respaldo de Lucide: dice crecimiento, que es de
     * lo que trata esta pestaña, y no se confunde con ningún otro del juego. */
    mejoras: { ic: 'trending-up', tx: 'Imperio' },
    estudio: { ic: 'birrete', tx: 'Estudio' },
    banco:   { ic: 'banco', tx: 'Banco' },
    extra:   { ic: 'mando', tx: 'Extra' },
    noticias: { ic: 'periodico', tx: 'Noticias' }
  };

  function pestanas() {
    var items = ordenVisible().map(function (id) {
      return { id: id, ic: PESTANAS_DEF[id].ic, tx: PESTANAS_DEF[id].tx };
    });
    /* La marca de la pestaña activa se dibuja una sola vez y viaja de la
     * posición anterior a la nueva. Como la barra se vuelve a dibujar entera
     * en cada render, una transición de CSS no serviría (el elemento es
     * nuevo cada vez); una animación con las dos posiciones sí. */
    var orden = items.map(function (it) { return it.id; });
    var desde = Math.max(0, orden.indexOf(pestanaPrevia));
    var hasta = Math.max(0, orden.indexOf(pestana));

    var h = '<nav class="pestanas" style="--pestanas:' + items.length + '">';
    h += '<span class="pest-marca" style="--desde:' + desde + ';--hasta:' + hasta + '"></span>';
    items.forEach(function (it) {
      h += '<button' + (pestana === it.id ? ' class="activa"' : '') + ' data-pestana="' + it.id + '">' +
           '<span class="ic-caja">' + Ico(it.ic) + '</span>' +
           '<span class="txt">' + T(it.tx) + '</span></button>';
    });
    return h + '</nav>';
  }

  var latirBarra = false;

  /* Dibuja, y si la jugada acaba de abrir un peldaño de la ruta, lo anuncia.
   *
   * El orden es a proposito: primero se revisa la ruta, luego se pinta (para
   * que la pestaña nueva ya esté detrás de la tarjeta) y al final sale el
   * anuncio. Al revés, el jugador cierra la tarjeta y ve la pantalla vieja.
   */
  function render() {
    // La vista va en la llamada porque los pasos del tutorial dependen de
    // dónde está el jugador, no solo de su estado de cuenta.
    var nuevos = Motor.revisarProgreso({ pestana: pestana, espacioSel: espacioSel });
    pintar();
    // Los peldaños sin título son movimientos del tutorial: se abren callados
    var anunciables = nuevos.filter(function (p) { return !!p.titulo; });
    if (anunciables.length) anunciarPeldanos(anunciables);
  }

  /* Anuncia los peldaños recién abiertos, de uno en uno. Cada tarjeta espera
   * a que la cierren antes de sacar la siguiente: dos ventanas encimadas no
   * se leen, se cierran. */
  function anunciarPeldanos(lista) {
    var i = 0;
    (function siguiente() {
      if (i >= lista.length) return pintar();
      var p = lista[i++];
      Sonido.tono('logro');
      modal(
        '<span class="icono">' + Ico(p.icono) + '</span>' +
        '<div class="peldano-sello">' + T('Se abrió algo nuevo') + '</div>' +
        '<h2>' + esc(K('progreso_titulo', p.id, p.titulo)) + '</h2>' +
        '<p>' + esc(K('progreso_texto', p.id, p.texto)) + '</p>' +
        (p.leccion
          ? '<div class="aprendizaje"><strong>' + T('Lo que importa.') + '</strong> ' +
            esc(K('progreso_leccion', p.id, p.leccion)) + '</div>'
          : '') +
        avanceRuta() +
        '<button class="btn-primario" data-cerrar>' + T('Seguir') + '</button>',
        siguiente);
    })();
  }

  /* Cuánto de la ruta llevas abierto. Sale en cada anuncio, porque saber que
   * faltan cuatro cosas más es lo que hace que valga la pena seguir. */
  function avanceRuta() {
    var abiertos = Motor.peldanosAbiertos();
    var total = PROGRESO.length;
    return '<div class="fila" style="margin-top:14px">' +
             '<span class="etq">' + T('Tu ruta') + '</span>' +
             '<span class="val">' + T('{0} de {1}', abiertos, total) + '</span></div>' +
           '<div class="progreso"><div class="progreso-relleno" style="width:' +
             Math.round((abiertos / total) * 100) + '%"></div></div>';
  }

  function pintar() {
    var cuerpo = pestana === 'casa' ? vistaCasa()
               : pestana === 'trabajo' ? vistaTrabajo()
               : pestana === 'estudio' ? vistaEstudio()
               : pestana === 'banco' ? vistaBanco()
               : pestana === 'noticias' ? vistaNoticias()
               : pestana === 'mejoras' ? vistaImperio()
               : vistaExtra();
    var clase = 'vista' + (sentido ? ' vista-entra ' + (sentido > 0 ? 'desde-der' : 'desde-izq') : '');
    app.innerHTML = barra() + '<main class="' + clase + '">' + cuerpo + '</main>' + pestanas();
    sentido = 0;
    pintarGuia();
    pintarGraficaNegocio();
    colocarCalle();
    // La barra de dinero late cuando el saldo cambio, para que el jugador vea
    // que algo paso sin tener que comparar cifras de memoria.
    if (latirBarra) {
      latirBarra = false;
      var c = app.querySelector('.barra .cifras');
      if (c) c.classList.add('late');
    }
  }

  /* Dónde queda parada la calle cuando se vuelve a pintar.
   *
   * Sin esto la calle es inservible como tablero. La escena empieza con la
   * casa, la escuela y el oficio —126 unidades de las 300 que mide con dos
   * negocios— así que en un teléfono de 390 px lo que se ve al abrir el juego
   * es una lámpara, unos libros y un rótulo, y **los negocios quedan fuera de
   * pantalla**. Justo lo contrario de lo que esta pantalla tiene que decir.
   *
   * Así que arranca pegada a la DERECHA, donde están los negocios y el lote
   * vacío. Y se recuerda dónde la dejó el jugador, porque si no, cada vez que
   * toca un local la pantalla se vuelve a pintar y la calle le salta de sitio
   * debajo del dedo.
   *
   * `scrollCalle` es por pestaña: la del mes y la del imperio se miran de
   * forma distinta y cada una recuerda la suya. */
  var scrollCalle = {};

  function colocarCalle() {
    var caja = app.querySelector('.escena-caja');
    if (!caja || !caja.scrollWidth) return;
    var sobra = caja.scrollWidth - caja.clientWidth;
    if (sobra <= 0) return;
    var guardado = scrollCalle[pestana];
    caja.scrollLeft = (typeof guardado === 'number') ? Math.min(guardado, sobra) : sobra;
    caja.addEventListener('scroll', function () { scrollCalle[pestana] = caja.scrollLeft; });
  }

  // =============== tarjetas superpuestas ===============

  function modal(html, alCerrar) {
    var d = document.createElement('div');
    d.className = 'velo';
    d.innerHTML = '<div class="modal">' + html + '</div>';
    d.addEventListener('click', function (ev) {
      if (ev.target === d || (ev.target.closest && ev.target.closest('[data-cerrar]'))) {
        d.remove();
        if (alCerrar) alCerrar(); else render();
      }
    });
    document.body.appendChild(d);
    return d;
  }

  function tarjetaEducativa(clave, icono, titulo, cuerpo, leccion, alCerrar) {
    var e = Motor.get();
    if (e.vistos[clave]) { if (alCerrar) alCerrar(); return false; }
    e.vistos[clave] = true;
    Motor.guardar();
    Sonido.tono('logro');
    modal('<span class="icono">' + Ico(icono) + '</span><h2>' + esc(titulo) + '</h2><p>' + cuerpo + '</p>' +
      (leccion ? '<div class="aprendizaje"><strong>' + T('Lo que importa.') + '</strong> ' + leccion + '</div>' : '') +
      '<button class="btn-primario" data-cerrar>' + T('Entendido') + '</button>', alCerrar);
    return true;
  }

  function pedirMonto(titulo, maximo, alConfirmar, nota) {
    var d = modal('<h2>' + esc(titulo) + '</h2>' +
      (nota ? '<p class="sutil">' + nota + '</p>' : '') +
      '<p class="sutil">' + T('Disponible: {0}', Q(maximo)) + '</p>' +
      '<input type="number" id="monto" min="1" step="50" value="' + Math.floor(maximo) + '">' +
      '<div class="btn-fila" style="margin-top:14px"><button class="btn-primario" id="ok">' +
      T('Confirmar') + '</button></div>' +
      '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
      T('Cancelar') + '</button></div>');
    d.querySelector('#ok').addEventListener('click', function () {
      var v = parseFloat(d.querySelector('#monto').value);
      d.remove();
      if (!isNaN(v) && v > 0) alConfirmar(v);
      render();
    });
  }

  /* Una pregunta de sí o no. Existe para lo que no se puede deshacer. */
  function confirmar(titulo, texto, alAceptar) {
    var d = modal('<span class="icono">' + Ico('alerta') + '</span><h2>' + esc(titulo) + '</h2>' +
      '<p>' + esc(texto) + '</p>' +
      '<button class="btn-primario peligro" id="si-confirmo">' + T('Sí, hazlo') + '</button>' +
      '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar style="flex:1">' +
      T('Mejor no') + '</button></div>');
    var b = d.querySelector('#si-confirmo');
    if (b) b.addEventListener('click', function () { d.remove(); alAceptar(); });
    return d;
  }

  function aviso(titulo, texto) {
    Sonido.tono('alerta');
    modal('<h2>' + esc(titulo) + '</h2><p>' + esc(texto) + '</p>' +
          '<button class="btn-primario" data-cerrar>' + T('Está bien') + '</button>');
  }

  // =============== gráficos ===============

  /* Barra de flujo del mes.
   *
   * El resumen del mes era una lista de renglones con totales, y ahi es donde
   * el jugador se perdia: veia "gastos Q2,440" sin saber en que. Esto parte lo
   * que entro y lo que salio en segmentos proporcionales, asi que de un golpe
   * se ve que la renta se come la mitad del sueldo, sin leer una cifra.
   */

  var COLOR_ENTRA = {
    salario:  '#1f7a5a',
    bono:     '#2f9b74',
    negocio:  '#b5811f',
    remesa:   '#2c5f8a',
    extras:   '#4b86ae',
    intereses:'#7cb342'
  };
  var COLOR_SALE = {
    vivienda:    '#b8422e',
    transporte:  '#c4603f',
    colegiatura: '#8a4b8f',
    deuda:       '#8c2f1f',
    enviado:     '#2c5f8a',
    imprevistos: '#b5811f',
    fuga:        '#9a8f6b',
    impuestos:   '#6b7a75'
  };

  function segmentos(pares, colores, total) {
    var h = '';
    for (var i = 0; i < pares.length; i++) {
      var pct = total > 0 ? (pares[i].monto / total) * 100 : 0;
      if (pct <= 0) continue;
      h += '<div class="flujo-seg" style="width:' + pct.toFixed(2) + '%;background:' +
           colores[pares[i].id] + '" title="' + esc(pares[i].nombre) + '"></div>';
    }
    return h;
  }

  function leyenda(pares, colores, total) {
    var h = '<div class="flujo-leyenda">';
    for (var i = 0; i < pares.length; i++) {
      if (pares[i].monto <= 0) continue;
      var pct = total > 0 ? Math.round((pares[i].monto / total) * 100) : 0;
      h += '<span class="flujo-item"><span class="flujo-punto" style="background:' +
           colores[pares[i].id] + '"></span>' + esc(pares[i].nombre) +
           ' <b>' + Q(pares[i].monto) + '</b>' + (pct >= 8 ? ' · ' + pct + '%' : '') + '</span>';
    }
    return h + '</div>';
  }

  function barraFlujo(m) {
    var entra = [
      { id: 'salario',   nombre: T('Salario'),          monto: (m.salario || 0) + (m.bono || 0) },
      { id: 'remesa',    nombre: T('Remesas'),          monto: m.remesa || 0 },
      /* Los negocios van en su PROPIO trozo de la barra.
       *
       * Estaban metidos dentro de "Ingresos extra" junto con la mesada y los
       * trabajos sueltos, así que en un mes en que el imperio dejó Q26,748 la
       * barra decía "ingresos extra 79%". Lo que sostiene al jugador no puede
       * llamarse extra, y además el desglose de abajo ya lo llamaba "Tu
       * negocio": dos nombres para lo mismo en la misma tarjeta. */
      { id: 'negocio',   nombre: T('Tus negocios'),     monto: m.negocio || 0 },
      { id: 'extras',    nombre: T('Ingresos extra'),
        monto: (m.extras || 0) + (m.mesada || 0) },
      { id: 'intereses', nombre: T('Intereses ganados'), monto: (m.intereses || 0) + (m.rendimientoPension || 0) }
    ];
    var sale = [
      { id: 'vivienda',    nombre: T('Vivienda y gastos'), monto: m.vivienda || 0 },
      { id: 'transporte',  nombre: T('Transporte'),        monto: m.transporte || 0 },
      { id: 'colegiatura', nombre: T('Colegiatura'),       monto: m.colegiatura || 0 },
      { id: 'mejoras',     nombre: T('Mantenimiento de tus mejoras'), monto: m.mantenimiento || 0 },
      { id: 'deuda',       nombre: T('Deudas e intereses'),
        monto: (m.cuotasPagadas || 0) + (m.pagoTarjeta || 0) + (m.cuotaHipoteca || 0) + (m.interesesPagados || 0) },
      { id: 'enviado',     nombre: T('Mandado a tu familia'),
        monto: (m.enviado || 0) + (m.comisionEnvio || 0) + (m.comisionRemesa || 0) },
      { id: 'imprevistos', nombre: T('Imprevistos'),
        monto: (m.imprevistos || 0) + (m.enfermedad || 0) },
      { id: 'fuga',        nombre: T('Gastos hormiga'),
        monto: (m.fuga || 0) + (m.perdidaEfectivo || 0) },
      { id: 'impuestos',   nombre: T('Impuestos y aportes'),
        monto: (m.isr || 0) + (m.aportePension || 0) + (m.manejo || 0) }
    ];

    var suma = function (xs) { var t = 0; for (var i = 0; i < xs.length; i++) t += xs[i].monto; return t; };
    var totalEntra = suma(entra), totalSale = suma(sale);
    if (totalEntra <= 0 && totalSale <= 0) return '';

    // Las dos barras se miden contra el mismo maximo, si no la comparacion miente
    var tope = Math.max(totalEntra, totalSale, 1);
    var neto = totalEntra - totalSale;

    var h = '<div class="flujo">';
    h += '<div class="flujo-fila"><div class="flujo-tit"><span>' + T('Entró') +
         '</span><b class="pos">' + Q(totalEntra) + '</b></div>' +
         '<div class="flujo-barra" style="width:' + ((totalEntra / tope) * 100).toFixed(1) + '%">' +
         segmentos(entra, COLOR_ENTRA, totalEntra) + '</div>' +
         leyenda(entra, COLOR_ENTRA, totalEntra) + '</div>';
    h += '<div class="flujo-fila salidas"><div class="flujo-tit"><span>' + T('Salió') +
         '</span><b class="neg">' + Q(totalSale) + '</b></div>' +
         '<div class="flujo-barra" style="width:' + ((totalSale / tope) * 100).toFixed(1) + '%">' +
         segmentos(sale, COLOR_SALE, totalSale) + '</div>' +
         leyenda(sale, COLOR_SALE, totalSale) + '</div>';
    h += '<div class="flujo-neto ' + (neto >= 0 ? 'bien' : 'mal') + '"><span>' +
         (neto >= 0 ? T('Te quedó') : T('Te faltó')) + '</span><b>' + Q(Math.abs(neto)) + '</b></div>';
    return h + '</div>';
  }

  /* Gráfica del patrimonio a lo largo de la vida.
   * SVG a mano, sin librerias. Dibuja el cero porque estar debajo de esa
   * linea es la informacion mas importante que puede dar la grafica.
   */
  function graficaPatrimonio(serie) {
    if (!serie || serie.length < 2) return '';
    var an = 320, al = 132, pad = 6;
    var vals = serie.map(function (p) { return p.patrimonio; });
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    if (max === min) { max = max + 1; min = min - 1; }
    var rango = max - min;
    var x = function (i) { return pad + (i / (serie.length - 1)) * (an - pad * 2); };
    var y = function (v) { return pad + (1 - (v - min) / rango) * (al - pad * 2); };

    var linea = '', area = '';
    for (var i = 0; i < serie.length; i++) {
      linea += (i ? ' L' : 'M') + x(i).toFixed(1) + ',' + y(vals[i]).toFixed(1);
    }
    area = linea + ' L' + x(serie.length - 1).toFixed(1) + ',' + y(Math.max(min, 0)).toFixed(1) +
           ' L' + x(0).toFixed(1) + ',' + y(Math.max(min, 0)).toFixed(1) + ' Z';

    var h = '<svg class="grafica" viewBox="0 0 ' + an + ' ' + al + '" preserveAspectRatio="none" ' +
            'role="img" aria-label="' + T('Tu patrimonio a lo largo de la vida') + '">';
    h += '<path class="relleno" d="' + area + '"/>';
    if (min < 0 && max > 0) {
      h += '<line class="cero" x1="' + pad + '" y1="' + y(0).toFixed(1) +
           '" x2="' + (an - pad) + '" y2="' + y(0).toFixed(1) + '"/>';
    }
    h += '<path class="linea" d="' + linea + '"/>';
    h += '<circle class="punto" cx="' + x(serie.length - 1).toFixed(1) + '" cy="' +
         y(vals[vals.length - 1]).toFixed(1) + '" r="3.5"/>';
    h += '</svg>';
    h += '<div class="grafica-pie"><span>' + T('{0} años', serie[0].edad) + '</span>' +
         '<span>' + T('máximo {0}', Q(max)) + '</span>' +
         '<span>' + T('{0} años', serie[serie.length - 1].edad) + '</span></div>';
    return h;
  }

  /* Moneda que sube cuando entra dinero. Puro adorno, pero es la unica
   * confirmacion inmediata de que algo funciono. */
  function monedaVuela(elemento) {
    if (!elemento || !elemento.getBoundingClientRect) return;
    try {
      var r = elemento.getBoundingClientRect();
      var s = document.createElement('span');
      s.className = 'moneda-vuela';
      s.innerHTML = Ico('moneda');
      s.style.left = (r.left + r.width / 2 - 11) + 'px';
      s.style.top = (r.top + window.scrollY - 6) + 'px';
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 800);
    } catch (e) {}
  }

  // =============== primer turno guiado ===============

  /* La guia avanza sola segun lo que el jugador YA hizo, no con un boton de
   * siguiente. Mientras el peldaño no se cumpla, la cinta se queda ahi y
   * señala donde hay que tocar. Asi nadie termina el tutorial sin haber hecho
   * nunca lo que el tutorial explica.
   *
   * Los pasos NO viven aqui: son los primeros peldaños de la ruta, los que
   * llevan `guia: true` en datos/progreso.js. Tener una sola lista es lo que
   * evita que el tutorial diga una cosa y el juego abra otra.
   *
   * Se puede salir en un toque. Alguien que ya entiende no tiene por que
   * pasar por esto, y a quien vuelve meses despues le sirve empezar de nuevo.
   */

  var PASOS_GUIA = PROGRESO.filter(function (p) { return p.guia; });

  function guiaActiva() {
    var e = Motor.get();
    if (!e || e.vistos.guiaSaltada) return null;
    var sig = Motor.siguientePeldano();
    if (!sig || !sig.peldano.guia) return null;
    return { paso: sig.peldano, n: PASOS_GUIA.indexOf(sig.peldano) + 1 };
  }

  function pintarGuia() {
    var vieja = document.querySelector('.guia');
    if (vieja) vieja.remove();
    var previos = document.querySelectorAll('.senala');
    Array.prototype.forEach.call(previos, function (n) { n.classList.remove('senala'); });

    var act = guiaActiva();
    // La marca en el body es lo que le da al contenido el espacio de la cinta
    try { document.body.classList[act ? 'add' : 'remove']('hay-guia'); } catch (e) {}
    if (!act) {
      /* Y se apaga el foco.
       *
       * Sin esto, al terminar el tutorial la cinta desaparecía pero el velo
       * oscuro y la flecha se quedaban pegados en la pantalla, señalando un
       * hueco vacío, y el juego quedaba a oscuras para siempre. */
      focoSel = null;
      pintarFoco(null);
      return;
    }

    /* El botón de salirse es un enlace chiquito arriba a la derecha, no un
     * botón del mismo tamaño que el que hay que tocar.
     *
     * Estaba puesto como botón grande al lado del principal, y en esa posición
     * era la salida más cómoda de la pantalla: invitaba a saltarse el tutorial
     * en vez de hacerlo. Sigue estando —quien ya sabe jugar tiene derecho a
     * irse en un toque— pero ya no compite. */
    var d = document.createElement('div');
    d.className = 'guia';
    d.innerHTML = '<div class="guia-cinta">' +
      '<div class="guia-alto">' +
        '<span class="guia-paso">' + T('Paso {0} de {1}', act.n, PASOS_GUIA.length) + '</span>' +
        '<button class="guia-salir" data-guia-salir>' + T('Ya sé jugar') + '</button>' +
      '</div>' +
      '<div class="guia-txt">' + esc(K('progreso_pista', act.paso.id, act.paso.pista)) + '</div>' +
      (act.paso.pestana && pestana !== act.paso.pestana
        ? '<button class="btn-primario guia-ir" data-guia-ir="' + act.paso.pestana + '">' +
          T('Llévame ahí') + '</button>'
        : '') +
      '</div>';
    document.body.appendChild(d);

    // La cinta vive fuera de #app, asi que la delegacion de clics de la
    // aplicacion no la alcanza: escucha por su cuenta.
    var salir = d.querySelector('[data-guia-salir]');
    if (salir) salir.addEventListener('click', saltarGuia);
    var ir = d.querySelector('[data-guia-ir]');
    if (ir) ir.addEventListener('click', function () {
      irAPestana(ir.getAttribute('data-guia-ir'));
      render();
    });

    // Señala el elemento del paso, si esta a la vista en esta pestaña.
    // El selector puede venir calculado: hay pasos donde lo que hay que tocar
    // cambia a mitad del paso.
    if (act.paso.senala) {
      var sel = typeof act.paso.senala === 'function'
        ? act.paso.senala(Motor.get(), { pestana: pestana, espacioSel: espacioSel })
        : act.paso.senala;
      /* TODAS las que cumplen, no la primera.
       *
       * Esto era un fallo de fondo y no de dibujo. `querySelector` devuelve la
       * primera, y el foco apaga TODO lo demás: en la pantalla de estudio, el
       * tutorial alumbraba "Pública" de la primera carrera y dejaba a oscuras
       * la privada y el "a trabajar"; en la de trabajo, alumbraba una de las
       * tres ofertas. O sea que en las dos pantallas donde el juego pregunta
       * al jugador qué quiere hacer, el tutorial le contestaba por él.
       *
       * Y no es un detalle de estilo: la lección de este juego es que esas
       * decisiones se pagan de formas distintas y que ninguna es gratis. Un
       * tutorial que señala una sola enseña que hay una respuesta correcta,
       * que es exactamente lo contrario. */
      var objs = sel ? Array.prototype.slice.call(document.querySelectorAll(sel)) : [];
      objs.forEach(function (o) { o.classList.add('senala'); });
      focoSel = objs.length ? sel : null;
      pintarFoco(objs);
    } else {
      focoSel = null;
      pintarFoco(null);
    }
  }

  /* El foco: todo oscuro menos el pedazo que hay que tocar, con una flecha.
   *
   * El aro ámbar alrededor del objetivo no bastaba. En una pantalla llena de
   * tarjetas y botones, un aro es un detalle más; alguien que abre el juego
   * por primera vez no sabe dónde mirar. Esto apaga el resto.
   *
   * El truco es una sombra enorme: el hueco no se dibuja, así que lo que hay
   * debajo se ve con su color de siempre y todo lo demás queda debajo de una
   * capa negra. El foco NO recibe clics (pointer-events: none), así que el
   * jugador puede seguir tocando lo que quiera: se le señala el camino, no se
   * le cierra la puerta.
   */
  var focoSel = null;

  /* Recibe UNA cosa o VARIAS, y alumbra todas.
   *
   * Cuando el paso señala opciones —las carreras, las ofertas de trabajo, las
   * casillas libres del mes— hay que dejar encendidas todas, no la primera.
   * Se hace con la caja que las contiene a todas, que para opciones apiladas
   * una debajo de otra es justo la lista. */
  /* Las tarjetas que envuelven una opción. Si el objetivo vive dentro de una,
   * lo que se alumbra es la tarjeta entera. */
  var TARJETA_DE_OPCION = '.oferta, .opcion, .cadena';

  function cajaDe(cosas) {
    var lista = (cosas && cosas.length !== undefined && typeof cosas !== 'string')
      ? Array.prototype.slice.call(cosas) : [cosas];

    /* Con VARIAS opciones se alumbra la tarjeta de cada una, no su botón.
     *
     * La diferencia importa y se ve de inmediato: los tres botones "Aceptar"
     * de las ofertas de trabajo están alineados en la misma columna, así que
     * la caja que los contiene a los tres es una tira vertical estrecha que
     * parte las tres tarjetas por la mitad y no se entiende. Alumbrando las
     * tarjetas, el hueco es justo "estas son tus tres opciones".
     *
     * Con UNA sola no se toca nada: ahí el paso no está ofreciendo opciones,
     * está diciendo qué botón tocar, y agrandar el hueco a la tarjeta entera
     * lo haría menos claro. */
    if (lista.length > 1) {
      lista = lista.map(function (o) {
        if (!o || typeof o.closest !== 'function') return o;
        var t = null;
        try { t = o.closest(TARJETA_DE_OPCION); } catch (err) { t = null; }
        return t || o;
      });
    }

    var cajas = [];
    for (var i = 0; i < lista.length; i++) {
      var o = lista[i];
      if (!o || typeof o.getBoundingClientRect !== 'function') continue;
      var c;
      try { c = o.getBoundingClientRect(); } catch (err) { continue; }
      // Sin navegador de verdad no hay geometría: las pruebas no dibujan foco
      if (!c || !c.width || !c.height) continue;
      cajas.push(c);
    }
    if (!cajas.length) return null;
    var t = cajas[0].top, iz = cajas[0].left;
    var ab = cajas[0].bottom, de = cajas[0].right;
    for (var j = 1; j < cajas.length; j++) {
      t = Math.min(t, cajas[j].top);   iz = Math.min(iz, cajas[j].left);
      ab = Math.max(ab, cajas[j].bottom); de = Math.max(de, cajas[j].right);
    }
    return { top: t, left: iz, width: de - iz, height: ab - t };
  }

  function pintarFoco(obj) {
    var viejo = document.querySelector('.foco');
    if (viejo && viejo.remove) viejo.remove();
    var flechaVieja = document.querySelector('.foco-flecha');
    if (flechaVieja && flechaVieja.remove) flechaVieja.remove();

    var r = cajaDe(obj);
    if (!r) return;

    var m = 7;   // aire alrededor del objetivo
    var d = document.createElement('div');
    d.className = 'foco';
    d.style.top = (r.top - m) + 'px';
    d.style.left = (r.left - m) + 'px';
    d.style.width = (r.width + m * 2) + 'px';
    d.style.height = (r.height + m * 2) + 'px';
    document.body.appendChild(d);

    /* La flecha va aparte del velo y por encima de la cinta.
     *
     * Metida dentro del foco quedaba debajo de la cinta del tutorial, que es
     * justo lo que hay entre la cinta y las pestañas: se dibujaba y no se
     * veía. Aparte puede ir más arriba en el orden de capas sin que el velo
     * oscurezca también la cinta. */
    var f = document.createElement('span');
    // Cabe arriba si el objetivo no está pegado al techo de la pantalla
    var arriba = r.top > 120;
    f.className = 'foco-flecha ' + (arriba ? 'arriba' : 'abajo');
    f.style.left = (r.left + r.width / 2) + 'px';
    // Pegada al objetivo: con mas hueco se mete encima de lo que hay arriba
    f.style.top = (arriba ? r.top - m - 30 : r.top + r.height + m + 2) + 'px';
    f.innerHTML = Ico('flecha');
    document.body.appendChild(f);

    /* Y si la flecha cae justo donde está la cinta, la cinta se levanta.
     *
     * Pasa siempre que el paso señala una pestaña: la barra de pestañas está
     * abajo, la cinta se sienta justo encima, y la flecha no tenía dónde ir
     * más que sobre el texto de la cinta. Se mide y se corre. */
    try {
      var cinta = document.querySelector('.guia');
      var rc = cinta && cinta.getBoundingClientRect();
      var rf = f.getBoundingClientRect();
      if (rc && rc.height && rc.bottom > rf.top && rc.top < rf.bottom) {
        var sube = Math.ceil(rc.bottom - rf.top) + 8;
        cinta.style.bottom = 'calc(' + (60 + sube) + 'px + env(safe-area-inset-bottom))';
        document.body.classList.add('cinta-alta');
      } else {
        document.body.classList.remove('cinta-alta');
      }
    } catch (err) {}
  }

  /* Al hacer scroll o girar el teléfono el objetivo se mueve y el foco se
   * queda donde estaba. Esto lo vuelve a poner encima. */
  function reubicarFoco() {
    if (!focoSel) return;
    /* querySelectorAll y no querySelector, y esto NO es un detalle: con uno
     * solo, el primer scroll de la pantalla apagaba todas las opciones menos
     * la primera y el arreglo del foco duraba hasta que el jugador movía el
     * dedo. */
    pintarFoco(document.querySelectorAll(focoSel));
  }

  function saltarGuia() {
    var e = Motor.get();
    e.vistos.guiaSaltada = true;
    Motor.guardar();
    var g = document.querySelector('.guia');
    if (g) g.remove();
    var s = document.querySelector('.senala');
    if (s) s.classList.remove('senala');
    focoSel = null;
    pintarFoco(null);
  }

  // =============== resumen del turno ===============

  /* El cierre del mes cuando el juego todavía no habla de dinero.
   *
   * Es una boleta, no un estado de cuenta: cuánta experiencia ganaste y cuánto
   * te falta de carrera. Poner las dos barras de entró y salió aquí sería
   * contestar una pregunta que el jugador no se ha hecho todavía, y encima con
   * cifras que no puede mover: a los trece el dinero entra y sale solo. */
  function boletaDelMes(m) {
    var e = Motor.get();
    var gano = Math.round(m.experiencia || 0);

    var h = '<span class="icono">' + Ico('birrete') + '</span>' +
      '<h2 style="text-transform:capitalize">' + esc(m.mes) + ' ' + m.anio +
      (m.mesesCubiertos > 1 ? ' · ' + T('{0} meses', m.mesesCubiertos) : '') + '</h2>';

    h += '<div class="tres-cifras">' +
      '<div><span class="etq">' + T('Experiencia') + '</span><b class="pos">+' + gano + '</b></div>' +
      '<div class="queda"><span class="etq">' + T('Llevas') + '</span><b>' +
        Motor.experiencia() + '</b></div></div>';

    if (e.estudio) {
      var car = buscar(CARRERAS, e.estudio.carreraId);
      var av = Math.min(1, e.estudio.mesesAvanzados / car.mesesRequeridos);
      var faltan = Math.max(0, Math.ceil(car.mesesRequeridos - e.estudio.mesesAvanzados));
      h += '<div class="fila"><span class="etq">' + Ico(car.icono) + ' ' +
           esc(D(car, 'nombre')) + '</span><span class="val sutil">' +
           T('Faltan {0} meses', faltan) + '</span></div>';
      h += '<div class="progreso"><div class="progreso-relleno" style="width:' +
           Math.round(av * 100) + '%"></div></div>';
    }
    return h;
  }

  function resumenTurno(m, pendientes) {
    /* Sin dinero en pantalla, el cierre del mes es otra cosa. */
    if (sinDineroTodavia()) {
      var hb = boletaDelMes(m);
      if (m.eventos.length) {
        hb += '<ul class="eventos">';
        m.eventos.forEach(function (t) { hb += '<li>' + esc(t) + '</li>'; });
        hb += '</ul>';
      }
      return hb + '<button class="btn-primario" data-cerrar style="margin-top:16px">' +
             (pendientes ? T('Siguiente') : T('Seguir')) + '</button>';
    }

    var h = '<span class="icono">' + Ico('calendario') + '</span><h2 style="text-transform:capitalize">' +
            esc(m.mes) + ' ' + m.anio +
            (m.mesesCubiertos > 1 ? ' · ' + T('{0} meses', m.mesesCubiertos) : '') + '</h2>';
    h += barraFlujo(m);

    /* Y el desglose línea por línea va PLEGADO.
     *
     * Las dos barras ya cuentan el mes entero: cuánto entró, de dónde, cuánto
     * salió, en qué, y cuánto quedó. Debajo venían hasta veintiséis filas
     * repitiendo exactamente eso mismo, partido más fino. Era la pantalla más
     * cargada del juego, y encima aparece en el único momento en que el
     * jugador SÍ quiere leer: cuando acaba de cerrar el mes.
     *
     * Sigue entero, porque cuadrar el mes al centavo es parte de lo que este
     * juego enseña y hay quien lo quiere. Pero se pide.
     *
     * `<details>` y no el plegable propio del juego a propósito: esto vive en
     * una ventana encima de la pantalla, y el plegable propio se abre volviendo
     * a pintar la pantalla de abajo, que no es la que se está mirando. */
    var det = '';
    if (m.salario) det += fila(T('Salario'), Q(m.salario), 'pos');
    if (m.bono) det += fila(T('Bono de ley'), Q(m.bono), 'pos');
    if (m.mesada) det += fila(T('Mesada'), Q(m.mesada), 'pos');
    if (m.negocio) det += fila(T('Tu negocio'), Q(m.negocio), 'pos');
    if (m.mantenimiento) det += fila(T('Mantenimiento de tus mejoras'), '-' + Q(m.mantenimiento), 'neg');
    if (m.remesa) det += fila(T('Remesas'), Q(m.remesa), 'pos');
    if (m.extras) det += fila(T('Ingresos extra'), Q(m.extras), 'pos');
    if (m.comisionRemesa) det += fila(T('Comisión de remesa'), '-' + Q(m.comisionRemesa), 'neg');
    if (m.vivienda) det += fila(T('Vivienda y gastos'), '-' + Q(m.vivienda), 'neg');
    if (m.colegiatura) det += fila(T('Colegiatura'), '-' + Q(m.colegiatura), 'neg');
    if (m.manejo) det += fila(T('Manejo de cuenta'), '-' + Q(m.manejo), 'neg');
    if (m.enviado) det += fila(T('Mandado a tu familia'), '-' + Q(m.enviado), 'neg');
    if (m.comisionEnvio) det += fila(T('Comisión del envío'), '-' + Q(m.comisionEnvio), 'neg');
    if (m.cuotaHipoteca) det += fila(T('Cuota de hipoteca'), '-' + Q(m.cuotaHipoteca), 'neg');
    if (m.aportePension) det += fila(T('Aporte a pensión'), '-' + Q(m.aportePension));
    if (m.rendimientoPension) det += fila(T('Rendimiento de la pensión'), Q(m.rendimientoPension), 'pos');
    if (m.cuotasPagadas) det += fila(T('Cuotas pagadas'), '-' + Q(m.cuotasPagadas), 'neg');
    if (m.pagoTarjeta) det += fila(T('Pago de tarjeta'), '-' + Q(m.pagoTarjeta), 'neg');
    if (m.interesesPagados) det += fila(T('Intereses que pagaste'), '-' + Q(m.interesesPagados), 'neg');
    if (m.imprevistos) det += fila(T('Imprevistos'), '-' + Q(m.imprevistos), 'neg');
    if (m.enfermedad) det += fila(T('Enfermedad'), '-' + Q(m.enfermedad), 'neg');
    if (m.fuga) det += fila(T('Gastos hormiga'), '-' + Q(m.fuga), 'neg');
    if (m.perdidaEfectivo) det += fila(T('Efectivo perdido'), '-' + Q(m.perdidaEfectivo), 'neg');
    if (m.intereses) det += fila(T('Intereses ganados'), Q(m.intereses), 'pos');
    if (m.isr) det += fila(T('Impuesto sobre intereses'), '-' + Q(m.isr), 'neg');
    if (m.deudaHogar) det += fila(T('Quedaste debiendo'), Q(m.deudaHogar), 'neg');

    if (det) {
      h += '<details class="desglose"><summary>' + Ico('recibo') + ' ' +
           T('Ver línea por línea') + '</summary>' + det + '</details>';
    }

    /* Lo que PASÓ va suelto y a la vista. Es lo único de esta tarjeta que no
     * es una cifra: que te pagaron el Bono 14, que tu hermano mandó dinero,
     * que se te fue un empleado. Eso no se pliega. */
    if (m.eventos.length) {
      h += '<ul class="eventos">';
      m.eventos.forEach(function (t) { h += '<li>' + esc(t) + '</li>'; });
      h += '</ul>';
    }
    h += '<button class="btn-primario" data-cerrar style="margin-top:16px">' +
         (pendientes ? T('Siguiente') : T('Seguir')) + '</button>';
    return h;
  }

  function procesarTurno(m) {
    var cola = [];
    cola.push(function (sig) { modal(resumenTurno(m, m.decisiones.length > 0), sig); });
    m.decisiones.forEach(function (d) { cola.push(function (sig) { mostrarDecision(d, sig); }); });

    /* Cumplir 18 no es un evento cualquiera: es el mes en que el gasto de la
     * casa deja de ser de tus papás y pasa a ser tuyo. Merece su propia
     * ventana, porque explica de golpe por qué el mes siguiente no alcanza. */
    if (m.cumpleMayoria) {
      cola.push(function (sig) {
        var e2 = Motor.get();
        modal('<span class="icono">' + Ico('confeti') + '</span><h2>' +
          T('Cumpliste {0}', CONFIG.mayoriaDeEdad) + '</h2>' +
          '<p>' + T('Ya eres mayor de edad. Desde este mes te toca tu parte del gasto de la casa, puedes firmar un contrato formal y el banco te puede prestar.') + '</p>' +
          '<div class="tres-cifras"><div><span class="etq">' + T('Antes gastabas') + '</span><b>' +
            Q0(CONFIG.menor.gastoPersonal) + '</b></div>' +
          '<div><span class="etq">' + T('Ahora') + '</span><b class="neg">' +
            Q0(Motor.gastoMensualVivienda()) + '</b></div></div>' +
          '<div class="aprendizaje"><strong>' + T('Lo que importa.') + '</strong> ' +
          T('Ese salto le pasa a todo el mundo y a casi nadie le avisan. El que llega a los 18 con algo guardado aguanta el golpe; el que llega en cero, empieza pidiendo prestado.') +
          '</div><button class="btn-primario" data-cerrar>' + T('Seguir') + '</button>', sig);
      });
    }

    if (m.graduacion) {
      cola.push(function (sig) {
        var c = buscar(CARRERAS, m.graduacion);
        Sonido.tono('logro');
        modal('<span class="icono">' + Ico('birrete') + '</span><h2>' + T('Te graduaste') + '</h2><p>' +
          T('Terminaste {0}. Ya calificas para empleos que antes no podías tomar.', esc(D(c, 'nombre'))) + '</p>' +
          (c.nivelQueOtorga === 'licenciatura'
            ? '<div class="aprendizaje">' +
              T('Ojo con la expectativa. En Guatemala una licenciatura sube el ingreso mediano apenas 13% sobre un bachiller. El salto grande está en la maestría.') +
              '</div>' : '') +
          '<button class="btn-primario" data-cerrar>' + T('Seguir') + '</button>', sig);
      });
    }
    if (m.cierreDeAnio) cola.push(function (sig) { mostrarResumenAnual(sig); });
    if (m.jubilacion) cola.push(function (sig) { mostrarReporteFinal(sig); });

    (function siguiente() {
      var paso = cola.shift();
      if (!paso) { render(); return; }
      paso(siguiente);
    })();
  }

  function mostrarDecision(d, sig) {
    var fuente = d.clase === 'promo' ? PROMOCIONES
               : d.clase === 'decision' ? DECISIONES
               : EVENTOS;
    var def = buscar(fuente, d.ref);
    if (!def) { sig(); return; }
    Sonido.tono(d.clase === 'promo' ? 'toque' : 'alerta');

    /* Las tarjetas de decisión se ven distintas de los eventos: son una carta
     * que se voltea, con el dibujo grande y los botones del mismo tamaño. Que
     * ninguno se vea más importante que el otro es la mitad del ejercicio. */
    var h = '<span class="icono' + (d.clase === 'decision' ? ' carta' : '') + '">' +
            Ico(def.icono) + '</span>';
    if (d.clase === 'decision') {
      h += '<div class="sello-carta">' + Ico('balanza') + ' ' + T('Tienes que decidir') + '</div>';
    }
    h += '<h2>' + esc(D(def, 'titulo')) + '</h2>';
    h += '<p>' + esc(D(def, 'texto')) + '</p>';
    if (def.letraChica) h += '<div class="letra-chica"><strong>' + T('Letra chica:') + '</strong> ' +
                             esc(D(def, 'letraChica')) + '</div>';

    if (!def.opciones) h += '<button class="btn-primario" id="op0">' + T('Aceptar') + '</button>';
    else def.opciones.forEach(function (o, i) {
      h += '<button class="btn-primario ' + (i > 0 ? 'claro ' : '') + 'opcion-carta" id="op' + i + '">' +
           (o.icono ? Ico(o.icono) + ' ' : '') +
           esc(K('opciones', def.id + ':' + i, o.etiqueta)) + '</button>';
    });

    var dm = modal(h, sig);
    var n = def.opciones ? def.opciones.length : 1;
    for (var i = 0; i < n; i++) {
      (function (idx) {
        var b = dm.querySelector('#op' + idx);
        if (!b) return;
        b.addEventListener('click', function () {
          var r = Motor.aplicarDecision(d.clase, d.ref, idx);
          dm.remove();
          var h2 = '<h2>' + esc(D(def, 'titulo')) + '</h2><p>' + esc(r.texto || T('Listo.')) + '</p>';
          if (def.leccion) h2 += '<div class="aprendizaje"><strong>' + T('Lo que importa.') + '</strong> ' +
                                 esc(D(def, 'leccion')) + '</div>';
          h2 += '<button class="btn-primario" data-cerrar>' + T('Entendido') + '</button>';
          modal(h2, sig);
        });
      })(i);
    }
  }

  function mostrarResumenAnual(sig) {
    var e = Motor.get();
    var r = e.resumenesAnuales[e.resumenesAnuales.length - 1];
    if (!r) { sig(); return; }
    var previo = e.resumenesAnuales[e.resumenesAnuales.length - 2];
    var delta = previo ? r.patrimonio - previo.patrimonio : r.patrimonio;

    var h = '<span class="icono">' + Ico('calendario') + '</span><h2>' + T('Cerraste el año {0}', r.anio) + '</h2>';
    h += graficaPatrimonio(e.resumenesAnuales);
    h += fila(T('Edad'), T('{0} años', r.edad));
    h += fila(T('Patrimonio'), Q(r.patrimonio));
    h += fila(T('Cambió en el año'), (delta >= 0 ? '+' : '') + Q(delta), delta >= 0 ? 'pos' : 'neg');
    h += fila(T('Deuda'), Q(r.deuda), r.deuda > 0 ? 'neg' : '');
    h += fila(T('Historial de crédito'), T('{0} de 100', r.puntaje));
    h += fila(T('Nivel educativo'), esc(nivel(r.educacion)));

    var t = e.totales;
    if (t.fugaEfectivo > 1000) {
      h += '<div class="aprendizaje">' +
        T('Llevas {0} perdidos en gastos hormiga del efectivo. Es dinero que no compró nada que recuerdes.',
          Q0(t.fugaEfectivo)) + '</div>';
    } else if (t.interesesPagados > 500 && t.interesesPagados > t.interesesGanados) {
      h += '<div class="aprendizaje">' +
        T('Llevas {0} pagados en intereses y {1} ganados. Vas prestándole tu dinero al banco, no al revés.',
          Q0(t.interesesPagados), Q0(t.interesesGanados)) + '</div>';
    }
    h += '<button class="btn-primario" data-cerrar style="margin-top:14px">' + T('Seguir') + '</button>';
    Sonido.tono('logro');
    modal(h, sig);
  }

  function nombreEmpleo(id) {
    var t = id ? buscar(TRABAJOS, id) : null;
    return t ? D(t, 'nombre') : T('Sin trabajo');
  }

  function mostrarReporteFinal(sig) {
    var r = Motor.reporte();
    Motor.archivarPartida();
    var h = '<span class="icono">' + Ico('bandera-meta') + '</span><h2>' + T('Tu vida en números') + '</h2>';
    h += graficaPatrimonio(Motor.get().resumenesAnuales);
    h += fila(T('Edad final'), T('{0} años', r.edad));
    h += fila(T('Patrimonio'), Q(r.patrimonio), r.patrimonio >= 0 ? 'pos' : 'neg');
    h += fila(T('Deuda'), Q(r.deuda), r.deuda > 0 ? 'neg' : '');
    h += fila(T('Nivel educativo'), esc(nivel(r.educacion)));
    h += fila(T('Último empleo'), esc(nombreEmpleo(r.empleoId)));
    h += fila(T('Historial de crédito'), r.puntaje + ' · ' + K('tramos', r.tramo, r.tramo));
    if (r.casa) {
      h += fila(T('Casa propia'), esc(D(buscar(CASAS, r.casa.id), 'nombre')));
      h += fila(T('Vale hoy'), Q(r.casa.valor), 'pos');
      if (r.hipotecaSaldo > 0) h += fila(T('Debes de hipoteca'), Q(r.hipotecaSaldo), 'neg');
    }
    if (r.pension > 0) {
      h += fila(T('Pensión acumulada'), Q(r.pension), 'pos');
      h += fila(T('De eso pusiste tú'), Q(r.pensionAportado));
    }
    if (r.mesesFuera > 0 || r.totalEnviado > 0) {
      h += fila(T('Tiempo fuera del país'), T('{0} meses', r.mesesFuera));
      h += fila(T('Mandado a tu familia'), Q(r.totalEnviado));
      h += fila(T('Se lo llevaron las comisiones'), Q(r.comisionesEnvio), 'neg');
    }
    h += fila(T('Intereses ganados'), Q(r.totales.interesesGanados), 'pos');
    h += fila(T('Intereses pagados'), Q(r.totales.interesesPagados), 'neg');
    h += fila(T('Balance de intereses'), Q(r.interesesNetos), r.interesesNetos >= 0 ? 'pos' : 'neg');
    h += fila(T('Perdido en gastos hormiga'), Q(r.totales.fugaEfectivo), 'neg');
    h += fila(T('Comisiones de remesa'), Q(r.totales.comisionesRemesa), 'neg');
    h += '<h3>' + T('Lo que dice tu partida') + '</h3>';
    r.lecciones.forEach(function (l) { h += '<div class="aprendizaje">' + esc(leccionTexto(l)) + '</div>'; });
    h += '<button class="btn-primario" data-cerrar style="margin-top:14px">' + T('Cerrar') + '</button>';
    Sonido.tono('logro');
    modal(h, sig);
  }

  function mostrarGlosario() {
    var h = '<span class="icono">' + Ico('libro') + '</span><h2>' + T('Glosario') + '</h2>';
    GLOSARIO.forEach(function (g) {
      h += '<div class="glosa' + (g.clave ? ' clave' : '') + '"><strong>' +
           esc(K('glosario_termino', g.termino, g.termino)) + '</strong><p class="sutil">' +
           esc(K('glosario_texto', g.termino, g.texto)) + '</p></div>';
    });
    h += '<button class="btn-primario" data-cerrar style="margin-top:14px">' + T('Cerrar') + '</button>';
    modal(h);
  }

  function mostrarReporte() {
    var r = Motor.reporte();
    var h = '<span class="icono">' + Ico('tendencia') + '</span><h2>' + T('Cómo vas') + '</h2>';
    h += fila(T('Edad'), T('{0} años', r.edad));
    h += fila(T('Patrimonio'), Q(r.patrimonio), r.patrimonio >= 0 ? 'pos' : 'neg');
    h += fila(T('Deuda'), Q(r.deuda), r.deuda > 0 ? 'neg' : '');
    h += fila(T('Ingresos acumulados'), Q(r.totales.ingresos), 'pos');
    h += fila(T('Gastos acumulados'), Q(r.totales.gastos), 'neg');
    h += fila(T('Intereses ganados'), Q(r.totales.interesesGanados), 'pos');
    h += fila(T('Intereses pagados'), Q(r.totales.interesesPagados), 'neg');
    h += fila(T('Gastos hormiga'), Q(r.totales.fugaEfectivo), 'neg');
    h += fila(T('Comisiones de remesa'), Q(r.totales.comisionesRemesa), 'neg');
    h += fila(T('Meses estudiando'), r.totales.mesesEstudiando);
    r.lecciones.forEach(function (l) { h += '<div class="aprendizaje">' + esc(leccionTexto(l)) + '</div>'; });

    var hist = Motor.historial();
    if (hist.length) {
      h += '<h3>' + T('Vidas anteriores') + '</h3>';
      hist.slice(0, 5).forEach(function (v) {
        h += '<div class="tarjeta"><div class="fila"><span class="etq">' + esc(nivel(v.educacion)) +
             ' · ' + esc(nombreEmpleo(v.empleoId)) + '</span><span class="val">' +
             Q0(v.patrimonio) + '</span></div></div>';
      });
    }
    h += '<button class="btn-primario" data-cerrar style="margin-top:14px">' + T('Cerrar') + '</button>';
    modal(h);
  }

  function mostrarMenu() {
    var h = '<h2>' + T('Opciones') + '</h2>';
    h += '<div class="btn-fila" style="margin-bottom:10px">' +
         '<button class="btn-chico" id="m-idioma">' + Ico('mundo') + ' ' +
           (Idioma.actual() === 'es' ? 'English' : 'Español') + '</button>' +
         '<button class="btn-chico" id="m-sonido">' +
           (Sonido.activo() ? Ico('sonido') + ' ' + T('Sonido activado')
                            : Ico('sonido-off') + ' ' + T('Sonido apagado')) + '</button></div>';
    h += '<div class="btn-fila" style="margin-bottom:10px">' +
         '<button class="btn-chico" id="m-glosario">' + Ico('libro') + ' ' + T('Glosario') + '</button>' +
         '<button class="btn-chico" id="m-reporte">' + Ico('tendencia') + ' ' + T('Cómo voy') + '</button></div>';
    h += '<h3>' + T('Tu partida') + '</h3>';
    h += '<div class="btn-fila"><button class="btn-chico" id="m-exportar">' + T('Copiar código de partida') +
         '</button><button class="btn-chico" id="m-importar">' + T('Pegar un código') + '</button></div>';
    h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico peligro" id="m-reiniciar">' +
         T('Empezar de nuevo') + '</button></div>';
    h += '<button class="btn-primario" data-cerrar style="margin-top:16px">' + T('Cerrar') + '</button>';
    var d = modal(h);

    d.querySelector('#m-idioma').addEventListener('click', function () {
      Idioma.alternar(); d.remove(); render(); mostrarMenu();
    });
    d.querySelector('#m-sonido').addEventListener('click', function () {
      Sonido.alternar(); d.remove(); mostrarMenu();
    });
    d.querySelector('#m-glosario').addEventListener('click', function () { d.remove(); mostrarGlosario(); });
    d.querySelector('#m-reporte').addEventListener('click', function () { d.remove(); mostrarReporte(); });
    d.querySelector('#m-exportar').addEventListener('click', function () {
      var codigo = Motor.exportar();
      d.remove();
      modal('<h2>' + T('Tu código de partida') + '</h2><p class="sutil">' +
        T('Cópialo y guárdalo. Con él puedes seguir tu partida en otro dispositivo.') +
        '</p><textarea class="codigo" readonly>' + esc(codigo) + '</textarea>' +
        '<button class="btn-primario" data-cerrar style="margin-top:12px">' + T('Listo') + '</button>');
    });
    d.querySelector('#m-importar').addEventListener('click', function () {
      d.remove();
      var di = modal('<h2>' + T('Pegar código') + '</h2><p class="sutil">' +
        T('Esto reemplaza tu partida actual.') + '</p><textarea class="codigo" id="cod"></textarea>' +
        '<button class="btn-primario" id="okimp" style="margin-top:12px">' + T('Cargar') + '</button>' +
        '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
        T('Cancelar') + '</button></div>');
      di.querySelector('#okimp').addEventListener('click', function () {
        var ok = Motor.importar(di.querySelector('#cod').value);
        di.remove();
        if (ok) render(); else aviso(T('No sirvió'), T('Ese código no se pudo leer.'));
      });
    });
    d.querySelector('#m-reiniciar').addEventListener('click', function () {
      d.remove();
      var dr = modal('<h2>' + T('¿Empezar de nuevo?') + '</h2><p>' +
        T('Se borra tu partida y no hay forma de recuperarla.') + '</p>' +
        '<button class="btn-primario peligro" id="si">' + T('Sí, borrar') + '</button>' +
        '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
        T('Cancelar') + '</button></div>');
      dr.querySelector('#si').addEventListener('click', function () {
        Motor.borrar(); dr.remove(); location.reload();
      });
    });
  }

  // =============== minijuegos ===============

  function jugarMinijuego(id, alCerrar) {
    var caja = document.createElement('div');
    caja.className = 'velo';
    var interior = document.createElement('div');
    interior.className = 'modal mj';
    caja.appendChild(interior);
    document.body.appendChild(caja);

    Minijuegos.lanzar(id, interior, function (res) {
      var e = Motor.get();
      /* Una clase gasta su jornada de TAREA y un oficio la de Extra. Son dos
       * casillas distintas porque son dos cosas distintas, y gastar la que no
       * es dejaría al jugador con una jornada fantasma. */
      var clase = res.def.tipo === 'clase';
      var gasta = clase ? 'tarea' : 'minijuego';
      for (var i = 0; i < e.espacios.length; i++) {
        if (e.espacios[i] === gasta) { e.espacios[i] = gasta + (clase ? '-usada' : '-usado'); break; }
      }

      /* Y aquí es donde la clase deja de pagar. La experiencia sale de lo
       * mismo que salía el pago —cómo te fue— pero no se puede gastar: solo
       * sube, y es lo que después te deja entrar donde quieres entrar. */
      var gano = 0;
      if (clase) {
        if (res.reprobado) {
          /* Reprobada: cero. La jornada se gastó igual, y eso es lo que hace
           * que la siguiente se haga con atención. */
          Sonido.tono('error');
        } else {
          var tope = res.def.experienciaMaxima || 0;
          var parte = Math.max(0, Math.min(1, res.puntos / (res.def.puntosParaPagoMaximo || 100)));
          gano = Math.max(1, Math.round(tope * parte));
          Motor.sumarExperiencia(gano);
          Sonido.tono('logro');
        }
        /* Y queda la NOTA, que es otra cosa distinta de la experiencia.
         *
         * La experiencia es una sola cifra que abre carreras. La nota es por
         * rama, no abre nada, y sirve para el momento en que hay que elegir
         * diversificado entre siete ramas y diecinueve títulos: el juego pone
         * arriba las que se te dieron mejor. Una tarea reprobada también deja
         * nota, y por eso cuenta: si solo contaran las buenas, el perfil diría
         * que todo se te da bien. */
        if (res.def.categoria) {
          Motor.apuntarNota(res.def.categoria, res.reprobado ? 0 : res.puntos,
                            res.def.puntosParaPagoMaximo || 100);
        }
        Motor.marcarTareaHecha(res.def.id);
      } else if (res.pago > 0) {
        if (e.monetaria !== null) e.monetaria += res.pago; else e.efectivo += res.pago;
        Sonido.tono('moneda');
        monedaVuela(interior);
      }
      Motor.guardar();
      interior.innerHTML =
        '<span class="icono">' + Ico(res.reprobado ? 'alerta' : res.def.icono) + '</span>' +
        '<h2>' + (res.reprobado ? T('No pasaste esta tarea') : esc(D(res.def, 'nombre'))) + '</h2>' +
        (res.reprobado
          ? '<p>' + T('Cuatro errores y se acabó. La jornada se gastó igual, pero la puedes repetir el mes que viene.') + '</p>'
          : '') +
        fila(T('Puntos'), res.puntos) +
        fila(T('Aciertos'), T('{0} de {1}', res.aciertos, res.total)) +
        (clase
          ? fila(T('Experiencia ganada'), (res.reprobado ? '0' : '+' + gano), res.reprobado ? 'neg' : 'pos') +
            fila(T('Experiencia total'), String(Motor.experiencia()))
          : fila(T('Te pagaron'), Q(res.pago), 'pos')) +
        (res.def.ensena ? '<div class="aprendizaje"><strong>' + T('Lo que practicaste.') + '</strong> ' +
          esc(D(res.def, 'ensena')) + '</div>' : '') +
        '<button class="btn-primario" data-cerrar>' + T('Listo') + '</button>';
      var b = interior.querySelector('[data-cerrar]');
      if (b) b.addEventListener('click', function () {
        caja.remove();
        /* `alCerrar` es lo que encadena una tarea con la siguiente al terminar
         * el mes. Sin él, cada actividad terminaba en la pantalla y el jugador
         * tenía que volver a buscar la siguiente. */
        if (alCerrar) alCerrar(); else render();
      });
    });
  }

  /* -------------------------------------------------------------------------
   * Lo que dejaste pendiente este mes
   * -------------------------------------------------------------------------
   * Repartir el mes y cerrarlo no puede ser el mismo gesto. Una jornada puesta
   * en tareas es una promesa: dijiste que ibas a estudiar esa media semana. Si
   * el mes se cierra sin más, esa casilla no fue una decisión, fue un adorno, y
   * el jugador acaba tocando el mismo botón cinco veces sin hacer nada.
   *
   * Así que al terminar el mes, primero se hace lo que se prometió. Una por
   * una, y con la lista delante para elegir cuál. Dejarlas también se puede
   * —el jugador manda— pero se dice en voz alta lo que cuesta.
   *
   * `alTerminar` se llama cuando ya no queda nada pendiente. Es lo que deja
   * que esto se meta ANTES del cierre del mes sin que el cierre sepa nada.
   */
  function hacerPendientes(alTerminar) {
    var e = Motor.get();
    var faltan = Motor.espaciosUsados('tarea');
    if (!faltan) return alTerminar();

    /* Solo las del turno que todavía no ha hecho: repetir la misma tarea dos
     * veces en el mismo turno no es estudiar, es exprimir el ejercicio. */
    var sinHacer = Motor.tareasSinHacer();
    var lista = Minijuegos.disponibles(e.educacion, e.carrerasTerminadas,
      e.estudio ? e.estudio.carreraId : null, Motor.experiencia())
      .filter(function (j) { return sinHacer.indexOf(j.id) >= 0; });
    // Sin ninguna clase disponible no hay nada que hacer y no se castiga
    if (!lista.length) return alTerminar();

    var h = '<span class="icono">' + Ico('libro') + '</span>' +
      '<h2>' + (faltan === 1 ? T('Te toca hacer una tarea')
                             : T('Te tocan {0} tareas', faltan)) + '</h2>' +
      '<p>' + (faltan === 1
        ? T('Pusiste una jornada en tareas. Hazla antes de cerrar el mes.')
        : T('Pusiste {0} jornadas en tareas. Elige cuál haces primero.', faltan)) + '</p>';
    lista.forEach(function (j) {
      h += '<button class="btn-primario claro tarea-elegir" data-tarea="' + j.id + '">' +
           Ico(j.icono) + ' ' + esc(D(j, 'nombre')) +
           '<span class="etiqueta ok">+' + (j.experienciaMaxima || 0) + '</span></button>';
    });
    h += '<div class="btn-fila" style="margin-top:10px">' +
         '<button class="btn-chico" data-dejarlas>' + T('Dejarlas para otro mes') +
         '</button></div>' +
         '<p class="sutil centrado">' +
         T('Si las dejas, esas jornadas se pierden: el tiempo no se guarda.') + '</p>';

    var d = modal(h, null);
    d.querySelectorAll('[data-tarea]').forEach(function (b) {
      b.addEventListener('click', function () {
        d.remove();
        // Al terminar la tarea se vuelve a preguntar: quedan las que queden
        jugarMinijuego(b.getAttribute('data-tarea'), function () {
          hacerPendientes(alTerminar);
        });
      });
    });
    var dejar = d.querySelector('[data-dejarlas]');
    if (dejar) dejar.addEventListener('click', function () { d.remove(); alTerminar(); });
    return null;
  }

  // =============== eventos de la interfaz ===============

  function conectar() {
    app.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-pestana],[data-sub],[data-espacio],[data-poner],[data-poner-tarea],[data-titulo],[data-ver-ramas],[data-lote],[data-gestion],[data-cerrar-hoja],[data-tomar],[data-abrir],' +
        '[data-mover],[data-mudar],[data-inscribir],[data-jugar],[data-abonar],[data-abrir-menu],' +
        '[data-casa],[data-envio],[data-canal],[data-porque],[data-detalle],[data-no-estudiar],' +
        '[data-ver-perfil],[data-mejora],' +
        '[data-abrir-negocio],[data-subir-negocio],[data-contratar],[data-despedir],' +
        '[data-traspasar],' +
        '#cerrar-turno,#renunciar,#pedir-planilla,#abandonar,#abrir-plazo,#romper-plazo,#pedir-prestamo,' +
        '#pedir-tarjeta,#pedir-informal,#gastar-tarjeta,#pagar-tarjeta,#alternar-minimo,' +
        '#abrir-pension,#cambiar-pension,#retirar-pension,#migrar,#regresar,' +
        '#ver-glosario,#ver-reporte,#ver-reporte-final');
      if (!el) return;
      var d = el.dataset;
      var e = Motor.get();

      if (d.abrirMenu !== undefined) return mostrarMenu();
      if (d.verPerfil !== undefined) return mostrarPerfil();
      if (d.pestana) { irAPestana(d.pestana); return render(); }
      if (d.sub) { subDe[pestana] = d.sub; return render(); }

      if (d.espacio !== undefined) {
        var i = parseInt(d.espacio, 10);
        // Las jornadas del colegio no se tocan: se explica y no se selecciona
        if (Motor.espacioBloqueado(i)) { avisoBloqueo = true; espacioSel = null; return render(); }
        espacioSel = espacioSel === i ? null : i;
        return render();
      }

      if (d.porque) {
        abiertos[d.porque] = !abiertos[d.porque];
        return render();
      }
      if (d.detalle) { verDetalle = !verDetalle; return render(); }

      /* El contador de tareas pendientes de la calle: tocarlo pone la jornada.
       * Es un atajo, no una vía nueva: hace exactamente lo mismo que tocar una
       * casilla libre y elegir Tarea, que sigue estando. */
      if (d.ponerTarea) {
        var hueco = primeraLibre();
        if (hueco === null) {
          Sonido.tono('error');
          return aviso(T('El mes ya está repartido'),
            T('Las ocho jornadas están ocupadas. Vacía una en la rejilla de abajo si quieres cambiar algo.'));
        }
        Motor.asignarEspacio(hueco, 'tarea');
        espacioSel = null; Motor.guardar(); Sonido.tono('toque');
        return render();
      }

      // Elegir cuál de los títulos de una rama, antes de inscribirse
      if (d.titulo) {
        tituloSel = tituloSel === d.titulo ? null : d.titulo;
        return render();
      }
      if (d.verRamas) { verTodasLasRamas = true; return render(); }

      /* Los dos botones que abren la hoja de un negocio debajo de la calle.
       *
       * Antes el lote vacío llevaba a la pestaña del imperio, y eso era irse
       * de la pantalla para volver: lo que se abre y lo que se administra
       * ahora pasa donde están los negocios, que es la calle. */
      if (d.lote !== undefined) {
        hojaNegocio = hojaNegocio === 'abrir' ? null : 'abrir';
        espacioSel = null;
        return render();
      }
      if (d.gestion !== undefined) {
        hojaNegocio = hojaNegocio === d.gestion ? null : d.gestion;
        espacioSel = null;
        return render();
      }
      if (d.cerrarHoja !== undefined) { hojaNegocio = null; return render(); }

      /* Poner una jornada en algo.
       *
       * Hay DOS formas de llegar aquí y las dos tienen que funcionar:
       *
       *   - desde la rejilla: se toca una casilla y luego la actividad. Es la
       *     que enseña el tutorial y la que deja elegir CUÁL casilla.
       *   - desde la calle: se toca el negocio y ya. Sin casilla elegida se
       *     usa la primera libre, que es lo que el jugador espera cuando
       *     señala su tortillería y espera meterse adentro.
       *
       * La segunda es la que hace que la calle sea el juego y no un cuadro, y
       * no reemplaza a la primera: quien quiera poner el negocio en la tarde
       * de la semana tres sigue pudiendo. */
      if (d.poner !== undefined) {
        var destino = espacioSel;
        if (destino === null) destino = primeraLibre();
        if (destino === null) {
          Sonido.tono('error');
          return aviso(T('El mes ya está repartido'),
            T('Las ocho jornadas están ocupadas. Vacía una en la rejilla de abajo si quieres cambiar algo.'));
        }
        Motor.asignarEspacio(destino, d.poner);
        espacioSel = null; Motor.guardar(); Sonido.tono('toque');
        return render();
      }

      if (d.tomar) {
        Motor.tomarTrabajo(d.tomar, d.formal === '1');
        Motor.guardar(); render();
        if (d.formal === '0') {
          tarjetaEducativa('informal', 'alerta', T('Aceptaste un trabajo informal'),
            T('Vas a recibir {0} más en la mano cada mes. A cambio no tienes Bono 14 ni aguinaldo, no cotizas al seguro y el banco no puede comprobar tus ingresos.',
              pct(CONFIG.primaInformalidad)),
            T('Dos tercios de los guatemaltecos trabajan así. Es más dinero hoy y menos toda la vida, porque sin historial nadie te presta cuando lo necesitas.'));
        }
        return;
      }

      if (d.inscribir) {
        var r = Motor.inscribirse(d.inscribir, d.priv === '1', d.jornada, d.tituloId);
        if (!r.ok) return aviso(T('No se puede'), r.razon);
        tituloSel = null; verTodasLasRamas = false;
        Motor.guardar(); render();
        var c = buscar(CARRERAS, d.inscribir);
        var tSel = tituloDeCarrera(c, d.tituloId);
        var comoSeLlama = esc(tSel ? D(tSel, 'nombre') : D(c, 'nombre'));
        var cuerpo = c.horario === 'libre'
          ? T('Empiezas {0}. Cada jornada que le dediques avanza un cuarto de mes de carrera, y esa jornada no la estás trabajando.',
              comoSeLlama)
          : T('Empiezas {0}. El colegio te toma la jornada de la {1} de las cuatro semanas; la otra es tuya para trabajar.',
              comoSeLlama, d.jornada === 'pm' ? T('tarde') : T('mañana'));
        return tarjetaEducativa('estudio' + c.id, 'birrete', T('Te inscribiste'), cuerpo,
          T('El costo real de estudiar en Guatemala no es la colegiatura: la pública es gratis. Es el sueldo que dejas de ganar mientras estudias.'));
      }

      /* ---------- el imperio ---------- */

      if (d.abrirNegocio) {
        var rn = Motor.abrirNegocio(d.abrirNegocio);
        if (!rn.ok) return aviso(T('Todavía no'), rn.razon);
        Sonido.tono('logro');
        latirBarra = true;
        escenaCrecio = true;
        render();
        return tarjetaEducativa('negocio' + rn.tipo.id, rn.tipo.icono,
          T('Abriste: {0}', esc(D(rn.tipo, 'nombre'))),
          '<div class="sello-nivel">' + Ico('sparkles') + ' ' +
            T('Ya tienes {0} negocio(s)', Motor.negociosAbiertos().length) + '</div>' +
          T('Ponle jornadas en la pestaña del mes para que produzca. Un negocio al que nadie atiende rinde {0}% menos.',
            Math.round((1 - RENDIMIENTO_SIN_DUENO) * 100)),
          K('negocio_leccion', rn.tipo.id, rn.tipo.leccion));
      }

      if (d.subirNegocio) {
        var rs = Motor.subirNivelNegocio(d.subirNegocio);
        if (!rs.ok) return aviso(T('Todavía no'), rs.razon);
        Sonido.tono('logro');
        latirBarra = true;
        escenaCrecio = true;
        render();
        var tns = Motor.tipoDeNegocio(d.subirNegocio);
        return tarjetaEducativa('subir' + d.subirNegocio + rs.nivel, tns.icono,
          T('{0}: {1}', esc(D(tns, 'nombre')), esc(K('nivel_negocio', rs.escalon.nombre, rs.escalon.nombre))),
          '<div class="sello-nivel">' +
            Ico(rs.nivel === NIVELES_NEGOCIO.length ? 'crown' : 'sparkles') + ' ' +
            T('Nivel {0} de {1}', rs.nivel, NIVELES_NEGOCIO.length) + '</div>' +
          T('Te costó {0}. Ahora vende más y caben {1} personas más adentro.',
            Q0(rs.costo), rs.escalon.plazasExtra),
          T('Subir un negocio no sirve de nada si no tienes con qué llenar las plazas nuevas. Primero la gente, después el tamaño.'));
      }

      if (d.contratar) {
        var rc = Motor.contratar(d.contratar, d.contrato);
        if (!rc.ok) return aviso(T('Todavía no'), rc.razon);
        Sonido.tono('toque');
        escenaCrecio = true;
        render();
        var plc = PLANILLA[d.contrato];
        return tarjetaEducativa('contrato' + d.contrato, 'personas',
          T('Contrataste a alguien'),
          d.contrato === 'formal'
            ? T('Le vas a pagar {0} de sueldo, y a ti te va a costar {1} cada mes.',
                Q0(plc.sueldo), Q0(rc.costo))
            : T('Te va a costar {0} cada mes, y es lo único que va a recibir.',
                Q0(rc.costo)),
          d.contrato === 'formal'
            ? T('El sueldo NUNCA es lo que cuesta un empleado. Encima van el IGSS, el IRTRA, el INTECAP, el aguinaldo, el Bono 14 y las vacaciones: un 42% más. Quien no cuenta eso quiebra su negocio sin entender por qué.')
            : T('Sin contrato es más barato hoy. A cambio esa persona se va a ir más pronto, no cotiza para su pensión, y si cae inspección la multa son tres sueldos.'));
      }

      if (d.despedir) {
        var rd = Motor.despedir(d.despedir, parseInt(d.emp, 10));
        if (!rd.ok) return aviso(T('No se puede'), rd.razon);
        render();
        if (rd.indemnizacion > 0) {
          return tarjetaEducativa('indemnizacion', 'balanza',
            T('Le pagaste la indemnización'),
            T('Te costó {0} sacarlo.', Q0(rd.indemnizacion)),
            T('Un sueldo por cada año trabajado. Es el otro lado del contrato: lo mismo que protege al trabajador es lo que le cuesta al patrón deshacerse de él. Por eso hay que contratar pensando, no de prisa.'));
        }
        return;
      }

      if (d.traspasar) {
        var tt = Motor.tipoDeNegocio(d.traspasar);
        var vale = Motor.valorDeTraspaso(d.traspasar);
        var puesto = Motor.invertidoEn(Motor.negocioDe(d.traspasar));
        return confirmar(
          vale >= 0 ? T('¿Traspasar {0}?', esc(D(tt, 'nombre')))
                    : T('¿Cerrar {0}?', esc(D(tt, 'nombre'))),
          T('Llevas {0} invertidos y recuperas {1}. Lo que ya pusiste no vuelve completo.',
            Q0(puesto), Q0(vale)),
          function () {
            var rt = Motor.cerrarNegocio(d.traspasar);
            if (!rt.ok) return aviso(T('No se puede'), rt.razon);
            render();
          });
      }

      if (d.mejora) {
        var rm = Motor.comprarMejora(d.mejora);
        if (!rm.ok) return aviso(T('Todavía no'), rm.razon);
        Sonido.tono('logro');
        latirBarra = true;
        escenaCrecio = true;   // que el escenario dé el saltito al redibujarse
        render();
        var mj = rm.mejora;
        var nivelNuevo = Motor.nivelDeCadena(mj.cadena);
        var deCuantos = Motor.mejorasDeCadena(mj.cadena).length;
        /* La ventana de compra es la celebración: un tycoon tiene que decirte
         * que subiste de nivel, no solo cobrarte. */
        return tarjetaEducativa('mejora' + mj.id, mj.icono,
          T('Compraste: {0}', esc(D(mj, 'nombre'))),
          '<div class="sello-nivel">' + Ico(nivelNuevo === deCuantos ? 'crown' : 'sparkles') +
            ' ' + T('Nivel {0} de {1}', nivelNuevo, deCuantos) + '</div>' +
          (mesesEnPagarse(mj)
            ? T('Te costó {0} y se paga sola en {1} meses. De ahí en adelante es ganancia.',
                Q0(mj.costo), mesesEnPagarse(mj))
            : T('Te costó {0}. Esta no se paga en dinero: se paga en tiempo y en salud.',
                Q0(mj.costo))),
          K('mejora_leccion', mj.id, mj.leccion));
      }

      if (d.noEstudiar) {
        Motor.decidirEstudio('no');
        render();
        return tarjetaEducativa('noestudiar', 'maletin', T('Te vas a trabajar'),
          T('Nadie te va a obligar. La pestaña de Estudio se queda ahí y puedes inscribirte cuando quieras.'),
          T('Seis de cada diez chicos guatemaltecos no terminan básicos. La mayoría no lo decidió en una pantalla: se le fue haciendo tarde.'));
      }

      if (el.id === 'abandonar') {
        return confirmar(T('¿Dejar de estudiar?'),
          T('Pierdes lo que llevas avanzado. Si vuelves después, empiezas de cero.'),
          function () { Motor.abandonarEstudio(); Motor.guardar(); render(); });
      }

      if (d.abrir) {
        var ra = Motor.abrirCuenta(d.abrir, Motor.aperturaMinima(d.abrir));
        if (!ra.ok) return aviso(T('No se pudo'), ra.razon);
        Sonido.tono('moneda'); render();
        if (d.abrir === 'monetaria') {
          return tarjetaEducativa('monetaria', 'tarjeta', T('Abriste tu cuenta monetaria'),
            T('La monetaria es para mover dinero: recibir el salario de una empresa, pagar y transferir. Paga apenas 1.27% al año, así que no es para guardar.'),
            Motor.manejoDeCuenta() > 0
              ? T('Ojo: como nadie te deposita planilla, el banco te va a cobrar {0} de manejo cada mes. Ese cargo desaparece el día que una empresa te pague el sueldo aquí.', Q0(Motor.manejoDeCuenta()))
              : T('Tu sueldo entra aquí en vez de al bolsillo, y como te lo deposita una empresa no te cobran manejo de cuenta.'));
        }
        return tarjetaEducativa('ahorro', 'banco', T('Abriste tu cuenta de ahorro'),
          T('El ahorro paga 2.65% al año, más del doble que la monetaria, y no cobra manejo de cuenta.'),
          T('Sobre lo que ganes de intereses te retienen 10% de impuesto. El rendimiento que te prometen nunca es el que recibes.'));
      }

      if (d.mover) {
        var pr = d.mover.split('|');
        var disp = pr[0] === 'efectivo' ? e.efectivo : e[pr[0]];
        if (!disp || disp <= 0) return;
        var destino = pr[1] === 'monetaria' ? T('Cuenta monetaria')
                    : pr[1] === 'ahorro' ? T('Cuenta de ahorro') : T('Efectivo en mano');
        return pedirMonto(T('Mover a {0}', destino), disp,
          function (v) { Motor.mover(pr[0], pr[1], v); Motor.guardar(); });
      }

      if (d.mudar) {
        var rm = Motor.mudarse(d.mudar);
        if (!rm.ok) return aviso(T('Todavía no'), rm.razon);
        Motor.guardar(); return render();
      }

      if (el.id === 'abrir-plazo') {
        var maxP = Math.max(e.ahorro || 0, e.monetaria || 0);
        return pedirMonto(T('Depósito a plazo'), maxP, function (v) {
          var rp = Motor.abrirPlazo(v);
          if (!rp.ok) return aviso(T('No se pudo'), rp.razon);
          Motor.guardar();
          tarjetaEducativa('plazo', 'tendencia', T('Abriste un depósito a plazo'),
            T('Dejas el dinero quieto doce meses y rinde 6.35% al año, más del doble que el ahorro.'),
            T('Aquí es donde se ve el interés compuesto. Los intereses que ganas también empiezan a ganar intereses, y por eso ahorrar a los 20 vale muchísimo más que a los 40.'));
        }, T('Mínimo {0}, a doce meses.', Q0(CONFIG.productos.plazo.aperturaMinima)));
      }

      if (el.id === 'romper-plazo') {
        var rr = Motor.romperPlazo();
        Motor.guardar(); render();
        return aviso(T('Sacaste tu depósito'), T('Perdiste {0} de rendimiento acumulado.', Q(rr.perdido)));
      }

      if (el.id === 'pedir-prestamo') return flujoPrestamo();
      if (el.id === 'pedir-informal') return flujoInformal();

      if (el.id === 'pedir-tarjeta') {
        var rt = Motor.solicitarTarjeta();
        if (!rt.ok) return aviso(T('No calificas'), rt.razon);
        Motor.guardar(); render();
        return tarjetaEducativa('tarjeta', 'tarjeta', T('Te dieron tarjeta de crédito'),
          T('Tu límite es {0}. Cada mes puedes pagar todo el saldo o solo el mínimo.', Q0(rt.limite)),
          T('La tasa es 45.84% al año. Pagando solo el mínimo, una compra de Q1,000 puede terminar costándote más del doble. Es el error financiero más caro y más común de tu edad.'));
      }

      if (el.id === 'gastar-tarjeta') {
        return pedirMonto(T('Comprar con la tarjeta'), e.tarjeta.limite - e.tarjeta.saldo, function (v) {
          var rg = Motor.gastarConTarjeta(v);
          if (!rg.ok) return aviso(T('No se pudo'), rg.razon);
          Motor.guardar();
        });
      }

      if (el.id === 'pagar-tarjeta') {
        return pedirMonto(T('Abonar a la tarjeta'), e.tarjeta.saldo, function (v) {
          var rpg = Motor.pagarTarjeta(v);
          if (!rpg.ok) return aviso(T('No se pudo'), rpg.razon);
          Motor.guardar();
        });
      }

      if (el.id === 'alternar-minimo') {
        e.tarjeta.pagarMinimo = !e.tarjeta.pagarMinimo;
        Motor.guardar(); return render();
      }

      if (d.abonar !== undefined) {
        var idx = parseInt(d.abonar, 10);
        return pedirMonto(T('Abonar al préstamo'), e.prestamos[idx].saldo, function (v) {
          var rab = Motor.abonarPrestamo(idx, v);
          if (!rab.ok) return aviso(T('No se pudo'), rab.razon);
          Motor.guardar();
        });
      }

      // ----- pensión -----
      if (el.id === 'abrir-pension') {
        return pedirMonto(T('Aporte mensual a tu pensión'), Math.max(PENSION.aporteMinimo, 500), function (v) {
          var rp = Motor.abrirPension(v);
          if (!rp.ok) return aviso(T('No se pudo'), rp.razon);
          Motor.guardar();
          tarjetaEducativa('pension', PENSION.icono, T('Abriste tu plan de pensiones'),
            T('Vas a apartar {0} cada mes. Rinde {1}% al año y se retira a los {2}.',
              Q(v), (PENSION.rendimientoAnual * 100).toFixed(2), PENSION.edadRetiro),
            T('Aportar Q500 al mes desde los 25 hasta los 60 son Q210,000 de tu bolsillo, pero terminan siendo más de Q900,000. La diferencia la pone el tiempo, no tú.'));
        }, T('Mínimo {0} al mes.', Q0(PENSION.aporteMinimo)));
      }
      if (el.id === 'cambiar-pension') {
        return pedirMonto(T('Nuevo aporte mensual'), Math.max(PENSION.aporteMinimo, e.pension.aporteMensual * 2),
          function (v) { Motor.cambiarAportePension(v); Motor.guardar(); });
      }
      if (el.id === 'retirar-pension') {
        var anticipado = e.edad < PENSION.edadRetiro;
        var dr = modal('<h2>' + T('¿Retirar tu pensión?') + '</h2><p>' +
          (anticipado
            ? T('Todavía no cumples {0} años. Si retiras ahora pierdes el {1}% de lo que has ganado.',
                PENSION.edadRetiro, Math.round(PENSION.penalizacionRetiroAnticipado * 100))
            : T('Ya puedes retirarla completa.')) + '</p>' +
          '<button class="btn-primario' + (anticipado ? ' peligro' : '') + '" id="si">' +
          T('Retirar') + '</button>' +
          '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
          T('Cancelar') + '</button></div>');
        dr.querySelector('#si').addEventListener('click', function () {
          var rr = Motor.retirarPension();
          dr.remove(); Motor.guardar(); render();
          aviso(T('Retiraste tu pensión'),
            rr.castigo > 0 ? T('Recibiste {0}. La penalización se quedó con {1}.', Q(rr.recibido), Q(rr.castigo))
                           : T('Recibiste {0}.', Q(rr.recibido)));
        });
        return;
      }

      // ----- hipoteca -----
      if (d.casa) return flujoHipoteca(d.casa);

      // ----- migración -----
      if (el.id === 'migrar') return flujoMigrar();
      if (d.envio !== undefined) {
        Motor.cambiarEnvio(parseFloat(d.envio)); Motor.guardar(); return render();
      }
      if (d.canal) {
        Motor.cambiarEnvio(e.migracion.enviaPorcentaje, d.canal); Motor.guardar(); render();
        if (d.canal === 'app') {
          tarjetaEducativa('canalapp', 'celular-app', T('Cambiaste de canal'),
            T('Mandar por app cuesta 1% en vez de 4.5%. Sobre cada Q1,000 son Q35 que ya no se pierden.'),
            T('Suena a poco. En veinte años de mandar dinero cada mes, esa diferencia es el enganche de una casa.'));
        }
        return;
      }
      if (el.id === 'regresar') {
        var rg = Motor.regresar();
        if (!rg.ok) return aviso(T('Todavía no'), rg.razon);
        Motor.guardar(); render();
        return tarjetaEducativa('regreso', 'avion-baja', T('Volviste a Guatemala'),
          T('Estuviste {0} meses fuera y trajiste {1}.', rg.meses, Q(rg.traido)),
          T('El dinero volvió contigo. Los años de historial crediticio local, no: tu puntaje se enfrió a la mitad y hay que reconstruirlo.'));
      }

      if (d.jugar) return jugarMinijuego(d.jugar);
      if (el.id === 'renunciar') { Motor.renunciar(); Motor.guardar(); return render(); }

      if (el.id === 'pedir-planilla') {
        var r = Motor.pedirPlanilla();
        Motor.guardar();
        render();
        if (r.ok) {
          Sonido.tono('logro');
          return tarjetaEducativa('planilla', 'visto', T('Te pusieron en planilla'),
            T('Desde este mes cotizas al IGSS y te toca Bono 14 y aguinaldo: dos sueldos más al año. En la mano vas a recibir un poco menos cada mes.'),
            T('Es la misma cuenta que haces tú cuando contratas a alguien en tus negocios, vista desde el otro lado. Al patrón el formal le cuesta 1.42 veces el sueldo; al trabajador le da dos sueldos más al año y un historial que el banco puede mirar.'));
        }
        Sonido.tono('error');
        return aviso(T('Te dijeron que no'), K('planilla_negado', 'no', r.razon));
      }
      if (el.id === 'ver-glosario') return mostrarGlosario();
      if (el.id === 'ver-reporte') return mostrarReporte();
      if (el.id === 'ver-reporte-final') return mostrarReporteFinal(function () { render(); });

      if (el.id === 'cerrar-turno') {
        if (Motor.espaciosLibres() === CONFIG.jornadasPorMes) {
          return aviso(T('No has hecho nada'), T('Reparte al menos una jornada antes de cerrar.'));
        }
        /* Primero lo que prometiste, y después el mes. Ese orden es lo que
         * convierte repartir las jornadas en una decisión y no en un trámite. */
        return hacerPendientes(function () {
          latirBarra = true;
          procesarTurno(Motor.cerrarTurno());
        });
      }
    });
  }

  // =============== flujos de crédito ===============

  function flujoPrestamo() {
    var req = Motor.requisitoPrestamo();
    var maximo = Motor.montoMaximoPersonal();
    var e = Motor.get();
    if (!req.ok && !req.necesitaGarantia) return aviso(T('No calificas'), req.razon);

    var h = '<span class="icono">' + Ico('banco') + '</span><h2>' + T('Préstamo personal') + '</h2>';
    h += fila(T('Tasa'), T('{0}% anual', (CREDITOS.personal.tasaAnual * 100).toFixed(2)));
    h += fila(T('Máximo con tu historial'), Q0(maximo));

    if (req.necesitaGarantia) {
      h += '<div class="aprendizaje"><strong>' + T('Aquí está el círculo vicioso.') + '</strong> ' +
        T('Tu historial es corto, así que te piden fiador o garantía. Todavía nadie te firma.') + ' ' +
        T('No te lo niegan por caro, te lo niegan porque no tienes historial ni quién te firme.') + '</div>';
      h += '<p class="sutil">' +
        T('Dejas tu ahorro congelado y el banco te presta contra él. Es la forma más común de empezar a construir historial.') +
        '</p>';
      h += '<button class="btn-primario" id="con-garantia">' + T('Pedir con garantía de mi ahorro') + '</button>';
      h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
           T('Ahora no') + '</button></div>';
    } else {
      if (req.conFiador) h += '<p class="sutil">' + T('Conseguiste quién te firme de fiador.') + '</p>';
      h += '<label class="sutil">' + T('Monto') + '</label><input type="number" id="monto" value="' +
           Math.min(maximo, 5000) + '" step="500">';
      h += '<label class="sutil" style="margin-top:8px;display:block">' + T('Plazo') + '</label><div class="btn-fila">';
      CREDITOS.personal.plazos.forEach(function (p, i) {
        h += '<button class="btn-chico plazo-op' + (i === 1 ? ' activa' : '') + '" data-plazo="' + p + '">' +
             T('{0} meses', p) + '</button>';
      });
      h += '</div><div id="sim" class="tarjeta" style="margin-top:10px"></div>';
      h += '<button class="btn-primario" id="confirmar">' + T('Pedir el préstamo') + '</button>';
      h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
           T('Cancelar') + '</button></div>';
    }

    var d = modal(h);

    if (req.necesitaGarantia) {
      d.querySelector('#con-garantia').addEventListener('click', function () {
        d.remove();
        var maxG = e.ahorro || 0;
        pedirMonto(T('Préstamo con garantía'), Math.min(maxG, maximo || maxG), function (v) {
          var r = Motor.pedirPrestamo(v, 12, true);
          if (!r.ok) return aviso(T('No se pudo'), r.razon);
          Motor.guardar();
          tarjetaEducativa('primercredito', 'banco', T('Tu primer crédito'),
            T('Dejaste {0} de tu ahorro congelado como garantía y el banco te prestó el mismo monto. Tu cuota es {1}.',
              Q0(v), Q(r.cuota)),
            T('Parece absurdo pedir prestado el dinero que ya tienes, pero es la forma más común de empezar a construir historial. Cada cuota que pagues a tiempo sube tu puntaje.'));
        }, T('Dejas ese mismo monto congelado en tu ahorro.'));
      });
      return;
    }

    var plazoSel = CREDITOS.personal.plazos[1];
    function simular() {
      var monto = parseFloat(d.querySelector('#monto').value) || 0;
      var tm = CREDITOS.personal.tasaAnual / 12;
      var cuota = Motor.cuotaMensual(monto, tm, plazoSel);
      var total = cuota * plazoSel;
      d.querySelector('#sim').innerHTML =
        fila(T('Cuota mensual'), Q(cuota)) +
        fila(T('Vas a pagar en total'), Q(total), 'neg') +
        fila(T('De eso, intereses'), Q(total - monto), 'neg') +
        '<div class="aprendizaje">' +
        T('La tasa dice {0}%, pero lo que importa es que por {1} vas a devolver {2}.',
          (CREDITOS.personal.tasaAnual * 100).toFixed(2), Q0(monto), Q0(total)) + '</div>';
    }
    d.querySelector('#monto').addEventListener('input', simular);
    d.querySelectorAll('[data-plazo]').forEach(function (b) {
      b.addEventListener('click', function () {
        plazoSel = parseInt(b.dataset.plazo, 10);
        d.querySelectorAll('[data-plazo]').forEach(function (x) { x.classList.remove('activa'); });
        b.classList.add('activa');
        simular();
      });
    });
    simular();

    d.querySelector('#confirmar').addEventListener('click', function () {
      var monto = parseFloat(d.querySelector('#monto').value) || 0;
      var r = Motor.pedirPrestamo(monto, plazoSel, false);
      d.remove();
      if (!r.ok) return aviso(T('No se pudo'), r.razon);
      Motor.guardar(); Sonido.tono('moneda'); render();
    });
  }

  function flujoHipoteca(casaId) {
    var casa = buscar(CASAS, casaId);
    var plazoSel = HIPOTECA.plazos[1];

    var h = '<span class="icono">' + Ico(casa.icono) + '</span><h2>' + esc(D(casa, 'nombre')) + '</h2>';
    h += fila(T('Precio'), Q0(casa.precio));
    h += fila(T('Enganche'), Q0(Motor.engancheDe(casa)) + ' · ' +
              pct(casa.apoyoFHA ? HIPOTECA.engancheFHA : HIPOTECA.engancheNormal));
    h += fila(T('Gastos de cierre'), Q0(Motor.cierreDe(casa)), 'neg');
    h += fila(T('Tasa'), T('{0}% anual', (HIPOTECA.tasaAnual * 100).toFixed(2)));
    if (casa.apoyoFHA) {
      h += '<div class="letra-chica">' +
        T('Esta vivienda califica al programa de hipotecas aseguradas, que baja el enganche del 20% al 5%. Existe de verdad en Guatemala, para vivienda de interés social.') +
        '</div>';
    }
    h += '<label class="sutil" style="margin-top:8px;display:block">' + T('Plazo') + '</label><div class="btn-fila">';
    HIPOTECA.plazos.forEach(function (p, i) {
      h += '<button class="btn-chico plazo-h' + (i === 1 ? ' activa' : '') + '" data-ph="' + p + '">' +
           T('{0} años', p) + '</button>';
    });
    h += '</div><div id="simh" class="tarjeta" style="margin-top:10px"></div>';
    h += '<button class="btn-primario" id="comprar">' + T('Comprar esta casa') + '</button>';
    h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
         T('Cancelar') + '</button></div>';

    var d = modal(h);

    function simular() {
      var cuota = Motor.cuotaHipoteca(casa, plazoSel);
      var prestado = casa.precio - Motor.engancheDe(casa);
      var total = cuota * plazoSel * 12;
      d.querySelector('#simh').innerHTML =
        fila(T('El banco te presta'), Q0(prestado)) +
        fila(T('Cuota mensual'), Q(cuota)) +
        fila(T('Vas a pagar en total'), Q0(total), 'neg') +
        fila(T('De eso, intereses'), Q0(total - prestado), 'neg') +
        '<div class="aprendizaje">' +
        T('A {0} años, por una casa de {1} vas a pagar {2}. Los intereses solos cuestan {3}.',
          plazoSel, Q0(casa.precio), Q0(total + Motor.engancheDe(casa)), Q0(total - prestado)) +
        '</div>';
    }
    d.querySelectorAll('[data-ph]').forEach(function (b) {
      b.addEventListener('click', function () {
        plazoSel = parseInt(b.dataset.ph, 10);
        d.querySelectorAll('[data-ph]').forEach(function (x) { x.classList.remove('activa'); });
        b.classList.add('activa');
        simular();
      });
    });
    simular();

    d.querySelector('#comprar').addEventListener('click', function () {
      var r = Motor.comprarCasa(casaId, plazoSel);
      d.remove();
      if (!r.ok) return aviso(T('No se pudo'), r.razon);
      Motor.guardar(); Sonido.tono('logro'); render();
      tarjetaEducativa('hipoteca', 'llave', T('Compraste tu casa'),
        T('Pusiste {0} de enganche y el banco te prestó {1}. Tu cuota es {2} por {3} años.',
          Q0(r.enganche), Q0(r.prestado), Q(r.cuota), plazoSel),
        T('La casa no es tuya el día que te dan las llaves. Es tuya el día que terminas de pagarla. Hasta entonces, dejar de pagar significa perderla y perder lo que ya pusiste.'));
    });
  }

  function flujoMigrar() {
    var e = Motor.get();
    var elegido = null, envio = MIGRACION.enviosSugeridos[1], canal = 'ventanilla';

    var h = '<span class="icono">' + Ico('avion') + '</span><h2>' + T('Irte a Estados Unidos') + '</h2>';
    h += '<p>' + T('Se gana mucho más y se gasta mucho más. Mientras estés fuera no construyes historial de crédito aquí, y cada envío pierde comisión.') + '</p>';
    h += fila(T('Cuesta el viaje'), Q0(MIGRACION.costoViaje), 'neg');
    h += fila(T('Costo de vida allá'), 'US$' + MIGRACION.costoVidaDolares.toLocaleString() + T(' al mes'), 'neg');
    h += fila(T('Riesgo de que no salga'), pct(MIGRACION.riesgoFracaso), 'neg');
    h += '<div class="letra-chica">' +
      T('Si no sale, pierdes lo que pagaste y te quedas aquí. Le pasa a casi uno de cada cinco.') +
      '</div>';

    h += '<h3>' + T('¿En qué vas a trabajar?') + '</h3>';
    MIGRACION.empleos.forEach(function (emp) {
      var puede = NIVELES_EDUCATIVOS.indexOf(e.educacion) >= NIVELES_EDUCATIVOS.indexOf(emp.requisito);
      h += '<div class="opcion' + (puede ? '' : ' bloqueada') + '">';
      h += '<div class="titulo">' + Ico(emp.icono) + ' ' + esc(D(emp, 'nombre')) + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(emp, 'descripcion')) + '</p>';
      h += fila(T('Sueldo'), 'US$' + emp.sueldoDolares.toLocaleString() + T(' al mes'), 'pos');
      if (!puede) h += '<p class="aviso">' + T('Necesitas nivel {0}.', nivel(emp.requisito)) + '</p>';
      else h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-emp="' +
                emp.id + '">' + T('Este') + '</button></div>';
      h += '</div>';
    });
    h += '<div id="conf"></div>';
    h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
         T('Mejor no') + '</button></div>';

    var d = modal(h);

    d.querySelectorAll('[data-emp]').forEach(function (b) {
      b.addEventListener('click', function () {
        elegido = b.dataset.emp;
        var emp = buscar(MIGRACION.empleos, elegido);
        var sobra = emp.sueldoDolares - MIGRACION.costoVidaDolares;
        var c = d.querySelector('#conf');
        var hh = '<div class="tarjeta acento"><div class="titulo">' + Ico(emp.icono) + ' ' +
                 esc(D(emp, 'nombre')) + '</div>';
        hh += fila(T('Te sobra al mes'), 'US$' + Math.round(sobra).toLocaleString(), 'pos');
        hh += '<label class="sutil" style="margin-top:8px;display:block">' +
              T('¿Cuánto mandas a casa?') + '</label><div class="btn-fila">';
        MIGRACION.enviosSugeridos.forEach(function (p, i) {
          hh += '<button class="btn-chico env' + (i === 1 ? ' activa' : '') + '" data-e="' + p + '">' +
                pct(p) + '</button>';
        });
        hh += '</div><label class="sutil" style="margin-top:8px;display:block">' +
              T('¿Por dónde lo mandas?') + '</label><div class="btn-fila">';
        Object.keys(MIGRACION.canales).forEach(function (id, i) {
          hh += '<button class="btn-chico can' + (i === 0 ? ' activa' : '') + '" data-c="' + id + '">' +
                esc(K('canal_nombre', id, MIGRACION.canales[id].nombre)) + ' · ' +
                pct(MIGRACION.canales[id].comision) + '</button>';
        });
        hh += '</div><div id="envsim" style="margin-top:10px"></div>';
        hh += '<button class="btn-primario" id="irme" style="margin-top:10px">' + T('Irme') + '</button></div>';
        c.innerHTML = hh;

        function simEnvio() {
          var com = MIGRACION.canales[canal].comision;
          var mandaUSD = sobra * envio;
          var llegaQ = mandaUSD * (1 - com) * CONFIG.tipoCambio;
          var pierdeQ = mandaUSD * com * CONFIG.tipoCambio;
          c.querySelector('#envsim').innerHTML =
            fila(T('Llega a tu familia'), Q(llegaQ), 'pos') +
            fila(T('Se pierde en comisión'), Q(pierdeQ), 'neg') +
            fila(T('En diez años, solo de comisión'), Q0(pierdeQ * 120), 'neg');
        }
        c.querySelectorAll('[data-e]').forEach(function (x) {
          x.addEventListener('click', function () {
            envio = parseFloat(x.dataset.e);
            c.querySelectorAll('[data-e]').forEach(function (y) { y.classList.remove('activa'); });
            x.classList.add('activa'); simEnvio();
          });
        });
        c.querySelectorAll('[data-c]').forEach(function (x) {
          x.addEventListener('click', function () {
            canal = x.dataset.c;
            c.querySelectorAll('[data-c]').forEach(function (y) { y.classList.remove('activa'); });
            x.classList.add('activa'); simEnvio();
          });
        });
        simEnvio();

        c.querySelector('#irme').addEventListener('click', function () {
          var r = Motor.migrar(elegido, envio, canal);
          d.remove();
          if (!r.ok) return aviso(T('No se pudo'), r.razon);
          Motor.guardar(); render();
          if (r.fracaso) {
            Sonido.tono('alerta');
            return modal('<span class="icono">' + Ico('barrera') + '</span><h2>' + T('No lograste llegar') + '</h2><p>' +
              T('Te devolvieron. Perdiste los {0} del viaje y estás de vuelta donde empezaste, con menos.',
                Q0(MIGRACION.costoViaje)) + '</p>' +
              '<div class="aprendizaje">' +
              T('Casi uno de cada cinco intentos termina así. Es un riesgo que la gente rara vez pone en la cuenta antes de irse.') +
              '</div><button class="btn-primario" data-cerrar>' + T('Seguir') + '</button>');
          }
          tarjetaEducativa('migrar', 'avion', T('Te fuiste'),
            T('Estás en Estados Unidos trabajando. Mandas {0} de lo que te sobra cada mes.', pct(envio)),
            T('Aquí empieza el otro lado de la remesa. Fíjate cuánto llega de verdad a tu familia y cuánto se queda en el camino.'));
        });
      });
    });
  }

  function flujoInformal() {
    var c = CREDITOS.informal;
    var h = '<span class="icono">' + Ico('bandera') + '</span><h2>' + T('Prestamista del barrio') + '</h2>';
    h += '<p>' + T('Presta a cualquiera, hoy mismo, sin papeles. Cobra veinticinco por ciento al mes.') + '</p>';
    h += fila(T('Interés'), T('{0} mensual', pct(c.tasaMensual)));
    h += fila(T('En términos anuales'), Math.round((Math.pow(1 + c.tasaMensual, 12) - 1) * 100) + '%', 'neg');
    h += '<div class="letra-chica"><strong>' + T('Léelo dos veces.') + '</strong> ' +
      T('Veinte por ciento al mes suena poco. Al año son más de setecientos por ciento. En Guatemala no hay techo legal a las tasas.') +
      '</div>';
    h += '<label class="sutil">' + T('Monto') + '</label><input type="number" id="monto" value="1000" step="100" min="' +
         c.montoMinimo + '" max="' + c.montoMaximo + '">';
    h += '<div id="sim" class="tarjeta" style="margin-top:10px"></div>';
    h += '<button class="btn-primario peligro" id="confirmar">' + T('Aceptar de todos modos') + '</button>';
    h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
         T('Mejor no') + '</button></div>';

    var d = modal(h);
    function simular() {
      var monto = parseFloat(d.querySelector('#monto').value) || 0;
      var cuota = Motor.cuotaMensual(monto, c.tasaMensual, 6);
      d.querySelector('#sim').innerHTML =
        fila(T('Cuota a 6 meses'), Q(cuota)) +
        fila(T('Vas a devolver'), Q(cuota * 6), 'neg') +
        fila(T('Solo de intereses'), Q(cuota * 6 - monto), 'neg');
    }
    d.querySelector('#monto').addEventListener('input', simular);
    simular();

    d.querySelector('#confirmar').addEventListener('click', function () {
      var monto = parseFloat(d.querySelector('#monto').value) || 0;
      var r = Motor.pedirInformal(monto, 6);
      d.remove();
      if (!r.ok) return aviso(T('No se pudo'), r.razon);
      Motor.guardar(); render();
      tarjetaEducativa('informalcredito', 'bandera', T('Le pediste al prestamista'),
        T('Tienes el dinero hoy, sin papeles y sin fiador. Tu cuota es {0} por seis meses.', Q(r.cuota)),
        T('Este préstamo no construye ningún historial. Al contrario: te consume el ingreso que necesitas para calificar en el banco. Es la trampa donde cae el 26.2% del país.'));
    });
  }

  // =============== arranque ===============

  function pantallaInicio() {
    var slots = Motor.ranuras();
    var hay = slots.some(function (s) { return !s.vacia; });

    var h = '<main style="padding-top:36px">' +
      '<div class="centrado" style="margin-bottom:22px">' +
        '<div class="moneda-grande">' + Ico('moneda') + '</div>' +
        '<h1 style="font-size:26px;margin:8px 0 2px">Mi Primer Quetzal</h1>' +
        '<p class="sutil">' + T('De los 13 a la jubilación') + '</p>' +
        '<button class="btn-chico" data-idioma style="margin-top:10px">' + Ico('mundo') + ' ' +
          (Idioma.actual() === 'es' ? 'English' : 'Español') + '</button></div>';

    if (hay) {
      h += '<h3>' + T('Tus partidas') + '</h3>';
      slots.forEach(function (s) {
        h += '<div class="opcion">';
        if (s.vacia) {
          h += '<div class="titulo">' + T('Ranura {0} · vacía', s.n) + '</div>' +
               '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-nueva="' + s.n +
               '">' + T('Empezar aquí') + '</button></div>';
        } else {
          h += '<div class="titulo">' + T('Ranura {0} · {1} años', s.n, s.edad) + '</div>';
          h += '<p class="sutil" style="margin:6px 0">' + esc(nivel(s.educacion)) + ' · ' +
               esc(K('dificultad', s.dificultad, CONFIG.dificultad[s.dificultad].nombre)) + '</p>';
          h += fila(T('Patrimonio'), Q0(s.patrimonio));
          h += '<div class="btn-fila" style="margin-top:8px">' +
               '<button class="btn-chico" data-seguir="' + s.n + '">' + T('Seguir jugando') + '</button>' +
               '<button class="btn-chico peligro" data-borrar="' + s.n + '">' + T('Borrar') + '</button></div>';
        }
        h += '</div>';
      });
    } else {
      /* Portada de primera vez.
       * Antes solo habia una frase y un boton, asi que el jugador entraba sin
       * saber a que. Esto dice de que trata el juego con cuatro pasos, cada
       * uno con su icono, para que se entienda de un vistazo y no leyendo.
       */
      h += '<div class="portada">';
      h += '<p class="lema">' + T('Un simulador para aprender a usar el banco sin arriesgar dinero de verdad.') + '</p>';
      h += '<div class="pasos">';
      h += '<div class="paso"><span class="paso-ic">' + Ico('mochila') + '</span><span class="tx"><b>' +
           T('Empiezas con 13 años, saliendo de primaria') + '</b>' +
           T('Lo primero que decides es si vas a seguir estudiando. Eliges de qué familia sales y en qué Guatemala te toca vivir.') +
           '</span></div>';
      h += '<div class="paso"><span class="paso-ic">' + Ico('calendario') + '</span><span class="tx"><b>' +
           T('Cada mes reparte ocho jornadas') + '</b>' +
           T('Cuatro semanas de mañana y tarde. El colegio te toma una jornada; la otra la decides tú: trabajar, descansar o buscarte algo extra.') +
           '</span></div>';
      h += '<div class="paso"><span class="paso-ic">' + Ico('trending-up') + '</span><span class="tx"><b>' +
           T('Montas tu propio negocio') + '</b>' +
           T('Empiezas con un puesto de dulces de Q450 y llegas a tener varios, con gente trabajando para ti. Cada uno se ve crecer en tu calle.') +
           '</span></div>';
      h += '<div class="paso"><span class="paso-ic">' + Ico('banco') + '</span><span class="tx"><b>' +
           T('Usas productos bancarios de verdad') + '</b>' +
           T('Cuenta monetaria, ahorro, plazo fijo, préstamo, tarjeta, hipoteca y pensión. Con las tasas que se cobran en Guatemala.') +
           '</span></div>';
      h += '<div class="paso"><span class="paso-ic">' + Ico('bandera-meta') + '</span><span class="tx"><b>' +
           T('Llegas a los 65 y ves el resultado') + '</b>' +
           T('Una gráfica de toda tu vida y el recuento de lo que cada decisión te costó o te dio.') +
           '</span></div>';
      h += '</div>';
      h += '<div class="btn-fila"><button class="btn-primario" data-nueva="1">' +
           T('Empezar') + '</button></div>';
      h += '<p class="aviso">' + T('Banco Cardamomo es un banco inventado. Los precios, sueldos y tasas son de Guatemala y están documentados.') + '</p>';
      h += '</div>';
    }
    h += '</main>';
    app.innerHTML = h;

    app.onclick = function (ev) {
      var b = ev.target.closest('[data-seguir],[data-nueva],[data-borrar],[data-idioma]');
      if (!b) return;
      if (b.dataset.idioma !== undefined) { Idioma.alternar(); return pantallaInicio(); }
      if (b.dataset.seguir) { Motor.cargar(parseInt(b.dataset.seguir, 10)); app.onclick = null; return arrancar(); }
      if (b.dataset.borrar) { Motor.borrar(parseInt(b.dataset.borrar, 10)); return pantallaInicio(); }
      if (b.dataset.nueva) return flujoNuevaPartida(parseInt(b.dataset.nueva, 10));
    };
  }

  /* Una pregunta antes de empezar: qué tan duro lo quieres.
   *
   * Eran dos preguntas seguidas —de dónde sales y en qué Guatemala te toca
   * vivir— con cinco tarjetas largas, cada una con su párrafo y sus tres
   * filas de datos, antes de haber tocado el juego. Para alguien de 13 años
   * eso no es una elección, es un formulario.
   *
   * Ahora son tres niveles con color: fácil, medio y difícil. Cada uno empareja
   * un origen con una economía (ver NIVELES_JUEGO en datos/origenes.js). Quien
   * quiera la combinación exacta la sigue teniendo en "prefiero elegir yo",
   * que es donde vive el flujo de antes.
   */
  function flujoNuevaPartida(ranura) {
    var h = '<h2>' + T('¿Qué tan duro lo quieres?') + '</h2>';
    h += '<p class="sutil">' + T('No cambia las reglas. Cambia con qué familia te toca empezar.') + '</p>';

    NIVELES_JUEGO.forEach(function (n) {
      var o = buscar(ORIGENES, n.origen);
      h += '<div class="nivel ' + n.id + '" data-nivel="' + n.id + '">';
      h += '<div class="nivel-alto">' +
             '<span class="nivel-ic">' + Ico(o.icono) + '</span>' +
             '<span class="nivel-nom">' + T(n.nombre) + '</span>' +
           '</div>';
      h += '<p class="nivel-txt">' + esc(K('nivel_resumen', n.id, n.resumen)) + '</p>';
      h += pastillas([
        pastilla('moneda', o.mesada ? T('{0} de mesada', Q0(o.mesada)) : T('sin mesada')),
        pastilla(n.economia === 'normal' ? 'edificio' : 'canasta',
                 n.economia === 'normal' ? T('Hay trabajo formal') : T('Solo trabajo informal'))
      ]);
      h += '</div>';
    });

    h += '<div class="btn-fila" style="margin-top:12px">' +
         '<button class="btn-chico" data-elegir-yo="1" style="flex:1">' +
         T('Prefiero elegir yo') + '</button>' +
         '<button class="btn-chico" data-cerrar>' + T('Cancelar') + '</button></div>';

    var d = modal(h, function () { pantallaInicio(); });

    d.querySelectorAll('[data-nivel]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = buscar(NIVELES_JUEGO, b.dataset.nivel);
        Motor.iniciar(n.economia, ranura, n.origen);
        d.remove(); app.onclick = null; arrancar();
      });
    });
    var yo = d.querySelector('[data-elegir-yo]');
    if (yo) yo.addEventListener('click', function () { d.remove(); flujoAMano(ranura); });
  }

  /* El flujo de antes, para quien quiera la combinación exacta. */
  function flujoAMano(ranura) {
    var origenSel = null;

    var h = '<h2>' + T('¿De dónde sales?') + '</h2>';
    ORIGENES.forEach(function (o) {
      h += '<div class="opcion"><div class="titulo">' + Ico(o.icono) + ' ' + esc(D(o, 'nombre')) + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(o, 'descripcion')) + '</p>';
      h += pastillas([
        pastilla('cartera', T('empiezas con {0}', Q0(o.efectivoInicial))),
        pastilla('moneda', o.mesada ? T('{0} de mesada', Q0(o.mesada)) : T('sin mesada')),
        pastilla('casa', o.aporteCasa ? T('de grande aportas {0}', Q0(o.aporteCasa)) : T('no aportas en casa'))
      ]);
      h += '<div class="letra-chica">' + esc(D(o, 'nota')) + '</div>';
      h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-o="' +
           o.id + '">' + T('Empezar así') + '</button></div></div>';
    });
    h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" data-cerrar>' +
         T('Cancelar') + '</button></div>';

    var d = modal(h, function () { pantallaInicio(); });

    d.querySelectorAll('[data-o]').forEach(function (b) {
      b.addEventListener('click', function () {
        origenSel = b.dataset.o;
        d.remove();
        var d2 = modal('<h2>' + T('¿En qué Guatemala te toca vivir?') + '</h2>' +
          '<div class="opcion"><div class="titulo">' + Ico('edificio') + ' ' + T('Empleo formal urbano') + '</div>' +
          '<p class="sutil" style="margin:6px 0">' +
          T('Contrato, Bono 14, aguinaldo y seguro social. Puedes construir historial de crédito.') + '</p>' +
          '<button class="btn-chico" data-d="normal">' + T('Jugar así') + '</button></div>' +
          '<div class="opcion"><div class="titulo">' + Ico('canasta') + ' ' + T('Economía informal') + '</div>' +
          '<p class="sutil" style="margin:6px 0">' +
          T('Sin contrato ni prestaciones, con ingresos más bajos. Es donde vive el 65% del país.') + '</p>' +
          '<button class="btn-chico" data-d="dificil">' + T('Jugar así') + '</button></div>',
          function () { pantallaInicio(); });
        d2.querySelectorAll('[data-d]').forEach(function (x) {
          x.addEventListener('click', function () {
            Motor.iniciar(x.dataset.d, ranura, origenSel);
            d2.remove(); app.onclick = null; arrancar();
          });
        });
      });
    });
  }

  function arrancar() {
    app.innerHTML = '';
    render();
    conectar();
    tarjetaEducativa('bienvenida', 'moneda', T('Cómo funciona'),
      T('Cada mes tienes ocho jornadas: cuatro semanas de mañana y tarde. Decides en qué usas cada una. Al terminar el mes cobras, pagas tus gastos y el juego avanza; después de los 22 los turnos se vuelven trimestres y luego años, para que puedas llegar hasta la jubilación.'),
      T('Tienes 13 años y todavía no puedes trabajar de verdad. Lo primero que hay que decidir no es dónde trabajar, es si vas a estudiar.'));
  }

  function iniciar() {
    app = document.querySelector('#app');
    try { document.documentElement.lang = Idioma.actual(); } catch (e) {}
    /* El foco del tutorial va pegado a una posición de pantalla, así que al
     * hacer scroll hay que volverlo a poner encima del objetivo. En las
     * pruebas no hay ventana con eventos, de ahí el try. */
    try {
      window.addEventListener('scroll', reubicarFoco, true);
      window.addEventListener('resize', reubicarFoco);
    } catch (e) {}
    pantallaInicio();
  }

  return {
    iniciar: iniciar,
    /* Saca una tarjeta de decisión por su id, sin esperar a que caiga sola.
     * Existe para pruebas/vista.html, que sirve para mirar el diseño con los
     * ojos: una tarjeta que aparece con 10% de probabilidad al mes es
     * imposible de revisar de otra forma. */
    verDecision: function (ref) { mostrarDecision({ clase: 'decision', ref: ref }, render); }
  };
})();
