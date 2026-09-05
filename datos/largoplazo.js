/* Mi Primer Quetzal — hipoteca y pensión
 *
 * Los dos productos que solo tienen sentido si el juego cubre una vida entera.
 *
 * Datos verificados (ver investigacion, seccion 4):
 *   hipoteca 9.42% anual | plazo 20 a 30 años | enganche 20%
 *   El programa FHA (Fomento de Hipotecas Aseguradas) baja el enganche al 5%
 *   y existe de verdad en Guatemala, para vivienda de interes social.
 */

var CASAS = [
  {
    id: 'afueras',
    nombre: 'Casa en las afueras',
    icono: '🏡',
    precio: 350000,        // ESTIMACION
    apoyoFHA: true,        // califica para enganche del 5%
    serviciosComida: 1100, // ESTIMACION: sale mas barato que rentar
    personal: 1400,        // ESTIMACION: mas transporte, vives lejos
    mantenimiento: 350,    // ESTIMACION
    descripcion: 'Lejos y sencilla, pero es tuya. Califica para enganche del 5%.'
  },
  {
    id: 'intermedia',
    nombre: 'Casa en zona intermedia',
    icono: '🏠',
    precio: 650000,        // ESTIMACION
    apoyoFHA: false,
    serviciosComida: 1300,
    personal: 1200,
    mantenimiento: 550,
    descripcion: 'Bien ubicada y con espacio. El enganche es del 20%.'
  },
  {
    id: 'apartamento',
    nombre: 'Apartamento en la ciudad',
    icono: '🏢',
    precio: 900000,        // ESTIMACION
    apoyoFHA: false,
    serviciosComida: 1500,
    personal: 1100,
    mantenimiento: 900,    // ESTIMACION: incluye cuota de condominio
    descripcion: 'Céntrico y cómodo. También el más caro de sostener.'
  }
];

var HIPOTECA = {
  tasaAnual: 0.0942,          // dato verificado
  plazos: [20, 25, 30],       // años
  engancheNormal: 0.20,       // dato verificado
  engancheFHA: 0.05,          // dato verificado
  puntajeMinimo: 45,
  // La cuota no puede pasar de esta parte del ingreso mensual
  cargaMaximaIngreso: 0.35,   // ESTIMACION: criterio comun de la banca
  gastosDeCierre: 0.03,       // ESTIMACION: escritura, avaluo, papeleo
  apreciacionAnual: 0.03,     // ESTIMACION
  descripcion: 'Comprar tu casa. Es la decisión financiera más grande de una vida.'
};

/* Plan de pensiones voluntario.
 *
 * Guatemala no tiene un sistema de pension privada masivo, asi que esto es
 * deliberadamente simple: aportas lo que quieras cada mes y rinde a largo plazo.
 * Existe para que el interes compuesto de cuarenta años se vea.
 */
var PENSION = {
  nombre: 'Plan de pensiones',
  icono: '🌴',
  rendimientoAnual: 0.07,     // ESTIMACION
  aporteMinimo: 100,
  edadRetiro: 60,
  penalizacionRetiroAnticipado: 0.25, // ESTIMACION: pierdes un cuarto de lo ganado
  descripcion: 'Apartas un poco cada mes durante décadas. El tiempo hace el resto.'
};
