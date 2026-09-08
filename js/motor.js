/* Mi Primer Quetzal — motor del juego
 *
 * Estado, tiempo, economia, estudio, credito y eventos.
 * No toca la pantalla: todo lo que devuelve son datos.
 */

var Motor = (function () {

  var PREFIJO = 'miPrimerQuetzal.ranura.';
  var CLAVE_HISTORIAL = 'miPrimerQuetzal.historial';
  var MESES = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];

  var estado = null;
  var ranuraActiva = 1;

  // ---------- utilidades ----------

  function azar(min, max) { return min + Math.random() * (max - min); }
  function azarEntero(min, max) { return Math.floor(azar(min, max + 1)); }
  function redondear(n) { return Math.round(n * 100) / 100; }
  function limitar(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function buscarPorId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }

  // ---------- estado inicial ----------

  function nuevoEstado(dificultad, origenId) {
    var mercado = {};
    for (var i = 0; i < CARRERAS.length; i++) mercado[CARRERAS[i].id] = CARRERAS[i].demandaInicial;
    var origen = buscarPorId(ORIGENES, origenId) || buscarPorId(ORIGENES, 'remesas');

    return {
      dificultad: dificultad || 'normal',
      origen: origen.id,
      mesesJugados: 0,
      mes: CONFIG.inicio.mesCalendario,
      anio: CONFIG.inicio.anioCalendario,
      edad: CONFIG.inicio.edad,
      jubilado: false,

      efectivo: origen.efectivoInicial,
      mesada: origen.mesada || 0,
      monetaria: null,
      ahorro: null,
      plazo: null,            // { monto, mesesRestantes, tasa }
      pension: null,          // { saldo, aporteMensual }
      energia: CONFIG.inicio.energia,

      casa: null,             // { id, valor, comprada }
      hipoteca: null,         // { saldo, cuota, tasaMensual, mesesRestantes, atrasos }
      migracion: null,        // { empleoId, mesesFuera, enviaPorcentaje, canal, ahorroDolares }
      totalEnviado: 0,
      comisionesEnvio: 0,

      educacion: CONFIG.inicio.educacion,
      estudio: null,          // { carreraId, mesesAvanzados, privada, jornada }
      // null = todavia no ha decidido si estudia. Es la primera decision del
      // juego, y vuelve a estar en null cada vez que se gradua de algo.
      decisionEstudio: null,
      carrerasTerminadas: [],
      vivienda: CONFIG.inicio.vivienda,

      empleo: null,
      espacios: espaciosVacios(),
      deudaHogar: 0,

      puntaje: PUNTAJE.inicial,
      reputacion: origen.reputacionInicial,
      aporteCasa: origen.aporteCasa,
      remesaActiva: origen.remesaActiva,
      prestamos: [],          // { tipo, saldo, cuota, tasaMensual, mesesRestantes, atrasos }
      tarjeta: null,          // { saldo, limite, pagarMinimo }
      mercado: mercado,
      promosActivas: [],      // { id, mesesRestantes, efecto }
      cargosRecurrentes: [],  // { nombre, monto }

      mesesParaRemesa: azarEntero(1, 2),
      // Quetzales extra por jornada trabajada: se compran con las tarjetas de
      // decision (una bicicleta, un celular) y no se pierden nunca.
      bonoJornada: 0,
      // Las mejoras compradas: { herramienta: true, utiles: true, ... }
      mejoras: {},
      /* El imperio. Cada negocio abierto es
       *   { tipoId, nivel, empleados: [{ tipo, meses }], mesesAbierto,
       *     ventaUltimoMes, gananciaUltimoMes }
       * Vacio al empezar: a los trece nadie tiene un negocio. */
      negocios: [],
      decisionesVistas: [],
      mesesSinDecision: 0,
      vistos: {},
      desbloqueado: llavesIniciales(),
      peldanos: {},
      bitacora: [],
      resumenesAnuales: [],
      totales: {
        ingresos: 0, gastos: 0, interesesGanados: 0, fugaEfectivo: 0,
        interesesPagados: 0, comisionesRemesa: 0, mesesEstudiando: 0
      }
    };
  }

  // ---------- tiempo ----------

  function etapaActual() {
    for (var i = 0; i < CONFIG.tiempo.etapas.length; i++) {
      if (estado.edad < CONFIG.tiempo.etapas[i].hastaEdad) return CONFIG.tiempo.etapas[i];
    }
    return CONFIG.tiempo.etapas[CONFIG.tiempo.etapas.length - 1];
  }

  function mesesDelTurno() { return etapaActual().mesesPorTurno; }
  function enGracia() { return estado.mesesJugados < CONFIG.mesesDeGracia; }
  function esMenor() { return estado.edad < CONFIG.mayoriaDeEdad; }

  // ---------- las jornadas del mes ----------

  /* El mes son cuatro semanas de dos jornadas cada una: ocho casillas.
   * El indice 0 es la manana de la primera semana, el 1 su tarde, el 2 la
   * manana de la segunda, y asi. Las funciones de abajo son la unica parte del
   * juego que conoce esa cuenta. */

  function espaciosVacios() {
    var v = [];
    for (var i = 0; i < CONFIG.jornadasPorMes; i++) v.push('');
    return v;
  }
  function semanaDe(i) { return Math.floor(i / CONFIG.jornadasPorSemana); }
  function jornadaDe(i) { return i % CONFIG.jornadasPorSemana === 0 ? 'am' : 'pm'; }
  function indiceDe(semana, jornada) {
    return semana * CONFIG.jornadasPorSemana + (jornada === 'pm' ? 1 : 0);
  }

  /* Una casilla bloqueada es una que el colegio ya tomo.
   *
   * Basicos y diversificado son de jornada: mientras estes inscrito, esa
   * jornada de las cuatro semanas es del colegio y no se puede vaciar. La
   * universidad no bloquea nada: ahi el jugador reparte como quiera. */
  function espacioBloqueado(i) {
    if (!estado || !estado.estudio || !estado.estudio.jornada) return false;
    return jornadaDe(i) === estado.estudio.jornada;
  }

  /* Vuelve a sentar al jugador en el colegio. Se llama al inscribirse y cada
   * vez que se limpia el mes, para que las casillas del colegio reaparezcan
   * solas en el turno siguiente. */
  function aplicarHorarioEstudio() {
    if (!estado || !estado.estudio || !estado.estudio.jornada) return;
    for (var sem = 0; sem < CONFIG.jornadasPorMes / CONFIG.jornadasPorSemana; sem++) {
      estado.espacios[indiceDe(sem, estado.estudio.jornada)] = 'estudio';
    }
  }

  /* Partidas guardadas de cuando el mes tenia cuatro casillas en vez de ocho.
   * Se rehace el reparto en blanco: perder la asignacion de un mes no cuesta
   * nada, y dejar un arreglo de largo raro rompe todo lo demas. */
  function sanearEspacios() {
    if (!estado) return;
    if (!Array.isArray(estado.espacios) || estado.espacios.length !== CONFIG.jornadasPorMes) {
      estado.espacios = espaciosVacios();
      aplicarHorarioEstudio();
    }
  }

  // ---------- la ruta que se va abriendo ----------

  /* El juego no empieza con todo encima. Las pestañas y los productos del
   * banco se van abriendo por peldaños, definidos en datos/progreso.js.
   *
   * El motor solo lleva la cuenta de qué está abierto: NO prohíbe nada. Un
   * peldaño cerrado es algo que la interfaz todavía no dibuja, no una acción
   * que el motor rechace. Así las pruebas de balanceo pueden seguir jugando
   * vidas completas llamando al motor directo, sin pelear con la ruta.
   */

  function llavesIniciales() {
    var m = {};
    for (var i = 0; i < PROGRESO_INICIAL.length; i++) m[PROGRESO_INICIAL[i]] = true;
    return m;
  }

  /* Rellena lo que falte. Sirve para partidas guardadas antes de que la ruta
   * existiera: se les abre lo que ya tenían ganado en vez de esconderles
   * medio juego de repente. */
  function sanearProgreso() {
    if (!estado) return;
    if (!estado.desbloqueado) estado.desbloqueado = llavesIniciales();
    if (!estado.peldanos) estado.peldanos = {};
  }

  function desbloqueado(llave) {
    return !!(estado && estado.desbloqueado && estado.desbloqueado[llave]);
  }

  /* Revisa la ruta y abre los peldaños cuya condición ya se cumple. Devuelve
   * los que se abrieron en esta llamada, para que la interfaz los anuncie de
   * uno en uno. Nunca abre el mismo dos veces.
   *
   * `vista` es lo que el jugador está viendo ahora mismo: { pestana,
   * espacioSel }. Los pasos del tutorial la necesitan, porque "toca la
   * pestaña Trabajo" no se puede comprobar mirando solo el estado de la
   * partida. Quien llame sin vista solo se pierde esos pasos.
   *
   * Se repite hasta que una pasada no abra nada: un peldaño encadenado con
   * `requiere` puede quedar listo en el mismo instante que el anterior.
   */
  function revisarProgreso(vista) {
    if (!estado) return [];
    sanearProgreso();
    var v = vista || {};
    var nuevos = [];
    var otraVuelta = true;

    while (otraVuelta) {
      otraVuelta = false;
      for (var i = 0; i < PROGRESO.length; i++) {
        var p = PROGRESO[i];
        if (estado.peldanos[p.id]) continue;
        if (p.requiere && !estado.peldanos[p.requiere]) continue;
        var cumple = false;
        try { cumple = !!p.cuando(estado, API, v); } catch (err) { cumple = false; }
        if (!cumple) continue;
        estado.peldanos[p.id] = true;
        for (var k = 0; k < p.llaves.length; k++) estado.desbloqueado[p.llaves[k]] = true;
        nuevos.push(p);
        otraVuelta = true;
      }
    }
    if (nuevos.length) guardar();
    return nuevos;
  }

  /* El siguiente peldaño que se puede perseguir, con su número dentro de la
   * ruta. Devuelve null cuando ya no queda ninguno con pista. */
  function siguientePeldano(soloMetas) {
    if (!estado) return null;
    sanearProgreso();
    for (var i = 0; i < PROGRESO.length; i++) {
      var p = PROGRESO[i];
      if (estado.peldanos[p.id] || !p.pista) continue;
      // Un peldaño del tutorial que no abre nada solo tiene sentido dentro
      // del tutorial: quien lo salto no quiere que se lo sigan pidiendo.
      if (soloMetas && p.guia && !p.titulo) continue;
      // Un peldaño encadenado no se persigue antes de que le toque
      if (p.requiere && !estado.peldanos[p.requiere]) continue;
      return { peldano: p, n: i + 1, total: PROGRESO.length };
    }
    return null;
  }

  /* Cuántos peldaños llevas abiertos, para la barra de avance de la ruta. */
  function peldanosAbiertos() {
    if (!estado || !estado.peldanos) return 0;
    var n = 0;
    for (var i = 0; i < PROGRESO.length; i++) if (estado.peldanos[PROGRESO[i].id]) n++;
    return n;
  }

  // ---------- las mejoras: la capa de tycoon ----------

  /* Las mejoras de datos/mejoras.js son lo único del juego que se compra una
   * vez y rinde para siempre. El motor solo lleva la cuenta de cuáles tiene y
   * suma sus efectos; qué hace cada efecto está en resolverMes.
   *
   * Igual que con la ruta, el motor NO prohíbe: comprar una mejora que no
   * toca todavía es un error de la interfaz, no algo que el motor rechace...
   * salvo por el dinero y por el nivel anterior, que sí son reglas del juego.
   */

  function mejorasDeCadena(cadena) {
    return MEJORAS.filter(function (m) { return m.cadena === cadena; });
  }

  /* Cuántos escalones lleva comprados de una cadena. Es el "nivel" que ve el
   * jugador, y sube de uno en uno porque el orden de la lista es el orden. */
  function nivelDeCadena(cadena) {
    if (!estado || !estado.mejoras) return 0;
    var lista = mejorasDeCadena(cadena);
    var n = 0;
    for (var i = 0; i < lista.length; i++) {
      if (!estado.mejoras[lista[i].id]) break;
      n++;
    }
    return n;
  }

  /* La siguiente mejora de una cadena, o null si ya está completa. */
  function siguienteMejora(cadena) {
    var lista = mejorasDeCadena(cadena);
    var n = nivelDeCadena(cadena);
    return n < lista.length ? lista[n] : null;
  }

  function tieneMejora(id) {
    return !!(estado && estado.mejoras && estado.mejoras[id]);
  }

  /* Por qué NO se puede comprar una mejora. Devuelve null si sí se puede.
   * La interfaz usa el motivo para decirlo en una línea en vez de esconder
   * el botón: saber qué te falta es la mitad de la decisión. */
  function faltaParaMejora(id) {
    var m = buscarPorId(MEJORAS, id);
    if (!m) return { motivo: 'noexiste', razon: 'Esa mejora no existe.' };
    if (tieneMejora(id)) return { motivo: 'repetida', razon: 'Ya la tienes.' };
    var sig = siguienteMejora(m.cadena);
    if (!sig || sig.id !== id) {
      return { motivo: 'orden', razon: 'Primero te falta la mejora anterior.' };
    }
    if (m.edadMinima && estado.edad < m.edadMinima) {
      return { motivo: 'edad', razon: 'Hasta los ' + m.edadMinima + '.' };
    }
    /* Los dos escalones grandes del negocio piden nivel educativo, y es lo
     * que evita que la capa de tycoon se coma el mensaje del juego: sin
     * básicos terminados se llega a la carreta y ahí se para. */
    if (m.requiereNivel && nivelIndice(estado.educacion) < nivelIndice(m.requiereNivel)) {
      return { motivo: 'nivel', razon: 'Necesitas ' + m.requiereNivel + ' terminado.' };
    }
    if (dineroDisponible() < m.costo) {
      return { motivo: 'dinero', razon: 'Te faltan Q' +
               Math.ceil(m.costo - dineroDisponible()) + '.' };
    }
    return null;
  }

  /* Lo que puede gastar hoy sin tocar el plazo fijo ni la pensión. */
  function dineroDisponible() {
    if (!estado) return 0;
    return estado.efectivo + (estado.monetaria || 0) + (estado.ahorro || 0);
  }

  function comprarMejora(id) {
    var falta = faltaParaMejora(id);
    if (falta) return { ok: false, razon: falta.razon, motivo: falta.motivo };
    var m = buscarPorId(MEJORAS, id);
    var resto = cobrarDeCuentas(m.costo);
    if (resto > 0.01) {
      // No debería pasar (dineroDisponible ya lo comprobó), pero si pasa no
      // se le regala la mejora ni se le deja una deuda a medias.
      estado.deudaHogar = redondear(estado.deudaHogar + resto);
      return { ok: false, razon: 'No alcanzó.' };
    }
    estado.mejoras[m.id] = true;
    guardar();
    return { ok: true, mejora: m };
  }

  /* La suma de todo lo que dan las mejoras compradas. */
  function efectosDeMejoras() {
    var t = { bonoJornada: 0, avanceEstudio: 0,
              costoMensual: 0, energiaExtra: 0 };
    if (!estado || !estado.mejoras) return t;
    for (var i = 0; i < MEJORAS.length; i++) {
      var m = MEJORAS[i];
      if (!estado.mejoras[m.id]) continue;
      for (var k in m.efecto) {
        if (t[k] !== undefined) t[k] = redondear(t[k] + m.efecto[k]);
      }
    }
    return t;
  }

  /* Lo que gana por jornada trabajada, por encima del sueldo: las mejoras de
   * oficio más lo que haya comprado con una tarjeta de decisión. */
  function bonoPorJornada() {
    return redondear((estado ? (estado.bonoJornada || 0) : 0) +
                     efectosDeMejoras().bonoJornada);
  }

  // ---------- el imperio: los negocios del jugador ----------

  /* Esta es la capa de tycoon del juego, y la parte donde el jugador deja de
   * vender su tiempo y empieza a comprar el de otros.
   *
   * Un negocio abierto vive en estado.negocios como
   *
   *   { tipoId, nivel, empleados: [{ tipo, meses }], mesesAbierto,
   *     ventaUltimoMes, gananciaUltimoMes }
   *
   * `nivel` empieza en 1 y es un indice sobre NIVELES_NEGOCIO. `empleados` es
   * una lista y no un contador porque cada uno tiene su propia forma de
   * contrato, y despedir a uno formal cuesta indemnizacion.
   *
   * Igual que en el resto del motor: aqui NO se prohibe por progresion. Lo que
   * si se comprueba son las reglas de verdad —la edad, el nivel educativo, los
   * dos techos, las plazas y el dinero— porque esas SON el juego.
   */

  function tipoDeNegocio(id) { return buscarPorId(TIPOS_NEGOCIO, id); }

  function negociosAbiertos() {
    return (estado && Array.isArray(estado.negocios)) ? estado.negocios : [];
  }

  function negocioDe(tipoId) {
    var l = negociosAbiertos();
    for (var i = 0; i < l.length; i++) if (l[i].tipoId === tipoId) return l[i];
    return null;
  }

  /* Los dos techos que hacen que estudiar valga la pena.
   *
   * Un nivel educativo que no este en la tabla cae al de primaria y nunca a
   * cero: quedarse sin poder abrir nada por un id mal escrito seria un fallo
   * mudo, y de esos no se sale. */
  function techoNegocios() {
    var t = TECHO_NEGOCIOS[estado ? estado.educacion : 'primaria'];
    return t === undefined ? TECHO_NEGOCIOS.primaria : t;
  }
  function techoEmpleados() {
    var t = TECHO_EMPLEADOS[estado ? estado.educacion : 'primaria'];
    return t === undefined ? TECHO_EMPLEADOS.primaria : t;
  }
  function empleadosTotales() {
    var l = negociosAbiertos(), n = 0;
    for (var i = 0; i < l.length; i++) n += l[i].empleados.length;
    return n;
  }

  /* El escalon en el que esta un negocio, y lo que ese escalon le da. */
  function nivelDeNegocio(neg) {
    var i = Math.min(Math.max(neg.nivel || 1, 1), NIVELES_NEGOCIO.length) - 1;
    return NIVELES_NEGOCIO[i];
  }

  /* Cuanta gente cabe adentro: lo que trae el tipo mas lo que le hayan
   * agregado los niveles. Una de esas plazas es la del dueno. */
  function plazasDe(neg) {
    var t = tipoDeNegocio(neg.tipoId);
    if (!t) return 0;
    var extra = 0;
    for (var i = 0; i < (neg.nivel || 1) && i < NIVELES_NEGOCIO.length; i++) {
      extra += NIVELES_NEGOCIO[i].plazasExtra;
    }
    return t.plazas + extra;
  }

  /* Las jornadas que el jugador le puso a ESTE negocio este mes. */
  function jornadasDelDueno(tipoId) { return espaciosUsados('negocio:' + tipoId); }

  /* Lo que costaria subir un negocio al siguiente nivel, o 0 si ya esta
   * arriba. Es un multiplo del costo de apertura, asi que sube solo cuando
   * alguien agrega un tipo nuevo y no hay que calibrar nada a mano. */
  function costoDeSubirNivel(tipoId) {
    var neg = negocioDe(tipoId);
    var t = tipoDeNegocio(tipoId);
    if (!neg || !t || (neg.nivel || 1) >= NIVELES_NEGOCIO.length) return 0;
    return Math.round(t.costoApertura * NIVELES_NEGOCIO[neg.nivel].costoRelativo);
  }

  /* Lo que cuesta al mes una persona contratada, CON TODO INCLUIDO.
   *
   * Es la cifra mas util de todo el juego para quien algun dia tenga un
   * negocio: el formal cuesta el sueldo por 1.42 mas el bono de ley, no el
   * sueldo. Ver los dos numeros juntos es la leccion. */
  function costoDeEmpleado(tipo) {
    var p = PLANILLA[tipo] || PLANILLA.informal;
    return Math.round(p.sueldo * p.factorPrestaciones + p.bonoLey);
  }

  function planillaDe(neg) {
    var s = 0;
    for (var i = 0; i < neg.empleados.length; i++) {
      s += costoDeEmpleado(neg.empleados[i].tipo);
    }
    return s;
  }

  /* Lo que este negocio haria en un mes normal, desglosado.
   *
   * `jornadasDueno` se puede pasar a mano para proyectar sin cambiar nada
   * ("y si le pongo dos jornadas?"), que es lo que usa la pantalla para
   * ensenar la decision antes de tomarla. */
  function proyeccionDeNegocio(neg, jornadasDueno) {
    var vacia = { venta: 0, margen: 0, costoMensual: 0, planilla: 0, neto: 0,
                  jornadas: 0, plazas: 0, sinDueno: false, llena: false };
    var t = tipoDeNegocio(neg.tipoId);
    if (!t) return vacia;
    var propias = jornadasDueno === undefined ? jornadasDelDueno(neg.tipoId)
                                              : jornadasDueno;
    var deEmpleados = neg.empleados.length * JORNADAS_POR_EMPLEADO;
    var plazas = plazasDe(neg);
    /* No caben mas jornadas que plazas por mes: un local tiene el tamano que
     * tiene, y por eso el negocio chico no crece aunque le sobre dinero. */
    var cupo = plazas * CONFIG.jornadasPorMes;
    var jornadas = Math.min(propias + deEmpleados, cupo);
    var venta = jornadas * t.ventaPorJornada * nivelDeNegocio(neg).multiplicador;
    // El dueno que no aparece pierde plata, pero no todo: delegar SI funciona
    var sinDueno = propias === 0 && jornadas > 0;
    if (sinDueno) venta = venta * RENDIMIENTO_SIN_DUENO;
    var planilla = planillaDe(neg);
    return {
      venta: Math.round(venta),
      margen: Math.round(venta * t.margen),
      costoMensual: t.costoMensual,
      planilla: planilla,
      neto: Math.round(venta * t.margen - t.costoMensual - planilla),
      jornadas: jornadas,
      plazas: plazas,
      sinDueno: sinDueno,
      llena: jornadas >= cupo
    };
  }

  /* El resumen del imperio entero. Es el marcador del tycoon. */
  function imperio() {
    var l = negociosAbiertos();
    var t = { negocios: l.length, techoNegocios: techoNegocios(),
              empleados: empleadosTotales(), techoEmpleados: techoEmpleados(),
              venta: 0, margen: 0, costos: 0, planilla: 0, neto: 0 };
    for (var i = 0; i < l.length; i++) {
      var p = proyeccionDeNegocio(l[i]);
      t.venta += p.venta;
      t.margen += p.margen;
      t.costos += p.costoMensual;
      t.planilla += p.planilla;
      t.neto += p.neto;
    }
    return t;
  }

  /* Por que NO se puede abrir un negocio. null si si se puede.
   * La interfaz usa el motivo para decirlo en una linea. */
  function faltaParaAbrir(tipoId) {
    var t = tipoDeNegocio(tipoId);
    if (!t) return { motivo: 'noexiste', razon: 'Ese negocio no existe.' };
    if (negocioDe(tipoId)) return { motivo: 'repetido', razon: 'Ya tienes uno.' };
    /* La edad y el nivel van ANTES del techo, y el orden importa: la interfaz
     * esconde lo que no está al alcance por edad o por estudio, pero SÍ le
     * dice al jugador cuando lo único que le pasa es que ya va lleno. Si el
     * techo se comprobara primero, un negocio que además le queda grande
     * saldría diciendo "vas lleno", que es mentira. */
    if (t.edadMinima && estado.edad < t.edadMinima) {
      return { motivo: 'edad', razon: 'Hasta los ' + t.edadMinima + '.' };
    }
    if (t.requiereNivel && nivelIndice(estado.educacion) < nivelIndice(t.requiereNivel)) {
      return { motivo: 'nivel', razon: 'Necesitas ' + t.requiereNivel + ' terminado.' };
    }
    if (negociosAbiertos().length >= techoNegocios()) {
      return { motivo: 'techo', razon: 'Ya llevas los ' + techoNegocios() +
               ' que puedes administrar. Traspasa uno o sigue estudiando.' };
    }
    if (dineroDisponible() < t.costoApertura) {
      return { motivo: 'dinero', razon: 'Te faltan Q' +
               Math.ceil(t.costoApertura - dineroDisponible()) + '.' };
    }
    return null;
  }

  function abrirNegocio(tipoId) {
    var falta = faltaParaAbrir(tipoId);
    if (falta) return { ok: false, razon: falta.razon, motivo: falta.motivo };
    var t = tipoDeNegocio(tipoId);
    var resto = cobrarDeCuentas(t.costoApertura);
    if (resto > 0.01) {
      estado.deudaHogar = redondear(estado.deudaHogar + resto);
      return { ok: false, razon: 'No alcanzó.' };
    }
    if (!Array.isArray(estado.negocios)) estado.negocios = [];
    estado.negocios.push({
      tipoId: tipoId, nivel: 1, empleados: [], mesesAbierto: 0,
      ventaUltimoMes: 0, gananciaUltimoMes: 0
    });
    guardar();
    return { ok: true, tipo: t };
  }

  function faltaParaSubirNivel(tipoId) {
    var neg = negocioDe(tipoId);
    if (!neg) return { motivo: 'noexiste', razon: 'No tienes ese negocio.' };
    if ((neg.nivel || 1) >= NIVELES_NEGOCIO.length) {
      return { motivo: 'maximo', razon: 'Ya está en el nivel más alto.' };
    }
    var costo = costoDeSubirNivel(tipoId);
    if (dineroDisponible() < costo) {
      return { motivo: 'dinero', razon: 'Te faltan Q' +
               Math.ceil(costo - dineroDisponible()) + '.' };
    }
    return null;
  }

  function subirNivelNegocio(tipoId) {
    var falta = faltaParaSubirNivel(tipoId);
    if (falta) return { ok: false, razon: falta.razon, motivo: falta.motivo };
    var costo = costoDeSubirNivel(tipoId);
    var neg = negocioDe(tipoId);
    var resto = cobrarDeCuentas(costo);
    if (resto > 0.01) {
      estado.deudaHogar = redondear(estado.deudaHogar + resto);
      return { ok: false, razon: 'No alcanzó.' };
    }
    neg.nivel = (neg.nivel || 1) + 1;
    guardar();
    return { ok: true, nivel: neg.nivel, escalon: nivelDeNegocio(neg), costo: costo };
  }

  function faltaParaContratar(tipoId, tipoEmpleado) {
    var neg = negocioDe(tipoId);
    if (!neg) return { motivo: 'noexiste', razon: 'No tienes ese negocio.' };
    if (!PLANILLA[tipoEmpleado]) {
      return { motivo: 'noexiste', razon: 'Ese contrato no existe.' };
    }
    /* Una de las plazas es la del dueno, asi que solo se contrata para las
     * demas. Un puesto de dulces con una sola plaza no admite a nadie: es la
     * forma honesta de decir que ese negocio no crece. */
    if (neg.empleados.length >= plazasDe(neg) - 1) {
      return { motivo: 'plazas', razon: 'Ya no cabe nadie más aquí.' };
    }
    if (empleadosTotales() >= techoEmpleados()) {
      return { motivo: 'techo', razon: 'Con lo que llevas estudiado puedes administrar ' +
               techoEmpleados() + '.' };
    }
    /* Y hay que poder pagarle el primer mes. Contratar sin tener con que
     * pagar la planilla es la forma mas rapida de cerrar un negocio, y el
     * juego no va a dejar que pase sin avisar. */
    var costo = costoDeEmpleado(tipoEmpleado);
    if (dineroDisponible() < costo) {
      return { motivo: 'dinero',
               razon: 'No te alcanza para el primer mes: son Q' + costo + '.' };
    }
    return null;
  }

  function contratar(tipoId, tipoEmpleado) {
    var falta = faltaParaContratar(tipoId, tipoEmpleado);
    if (falta) return { ok: false, razon: falta.razon, motivo: falta.motivo };
    var neg = negocioDe(tipoId);
    neg.empleados.push({ tipo: tipoEmpleado, meses: 0 });
    guardar();
    return { ok: true, costo: costoDeEmpleado(tipoEmpleado), tipo: tipoEmpleado };
  }

  /* Lo que cuesta despedir a alguien.
   *
   * Al informal, nada. Al formal hay que indemnizarlo, y ese es el otro lado
   * de la leccion: el contrato que protege al trabajador es el mismo que le
   * cuesta al patron deshacerse de el. Un sueldo por ano trabajado, con un
   * ano de piso. */
  function indemnizacionDe(emp) {
    if (!emp || emp.tipo !== 'formal') return 0;
    var p = PLANILLA.formal;
    var anios = Math.max(1, Math.round((emp.meses || 0) / 12));
    return Math.round(p.sueldo * anios);
  }

  function despedir(tipoId, indice) {
    var neg = negocioDe(tipoId);
    if (!neg || !neg.empleados[indice]) return { ok: false, razon: 'No está.' };
    var emp = neg.empleados[indice];
    var indem = indemnizacionDe(emp);
    if (indem > 0) {
      if (dineroDisponible() < indem) {
        return { ok: false, motivo: 'dinero',
                 razon: 'La indemnización son Q' + indem + ' y no los tienes.' };
      }
      var resto = cobrarDeCuentas(indem);
      if (resto > 0.01) estado.deudaHogar = redondear(estado.deudaHogar + resto);
    }
    neg.empleados.splice(indice, 1);
    guardar();
    return { ok: true, indemnizacion: indem, tipo: emp.tipo };
  }

  /* Lo que se ha invertido en un negocio: la apertura mas cada nivel. */
  function invertidoEn(neg) {
    var t = tipoDeNegocio(neg.tipoId);
    if (!t) return 0;
    var total = t.costoApertura;
    for (var i = 1; i < (neg.nivel || 1) && i < NIVELES_NEGOCIO.length; i++) {
      total += Math.round(t.costoApertura * NIVELES_NEGOCIO[i].costoRelativo);
    }
    return total;
  }

  /* Lo que le quedaria de traspasar un negocio, ya descontadas las
   * indemnizaciones. Puede salir negativo, y ver ese numero antes de aceptar
   * es justo la leccion: salirse de un negocio tambien cuesta. */
  function valorDeTraspaso(tipoId) {
    var neg = negocioDe(tipoId);
    if (!neg) return 0;
    var indem = 0;
    for (var i = 0; i < neg.empleados.length; i++) {
      indem += indemnizacionDe(neg.empleados[i]);
    }
    return Math.round(invertidoEn(neg) * TRASPASO_RECUPERA) - indem;
  }

  function cerrarNegocio(tipoId) {
    var neg = negocioDe(tipoId);
    if (!neg) return { ok: false, razon: 'No tienes ese negocio.' };
    var vale = valorDeTraspaso(tipoId);
    if (vale < 0 && dineroDisponible() < -vale) {
      return { ok: false, motivo: 'dinero',
               razon: 'Cerrarlo cuesta Q' + (-vale) + ' de indemnizaciones y no los tienes.' };
    }
    if (vale >= 0) {
      if (estado.monetaria !== null) estado.monetaria = redondear(estado.monetaria + vale);
      else estado.efectivo = redondear(estado.efectivo + vale);
    } else {
      var resto = cobrarDeCuentas(-vale);
      if (resto > 0.01) estado.deudaHogar = redondear(estado.deudaHogar + resto);
    }
    // Y se le sueltan las jornadas que tuviera puestas
    for (var i = 0; i < estado.espacios.length; i++) {
      if (negocioDeEspacio(estado.espacios[i]) === tipoId) estado.espacios[i] = '';
    }
    var fuera = buscarPorId(TIPOS_NEGOCIO, tipoId);
    estado.negocios = negociosAbiertos().filter(function (n) { return n.tipoId !== tipoId; });
    guardar();
    return { ok: true, recupera: vale, tipo: fuera };
  }

  /* Quebrar. Si tiene niveles se cae uno; si estaba en el primero, se cierra
   * y no se recupera nada. Eso es quebrar y no traspasar. */
  function quebrarNegocio(neg) {
    var t = tipoDeNegocio(neg.tipoId);
    if ((neg.nivel || 1) > 1) {
      neg.nivel--;
      return { tipo: t, cerro: false, escalon: nivelDeNegocio(neg) };
    }
    for (var i = 0; i < estado.espacios.length; i++) {
      if (negocioDeEspacio(estado.espacios[i]) === neg.tipoId) estado.espacios[i] = '';
    }
    estado.negocios = negociosAbiertos().filter(function (n) { return n !== neg; });
    return { tipo: t, cerro: true };
  }

  // ---------- consultas ----------

  function patrimonio() {
    var activo = estado.efectivo + (estado.monetaria || 0) + (estado.ahorro || 0) +
                 (estado.plazo ? estado.plazo.monto : 0) +
                 (estado.pension ? estado.pension.saldo : 0) +
                 (estado.casa ? estado.casa.valor : 0) +
                 (estado.migracion ? estado.migracion.ahorroDolares * CONFIG.tipoCambio : 0);
    return activo - deudaTotal();
  }

  function deudaTotal() {
    var d = estado.deudaHogar;
    for (var i = 0; i < estado.prestamos.length; i++) d += estado.prestamos[i].saldo;
    if (estado.tarjeta) d += estado.tarjeta.saldo;
    if (estado.hipoteca) d += estado.hipoteca.saldo;
    return redondear(d);
  }

  function estaFuera() { return !!estado.migracion; }

  function trabajoActual() {
    return estado.empleo ? buscarPorId(TRABAJOS, estado.empleo.id) : null;
  }

  function multiplicadorMercado(idTrabajo) {
    var carrera = CARRERA_DE_EMPLEO[idTrabajo];
    if (!carrera) return 1;
    var d = estado.mercado[carrera];
    if (d === undefined) return 1;
    return MERCADO.multiplicadorMinimo +
           (MERCADO.multiplicadorMaximo - MERCADO.multiplicadorMinimo) * d;
  }

  /* Lo que se ganaria trabajando el mes completo. Los trabajitos de nino no
   * tienen sueldo mensual, tienen pago por jornada: su "mes completo" son las
   * ocho jornadas. */
  function salarioEsperado(trabajo, formal) {
    var mult = CONFIG.dificultad[estado.dificultad].multiplicadorSalario;
    var mensual = trabajo.pagoPorJornada
      ? trabajo.pagoPorJornada * CONFIG.jornadasPorMes
      : trabajo.salarioBase;
    var base = mensual * mult * multiplicadorMercado(trabajo.id);
    if (!formal) base = base * (1 + CONFIG.primaInformalidad);
    var anios = (estado.empleo && estado.empleo.id === trabajo.id)
      ? Math.floor(estado.empleo.mesesEnPuesto / 12) : 0;
    return base * (1 + anios * AUMENTO_POR_ANIO_EXPERIENCIA);
  }

  function ingresoMensualActual() {
    var t = trabajoActual();
    return t ? salarioEsperado(t, estado.empleo.formal) : 0;
  }

  function nivelIndice(nivel) { return NIVELES_EDUCATIVOS.indexOf(nivel); }

  function puedeAplicar(trabajo) {
    if (trabajo.edadMinima && estado.edad < trabajo.edadMinima) {
      return { ok: false, motivo: 'edad',
               razon: 'Nadie te contrata antes de los ' + trabajo.edadMinima + '.' };
    }
    if (nivelIndice(estado.educacion) < nivelIndice(trabajo.requisito)) {
      return { ok: false, motivo: 'nivel', razon: 'Necesitas nivel ' + trabajo.requisito + '.' };
    }
    if (trabajo.capitalRequerido && patrimonio() < trabajo.capitalRequerido) {
      return { ok: false, motivo: 'capital',
               razon: 'Necesitas Q' + trabajo.capitalRequerido.toLocaleString() + ' de capital.' };
    }
    return { ok: true };
  }

  function gastoMensualVivienda() {
    var extra = 0;
    for (var i = 0; i < estado.cargosRecurrentes.length; i++) extra += estado.cargosRecurrentes[i].monto;

    // Viviendo fuera del país los gastos son otros y van en dólares
    if (estado.migracion) return MIGRACION.costoVidaDolares * CONFIG.tipoCambio + extra;

    // Con casa propia ya no pagas renta, pero sí mantenimiento
    if (estado.casa) {
      var c = buscarPorId(CASAS, estado.casa.id);
      return c.serviciosComida + c.personal + c.mantenimiento + extra;
    }

    /* Siendo menor de edad y viviendo en tu casa, el gasto de la casa no es
     * tuyo: lo unico que sale de tu bolsa es el pasaje y la refaccion. Al
     * cumplir los 18 se te cae encima el gasto completo de golpe, y ese golpe
     * es la mitad de la leccion. */
    if (esMenor() && estado.vivienda === 'familiar') {
      return CONFIG.menor.gastoPersonal + extra;
    }

    var v = CONFIG.vivienda[estado.vivienda];
    // El aporte a la casa familiar depende del origen del personaje
    var renta = estado.vivienda === 'familiar'
      ? (estado.aporteCasa !== undefined ? estado.aporteCasa : v.renta)
      : v.renta;
    return renta + v.serviciosComida + v.personal + extra;
  }

  /* Que parte del sueldo cobras por las jornadas que trabajaste.
   *
   * Los trabajitos de nino se pagan por jornada, o sea que la proporcion es
   * lineal: dos jornadas es exactamente el doble que una. Un empleo de verdad
   * no funciona asi (medio mes de trabajo paga menos de medio sueldo), y esa
   * diferencia esta en la tabla de CONFIG. */
  function proporcionPago(jornadas, trabajo) {
    if (jornadas <= 0) return 0;
    if (trabajo && trabajo.pagoPorJornada) return jornadas / CONFIG.jornadasPorMes;
    return CONFIG.pagoPorJornadasTrabajadas[jornadas] || 0;
  }

  /* Que clase de jornada es esta casilla.
   *
   * Una casilla puede decir 'trabajo', 'estudio', 'descanso', 'minijuego' o
   * 'negocio:dulces'. Las de negocio llevan pegado a que negocio van, porque
   * el jugador puede tener varios y repartirse entre ellos. Esta funcion es la
   * unica parte del motor que sabe de ese dos puntos. */
  function tipoDeEspacio(v) {
    if (!v) return '';
    var c = String(v).indexOf(':');
    return c === -1 ? String(v) : String(v).slice(0, c);
  }
  function negocioDeEspacio(v) {
    var c = String(v || '').indexOf(':');
    return c === -1 ? null : String(v).slice(c + 1);
  }

  /* Cuantas casillas de un tipo.
   *
   * Sin dos puntos cuenta por clase: espaciosUsados('negocio') son todas las
   * jornadas de negocio, de cualquiera. Con dos puntos cuenta exacto:
   * espaciosUsados('negocio:dulces') son solo las de ese. */
  function espaciosUsados(tipo) {
    var exacto = String(tipo).indexOf(':') !== -1;
    var n = 0;
    for (var i = 0; i < estado.espacios.length; i++) {
      var v = estado.espacios[i];
      if (exacto ? v === tipo : tipoDeEspacio(v) === tipo) n++;
    }
    return n;
  }
  function espaciosLibres() { return espaciosUsados(''); }

  function costoMensualEstudio() {
    if (!estado.estudio) return 0;
    var c = buscarPorId(CARRERAS, estado.estudio.carreraId);
    if (!c) return 0;
    var anual = estado.estudio.privada ? c.costoAnualPrivado : c.costoAnualPublico;
    return anual / 12;
  }

  function tramoPuntaje() {
    for (var i = 0; i < PUNTAJE.tramos.length; i++) {
      var t = PUNTAJE.tramos[i];
      if (estado.puntaje >= t.min && estado.puntaje < t.hasta) return t;
    }
    return PUNTAJE.tramos[0];
  }

  function tieneFiador() { return estado.reputacion >= FIADOR.umbralParaConseguirFiador; }

  /* Lo que el banco cobra al mes por tener la cuenta monetaria abierta.
   *
   * Cero si no la tiene. Cero tambien si su sueldo lo deposita una empresa: al
   * banco le interesa la planilla y no le cobra manejo a quien la trae. El que
   * paga es justo el que abrio la cuenta sin necesitarla. */
  function manejoDeCuenta() {
    if (!estado || estado.monetaria === null) return 0;
    var p = CONFIG.productos.monetaria;
    if (!p.manejoMensual) return 0;
    var conPlanilla = !!(estado.empleo && estado.empleo.formal);
    if (p.manejoGratisConPlanilla && conPlanilla) return 0;
    return p.manejoMensual;
  }

  function tasaAhorroVigente() {
    for (var i = 0; i < estado.promosActivas.length; i++) {
      var e = estado.promosActivas[i].efecto;
      if (e && e.tasaAhorroTemporal) return e.tasaAhorroTemporal;
    }
    return CONFIG.productos.ahorro.tasaAnual;
  }

  // ---------- acciones del jugador ----------

  /* Asignar una jornada. Devuelve false si el colegio ya la tenia tomada.
   *
   * Esto SI es una regla del juego y no una traba de la ruta: en basicos no se
   * puede sacar al chico del instituto para mandarlo a trabajar, y en
   * diversificado la jornada que eligio esta ocupada. Lo que queda libre es la
   * otra jornada, y ahi si decide el jugador. */
  function asignarEspacio(i, tipo) {
    if (espacioBloqueado(i)) return false;
    /* Y tampoco se le pueden meter jornadas extra a un colegio de jornada:
     * basicos y diversificado duran los anios que duran, no se aceleran
     * estudiando por la tarde. La universidad si: ahi no hay jornada. */
    if (tipo === 'estudio' && estado.estudio && estado.estudio.jornada) return false;
    estado.espacios[i] = tipo;
    return true;
  }
  function limpiarEspacios() {
    estado.espacios = espaciosVacios();
    aplicarHorarioEstudio();
  }

  function tomarTrabajo(id, formal) {
    estado.empleo = { id: id, formal: !!formal, mesesEnPuesto: 0 };
  }
  function renunciar() { estado.empleo = null; }

  function inscribirse(carreraId, privada, jornada) {
    var c = buscarPorId(CARRERAS, carreraId);
    if (!c) return { ok: false, razon: 'Esa carrera no existe.' };
    if (nivelIndice(estado.educacion) < nivelIndice(c.requiere)) {
      return { ok: false, razon: 'Primero necesitas nivel ' + c.requiere + '.' };
    }
    if (nivelIndice(estado.educacion) >= nivelIndice(c.nivelQueOtorga)) {
      return { ok: false, razon: 'Ya tienes ese nivel o uno mayor.' };
    }
    /* La jornada sale del horario de la carrera: basicos siempre por la manana
     * (es como funciona el instituto), diversificado la que elija el jugador, y
     * la universidad ninguna, porque ahi reparte libre. */
    var j = c.horario === 'fijo' ? 'am'
          : c.horario === 'jornada' ? (jornada === 'pm' ? 'pm' : 'am')
          : null;
    estado.estudio = { carreraId: carreraId, mesesAvanzados: 0, privada: !!privada, jornada: j };
    estado.decisionEstudio = 'si';
    aplicarHorarioEstudio();
    return { ok: true };
  }

  /* La primera decision del juego, y la unica que se vuelve a preguntar cada
   * vez que el jugador se gradua: seguir estudiando o ponerse a trabajar.
   *
   * Decir que no NO cierra la puerta: la pestaña de Estudio sigue ahi y puede
   * inscribirse el mes siguiente. Lo que hace es dejar que el juego arranque
   * sin obligarlo a estudiar. */
  function decidirEstudio(respuesta) {
    estado.decisionEstudio = respuesta === 'si' ? 'si' : 'no';
    guardar();
    return estado.decisionEstudio;
  }

  function abandonarEstudio() {
    estado.estudio = null;
    estado.decisionEstudio = 'no';
    // Las casillas que tenia tomadas el colegio quedan libres
    for (var i = 0; i < estado.espacios.length; i++) {
      if (estado.espacios[i] === 'estudio') estado.espacios[i] = '';
    }
  }

  /* El minimo para abrir una cuenta.
   *
   * Un menor de edad abre cuenta con un adulto y con mucho menos dinero: las
   * cuentas infantiles de los bancos guatemaltecos arrancan en Q25 o Q50. Sin
   * esto el tutorial le pedia Q200 a un chico que gana Q40 al mes. */
  function aperturaMinima(tipo) {
    var p = CONFIG.productos[tipo];
    if (!p) return 0;
    return (esMenor() && p.aperturaMinimaMenor !== undefined)
      ? p.aperturaMinimaMenor : p.aperturaMinima;
  }

  function abrirCuenta(tipo, monto) {
    var p = CONFIG.productos[tipo];
    var minimo = aperturaMinima(tipo);
    if (monto < minimo) return { ok: false, razon: 'El mínimo de apertura es Q' + minimo + '.' };
    if (monto > estado.efectivo) return { ok: false, razon: 'No tienes ese efectivo.' };
    estado.efectivo -= monto;
    estado[tipo] = monto;
    return { ok: true };
  }

  function mover(desde, hacia, monto) {
    if (!(monto > 0)) return { ok: false, razon: 'Monto inválido.' };
    var origen = desde === 'efectivo' ? estado.efectivo : estado[desde];
    if (origen === null || origen === undefined) return { ok: false, razon: 'Esa cuenta no existe.' };
    if (monto > origen) return { ok: false, razon: 'Saldo insuficiente.' };
    if (hacia !== 'efectivo' && (estado[hacia] === null || estado[hacia] === undefined)) {
      return { ok: false, razon: 'Esa cuenta no existe.' };
    }
    if (desde === 'efectivo') estado.efectivo -= monto; else estado[desde] -= monto;
    if (hacia === 'efectivo') estado.efectivo += monto; else estado[hacia] += monto;
    return { ok: true };
  }

  function mudarse(id) {
    var v = CONFIG.vivienda[id];
    if (ingresoMensualActual() < v.requisitoIngreso) {
      return { ok: false, razon: 'Necesitas comprobar ingresos de Q' + v.requisitoIngreso.toLocaleString() + ' al mes.' };
    }
    estado.vivienda = id;
    return { ok: true };
  }

  // ---------- depósito a plazo ----------

  function abrirPlazo(monto) {
    var p = CONFIG.productos.plazo;
    if (estado.plazo) return { ok: false, razon: 'Ya tienes un depósito a plazo abierto.' };
    if (monto < p.aperturaMinima) return { ok: false, razon: 'El mínimo es Q' + p.aperturaMinima.toLocaleString() + '.' };
    var fuente = estado.ahorro !== null && estado.ahorro >= monto ? 'ahorro'
               : (estado.monetaria !== null && estado.monetaria >= monto ? 'monetaria' : null);
    if (!fuente) return { ok: false, razon: 'No tienes ese saldo en tus cuentas.' };
    estado[fuente] -= monto;
    var tasa = p.tasaAnual;
    for (var i = 0; i < estado.promosActivas.length; i++) {
      var e = estado.promosActivas[i].efecto;
      if (e && e.tasaPlazoTemporal) tasa = e.tasaPlazoTemporal;
    }
    estado.plazo = { monto: monto, mesesRestantes: 12, tasa: tasa, ganado: 0 };
    return { ok: true };
  }

  function romperPlazo() {
    if (!estado.plazo) return { ok: false, razon: 'No tienes depósito a plazo.' };
    var devuelto = estado.plazo.monto;
    var perdido = estado.plazo.ganado;
    var destino = estado.ahorro !== null ? 'ahorro' : (estado.monetaria !== null ? 'monetaria' : 'efectivo');
    if (destino === 'efectivo') estado.efectivo += devuelto; else estado[destino] += devuelto;
    estado.plazo = null;
    return { ok: true, perdido: redondear(perdido) };
  }

  // ---------- crédito ----------

  function cuotaMensual(monto, tasaMensual, meses) {
    if (tasaMensual <= 0) return monto / meses;
    return monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -meses));
  }

  function montoMaximoPersonal() {
    var ing = ingresoMensualActual();
    if (ing <= 0) return 0;
    return CREDITOS.personal.montoPorPuntaje(estado.puntaje, ing);
  }

  function requisitoPrestamo() {
    if (!estado.empleo) return { ok: false, razon: 'Sin trabajo el banco no tiene cómo evaluarte.' };
    if (!estado.empleo.formal) {
      return { ok: false, razon: 'Tu empleo es informal, así que no puedes comprobar ingresos.' };
    }
    if (estado.monetaria === null) return { ok: false, razon: 'Necesitas una cuenta en el banco.' };
    if (estado.puntaje < CREDITOS.personal.exigeFiadorBajo) {
      if (tieneFiador()) return { ok: true, conFiador: true };
      return { ok: false, necesitaGarantia: true,
               razon: 'Tu historial es corto, así que te piden fiador o garantía. Todavía nadie te firma.' };
    }
    return { ok: true };
  }

  function pedirPrestamo(monto, meses, conGarantia) {
    var req = requisitoPrestamo();
    if (!req.ok && !(conGarantia && req.necesitaGarantia)) return { ok: false, razon: req.razon };
    var maximo = montoMaximoPersonal();
    if (conGarantia) maximo = Math.max(maximo, monto); // la garantia respalda el monto
    if (monto < CREDITOS.personal.montoMinimo) {
      return { ok: false, razon: 'El mínimo es Q' + CREDITOS.personal.montoMinimo.toLocaleString() + '.' };
    }
    if (monto > maximo) {
      return { ok: false, razon: 'Con tu historial el máximo es Q' + maximo.toLocaleString() + '.' };
    }
    var garantia = 0;
    if (conGarantia) {
      garantia = monto * FIADOR.garantia.porcentajeDelPrestamo;
      if (estado.ahorro === null || estado.ahorro < garantia) {
        return { ok: false, razon: 'Para la garantía necesitas Q' + Math.round(garantia).toLocaleString() + ' en tu ahorro.' };
      }
      estado.ahorro -= garantia;
    }
    var tm = CREDITOS.personal.tasaAnual / 12;
    estado.prestamos.push({
      tipo: 'personal', saldo: monto, tasaMensual: tm, mesesRestantes: meses,
      cuota: redondear(cuotaMensual(monto, tm, meses)), atrasos: 0, garantia: garantia
    });
    if (estado.monetaria !== null) estado.monetaria += monto; else estado.efectivo += monto;
    return { ok: true, cuota: redondear(cuotaMensual(monto, tm, meses)) };
  }

  function pedirInformal(monto, meses) {
    var c = CREDITOS.informal;
    if (monto < c.montoMinimo || monto > c.montoMaximo) {
      return { ok: false, razon: 'El prestamista da entre Q' + c.montoMinimo + ' y Q' + c.montoMaximo + '.' };
    }
    estado.prestamos.push({
      tipo: 'informal', saldo: monto, tasaMensual: c.tasaMensual, mesesRestantes: meses,
      cuota: redondear(cuotaMensual(monto, c.tasaMensual, meses)), atrasos: 0, garantia: 0
    });
    estado.efectivo += monto;
    estado.puntaje = limitar(estado.puntaje + PUNTAJE.porUsarPrestamista, 0, PUNTAJE.maximo);
    return { ok: true, cuota: redondear(cuotaMensual(monto, c.tasaMensual, meses)) };
  }

  function limiteTarjeta() {
    return CREDITOS.tarjeta.limitePorPuntaje(estado.puntaje, ingresoMensualActual());
  }

  function solicitarTarjeta() {
    if (estado.tarjeta) return { ok: false, razon: 'Ya tienes tarjeta.' };
    if (estado.puntaje < CREDITOS.tarjeta.puntajeMinimo) {
      return { ok: false, razon: 'Necesitas historial de crédito. Empieza con un préstamo pequeño.' };
    }
    var lim = limiteTarjeta();
    if (lim <= 0) return { ok: false, razon: 'Con tus ingresos actuales no te aprueban límite.' };
    estado.tarjeta = { saldo: 0, limite: lim, pagarMinimo: true };
    return { ok: true, limite: lim };
  }

  function gastarConTarjeta(monto) {
    if (!estado.tarjeta) return { ok: false, razon: 'No tienes tarjeta.' };
    if (estado.tarjeta.saldo + monto > estado.tarjeta.limite) {
      return { ok: false, razon: 'Pasas tu límite de Q' + estado.tarjeta.limite.toLocaleString() + '.' };
    }
    estado.tarjeta.saldo += monto;
    if (estado.monetaria !== null) estado.monetaria += monto; else estado.efectivo += monto;
    return { ok: true };
  }

  function pagarTarjeta(monto) {
    if (!estado.tarjeta) return { ok: false, razon: 'No tienes tarjeta.' };
    var pago = Math.min(monto, estado.tarjeta.saldo);
    var r = cobrarDeCuentas(pago);
    if (r > 0) return { ok: false, razon: 'No te alcanza.' };
    estado.tarjeta.saldo -= pago;
    return { ok: true, pagado: redondear(pago) };
  }

  function abonarPrestamo(indice, monto) {
    var p = estado.prestamos[indice];
    if (!p) return { ok: false, razon: 'Ese préstamo no existe.' };
    var pago = Math.min(monto, p.saldo);
    var r = cobrarDeCuentas(pago);
    if (r > 0) return { ok: false, razon: 'No te alcanza.' };
    p.saldo -= pago;
    if (p.saldo < 0.5) liquidar(indice);
    return { ok: true };
  }

  function liquidar(indice) {
    var p = estado.prestamos[indice];
    if (p.garantia > 0 && estado.ahorro !== null) estado.ahorro += p.garantia;
    if (p.tipo === 'personal') {
      estado.puntaje = limitar(estado.puntaje + PUNTAJE.porCreditoLiquidado, 0, PUNTAJE.maximo);
    }
    estado.prestamos.splice(indice, 1);
  }

  // Cobra de monetaria, luego efectivo, luego ahorro. Devuelve lo que no se pudo cobrar.
  function cobrarDeCuentas(monto) {
    var porPagar = monto;
    var orden = ['monetaria', 'efectivo', 'ahorro'];
    for (var i = 0; i < orden.length && porPagar > 0.001; i++) {
      var c = orden[i];
      var disp = c === 'efectivo' ? estado.efectivo : estado[c];
      if (disp === null || disp <= 0) continue;
      var toma = Math.min(disp, porPagar);
      if (c === 'efectivo') estado.efectivo -= toma; else estado[c] -= toma;
      porPagar -= toma;
    }
    return porPagar;
  }

  // ---------- hipoteca ----------

  function engancheDe(casa) {
    return casa.precio * (casa.apoyoFHA ? HIPOTECA.engancheFHA : HIPOTECA.engancheNormal);
  }

  function cierreDe(casa) { return casa.precio * HIPOTECA.gastosDeCierre; }

  function efectivoParaEnganche(casa) { return engancheDe(casa) + cierreDe(casa); }

  function cuotaHipoteca(casa, anios) {
    var prestado = casa.precio - engancheDe(casa);
    return cuotaMensual(prestado, HIPOTECA.tasaAnual / 12, anios * 12);
  }

  function requisitoHipoteca(casa, anios) {
    if (estado.casa) return { ok: false, razon: 'Ya tienes casa propia.' };
    if (estado.migracion) return { ok: false, razon: 'No puedes comprar aquí mientras vives fuera.' };
    if (!estado.empleo || !estado.empleo.formal) {
      return { ok: false, razon: 'Necesitas empleo formal para comprobar ingresos.' };
    }
    if (estado.puntaje < HIPOTECA.puntajeMinimo) {
      return { ok: false, razon: 'Necesitas al menos ' + HIPOTECA.puntajeMinimo +
                                 ' de historial. Tienes ' + Math.round(estado.puntaje) + '.' };
    }
    var cuota = cuotaHipoteca(casa, anios);
    var ingreso = ingresoMensualActual();
    if (cuota > ingreso * HIPOTECA.cargaMaximaIngreso) {
      return { ok: false, motivo: 'carga',
               razon: 'La cuota es Q' + Math.round(cuota).toLocaleString() +
                      ' y no puede pasar del ' + Math.round(HIPOTECA.cargaMaximaIngreso * 100) +
                      '% de tu ingreso.' };
    }
    var necesita = efectivoParaEnganche(casa);
    var liquido = (estado.ahorro || 0) + (estado.monetaria || 0) + estado.efectivo;
    if (liquido < necesita) {
      return { ok: false, motivo: 'enganche',
               razon: 'Te faltan Q' + Math.round(necesita - liquido).toLocaleString() +
                      ' para el enganche y los gastos de cierre.' };
    }
    return { ok: true, cuota: cuota, enganche: engancheDe(casa), cierre: cierreDe(casa) };
  }

  function comprarCasa(casaId, anios) {
    var casa = buscarPorId(CASAS, casaId);
    if (!casa) return { ok: false, razon: 'Esa casa no existe.' };
    var chk = requisitoHipoteca(casa, anios);
    if (!chk.ok) return chk;

    cobrarDeCuentas(efectivoParaEnganche(casa));
    var prestado = casa.precio - engancheDe(casa);
    estado.hipoteca = {
      saldo: prestado, cuota: redondear(chk.cuota),
      tasaMensual: HIPOTECA.tasaAnual / 12,
      mesesRestantes: anios * 12, atrasos: 0, anios: anios,
      totalPagado: 0
    };
    estado.casa = { id: casa.id, valor: casa.precio, compradaAEdad: estado.edad };
    estado.vivienda = 'propia';
    return { ok: true, cuota: redondear(chk.cuota), enganche: engancheDe(casa),
             prestado: prestado, totalAPagar: chk.cuota * anios * 12 };
  }

  // ---------- pensión ----------

  function abrirPension(aporte) {
    if (estado.pension) return { ok: false, razon: 'Ya tienes plan de pensiones.' };
    if (aporte < PENSION.aporteMinimo) {
      return { ok: false, razon: 'El aporte mínimo es Q' + PENSION.aporteMinimo + ' al mes.' };
    }
    estado.pension = { saldo: 0, aporteMensual: aporte, aportado: 0 };
    return { ok: true };
  }

  function cambiarAportePension(aporte) {
    if (!estado.pension) return { ok: false, razon: 'No tienes plan de pensiones.' };
    estado.pension.aporteMensual = Math.max(0, aporte);
    return { ok: true };
  }

  function retirarPension() {
    if (!estado.pension) return { ok: false, razon: 'No tienes plan de pensiones.' };
    var anticipado = estado.edad < PENSION.edadRetiro;
    var ganado = estado.pension.saldo - estado.pension.aportado;
    var castigo = anticipado ? Math.max(0, ganado) * PENSION.penalizacionRetiroAnticipado : 0;
    var recibe = redondear(estado.pension.saldo - castigo);
    var destino = estado.ahorro !== null ? 'ahorro' : (estado.monetaria !== null ? 'monetaria' : 'efectivo');
    if (destino === 'efectivo') estado.efectivo += recibe; else estado[destino] += recibe;
    estado.pension = null;
    return { ok: true, recibido: recibe, castigo: redondear(castigo), anticipado: anticipado };
  }

  // ---------- migración ----------

  function puedeMigrar() {
    if (estado.migracion) return { ok: false, razon: 'Ya estás fuera.' };
    if (estado.casa) return { ok: false, razon: 'Tienes casa e hipoteca aquí.' };
    if (estado.edad < MIGRACION.edadMinima) {
      return { ok: false, razon: 'Todavía estás muy joven para irte solo.' };
    }
    if (estado.edad > MIGRACION.edadMaxima) {
      return { ok: false, razon: 'Ya pasaste la edad en que la gente se va.' };
    }
    var liquido = (estado.ahorro || 0) + (estado.monetaria || 0) + estado.efectivo;
    if (liquido < MIGRACION.costoViaje) {
      return { ok: false, motivo: 'costo',
               razon: 'El viaje cuesta Q' + MIGRACION.costoViaje.toLocaleString() +
                      ' y te faltan Q' + Math.round(MIGRACION.costoViaje - liquido).toLocaleString() + '.' };
    }
    return { ok: true };
  }

  function migrar(empleoId, porcentajeEnvio, canal) {
    var chk = puedeMigrar();
    if (!chk.ok) return chk;
    var emp = buscarPorId(MIGRACION.empleos, empleoId);
    if (!emp) return { ok: false, razon: 'Ese trabajo no existe.' };
    if (nivelIndice(estado.educacion) < nivelIndice(emp.requisito)) {
      return { ok: false, razon: 'Para ese trabajo necesitas nivel ' + emp.requisito + '.' };
    }

    cobrarDeCuentas(MIGRACION.costoViaje);

    // No a todos les sale. Es parte del riesgo real de irse.
    if (Math.random() < MIGRACION.riesgoFracaso) {
      estado.empleo = null;
      return { ok: true, fracaso: true };
    }

    estado.empleo = null;
    estado.estudio = null;
    estado.migracion = {
      empleoId: empleoId, mesesFuera: 0,
      enviaPorcentaje: porcentajeEnvio, canal: canal || 'ventanilla',
      ahorroDolares: 0
    };
    return { ok: true, fracaso: false };
  }

  function cambiarEnvio(porcentaje, canal) {
    if (!estado.migracion) return { ok: false, razon: 'No estás fuera.' };
    estado.migracion.enviaPorcentaje = porcentaje;
    if (canal) estado.migracion.canal = canal;
    return { ok: true };
  }

  function regresar() {
    if (!estado.migracion) return { ok: false, razon: 'No estás fuera.' };
    if (estado.edad < MIGRACION.regreso.edadMinimaRegreso) {
      return { ok: false, razon: 'Acabas de llegar. Dale tiempo.' };
    }
    var traido = redondear(estado.migracion.ahorroDolares * CONFIG.tipoCambio);
    var meses = estado.migracion.mesesFuera;
    if (estado.monetaria !== null) estado.monetaria += traido; else estado.efectivo += traido;
    estado.puntaje = limitar(estado.puntaje * MIGRACION.regreso.penalizacionHistorial, 0, PUNTAJE.maximo);
    estado.migracion = null;
    estado.vivienda = 'cuarto';
    return { ok: true, traido: traido, meses: meses };
  }

  // ---------- resolución de un mes ----------

  function resolverMes(m) {
    var enfermedadMes = 0;
    // Lo que los negocios cobran este mes: renta, luz, planilla y multas. Se
    // junta aqui y se paga abajo con todo lo demas, para que si no alcanza
    // caiga en el mismo sitio que el resto de los gastos.
    var costoDeNegocios = 0;

    // --- energia ---
    var mej = efectosDeMejoras();
    for (var i = 0; i < estado.espacios.length; i++) {
      // 'negocio:dulces' gasta lo mismo que 'trabajo': atender tu propio
      // negocio cansa igual que atender el de otro
      var tipo = tipoDeEspacio(estado.espacios[i]);
      if (tipo && CONFIG.energia.porEspacio[tipo] !== undefined) {
        estado.energia += CONFIG.energia.porEspacio[tipo];
        // Una cama de verdad hace que el descanso rinda más
        if (tipo === 'descanso') estado.energia += mej.energiaExtra;
      }
    }
    estado.energia = limitar(estado.energia, 0, CONFIG.energia.maxima);

    // --- agotamiento antes del salario: un enfermo no rinde ---
    var espTrabajo = espaciosUsados('trabajo');
    if (estado.energia < CONFIG.energia.umbralRiesgo && !enGracia()) {
      var riesgo = 0.25 + 0.45 * (1 - estado.energia / CONFIG.energia.umbralRiesgo);
      if (Math.random() < riesgo) {
        m.enfermedad += CONFIG.energia.costoEnfermedad;
        enfermedadMes = CONFIG.energia.costoEnfermedad;
        m.enfermedadPendiente = (m.enfermedadPendiente || 0) + CONFIG.energia.costoEnfermedad;
        var perdidas = Math.ceil(espTrabajo / 2);
        espTrabajo -= perdidas;
        estado.energia = Math.min(CONFIG.energia.maxima, estado.energia + 40);
        m.eventos.push('Te enfermaste por agotamiento. Faltaste ' + perdidas +
          ' semana' + (perdidas === 1 ? '' : 's') + '.');
      }
    }

    // --- estudio ---
    var espEstudio = espaciosUsados('estudio');
    if (estado.estudio && espEstudio > 0) {
      var carrera = buscarPorId(CARRERAS, estado.estudio.carreraId);
      // Los útiles, los libros y el internet hacen rendir la jornada de estudio
      estado.estudio.mesesAvanzados +=
        espEstudio * (AVANCE_POR_JORNADA_ESTUDIO + mej.avanceEstudio);
      estado.totales.mesesEstudiando++;
      m.colegiatura += costoMensualEstudio();
      if (estado.estudio.mesesAvanzados >= carrera.mesesRequeridos) {
        estado.educacion = carrera.nivelQueOtorga;
        estado.carrerasTerminadas.push(carrera.id);
        m.eventos.push('Te graduaste de ' + carrera.nombre + '.');
        m.graduacion = carrera.id;
        estado.estudio = null;
        // Graduarse vuelve a abrir la pregunta: seguir estudiando o trabajar
        estado.decisionEstudio = null;
        for (var ce = 0; ce < estado.espacios.length; ce++) {
          if (estado.espacios[ce] === 'estudio') estado.espacios[ce] = '';
        }
      }
    }

    /* --- los negocios producen ---
     *
     * Aquí es donde el juego deja de ser un simulador de sueldo. Un negocio
     * produce con las jornadas que tenga adentro, y las de la gente contratada
     * cuentan igual que las del jugador: a partir de cierto punto lo que
     * trabaja es el negocio y no la persona.
     *
     * Se recorre al revés porque un negocio puede quebrar y salirse de la
     * lista en medio del recorrido.
     */
    var negs = negociosAbiertos();
    for (var ni = negs.length - 1; ni >= 0; ni--) {
      var neg = negs[ni];
      var tn = tipoDeNegocio(neg.tipoId);
      if (!tn) continue;

      neg.mesesAbierto = (neg.mesesAbierto || 0) + 1;
      for (var ei = 0; ei < neg.empleados.length; ei++) {
        neg.empleados[ei].meses = (neg.empleados[ei].meses || 0) + 1;
      }

      var pr = proyeccionDeNegocio(neg);

      /* El mes bueno y el mes malo: la venta varía, los costos NO. Ver eso
       * mes a mes es la lección de por qué un ingreso variable no sirve para
       * comprometer un gasto fijo. */
      var vende = 1 + azar(-NEGOCIO_VARIANZA, NEGOCIO_VARIANZA);
      var venta = redondear(pr.venta * vende);
      var bruto = redondear(venta * tn.margen);

      neg.ventaUltimoMes = venta;
      neg.gananciaUltimoMes = redondear(bruto - pr.costoMensual - pr.planilla);

      /* Se anota en bruto y los costos aparte, a propósito: el jugador tiene
       * que VER la planilla y la renta como renglones de gasto, no recibir un
       * neto ya digerido. Es la diferencia entre saber que ganó poco y saber
       * en qué se le fue. */
      m.negocioVenta = redondear((m.negocioVenta || 0) + venta);
      m.negocio = redondear((m.negocio || 0) + bruto);
      m.planilla = redondear((m.planilla || 0) + pr.planilla);
      m.mantenimiento = redondear((m.mantenimiento || 0) + pr.costoMensual);
      costoDeNegocios = redondear(costoDeNegocios + pr.costoMensual + pr.planilla);

      if (bruto > 0) {
        if (estado.monetaria !== null) estado.monetaria += bruto;
        else estado.efectivo += bruto;
        estado.totales.ingresos += bruto;
      }

      /* La gente se va, y sin contrato se va más seguido. */
      for (var ev = neg.empleados.length - 1; ev >= 0; ev--) {
        var pl = PLANILLA[neg.empleados[ev].tipo] || PLANILLA.informal;
        if (!enGracia() && Math.random() < pl.riesgoSeVa) {
          neg.empleados.splice(ev, 1);
          m.eventos.push('Se te fue una persona de ' + tn.nombre + '.');
        }
      }

      /* Y puede caer inspección sobre los que no tienen contrato. Es el
       * argumento honesto a favor de formalizar: la multa son tres sueldos. */
      for (var ins = 0; ins < neg.empleados.length; ins++) {
        var pi = PLANILLA[neg.empleados[ins].tipo] || PLANILLA.informal;
        if (!enGracia() && pi.riesgoInspeccion && Math.random() < pi.riesgoInspeccion) {
          var multa = pi.sueldo * pi.multaEnSueldos;
          m.imprevistos += multa;
          costoDeNegocios = redondear(costoDeNegocios + multa);
          m.eventos.push('Cayó inspección en ' + tn.nombre +
            ': Q' + multa + ' de multa por tener gente sin contrato.');
          break;
        }
      }

      /* Y el negocio puede quebrar. Sin esto, cualquier ganancia compuesta
       * cuarenta años se vuelve infinita y el juego deja de parecerse a la
       * vida. Se evita con colchón: tres meses de sus propios costos
       * guardados lo protegen, que es justo la lección. */
      var colchon = (estado.ahorro || 0) + (estado.monetaria || 0);
      var necesita = (pr.costoMensual + pr.planilla) * NEGOCIO_MESES_DE_COLCHON;
      if (!enGracia() && colchon < necesita && Math.random() < NEGOCIO_RIESGO_QUIEBRA) {
        var caida = quebrarNegocio(neg);
        m.quebro = neg.tipoId;
        m.eventos.push(caida.cerro
          ? 'Se te cayó ' + tn.nombre + '. No tenías con qué aguantar un mes malo.'
          : 'Se te cayó un nivel de ' + tn.nombre + '. No tenías colchón.');
      }
    }

    // --- la mesada, mientras seas menor y vivas en tu casa ---
    if (esMenor() && estado.mesada > 0 && !estado.migracion) {
      m.mesada = (m.mesada || 0) + estado.mesada;
      if (estado.monetaria !== null) estado.monetaria += estado.mesada;
      else estado.efectivo += estado.mesada;
    }

    // --- viviendo fuera: se gana en dólares y se manda a casa ---
    if (estado.migracion) {
      var g = estado.migracion;
      var empFuera = buscarPorId(MIGRACION.empleos, g.empleoId);
      g.mesesFuera++;
      var brutoUSD = empFuera.sueldoDolares *
                     (1 + azar(-empFuera.varianza, empFuera.varianza)) *
                     proporcionPago(Math.max(1, espTrabajo));
      var netoUSD = Math.max(0, brutoUSD - MIGRACION.costoVidaDolares);
      var envioUSD = netoUSD * g.enviaPorcentaje;
      var canal = MIGRACION.canales[g.canal] || MIGRACION.canales.ventanilla;
      var comisionQ = redondear(envioUSD * canal.comision * CONFIG.tipoCambio);
      var llegaQ = redondear(envioUSD * (1 - canal.comision) * CONFIG.tipoCambio);

      g.ahorroDolares += (netoUSD - envioUSD);
      m.enviado += llegaQ;
      m.comisionEnvio += comisionQ;
      estado.totalEnviado += llegaQ;
      estado.comisionesEnvio += comisionQ;
      if (envioUSD > 0) {
        m.eventos.push('Mandaste Q' + llegaQ.toFixed(2) + ' a tu familia. La comisión se quedó con Q' +
                       comisionQ.toFixed(2) + '.');
      }
      // Los gastos de allá y lo enviado ya salieron del sueldo en dólares.
      m.viviendaYaCubierta = true;
    }

    // --- salario ---
    var t = estado.migracion ? null : trabajoActual();
    if (t && espTrabajo > 0) {
      var bruto = salarioEsperado(t, estado.empleo.formal);
      var ruido = 1 + azar(-t.varianza, t.varianza);
      // Las herramientas —compradas en Mejoras o en una tarjeta de decisión—
      // pagan por cada jornada trabajada
      var extraHerramienta = bonoPorJornada() * espTrabajo;
      var pago = redondear(bruto * ruido * proporcionPago(espTrabajo, t) + extraHerramienta);
      m.salario += pago;
      estado.empleo.mesesEnPuesto++;
      if (estado.empleo.formal) {
        if (estado.mes === CONFIG.prestaciones.bono14Mes) {
          m.bono += redondear(bruto); m.eventos.push('Te pagaron el Bono 14.');
        } else if (estado.mes === CONFIG.prestaciones.aguinaldoMes1 ||
                   estado.mes === CONFIG.prestaciones.aguinaldoMes2) {
          m.bono += redondear(bruto / 2); m.eventos.push('Te pagaron media parte del aguinaldo.');
        }
      }
    }

    var entrada = m.salario + m.bono - (m.salarioYaAbonado || 0);
    m.salarioYaAbonado = m.salario + m.bono;
    if (entrada > 0) {
      if (estado.monetaria !== null) estado.monetaria += entrada; else estado.efectivo += entrada;
    }

    // --- remesa que recibes (solo si tu origen la trae y estás en el país) ---
    /* La remesa llega a la casa, no al chico: hasta los 18 la administran sus
     * papas. Antes le caia a un nino de 13 el equivalente a Q1,500 al mes y el
     * juego entero perdia sentido. */
    if (CONFIG.remesa.activa && estado.remesaActiva && !estado.migracion && !esMenor()) {
      estado.mesesParaRemesa--;
      if (estado.mesesParaRemesa <= 0) {
        var dolares = azarEntero(CONFIG.remesa.montoDolares[0], CONFIG.remesa.montoDolares[1]);
        var brutoR = dolares * CONFIG.tipoCambio;
        var via = estado.monetaria !== null ? 'banco' : 'ventanilla';
        var com = CONFIG.remesa.comisiones[via].comision;
        var neto = redondear(brutoR * (1 - com));
        m.remesa += neto;
        m.comisionRemesa += redondear(brutoR * com);
        estado.totales.comisionesRemesa += redondear(brutoR * com);
        m.eventos.push('Tu hermano mandó US$' + dolares + ' desde Estados Unidos.');
        if (via === 'ventanilla') {
          m.eventos.push('Sin cuenta la cobraste en ventanilla y te quitaron Q' +
            (brutoR * com).toFixed(2) + ' de comisión.');
        }
        if (via === 'banco') estado.monetaria += neto; else estado.efectivo += neto;
        estado.mesesParaRemesa = azarEntero(CONFIG.remesa.mesesEntreEnvios[0], CONFIG.remesa.mesesEntreEnvios[1]);
      }
    }

    // --- eventos de vida ---
    if (!enGracia()) resolverEventos(m);

    // --- cumplir la mayoria de edad ---
    if (estado.edad >= CONFIG.mayoriaDeEdad && !estado.vistos.cumplio18) {
      estado.vistos.cumplio18 = true;
      m.cumpleMayoria = true;
      if (estado.vivienda === 'familiar' && estado.aporteCasa > 0) {
        m.eventos.push('Cumpliste ' + CONFIG.mayoriaDeEdad +
          '. Desde este mes aportas Q' + estado.aporteCasa + ' al gasto de la casa.');
      }
    }

    // --- cuotas de crédito ---
    for (var k = estado.prestamos.length - 1; k >= 0; k--) {
      var p = estado.prestamos[k];
      var interes = p.saldo * p.tasaMensual;
      var cuota = Math.min(p.cuota, p.saldo + interes);
      var falto = cobrarDeCuentas(cuota);
      if (falto > 0.01) {
        // no alcanzo: mora
        p.saldo += interes;
        p.atrasos++;
        m.interesesPagados += redondear(interes);
        estado.puntaje = limitar(estado.puntaje +
          (p.atrasos >= 3 ? PUNTAJE.porMoraProlongada : PUNTAJE.porMora), 0, PUNTAJE.maximo);
        m.mora = true;
        m.eventos.push('No pudiste pagar la cuota de tu ' +
          (p.tipo === 'informal' ? 'préstamo del barrio' : 'préstamo') + '. Eso te pega en el historial.');
      } else {
        p.saldo = p.saldo + interes - cuota;
        p.mesesRestantes--;
        p.atrasos = 0;
        m.cuotasPagadas += redondear(cuota);
        m.interesesPagados += redondear(interes);
        if (p.tipo === 'personal') {
          estado.puntaje = limitar(estado.puntaje + PUNTAJE.porCuotaPagadaATiempo, 0, PUNTAJE.maximo);
        }
        if (p.saldo < 0.5 || p.mesesRestantes <= 0) {
          m.eventos.push('Terminaste de pagar tu ' + (p.tipo === 'informal' ? 'préstamo del barrio' : 'préstamo') + '.');
          liquidar(k);
        }
      }
      estado.totales.interesesPagados += redondear(interes);
    }

    // --- tarjeta de crédito ---
    if (estado.tarjeta && estado.tarjeta.saldo > 0) {
      var tasaT = CREDITOS.tarjeta.tasaAnual / 12;
      var intT = estado.tarjeta.saldo * tasaT;
      estado.tarjeta.saldo += intT;
      m.interesesPagados += redondear(intT);
      estado.totales.interesesPagados += redondear(intT);
      var minimo = Math.max(50, estado.tarjeta.saldo * CREDITOS.tarjeta.pagoMinimoPorcentaje);
      var aPagar = estado.tarjeta.pagarMinimo ? Math.min(minimo, estado.tarjeta.saldo) : estado.tarjeta.saldo;
      var faltoT = cobrarDeCuentas(aPagar);
      if (faltoT > 0.01) {
        estado.puntaje = limitar(estado.puntaje + PUNTAJE.porMora, 0, PUNTAJE.maximo);
        m.mora = true;
        m.eventos.push('No cubriste ni el pago mínimo de la tarjeta.');
      } else {
        estado.tarjeta.saldo -= aPagar;
        m.pagoTarjeta += redondear(aPagar);
        estado.puntaje = limitar(estado.puntaje + PUNTAJE.porMesConCreditoSano, 0, PUNTAJE.maximo);
      }
    }

    // --- cuota de la hipoteca ---
    if (estado.hipoteca) {
      var hi = estado.hipoteca;
      var intH = hi.saldo * hi.tasaMensual;
      var cuotaH = Math.min(hi.cuota, hi.saldo + intH);
      var faltoH = cobrarDeCuentas(cuotaH);
      if (faltoH > 0.01) {
        hi.saldo += intH;
        hi.atrasos++;
        m.interesesPagados += redondear(intH);
        estado.puntaje = limitar(estado.puntaje +
          (hi.atrasos >= 3 ? PUNTAJE.porMoraProlongada : PUNTAJE.porMora), 0, PUNTAJE.maximo);
        m.mora = true;
        m.eventos.push('No cubriste la cuota de la hipoteca. Con la casa de por medio, eso es grave.');
        if (hi.atrasos >= 12) {
          m.eventos.push('El banco ejecutó la hipoteca. Perdiste la casa y lo que habías pagado.');
          estado.casa = null; estado.hipoteca = null; estado.vivienda = 'cuarto';
          estado.puntaje = 0;
          m.embargo = true;
        }
      } else {
        hi.saldo = hi.saldo + intH - cuotaH;
        hi.mesesRestantes--;
        hi.atrasos = 0;
        hi.totalPagado += cuotaH;
        m.cuotaHipoteca += redondear(cuotaH);
        m.interesesPagados += redondear(intH);
        estado.puntaje = limitar(estado.puntaje + PUNTAJE.porCuotaPagadaATiempo * 0.6, 0, PUNTAJE.maximo);
        if (hi.saldo < 0.5 || hi.mesesRestantes <= 0) {
          m.eventos.push('¡Terminaste de pagar tu casa! Ya es completamente tuya.');
          m.hipotecaLiquidada = true;
          estado.hipoteca = null;
          estado.puntaje = limitar(estado.puntaje + 10, 0, PUNTAJE.maximo);
        }
      }
      estado.totales.interesesPagados += redondear(intH);
    }

    // --- la casa se aprecia ---
    if (estado.casa) {
      estado.casa.valor = redondear(estado.casa.valor * (1 + HIPOTECA.apreciacionAnual / 12));
    }

    // --- aporte a la pensión ---
    if (estado.pension) {
      var pe = estado.pension;
      if (pe.aporteMensual > 0) {
        var faltoP = cobrarDeCuentas(pe.aporteMensual);
        if (faltoP <= 0.01) {
          pe.saldo += pe.aporteMensual;
          pe.aportado += pe.aporteMensual;
          m.aportePension += pe.aporteMensual;
        }
      }
      var rend = pe.saldo * (PENSION.rendimientoAnual / 12);
      pe.saldo += rend;
      m.rendimientoPension += redondear(rend);
    }

    // --- gastos fijos, colegiatura, enfermedad y lo que se debía ---
    var gastoVivienda = m.viviendaYaCubierta ? 0 : gastoMensualVivienda();
    m.vivienda += gastoVivienda;
    var manejo = manejoDeCuenta();
    m.manejo += manejo;
    // El mantenimiento de lo que compró: gasolina, alquiler del puesto, internet
    var manteni = mej.costoMensual;
    m.mantenimiento = (m.mantenimiento || 0) + manteni;
    var porPagar = gastoVivienda + costoMensualEstudio() + estado.deudaHogar +
                   manejo + manteni + costoDeNegocios;
    if (m.enfermedadPendiente) { porPagar += m.enfermedadPendiente; m.enfermedadPendiente = 0; }
    estado.deudaHogar = 0;
    var resto = cobrarDeCuentas(porPagar);
    if (resto > 0.01) {
      estado.deudaHogar = redondear(resto);
      m.deudaHogar = estado.deudaHogar;
      m.eventos.push('No alcanzaste a cubrir Q' + resto.toFixed(2) + ' de tus gastos.');
    }

    // --- fuga y riesgo del efectivo ---
    if (estado.efectivo > 0) {
      var fuga = redondear(Math.min(estado.efectivo * CONFIG.efectivo.fugaMensual, CONFIG.efectivo.fugaMaxima));
      estado.efectivo -= fuga;
      m.fuga += fuga;
      estado.totales.fugaEfectivo += fuga;
    }
    if (estado.efectivo > 500 && !enGracia() && Math.random() < CONFIG.efectivo.probabilidadPerdida) {
      var perd = redondear(estado.efectivo * CONFIG.efectivo.perdidaPorcentaje);
      estado.efectivo -= perd;
      m.perdidaEfectivo += perd;
      m.eventos.push('Perdiste Q' + perd.toFixed(2) + ' del efectivo que tenías en casa.');
    }

    // --- intereses e ISR ---
    var brutos = 0;
    if (estado.monetaria > 0) brutos += estado.monetaria * (CONFIG.productos.monetaria.tasaAnual / 12);
    if (estado.ahorro > 0) brutos += estado.ahorro * (tasaAhorroVigente() / 12);
    if (estado.plazo) {
      var g = estado.plazo.monto * (estado.plazo.tasa / 12);
      estado.plazo.ganado += g;
      brutos += g;
      estado.plazo.mesesRestantes--;
      if (estado.plazo.mesesRestantes <= 0) {
        var total = estado.plazo.monto + estado.plazo.ganado;
        var dest = estado.ahorro !== null ? 'ahorro' : (estado.monetaria !== null ? 'monetaria' : 'efectivo');
        if (dest === 'efectivo') estado.efectivo += total; else estado[dest] += total;
        m.eventos.push('Venció tu depósito a plazo. Recibiste Q' + total.toFixed(2) + '.');
        estado.plazo = null;
      }
    }
    if (brutos > 0) {
      var isr = redondear(brutos * CONFIG.impuestoSobreIntereses);
      var neto2 = redondear(brutos - isr);
      m.intereses += neto2; m.isr += isr;
      estado.totales.interesesGanados += neto2;
      if (estado.ahorro !== null && estado.ahorro > 0) estado.ahorro += neto2;
      else if (estado.monetaria !== null) estado.monetaria += neto2;
    }

    // --- reputación para el fiador ---
    estado.reputacion = limitar(estado.reputacion +
      (estado.deudaHogar > 0 ? FIADOR.porMesConDeudaHogar : FIADOR.porMesSinDeudaHogar),
      0, FIADOR.maxima);
    if (estado.empleo && estado.empleo.mesesEnPuesto > 0 && estado.empleo.mesesEnPuesto % 12 === 0) {
      estado.reputacion = limitar(estado.reputacion + FIADOR.porAnioEnMismoEmpleo, 0, FIADOR.maxima);
    }

    // --- promociones activas se van venciendo ---
    for (var q = estado.promosActivas.length - 1; q >= 0; q--) {
      estado.promosActivas[q].mesesRestantes--;
      if (estado.promosActivas[q].mesesRestantes <= 0) estado.promosActivas.splice(q, 1);
    }

    // --- avanzar calendario ---
    estado.mesesJugados++;
    estado.mes++;
    if (estado.mes > 11) { estado.mes = 0; estado.anio++; }
    if (estado.mesesJugados % 12 === 0) {
      estado.edad++;
      moverMercado();
      cerrarAnio(m);
    }

    // Los totales acumulan solo lo de este mes, no lo del turno completo.
    estado.totales.ingresos += entrada + (m.remesa - (m.remesaYaContada || 0));
    m.remesaYaContada = m.remesa;
    estado.totales.gastos += gastoVivienda + enfermedadMes;

    return 1;
  }

  function moverMercado() {
    for (var id in estado.mercado) {
      var d = estado.mercado[id] + azar(-MERCADO.derivaAnual, MERCADO.derivaAnual);
      estado.mercado[id] = limitar(d, MERCADO.demandaMinima, MERCADO.demandaMaxima);
    }
  }

  function cerrarAnio(m) {
    estado.resumenesAnuales.push({
      anio: estado.anio, edad: estado.edad,
      patrimonio: redondear(patrimonio()),
      deuda: deudaTotal(),
      puntaje: Math.round(estado.puntaje),
      educacion: estado.educacion,
      empleo: estado.empleo ? estado.empleo.id : null
    });
    m.cierreDeAnio = true;
  }

  // ---------- eventos ----------

  function resolverEventos(m) {
    for (var i = 0; i < EVENTOS.length; i++) {
      var ev = EVENTOS[i];
      /* A un chico de 13 no le llega la cuenta del dentista: la paga su mama.
       * Los golpes de dinero empiezan con la mayoria de edad, y hasta entonces
       * el juego se ocupa de otra cosa. */
      if (ev.tipo === 'malo' && estado.edad < CONFIG.menor.edadPrimerosGolpes) continue;
      if (ev.requiereEmpleo && !estado.empleo) continue;
      if (ev.requiereRemesa && !estado.remesaActiva) continue;
      if (ev.soloEfectivo && estado.efectivo < 300) continue;
      if (Math.random() >= ev.prob) continue;

      if (ev.opciones) { m.decisiones.push({ clase: 'evento', ref: ev.id }); continue; }

      if (ev.id === 'robo') {
        var p = redondear(estado.efectivo * 0.6);
        estado.efectivo -= p;
        m.perdidaEfectivo += p;
        m.eventos.push(ev.titulo + '. Se llevaron Q' + p.toFixed(2) + '.');
      } else if (ev.montoDolares) {
        var q = redondear(ev.montoDolares * CONFIG.tipoCambio);
        if (estado.monetaria !== null) estado.monetaria += q; else estado.efectivo += q;
        m.remesa += q;
        m.eventos.push(ev.titulo + ': Q' + q.toFixed(2) + '.');
      } else if (ev.tipo === 'bueno') {
        if (estado.monetaria !== null) estado.monetaria += ev.monto; else estado.efectivo += ev.monto;
        m.extras += ev.monto;
        m.eventos.push(ev.titulo + ': Q' + ev.monto + '.');
      } else {
        m.enfermedadPendiente = (m.enfermedadPendiente || 0) + ev.monto;
        m.imprevistos += ev.monto;
        m.eventos.push(ev.titulo + ': Q' + ev.monto + '.');
      }
      break; // como maximo un evento por mes
    }

    /* Y una tarjeta de decision, como maximo una por mes.
     *
     * Va aparte de los eventos a proposito: un evento se lee y se cierra, una
     * decision hay que tomarla. Si compartieran el mismo tiro, los meses en
     * que se te quiebra el celular serian meses sin decidir nada. */
    /* Con un descanso obligatorio entre tarjeta y tarjeta.
     *
     * Doce tarjetas con 10% cada una son casi tres de cada cuatro meses con
     * una pregunta encima, y una decision que llega todos los meses deja de
     * ser una decision y se vuelve un formulario. */
    estado.mesesSinDecision = (estado.mesesSinDecision || 0) + 1;
    if (typeof DECISIONES !== 'undefined' && estado.mesesSinDecision > MESES_ENTRE_DECISIONES) {
      var candidatas = [];
      for (var di = 0; di < DECISIONES.length; di++) {
        var dc = DECISIONES[di];
        if (dc.edadMinima && estado.edad < dc.edadMinima) continue;
        if (dc.edadMaxima && estado.edad > dc.edadMaxima) continue;
        if (dc.unaVez && estado.decisionesVistas.indexOf(dc.id) >= 0) continue;
        if (dc.requiere) {
          var pasa = false;
          try { pasa = !!dc.requiere(estado); } catch (err) { pasa = false; }
          if (!pasa) continue;
        }
        if (Math.random() >= dc.prob) continue;
        candidatas.push(dc.id);
      }
      if (candidatas.length) {
        var elegida = candidatas[azarEntero(0, candidatas.length - 1)];
        estado.decisionesVistas.push(elegida);
        estado.mesesSinDecision = 0;
        m.decisiones.push({ clase: 'decision', ref: elegida });
      }
    }

    // promociones
    for (var j = 0; j < PROMOCIONES.length; j++) {
      var pr = PROMOCIONES[j];
      if (pr.requiereAhorro && estado.ahorro === null) continue;
      if (pr.requiereTarjeta && !estado.tarjeta) continue;
      if (pr.requiereCuenta && estado.monetaria === null) continue;
      if (Math.random() >= pr.prob) continue;
      m.decisiones.push({ clase: 'promo', ref: pr.id });
      break;
    }
  }

  /* Aplica una opcion de una tarjeta de decision.
   *
   * `clase` dice de donde salio: 'evento' de datos/eventos.js, 'promo' de las
   * promociones del banco, 'decision' de datos/decisiones.js. Los efectos que
   * entiende cada campo estan documentados en ese archivo. */
  function aplicarDecision(clase, id, indiceOpcion) {
    var fuente = clase === 'promo' ? PROMOCIONES
               : clase === 'decision' ? (typeof DECISIONES !== 'undefined' ? DECISIONES : [])
               : EVENTOS;
    var def = buscarPorId(fuente, id);
    if (!def) return { texto: '' };

    if (!def.opciones) {
      // promo sin opciones: se aplica el efecto directo
      if (def.efecto) estado.promosActivas.push({ id: def.id, mesesRestantes: def.efecto.meses, efecto: def.efecto });
      return { texto: def.letraChica || '' };
    }

    var op = def.opciones[indiceOpcion];
    if (!op) return { texto: '' };
    var texto = op.resultado || '';

    if (op.dinero) {
      if (op.dinero > 0) {
        if (estado.monetaria !== null) estado.monetaria += op.dinero;
        else estado.efectivo += op.dinero;
      } else {
        var falta = cobrarDeCuentas(-op.dinero);
        if (falta > 0.01) {
          estado.deudaHogar = redondear(estado.deudaHogar + falta);
          texto += ' Quedaste debiendo Q' + falta.toFixed(2) + '.';
        }
      }
    }
    if (op.reputacion) {
      estado.reputacion = limitar(estado.reputacion + op.reputacion, 0, FIADOR.maxima);
    }
    if (op.puntaje) estado.puntaje = limitar(estado.puntaje + op.puntaje, 0, PUNTAJE.maximo);
    if (op.avanceEstudio && estado.estudio) {
      estado.estudio.mesesAvanzados = Math.max(0, estado.estudio.mesesAvanzados + op.avanceEstudio);
    }
    if (op.bonoJornada) {
      estado.bonoJornada = redondear((estado.bonoJornada || 0) + op.bonoJornada);
    }

    if (op.perderPorcentajeCuentas) {
      var perdido = 0;
      ['monetaria', 'ahorro'].forEach(function (c) {
        if (estado[c] !== null && estado[c] > 0) {
          var x = redondear(estado[c] * op.perderPorcentajeCuentas);
          estado[c] -= x; perdido += x;
        }
      });
      texto += ' Perdiste Q' + perdido.toFixed(2) + '.';
    }
    if (op.bonoSalario) {
      var extra = redondear(ingresoMensualActual() * op.bonoSalario);
      if (estado.monetaria !== null) estado.monetaria += extra; else estado.efectivo += extra;
      texto += ' Ganaste Q' + extra.toFixed(2) + ' extra.';
    }
    if (op.energia) estado.energia = limitar(estado.energia + op.energia, 0, CONFIG.energia.maxima);
    if (op.subirLimite && estado.tarjeta) {
      estado.tarjeta.limite = Math.round(estado.tarjeta.limite * (1 + op.subirLimite));
      texto += ' Tu límite subió a Q' + estado.tarjeta.limite.toLocaleString() + '.';
    }
    if (op.cargoMensual) {
      // Las promos traen un numero suelto; las decisiones traen nombre y monto
      var cargo = typeof op.cargoMensual === 'number'
        ? { nombre: 'Seguro de vida', monto: op.cargoMensual }
        : { nombre: op.cargoMensual.nombre, monto: op.cargoMensual.monto };
      estado.cargosRecurrentes.push(cargo);
      texto += ' Se te va a cobrar Q' + cargo.monto + ' cada mes.';
    }
    guardar();
    return { texto: texto };
  }

  // ---------- cierre de turno ----------

  function turnoVacio() {
    return {
      mes: MESES[estado.mes], anio: estado.anio, edad: estado.edad,
      etapa: etapaActual().turno, mesesCubiertos: mesesDelTurno(),
      salario: 0, bono: 0, remesa: 0, comisionRemesa: 0, extras: 0, mesada: 0,
      manejo: 0, negocio: 0, negocioVenta: 0, planilla: 0, mantenimiento: 0,
      vivienda: 0, colegiatura: 0, fuga: 0, intereses: 0, isr: 0,
      enfermedad: 0, perdidaEfectivo: 0, imprevistos: 0,
      cuotasPagadas: 0, interesesPagados: 0, pagoTarjeta: 0,
      cuotaHipoteca: 0, aportePension: 0, rendimientoPension: 0,
      enviado: 0, comisionEnvio: 0, viviendaYaCubierta: false,
      deudaHogar: 0, mora: false, embargo: false, hipotecaLiquidada: false,
      quebro: null,
      graduacion: null, cierreDeAnio: false,
      eventos: [], decisiones: []
    };
  }

  function cerrarTurno() {
    var m = turnoVacio();
    var n = mesesDelTurno();
    for (var i = 0; i < n && !estado.jubilado; i++) {
      resolverMes(m);
      if (estado.edad >= CONFIG.tiempo.edadJubilacion) { estado.jubilado = true; m.jubilacion = true; }
    }
    limpiarEspacios();
    estado.bitacora.push(m);
    if (estado.bitacora.length > 240) estado.bitacora.shift();
    guardar();
    return m;
  }

  // Adelanta turnos hasta que pase algo que merezca atencion.
  function adelantar() {
    var turnos = [];
    for (var i = 0; i < CONFIG.tiempo.maxTurnosAdelantar; i++) {
      if (estado.jubilado) break;
      /* Repite un reparto razonable: lo que el colegio tenga tomado se
       * queda, y de lo que sobra se trabaja todo menos dos jornadas de
       * descanso. Sin las dos de descanso el jugador se enfermaba solo. */
      var t = trabajoActual();
      var libres = [];
      for (var j = 0; j < estado.espacios.length; j++) {
        if (espacioBloqueado(j)) estado.espacios[j] = 'estudio';
        else libres.push(j);
      }
      for (var jl = 0; jl < libres.length; jl++) {
        var trabaja = t && jl < libres.length - 2;
        estado.espacios[libres[jl]] = trabaja ? 'trabajo' : 'descanso';
      }
      var m = cerrarTurno();
      turnos.push(m);
      if (m.decisiones.length || m.mora || m.graduacion || m.jubilacion || m.deudaHogar > 0) break;
    }
    return turnos;
  }

  // ---------- reportes ----------

  function reporte() {
    var e = estado;
    var anios = Math.max(1, e.mesesJugados / 12);
    return {
      edad: e.edad, mesesJugados: e.mesesJugados,
      patrimonio: redondear(patrimonio()),
      deuda: deudaTotal(),
      educacion: e.educacion,
      empleoId: e.empleo ? e.empleo.id : null,
      formal: e.empleo ? e.empleo.formal : null,
      puntaje: Math.round(e.puntaje),
      tramo: tramoPuntaje().nombre,
      origen: e.origen,
      casa: e.casa ? { id: e.casa.id, valor: e.casa.valor } : null,
      hipotecaSaldo: e.hipoteca ? redondear(e.hipoteca.saldo) : 0,
      pension: e.pension ? redondear(e.pension.saldo) : 0,
      pensionAportado: e.pension ? redondear(e.pension.aportado) : 0,
      mesesFuera: e.migracion ? e.migracion.mesesFuera : 0,
      totalEnviado: redondear(e.totalEnviado || 0),
      comisionesEnvio: redondear(e.comisionesEnvio || 0),
      totales: e.totales,
      ahorroPromedioMensual: redondear(patrimonio() / Math.max(1, e.mesesJugados)),
      interesesNetos: redondear(e.totales.interesesGanados - e.totales.interesesPagados),
      aniosJugados: redondear(anios),
      lecciones: leccionesDelReporte()
    };
  }

  /* Devuelve claves y datos, no frases. La interfaz arma el texto en el idioma
   * que toque. Asi las lecciones se traducen sin duplicar la logica. */
  function leccionesDelReporte() {
    var L = [], t = estado.totales;
    function q(n) { return 'Q' + Math.round(n).toLocaleString('es-GT'); }

    if (t.fugaEfectivo > 3000) L.push({ clave: 'fuga', args: [q(t.fugaEfectivo)] });
    if (t.interesesPagados > t.interesesGanados * 2 && t.interesesPagados > 1000) {
      L.push({ clave: 'intereses', args: [q(t.interesesPagados), q(t.interesesGanados)] });
    }
    if (t.comisionesRemesa > 1500) L.push({ clave: 'remesas', args: [q(t.comisionesRemesa)] });
    if (estado.puntaje < 25) L.push({ clave: 'sinHistorial', args: [] });
    if (estado.educacion === 'licenciatura' && estado.carrerasTerminadas.length === 1) {
      L.push({ clave: 'licenciatura', args: [] });
    }
    if (estado.empleo && !estado.empleo.formal) L.push({ clave: 'informal', args: [] });

    if (estado.casa && !estado.hipoteca) {
      L.push({ clave: 'casaPagada', args: [q(estado.casa.valor)] });
    } else if (estado.casa && estado.hipoteca) {
      L.push({ clave: 'casaConDeuda', args: [q(estado.hipoteca.saldo)] });
    }
    if (estado.pension && estado.pension.saldo > estado.pension.aportado * 1.5) {
      L.push({ clave: 'pension',
               args: [q(estado.pension.aportado), q(estado.pension.saldo)] });
    }
    if (estado.comisionesEnvio > 5000) {
      L.push({ clave: 'comisionesEnvio', args: [q(estado.comisionesEnvio), q(estado.totalEnviado)] });
    }

    if (!L.length) L.push({ clave: 'bien', args: [] });
    return L;
  }

  // ---------- guardado y ranuras ----------

  function clave(n) { return PREFIJO + n; }

  function guardar() {
    try { localStorage.setItem(clave(ranuraActiva), JSON.stringify(estado)); } catch (e) {}
  }

  function cargar(n) {
    try {
      var crudo = localStorage.getItem(clave(n || ranuraActiva));
      if (!crudo) return false;
      estado = JSON.parse(crudo);
      ranuraActiva = n || ranuraActiva;
      sanearProgreso();
      sanearEspacios();
      if (estado.bonoJornada === undefined) estado.bonoJornada = 0;
      if (!estado.decisionesVistas) estado.decisionesVistas = [];
      if (estado.mesesSinDecision === undefined) estado.mesesSinDecision = 0;
      if (!estado.mejoras) estado.mejoras = {};
      if (!Array.isArray(estado.negocios)) estado.negocios = [];
      if (estado.mesada === undefined) {
        var og = buscarPorId(ORIGENES, estado.origen);
        estado.mesada = og && og.mesada ? og.mesada : 0;
      }
      if (estado.decisionEstudio === undefined) {
        // Partida vieja: si ya estaba estudiando, es que ya habia decidido
        estado.decisionEstudio = estado.estudio ? 'si' : null;
      }
      // Una partida guardada antes de que la ruta existiera no puede perder
      // de golpe la mitad del juego: se le abre todo lo que ya se ganó.
      revisarProgreso();
      return true;
    } catch (e) { return false; }
  }

  function ranuras() {
    var r = [];
    for (var n = 1; n <= 3; n++) {
      try {
        var crudo = localStorage.getItem(clave(n));
        if (!crudo) { r.push({ n: n, vacia: true }); continue; }
        var s = JSON.parse(crudo);
        r.push({ n: n, vacia: false, edad: s.edad, anio: s.anio,
                 patrimonio: redondear((s.efectivo || 0) + (s.monetaria || 0) + (s.ahorro || 0)),
                 educacion: s.educacion, dificultad: s.dificultad });
      } catch (e) { r.push({ n: n, vacia: true }); }
    }
    return r;
  }

  function borrar(n) {
    try { localStorage.removeItem(clave(n || ranuraActiva)); } catch (e) {}
    if (!n || n === ranuraActiva) estado = null;
  }

  function archivarPartida() {
    try {
      var h = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || '[]');
      var r = reporte();
      r.fecha = new Date().toISOString().slice(0, 10);
      r.dificultad = estado.dificultad;
      h.unshift(r);
      localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(h.slice(0, 10)));
    } catch (e) {}
  }

  function historial() {
    try { return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || '[]'); }
    catch (e) { return []; }
  }

  function exportar() {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(estado)))); }
    catch (e) { return ''; }
  }

  function importar(codigo) {
    try {
      var s = JSON.parse(decodeURIComponent(escape(atob(codigo.trim()))));
      if (!s || typeof s.mesesJugados !== 'number') return false;
      estado = s; guardar(); return true;
    } catch (e) { return false; }
  }

  function iniciar(dificultad, n, origenId) {
    ranuraActiva = n || 1;
    estado = nuevoEstado(dificultad, origenId);
    guardar();
  }

  // ---------- interfaz pública ----------

  var API = {
    iniciar: iniciar, cargar: cargar, guardar: guardar, borrar: borrar,
    ranuras: ranuras, ranuraActiva: function () { return ranuraActiva; },
    archivarPartida: archivarPartida, historial: historial,
    exportar: exportar, importar: importar,

    cerrarTurno: cerrarTurno, adelantar: adelantar, aplicarDecision: aplicarDecision,
    asignarEspacio: asignarEspacio, limpiarEspacios: limpiarEspacios,
    espacioBloqueado: espacioBloqueado, semanaDe: semanaDe, jornadaDe: jornadaDe,
    indiceDe: indiceDe, esMenor: esMenor, aperturaMinima: aperturaMinima,
    decidirEstudio: decidirEstudio,

    tomarTrabajo: tomarTrabajo, renunciar: renunciar,
    inscribirse: inscribirse, abandonarEstudio: abandonarEstudio,
    abrirCuenta: abrirCuenta, mover: mover, mudarse: mudarse,
    abrirPlazo: abrirPlazo, romperPlazo: romperPlazo,
    comprarCasa: comprarCasa, requisitoHipoteca: requisitoHipoteca,
    cuotaHipoteca: cuotaHipoteca, engancheDe: engancheDe, cierreDe: cierreDe,
    efectivoParaEnganche: efectivoParaEnganche,
    abrirPension: abrirPension, cambiarAportePension: cambiarAportePension,
    retirarPension: retirarPension,
    puedeMigrar: puedeMigrar, migrar: migrar, cambiarEnvio: cambiarEnvio,
    regresar: regresar, estaFuera: estaFuera,
    pedirPrestamo: pedirPrestamo, pedirInformal: pedirInformal,
    solicitarTarjeta: solicitarTarjeta, gastarConTarjeta: gastarConTarjeta,
    pagarTarjeta: pagarTarjeta, abonarPrestamo: abonarPrestamo,

    patrimonio: patrimonio, deudaTotal: deudaTotal, trabajoActual: trabajoActual,
    salarioEsperado: salarioEsperado, ingresoMensualActual: ingresoMensualActual,
    puedeAplicar: puedeAplicar, gastoMensualVivienda: gastoMensualVivienda,
    costoMensualEstudio: costoMensualEstudio, proporcionPago: proporcionPago,
    manejoDeCuenta: manejoDeCuenta,
    comprarMejora: comprarMejora, faltaParaMejora: faltaParaMejora,
    nivelDeCadena: nivelDeCadena, siguienteMejora: siguienteMejora,
    mejorasDeCadena: mejorasDeCadena, tieneMejora: tieneMejora,
    efectosDeMejoras: efectosDeMejoras, bonoPorJornada: bonoPorJornada,
    dineroDisponible: dineroDisponible,

    tipoDeNegocio: tipoDeNegocio, negociosAbiertos: negociosAbiertos,
    negocioDe: negocioDe, nivelDeNegocio: nivelDeNegocio, plazasDe: plazasDe,
    techoNegocios: techoNegocios, techoEmpleados: techoEmpleados,
    empleadosTotales: empleadosTotales, jornadasDelDueno: jornadasDelDueno,
    costoDeSubirNivel: costoDeSubirNivel, costoDeEmpleado: costoDeEmpleado,
    planillaDe: planillaDe, proyeccionDeNegocio: proyeccionDeNegocio,
    imperio: imperio, faltaParaAbrir: faltaParaAbrir, abrirNegocio: abrirNegocio,
    faltaParaSubirNivel: faltaParaSubirNivel, subirNivelNegocio: subirNivelNegocio,
    faltaParaContratar: faltaParaContratar, contratar: contratar,
    indemnizacionDe: indemnizacionDe, despedir: despedir,
    invertidoEn: invertidoEn, valorDeTraspaso: valorDeTraspaso,
    cerrarNegocio: cerrarNegocio, quebrarNegocio: quebrarNegocio,
    tipoDeEspacio: tipoDeEspacio, negocioDeEspacio: negocioDeEspacio,
    espaciosUsados: espaciosUsados, espaciosLibres: espaciosLibres,
    tramoPuntaje: tramoPuntaje, tieneFiador: tieneFiador,
    requisitoPrestamo: requisitoPrestamo, montoMaximoPersonal: montoMaximoPersonal,
    limiteTarjeta: limiteTarjeta, cuotaMensual: cuotaMensual,
    multiplicadorMercado: multiplicadorMercado, etapaActual: etapaActual,
    mesesDelTurno: mesesDelTurno, enGracia: enGracia, reporte: reporte,
    nombreMes: function (i) { return MESES[i]; },

    desbloqueado: desbloqueado, revisarProgreso: revisarProgreso,
    siguientePeldano: siguientePeldano, peldanosAbiertos: peldanosAbiertos,

    get: function () { return estado; }
  };

  return API;
})();
