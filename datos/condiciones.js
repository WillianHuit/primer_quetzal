/* Mi Primer Quetzal — cómo viene el mes
 *
 * Una franja encima del tablero con hasta tres condiciones: llueve, hay feria,
 * se fue la luz, hay examen. Es lo que hace que marzo no se sienta igual que
 * febrero.
 *
 * El tablero ya sorteaba días distintos, pero el MES entero era siempre el
 * mismo mes: mismas probabilidades, mismos rendimientos, misma energía. El
 * jugador aprendía el ritmo y a partir de ahí solo tiraba el dado. Estas
 * condiciones cambian las tres cosas a la vez y se ven antes de tirar, así que
 * hay algo que mirar al empezar el mes y algo que decidir con eso en la mano.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 *   id        para el código y para las traducciones
 *   nombre    DOS PALABRAS como mucho: va en una franja de pocos píxeles
 *   icono     de js/iconos.js
 *   texto     una frase de lo que hace. Se lee al tocar la condición.
 *   peso      cuánto de probable es que salga este mes
 *   clase     de qué habla la pista en el pronóstico: 'clima' (el tiempo),
 *             'compromiso' (algo que hay que aguantar) u 'oportunidad' (algo
 *             que se puede aprovechar). Es la etiqueta chiquita de la tarjeta.
 *   si        condición del jugador, igual que en datos/tablero.js
 *             ('estudia', 'trabaja' o 'dinero')
 *
 * Y lo que hace, que son DOS palancas y ninguna más:
 *
 *   pesos         multiplica la probabilidad de un tipo de día. 1.8 en 'tarea'
 *                 es "este mes salen casi el doble de tareas".
 *   energiaExtra  se suma a lo que cuesta CADA jornada del mes. Negativo cansa
 *                 más; también le quita al descanso, que es lo que pasa cuando
 *                 duermes con calor.
 *
 * Hubo dos palancas más —multiplicar lo que producen los negocios y lo que se
 * aprende— y se quitaron. Dos motivos, y el segundo es el que manda:
 *
 *   - El banco de pruebas las cazó: con ellas, el modo difícil dejaba a siete
 *     de cada veintiuna vidas en negativo a los 65 y bancarizarse dejaba de
 *     convenir en alguna semilla. Una condición del mes no puede decidir una
 *     partida de cincuenta años.
 *   - Y sobre todo: eran un multiplicador EN SECRETO. El jugador veía el mismo
 *     trabajo rendir distinto sin poder saber por qué. En este juego lo que
 *     cambia se tiene que ver, y lo que se ve son los días que salen y lo que
 *     cuesta el cuerpo.
 *
 * Así que la quincena no multiplica tus ventas: hace que salgan más días de
 * trabajo y más trabajitos sueltos. El dinero entra por donde caes, no por una
 * cuenta que nadie enseña.
 *
 * Al agregar una: que se note pero que no decida la partida. Los pesos entre
 * 0.6 y 1.8, y `energiaExtra` entre -5 y +3. Lo que se acumule se limita en
 * `efectoDelMes` (js/motor.js): tres condiciones razonables juntas dejan de
 * serlo.
 */

var CONDICIONES_MES = [
  {
    id: 'lluvia',
    clase: 'clima',
    nombre: 'Lluvia',
    icono: 'nube',
    texto: 'Llueve casi todos los días. Moverse cuesta más y la calle se vacía.',
    peso: 16,
    energiaExtra: -1,
    pesos: { dificultad: 1.6, extra: 0.6 }
  },
  {
    id: 'calor',
    clase: 'clima',
    nombre: 'Calor',
    icono: 'sol',
    texto: 'No corre aire. Se duerme mal y salen más trabajitos en la calle.',
    peso: 14,
    energiaExtra: -2,
    pesos: { extra: 1.3, descanso: 0.7 }
  },
  {
    id: 'quincena',
    clase: 'oportunidad',
    nombre: 'Quincena',
    icono: 'moneda',
    texto: 'Hay dinero en la calle: sale más trabajo y más trabajitos sueltos.',
    peso: 15,
    /* Solo con trabajo: a quien está en el colegio no le cambia nada —los días
     * de trabajo no le salen— y una condición que no hace nada es ruido. */
    si: 'trabaja',
    pesos: { trabajo: 1.4, extra: 1.5 }
  },
  {
    id: 'examen',
    clase: 'compromiso',
    nombre: 'Exámenes',
    icono: 'libro',
    texto: 'Mes de exámenes. Cae mucha más tarea y casi ningún día libre.',
    peso: 16,
    si: 'estudia',
    pesos: { tarea: 1.8, descanso: 0.6 }
  },
  {
    id: 'feria',
    clase: 'oportunidad',
    nombre: 'Feria',
    icono: 'confeti',
    texto: 'Es la feria. Hay trabajitos por todos lados y nadie duerme.',
    peso: 12,
    energiaExtra: -2,
    pesos: { extra: 1.8, comodin: 1.3 }
  },
  {
    id: 'apagon',
    clase: 'compromiso',
    nombre: 'Apagones',
    icono: 'foco',
    texto: 'Se va la luz a cada rato. Hay menos días de trabajo y más de espera.',
    peso: 10,
    pesos: { libre: 1.6, trabajo: 0.7 }
  },
  {
    id: 'gripe',
    clase: 'compromiso',
    nombre: 'Gripe',
    icono: 'hospital',
    texto: 'Anda una gripe en el barrio. El cuerpo no da lo de siempre.',
    peso: 12,
    energiaExtra: -3,
    pesos: { descanso: 1.8, trabajo: 0.7 }
  },

  /* Y DOS MESES BUENOS, que no son un premio: son el otro lado de la moneda.
   *
   * Con solo condiciones malas, las condiciones dejaban de ser "cómo viene el
   * mes" y pasaban a ser un impuesto: todos los meses costaban un poco más que
   * antes, y en una vida de cincuenta años eso se nota. El banco de pruebas lo
   * cazó —el modo difícil dejaba cuatro de veintiuna vidas en negativo— y
   * tenía razón. Sumando los pesos, lo que quitan y lo que dan se compensa. */
  {
    id: 'fresco',
    clase: 'clima',
    nombre: 'Fresco',
    icono: 'palmera',
    texto: 'Buen tiempo todo el mes. Se duerme bien y el cuerpo aguanta más.',
    peso: 18,
    energiaExtra: 3
  },
  {
    id: 'vacaciones',
    clase: 'oportunidad',
    nombre: 'Vacaciones',
    icono: 'confeti',
    texto: 'Vacaciones del colegio. Casi no cae tarea y se descansa de verdad.',
    peso: 14,
    si: 'estudia',
    energiaExtra: 3,
    pesos: { tarea: 0.3, descanso: 1.5 }
  }
];

/* Cuántas condiciones trae un mes. Tres es el techo y no es casualidad: con
 * cuatro la franja deja de leerse de un vistazo, que es lo único que tiene que
 * hacer. Y un mes sin ninguna también existe: los meses tranquilos son los que
 * hacen que los otros se noten.
 *
 * Y LA PISTA QUE PUEDE CAMBIAR, que es la última de las tres del pronóstico.
 *
 * Enseñar el mes entero de antemano lo vuelve un trámite; no enseñar nada lo
 * vuelve una lotería. Así que dos pistas son firmes y una lleva un signo de
 * interrogación: puede llegar a mitad de mes o quedarse en nada.
 *
 *   probabilidadDePista      con qué frecuencia el mes trae una pista incierta
 *   probabilidadDeQueLlegue  y, si la trae, con qué frecuencia se cumple
 *
 * Casi la mitad y casi la mitad, a propósito: una pista que se cumple siempre
 * no es una pista, es un anuncio, y una que no se cumple casi nunca es ruido.
 * A la mitad el jugador tiene que decidir si le hace caso, que es lo único
 * interesante que se puede hacer con un pronóstico.
 *
 * Nunca hay una cuarta condición: si el mes ya trae el tope, no se sortea
 * pista. Ver `sortearPendiente` en js/motor.js. */
var CONDICIONES_POR_MES = {
  minimo: 0, maximo: 3, probabilidadDeNinguna: 0.15,
  probabilidadDePista: 0.55, probabilidadDeQueLlegue: 0.5
};
