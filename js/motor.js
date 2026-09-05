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
      estudio: null,          // { carreraId, mesesAvanzados, privada }
      carrerasTerminadas: [],
      vivienda: CONFIG.inicio.vivienda,

      empleo: null,
      espacios: ['', '', '', ''],
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
      vistos: {},
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

  function salarioEsperado(trabajo, formal) {
    var mult = CONFIG.dificultad[estado.dificultad].multiplicadorSalario;
    var base = trabajo.salarioBase * mult * multiplicadorMercado(trabajo.id);
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

    var v = CONFIG.vivienda[estado.vivienda];
    // El aporte a la casa familiar depende del origen del personaje
    var renta = estado.vivienda === 'familiar'
      ? (estado.aporteCasa !== undefined ? estado.aporteCasa : v.renta)
      : v.renta;
    return renta + v.serviciosComida + v.personal + extra;
  }

  function proporcionPago(semanas) { return CONFIG.pagoPorSemanasTrabajadas[semanas] || 0; }

  function espaciosUsados(tipo) {
    var n = 0;
    for (var i = 0; i < estado.espacios.length; i++) if (estado.espacios[i] === tipo) n++;
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

  function tasaAhorroVigente() {
    for (var i = 0; i < estado.promosActivas.length; i++) {
      var e = estado.promosActivas[i].efecto;
      if (e && e.tasaAhorroTemporal) return e.tasaAhorroTemporal;
    }
    return CONFIG.productos.ahorro.tasaAnual;
  }

  // ---------- acciones del jugador ----------

  function asignarEspacio(i, tipo) { estado.espacios[i] = tipo; }
  function limpiarEspacios() { estado.espacios = ['', '', '', '']; }

  function tomarTrabajo(id, formal) {
    estado.empleo = { id: id, formal: !!formal, mesesEnPuesto: 0 };
  }
  function renunciar() { estado.empleo = null; }

  function inscribirse(carreraId, privada) {
    var c = buscarPorId(CARRERAS, carreraId);
    if (!c) return { ok: false, razon: 'Esa carrera no existe.' };
    if (nivelIndice(estado.educacion) < nivelIndice(c.requiere)) {
      return { ok: false, razon: 'Primero necesitas nivel ' + c.requiere + '.' };
    }
    if (nivelIndice(estado.educacion) >= nivelIndice(c.nivelQueOtorga)) {
      return { ok: false, razon: 'Ya tienes ese nivel o uno mayor.' };
    }
    estado.estudio = { carreraId: carreraId, mesesAvanzados: 0, privada: !!privada };
    return { ok: true };
  }

  function abandonarEstudio() { estado.estudio = null; }

  function abrirCuenta(tipo, monto) {
    var p = CONFIG.productos[tipo];
    if (monto < p.aperturaMinima) return { ok: false, razon: 'El mínimo de apertura es Q' + p.aperturaMinima + '.' };
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

    // --- energia ---
    for (var i = 0; i < estado.espacios.length; i++) {
      var tipo = estado.espacios[i];
      if (tipo && CONFIG.energia.porEspacio[tipo] !== undefined) {
        estado.energia += CONFIG.energia.porEspacio[tipo];
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
      estado.estudio.mesesAvanzados += espEstudio * AVANCE_POR_SEMANA_ESTUDIO;
      estado.totales.mesesEstudiando++;
      m.colegiatura += costoMensualEstudio();
      if (estado.estudio.mesesAvanzados >= carrera.mesesRequeridos) {
        estado.educacion = carrera.nivelQueOtorga;
        estado.carrerasTerminadas.push(carrera.id);
        m.eventos.push('¡Te graduaste de ' + carrera.nombre + '!');
        m.graduacion = carrera.id;
        estado.estudio = null;
      }
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
      var pago = redondear(bruto * ruido * proporcionPago(espTrabajo));
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
    if (CONFIG.remesa.activa && estado.remesaActiva && !estado.migracion) {
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
    var porPagar = gastoVivienda + costoMensualEstudio() + estado.deudaHogar;
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

  // Resuelve la opcion que el jugador eligio en una tarjeta de decision.
  function aplicarDecision(clase, id, indiceOpcion) {
    var fuente = clase === 'promo' ? PROMOCIONES : EVENTOS;
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
      estado.cargosRecurrentes.push({ nombre: 'Seguro de vida', monto: op.cargoMensual });
      texto += ' Se te va a cobrar Q' + op.cargoMensual + ' cada mes.';
    }
    guardar();
    return { texto: texto };
  }

  // ---------- cierre de turno ----------

  function turnoVacio() {
    return {
      mes: MESES[estado.mes], anio: estado.anio, edad: estado.edad,
      etapa: etapaActual().turno, mesesCubiertos: mesesDelTurno(),
      salario: 0, bono: 0, remesa: 0, comisionRemesa: 0, extras: 0,
      vivienda: 0, colegiatura: 0, fuga: 0, intereses: 0, isr: 0,
      enfermedad: 0, perdidaEfectivo: 0, imprevistos: 0,
      cuotasPagadas: 0, interesesPagados: 0, pagoTarjeta: 0,
      cuotaHipoteca: 0, aportePension: 0, rendimientoPension: 0,
      enviado: 0, comisionEnvio: 0, viviendaYaCubierta: false,
      deudaHogar: 0, mora: false, embargo: false, hipotecaLiquidada: false,
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
      // repite la ultima asignacion de espacios
      var t = trabajoActual();
      for (var j = 0; j < CONFIG.espaciosPorMes; j++) {
        estado.espacios[j] = (t && j < 3) ? 'trabajo' : 'descanso';
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

  return {
    iniciar: iniciar, cargar: cargar, guardar: guardar, borrar: borrar,
    ranuras: ranuras, ranuraActiva: function () { return ranuraActiva; },
    archivarPartida: archivarPartida, historial: historial,
    exportar: exportar, importar: importar,

    cerrarTurno: cerrarTurno, adelantar: adelantar, aplicarDecision: aplicarDecision,
    asignarEspacio: asignarEspacio, limpiarEspacios: limpiarEspacios,

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
    espaciosUsados: espaciosUsados, espaciosLibres: espaciosLibres,
    tramoPuntaje: tramoPuntaje, tieneFiador: tieneFiador,
    requisitoPrestamo: requisitoPrestamo, montoMaximoPersonal: montoMaximoPersonal,
    limiteTarjeta: limiteTarjeta, cuotaMensual: cuotaMensual,
    multiplicadorMercado: multiplicadorMercado, etapaActual: etapaActual,
    mesesDelTurno: mesesDelTurno, enGracia: enGracia, reporte: reporte,
    nombreMes: function (i) { return MESES[i]; },
    get: function () { return estado; }
  };
})();
