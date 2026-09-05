/* Mi Primer Quetzal — crédito
 *
 * Tasas reales del sistema bancario guatemalteco (ver investigacion, seccion 4):
 *   consumo 18.68% | tarjeta 45.84% (revolvente 51.9%, maxima publicada ~124% TEA)
 * No hay techo legal a las tasas en Guatemala.
 *
 * El prestamista informal es ESTIMACION. El credito informal (26.2% de la
 * poblacion) duplica al formal (15.5%), asi que es la opcion mas usada del pais.
 */

var CREDITOS = {

  personal: {
    id: 'personal',
    nombre: 'Préstamo personal',
    icono: '🏦',
    tasaAnual: 0.1868,
    plazos: [12, 24, 36],
    montoMinimo: 1000,
    // El monto maximo depende del puntaje: sin historial no te prestan casi nada
    montoPorPuntaje: function (p, ingresoMensual) {
      var factor = 0.5 + (p / 100) * 3.5;      // de 0.5 a 4 sueldos
      return Math.round((ingresoMensual * factor) / 500) * 500;
    },
    puntajeMinimo: 0,
    exigeFiadorBajo: 25,   // con puntaje menor a esto piden fiador o garantia
    descripcion: 'Cuotas fijas y tasa razonable. Necesitas que el banco confíe en ti.'
  },

  tarjeta: {
    id: 'tarjeta',
    nombre: 'Tarjeta de crédito',
    icono: '💳',
    tasaAnual: 0.4584,
    pagoMinimoPorcentaje: 0.05,
    limitePorPuntaje: function (p, ingresoMensual) {
      if (p < 20) return 0;
      return Math.round((ingresoMensual * (0.3 + (p / 100) * 1.2)) / 100) * 100;
    },
    puntajeMinimo: 20,
    descripcion: 'Compras hoy y decides cuánto pagas. Ahí está la trampa.'
  },

  informal: {
    id: 'informal',
    nombre: 'Prestamista del barrio',
    icono: '🚩',
    tasaMensual: 0.20,          // ESTIMACION: ~792% anual
    plazos: [3, 6],
    montoMinimo: 500,
    montoMaximo: 5000,
    puntajeMinimo: null,        // no pregunta nada
    sinRequisitos: true,
    descripcion: 'Presta a cualquiera, hoy mismo, sin papeles. Cobra veinte por ciento al mes.'
  }
};

/* Puntaje de crédito, de 0 a 100.
 *
 * Regla clave: NO sube por no endeudarse. Quien nunca pide nada tampoco
 * construye historial, y ese es uno de los malentendidos mas caros que existen.
 */
var PUNTAJE = {
  inicial: 0,
  maximo: 100,
  porCuotaPagadaATiempo: 2.5,
  porMesConCreditoSano: 0.4,
  porMora: -14,
  porMoraProlongada: -25,     // tres meses o mas de atraso
  porCreditoLiquidado: 6,
  porUsarPrestamista: -3,     // el informal no construye nada y te desgasta
  decaimientoSinHistorial: 0, // no baja solo, pero tampoco sube
  // Tramos que ve el jugador
  tramos: [
    { min: 0,  hasta: 1,   nombre: 'Sin historial',   clase: 'alerta', nota: 'El banco no sabe quién eres.' },
    { min: 1,  hasta: 25,  nombre: 'En construcción', clase: '',       nota: 'Te piden fiador o garantía.' },
    { min: 25, hasta: 50,  nombre: 'Aceptable',       clase: '',       nota: 'Ya calificas solo.' },
    { min: 50, hasta: 75,  nombre: 'Bueno',           clase: 'ok',     nota: 'Montos mayores y mejores tasas.' },
    { min: 75, hasta: 101, nombre: 'Excelente',       clase: 'ok',     nota: 'El banco te busca a ti.' }
  ]
};

/* El fiador. La investigacion tumbo la idea de que el credito se niega por caro:
 * se niega por falta de fiador. Aqui la reputacion se construye jugando.
 */
var FIADOR = {
  // Reputacion familiar: sube si aportas a la casa sin fallar, baja si debes
  reputacionInicial: 30,
  maxima: 100,
  porMesSinDeudaHogar: 1.2,
  porMesConDeudaHogar: -4,
  porAnioEnMismoEmpleo: 8,
  umbralParaConseguirFiador: 55,
  // Alternativa: dejar dinero en garantia y te prestan contra el
  garantia: {
    porcentajeDelPrestamo: 1.0, // dejas depositado el mismo monto que pides
    nombre: 'Crédito con garantía de depósito',
    nota: 'Dejas tu ahorro congelado y el banco te presta contra él. Es la forma más común de empezar a construir historial.'
  }
};
