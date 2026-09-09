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

  /* El juego empieza en el momento en que la decision todavia existe.
   *
   * Antes arrancaba a los 18 con el bachillerato ya en la mano, o sea con la
   * decision mas importante de la vida financiera ya tomada por el juego. Ahora
   * arranca a los 13, saliendo de primaria, y la primera pantalla es justo esa:
   * estudias o no estudias. Todo lo demas se abre despues.
   */
  inicio: {
    edad: 13,
    anioCalendario: 2026,
    mesCalendario: 0,        // 0 = enero
    energia: 100,
    educacion: 'primaria',
    vivienda: 'familiar'
  },

  /* Ser menor de edad cambia el juego entero: en casa te cubren, no te pueden
   * dar un contrato formal y el banco te pide un adulto para abrir la cuenta.
   * Al cumplir esta edad se te cae encima el gasto completo de la casa, y ese
   * golpe es a proposito. */
  mayoriaDeEdad: 18,
  menor: {
    // Lo unico que gasta de su bolsa un chico que vive en su casa
    gastoPersonal: 20,       // ESTIMACION: pasaje y refaccion
    // Debajo de esta edad no le caen golpes de dinero: los absorbe la familia
    edadPrimerosGolpes: 18
  },

  energia: {
    maxima: 100,
    umbralRiesgo: 20,        // debajo de esto puede enfermarse
    costoEnfermedad: 450,    // ESTIMACION
    // Por JORNADA, o sea la mitad de lo que costaba una semana entera
    porEspacio: {
      trabajo: -6,
      // Atender tu propio negocio cansa igual que atender el de otro
      negocio: -6,
      estudio: -5,
      // Una tarea cansa como estudiar, porque es estudiar
      tarea: -5,
      'tarea-usada': -5,
      minijuego: -6,
      'minijuego-usado': -6,
      descanso: 22
    }
  },

  /* Cuanto del salario cobras segun cuantas JORNADAS trabajaste.
   *
   * El mes tiene cuatro semanas y cada semana tiene dos jornadas, manana y
   * tarde: ocho casillas. Se parte asi porque los colegios de Guatemala son de
   * jornada, no de dia completo, y el chico que estudia por la manana puede
   * trabajar por la tarde. Esa es la decision que antes el juego no dejaba
   * tomar.
   *
   * Los numeros pares son los mismos de cuando esto se contaba por semanas
   * (8 = 1.00, 6 = 0.70, 4 = 0.45, 2 = 0.20), asi que el balanceo no se movio.
   */
  pagoPorJornadasTrabajadas: {
    8: 1.00, 7: 0.85, 6: 0.70, 5: 0.57, 4: 0.45, 3: 0.33, 2: 0.20, 1: 0.10
  },

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
      // [V-sec] Mediana de los anuncios de alquiler de cuartos en la capital,
      // septiembre 2026: Q1,800, con rango de Q850 en Mixco a Q4,500 en zona 10.
      // La Camara Guatemalteca de la Construccion habla de "un alquiler promedio
      // entre Q1,800 y Q2,500". El juego usa el piso de ese rango.
      renta: 1800,
      serviciosComida: 950,  // canasta basica alimentaria urbana: Q945.74
      personal: 1100,        // ESTIMACION
      requisitoIngreso: 4800 // sube con la renta: el gasto del cuarto ya es Q3,850
    },
    apartamento: {
      nombre: 'Apartamento propio',
      descripcion: 'Tu espacio. Cuesta.',
      // [V-sec] Apartamento de un dormitorio FUERA del centro, Numbeo sept 2026:
      // Q3,960. La mediana de anuncios en zonas no premium da Q4,475 y en zonas
      // 10, 14, 15 y 16 se dispara a Q6,101. El juego usa el caso modesto.
      renta: 4000,
      // ESTIMACION del reparto: servicios reales rondan Q610 al mes (luz Q180 con
      // la tarifa social de Q1.42/kWh, agua Q110, gas Q90, internet Q230), el
      // resto es comida.
      serviciosComida: 1400,
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
      // Un menor abre cuenta con un adulto, y con mucho menos dinero. Los
      // bancos guatemaltecos tienen cuentas infantiles desde Q25 o Q50.
      aperturaMinimaMenor: 50,
      /* Manejo de cuenta: lo que el banco cobra al mes por tenerla abierta.
       *
       * ESTIMACION dentro del rango real, que anda entre Q10 y Q15 segun el
       * banco. Y el detalle que casi nadie sabe hasta que lo ve en el estado
       * de cuenta: si tu sueldo lo deposita una EMPRESA, no te lo cobran; si
       * la cuenta es tuya y nadie te acredita planilla, si.
       *
       * Es la unica forma honesta de que abrir un producto que todavia no
       * necesitas tenga un costo, en vez de ser gratis y por lo tanto obvio. */
      manejoMensual: 12,
      manejoGratisConPlanilla: true,
      descripcion: 'Para recibir tu sueldo de una empresa, pagar y mover dinero. Casi no paga intereses.'
    },
    ahorro: {
      nombre: 'Cuenta de ahorro',
      tasaAnual: 0.0265,
      aperturaMinima: 100,
      aperturaMinimaMenor: 25,
      // La de ahorro no cobra manejo: es la que un menor abre de verdad
      manejoMensual: 0,
      descripcion: 'Para apartar dinero con proposito. Paga mas que la monetaria y no cobra manejo.'
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
  /* -------------------------------------------------------------------------
   * La experiencia de estudio
   * -------------------------------------------------------------------------
   * No es dinero: es lo que abren las TAREAS del colegio y lo que piden las
   * carreras mas exigentes. Los dos numeros de aqui son los que deciden si la
   * mecanica es una meta o un muro, asi que conviene entender la cuenta.
   *
   *   porMesInscrito   sentarse en clase ya ensena algo. Basicos son 36 meses,
   *                    asi que dan 108 de experiencia sin hacer una sola
   *                    tarea, y el bachillerato otros 72. Con eso el camino
   *                    normal llega SIEMPRE a las carreras del medio y nunca
   *                    se queda trabado.
   *   maximaPorTarea   una tarea bien hecha vale como ocho meses de estar
   *                    sentado. Es lo que hace que valga la jornada que
   *                    cuesta, y lo que abre ingenieria y la maestria, que el
   *                    camino pasivo NO alcanza. Ahi esta la decision.
   *   tareasPorMes     cuantas tareas te deja el colegio cada mes. Es lo unico
   *                    que el juego le pide mientras el jugador solo estudia,
   *                    y sale como "Tareas pendientes: 1" en la franja de la
   *                    calle. NO es una obligacion: nadie castiga por dejarla,
   *                    la cuenta la pasa despues la carrera que pide
   *                    experiencia que no tienes. Subirlo a 2 hace el colegio
   *                    mas exigente sin tocar una linea de codigo.
   */
  experiencia: {
    porMesInscrito: 3,
    maximaPorTarea: 25,
    tareasPorMes: 1
  },

  prestaciones: {
    bono14Mes: 6,        // julio
    aguinaldoMes1: 11,   // diciembre, primera mitad
    aguinaldoMes2: 0     // enero, segunda mitad
  },

  dificultad: {
    normal:  { nombre: 'Empleo formal urbano', multiplicadorSalario: 1.00, permiteFormal: true },
    dificil: { nombre: 'Economia informal',    multiplicadorSalario: 0.65, permiteFormal: false }
  },

  /* El informal gana un poco mas por pago y bastante menos al anio.
   *
   * El 15% que habia aqui era estimacion y era demasiado. Con 14 pagos al anio
   * para el formal y 12 para el informal, un 15% dejaba los dos casi empatados
   * (14 contra 13.8 sueldos), o sea que la informalidad no costaba nada.
   *
   * Lo unico que un informal se ahorra de verdad EN EL MISMO PUESTO es el
   * descuento del IGSS que le harian al formal: [V-sec] 4.83% del salario a
   * cargo del trabajador. Ese es el numero honesto.
   *
   * Resultado: el informal se queda con 12 x 1.05 = 12.6 sueldos contra 14 del
   * formal, un 10% menos al anio, ademas de quedarse sin seguro y sin historial.
   *
   * OJO con no confundir esto con la brecha poblacional. Los microdatos de la
   * ENEIC IV-2025 del INE dan un ingreso medio de Q4,347.8 para los formales y
   * Q1,977.3 para los informales, o sea que el informal gana el 45.5% del
   * formal. Pero esa brecha compara PUESTOS DISTINTOS, y el juego ya la modela
   * aparte con el selector de dificultad. Aplicarla aqui la contaria dos veces.
   */
  primaInformalidad: 0.05,

  // Cuatro semanas de dos jornadas cada una
  jornadasPorMes: 8,
  jornadasPorSemana: 2,

  /* Compresion temporal.
   * De los 13 a los 65 hay 624 meses. En turnos mensuales serian mas de tres
   * horas de juego en un celular y nadie llegaria al reporte de jubilacion.
   * Los años que definen todo se juegan mes a mes; los de ejecucion, no.
   */
  tiempo: {
    /* El primer anio va mes a mes y de ahi en adelante por trimestres.
     *
     * Antes los nueve anios de 13 a 22 eran mensuales: 108 turnos solo para
     * salir del colegio, y la eleccion de diversificado —que es la decision
     * mas grande de esa etapa— quedaba a tres horas de juego. Nadie llegaba.
     *
     * El corte esta a los 14 y no antes porque el primer anio es donde se
     * aprende a jugar: el tutorial, la primera tarea, el primer trabajito. Eso
     * se vive mes a mes o no se vive. De los 14 en adelante el turno es un
     * trimestre, que ademas es como se vive el colegio de verdad —por
     * bimestres y notas— y las edades siguen siendo las reales: basicos
     * termina a los 16 y el diversificado a los 18. */
    etapas: [
      { hastaEdad: 14, mesesPorTurno: 1,  turno: 'mes',       plural: 'meses' },
      { hastaEdad: 45, mesesPorTurno: 3,  turno: 'trimestre', plural: 'trimestres' },
      { hastaEdad: 999, mesesPorTurno: 12, turno: 'año',       plural: 'años' }
    ],
    edadJubilacion: 65
  },

  // El primer año es tranquilo: sin eventos malos y con mas explicaciones.
  mesesDeGracia: 12
};
