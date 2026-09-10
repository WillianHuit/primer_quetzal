/* Mi Primer Quetzal — el barrio del centro del tablero
 *
 * En un tablero de mesa el centro son las cartas. Aquí el centro es EL BARRIO
 * donde vive el personaje, en tres dimensiones, y cambia mientras la partida
 * avanza.
 *
 * Por qué el barrio y no un adorno: el juego mide dinero, y el dinero de
 * verdad no se ve en un número, se ve en la calle. Un jugador que empieza en un
 * asentamiento de lámina y a los treinta está en una colonia de dos niveles
 * entendió lo que pasó sin que nadie le pusiera una gráfica delante. Y al
 * revés: quien no avanzó tiene su barrio igual que el primer día, todo el
 * tiempo a la vista, sin un solo regaño.
 *
 * ---------------------------------------------------------------------------
 * Este archivo se puede editar sin saber programar
 * ---------------------------------------------------------------------------
 * Cada NIVEL es un barrio entero. Se dibuja con cajas de verdad —tienen techo,
 * frente y costado— y lo único que hay que decir de cada pieza es qué es y
 * dónde va:
 *
 *   tipo   qué se para ahí. La interfaz conoce estos:
 *
 *            'lamina'   casa de lámina y madera. Una planta.
 *            'casa'     casa de block con su techo.
 *            'edificio' varios niveles, con ventanas.
 *            'tienda'   la tienda de la esquina, con su toldo.
 *            'arbol'    un árbol.
 *            'poste'    poste de luz.
 *            'cancha'   la cancha de la colonia. Va pegada al suelo.
 *
 *   x      de 0 a 100, de izquierda a derecha del barrio.
 *   z      de 0 a 100, del fondo hacia el frente. 0 es lo más lejano.
 *   alto   cuántos niveles mide. Solo lo usan 'casa' y 'edificio'.
 *
 * Lo que se dibuja primero va detrás: el orden de la lista es el orden de
 * profundidad, y la interfaz lo reordena por `z` de todas formas para que nada
 * quede tapado por algo que está más lejos.
 *
 * ---------------------------------------------------------------------------
 * En qué barrio empieza cada quien
 * ---------------------------------------------------------------------------
 * En el que le tocó, y eso lo decide la dificultad que eligió al empezar. No es
 * un castigo ni un premio: es de lo que va este juego. Dos personajes con la
 * misma disciplina no arrancan en la misma calle, y el jugador lo ve antes de
 * tocar un botón.
 *
 *   BARRIO_POR_ORIGEN     el barrio del primer día, por origen del personaje
 *   patrimonio            de cuánto patrimonio en adelante se ve así
 *
 * El barrio que se muestra es el MAYOR de los dos: el de su origen y el que le
 * corresponde por lo que tiene. Así nadie baja de barrio por una mala racha
 * —de eso ya se encarga la vida— pero subir sí se ve.
 */

var BARRIO_NIVELES = [
  {
    id: 'asentamiento',
    nombre: 'El asentamiento',
    descripcion: 'Lámina, madera y calle de tierra. Aquí empieza mucha gente.',
    suelo: 'tierra',
    piezas: [
      { tipo: 'lamina', x: 12, z: 18 },
      { tipo: 'lamina', x: 38, z: 10 },
      { tipo: 'poste',  x: 62, z: 22 },
      { tipo: 'lamina', x: 80, z: 16 },
      { tipo: 'lamina', x: 22, z: 62 },
      { tipo: 'tienda', x: 52, z: 58 },
      { tipo: 'lamina', x: 84, z: 66 },
      { tipo: 'arbol',  x: 68, z: 88 }
    ]
  },
  {
    id: 'colonia',
    nombre: 'La colonia',
    descripcion: 'Casas de block, la tienda de la esquina y una cancha.',
    suelo: 'tierra',
    piezas: [
      { tipo: 'casa',   x: 10, z: 14, alto: 1 },
      { tipo: 'casa',   x: 36, z: 8,  alto: 2 },
      { tipo: 'poste',  x: 58, z: 18 },
      { tipo: 'casa',   x: 78, z: 12, alto: 1 },
      { tipo: 'cancha', x: 30, z: 46 },
      { tipo: 'tienda', x: 76, z: 52 },
      { tipo: 'arbol',  x: 8,  z: 60 },
      { tipo: 'casa',   x: 46, z: 78, alto: 1 },
      { tipo: 'arbol',  x: 84, z: 86 }
    ]
  },
  {
    id: 'residencial',
    nombre: 'La residencial',
    descripcion: 'Dos niveles, banqueta y árboles en la calle.',
    suelo: 'asfalto',
    patrimonio: 90000,
    piezas: [
      { tipo: 'casa',     x: 10, z: 12, alto: 2 },
      { tipo: 'casa',     x: 34, z: 8,  alto: 2 },
      { tipo: 'edificio', x: 60, z: 10, alto: 3 },
      { tipo: 'casa',     x: 84, z: 14, alto: 2 },
      { tipo: 'arbol',    x: 22, z: 42 },
      { tipo: 'arbol',    x: 50, z: 40 },
      { tipo: 'arbol',    x: 78, z: 44 },
      { tipo: 'casa',     x: 14, z: 74, alto: 2 },
      { tipo: 'tienda',   x: 44, z: 78 },
      { tipo: 'casa',     x: 76, z: 76, alto: 2 }
    ]
  },
  {
    id: 'zona',
    nombre: 'La zona',
    descripcion: 'Edificios, oficinas y un banco en la esquina.',
    suelo: 'asfalto',
    patrimonio: 700000,
    piezas: [
      { tipo: 'edificio', x: 8,  z: 10, alto: 5 },
      { tipo: 'edificio', x: 30, z: 6,  alto: 4 },
      { tipo: 'edificio', x: 52, z: 10, alto: 6 },
      { tipo: 'edificio', x: 76, z: 8,  alto: 4 },
      { tipo: 'arbol',    x: 20, z: 40 },
      { tipo: 'arbol',    x: 64, z: 38 },
      { tipo: 'edificio', x: 12, z: 70, alto: 3 },
      { tipo: 'edificio', x: 40, z: 74, alto: 3 },
      { tipo: 'tienda',   x: 70, z: 78 },
      { tipo: 'poste',    x: 90, z: 62 }
    ]
  }
];

/* Los dos sitios del barrio que NO salen de esta lista: la casa donde vive el
 * personaje y el lugar donde trabaja. Se dibujan siempre en el mismo par de
 * puntos de la placita —al frente, uno a cada lado del dado— para que el
 * jugador sepa dónde mirar sin buscarlos, y cambian con la partida: la casa
 * crece cuando se muda y el trabajo lleva el emblema de su oficio.
 *
 * Mover uno es cambiar estos números. Lo único que hay que respetar es dejar
 * libre el centro de enfrente, que es donde cae el dado. */
var BARRIO_PROPIOS = {
  casa:    { x: 16, z: 92 },
  trabajo: { x: 84, z: 92 }
};

/* El barrio del primer día, por origen del personaje. Los tres niveles de
 * dificultad de la pantalla de inicio salen cada uno de un origen distinto
 * (ver NIVELES_JUEGO en datos/origenes.js), así que elegir "difícil" es
 * empezar en el asentamiento y elegir "fácil" es empezar en la residencial. */
var BARRIO_POR_ORIGEN = {
  sosten:  'asentamiento',
  remesas: 'colonia',
  apoyo:   'residencial'
};
