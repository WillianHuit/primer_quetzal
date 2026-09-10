# Mi Primer Quetzal

Simulador de vida financiera para aprender a usar productos bancarios. El jugador toma a
un chico de **13 años que acaba de salir de primaria** y lo acompaña hasta la jubilación a
los 65. Empieza ahí a propósito: la primera decisión del juego es la que de verdad decide
todo lo demás, y es si va a seguir estudiando.

Español e inglés, para celular, sin instalar nada.

Banco ficticio: **Banco Cardamomo**. País: Guatemala. Moneda: Quetzal.

## Jugarlo

Abre `index.html` con doble clic. No necesita servidor, ni npm, ni conexión.

## Publicarlo en GitHub Pages

El repositorio ya está iniciado y con el primer commit hecho, en la rama `main`. Faltan
tres pasos que hay que hacer desde el navegador porque en esta máquina no está instalada
la herramienta de línea de comandos de GitHub.

1. En `github.com/new`, crea un repositorio **vacío** llamado `mi-primer-quetzal`. No
   marques nada de README, licencia ni `.gitignore`: el repositorio local ya los tiene.
2. Desde esta carpeta, conecta y sube:

   ```
   git remote add origin https://github.com/TU-USUARIO/mi-primer-quetzal.git
   git push -u origin main
   ```

3. En el repositorio, entra a **Settings** y luego a **Pages**. En *Source* elige
   **Deploy from a branch**, en *Branch* elige `main` y la carpeta `/ (root)`, y guarda.

En un par de minutos queda en `https://TU-USUARIO.github.io/mi-primer-quetzal/`. No hay
paso de compilación: GitHub sirve los archivos tal cual.

`node_modules` está en el `.gitignore`, así que no se sube. El juego no lo necesita.

## Qué incluye

Empiezas eligiendo de dónde sales (familia con recursos, familia que te manda remesas, o
familia que depende de ti) y en qué Guatemala te toca vivir (empleo formal o economía
informal). De ahí en adelante:

- **Se elige un nivel, no un formulario**: fácil, medio o difícil, con su color. Cada uno
  empareja una familia de origen con una economía. Quien quiera la combinación exacta la
  sigue teniendo en "prefiero elegir yo".
- **La primera pantalla del juego es una decisión**: a los 13, con la primaria terminada,
  estudias básicos o te pones a trabajar. El juego no juzga ninguna de las dos, te muestra
  todas las opciones de estudio que tienes, y la pregunta vuelve cada vez que te graduas.
- **Un imperio, con su calle dibujada**: el jugador **abre negocios** —un puesto de
  dulces, un lavado de carros, una tortillería, un taller, una distribuidora— les sube el
  nivel y **contrata gente**, y cada negocio abierto aparece como un local en su calle, con
  su gente parada enfrente. La calle **se alarga** conforme el imperio crece: con un negocio
  cabe en la pantalla, con cinco hay que arrastrar. Con monedas que suben de los locales que
  produjeron y una gráfica de lo que han dejado, mes por mes.

  Y sigue siendo educación financiera, sin trampa. Un negocio se lee con **dos** números y
  no con uno: lo que vende y lo que le queda. La tortillería vende casi el doble que el
  lavado de carros y gana menos. Y contratar enseña la cifra que más negocios hunde: una
  persona con contrato cuesta **el sueldo por 1.42 más Q250**, no el sueldo.

  Lo que frena al imperio son cuatro cosas reales: cuántos negocios puedes llevar a la vez,
  cuánta gente puedes administrar —las dos suben cuando terminas de estudiar, y se ven en su
  barra arriba de la pantalla—, qué negocios te piden colegio terminado, y que un negocio al
  que no le pones ni una jornada rinde un 30% menos. Además puede quebrar, y se evita
  guardando tres meses de sus propios costos.

- **Tres cadenas de mejoras para ti**: tus herramientas, tu estudio y tu descanso. Cada una
  dice **en cuántos meses se paga sola**, que es el único cálculo que hay que hacer antes de
  comprar una herramienta.
- **Una ruta que se va abriendo.** El juego no arranca con todo encima: al empezar solo
  existe el estudio. El trabajo aparece cuando contestas esa primera pregunta, el banco
  cuando tienes de dónde entre dinero, la cuenta de ahorro cuando abres la monetaria, el
  crédito a los 18, y así dieciocho peldaños. Cada uno explica al abrirse qué es y por qué
  importa. El tutorial no es una pantalla aparte: son los primeros once peldaños de esa
  misma ruta.
- **Un tutorial de once pasos**, un toque cada uno, que oscurece el resto de la pantalla
  y pone una flecha sobre lo que hay que tocar. Avanza según lo que ya hiciste, no con un
  botón de siguiente. Se sale de él en un toque, con un enlace chiquito que no compite con
  el paso.
- **El mes es un tablero**: treinta o treinta y un días, los del calendario, y un dado para
  recorrerlos. Cada casilla ofrece algo —una tarea, un día de trabajo, un descanso, un día
  que se te atraviesa, un comodín con dos puertas— y lo tomas o lo dejas pasar. El mes se
  cierra cuando el dado llega al último día, no cuando aprietas un botón.
- **Un anillo cuadrado, como el de mesa**: el camino por el borde, la casilla de SALIDA y
  la ficha que **camina casilla por casilla**, con su brinco y su sonido.
- **Visto desde la silla**: la cámara va baja y cerca —52 grados—, así que los días que
  tienes enfrente son grandes y los del otro lado se ven pequeños y al fondo. Cada día es
  una **tarjeta** —franja con el nombre arriba, la casita parada en medio, el número y lo
  que cuesta abajo— impresa mirando a su lado del tablero, como en el de mesa.
- **La cámara sigue al personaje**: tiras el dado con el mes entero a la vista, la cámara
  baja hasta la ficha, **el tablero gira** para poner el lado por el que va de frente —así
  su tarjeta se lee derecha—, la ficha camina casilla por casilla con una nota por paso, y
  al llegar hay un **respiro** antes de que se abra la tarjeta.
- **Y suena**: el dado al caer, una nota por paso —cada una un semitono más alta— y al
  llegar, alegre si le tocó algo bueno y triste si le tocó algo malo. Todo con osciladores
  del navegador: cero archivos. El interruptor está en el tablero, al lado del dado.
- **El barrio, en el centro**: en un tablero de mesa el centro son las cartas; aquí son las
  casas donde vive el personaje, en tres dimensiones. Se empieza en el barrio que le tocó
  —la dificultad que elegiste— y sube con lo que junta: del asentamiento de lámina a la
  colonia, a la residencial y a la zona de edificios. Es la única pantalla que dice cuánto
  tienes sin escribir un número.
- **En 3D, y sin descargar nada**: perspectiva, cajas con techo, frente y costado, y un dado
  que es un cubo de seis caras y rueda hasta la que salió. Todo con transformaciones 3D del
  navegador: cero librerías.
- **Energía que se acaba**: una tarea cuesta seis veces lo que cuesta trabajar, y un mes no
  puede dejarte por debajo de cero. Lo que no cabe no se puede aceptar, y se dice por qué.
- **Ocho jornadas de contabilidad**: cuatro semanas de mañana y tarde. Los colegios de Guatemala
  son de jornada, así que el chico que estudia por la mañana puede trabajar por la tarde, y
  esa es la decisión central del juego. En básicos el colegio te toma una jornada de cada
  semana y **no se puede vaciar**; en el diversificado eliges mañana o tarde al
  inscribirte; en la universidad reparte como quieras. Después de los 22 los turnos pasan a
  trimestres y luego a años, para llegar a los 65.
- **Dieciséis empleos**, empezando por tres trabajitos de niño que pagan cuatro o seis
  quetzales por jornada (vender limonada, periódico o dulces). Los de adulto piden edad y
  nivel educativo, y lo que te falta para cada uno se ve en una línea.
- **Un personaje que se viste de lo que hace**: casco en la construcción, audífonos en el
  call center, mochila mientras estudia, jarra si vende limonada.
- **Tarjetas de decisión**: doce dilemas sin respuesta obvia, con dos o tres botones del
  mismo tamaño y ninguno marcado como correcto. La lección no la explica un párrafo: la
  explica la consecuencia que llega tres meses después.
- **Veinticuatro carreras**: básicos, diecinueve diversificados repartidos en siete
  ramas —tecnología, salud, comercio, arte, industrial, agro y magisterio—, técnico, dos
  licenciaturas y maestría. Al terminar básicos la pantalla ordena las ramas por la
  **nota** que sacaste en las tareas de cada una, y debajo están todas las demás.
- **Productos bancarios**: cuenta monetaria, ahorro, depósito a plazo, préstamo personal,
  tarjeta de crédito, hipoteca y plan de pensiones. Y el prestamista del barrio.
- **Historial de crédito** con puntaje visible, fiador y garantía.
- **Remesas** por los dos lados: las recibes de joven, y si migras eres quien las manda.
- **Veintiún minijuegos**: los de oficio, las tareas de básicos y una tarea por cada
  rama del diversificado, que en básicos hacen de sondeo vocacional. Cada turno el
  colegio deja unas cuantas al azar: no eliges cuál te toca.
- **Noticias**: el mercado laboral que dice qué carrera está pidiendo el país, las
  promociones del banco vigentes con su letra chica, y la bitácora de lo que ha pasado.
- **Una pantalla de "Yo"** con el patrimonio, el historial de crédito y el nivel
  educativo, aparte de la pestaña del banco: lo que el jugador *es* no se mezcla con lo
  que el jugador *contrata*. Se abre tocando el muñeco de la barra de arriba.
- **Reportes** anuales y de jubilación, glosario, tres ranuras de partida y código
  exportable.

Y el día que cumples 18 se te cae encima el gasto completo de la casa, con su propia
ventana comparando lo que gastabas antes y lo que gastas ahora. Ese salto le pasa a todo
el mundo y a casi nadie le avisan.

## Cambiar los números sin programar

Todos los valores editables viven en `datos/`. Cambia el número, guarda y recarga.

| Archivo | Qué controla |
|---|---|
| `config.js` | Economía general, gastos, energía, tasas, remesas, compresión del tiempo |
| `trabajos.js` | Los dieciséis empleos, sus salarios y a qué edad te contratan |
| `carreras.js` | Rutas de estudio, duración, costos, horario y demanda del mercado |
| `decisiones.js` | Las tarjetas de decisión: qué dilema, qué opciones y qué consecuencia |
| `mejoras.js` | Las cadenas de mejoras: qué cuesta cada escalón y qué da |
| `creditos.js` | Préstamo, tarjeta, prestamista informal, puntaje y fiador |
| `largoplazo.js` | Casas, hipoteca y plan de pensiones |
| `origenes.js` | Los tres puntos de partida del personaje |
| `migracion.js` | Costo del viaje, empleos allá, canales de envío y comisiones |
| `eventos.js` | Eventos de vida y promociones del banco |
| `glosario.js` | Los términos que explica el juego |
| `progreso.js` | La ruta que se va abriendo: qué desbloquea cada peldaño y cuándo |
| `textos.en.js` y `textos.en.v2.js` | La traducción al inglés |

Las cifras marcadas `ESTIMACION` en los comentarios necesitan validación. Las demás vienen
de fuente verificada y están documentadas en `docs/investigacion-economia-guatemala.md`.

## Probarlo

Las pruebas corren sin navegador con Node y son deterministas.

```
node pruebas/todas.js          # las trece suites
```

O una por una:

```
node pruebas/balanceo.js           # cinco estrategias a 24 meses
node pruebas/vidas-completas.js    # cuatro vidas hasta la jubilación
node pruebas/ciclo-credito.js      # fiador, garantía, puntaje, mora, tarjeta
node pruebas/largo-plazo.js        # hipoteca, pensión, orígenes y migración
node pruebas/minijuegos-valen.js   # que el trabajo extra compense la jornada que cuesta
node pruebas/ruta.js               # que ningún peldaño quede inalcanzable
node pruebas/decisiones.js         # las tarjetas de decisión y su enfriamiento
node pruebas/mejoras.js            # que el tycoon no se coma el mensaje del estudio
node pruebas/iconos.js             # que todo icono pedido exista y no vuelva un emoji
node pruebas/interfaz-bilingue.js  # las seis pestañas en ambos idiomas
node pruebas/dom-real.js           # una partida de verdad en un navegador simulado
```

`ruta.js` es el que hay que mirar al tocar `datos/progreso.js`. Lo importante que hace es
jugar una vida entera y comprobar que la ruta se abrió completa: un peldaño con una
condición que nunca se cumple le quita al jugador esa parte del juego **para siempre**, sin
error ni aviso. Ya atrapó dos condiciones así.

`iconos.js` vigila el juego de iconos por los dos lados: que todo nombre pedido tenga
dibujo y que todo dibujo se use. Un nombre mal escrito no lanza ningún error, solo deja un
hueco en la pantalla. Vigila también al personaje: que cada empleo tenga uniforme y que
ningún uniforme pida una pieza que no existe.

`imperio.js` es el que hay que mirar al tocar los números de un negocio, de la planilla o
de los techos. Lo que de verdad comprueba son dos órdenes, corriendo tres vidas completas de
los 13 a los 65 sobre once semillas:

| Ruta | Patrimonio mediano a los 65 |
|---|---|
| Sin estudiar y sin negocios | Q1.5 millones |
| Sin estudiar, con negocios | Q7.1 millones |
| Escalera completa y negocios | Q36.0 millones |

**Estudiar tiene que seguir rindiendo más** (5 a 1) y **montar negocios tiene que cambiarle
la vida a quien no estudió** (4.7 veces). Si alguno de los dos se invierte, la suite falla.
Lo que sostiene el primero son los dos techos —cuántos negocios y cuánta gente puedes
llevar— que suben con el estudio.

Si algún día esos números salen raros, corre `TRAZA=1 node pruebas/imperio.js`: imprime de
dónde salió y a dónde se fue cada quetzal de una vida completa. Es lo que encontró las cuatro
razones distintas por las que el imperio empobrecía al jugador (§24.4 del documento de
diseño), y sin eso las tres primeras eran indistinguibles entre sí.

`decisiones.js` es el que hay que mirar al escribir una tarjeta nueva. Una tarjeta mal
escrita no lanza ningún error: una opción que no hace nada se ve igual que una que sí, y
una ventana de edad al revés hace que nunca salga. Comprueba además que los efectos de
verdad ocurran (que la bicicleta se cobre y luego se pague sola por jornada) y que entre
tarjeta y tarjeta pasen los meses que dice `MESES_ENTRE_DECISIONES`.

Las suites de balanceo y de crédito arrancan al personaje ya adulto con el ayudante
`adulto()` de `pruebas/comun.js`: miden vida laboral, y jugar cinco años de colegio antes
de llegar ahí no mide nada y además tapa lo que se quiere medir. Las de la ruta y del DOM
real **no** lo usan, porque existen justamente para comprobar que la niñez funciona.

`balanceo.js` es el que hay que mirar al tocar la economía a corto plazo: compara estrategias
a 24 meses y deja ver si algún incentivo quedó al revés. Ya atrapó tres veces que quemarse
rendía más que cuidarse.

`vidas-completas.js` es el que hay que mirar al tocar los costos de estudio o los sueldos.
Además de jugar cuatro vidas hasta los 65, corre cinco rutas educativas sobre veintiuna
semillas —desde no estudiar nunca hasta la maestría, pasando por la escalera completa— y
compara la mediana del patrimonio final. Hoy da esto:

| Ruta | Patrimonio mediano a los 65 |
|---|---|
| No estudiar nunca | Q135,000 |
| Terminar el diversificado | Q578,000 |
| Carrera técnica | Q685,000 |
| Licenciatura | Q942,000 |
| Maestría | Q1,630,000 |

Si algún escalón se invirtiera, la suite falla y dice cuál. Todas las corridas usan azar
con semilla, así que dan el mismo resultado siempre.

`dom-real.js` es la única que necesita `npm install`, porque usa jsdom para cargar el
`index.html` real y tocar botones de verdad: abre ventanas, llena campos, cambia de idioma
y juega un minijuego esperando sus temporizadores. Si jsdom no está instalado, esa suite se
salta sola y las otras nueve siguen corriendo. Dentro de ella, el bloque que más vale es
el que juega el tutorial completo **tocando solo lo que la cinta señala**: si un paso
apunta a algo que no está en pantalla, o a algo que al tocarlo no hace nada, el bucle se
atasca y la prueba dice en qué paso. Ya atrapó cuatro veces un tutorial roto.

**Nada que instalar, nada que descargar, sin internet.** `vendor/` trae dentro del
repositorio las dos librerías que el juego usa —los iconos de **Lucide** recortados y
**Chart.js**— como archivos normales que se cargan con `<script src>`, y `assets/juego/`
trae las 73 ilustraciones ya optimizadas. Quien juega no descarga nada y el doble clic
sigue funcionando sin conexión.

Las ilustraciones tienen dos carpetas y la diferencia importa: `assets/visuales/` son los
**maestros** tal como se entregaron (125 MB, a 1024×1536, 1254×1254 y 768×768) y el
navegador **no los carga nunca**; `assets/juego/` son las copias WebP al tamaño en que se
ven, y pesan **1.1 MB entre todas**. `herramientas/preparar-imagenes.py` escribe la segunda a partir de la
primera. Los detalles están en `RECURSOS_VISUALES.md`.

Si algún día hay que actualizarlas o agregar un icono, `herramientas/traer-librerias.js`
las vuelve a generar (`npm install --no-save lucide-static chart.js` y correr el script).
No hace falta para jugar ni para programar: `vendor/` ya está en el repositorio.

El `package.json` solo declara jsdom, y solo para la prueba de DOM real.

`pruebas/comun.js` carga el juego en un entorno aislado con un DOM mínimo. Si agregas un
archivo al juego, agrégalo a **las tres** listas: `index.html`, la lista `ARCHIVOS` de
`pruebas/comun.js` y la de `pruebas/vista.html`. Olvidar una deja la pantalla en blanco con
un error en la consola, así que `ruta.js` comprueba que las tres digan lo mismo.

### Verlo con los ojos

Las pruebas confirman que el HTML sale completo, pero no calculan estilos ni corren
animaciones: nunca van a decir si un botón se ve bien. Para eso está `pruebas/vista.html`,
que abre el juego de verdad con una partida ya empezada.

```
pruebas/vista.html?p=banco          la pestaña que quieras ver
pruebas/vista.html?p=banco&sub=credito  un apartado dentro de una pestaña partida
pruebas/vista.html?nueva=1          el arranque, con la ruta cerrada y el tutorial
pruebas/vista.html?nueva=1&guia=6   el tutorial después de seis toques guiados
pruebas/vista.html?nino=1&p=casa    el mes de un chico de 13 que estudia y trabaja
pruebas/vista.html?perfil=1         la pantalla de "Yo", con el personaje en grande
pruebas/vista.html?decision=feria   una tarjeta de decisión, por su id
pruebas/vista.html?fin=1            el resumen del mes con sus gráficas
pruebas/vista.html?mj=presupuesto   un minijuego abierto
```

## Agregar cosas

- **Un minijuego**: crea un archivo en `js/minijuegos/`, llama a `Minijuegos.registrar()` y
  súmalo a `index.html`. Si pones `requiereCarrera`, solo se abre al graduarse de esa
  carrera.
- **Un idioma**: escribe un diccionario nuevo como `textos.en.js`. La clave de cada texto
  es la frase en español, así que una traducción incompleta nunca rompe el juego.
- **Una ilustración**: pon el PNG maestro en `assets/visuales/`, agrega su nombre a
  `js/arte.js` y corre `python herramientas/preparar-imagenes.py`. Eso escribe la copia
  WebP al tamaño en que se ve. Mientras no exista, el juego **dibuja** esa pieza en vez de
  dejar un hueco, así que no urge.
- **Un icono**: agrega una línea a `TRAZOS` en `js/iconos.js` con el interior del SVG sobre
  una cuadrícula de 24×24, sin relleno. Se usa con `Ico('nombre')` o poniendo el nombre en
  el campo `icono` de un dato. No hay librería externa: son setenta y ocho dibujos propios
  de trazo que toman el color del texto, así que el mismo icono sirve blanco en la barra
  verde y rojo en un botón de peligro.
- **Un uniforme para el personaje**: agrega una entrada a `ROPA` en `js/personaje.js` con
  el id del empleo y hasta cuatro piezas (color de playera, algo en la cabeza, algo encima
  y algo en la mano). Un empleo sin entrada sale en ropa de calle.
- **Un negocio**: copia un bloque de `TIPOS_NEGOCIO` en `datos/negocios.js` y cambia lo
  que cuesta abrirlo, lo que vende una jornada adentro, su margen, su renta y cuánta gente
  cabe. **No hay que dibujar nada**: los nueve tipos que ya existen tienen sus cuatro
  locales ilustrados, y uno nuevo sale con el local genérico y un sello con el icono que le
  pongas, hasta que alguien lo ilustre. Si luego se ilustra, van cuatro PNG a
  `assets/visuales/negocio/<id>/n1..n4.png`, el `<id>` a `TIPOS_CON_LOCAL` en `js/arte.js`
  y una pasada de `preparar-imagenes.py`; el sello desaparece solo. El número que de verdad hay que pensar es `ventaPorJornada × 8 × margen −
  costoMensual`, que es lo que deja al mes con una sola persona adentro, y la pantalla lo
  imprime.
- **Una pieza al escenario**: agrega una función a la lista de su cadena en `js/escena.js`.
  Lo único que hay que respetar es el reparto de zonas del eje horizontal que está
  documentado ahí arriba: la primera versión no lo tenía y el rótulo del oficio le quedó
  cruzado en la cara al personaje. Si agregas un nivel a una cadena de `mejoras.js`, o un
  nivel de negocio, y no dibujas su pieza, `pruebas/iconos.js` falla: el jugador compraría
  el nivel y la pantalla se vería igual.
- **Una tarjeta de decisión**: agrega un bloque a `DECISIONES` en `datos/decisiones.js`.
  La regla al escribirla es que la opción de no hacer nada tenga que ser defendible: si una
  de las dos es obviamente la buena, no es una decisión, es un peaje.
- **Una mejora**: agrega un bloque a `MEJORAS` en `datos/mejoras.js` con su cadena, su
  costo y su efecto. El número que importa es el costo dividido entre lo que da al mes:
  debajo de seis meses de retorno la mejora es obvia y no se decide nada, arriba de treinta
  no la compra nadie. El punto dulce anda entre ocho y quince.
- **Un nivel educativo o una carrera**: agrega un bloque a `CARRERAS` en `datos/carreras.js`
  con su `horario` (`fijo`, `jornada` o `libre`), y encadénalo con `requiere` y
  `nivelQueOtorga`. Si es un nivel nuevo, ponlo en orden en `NIVELES_EDUCATIVOS`
  (`datos/trabajos.js`), que es lo que el juego usa para saber quién califica para qué.
- **Un peldaño a la ruta**: agrega un bloque a `PROGRESO` en `datos/progreso.js` con qué
  abre, cuándo y qué dice. Si la condición depende de algo que el jugador puede no hacer
  nunca, ponle una segunda salida por tiempo o por edad: la ruta pacea el descubrimiento,
  no esconde contenido para siempre.

## Documentos

- `PENDIENTE.md` — lo que falta, con las decisiones ya tomadas y sin construir.
- `docs/diseno-mi-primer-quetzal.md` — el diseño completo y las decisiones tomadas.
- `docs/investigacion-economia-guatemala.md` — las 197 cifras que sostienen el juego.
