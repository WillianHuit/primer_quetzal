/* Mi Primer Quetzal — orígenes del personaje
 *
 * Tres puntos de partida distintos. No son niveles de dificultad: son formas
 * distintas de empezar, cada una con su ventaja y su carga.
 *
 * La idea es que el jugador vea que dos personas con la misma disciplina
 * terminan en lugares distintos segun de donde salieron, sin que el juego se lo
 * tenga que decir.
 */

var ORIGENES = [
  {
    id: 'apoyo',
    nombre: 'Tu familia te puede apoyar',
    icono: '🏠',
    efectivoInicial: 3500,        // ESTIMACION
    aporteCasa: 0,                // no le cobran nada al principio
    remesaActiva: false,
    reputacionInicial: 45,
    descripcion: 'Tus papás tienen con qué. No te cobran nada en casa y te dieron ' +
                 'algo para arrancar. Nadie depende de ti.',
    nota: 'Empiezas con ventaja real. Lo que hagas con ella es tuyo.'
  },
  {
    id: 'remesas',
    nombre: 'Tu hermano manda de Estados Unidos',
    icono: '✈️',
    efectivoInicial: 1200,
    aporteCasa: 400,
    remesaActiva: true,
    reputacionInicial: 30,
    descripcion: 'Vives con tu familia y aportas al gasto. Tu hermano manda dinero ' +
                 'desde Estados Unidos cada dos o tres meses, cuando puede.',
    nota: 'Un ingreso que no controlas no sirve para comprometer gastos fijos.'
  },
  {
    id: 'sosten',
    nombre: 'Tu familia depende de ti',
    icono: '🤝',
    efectivoInicial: 400,         // ESTIMACION
    aporteCasa: 1100,             // ESTIMACION: sostienes buena parte de la casa
    remesaActiva: false,
    reputacionInicial: 55,        // te ganas la confianza de todos rapido
    descripcion: 'Eres el que aporta en casa. No hay red debajo de ti, pero en tu ' +
                 'familia todos saben que respondes.',
    nota: 'Arrancas con menos margen. A cambio, conseguir fiador te cuesta menos.'
  }
];
