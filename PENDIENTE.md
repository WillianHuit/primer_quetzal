# Pendiente

Estado al 8 de septiembre de 2026. Lo que sigue está ordenado por lo que más
aporta al juego, no por lo que es más fácil.

---

## 0. Lo que le toca a quien siga con el tablero

El tablero del mes es lo que más va a crecer, y ya tiene su propia guía:
**`docs/como-crecer-el-tablero.md`**. Ahí está el formato de cada cosa, los
rangos que no desbalancean y la regla de la condición `si`. Lo que falta,
por orden de lo que más se nota jugando:

- **Más comodines.** Son los que el jugador recuerda y solo hay ocho. Deberían
  ser treinta.
- **Más dificultades de adulto.** Las 21 de ahora son de estudiante y de casa;
  falta lo que le pasa a alguien de 30 con un negocio y dos hijos.
- **Los comodines no están traducidos al inglés** (40 cadenas: pregunta, los
  dos lados y los dos resultados de cada uno). Las dificultades y los viajes
  en el tiempo sí lo están, en `datos/textos.en.v2.js`.
- **Condiciones nuevas.** `si` acepta tres palabras (`estudia`, `trabaja`,
  `dinero`). Faltan la edad y el número de negocios abiertos, y agregar una es
  tocar `cumpleCondicion()` en `js/motor.js`: cuatro líneas.

---

## 0.1. Lo que se cerró hoy

### El colegio deja de llevar al jugador de la mano

- **El mes dice cuántas tareas lleva puestas.** Faltaba, y era justo el número que hace falta
  para decidir: sin él, repartir es a ciegas.
- **El tutorial guía la PRIMERA tarea y después suelta.** El paso de los meses de colegio
  pasó por los dos extremos y los dos estaban mal: señalando siempre el botón de cerrar le
  enseñaba a saltarse el juego; señalando cada casilla de los cuatro meses lo llevaba de la
  mano por algo que ya había aprendido. Ahora la cinta se queda como una nota y la pantalla
  no se apaga. Repartir esos meses —incluido no hacer ninguna tarea— es del jugador.
- **El banco ya no se abre en clases.** Cuatro meses bastaban para que el efectivo se fuera en
  gastos hormiga, y le aparecía una pestaña de banco a alguien que no gana nada que guardar.
  Ahora espera al trabajo. Quien ya tiene empleo pasa igual, aunque no haya tocado el tutorial.

### Las tareas se pueden reprobar

Al **cuarto error** la clase se acaba, no da experiencia, y la jornada se gastó igual. Se
repite el mes siguiente. Es lo que las convierte en una tarea y no en un botón que da puntos:
si da igual cómo salga, no estás estudiando, estás cobrando. Los tres errores de margen van
dibujados como puntos que se apagan.

### Cuatro tareas de primero, de quince segundos

`Suma rápida` (**un solo dígito**, generadas al vuelo), `¿Cuál es más?` (comparar dos
cantidades, con los casos que engañan: Q90 contra Q100, Q9.50 contra Q9.05), `¿Cuál es
distinto?` (tres figuras iguales y una que no — entrena fijarse, que es el hilo que acaba en
`Caza-estafas`) y `¿Cuánto hay?` (reconocer billetes y monedas).


### La cinta dejaba de pedir tareas después de la primera

El paso de los meses de colegio señalaba **siempre** el botón de cerrar el mes, así que
después de la primera tarea el tutorial le enseñaba al jugador a saltarse el juego: tocar
cinco veces el mismo botón sin repartir nada. Ahora la cinta señala **lo que toca**, y en
estos meses eso cambia tres veces dentro del mismo turno: hay casillas libres, hay una
elegida, o ya está todo repartido.

### Las primeras tareas eran de quinta clase, no de primera

`Da el cambio` pedía calcular el cambio de una compra con centavos, y duraba setenta
segundos. Eso no es la primera tarea de un chico que acaba de salir de primaria.

- **Dos tareas nuevas de verdad sencillas, de quince segundos**: `Suma rápida` (sumar y
  restar quetzales, generadas al vuelo para que no se aprendan de memoria) y `¿Cuánto hay?`
  (reconocer billetes y monedas y sumarlos; se distinguen por la **forma** —la moneda es
  redonda y dorada, el billete un rectángulo— porque lo que se practica es reconocer).
- **Sin explicación entre pregunta y pregunta**: en una suma no hay nada que explicar, se
  marca la correcta y se pasa. Un cartel de dos segundos se comería la mitad de la tarea.
- **Las clases de una carrera ahora tienen su propio orden**, con `desdeExperiencia`. Básicos
  dura tres años: se empieza sumando (0), después dar el cambio (30), comparar precios (55) y
  al final reconocer una estafa (85), que pide leer un mensaje entero y decidir.
- Y las que ya estaban se acortaron: `Da el cambio` y `¿Cuál conviene?` de 70 a 35 segundos,
  `Caza-estafas` de 60 a 45.


### Repartir el mes es una promesa, y ahora el juego la cobra

Los cuatro turnos de colegio se podían pasar tocando el mismo botón cinco veces sin hacer
nada. Una jornada puesta en tareas era un adorno, no una decisión.

- **Al terminar de repartir, el juego lleva a hacer lo que prometiste.** Si pusiste dos
  jornadas en tareas, salen las dos, una por una, con la lista delante para elegir cuál.
  El mes **no se cierra** hasta que se resuelva.
- **Dejarlas también se puede** —el jugador manda— pero se dice en voz alta lo que cuesta:
  esas jornadas se pierden, el tiempo no se guarda. Y no hay botón de cerrar: o la haces o
  la dejas, porque salirse sin decidir dejaría la promesa en el aire.
- El mismo enganche sirve para lo que viene: cuando entren los turnos de trabajo, se hacen
  ahí mismo.

### En clases, el juego no habla de dinero

Mientras el trabajo no exista, el jugador es un chico de trece en clases. Enseñarle un
patrimonio de Q120 que no puede mover ni gastar es enseñarle a mirar un número que no
responde.

- **La barra de arriba lleva su experiencia**, en el sitio exacto donde después va el dinero.
- **La tarjeta de lo que entra y sale no sale**, y el cierre del mes es una **boleta**:
  cuánta experiencia ganaste y cuánto te falta de carrera, no dos barras de entró y salió.
- **En cuanto se abre el trabajo, el dinero aparece de golpe.** Eso también dice algo: el
  dinero entra en tu vida cuando empiezas a ganarlo.
- Va atado a la **llave** y no a la cinta del tutorial: quien se salta el tutorial pero sigue
  en clases tampoco tiene nada que hacer con una cifra de dinero.


### El juego empieza en clases, y nada más

El tutorial abría el trabajo, el imperio y los extras casi de golpe. Ahora:

- **Los primeros cuatro turnos son solo colegio**: dos pestañas, Mes y Estudio. En el quinto
  se abre Trabajo, y lo que hay ahí son los **tres trabajitos por cuenta propia**, sin
  contrato y sin patrón, que es lo único que existe a los trece. La constante está arriba de
  `datos/progreso.js` como `MESES_SOLO_COLEGIO`.
- **Quien decide no estudiar lo abre de una**, porque no tiene clases a las que ir. Esa es la
  diferencia entera entre los dos caminos y el juego la dice sin decirla: el que estudia
  empieza más despacio.
- **El imperio ya no se abre al cerrar el primer mes.** Eso era un cañonazo: un chico de
  trece veía aparecer un negocio y una tienda de mejoras que no puede pagar. Ahora llega
  cuando tiene con qué —Q900, el doble del puesto de dulces más barato— y la condición es
  solo el dinero, no tener empleo: pedir las dos cosas se lo cerraría para siempre a quien
  vive de una mesada.
- **El banco se abre solo**, sin tutorial, porque cuatro meses de clases bastan para que el
  efectivo se le vaya en gastos hormiga. Ese es el momento en que el banco tiene sentido.

### Las tareas ahora son de la carrera que estás haciendo

- **Dos ejes distintos y no se parecen.** `requiereCarrera` es de los trabajos de oficio: se
  abren con el título **ya en la mano**. `paraCarrera` es de las clases: se abren mientras
  estás **inscrito**. Es la diferencia entre "ya lo aprendí" y "lo estoy aprendiendo".
- **Básicos tiene tres tareas sencillas y generales**: `Da el cambio` (restar dinero de
  verdad, con precios de tienda), `¿Cuál conviene?` (precio por unidad, y **el paquete
  grande no siempre gana**, porque premiar "compra el grande" enseñaría una regla falsa) y
  `Caza-estafas`.
- **Diversificado tiene la primera especializada**: `Cuadra el mes`. A los trece no hay
  sueldo que cuadrar.
- **Las carreras que todavía no tienen tarea propia lo dicen** en pantalla, en vez de dejar
  la sección en blanco. Faltan: técnico, administración, ingeniería y maestría.


### El colegio da experiencia, no dinero

Primera mitad de la reforma de la ruta. Lo que había antes no se sostenía: los dos
minijuegos que enseñan —cuadrar un presupuesto, reconocer una estafa— vivían en un cajón
llamado "Extra" y **soltaban Q400 por hacerlos**. Eso decía algo que no es verdad: que hacer
la tarea da dinero.

- **Son clases, y las clases no pagan.** `tipo: 'clase'`, `pagoMaximo: 0`,
  `experienciaMaxima: 25`. Dan **experiencia**, que es un número que solo sube: no se compra,
  no se gasta y no se pierde al quedarse sin dinero. Es lo único del juego que, una vez que
  lo tienes, ya es tuyo.
- **Cuestan una jornada de `tarea`**, una casilla propia distinta de "Estudiar" y de "Extra".
  Estudiar adelanta los meses de la carrera; la tarea da experiencia. Solo se ofrece mientras
  esté inscrito, porque no hay tareas sin colegio.
- **La experiencia abre carreras.** Perito 60, técnico 150, administración 180, ingeniería
  240, maestría 400. Los números están puestos contra la cuenta del pupitre (3 por mes
  inscrito): básicos da 108 sin hacer una sola tarea y el bachillerato otros 72, así que el
  camino normal llega **siempre** a las del medio. Ingeniería y la maestría **no**: esas hay
  que ganárselas. Ahí está la decisión.
- **Las dos primeras carreras no piden nada.** La puerta de entrada del juego no se cierra
  jamás, y `pruebas/minijuegos-valen.js` lo comprueba.
- **Nada se bloquea en silencio.** Cada carrera lleva su barra con el hueco —`234 / 240`— y
  la pantalla de Estudio dice siempre qué se abre con lo que falta. Un "no te alcanza" al
  tocar es un muro; una barra que sube es una meta.
- **El trabajo ya no lo abre inscribirse: lo abre la primera tarea.** Antes un chico de trece
  salía a buscar empleo el primer mes sin haber pisado un aula. Quien decide **no** estudiar
  lo abre de una, porque sin colegio no tiene tareas que hacer.
- **Las partidas guardadas se migran.** Sin eso, quien ya tenía diversificado abría el juego
  con cero de experiencia y **ninguna carrera** en la que inscribirse. Se le da la que habría
  ganado sentado en clase por lo que ya estudió.

Y las vidas simuladas ahora hacen tareas, porque el juego se las pide: la escalera quedó
**Q135k sin estudiar → Q578k diversificado → Q685k técnico → Q942k licenciatura → Q1.63M
maestría**, más empinada que antes.

Lo que sigue de esta reforma, cuando se retome: los **trabajos por edad y experiencia**, con
**entrevista** para los formales, y el imperio detrás.

### Repaso de saturación: cinco cosas que sobraban o llegaban antes de tiempo

Salió de mirar las pantallas con los ojos, una por una, a tres edades distintas.

1. **El cierre del mes decía todo dos veces.** Las dos barras —entró, de dónde, salió, en
   qué, cuánto quedó— y debajo hasta **veintiséis filas** repitiendo lo mismo partido más
   fino. Era la pantalla más cargada del juego y aparecía en el único momento en que el
   jugador sí quiere leer. Ahora el desglose llega plegado, y sigue entero para quien quiera
   cuadrar el mes al centavo.
2. **El imperio se llamaba "Ingresos extra"** en la barra del cierre, metido con la mesada y
   los trabajos sueltos: en un mes en que dejó Q23,842 la barra decía "ingresos extra 76%".
   Lo que sostiene al jugador no puede llamarse extra, y el desglose de abajo ya lo llamaba
   "Tu negocio". Ahora tiene su propio trozo, en ámbar.
3. **El lote vacío se podía tocar desde el primer turno.** Un chico de trece en el paso uno
   del tutorial tenía un "+" latiendo al lado de su casa que le abría un catálogo de nueve
   negocios que no puede poner. Se sigue dibujando punteado y quieto —decir "aquí va a caber
   algo" está bien— pero no se ofrece hasta que el imperio existe.
4. **El botón de cerrar el mes invitaba a cerrarlo sin repartir.** Subirlo a la calle lo puso
   encima de las cifras, y con ocho jornadas libres era un botón verde enorme invitando a
   cerrar el mes en pérdida. Ahora solo grita cuando el mes ya está repartido.
5. **La gráfica del imperio medía casi quinientos píxeles para dibujar dos barras**, y estaba
   encima de las tarjetas: para llegar a lo accionable había que pasar por delante de ella.
   Alto fijo, y debajo de los negocios.

### Un negocio que pierde dinero lo dice en la calle

Era lo que le faltaba a la calle para ser un tablero y no un escenario: un local vacío que se
come la renta todos los meses se veía **exactamente igual** que uno lleno que deja Q3,000, y
para enterarte había que entrar a mirar sus cifras uno por uno. Ahora lleva un punto rojo, y
va encima del engranaje a propósito: la señal tiene que estar en el botón que la resuelve.

### Estudio y Trabajo dejaron de ser pantallas de solo mirar

Las dos eran un estado y **un solo botón, que además destruía** —renunciar, dejar de
estudiar—. Te inscribías una vez y pasabas treinta y seis meses sin nada que tocar ahí,
mientras las actividades del juego vivían guardadas en un cajón llamado "Extra".

- **Trabajo** tiene un apartado de **Turnos**: los seis minijuegos de oficio, donde tienen
  sentido. Y **pedir que te pongan en planilla**, que es la acción más de este juego que
  existe: pone al jugador del otro lado de la decisión que ya toma como patrón. Informal le
  dan 5% más en la mano cada mes; formal le dan Bono 14 y aguinaldo, que son **dos sueldos
  más al año**, más IGSS y más historial. Pueden decir que no, y la probabilidad va escrita
  antes de tocar el botón: a ciegas sería una tragamonedas.
- **Estudio** tiene **Practicar** —los dos minijuegos que enseñan, presupuesto y estafas— y
  el botón de **ponerle una jornada** a la carrera, que hasta ahora obligaba a volver a la
  pestaña del mes, tocar una casilla y buscar "Estudiar" en la lista.
- Un **trabajito de niño no ofrece contrato**: vender dulces en el bus no lo contrata nadie,
  y ofrecerlo sería mentir sobre cómo funciona eso. Están marcados `soloInformal` en los
  datos y la tarjeta no se dibuja.
- La pestaña **Extra** se queda como el catálogo completo, incluidos los que aún no se abren.
  Ya no es donde se encuentran las actividades; es donde se ve qué hay más adelante.

### El tutorial ya no contesta por el jugador

El foco apaga la pantalla menos lo señalado, y lo señalado salía de `querySelector`: **el
primero**. En las dos pantallas donde el juego pregunta de verdad eso significaba elegir por
el jugador —"Pública" de la primera carrera, con la privada y el "no, a trabajar" a oscuras;
y una de las tres ofertas de trabajo—. Había además una segunda capa deliberada: la marca del
tutorial iba solo en el primer botón de inscribirse.

En un juego cuya lección es que ninguna de esas salidas es gratis, eso enseñaba lo contrario.
Arreglado en el foco, en la marca y en `reubicarFoco` (que pedía uno solo y deshacía el
arreglo al primer scroll), y comprobado en cada paso por `pruebas/dom-real.js`.

### Abrir y administrar un negocio se hace en la calle

- **El engranaje de cada local** abre una hoja debajo de la calle con lo de subirle el nivel,
  contratar y traspasarlo. **El lote vacío** abre ahí mismo lo que se puede abrir, en vez de
  llevarte a otra pestaña y hacerte volver.
- La hoja **reusa las tarjetas del imperio**, no las copia: son las que enseñan lo que cuesta
  de verdad un empleado formal, y dos versiones serían dos sitios donde equivocarse.
- Es una hoja dentro de la pantalla y no una ventana encima, porque contratar vuelve a pintar
  la pantalla y una ventana flotante se quedaría con las cifras viejas.

### El mes se cierra desde la calle

Estaba al final de la pantalla, después de la rejilla, la ruta y las tres cifras: a dos
pantallazos de scroll de lo que el jugador acababa de decidir. Ahora está en la barra pegada
a la calle, y cambia de tamaño según si queda mes por repartir.

### La calle dejó de ser una pestaña y pasó a ser la pantalla

La reforma del imperio había metido los negocios, la planilla y los techos **en la cuarta
pestaña de siete**, y lo primero que veías al abrir el juego seguía siendo una rejilla de
ocho casillas vacías. Eso no es un tycoon; es una hoja de cálculo con una calle de adorno en
otra pantalla. Corregido:

- **La calle abre la pantalla del mes**, con el lote vacío latiendo al lado mientras te quepa
  otro negocio. La rejilla de jornadas se queda debajo: ya no es donde se juega, es donde se
  comprueba en qué se fue el mes.
- **Cada local es un botón** que mete una jornada tuya adentro, sin elegir casilla. La forma
  vieja sigue viva porque es la que enseña el tutorial y la única que deja elegir en cuál.
- **Cada negocio lleva una insignia** con la silueta y el número de jornadas tuyas de este
  mes. Cierra el lazo: las siluetas de abajo dicen a quién le pagas, la insignia dice dónde
  estás tú, y un negocio sin dueño adentro rinde un 30% menos.
- **La calle arranca pegada a la derecha** y recuerda dónde la dejaste. Sin lo primero, en un
  teléfono de 390 px se veía una lámpara y unos libros con los negocios fuera de pantalla;
  sin lo segundo, saltaba de sitio debajo del dedo en cada toque.
- **Una sola función dibuja las dos calles**, la del mes y la del imperio, y solo cambia si
  responde al dedo.

### Los 36 locales por tipo, conectados

Llegaron en la rama `assets` como respuesta a la prioridad 1 de
`RECURSOS_TYCOON.md`: cuatro niveles para cada uno de los nueve tipos de negocio.
Ya se ven, y **una tortillería ya no se ve igual que un taller de motos**, que era
el hueco más grande que tenía el juego después de la reforma del imperio.

- **Los cuatro locales genéricos no se tiraron, y no son código muerto.** Un
  negocio busca su dibujo en tres peldaños: el de su tipo, si no el genérico con
  el sello del emblema encima, si no el dibujo SVG. Eso es lo que permite
  entregar los dibujos **por lotes**: los seis tipos que faltan pueden entrar a
  `datos/negocios.js` hoy y a las ilustraciones el mes que viene, y en el medio
  quien abre una panadería ve un puesto con un pan en el rótulo, no un hueco.
- **El sello va donde hace falta y no donde estorba**, y `pruebas/arte.js`
  comprueba las dos mitades. Es la regla que se rompe sola al llegar un lote
  nuevo: se ilustra un tipo, se olvida quitar el sello, y queda una calcomanía
  tapando el comal.
- **El cuadriculado horneado volvió a venir en la entrega.** Es la regla 1 de
  `RECURSOS_TYCOON.md` §1 y se incumplió las dos veces; la tortillería con equipo
  traía el 7.7% de su superficie con el patrón opaco metido en los huecos
  cerrados. El canalizador lo quita solo, así que no bloquea nada, pero conviene
  repetirlo antes del siguiente lote.
- **Entraron a 192 px y no a 256.** A 256 el total se iba a 1.5 MB, o sea al
  borde del tope que protege `pruebas/arte.js`. En pantalla el local más grande
  se ve a unos 90 px, así que la decisión no costó nada: **1.1 MB entre las 73**.
- **La calle se ensanchó**: el nivel 4 pasó de 48 a 58 unidades y el hueco de
  cada negocio de 46 a 56, porque a 48 no se veía el detalle que traen los
  dibujos nuevos. Con ocho negocios la escena mide 580 unidades y hay que
  arrastrarla, que es lo que se quiere.

### Las 37 primeras ilustraciones, conectadas

Llegaron en la rama `assets`: el mismo chico en 23 estados, los cuatro niveles de un
local, las ocho piezas de las cadenas de mejoras y la moneda. Ya están puestas, y el
detalle completo está en `RECURSOS_VISUALES.md`. Lo que conviene saber de aquí:

- **Dos carpetas.** `assets/visuales/` son los maestros (125 MB con los dos lotes) y el
  navegador **no los carga**. `assets/juego/` son las copias WebP que sí carga: **1.1 MB
  entre las 73**. Las escribe `herramientas/preparar-imagenes.py`.
- **El dibujo SVG se queda detrás y no es código muerto**: un empleo nuevo funciona el
  mismo día con su uniforme, sin esperar a que nadie lo ilustre. Quien decide es
  `js/arte.js`.
- **Cuatro problemas al colocarlas**, ninguno visible leyendo el código: el cuadriculado
  de transparencia horneado y opaco dentro de los huecos cerrados (la canasta tenía el
  5.6% de su superficie así), el limpiador comiéndose los rayos de las ruedas de la
  bicicleta, el personaje quedando enterrado en la plataforma, y las figuritas de la gente
  contratada cortadas por el borde del suelo. Están contados en `RECURSOS_VISUALES.md` §4.
- **`escena/plataforma.png` no se usa**, y es a propósito: es un óvalo para un objeto
  centrado, y el escenario es una calle que se alarga. Estirarlo lo deja irreconocible.


### El imperio: ahora sí es un tycoon

La capa de mejoras no alcanzaba, y el motivo es fácil de decir: era **un negocio de
mentira**. Un número que subía. `datos/negocios.js` es lo otro: el jugador **abre**
negocios, les sube el nivel y **contrata gente**, y cada negocio abierto sale como un local
en su calle, con su gente parada enfrente. La calle se alarga conforme crece.

- Nueve tipos de negocio, del puesto de dulces de Q450 a la distribuidora de Q250,000.
- Cada uno se lee con **dos** números y no con uno: lo que vende y lo que le queda.
- Contratar enseña la cifra que más negocios hunde: con contrato cuesta el sueldo por 1.42
  más Q250, no el sueldo. Y despedir cuesta un sueldo por año trabajado.
- Cuatro frenos, todos reales: cuántos negocios llevas, cuánta gente administras (los dos
  suben con el estudio y se ven en su barra), qué negocios piden colegio, y que un negocio
  sin ninguna jornada tuya rinde 30% menos.
- Medido sobre once semillas: estudiar sigue ganando 5 a 1, y para quien no estudió, montar
  negocios le multiplica el patrimonio por 4.7.
- El detalle de las **cuatro razones distintas** por las que esto empobrecía al jugador en
  las primeras medidas está en §24.4 del documento de diseño. Vale más que el código.


Esta sección es para no volver a buscarlo. Detalle en la sección 14 del
documento de diseño.

### Dos librerías, dentro del repositorio

- **`vendor/` trae Lucide y Chart.js como archivos normales.** Los CDN no
  responden desde esta red pero el registro de npm sí, así que
  `herramientas/traer-librerias.js` las baja una vez y las deja en el
  repositorio. Quien juega no descarga nada y el doble clic sigue funcionando
  sin internet.
- **Lucide entra como respaldo, no como reemplazo.** Los 78 dibujos propios
  siguen siendo los que se usan; Lucide se consulta solo cuando un nombre no
  está dibujado a mano, y así se puede agregar contenido nuevo sin dibujar cada
  icono. Se recortan 66 de los 1,815 que trae el paquete.
- **Chart.js dibuja la gráfica del negocio**, siempre detrás de un
  `typeof Chart !== 'undefined'` y un `try`: si ese archivo faltara, la
  pantalla sale igual sin gráfica.
- **Howler, Day.js, DiceBear y los paquetes de Kenney se quedaron fuera**, y el
  motivo de cada uno está escrito en la cabecera de
  `herramientas/traer-librerias.js` para no volver a discutirlo. En resumen:
  Howler necesita archivos de audio que el juego no tiene (los tonos se
  sintetizan), Day.js no tiene fechas que formatear, DiceBear es solo ESM —que
  `file://` bloquea por CORS— y además hace lo contrario de lo que aquí hace
  falta, y los de Kenney son PNG en un `.zip` de un sitio que no responde.

### El escenario que crece

- **`js/escena.js` dibuja el negocio del jugador y le agrega cosas conforme
  compra**: terreno vacío → canasta → carreta → puesto con toldo → local con
  puerta y rótulo, más la caja de herramientas, el rótulo colgado, la
  bicicleta, la mochila, los libros, la antena, el banquito y la lámpara. Era
  lo que le faltaba para parecer un tycoon: las mejoras ya subían de nivel,
  pero el jugador leía "Nivel 2 de 4" y tenía que imaginárselo.
- **Con monedas que suben mientras el negocio produce**, un saltito del
  escenario al comprar, una barra de cuánto falta para la siguiente mejora y
  una gráfica de lo que ha producido mes por mes.
- **Las piezas se reparten el ancho por zonas**, documentadas en la cabecera
  del archivo. La primera versión no las tenía y el rótulo del oficio le quedó
  cruzado en la cara al personaje. `pruebas/iconos.js` comprueba además que
  cada escalón de cada cadena tenga su dibujo: sin eso, agregar un nivel nuevo
  dejaría de crecer la escena en silencio.

### Una capa de tycoon, genérica para todas las etapas

- **Cuatro cadenas de mejoras** en `datos/mejoras.js`: tu negocio (canasta →
  carreta → puesto → local), tus herramientas, tu estudio y tu descanso. Suben
  de nivel, se ven con puntos, y es la única pantalla del juego donde los
  números suben. Genéricas a propósito: el chico de 13 mejora su canasta de
  dulces y el ingeniero de 30 su taller, en la misma pantalla.
- **Cada mejora dice en cuántos meses se paga sola.** Es el único cálculo que
  hay que hacer antes de comprar una herramienta, y el juego lo pone a la vista
  en vez de explicarlo.
- **El negocio produce sin gastar jornadas**, con variación mes a mes, y **puede
  quebrar** si no le guardas tres meses de venta de colchón. Sin ese riesgo,
  cualquier ingreso pasivo compuesto cuarenta años se vuelve una máquina de
  dinero.
- **Y los dos escalones grandes del negocio piden nivel educativo.** Es lo que
  evita que el tycoon se coma el mensaje del juego: la primera versión dejaba a
  un jugador que nunca estudia en el **80%** del patrimonio de uno que sube la
  escalera completa. Con la puerta educativa quedó en el 47%, que es lo que se
  buscaba: que valga la pena y que no gane. `pruebas/mejoras.js` falla si ese
  orden se invierte.

### El banco llega cuando duele no tenerlo

- **El tutorial dejó de regalar la cuenta.** Terminaba pidiéndole a un chico de
  13 que abriera una cuenta monetaria, o sea que le regalaba un producto
  financiero en el minuto cinco por obediencia y no por necesidad. Ahora el
  tutorial son nueve pasos y termina al cerrar el primer mes.
- **La cuenta de ahorro se abre cuando el efectivo ya se le fue.** La condición
  es `fugaEfectivo >= 30`: en cuanto acumula Q30 perdidos en cosas que no
  recuerda, el juego se lo enseña y le abre el banco. La lección llega DESPUÉS
  de haberla sentido.
- **Y la monetaria la pide un patrono.** Es la diferencia que el juego quería
  enseñar y no tenía cómo: la de ahorro es para guardar y no cuesta nada; la
  monetaria es para operar, la pide un empleo formal para acreditar planilla, y
  si nadie te acredita planilla **el banco te cobra Q12 al mes de manejo de
  cuenta**. Un producto que no necesitas no es gratis.

### El arranque y la lista de trabajos

- **Tres niveles con color** en vez de dos preguntas seguidas con cinco
  tarjetas largas: fácil, medio y difícil, cada uno emparejando un origen con
  una economía. La combinación exacta sigue disponible en "prefiero elegir yo".
- **La decisión de estudiar muestra todas las opciones**, no una. Cuando hay dos
  diversificados —el bachillerato es un año más corto, el perito sale con
  oficio— hay que poder verlos juntos.
- **Las ofertas de empleo son tarjetas con el personaje vestido de ese oficio.**
  Y lo que el jugador todavía no puede tomar **ya no se muestra**: estuvo un
  rato abajo en una lista de "para estos te falta", y era la misma parálisis en
  versión corta.

### El fallo del velo pegado

El tutorial terminaba y el velo oscuro con su flecha se quedaban en pantalla
para siempre, señalando un hueco vacío. `pintarGuia()` apagaba la cinta y
volvía sin apagar el foco, que vive en otro elemento. Corregido y con prueba:
`pruebas/dom-real.js` sigue el tutorial con una geometría de mentira —jsdom no
calcula rectángulos, así que sin eso el foco nunca se dibujaba y la
comprobación no medía nada— y verifica que al terminar no quede ni velo, ni
flecha, ni nada señalado.

### El juego empieza nueve años antes

- **A los 13, saliendo de primaria.** Arrancar a los 18 con el diversificado en
  la mano significaba que el juego ya había tomado por el jugador la decisión
  más importante de su vida financiera. Ahora la primera pantalla es esa
  decisión: estudiar básicos o ponerse a trabajar, sin que ninguna esté marcada
  como correcta, y la pregunta vuelve cada vez que se gradúa de algo.
- **La escalera educativa completa**: primaria → básicos → diversificado
  (bachillerato o perito contador) → técnico o licenciatura → maestría. Medida
  sobre 21 semillas, el escalón más grande **no es la universidad, es el
  diversificado**: multiplica el patrimonio final por más de cuatro.
- **Tres trabajitos de niño** que pagan Q4, Q5 y Q6 por jornada (vender
  periódico, limonada y dulces). Existen para que la comparación se vea sola:
  ocho jornadas de limonada son Q40 al mes; el mismo mes de dependiente de
  tienda son Q3,000. Cada empleo pide ahora edad mínima además de nivel.
- **Las cuentas tienen mínimo de menor de edad** (Q25 y Q50, como las cuentas
  infantiles reales). Sin eso el tutorial le pedía Q200 a alguien que gana Q40
  al mes, y el último paso era imposible de completar.
- **El salto de los 18.** Mientras es menor, el gasto de la casa no es suyo:
  paga Q20 de pasaje y refacción. El mes que cumple 18 pasa a pagar su parte
  completa, y el juego saca una ventana comparando las dos cifras. Ese golpe le
  llega a todo el mundo y a casi nadie le avisan.

### El mes se reparte por jornadas

- **Ocho jornadas en vez de cuatro semanas**: cuatro semanas de mañana y tarde.
  Los colegios de Guatemala son de jornada, así que el chico que estudia por la
  mañana puede trabajar por la tarde, y eso antes no se podía representar.
- **Básicos toma una jornada de cada semana y no se puede vaciar.** En
  diversificado se elige mañana o tarde al inscribirse; en la universidad se
  reparte libre. Tocar una jornada del colegio explica por qué en una línea, en
  vez de quedarse callado.
- Las tablas de energía y de pago se partieron a la mitad, así que **el
  balanceo de la versión anterior sigue valiendo**. Lo único que se movió de
  verdad es el precio relativo de un minijuego: cuesta media semana en vez de
  una, o sea que vale el doble sin haberle tocado un número (ver §5).

### Menos texto, más dibujo

- **Un personaje que se viste de lo que hace** (`js/personaje.js`): casco en la
  construcción, audífonos en el call center, mochila mientras estudia, jarra si
  vende limonada. Armado por piezas, sin librería, y con los colores de la
  paleta que ya existía.
- **El resumen del mes son tres cifras** —entra, sale, queda— con el detalle
  detrás de un toque. Eran doce filas de texto.
- **Las listas largas usan pastillas** en vez de filas de "etiqueta ..... valor",
  y las ofertas de empleo se partieron en dos: las que se pueden tomar arriba, y
  lo que falta para las demás en una línea cada una.
- **Los párrafos que enseñan se guardaron detrás de "¿Por qué?"**. No se
  borraron: salen cuando el jugador los pide.

### El tutorial ahora sí señala

- **Se oscurece todo menos lo que hay que tocar, y se le pone una flecha.** El
  foco no recibe clics: se le señala el camino al jugador, no se le cierran las
  otras puertas. Si la flecha cae donde está la cinta, la cinta se levanta.
- **Salirse dejó de competir con seguirlo.** "Ya sé jugar" era un botón del
  mismo tamaño que el principal, o sea la salida más cómoda de la pantalla.
  Ahora es un enlace chiquito arriba a la derecha.
- **Once pasos en el orden en que se vive**: Estudio, decidir, Trabajo, aceptar,
  Mes, tocar jornada, Trabajar, llenar el resto, cerrar el mes, Banco, abrir
  cuenta. `pruebas/dom-real.js` lo juega tocando únicamente lo que la cinta
  señala y falla si se atasca; en este cambio atrapó tres pasos rotos.

### Tarjetas de decisión

- **Doce dilemas sin respuesta obvia** en `datos/decisiones.js`, con dos o tres
  botones del mismo tamaño y la lección después de elegir, nunca antes. La feria
  del pueblo, la bicicleta usada que deja Q3 más por jornada para siempre, la
  moto en cuotas que cuesta Q23,400 por una moto de Q14,000, el amigo que pide
  prestado sin papel.
- Con **enfriamiento** (`MESES_ENTRE_DECISIONES`): una decisión que llega todos
  los meses deja de ser una decisión y se vuelve un formulario.
- A un menor de edad tampoco le caen los golpes de dinero de `eventos.js`: la
  cuenta del dentista, a los 13, la paga la casa.
- `pruebas/decisiones.js` vigila la forma, los efectos, las edades, la
  traducción y el enfriamiento. Una tarjeta mal escrita no lanza ningún error.

### El banco se partió, y lo del jugador salió de ahí

- **Cuentas · Crédito · Vivienda.** Era la pantalla más larga del juego con
  diferencia: siete pantallazos. La vivienda solo aparece siendo mayor de edad.
- **Una pantalla de "Yo"** con el patrimonio, el historial de crédito, el nivel
  educativo y el personaje en grande, detrás del muñeco de la barra de arriba.
  Mezclar "cuánto tengo" con "qué contrato" era media razón de que el banco
  resultara ilegible.

### De antes, y sigue en pie

- **Los emoji salieron.** Setenta y ocho dibujos propios en `js/iconos.js`.
  `pruebas/iconos.js` vigila que todo nombre pedido exista, que todo dibujo se
  use y que no vuelva a entrar un emoji; ahora vigila también los uniformes del
  personaje.
- **Transiciones al cambiar de pestaña** y **interfaz con relieve**, con la
  paleta intacta: los tonos se calculan con `color-mix` desde las mismas nueve
  variables.
- **Dieciocho peldaños de ruta** en `datos/progreso.js`. `pruebas/ruta.js` juega
  una vida entera y falla si alguno quedó inalcanzable.
- **Vista previa para revisar el diseño con los ojos.** `pruebas/vista.html`
  abre el juego con una partida ya empezada; los parámetros están en su
  cabecera, y ahora incluyen `?nino=1`, `?perfil=1` y `?decision=<id>`.

---

## 1. El mapa de zonas — decidido, no construido

**Es lo más grande que falta.** Las decisiones ya están tomadas y anotadas:

| Decisión | Respuesta |
|---|---|
| Qué zonas | **Las reales de la Ciudad de Guatemala** (1 a 25, más Mixco, Villa Nueva, Villa Canales, Santa Catarina Pinula) |
| Cómo entra | **Se suma** a los tres niveles de vivienda que ya existen; no los reemplaza. Eliges tipo de vivienda *y* zona |
| Qué cuesta vivir lejos | **Dinero y tiempo.** El tiempo consume energía y puede costarte una de las ocho jornadas del mes |
| Qué NO entra | El riesgo de asalto en el trayecto. Convierte la decisión en lotería y ya hay eventos de robo |

**Los datos de precio ya están investigados**, en el anexo F de
`docs/investigacion-economia-guatemala.md`: precio por m² y tamaño promedio por
zona, del FHA, para catorce zonas y cinco municipios. Eso permite anclar la renta
de cada zona en una fuente real en vez de inventarla.

**Falta el dato de transporte y geografía**, que quedó en investigación sin
terminar: qué zonas concentran el empleo, tiempos de viaje en hora punta desde los
municipios dormitorio, precio del pasaje de Transmetro y Transurbano, y gasto
mensual de transporte. Hay que volver a lanzar esa búsqueda.

**Lo que hay que construir**, en orden:

1. `datos/zonas.js` con las zonas, su renta relativa, su carácter (residencial,
   comercial, industrial) y una matriz de distancia o tiempo entre ellas.
2. Un campo de zona en el empleo, para saber dónde queda el trabajo.
3. El costo de transporte en `resolverMes()` del motor, como una línea nueva del
   mes. La barra gráfica del resumen **ya tiene el segmento `transporte`
   preparado y con color asignado**, solo hay que alimentarlo.
4. El costo en energía por tiempo de viaje, conectado al sistema de energía que ya
   existe.
5. La vista del mapa. Mi recomendación: **SVG esquemático**, que conserve la
   posición relativa de las zonas sin pretender ser un plano exacto. Dibujar
   coordenadas reales sería inventar precisión que no tengo.
6. Que el origen del personaje defina la zona en la que empieza viviendo, porque a
   los 13 vive con su familia y esa casa está en algún lado.
7. Un peldaño en `datos/progreso.js` que abra el mapa. Ahora que el juego se
   descubre por ruta, meter una pestaña de zonas desde el minuto cero volvería a
   la parálisis que la ruta vino a resolver.

---

## 2. Investigaciones sin terminar

Tres búsquedas quedaron corriendo y no llegaron a tiempo. Todas venían con el
método que ya funciona documentado en el anexo F: `ine.gob.gt` **sí** responde con
`curl --ssl-no-revoke`, y las descargas de `/wp-content/uploads/*` pasan aunque el
HTML dé CAPTCHA.

- **Geografía y transporte de la capital** (la que necesita el mapa, ver arriba).
- **Costos de salud y gasto personal**: consulta médica privada, medicamentos,
  gasto de bolsillo en salud, pasaje de bus, plan de celular, y tasa de robo a
  personas. Alimentaría `costoEnfermedad` (Q450) y el gasto `personal`
  (Q1,100-1,300), que siguen siendo estimaciones.
- **Negocio propio y vida del migrante**: capital para abrir una tienda de barrio
  (el juego pide Q8,000 sin fuente) y costo de vida de un guatemalteco recién
  llegado a Estados Unidos (el juego usa US$1,350 sin fuente).

---

## 3. Dos decisiones de diseño que son tuyas

Las dejé documentadas y sin tocar porque cambian la lección del juego, no solo un
número.

**Financiamiento del viaje migratorio.** El juego exige tener los Q125,000
líquidos para poder irse, pero la encuesta de la OIM dice que solo el 26.9 % usa
ahorros propios: el 17.6 % se endeuda con un prestamista al 5 % mensual y **uno de
cada cinco entrega las escrituras de su casa o su terreno**. Modelarlo cambiaría el
módulo de *ahorra y luego vete* a *te vas debiendo, y los primeros tres años de
remesas son para el coyote*, que es lo que de verdad pasa. Detalle en el anexo E.6.

**Empleos formales por debajo del salario mínimo.** Varios empleos que el jugador
puede tomar como formales pagan menos que el mínimo de 2026 (Q4,252.28):
dependiente de tienda Q3,000, repartidor Q2,800, construcción Q2,600. Es fiel a lo
que gana la gente pero legalmente imposible. Subirlos cambiaría todo el balance.
Detalle en el anexo F.6.

---

## 4. Cifras que siguen sin fuente

Están todas comentadas y editables sin programar. La sección 18 del documento de
diseño las lista; estas son las que quedan:

| Cifra | Valor | Dónde |
|---|---|---|
| Efectivo inicial de un chico de 13 | Q60 a Q200 | `origenes.js` |
| Mesada mensual según el origen | Q0 a Q120 | `origenes.js` |
| Gasto personal de un menor de edad | Q20 al mes | `config.js` |
| Costo de enfermarse | Q450 | `config.js` |
| Gasto personal mensual | Q1,100 a Q1,300 | `config.js` |
| Aporte y gastos en casa familiar | Q400 y Q700 | `config.js` |
| Colegiatura privada de básicos y diversificado | Q5,000 a Q10,000 al año | `carreras.js` |
| Pago por jornada de los trabajitos de niño | Q4 a Q6 | `trabajos.js` |
| Mínimo de apertura para menores | Q25 y Q50 | `config.js` |
| Fuga de efectivo y riesgo de perderlo | 8 % mensual, 2 % | `config.js` |
| Capital para abrir tienda | Q8,000 | `trabajos.js` |
| Costo de vida en Estados Unidos | US$1,350 | `migracion.js` |
| Maestría en la universidad pública | Q20,000 al año | `carreras.js` |
| Penalización por retiro anticipado de la pensión | 25 % | `largoplazo.js` |

Las dos últimas ya se buscaron y **no se encontró nada publicado**. Las demás no se
han buscado todavía.

---

## 5. Deuda técnica menor

- **Los minijuegos valen el doble que antes en términos relativos.** Un
  minijuego cuesta una jornada, o sea el 15 % del sueldo del mes en vez del
  30 % que costaba una semana entera. La invariante que `minijuegos-valen.js`
  protege sigue cumpliéndose, pero por poco: al gerente el mejor minijuego le
  paga Q1,600 contra los Q1,800 que le cuesta la jornada. **Es la comprobación
  que va a fallar primero** si algún día se sube un pago o se baja un sueldo
  alto, y va a estar diciendo la verdad. Vale la pena revisar los ocho pagos
  con calma en algún momento.
- **El texto del resultado de un evento o una decisión lo arma el motor en
  español.** `aplicarDecision()` devuelve una frase construida ahí mismo
  ("Perdiste Q120.", "Quedaste debiendo Q690."), así que en la versión inglesa
  esa línea sale en español. Es de antes de este cambio y aplica igual a los
  eventos con opciones. Arreglarlo bien es separar el texto base de los añadidos
  y traducir cada parte por clave; se puede hacer sin tocar los datos.
- **Un chico que trabaja las cuatro tardes y estudia las cuatro mañanas se
  queda sin energía.** Cuatro jornadas de estudio y cuatro de trabajo son -44
  al mes y no hay de dónde recuperar. Es una tensión legítima —hay que descansar
  alguna tarde— pero conviene medir si el margen es demasiado estrecho para el
  origen que no recibe mesada.

- **Los textos de la ruta y de las decisiones se traducen por clave, no por
  `T()`.** Igual que los
  nombres de los productos: viven en `datos/progreso.js` y el diccionario los
  cubre en los grupos `progreso_titulo`, `progreso_texto`, `progreso_leccion` y
  `progreso_pista`. `pruebas/ruta.js` comprueba que ningún peldaño se quede sin
  traducir, y `pruebas/decisiones.js` hace lo mismo con las tarjetas, así que
  esto ya está vigilado. Lo que sigue sin vigilar es cualquier **otro** texto
  que se pase a `T()` por variable: el extractor solo ve `T('literal')`. En este
  cambio eso ya mordió una vez, con `T(abierto ? 'Ocultar' : 'Ver')`, que el
  extractor no ve; la forma correcta es
  `abierto ? T('Ocultar') : T('Ver')`, y el mismo cuidado aplica a `Ico()`.
- **El imperio infló el patrimonio final, y mucho más que las mejoras.** Antes
  de todo esto, una vida atenta terminaba con Q1.6 millones. Con las mejoras
  subió a Q3.0. Con negocios y planilla, una vida jugada BIEN —escalera
  educativa completa, ocho negocios, la gente que se puede administrar— llega a
  **Q36 millones**. La comparación entre rutas educativas sigue midiéndose
  limpia en `vidas-completas.js`, que no abre negocios, y los dos órdenes que
  importan los protege `imperio.js`. Pero conviene decirlo claro: **ahora hay
  tres economías** —la de quien solo tiene sueldo, la de quien invierte en sí
  mismo y la de quien tiene gente trabajando— y la tercera está un orden de
  magnitud arriba.

  Dos avisos sobre esa cifra. Uno: es el óptimo jugado con calculadora, no lo
  que va a sacar un chico de trece. Dos: **nadie ha revisado si el reporte de
  jubilación y sus lecciones se leen bien con siete cifras en pantalla.** Eso sí
  hay que mirarlo.
- **El freno de arriba del imperio son los techos, y nada más.** La quiebra solo
  cae cuando al negocio le falta colchón, así que un jugador rico nunca quiebra
  —lo cual es correcto— y eso deja el crecimiento sin techo salvo por
  `TECHO_NEGOCIOS` y `TECHO_EMPLEADOS`. Si algún día Q36 millones parece
  demasiado, el sitio donde bajarlo es esa tabla, no el riesgo de quiebra.
- **`transporte` estuvo mal tarifado y nadie lo habría comprado nunca.** Con
  +Q9 por jornada y Q60 de mantenimiento dejaba Q12 limpios al mes sobre una
  inversión de Q3,200: 267 meses de retorno. Se vio porque la propia pantalla
  muestra ese número. Vale la pena revisar los otros once con la misma cuenta de
  vez en cuando.
- **La comprobación de claves huérfanas del diccionario estuvo un rato sin
  medir nada**, porque el barrido incluía los propios archivos de traducción y
  así toda clave aparecía "usada". Al arreglarla salieron **54 claves muertas**,
  que ya se borraron. Al borrarlas se llevó por delante dos que sí se usaban
  (`Formal` e `Informal`, que compartían línea con una muerta) y las atrapó la
  siguiente corrida: si se vuelve a hacer una limpieza así, correr la suite
  bilingüe justo después.
- **El protagonista no envejece y es siempre el mismo chico.** El juego va de los
  13 a los 65 y las 23 ilustraciones son de un adolescente. Es una decisión que
  las imágenes tomaron por el juego y no al revés: el muñeco dibujado era
  genérico a propósito, sin edad y sin sexo marcado. Si importa —y en el reporte
  de jubilación se nota— hacen falta al menos dos edades más por estado.
- **La paleta de las ilustraciones es más saturada que la de la interfaz.** Se ve
  al ponerlas al lado de una tarjeta: el dibujo tiene amarillos y naranjas que la
  interfaz no usa. No molesta, pero si algún día se regeneran, conviene acercarlas.
- **Los nueve tipos de negocio tienen sus cuatro locales, pero no hay más que
  nueve tipos.** Con maestría el jugador puede llevar ocho negocios y veinte
  personas, y se le acaba el catálogo. Están propuestos con números en
  `RECURSOS_TYCOON.md` §7, y esa parte no es solo dibujar: cambia el balance y
  hay que volver a correr `node pruebas/imperio.js`.
- **`herramientas/preparar-imagenes.py` es lo único del proyecto que pide Python**
  (Pillow y numpy). No hace falta para jugar ni para programar, igual que
  `traer-librerias.js` no hace falta salvo para regenerar `vendor/`. Si algún día
  molesta tener dos lenguajes de herramientas, el trabajo que hace no se puede
  hacer con Node sin instalar una librería de imágenes, que es exactamente lo que
  se está evitando.
- **La suite completa ya tarda más de dos minutos**, por las corridas de 21
  semillas del balanceo, la escalera educativa y la salida del modo difícil, más
  las tres vidas completas de `imperio.js`. Si molesta, se puede bajar a 11
  semillas sin perder mucha señal.
- **Una estrategia de prueba puede estar midiendo su propio error.** Las cuatro
  razones por las que el imperio "empobrecía" al jugador están contadas en §24.4
  del documento de diseño, y tres de las cuatro estaban en la estrategia de la
  prueba y no en el juego. La lección para la próxima vez: cuando una medida
  sale al revés de lo esperado, **antes** de tocar los datos hay que correr
  `TRAZA=1 node pruebas/imperio.js` y cuadrar la caja. Sin esa traza las tres se
  veían igual: un número final más bajo de lo que debía.
- **`proyeccionDeNegocio()` mide las jornadas que el negocio tiene puestas AHORA.**
  Eso es lo correcto para la pantalla, que se dibuja después de repartir el mes,
  y es una trampa para cualquier código que decida algo antes de repartir: ahí
  todos los negocios se ven con cero jornadas. Si hace falta comparar negocios
  fuera de la pantalla, hay que pasarle las jornadas a mano (el segundo
  argumento) o medir con una cuenta hipotética, como hace `netoEsperado()` en la
  prueba.
- **El techo de negocios con primaria es 2 y no 1 por una razón concreta:** con
  1 el jugador de trece se quedaba atrapado para siempre en el primer negocio que
  pudiera pagar. Si alguien lo baja a 1 "para que estudiar valga más", va a
  reintroducir esa trampa y ninguna suite se lo va a decir con esas palabras: lo
  que verá es que la vida con negocios rinde menos que la vida sin ellos.
- **El CSS usa `color-mix` sin respaldo automático.** Cada tono de relieve
  declara primero un hexadecimal fijo y luego el `color-mix`, así que un
  navegador viejo se queda con el hexadecimal. El detalle incómodo: si alguien
  cambia una variable de la paleta, esos respaldos no la siguen. Están todos
  juntos al principio de `css/estilo.css` y comentados.
- **`requiere` es un filo peligroso en `datos/progreso.js`.** Encadenar un
  peldaño que abre algo esconde ese contenido para siempre si el jugador hace
  las cosas en otro orden. La regla está escrita en el archivo y vigilada por
  `pruebas/ruta.js`, pero es el tipo de cosa que alguien va a querer usar de
  nuevo para forzar un orden. La respuesta correcta casi siempre es dejar la
  condición sola y confiar en que el orden salga de la práctica.
- **La lista de scripts está en tres archivos** (`index.html`,
  `pruebas/comun.js` y `pruebas/vista.html`). No se unificó porque cada uno la
  necesita en un formato distinto; en su lugar `pruebas/ruta.js` comprueba que
  las tres digan lo mismo. Ya atrapó una vez que faltaba un archivo.

---

## 6. Lo que te toca a ti y no puedo hacer yo

Los tres pasos de GitHub, escritos en el `README.md`: crear el repositorio vacío,
conectar el remoto y hacer push, y activar Pages sobre `main` en la raíz. No está
instalada la herramienta de línea de comandos de GitHub en esta máquina.
