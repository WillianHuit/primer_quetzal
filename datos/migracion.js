/* Mi Primer Quetzal — la ruta migratoria
 *
 * El otro lado de la remesa. En la version 1 el jugador solo recibia; aqui
 * puede irse y ser quien manda.
 *
 * Se modela con honestidad, sin romantizarla ni convertirla en castigo:
 * se gana mucho mas en dolares, se gasta mucho mas, no construyes historial
 * en Guatemala, y cada envio pierde comision. Al volver, el capital vale
 * muchisimo aqui, pero perdiste años de historial y de carrera local.
 *
 * Datos que la sostienen: las remesas son el 20.7% del PIB de Guatemala y el
 * 71.7% se cobra en efectivo en ventanilla. El emisor casi nunca sabe cuanto
 * pierde en comisiones a lo largo de los años.
 */

var MIGRACION = {
  edadMinima: 20,
  edadMaxima: 45,

  // Lo que cuesta irse. Casi nadie lo paga de contado.
  //
  // [V] OIM, Encuesta sobre Migracion Internacional de Personas Guatemaltecas y
  // Remesas 2022: el credito promedio contraido para el viaje es de Q125,000, y
  // el 87.6% de los migrantes viaja con coyote. La prensa reporta casos de
  // Q100,000 a Q200,000.
  costoViaje: 125000,
  // [V] Misma encuesta: solo el 78.7% llego en un viaje. El 14.9% necesito dos,
  // el 4.6% tres y el 1.8% cuatro o mas. Fracasar no borra la deuda.
  riesgoFracaso: 0.21,

  // Trabajos disponibles allá, en dólares al mes
  empleos: [
    { id: 'construccion_us', nombre: 'Construcción', icono: 'martillo',
      sueldoDolares: 2600, varianza: 0.15, requisito: 'primaria',
      descripcion: 'Duro y bien pagado. Sin papeles, sin protección.' },
    { id: 'restaurante_us', nombre: 'Cocina en restaurante', icono: 'sarten',
      sueldoDolares: 2300, varianza: 0.08, requisito: 'primaria',
      descripcion: 'Turnos largos y estables.' },
    { id: 'limpieza_us', nombre: 'Limpieza', icono: 'escoba',
      sueldoDolares: 2000, varianza: 0.10, requisito: 'primaria',
      descripcion: 'Lo más fácil de conseguir al llegar.' },
    { id: 'tecnico_us', nombre: 'Técnico especializado', icono: 'engranaje',
      sueldoDolares: 3800, varianza: 0.10, requisito: 'tecnico',
      descripcion: 'Tu título vale allá. No todos pueden entrar aquí.' }
  ],

  // Vivir allá cuesta caro. Esto es lo que se va cada mes, en dólares.
  costoVidaDolares: 1350,     // ESTIMACION: cuarto compartido, comida, transporte

  // Cuánto de lo que te queda mandas a casa. Lo decide el jugador.
  enviosSugeridos: [0.20, 0.40, 0.60],

  // Comisiones reales por enviar dinero a Guatemala
  canales: {
    ventanilla: { nombre: 'Ventanilla tradicional', comision: 0.045,
                  nota: 'Rápido y caro. Es lo que usa la mayoría.' },
    app:        { nombre: 'App de envío', comision: 0.010,
                  nota: 'Diez veces más barato. Hay que tener cuenta de los dos lados.' }
  },

  // Al volver, esto es lo que te llevas y lo que perdiste
  regreso: {
    edadMinimaRegreso: 25,
    penalizacionHistorial: 0.5, // tu puntaje local se enfría a la mitad
    nota: 'El dinero vuelve contigo. Los años de historial crediticio local, no.'
  },

  leccion: 'Mandar dinero por ventanilla en vez de por app cuesta cerca de 3.5% de cada ' +
           'envío. En veinte años de mandar, esa diferencia es una casa.'
};
