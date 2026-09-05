/* Mi Primer Quetzal — catalogo de empleos
 *
 * salarioBase: quetzales al mes en empleo formal, tiempo completo.
 * Todos ESTIMACION, calibrados sobre las medianas por nivel educativo:
 *   sin educacion Q2,400 | bachiller Q3,800 | licenciatura Q4,300 | maestria Q10,000
 *
 * varianza: 0 = sueldo fijo. 0.6 = el ingreso salta mucho mes a mes.
 * requisito: 'bachiller' | 'tecnico' | 'licenciatura' | 'maestria'
 */

var TRABAJOS = [
  {
    id: 'repartidor',
    nombre: 'Repartidor en moto',
    icono: '🛵',
    requisito: 'bachiller',
    salarioBase: 2800,
    varianza: 0.10,
    permiteInformal: true,
    descripcion: 'Entregas pedidos. Pagan por viaje, casi siempre sin contrato.'
  },
  {
    id: 'tienda',
    nombre: 'Dependiente de tienda',
    icono: '🏪',
    requisito: 'bachiller',
    salarioBase: 3000,
    varianza: 0.05,
    permiteInformal: true,
    descripcion: 'Atiendes el mostrador. Horario largo, sueldo estable.'
  },
  {
    id: 'construccion',
    nombre: 'Ayudante de construccion',
    icono: '🧱',
    requisito: 'bachiller',
    salarioBase: 2600,
    varianza: 0.25,
    permiteInformal: true,
    descripcion: 'Trabajo duro por obra. Cuando hay obra.'
  },
  {
    id: 'vendedor',
    nombre: 'Vendedor por comision',
    icono: '💼',
    requisito: 'bachiller',
    salarioBase: 1800,
    varianza: 0.60,
    permiteInformal: true,
    descripcion: 'Base baja y comision. Un buen mes es excelente, uno malo duele.'
  },
  {
    id: 'callcenter',
    nombre: 'Agente de call center bilingue',
    icono: '🎧',
    requisito: 'bachiller',
    salarioBase: 4500,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Necesitas ingles. Es el mejor sueldo sin titulo del pais.'
  },
  {
    id: 'tiendapropia',
    nombre: 'Tienda propia',
    icono: '🛒',
    requisito: 'bachiller',
    capitalRequerido: 8000,
    salarioBase: 3400,
    varianza: 0.70,
    permiteInformal: true,
    descripcion: 'Tu negocio. Necesitas capital y aguantar los meses malos.'
  },
  {
    id: 'auxcontable',
    nombre: 'Auxiliar contable',
    icono: '🧮',
    requisito: 'tecnico',
    salarioBase: 4000,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Oficina, planilla, prestaciones.'
  },
  {
    id: 'refrigeracion',
    nombre: 'Tecnico en refrigeracion',
    icono: '❄️',
    requisito: 'tecnico',
    salarioBase: 4800,
    varianza: 0.20,
    permiteInformal: true,
    descripcion: 'Oficio con demanda alta y poca competencia.'
  },
  {
    id: 'soporte',
    nombre: 'Soporte de sistemas',
    icono: '💻',
    requisito: 'tecnico',
    salarioBase: 5200,
    varianza: 0.05,
    permiteInformal: false,
    descripcion: 'Tecnico con contrato. Buen punto de entrada.'
  },
  {
    id: 'docente',
    nombre: 'Docente',
    icono: '📚',
    requisito: 'licenciatura',
    salarioBase: 4200,
    varianza: 0.02,
    permiteInformal: false,
    descripcion: 'Estable y seguro. El techo esta bajo.'
  },
  {
    id: 'contador',
    nombre: 'Contador',
    icono: '📊',
    requisito: 'licenciatura',
    salarioBase: 6000,
    varianza: 0.15,
    permiteInformal: false,
    descripcion: 'Titulo y colegiado. Puedes tomar trabajos por fuera.'
  },
  {
    id: 'ingeniero',
    nombre: 'Ingeniero junior',
    icono: '⚙️',
    requisito: 'licenciatura',
    salarioBase: 7500,
    varianza: 0.10,
    permiteInformal: false,
    descripcion: 'Cinco años de estudio. Aqui si se nota.'
  },
  {
    id: 'gerente',
    nombre: 'Gerente o especialista',
    icono: '🏢',
    requisito: 'maestria',
    salarioBase: 12000,
    varianza: 0.15,
    permiteInformal: false,
    descripcion: 'El salto real de la educacion esta en la maestria, no en la licenciatura.'
  }
];

// Cuanto vale cada año de experiencia dentro del mismo puesto
var AUMENTO_POR_ANIO_EXPERIENCIA = 0.035; // ESTIMACION: 3.5% anual

var NIVELES_EDUCATIVOS = ['bachiller', 'tecnico', 'licenciatura', 'maestria'];
