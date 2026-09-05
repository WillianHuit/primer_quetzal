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
  costoViaje: 65000,          // ESTIMACION: es la cifra que empuja a endeudarse
  riesgoFracaso: 0.18,        // ESTIMACION: te devuelven y pierdes lo invertido

  // Trabajos disponibles allá, en dólares al mes
  empleos: [
    { id: 'construccion_us', nombre: 'Construcción', icono: '🔨',
      sueldoDolares: 2600, varianza: 0.15, requisito: 'bachiller',
      descripcion: 'Duro y bien pagado. Sin papeles, sin protección.' },
    { id: 'restaurante_us', nombre: 'Cocina en restaurante', icono: '🍳',
      sueldoDolares: 2300, varianza: 0.08, requisito: 'bachiller',
      descripcion: 'Turnos largos y estables.' },
    { id: 'limpieza_us', nombre: 'Limpieza', icono: '🧹',
      sueldoDolares: 2000, varianza: 0.10, requisito: 'bachiller',
      descripcion: 'Lo más fácil de conseguir al llegar.' },
    { id: 'tecnico_us', nombre: 'Técnico especializado', icono: '⚙️',
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
