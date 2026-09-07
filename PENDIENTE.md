# Pendiente

Estado al 7 de septiembre de 2026. Lo que sigue está ordenado por lo que más
aporta al juego, no por lo que es más fácil.

---

## 1. El mapa de zonas — decidido, no construido

**Es lo más grande que falta.** Las decisiones ya están tomadas y anotadas:

| Decisión | Respuesta |
|---|---|
| Qué zonas | **Las reales de la Ciudad de Guatemala** (1 a 25, más Mixco, Villa Nueva, Villa Canales, Santa Catarina Pinula) |
| Cómo entra | **Se suma** a los tres niveles de vivienda que ya existen; no los reemplaza. Eliges tipo de vivienda *y* zona |
| Qué cuesta vivir lejos | **Dinero y tiempo.** El tiempo consume energía y puede costarte una de las cuatro semanas del mes |
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
   los 18 vive con su familia y esa casa está en algún lado.

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
| Efectivo inicial | Q1,200 | `config.js` |
| Costo de enfermarse | Q450 | `config.js` |
| Gasto personal mensual | Q1,100 a Q1,300 | `config.js` |
| Aporte y gastos en casa familiar | Q400 y Q700 | `config.js` |
| Fuga de efectivo y riesgo de perderlo | 8 % mensual, 2 % | `config.js` |
| Capital para abrir tienda | Q8,000 | `trabajos.js` |
| Costo de vida en Estados Unidos | US$1,350 | `migracion.js` |
| Maestría en la universidad pública | Q20,000 al año | `carreras.js` |
| Penalización por retiro anticipado de la pensión | 25 % | `largoplazo.js` |

Las dos últimas ya se buscaron y **no se encontró nada publicado**. Las demás no se
han buscado todavía.

---

## 5. Deuda técnica menor

- **La prueba bilingüe no ve los textos que pasan por variable.** Los cinco pasos
  del tutorial se traducen bien, pero el extractor solo detecta `T('literal')`, así
  que están agregados a mano y nada vigila que sigan ahí. Si se agregan más textos
  por variable, hay que acordarse.
- **La suite completa ya tarda más de dos minutos**, por las corridas de 21
  semillas del balanceo, la escalera educativa y la salida del modo difícil. Si
  molesta, se puede bajar a 11 semillas sin perder mucha señal.
- **Las animaciones nuevas no están probadas.** jsdom no calcula estilos ni corre
  animaciones CSS, así que la suite confirma que el HTML sale bien pero no que se
  vea bien. Eso necesita ojos en un navegador de verdad.

---

## 6. Lo que te toca a ti y no puedo hacer yo

Los tres pasos de GitHub, escritos en el `README.md`: crear el repositorio vacío,
conectar el remoto y hacer push, y activar Pages sobre `main` en la raíz. No está
instalada la herramienta de línea de comandos de GitHub en esta máquina.
