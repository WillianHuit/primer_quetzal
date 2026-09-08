# Los recursos que faltan para que sea un tycoon duro y puro

Escrito el 8 de septiembre de 2026, después de conectar las 37 primeras
ilustraciones. Este documento es un **encargo**: dice qué imágenes hacen falta,
con qué medidas, con qué nombre exacto y qué se desbloquea con cada una.

> **La prioridad 1 ya está entregada y conectada** (los 36 locales, el mismo día).
> Lo que sigue vivo es de la **prioridad 2 en adelante**. Lo que se aprendió al
> conectar P1 está al final de la §2 y cambia dos cosas del encargo: el
> cuadriculado horneado volvió a venir en la entrega, y las copias de local van
> a 192 px y no a 256.

`RECURSOS_VISUALES.md` cuenta lo que ya existe y cómo está conectado. Este
cuenta lo que falta. Los dos hay que leerlos: la §1 de aquí abajo son reglas que
salieron de romperse la cara con la primera entrega, y no cumplirlas cuesta un
día de trabajo por lote.

---

## 0. Qué es "duro y puro" aquí, y qué no se toca

Un tycoon duro es tres cosas: **ves crecer lo que tienes**, **cada cosa que
tienes se distingue de las demás**, y **la pantalla te contesta cuando tocas
algo**. Hoy el juego cumple la primera a medias y falla las otras dos.

Lo que **no** cambia por muchas imágenes que entren, y hay que tenerlo presente
al dibujar:

| Sigue siendo cierto | Consecuencia para las imágenes |
|---|---|
| El juego abre con doble clic, sin internet y sin instalar nada | todo va dentro del repositorio, y el peso importa (§1.7) |
| Es bilingüe, español e inglés | **ninguna imagen puede llevar texto, ni un número, ni un rótulo escrito** |
| Enseña educación financiera, no es un clicker | nada de "toca para ganar": las imágenes ilustran decisiones, no premios |
| Los colores salen de la paleta de `css/estilo.css` | verde `#1f7a5a`, menta `#e6f3ee`, tinta `#16211d`, ámbar `#b5811f`, azul `#2c5f8a`, rojo `#b8422e` |
| Es Guatemala, no un país genérico | tortillería, comedor, café internet, pollo, chicha, mototaxi, volcanes al fondo |

---

## 1. Reglas técnicas. Estas ocho no son opinables

Las ocho salieron de problemas reales de la primera entrega. Están contadas con
detalle en `RECURSOS_VISUALES.md` §4; aquí va lo que hay que hacer.

### 1.1 Transparencia de verdad, y **el cuadriculado no cuenta**

El generador de la primera entrega dejó **pintado y opaco** el patrón de cuadros
gris y blanco que los editores usan para *señalar* transparencia. La canasta
tenía el **5.6 % de su superficie** así, y el rótulo el 4.1 %.

Cómo comprobarlo antes de entregar, en un archivo cualquiera:

- la esquina superior izquierda tiene alfa **0**;
- **y también los huecos cerrados**: el interior del asa de una canasta, el
  espacio entre una cuerda y el letrero que cuelga de ella, el hueco del asa de
  una caja. Ahí es donde se cuela.

`herramientas/preparar-imagenes.py` lo detecta y lo quita, pero detectarlo cuesta
falsos positivos: la primera versión de ese limpiador **se comió los rayos de las
ruedas de la bicicleta**, porque son líneas finas blancas y grises sobre
transparente. Cada imagen que llegue con el patrón adentro es una imagen que
puede perder un detalle fino al limpiarse.

### 1.2 Un objeto por archivo. Nada compuesto

Ni dos niveles en la misma imagen, ni el personaje con su local, ni una fila de
tres empleados. El juego los coloca por separado y a escalas distintas.

### 1.3 El sujeto **apoyado abajo** del encuadre

Todo lo que sale en la escena se para en el suelo. Si el objeto va centrado en su
lienzo, un dibujo más ancho que alto —una carreta— se lleva la mitad del hueco
vacío debajo y en pantalla **flota sobre la plataforma**.

Deja como 2 % de margen abajo y el resto arriba.

### 1.4 Un juego de personas comparte encuadre

Las 23 ilustraciones del protagonista funcionan porque comparten línea de pies,
altura de cabeza y ancho de cuerpo. El canalizador recorta con una caja **común**
a todo el juego, así que **un archivo con encuadre distinto empuja a los 23**: si
uno viene con el personaje más chico y centrado, todos salen más chicos.

Vale para cualquier lote nuevo de personas: empleados, edades, encargados.

### 1.5 Sin sombra de contacto sobre un suelo que no existe

Una sombra elíptica horneada debajo del objeto se ve como una mancha gris cuando
el objeto se apoya en el suelo dibujado del juego. Si hay sombra, que sea suave y
**dentro** del contorno del objeto.

### 1.6 El nombre del archivo es el `id` del dato. Exacto

Sin acentos, sin espacios, sin mayúsculas. `tortilleria`, no `Tortillería`.
`cafeinternet`, no `cafe-internet`. Los nombres correctos están en la §2.

### 1.7 El peso: **maestros a 768 px, no a 1254**

Aquí hay una recomendación concreta que cambia mucho, y **P1 ya la confirmó**:
los 36 locales llegaron a 768 px, pesan 36 MB entre todos y se ven perfectos.
Frente a los 90 MB de los 37 primeros maestros, eso es la diferencia entre un
repositorio que se clona y uno que no. Con los dos lotes va en 125 MB; si el
resto del encargo llega a 1254 px, pasa de **300 MB**.

Y no hace falta. Las copias que el navegador carga son de 256 px, y de un maestro
de 768 px se sacan con holgura de sobra:

| Lote | Maestro entregado hoy | Maestro recomendado | Copia que usa el juego |
|---|---|---|---|
| Personas | 1024 × 1536 (~2.1 MB) | **640 × 960** (~0.8 MB) | 256 × 384 |
| Objetos | 1254 × 1254 (~3.0 MB) | **768 × 768** (~1.0 MB) | 256 × 256 o 192 × 192 |

Y el tope duro, que `pruebas/arte.js` comprueba: **ninguna copia puede pasar de
90 KB**, y las de todo el juego juntas no pueden pasar de 1.5 MB. Lo que come
peso son los detalles finos repetidos (los rayos de la bicicleta son el archivo
más gordo del lote actual, 16.6 KB frente a 8 KB de la cama). Superficies
grandes y planas pesan nada.

### 1.8 Cada archivo nuevo hay que declararlo en `js/arte.js`

Si no está declarado, el juego **dibuja** la pieza en SVG y la imagen no se ve
nunca. `pruebas/arte.js` falla si el disco y la declaración no coinciden, en los
dos sentidos.

---

## 2. Prioridad 1: los 36 locales. Nueve tipos × cuatro niveles

> **ENTREGADA Y CONECTADA el 8 de septiembre de 2026.** Se deja escrita entera
> porque es el modelo de cómo pedir y cómo entregar un lote, y porque los seis
> tipos de la §7 se piden exactamente igual. Lo que hubo que resolver al
> conectarla está al final de esta sección y en `RECURSOS_VISUALES.md` §6.1.

**Era el hueco más grande que tenía el juego.** Los nueve tipos de negocio
compartían las cuatro ilustraciones de local, así que **una tortillería y un
taller de motos se veían exactamente igual**, y sólo se distinguían por un sello
redondo de catorce píxeles en la esquina. En un tycoon, lo que tienes se
reconoce de un golpe de vista.

### Los nueve tipos, con lo que son

| `id` | Qué es | Plazas | Se abre a los | Pide colegio | Cuesta |
|---|---|---|---|---|---|
| `dulces` | Puesto de dulces: una caja de dulces al mayoreo y una esquina | 1 | 13 | — | Q450 |
| `refrescos` | Venta de refrescos: hielera, toldo y un lugar donde pase gente | 2 | 13 | — | Q2,500 |
| `lavado` | Lavado de carros: agua, jabón y dos mangueras | 3 | 15 | — | Q7,000 |
| `tortilleria` | Tortillería: maíz, comal y clientela diaria | 3 | 15 | — | Q12,000 |
| `papeleria` | Papelería: cuadernos, copias y útiles | 4 | 16 | básicos | Q30,000 |
| `comedor` | Comedor: almuerzo corrido para los que trabajan cerca | 5 | 18 | básicos | Q60,000 |
| `taller` | Taller de motos: herramienta, repuestos y manos que sepan | 5 | 18 | diversificado | Q120,000 |
| `cafeinternet` | Café internet: diez máquinas, impresora y buena señal | 4 | 18 | diversificado | Q90,000 |
| `distribuidora` | Distribuidora: bodega, camión y una ruta de tiendas | 8 | 21 | licenciatura | Q250,000 |

### Los cuatro niveles, y qué tiene que cambiar entre uno y otro

Los nombres son los que el juego ya usa. **El crecimiento tiene que leerse sin
texto**, y la referencia de que funciona es la primera entrega: canasta →
carreta → puesto → local se entiende sola.

| Nivel | Nombre en el juego | Qué gana el jugador | Qué tiene que verse |
|---|---|---|---|
| 1 | Recién abierto | nada, es el arranque | lo mínimo con lo que ese oficio se puede empezar: una caja, un cubo, una mesa plegable |
| 2 | Con equipo | vende 35 % más, cabe 1 persona más | herramienta propia, un mueble, un toldo. Se ve **surtido** |
| 3 | Con nombre | vende 75 % más, caben 2 más | un rótulo colgado (**sin texto**: madera, forma, un símbolo), toldo completo, mostrador |
| 4 | Con sucursal | vende 130 % más, caben 4 más | local con puerta y ventana, y **algo que diga que hay otro igual en otra parte**: un segundo cuerpo, una furgoneta de reparto, cajas de traslado |

### Nombres de archivo

```
assets/visuales/negocio/<id>/n1.png
assets/visuales/negocio/<id>/n2.png
assets/visuales/negocio/<id>/n3.png
assets/visuales/negocio/<id>/n4.png
```

36 archivos. Maestro **768 × 768**, transparente, sujeto apoyado abajo.

### Escala: el jugador mide 50 y el local grande 58

Esto es lo que más se nota si se dibuja mal. En la escena, un local ocupa un
cuadrado que **crece con el nivel**, y el protagonista mide 50 unidades:

| Nivel | Lado en unidades | ≈ píxeles en un teléfono de 520 px | Comparado con el jugador (50) |
|---|---|---|---|
| 1 | 32 | 62 | le llega a la cintura |
| 2 | 41 | 79 | al pecho |
| 3 | 50 | 96 | su misma altura |
| 4 | 58 | 112 | le pasa la cabeza |

Así que **el objeto del nivel 1 tiene que ser algo bajo** —una caja, un cubo, una
mesita— y el del nivel 4 algo que a esa altura se lea como local. Un puesto de
dulces de nivel 1 dibujado como una tienda de dos metros va a salir enano y sin
sentido.

### Y si 36 imágenes es demasiado

Hay una alternativa más barata que funciona, aunque menos bien: **cuatro cascos
genéricos + nueve juegos de tres piezas**. El casco es la estructura (caja,
mueble con toldo, puesto con rótulo, local con puerta) y las piezas son lo que
lo identifica: el color del toldo, el producto del mostrador y el símbolo del
rótulo. Serían 4 + 27 = 31 archivos y el resultado se ve más repetido.

**Recomendación: los 36 completos.** Para un generador de imágenes, 36 archivos
enteros son menos trabajo que 27 piezas que tienen que encajar al píxel con
cuatro cascos, y el resultado es incomparablemente mejor.

*(Se entregaron los 36 completos. Fue la decisión correcta: los nueve tipos se
distinguen de un golpe de vista y la progresión de mesa a edificio se lee sin una
palabra.)*

### Lo que hubo que resolver al conectarla, y qué cambia para el siguiente lote

Cuatro cosas. Las dos primeras son avisos para quien entregue P2 en adelante.

1. **El cuadriculado horneado volvió a venir.** Es la **regla 1** de la §1 de este
   documento y se ha incumplido las dos veces: el patrón de cuadros gris y blanco
   llegó pintado y OPACO dentro de los huecos cerrados —detrás del comal de la
   tortillería, bajo el toldo del lavado, tras los monitores del café internet—,
   y la tortillería con equipo traía el **7.7% de su superficie** así. El
   canalizador lo quita solo, así que no bloqueó nada, pero es media hora de
   comprobar que no se comió nada de dibujo por el camino. **La transparencia se
   guarda en el canal alfa, no se pinta.**

2. **Las copias de local van a 192 px, no a 256.** Está explicado en la §9. Si el
   lote nuevo trae objetos, ese es el tamaño de la copia.

3. **Cada local se recorta con SU caja, no con una común.** El margen vacío que
   traían debajo iba de 0 px (distribuidora con equipo) a 122 (lavado con
   sucursal). Los personajes van al contrario a propósito —el mismo chico no
   puede cambiar de tamaño al cambiar de trabajo— y **P3 y P4 son personas**, así
   que ahí sí hace falta el encuadre común de la regla 4.

4. **La calle se ensanchó y el nivel 4 subió de 48 a 58 unidades**, porque el
   detalle que traen los dibujos nuevos no se veía a 48. Eso mueve las medidas de
   la tabla de escala de esta sección: el hueco de cada negocio es ahora **56
   unidades** y no 46. **Importa para P2**: la tira de calle tiene que repetirse
   sin costura sobre un paso de 56, y con ocho negocios cubrir 580 unidades.

---

## 3. Prioridad 2: la calle tiene que parecer una calle

Hoy el suelo es un rectángulo redondeado dibujado a mano y el fondo es un
degradado. Con ocho negocios abiertos el escenario mide **580 unidades de ancho**
—hay que arrastrar para verlo— y sigue siendo un rectángulo verde claro.

`escena/plataforma.png` de la primera entrega **no se pudo usar**: es un óvalo
hecho para un objeto centrado, y estirarlo a 500 × 18 lo deja irreconocible.

### Lo que hace falta

| Archivo | Maestro | Qué es | Regla especial |
|---|---|---|---|
| `assets/visuales/escena/calle-centro.png` | **512 × 256** | el trozo de banqueta y calle que se repite | **tiene que repetirse sin costura**: el borde izquierdo y el derecho tienen que encajar consigo mismos |
| `assets/visuales/escena/calle-izq.png` | 256 × 256 | el remate de la izquierda | encaja con el borde izquierdo del centro |
| `assets/visuales/escena/calle-der.png` | 256 × 256 | el remate de la derecha | ídem |
| `assets/visuales/escena/fondo.png` | **2048 × 512** | el telón: cielo, y al fondo la silueta de una ciudad guatemalteca con volcanes | se estira, así que **sin nada que se note deformado**: nada de círculos ni caras |

### Mobiliario urbano: cuatro piezas que cambian todo

Se colocan en los huecos entre locales y hacen que la calle deje de ser una fila
de objetos sueltos. Maestro **768 × 768** cada una, apoyadas abajo.

| Archivo | Qué es |
|---|---|
| `escena/urbano/farol.png` | un poste de luz |
| `escena/urbano/arbol.png` | un árbol de banqueta |
| `escena/urbano/basura.png` | un bote de basura |
| `escena/urbano/parada.png` | una parada de bus con su techito |

**Lo que hace falta en el código:** hoy `suelo()` en `js/escena.js` dibuja el
rectángulo. Habría que cambiarlo por un `<pattern>` de SVG con la tira, y añadir
una capa de fondo detrás de todo. Es un cambio contenido, en un solo archivo.

---

## 4. Prioridad 3: la gente. Que se vea a quién le pagas

Ahora mismo, contratar a alguien hace aparecer **una silueta de nueve unidades**
sobre el suelo. Se lee, y no miente, pero en un tycoon la planilla es la mitad
del juego: el jugador paga Q5,248 al mes por una persona y merece verla.

La primera versión los dibujaba como muñequitos y hubo que quitarlos: se
quedaban cortados por el borde de la plataforma y parecían un par de ojos.

### Lo que hace falta

Personas **distintas del protagonista**, adultas, neutras, y **tres variantes de
cada** para que una calle con catorce empleados no parezca un ejército de
clones.

| Archivo | Maestro | Qué es |
|---|---|---|
| `assets/visuales/gente/informal-a.png` (y `-b`, `-c`) | 640 × 960 | tres personas en ropa de calle, de pie, trabajando |
| `assets/visuales/gente/formal-a.png` (y `-b`, `-c`) | 640 × 960 | las mismas tres con algo que las marque como contratadas: un mandil, una gorra, una playera de uniforme |

**Regla crítica:** son adultos, así que tienen que medir **lo mismo** que el
protagonista adulto y compartir su encuadre (§1.4). Un empleado media cabeza más
bajo se lee como un niño.

Y una séptima pieza, chica:

| Archivo | Maestro | Qué es |
|---|---|---|
| `gente/plaza-vacia.png` | 768 × 768 | un cartel de "se busca" apoyado, **sin texto**: una tablilla con la silueta de una persona |

Eso último es el que hace que el jugador vea que le sobra sitio en un negocio, y
hoy sólo lo sabe leyendo "2 de 6 plazas llenas".

**Lo que hace falta en el código:** `gente()` en `js/escena.js`, cambiar las
siluetas por hasta tres ilustraciones al mismo tamaño que el protagonista,
repartidas delante del local, con un `+N` cuando no caben.

---

## 5. Prioridad 4: el protagonista tiene que envejecer

El juego va **de los 13 a los 65**. Las 23 ilustraciones actuales son de un
adolescente o un chico de veintipocos, así que el jugador se jubila con la cara
que tenía en primero básico. Es la decisión que las imágenes tomaron por el
juego, porque el muñeco dibujado era genérico a propósito.

No hace falta un juego completo por edad —serían 92 archivos—. Con **trece** se
cubre lo que se nota:

| Archivo | Maestro | Cuándo se ve |
|---|---|---|
| `personaje/nino/base.png` | 640 × 960 | 13 a 17 años, sin empleo |
| `personaje/nino/estudiante.png` | 640 × 960 | en básicos y diversificado |
| `personaje/nino/limonada.png`, `periodicos.png`, `dulces.png` | 640 × 960 | los tres trabajitos de niño, que **sólo** se hacen a esa edad |
| `personaje/mayor/base.png` | 640 × 960 | 50 a 65, sin empleo |
| `personaje/mayor/graduado.png` | 640 × 960 | el reporte de jubilación, donde más se nota |
| `personaje/mayor/tienda.png`, `construccion.png`, `vendedor.png`, `contador.png`, `gerente.png`, `ingeniero.png` | 640 × 960 | los seis empleos que alguien de 55 tiene de verdad |

Tiene que ser **la misma persona**: mismo rostro envejecido, mismo tono de piel,
misma pose. Un chico de 13 con la cara del de 25 encogido no sirve; tampoco un
señor de 55 que parezca otra persona.

**Lo que hace falta en el código:** `Arte.personaje()` en `js/arte.js` ya elige
por estado; habría que añadirle la edad como primer criterio, con respaldo al
juego actual cuando no exista la variante. Diez líneas.

---

## 6. Prioridad 5: que la pantalla conteste. El jugo

Un tycoon se siente en la respuesta. Hoy el juego tiene monedas que suben, un
saltito al comprar y barras que crecen —todo hecho con CSS— y eso ya funciona.
Lo que falta son **cuatro momentos** que hoy no tienen imagen y son los cuatro
que más importan.

| Archivo | Maestro | Cuándo sale | Por qué importa |
|---|---|---|---|
| `assets/visuales/jugo/estallido.png` | 768 × 768 | al subir un negocio de nivel | es el premio, y hoy es un número que cambia |
| `jugo/cerrado.png` | 768 × 768 | encima de un negocio que **quebró** | quebrar es la lección más dura del juego y hoy sólo sale una frase. Una cortina metálica bajada lo dice todo |
| `jugo/candado.png` | 768 × 768 | sobre lo que pide colegio terminado | conecta estudiar con crecer, que es el mensaje entero |
| `jugo/billetes.png` | 768 × 768 | al cobrar el mes | la moneda ya existe; un fajo se lee distinto y marca la escala cuando el imperio es grande |

**Lo que NO hay que hacer aquí:** convertir a imagen los 78 iconos de interfaz.
Son controles que se ven desde 16 px y cambian de color con `currentColor`; en
raster perderían nitidez, multiplicarían descargas y perderían los estados de
color. Si algún día se reemplazan, tiene que ser como familia vectorial completa.

---

## 7. Prioridad 6: más negocios, para que el imperio tenga a dónde llegar

Esta parte **no es sólo imágenes**: cada tipo nuevo es un bloque de datos en
`datos/negocios.js` más cuatro locales. Va aquí porque sin ella el imperio se
acaba, y un tycoon duro no se acaba.

Hoy la escalera va de Q450 a Q250,000 y arriba de la distribuidora no hay nada.
Con maestría el jugador puede llevar **ocho negocios y veinte personas**, y no
tiene con qué llenarlos. Seis tipos más lo arreglan:

| `id` propuesto | Qué es | Plazas | Pide | Cuesta | Para qué sirve en la escalera |
|---|---|---|---|---|---|
| `barberia` | Barbería: sillón, espejo, navaja | 3 | básicos | Q18,000 | margen altísimo, poco capital: enseña que un servicio no compra lo que vende |
| `panaderia` | Panadería: horno y vitrina | 4 | básicos | Q45,000 | volumen diario, margen medio |
| `farmacia` | Farmacia: mostrador y estantería | 4 | diversificado | Q140,000 | inventario caro, margen bajo, clientela fija |
| `ferreteria` | Ferretería: estantes hasta el techo | 5 | diversificado | Q180,000 | mucho capital parado en inventario |
| `constructora` | Constructora: camioneta, andamios, planos | 10 | licenciatura | Q600,000 | el primer negocio donde la planilla es el negocio |
| `planta` | Planta de producción: nave, máquinas, montacargas | 20 | maestría | Q2,000,000 | el techo del juego: sólo funciona con veinte personas adentro |

Son **24 locales más** (`negocio/<id>/n1..n4.png`, maestro 768 × 768) y seis
iconos de emblema, que **no** son imagen: se dibujan como trazo en
`js/iconos.js`, o se toman del respaldo de Lucide que el proyecto ya trae.

Los números de la tabla son una propuesta de forma, no una calibración. Quien
los ponga tiene que correr `node pruebas/imperio.js` y comprobar que sigan
pasando las dos comprobaciones que sostienen el juego: **estudiar rinde más que
no estudiar**, y **montar negocios le cambia la vida a quien no estudió**.

---

## 8. Lo que hay que dejar para después, y por qué

No lo pidas todavía. No porque no sirva, sino porque **cada uno necesita una
pantalla que no existe**, y una imagen sin pantalla es peso muerto en el
repositorio.

| Idea | Qué necesitaría antes |
|---|---|
| Interiores de cada negocio (9 imágenes grandes) | una pantalla de detalle al tocar un local, que hoy no hay |
| Retratos de encargados contratables | una mecánica de encargados: alguien que administra un negocio por ti y te libera jornadas |
| Mapa de la ciudad con zonas | el sistema de zonas de `PENDIENTE.md` §1, que está decidido y sin construir |
| Vehículos de reparto | una mecánica de logística |
| Estados de ánimo del personaje | ninguna decisión del juego depende del ánimo |

---

## 9. El presupuesto, en frío

Si se entrega todo lo de las prioridades 1 a 5, **con maestros a 768 px** como
pide la §1.7:

| Lote | Archivos | Maestros | Copias que carga el juego |
|---|---|---|---|
| P1 · los 36 locales | 36 | **35.7 MB** (medido) | **543 KB** (medido) |
| P2 · la calle y el mobiliario | 8 | ~10 MB | ~200 KB |
| P3 · la gente | 7 | ~6 MB | ~120 KB |
| P4 · las edades | 13 | ~11 MB | ~210 KB |
| P5 · el jugo | 4 | ~4 MB | ~40 KB |
| **Ya está** | **73** | **125 MB** | **1.1 MB** |
| **Falta** | **32** | **~31 MB** | **~570 KB** |

El aviso de peso de la primera versión de este documento decía que las copias
sumarían 2.07 MB contra un tope de 1.5 MB. **P1 se resolvió bajando las copias de
local de 256 a 192 px**, que a 90 px de pantalla sobra: quedaron en 543 KB en vez
de 900, y el total del juego en 1.1 MB. Con eso, lo que falta cabe **justo**:
1.1 + 0.57 = 1.67 MB, por encima del tope de 1.5.

Así que la decisión sigue pendiente y ahora es más pequeña: al entrar P4 —las
trece edades del protagonista, que son las que más pesan— hay que subir el tope a
2 MB, o bajar las copias de personaje de 256×384. Que sea sabiendo qué protege
ese tope: que el juego abra en un teléfono con datos móviles.

Y el otro aviso sigue en pie. **Los maestros van ya en 125 MB** y con el encargo
completo pasarían de 150. Si eso molesta —y con el tiempo molesta— la salida es
dejarlos en la rama `assets` y **no** traerlos a `main`, que sólo necesita
`assets/juego/`. Hoy están en las dos ramas.

---

## 10. Cómo entregarlo

1. Los PNG maestros en `assets/visuales/`, con la estructura de carpetas y los
   nombres exactos de este documento.
2. **En la rama `assets`**, que es donde vive este trabajo.
3. Sin tocar `js/`, `datos/` ni `css/`: la conexión la hace después quien la
   haga, y este documento dice en cada sección qué archivo hay que cambiar.
4. Un lote por prioridad, no todo junto. P1 sola ya cambia la cara del juego, y
   entregarla sola permite mirarla en pantalla antes de dibujar sesenta más.
5. Cuando llegue un lote, la conexión es: poner los nombres en `js/arte.js`,
   correr `python herramientas/preparar-imagenes.py`, y `npm test`. La suite
   `pruebas/arte.js` dice si algo falta, sobra o pesa demasiado.
