/* Mi Primer Quetzal — orígenes del personaje
 *
 * Tres puntos de partida distintos. No son niveles de dificultad: son formas
 * distintas de empezar, cada una con su ventaja y su carga.
 *
 * La idea es que el jugador vea que dos personas con la misma disciplina
 * terminan en lugares distintos segun de donde salieron, sin que el juego se lo
 * tenga que decir.
 *
 * Como el juego empieza a los 13, lo que de verdad separa a los tres al
 * principio es la `mesada`: lo que le dan en casa cada mes a un chico que
 * todavia no puede trabajar de verdad. Uno arranca con Q120 al mes sin hacer
 * nada y otro con cero. Nadie se lo explica al jugador; se ve.
 *
 * El `aporteCasa` y la remesa no entran hasta los 18: a un menor de edad no le
 * cobran el gasto de la casa ni le entregan la remesa a el.
 */

/* Los tres niveles con que arranca el juego.
 *
 * La pantalla de inicio hacia dos preguntas seguidas —de donde sales y en que
 * Guatemala te toca vivir— con cinco tarjetas largas antes de tocar el juego.
 * Para alguien de 13 anios eso es un formulario, no una eleccion.
 *
 * Esto las junta en un nivel de dificultad con color: cada nivel empareja un
 * origen con una economia. Quien quiera la combinacion exacta la sigue
 * teniendo, en "prefiero elegir yo".
 *
 * El orden importa: se dibujan en este orden, de facil a dificil.
 */
var NIVELES_JUEGO = [
  {
    id: 'facil',
    nombre: 'Fácil',
    origen: 'apoyo',
    economia: 'normal',
    resumen: 'Tus papás tienen con qué. Te dan mesada y nadie depende de ti.'
  },
  {
    id: 'medio',
    nombre: 'Medio',
    origen: 'remesas',
    economia: 'normal',
    resumen: 'Tu hermano manda de Estados Unidos cuando puede. De grande aportas en casa.'
  },
  {
    id: 'dificil',
    nombre: 'Difícil',
    origen: 'sosten',
    economia: 'dificil',
    resumen: 'En tu casa no sobra y el trabajo con contrato no existe. Vas a ser el que sostiene.'
  }
];

var ORIGENES = [
  {
    id: 'apoyo',
    nombre: 'Tu familia te puede apoyar',
    icono: 'casa',
    efectivoInicial: 200,         // ESTIMACION: lo que trae guardado un chico de 13
    mesada: 120,                  // ESTIMACION
    aporteCasa: 0,                // no le cobran nada al principio
    remesaActiva: false,
    reputacionInicial: 45,
    descripcion: 'Tus papás tienen con qué. Te dan mesada, no te cobran nada en ' +
                 'casa y nadie depende de ti.',
    nota: 'Empiezas con ventaja real. Lo que hagas con ella es tuyo.'
  },
  {
    id: 'remesas',
    nombre: 'Tu hermano manda de Estados Unidos',
    icono: 'avion',
    efectivoInicial: 120,
    mesada: 40,
    aporteCasa: 400,
    remesaActiva: true,
    reputacionInicial: 30,
    descripcion: 'Tu hermano manda dinero desde Estados Unidos cada dos o tres ' +
                 'meses, cuando puede. De grande vas a aportar al gasto de la casa.',
    nota: 'Un ingreso que no controlas no sirve para comprometer gastos fijos.'
  },
  {
    id: 'sosten',
    nombre: 'Tu familia depende de ti',
    icono: 'personas',
    // ESTIMACION. No baja de aqui a proposito: con menos, tras el primer mes
    // no le alcanzaria el minimo de apertura de la cuenta y el tutorial se
    // quedaria atascado en su ultimo paso.
    efectivoInicial: 100,
    mesada: 0,                    // en su casa no hay de donde
    aporteCasa: 1100,             // ESTIMACION: sostienes buena parte de la casa
    remesaActiva: false,
    reputacionInicial: 55,        // te ganas la confianza de todos rapido
    descripcion: 'En tu casa no sobra. No hay mesada ni red debajo de ti, y de ' +
                 'grande vas a ser el que sostiene.',
    nota: 'Arrancas con menos margen. A cambio, conseguir fiador te cuesta menos.'
  }
];
