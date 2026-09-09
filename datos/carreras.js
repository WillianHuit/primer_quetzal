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
 * Siete carreras que el jugador ve como diecinueve
 * ---------------------------------------------------------------------------
 * El diversificado guatemalteco no es una lista de dos opciones: es un menu
 * enorme de bachilleratos con orientacion y peritajes, y elegir dentro de ese
 * menu es la decision mas grande que toma un chico de dieciseis anios. Que el
 * juego ofreciera "bachillerato o perito contador" no era simplificar, era
 * contar otra cosa.
 *
 * Pero siete ramas ya son siete conjuntos de tareas, siete demandas y siete
 * sueldos que balancear, y diecinueve serian imposibles de sostener. Asi que
 * la lista es de verdad por fuera y de siete por dentro: cada CARRERA de aqui
 * es una CATEGORIA —tecnologia, salud, comercio...— y sus `titulos` son los
 * nombres reales que el jugador elige y que despues lleva en su perfil. Dos
 * titulos de la misma categoria comparten tareas, costo y mercado, y se
 * diferencian en el nombre y en los anios que toman.
 *
 * Eso no es un truco para ahorrar trabajo: es como funciona de verdad. Un
 * perito en desarrollo de sistemas y uno en reparacion de computadoras llevan
 * casi las mismas clases y compiten por los mismos puestos.
 *
 * Para agregar un titulo nuevo basta con meterlo en la lista `titulos` de su
 * categoria: no hace falta tocar nada mas.
 *
 * ---------------------------------------------------------------------------
 * Y `experienciaRequerida` es lo que hace que las tareas sirvan de algo
 * ---------------------------------------------------------------------------
 * La experiencia se gana haciendo TAREAS —las clases— y, mas despacio, con
 * solo estar inscrito. Basicos y el diversificado entero no piden nada: la
 * puerta de entrada del juego no se cierra nunca, y elegir rama se decide por
 * lo que se te da bien, no por un numero. De ahi para arriba si, y los numeros
 * estan puestos contra la cuenta del camino pasivo (3 por mes inscrito):
 *
 *   basicos 36 meses -> 108 de experiencia sin hacer una sola tarea
 *   + un diversificado de 24 -> 180
 *   + una licenciatura 60 -> 360
 *
 * Asi que tecnico (150) y administracion (180) los alcanza quien solo se
 * sienta en el pupitre. Ingenieria (240) y la maestria (400) NO: esas dos hay
 * que ganarselas haciendo el trabajo. Es exactamente la diferencia que el
 * juego quiere ensenar, y no cierra ninguna puerta sin decir cuanto falta.
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

  /* ---------- el diversificado: siete ramas ----------
   *
   * Todas piden 0 de experiencia y todas otorgan el mismo nivel. Lo que las
   * separa es lo que se estudia, lo que cuesta y los anios que toma cada
   * titulo. La rama se elige por vocacion, y el juego le pone numero a esa
   * vocacion con las notas de las tareas de basicos. */
  {
    id: 'tecnologia',
    experienciaRequerida: 0,
    nombre: 'Tecnología e informática',
    icono: 'computadora',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 11000,    // ESTIMACION: colegio con laboratorio
    descripcion: 'Computación, sistemas y reparación. Lo que el país no encuentra.',
    sinMercado: true,
    demandaInicial: 0.85,
    titulos: [
      { id: 'tit_compu', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Computación',
        meses: 24, nota: 'El más popular del país.' },
      { id: 'tit_sistemas', nombre: 'Perito en Desarrollo de Sistemas Informáticos', meses: 36 },
      { id: 'tit_reparacion', nombre: 'Perito en Informática y Reparación de Computadoras', meses: 36 }
    ]
  },
  {
    id: 'salud',
    experienciaRequerida: 0,
    nombre: 'Salud y ciencias biológicas',
    icono: 'hospital',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 11500,    // ESTIMACION
    descripcion: 'La rama de los que después quieren medicina o enfermería.',
    sinMercado: true,
    demandaInicial: 0.70,
    titulos: [
      { id: 'tit_biologicas', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Ciencias Biológicas',
        meses: 24, nota: 'Es la puerta para medicina y odontología.' },
      { id: 'tit_enfermeria', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Enfermería', meses: 24 },
      { id: 'tit_nutricion', nombre: 'Perito en Salud y Nutrición Comunitaria', meses: 36 }
    ]
  },
  {
    id: 'comercio',
    experienciaRequerida: 0,
    nombre: 'Administración, finanzas y comercio',
    icono: 'calculadora',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 10000,    // ESTIMACION
    descripcion: 'Números, cuentas y ventas. La rama más grande del país.',
    sinMercado: true,
    demandaInicial: 0.55,
    titulos: [
      { id: 'tit_contador', nombre: 'Perito Contador con Orientación en Computación',
        meses: 36, nota: 'Tres años, y sales con demanda laboral directa.' },
      { id: 'tit_empresas', nombre: 'Perito en Administración de Empresas', meses: 36 },
      { id: 'tit_mercadeo', nombre: 'Perito en Mercadotecnia y Publicidad', meses: 36 },
      { id: 'tit_secretariado', nombre: 'Secretariado Bilingüe (español e inglés)', meses: 24 }
    ]
  },
  {
    id: 'arte',
    experienciaRequerida: 0,
    nombre: 'Arte, diseño y comunicación',
    icono: 'paleta',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 10500,    // ESTIMACION
    descripcion: 'Diseño, medios y música. Se vive de encargos más que de sueldo.',
    sinMercado: true,
    demandaInicial: 0.45,
    titulos: [
      { id: 'tit_diseno', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Diseño Gráfico', meses: 24 },
      { id: 'tit_comunicacion', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Ciencias de la Comunicación', meses: 24 },
      { id: 'tit_musica', nombre: 'Bachillerato en Música o Artes Plásticas', meses: 24 }
    ]
  },
  {
    id: 'industrial',
    experienciaRequerida: 0,
    nombre: 'Industrial, mecánica y construcción',
    icono: 'martillo',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 36,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 12500,    // ESTIMACION: el taller cuesta
    descripcion: 'Sales con un oficio en las manos y tres años encima.',
    sinMercado: true,
    demandaInicial: 0.80,
    titulos: [
      { id: 'tit_industrial', nombre: 'Bachillerato Industrial y Perito en la Especialidad',
        meses: 36, nota: 'Mecánica automotriz, electricidad, electrónica, enderezado y pintura o refrigeración.' },
      { id: 'tit_dibujo', nombre: 'Perito en Dibujo Técnico de Construcción', meses: 36 }
    ]
  },
  {
    id: 'agro',
    experienciaRequerida: 0,
    nombre: 'Agricultura y turismo',
    icono: 'palmera',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 36,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 9500,     // ESTIMACION
    descripcion: 'Las dos cosas que dan de comer al interior del país.',
    sinMercado: true,
    demandaInicial: 0.60,
    titulos: [
      { id: 'tit_agronomo', nombre: 'Perito Agrónomo o Perito Forestal',
        meses: 36, nota: 'Se estudia en escuelas de formación agrícola como la ENCA.' },
      { id: 'tit_turismo', nombre: 'Perito en Hotelería y Turismo', meses: 36 }
    ]
  },
  {
    id: 'magisterio',
    experienciaRequerida: 0,
    nombre: 'Educación',
    icono: 'libros',
    nivelQueOtorga: 'diversificado',
    requiere: 'basicos',
    mesesRequeridos: 24,
    horario: 'jornada',
    costoAnualPublico: 0,
    costoAnualPrivado: 9000,     // ESTIMACION
    descripcion: 'Para dar clases. El bachillerato solo no alcanza: falta el técnico.',
    sinMercado: true,
    demandaInicial: 0.50,
    titulos: [
      { id: 'tit_educacion', nombre: 'Bachillerato en Ciencias y Letras con Orientación en Educación',
        meses: 24, nota: 'Para dar primaria hay que seguir con un técnico universitario.' },
      { id: 'tit_infantil', nombre: 'Magisterio de Educación Infantil Intercultural',
        meses: 36, nota: 'Para trabajar con niños de preprimaria.' }
    ]
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

/* Los siete ids de las ramas del diversificado, en el orden en que se ofrecen.
 * Se saca de los datos y no se escribe a mano: agregar una rama es agregar un
 * bloque arriba y nada mas. */
var RAMAS_DIVERSIFICADO = CARRERAS
  .filter(function (c) { return c.titulos && c.titulos.length; })
  .map(function (c) { return c.id; });

/* El titulo concreto que eligio el jugador, o el primero de la rama.
 *
 * Devuelve SIEMPRE algo cuando la carrera tiene titulos: una partida guardada
 * antes de que existieran, o un id que ya no esta en la lista, se queda con el
 * primero en vez de quedarse sin nombre. */
function tituloDeCarrera(carrera, tituloId) {
  if (!carrera || !carrera.titulos || !carrera.titulos.length) return null;
  for (var i = 0; i < carrera.titulos.length; i++) {
    if (carrera.titulos[i].id === tituloId) return carrera.titulos[i];
  }
  return carrera.titulos[0];
}

// Cuantos meses toma de verdad lo que el jugador eligio
function mesesDeCarrera(carrera, tituloId) {
  var t = tituloDeCarrera(carrera, tituloId);
  return (t && t.meses) || (carrera ? carrera.mesesRequeridos : 0);
}

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
