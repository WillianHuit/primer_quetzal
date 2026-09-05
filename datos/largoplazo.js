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
  engancheNormal: 0.20,       // [V-sec] la banca convencional financia 70-80% del avaluo
  // [V] FHA: desde 5% en vivienda nueva o proyectada (financia hasta el 95%).
  // En vivienda EXISTENTE la FHA pide 10%. El juego usa el caso de vivienda nueva.
  engancheFHA: 0.05,
  puntajeMinimo: 45,
  // La cuota no puede pasar de esta parte del ingreso mensual.
  // [V-sec] El criterio mas citado de la banca guatemalteca es 30%, y 35% ya se
  // considera zona de riesgo. La FHA hace analisis por nucleo familiar pero no
  // publica su tope.
  cargaMaximaIngreso: 0.30,
  // [V-sec] Gastos de cierre de vivienda usada: 4% a 6% del valor. Timbres 3%
  // (Decreto 37-92), notario 1-2%, avaluo, inscripcion. En vivienda nueva el 12%
  // de IVA sustituye a los timbres y suele venir dentro del precio de lista.
  gastosDeCierre: 0.05,
  // Guatemala NO tiene indice oficial de precios de vivienda: ni Banguat, ni el
  // INE, ni la Camara de la Construccion lo publican. Lo mas cercano es comparar
  // dos boletines trimestrales del FHA con la misma metodologia, y el agregado
  // mas estable, el del municipio de Guatemala, da +2.4% de 2023 a 2024. La
  // Camara de Corredores de Bienes Raices habla de 5% a 10% de retorno TOTAL,
  // que incluye la renta y no solo la plusvalia. El 3% queda justo entre ambos.
  apreciacionAnual: 0.03,
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
  // Guatemala no publica rendimientos de planes de pension privados: no hay
  // regimen obligatorio y ni bancos ni aseguradoras dan un porcentaje. Ese vacio
  // es en si mismo un dato. El 7% se ancla en lo unico publicado y comparable:
  // [V] bonos del Tesoro en quetzales adjudicados en 2025, 6.75% a 2030, 7.00% a
  // 2032, 7.375% a 2038 y 7.75% a 2045. La tasa pasiva bancaria promedio va por
  // 5.1% [V] Banguat IMM05, asi que 7% es el techo defendible, no un invento.
  rendimientoAnual: 0.07,
  aporteMinimo: 100,
  edadRetiro: 60,             // [V] IGSS: pension por vejez a los 60, con 240 meses cotizados
  penalizacionRetiroAnticipado: 0.25, // ESTIMACION: no se encontro ninguna cifra publicada
  descripcion: 'Apartas un poco cada mes durante décadas. El tiempo hace el resto.'
};
