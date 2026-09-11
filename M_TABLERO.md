# Mejoras del tablero mensual

Estado al 10 de septiembre de 2026.

Esta especificación describe cómo convertir el tablero mensual en el centro de
la experiencia de **Mi Primer Quetzal**. El objetivo no es agregar dificultad ni
texto, sino conseguir que cada mes tenga cuatro momentos reconocibles:

1. **Preparar:** mirar qué puede pasar.
2. **Decidir:** repartir las jornadas.
3. **Reaccionar:** adaptarse a uno o dos cambios.
4. **Recordar:** ver qué produjo el plan.

El tablero debe comunicar casi todo mediante iconos, posición, color y
movimiento. Las explicaciones extensas quedan detrás de `¿Por qué?` y nunca
interrumpen una acción con tiempo.

Este documento está escrito para que otra IA pueda implementar cada mejora sin
tener que reinterpretar la intención visual.

---

## 1. Reglas generales de interfaz y animación

### 1.1 Unidad visual

Cada casilla conserva estos elementos, siempre en el mismo lugar:

- esquina superior izquierda: icono de la actividad;
- esquina superior derecha: costo o ganancia principal;
- centro: contenido o persona involucrada;
- borde inferior: estado y progreso;
- borde exterior: disponible, advertencia, error o resuelta.

No colocar más de tres indicadores simultáneos dentro de una casilla. Si existe
información adicional, aparece al tocarla.

### 1.2 Duraciones comunes

| Acción | Duración | Curva sugerida |
|---|---:|---|
| respuesta inmediata al toque | 90–140 ms | `ease-out` |
| mover una ficha | 220–300 ms | `cubic-bezier(.2,.8,.2,1)` |
| abrir detalle | 180–240 ms | `ease-out` |
| cambiar el estado de una casilla | 280–400 ms | `ease-in-out` |
| celebrar una buena resolución | 500–750 ms | secuencia, no bucle |
| introducir un evento | 600–900 ms | entrada escalonada |
| transición entre etapas del mes | 350–500 ms | `ease-in-out` |

Ninguna animación funcional debe durar más de un segundo. Las celebraciones
pueden durar hasta 1.2 segundos, pero nunca deben bloquear el siguiente toque.

### 1.3 Principios de movimiento

- Los objetos entran desde el lugar del que provienen.
- Las consecuencias viajan hacia el indicador que modifican.
- Una casilla nunca cambia de sitio bajo el dedo.
- El movimiento confirma una acción; no decora permanentemente.
- No usar rebotes continuos, parpadeos rápidos ni balanceos infinitos.
- Como máximo una zona de la pantalla reclama atención a la vez.

### 1.4 Modo con movimiento reducido

Cuando `prefers-reduced-motion: reduce` esté activo:

- sustituir desplazamientos por fundidos de 100–150 ms;
- eliminar pulsos repetidos;
- no agitar casillas ni iconos;
- mantener cambios de borde, forma y texto corto;
- mostrar inmediatamente el resultado final de cada secuencia.

El sonido y la vibración nunca deben ser la única confirmación.

### 1.5 Capas recomendadas

El tablero debe separar visualmente estas capas para evitar que una animación
obligue a reconstruir todo:

1. fondo y calle;
2. casillas;
3. fichas de actividad y personas;
4. conexiones y rutas;
5. eventos temporales;
6. celebración, ayuda y tutorial.

Las capas 4 a 6 usan `pointer-events: none`. Los botones reales permanecen en la
capa de casillas.

---

## 2. Estado vivo del mes

### Objetivo

Que el tablero cambie con el mes y no parezca una cuadrícula idéntica durante
toda la partida.

### Información

Una franja compacta encima de las jornadas muestra hasta tres condiciones:

| Condición | Icono | Efecto posible |
|---|---|---|
| lluvia | nube con gotas | transporte más lento, refrescos venden menos |
| calor | sol | refrescos venden más, cuerpo baja más rápido |
| quincena | calendario con moneda | mayor demanda comercial |
| examen | cuaderno con alerta | tarea o estudio ganan valor |
| feria | banderines | ventas y actividades especiales |
| apagón | foco tachado | baja producción de negocios eléctricos |
| enfermedad | cruz o venda | limita cuerpo disponible |

La franja muestra icono y una etiqueta de máximo dos palabras. Al tocarla abre
una hoja con una frase sobre el efecto.

### Animación exacta

1. Al comenzar el mes, la franja se desliza 12 px desde arriba y aparece en
   300 ms.
2. Los iconos entran uno por uno, separados por 90 ms.
3. Cada icono hace una sola expansión de `0.85` a `1.05` y termina en `1`.
4. Cuando una condición modifica una casilla, una línea del color del evento
   viaja desde el icono hasta la casilla en 350 ms.
5. La casilla afectada cambia su borde durante 450 ms y queda con una pequeña
   marca del evento.

No animar lluvia sobre toda la pantalla. Como máximo pueden caer tres trazos
breves alrededor del icono de clima.

### Criterio de aceptación

El jugador identifica qué hace distinto al mes mirando la franja durante dos
segundos, sin abrir una explicación.

---

## 3. Pronóstico antes de repartir

### Objetivo

Dar información suficiente para planificar sin revelar todo lo que ocurrirá.

### Comportamiento

Antes de habilitar las casillas aparece una tarjeta horizontal con tres pistas:

- clima probable;
- compromiso conocido;
- oportunidad probable.

Ejemplo:

```text
[lluvia] Lluvia   [libro] Examen   [bolsa] Quincena
```

Dos pistas son confiables. Una puede cambiar durante el mes y lleva un pequeño
signo de interrogación. Nunca se oculta que existe incertidumbre.

### Animación exacta

1. El tablero baja su saturación al 80% durante 180 ms.
2. La tarjeta sube 16 px desde el borde inferior en 260 ms.
3. Las tres pistas se revelan de izquierda a derecha con un recorte horizontal
   de 180 ms cada una.
4. La pista incierta rota el signo `?` solo 12 grados y vuelve al centro.
5. Al tocar `Planear`, la tarjeta se comprime hacia la franja del mes en 300 ms;
   sus iconos permanecen visibles allí.

En movimiento reducido, la tarjeta aparece y desaparece con fundido.

### Texto máximo

- Etiqueta: dos palabras.
- Explicación al tocar: doce palabras.
- Botón: `Planear`.

---

## 4. Combos de jornadas

### Objetivo

Premiar el orden y la relación entre actividades sin obligar una ruta perfecta.

### Combos iniciales

| Secuencia | Resultado |
|---|---|
| estudio → tarea | pequeño bono de experiencia |
| trabajo → descanso | recuperación adicional de cuerpo |
| comprar → negocio | menor merma o faltante |
| ayudar → trabajo | posibilidad de recomendación |
| negocio → negocio | activa hora pico o producción continua |
| tarea → descanso | reduce el costo corporal del estudio |

El bono debe ser pequeño: sirve para que el jugador note la planificación, no
para convertir cada mes en un rompecabezas con solución única.

### Representación

Al seleccionar una actividad compatible, la posible siguiente casilla muestra
un conector tenue. Al confirmar ambas, el conector queda sólido y aparece un
icono pequeño del beneficio en su centro.

### Animación exacta

1. Primer toque: nace un punto luminoso en el borde de la casilla.
2. El punto dibuja la conexión hasta la siguiente casilla en 240 ms.
3. Si el combo es válido, la línea cambia de gris a verde en 180 ms.
4. El icono del beneficio aparece con escala `0.7 → 1.08 → 1` en 260 ms.
5. Al resolver el combo, un destello recorre la línea una sola vez en 400 ms.
6. La recompensa vuela hacia cuerpo, experiencia, red o negocio en 300 ms.

### Prevención de ruido

- Dibujar como máximo dos conexiones activas simultáneamente.
- Ocultar conexiones no relacionadas mientras una casilla está enfocada.
- No usar partículas para combos incompletos.
- Eliminar la conexión con un fundido de 160 ms si el jugador cambia el plan.

---

## 5. Cadenas de esfuerzo y riesgo

### Objetivo

Hacer visibles las consecuencias de repetir una actividad: trabajar mucho puede
producir más, pero también agotar.

### Cadenas

- trabajo continuo: ingreso y cansancio crecientes;
- estudio intensivo: experiencia y cansancio crecientes;
- descanso continuo: recuperación alta con menos progreso;
- negocio sin supervisión: producción reducida;
- estudio + trabajo sin descanso: riesgo de agotamiento;
- equilibrio entre obligación y descanso: pequeño bono de constancia.

### Interfaz

La tercera actividad exigente consecutiva muestra una advertencia ámbar con
icono de cuerpo. Al tocarla se ve la consecuencia probable. Nunca cobrar el
agotamiento sin haber mostrado la advertencia.

### Animación exacta

1. Primera jornada exigente: sin animación especial.
2. Segunda: aparece una marca ámbar de 4 px en la parte inferior.
3. Tercera: la marca se extiende a un tercio de la casilla en 250 ms.
4. Cuarta o más: el icono de cuerpo baja 3 px y recupera su posición en 220 ms,
   una sola vez.
5. Si se agrega descanso, la marca retrocede y cambia de ámbar a verde durante
   350 ms.

No sacudir la pantalla ni mostrar rojo mientras todavía sea una advertencia.

---

## 6. Jornada flexible

### Objetivo

Permitir reservar una casilla para reaccionar a cambios posteriores.

### Regla

El jugador puede dejar una jornada como `Flexible`. Solo una por mes. Puede
convertirla en cualquier actividad disponible cuando aparece un evento. Si el
mes termina sin usarla, se pierde.

### Apariencia

La casilla usa borde punteado y un icono de dos flechas curvas. No lleva un color
de actividad hasta que se asigna.

### Animación exacta

1. Al reservarla, el contenido de la casilla se encoge a `0.85` en 120 ms.
2. El icono flexible gira 90 grados en 220 ms y queda quieto.
3. Cuando aparece una oportunidad, la casilla emite dos pulsos suaves separados
   por 450 ms; después se detiene.
4. Al convertirla, el icono flexible se divide en dos trazos que viajan hacia
   los bordes en 180 ms.
5. El nuevo icono cae 8 px y se acomoda en 240 ms.

El pulso no se repite indefinidamente y desaparece después de cinco segundos.

---

## 7. Jornadas compartidas

### Objetivo

Representar combinaciones realistas de actividades pequeñas sin permitir una
optimización infinita.

### Combinaciones permitidas

- transporte + repasar apuntes;
- mandado + ayudar a familia;
- comprar insumos + abrir negocio;
- cuidado familiar + tarea sencilla;
- trámite + transporte.

Solo aparecen combinaciones registradas. Nunca se permite mezclar libremente
dos trabajos, dos estudios o dos actividades intensas.

### Interfaz

La casilla se divide diagonalmente en dos zonas grandes. Cada mitad tiene icono
y resultado. Al tocar una mitad se abre únicamente su detalle.

### Animación exacta

1. La primera actividad ocupa toda la casilla.
2. Al elegir una actividad compatible, una línea diagonal recorre la casilla en
   220 ms.
3. El primer icono se mueve 10 px hacia su mitad en 180 ms.
4. El segundo icono entra desde la mitad contraria en 220 ms.
5. Al resolver, primero se anima la actividad principal y 140 ms después la
   secundaria.

No reducir iconos por debajo de 24 px ni crear más de dos partes.

---

## 8. Eventos colocados sobre las casillas

### Objetivo

Que los imprevistos modifiquen el plan visible en lugar de vivir siempre en una
ventana desconectada.

### Eventos adecuados

- bus retrasado;
- cliente grande;
- profesor ausente;
- herramienta dañada;
- familiar que necesita ayuda;
- oferta temporal;
- lluvia fuerte;
- corte de energía.

### Comportamiento

El evento aterriza sobre una jornada futura, nunca sobre una ya resuelta. El
jugador elige mantener, cambiar o usar una reacción disponible. Solo puede haber
un evento pendiente a la vez.

### Animación exacta

1. El icono del evento aparece en la franja superior.
2. Una trayectoria curva lo lleva hasta la casilla en 420 ms.
3. La casilla se hunde visualmente 2 px durante 90 ms y vuelve en 160 ms.
4. Se añade una pestaña en su esquina superior derecha.
5. Las casillas no afectadas bajan a 85% de saturación durante la decisión.
6. Al resolver, la pestaña se transforma en la marca de consecuencia o se
   disuelve en 220 ms.

No usar una explosión para un problema cotidiano. Reservar estallidos para
logros o mejoras de nivel.

---

## 9. Ficha para reorganizar

### Objetivo

Permitir una corrección después de comenzar el mes sin eliminar el valor de
planificar.

### Regla

El jugador recibe una ficha de reorganización por mes. Permite intercambiar dos
jornadas futuras o convertir una jornada flexible. No mueve actividades ya
hechas ni obligaciones fijas del colegio.

### Interfaz

La ficha vive junto al contador de jornadas y lleva dos flechas. Al activarla,
solo las casillas que se pueden mover quedan a color.

### Animación exacta

1. La ficha se eleva 4 px y proyecta un borde verde en 140 ms.
2. Al tocar la primera casilla, aparece un aro numerado `1`.
3. Al tocar la segunda, aparece `2` y ambas casillas se desplazan siguiendo dos
   arcos opuestos durante 300 ms.
4. Los contenidos cambian de lugar; los contenedores permanecen fijos.
5. La ficha se encoge hacia su propio centro y desaparece en 200 ms.

Si el movimiento es inválido, no agitar la pantalla: el borde de la casilla se
vuelve ámbar y aparece un candado durante 700 ms.

---

## 10. Objetivo mensual opcional

### Objetivo

Dar dirección a quien la necesita sin imponer una única manera de jugar.

### Metas posibles

- completar una tarea;
- descansar dos jornadas;
- atender un negocio;
- ahorrar una cantidad razonable;
- evitar nuevo crédito;
- ayudar a una persona;
- terminar el mes con cuerpo suficiente.

La recompensa prioriza experiencia, red o recuerdo. Nunca debe entregar tanto
dinero que ignorarla sea jugar mal.

### Apariencia

Una insignia pequeña aparece a la izquierda del tablero. Muestra icono, contador
y ninguna frase permanente. Al tocarla aparece el objetivo en una línea.

### Animación exacta

1. Al iniciar el mes, la insignia se voltea en 280 ms y revela el icono.
2. Cada avance llena un segmento del aro en 240 ms.
3. Al completarse, el aro da una vuelta rápida de 300 ms y se detiene.
4. Tres partículas máximas viajan al indicador de recompensa.
5. Si no se cumple, la insignia se apaga con fundido; no se rompe ni se vuelve
   roja, porque era opcional.

---

## 11. Presión visual al final del mes

### Objetivo

Crear momentos frenéticos cuando quedan acciones pendientes, sin aumentar la
dificultad intelectual.

### Activación

Solo se activa si:

- quedan dos jornadas por resolver;
- existe una actividad de tiempo real;
- el jugador no eligió el modo tranquilo;
- no está abierta una decisión importante.

### Animación exacta

1. La luz de fondo cambia gradualmente a un tono cálido en 600 ms.
2. El calendario pierde una hoja con desplazamiento de 180 ms.
3. Las jornadas pendientes elevan su borde de 2 a 4 px.
4. El reloj circular se vuelve visible y avanza de forma continua.
5. La música o sonido puede ganar percusión, sin aumentar volumen.
6. Al terminar, el fondo vuelve a su estado normal en 450 ms.

No hacer zoom de cámara, no sacudir el tablero y no reducir el tiempo después de
que una actividad ya comenzó.

---

## 12. Huellas de las jornadas resueltas

### Objetivo

Poder leer cómo fue el mes mirando el tablero.

### Marcas

| Resultado | Marca visual |
|---|---|
| salió bien | sello verde con marca |
| resultado parcial | media marca ámbar |
| problema | herramienta, venda o alerta pequeña |
| memorable | estrella |
| ayudó otra persona | vínculo de dos siluetas |
| produjo dinero | moneda pequeña |
| produjo experiencia | destello de libro |

Cada casilla conserva una marca principal y una secundaria como máximo.

### Animación exacta

1. Al terminar una actividad, su contenido baja a 70% de saturación en 200 ms.
2. La marca principal se dibuja como un trazo de 260 ms.
3. El resultado numérico sube 8 px y desaparece en 500 ms.
4. Si existe marca secundaria, aparece 120 ms después sin movimiento.
5. Al cierre del mes, las marcas se iluminan de izquierda a derecha con 80 ms
   entre casillas.

La marca permanece hasta cerrar el resumen. Después el tablero nuevo aparece
limpio.

---

## 13. Personas como fichas del tablero

### Objetivo

Que familiares, compañeros, empleados y contactos formen parte del plan y no
sean únicamente nombres dentro de ventanas.

### Regla

Una persona puede modificar una jornada de cuatro maneras:

- pedir ayuda;
- acompañar;
- cubrir una actividad;
- ofrecer una oportunidad.

Cada ficha usa retrato o silueta, color de relación y un solo icono de intención.
No mostrar más de dos personas simultáneas sobre el tablero.

### Animación exacta

1. La ficha entra desde el borde relacionado: casa, trabajo o negocio.
2. Recorre una trayectoria corta de 300 ms hasta la casilla.
3. Al llegar, la casilla amplía su margen interno 4 px; nada se superpone.
4. Si se acepta, la ficha se acopla al borde con un clic visual de 140 ms.
5. Si se rechaza, regresa por la misma ruta en 240 ms, sin animación de castigo.
6. Cuando la relación cambia, un pequeño vínculo viaja al indicador de red.

---

## 14. Reacciones ante imprevistos

### Objetivo

Convertir dinero, cuerpo, experiencia y red en soluciones visibles.

### Respuestas posibles

| Recurso | Icono de reacción | Ejemplo |
|---|---|---|
| dinero/ahorro | billetera | pagar reparación |
| cuerpo | brazo | resolver personalmente |
| experiencia | herramienta o libro | encontrar una solución |
| red | dos manos | pedir ayuda |
| reorganización | flechas | mover una jornada |
| seguro | escudo | cubrir una parte |

Solo aparecen respuestas disponibles. Cada botón lleva icono, costo y máximo
cuatro palabras.

### Animación exacta

1. Los botones salen radialmente desde la casilla afectada hasta una distancia
   máxima de 56 px en 220 ms.
2. Al elegir, los demás botones se repliegan en 120 ms.
3. El icono elegido entra en la casilla en 180 ms.
4. La marca del problema se parte o cambia de color durante 260 ms.
5. El recurso utilizado disminuye al mismo tiempo mediante una transición
   numérica de 300 ms.

No mostrar una rueda radial si hay menos de tres opciones; usar botones en fila.

---

## 15. Meses con identidad propia

### Objetivo

Que el calendario afecte el tablero sin construir una pantalla nueva para cada
temporada.

### Variaciones sugeridas

| Momento | Cambios |
|---|---|
| enero | matrículas, planificación, pagos acumulados |
| Semana Santa | descanso, turismo, ventas especiales |
| temporada de lluvia | transporte, vivienda y salud |
| feria local | actividades y demanda comercial |
| inicio de clases | papelería, transporte y tareas |
| fin de año | aguinaldo, regalos, reuniones y cierres |

### Animación exacta

1. Al abrir el mes aparece un motivo pequeño en la franja: gota, banderín,
   cuaderno o estrella.
2. El color ambiental cambia como máximo 8% respecto de la paleta base.
3. Una transición de 500 ms mezcla el ambiente anterior y el nuevo.
4. El motivo realiza una sola animación contextual:
   - lluvia: tres gotas;
   - feria: dos banderines que se tensan;
   - clases: una página que se abre;
   - fin de año: tres destellos.
5. Después queda completamente quieto.

No usar nieve, monedas estadounidenses ni decoraciones que no correspondan al
contexto guatemalteco.

---

## 16. Cierre mensual interactivo

### Objetivo

Que cerrar el mes siga siendo una decisión y no solo leer un recibo.

### Acción final

Después del resumen se ofrece una sola decisión, elegida según el estado:

- separar ahorro;
- pagar una deuda;
- reservar inventario;
- elegir qué problema continúa;
- agradecer o compensar ayuda;
- guardar una jornada aprendida como recuerdo.

La acción usa dos o tres botones. Nunca aparece si no hay una decisión
significativa.

### Animación exacta

1. Las ocho casillas reducen su escala a `0.92` en 260 ms.
2. Las huellas se iluminan en orden y alimentan las tres cifras del resumen.
3. La decisión final sube desde el espacio liberado en 280 ms.
4. Al confirmar, el recurso elegido viaja a ahorro, deuda, inventario o red.
5. Una hoja de calendario cubre el tablero de derecha a izquierda en 380 ms.
6. La hoja siguiente revela el nuevo mes sin pantalla negra intermedia.

La transición completa debe poder saltarse con un toque.

---

## 17. Memoria de hábitos

### Objetivo

Que el tablero reconozca patrones de varios meses sin añadir medidores visibles
permanentes.

### Patrones iniciales

- tres meses trabajando sin descanso suficiente;
- tres meses estudiando constantemente;
- negocio sin supervisión repetida;
- ahorro frecuente;
- uso continuo de crédito;
- ayuda habitual a familia o vecinos;
- recuperación constante de cuerpo.

### Resultado

Al detectar un patrón aparece una tarjeta corta con icono y una frase. Puede
abrir una oportunidad, advertencia o recuerdo. No debe presentarse como logro si
el hábito es perjudicial.

### Animación exacta

1. Al cierre, las casillas relacionadas de meses anteriores aparecen como tres
   miniaturas apiladas durante 300 ms.
2. Las miniaturas se alinean y comparten un mismo borde en 220 ms.
3. El icono del patrón emerge en el centro en 240 ms.
4. Las miniaturas se pliegan dentro de una tarjeta de recuerdo.
5. La tarjeta se guarda en la línea de vida o desaparece tras confirmar.

---

## 18. Comodines integrados al tablero

Los 30 comodines no deben sentirse como ventanas ajenas. Cuando salga uno:

1. la casilla se voltea y revela dos puertas, A y B;
2. cada puerta muestra un icono y texto de máximo cinco palabras;
3. la pregunta ocupa una línea, dos como máximo;
4. al elegir, la puerta seleccionada se abre;
5. el resultado aparece en una frase y los efectos viajan a sus indicadores.

### Animación exacta

1. Volteo de casilla: 280 ms con perspectiva muy ligera.
2. Entrada de A y B: 160 ms, desde lados opuestos.
3. Selección: la opción tocada crece a `1.04`; la otra baja a `0.96` y 60% de
   opacidad.
4. Apertura: 220 ms.
5. Resultado: fundido de 180 ms.
6. Efectos: iconos vuelan durante 300 ms.
7. La casilla queda con una huella de dos caminos, no con A/B permanente.

No usar ruleta, barajar cartas ni revelar probabilidades falsas. La emoción
viene de elegir entre dos opciones razonables.

---

## 19. Orden recomendado de implementación

### Entrega 1: el tablero comunica

1. Franja de estado vivo.
2. Pronóstico.
3. Huellas de resolución.
4. Transición del cierre mensual.

**Meta:** entender preparación y resultado mirando el tablero.

### Entrega 2: el tablero premia planificación

1. Combos.
2. Cadenas de esfuerzo.
3. Jornada flexible.
4. Ficha de reorganización.

**Meta:** permitir planes distintos sin crear una solución obligatoria.

### Entrega 3: el tablero reacciona

1. Eventos sobre casillas.
2. Reacciones por recursos.
3. Personas como fichas.
4. Jornadas compartidas.

**Meta:** que un imprevisto modifique el plan en lugar de reemplazarlo.

### Entrega 4: el tablero recuerda

1. Objetivos mensuales.
2. Meses estacionales.
3. Memoria de hábitos.
4. Comodines integrados visualmente.

**Meta:** que los meses formen una historia y no una repetición.

---

## 20. Presupuesto de movimiento y rendimiento

- Animar únicamente `transform` y `opacity` siempre que sea posible.
- No animar sombras grandes ni filtros de desenfoque sobre todo el tablero.
- Limitar partículas simultáneas a 12; celebraciones normales usan entre 3 y 6.
- No mantener más de dos bucles activos.
- Pausar animaciones cuando la pestaña no está visible.
- Mantener elementos interactivos reales en el DOM; las líneas decorativas
  pueden ir en un SVG superpuesto.
- Probar primero a 390 px de ancho y en un dispositivo de gama baja.
- No bloquear interacción mientras una animación de resultado termina.

---

## 21. Pruebas y criterios de aceptación

### Comprensión

- Una persona reconoce las jornadas pendientes y resueltas sin explicación.
- El pronóstico se entiende en menos de cinco segundos.
- Un evento deja claro qué casilla afecta.
- Los costos se ven antes de confirmar.
- Las opciones bloqueadas indican requisito exacto.

### Dificultad

- Reorganizar requiere como máximo dos toques después de activar la ficha.
- Resolver un evento requiere una decisión, no navegar varias pantallas.
- El modo tranquilo elimina toda presión de tiempo.
- Ninguna mecánica castiga por no leer un párrafo.
- Ningún bono es necesario para que una ruta siga siendo viable.

### Animación

- No hay desplazamientos inesperados bajo el dedo.
- Toda secuencia funcional termina en menos de un segundo.
- El tablero funciona con movimiento reducido.
- Ningún estado depende solo de color, sonido o vibración.
- Las animaciones mantienen al menos 30 FPS en el dispositivo objetivo.
- Tocar durante una celebración sigue respondiendo.

### Economía

- Los objetivos mensuales no son una fuente principal de dinero.
- Los combos entregan ventajas pequeñas.
- Una jornada flexible sin usar se pierde.
- La ficha de reorganización no duplica actividades.
- Un evento no cobra recursos que el jugador no tiene sin ofrecer alternativa.

---

## 22. Límites de diseño

No agregar al tablero:

- casillas de propiedad para cobrar renta;
- movimiento por tirar dados alrededor de un circuito;
- premios aleatorios sin decisión;
- más de una moneda secundaria;
- ventanas con varias páginas de instrucciones;
- animaciones permanentes en todas las casillas;
- cronómetro en deuda, migración, salud o familia;
- eventos que destruyen meses de progreso sin preparación posible;
- combinaciones secretas que obliguen a consultar una guía;
- tareas que exijan precisión de arrastre.

La identidad del tablero debe surgir de ver una vida organizada en ocho
jornadas, alterar el plan cuando Guatemala y la familia intervienen, y reconocer
al final del mes qué decisiones ayudaron y cuáles cobraron su costo.
