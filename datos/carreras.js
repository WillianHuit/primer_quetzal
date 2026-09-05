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
    // [V-sec] ManpowerGroup 2026: 62% de los empleadores no encuentra talento, y
    // 'tecnicos' y 'oficios calificados' aparecen entre los mas dificiles de cubrir.
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
    // [V-sec] URL Landivar, Administracion de Empresas: inscripcion Q1,779 +
    // 10 mensualidades de Q2,738 = Q29,159 al anio. Referencia privada media-alta.
    // La UMG ronda Q12,800 y la UNIS Q51,390; esta queda en medio.
    costoAnualPrivado: 29200,
    descripcion: 'Cinco años. Es la carrera con más graduados del país.',
    // [V-sec] INE via Prensa Libre: Ciencias Sociales concentra el 57.2% de los
    // graduados y el 64.3% de la matricula. Administracion se imparte en 13 de
    // las 15 universidades del pais. Es el mercado mas saturado que hay.
    demandaInicial: 0.30
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
    // [V-sec] Ingenieria y Tecnologia son solo el 12.1% de los graduados, y
    // ManpowerGroup 2026 pone los perfiles de tecnologia entre los dos puestos
    // mas dificiles de llenar en Guatemala.
    demandaInicial: 0.65
  },
  {
    id: 'maestria',
    nombre: 'Maestría',
    icono: '🎓',
    nivelQueOtorga: 'maestria',
    requiere: 'licenciatura',
    mesesRequeridos: 24,
    // ESTIMACION: no se encontro ningun arancel publicado de maestrias de la USAC.
    // La maestria no es gratuita ni en la publica, pero el numero sigue sin fuente.
    costoAnualPublico: 20000,
    // [V] UNIS, Maestria en Ingenieria Textil 2026: 3 semestres de Q1,000 de
    // matricula + 6 cuotas de Q2,500 = Q48,000 en total. Es el PISO documentado;
    // la Maestria en Genetica Biomedica de la misma universidad llega a Q102,600.
    costoAnualPrivado: 24000,
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
