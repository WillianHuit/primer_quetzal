/* Mi Primer Quetzal — tarjetas de decisión
 *
 * Los eventos de datos/eventos.js son cosas que te PASAN: se te quiebra el
 * celular, te duele una muela, te pagan el Bono 14. El jugador las lee y
 * cierra la ventana.
 *
 * Estas son distintas: son cosas que hay que DECIDIR, sin respuesta obvia.
 * Cada una pone dos o tres botones y ninguno dice "correcto". Es el único
 * lugar del juego donde la lección no la explica un párrafo, la explica la
 * consecuencia que llega tres meses después.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada tarjeta tiene:
 *
 *   prob          probabilidad de que salga en un mes cualquiera.
 *   edadMinima    antes de esa edad no aparece. edadMaxima, después tampoco.
 *   unaVez        true si solo puede salir una vez en toda la partida.
 *   requiere      función opcional: solo sale si devuelve true.
 *   titulo/texto  qué está pasando. Corto: dos líneas, no un párrafo.
 *   leccion       lo que queda. Sale DESPUÉS de elegir, nunca antes: si se
 *                 lee antes, deja de ser una decisión y es un examen.
 *   opciones      dos o tres. Cada una:
 *
 *      etiqueta      lo que dice el botón. Tres o cuatro palabras.
 *      icono         el dibujo del botón.
 *      resultado     qué pasó, en una frase.
 *      dinero        + entra, - sale. Si no alcanza, queda debiendo.
 *      energia       + descansa, - se cansa.
 *      reputacion    lo que la gente que te conoce piensa de ti (fiador).
 *      puntaje       historial de crédito.
 *      avanceEstudio meses de carrera que ganas o pierdes.
 *      bonoJornada   quetzales extra POR JORNADA trabajada, para siempre.
 *                    Es la única forma que tiene el jugador de comprar una
 *                    herramienta que le haga rendir más el trabajo.
 *      cargoMensual  { nombre, monto } que se te cobra cada mes desde ahora.
 *      nada          true si esa opción no hace nada. Siempre debe haber una.
 * ---------------------------------------------------------------------------
 *
 * OJO al escribir una tarjeta: la opción de no hacer nada tiene que ser
 * defendible. Si una de las dos es obviamente la buena, no es una decisión,
 * es un peaje.
 */

/* Cuantos meses tienen que pasar entre una tarjeta y la siguiente.
 * Sin esto salia una casi todos los meses y dejaban de sentirse importantes. */
var MESES_ENTRE_DECISIONES = 3;

var DECISIONES = [

  // ---------- de niño: 13 a 17 ----------

  {
    id: 'feria',
    titulo: 'Llegó la feria',
    icono: 'globo-fiesta',
    prob: 0.10,
    edadMaxima: 17,
    texto: 'Todos tus amigos van. La entrada y los juegos son Q60, casi todo lo que llevas juntado.',
    leccion: 'Gastar no es malo. Lo malo es gastar sin saber cuánto llevabas juntado ni para qué era.',
    opciones: [
      { etiqueta: 'Ir a la feria', icono: 'globo-fiesta', dinero: -60, energia: 12,
        resultado: 'Te fuiste con todos y valió la pena.' },
      { etiqueta: 'Quedarme', icono: 'moneda', nada: true, energia: 4,
        resultado: 'Te quedaste y guardaste tus Q60.' }
    ]
  },

  {
    id: 'bicicleta',
    titulo: 'Una bicicleta usada',
    icono: 'moto',
    prob: 0.09,
    edadMaxima: 19,
    unaVez: true,
    texto: 'Un vecino vende su bicicleta en Q250. Con ella entregarías el doble en el mismo tiempo.',
    leccion: 'Hay gastos que se pagan solos. Una herramienta que te hace rendir más no es un gasto, es lo único que de verdad sube lo que ganas por hora.',
    opciones: [
      { etiqueta: 'Comprarla', icono: 'moto', dinero: -250, bonoJornada: 3,
        resultado: 'Es tuya. Desde hoy ganas Q3 más por cada jornada que trabajes.' },
      { etiqueta: 'No me alcanza', icono: 'cartera', nada: true,
        resultado: 'La dejaste pasar.' }
    ]
  },

  {
    id: 'rifa',
    titulo: 'Una rifa que no falla',
    icono: 'alerta',
    prob: 0.09,
    edadMaxima: 22,
    texto: 'Un conocido vende números de Q50 para una rifa de un celular. Te jura que casi nadie compró y que te va a tocar.',
    leccion: 'Nadie que te garantice ganar te está diciendo la verdad. Si fuera seguro, no te lo estarían ofreciendo a ti.',
    opciones: [
      { etiqueta: 'Comprar un número', icono: 'billete', dinero: -50,
        resultado: 'Nunca hubo rifa y el conocido no volvió a aparecer.' },
      { etiqueta: 'No, gracias', icono: 'visto', nada: true, puntaje: 1,
        resultado: 'Le dijiste que no. Dos semanas después supiste que nadie ganó nada.' }
    ]
  },

  {
    id: 'tareas',
    titulo: 'Te pagan por hacer tareas ajenas',
    icono: 'documento',
    prob: 0.08,
    edadMaxima: 18,
    texto: 'Un compañero te ofrece Q40 por hacerle las tareas del mes.',
    leccion: 'Tu palabra es un activo. Es lo que le van a preguntar a tus vecinos el día que necesites un fiador, y no se compra con Q40.',
    opciones: [
      { etiqueta: 'Aceptar', icono: 'billete', dinero: 40, reputacion: -4,
        resultado: 'Ganaste Q40. Se supo, y en el colegio quedaste como el que hace trampa.' },
      { etiqueta: 'Mejor no', icono: 'visto', nada: true, reputacion: 2,
        resultado: 'Le dijiste que no y le ayudaste a entenderlas.' }
    ]
  },

  {
    id: 'zapatos',
    titulo: 'A tu hermanito le quedaron chicos los zapatos',
    icono: 'personas',
    prob: 0.08,
    edadMaxima: 20,
    texto: 'En la casa no hay este mes. Tú llevas Q150 guardados.',
    leccion: 'Ayudar en casa no es un error financiero. Lo que sí es un error es hacerlo sin saber cuánto te queda, porque entonces el mes que te toque a ti no habrá de dónde.',
    opciones: [
      { etiqueta: 'Los compro yo', icono: 'personas', dinero: -150, reputacion: 6,
        resultado: 'Se los compraste. En tu casa nadie lo va a olvidar.' },
      { etiqueta: 'No puedo', icono: 'cartera', nada: true, reputacion: -2,
        resultado: 'Dijiste que no tenías. Alguien más los consiguió usados.' }
    ]
  },

  {
    id: 'celularusado',
    titulo: 'Un celular usado',
    icono: 'celular',
    prob: 0.08,
    edadMinima: 14,
    edadMaxima: 20,
    unaVez: true,
    texto: 'Q400 por un celular de segunda mano. Sin él no te avisan cuándo hay trabajo.',
    leccion: 'Antes de comprar algo grande, pregúntate si te va a hacer ganar dinero o solo te va a hacer gastar más rápido. Las dos cosas se sienten igual el día que lo compras.',
    opciones: [
      { etiqueta: 'Comprarlo', icono: 'celular', dinero: -400, bonoJornada: 1,
        resultado: 'Ya te pueden avisar de los trabajos. Ganas Q1 más por jornada.' },
      { etiqueta: 'Esperar', icono: 'reloj', nada: true,
        resultado: 'Decidiste esperar a tener más.' }
    ]
  },

  // ---------- de adulto ----------

  {
    id: 'graduacion',
    titulo: 'La fiesta de graduación',
    icono: 'confeti',
    prob: 0.11,
    edadMinima: 17,
    requiere: function (e) { return e.educacion !== 'primaria'; },
    texto: 'La cuota de la promoción es Q700: anillo, cena y fotos.',
    leccion: 'Una sola noche puede costar lo que tres meses de ahorro. No está mal pagarla; está mal pagarla sin haber visto ese número junto.',
    opciones: [
      { etiqueta: 'Pagar la cuota', icono: 'confeti', dinero: -700, energia: 10, reputacion: 3,
        resultado: 'Fuiste a todo. Hay fotos.' },
      { etiqueta: 'Solo la cena', icono: 'plato', dinero: -180, energia: 4,
        resultado: 'Fuiste a la cena y te ahorraste el resto.' },
      { etiqueta: 'No voy', icono: 'moneda', nada: true, reputacion: -2,
        resultado: 'No fuiste. Te ahorraste los Q700.' }
    ]
  },

  {
    id: 'negociodeamigo',
    titulo: 'Un amigo te pide prestado',
    icono: 'personas',
    prob: 0.09,
    edadMinima: 18,
    requiere: function (e) { return (e.ahorro || 0) + e.efectivo >= 1500; },
    texto: 'Quiere Q1,200 para arrancar un negocio. Te dice que te paga en tres meses. No hay papel.',
    leccion: 'Prestarle a un conocido sin papel es regalarle el dinero con la ilusión de que vuelva. Si lo vas a hacer, hazlo por el monto que estarías dispuesto a perder.',
    opciones: [
      { etiqueta: 'Prestarle', icono: 'billete', dinero: -1200, reputacion: 5,
        resultado: 'Se lo diste. Los tres meses pasaron y sigue diciendo que la próxima semana.' },
      { etiqueta: 'Prestarle la mitad', icono: 'moneda', dinero: -600, reputacion: 3,
        resultado: 'Le diste Q600, que es lo que podías perder sin que doliera.' },
      { etiqueta: 'No tengo', icono: 'visto', nada: true, reputacion: -3,
        resultado: 'Le dijiste que no. Se molestó.' }
    ]
  },

  {
    id: 'curso',
    titulo: 'Un curso de inglés',
    icono: 'libro',
    prob: 0.10,
    edadMinima: 16,
    texto: 'Seis meses de curso por Q900. Con inglés se abre el mejor sueldo que hay sin título.',
    leccion: 'El call center bilingüe paga Q4,500 sin necesidad de universidad. Ese es el mejor rendimiento por quetzal invertido que ofrece el país.',
    opciones: [
      { etiqueta: 'Inscribirme', icono: 'libro', dinero: -900, bonoJornada: 2,
        resultado: 'Terminaste el curso. Con inglés te empezaron a llamar de otros lados.' },
      { etiqueta: 'Está muy caro', icono: 'cartera', nada: true,
        resultado: 'Lo dejaste para después.' }
    ]
  },

  {
    id: 'horasdomingo',
    titulo: 'Te ofrecen los domingos',
    icono: 'reloj',
    prob: 0.11,
    edadMinima: 18,
    requiere: function (e) { return e.empleo !== null; },
    texto: 'Cuatro domingos de trabajo pagados aparte. Es un mes sin descanso.',
    leccion: 'El cansancio se cobra con intereses: en este juego, enfermarte cuesta más que lo que pagan las horas extra que te enfermaron.',
    opciones: [
      { etiqueta: 'Los tomo', icono: 'maletin', bonoSalario: 0.25, energia: -25,
        resultado: 'Trabajaste todo el mes sin parar.' },
      { etiqueta: 'Necesito descansar', icono: 'luna', nada: true, energia: 6,
        resultado: 'Dijiste que no y dormiste el domingo.' }
    ]
  },

  {
    id: 'motoencuotas',
    titulo: 'Una moto en cuotas',
    icono: 'moto',
    prob: 0.08,
    edadMinima: 18,
    unaVez: true,
    requiere: function (e) { return e.empleo !== null; },
    texto: 'Q650 al mes durante tres años, sin enganche. Con moto repartes más y llegas a tiempo.',
    leccion: 'Una cuota chica durante mucho tiempo es un precio grande. Q650 por 36 meses son Q23,400 por una moto que cuesta Q14,000 al contado.',
    opciones: [
      { etiqueta: 'Firmar', icono: 'moto', bonoJornada: 4,
        cargoMensual: { nombre: 'Cuota de la moto', monto: 650 },
        resultado: 'Ya tienes moto, y una cuota de Q650 cada mes durante tres años.' },
      { etiqueta: 'Juntar y pagarla', icono: 'moneda', nada: true,
        resultado: 'Preferiste juntar y comprarla al contado más adelante.' }
    ]
  },

  {
    id: 'aguinaldocompleto',
    titulo: 'Ya cayó el aguinaldo',
    icono: 'billete',
    prob: 0.14,
    edadMinima: 18,
    requiere: function (e) { return e.empleo !== null && e.empleo.formal; },
    texto: 'Es plata que no esperabas gastar. Está completa en tu cuenta.',
    leccion: 'El aguinaldo y el Bono 14 son los dos únicos meses del año en que a un asalariado guatemalteco le sobra. Lo que se decide esos dos meses es casi todo el patrimonio de una vida.',
    opciones: [
      { etiqueta: 'Al ahorro', icono: 'banco', puntaje: 2,
        resultado: 'Lo dejaste quieto. No se siente, pero ahí está.' },
      { etiqueta: 'Estrenar algo', icono: 'etiqueta', dinero: -900, energia: 8,
        resultado: 'Te compraste algo que querías desde hace meses.' }
    ]
  }

];
