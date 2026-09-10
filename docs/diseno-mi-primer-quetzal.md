# Mi Primer Quetzal — de los 13 a la jubilación

Documento de diseño, versión 3.0 — 7 de septiembre de 2026

Simulador de vida financiera para aprender a usar productos bancarios.
Banco ficticio: **Banco Cardamomo**. País: Guatemala. Moneda: Quetzal (Q).

> Los valores numéricos de este documento provienen de `investigacion-economia-guatemala.md`.
> Las cifras marcadas **[E]** son estimaciones de diseño y necesitan tu validación.

---

## 1. Qué es el juego

El jugador toma a un chico de **13 años que acaba de salir de primaria**, sin cuenta
bancaria y sin trabajo, y lo acompaña hasta la jubilación a los 65. La primera decisión del
juego es la que decide todo lo demás: seguir estudiando o ponerse a trabajar. Después decide
en qué reparte las ocho jornadas de cada mes, dónde vive, qué hace con las remesas que le
manda su hermano desde Estados Unidos, cuándo abrir una cuenta, cuándo pedir prestado y a
quién.

No hay forma de perder. Hay formas de llegar a los 65 con muy poco.

La tesis pedagógica es que las lecciones financieras no se enseñan, se sufren. El juego
nunca dice "debiste ahorrar". Muestra que el jugador pagó Q1,800 en intereses de mora ese
año y le recuerda que eso era el enganche de su moto.

## 2. Audiencia y plataforma

| Aspecto | Decisión |
|---|---|
| Audiencia | Jóvenes de 12 a 25 años, público general |
| Dispositivo | Celular primero, vertical, táctil |
| Idioma | Español e inglés, con detección automática y selector |
| Distribución | GitHub Pages, sitio estático, sin cuenta ni registro |
| Tecnología | HTML, CSS y JavaScript puros, sin framework ni compilación |
| Estilo | Plano y moderno, con emojis e íconos. Tono cercano y con humor |

El inglés es traducción literal. El contexto sigue siendo Guatemala y la moneda sigue
siendo el Quetzal. Sirve para la diáspora y para mostrar el proyecto.

## 3. Bucle de juego

Un turno es un **mes** y contiene **ocho jornadas**: cuatro semanas de mañana y tarde.
Cada jornada se asigna a una actividad. Al cerrar el mes se cobra el salario, se descuentan
los gastos fijos, se aplican intereses y se resuelven los eventos.

### Por qué jornadas y no semanas

Durante toda la versión 1 y 2 la unidad fue la semana completa, y eso hacía imposible
representar cómo vive la mitad del país: **los colegios de Guatemala son de jornada, no de
día completo**. El chico que estudia por la mañana puede trabajar por la tarde, y esa es
exactamente la decisión que el juego quiere poner enfrente.

Con la semana como unidad más chica, "estudio y trabajo" era una fracción del mes; con la
jornada, es una fila y la otra:

| | Sem 1 | Sem 2 | Sem 3 | Sem 4 |
|---|---|---|---|---|
| **Mañana** | Colegio | Colegio | Colegio | Colegio |
| **Tarde** | Trabajo | Trabajo | Trabajo | Descanso |

Las jornadas que el colegio tiene tomadas **no se pueden vaciar**, y eso no es una
limitación de la interfaz: es la regla. Según el nivel:

| Nivel | Horario | Qué decide el jugador |
|---|---|---|
| Básicos | `fijo` | Nada: el instituto le toma las mañanas de las cuatro semanas |
| Diversificado | `jornada` | Mañana o tarde al inscribirse; la otra jornada es suya |
| Universidad | `libre` | Todo: reparte jornada por jornada |

Actividades que consumen jornadas:

| Actividad | Energía por jornada |
|---|---|
| Trabajar | -6 |
| Atender un negocio | -6 |
| Sentarse en clase | -3 |
| **Hacer una tarea** | **-35** |
| Minijuego de oficio | -6 |
| Descansar | +26 |

**La tarea cuesta seis veces lo que cuesta trabajar, y ahí está la lección.** Costó -5 una
versión entera y no se sentía: se podían poner cuatro tareas seguidas y sobraba cuerpo. Con
-35, la primera tarea del juego se lleva un tercio del jugador y la segunda del mes ya no
cabe sin descansar. Es la primera cosa que este juego enseña, antes que cualquier número de
dinero: el tiempo no es lo único que se gasta estudiando.

La cuenta que le sale a quien estudia, con las cuatro semanas abiertas: cuatro mañanas de
colegio (-12), una tarea (-35) y dos descansos (+52) dejan +5 y una jornada libre para
trabajar. Apretado a propósito, y es lo que la mejora `metodo` afloja.

#### Y no se puede cerrar un mes que te deje en negativo

Antes la energía se recortaba a cero al cerrar el mes y no pasaba nada más: se le podían
poner ocho jornadas de trabajo a un cuerpo agotado. Ahora **un mes no puede dejarte por
debajo de cero**, y las actividades que no caben salen apagadas con su costo al lado, no
se rechazan al tocarlas. El límite se mide por MES y no por turno: un trimestre de ocho
jornadas de trabajo es insostenible, no imposible —se puede un mes, se puede dos, y al
tercero hay que descansar— y para eso la pantalla avisa en vez de prohibir.

La otra penalización es la que funciona a los trece, cuando los golpes de dinero los
absorbe la familia: **cansado se aprende la mitad**. Debajo de 20 de energía, una tarea da
la mitad de experiencia.

#### El mes no se reparte: se recorre

Aquí hubo una **rejilla de ocho casillas** que el jugador rellenaba antes de cerrar el mes,
y una versión en la que esas casillas se abrían de semana en semana para que la primera
pantalla pidiera una decisión y no ocho. Las dos se fueron, y por el mismo motivo: la
rejilla le pedía **planificar un mes a alguien que todavía no sabe qué es un mes**. Ocho
decisiones a la vez, todas dependiendo unas de otras, antes de haber visto una sola
consecuencia.

Ahora el mes es un **tablero de treinta o treinta y un días** —los del calendario, ver
`TABLERO_DIAS_POR_MES`— y se recorre con un **dado**. Un tablero pide una cosa a la vez por
su propia forma, y cada tirada trae una decisión chica y cerrada que se entiende sin que
nadie la explique.

| Tipo de día | Qué hace | Etapa |
|---|---|---|
| Un día cualquiera | nada. Se cuenta en una línea y se sigue | las dos |
| Tarea del colegio | te sale una tarea al azar. La haces o la dejas | las dos |
| Un día para ti | descansas y recuperas cuerpo | las dos |
| Se te atravesó el día | te cuesta cuerpo, y no se elige | las dos |
| Te toca elegir | comodín: A o B, y ninguna dice lo que va a pasar | las dos |
| Te sale trabajo | una jornada que cuenta para el sueldo | con trabajo |
| Un trabajito suelto | un oficio de los de Extra, se paga aparte | con Extra |

Un mes son **ocho o nueve tiradas** con un dado de seis caras, así que el jugador decide
siete u ocho veces por mes sin que ninguna decisión le haya pedido pensar en las otras.

**La contabilidad no cambió.** Las ocho jornadas de `estado.espacios` siguen existiendo y
siguen siendo de donde salen el sueldo por jornadas trabajadas, lo que producen los negocios
y lo que avanza la carrera. Lo que cambió es **quién las llena**: antes el jugador a mano,
ahora el tablero al aceptar una casilla. Y aceptar sigue pasando por la misma regla de
energía, así que una tarea que dejaría el mes en negativo no se puede tomar ni desde el
tablero ni desde ningún otro sitio.

**Y el mes se cierra al llegar al final**, no con un botón que está siempre ahí. Antes se
podía tocar "terminar el mes" en cualquier momento, y el jugador que no entendía la rejilla
acababa tocando ese botón cinco veces sin haber decidido nada. Para llegar al último día hay
que haber pasado por los treinta.

#### Un anillo cuadrado, como el de mesa

El camino va por el **borde de un cuadrado** y el centro queda libre para el dado, igual que
un tablero de mesa. La primera versión iba en serpiente —filas de seis, la siguiente al
revés— y se leía como un calendario, no como un tablero. La forma no es decoración: dice de
un vistazo que el mes es una vuelta que empieza y termina en el mismo sitio.

El perímetro de una cuadrícula de R×C son `2R+2C-4` casillas, y eso **siempre es par**. Un
mes de 31 días no encaja en un número par, así que el camino lleva siempre una casilla de
**SALIDA** —la de "GO"— y las que sobren quedan como camino sin día:

| Mes | Anillo | Reparto |
|---|---|---|
| 28 días | 9×8 = 30 | salida + 28 días + 1 de camino |
| 30 días | 9×9 = 32 | salida + 30 días + 1 de camino |
| 31 días | 9×9 = 32 | salida + 31 días, justo |

**Y la ficha camina, casilla por casilla.** Un brinco cada 165 ms, con su sonido. Es la
diferencia entre un tablero y una barra de progreso: el jugador tiene que ver por dónde
pasó, porque los días que se salta son días que existen y que le podrían haber tocado. Tres
tiradas de dos son seis pasos, y en seis pasos se entiende el tablero sin leer nada.

La ficha va **fuera** de las casillas, colocada con `grid` igual que ellas, y se mueve
cambiando su fila y su columna. Metida dentro de una casilla habría que redibujar el tablero
en cada paso y el paseo se vería a saltos.

Y como la ventana de la casilla se abre **al llegar**, `pruebas/dom-real.js` tendría que
esperar cronómetros de verdad para comprobar qué preguntó. Para eso está `SIN_PASEO`, el
mismo patrón que `RUTA_ASSETS`: un interruptor que el banco de pruebas enciende, documentado
donde se lee. Una prueba que espera relojes es una prueba que un día falla sola.

#### La cámara: sentado a la mesa, no mirando un plano

El tablero estuvo inclinado **18 grados**, y los 18 grados eran por miedo a que no se
leyeran los números de los días. Salió caro: con el plano casi de frente **nada se puede
parar encima**, porque una pared perpendicular a ese plano se ve de canto. El tablero era un
dibujo con relieve, no un sitio.

Ahora la cámara va **baja y cerca**: 52 grados de inclinación, mil píxeles de distancia y el
punto de fuga por debajo del centro. Con eso los días que el jugador tiene enfrente son
grandes y los del otro lado se ven pequeños y al fondo —un tablero de mesa mirado de
verdad—, y las casitas de las casillas y los edificios del centro se paran de verdad.

El precio es que **las letras de la fila del fondo no se leen**. No es un descuido: en un
tablero de mesa tampoco. Por eso hay dos formas de leer el tablero, y las dos hacen falta:

- **de lejos, por los bultos.** Cada día tiene una cosa parada encima, con su color y su
  sombra, y eso se ve desde el otro lado del tablero.
- **de cerca, por las letras.** En cuanto el dado cae, la cámara baja al personaje y lo
  **sigue** casilla por casilla; al llegar se cierra sobre la tarjeta.

#### El turno tiene cuatro tiempos

1. **El cubo rueda**, con el mes entero a la vista: eso es lo que hay que ver para entender
   la tirada.
2. **La cámara baja** al personaje y el tablero **gira** para poner su lado de frente.
3. **La ficha camina**, y la cámara va detrás. Cada paso suena una nota un semitono más alta
   que la anterior, así que un seis suena como una escalerita y el oído cuenta los pasos sin
   mirar.
4. **Al llegar hay un respiro** —700 ms— y ahí suena lo que le tocó: alegre si fue algo
   bueno, triste si fue algo malo. Solo entonces se abre la tarjeta. El respiro es la mitad
   del asunto: una ventana que salta en el mismo instante en que la ficha se para no se
   siente una consecuencia, se siente una interrupción.

Una tarea y un comodín **no suenan** ni a bueno ni a malo, y es a propósito: son decisiones,
no cosas que te pasan, y el juego no va a decirle cuál es la buena. El comodín sí suena
después de elegir, cuando ya se sabe cómo salió. Y suena también para quien pidió menos
movimiento: pedir menos movimiento no es pedir menos sonido, y el aviso de si te tocó algo
bueno o algo malo es justo el que no conviene perderse.

**El sonido viene encendido, y antes no.** Estuvo apagado por omisión con un argumento
razonable —mucha gente juega en el bus— y el resultado fue que el juego era mudo para todo
el mundo: el interruptor vivía dentro del menú de los tres puntos y nadie entra ahí a buscar
algo que no sabe que existe. Medio juego suena y nadie lo había oído nunca. Ahora arranca
encendido y el interruptor está **en el tablero**, al lado del botón del dado, que es donde
suena; un toque lo calla y quien lo calla se queda callado para siempre, porque la elección
del jugador manda sobre el arranque.

#### La cámara: medida, no calculada

Cuánto hay que correr la lente para centrar una casilla **se mide del navegador**: un plano
con perspectiva no proyecta las casillas donde dice la cuadrícula —las de atrás se juntan y
las de adelante se abren—, así que cualquier cuenta a mano queda mal justo en las esquinas.
`getBoundingClientRect()` ya trae la casilla donde de verdad se está viendo, y con el origen
en el centro basta con `t = -d·s`. Cuatro cosas que costaron sangre, y las dos primeras
cuestan la animación entera:

- **Medir no puede costar un repintado.** La primera versión ponía el giro final sin
  transición, medía y lo devolvía todo antes de pintar. La medida salía bien y la animación
  salía rota: el navegador toma el punto de partida de una transición del último estilo que
  calculó, y ese ir y venir se lo dejaba en otro sitio. La cámara **saltaba** en vez de
  seguir a la ficha.
- **Y no se puede medir un tablero que está girando.** `rect` devuelve dónde está la casilla
  *ahora*, a media vuelta, no dónde va a quedar. Por eso el plano se mide **una vez por
  turno** —`tomarMedidas()`, con el tablero recién dibujado y sin una sola animación
  encima— y de ahí en adelante se calcula. Se puede calcular porque girar un cuadrado un
  cuarto de vuelta **no mueve los sitios de la pantalla**: los deja ocupados por otras
  casillas. Si la casilla de la fila 1 columna 8 va a acabar donde ahora está la de la fila 8
  columna 7, su sitio ya está medido. De ahí el `data-f`/`data-c` de cada casilla.
- **La lente va por FUERA de la perspectiva.** Metida dentro, su `scale` escalaba la escena
  en tres dimensiones —la capa lleva `preserve-3d`— y eso cambia cómo proyecta la
  perspectiva: la casilla no acababa donde decía la cuenta. Por fuera, la escena se dibuja
  primero y la lente mueve y agranda el resultado, como una lupa sobre una foto.
- **La cámara no se sale del tablero.** Centrar la casilla y ya se veía bien en medio del
  mes y fatal en las orillas: media pantalla en blanco. `dentroDelTablero()` la sujeta —el
  tablero tiene que seguir tapando la ventana, con un 12% de holgura para que el día de
  enfrente no quede pegado al borde—, que es lo mismo que hace cualquier cámara de juego con
  los bordes del mapa.

Los tiempos, que son la diferencia entre seguir a alguien y parpadear detrás de él: un paso
cada **210 ms**, la cámara detrás con una transición de **400 ms** —un pelo más lenta que el
paseo, para que se note que lo sigue y no que salta con él— y el giro de la esquina en
**500 ms** con peso, arrancando y frenando despacio. Y en el paso que cruza la esquina el
paseo espera **330 ms de más**: ahí el tablero da un cuarto de vuelta y hay que verlo girar.
Sin esa espera el giro se comía con el paso siguiente.

#### El tablero gira, como el de mesa

En un tablero de mesa las tarjetas de cada lado están impresas mirando a quien se sienta en
ese lado, y para leer las de enfrente hay que darle la vuelta al tablero. Aquí pasa
exactamente eso: mientras la ficha camina, el tablero **gira** (`--vuelta`) para que el lado
por el que va quede abajo, de frente. Y la tarjeta está impresa mirando a su lado
(`--vuelta-tarjeta`: 0°, 90°, 180° o -90°). Las dos rotaciones se anulan, así que la tarjeta
que la cámara está mirando **siempre** se lee así:

```
=========================
   TAREA                  <- la franja, con el nombre del día
=========================
      [ el objeto ]
   7            ⚡ -35     <- el número y lo que cuesta
```

Dos consecuencias que hay que tener en la cabeza al tocar esto:

- **El anillo es un cuadrado exacto** (9×9 siempre, con las casillas que sobren como camino
  sin día). Antes era «lo más cuadrado posible» y febrero salía 9×8: girarle la cara 90° a
  una casilla que no es cuadrada la desborda.
- **Las cajas tienen CUATRO paredes.** Tenían tres —techo, frente y costado—, así que solo
  servían vistas desde una esquina y había que desgirarlas cada vez que el tablero giraba.
  Una casa que pivota sobre sí misma cada vez que giras el tablero no parece una casa,
  parece un cartel. Con las cuatro se quedan quietas, el tablero gira y las ves por el otro
  lado, que es lo que pasa al girar un tablero de mesa. Por lo mismo el **emblema va en el
  techo**: desde arriba se ve caiga el tablero como caiga.
- **Lo que sí desgira** es lo que es del jugador y no del mundo: la ficha, el dado y el
  rótulo del barrio. Los dos últimos van en una capa que desgira entera
  (`.barrio-frente`): si no, a media vuelta el dado acababa tirado en la acera del fondo.

#### Cada día es una tarjeta, y lleva algo encima

La casilla tiene la forma de una tarjeta de tablero de mesa: **franja de color** mirando al
centro, el **número del día** en la esquina de afuera, **lo que cuesta o da** en la otra
esquina y con el icono de lo que se mueve, y el **objeto parado** en medio. Las cuatro
franjas apuntan hacia dentro, que es lo que hace que el anillo se lea como un anillo y no
como cuatro filas de tarjetas sueltas.

Y la ventana que se abre al caer tiene **la misma forma**: `escritura()` dibuja la franja del
color del día, el objeto en grande sobre su tarima y debajo lo que da y lo que quita. No es
coquetería: el jugador acaba de ver la cámara acercarse a un cuadro con una franja amarilla y
un bulto encima, y lo que se le abre es ese mismo cuadro en grande. No hay que explicarle de
dónde salió la ventana.

Los objetos y los edificios están hechos con **la misma pieza**: `caja3d()`, tres caras
—techo, frente y costado— y una sombra en el suelo. Una función, dos usos; si mañana cambia
cómo se ve el relieve, cambia el tablero entero. Las medidas van en píxeles y no en
porcentajes porque `translateZ` **no acepta porcentajes**: si el ancho fuera relativo y el
alto no, las cajas se deformarían con el ancho de la pantalla.

#### Lo que te pasa tiene precio, y a veces no lo puedes pagar

Las dificultades costaban solo cuerpo. Ahora pueden costar **cuerpo, dinero y experiencia**,
y cada una pide la condición que le toca (`si: 'dinero'`, `si: 'estudia'`, `si: 'trabaja'`):
no se le quita el cuaderno a quien no estudia, ni Q350 a quien tiene Q80.

Esa condición nació de un error que el jugador vio: un comodín le ofrecía *"hay partido en la
cancha y tienes tarea pendiente"* a alguien que había decidido no estudiar. **Elegir entre
dos cosas cuando una de las dos no existe no es una decisión, es un error.** La misma palabra
vale ahora para las casillas —las tareas no le salen a quien no está inscrito—, para las
dificultades y para los comodines.

**Y lo que sabes no se puede deber.** Si una dificultad quita 12 de experiencia y el jugador
solo tiene 5, los 7 que faltan se cobran donde sí hay de dónde: en dinero por tres y en
cuerpo por medio (`CONFIG.experiencia.deuda`). Es la parte del juego que castiga más al que
no ha estudiado nada, que es justo al que le tiene que doler; la ventana se lo explica sola
para que nadie vea salir quetzales de una casilla que hablaba del cuaderno.

Y una dificultad **nunca deja a nadie en números rojos**: se cobra de lo que hay. Para
endeudarse están los préstamos, que son una decisión y no un accidente.

#### El día que no existió

La casilla rara del tablero, y la única que solo da. Cae poco —peso 3, uno cada dos o tres
meses— y lo que da depende de lo que el jugador ya tenga: **dinero** solo si ya maneja
dinero (un 5–20% de lo suyo, en porcentaje y no en cifra fija, porque una cifra fija o no se
nota a los cuarenta o rompe el juego a los quince), **algo aprendido** solo si estudia, y de
**0 a 100 de cuerpo** siempre. Que a veces no dé nada es parte del asunto.

#### Al final del mes cae el sello

Treinta días recorridos de uno en uno merecen algo más que una línea gris. La cámara se abre
—se ve el mes entero recorrido—, el sello cae encima y baja el confeti. Se va solo a los dos
segundos: no hay que cerrarlo, no tapa el botón de terminar el mes y no le pide nada al
jugador. Una celebración que hay que despachar deja de ser una celebración.

#### El barrio del centro dice de dónde sales

En un tablero de mesa el centro son las cartas. Aquí es **el barrio donde vive el
personaje**, y sale de dos cosas (ver `datos/barrio.js` y `Motor.nivelDeBarrio()`):

| Barrio | Se empieza aquí si… | Y se llega por patrimonio |
|---|---|---|
| El asentamiento | tu familia depende de ti (difícil) | — |
| La colonia | te mandan remesas (medio) | — |
| La residencial | tu familia te puede apoyar (fácil) | Q90,000 |
| La zona | — | Q700,000 |

Se queda con **el mayor de los dos**: nadie baja de barrio por una mala racha —de eso ya se
encarga el resto del juego— pero subir sí se ve. Y se ve **antes de tocar un botón**: la
dificultad que se eligió en la pantalla de inicio deja de ser una palabra y es una calle de
tierra con casas de lámina, o una con banqueta y árboles.

El dado vive en la **placita de enfrente** del barrio, tirado sobre el tablero. El botón, en
cambio, se fue **debajo del tablero y de frente**: antes vivía en el centro, que era lo único
que había ahí, y un botón inclinado 52 grados encima de las casas no se lee ni se atina.

#### Y todo esto en 3D, sin una sola librería

El dado es un **cubo de seis caras** con puntos de verdad: cada cara girada y empujada media
arista hacia fuera, y el cubo entero rueda hasta poner delante la que salió. El resultado no
se anuncia, se ve caer.

Todo eso son `perspective`, `transform-style: preserve-3d` y rotaciones en X e Y. **Cero
librerías**, y no por tacañería:

- La promesa del proyecto es que el juego **abre con doble clic y sin descargar nada**. Un
  motor de escena son unos 600 KB, casi tres veces todo lo que hay hoy en `vendor/` y la
  mitad del presupuesto de arte, para dibujar un plano inclinado y un cubo.
- Y sobre todo: un `<canvas>` de WebGL **no se puede probar**. `pruebas/dom-real.js` juega el
  juego tocando nodos —200 comprobaciones, y 22 mas del tablero— y el tablero es justo la pantalla donde más hay
  que romper. Con transformaciones CSS cada día del mes sigue siendo un `<div>` que la suite
  puede mirar y tocar.

Quien pidió menos movimiento (`prefers-reduced-motion`) se queda con el **tablero plano**, el
dado quieto y la cámara sin acercarse. El 3D es cómo se ve mejor, no cómo se juega: la
información es la misma, y plano se lee incluso mejor —los 31 días con su precio, todos a la
vez—. Dos cosas hay que ajustar ahí y las dos están en el mismo bloque: la ventana del
tablero se vuelve **cuadrada** (con la inclinada se salían la fila de arriba y la de abajo) y
a las cajas se les deja **solo el frente**, que es el que lleva el icono, porque sin plano
inclinado una pared se ve de canto.

El sueldo se paga **según cuántas jornadas trabajaste**, y no de forma proporcional:

| Jornadas | Sueldo que cobras | | Jornadas | Sueldo que cobras |
|---|---|---|---|---|
| 8 | 100% | | 4 | 45% |
| 7 | 85% | | 3 | 33% |
| 6 | 70% | | 2 | 20% |
| 5 | 57% | | 1 | 10% |

Esta tabla es el corazón del juego. Estudiar y descansar cuestan sueldo, y la penalización
es peor que proporcional, así que dejar de trabajar duele de verdad. Los números pares son
los mismos de cuando esto se contaba por semanas.

**La excepción son los trabajitos de niño.** Vender limonada se cobra por jornada, así que
ahí la proporción sí es lineal: dos jornadas pagan exactamente el doble que una. Un chico de
13 no tiene sueldo del que le descuenten.

El balanceo se calibró simulando 24 meses con cinco estrategias distintas. Trabajar las
cuatro semanas todos los meses agota la energía, provoca enfermedades y **termina peor** que
trabajar tres y descansar una: quemarse no puede ser la estrategia ganadora.

### Compresión temporal

Seiscientos veinticuatro meses son demasiados turnos para un celular. El juego cambia
de escala según la etapa de vida.

| Edad | Escala del turno | Turnos |
|---|---|---|
| 13 a 14 | Mensual | 12 |
| 14 a 45 | Trimestral | 124 |
| 45 a 65 | Anual | 20 |

Total: **156 turnos**. El corte mensual está a los 14 y no más allá porque el primer año
es donde se aprende a jugar —el tutorial, la primera tarea, el primer trabajito— y eso se
vive mes a mes o no se vive.

De los 14 en adelante el turno es un trimestre, y esa segunda escala no es solo
compresión: es como se vive el colegio de verdad, por bimestres y notas. Antes los nueve
años de 13 a 22 eran mensuales, o sea 108 turnos solo para salir del colegio, y la
elección de diversificado —la decisión más grande de esa etapa, diecinueve carreras sobre
la mesa— quedaba a tres horas de juego. Nadie llegaba. Con trimestres, básicos son 20
turnos y el jugador elige rama a los 16, que es la edad real.

Hubo además un botón de **adelantar** que saltaba hasta el próximo evento o decisión
pendiente, y se quitó. La idea era enseñar el interés compuesto de un tirón; lo que hacía
en la práctica era repartir el mes por el jugador durante dos años seguidos. En un juego
cuya única pregunta es en qué se te va el tiempo, un botón que gasta el tiempo por ti es
la forma de jugar sin jugar. La compresión por etapa —trimestres a los 22, años a los
45— ya hace ese trabajo, y lo hace sin quitarle a nadie la decisión.

## 4. Recursos del jugador

- **Dinero**: efectivo en mano y saldos por producto, separados.
- **Energía**: de 0 a 100. Bajo 20 hay riesgo de enfermedad, que cuesta dinero y turnos.
- **Edad**: avanza con el calendario, visible siempre.
- **Puntaje de crédito**: de 0 a 100, con medidor en pantalla.
- **Experiencia de estudio**: se gana haciendo tareas y, más despacio, con solo estar
  inscrito. Abre las carreras de arriba y **se puede gastar**: es la moneda de la tienda de
  `datos/mejoras.js` → `MEJORAS_SABER`, la única que no se paga con quetzales. Eso la
  convierte en una decisión, porque lo que se gasta ahí no está para la carrera que lo pide.
- **Antigüedad**: años acumulados en cada empleo, sube el salario dentro del puesto.

No hay ánimo ni felicidad. El juego trata de dinero.

## 5. Estado inicial

| Concepto | Valor |
|---|---|
| Edad | **13 años, recién salido de primaria** |
| Educación | Primaria terminada. Básicos sin empezar |
| Efectivo | Entre Q60 y Q200 según el origen: lo que trae guardado un chico |
| Mesada | Entre Q0 y Q120 al mes según el origen |
| Vivienda | Casa familiar. Siendo menor, solo gasta Q20 al mes de su bolsa |
| Cuenta bancaria | Ninguna. Siendo menor la abre con un adulto y con Q50 |
| Trabajo | Ninguno. A su edad solo existen tres trabajitos de calle |
| Puntaje de crédito | 0, sin historial y sin fiador |
| Remesa | Llega a la casa, no a él: la administran sus papás hasta los 18 |

### Por qué a los 13 y no a los 18

Arrancar a los 18 con el diversificado en la mano significaba que **el juego ya había
tomado por el jugador la decisión financiera más importante de su vida**. En Guatemala la
tasa neta de cobertura del ciclo básico anda por el 46%: más de la mitad de los chicos no
llega ahí. Y la diferencia de ingreso entre quien termina básicos y quien no es de por vida.

Empezar a los 13 pone esa decisión en la primera pantalla, sin adorno: estudias básicos o te
pones a trabajar. El juego no marca ninguna de las dos como correcta, y la pregunta vuelve
cada vez que el jugador se gradúa de algo.

### El salto de los 18

Mientras es menor de edad, el gasto de la casa no es suyo: en su casa lo cubren, y lo único
que sale de su bolsa son Q20 de pasaje y refacción. El mes que cumple 18 pasa a pagar su
parte completa —Q2,200 con la casa familiar del origen de remesas— y el juego saca una
ventana comparando las dos cifras.

Ese salto le pasa a todo el mundo y a casi nadie le avisan. Quien llega a los 18 con algo
guardado lo absorbe; quien llega en cero empieza pidiendo prestado. Es la lección más
barata de dar y la más caras de aprender afuera.

La remesa es deliberadamente irregular. Enseña que un ingreso que no controlas no sirve
para comprometer gastos fijos, que es justo el error de quien las recibe.

## 6. Dificultad: las dos Guatemalas

El selector de dificultad no cambia multiplicadores ocultos. Cambia **en qué Guatemala
vive el personaje**, y esa es en sí misma la lección.

| | Normal | Difícil |
|---|---|---|
| Contexto | Empleo formal urbano | Economía informal |
| Ingreso de referencia | Q3,600 | Q1,500 a Q2,300 |
| Bono 14 y aguinaldo | Sí | No |
| Seguro social | Sí | No |
| Construye historial | Sí | No |
| Margen de ahorro | Q300 a Q800 | Casi nulo |

El 66.2% de los ocupados guatemaltecos vive en el modo difícil. El jugador descubre que la
diferencia entre poder ahorrar y no poder no es disciplina, es tipo de contrato.

## 7. Trabajo y carrera

El riesgo de la educación viene de tres fuentes combinadas: la **saturación** del mercado,
la **ruta de empleo** que elijas dentro de tu nivel, y la **experiencia** acumulada.

### El dato que sostiene el diseño

| Nivel | Ingreso mediano formal |
|---|---|
| Sin educación | Q2,400 |
| Primaria | Q3,000 |
| Básico | Q3,325 |
| Bachiller | Q3,800 |
| Licenciatura | Q4,300 |
| Maestría | Q10,000 |

La licenciatura sube 13% sobre el bachiller y queda rozando el salario mínimo de
Q4,252.28. La maestría sube 133%. La ruta larga paga solo si se completa. Quien la
abandona a mitad pierde cinco años y no gana casi nada.

### Rutas de estudio

La escalera completa, desde que el jugador sale de primaria a los 13:

```
primaria → básicos → diversificado → técnico       → (fin)
                                   → licenciatura  → maestría
```

| Ruta | Duración | Horario | Costo público | Costo privado |
|---|---|---|---|---|
| Básicos | 3 años | `fijo` (mañanas) | Q0 | Q5,000 al año [E] |
| Bachillerato en ciencias y letras | 2 años | `jornada` | Q0 | Q9,000 al año [E] |
| Perito contador | 3 años | `jornada` | Q0 | Q10,000 al año [E] |
| Técnico | 2 años | `libre` | Q0 (USAC) | Q13,726 al año |
| Licenciatura administrativa | 5 años | `libre` | Q0 (USAC) | Q29,200 al año [V-sec] |
| Licenciatura en ingeniería | 5 años | `libre` | Q0 (USAC) | Q77,054 al año |
| Maestría | 2 años, requiere licenciatura | `libre` | Q40,000 total [E] | Q48,000 total [V] |

Cada **jornada** dedicada avanza un cuarto de mes de carrera, así que cuatro jornadas al
mes (dos semanas) es el ritmo normal y toma exactamente la duración oficial.

El instituto público y la universidad pública son **gratuitos** —la USAC desde 2026, sin
inscripción ni matrícula—. El dilema del estudio no es de dinero, es de **tiempo**: cada
jornada en el colegio es una jornada que no trabajas.

#### El diversificado: siete carreras que el jugador ve como diecinueve

El diversificado guatemalteco no es una lista de dos opciones: es un menú enorme de
bachilleratos con orientación y peritajes, y elegir dentro de ese menú es la decisión más
grande que toma un chico de dieciséis años. Que el juego ofreciera "bachillerato o perito
contador" no era simplificar, era contar otra cosa.

Pero siete ramas ya son siete conjuntos de tareas, siete demandas y siete sueldos que
balancear, y diecinueve serían imposibles de sostener. Así que la lista es **de verdad por
fuera y de siete por dentro**: cada carrera de `datos/carreras.js` es una CATEGORÍA
—tecnología, salud, comercio, arte, industrial, agro, magisterio— y sus `titulos` son los
nombres reales que el jugador elige y que después lleva en su perfil. Dos títulos de la
misma rama comparten tareas, costo y mercado, y se diferencian en el nombre y en los años.

Eso no es un truco para ahorrar trabajo: es como funciona de verdad. Un perito en
desarrollo de sistemas y uno en reparación de computadoras llevan casi las mismas clases y
compiten por los mismos puestos.

#### Y las notas, que son lo que ordena esa lista

Cada rama tiene **una tarea propia** —seguir una secuencia, decidir qué se hace primero en
una emergencia, ver cuál producto deja más, cuál recuadro está centrado, qué pieza encaja,
cuándo se siembra, cuál explicación se entiende— y las siete se pueden hacer **desde el
primer día de básicos**. Ahí no son la materia: son el sondeo. La nota que el jugador saque
en cada una se guarda por rama, y cuando llega el momento de elegir diversificado la
pantalla pone arriba las tres que mejor se le dieron, con la nota delante para que se
entienda de dónde sale, y debajo un botón que abre las diecinueve.

Es lo más cerca que puede estar un juego de una orientación vocacional, y la regla que la
hace honesta es que **nadie le dice qué estudiar**: se le enseña lo que ya hizo, ordenado,
y elige él. La lista completa está siempre a un toque.

Las notas no son una moneda ni una llave: no abren ni cierran nada. Una carrera que se le
dio mal se puede estudiar igual. Lo único que hacen es ordenar.

### Empleos

Cada empleo pide una **edad mínima** y un **nivel educativo**. Lo que el jugador no
alcanza no se le esconde: sale abajo, en una línea, con lo que le falta.

| # | Empleo | Edad | Requisito | Paga | Varianza |
|---|---|---|---|---|---|
| 1 | Vender limonada | 12 | Primaria | **Q5 por jornada** | Media |
| 2 | Vender periódico | 12 | Primaria | **Q4 por jornada** | Baja |
| 3 | Vender dulces | 12 | Primaria | **Q6 por jornada** | **Alta** |
| 4 | Repartidor en moto | 16 | Básicos | Q2,800 | Baja |
| 5 | Dependiente de tienda | 16 | Básicos | Q3,000 | Baja |
| 6 | Ayudante de construcción | 16 | Primaria | Q2,600 | Media |
| 7 | Vendedor por comisión | 16 | Primaria | Q1,800 más comisión | **Alta** |
| 8 | Agente de call center bilingüe | 18 | Diversificado | Q4,500 | Baja |
| 9 | Tienda propia | 18 | Básicos y Q8,000 de capital | Variable | **Muy alta** |
| 10 | Auxiliar contable | 18 | Técnico | Q4,000 | Baja |
| 11 | Técnico en refrigeración | 18 | Técnico | Q4,800 | Media |
| 12 | Soporte de sistemas | 18 | Técnico | Q5,200 | Baja |
| 13 | Docente | 18 | Licenciatura | Q4,200 | Baja |
| 14 | Contador | 18 | Licenciatura | Q6,000 | Media |
| 15 | Ingeniero junior | 18 | Licenciatura | Q7,500 | Media |
| 16 | Gerente o especialista | 18 | Maestría | Q12,000 | Media |

Salarios base [E], calibrados sobre las medianas por nivel educativo.

### Los tres trabajitos de niño

Los primeros tres existen para una sola cosa: que la comparación se vea. Ocho jornadas
vendiendo limonada son **Q40 al mes**. El mismo mes de un dependiente de tienda son
Q3,000. Nadie tiene que explicárselo al jugador; lo ve en la misma lista.

También son la única manera honesta de que un chico de 13 tenga qué llevar al banco. Con la
apertura mínima de adulto (Q200) el tutorial le pedía a alguien que gana Q40 al mes que
abriera cuenta, y no se podía. Por eso las cuentas tienen un **mínimo de menor de edad** de
Q25 y Q50, que es lo que cobran de verdad las cuentas infantiles guatemaltecas, y el juego
explica de paso que un menor abre cuenta con un adulto.

Un contrato **formal** tampoco se le ofrece a un menor: aparece a los 18. Los trabajitos de
niño son informales siempre, porque en la vida real también lo son.

### Comprar una herramienta

Las tarjetas de decisión son la única forma de subir lo que se gana por hora sin cambiar de
empleo: una bicicleta usada de Q250 deja **Q3 más por cada jornada trabajada, para siempre**,
y un celular de segunda mano deja Q1. Es el concepto de inversión productiva metido en algo
que un chico de 13 puede comprar, y la lección es que hay gastos que se pagan solos.

### Eje de formalidad

Cada empleo puede tomarse formal o informal. El informal gana más hoy y menos toda la vida.

| | Formal | Informal |
|---|---|---|
| Ingreso en mano | Base | Base más 15% [E] |
| Pagos al año | 14 (Bono 14 y aguinaldo) | 12 |
| Seguro social | Sí | No |
| Construye historial de crédito | Sí | No |
| Acceso a crédito bancario | Sí | Solo informal |

El año laboral guatemalteco tiene **catorce pagos**: Bono 14 en julio y aguinaldo repartido
entre diciembre y enero. Son dos momentos al año donde entra dinero extra, y el mejor
lugar del juego para enseñar la diferencia entre quien lo ahorra y quien lo quema.

### Saturación del mercado

La demanda de cada carrera es **visible** en un panel de mercado laboral, pero **cambia con
el tiempo** y hay indicador de tendencia. La lección es doble: investiga antes de estudiar,
y aun así diversifica porque el mercado se mueve.

Estado inicial: administración saturada, ingeniería demanda media-alta, técnicos demanda
alta con poca oferta. Ya no es intuición: Ciencias Sociales concentra el 57.2% de los
graduados del país y administración se imparte en 13 de las 15 universidades, mientras que
ingeniería y tecnología son solo el 12.1% de los graduados y ManpowerGroup reporta que el
62% de los empleadores no encuentra el talento que busca. Ver anexo D de la investigación.

## 8. Vivienda y gastos fijos

La vivienda es **decisión**. Los servicios y la comida son **automáticos** y escalan con la
vivienda elegida.

Cada opción de vivienda arrastra tres costos: renta, servicios y comida, y gasto personal
(transporte, celular, ropa y salidas).

| Opción | Renta | Servicios y comida | Personal | Total mensual |
|---|---|---|---|---|
| Casa familiar | Q400 | Q700 | Q1,100 | **Q2,200** |
| Cuarto compartido | Q1,200 | Q950 | Q1,100 | **Q3,250** |
| Apartamento propio | Q2,800 | Q1,400 | Q1,300 | **Q5,500** |

Todos [E]. Referencias reales: la canasta básica alimentaria urbana cuesta Q945.74 por
persona y la canasta ampliada urbana Q2,283.35.

Calibración: con casa familiar y un sueldo de Q3,000, el jugador ahorra entre Q300 y Q800
al mes, que es la capacidad real de un joven capitalino según la investigación. Sin el gasto
personal, la primera versión del motor dejaba ahorrar Q3,100 al mes, que era absurdo.

Lo que no alcanza a cubrirse se acumula como **deuda con la casa** y se cobra el mes
siguiente. Es la antesala del sistema de crédito.

## 9. Productos financieros de la v1

| Producto | Tasa anual real | Rol en el juego |
|---|---|---|
| Cuenta monetaria | 1.27% | Operar: recibir salario, pagar, mover dinero |
| Cuenta de ahorro | 2.65% | Apartar con propósito |
| Depósito a plazo | 6.35% | Interés compuesto de largo plazo |
| Préstamo personal | 18.68% | Financiar con historial |
| Tarjeta de crédito | 45.84% | La trampa del pago mínimo |
| Prestamista informal | ~700% [E] | Disponible siempre, sin requisitos, devastador |
| Remesas | Comisión 1% a 5% | Ingreso que no controlas |

Sobre el rendimiento se aplica un **impuesto del 10%** sobre los intereses ganados,
visible como línea que resta en el estado de cuenta.

### Por qué abrir una cuenta

Tres presiones simultáneas sobre el efectivo:

1. **Riesgo**: el efectivo en casa puede perderse en un robo o una emergencia familiar.
2. **Fuga**: el 8% del efectivo a la mano se evapora cada mes en gastos hormiga, con tope
   de Q400 mensuales. El tope existe porque nadie se gasta en dulces el 8% de un ahorro
   grande, y sin él la fuga se comía Q42,000 en dos años.
3. **Bloqueo**: sin cuenta no hay salario formal, ni remesa por banco, ni crédito. Sin
   cuenta, la remesa solo puede cobrarse en ventanilla, que cobra 4.5% en vez de 2%.

En la simulación de 24 meses, dos jugadores con el mismo trabajo y las mismas decisiones
laborales terminaron con Q29,977 y Q9,735. La única diferencia fue abrir cuentas.

Solo el 38.3% de los adultos guatemaltecos tiene cuenta, y esa cifra bajó desde 2017. El
93.8% paga en efectivo. El punto de partida del juego es el punto de partida del país.

### Remesas

Las remesas fueron el 20.7% del producto interno bruto en 2025. El 71.7% se cobra en
efectivo en ventanilla y solo el 7.6% termina en ahorro.

El jugador compara operadores en cada envío. Elegir bien contra elegir mal cuesta alrededor
de Q2,300 al año [E]. La lección grande no es la comisión, es qué hace con el dinero
después de recibirlo.

## 10. Historial de crédito y fiador

Medidor visible de 0 a 100. Sube al pagar a tiempo, baja con mora. Desbloquea montos
mayores y tasas mejores.

Regla importante: **no sube por no endeudarse**. Quien nunca pide nada tampoco construye
historial. Es uno de los malentendidos más caros que existen.

### El fiador

El primer crédito exige **fiador o garantía**. Conseguir fiador depende de la reputación
construida con la familia y el empleador. Este es el círculo vicioso real de Guatemala: no
tienes historial porque nadie te presta, y nadie te presta porque no tienes historial.

Tiene dos salidas, y enseñarlas es el punto:

- Empezar con un crédito pequeño respaldado por un depósito en garantía.
- Construir la relación que consigue el fiador.

Los créditos escolares reales de los bancos guatemaltecos topan entre Q8,000 y Q30,000 a
plazos de 10 a 24 meses, así que **no financian una carrera**. El juego lo refleja.

## 11. Eventos, azar y promociones

Azar moderado. Eventos buenos y malos cuya probabilidad e impacto **bajan de forma visible**
si el jugador tomó precauciones. Esto es lo que le da razón de ser al fondo de emergencia.

Las promociones de Banco Cardamomo son **mixtas**. Unas son buena oferta y otras son trampa
disfrazada de premio: los meses sin intereses que cobran comisión, el aumento de límite de
tarjeta presentado como felicitación, el seguro que se añade por defecto.

Enseñar a leer una promoción vale más que enseñar a aprovecharla.

## 12. Minijuegos

Cinco en la versión 1, sobre un marco común para que agregar el sexto sea escribir un
archivo. El pago es modesto frente al salario, para que no se vuelvan la estrategia
dominante.

| Minijuego | Tipo | Enseña |
|---|---|---|
| Reparto en moto | Genérico | Nada, paga por entrega |
| Turno en la tienda | Genérico | Dar el cambio correcto |
| Caza-estafas | Temático básico | Reconocer fraude |
| Cuadra el mes | Temático básico | Presupuesto con imprevistos |
| Cierre de caja | Avanzado, ruta contable | Cuadrar ingresos y egresos |

## 13. Pedagogía

Cuatro capas, ninguna obligatoria:

1. **Tarjeta de primera aparición**: la primera vez que sale un producto, una tarjeta corta
   lo explica antes de que el jugador decida a ciegas.
2. **Glosario** consultable en todo momento.
3. **Resumen anual** automático, donde el juego traduce los números del año a consecuencias.
4. **Reporte de vida** en la jubilación, y consultable cuando el jugador quiera.

### El objetivo pedagógico de mayor valor

Solo el **5.2%** de los guatemaltecos entiende la diferencia entre tasa nominal y tasa
efectiva. Es la brecha que hace que alguien firme una tarjeta al 45.84% creyendo que paga
3.8%. Esa distinción merece ser el clímax de una tarjeta de aprendizaje.

El seguro de depósitos, que cubre hasta Q20,000 por persona por banco, aparece solo como
tarjeta explicativa, sin efecto mecánico.

### Primeros minutos

Pantalla inicial de tres tarjetas con lo básico, y **primer año con dificultad reducida**:
sin eventos malos y con textos más explicativos, pero sin bloquear al jugador. No hay
tutorial obligatorio.

## 14. Interfaz

Pestañas en la parte inferior como esqueleto: casa, trabajo, estudio, banco, minijuegos.
Las decisiones aparecen como tarjetas superpuestas cuando hay un evento.

El banco tiene que ser consultable en todo momento, porque revisar el saldo antes de
decidir *es* el hábito que el juego quiere enseñar.

### 14.1 La ruta que se va abriendo

El juego **no** abre con las seis pestañas y los once productos bancarios a la vista. Al
empezar solo existe el estudio, y cada cosa aparece cuando el jugador hace algo que la
justifica. La lista de peldaños vive en `datos/progreso.js` y se edita sin programar.

| Se abre | Cuándo |
|---|---|
| El trabajo | contestaste si vas a estudiar o no |
| El banco, con la cuenta monetaria | aceptaste un trabajo |
| La cuenta de ahorro y mover dinero | abriste la monetaria |
| Los trabajos extra | cerraste el primer mes |
| Las noticias | cerraste el segundo mes |
| El préstamo del banco **y** el prestamista del barrio | 18 años, con empleo (o 19 sin él) |
| El depósito a plazo | medio mínimo en ahorro, o 18 años |
| La tarjeta de crédito | 18 años y puntaje 20, o 20 años |
| Irse del país | 20 años |
| El plan de pensiones | 23 años |
| La casa propia con hipoteca | puntaje 45, o 25 años |

**Lo primero que se abre es el estudio, no el trabajo.** Estaba al revés: el trabajo nacía
abierto y el estudio se ganaba al segundo mes, lo cual enseñaba exactamente lo contrario de
lo que el juego quiere enseñar —que primero se busca trabajo y luego, si sobra tiempo, se
estudia—. Ahora la primera pantalla es la pregunta, y el trabajo se abre en cuanto el
jugador la contesta, diga lo que diga. Decir "no, a trabajar" abre lo mismo que decir "sí":
la ruta pacea el descubrimiento, no premia una respuesta.

**Y el crédito ya no llega por meses jugados, sino por edad.** A nadie le presta un banco a
los 13. Todo lo que antes se medía en meses de partida y ahora depende de ser mayor de edad
está atado a `CONFIG.mayoriaDeEdad`, no a un número suelto.

Tres decisiones dentro de esto:

1. **El préstamo del banco y el prestamista del barrio se abren juntos, en el mismo
   peldaño.** Verlos lado a lado es la lección: el banco te cobra al año lo que el
   prestamista te cobra al mes. Separados, el jugador conoce uno primero y el otro le
   parece una variante.
2. **El motor no prohíbe nada.** Un peldaño cerrado es algo que la interfaz todavía no
   dibuja, no una acción que el motor rechace. Así las suites de balanceo siguen jugando
   vidas completas llamando al motor directo, sin pelear con la ruta.
3. **Todo peldaño que dependa de una conducta opcional lleva una segunda salida por tiempo
   o por edad.** La ruta pacea el descubrimiento; no esconde contenido para siempre. Quien
   nunca ahorra y nunca pide prestado igual conoce el plazo fijo, la tarjeta y la hipoteca,
   y es el propio trámite el que le explica qué le falta. Al medirlo, las dos condiciones
   que faltaban por esto dejaban la casa propia y el reparto del mes inalcanzables.

El tutorial no es una pantalla aparte: son los primeros once peldaños de esa misma lista,
los que llevan `guia: true`. Salen en una cinta abajo que señala dónde tocar y avanza sola
según lo que el jugador ya hizo, no con un botón de siguiente. Tener una sola lista es lo
que evita que el tutorial diga una cosa y el juego abra otra. Después de esos once la cinta
desaparece y la meta siguiente pasa a una tarjeta discreta en la pestaña del mes.

**Un toque por paso.** La primera versión tenía cuatro pasos gruesos ("consigue empleo",
"reparte el mes", "abre una cuenta", "cierra el mes") y no guiaba: decía el objetivo y
dejaba al jugador buscando dónde tocar. Ahora hay once, y cinco de ellos no desbloquean
nada, solo enseñan un movimiento: entra a Estudio, entra a Trabajo, vuelve al Mes, toca una
jornada, entra al Banco. Los peldaños sin `titulo` se abren en silencio, porque sacar una
ventana de felicitación por tocar una pestaña sería insoportable.

**Se oscurece todo menos lo que hay que tocar, y se le pone una flecha.** El aro ámbar
alrededor del objetivo no bastaba: en una pantalla llena de tarjetas y botones un aro es un
detalle más, y alguien que abre el juego por primera vez no sabe dónde mirar. El foco es un
rectángulo con una sombra enorme alrededor, así que el hueco no se dibuja y lo que hay
debajo se ve con su color de siempre mientras el resto queda bajo una capa oscura. **No
recibe clics**: se le señala el camino al jugador, no se le cierran las otras puertas.

**Y salirse del tutorial dejó de competir con seguirlo.** El botón de "Ya sé jugar" estaba
del mismo tamaño y al lado del botón principal, o sea que era la salida más cómoda de la
pantalla: invitaba a saltárselo en vez de hacerlo. Ahora es un enlace chiquito arriba a la
derecha de la cinta. Sigue estando —quien ya entiende tiene derecho a irse en un toque—
pero ya no es lo primero que se ve.

Cuatro detalles que solo se vieron al probarlo:

- **Los pasos del tutorial no se pueden comprobar mirando solo el estado de la partida.**
  "Toca la pestaña Trabajo" depende de dónde está el jugador, así que la condición recibe
  también la vista (`{ pestana, espacioSel }`).
- **Un peldaño que abre algo NO puede encadenarse a otro.** La primera versión encadenó
  los pasos con `requiere` para que salieran en orden. El efecto: abrir la cuenta
  monetaria antes de repartir el mes dejaba la cuenta de ahorro cerrada para siempre,
  porque su peldaño esperaba a un paso del tutorial que el jugador ya se había saltado. El
  `requiere` quedó solo en los pasos silenciosos, y `pruebas/ruta.js` vigila la regla.
- **La flecha no cabía donde tenía que ir.** Cuando el paso señala una pestaña, el objetivo
  está abajo y la cinta se sienta justo encima: la flecha se dibujaba detrás de la cinta y
  no se veía. Ahora la flecha vive fuera del foco, por encima de la cinta, y si le cae
  encima la cinta se levanta lo que haga falta. Se mide en el momento, no se adivina.
- **Un peldaño del tutorial que no abre nada no es una meta.** Al saltarse el tutorial, la
  tarjeta de "Lo que sigue" seguía pidiendo "toca la pestaña Estudio" a un jugador de 24
  años con empleo. Los pasos silenciosos ya no se persiguen cuando la cinta está apagada.

### 14.2 El mes dibujado, y lo que el colegio no negocia

El reparto del mes es la pantalla que el jugador ve más veces en toda la partida, así que
es la que más se ganó con el cambio a jornadas. Son dos filas —mañanas y tardes— con las
semanas como columnas y un sol y un atardecer en el eje. Las jornadas que el colegio tiene
tomadas salen rayadas, apagadas y **no se seleccionan**: al tocarlas el juego explica por
qué en una línea, en vez de quedarse callado o de sacar una ventana.

Debajo, lo que era una lista de doce filas de texto ("Casa familiar y gastos… -Q2,200",
"Colegiatura… -Q0", "Se te irá del efectivo… -Q112") son ahora **tres cifras**: entra, sale
y queda. El detalle no se borró, se guardó detrás de un toque. Un chico de catorce años no
lee doce filas; lee tres números y, si le interesa, abre el resto.

### 14.3 Lo que se hace y lo que se lee

La pestaña de Trabajo era la pantalla más larga del juego: el empleo actual, el mercado
laboral, las trece ofertas y la decisión de irse del país, todo seguido. La decisión que
de verdad importa —aceptar una oferta— quedaba a dos pantallazos de scroll.

Se partió en dos ejes distintos:

- **Apartados dentro de la pestaña**, en un riel arriba: *Mi empleo*, *Ofertas* y, cuando
  la ruta lo abre, *Irme del país*. El apartado que abre por omisión depende del estado:
  sin empleo lo útil son las ofertas, no una tarjeta que dice que no tienes nada. Cambiar
  de pestaña olvida el apartado elegido, para que al volver se vea lo que corresponde y no
  lo último que se tocó hace veinte turnos.
- **Una pestaña de Noticias** para lo que se lee y no se hace: el mercado laboral, las
  promociones del banco que están vigentes y la bitácora de lo que ha pasado. El mercado
  laboral es información de contexto —dice qué carrera está pidiendo el país— y entre dos
  decisiones estorbaba. Las promociones, además, eran invisibles en cuanto se cerraba la
  ventana que las ofrecía: ahora se puede volver a leer su letra chica mientras duran.

Y el banco se partió igual: **Cuentas**, **Crédito** y **Vivienda**. Era la pantalla más
larga del juego con diferencia —siete pantallazos con el estado de cuenta, el historial, las
cuentas, el plazo, los préstamos, la tarjeta, el prestamista, la pensión, las casas en venta
y el alquiler, todo seguido—. La vivienda solo aparece cuando el jugador ya es mayor de
edad: mudarse a los 14 no es una decisión, es un error de la interfaz.

Lo que salió de ahí es todo lo que era **información del jugador y no un producto**: el
patrimonio, el historial de crédito y el nivel educativo se fueron a una pantalla de **"Yo"**
que se abre tocando el muñeco de la barra de arriba. Mezclar "cuánto tengo" con "qué
contrato" era la mitad de por qué el banco resultaba ilegible.

### 14.4 Un personaje que se viste de lo que hace

Hasta la versión 2, todo lo que pasaba en pantalla estaba escrito. "Eres dependiente de
tienda" era una línea de texto entre otras diez líneas de texto, y el juego lo va a jugar
alguien de 12 a 18 años.

`js/personaje.js` dibuja un muñeco armado por piezas: cuerpo, cara y encima lo que le toca
según lo que esté haciendo. Casco y chaleco en la construcción, audífonos en el call center,
mandil en la tienda, casco de moto en el reparto, birrete si ya se graduó, mochila mientras
estudia, y en la mano la jarra de limonada, el periódico, el ladrillo o la tableta.

Sale en tres tamaños: chico en la decisión de estudiar, mediano en "Mi empleo" —donde es lo
único que le dice al jugador qué hace, sin que tenga que leerlo— y grande en la pantalla de
"Yo". Los colores del muñeco dibujado salen de las mismas cuatro variables de la paleta: el
uniforme de cada oficio se arma con el verde, el azul, el ámbar y el rojo que ya existían.

**Y ahora, además, está ilustrado.** Entraron 23 ilustraciones del mismo chico —neutro,
estudiante, graduado y una por cada oficio— y cuando existe la del estado que toca, se usa
esa. El muñeco por piezas se queda detrás, y no como código muerto: es lo que hace que un
empleo nuevo funcione el mismo día, con su uniforme, sin esperar a que alguien lo ilustre.
Los detalles están en §14.7.

### 14.5 Tarjetas de decisión

Los eventos de `datos/eventos.js` son cosas que **pasan**: se quiebra el celular, duele una
muela, cae el Bono 14. El jugador las lee y cierra la ventana.

Las doce tarjetas de `datos/decisiones.js` son cosas que hay que **decidir**, y son el único
lugar del juego donde la lección no la explica un párrafo: la explica la consecuencia. La
feria del pueblo cuesta Q60, que es casi todo lo que el chico lleva juntado. La bicicleta
usada cuesta Q250 y deja Q3 más por jornada para siempre. La moto en cuotas son Q650 al mes
por tres años, o sea Q23,400 por una moto de Q14,000. Un amigo pide Q1,200 prestados sin
papel.

Tres reglas al escribirlas:

1. **Ninguna opción se marca como correcta.** Dos o tres botones del mismo tamaño, y la
   lección sale *después* de elegir. Si se lee antes, deja de ser una decisión y es un examen.
2. **La opción de no hacer nada tiene que ser defendible.** Si una de las dos es obviamente
   la buena, no es una decisión, es un peaje. Y si las dos cobran, al jugador que no tiene
   nada no le queda ninguna: `pruebas/decisiones.js` comprueba que siempre haya una salida
   que no cueste dinero.
3. **Con enfriamiento.** Doce tarjetas con 10% de probabilidad cada una son casi tres de
   cada cuatro meses con una pregunta encima, y una decisión que llega todos los meses deja
   de ser una decisión y se vuelve un formulario. `MESES_ENTRE_DECISIONES` las separa.

Las de niño y las de adulto están separadas por ventanas de edad, y a un menor de edad
tampoco le caen los golpes de dinero de `eventos.js`: la cuenta del dentista, a los 13, la
paga la casa.

### 14.6 El imperio

El juego pedía repartir jornadas y mirar cómo bajaba el saldo. Es fiel a la vida y es
aburrido: no había nada que construir, nada que subiera de nivel, nada que se viera crecer.
Para alguien de doce años eso es un juego sin premio.

La primera respuesta a eso fueron cuatro cadenas de mejoras, y una de ellas se llamaba "tu
negocio": canasta → carreta → puesto → local. No alcanzó, y el motivo es fácil de decir: era
**un negocio de mentira**. Un número que subía. No se abría, no se atendía, no había nadie
adentro y no se podía tener dos.

`datos/negocios.js` es la segunda respuesta. El jugador **abre negocios** —hasta ocho a la
vez, según lo que haya estudiado— y cada uno tiene **plazas** que se llenan con sus propias
jornadas o con **gente contratada**. Un negocio con cuatro personas produce cuatro veces, y
esas cuatro personas cuestan. Ahí es donde el juego deja de ser un simulador de sueldo: es
la frontera entre vender tu tiempo y comprar el de otros.

#### Los dos números de un negocio

Todo lo que hay que entender de este archivo cabe en una frase: **lo que un negocio vende no
es lo que gana.** Un comedor que vende Q20,800 al mes gana lo que queda después de comprar
la comida, pagar la renta y pagar la planilla. `margen` es esa fracción, y la pantalla
muestra los dos números siempre, uno al lado del otro.

De ahí sale la comparación que un chico puede hacer solo, sin que nadie le explique nada:

| Negocio | Vende al mes con una persona | Le queda | Margen |
|---|---|---|---|
| Lavado de carros | Q5,600 | Q3,110 | 60% |
| Tortillería | Q10,400 | Q2,620 | 30% |

La tortillería vende casi el doble y gana menos. Ese es el archivo entero.

#### Lo que de verdad cuesta contratar a alguien

Es, probablemente, la lección más útil de todo el juego para quien algún día tenga un
negocio. Los dos botones de contratar están uno al lado del otro con su precio completo:

| | Sueldo | Te cuesta | Y además |
|---|---|---|---|
| **Sin contrato** | Q1,980 | **Q1,980** | se va más seguido, y hay inspección |
| **Con contrato** | Q3,520 | **Q5,248** | se queda, y no hay multa que temer |

El 1.42 no es inventado: es IGSS patronal 10.67% + IRTRA 1% + INTECAP 1% + aguinaldo 8.33% +
Bono 14 8.33% + vacaciones 4.17% + provisión de indemnización 8.33%, más la bonificación
incentivo de Q250 que por ley no lleva IGSS. Y el otro lado del trato también está: despedir
a alguien con contrato cuesta un sueldo por año trabajado, así que **lo mismo que protege al
trabajador es lo que le cuesta al patrón deshacerse de él**.

Que la respuesta correcta para un negocio chico sea "sin contrato" no es un descuido: es la
razón por la que el 65% del país trabaja así, y el juego la modela con sus dos riesgos en vez
de esconderla.

#### Los cuatro frenos, y ninguno es un "no puedes porque no"

Un tycoon sin techo se vuelve una máquina de dinero y el juego deja de enseñar.

| Freno | Qué hace | Por qué es honesto |
|---|---|---|
| `TECHO_NEGOCIOS` | 2 negocios con primaria, 8 con maestría | dos negocios son dos contabilidades |
| `TECHO_EMPLEADOS` | 1 persona con primaria, 20 con maestría | una planilla hay que saber llevarla |
| `requiereNivel` | papelería pide básicos, taller diversificado | hay que facturar y firmar un arrendamiento |
| `RENDIMIENTO_SIN_DUENO` | un negocio sin ninguna jornada tuya rinde 70% | delegar funciona; desaparecer, no |

Los dos techos son también el motivo por el que esta capa no rompe el mensaje del juego. Y
están **a la vista, arriba de la pantalla, con su barra**: el jugador ve que puede con dos
negocios y una persona, y ve el número subir cuando se gradúa. Ninguna frase convence tanto
como esa barra.

Encima, cada negocio puede quebrar. El riesgo es del 0.6% mensual **y se puede evitar**: un
negocio con tres meses de sus propios costos guardados aguanta los meses malos. Eso es
capital de trabajo, y es justo la lección que un negocio propio tiene que enseñar.

#### Y se ve crecer: la calle

`js/escena.js` dibuja **una calle**, con un local por cada negocio abierto y su gente parada
enfrente. Y la calle **se alarga** conforme el imperio crece: con un negocio la escena cabe
en la tarjeta; con cinco hay que arrastrar para verla toda. Que no quepa es parte del premio.

Lo importante del archivo es que **un negocio nuevo no necesita que nadie lo dibuje**. El
local está dibujado una sola vez, de forma genérica, y crece con el nivel: caja, toldo,
rótulo, segundo piso. Lo único que distingue una tortillería de un taller es el emblema de
su fachada, y ese emblema sale de `js/iconos.js` usando el campo `icono` que el tipo de
negocio ya tiene. Antes no era así, y era una trampa: se agregaba un nivel, el jugador lo
compraba y la pantalla se veía igual.

Alrededor siguen apareciendo las tres cadenas de mejoras que quedan —la caja de
herramientas, el rótulo colgado, la bicicleta, la mochila, los libros, la antena, el
banquito, la lámpara— porque esas siguen teniendo todo el sentido: son las que mejoran a la
**persona** y no al negocio.

Está dibujado en el estilo de los paquetes de arte de juego: formas macizas, esquinas
redondas y contorno gordo del color de la tinta, **con los colores de la paleta**. Y encima,
cuatro cosas que hacen que la pantalla se sienta viva: monedas que suben de los locales que
produjeron, un saltito del escenario al comprar algo, una barra de cuánto le falta para lo
siguiente, y una persona más dibujada cada vez que contrata.

#### Lo que salió de medirlo

Nada de esta sección se decidió a ojo. `pruebas/imperio.js` corre tres vidas completas de los
13 a los 65 sobre once semillas y compara la mediana:

| Ruta | Patrimonio mediano a los 65 |
|---|---|
| Sin estudiar y sin negocios | Q1.5 millones |
| Sin estudiar, con negocios | Q7.1 millones |
| Escalera completa y negocios | Q36.0 millones |

Las dos cosas que la prueba exige son que **estudiar siga rindiendo más** (5 a 1) y que
**montar negocios le cambie la vida a quien no estudió** (4.7 veces). Si alguno de esos dos
órdenes se invierte, la suite falla.

Y por el camino esa medición encontró cuatro cosas que ninguna prueba de "no lanza errores"
habría visto. Están en §24 porque son el tipo de hallazgo que vale más que el código.

### 14.6b La calle es la pantalla, no una pestaña

Esta es la corrección más importante que le ha pasado al juego, y se hizo tarde. La reforma
del imperio metió los negocios, la planilla y los techos, pero los metió **en una pestaña**:
la cuarta de siete. Lo primero que veías al abrir el juego seguía siendo una rejilla de ocho
casillas vacías. Un formulario. Y un tycoon en el que lo primero que ves es un formulario no
es un tycoon: es una hoja de cálculo con una calle de adorno en otra pantalla.

Así que la calle se movió al frente y dejó de ser un cuadro.

**Lo que tienes va antes que lo que haces.** La pantalla de arranque abre con la calle —tu
casa, tu escuela, tu oficio, tus negocios— y un lote vacío latiendo al lado, mientras te
quepa uno más. La rejilla de jornadas se queda debajo, que es donde le toca: ya no es donde
se juega, es donde se comprueba en qué se fue el mes.

**Y se toca.** Cada local es un botón que mete una jornada tuya adentro. La forma vieja
—tocar una casilla, luego la actividad— sigue viva y no es redundante: es la que enseña el
tutorial y la única que deja elegir en QUÉ casilla va. Pero la que hace que esto se sienta un
tycoon es la otra: señalas tu tortillería y te metes adentro, de un toque.

**Y contesta.** Cada negocio lleva en la esquina una insignia verde con la silueta y el
número de jornadas TUYAS que tiene puestas este mes. Eso era lo que faltaba para cerrar el
lazo: la fila de siluetas de abajo dice a quién le pagas, y la insignia dice dónde estás tú
—que es la decisión que el juego pide cada mes y la única que no se puede comprar con
dinero, porque un negocio sin dueño adentro rinde un 30% menos.

**Dos detalles que sin ellos no funciona.** El primero: la calle arranca pegada a la
DERECHA. Las 126 unidades de la izquierda son la casa, la escuela y el oficio, así que en un
teléfono de 390 px lo que se veía al abrir era una lámpara y unos libros, con los negocios
fuera de pantalla. El segundo: se recuerda dónde la dejó el jugador, porque cada toque
vuelve a pintar la pantalla y sin eso la calle le saltaba de sitio debajo del dedo.

**Una sola función dibuja las dos calles**, la del mes y la del imperio, y solo cambia si
responde al dedo. Es lo que evita que se separen: un negocio nuevo, un nivel nuevo o una
ilustración nueva salen en las dos el mismo día.

**Dos botones en cada edificio, y cada uno tiene su razón.** Tocar el local pone una jornada
tuya adentro: eso se hace ocho veces al mes. Tocar el engranaje de su esquina abre lo que se
hace una vez cada varios meses —subirle el nivel, contratar, traspasarlo— en una hoja que se
despliega debajo de la calle. Si lo frecuente costara dos toques para que lo raro costara
uno, el juego se sentiría lento justo donde no puede permitírselo.

Esa hoja **no dibuja nada propio**: reusa las mismas tarjetas del imperio. Importa más de lo
que parece, porque son las pantallas que enseñan lo que cuesta de verdad un empleado formal
contra uno informal, y tener dos versiones de eso sería tener dos sitios donde equivocarse.
Y es una hoja dentro de la pantalla, no una ventana encima: contratar vuelve a pintar la
pantalla entera, y una ventana flotante se quedaría con las cifras viejas debajo del dedo.

**Y el mes se cierra desde la calle.** El botón estaba al final de la pantalla, después de la
rejilla, de la ruta y de las tres cifras: a dos pantallazos de scroll de lo que el jugador
acababa de decidir. La acción que cierra el ciclo del juego —reparto el mes, lo cierro, entra
el dinero, abro otro negocio— no puede estar donde hay que ir a buscarla.

### 14.6c El tutorial no puede contestar por el jugador

Un fallo que estuvo mucho tiempo y que no se veía leyendo el código, porque cada pieza por
separado era razonable.

El foco del tutorial apaga toda la pantalla menos lo que hay que tocar. Y lo que hay que
tocar salía de `document.querySelector`, que devuelve **el primero** que cumple. En las
pantallas de una sola acción eso está bien. En las dos pantallas donde el juego pregunta de
verdad, no: en la de estudio alumbraba "Pública" de la primera carrera y dejaba a oscuras la
privada y el "no, a trabajar"; en la de trabajo alumbraba una de las tres ofertas. Y había
una segunda capa, esta deliberada: los botones de inscribirse llevaban la marca del tutorial
**solo en el primero**, con un comentario que decía que era para que la cinta apuntara a un
botón concreto.

O sea que el tutorial, en las dos únicas decisiones que el juego pide al principio, le
contestaba al jugador. Y no es un detalle de estilo: la lección de este juego es que esas
decisiones se pagan de formas distintas y que ninguna es gratis. Un tutorial que señala una
sola enseña que hay una respuesta correcta, que es exactamente lo contrario.

Arreglado en tres sitios, y hacían falta los tres: el foco toma **todas** las que cumplen y
alumbra la caja que las contiene; la marca va en **todos** los botones de la decisión, el "no
estudiar" incluido; y `reubicarFoco` —el que vuelve a colocar el foco al hacer scroll—
también pide todas, porque pedía una y el primer movimiento del dedo deshacía el arreglo.

Con varias opciones se alumbra **la tarjeta** de cada una y no su botón: los tres "Aceptar"
de las ofertas están alineados en la misma columna, así que la caja que los contiene a los
tres es una tira vertical estrecha que parte las tarjetas por la mitad. Con una sola opción
no se toca nada, porque ahí el paso no ofrece: dice qué tocar.

`pruebas/dom-real.js` lo comprueba en cada paso del tutorial: si el paso tiene más de una
opción, tienen que estar señaladas todas.

### 14.7 Ilustraciones, y el dibujo que se queda detrás

El juego se dibujaba entero con SVG propio: iconos de trazo, un muñeco por piezas y una
escena hecha de formas. Eso sigue ahí. Encima entraron **73 ilustraciones** —el mismo chico
en 23 estados, los cuatro niveles de un local, las ocho piezas de las cadenas de mejoras y
la moneda— y ahora el juego usa las dos cosas.

`js/arte.js` es lo único que sabe qué ilustraciones existen. Todo lo demás pregunta, y **si
la respuesta es que no hay, dibuja**. Eso no es un adorno defensivo: es lo que permite
agregar un empleo a `datos/trabajos.js` y verlo funcionar el mismo día, con su uniforme,
sin esperar a que alguien lo ilustre. Con ilustración se ve mejor; sin ilustración se ve.

**Dos carpetas, y la diferencia importa.** `assets/visuales/` son los PNG maestros tal como
se entregaron: 73 archivos, 125 MB, a 1024×1536, 1254×1254 y 768×768. El navegador no los carga
nunca. `assets/juego/` son las copias que el juego usa: WebP, al tamaño en que se ven,
**1.1 MB entre todas**. Cargar 2 MB para pintar un chico de 80 px rompería la promesa de
que el juego abre con doble clic y funciona sin internet, y esa promesa vale más que la
resolución.

`herramientas/preparar-imagenes.py` escribe la segunda carpeta a partir de la primera, y no
hace falta para jugar ni para programar. Hace tres cosas, y las tres salieron de problemas
reales que están contados en `RECURSOS_VISUALES.md` §4: quita el cuadriculado de
transparencia que el generador dejó **horneado y opaco** dentro de los huecos cerrados,
recorta el margen vacío con una caja **común** a los 23 personajes —si cada profesión se
recortara a su medida, el mismo chico cambiaría de tamaño al cambiar de trabajo— y
redimensiona a los tamaños que se midieron en pantalla.

**Lo que las ilustraciones cambiaron del diseño.** Un PNG es un personaje completo, así que
los estados dejaron de sumarse: antes un chico que trabajaba y estudiaba salía con la ropa
del trabajo *y* la mochila, y un graduado con el birrete encima del uniforme. Ahora hay que
elegir uno, y gana lo que está haciendo ahora. Y la escena se recalibró entera, porque los
números estaban ajustados a un muñeco que ocupaba menos de su lienzo: con la escala vieja el
chico quedaba cinco unidades y media enterrado en la plataforma y le pasaba la cabeza a una
tienda con puerta.

**Los locales van en tres peldaños, y los tres están vivos.** Esta es la parte que se
diseñó dos veces. La primera entrega trajo cuatro dibujos de local —canasta, carreta, puesto,
tienda— y los nueve tipos de negocio los compartían: una tortillería y un taller de motos se
veían idénticos, y lo único que los distinguía era un **sello** redondo de catorce unidades
con el emblema del tipo. Funcionaba, pero era un parche, y estaba anotado como tal. La
segunda entrega trajo los 36 que faltaban, uno por cada tipo y nivel.

Lo que no se hizo fue tirar el parche. Un negocio se busca su dibujo en este orden:

1. **El local de su tipo.** `negocio/tortilleria/n3` es una tortillería con nombre: comal,
   canastos, mazorcas colgando. Es lo que se ve normalmente.
2. **El local genérico, con el sello encima.** Es lo que ve un tipo de negocio que todavía
   no tiene dibujo: un puesto cualquiera con el rótulo de una tortillería.
3. **El local dibujado en SVG** por `js/escena.js`, si no hay ninguna ilustración.

Ese orden es lo que permite **entregar los dibujos por lotes**, y sin él el proyecto se
queda quieto esperando al ilustrador. Los seis tipos de negocio que faltan pueden entrar a
`datos/negocios.js` hoy y a las ilustraciones el mes que viene, y en el medio el juego se
ve entero: el jugador abre una panadería y ve un puesto con un pan en el rótulo, no un
hueco. El sello es la pieza que se mueve entre peldaños y va donde hace falta: sobre el
puesto genérico es la única pista del tipo de negocio, y sobre la tortillería ilustrada
sería una calcomanía tapando el comal. `pruebas/arte.js` comprueba las dos mitades de esa
regla, porque es la que se rompe sola al entregar dibujos nuevos.

**Y la calle se ensanchó para que cupieran.** Un local con sucursal mide ahora 58 unidades y
antes 48: los dibujos por tipo traen detalle —una moto, un comal, cuatro monitores— y a 48
no se veía. Eso obligó a subir el hueco de cada negocio de 46 a 56, así que con ocho
negocios la escena mide 580 unidades y no cabe en la tarjeta. Es el precio, y es un precio
que este juego quiere pagar: que no te quepa lo que tienes es la mitad del premio.

**Lo que protege esto es una suite.** `pruebas/arte.js` cruza el inventario declarado en
`js/arte.js`, los archivos del disco y lo que los datos piden, y comprueba además que
ninguna imagen pase de 90 KB y que el código no apunte a los maestros. El fallo que existe
para atrapar no lanza ningún error y no sale en ninguna consola: **una imagen que falta deja
un hueco vacío**, el juego sigue funcionando y las otras doce suites siguen pasando.

### 14.8 Iconos propios, no emoji

La interfaz usaba emoji. El emoji tiene dos problemas que no se arreglan con CSS: cada
sistema lo dibuja distinto, así que la cara del juego cambiaba según el teléfono, y viene
con su propio color, así que nunca combinaba con la paleta.

`js/iconos.js` los reemplaza con **setenta dibujos propios**: SVG de trazo sobre una
cuadrícula de 24×24, sin relleno, con el color heredado del texto. Eso significa que un
icono se ve igual en todos los sistemas, toma el color de donde esté puesto y mide `1em`,
así que crece con la letra que lo rodea. Sin librería externa: el juego sigue abriéndose
con doble clic, sin internet.

### 14.9 Relieve, no plano

El diseño era plano —un borde de 1px y nada más— y parecía un formulario. Ahora cada cosa
que se puede tocar se apoya sobre un labio inferior más oscuro y tiene un brillo arriba, y
al presionarla baja hasta comérselo. **La paleta no cambió**: los tonos de relieve se
calculan con `color-mix` a partir de las mismas nueve variables, mezclándolas con negro o
con blanco, así que cambiar `--verde` mueve todo el relieve verde con él.

Al cambiar de pestaña la vista entra deslizándose por el lado del que vino el jugador, y la
marca de la pestaña activa viaja de su posición anterior a la nueva. Como la barra se
redibuja entera en cada render, una transición de CSS no serviría —el elemento es nuevo
cada vez—; se hace con una animación que lleva las dos posiciones en variables.

## 15. Persistencia, sonido y privacidad

- **Guardado** automático en el navegador, hasta **tres partidas** en ranuras separadas.
- **Historial de partidas terminadas** con sus reportes, para comparar dos vidas lado a
  lado. Ver que el técnico que empezó a los 18 superó al licenciado endeudado es la
  lección de la carrera hecha evidente sin enunciarla.
- **Código exportable** para llevar una partida a otro dispositivo.
- **Sonido**: efectos cortos generados por código, sin archivos. Silenciado por defecto.
- **Privacidad**: cero rastreo externo. Las métricas del reporte no salen del dispositivo.
  Con audiencia desde los 16 años, no vale la pena la analítica de terceros en un prototipo.

## 16. Arquitectura técnica

Sin framework, sin compilación, sin dependencias. Los datos viven en archivos JavaScript
sencillos cargados con etiquetas de script, **no en JSON**, porque el navegador bloquea la
carga de JSON cuando se abre el archivo con doble clic. Así el juego funciona igual abierto
localmente que publicado, y alguien de negocio puede corregir una tasa sin saber programar.

```
/
  index.html
  css/estilo.css
  datos/
    config.js       economía, tiempo, energía, jornadas, vivienda, productos
    trabajos.js     los dieciséis empleos y la escalera de niveles educativos
    carreras.js     rutas de estudio, su horario y el mercado laboral
    creditos.js     préstamo, tarjeta, prestamista, puntaje, fiador
    eventos.js      eventos de vida y promociones
    decisiones.js   las doce tarjetas de decisión
    glosario.js     los veinte términos
    largoplazo.js   casas, hipoteca y plan de pensiones
    origenes.js     los tres puntos de partida
    migracion.js    el viaje, los empleos de allá y los canales de envío
    progreso.js     la ruta que se va abriendo, peldaño por peldaño
    textos.en.js    la traducción al inglés completa
  js/
    idioma.js       detección, selector y las funciones T, D y K
    iconos.js       los setenta y ocho dibujos de trazo y la función Ico
    arte.js         donde viven las ilustraciones y cuales existen
    personaje.js    el muñeco: la ilustracion, y por piezas si no hay
    escena.js       la calle: un local por negocio, y se alarga al crecer
    sonido.js       efectos generados por el navegador
    motor.js        estado, turnos, economía, estudio, crédito, reportes
    ui.js           pantallas, pestañas, apartados y tarjetas
    minijuegos/
      marco.js      cronómetro, marcador y pago
      reparto.js  tienda.js  estafas.js  presupuesto.js  caja.js
      conciliacion.js  obra.js  inversion.js
  vendor/
    lucide.js       iconos de respaldo, recortados (ISC)
    chart.js        Chart.js 4, bundle UMD (MIT)
  assets/
    visuales/       los 73 PNG maestros, 125 MB. El navegador NO los carga
    juego/          las copias WebP que si carga, 1.1 MB entre todas
  herramientas/
    traer-librerias.js   regenera vendor/. No hace falta para jugar
    preparar-imagenes.py escribe assets/juego/ desde los maestros
  pruebas/
    comun.js        carga el juego aislado; ayudantes trabajar() y adulto()
    imperio.js      negocios, planilla, techos y la invariante del estudio
    arte.js         que las ilustraciones esten, cuadren y pesen poco
    todas.js        corre las diez suites y resume
    vista.html      vista previa para revisar el diseño con los ojos
  docs/
```

**Las tres listas de archivos.** `index.html`, `ARCHIVOS` en `pruebas/comun.js` y la de
`pruebas/vista.html` cargan cada una su propia lista. Olvidar una al agregar un archivo deja
la pantalla en blanco con un `ReferenceError` en la consola, que es lo que pasó al agregar
`progreso.js`. `pruebas/ruta.js` comprueba que las tres digan lo mismo.

### Las dos librerías que sí entraron, y las cuatro que no

El juego promete tres cosas: se abre con doble clic, funciona sin internet y no hay nada
que instalar. Un `<script src="https://cdn...">` rompe las dos últimas y un `npm install`
rompe la tercera. La salida es **vendorizar**: `herramientas/traer-librerias.js` deja
archivos normales dentro de `vendor/`, que se suben al repositorio y se cargan como
cualquier otro script.

| Librería | Qué hace aquí |
|---|---|
| **Lucide** (ISC) | Respaldo de iconos. Los 78 dibujos propios de `js/iconos.js` no se tocaron: Lucide entra **detrás**, y solo se consulta cuando un nombre no está dibujado a mano. Se recortan los 66 que el juego nombra, de los 1,815 del paquete. Sirve para agregar contenido nuevo sin dibujar cada icono. |
| **Chart.js** (MIT) | La gráfica de lo que ha producido el negocio, mes por mes. Siempre detrás de `typeof Chart !== 'undefined'` y de un `try`: si ese archivo faltara, la pantalla se dibuja igual sin la gráfica. |

Y las que se decidió **no** traer, con el motivo, para no volver a preguntarlo:

- **Howler.js** envuelve la reproducción de *archivos* de audio, y el juego no tiene
  archivos de audio: `js/sonido.js` sintetiza los tonos con la Web Audio API, que es algo
  que Howler no hace. Serían 30 KB sin una línea de uso.
- **Day.js** sirve para fechas de verdad. El juego lleva un contador de mes (0 a 11) y un
  año entero, y los nombres de los meses ya están traducidos en el diccionario. No hay
  nada que formatear.
- **DiceBear** solo publica ESM y no trae build UMD, y un `<script type="module">` sobre
  `file://` lo bloquea el navegador por CORS: rompería el doble clic. Además genera
  avatares a partir de una semilla, y lo que este juego necesita es lo contrario: un
  personaje que se **vista** del oficio que eligió el jugador. Eso lo hace
  `js/personaje.js` y DiceBear no puede.
- **Los paquetes de Kenney** son descargas `.zip` de kenney.nl, que desde esta red no
  responde, y son PNG: pesan y no toman el color de la paleta. Lo que sí se tomó de ahí es
  el **estilo** —trazo gordo, formas macizas, esquinas redondas— y está dibujado a mano en
  `js/escena.js`.

### Cómo funciona el bilingüe

**La clave de cada texto es la frase en español.** `T('Banco')` devuelve `'Bank'` en inglés
y `'Banco'` si falta la traducción, así que una traducción incompleta nunca rompe el juego.
Las frases con números usan marcadores: `T('Trabajas {0} de {1} jornadas', 3, 8)`.

**Una condición dentro de `T()` rompe la comprobación de cobertura.** La prueba bilingüe
saca del código todas las cadenas que pasan por `T('...')` y verifica que cada una esté en
el diccionario. `T(abierto ? 'Ocultar' : 'Ver')` no lo ve, así que esas dos cadenas podían
quedarse sin traducir sin que nada avisara. La forma correcta es
`abierto ? T('Ocultar') : T('Ver')`, y el mismo cuidado aplica a `Ico()` con la prueba de
iconos.

Los nombres y descripciones de empleos, carreras, eventos y minijuegos se traducen por
identificador con `D(objeto, campo)`. El glosario, las viviendas y los productos, por clave
con `K(grupo, clave)`. Agregar un idioma es escribir un diccionario nuevo sin tocar código.

El español se escribió completo primero y se tradujo de una sola pasada, tal como se
acordó, para no duplicar trabajo a medias.

## 17. Alcance original

**Versión 1**: cuenta monetaria, cuenta de ahorro, depósito a plazo, remesas, préstamo
personal, tarjeta de crédito, prestamista informal, historial de crédito y fiador. Cinco
minijuegos. Trece empleos, cinco rutas de estudio. Arco completo de los 18 a los 65.

**Versión 3**: el arranque a los 13 con la decisión de estudiar, el mes por jornadas, tres
trabajitos de niño, el personaje que se viste de su oficio, las tarjetas de decisión, el
banco partido en apartados, la pantalla de "Yo" y el tutorial con foco y flecha.

**Versión 2**: hipoteca, plan de pensiones, orígenes de personaje seleccionables, ruta
migratoria como emisor de remesas, un minijuego avanzado por carrera.

## 18. Números que necesitan tu validación

Todos estos valores viven en `datos/config.js` y `datos/trabajos.js`, y se pueden corregir
sin saber programar. Cambia el número, guarda y recarga el juego.

Las cuatro que estaban marcadas `pendiente` **ya se investigaron y quedaron con fuente**:
están en los anexos C y D de la investigación. Las que siguen en esta tabla sin esa marca
son las que aún dependen de tu criterio.

| Concepto | Valor propuesto | Archivo |
|---|---|---|
| Efectivo inicial | Q1,200 | config |
| Gasto total en casa familiar | Q2,200 al mes | config |
| Gasto total en cuarto compartido | Q3,850 al mes | **verificado**, anexo F |
| Gasto total en apartamento | Q6,700 al mes | **verificado**, anexo F |
| Ingreso exigido para el cuarto | Q4,800 | config |
| Ingreso exigido para el apartamento | Q7,500 | config |
| Remesa del hermano | US$150 a US$200 cada 2 o 3 meses | config |
| Tipo de cambio | Q7.70 por dólar | config |
| Prima por informalidad | 5% más de ingreso en mano | **corregido**, anexo F |
| Fuga del efectivo | 8% mensual, tope Q400 | config |
| Riesgo de perder el efectivo | 2% al mes, se va el 40% | config |
| Gastos de cierre de la hipoteca | 5% del valor | **verificado**, anexo E |
| Carga máxima de la cuota sobre el ingreso | 30% | **verificado**, anexo E |
| Costo del viaje migratorio | Q125,000 | **verificado**, anexo E |
| Riesgo de fracasar al migrar | 21% | **verificado**, anexo E |
| Rendimiento del plan de pensiones | 7% anual | **anclado**, anexo E |
| Edad de retiro del plan | 60 años | **verificado**, anexo E |
| Costo de enfermarse | Q450 y faltas al trabajo | config |
| Multiplicador del modo difícil | 0.65 | config |
| Salarios base de los 13 empleos | Ver sección 7 | trabajos |
| Aumento por año de experiencia | 3.5% | trabajos |
| Tasa del prestamista informal | 25% mensual = 1,355% anual | **verificado**, anexo C |
| Capital para abrir tienda | Q8,000 | trabajos |
| Licenciatura privada administrativa | Q29,200 al año | **verificado**, anexo D |
| Maestría privada | Q48,000 total | **verificado**, anexo D |
| Saturación inicial por carrera | Ver sección 7 | **verificado**, anexo D |

Todo lo demás viene de fuente verificada y está en `investigacion-economia-guatemala.md`.

## 19. Estado de la versión 1

**La versión 1 está completa y jugable de los 18 a los 65.** Todo lo acordado en las
cuarenta y nueve decisiones está implementado:

| Sistema | Estado |
|---|---|
| Turno con ocho jornadas y pago según jornadas trabajadas | listo |
| Compresión temporal y envejecimiento hasta los 65 | listo |
| Energía, agotamiento y enfermedad con faltas al trabajo | listo |
| Dieciséis empleos con eje formal e informal y experiencia | listo |
| Cuatro rutas de estudio con mercado laboral cambiante | listo |
| Cuenta monetaria, ahorro y depósito a plazo | listo |
| Impuesto del 10% sobre intereses | listo |
| Efectivo con fuga mensual y riesgo de pérdida | listo |
| Remesas irregulares con comisión según tengas cuenta | listo |
| Bono 14 y aguinaldo | listo |
| Préstamo personal, tarjeta de crédito y prestamista informal | listo |
| Puntaje de crédito y fiador con reputación | listo |
| Tres viviendas con requisito de ingreso | listo |
| Nueve eventos de vida y cinco promociones mixtas | listo |
| Cinco minijuegos sobre marco común | listo |
| Tarjetas educativas, glosario, resumen anual y reporte de vida | listo |
| Tres ranuras, historial de vidas y código exportable | listo |
| Sonido generado por código, apagado por defecto | listo |
| Español e inglés con detección automática | listo |

### Cómo se verificó

El motor no se dio por bueno hasta que las simulaciones lo confirmaron. Cuatro guiones de
prueba corren sin navegador y comprueban 65 aserciones en total:

- **Balanceo**: cinco estrategias jugadas a veinticuatro meses. Detectó que quemarse
  trabajando las cuatro semanas rendía más que descansar, y que se podían ahorrar Q3,100
  al mes con un sueldo de Q3,000. Las dos cosas están corregidas.
- **Vidas completas**: cuatro partidas de 224 turnos hasta la jubilación, sin errores, más
  una comprobación de que **estudiar rinde**. Esa comprobación se agregó después y destapó
  dos cosas. La primera, que ninguna vida cambiaba de empleo al graduarse, así que el juego
  nunca había verificado su promesa central: la vida que llegaba a maestría terminaba con
  Q372,673 y la que nunca estudió con Q496,563, pero solo porque el graduado se quedaba de
  agente de call center. La segunda, que la suite **no era determinista**: el patrimonio de
  una misma estrategia oscilaba entre Q465 mil y Q2.5 millones según la corrida, y pasaba
  igual porque solo miraba errores, nunca números. Ahora el azar va con semilla y cada ruta
  se corre veintiuna veces para comparar medianas:

  | Ruta | Mediana del patrimonio a los 65 |
  |---|---|
  | Sin estudiar | Q482,364 |
  | Técnico | Q625,606 |
  | Licenciatura | Q896,570 |
  | Maestría | Q1,465,390 |

  La escalera es monótona y la maestría más que duplica a no estudiar, que es exactamente lo
  que dice el diseño. Si algún día deja de serlo, la suite falla y nombra el escalón roto.
- **Ciclo de crédito**: diecinueve comprobaciones. Confirma que Q1,000 con el prestamista
  se devuelven como Q2,033 en seis meses, y que pagando solo el mínimo de la tarjeta una
  deuda de Q1,000 apenas baja a Q819 en doce meses.
- **Interfaz bilingüe**: las seis pestañas se dibujan en ambos idiomas, en todos los
  estados del juego, y ninguna etiqueta española se cuela en la versión inglesa.

## 20. Versión 2

**También está completa.** Los cinco puntos que quedaron para la segunda fase están
implementados y probados.

### Hipoteca

Tres casas de Q350,000, Q650,000 y Q900,000. Tasa real del 9.42% a 20, 25 o 30 años. El
enganche es del 20%, salvo la casa más barata, que califica al programa de hipotecas
aseguradas y baja al 5%. Ese programa existe de verdad en Guatemala para vivienda de
interés social.

El banco exige tres cosas a la vez: al menos 45 de historial, empleo formal con ingreso
comprobable, y que la cuota no pase del 35% de lo que ganas. Con casa propia dejas de pagar
renta pero pagas mantenimiento, y la casa se aprecia un 3% al año.

Doce cuotas de atraso y el banco ejecuta la hipoteca. Pierdes la casa y todo lo que habías
pagado, y el puntaje se va a cero. Es la única forma de perderlo todo que tiene el juego.

### Plan de pensiones

Aportas lo que quieras cada mes y rinde 7% anual. Retirarlo antes de los 60 cuesta el 25%
de lo ganado. Existe por una sola razón: es donde el interés compuesto se vuelve
irrefutable. Aportar Q500 al mes de los 25 a los 60 son Q210,000 de tu bolsillo y terminan
siendo más de Q900,000.

### Orígenes del personaje

Tres puntos de partida, que no son niveles de dificultad:

| Origen | Empiezas con | Aportas en casa | Remesas |
|---|---|---|---|
| Tu familia te puede apoyar | Q3,500 | nada | no |
| Tu hermano manda de Estados Unidos | Q1,200 | Q400 | sí |
| Tu familia depende de ti | Q400 | Q1,100 | no |

El tercero arranca con mucho menos margen, pero con la reputación más alta: en su familia
todos saben que responde, así que conseguir fiador le cuesta menos. Dos personas con la
misma disciplina terminan en lugares distintos según de dónde salieron, y el juego no lo
enuncia en ningún momento.

### La ruta migratoria

El otro lado de la remesa. A partir de los 20 puedes irte a Estados Unidos si juntas los
Q65,000 que cuesta el viaje. Casi uno de cada cinco intentos fracasa y pierdes lo pagado.

Si llegas, ganas entre US$2,000 y US$3,800 al mes y gastas US$1,350 en vivir. De lo que te
sobra decides cuánto mandas a tu familia y por qué canal. Ventanilla cobra 4.5%, una app
cobra 1%. Al volver traes el capital, pero tu historial crediticio local se enfría a la
mitad, porque los años fuera no lo construyeron.

Se modeló sin romantizarla ni convertirla en castigo. Es una decisión con números.

### Minijuegos por carrera

Los tres que faltaban, uno por ruta de estudio, que se abren solo al graduarse de esa
carrera concreta:

| Minijuego | Se abre con | Enseña |
|---|---|---|
| Conciliación bancaria | Administración | El saldo de la app no es el dinero disponible |
| Presupuesto de obra | Ingeniería | Cotizar sin margen es perder dinero |
| Decisión de inversión | Maestría | Un proyecto vale si rinde más que el costo del dinero |

Con los cinco de la versión 1 son ocho en total.

## 21. Cómo se verificó todo

Once suites de prueba corren con `node pruebas/todas.js`. Todas pasan y todas son
deterministas, aunque dos de ellas no lo eran hasta que se revisó: **balanceo y vidas
completas usaban azar libre**, así que sus números bailaban miles de quetzales entre
corridas. Pasaban igual, porque solo miraban si había errores y nunca comparaban cifras.
Ahora el azar va con semilla y las dos comparaciones que importan se miden sobre veintiuna
semillas en vez de una.

| Suite | Qué cubre |
|---|---|
| Balanceo | Cinco estrategias a 24 meses, más la ventaja de bancarizarse sobre 21 semillas |
| Vidas completas | Cuatro partidas hasta la jubilación, más cinco rutas educativas sobre 21 semillas |
| Ciclo de crédito | Fiador, garantía, puntaje, mora, tarjeta y prestamista |
| Largo plazo | Hipoteca, pensión, los tres orígenes y la migración completa |
| Minijuegos | Que el trabajo extra compense la jornada de trabajo que cuesta |
| Ruta | Que ningún peldaño quede inalcanzable jugando una vida entera |
| Decisiones | Forma, efectos, edades, traducción y enfriamiento de las tarjetas |
| Mejoras | Que las cadenas suban, que los efectos se cobren, y que el tycoon no gane al estudio |
| Iconos | Que todo icono pedido exista, que todo dibujo se use y que el personaje se vista |
| Interfaz bilingüe | Las seis pestañas en ambos idiomas y en todos los estados |
| DOM real | Una partida jugada de verdad, tocando botones en un navegador simulado |

Las nueve primeras usan un DOM mínimo escrito a mano, que sirve para ver que las vistas se
dibujan pero no ejercita lo que de verdad puede romperse. La última carga el `index.html`
real con jsdom y juega: elige origen, **completa el tutorial entero tocando solo lo que la
cinta señala**, reparte las jornadas, cierra el turno, mueve dinero en una ventana con campo
numérico, abre la pantalla de "Yo", cambia de idioma, abre el glosario y juega un minijuego
esperando sus temporizadores. Es la única que necesita `npm install`, y si falta jsdom se
salta sola.

**Las suites de economía arrancan al personaje ya adulto.** El ayudante `adulto()` de
`pruebas/comun.js` le pone 18 años, el diversificado y Q1,200 —lo mismo con que arrancaba el
juego cuando empezaba a esa edad—, así que las corridas siguen siendo comparables con las de
antes del cambio. El balanceo mide vida laboral: jugar cinco años de colegio antes de llegar
ahí no mide nada y además tapa lo que se quiere medir. Las suites de la ruta y del DOM real
**no** lo usan, porque existen justamente para comprobar que la niñez funciona.

Al pasar el juego a ocho jornadas hubo que revisar las diez suites, y ahí se vio lo que
valían: la mitad falló por razones distintas, y ninguna de esas razones era la que se
buscaba. La ventaja de bancarizarse se volvió negativa porque las estrategias abrían la
cuenta con Q200 y un chico de 13 no los tiene; el mejor empleo se elegía comparando el campo
`salarioBase`, que los trabajitos de niño no tienen, así que el jugador se quedaba vendiendo
limonada cincuenta años; y el tutorial se atascaba en el último paso porque la interfaz
seguía pidiendo la apertura mínima de adulto.

### Las nueve fallas que encontraron las pruebas

Ninguna se habría visto leyendo el código.

1. **Quemarse rendía más que descansar.** Trabajar las cuatro semanas todos los meses
   ganaba más que cuidarse, que es el incentivo contrario al que el juego debe enseñar.
2. **Se ahorraba Q3,100 al mes con un sueldo de Q3,000**, porque no existía el gasto
   personal.
3. **La fuga del efectivo se comía Q42,000 en dos años** sin tope.
4. **El costo de enfermarse nunca se cobraba.** Se registraba en el resumen del mes pero no
   se descontaba de ninguna cuenta.
5. **El hermano mandaba dinero extra a quien no tenía hermano fuera.** El evento de remesa
   extraordinaria se disparaba con cualquier origen, incluido el que no recibe remesas.

6. **La casa propia era inalcanzable** para quien no pedía crédito nunca: su peldaño
   pedía puntaje 45 y sin crédito el puntaje no sube. Lo encontró la vida completa de
   `ruta.js`, y de ahí salió la regla de la segunda salida por tiempo o por edad.
7. **El tutorial no llevaba a ningún lado en tres de sus pasos.** Uno señalaba un botón que
   estaba en otra pestaña, otro apuntaba a un contenedor que no se puede tocar y el último
   pedía una apertura de cuenta que el jugador no podía pagar. Los tres los encontró el
   bloque que juega el tutorial tocando solo lo que la cinta señala.
8. **Abrir la cuenta monetaria antes de repartir el mes dejaba la de ahorro cerrada para
   siempre**, por encadenar con `requiere` un peldaño que abría contenido.
9. **El mejor empleo se elegía por un campo que la mitad de los empleos no tiene.** Al
   agregar los trabajitos de niño, que se pagan por jornada y no tienen `salarioBase`, la
   comparación de `vidas-completas.js` daba `undefined` y el jugador simulado se quedaba
   vendiendo limonada hasta los 65. La suite no falló por un error: falló porque los cinco
   escalones educativos dieron exactamente el mismo patrimonio.

Una décima falla estaba en las pruebas y no en el juego: forzar el azar desde fuera no
afecta al contexto aislado donde corre el motor, así que la prueba de migración fallaba el
18% de las veces y parecía un defecto del producto. Se corrigió en el arranque compartido.

## 22. Despliegue

El repositorio está iniciado en la rama `main` con el primer commit hecho. Faltan tres
pasos manuales desde el navegador, porque en la máquina de desarrollo no está instalada la
herramienta de línea de comandos de GitHub. Están escritos en el `README.md`.

`node_modules` está en el `.gitignore`. Se sube solo el juego, las pruebas y los documentos:
39 archivos. GitHub Pages los sirve tal cual, sin compilación.

## 23. Registro de decisiones

Cuarenta y nueve decisiones acordadas en cinco rondas de entrevista, el 4 de septiembre de
2026. Las que se apartaron de la recomendación inicial y por qué:

- **Bilingüe desde el inicio** en vez de solo español. Costo asumido: cada texto existe dos
  veces y hay que revisar ambos.
- **Sandbox sin final** en vez de meta fija. Se resolvió con envejecimiento, resumen anual y
  reporte consultable, para que el aprendizaje siga teniendo un momento de consolidación.
- **Préstamos en la versión 1** en vez de la 2. El sistema de crédito resultó ser el hilo
  que conecta el resto del juego.
- **Nombre "Mi Primer Quetzal"** pese a cubrir hasta la jubilación. Se resolvió con
  subtítulo.

### Dos tensiones detectadas y resueltas durante el diseño

1. El arco de 47 años en turnos mensuales daba 564 turnos, más de tres horas de juego. Se
   resolvió con compresión por etapa de vida. (El botón de adelantar que la acompañaba se
   quitó después: ver §3.)
2. El ingreso mediano nacional deja Q17 de margen sobre la canasta ampliada, lo que haría
   el juego matemáticamente imposible de ganar. Se resolvió situando al jugador en el
   escenario formal urbano y convirtiendo el escenario mediano en el modo difícil.

## 24. Cuatro cosas que solo se vieron al medirlas

Aparecieron al revisar el efecto de la recalibración, y ninguna era visible leyendo el código.

### 24.1 Los minijuegos nunca compensaban

Un minijuego costaba una semana de trabajo, y la tabla de pago castiga cada semana que no
trabajas: pasar de cuatro semanas a tres quitaba el **30 % del sueldo del mes**. Con los
pagos que tenían, jugar era siempre una pérdida:

| Situación | Cuesta la semana | Pagaba el mejor minijuego |
|---|---|---|
| Sin título, vendedor informal | Q369 | Q220 |
| Sin título, dependiente de tienda formal | Q900 | Q220 |
| Con maestría, gerente | Q3,600 | Q420 |

Un jugador que hiciera cuentas no los tocaba nunca, y la brecha **crecía** conforme avanzaba,
porque los minijuegos de carrera subían mucho menos que el sueldo. La mecánica era decorativa.

Los pagos se recalibraron para que la curva tenga la forma correcta:

| Minijuego | Antes | Ahora | Requisito |
|---|---|---|---|
| Reparto en moto | Q220 | **Q550** | ninguno |
| Turno en la tienda | Q200 | **Q500** | ninguno |
| Cuadra el mes | Q160 | **Q420** | ninguno |
| Caza-estafas | Q150 | **Q400** | ninguno |
| Cierre de caja | Q320 | **Q850** | técnico |
| Conciliación bancaria | Q340 | **Q1,000** | administración |
| Presupuesto de obra | Q360 | **Q1,200** | ingeniería |
| Decisión de inversión | Q420 | **Q1,600** | maestría |

La forma que se buscó, y que ahora una suite entera vigila: **al que menos gana, el trabajo
extra le tiene que rendir más que su propia jornada**, porque así es como vive quien gana
poco; y **al que más gana le tiene que seguir conviniendo su empleo**, porque si no el juego
premiaría abandonar la carrera que costó estudiar. Entre esos dos extremos hay una decisión
real.

**El paso a jornadas movió esta curva y hay que tenerlo presente.** Un minijuego ahora cuesta
media semana, o sea el 15 % del sueldo del mes en vez del 30 %, así que los trabajos extra
valen el doble en términos relativos sin que se les haya tocado un número. La invariante
sigue cumpliéndose, pero por poco: al gerente el mejor minijuego le paga Q1,600 contra los
Q1,800 que le cuesta la jornada. Si algún día se sube un pago o se baja un sueldo alto, esa
es la comprobación que va a fallar primero, y va a estar diciendo la verdad.

### 24.2 El modo difícil es un hoyo de diez años, y está bien que lo sea

Al medirlo salió que en la economía informal **todos los empleos que no piden título dejan
margen negativo** contra el gasto fijo de la casa familiar, que es Q2,200:

| Empleo informal | Ingreso | Margen |
|---|---|---|
| Vendedor por comisión | Q1,229 | **−Q971** |
| Ayudante de construcción | Q1,775 | **−Q425** |
| Repartidor en moto | Q1,911 | **−Q289** |
| Dependiente de tienda | Q2,048 | **−Q152** |
| Tienda propia | Q2,321 | +Q121, pero pide Q8,000 de capital |
| Técnico en refrigeración | Q3,276 | +Q1,076, pero pide título |

Los dos únicos empleos con margen positivo están cerrados al empezar: uno pide un capital que
no se puede juntar estando en negativo, y el otro pide estudiar. **La única salida es
estudiar, y tarda.** Medido sobre quince semillas, jugando bien:

| | Patrimonio mediano | En positivo |
|---|---|---|
| A los 3 años | −Q30,288 | 0 de 15 |
| A los 5 años (ya graduados los 15) | −Q37,613 | 0 de 15 |
| A los 10 años | +Q6,769 | 11 de 15 |
| A los 20 años | +Q131,811 | 15 de 15 |

Se gradúan a los cinco años, pero la deuda acumulada no se salda hasta cerca de los diez. El
jugador pasa sus veintes en rojo y sale a los veintiocho.

**No se cambió nada de esto.** Es duro a propósito y es fiel a lo que dice la investigación:
el ingreso mediano nacional es Q2,300 y la canasta ampliada Q2,283, o sea diecisiete quetzales
de margen. Lo que faltaba era que estuviera **dicho** y que estuviera **protegido**: ahora hay
una comprobación que falla si algún cambio futuro convierte el modo difícil en una trampa sin
salida.

Lo que sí conviene tener claro: el número que muestra `balanceo.js` para el modo difícil
(patrimonio negativo a 24 meses) **no es un error del juego**. Es el primer tramo de la
escalada, visto de cerca.

### 24.3 La escalera educativa, medida escalón por escalón

Al empezar el juego a los 13, "¿estudiar rinde?" dejó de ser una pregunta sobre la
universidad y pasó a ser una pregunta sobre los básicos. La suite de vidas completas corre
ahora cinco rutas sobre veintiuna semillas, y el resultado es lo que el juego promete:

| Ruta | Patrimonio mediano a los 65 |
|---|---|
| No estudiar nunca | Q135,000 |
| Terminar el diversificado | Q578,000 |
| Carrera técnica | Q685,000 |
| Licenciatura | Q942,000 |
| Maestría | Q1,630,000 |

El escalón más grande de toda la escalera **no es la universidad: es el diversificado**. Pasar
de no estudiar nunca a terminar el diversificado multiplica el patrimonio final por más de
cuatro; pasar del técnico a la licenciatura lo sube un 38 %. Eso es exactamente lo que dicen
los datos del INE sobre el ingreso mediano, y es el mensaje que un juego para chicos de 13
años tiene que poder sostener con números y no con un párrafo.

### 24.4 El imperio empobrecía al jugador, y por cuatro razones distintas

Al medir la capa de negocios contra la vida sin negocios, la primera respuesta fue que
**montar negocios dejaba al jugador MÁS POBRE**, y en una de las medidas la vida estudiada
terminaba peor que la que dejó el colegio. Ninguna de las cuatro causas era visible leyendo
el código, y ninguna era la misma:

1. **La estrategia contrataba con contrato en todo.** En un lavado de carros una persona
   produce Q3,360 al mes y con contrato cuesta Q5,248: contratarla es perder Q1,888 cada mes,
   durante cuarenta años, en varios negocios a la vez. El motor estaba bien —cobrar eso es
   justo lo que tiene que hacer— pero la prueba no hacía la cuenta que el juego enseña a
   hacer. La cuenta ahora está escrita en `contratoQueAguanta()`, y su respuesta para los
   negocios chicos es "sin contrato", que es exactamente por qué el 65% del país trabaja así.

2. **Elegía el negocio más caro que podía pagar.** El más caro del catálogo es una
   distribuidora, y una distribuidora atendida por su dueño solo son Q8,000 de renta contra
   Q1,144 de margen. Abrir lo que no puedes atender es pagar dos rentas para trabajar en una.

3. **Traspasaba su mejor negocio cada turno.** Este es el mejor de los cuatro. La decisión
   de cambiar un negocio por otro comparaba contra `proyeccionDeNegocio().neto`, que mide las
   jornadas que el negocio tiene *puestas*; pero esa decisión se toma **antes** de repartir
   las jornadas del mes, y cerrar el turno las deja limpias. Así que todos los negocios se
   veían con cero jornadas y neto negativo, "cámbialo por algo que deje el doble" se cumplía
   siempre, y como traspasar devuelve la mitad de lo invertido, la vida terminó tirando
   **Q1.1 millones en pura rotación**.

4. **Un solo espacio de negocio con primaria era una trampa de diseño.** Y esta sí era del
   juego, no de la prueba. `TECHO_NEGOCIOS.primaria` valía 1, así que un chico de trece abría
   lo único que podía pagar —un puesto de dulces de Q450— y **ya no podía abrir nada más en
   toda su vida**. Medido: cero contratos, cero quiebras, un puesto de dulces durante
   cincuenta años y menos patrimonio que si no hubiera abierto nada. Ahora son dos espacios
   desde el principio, para que siempre haya sitio para crecer sin tener que deshacer; el
   freno educativo lo lleva `TECHO_EMPLEADOS`, que es el que de verdad decide el tamaño.

Las cuatro se encontraron con la misma herramienta: una traza opcional (`TRAZA=1 node
pruebas/imperio.js`) que imprime de dónde salió y a dónde se fue cada quetzal de una vida
completa. Sin ella, las tres primeras eran indistinguibles entre sí, porque todas se veían
igual: un número final más bajo de lo que debía.
