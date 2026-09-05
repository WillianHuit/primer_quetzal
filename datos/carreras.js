/* Mi Primer Quetzal — rutas de estudio y mercado laboral
 *
 * El progreso se mide en meses de carrera. Cada semana que dedicas a estudiar
 * avanza medio mes, asi que dos semanas al mes es el ritmo normal y te toma
 * exactamente la duracion oficial de la carrera.
 *
 * Dato que sostiene el diseño (ver investigacion, seccion 1):
 *   bachiller Q3,800 | licenciatura Q4,300 (+13%) | maestria Q10,000 (+133%)
 * La licenciatura sola casi no despega. El salto esta en la maestria.
 */

var AVANCE_POR_SEMANA_ESTUDIO = 0.5; // medio mes de carrera por semana dedicada

var CARRERAS = [
  {
    id: 'tecnico',
    nombre: 'Carrera técnica',
    icono: '🔧',
    nivelQueOtorga: 'tecnico',
    requiere: 'bachiller',
    mesesRequeridos: 24,
    costoAnualPublico: 0,        // USAC gratuita desde 2026
    costoAnualPrivado: 13726,    // UVG profesorado, dato verificado
    descripcion: 'Dos años. Oficio con demanda alta y poca competencia.',
    demandaInicial: 0.85
  },
  {
    id: 'admin',
    nombre: 'Licenciatura en administración',
    icono: '📋',
    nivelQueOtorga: 'licenciatura',
    requiere: 'bachiller',
    mesesRequeridos: 60,
    costoAnualPublico: 0,
    costoAnualPrivado: 35000,    // ESTIMACION
    descripcion: 'Cinco años. Es la carrera con más graduados del país.',
    demandaInicial: 0.35
  },
  {
    id: 'ingenieria',
    nombre: 'Licenciatura en ingeniería',
    icono: '📐',
    nivelQueOtorga: 'licenciatura',
    requiere: 'bachiller',
    mesesRequeridos: 60,
    costoAnualPublico: 0,
    costoAnualPrivado: 77054,    // UVG Ingenieria Industrial, dato verificado
    descripcion: 'Cinco años y la privada es carísima. La pública es gratis.',
    demandaInicial: 0.60
  },
  {
    id: 'maestria',
    nombre: 'Maestría',
    icono: '🎓',
    nivelQueOtorga: 'maestria',
    requiere: 'licenciatura',
    mesesRequeridos: 24,
    costoAnualPublico: 20000,    // ESTIMACION: la maestria no es gratis ni en la publica
    costoAnualPrivado: 20000,    // ESTIMACION
    descripcion: 'Dos años más. Aquí sí se duplica el sueldo.',
    demandaInicial: 0.75
  }
];

// Que carrera alimenta cada empleo. Sirve para que la saturacion del mercado
// afecte el sueldo de los puestos de esa rama.
var CARRERA_DE_EMPLEO = {
  auxcontable:  'tecnico',
  refrigeracion:'tecnico',
  soporte:      'tecnico',
  docente:      'admin',
  contador:     'admin',
  ingeniero:    'ingenieria',
  gerente:      'maestria'
};

/* El mercado se mueve. La demanda va de 0 a 1 y multiplica el sueldo entre
 * 0.80 y 1.20. Cambia poco a poco cada año, con tendencia visible pero no
 * garantizada: investigar antes de estudiar ayuda, pero no te salva de todo.
 */
var MERCADO = {
  multiplicadorMinimo: 0.80,
  multiplicadorMaximo: 1.20,
  derivaAnual: 0.12,      // cuanto puede moverse la demanda en un año
  demandaMinima: 0.15,
  demandaMaxima: 0.95
};

function etiquetaDemanda(d) {
  if (d >= 0.75) return { texto: 'Demanda alta', clase: 'ok' };
  if (d >= 0.50) return { texto: 'Demanda media', clase: '' };
  if (d >= 0.30) return { texto: 'Mercado apretado', clase: '' };
  return { texto: 'Saturada', clase: 'alerta' };
}
