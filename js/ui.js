/* Mi Primer Quetzal — interfaz
 *
 * Pestañas abajo, tarjetas superpuestas para las decisiones.
 * Todo texto visible pasa por T(). La clave es la frase en español, así que
 * el juego funciona completo aunque falte una traducción.
 */

var UI = (function () {

  var pestana = 'casa';
  var espacioSel = null;
  var app;

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

  function Q(n) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    var loc = Idioma.actual() === 'en' ? 'en-US' : 'es-GT';
    return 'Q' + Number(n).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function Q0(n) {
    var loc = Idioma.actual() === 'en' ? 'en-US' : 'es-GT';
    return 'Q' + Math.round(Number(n) || 0).toLocaleString(loc);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pct(n) { return Math.round(n * 100) + '%'; }
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

  function barra() {
    var e = Motor.get();
    var energiaPct = Math.round((e.energia / CONFIG.energia.maxima) * 100);
    var baja = e.energia < CONFIG.energia.umbralRiesgo ? ' baja' : '';
    var tramo = Motor.tramoPuntaje();
    var etapa = Motor.etapaActual();
    var deuda = Motor.deudaTotal();

    return '' +
      '<div class="barra">' +
        '<div class="fecha">' +
          T('{0} {1} · {2} años', nombreMes(e.mes), e.anio, e.edad) +
          (etapa.mesesPorTurno > 1 ? ' · ' + T('turnos por {0}', turnoNombre()) : '') +
          '<button class="barra-btn" data-abrir-menu>⋯</button>' +
        '</div>' +
        '<div class="cifras">' +
          '<span class="dinero">' + Q0(Motor.patrimonio()) + '</span>' +
          '<span class="chip">⚡ ' + Math.round(e.energia) + '</span>' +
          '<span class="chip">📊 ' + Math.round(e.puntaje) + '</span>' +
          (deuda > 0 ? '<span class="chip alerta">' + T('debe {0}', Q0(deuda)) + '</span>' : '') +
        '</div>' +
        '<div class="energia-barra"><div class="energia-relleno' + baja +
          '" style="width:' + energiaPct + '%"></div></div>' +
        '<div class="fecha" style="margin-top:4px">' +
          T('Historial: {0}', K('tramos', tramo.nombre, tramo.nombre)) + '</div>' +
      '</div>';
  }

  // =============== pestaña: el mes ===============

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

    h += '<h2>' + T('Tu {0}', turnoNombre()) + '</h2>';

    if (Motor.enGracia()) {
      h += '<div class="aprendizaje">' +
        T('Tu primer año es tranquilo. No van a caer imprevistos mientras agarras el ritmo.') + '</div>';
    }

    h += '<div class="tarjeta"><p class="sutil">' +
         T('Cuatro semanas. Toca una y elige en qué la usas.');
    if (etapa.mesesPorTurno > 1) {
      h += ' ' + T('Este reparto se repite los {0} meses del {1}.', etapa.mesesPorTurno, turnoNombre());
    }
    h += '</p><div class="semanas">';

    var iconos = { trabajo: '💼', estudio: '🎓', minijuego: '🎮', 'minijuego-usado': '✅', descanso: '😴', '': '＋' };
    var claves = { trabajo: 'Trabajo', estudio: 'Estudio', minijuego: 'Extra',
                   'minijuego-usado': 'Hecho', descanso: 'Descanso', '': 'Libre' };
    for (var i = 0; i < e.espacios.length; i++) {
      var tipo = e.espacios[i];
      h += '<div class="semana' + (tipo ? ' lleno' : '') + (espacioSel === i ? ' sel' : '') +
           '" data-espacio="' + i + '"><div>' + iconos[tipo] + '</div>' +
           '<div class="nom">' + T(claves[tipo]) + '</div></div>';
    }
    h += '</div>';

    var puedeTrabajar = t || e.migracion;
    if (espacioSel !== null) {
      h += '<div class="btn-fila" style="margin-top:10px">';
      h += '<button class="btn-chico" data-poner="trabajo"' + (puedeTrabajar ? '' : ' disabled') + '>💼 ' + T('Trabajar') + '</button>';
      h += '<button class="btn-chico" data-poner="estudio"' + (e.estudio ? '' : ' disabled') + '>🎓 ' + T('Estudiar') + '</button>';
      h += '<button class="btn-chico" data-poner="minijuego">🎮 ' + T('Extra') + '</button>';
      h += '<button class="btn-chico" data-poner="descanso">😴 ' + T('Descansar') + '</button>';
      h += '<button class="btn-chico" data-poner="">' + T('Vaciar') + '</button>';
      h += '</div>';
      if (!puedeTrabajar) h += '<p class="aviso">' + T('No tienes trabajo. Busca uno en la pestaña de trabajo.') + '</p>';
      if (!e.estudio) h += '<p class="sutil" style="margin-top:6px">' + T('Para estudiar, inscríbete primero.') + '</p>';
    }
    h += '</div>';

    var espT = Motor.espaciosUsados('trabajo');
    var estimado = 0;
    if (e.migracion && espT > 0) {
      var empM = buscar(MIGRACION.empleos, e.migracion.empleoId);
      estimado = empM.sueldoDolares * CONFIG.tipoCambio * Motor.proporcionPago(espT);
    } else if (t && espT > 0) {
      estimado = Motor.salarioEsperado(t, e.empleo.formal) * Motor.proporcionPago(espT);
    }
    h += '<div class="tarjeta"><h3 style="margin-top:0">' + T('Lo que viene') + '</h3>';
    h += fila(T('Ingreso estimado'), Q(estimado), estimado > 0 ? 'pos' : '');
    if (puedeTrabajar && espT > 0 && espT < 4) {
      h += '<p class="sutil">' +
        T('Trabajas {0} de 4 semanas, así que cobras el {1} del sueldo.', espT, pct(Motor.proporcionPago(espT))) +
        '</p>';
    }
    var nombreVivienda = e.migracion ? T('Vivir en Estados Unidos')
                       : (e.casa ? D(buscar(CASAS, e.casa.id), 'nombre')
                                 : K('vivienda_nombre', e.vivienda, v ? v.nombre : ''));
    h += fila(T('{0} y gastos', esc(nombreVivienda)), '-' + Q(Motor.gastoMensualVivienda()), 'neg');
    if (e.hipoteca) h += fila(T('Cuota de hipoteca'), '-' + Q(e.hipoteca.cuota), 'neg');
    if (e.pension && e.pension.aporteMensual > 0) {
      h += fila(T('Aporte a pensión'), '-' + Q(e.pension.aporteMensual));
    }
    if (e.estudio) h += fila(T('Colegiatura'), '-' + Q(Motor.costoMensualEstudio()), 'neg');
    var cuotas = 0;
    for (var k = 0; k < e.prestamos.length; k++) cuotas += e.prestamos[k].cuota;
    if (cuotas > 0) h += fila(T('Cuotas de crédito'), '-' + Q(cuotas), 'neg');
    if (e.tarjeta && e.tarjeta.saldo > 0) {
      h += fila(T('Pago de tarjeta'),
        '-' + Q(Math.max(50, e.tarjeta.saldo * CREDITOS.tarjeta.pagoMinimoPorcentaje)), 'neg');
    }
    if (e.deudaHogar > 0) h += fila(T('Lo que quedaste debiendo'), '-' + Q(e.deudaHogar), 'neg');
    if (e.efectivo > 0) {
      h += fila(T('Se te irá del efectivo'),
        '-' + Q(Math.min(e.efectivo * CONFIG.efectivo.fugaMensual, CONFIG.efectivo.fugaMaxima)), 'neg');
    }
    h += '</div>';

    h += '<button class="btn-primario" id="cerrar-turno">' + T('Terminar el {0}', turnoNombre()) + ' ▸</button>';
    h += '<div class="btn-fila" style="margin-top:8px"><button class="btn-chico" id="adelantar" style="flex:1">⏩ ' +
         T('Adelantar hasta que pase algo') + '</button></div>';
    return h;
  }

  // =============== pestaña: trabajo ===============

  function vistaTrabajo() {
    var e = Motor.get();
    var actual = Motor.trabajoActual();
    var h = '<h2>' + T('Trabajo') + '</h2>';

    // ----- viviendo fuera del país -----
    if (e.migracion) {
      var g = e.migracion;
      var emp = buscar(MIGRACION.empleos, g.empleoId);
      var canal = MIGRACION.canales[g.canal];
      h += '<div class="tarjeta acento"><div class="titulo">' + emp.icono + ' ' +
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
      MIGRACION.enviosSugeridos.forEach(function (p) {
        h += '<button class="btn-chico' + (g.enviaPorcentaje === p ? ' activa' : '') +
             '" data-envio="' + p + '">' + T('Mandar {0}', pct(p)) + '</button>';
      });
      h += '</div><div class="btn-fila" style="margin-top:8px">';
      Object.keys(MIGRACION.canales).forEach(function (id) {
        h += '<button class="btn-chico' + (g.canal === id ? ' activa' : '') +
             '" data-canal="' + id + '">' +
             esc(K('canal_nombre', id, MIGRACION.canales[id].nombre)) + '</button>';
      });
      h += '</div></div>';

      h += '<div class="btn-fila" style="margin-top:14px"><button class="btn-chico" id="regresar" style="flex:1">✈️ ' +
           T('Regresar a Guatemala') + '</button></div>';
      return h;
    }

    if (actual) {
      h += '<div class="tarjeta acento">';
      h += '<div class="titulo">' + actual.icono + ' ' + esc(D(actual, 'nombre')) + '</div>';
      h += fila(T('Modalidad'), e.empleo.formal ? T('Formal')
                : '<span class="etiqueta alerta">' + T('Informal') + '</span>');
      h += fila(T('Salario estimado'), Q(Motor.salarioEsperado(actual, e.empleo.formal)), 'pos');
      h += fila(T('Tiempo en el puesto'), T('{0} meses', e.empleo.mesesEnPuesto));
      var mult = Motor.multiplicadorMercado(actual.id);
      if (mult !== 1) h += fila(T('Efecto del mercado'), T('{0} del sueldo base', pct(mult)), mult >= 1 ? 'pos' : 'neg');
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="renunciar">' +
           T('Renunciar') + '</button></div></div>';
    }

    h += '<h3>' + T('Mercado laboral') + '</h3><div class="tarjeta"><p class="sutil">' +
         T('La demanda cambia con los años. Investiga antes de estudiar, y aun así no des nada por seguro.') +
         '</p>';
    for (var c = 0; c < CARRERAS.length; c++) {
      var car = CARRERAS[c];
      var et = etiquetaDemanda(e.mercado[car.id]);
      h += '<div class="fila"><span class="etq">' + car.icono + ' ' + esc(D(car, 'nombre')) + '</span>' +
           '<span class="etiqueta ' + et.clase + '">' + T(et.texto) + '</span></div>';
    }
    h += '</div>';

    h += '<h3>' + T('Ofertas') + '</h3>';
    for (var i = 0; i < TRABAJOS.length; i++) {
      var tr = TRABAJOS[i];
      var chk = Motor.puedeAplicar(tr);
      var esActual = actual && actual.id === tr.id;
      h += '<div class="opcion' + (esActual ? ' activa' : '') + (chk.ok ? '' : ' bloqueada') + '">';
      h += '<div class="titulo">' + tr.icono + ' ' + esc(D(tr, 'nombre'));
      if (tr.varianza >= 0.5) h += '<span class="etiqueta alerta">' + T('ingreso variable') + '</span>';
      h += '</div><p class="sutil" style="margin:6px 0">' + esc(D(tr, 'descripcion')) + '</p>';
      h += fila(T('Sueldo estimado'), Q0(Motor.salarioEsperado(tr, true)), 'pos');
      if (!chk.ok) {
        h += '<p class="aviso">' + (chk.motivo === 'nivel'
             ? T('Necesitas nivel {0}.', nivel(tr.requisito))
             : T('Necesitas {0} de capital.', Q0(tr.capitalRequerido))) + '</p>';
      } else if (!esActual) {
        h += '<div class="btn-fila" style="margin-top:10px">';
        if (CONFIG.dificultad[e.dificultad].permiteFormal) {
          h += '<button class="btn-chico" data-tomar="' + tr.id + '" data-formal="1">' +
               T('Aceptar formal') + '</button>';
        }
        if (tr.permiteInformal) {
          h += '<button class="btn-chico" data-tomar="' + tr.id + '" data-formal="0">' +
               T('Informal (+{0})', pct(CONFIG.primaInformalidad)) + '</button>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    // ----- irse del país -----
    var mig = Motor.puedeMigrar();
    h += '<h3>' + T('Irte del país') + '</h3><div class="opcion">';
    h += '<div class="titulo">✈️ ' + T('Migrar a Estados Unidos') + '</div>';
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

  // =============== pestaña: estudio ===============

  function vistaEstudio() {
    var e = Motor.get();
    var h = '<h2>' + T('Estudio') + '</h2>';

    h += '<div class="tarjeta">' + fila(T('Tu nivel'), esc(nivel(e.educacion)));
    h += '<p class="sutil" style="margin-top:8px">' +
      T('En Guatemala la licenciatura sube el ingreso mediano apenas 13% sobre un bachiller. La maestría lo sube 133%. La ruta larga paga solo si la terminas.') +
      '</p></div>';

    if (e.estudio) {
      var car = buscar(CARRERAS, e.estudio.carreraId);
      var avance = Math.min(1, e.estudio.mesesAvanzados / car.mesesRequeridos);
      h += '<div class="tarjeta acento"><div class="titulo">' + car.icono + ' ' + esc(D(car, 'nombre')) + '</div>';
      h += '<div class="progreso"><div class="progreso-relleno" style="width:' + (avance * 100) + '%"></div></div>';
      h += fila(T('Avance'), T('{0} de {1} meses', Math.round(e.estudio.mesesAvanzados), car.mesesRequeridos));
      h += fila(T('Modalidad'), e.estudio.privada ? T('Privada') : T('Pública'));
      h += fila(T('Costo mensual'), e.estudio.privada ? '-' + Q(Motor.costoMensualEstudio()) : T('gratis'),
                e.estudio.privada ? 'neg' : 'pos');
      h += '<p class="sutil" style="margin-top:8px">' +
        T('Cada semana que dedicas avanza medio mes de carrera. Dos semanas al mes es el ritmo normal.') + '</p>';
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="abandonar">' +
           T('Abandonar') + '</button></div></div>';
      return h;
    }

    h += '<h3>' + T('Rutas disponibles') + '</h3>';
    for (var i = 0; i < CARRERAS.length; i++) {
      var c = CARRERAS[i];
      var yaTiene = NIVELES_EDUCATIVOS.indexOf(e.educacion) >= NIVELES_EDUCATIVOS.indexOf(c.nivelQueOtorga);
      var puede = NIVELES_EDUCATIVOS.indexOf(e.educacion) >= NIVELES_EDUCATIVOS.indexOf(c.requiere) && !yaTiene;
      var et = etiquetaDemanda(e.mercado[c.id]);
      h += '<div class="opcion' + (puede ? '' : ' bloqueada') + '">';
      h += '<div class="titulo">' + c.icono + ' ' + esc(D(c, 'nombre')) +
           '<span class="etiqueta ' + et.clase + '">' + T(et.texto) + '</span></div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(c, 'descripcion')) + '</p>';
      h += fila(T('Duración'), T('{0} meses de carrera', c.mesesRequeridos));
      h += fila(T('Pública'), c.costoAnualPublico === 0 ? T('gratis') : T('{0} al año', Q0(c.costoAnualPublico)),
                c.costoAnualPublico === 0 ? 'pos' : '');
      h += fila(T('Privada'), T('{0} al año', Q0(c.costoAnualPrivado)), 'neg');
      if (!puede) {
        h += '<p class="aviso">' + (yaTiene ? T('Ya tienes ese nivel o uno mayor.')
             : T('Primero necesitas nivel {0}.', nivel(c.requiere))) + '</p>';
      } else {
        h += '<div class="btn-fila" style="margin-top:10px">' +
             '<button class="btn-chico" data-inscribir="' + c.id + '" data-priv="0">' + T('Pública') + '</button>' +
             '<button class="btn-chico" data-inscribir="' + c.id + '" data-priv="1">' + T('Privada') + '</button></div>';
      }
      h += '</div>';
    }
    return h;
  }

  // =============== pestaña: banco ===============

  function vistaBanco() {
    var e = Motor.get();
    var h = '<h2>' + T('Banco Cardamomo') + '</h2>';

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

    if (e.monetaria === null || e.ahorro === null) {
      h += '<h3>' + T('Abrir cuenta') + '</h3>';
      ['monetaria', 'ahorro'].forEach(function (tipo) {
        if (e[tipo] !== null) return;
        var p = CONFIG.productos[tipo];
        h += '<div class="opcion"><div class="titulo">' + (tipo === 'monetaria' ? '💳' : '🏦') +
             ' ' + esc(K('producto_nombre', tipo, p.nombre)) + '</div>';
        h += '<p class="sutil" style="margin:6px 0">' + esc(K('producto_desc', tipo, p.descripcion)) + '</p>';
        h += fila(T('Rendimiento anual'), (p.tasaAnual * 100).toFixed(2) + '%');
        h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-abrir="' +
             tipo + '">' + T('Abrir con {0}', Q0(p.aperturaMinima)) + '</button></div></div>';
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

    if (e.ahorro !== null || e.monetaria !== null) {
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
        h += '<div class="opcion"><div class="titulo">📈 ' +
             esc(K('producto_nombre', 'plazo', CONFIG.productos.plazo.nombre)) + '</div>';
        h += '<p class="sutil" style="margin:6px 0">' +
             esc(K('producto_desc', 'plazo', CONFIG.productos.plazo.descripcion)) + '</p>';
        h += fila(T('Rendimiento anual'), (CONFIG.productos.plazo.tasaAnual * 100).toFixed(2) + '%', 'pos');
        h += fila(T('Mínimo'), Q0(CONFIG.productos.plazo.aperturaMinima));
        h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="abrir-plazo">' +
             T('Abrir') + '</button></div></div>';
      }
    }

    h += '<h3>' + T('Crédito') + '</h3>';
    for (var i = 0; i < e.prestamos.length; i++) {
      var p = e.prestamos[i];
      h += '<div class="opcion' + (p.tipo === 'informal' ? ' peligro' : '') + '">';
      h += '<div class="titulo">' + (p.tipo === 'informal' ? '🚩 ' + T('Préstamo del barrio')
                                                           : '🏦 ' + T('Préstamo personal')) + '</div>';
      h += fila(T('Saldo'), Q(p.saldo), 'neg');
      h += fila(T('Cuota'), Q(p.cuota));
      h += fila(T('Tasa'), T('{0}% anual', (p.tasaMensual * 12 * 100).toFixed(2)), p.tipo === 'informal' ? 'neg' : '');
      h += fila(T('Le faltan'), T('{0} cuotas', p.mesesRestantes));
      if (p.atrasos) h += '<p class="aviso">' + T('Llevas {0} cuota(s) de atraso.', p.atrasos) + '</p>';
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-abonar="' + i +
           '">' + T('Abonar de más') + '</button></div></div>';
    }

    if (e.tarjeta) {
      var usoPct = e.tarjeta.limite ? Math.round((e.tarjeta.saldo / e.tarjeta.limite) * 100) : 0;
      h += '<div class="opcion"><div class="titulo">💳 ' + T('Tarjeta de crédito') + '</div>';
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
    h += '<button class="btn-chico" id="pedir-prestamo">🏦 ' + T('Pedir préstamo') + '</button>';
    if (!e.tarjeta) h += '<button class="btn-chico" id="pedir-tarjeta">💳 ' + T('Pedir tarjeta') + '</button>';
    h += '<button class="btn-chico peligro" id="pedir-informal">🚩 ' + T('Prestamista del barrio') + '</button></div>';

    // ----- pensión -----
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
      h += '<div class="opcion"><div class="titulo">' + PENSION.icono + ' ' +
           esc(K('producto_nombre', 'pension', PENSION.nombre)) + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' +
           esc(K('producto_desc', 'pension', PENSION.descripcion)) + '</p>';
      h += fila(T('Rendimiento anual'), (PENSION.rendimientoAnual * 100).toFixed(2) + '%', 'pos');
      h += fila(T('Aporte mínimo'), Q0(PENSION.aporteMinimo));
      h += fila(T('Se retira a los'), T('{0} años', PENSION.edadRetiro));
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" id="abrir-pension">' +
           T('Abrir plan') + '</button></div></div>';
    }

    // ----- casa propia e hipoteca -----
    h += '<h3>' + T('Casa propia') + '</h3>';
    if (e.casa) {
      var casaDef = buscar(CASAS, e.casa.id);
      h += '<div class="tarjeta acento"><div class="titulo">' + casaDef.icono + ' ' +
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
        h += '<div class="titulo">' + casa.icono + ' ' + esc(D(casa, 'nombre'));
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

    h += '<h3>' + T('Vivienda') + '</h3>';
    if (e.casa || e.migracion) {
      h += '<p class="sutil">' + (e.casa ? T('Vives en tu propia casa.')
                                         : T('Vives fuera del país.')) + '</p>';
    } else
    Object.keys(CONFIG.vivienda).forEach(function (id) {
      var v = CONFIG.vivienda[id];
      var esActual = e.vivienda === id;
      h += '<div class="opcion' + (esActual ? ' activa' : '') + '">';
      h += '<div class="titulo">🏠 ' + esc(K('vivienda_nombre', id, v.nombre)) +
           (esActual ? '<span class="etiqueta ok">' + T('actual') + '</span>' : '') + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(K('vivienda_desc', id, v.descripcion)) + '</p>';
      h += fila(T('Costo total al mes'), Q0(v.renta + v.serviciosComida + v.personal), 'neg');
      if (v.requisitoIngreso) h += fila(T('Ingreso exigido'), Q0(v.requisitoIngreso));
      if (!esActual) h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-mudar="' +
                          id + '">' + T('Mudarse aquí') + '</button></div>';
      h += '</div>';
    });

    h += '<div class="btn-fila" style="margin-top:16px">' +
         '<button class="btn-chico" id="ver-glosario">📖 ' + T('Glosario') + '</button>' +
         '<button class="btn-chico" id="ver-reporte">📈 ' + T('Cómo voy') + '</button></div>';
    return h;
  }

  // =============== pestaña: extra ===============

  function vistaExtra() {
    var e = Motor.get();
    var h = '<h2>' + T('Trabajos extra') + '</h2>';
    h += '<p class="sutil">' +
      T('Cada uno consume una semana. Pagan poco comparado con un sueldo, pero algo es algo y algunos te enseñan a cuidar tu dinero.') +
      '</p>';

    var libres = Motor.espaciosUsados('minijuego');
    if (libres === 0) {
      h += '<div class="aprendizaje">' +
        T('Para jugar uno, primero asigna una semana a Extra en la pestaña del mes.') + '</div>';
    }

    var lista = Minijuegos.disponibles(e.educacion, e.carrerasTerminadas);
    for (var i = 0; i < lista.length; i++) {
      var j = lista[i];
      var etiqueta = j.tipo === 'generico' ? T('paga') : (j.tipo === 'basico' ? T('enseña') : T('de tu profesión'));
      h += '<div class="opcion"><div class="titulo">' + j.icono + ' ' + esc(D(j, 'nombre')) +
           '<span class="etiqueta">' + etiqueta + '</span></div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(j, 'descripcion')) + '</p>';
      if (j.ensena) h += '<p class="sutil"><strong>' + T('Enseña:') + '</strong> ' + esc(D(j, 'ensena')) + '</p>';
      h += fila(T('Paga hasta'), Q0(j.pagoMaximo), 'pos');
      h += '<div class="btn-fila" style="margin-top:10px"><button class="btn-chico" data-jugar="' +
           j.id + '"' + (libres > 0 ? '' : ' disabled') + '>' + T('Jugar') + '</button></div></div>';
    }

    var bloqueados = Minijuegos.todos().length - lista.length;
    if (bloqueados > 0) {
      h += '<p class="sutil centrado">' +
        T('Hay {0} más que se abren al subir de nivel educativo.', bloqueados) + '</p>';
    }
    return h;
  }

  // =============== pestañas ===============

  function pestanas() {
    var items = [
      { id: 'casa', ic: '🏠', tx: 'Mes' },
      { id: 'trabajo', ic: '💼', tx: 'Trabajo' },
      { id: 'estudio', ic: '🎓', tx: 'Estudio' },
      { id: 'banco', ic: '🏦', tx: 'Banco' },
      { id: 'extra', ic: '🎮', tx: 'Extra' }
    ];
    var h = '<nav class="pestanas">';
    items.forEach(function (it) {
      h += '<button' + (pestana === it.id ? ' class="activa"' : '') + ' data-pestana="' + it.id + '">' +
           '<span>' + it.ic + '</span><span class="txt">' + T(it.tx) + '</span></button>';
    });
    return h + '</nav>';
  }

  function render() {
    var cuerpo = pestana === 'casa' ? vistaCasa()
               : pestana === 'trabajo' ? vistaTrabajo()
               : pestana === 'estudio' ? vistaEstudio()
               : pestana === 'banco' ? vistaBanco()
               : vistaExtra();
    app.innerHTML = barra() + '<main>' + cuerpo + '</main>' + pestanas();
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
    modal('<span class="icono">' + icono + '</span><h2>' + esc(titulo) + '</h2><p>' + cuerpo + '</p>' +
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

  function aviso(titulo, texto) {
    Sonido.tono('alerta');
    modal('<h2>' + esc(titulo) + '</h2><p>' + esc(texto) + '</p>' +
          '<button class="btn-primario" data-cerrar>' + T('Está bien') + '</button>');
  }

  // =============== resumen del turno ===============

  function resumenTurno(m, pendientes) {
    var h = '<span class="icono">📅</span><h2 style="text-transform:capitalize">' +
            esc(m.mes) + ' ' + m.anio +
            (m.mesesCubiertos > 1 ? ' · ' + T('{0} meses', m.mesesCubiertos) : '') + '</h2>';
    if (m.salario) h += fila(T('Salario'), Q(m.salario), 'pos');
    if (m.bono) h += fila(T('Bono de ley'), Q(m.bono), 'pos');
    if (m.remesa) h += fila(T('Remesas'), Q(m.remesa), 'pos');
    if (m.extras) h += fila(T('Ingresos extra'), Q(m.extras), 'pos');
    if (m.comisionRemesa) h += fila(T('Comisión de remesa'), '-' + Q(m.comisionRemesa), 'neg');
    if (m.vivienda) h += fila(T('Vivienda y gastos'), '-' + Q(m.vivienda), 'neg');
    if (m.colegiatura) h += fila(T('Colegiatura'), '-' + Q(m.colegiatura), 'neg');
    if (m.enviado) h += fila(T('Mandado a tu familia'), '-' + Q(m.enviado), 'neg');
    if (m.comisionEnvio) h += fila(T('Comisión del envío'), '-' + Q(m.comisionEnvio), 'neg');
    if (m.cuotaHipoteca) h += fila(T('Cuota de hipoteca'), '-' + Q(m.cuotaHipoteca), 'neg');
    if (m.aportePension) h += fila(T('Aporte a pensión'), '-' + Q(m.aportePension));
    if (m.rendimientoPension) h += fila(T('Rendimiento de la pensión'), Q(m.rendimientoPension), 'pos');
    if (m.cuotasPagadas) h += fila(T('Cuotas pagadas'), '-' + Q(m.cuotasPagadas), 'neg');
    if (m.pagoTarjeta) h += fila(T('Pago de tarjeta'), '-' + Q(m.pagoTarjeta), 'neg');
    if (m.interesesPagados) h += fila(T('Intereses que pagaste'), '-' + Q(m.interesesPagados), 'neg');
    if (m.imprevistos) h += fila(T('Imprevistos'), '-' + Q(m.imprevistos), 'neg');
    if (m.enfermedad) h += fila(T('Enfermedad'), '-' + Q(m.enfermedad), 'neg');
    if (m.fuga) h += fila(T('Gastos hormiga'), '-' + Q(m.fuga), 'neg');
    if (m.perdidaEfectivo) h += fila(T('Efectivo perdido'), '-' + Q(m.perdidaEfectivo), 'neg');
    if (m.intereses) h += fila(T('Intereses ganados'), Q(m.intereses), 'pos');
    if (m.isr) h += fila(T('Impuesto sobre intereses'), '-' + Q(m.isr), 'neg');
    if (m.deudaHogar) h += fila(T('Quedaste debiendo'), Q(m.deudaHogar), 'neg');

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

    if (m.graduacion) {
      cola.push(function (sig) {
        var c = buscar(CARRERAS, m.graduacion);
        Sonido.tono('logro');
        modal('<span class="icono">🎓</span><h2>' + T('Te graduaste') + '</h2><p>' +
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
    var def = d.clase === 'promo' ? buscar(PROMOCIONES, d.ref) : buscar(EVENTOS, d.ref);
    if (!def) { sig(); return; }
    Sonido.tono(d.clase === 'promo' ? 'toque' : 'alerta');

    var h = '<span class="icono">' + def.icono + '</span><h2>' + esc(D(def, 'titulo')) + '</h2>';
    h += '<p>' + esc(D(def, 'texto')) + '</p>';
    if (def.letraChica) h += '<div class="letra-chica"><strong>' + T('Letra chica:') + '</strong> ' +
                             esc(D(def, 'letraChica')) + '</div>';

    if (!def.opciones) h += '<button class="btn-primario" id="op0">' + T('Aceptar') + '</button>';
    else def.opciones.forEach(function (o, i) {
      h += '<button class="btn-primario" id="op' + i + '" style="margin-top:8px">' +
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

    var h = '<span class="icono">🗓️</span><h2>' + T('Cerraste el año {0}', r.anio) + '</h2>';
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
    var h = '<span class="icono">🏁</span><h2>' + T('Tu vida en números') + '</h2>';
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
    var h = '<span class="icono">📖</span><h2>' + T('Glosario') + '</h2>';
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
    var h = '<span class="icono">📈</span><h2>' + T('Cómo vas') + '</h2>';
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
         '<button class="btn-chico" id="m-idioma">🌐 ' +
           (Idioma.actual() === 'es' ? 'English' : 'Español') + '</button>' +
         '<button class="btn-chico" id="m-sonido">' +
           (Sonido.activo() ? '🔊 ' + T('Sonido activado') : '🔇 ' + T('Sonido apagado')) + '</button></div>';
    h += '<div class="btn-fila" style="margin-bottom:10px">' +
         '<button class="btn-chico" id="m-glosario">📖 ' + T('Glosario') + '</button>' +
         '<button class="btn-chico" id="m-reporte">📈 ' + T('Cómo voy') + '</button></div>';
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

  function jugarMinijuego(id) {
    var caja = document.createElement('div');
    caja.className = 'velo';
    var interior = document.createElement('div');
    interior.className = 'modal mj';
    caja.appendChild(interior);
    document.body.appendChild(caja);

    Minijuegos.lanzar(id, interior, function (res) {
      var e = Motor.get();
      for (var i = 0; i < e.espacios.length; i++) {
        if (e.espacios[i] === 'minijuego') { e.espacios[i] = 'minijuego-usado'; break; }
      }
      if (res.pago > 0) {
        if (e.monetaria !== null) e.monetaria += res.pago; else e.efectivo += res.pago;
        Sonido.tono('moneda');
      }
      Motor.guardar();
      interior.innerHTML =
        '<span class="icono">' + res.def.icono + '</span><h2>' + esc(D(res.def, 'nombre')) + '</h2>' +
        fila(T('Puntos'), res.puntos) +
        fila(T('Aciertos'), T('{0} de {1}', res.aciertos, res.total)) +
        fila(T('Te pagaron'), Q(res.pago), 'pos') +
        (res.def.ensena ? '<div class="aprendizaje"><strong>' + T('Lo que practicaste.') + '</strong> ' +
          esc(D(res.def, 'ensena')) + '</div>' : '') +
        '<button class="btn-primario" data-cerrar>' + T('Listo') + '</button>';
      var b = interior.querySelector('[data-cerrar]');
      if (b) b.addEventListener('click', function () { caja.remove(); render(); });
    });
  }

  // =============== eventos de la interfaz ===============

  function conectar() {
    app.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-pestana],[data-espacio],[data-poner],[data-tomar],[data-abrir],' +
        '[data-mover],[data-mudar],[data-inscribir],[data-jugar],[data-abonar],[data-abrir-menu],' +
        '[data-casa],[data-envio],[data-canal],' +
        '#cerrar-turno,#adelantar,#renunciar,#abandonar,#abrir-plazo,#romper-plazo,#pedir-prestamo,' +
        '#pedir-tarjeta,#pedir-informal,#gastar-tarjeta,#pagar-tarjeta,#alternar-minimo,' +
        '#abrir-pension,#cambiar-pension,#retirar-pension,#migrar,#regresar,' +
        '#ver-glosario,#ver-reporte,#ver-reporte-final');
      if (!el) return;
      var d = el.dataset;
      var e = Motor.get();

      if (d.abrirMenu !== undefined) return mostrarMenu();
      if (d.pestana) { pestana = d.pestana; espacioSel = null; return render(); }

      if (d.espacio !== undefined) {
        var i = parseInt(d.espacio, 10);
        espacioSel = espacioSel === i ? null : i;
        return render();
      }

      if (d.poner !== undefined && espacioSel !== null) {
        Motor.asignarEspacio(espacioSel, d.poner);
        espacioSel = null; Motor.guardar(); Sonido.tono('toque');
        return render();
      }

      if (d.tomar) {
        Motor.tomarTrabajo(d.tomar, d.formal === '1');
        Motor.guardar(); render();
        if (d.formal === '0') {
          tarjetaEducativa('informal', '⚠️', T('Aceptaste un trabajo informal'),
            T('Vas a recibir {0} más en la mano cada mes. A cambio no tienes Bono 14 ni aguinaldo, no cotizas al seguro y el banco no puede comprobar tus ingresos.',
              pct(CONFIG.primaInformalidad)),
            T('Dos tercios de los guatemaltecos trabajan así. Es más dinero hoy y menos toda la vida, porque sin historial nadie te presta cuando lo necesitas.'));
        }
        return;
      }

      if (d.inscribir) {
        var r = Motor.inscribirse(d.inscribir, d.priv === '1');
        if (!r.ok) return aviso(T('No se puede'), r.razon);
        Motor.guardar(); render();
        var c = buscar(CARRERAS, d.inscribir);
        return tarjetaEducativa('estudio', '🎓', T('Te inscribiste'),
          T('Empiezas {0}. Cada semana que dediques avanza medio mes de carrera, y esa semana no la estás trabajando.',
            esc(D(c, 'nombre'))),
          T('La universidad pública es gratuita desde 2026. El costo real de estudiar en Guatemala no es la colegiatura, es el sueldo que dejas de ganar.'));
      }

      if (el.id === 'abandonar') { Motor.abandonarEstudio(); Motor.guardar(); return render(); }

      if (d.abrir) {
        var p = CONFIG.productos[d.abrir];
        var ra = Motor.abrirCuenta(d.abrir, p.aperturaMinima);
        if (!ra.ok) return aviso(T('No se pudo'), ra.razon);
        Sonido.tono('moneda'); render();
        if (d.abrir === 'monetaria') {
          return tarjetaEducativa('monetaria', '💳', T('Abriste tu cuenta monetaria'),
            T('La monetaria es para mover dinero: recibir el salario, pagar y transferir. Paga apenas 1.27% al año, así que no es para guardar.'),
            T('Desde ahora tu salario y tus remesas entran a la cuenta en vez de al bolsillo. Eso solo ya frena los gastos hormiga y te baja la comisión de la remesa a la mitad.'));
        }
        return tarjetaEducativa('ahorro', '🏦', T('Abriste tu cuenta de ahorro'),
          T('El ahorro paga 2.65% al año, más del doble que la monetaria, porque el banco espera que no muevas ese dinero.'),
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
          tarjetaEducativa('plazo', '📈', T('Abriste un depósito a plazo'),
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
        return tarjetaEducativa('tarjeta', '💳', T('Te dieron tarjeta de crédito'),
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
          tarjetaEducativa('canalapp', '📲', T('Cambiaste de canal'),
            T('Mandar por app cuesta 1% en vez de 4.5%. Sobre cada Q1,000 son Q35 que ya no se pierden.'),
            T('Suena a poco. En veinte años de mandar dinero cada mes, esa diferencia es el enganche de una casa.'));
        }
        return;
      }
      if (el.id === 'regresar') {
        var rg = Motor.regresar();
        if (!rg.ok) return aviso(T('Todavía no'), rg.razon);
        Motor.guardar(); render();
        return tarjetaEducativa('regreso', '🛬', T('Volviste a Guatemala'),
          T('Estuviste {0} meses fuera y trajiste {1}.', rg.meses, Q(rg.traido)),
          T('El dinero volvió contigo. Los años de historial crediticio local, no: tu puntaje se enfrió a la mitad y hay que reconstruirlo.'));
      }

      if (d.jugar) return jugarMinijuego(d.jugar);
      if (el.id === 'renunciar') { Motor.renunciar(); Motor.guardar(); return render(); }
      if (el.id === 'ver-glosario') return mostrarGlosario();
      if (el.id === 'ver-reporte') return mostrarReporte();
      if (el.id === 'ver-reporte-final') return mostrarReporteFinal(function () { render(); });

      if (el.id === 'adelantar') {
        var turnos = Motor.adelantar();
        if (!turnos.length) return;
        var ultimo = turnos[turnos.length - 1];
        var totalMeses = turnos.reduce(function (a, t) { return a + t.mesesCubiertos; }, 0);
        ultimo.eventos.unshift(T('Adelantaste {0} meses.', totalMeses));
        return procesarTurno(ultimo);
      }

      if (el.id === 'cerrar-turno') {
        if (Motor.espaciosLibres() === CONFIG.espaciosPorMes) {
          return aviso(T('No has hecho nada'), T('Asigna al menos una semana antes de cerrar.'));
        }
        return procesarTurno(Motor.cerrarTurno());
      }
    });
  }

  // =============== flujos de crédito ===============

  function flujoPrestamo() {
    var req = Motor.requisitoPrestamo();
    var maximo = Motor.montoMaximoPersonal();
    var e = Motor.get();
    if (!req.ok && !req.necesitaGarantia) return aviso(T('No calificas'), req.razon);

    var h = '<span class="icono">🏦</span><h2>' + T('Préstamo personal') + '</h2>';
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
          tarjetaEducativa('primercredito', '🏦', T('Tu primer crédito'),
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

    var h = '<span class="icono">' + casa.icono + '</span><h2>' + esc(D(casa, 'nombre')) + '</h2>';
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
      tarjetaEducativa('hipoteca', '🔑', T('Compraste tu casa'),
        T('Pusiste {0} de enganche y el banco te prestó {1}. Tu cuota es {2} por {3} años.',
          Q0(r.enganche), Q0(r.prestado), Q(r.cuota), plazoSel),
        T('La casa no es tuya el día que te dan las llaves. Es tuya el día que terminas de pagarla. Hasta entonces, dejar de pagar significa perderla y perder lo que ya pusiste.'));
    });
  }

  function flujoMigrar() {
    var e = Motor.get();
    var elegido = null, envio = MIGRACION.enviosSugeridos[1], canal = 'ventanilla';

    var h = '<span class="icono">✈️</span><h2>' + T('Irte a Estados Unidos') + '</h2>';
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
      h += '<div class="titulo">' + emp.icono + ' ' + esc(D(emp, 'nombre')) + '</div>';
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
        var hh = '<div class="tarjeta acento"><div class="titulo">' + emp.icono + ' ' +
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
            return modal('<span class="icono">🚧</span><h2>' + T('No lograste llegar') + '</h2><p>' +
              T('Te devolvieron. Perdiste los {0} del viaje y estás de vuelta donde empezaste, con menos.',
                Q0(MIGRACION.costoViaje)) + '</p>' +
              '<div class="aprendizaje">' +
              T('Casi uno de cada cinco intentos termina así. Es un riesgo que la gente rara vez pone en la cuenta antes de irse.') +
              '</div><button class="btn-primario" data-cerrar>' + T('Seguir') + '</button>');
          }
          tarjetaEducativa('migrar', '✈️', T('Te fuiste'),
            T('Estás en Estados Unidos trabajando. Mandas {0} de lo que te sobra cada mes.', pct(envio)),
            T('Aquí empieza el otro lado de la remesa. Fíjate cuánto llega de verdad a tu familia y cuánto se queda en el camino.'));
        });
      });
    });
  }

  function flujoInformal() {
    var c = CREDITOS.informal;
    var h = '<span class="icono">🚩</span><h2>' + T('Prestamista del barrio') + '</h2>';
    h += '<p>' + T('Presta a cualquiera, hoy mismo, sin papeles. Cobra veinte por ciento al mes.') + '</p>';
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
      tarjetaEducativa('informalcredito', '🚩', T('Le pediste al prestamista'),
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
        '<div style="font-size:52px">🪙</div>' +
        '<h1 style="font-size:26px;margin:8px 0 2px">Mi Primer Quetzal</h1>' +
        '<p class="sutil">' + T('De los 18 a la jubilación') + '</p>' +
        '<button class="btn-chico" data-idioma style="margin-top:10px">🌐 ' +
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
      h += '<div class="tarjeta"><p>' +
        T('Tienes 18 años, acabas de salir de diversificado y no tienes cuenta bancaria. De aquí a los 65, todo lo decides tú.') +
        '</p></div>';
      h += '<div class="btn-fila"><button class="btn-primario" data-nueva="1">' +
           T('Empezar') + '</button></div>';
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

  /* Dos preguntas antes de empezar: de dónde sales y en qué Guatemala te toca. */
  function flujoNuevaPartida(ranura) {
    var origenSel = null;

    var h = '<h2>' + T('¿De dónde sales?') + '</h2>';
    h += '<p class="sutil">' + T('No son niveles de dificultad. Son puntos de partida distintos, cada uno con su ventaja y su carga.') + '</p>';
    ORIGENES.forEach(function (o) {
      h += '<div class="opcion"><div class="titulo">' + o.icono + ' ' + esc(D(o, 'nombre')) + '</div>';
      h += '<p class="sutil" style="margin:6px 0">' + esc(D(o, 'descripcion')) + '</p>';
      h += fila(T('Empiezas con'), Q0(o.efectivoInicial));
      h += fila(T('Aportas en casa'), o.aporteCasa ? Q0(o.aporteCasa) + T(' al mes') : T('nada'));
      h += fila(T('Recibes remesas'), o.remesaActiva ? T('sí') : T('no'));
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
          '<div class="opcion"><div class="titulo">🏢 ' + T('Empleo formal urbano') + '</div>' +
          '<p class="sutil" style="margin:6px 0">' +
          T('Contrato, Bono 14, aguinaldo y seguro social. Puedes construir historial de crédito.') + '</p>' +
          '<button class="btn-chico" data-d="normal">' + T('Jugar así') + '</button></div>' +
          '<div class="opcion"><div class="titulo">🧰 ' + T('Economía informal') + '</div>' +
          '<p class="sutil" style="margin:6px 0">' +
          T('Sin contrato ni prestaciones, con ingresos más bajos. Es donde vive el 66% del país.') + '</p>' +
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
    tarjetaEducativa('bienvenida', '🪙', T('Cómo funciona'),
      T('Cada mes tienes cuatro semanas y decides en qué las usas. Al terminar el mes cobras, pagas tus gastos y el juego avanza. Después de los 30 los turnos se vuelven trimestres y luego años, para que puedas llegar hasta la jubilación.'),
      T('Empiezas guardando el dinero en efectivo. Fíjate cada mes cuánto se te va sin darte cuenta.'));
  }

  function iniciar() {
    app = document.querySelector('#app');
    try { document.documentElement.lang = Idioma.actual(); } catch (e) {}
    pantallaInicio();
  }

  return { iniciar: iniciar };
})();
