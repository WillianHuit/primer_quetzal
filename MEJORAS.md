# Mejoras para que Mi Primer Quetzal tenga identidad propia

Estado al 10 de septiembre de 2026.

Este documento define mejoras de diseño para que seguir jugando sea emocionante
sin convertir el juego en otro Monopoly ni en una colección de pantallas con
mucho texto. La identidad debe seguir siendo la de una vida guatemalteca que se
construye con decisiones pequeñas: estudiar, trabajar, ayudar, descansar,
emprender y recuperarse cuando algo sale mal.

No es una orden para implementar todo de una vez. Está organizado por capas para
que cada entrega pueda probarse antes de añadir la siguiente.

---

## 1. Principios que no se deben romper

### 1.1 Entender primero, leer después

Cada acción principal debe poder reconocerse por:

1. un icono;
2. un número corto, si hace falta;
3. una frase de no más de ocho palabras.

El texto largo queda detrás de `¿Por qué?`, `Ver detalle` o al terminar la
acción. Nunca debe ser necesario leer un párrafo mientras corre un cronómetro.

Ejemplo correcto:

```text
[🚌 icono propio] Esperar        +5 cuerpo
[🏃 icono propio] Subir ahora    −8 cuerpo
```

Los iconos reales deben salir de `js/iconos.js`; el emoji de este documento solo
explica la intención.

### 1.2 Una regla nueva por minijuego

Un minijuego puede combinar velocidad y decisión, pero no debe enseñar tres
reglas al mismo tiempo. Su primera ronda funciona como demostración jugable:
señala la acción correcta, no consume una vida y dura menos de cinco segundos.

### 1.3 Partidas cortas dentro de una vida larga

- Una actividad normal dura entre **12 y 25 segundos**.
- Una actividad frenética dura entre **20 y 35 segundos**.
- Una decisión grande no tiene cronómetro.
- Ninguna actividad supera 45 segundos.
- Al cuarto error termina, igual que las tareas actuales.

### 1.4 Frenético no significa difícil de entender

La presión debe venir de que pasan cosas conocidas más rápido, no de ocultar
reglas ni de usar preguntas tramposas. Para acelerar se puede:

- acortar gradualmente el tiempo;
- mostrar dos pedidos al mismo tiempo;
- añadir una fila breve de clientes;
- introducir una interrupción visible;
- pedir una cadena de tres acciones sencillas.

No se debe acelerar con texto que desaparece, botones que cambian de lugar,
iconos sin explicación previa o castigos que el jugador no pudo anticipar.

### 1.5 Perder debe enseñar algo y dejar continuar

Fallar una actividad reduce la recompensa; no destruye una carrera ni una
partida. El resultado debe caber en dos líneas:

```text
Se fueron 2 clientes.
La próxima vez atiende primero al que espera más.
```

### 1.6 No gana quien solo acumula dinero

El juego debe reconocer cuatro recursos:

| Recurso | Qué representa | Para qué abre puertas |
|---|---|---|
| Dinero | liquidez, ahorro y patrimonio | compras, emergencias, inversión |
| Cuerpo | energía y salud cotidiana | jornadas, estudio, cuidado |
| Experiencia | lo que la persona aprendió | empleos, soluciones, mejores decisiones |
| Red | confianza de familia, vecinos y contactos | ayuda, recomendaciones y cooperación |

`Red` sería un sistema nuevo. No se compra directamente y no debe verse como un
medidor de popularidad. Sube cuando el jugador cumple acuerdos, ayuda o trata
bien a otras personas; baja cuando incumple, abusa de la confianza o deja a
alguien cargando con una promesa.

---

## 2. Lenguaje visual común de los minijuegos

Todos los minijuegos deben reutilizar la misma gramática para que el jugador no
tenga que aprender cada pantalla desde cero.

| Señal | Significado |
|---|---|
| borde verde | acción posible o correcta |
| borde ámbar | requiere atención; todavía se puede resolver |
| borde rojo | error, deuda o tiempo por vencer |
| reloj circular | tiempo restante |
| tres puntos | margen de errores |
| mano | arrastrar |
| dedo | tocar |
| dos flechas | intercambiar orden |
| bolsa | inventario |
| persona | cliente, compañero o contacto |
| escudo | protección, garantía o seguro |

Las primeras apariciones pueden mostrar icono y palabra. Después de dos usos, la
palabra puede desaparecer si el significado sigue siendo inequívoco.

En accesibilidad, el color nunca comunica solo: el borde cambia también de forma
o lleva una marca. Debe existir un modo sin presión que duplique el tiempo sin
reducir la recompensa educativa.

---

## 3. Minijuegos prioritarios

### 3.1 La caja no cuadra

**Fantasía:** cerrar una caja de tienda, comedor o negocio propio.

**Pantalla:** cuatro tarjetas grandes con iconos: ventas, efectivo, vuelto y
gastos. Una tiene una cifra incorrecta. El jugador toca la que no cuadra.

**Bucle de 20 segundos:**

1. aparecen tres operaciones sencillas;
2. se toca la discrepancia;
3. la tarjeta se corrige visualmente;
4. entra la siguiente.

Empieza con quetzales enteros y una sola suma. Más adelante usa centavos y cinco
tarjetas, pero nunca álgebra ni cuentas largas.

**Momento frenético:** en los últimos ocho segundos llegan dos cierres seguidos.
La animación de monedas marca el ritmo, pero no tapa las cantidades.

**Recompensa:** experiencia; en un negocio propio puede reducir una pequeña
pérdida del mes. No debe regalar dinero de la nada.

**Iconos esenciales:** caja, billete, moneda, recibo, alerta.

### 3.2 Fila de clientes

**Fantasía:** atender un negocio durante la hora más movida.

**Pantalla:** máximo tres clientes visibles. Cada uno muestra solo el icono de
lo que pide y una barra de paciencia. Abajo hay entre tres y cinco productos.

**Acción:** tocar el producto y después al cliente. No hace falta arrastrar con
precisión; dos toques funcionan mejor en teléfonos pequeños.

**Dificultad:**

- ronda 1: un cliente y pedidos distintos;
- ronda 2: dos clientes;
- ronda 3: tres clientes, uno cambia su pedido antes de confirmar;
- ronda final: ráfaga de ocho segundos.

Los productos dependen del negocio: tortillas, bebidas, cuadernos, platos,
repuestos o recargas. La regla no cambia; solo cambia el vocabulario visual.

**Fallo:** entregar algo incorrecto consume un punto de error. Dejar que una
barra llegue a cero hace que el cliente se marche, sin penalización adicional.

**Recompensa:** una pequeña mejora temporal de reputación o producción.

### 3.3 Surtir el negocio

**Fantasía:** decidir qué comprar antes de abrir.

**Pantalla:** una canasta con seis espacios, cuatro productos y tres pistas
visuales del mes: clima, fecha y evento. Ejemplo: lluvia, quincena y feria.

**Acción:** tocar hasta seis unidades. El costo aparece siempre en la esquina;
una barra impide exceder el presupuesto.

**Decisión:** no hay combinación perfecta. Un artículo popular deja menos
margen; uno rentable puede quedarse sin vender. El pronóstico ayuda, pero no
garantiza.

**Duración:** sin cronómetro la primera vez; después, 25 segundos.

**Resultado:** al cierre se muestran tres grupos con iconos: vendido, sobrante y
faltante. Una línea resume la lección.

### 3.4 La ruta del día

**Fantasía:** organizar estudio, trabajo, mandados y descanso en la ciudad.

**Pantalla:** mapa esquemático con cuatro lugares como máximo. No requiere un
mapa geográfico exacto. Cada lugar muestra icono, tiempo y costo de transporte.

**Acción:** ordenar de dos a cuatro paradas. El trayecto se dibuja al tocarlas.

**Regla:** llegar a todo no siempre es posible; el jugador debe proteger la
actividad más importante.

**Momento frenético:** después de confirmar puede aparecer una sola incidencia
—lluvia, tráfico o bus detenido— y se dan cinco segundos para cambiar una ruta o
aceptar el atraso.

**Recompensa:** conservar cuerpo, dinero o una jornada. El juego muestra qué se
ahorró con iconos, no una explicación extensa.

### 3.5 Negociar

**Fantasía:** acordar precio, sueldo, fecha o cantidad sin convertirlo en una
conversación llena de texto.

**Pantalla:** dos medidores: relación y acuerdo. Hay tres botones con iconos:
ceder, proponer y mantener.

**Bucle:** la otra persona presenta una ficha visual; el jugador responde en
tres rondas como máximo. Una cara sencilla y el movimiento de los medidores
explican la reacción.

**Regla:** presionar siempre rompe la relación; ceder siempre empeora el acuerdo.
El punto adecuado depende del contexto y de la red construida.

**Usos:** salario, compra a proveedor, cobro de un trabajo, fecha de pago y
deuda familiar.

**Sin memoria oculta:** antes de confirmar se ve el resultado probable con una
zona, no una cifra exacta.

### 3.6 ¿A quién le fías?

**Fantasía:** administrar confianza en un negocio pequeño.

**Pantalla:** un cliente, el monto y hasta tres señales visuales: compras
anteriores, pagos cumplidos y deuda actual.

**Opciones:** fiar todo, fiar una parte o cobrar de contado. Tres botones grandes
con monedas llenas, medias o bloqueadas.

**Regla:** no existe una respuesta universal. Negarse siempre protege caja pero
reduce clientela; fiar siempre crea mora.

**Seguimiento:** el resultado no aparece inmediatamente. Días o meses después,
la persona paga, pide plazo o incumple. La tarjeta debe recordar la decisión con
el mismo retrato e icono.

### 3.7 Resolver el pedido

Es una plantilla para dar personalidad a cada oficio sin programar nueve juegos
completamente diferentes.

**Estructura común:** aparecen tres pasos representados por objetos. El jugador
los toca en el orden correcto antes de que termine el tiempo.

| Negocio u oficio | Secuencia visual posible |
|---|---|
| Tortillería | masa → comal → canasto |
| Comedor | orden → cocina → mesa |
| Taller | revisar → reparar → probar |
| Papelería | buscar → contar → empacar |
| Café internet | usuario → equipo → tiempo |
| Distribuidora | lista → cajas → entrega |
| Lavado | separar → lavar → entregar |
| Dulces/refrescos | pedido → cobrar → entregar |

La primera ronda muestra flechas. Las siguientes mezclan los tres objetos. Una
ronda frenética puede encadenar dos pedidos, pero nunca añade un cuarto paso.

### 3.8 Detectar la estafa

Debe conservar el minijuego actual, pero hacerlo visual y progresivo.

**Pantalla:** una oferta breve y tres señales tocables: remitente, urgencia y
condición de pago. El jugador marca la señal sospechosa o acepta.

**Texto máximo:** título de seis palabras y una frase de doce. Los detalles se
abren solo si el jugador toca una lupa.

**Progresión:**

- inicio: premio imposible o cobro anticipado;
- trabajo: falsa vacante o curso obligatorio pagado;
- negocio: proveedor, transferencia falsa o crédito abusivo;
- adultez: inversión, suplantación o emergencia familiar falsa.

No todas las ofertas son estafas. Si siempre hay una trampa, el jugador aprende
a rechazar todo y deja de pensar.

### 3.9 La entrevista

**Fantasía:** prepararse y responder según el empleo.

**Preparación:** antes de entrar se elige una de tres fichas: conocer empresa,
practicar o descansar. Cada una revela una pista diferente.

**Entrevista:** tres preguntas como máximo. Cada respuesta es un icono más una
frase corta: seguridad, experiencia o disposición para aprender.

No hay una respuesta buena para todo:

- un taller valora demostrar cómo se resuelve;
- una tienda valora trato y puntualidad;
- una oficina valora organización;
- un trabajo nuevo valora aprendizaje.

**Resultado:** probabilidad visible antes de confirmar y una explicación de una
línea después. Fallar no bloquea el empleo para siempre; permite reintentar tras
ganar experiencia o esperar unos meses.

### 3.10 Conversación difícil

**Fantasía:** hablar con jefe, familiar, cliente, pareja o empleado.

**Interfaz:** tres tonos representados por postura e icono: escuchar, proponer y
poner límite. Cada botón tiene entre una y cuatro palabras.

La persona reacciona con gesto, no con párrafos. Después de dos elecciones se
resuelve. El historial de confianza modifica la reacción.

**Casos:** pedir aumento, cobrar deuda, corregir a un empleado, repartir gastos,
decir que no a un préstamo o pedir ayuda.

### 3.11 El mes inesperado

Funciona como cierre especial del año, no todos los meses.

**Pantalla:** tres problemas representados por tarjetas grandes y solo dos
recursos disponibles. Ejemplo: medicina, reparación y colegiatura; se dispone de
ahorro y ayuda familiar.

**Acción:** asignar recursos a dos problemas y aceptar qué queda pendiente. No
hay cronómetro.

**Objetivo:** mostrar que administrar también es elegir qué no se puede resolver
hoy. La consecuencia de lo pendiente vuelve más adelante, pero siempre con una
oportunidad de recuperación.

---

## 4. Sistemas que sostienen una partida completa

### 4.1 Historias encadenadas

Algunos comodines deben convertirse en historias de dos o tres pasos separados
por meses. Cada historia guarda solo un estado pequeño: comenzó, respondió y
cerró.

Ejemplos:

- prestaste dinero → se atrasa → paga o pide otro plazo;
- ayudaste a una vecina → te recomienda para un trabajo;
- capacitaste a un empleado → recibe una oferta y decide si quedarse;
- compraste barato a un proveedor → el producto falla → negocias reposición;
- abandonaste estudios → aparece una opción nocturna años después.

La tarjeta que regresa debe llevar el mismo retrato, color e icono para que se
entienda sin recordar nombres ni leer antecedentes.

### 4.2 Personas persistentes

La familia, amistades, compañeros y empleados importantes necesitan:

- nombre corto;
- retrato o silueta;
- relación con el jugador;
- nivel de confianza;
- una promesa pendiente como máximo.

No debe simularse una red social completa. Entre cuatro y ocho personas activas
son suficientes para que las decisiones tengan memoria sin saturar la pantalla.

### 4.3 Metas personales

Al empezar cada etapa se elige una meta entre tres tarjetas visuales:

- graduarse;
- sostener a la familia;
- abrir un negocio;
- comprar vivienda;
- salir de deudas;
- migrar;
- volver a estudiar;
- construir un retiro tranquilo.

La meta no obliga una ruta ni reemplaza el tutorial. Solo coloca un pequeño
marcador en las acciones relacionadas y cambia una parte del reporte final.

### 4.4 Recuerdos del año

Cada doce meses el juego guarda un solo recuerdo automático, elegido por
importancia:

- primer trabajo;
- graduación;
- negocio abierto o cerrado;
- deuda terminada;
- nacimiento o pérdida familiar;
- migración o regreso;
- recuperación después de una crisis.

Se presenta como una postal con ilustración, año y una frase. Al jubilarse, las
postales forman una línea de vida horizontal. Esto convierte los números en una
historia que se puede compartir.

### 4.5 Crisis con preparación

Una crisis nunca debe ser un dado que simplemente quita dinero. Antes de cobrar,
consulta lo que el jugador construyó y ofrece opciones visibles:

| Preparación | Opción que aparece |
|---|---|
| ahorro | pagar sin deuda |
| seguro | cubrir una parte |
| red alta | pedir ayuda o tiempo |
| experiencia | resolver o negociar mejor |
| segundo oficio | recuperar ingresos |
| descanso acumulado | absorber costo de cuerpo |

La crisis puede seguir siendo dolorosa, pero el jugador debe reconocer qué
decisión anterior lo protegió.

### 4.6 Negocios con personalidad

Todos pueden compartir motor, pero cada tipo necesita un modificador sencillo y
visible:

| Negocio | Decisión propia |
|---|---|
| Dulces | ubicación y compras pequeñas frecuentes |
| Refrescos | clima y refrigeración |
| Lavado | agua, energía y entregas a tiempo |
| Tortillería | madrugar, producción y merma |
| Papelería | temporada escolar e inventario amplio |
| Comedor | alimentos perecederos y hora pico |
| Taller | diagnóstico, repuestos y reputación |
| Café internet | mantenimiento, conexión y demanda estudiantil |
| Distribuidora | volumen, rutas y crédito a clientes |

Cada tarjeta de negocio debe mostrar un solo indicador propio. Los detalles
económicos completos permanecen en la hoja de administración.

### 4.7 Capítulos de cinco años

A los 18, 23, 28 y luego cada cinco años aparece una decisión grande. No es una
pregunta genérica: las opciones dependen de ahorro, cuerpo, experiencia, red,
educación, trabajo y negocios.

Ejemplo a los 28:

> Te ofrecen administrar un local mejor ubicado.

Opciones visuales posibles:

- llave + deuda: tomar el local financiado;
- libro + reloj: terminar estudios primero;
- personas + tienda: entrar con un socio;
- escudo: conservar el negocio actual.

Si una opción no está disponible, se ve el requisito exacto con un icono y un
número. No se esconde ni aparece como sorpresa después de tocar.

---

## 5. Ritmo: dónde poner los momentos frenéticos

La partida necesita contraste. Si todo tiene cronómetro, nada se siente urgente.

### Ritmo recomendado por año jugado

- 6 a 9 actividades normales;
- 2 a 3 comodines;
- 1 actividad frenética;
- 1 cierre anual o recuerdo;
- una decisión grande solo cuando corresponde por edad o historia.

### Situaciones apropiadas para velocidad

- hora pico de clientes;
- cierre de caja;
- pedido grande;
- falla de equipo durante el turno;
- reorganizar una ruta por lluvia;
- separar productos perecederos;
- detectar una transferencia falsa antes de entregar.

### Situaciones que nunca deben usar cronómetro

- endeudarse;
- migrar;
- dejar estudios;
- despedir a alguien;
- elegir vivienda;
- decidir sobre salud;
- prestar ahorros importantes;
- decisiones familiares.

---

## 6. Recompensas y dificultad

### Tres niveles de asistencia

| Modo | Tiempo | Ayuda |
|---|---:|---|
| Tranquilo | ×2 | muestra la siguiente acción después de una pausa |
| Normal | ×1 | primera ronda guiada |
| Rápido | ×0.75 | sin pista automática; recompensa solo ligeramente mayor |

El modo rápido no debe dar suficiente dinero para convertirse en la estrategia
obligatoria. Su premio principal es puntuación, una insignia o una animación.

### Escalado sano

- Aumentar velocidad antes que complejidad.
- Añadir como máximo un elemento visible por etapa.
- Mantener operaciones de uno o dos pasos.
- No exigir memoria de más de cuatro objetos.
- No usar precisión de píxel.
- Dar al menos 700 ms entre una respuesta y la siguiente tarjeta.
- Permitir pausa cuando la actividad no representa una urgencia narrativa.

### Evitar recompensas que rompan la economía

Los minijuegos de escuela dan experiencia. Los de trabajo reemplazan o mejoran
una jornada; no pagan además un premio desproporcionado. Los de negocio afectan
producción, merma o reputación. Así cada actividad refuerza su sistema en vez de
convertirse en una máquina externa de dinero.

---

## 7. Implementación por entregas

### Entrega 1: prototipo de ritmo

1. Crear `La caja no cuadra`.
2. Crear `Fila de clientes` para un solo negocio.
3. Añadir selector Tranquilo/Normal/Rápido.
4. Probar instrucciones sin párrafos y con iconos existentes.
5. Medir abandono, errores y tiempo real.

**Criterio de aceptación:** una persona entiende cada juego tras una ronda y una
partida completa de cada uno tarda menos de 35 segundos.

### Entrega 2: negocios distintos

1. Convertir `Resolver el pedido` en plantilla.
2. Añadir contenido para los nueve negocios.
3. Incorporar surtido y una variable propia por negocio.
4. Añadir una única ráfaga de hora pico.

**Criterio de aceptación:** cambiar de negocio cambia las decisiones, aunque la
interfaz siga siendo familiar.

### Entrega 3: decisiones con memoria

1. Añadir `Red`.
2. Crear de cuatro a ocho personas persistentes.
3. Implementar cinco historias encadenadas.
4. Añadir `¿A quién le fías?` y `Conversación difícil`.

**Criterio de aceptación:** una decisión tomada hoy puede abrir una opción meses
después y el jugador entiende por qué mediante retrato e icono.

### Entrega 4: etapas de vida

1. Añadir metas personales.
2. Crear capítulos cada cinco años.
3. Añadir crisis que consulten la preparación.
4. Construir postales anuales y línea de vida.

**Criterio de aceptación:** dos partidas con patrimonio similar pueden terminar
con historias y evaluaciones diferentes.

### Entrega 5: ciudad y transporte

1. Terminar datos de zonas y transporte.
2. Crear mapa esquemático.
3. Implementar `La ruta del día`.
4. Conectar tiempo, costo y cuerpo al cierre mensual.

**Criterio de aceptación:** vivir lejos es una decisión comprensible y no un
castigo aleatorio.

---

## 8. Pruebas necesarias

Además de las pruebas de datos existentes, cada minijuego debe comprobar:

- que se puede terminar solo con toque, sin teclado;
- que los botones miden al menos 44 × 44 px;
- que ninguna instrucción activa supera dos líneas en 390 px;
- que el modo tranquilo es completable sin reflejos rápidos;
- que el cuarto error termina correctamente;
- que no se paga dos veces una misma jornada;
- que fallar no bloquea permanentemente el progreso;
- que funciona en español e inglés sin desbordarse;
- que color y sonido no son la única señal;
- que reabrir una partida conserva historias y personas.

También conviene una prueba con jugadores reales: mostrar únicamente la primera
pantalla y pedirles que actúen sin explicación oral. Si la mayoría pregunta qué
hacer, el icono o la composición fallaron; añadir un párrafo no corrige el
problema.

---

## 9. Lo que no se recomienda

- Comprar calles o propiedades por color.
- Cobrar renta pasiva como objetivo central.
- Un ranking basado únicamente en patrimonio.
- Minijuegos de memoria larga o cálculo avanzado.
- Decisiones con una respuesta moral obviamente correcta.
- Cajas de recompensa, ruletas o energía comprable.
- Castigos aleatorios sin preparación posible.
- Diálogos de varias pantallas durante actividades.
- Una moneda adicional para cada subsistema.
- Repetir el mismo minijuego para ganar dinero sin límite.

La pregunta que debe decidir cada mejora es: **¿esto ayuda a contar la vida que
el jugador construyó, o solo agrega otra forma de subir un número?** Si solo
sube un número, no es parte de la esencia.
