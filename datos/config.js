/* Mi Primer Quetzal — parámetros de la economía
 *
 * Este archivo se puede editar sin saber programar. Cambia los números y
 * recarga el juego. No borres las comas ni las llaves.
 *
 * Fuente de las cifras verificadas: docs/investigacion-economia-guatemala.md
 * Las marcadas ESTIMACION necesitan validación.
 */

var CONFIG = {

  tipoCambio: 7.70, // quetzales por dolar

  inicio: {
    edad: 18,
    anioCalendario: 2026,
    mesCalendario: 0,        // 0 = enero
    efectivo: 1200,          // ESTIMACION: regalo de graduacion
    energia: 100,
    educacion: 'bachiller',
    vivienda: 'familiar'
  },

  energia: {
    maxima: 100,
    umbralRiesgo: 20,        // debajo de esto puede enfermarse
    costoEnfermedad: 450,    // ESTIMACION
    porEspacio: {
      trabajo: -12,
      estudio: -10,
      minijuego: -12,
      'minijuego-usado': -12,
      descanso: 45
    }
  },

  // Cuanto del salario cobras segun cuantas semanas trabajaste.
  // Cuatro semanas es tiempo completo. Menos semanas es menos sueldo, y esa
  // es la tension central del juego: estudiar y descansar cuestan dinero.
  pagoPorSemanasTrabajadas: { 4: 1.00, 3: 0.70, 2: 0.45, 1: 0.20 },

  // La vivienda es decision del jugador. Servicios, comida y gasto personal
  // son automaticos y escalan con la vivienda elegida.
  //
  // Calibracion: con la casa familiar y un sueldo de Q3,000 el jugador debe
  // poder ahorrar entre Q300 y Q800 al mes, que es la capacidad real de un
  // joven capitalino segun la investigacion.
  vivienda: {
    familiar: {
      nombre: 'Casa familiar',
      descripcion: 'Vives con tu familia y aportas al gasto.',
      renta: 400,            // ESTIMACION: aporte a la casa
      serviciosComida: 700,  // ESTIMACION
      personal: 1100,        // ESTIMACION: transporte, celular, ropa, salidas
      requisitoIngreso: 0
    },
    cuarto: {
      nombre: 'Cuarto compartido',
      descripcion: 'Independencia, pero pagas todo.',
      renta: 1200,           // ESTIMACION
      serviciosComida: 950,  // canasta basica alimentaria urbana: Q945.74
      personal: 1100,        // ESTIMACION
      requisitoIngreso: 4000
    },
    apartamento: {
      nombre: 'Apartamento propio',
      descripcion: 'Tu espacio. Cuesta.',
      renta: 2800,           // ESTIMACION
      serviciosComida: 1400, // ESTIMACION
      personal: 1300,        // ESTIMACION
      requisitoIngreso: 7500
    }
  },

  // Tasas anuales reales del sistema bancario guatemalteco
  productos: {
    monetaria: {
      nombre: 'Cuenta monetaria',
      tasaAnual: 0.0127,
      aperturaMinima: 200,
      descripcion: 'Para operar: recibir tu salario, pagar y mover dinero. Casi no paga intereses.'
    },
    ahorro: {
      nombre: 'Cuenta de ahorro',
      tasaAnual: 0.0265,
      aperturaMinima: 100,
      descripcion: 'Para apartar dinero con proposito. Paga mas que la monetaria.'
    },
    plazo: {
      nombre: 'Deposito a plazo',
      tasaAnual: 0.0635,
      aperturaMinima: 5000,
      descripcion: 'Dejas el dinero quieto un tiempo y rinde mucho mas.'
    }
  },

  impuestoSobreIntereses: 0.10, // ISR del 10% sobre intereses ganados

  // El efectivo en la mano se va solo. Es una de las tres razones para
  // abrir una cuenta.
  efectivo: {
    fugaMensual: 0.08,         // ESTIMACION: gastos hormiga
    fugaMaxima: 400,           // tope: nadie se gasta en dulces el 8% de un ahorro grande
    probabilidadPerdida: 0.02, // ESTIMACION: robo o emergencia familiar
    perdidaPorcentaje: 0.40
  },

  remesa: {
    activa: true,
    mesesEntreEnvios: [2, 3],
    montoDolares: [150, 200],
    comisiones: {
      ventanilla: { nombre: 'Ventanilla tradicional', comision: 0.045, nota: 'Rapido, caro. Lo usa el 71.7% de la gente.' },
      banco:      { nombre: 'A tu cuenta bancaria',   comision: 0.020, nota: 'Necesitas cuenta. Mas barato.' },
      app:        { nombre: 'App de envio',           comision: 0.010, nota: 'Lo mas barato. Necesitas cuenta.' }
    }
  },

  // El año laboral guatemalteco tiene 14 pagos
  prestaciones: {
    bono14Mes: 6,        // julio
    aguinaldoMes1: 11,   // diciembre, primera mitad
    aguinaldoMes2: 0     // enero, segunda mitad
  },

  dificultad: {
    normal:  { nombre: 'Empleo formal urbano', multiplicadorSalario: 1.00, permiteFormal: true },
    dificil: { nombre: 'Economia informal',    multiplicadorSalario: 0.65, permiteFormal: false }
  },

  // El informal gana mas hoy y menos toda la vida
  primaInformalidad: 0.15, // ESTIMACION

  espaciosPorMes: 4,

  /* Compresion temporal.
   * De los 18 a los 65 hay 564 meses. En turnos mensuales serian mas de tres
   * horas de juego en un celular y nadie llegaria al reporte de jubilacion.
   * Los años que definen todo se juegan mes a mes; los de ejecucion, no.
   */
  tiempo: {
    etapas: [
      { hastaEdad: 30, mesesPorTurno: 1,  turno: 'mes',       plural: 'meses' },
      { hastaEdad: 45, mesesPorTurno: 3,  turno: 'trimestre', plural: 'trimestres' },
      { hastaEdad: 999, mesesPorTurno: 12, turno: 'año',       plural: 'años' }
    ],
    edadJubilacion: 65,
    // Cuantos turnos como maximo salta el boton de adelantar antes de parar
    maxTurnosAdelantar: 24
  },

  // El primer año es tranquilo: sin eventos malos y con mas explicaciones.
  mesesDeGracia: 12
};
