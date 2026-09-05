# Mi Primer Quetzal — de los 18 a la jubilación

Documento de diseño, versión 1.0 — 4 de septiembre de 2026

Simulador de vida financiera para aprender a usar productos bancarios.
Banco ficticio: **Banco Cardamomo**. País: Guatemala. Moneda: Quetzal (Q).

> Los valores numéricos de este documento provienen de `investigacion-economia-guatemala.md`.
> Las cifras marcadas **[E]** son estimaciones de diseño y necesitan tu validación.

---

## 1. Qué es el juego

El jugador toma a una persona de 18 años recién graduada de diversificado, sin cuenta
bancaria y sin trabajo, y la acompaña hasta la jubilación a los 65. En el camino decide si
estudia o trabaja, dónde vive, qué hace con las remesas que le manda su hermano desde
Estados Unidos, cuándo abrir una cuenta, cuándo pedir prestado y a quién.

No hay forma de perder. Hay formas de llegar a los 65 con muy poco.

La tesis pedagógica es que las lecciones financieras no se enseñan, se sufren. El juego
nunca dice "debiste ahorrar". Muestra que el jugador pagó Q1,800 en intereses de mora ese
año y le recuerda que eso era el enganche de su moto.

## 2. Audiencia y plataforma

| Aspecto | Decisión |
|---|---|
| Audiencia | Jóvenes de 16 a 25 años, público general |
| Dispositivo | Celular primero, vertical, táctil |
| Idioma | Español e inglés, con detección automática y selector |
| Distribución | GitHub Pages, sitio estático, sin cuenta ni registro |
| Tecnología | HTML, CSS y JavaScript puros, sin framework ni compilación |
| Estilo | Plano y moderno, con emojis e íconos. Tono cercano y con humor |

El inglés es traducción literal. El contexto sigue siendo Guatemala y la moneda sigue
siendo el Quetzal. Sirve para la diáspora y para mostrar el proyecto.

## 3. Bucle de juego

Un turno es un **mes** y contiene **cuatro espacios**, uno por semana. Cada espacio se
asigna a una actividad. Al cerrar el mes se cobra el salario, se descuentan los gastos
fijos, se aplican intereses y se resuelven los eventos.

Actividades que consumen espacios:

| Actividad | Energía por espacio |
|---|---|
| Trabajar | -12 |
| Estudiar | -10 |
| Minijuego | -12 |
| Descansar | +45 |

El sueldo se paga **según cuántas semanas trabajaste**, y no de forma proporcional:

| Semanas trabajadas | Sueldo que cobras |
|---|---|
| 4 | 100% |
| 3 | 70% |
| 2 | 45% |
| 1 | 20% |

Esta tabla es el corazón del juego. Estudiar y descansar cuestan sueldo, y la penalización
es peor que proporcional, así que dejar de trabajar duele de verdad.

El balanceo se calibró simulando 24 meses con cinco estrategias distintas. Trabajar las
cuatro semanas todos los meses agota la energía, provoca enfermedades y **termina peor** que
trabajar tres y descansar una: quemarse no puede ser la estrategia ganadora.

### Compresión temporal

Cuatrocientos setenta y siete meses son demasiados turnos para un celular. El juego cambia
de escala según la etapa de vida.

| Edad | Escala del turno | Turnos |
|---|---|---|
| 18 a 30 | Mensual | 144 |
| 30 a 45 | Trimestral | 60 |
| 45 a 65 | Anual | 20 |

Total: **224 turnos**. Además existe un botón de **adelantar** que salta hasta el próximo
evento o decisión pendiente. Adelantar cinco años y ver el salto del saldo es la
demostración más contundente del interés compuesto que puede dar el juego.

## 4. Recursos del jugador

- **Dinero**: efectivo en mano y saldos por producto, separados.
- **Energía**: de 0 a 100. Bajo 20 hay riesgo de enfermedad, que cuesta dinero y turnos.
- **Edad**: avanza con el calendario, visible siempre.
- **Puntaje de crédito**: de 0 a 100, con medidor en pantalla.
- **Experiencia**: años acumulados en cada empleo, sube el salario dentro del puesto.

No hay ánimo ni felicidad. El juego trata de dinero.

## 5. Estado inicial

| Concepto | Valor |
|---|---|
| Edad | 18 años, recién graduado de diversificado |
| Efectivo | Q1,200 de regalo de graduación |
| Vivienda | Casa familiar, aporta Q400 al mes |
| Cuenta bancaria | Ninguna |
| Trabajo | Ninguno |
| Puntaje de crédito | 0, sin historial y sin fiador |
| Remesa | Un hermano en Estados Unidos manda entre US$150 y US$200 cada dos o tres meses, irregular |

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

| Ruta | Duración | Costo público | Costo privado |
|---|---|---|---|
| Ninguna | — | — | — |
| Técnico | 2 años | Q0 (USAC) | Q13,726 al año |
| Licenciatura administrativa | 5 años | Q0 (USAC) | Q29,200 al año [V-sec] |
| Licenciatura en ingeniería | 5 años | Q0 (USAC) | Q77,054 al año |
| Maestría | 2 años, requiere licenciatura | Q40,000 total [E] | Q48,000 total [V] |

La universidad pública es **gratuita desde 2026**, sin inscripción ni matrícula. El dilema
del estudio no es de dinero, es de **tiempo**: cada espacio en la universidad es un espacio
que no trabajas.

### Empleos

| # | Empleo | Requisito | Salario base | Varianza |
|---|---|---|---|---|
| 1 | Repartidor en moto | Ninguno | Q2,800 | Baja |
| 2 | Dependiente de tienda | Ninguno | Q3,000 | Baja |
| 3 | Ayudante de construcción | Ninguno | Q2,600 | Media |
| 4 | Vendedor por comisión | Ninguno | Q1,800 más comisión | **Alta** |
| 5 | Agente de call center bilingüe | Inglés | Q4,500 | Baja |
| 6 | Tienda propia | Capital Q8,000 | Variable | **Muy alta** |
| 7 | Auxiliar contable | Técnico | Q4,000 | Baja |
| 8 | Técnico en refrigeración | Técnico | Q4,800 | Media |
| 9 | Soporte de sistemas | Técnico | Q5,200 | Baja |
| 10 | Docente | Licenciatura | Q4,200 | Baja |
| 11 | Contador | Licenciatura | Q6,000 | Media |
| 12 | Ingeniero junior | Licenciatura | Q7,500 | Media |
| 13 | Gerente o especialista | Maestría | Q12,000 | Media |

Salarios base [E], calibrados sobre las medianas por nivel educativo.

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
    config.js       economía, tiempo, energía, vivienda, productos
    trabajos.js     los trece empleos
    carreras.js     rutas de estudio y mercado laboral
    creditos.js     préstamo, tarjeta, prestamista, puntaje, fiador
    eventos.js      eventos de vida y promociones
    glosario.js     los dieciséis términos
    textos.en.js    la traducción al inglés completa
  js/
    idioma.js       detección, selector y las funciones T, D y K
    sonido.js       efectos generados por el navegador
    motor.js        estado, turnos, economía, estudio, crédito, reportes
    ui.js           pantallas, pestañas y tarjetas
    minijuegos/
      marco.js      cronómetro, marcador y pago
      reparto.js  tienda.js  estafas.js  presupuesto.js  caja.js
  docs/
```

### Cómo funciona el bilingüe

**La clave de cada texto es la frase en español.** `T('Banco')` devuelve `'Bank'` en inglés
y `'Banco'` si falta la traducción, así que una traducción incompleta nunca rompe el juego.
Las frases con números usan marcadores: `T('Trabajas {0} de 4 semanas', 3)`.

Los nombres y descripciones de empleos, carreras, eventos y minijuegos se traducen por
identificador con `D(objeto, campo)`. El glosario, las viviendas y los productos, por clave
con `K(grupo, clave)`. Agregar un idioma es escribir un diccionario nuevo sin tocar código.

El español se escribió completo primero y se tradujo de una sola pasada, tal como se
acordó, para no duplicar trabajo a medias.

## 17. Alcance original

**Versión 1**: cuenta monetaria, cuenta de ahorro, depósito a plazo, remesas, préstamo
personal, tarjeta de crédito, prestamista informal, historial de crédito y fiador. Cinco
minijuegos. Trece empleos, cinco rutas de estudio. Arco completo de los 18 a los 65.

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
| Gasto total en cuarto compartido | Q3,250 al mes | config |
| Gasto total en apartamento | Q5,500 al mes | config |
| Ingreso exigido para el cuarto | Q4,000 | config |
| Ingreso exigido para el apartamento | Q7,500 | config |
| Remesa del hermano | US$150 a US$200 cada 2 o 3 meses | config |
| Tipo de cambio | Q7.70 por dólar | config |
| Prima por informalidad | 15% más de ingreso en mano | config |
| Fuga del efectivo | 8% mensual, tope Q400 | config |
| Riesgo de perder el efectivo | 2% al mes, se va el 40% | config |
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
| Turno con cuatro semanas y pago según semanas trabajadas | listo |
| Compresión temporal y envejecimiento hasta los 65 | listo |
| Energía, agotamiento y enfermedad con faltas al trabajo | listo |
| Trece empleos con eje formal e informal y experiencia | listo |
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
- **Interfaz bilingüe**: las cinco pestañas se dibujan en ambos idiomas, en todos los
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

Seis suites de prueba corren con `node pruebas/todas.js` y suman **157 comprobaciones**.
Todas pasan, y son deterministas.

| Suite | Qué cubre |
|---|---|
| Balanceo | Cinco estrategias a 24 meses, para ver si algún incentivo quedó al revés |
| Vidas completas | Cuatro partidas de 224 turnos hasta la jubilación |
| Ciclo de crédito | Fiador, garantía, puntaje, mora, tarjeta y prestamista |
| Largo plazo | Hipoteca, pensión, los tres orígenes y la migración completa |
| Interfaz bilingüe | Las cinco pestañas en ambos idiomas y en todos los estados |
| DOM real | Una partida jugada de verdad, tocando botones en un navegador simulado |

Las cinco primeras usan un DOM mínimo escrito a mano, que sirve para ver que las vistas se
dibujan pero no ejercita lo que de verdad puede romperse. La sexta carga el `index.html`
real con jsdom y juega: elige origen, acepta un empleo, abre una cuenta, reparte las
semanas, cierra el turno, mueve dinero en una ventana con campo numérico, cambia de idioma,
abre el glosario y juega un minijuego esperando sus temporizadores. Es la única que
necesita `npm install`, y si falta jsdom se salta sola.

### Las cinco fallas que encontraron las pruebas

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

Una sexta falla estaba en las pruebas y no en el juego: forzar el azar desde fuera no
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
   resolvió con compresión por etapa de vida y botón de adelantar.
2. El ingreso mediano nacional deja Q17 de margen sobre la canasta ampliada, lo que haría
   el juego matemáticamente imposible de ganar. Se resolvió situando al jugador en el
   escenario formal urbano y convirtiendo el escenario mediano en el modo difícil.
