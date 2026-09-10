# Cómo crecer el tablero del mes

Guía para agregar **situaciones, dificultades, comodines, viajes en el tiempo y
tareas** sin romper nada y sin tener que leerse el motor.

Está escrita para que la siga otra persona —o otra IA— sin más contexto que
este archivo. Todo lo que hay que tocar vive en **`datos/tablero.js`**, que se
edita sin saber programar: son listas de objetos con campos en español.

> **La regla que manda sobre todas las demás.** El tablero es lo que le pasa a
> un chico de 13 a 65 años en Guatemala. Cada línea que agregues tiene que
> poder pasarle a alguien de verdad, y tiene que poder pasarle **a este
> jugador en este momento**. Una situación que no le puede pasar no es
> contenido: es un error con buena redacción.

---

## Lo primero: por qué hay tan pocas de cada cosa

Porque se repiten. Un mes son ocho o nueve tiradas y una partida son 156
turnos: con siete dificultades, el jugador ve la misma tres veces el primer
año. **Que no se repita es la mitad del trabajo**, y por eso este archivo
existe.

Estado al escribir esto:

| Cosa | Cuántas hay | Dónde |
|---|---|---|
| Tipos de día (casillas) | 8 | `TABLERO_CASILLAS` |
| Dificultades | 21 | `TABLERO_DIFICULTADES` |
| Comodines (A/B) | 8 | `TABLERO_COMODINES` |
| Viajes en el tiempo | 6 | `TABLERO_VIAJES` |
| Tareas (minijuegos) | 15 | `js/minijuegos/` |

Lo que más falta, por orden de lo que más se nota jugando:

1. **Comodines.** Son los que el jugador recuerda y solo hay ocho. Deberían
   ser treinta.
2. **Dificultades de trabajo y de familia.** Las 21 de ahora son de estudiante
   y de casa; falta lo que le pasa a alguien de 30 con un negocio y dos hijos.
3. **Viajes en el tiempo.** Seis textos. Cuestan una línea cada uno.

---

## La condición `si`: a quién le puede salir

Esto es lo que más se olvida y lo que peor se ve. Las casillas, las
dificultades y los comodines aceptan un campo `si` con **una** de estas tres
palabras:

| `si` | Sale solo si… | Úsalo en |
|---|---|---|
| `'estudia'` | está inscrito en algo | todo lo que hable de tareas, exámenes, clases, cuadernos |
| `'trabaja'` | tiene empleo | todo lo que hable del jefe, la herramienta, el uniforme, el turno |
| `'dinero'` | ya maneja dinero **y le alcanza** | todo lo que quite quetzales |

Sin `si`, sale siempre.

**Por qué existe:** un comodín decía *"hay partido en la cancha y tienes tarea
pendiente"* a un jugador que había decidido no estudiar. No tenía ninguna tarea
pendiente. Elegir entre dos cosas cuando una de las dos no existe no es una
decisión, es un error.

`'dinero'` además comprueba que **le alcance**: una dificultad de Q350 no le
sale a quien tiene Q80. Y en la etapa de colegio devuelve `false` siempre,
porque a los trece la pantalla todavía no habla de quetzales.

---

## Agregar una DIFICULTAD

Una dificultad es algo que te pasa. **No se elige**: se aplica y se cuenta.

```js
{ id: 'dif_taxi',
  texto: 'Se te hizo tarde y te tocó pagar taxi.',
  energia: -6,
  dinero: -90,
  si: 'dinero' }
```

| Campo | Qué es |
|---|---|
| `id` | único, empieza por `dif_`. Es la clave de la traducción. |
| `texto` | lo que lee el jugador. Una frase, en voz de la calle. |
| `energia` | negativo. Lo que cuesta de cuerpo. |
| `dinero` | negativo, opcional. **Pide `si: 'dinero'` o `si: 'trabaja'`.** |
| `experiencia` | negativo, opcional. **Pide `si: 'estudia'`.** |

**Rangos que no desbalancean** (medidos contra 100 de energía y los sueldos de
`datos/trabajos.js`):

- `energia`: entre −4 y −16. Más de −20 y el mes se vuelve injugable.
- `dinero`: entre −75 y −400. Más de −500 se come el sueldo de una semana.
- `experiencia`: entre −8 y −16. Ver el truco de abajo antes de subirlo.

### El truco de la experiencia (léelo antes de escribir una)

**Lo que sabes no se puede deber.** Si una dificultad quita 12 de experiencia y
el jugador solo tiene 5, los 7 que faltan **se cobran en otra moneda**:

```
falta × 3   en dinero        (CONFIG.experiencia.deuda.dinero)
falta × 0.5 en cuerpo        (CONFIG.experiencia.deuda.energia)
```

Es decir: 7 que faltan son **Q21 y 4 de cuerpo**. Es la parte del juego que
castiga más al que no ha estudiado nada, que es justo al que le tiene que
doler. La ventana se lo explica sola (`avisoDeDeuda` en `js/ui.js`), así que no
hace falta que lo digas en el texto.

---

## Agregar un COMODÍN

Dos puertas, A y B, y **ninguna dice lo que va a pasar**.

```js
{
  id: 'com_prestamo',
  si: 'trabaja',
  pregunta: 'Un compañero te pide prestado hasta la quincena.',
  a: { texto: 'Prestarle',
       resultado: 'Te pagó a los tres días. Ahora te debe un favor.',
       efecto: { dinero: -200, experiencia: 3 } },
  b: { texto: 'Decir que no',
       resultado: 'Te miró raro una semana.',
       efecto: {} }
}
```

**La regla de oro del comodín:** los dos lados tienen que sonar razonables. Un
comodín donde una opción es obviamente la buena no es un comodín, es un examen,
y el jugador aprende a contestar el examen en vez de a decidir. Escríbelo así:
si tú no sabrías cuál elegir, está bien.

La mitad de los comodines deberían premiar la opción prudente y la otra mitad
premiarla a medias. Si todos premian la prudencia, no hay nada que decidir.

`efecto` acepta `energia`, `dinero` y `experiencia`, y puede estar vacío (`{}`):
que no pase nada también es un resultado.

---

## Agregar un VIAJE EN EL TIEMPO

La casilla rara: la única que **solo da**. Cae poco (peso 3) y cuando cae, el
jugador se acuerda. Agregar uno es escribir una línea:

```js
{ id: 'via_espejo', texto: 'Te viste en el espejo con diez años más y te dio consejos.' }
```

**Lo que da no se escribe aquí y no hay que tocarlo**: lo sortea
`sortearViaje()` en `js/motor.js` y depende de lo que el jugador ya tenga.

- **dinero**: entre 5% y 20% de lo suyo, y solo si ya maneja dinero. Va en
  porcentaje y no en cifra fija porque una cifra fija o no se nota a los
  cuarenta o rompe el juego a los quince.
- **experiencia**: entre 4 y 15, solo si está estudiando.
- **cuerpo**: entre 0 y 100, siempre. Puede no darte nada.

Si algún día hace falta un viaje que **quite** en vez de dar, el sitio es
`sortearViaje()`, no los datos.

---

## Agregar un TIPO DE DÍA (casilla)

Esto ya es tocar el motor: cada tipo nuevo necesita que `abrirCasilla()` en
`js/ui.js` sepa qué ventana abrirle. Los ocho que hay cubren casi todo; antes
de agregar uno, mira si lo que quieres no es una dificultad o un comodín.

Si aun así hace falta, lo mínimo es:

1. La entrada en `TABLERO_CASILLAS` con su `peso` por etapa (`colegio` y
   `trabajo`), su `icono` y, si toca, su `si` o su `requiere`.
2. En `js/ui.js`: `ICONO_CASILLA`, `CLASE_CASILLA`, `OBJETO_CASILLA`,
   `etiquetaDeCasilla()`, `precioDeCasilla()` y `ANIMO_CASILLA`.
3. En `css/estilo.css`: una línea `.c-loquesea { --tinte: #color; }`.
4. En `js/motor.js`: el sorteo de su contenido en `sortearContenido()`.

---

## Agregar una TAREA

Las tareas del colegio son **minijuegos** y viven en `js/minijuegos/`. Cada
archivo es uno. Para agregar uno hay que registrarlo en tres sitios:
`index.html`, `pruebas/comun.js` y `pruebas/vista.html`.

`pruebas/minijuegos-valen.js` comprueba que lo que paga cada uno esté a la
altura de la jornada que cuesta. Si tu minijuego no pasa esa prueba, el
problema es el minijuego.

---

## Antes de dar por buena tu línea

1. **Tradúcela.** El juego es bilingüe y la clave es el id:
   ```js
   X.tablero_dificultad = { dif_taxi: 'You were running late and had to pay for a taxi.' };
   X.tablero_viaje = { via_espejo: '…' };
   ```
   en `datos/textos.en.v2.js`. Ver ahí los grupos que ya existen.
2. **Corre las pruebas**: `npm test`. La que te va a atrapar es
   `pruebas/tablero.js`, que comprueba que las condiciones estén bien puestas,
   que ninguna dificultad regale nada y que nada cobre lo que el jugador no
   tiene.
3. **Míralo con los ojos**: `pruebas/vista.html?nino=1&p=casa&tirada=carta`
   tira el dado hasta caer en un día que pregunte algo.

---

## Lo que falta y no es tuyo (todavía)

Cosas que este archivo NO cubre y que están apuntadas en `PENDIENTE.md`:

- Los **comodines no están traducidos** al inglés (40 cadenas). Las
  dificultades y los viajes sí.
- Las tareas **no distinguen carrera**: un estudiante de ingeniería hace las
  mismas que uno de bachillerato.
- No hay dificultades que dependan de la **edad** ni del **número de negocios
  abiertos**. La condición `si` acepta tres palabras; agregar una cuarta es
  tocar `cumpleCondicion()` en `js/motor.js`, y son cuatro líneas.
