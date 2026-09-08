# Pendiente

Estado al 7 de septiembre de 2026. Lo que sigue está ordenado por lo que más
aporta al juego, no por lo que es más fácil.

---

## 0. Lo que se cerró hoy

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
- **El tycoon infló el patrimonio final de todas las rutas.** Antes de las
  mejoras, una vida atenta terminaba con Q1.6 millones; ahora, comprándolas,
  con Q3.0. La comparación entre rutas educativas sigue midiéndose limpia en
  `vidas-completas.js`, que no compra mejoras, pero conviene tenerlo presente al
  leer cualquier cifra de patrimonio: **hay dos economías**, la de quien invierte
  y la de quien no, y difieren en más del doble.
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
- **La suite completa ya tarda más de dos minutos**, por las corridas de 21
  semillas del balanceo, la escalera educativa y la salida del modo difícil. Si
  molesta, se puede bajar a 11 semillas sin perder mucha señal.
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
