# Recursos visuales

Estado al 8 de septiembre de 2026. **Los 73 recursos ya están conectados al juego.**

Este documento tenía una primera parte escrita cuando las imágenes se crearon y
todavía no se habían colocado. Esa parte sigue abajo, en §5, porque describe qué
es cada archivo y con qué criterio se dibujó, y eso no ha cambiado. Lo que se
reescribió es lo de arriba: dónde acabó cada cosa y qué hubo que resolver.

---

## 0. Cómo funciona ahora

Hay dos carpetas y hacen cosas distintas. La diferencia importa.

| Carpeta | Qué es | La carga el navegador |
|---|---|---|
| `assets/visuales/` | los 73 PNG **maestros** tal como se entregaron: 125 MB, a 1024×1536, 1254×1254 y 768×768 | **no** |
| `assets/juego/` | las copias que el juego usa: WebP, al tamaño en que se ven, limpias. 1.1 MB entre todas | **sí** |

`herramientas/preparar-imagenes.py` escribe la segunda a partir de la primera.
No hace falta para jugar ni para programar —`assets/juego/` va dentro del
repositorio, igual que `vendor/`— y se corre solo cuando llegan imágenes nuevas
o hay que cambiar un tamaño:

```
pip install pillow numpy
python herramientas/preparar-imagenes.py
```

`js/arte.js` es lo único que sabe qué ilustraciones existen. Todo lo demás
pregunta, y **si la respuesta es que no hay, dibuja**: los generadores SVG de
`js/personaje.js` y `js/escena.js` siguen vivos y no son código muerto. Son lo
que permite agregar un empleo a `datos/trabajos.js` y verlo funcionar el mismo
día, con su uniforme, sin esperar a que alguien lo ilustre.

`pruebas/arte.js` cruza tres cosas que viven en sitios distintos y tienen que
decir lo mismo: el inventario de `js/arte.js`, los archivos del disco y lo que
los datos piden. El fallo que esa suite existe para atrapar no lanza ningún
error y no sale en ninguna consola: **una imagen que falta deja un hueco
vacío.**

## 1. Dónde acabó cada cosa

| Recurso | Dónde se ve | Nota |
|---|---|---|
| `personaje/base`, `estudiante`, `graduado` y las 20 profesiones | la barra de arriba, la pantalla "Yo", las tarjetas de oferta de empleo, la pestaña Trabajo y el escenario | 2:3 exacto, así que entra sin deformarse en el lienzo de 64×96 que ya usaba el muñeco |
| `negocio/nivel-1..4` | los locales de la calle, en la pestaña Imperio | ver §2 |
| `mejoras/oficio`, `estudio`, `descanso` | las piezas del margen del escenario | una por nivel |
| `escena/moneda` | las monedas que suben de un local que produjo | |
| `escena/plataforma` | **no se usa**, y es a propósito: ver §3 | |

## 2. Los locales: tres peldaños, y los tres siguen vivos

Los cuatro primeros dibujos de local —canasta → carreta → puesto → local— se
hicieron para la cadena de mejoras `negocio`, que **ya no existe**: la reemplazó
el imperio, donde el jugador abre hasta ocho negocios de nueve tipos distintos.
Se reusaron como los cuatro niveles de **cualquier** negocio, y lo que quedó
pendiente fue que los nueve tipos los compartían: una tortillería y un taller se
veían idénticos, y lo único que los separaba era un **sello** redondo con el
emblema del tipo. La segunda entrega (§6) trajo los 36 que faltaban.

Los cuatro genéricos no se tiraron. Un negocio busca su dibujo en este orden:

| | Qué se ve | Cuándo |
|---|---|---|
| 1 | `negocio/tortilleria/n3`, la tortillería de verdad | el tipo tiene sus cuatro dibujos |
| 2 | `negocio/n3`, un puesto cualquiera **con el sello** del tipo encima | el tipo todavía no tiene dibujo |
| 3 | el local dibujado en SVG por `js/escena.js` | no hay ninguna ilustración |

Ese orden es lo que permite entregar los dibujos **por lotes**, y sin él el
proyecto se queda esperando al ilustrador. Los seis tipos de negocio que faltan
pueden entrar a `datos/negocios.js` hoy y a las ilustraciones el mes que viene:
en el medio, quien abre una panadería ve un puesto con un pan en el rótulo, no
un hueco.

El sello es la pieza que se mueve entre peldaños, y va donde hace falta. Sobre
el puesto genérico es la única pista del tipo de negocio; sobre la tortillería
ilustrada sería una calcomanía tapando el comal. `pruebas/arte.js` comprueba
las dos mitades de esa regla, porque es la que se rompe sola cuando llega un
lote nuevo: se ilustra un tipo, se olvida quitar el sello, y nadie lo nota.

## 3. Por qué la plataforma no se usa

`escena/plataforma.png` es una plataforma **ovalada**, hecha para un objeto
centrado. El escenario del juego dejó de ser eso: ahora es una calle que se
alarga con el número de locales, y estirar un óvalo de 1647×955 a cuatrocientos
y pico de ancho por dieciocho de alto lo deja irreconocible. Vale más un suelo
dibujado que uno deformado.

Si algún día se quiere usar, lo que hace falta es una **tira** con extremos y
centro repetible, no un óvalo.

## 4. Los cuatro problemas que hubo que resolver al colocarlas

Ninguno se veía leyendo el código ni abriendo los PNG en un visor.

1. **El cuadriculado horneado.** El generador dejó pintado, y OPACO, el patrón
   de cuadros gris y blanco que los editores usan para *señalar* transparencia.
   `herramientas/quitar-fondo-cuadriculado.ps1` limpió lo que tocaba los bordes,
   pero los huecos cerrados se quedaron con el patrón adentro: el interior del
   asa de la canasta, la zona de la que cuelga el rótulo, el hueco del asa de la
   caja de herramientas, el fondo del puesto. La canasta tenía el **5.6% de su
   superficie** así.

   El canalizador lo quita midiendo lo que de verdad lo delata: una zona donde
   alternan **dos** tonos desaturados y no hay nada más. Un tenis blanco o un
   toldo de lona son de un solo tono, así que no se tocan.

2. **Y el limpiador se comió los rayos de las ruedas de la bicicleta.** Son
   líneas finas blancas y grises sobre transparente, así que localmente parecían
   el patrón. La condición que faltaba es que la vecindad esté **llena** de los
   dos tonos: el cuadriculado llena la suya, unos rayos no llenan nada. (Las
   ruedas sí estaban rellenas de cuadriculado, y ahora se ven a través.)

3. **El personaje quedaba enterrado en la plataforma, y era demasiado grande.**
   Los dos números de la escena estaban calibrados contra el muñeco dibujado,
   que ocupaba menos de su lienzo; la ilustración lo llena entero. Con la escala
   de antes medía 59.5 unidades empezando en y=42, o sea que los pies caían cinco
   unidades y media por debajo del suelo, y le pasaba la cabeza a una tienda con
   puerta. Ahora mide 50 y el local más grande 48: una persona al lado de su
   tienda.

4. **Las figuritas de la gente contratada dejaron de funcionar.** Se dibujaban
   como muñequitos parados delante del local y con las ilustraciones puestas se
   quedaban cortados por el borde de la plataforma: dos cabecitas asomando que
   parecían un par de ojos. Ahora la gente se cuenta con una fila de siluetas
   sobre el suelo, que se lee a cualquier tamaño y no compite con el dibujo.

## 5. Qué es cada recurso, y con qué criterio se dibujó

*(Esta sección es la entrega original, sin cambios salvo las notas de dónde
acabó cada cosa.)*

### La progresión visual del negocio

Cuatro PNG independientes con fondo transparente. Todos miden **1254 × 1254 px**,
comparten perspectiva frontal a tres cuartos, contorno verde oscuro, luz superior
izquierda y la paleta del proyecto. El crecimiento es legible: canasta → carreta
→ puesto → local.

| Nivel | Archivo | Ahora es |
|---|---|---|
| 1 | `assets/visuales/negocio/nivel-1-canasta.png` | nivel 1 de cualquier negocio, "recién abierto" |
| 2 | `assets/visuales/negocio/nivel-2-carreta.png` | nivel 2, "con equipo" |
| 3 | `assets/visuales/negocio/nivel-3-puesto.png` | nivel 3, "con nombre" |
| 4 | `assets/visuales/negocio/nivel-4-local.png` | nivel 4, "con sucursal" |

### El protagonista

Un protagonista único y consistente. Todos sus estados parten del mismo rostro,
tono de piel, cabello, proporciones y dirección de pose. Los tres miden
**1024 × 1536 px**.

| Estado | Archivo | Cuándo se ve |
|---|---|---|
| Neutro | `personaje/base.png` | sin empleo y sin estudiar |
| Estudiante | `personaje/estudiante.png` | mientras estudia y no trabaja |
| Graduado | `personaje/graduado.png` | graduado, sin empleo y sin estudiar |

Un PNG es un personaje **completo**, así que los estados ya no se suman. Antes un
chico que trabajaba y estudiaba salía con la ropa del trabajo *y* la mochila, y
un graduado con el birrete encima del uniforme. Con las ilustraciones hay que
elegir una, y gana lo que está haciendo ahora: primero el oficio, después el
estudio, después la graduación. Está escrito en `js/arte.js` y comprobado en
`pruebas/iconos.js`.

### Las profesiones

Un PNG por cada identificador de `ROPA` en `js/personaje.js`, con el nombre igual
al `id`. Los 20 están en `personaje/profesiones/`, miden **1024 × 1536 px** y usan
fondo transparente.

| Grupo | Archivos |
|---|---|
| Trabajos infantiles | `limonada`, `periodicos`, `dulces` |
| Servicios y oficios | `repartidor`, `tienda`, `construccion`, `vendedor`, `callcenter`, `tiendapropia` |
| Técnicos y profesionales | `auxcontable`, `refrigeracion`, `soporte`, `docente`, `contador`, `ingeniero`, `gerente` |
| Trabajo en Estados Unidos | `construccion_us`, `restaurante_us`, `limpieza_us`, `tecnico_us` |

### Escenario y mejoras laterales

Todos son PNG maestros de **1254 × 1254 px**, excepto la plataforma horizontal,
de **1672 × 941 px**.

| Sistema | Archivos | Ahora es |
|---|---|---|
| Escena común | `escena/plataforma.png`, `escena/moneda.png` | la moneda sí; la plataforma no (§3) |
| Herramientas | `mejoras/oficio/caja-herramientas.png`, `rotulo.png`, `bicicleta.png` | los tres niveles de `OFICIO` |
| Estudio | `mejoras/estudio/mochila.png`, `libros.png`, `internet.png` | los tres de `ESCUELA` |
| Descanso | `mejoras/descanso/rincon.png`, `cama.png` | los dos de `CASA` |

### Lenguaje visual compartido

- Ilustración 2D pulida para juego móvil, juvenil sin ser infantil.
- Formas redondeadas, volumen suave y siluetas legibles a tamaño reducido.
- Paleta basada en `css/estilo.css`: verde `#1f7a5a`, menta `#e6f3ee`, tinta
  `#16211d`, ámbar `#b5811f`, azul `#2c5f8a` y rojo `#b8422e`.
- Sin texto, números, logotipos, marcas de agua ni símbolos financieros
  dependientes del idioma.

## 6. Entrega Tycoon: locales específicos

El 8 de septiembre de 2026 se completó la **prioridad 1** solicitada en
`RECURSOS_TYCOON.md`: 36 PNG maestros, uno por cada combinación de los nueve
tipos de negocio y sus cuatro niveles. **Ya están conectados**; lo que hubo que
resolver para conectarlos está en §6.1.

| Tipo | Archivos entregados |
|---|---|
| Dulces | `assets/visuales/negocio/dulces/n1.png` a `n4.png` |
| Refrescos | `assets/visuales/negocio/refrescos/n1.png` a `n4.png` |
| Lavado | `assets/visuales/negocio/lavado/n1.png` a `n4.png` |
| Tortillería | `assets/visuales/negocio/tortilleria/n1.png` a `n4.png` |
| Papelería | `assets/visuales/negocio/papeleria/n1.png` a `n4.png` |
| Comedor | `assets/visuales/negocio/comedor/n1.png` a `n4.png` |
| Taller | `assets/visuales/negocio/taller/n1.png` a `n4.png` |
| Café internet | `assets/visuales/negocio/cafeinternet/n1.png` a `n4.png` |
| Distribuidora | `assets/visuales/negocio/distribuidora/n1.png` a `n4.png` |

Todos miden **768 × 768 px**, tienen fondo transparente, un solo local aislado
y una base visual alineada cerca del borde inferior. Mantienen la progresión
`n1` inicio mínimo → `n2` equipado → `n3` puesto consolidado → `n4` sucursal,
sin palabras, cifras, marcas ni logotipos. La entrega completa pesa 35.73 MB.

Quedan sin producir las prioridades 3 a 5 de `RECURSOS_TYCOON.md`: gente
contratada, edades del protagonista y efectos ambientales. Los
iconos de interfaz continúan fuera del alcance y deben seguir siendo SVG.

### 6.1 Lo que hubo que resolver para conectarlos

Cuatro cosas, y ninguna se veía abriendo los PNG en un visor.

1. **El cuadriculado horneado, otra vez.** La segunda entrega trae el mismo
   patrón de cuadros opaco dentro de los huecos cerrados que la primera: detrás
   del comal de la tortillería, bajo el toldo del lavado, tras los monitores del
   café internet. La tortillería con equipo tenía el **7.7% de su superficie**
   así. El limpiador de `herramientas/preparar-imagenes.py` lo quitó sin tocar
   nada más, y ahora se ve el fondo por dentro de los locales, que es lo que el
   archivo del dibujante pedía. **Es la regla 1 de `RECURSOS_TYCOON.md` §1 y se
   volvió a incumplir**: conviene decirlo antes del siguiente lote.

2. **Los locales se recortan con SU caja, no con una común.** Los personajes van
   al contrario a propósito —el mismo chico no puede cambiar de tamaño al
   cambiar de trabajo— pero un local no es la misma cosa retratada dos veces. El
   margen vacío que traen debajo va de 0 px (distribuidora con equipo) a 122
   (lavado con sucursal): con caja común, el lavado saldría flotando un 15% por
   encima de la calle.

3. **192 px y no 256.** A 256 los 36 pesaban unos 830 KB y el total se iba a 1.5
   MB, o sea al borde del tope que protege `pruebas/arte.js`. En pantalla el
   local más grande se ve a unos 90 px, así que 192 sobra y la decisión no costó
   nada. El total quedó en **1.1 MB entre las 73**.

4. **La calle se ensanchó, y las monedas se recolocaron.** Los dibujos por tipo
   traen detalle —una moto, un comal, cuatro monitores— y a 48 unidades no se
   veía, así que el nivel 4 subió a 58 y el hueco de cada negocio de 46 a 56.
   Y las monedas que suben de un local que produjo salían flotando siete
   unidades por encima del toldo: la caja del `<image>` es cuadrada, el local
   viene más ancho que alto, y el techo de verdad queda más abajo que el borde
   de la caja.

## 7. Entrega Tycoon: calle modular

El 10 de septiembre de 2026 se completó la **prioridad 2** de
`RECURSOS_TYCOON.md`. Son ocho PNG maestros y todavía **no están conectados** al
juego; otra IA debe declararlos en `js/arte.js`, adaptar `suelo()` en
`js/escena.js` y preparar las copias WebP.

| Recurso | Tamaño | Uso |
|---|---:|---|
| `assets/visuales/escena/calle-centro.png` | 512 × 256 | tramo horizontal repetible |
| `assets/visuales/escena/calle-izq.png` | 256 × 256 | remate izquierdo |
| `assets/visuales/escena/calle-der.png` | 256 × 256 | remate derecho |
| `assets/visuales/escena/fondo.png` | 2048 × 512 | ciudad guatemalteca y volcanes al fondo |
| `assets/visuales/escena/urbano/farol.png` | 768 × 768 | poste de luz aislado |
| `assets/visuales/escena/urbano/arbol.png` | 768 × 768 | árbol de banqueta aislado |
| `assets/visuales/escena/urbano/basura.png` | 768 × 768 | bote de basura aislado |
| `assets/visuales/escena/urbano/parada.png` | 768 × 768 | parada de bus aislada |

El centro coincide píxel por píxel consigo mismo en los bordes izquierdo y
derecho. Los bordes interiores de ambos remates también coinciden con el centro.
El fondo es opaco; los otros siete archivos conservan transparencia real y no
tienen cuadriculado horneado. Las cuatro piezas urbanas están apoyadas cerca del
borde inferior y no incluyen suelo ni sombra de contacto.

## 8. Lo que sigue pendiente

- **Los iconos de interfaz no se convirtieron a PNG, y no deben convertirse.**
  Son 78 controles que se muestran desde unos 16 px y cambian de color con
  `currentColor`; en raster perderían nitidez, multiplicarían descargas y
  perderían los estados cromáticos. Si algún día se reemplazan, tiene que ser
  como familia vectorial completa, no con generación raster individual.
- **El protagonista no envejece y es siempre el mismo chico.** El juego va de los
  13 a los 65 y las 23 ilustraciones son de un adolescente. Es una decisión que
  las imágenes tomaron por el juego, no al revés: antes el muñeco dibujado era
  genérico. Si importa, hacen falta tres edades por estado, o al menos una del
  personaje mayor para el reporte de jubilación.
- **Seis tipos de negocio más, si se quieren.** Con maestría el jugador puede
  llevar ocho negocios y veinte personas, y solo hay nueve tipos con que
  llenarlos. Está encargado en `RECURSOS_TYCOON.md` §7, y ahora el orden de tres
  peldaños (§2) permite que los datos entren antes que los dibujos.
- **La paleta de las ilustraciones es más saturada que la de la interfaz.** Se
  nota al ponerlas al lado de una tarjeta: el dibujo tiene amarillos y naranjas
  que la interfaz no usa. No molesta, pero si algún día se regeneran, conviene
  acercarlas.
