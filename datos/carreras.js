/* Mi Primer Quetzal — rutas de estudio y mercado laboral
 *
 * La escalera completa, desde que el jugador sale de primaria a los 13:
 *
 *   primaria -> basicos -> diversificado -> tecnico     -> (nada mas)
 *                                        -> licenciatura -> maestria
 *
 * El progreso se mide en meses de carrera. Cada JORNADA que dedicas avanza un
 * cuarto de mes, asi que cuatro jornadas al mes (dos semanas) es el ritmo
 * normal y te toma exactamente la duracion oficial.
 *
 * Dato que sostiene el diseño (ver investigacion, seccion 1):
 *   diversificado Q3,800 | licenciatura Q4,300 (+13%) | maestria Q10,000 (+133%)
 * La licenciatura sola casi no despega. El salto esta en la maestria.
 *
 * ---------------------------------------------------------------------------
 * El campo `horario` es lo que hace que el reparto del mes sea una decision
 * ---------------------------------------------------------------------------
 *   'fijo'     el colegio te toma una jornada de todas las semanas y NO se
 *              puede quitar. Es basicos: mientras estes inscrito, esas cuatro
 *              casillas son del colegio y punto.
 *   'jornada'  eliges manana o tarde al inscribirte, esa queda tomada las
 *              cuatro semanas, y la otra jornada es tuya para trabajar. Asi
 *              funciona el diversificado en Guatemala.
 *   'libre'    reparte como quiera, jornada por jornada. La universidad.
 *
 * ---------------------------------------------------------------------------
 * Y `experienciaRequerida` es lo que hace que las tareas sirvan de algo
 * ---------------------------------------------------------------------------
 * La experiencia se gana haciendo TAREAS —las clases— y, mas despacio, con
 * solo estar inscrito. Las dos primeras carreras no piden nada: la puerta de
 * entrada del juego no se cierra nunca. De ahi para arriba si, y los numeros
 * estan puestos contra la cuenta del camino pasivo (3 por mes inscrito):
 *
 *   basicos 36 meses -> 108 de experiencia sin hacer una sola tarea
 *   + bachillerato 24 -> 180
 *   + una licenciatura 60 -> 360
 *
 * Asi que perito (60), tecnico (150) y administracion (180) los alcanza quien
 * solo se sienta en el pupitre. Ingenieria (240) y la maestria (400) NO: esas
 * dos hay que ganarselas haciendo el trabajo. Es exactamente la diferencia que
 * el juego quiere ensenar, y no cierra ninguna puerta sin decir cuanto falta.
 */

var AVANCE_POR_JORNADA_ESTUDIO = 0.25; // un cuarto de mes de carrera por jornada

var CARRERAS = [
  {
    id: 'basicos',
    experienciaRequerida: 0,
    nombre: 'Básicos',
    icono: 'mochila',
    nivelQueOtorga: 'basicos',
    requiere: 'primaria',
    mesesRequeridos: 36,
    horario: 'fijo',
    // El instituto publico es gratuito. La cuota de padres de familia y los
    // utiles son reales pero no son colegiatura.
    costoAnualPublico: 0,
    // ESTIMACION: colegio privado modesto de barrio, Q500 al mes por diez meses
    costoAnualPrivado: 5000,
    descripcion: 'Tres años. Sin básicos casi ningún trabajo te va a mirar.',
    // [V] INE: la tasa neta de cobertura en el ciclo basico anda por el 46%.
    // Mas de la mitad de los chicos guatemaltecos no llega aqui.
    sinMercado: true,
    demandaInicial: 0.50
  },
  {
    id: 'bachillerato',
    experienciaRequerida: 0,
    nombre: 'Bachillerato en ciencias y letras',
    icono: 'birrete',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 9000,     // ESTIMACION: Q900 al mes por diez meses
    descripcion: 'Dos años. El más corto, y el que piden en todas partes.',
    sinMercado: true,
    demandaInicial: 0.55
  },
  {
    id: 'perito',
    experienciaRequerida: 60,
    nombre: 'Perito contador',
    icono: 'calculadora',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 36,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 10000,    // ESTIMACION
    descripcion: 'Tres años. Un año más que el bachillerato, y sales con oficio.',
    sinMercado: true,
    demandaInicial: 0.70
  },
  {
    id: 'tecnico',
    experienciaRequerida: 150,
    nombre: 'Carrera técnica',
    icono: 'casco',
    nivelQueOtorga: 'tecnico',
    requiere: 'diversificado',
    mesesRequeridos: 24,
    horario: 'libre',
    costoAnualPublico: 0,        // USAC gratuita desde 2026
    costoAnualPrivado: 13726,    // UVG profesorado, dato verificado
    descripcion: 'Dos años. Oficio con demanda alta y poca competencia.',
    // [V-sec] ManpowerGroup 2026: 62% de los empleadores no encuentra talento, y
    // 'tecnicos' y 'oficios calificados' aparecen entre los mas dificiles de cubrir.
    demandaInicial: 0.85
  },
  {
    id: 'admin',
    experienciaRequerida: 180,
    nombre: 'Licenciatura en administración',
    icono: 'portapapeles',
    nivelQueOtorga: 'licenciatura',
    requiere: 'diversificado',
    mesesRequeridos: 60,
    horario: 'libre',
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
    experienciaRequerida: 240,
    nombre: 'Licenciatura en ingeniería',
    icono: 'escuadra',
    nivelQueOtorga: 'licenciatura',
    requiere: 'diversificado',
    mesesRequeridos: 60,
    horario: 'libre',
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
    experienciaRequerida: 400,
    nombre: 'Maestría',
    icono: 'birrete',
    nivelQueOtorga: 'maestria',
    requiere: 'licenciatura',
    mesesRequeridos: 24,
    horario: 'libre',
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

// La primera carrera que le toca a cada nivel educativo. Sirve para que el
// juego sepa que sigue sin tener que preguntarselo al jugador.
var SIGUIENTE_CARRERA = {
  primaria: 'basicos',
  basicos: 'bachillerato',
  diversificado: 'tecnico'
};

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
