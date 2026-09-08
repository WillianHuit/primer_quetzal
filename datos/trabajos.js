/* Mi Primer Quetzal — catalogo de empleos
 *
 * salarioBase: quetzales al mes en empleo formal, tiempo completo.
 * Todos ESTIMACION, calibrados sobre las medianas por nivel educativo:
 *   sin educacion Q2,400 | diversificado Q3,800 | licenciatura Q4,300 | maestria Q10,000
 *
 * varianza: 0 = sueldo fijo. 0.6 = el ingreso salta mucho mes a mes.
 * requisito: 'primaria' | 'basicos' | 'diversificado' | 'tecnico' |
 *            'licenciatura' | 'maestria'
 * edadMinima: nadie te contrata antes de esa edad.
 *
 * ---------------------------------------------------------------------------
 * Los tres primeros son trabajitos de nino
 * ---------------------------------------------------------------------------
 * El juego empieza a los 13 anios y a los 13 nadie te da un sueldo: te dan
 * unos quetzales por vender algo en la calle. Por eso estos tres no tienen
 * `salarioBase` sino `pagoPorJornada`: se cobra por jornada trabajada, unos
 * pocos quetzales, y ese es todo el ingreso que existe al principio.
 *
 * Son a proposito ridiculos al lado de cualquier empleo de adulto. La primera
 * leccion del juego es esa comparacion: lo que se gana sin estudios cabe en
 * una mano.
 * ---------------------------------------------------------------------------
 */

var TRABAJOS = [
  {
    id: 'limonada',
    nombre: 'Vender limonada',
    icono: 'limonada',
    requisito: 'primaria',
    edadMinima: 12,
    pagoPorJornada: 5,
    varianza: 0.30,
    permiteInformal: true,
    soloInformal: true,
    descripcion: 'Una jarra, hielo y una mesa en la banqueta.'
  },
  {
    id: 'periodicos',
    nombre: 'Vender periódico',
    icono: 'periodico',
    requisito: 'primaria',
    edadMinima: 12,
    pagoPorJornada: 4,
    varianza: 0.10,
    permiteInformal: true,
    soloInformal: true,
    descripcion: 'Temprano en la esquina. Paga poquito y paga siempre.'
  },
  {
    id: 'dulces',
    nombre: 'Vender dulces',
    icono: 'dulce',
    requisito: 'primaria',
    edadMinima: 12,
    pagoPorJornada: 6,
    varianza: 0.55,
    permiteInformal: true,
    soloInformal: true,
    descripcion: 'En el bus o en la escuela. Un día vendes todo, otro nada.'
  },
  {
    id: 'repartidor',
    nombre: 'Repartidor en moto',
    icono: 'moto',
    requisito: 'basicos',
    edadMinima: 16,
    salarioBase: 2800,
    varianza: 0.10,
    permiteInformal: true,
    descripcion: 'Entregas pedidos. Pagan por viaje, casi siempre sin contrato.'
  },
  {
    id: 'tienda',
    nombre: 'Dependiente de tienda',
    icono: 'tienda',
    requisito: 'basicos',
    edadMinima: 16,
    salarioBase: 3000,
    varianza: 0.05,
    permiteInformal: true,
    descripcion: 'Atiendes el mostrador. Horario largo, sueldo estable.'
  },
  {
    id: 'construccion',
    nombre: 'Ayudante de construccion',
    icono: 'ladrillo',
    requisito: 'primaria',
    edadMinima: 16,
    salarioBase: 2600,
    varianza: 0.25,
    permiteInformal: true,
    descripcion: 'Trabajo duro por obra. Cuando hay obra.'
  },
  {
    id: 'vendedor',
    nombre: 'Vendedor por comision',
    icono: 'maletin',
    requisito: 'primaria',
    edadMinima: 16,
    salarioBase: 1800,
    varianza: 0.60,
    permiteInformal: true,
    descripcion: 'Base baja y comision. Un buen mes es excelente, uno malo duele.'
  },
  {
    id: 'callcenter',
    nombre: 'Agente de call center bilingue',
    icono: 'audifonos',
    requisito: 'diversificado',
    edadMinima: 18,
    salarioBase: 4500,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Necesitas ingles. Es el mejor sueldo sin titulo del pais.'
  },
  {
    id: 'tiendapropia',
    nombre: 'Tienda propia',
    icono: 'carrito',
    requisito: 'basicos',
    edadMinima: 18,
    capitalRequerido: 8000,
    salarioBase: 3400,
    varianza: 0.70,
    permiteInformal: true,
    descripcion: 'Tu negocio. Necesitas capital y aguantar los meses malos.'
  },
  {
    id: 'auxcontable',
    nombre: 'Auxiliar contable',
    icono: 'calculadora',
    requisito: 'tecnico',
    edadMinima: 18,
    salarioBase: 4000,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Oficina, planilla, prestaciones.'
  },
  {
    id: 'refrigeracion',
    nombre: 'Tecnico en refrigeracion',
    icono: 'copo',
    requisito: 'tecnico',
    edadMinima: 18,
    salarioBase: 4800,
    varianza: 0.20,
    permiteInformal: true,
    descripcion: 'Oficio con demanda alta y poca competencia.'
  },
  {
    id: 'soporte',
    nombre: 'Soporte de sistemas',
    icono: 'computadora',
    requisito: 'tecnico',
    edadMinima: 18,
    salarioBase: 5200,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Tecnico con contrato. Buen punto de entrada.'
  },
  {
    id: 'docente',
    nombre: 'Docente',
    icono: 'libros',
    requisito: 'licenciatura',
    edadMinima: 18,
    salarioBase: 4200,
    varianza: 0.02,
    permiteInformal: false,
    descripcion: 'Estable y seguro. El techo esta bajo.'
  },
  {
    id: 'contador',
    nombre: 'Contador',
    icono: 'barras',
    requisito: 'licenciatura',
    edadMinima: 18,
    salarioBase: 6000,
    varianza: 0.15,
    permiteInformal: false,
    descripcion: 'Titulo y colegiado. Puedes tomar trabajos por fuera.'
  },
  {
    id: 'ingeniero',
    nombre: 'Ingeniero junior',
    icono: 'engranaje',
    requisito: 'licenciatura',
    edadMinima: 18,
    salarioBase: 7500,
    varianza: 0.10,
    permiteInformal: false,
    descripcion: 'Cinco años de estudio. Aqui si se nota.'
  },
  {
    id: 'gerente',
    nombre: 'Gerente o especialista',
    icono: 'edificio',
    requisito: 'maestria',
    edadMinima: 18,
    salarioBase: 12000,
    varianza: 0.15,
    permiteInformal: false,
    descripcion: 'El salto real de la educacion esta en la maestria, no en la licenciatura.'
  }
];

// Cuanto vale cada año de experiencia dentro del mismo puesto
var AUMENTO_POR_ANIO_EXPERIENCIA = 0.035; // ESTIMACION: 3.5% anual

/* La escalera educativa, de menos a mas. El orden es lo que usa el juego
 * para saber si alguien califica para un empleo o para una carrera. */
var NIVELES_EDUCATIVOS = ['primaria', 'basicos', 'diversificado',
                          'tecnico', 'licenciatura', 'maestria'];
