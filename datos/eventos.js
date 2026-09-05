/* Mi Primer Quetzal — eventos de vida y promociones
 *
 * Azar moderado. La probabilidad y el daño bajan de forma visible si el
 * jugador tomo precauciones, que es lo que le da razon de ser al fondo de
 * emergencia.
 *
 * Campos:
 *   prob        probabilidad base por mes
 *   requiere    funcion opcional: solo aparece si devuelve true
 *   mitigado    funcion opcional: si devuelve true, el daño se reduce
 *   aplicar     que le hace al jugador. Devuelve texto para la bitacora.
 */

var EVENTOS = [

  // ---------- golpes ----------
  {
    id: 'diente',
    titulo: 'Te duele una muela',
    icono: '🦷',
    tipo: 'malo',
    prob: 0.035,
    monto: 900,
    texto: 'Llevabas semanas aguantando. El dentista cobra Q900 y no hay forma de posponerlo más.'
  },
  {
    id: 'celular',
    titulo: 'Se te quebró el celular',
    icono: '📱',
    tipo: 'malo',
    prob: 0.030,
    monto: 1100,
    texto: 'Se te cayó y la pantalla quedó inservible. Sin celular no te contactan del trabajo.'
  },
  {
    id: 'familia',
    titulo: 'Emergencia en la familia',
    icono: '🏥',
    tipo: 'malo',
    prob: 0.025,
    monto: 2200,
    texto: 'Tu mamá se enfermó y en la familia te toca a ti poner la mayor parte.'
  },
  {
    id: 'moto',
    titulo: 'Se descompuso el transporte',
    icono: '🛠️',
    tipo: 'malo',
    prob: 0.030,
    monto: 1400,
    texto: 'El taller pide Q1,400. Sin transporte llegas tarde y te descuentan.'
  },
  {
    id: 'robo',
    titulo: 'Te robaron en la calle',
    icono: '😰',
    tipo: 'malo',
    prob: 0.020,
    soloEfectivo: true,
    texto: 'Te asaltaron saliendo del trabajo. Se llevaron lo que cargabas encima.'
  },

  // ---------- oportunidades ----------
  {
    id: 'horas',
    titulo: 'Te ofrecen horas extra',
    icono: '⏰',
    tipo: 'bueno',
    prob: 0.055,
    requiereEmpleo: true,
    texto: 'Hay trabajo de más este mes. Pagan aparte pero te va a costar energía.',
    opciones: [
      { etiqueta: 'Aceptar', bonoSalario: 0.30, energia: -20 },
      { etiqueta: 'Pasar', nada: true }
    ]
  },
  {
    id: 'venta',
    titulo: 'Vendes algo que ya no usabas',
    icono: '📦',
    tipo: 'bueno',
    prob: 0.035,
    monto: 600,
    texto: 'Sacaste cosas viejas y alguien te las compró.'
  },
  {
    id: 'remesaextra',
    titulo: 'Tu hermano manda extra',
    icono: '💵',
    tipo: 'bueno',
    prob: 0.025,
    montoDolares: 300,
    requiereRemesa: true,   // solo si tu origen tiene a alguien mandando de fuera
    texto: 'Le fue bien este mes y quiso mandar más de lo normal.'
  },

  // ---------- estafas ----------
  {
    id: 'estafa',
    titulo: 'Un mensaje sospechoso',
    icono: '⚠️',
    tipo: 'trampa',
    prob: 0.045,
    texto: 'Te llega un mensaje: "Banco Cardamomo: su cuenta será bloqueada. Confirme sus datos aquí." ' +
           'Se ve casi igual a los mensajes del banco.',
    opciones: [
      { etiqueta: 'Confirmar mis datos', perderPorcentajeCuentas: 0.35, esError: true,
        resultado: 'Era una estafa. Vaciaron parte de tus cuentas antes de que te dieras cuenta.' },
      { etiqueta: 'Ignorarlo y llamar al banco', nada: true,
        resultado: 'Hiciste bien. El banco nunca pide tus datos por mensaje.' }
    ],
    leccion: 'Ningún banco te va a pedir tu contraseña ni tu clave por mensaje o llamada. Si te apuran, es estafa.'
  }
];

/* Promociones del Banco Cardamomo.
 * Son mixtas a proposito: unas son buena oferta y otras son trampa disfrazada
 * de premio. Enseñar a leer una promocion vale mas que enseñar a aprovecharla.
 */
var PROMOCIONES = [
  {
    id: 'tasaahorro',
    titulo: 'Tasa preferencial de ahorro',
    icono: '🎉',
    honesta: true,
    prob: 0.03,
    requiereAhorro: true,
    texto: 'Por seis meses tu cuenta de ahorro paga 4.50% en vez de 2.65%. Sin condiciones escondidas.',
    letraChica: 'Aplica sobre el saldo promedio. Al terminar el plazo vuelve a la tasa normal.',
    efecto: { tasaAhorroTemporal: 0.045, meses: 6 }
  },
  {
    id: 'limite',
    titulo: '¡Felicidades! Subimos tu límite',
    icono: '🎈',
    honesta: false,
    prob: 0.05,
    requiereTarjeta: true,
    texto: 'Por tu buen comportamiento aumentamos el límite de tu tarjeta en 60%.',
    letraChica: 'Un límite mayor no es un premio ni es dinero tuyo. Es más deuda posible a 45.84% anual.',
    opciones: [
      { etiqueta: 'Aceptar el aumento', subirLimite: 0.60 },
      { etiqueta: 'Dejarlo como está', nada: true }
    ],
    leccion: 'Que te suban el límite no significa que ganaste más. Significa que pueden prestarte más caro.'
  },
  {
    id: 'mesessin',
    titulo: 'Doce meses sin intereses',
    icono: '🏷️',
    honesta: false,
    prob: 0.04,
    requiereTarjeta: true,
    texto: 'Compra ahora y paga en doce cuotas sin intereses.',
    letraChica: 'Sin intereses, pero con comisión de apertura del 5% y seguro mensual obligatorio. ' +
                'El costo real ronda el 14% anual, no cero.',
    leccion: 'Cero intereses casi nunca es cero costo. Busca la comisión y el seguro antes de firmar.'
  },
  {
    id: 'seguro',
    titulo: 'Seguro de vida incluido',
    icono: '📄',
    honesta: false,
    prob: 0.035,
    requiereCuenta: true,
    texto: 'Activamos tu seguro de vida sin costo el primer mes.',
    letraChica: 'A partir del segundo mes se cobra Q75 mensuales de tu cuenta, salvo que lo canceles tú.',
    opciones: [
      { etiqueta: 'Dejarlo activo', cargoMensual: 75 },
      { etiqueta: 'Cancelarlo ya', nada: true }
    ],
    leccion: 'Lo que se activa solo también se cobra solo. Revisa tu estado de cuenta cada mes.'
  },
  {
    id: 'plazo',
    titulo: 'Depósito a plazo con tasa especial',
    icono: '📈',
    honesta: true,
    prob: 0.03,
    requiereAhorro: true,
    texto: 'Si dejas Q5,000 quietos por un año, te pagan 7.25% en vez de 6.35%.',
    letraChica: 'Si sacas el dinero antes del año, pierdes el rendimiento acumulado.',
    efecto: { tasaPlazoTemporal: 0.0725, meses: 12 }
  }
];
