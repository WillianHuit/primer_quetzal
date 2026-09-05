# Investigación: Economía y finanzas personales en Guatemala

**Propósito:** calibrar la economía de un juego educativo de finanzas personales con cifras reales de Guatemala.
**Fecha de la investigación:** 4 de septiembre de 2026.
**Moneda:** quetzal (Q / GTQ).

## Cómo leer este documento

Cada cifra lleva una etiqueta:

- **[V]** = **Verificado**. Dato tomado de una fuente identificada (institución o publicación), con la fecha del dato. La fuente está enlazada.
- **[E]** = **Estimación**. Cálculo, rango o inferencia propia. No es un dato oficial. Se explica de dónde sale.

> **Advertencia sobre fuentes secundarias:** los portales de estilo expat (livinginguatemala.com), los agregadores de precios (Expatistan, Numbeo, preciosmundi) y los índices de bolsas de empleo (Computrabajo) **no son fuentes primarias**. Se usan cuando no existe estadística oficial, y van marcados como **[V-sec]** (verificado contra fuente secundaria). Sus rangos de "costo de vida" suelen reflejar hogares expatriados de alto gasto, no a un joven guatemalteco promedio.

## Contexto macro (marco de referencia del juego)

| Indicador | Valor | Etiqueta |
|---|---|---|
| Tipo de cambio de referencia | **Q7.62635 por US$1** (4 sep 2026) | [V] [Banguat](https://www.banguat.gob.gt/cambio/tctemp.asp) |
| **Inflación interanual** | **2.70 %** (julio 2026); fue 0.96 % en enero 2026 | [V] Banguat / INE |
| Meta de inflación Banguat | 4 % ± 1 pp | [V] Banguat |
| **Tasa líder de política monetaria** | **3.50 %** (decisión unánime del 26 ago 2026) | [V] Banguat |
| Crecimiento del PIB | 4.1 % cierre 2025; **proyección 2026 revisada al alza a 4.3 %** | [V] Banguat |
| Población ocupada | ~8.0 millones (de una PEA de 8.2 M) | [V] [INE, ENEIC-T2 2025](https://www.ine.gob.gt/eneic/) |
| **Tasa de informalidad** | **66.2 %** de los ocupados (5.3 millones) | [V] INE, ENEIC-T2 2025 |
| Desempleo abierto | 2.2 % (T2 2025); 2.2 % (T1 2026) | [V] INE, ENEIC |
| Cotizantes activos al IGSS | **1,742,810** trabajadores (cierre 2025) | [V] [IGSS](https://www.igssgt.org/noticias/2026/08/17/la-masa-cotizante-del-igss-crecio-un-29-en-los-ultimos-seis-anos/) |
| Cobertura de seguridad social | **~22 %** de los ocupados (1.74 M / 8.0 M) | [E] cálculo propio con las dos cifras anteriores |
| Pobreza total | **56.0 %** de la población (16.2 % extrema) | [V] [INE, ENCOVI 2023](https://www.ine.gob.gt/2024/08/21/el-ine-presenta-cifras-de-pobreza-en-guatemala/) |

**Implicación de diseño para el juego:** dos de cada tres trabajadores guatemaltecos están en la informalidad, no cotizan al IGSS y no están cubiertos por el salario mínimo. Un juego realista debería permitir esa ruta (trabajo informal / cuenta propia) y no solo la del empleo formal.

---

## 1. Salarios

### 1.1 Salario mínimo vigente

Guatemala fija el salario mínimo por **actividad económica** y por **circunscripción económica**:

- **CE1** = departamento de Guatemala.
- **CE2** = el resto del país (21 departamentos).

**Salario mínimo 2026 — Acuerdo Gubernativo 256-2025** (publicado 22 dic 2025, vigente desde el 1 de enero de 2026). Montos mensuales **ya con la bonificación incentivo de Q250** incluida:

| Circunscripción | Agrícola | No agrícola | Exportadora y maquila |
|---|---|---|---|
| **CE1** (dep. Guatemala) | **Q4,041.20** | **Q4,252.28** | **Q3,659.73** |
| **CE2** (resto del país) | **Q3,875.89** | **Q4,066.90** | **Q3,471.10** |

[V] — [IIES-USAC, Boletín "Economía al día" No. 2, feb 2026, Tabla 1](https://iies.usac.edu.gt/wp-content/uploads/2026/03/Boletin-Economia-al-dia-No.-2-febrero-2026.pdf), con base en Mintrab; corroborado por [EY Centroamérica](https://www.ey.com/es_ce/technical/tax/tax-alerts/guatemala-salario-minimo-2026) y [AGN](https://agn.gt/asi-quedan-los-montos-del-salario-minimo-para-el-2026/).

Desglose del componente:

| Concepto | CE1 no agrícola 2026 |
|---|---|
| Salario diario | Q131.58 [V] |
| Salario mensual base (30 días) | Q4,002.28 [V] |
| Bonificación incentivo (Decreto 78-89) | Q250.00 [V] |
| **Total mensual** | **Q4,252.28** [V] |

**Incrementos aplicados en 2026:** +7.5 % no agrícola, +5.5 % agrícola, +4.0 % exportación y maquila. [V] IIES-USAC / Mintrab.

**Serie histórica (mensual, con bonificación incentivo):**

| Año | CE | Agrícola | No agrícola | Exportación y maquila | Acuerdo Gub. |
|---|---|---|---|---|---|
| 2024 | CE1 | Q3,516.86 | Q3,634.59 | Q3,343.01 | 307-2023 |
| 2024 | CE2 | Q3,374.42 | Q3,477.82 | Q3,171.90 | 307-2023 |
| **2025** | **CE1** | **Q3,843.55** | **Q3,973.05** | **Q3,528.59** | **264-2024** |
| **2025** | **CE2** | **Q3,686.86** | **Q3,800.60** | **Q3,347.21** | **264-2024** |
| 2026 | CE1 | Q4,041.20 | Q4,252.28 | Q3,659.73 | 256-2025 |
| 2026 | CE2 | Q3,875.89 | Q4,066.90 | Q3,471.10 | 256-2025 |

[V] — IIES-USAC feb 2026, Tabla 1 (datos de Mintrab).

### 1.2 La bonificación incentivo (Q250)

- Es un pago mensual **obligatorio** adicional al salario base para todo trabajador de jornada completa (Decreto 78-89). [V]
- **No** está afecta a IGSS. [V] — [Vesco Consultores, guía ISR 2026](https://vescco.tax/blog/como-calcular-el-isr-2026-en-guatemala-guia-tecnica-y-calculadora/)
- **Sí** entra en la base del ISR. [V] — misma fuente.
- **No** se computa para calcular aguinaldo, Bono 14 ni indemnización. [V]

**Detalle importante para el juego:** el salario nominal que un trabajador guatemalteco ve en una oferta de empleo suele ser "Q4,000 + Q250 de bono". Ese Q250 vale menos de lo que parece porque no alimenta las prestaciones anuales.

### 1.3 Salario bruto vs. salario neto — el "14.º sueldo doble"

| Concepto | Regla | Etiqueta |
|---|---|---|
| **Descuento IGSS (trabajador)** | **4.83 %** sobre salario ordinario y extraordinario. No aplica a bonificación incentivo, aguinaldo ni Bono 14 | [V] [Vesco](https://vescco.tax/blog/como-calcular-el-isr-2026-en-guatemala-guia-tecnica-y-calculadora/) |
| **ISR asalariados** | 5 % hasta Q300,000 de renta imponible anual; 7 % sobre el excedente | [V] misma fuente |
| **Deducción personal ISR 2026** | Q48,000 (Art. 72) + Q3,024 (Art. 4, Decreto 13-2026) = **Q51,024** anuales | [V] misma fuente |
| **Aguinaldo** (Decreto 76-78) | 1 sueldo ordinario al año. Período de cómputo: 1 dic – 30 nov. Se paga **50 % en la primera quincena de diciembre y 50 % en la segunda quincena de enero** | [V] [Finiquito Justo](https://finiquitojusto.com/guias-de-finiquito-y-liquidacion/guatemala/aguinaldo-bono-14-guatemala/) |
| **Bono 14** (Decreto 42-92) | 1 sueldo ordinario al año. Período de cómputo: 1 jul – 30 jun. Se paga **en un solo desembolso, antes del 15 de julio** | [V] [Prensa Libre](https://www.prensalibre.com/economia/cuando-es-el-ultimo-dia-para-pagar-el-bono-14-en-guatemala-en-2026-y-como-calcularlo/) |
| Proporcionalidad | Si no se cumplió el año completo: (sueldo base × días trabajados) / 365 | [V] misma fuente |
| Aguinaldo y Bono 14 | **Exentos de ISR** hasta el 100 % de un sueldo ordinario mensual; exentos de IGSS | [V] Vesco |

**Ejemplo trabajado [E] (cálculo propio con las reglas verificadas arriba):** trabajador formal en CE1 no agrícola, salario mínimo 2026.

| Línea | Monto |
|---|---|
| Salario base | Q4,002.28 |
| Bonificación incentivo | Q250.00 |
| Bruto | Q4,252.28 |
| (–) IGSS 4.83 % sobre Q4,002.28 | –Q193.31 |
| (–) ISR | Q0 (renta anual ≈ Q51,027 vs. deducción de Q51,024 → prácticamente exento) |
| **Neto mensual** | **≈ Q4,058.97** |
| Ingreso anual con Aguinaldo + Bono 14 | ≈ Q4,058.97 × 12 + Q4,002.28 × 2 ≈ **Q56,712** |
| **Ingreso mensual promedio real (14 pagos)** | **≈ Q4,726** |

**Implicación de diseño:** en Guatemala el año laboral tiene efectivamente **14 pagos**, no 12. Un juego que solo modele 12 sueldos subestima el ingreso anual en ~14 % y pierde el momento pedagógico clave: **julio (Bono 14), diciembre (50 % del aguinaldo) y enero (el otro 50 %)** son los tres momentos en que la gente decide entre ahorrar, pagar deudas o consumir. Son los tres puntos de decisión más importantes del calendario financiero guatemalteco.

### 1.4 Lo que realmente gana la gente (INE / ENEIC)

Este es el dato central y contradice la intuición: **el salario mínimo está por ENCIMA de lo que gana la mayoría**.

| Indicador de ingreso laboral mensual | Monto | Período | Etiqueta |
|---|---|---|---|
| **Promedio nacional, población ocupada** | **Q2,797** (US$376) | T1 2026 | [V] [INE, ENEIC T1-2026](https://www.infobae.com/guatemala/2026/07/05/el-instituto-nacional-de-estadisticas-reporta-que-el-ingreso-laboral-mensual-en-guatemala-promedio-llega-a-usd-376-en-2026/) |
| Promedio nacional | Q2,713 | T2 2025 | [V] [INE, Boletín ENEIC No.1](https://www.ine.gob.gt/wp-content/uploads/2026/02/Boletin-Estadistico-Edicion-No.1-ENEIC-2025-.pdf) |
| Promedio nacional | Q2,718 | T1 2025 | [V] misma fuente |
| Promedio nacional | Q2,592 | T4 2024 | [V] misma fuente |
| **Mediana nacional** | **Q2,300** | T2 2025 | [V] [IIES-USAC feb 2026](https://iies.usac.edu.gt/wp-content/uploads/2026/03/Boletin-Economia-al-dia-No.-2-febrero-2026.pdf) |
| Promedio hombres | Q3,042.27 (T2-2025) / Q3,113.35 (T1-2026) | | [V] IIES-USAC / INE |
| Promedio mujeres | Q2,176.06 (T2-2025) / Q2,281.02 (T1-2026) | | [V] IIES-USAC / INE |
| Mediana hombres | Q2,800 | T2 2025 | [V] IIES-USAC |
| Mediana mujeres | Q1,400 | T2 2025 | [V] IIES-USAC |

**Distribución del ingreso (percentiles, T2 2025)** — [V] IIES-USAC con microdatos ENEIC:

| Percentil | Ingreso mensual |
|---|---|
| P25 | menos de **Q1,000** |
| P50 (mediana) | **Q2,300** |
| P75 | menos de **Q3,600** |
| P90 | no supera **Q5,000** |
| P99 | menos de **Q12,000** |

Es decir: **solo el 1 % de los ocupados gana más de Q12,000 al mes**. Casos por encima de Q50,000 son el **0.02 %** de los ocupados. [V]

**Por formalidad** [V] IIES-USAC, ENEIC-T2 2025:

| Sector | Ingreso promedio | Ingreso mediano |
|---|---|---|
| **Formal** | Q4,222 | **Q3,600** |
| **Informal** | Q1,860 | **Q1,500** |

**Por dominio geográfico** [V] IIES-USAC, ENEIC-T2 2025:

| Dominio | Ingreso promedio |
|---|---|
| Urbano metropolitano (ciudad de Guatemala) | **Q3,901** |
| Resto urbano | Q2,772 |
| Rural | **Q1,986** |

**Asalariados formales del sector privado** (a quienes sí aplica el salario mínimo) [V] IIES-USAC:

| Estadístico | Monto |
|---|---|
| Promedio | Q3,776.87 |
| Mediana | Q3,500.00 |
| P25 | Q2,600 |
| P75 | Q4,000 |
| P90 | Q5,500 |
| Mediana empleado de empresa privada | Q3,614 |
| Mediana jornalero/peón | Q2,160 |

### 1.5 Ingreso por nivel educativo — el retorno educativo real

**Este es el dato más importante para un juego educativo, y es contraintuitivo.** Medianas de ingreso mensual del **sector formal**, ENEIC-T2 2025:

| Nivel educativo | Mediana mensual | Salto vs. nivel anterior | Etiqueta |
|---|---|---|---|
| **Sin educación formal** | hasta **Q2,400** | — | [V] |
| **Primaria completa** | ~**Q3,000** | +Q600 (+25 %) | [V] |
| **Básico (3.º básico)** | **Q3,325** | +Q325 (+11 %) | [V] |
| **Diversificado (bachiller/perito)** | hasta **Q3,800** | +Q475 (+14 %) | [V] |
| **Superior (licenciatura)** | **Q4,300** | **+Q500 (+13 %)** | [V] |
| **Maestría** | **Q10,000** | **+Q5,700 (+133 %)** | [V] |
| **Doctorado** | **Q12,500** | +Q2,500 (+25 %) | [V] |

Todos [V] — [IIES-USAC, Boletín No. 2, feb 2026](https://iies.usac.edu.gt/wp-content/uploads/2026/03/Boletin-Economia-al-dia-No.-2-febrero-2026.pdf), cálculos propios de la autora con microdatos ENEIC-T2 2025 del INE.

Datos complementarios:

- **Media** (no mediana) del nivel superior: **Q5,737.13** — muy por encima de la mediana de Q4,300 porque una minoría llega hasta Q99,000. [V]
- Solo el **0.7 %** de los mayores de 25 años tiene maestría y el **0.1 %** doctorado. [V]
- La mediana del universitario (Q4,300) apenas supera el salario mínimo no agrícola CE1 (Q4,252.28). [V]

**Implicación de diseño — la lección más valiosa del juego:**
El salto de bachiller a licenciatura vale solo **+13 % de ingreso mediano (+Q500/mes)**, mientras que el salto de licenciatura a maestría vale **+133 % (+Q5,700/mes)**. La licenciatura sola, en Guatemala, **no** garantiza salir de la franja del salario mínimo. El IIES lo dice explícitamente: "contar con un título universitario no garantiza ingresos significativamente superiores de quienes completaron la educación media", y esto "constituye un incentivo para la migración laboral de la población joven". Un juego honesto debe modelar ese retorno bajo — y hacer que el jugador descubra por qué tantos guatemaltecos jóvenes eligen migrar o emprender.

### 1.6 Ingreso por ciclo de vida

[V] IIES-USAC, ENEIC-T2 2025:

| Edad | Mediana de ingreso |
|---|---|
| Adolescencia–25 años | creciente, por debajo de Q3,000 |
| **26–29 años** | ~**Q3,000** (pico temprano) |
| 30–44 años | estable, con ligeras fluctuaciones, sin crecimiento sostenido |
| 45–50 años | inicio de descenso |
| 60+ años | por debajo de **Q2,000**, y sigue bajando |

**Implicación de diseño:** en Guatemala la curva de ingresos **se aplana a los ~28 años** y cae después de los 50. No hay el ascenso continuo por antigüedad que asume la mayoría de simuladores financieros anglosajones. El juego debe premiar el ahorro y la inversión temprana precisamente porque el ingreso laboral no crecerá solo.

### 1.7 Salarios por ocupación

**Advertencia:** el INE no publica salarios por ocupación específica. Las cifras siguientes vienen de **índices de bolsas de empleo** [V-sec], que agregan ofertas y autorreportes reales pero sobrerrepresentan el empleo formal urbano. Úsense como orden de magnitud, no como estadística oficial.

| Ocupación | Rango / promedio mensual | Etiqueta |
|---|---|---|
| **Agente de call center (español)** | Q3,500 – Q5,000 | [E] con base en el mínimo no agrícola + índices de mercado |
| **Agente de call center bilingüe** | **Q5,500** base (Alorica); hasta **Q9,000+** en cuentas premium con inglés avanzado | [V-sec] [SpeakEnglishGlobal](https://www.speakenglishglobal.com/post/salario-agente-bilingüe-call-center) |
| **Vendedor** | **Q4,196** promedio | [V-sec] [Computrabajo GT](https://gt.computrabajo.com/salarios/vendedor) |
| **Repartidor / motorista de reparto** | **Q3,762** promedio | [V-sec] [Computrabajo GT](https://gt.computrabajo.com/salarios/repartidor) |
| **Chofer / motorista** | Q4,000 – Q7,000 | [V-sec] Computrabajo GT vía [RRHH Guatemala](https://rrhh.com.gt/cuanto-gana-chofer-conductor-guatemala/) |
| **Piloto de camión (licencia pesada)** | Q6,000 – Q12,000 | [V-sec] misma fuente |
| **Albañil** | **Q3,920** promedio | [V-sec] [Computrabajo GT](https://gt.computrabajo.com/salarios/albanil) |
| **Maestro de obra** | **Q6,625** promedio | [V-sec] [Computrabajo GT](https://gt.computrabajo.com/salarios/maestro-de-obra) |
| **Maestro (docente)** | **Q4,796** promedio | [V-sec] [Computrabajo GT](https://gt.computrabajo.com/salarios/maestro) |
| **Auxiliar contable** | desde Q3,500 | [V-sec] RRHH Guatemala |
| **Contador general** | Q6,000 – Q12,000 | [E] interpolación entre auxiliar y CPA |
| **Contador Público y Auditor (CPA) / gerente financiero** | hasta **Q30,000+** en multinacionales y sector financiero | [V-sec] RRHH Guatemala |
| **Ingeniero (junior)** | Q6,000 – Q10,000 | [E] consistente con la media de nivel superior (Q5,737) y el P99 de Q12,000 |
| **Ingeniero (senior / jefatura)** | Q12,000 – Q25,000 | [E] percentil 99+ de la distribución ENEIC |
| **Emprendedor de tienda de barrio** | Q1,500 – Q4,000 de ganancia neta | [E] ver nota abajo |

**Nota sobre el emprendedor de tienda:** no existe estadística oficial de utilidad de una tienda de barrio. Lo verificado es que Guatemala tiene entre **110,000 y 115,000 tiendas de barrio y abarroterías**, que concentran **hasta el 50 % de las ventas de alimentos del país** [V-sec] [Gremab vía Prensa Libre](https://www.prensalibre.com/economia/tiendas-de-barrio-y-abarroterias-un-segmento-comercial-amplio-y-con-alta-demanda/). El rango de ganancia es **[E]**, anclado al ingreso mediano del **sector informal (Q1,500)** y al promedio informal (Q1,860) del INE, ya que la mayoría de estas tiendas opera informalmente.

**Bilingüismo — el multiplicador más rentable [V-sec]:** un contador bilingüe gana **15 %–30 % más**; un agente de call center bilingüe gana **2× a 3×** lo que un trabajador promedio del sector servicios. En términos de retorno por año invertido, aprender inglés supera con holgura al salto de bachiller a licenciado (+13 %). Vale la pena modelarlo en el juego como una inversión de capital humano separada de la carrera universitaria.

---

## 2. Costo de vida

### 2.1 Canastas oficiales del INE

El INE publica mensualmente la **Canasta Básica Alimentaria (CBA)** —solo comida— y la **Canasta Ampliada (CA)** —comida más vivienda, transporte, salud, educación y vestuario—, separadas en urbana y rural, y expresadas **por persona (per cápita)**.

| Canasta (per cápita mensual) | Ene 2026 | May 2026 | Jun 2026 | Jul 2026 |
|---|---|---|---|---|
| **CBA Urbana (CBAU)** | Q924.35 | Q941.86 | **Q943.14** | **Q945.74** |
| **CBA Rural (CBAR)** | Q713.40 | — | **Q727.14** | **Q730.23** |
| **Canasta Ampliada Urbana (CAU)** | Q2,237.85 | Q2,280.23 | **Q2,283.35** | — |
| **Canasta Ampliada Rural (CAR)** | Q1,403.97 | Q1,428.77 | **Q1,431.01** | — |

[V] — [INE, informe CBA junio 2026 (publicado julio 2026)](https://www.ine.gob.gt/sistema/uploads/2026/07/07/20260707110852iZwkJLBrcyCmachhwmugKt4pf6cK8kRg.pdf); julio 2026 vía [La Hora citando al INE](https://lahora.gt/lh-economia/jveliz/2026/08/07/el-costo-de-la-canasta-basica-alimentaria-urbana-sube-a-q945-74-en-julio-segun-el-ine/).

**Metodología clave (para no malinterpretar las cifras):**

- La CA se obtiene multiplicando la CBA por el **coeficiente de Orshansky**: **2.421** urbano y **1.968** rural, según la ENIGH 2022-2023. [V] INE.
- El **hogar de referencia** del INE es de **4.16 personas**. [V] INE.
- La CBA urbana cubre **2,052 kcal/día** (66 productos); la rural **2,172 kcal/día** (60 productos). [V] INE.
- Desde enero 2024 la CBA **incluye comidas y bebidas fuera del hogar** (Q207.70 de los Q943.14 urbanos en junio 2026, es decir el **22 %** de la canasta alimentaria). [V] INE.

**Cifras por hogar (4.16 personas):**

| Canasta por hogar mensual | Monto | Etiqueta |
|---|---|---|
| CBA Urbana × 4.16 (julio 2026) | **≈ Q3,934** | [V-sec] cálculo INE reportado; Q3,845–Q3,934 según el mes |
| **Canasta Ampliada Urbana × 4.16** (jun 2026) | **≈ Q9,499** | [E] cálculo propio: Q2,283.35 × 4.16 |
| Canasta Ampliada Rural × 4.16 (jun 2026) | ≈ Q5,953 | [E] cálculo propio |

### 2.2 El dato que define el juego

> **Ingreso laboral promedio individual (T1 2026): Q2,797.**
> **Canasta Ampliada Urbana per cápita (jun 2026): Q2,283.35.**

El INE mismo señala que el ingreso promedio "apenas supera el costo por persona de la canasta ampliada en el área urbana". [V] [INE vía Infobae](https://www.infobae.com/guatemala/2026/07/05/el-instituto-nacional-de-estadisticas-reporta-que-el-ingreso-laboral-mensual-en-guatemala-promedio-llega-a-usd-376-en-2026/)

Y con la **mediana** (Q2,300), el trabajador típico guatemalteco cubre su canasta ampliada urbana con un margen de **Q17 al mes**. Con el ingreso mediano informal (Q1,500), **no la cubre**.

**Implicación de diseño:** la capacidad de ahorro de un guatemalteco promedio soltero en la capital es del orden de **Q300–Q800 al mes** en el mejor escenario [E]. Un juego que ofrezca metas de ahorro de Q3,000/mes será percibido como fantasía. El realismo está en decisiones de Q50–Q500.

### 2.3 Presupuesto de una persona joven en ciudad de Guatemala

Los rangos siguientes combinan datos verificados de tarifas con **[E]** para las partidas sin fuente oficial. Están construidos para **un joven soltero guatemalteco**, no para un expatriado.

| Rubro | Escenario austero | Escenario medio | Escenario acomodado | Fuente/etiqueta |
|---|---|---|---|---|
| **Vivienda — cuarto en casa compartida (zonas 1, 5, 6, 7, 11, 12, 18)** | Q800 – Q1,500 | — | — | [E] |
| **Vivienda — apartamento pequeño zonas periféricas (1–7)** | — | Q2,300 – Q3,000 (US$300–400) | — | [V-sec] [LivingInGuatemala](https://livinginguatemala.com/guides/cost-of-living-guatemala/) |
| **Vivienda — apto. amueblado zonas periféricas** | — | Q2,700 – Q4,600 (US$350–600) | — | [V-sec] misma |
| **Vivienda — estudio/1 dorm. zonas 10/14/15** | — | — | Q3,000 – Q7,900 (US$400–1,035) | [V-sec] misma |
| **Vivir con la familia** | Q0 – Q500 de aporte | | | [E] — la opción real de la mayoría de jóvenes |
| **Electricidad (EEGSA)** | Q120 – Q200 (bajo consumo, tarifa social) | Q250 – Q400 | Q400 – Q760 | [V] tarifas; [E] los totales |
| **Agua (EMPAGUA)** | Q40 – Q80 | Q80 – Q152 | incluida en muchos condominios | [V-sec] |
| **Internet residencial** | Q159 – Q235 (30–50 Mbps) | Q235 – Q280 (100–150 Mbps) | Q380 – Q500 | [V-sec] [LivingInGuatemala](https://livinginguatemala.com/guides/cost-of-living-guatemala/) |
| **Celular prepago** | Q25 SIM + Q75–Q100/mes (10–25 GB) | | | [V-sec] Tigo/Claro |
| **Celular pospago** | — | Q140 – Q300 | Q650 – Q700 (ilimitado) | [V-sec] Tigo/Claro |
| **Alimentación (1 persona)** | **Q946** = CBA urbana INE | Q1,300 – Q1,800 | Q2,500+ | [V] INE (austero); [E] los demás |
| **Transporte público** | Q1 – Q7.50 por viaje → **Q80 – Q330/mes** | | | [V] tarifas; [E] el total |
| **Uber / taxi** | — | Q400 – Q900 | Q1,500+ | [E] |
| **Salud (consulta particular)** | Q150 – Q600 por consulta | | Q380 – Q2,300/mes seguro privado | [V-sec] |
| **Gimnasio** | Q0 (parques municipales) | Q230 – Q460 | Q600+ | [E] / [V-sec] |
| **TOTAL mensual estimado** | **Q2,200 – Q3,300** (vive con familia o cuarto compartido) | **Q4,500 – Q6,500** (apto. propio, zona periférica) | **Q9,000 – Q15,000+** (zonas 10/14/15) | **[E]** suma propia de los rangos anteriores |

**Tarifas verificadas al detalle:**

| Servicio | Tarifa | Etiqueta |
|---|---|---|
| Electricidad EEGSA, tarifa social | **Q1.42 / kWh** | [V-sec] [LivingInGuatemala citando al MEM](https://livinginguatemala.com/electricity/) |
| Electricidad EEGSA, tarifa no social | **Q1.51 / kWh** (trimestre may–jul 2026) | [V-sec] misma |
| Electricidad, consumo 1–60 kWh (subsidio) | Q0.50 / kWh | [V-sec] misma |
| Electricidad, consumo 61–88 kWh (subsidio) | Q0.87 / kWh | [V-sec] misma |
| Recibo típico 200 kWh/mes | **Q370 – Q390** | [V-sec] misma |
| **Transmetro** | **Q1.00** por viaje (regular); Q2.00 exprés | [V-sec] |
| **Bus urbano (rutas normales)** | **Q5.00**; rutas nuevas **Q7.50** (Acuerdo Municipal 13-2026, mar 2026) | [V-sec] [Ojoconmipisto](https://www.ojoconmipisto.com/municipalidad-adjudica-17-nuevas-rutas-tarifa-q7-50/) |
| **Tope temporal de pasaje urbano** | **Q6 – Q7** según precio del diésel (desde 2 ago 2026) | [V-sec] [Infobae](https://www.infobae.com/guatemala/2026/08/02/la-municipalidad-de-guatemala-fija-un-tope-temporal-para-el-pasaje-urbano-entre-q6-usd-079-y-q7-usd-092/) |
| **Gasolina** | ≈ **Q39 por galón** (ago 2026) | [V-sec] LivingInGuatemala |
| Almuerzo en comedor | **Q25 – Q35** | [V-sec] LivingInGuatemala |

**Implicación de diseño:** el transporte es una decisión de alto impacto en el juego. Q1 (Transmetro) vs. Q7.50 (bus nuevo) vs. ~Q40/día en carro propio son diferencias de **Q40 vs. Q300 vs. Q800+ al mes** — entre 1 % y 25 % del ingreso mediano.

---
## 3. Educación superior

### 3.1 USAC (pública): el arancel es cero

**El hallazgo más importante de esta sección: desde el ciclo 2026 la inscripción y la reinscripción en la USAC son gratuitas.**

| Concepto | 2026 | Antes |
|---|---|---|
| **Inscripción primer ingreso** | **Q0.00** | Q101.00 |
| **Reinscripción / matrícula anual** | **Q0.00** | Q91.00 |

[V] — [Boletín USAC, "Inscripción Gratuita para el ciclo académico 2026", 17 abr 2026](https://boletin.usac.edu.gt/inscripcion-gratuita-para-el-ciclo-academico-2026/); aprobado por el Consejo Superior Universitario. Cobertura: 10 facultades del campus central, 22 centros universitarios del interior, 10 escuelas y sedes de Humanidades. Confirmado por [Soy502, 27 sep 2025](https://www.soy502.com/articulo/inscripciones-reinscripciones-usac-seran-gratis-2026-153).

> **Advertencia de contexto:** la medida se implementó, pero al eliminarse el comprobante de pago como prueba de inscripción hubo reportes de registros académicos desaparecidos, y el Congreso pidió auditoría especial a la Contraloría. [V] — [Prensa Libre, 24 jul 2026](https://www.prensalibre.com/guatemala/politica/la-inscripcion-gratuita-de-la-usac-y-las-dudas-sobre-sus-registros-que-llevaron-a-solicitar-una-auditoria-especial-a-la-contraloria/)

**Proceso de admisión:**

| Rubro | Monto | Etiqueta |
|---|---|---|
| **Prueba de Orientación Vocacional** | **Q70.00** | [V] [Guatemala.com, 29 abr 2026](https://www.guatemala.com/noticias/sociedad/asignacion-prueba-de-orientacion-vocacional-de-usac-2026.html) — se paga en Banrural, G&T o Bantrab |
| Pruebas de Conocimientos Básicos (PCB) | **Q0** | [V] [SUN-USAC](https://sun.usac.edu.gt/index.php/proceso-de-ingreso/) |
| Pruebas de Conocimientos Específicos | **Q0** | [V] misma |

**Otros aranceles USAC** [V] — [Registro y Estadística USAC, Cuotas Estudiantiles](https://portalregistro.usac.edu.gt/cuotas_estudiantiles):

| Rubro | Monto |
|---|---|
| Examen de primera recuperación | Q10.00 |
| Examen de segunda recuperación | Q15.00 |
| Examen de suficiencia | Q20.00 |
| Exámenes técnicos profesionales | Q250.00 |
| **Título de Licenciatura** | **Q115.00** |
| Título de Profesorado | Q110.00 |
| Primer carné estudiantil | Q5.00 |
| Certificación de cursos | Q2.00 |
| Escuela de vacaciones, curso de 2 h diarias | Q115.00 |
| Escuela de vacaciones, curso de 4 h diarias | Q230.00 |
| Extranjero centroamericano (inscripción) | Q1,800.00 |
| Extranjero resto del mundo (inscripción) | Q24,000.00 |

**Costo total de arancel directo, año típico en USAC 2026: Q0 – Q170.** [E] cálculo propio.

**Costos indirectos — el costo real de la USAC:**

| Rubro | Costo | Etiqueta |
|---|---|---|
| Transmetro (Línea 7 al campus) | Q2/día | [V] [Agencia Universitaria de Noticias, feb 2024](https://agenciauniversitariadenoticias.com.gt/universidad/el-costo-de-transporte-por-acudir-cada-dia-al-campus-de-la-usac/) |
| Transurbano | Q5 por viaje | [V] misma |
| Taxi colectivo / mototaxi | Q10 – Q25 por viaje | [V] misma |
| Retorno nocturno desde Antigua / Chimaltenango | Q30 / Q35 | [V] misma |
| **Caso extremo documentado (estudiante de Alotenango)** | **Q52/día** | [V] misma |
| **Transporte mensual (20 días de clase)** | **Q40 (mejor caso) a Q1,040 (peor caso interdepartamental); típico capitalino Q200–Q500** | [E] cálculo propio |
| Libros, fotocopias y materiales | Q500 – Q2,000/año | [E] — no existe cifra oficial |

**Implicación de diseño:** en el juego, estudiar en la USAC no cuesta matrícula — cuesta **tiempo y transporte**. El verdadero costo de oportunidad es dejar de trabajar (o trabajar menos) durante 5 años. Ese es el trade-off que hay que modelar, no el arancel.

### 3.2 Universidades privadas

> **Advertencia de disponibilidad de datos, verificada directamente en los sitios oficiales:**
> - **UVG y UFM publican tarifario 2026 completo y abierto.** ✅
> - **URL** publica cuotas solo por facultad en PDFs sueltos; el único localizado es Humanidades, y del **ciclo 2025**.
> - **UMG NO publica tarifario.** Su página de admisiones describe el rubro contable "171 – Cuota Anual de Inscripción" **sin publicar un solo monto**. [V — la ausencia es real] [umg.edu.gt/admisiones](https://umg.edu.gt/admisiones)
> - **Galileo NO publica tarifario.** Su FAQ oficial de "Cuota por Inscripción" da solo la política, sin cifras. [V — la ausencia es real] [galileo.edu FAQ](https://www.galileo.edu/faqs-archivo/faqs-admisiones/cuota-por-inscripcion/)
>
> **Cualquier cifra de UMG o Galileo que circule en internet es de agregadores, no de fuente primaria.**

**Tabla maestra: costo anual por carrera**

| Universidad | Carrera | Inscripción | Mensualidad | **Costo ANUAL** | Etiqueta |
|---|---|---|---|---|---|
| **USAC** | cualquiera | Q0 | Q0 | **Q0 – Q170** | [V] 2026 |
| **URL** | Profesorado Enseñanza Media | Q565/sem | Q585 | **≈ Q6,980** | [V] cuotas ciclo 2025 + [E] el total |
| **UVG** | Profesorado Enseñanza Media | Q1,078/sem | Q1,157 | **≈ Q13,726** | [V] tarifario 2026 + [E] el total |
| **UVG** | Licenciatura en Educación | Q1,078/sem | Q1,682 | **≈ Q18,976** | [V] + [E] |
| **UVG** | Ing. Industrial (vespertina) | Q2,810/sem | ≈Q4,807 | **≈ Q53,686** | [V] + [E] |
| **UVG** | Ingeniería Civil | Q2,810/sem | ≈Q5,860 | **≈ Q64,214** | [V] + [E] |
| **UVG** | Arquitectura | Q2,810/sem | ≈Q6,606 | **≈ Q73,680** | [V] + [E] |
| **UVG** | Administración de Empresas | Q2,810/sem | ≈Q6,869 | **≈ Q74,310** | [V] + [E] |
| **UVG** | Psicología | Q2,810/sem | ≈Q7,076 | **≈ Q76,380** | [V] + [E] |
| **UVG** | **Ingeniería Industrial** | Q2,810/sem | ≈Q7,143 | **≈ Q77,054** | [V] + [E] |
| **UMG** | Derecho | Q1,035/sem | Q1,045 | ≈ Q12,840 | **[E]** agregador |
| **UMG** | Medicina | Q2,678 | Q3,265 | ≈ Q35,000+ | **[E]** agregador |
| **Galileo** | general | no publica | no publica | Q35,000 – Q70,000 | **[E]** agregador |
| **URL** | ing./admón./derecho | no publica | no publica | Q40,000 – Q95,000 | **[E]** agregador |
| **UFM** | estándar | Q525 admisión | Q500 servicios + UMAs | ≈ Q47,000 – Q94,000 | **[E]** agregador |
| **UFM** | **Medicina** | Q525 admisión | — | ≈ Q102,000 – Q133,000 | **[E]** agregador — UFM **no** publica este costo |

Fuente del bloque UVG: [Tarifario de carreras UVG 2026, PDF oficial](https://res.cloudinary.com/webuvg/image/upload/v1758575076/WEB/Admisiones/home/tarifario-carreras-2026.pdf). Los componentes (inscripción Q2,810/semestre, mensualidades, laboratorios, cuota digital Q780/semestre) son **[V]**; el total anual es **[E]** = 2 × (inscripción + cursos + labs + digital).

Fuente del bloque URL: [Cuotas Profesorados, Facultad de Humanidades, PDF oficial](https://principal.url.edu.gt/wp-content/uploads/portalurl/facultades/cuotas/HUMANIDADES/Cuotas%20profesorados.pdf) (ciclo 2025). La matrícula incluye servicios generales, cuota estudiantil y seguro de accidentes; **no** incluye cursos de inglés (Q1,377). Hay **descuento por pago anticipado de matrícula: 25 % hasta el 31 jul, 15 % del 1 ago al 30 sep, 10 % en octubre**, no acumulable con beca. La matrícula **no es reembolsable**. [V]

**UFM — modelo de cobro por UMA:** [V] [Tarifario UFM 2026](https://www.ufm.edu/tarifario-2026/)

| Rubro | Monto 2026 |
|---|---|
| Proceso de admisión | Q525.00 |
| Cuota mensual obligatoria de servicios | Q500.00 (Q250 en Facultad de Educación) |
| 1 UMA (Unidad de Mérito Académico) | = 15 horas lectivas |
| Valor de la UMA 2026 | ≈ Q2,409 — **[V-parcial]**, la página no imprime el número; confirmar con UFM |
| Modalidad de pago | matrícula trimestral = 20 % de los cursos asignados; el 80 % restante en 3 cuotas | 
| Diploma / toga de graduación | Q800 / Q1,850 – Q2,200 |
| Pase anual de parqueo | Q650 – Q2,300 |

**UFM es la universidad más cara del país.** [V-sec]

### 3.3 Duración de las carreras y el sistema de "carrera intermedia"

Guatemala usa un esquema distinto al de la mayoría de países: **en varias unidades de la USAC la licenciatura no es una carrera de entrada directa, sino la continuación de un técnico universitario previo.** Es el "nivel intermedio" o "carrera intermedia".

**Caso documentado — Escuela de Ciencias de la Comunicación, USAC** [V] — [carreras y programas](https://comunicacion.usac.edu.gt/carreras-y-programas/):

| Nivel | Duración | Requisito de graduación |
|---|---|---|
| **Técnico Universitario** (Periodismo, Locución, Publicidad) | **3 años** | examen privado **o** EPS |
| **Licenciatura en Ciencias de la Comunicación** | **+2 años** | *"Es indispensable cerrar el pénsum de una carrera técnica para continuar con los estudios de Licenciatura"* + tesis/monografía o EPS |
| **Total** | **5 años** | más el tiempo de graduación |

| Carrera | Duración | Etiqueta |
|---|---|---|
| **Ingenierías USAC** (Industrial, Civil, Química, Mecánica, Sistemas) | **5 años / 10 semestres / 300 créditos CLAR** | [V] [Redes de Estudio, Ingeniería USAC](https://redesestudio.ingenieria.usac.edu.gt/redesDeEstudio/ingenieriaIndustrial/22/clar) |
| Médico y Cirujano | 6 años | [E] |
| Psicología | 5 años | [E] |
| Técnico universitario en privadas | 2 – 3 años | [E] |
| Licenciatura en privadas | 4 – 6 años | [E] |

**Cierre de pénsum, tesis y EPS** [V] — [JUSAC](https://jusac-nuevo.usac.edu.gt/?page_id=3218) y [Depto. de EPS, Ingeniería USAC](https://eps.ingenieria.usac.edu.gt/index.php/eps/duracion-del-eps):

- **Cierre de pénsum** = aprobar todos los cursos del plan. Genera una constancia. **NO equivale a graduarse.**
- Opciones de graduación tras el cierre: **tesis o monografía**, **EPS**, o **examen privado** (en nivel técnico).
- **Duración del EPS: 3 o 6 meses**, de carácter optativo.
- **El tiempo entre cierre de pénsum y graduación no está acotado.** En la práctica añade **1 a 3 años** de costo de oportunidad. [E]

**Implicación de diseño:** el "cierre de pénsum sin graduarse" es un estado real y extremadamente común en Guatemala, y merece ser un estado del juego. El jugador termina los cursos, deja de pagar colegiatura, empieza a trabajar… y la tesis se queda pendiente durante años. Sin título no accede a ciertos puestos ni al salto salarial de la maestría.

**La ruta intermedia es la válvula de escape económica:** en UVG, un Profesorado cuesta **≈Q13,726/año** vs. **≈Q77,054/año** de Ingeniería Industrial — una diferencia de **5.6×**. [E] cálculo sobre cifras verificadas.

### 3.4 Retorno educativo: cuánto rinde realmente estudiar

> **Nota metodológica importante:** el INE **no** publica ingreso laboral desagregado por nivel educativo en los boletines públicos de ENEI/ENEIC (verificado por inspección directa de los PDF). Los datos de retorno educativo vienen de estudios académicos que procesan la microdata, no de boletines oficiales.

**Estudio de referencia:** Guillermo Díaz (URL), *"Disminución de los retornos de la educación en Guatemala"*, **Atlantic Review of Economics, Vol. 2, nº 1, 2019** — [PDF](https://dialnet.unirioja.es/descarga/articulo/6990030.pdf). Modelo de Mincer sobre ENEI 2002, 2010 y 2018. Todo **[V]**.

**Retorno por cada año adicional de estudio:**

| Año | Mincer (MCO) | Con corrección de Heckman |
|---|---|---|
| 2002 | 8.1 % | 9.3 % |
| 2010 | 6.9 % | 5.7 % |
| **2018** | **6.8 %** | **6.9 %** |

**Prima salarial por nivel educativo (vs. una persona sin educación):**

| Nivel | 2002 | 2010 | **2018** |
|---|---|---|---|
| Primaria | +31.2 % | +17.1 % | **+23.3 %** |
| Secundaria / diversificado | +80.6 % | +59.9 % | **+64.1 %** |
| **Universidad** | **+137.0 %** | +99.0 % | **+98.9 %** |
| Postgrado | +218.0 % | +134.0 % | **+150.0 %** |

**Prima del universitario SOBRE el bachiller:** **+21.2 % en 2018**, frente a **+31.2 % en 2002**. Se comprimió 10 puntos en 16 años. [E] cálculo sobre los coeficientes verificados.

**El salario de los graduados universitarios cayó mientras se duplicaban los graduados** [V] Díaz 2019, Anexo 2 (fuentes DIGI 2014 e INE 2017):

| Año | Salario promedio mensual | Nº de graduados |
|---|---|---|
| 2010 | **Q6,485** | 14,450 |
| 2013 | Q6,342 | 24,442 |
| **2015** | **Q5,750** | **33,680** |

Caída de **Q735 (−11.3 %)** mientras el número de graduados se **duplicó**. En maestría: de Q8,021 (2002) a Q6,884 (2016).

**Causa estructural documentada** [V]:
- En 2014 y 2015 se crearon 14,962 y 30,167 empleos formales (IGSS) frente a 26,899 y 33,680 graduados universitarios. **Exceso de oferta.**
- **Fundesa (2017), muestra de 323 empresas: el 52 % de los puestos demandados requería solo educación de nivel medio.** Y a nivel universitario, la demanda de las empresas *"se enfoca más en técnicos que en licenciaturas"*.

**Pero la universidad sigue siendo el mejor seguro contra la pobreza** [V] Díaz 2019 sobre ENCOVI:

| Nivel | Probabilidad de estar en pobreza, 2002 | 2016 |
|---|---|---|
| Sin educación | 70 % | 74 % |
| Primaria | 50 % | 66 % |
| **Secundaria** | 19 % | **39 %** |
| **Universidad** | **2 %** | **5 %** |

Conclusión textual del autor: *"A pesar de la tendencia a la baja en los retornos de la educación en 2018 respecto de 2002, en Guatemala es rentable estudiar. Cada año de estudio agrega en promedio 7 % más en el retorno."* [V]

### 3.5 El embudo educativo

[V] — [ODEP-URL, "El embudo educativo y la desigualdad para el acceso a la educación superior en la juventud", nov 2025](https://odep.url.edu.gt/investigaciones/monitoreo-de-coyuntura/2025/11/el-embudo-educativo-y-la-desigualdad-para-el-acceso-a-la-educacion-superior-en-la-juventud/):

| Etapa | De cada 100,000 niños que entran a primaria |
|---|---|
| Continúan a secundaria | **53,000** |
| Completan diversificado | **25,540** |
| **Ingresan a la universidad** | **12,000** |

- **El 74 % de la población joven está excluida antes de siquiera poder intentar entrar a la universidad.** [V]
- **Solo el 2.6 % de la población de 18 a 26 años inicia estudios universitarios.** [V]
- Matrícula de educación superior 2023: **519,561** (221,256 USAC + 298,305 privadas = 57.4 % privada), con **41,529 graduados**. [V]
- Movilidad educativa: el hijo de una persona con educación primaria tiene **38 % de probabilidad de terminar secundaria y solo 6 % de llegar a la universidad**. [V] Díaz 2019.

**Composición educativa de la población ocupada (ENEIC IV-2024)** [V] INE:

| Nivel | % de la población ocupada |
|---|---|
| Sin estudios | 13.8 % |
| Primaria | 38.6 % |
| Nivel medio | 38.7 % |
| **Superior** | **8.9 %** |

### 3.6 Créditos educativos: sí existen, pero no financian una carrera

**Productos bancarios**

| Banco | Producto | Monto | Tasa anual | Plazo | Fiador |
|---|---|---|---|---|---|
| **BI** | **Bi Fácil Escolar** | hasta **Q8,000** | **18 %** | 6/8/10 meses | **NO** |
| **BI** | Estudiantil / Universitario | no publica | no publica | no publica | **SÍ — codeudor** con los mismos requisitos que el titular |
| **BAC** | Crédito Educativo | 80 % del costo | no publica | no publica | no publica |
| **Banrural** | Crédito Escolar | **Q1,000 – Q30,000** | no publica | hasta **24 meses** | no publica |
| **G&T** | Estudiante GTC | desde Q25,000, hasta 100 % del programa | no publica | **12 – 60 meses** | no publica |
| **CHN** | Préstamo Personal (genérico) | hasta Q350,000 | **14 % – 26 %** | 36 meses | garantía real |
| **CHN** | EduCredit (inglés + estipendio Q800/mes) | n/d | no publica | n/d | depende del perfil |

Todos [V] de los sitios de cada banco, salvo donde dice "no publica".

**Hallazgos críticos sobre el crédito educativo en Guatemala:**

1. **De 5 bancos y 7 productos, solo hay 2 tasas publicadas** (18 % de BI Fácil Escolar y el rango 14 %–26 % del préstamo personal del CHN). Todo lo demás se negocia en agencia. **La opacidad de precios es en sí misma un hallazgo.**
2. ⚠️ El 18 % de Bi Fácil Escolar proviene de una página fechada en **enero de 2016**. Trátese como referencia histórica, no como oferta vigente confirmada.
3. **Ningún crédito bancario financia realmente una carrera privada.** Los productos "escolares" topan en **Q8,000–Q30,000** con plazos de **10 a 24 meses**, contra un costo de **Q50,000–Q95,000 por año**. La brecha es insalvable.
4. **El fiador, no la tasa, es la barrera real.** BI exige codeudor con los mismos requisitos que el titular; **la UFM exige a los padres MÁS un fiador adicional**, con récord crediticio de la Superintendencia de Bancos de todos ellos. Esto **excluye estructuralmente al estudiante de primera generación**.
5. **G&T Estudiante GTC tiene rango de edad de 23 a 65 años** — es decir, excluye al estudiante de licenciatura típico; está diseñado para posgrado. [V]
6. **Las universidades asociadas al crédito de BAC son INCAE, UNIS Business School y GAIA: todas de posgrado/MBA.** No sirve para licenciatura de primer ingreso. [V]

**Crédito de las propias universidades — el canal que sí funciona**

| Universidad | Cobertura máx. | Período de gracia | Fiador |
|---|---|---|---|
| **UVG** | beca + crédito combinados; becas fijas de 30 % y 50 % | **carrera + 1 año** ⭐ | no publica |
| **UFM** | **90 %** del costo | **toda la carrera** — paga al cerrar pénsum o al retirarse | **padres + un fiador adicional (18–70 años)** |
| **Galileo** | **75 %** de las cuotas mensuales | **NINGUNO** ⚠️ — debe pagarse antes de graduarse | no menciona |
| **URL** | sin crédito propio; canaliza a BI. Beca Loyola: 50 % de matrícula | n/a | n/a |

Todos [V] de los sitios oficiales.

**El período de gracia es el diferenciador que decide todo:** UVG (carrera + 1 año) y UFM (hasta cerrar pénsum) vs. Galileo, que exige pagar **durante** la carrera. Misma cobertura nominal, consecuencias financieras radicalmente distintas.

⚠️ **Límite de la UVG:** la beca y el crédito cubren **únicamente el costo de los cursos** — no incluyen inscripción, laboratorios, parqueo ni manutención. [V]

**Fondos y becas del Estado**

| Programa | Naturaleza | Detalles | Etiqueta |
|---|---|---|---|
| **FINABECE** — Fideicomiso Nacional de Becas y Crédito Educativo | **reembolsable, no reembolsable o combinado** | Acuerdo Gubernativo 344-2009, administrado por SEGEPLAN. Requisitos: guatemalteco, menor de 50 años, promedio ≥70 puntos, estudio socioeconómico. **Trámite Q0.** ⚠️ **SEGEPLAN indica que vence el 8 dic 2025.** **Tasa, monto y plazo NO publicados.** | [V] |
| **Fondo Nacional de Becas "Becas por Nuestro Futuro"** | **BECA — NO reembolsable** | Creado 11 mar 2025. **Q250 millones**, de los cuales **Q245 M administrados por el CHN**. Cubre inscripción, matrícula, materiales y estipendios. Pregrado, técnico y posgrado. **Tres convocatorias al año** (abril-mayo, julio, noviembre). **2.ª convocatoria 2026: 1 ago – 30 sep 2026, abierta.** Monto individual **no publicado**. | [V] |
| **MIDES — Beca Educación Superior** | beca / TMC | **Q2,500 anuales** en 2 pagos (Q1,800 + Q700). Edad **16–28 años**. Requiere pobreza o pobreza extrema y comprobar asignación, asistencia y cursos aprobados. Convocatoria: febrero–marzo, con visita domiciliaria. | [V] [mides.gob.gt](https://www.mides.gob.gt/programas-sociales/becas/) |
| **MIDES — Beca Primer Empleo** | subsidio al empleador | El empleador paga **40 % del salario mínimo + bono Q250**. Edad 16–25 años. | [V] |
| **MINEDUC — PROBEFI 2026** | beca de formación técnica en inglés | DIGEEX + INTECAP + CHN. Formación virtual gratuita **+ estipendio**. Convocatorias marzo y julio 2026. Mínimo 15 años. Monto del estipendio no extraíble (está dentro de una imagen en la página oficial). | [V] |
| **USAC — 7 programas de beca** | **NO reembolsables** | Pregrado (1.ª solicitud y renovación), Tesis, EPS, Discapacidad, Arte/Cultura/Deporte, Excelencia Académica. Requisitos: escasos recursos, **promedio ≥70**, **menor de 27 años**, **carta declarando que NO trabaja**. Convocatoria 2026: 1–28 de febrero. ⚠️ **La USAC no publica los montos.** | [V] |
| **FUNDAP — Beca para la Niña** | no reembolsable | **Q100 mensuales × 10 meses por ciclo, durante 3 años.** Niñas de 10 a 15 años del suroccidente. **FUNDAP no financia colegiatura universitaria.** | [V] |
| **Fundación Tigo** | **no otorga becas individuales** | Su trabajo educativo es infraestructura: 328 escuelas entregadas al MINEDUC, 700+ antenas de conectividad. | [V] |

> **Cambio estructural en curso:** Guatemala está **abandonando el crédito educativo estatal reembolsable (FINABECE, 2009, que vence) en favor de la beca pura no reembolsable ("Becas por Nuestro Futuro", 2025)**. [V]

**Las becas de subsistencia son simbólicas frente al costo real:** la Beca Educación Superior del MIDES da **Q2,500 al AÑO**; la Beca para la Niña de FUNDAP da **Q100 al mes**. Contra una canasta básica alimentaria urbana de **Q943.14 al mes por persona**.

### 3.7 El cálculo que resume la sección

Una **Ingeniería Industrial en UVG cuesta ≈Q77,054/año**. Eso equivale a [E]:

- **19.3 salarios mínimos mensuales** (CE1 no agrícola, Q4,002.28 base)
- **28.4 veces el ingreso laboral promedio mensual nacional** (Q2,713)
- Y el crédito bancario "escolar" más grande que se puede conseguir sin garantía real es de **Q8,000 a Q30,000**.

Mientras tanto, la **USAC cuesta Q0 de arancel** — pero solo **12,000 de cada 100,000** niños que entran a primaria llegan a poder aprovecharla.

**Implicación de diseño:** el juego debería ofrecer al menos cuatro rutas educativas honestas: (a) USAC gratis pero con 5+ años de costo de oportunidad y alta probabilidad de no graduarse; (b) técnico/profesorado privado a ~Q14,000/año con salida laboral en 3 años; (c) licenciatura privada a Q50,000–Q95,000/año, casi siempre imposible sin beca o crédito familiar; (d) no estudiar y entrar al mercado informal. Y el retorno de (c) sobre (b) debe ser modesto — porque en los datos lo es.

---
## 4. Productos bancarios

Esta sección se apoya en las **series oficiales del Banco de Guatemala** (descargadas directamente de sus archivos Excel), en la **Ley de Bancos**, y en los **tarifarios publicados por cada banco**. Es la parte mejor documentada del informe.

> **Nota de acceso:** el portal de la Superintendencia de Bancos (sib.gob.gt) bloquea el acceso automatizado (HTTP 403). Pero **Banguat publica los datos de la SIB**: sus cuadros V.4 a V.7 y sus series imm04/imm05 dicen literalmente "Fuente: Superintendencia de Bancos". Es el mismo dato por una vía accesible.

### 4.1 Contexto de tasas

| Indicador | Valor | Fecha | Etiqueta |
|---|---|---|---|
| **Tasa líder de política monetaria** | **3.50 %** | decisión de la Junta Monetaria, 26 ago 2026 | [V] |
| **Ritmo inflacionario** | **2.70 %** | jul 2026 | [V] Banguat/INE |
| Proyección de inflación cierre 2026 | 3.75 % | Junta Monetaria | [V] |
| **Tasa PASIVA promedio ponderada del sistema (MN)** | **4.63 %** | ago 2026 | [V] |
| **Tasa ACTIVA promedio ponderada del sistema (MN)** | **13.08 %** | ago 2026 | [V] |
| **Spread de intermediación** | **8.45 pp** | ago 2026 | [V] |

Fuente: [Banguat, tasa pasiva MN (imm05.xls)](https://banguat.gob.gt/sites/default/files/banguat/imm/imm05.xls) y [tasa activa MN (imm04.xls)](https://banguat.gob.gt/sites/default/files/banguat/imm/imm04.xls).

**Evolución 2026** [V]:

| Mes 2026 | Pasiva | Activa | Spread |
|---|---|---|---|
| Enero | 4.91 % | 12.96 % | 8.05 pp |
| Abril | 4.78 % | 12.97 % | 8.19 pp |
| Julio | 4.65 % | 12.98 % | 8.33 pp |
| **Agosto** | **4.63 %** | **13.08 %** | **8.45 pp** |

**La tasa pasiva viene bajando todo 2026 mientras la activa sube ligeramente. El spread se está ampliando.**

⚠️ **Notas al pie oficiales, críticas para no malinterpretar estas cifras:** la tasa pasiva promedio *"no incluye el rubro de depósitos a la vista"*. La activa *"no incluye el rubro de préstamos con tarjeta de crédito"*. Es decir, **el 13.08 % NO incluye tarjetas**, que es donde está el crédito caro.

### 4.2 Tasas pasivas: cuánto paga cada tipo de cuenta

**Este es el desglose que casi nadie cita.** Banguat publica en el Cuadro V.6 la tasa promedio ponderada de saldos vivos por tipo de depósito.

**Moneda nacional, julio 2026** [V] — [Banguat, Cuadro V.6](https://banguat.gob.gt/sites/default/files/banguat/estamonfin/estamonfin056.xls):

| Tipo de depósito | Tasa promedio ponderada |
|---|---|
| **Depósitos transferibles** (= cuenta monetaria / de cheques) | **1.27 %** |
| **Depósitos de ahorro** | **2.65 %** |
| **Depósitos a plazo** | **6.35 %** |
| Acuerdos de recompra (reportos) | 3.63 % |

**Moneda extranjera, julio 2026** [V]: transferibles 0.82 % · ahorro 2.08 % · plazo 4.69 %.

**Tendencia 2026:** el ahorro se mantuvo plano en 2.65 %; el **plazo fijo cayó de 6.77 % (enero) a 6.35 % (julio)**, siguiendo el ciclo de la tasa líder. [V]

⚠️ **El desglose a 30/90/180/360 días no existe públicamente.** El Cuadro V.6 de Banguat **tiene las columnas creadas pero todas las celdas dicen `n.d.`** para toda la serie histórica. El desglose real solo existe banco por banco. [V]

### 4.3 Lo que realmente paga cada banco

**Cuentas de ahorro — comparación a igual monto (Q10,000)** [V-sec] — [tasas.gt](https://www.tasas.gt/cuentas-de-ahorro), agregador que lee cada tarifario oficial y enlaza al documento del banco; verificado 2 sep 2026 sobre 75 productos de 17 bancos:

| Banco | Producto | Tasa efectiva |
|---|---|---|
| Bantrab | BT Ahorro Progresivo | **6.17 %** |
| G&T Continental | Fondo de Ahorro | **6.17 %** |
| BAC Credomatic | Cuenta Objetivos | 5.64 % |
| Promerica | Ahorro Futuro | 5.25 % |
| BAM | Ahorro Creciente | 5.12 % |
| **Banco Industrial** | Planes de Inversión | 4.50 % |
| **Banco Industrial** | Ahorro SOS | 1.51 % |
| **Banrural** | Cuenta Amigo Crece | 1.00 % |
| **Banco Industrial** | **Ahorro Corriente** (la cuenta básica) | **0.50 %** |
| BAC Credomatic | Ahorro Premium (hasta Q20,000) | **0.00 %** |
| G&T Continental | Ahorro Premier (hasta Q25,000) | **0.00 %** |

**Escalas por saldo — el detalle que importa:**

- **BI Ahorro Corriente** [V-sec]: de Q0.01 a Q99.99 → **0.00 %**; de Q100 en adelante → **0.50 %**. Saldo mínimo para generar intereses: Q100.
- **Banrural Cuenta Amigo Crece** [V]: hasta Q250,000 → **1.00 %** · Q250,001–500,000 → 2.00 % · Q500,001+ → 5.50 %.
- **BAC Ahorro Alcanza** (julio 2026) [V]: **menos de Q5,000 → 0.00 %** · Q5,001–300,000 → 2.00 % · Q1,500,001+ → 5.00 %.

> **La lección para el juego:** las tasas altas que se anuncian son para saldos que un joven guatemalteco no tiene. Con Q3,000 ahorrados, la mayoría de cuentas paga **0 % o 0.50 %**.

**Lo que cada banco realmente pagó (reporte a la SIB, ago 2026)** [V-sec] — este cuadro separa el gancho publicitario de la realidad:

| Banco | Monetaria (máx / promedio) | Ahorro (máx / promedio) | Plazo (máx / promedio) |
|---|---|---|---|
| **Banco Industrial** | 6.50 % / **0.79 %** | 6.50 % / **0.94 %** | 8.00 % / 5.53 % |
| **Banrural** | 5.50 % / **0.48 %** | 7.10 % / **1.92 %** | 8.00 % / 5.65 % |
| **BAC Credomatic** | 6.25 % / **1.65 %** | 5.50 % / **3.08 %** | 7.75 % / 6.19 % |
| **G&T Continental** | 5.50 % / **1.62 %** | 6.50 % / **3.84 %** | 7.50 % / 5.60 % |

La "máxima aplicada" es una negociación puntual con un cliente corporativo grande. **El promedio ponderado es lo que realmente se paga.**

### 4.4 Depósitos a plazo: matrices reales monto × plazo

**BANCO INDUSTRIAL — "Plazo Fijo y Gana Seguro", tasa efectiva** [V-sec]:

| Monto | 90 días | 180 días | 365 días |
|---|---|---|---|
| Q5,000 – Q100 mil | **1.00 %** | 1.26 % | **1.52 %** |
| Q100 mil – Q250 mil | 1.76 % | 2.03 % | 2.56 % |
| Q250 mil – Q500 mil | 3.02 % | 3.33 % | 3.63 % |
| Q1.0M – Q2M | 3.53 % | 3.86 % | 4.44 % |
| Q2.0M + | 4.04 % | 4.39 % | 4.71 % |

**G&T CONTINENTAL — Certificado de Depósito a Plazo, tasa nominal** [V-sec]:

| Monto | 90 d | 180 d | 365 d | 730 d |
|---|---|---|---|---|
| Q5,000 – Q50 mil | 2.25 % | 2.50 % | **2.75 %** | 3.00 % |
| Q100 mil – Q200 mil | 2.65 % | 3.25 % | 3.50 % | 3.70 % |
| Q1M – Q3M | 3.25 % | 4.75 % | 5.00 % | 5.15 % |

**BANCO AZTECA — Inversión Azteca a Plazo, 364 días** [V]: Q5,000–299,999 → **6.25 %** · Q500,000–999,999 → 6.90 % · hasta 7.55 %. Plazos disponibles: 91, 182 o 364 días. **Penalización por retiro anticipado: 25 % de los intereses no devengados.**

**BAC Cuenta Objetivos (ahorro programado), julio 2026** [V]: 3 meses → 2.00 % · 6 meses → 2.50 % · **12 meses → 3.00 %** · 24 meses → 4.25 % · 60 meses → 5.50 %.

**Ranking del mercado a Q10,000 / 365 días** [V-sec, 2 sep 2026]:

| Banco | Producto | Efectiva |
|---|---|---|
| Banco Azteca | Inversión Azteca Creciente | **6.50 %** |
| CHN | CDP Futuro Seguro (techo) | hasta 6.25 % |
| BAC Credomatic | CDP canal digital | 4.90 % |
| G&T Continental | CDP | 2.75 % |
| **Banco Industrial** | Plazo Fijo y Gana Seguro | **1.52 %** |

> **Hallazgo para el juego:** a monto minorista (Q10,000, 1 año), **Banco Industrial paga 1.52 % y Banco Azteca paga 6.50 %** — casi 5 puntos de diferencia por el mismo producto y plazo. Los bancos grandes compiten por transaccionalidad y confianza, no por tasa. **Ningún banco revisado ofrece plazo fijo a 30 días.**

### 4.5 Lo que se lleva el fisco y lo que protege el Estado

| Concepto | Cifra | Etiqueta |
|---|---|---|
| **Retención de ISR sobre intereses** | **10 %** sobre los intereses devengados, retenido por el banco al pagar | [V] Decreto 10-2012, Ley de Actualización Tributaria |
| **Cobertura del FOPA** (Fondo para la Protección del Ahorro) | **Q20,000** o su equivalente, **por persona en cada banco** | [V] Ley de Bancos, **Art. 87** |

**Todas las tasas publicadas son antes del ISR.** Una tasa anunciada de 6.00 % deja **5.40 % neto** en la mano. Es una lección de juego excelente: el rendimiento anunciado nunca es el que se recibe.

### 4.6 Cuenta monetaria vs. cuenta de ahorro

**Base legal.** La **Ley de Bancos y Grupos Financieros (Decreto 19-2002), Art. 41** solo reconoce tres tipos de depósito: **monetarios**, **a plazo** y **de ahorro**. [V]

Definición operativa, del **Reglamento de Cuentas de Depósitos Monetarios de Banrural, Art. 4** [V]:

> *"Las cuentas de depósitos monetarios son **depósitos a la vista** y sus fondos pueden ser girados a través de **cheques, tarjeta de débito u otro medio electrónico** que ponga a disposición el Banco."*

**En Guatemala, "cuenta monetaria" = cuenta corriente = cuenta de cheques.** Es el mismo producto con tres nombres. Sirve para **transaccionar**, no para acumular.

| Criterio | CUENTA MONETARIA | CUENTA DE AHORRO |
|---|---|---|
| Naturaleza legal | Depósito **a la vista** (Art. 41 num. 1) | Depósito de ahorro (Art. 41 num. 3) |
| Propósito | Recibir sueldo, pagar, girar, transferir | Acumular y rentabilizar |
| **Chequera** | **SÍ** — es su rasgo definitorio | **NUNCA** |
| **Tarjeta de débito** | Sí | **Sí también** — ya no es diferenciador |
| **¿Paga intereses?** | **Opcional y muy bajo.** Promedio del sistema: **1.27 %** | Sí. Promedio del sistema: **2.65 %**; ofertas hasta 6.17 % |
| Apertura típica | Q500 – Q2,500 | Q0 – Q1,000 |
| Comisión de manejo | **Sí, si el saldo cae bajo el umbral** | Generalmente no, o menor |
| Sobregiro | Posible (BAC: 30 % anual, mínimo Q25 diarios) | No aplica |
| Libreta física | No | Sí en algunos (CHN, Bantrab, G&T) |
| Retiros en ventanilla | Ilimitados (con cargo por exceso) | **Restringidos**: BAC cobra desde el 2.º retiro si el saldo < Q10,000 |

**¿Paga intereses la cuenta monetaria? Legalmente es opcional.** Banrural, Reglamento Art. 24 [V]: *"El Banco **puede** reconocer intereses sobre los depósitos monetarios…"*

| Banco | ¿Paga? | Cifra | Etiqueta |
|---|---|---|---|
| **G&T Continental** | **NO** | Literal en la ficha del producto: *"No devenga tasa de interés"* | [V] |
| **BAC Credomatic** | Sí, pero solo con saldo alto | desde 1.20 %; **saldo mínimo para generar intereses: Q50,000** | [V] |
| **Banrural** | Sí | tasa promedio ponderada **1.09 %** en quetzales | [V] |
| **CHN** | Sí | tasa promedio ponderada **0.76 %** en quetzales | [V] |
| **Sistema completo** | — | **1.27 %** promedio ponderado | [V] Banguat |

**Montos mínimos de apertura** [V] salvo indicación:

| Banco | Cuenta monetaria | Cuenta de ahorro |
|---|---|---|
| **BAC Credomatic** | **Q2,500** / US$500 | Ahorro Alcanza Q500 · Ahorro Personal Q1,000 · Cuenta Objetivos Q500 (aporte mensual Q100) |
| **Banrural** | **Q500** / US$100 | Amigo Crece **Q100** / US$25 · Mi Gente Q100 |
| **G&T Continental** | **Q500** (individual) / Q3,000 (jurídica) | — |
| **CHN** | no lo publica | Ahorro Visionario **Q0.00** |
| **Banco Azteca** | — | Guardadito Q200 [V-sec] |
| **Banco Industrial** | mancomunada Q1,000 | Ahorro Corriente: **no publica** monto de apertura |

**Chequera y tarjeta de débito** [V]:

| Banco | Chequera | Tarjeta de débito |
|---|---|---|
| **BAC** | **Primera chequera de 24 cheques: Q0** | Débito internacional Mastercard o Visa |
| **CHN** | **Se cobra desde la SEGUNDA** | **La primera es sin costo** |
| **Bantrab** | **No se cobra la primera** | Sí |
| **G&T** | Chequeras ilimitadas sin costo con saldo ≥ Q3,000 | Sí |
| **Banrural** | **Art. 26: las cuentas abiertas en línea NO pueden generar chequeras** | Sí |

⚠️ **Banrural Cuenta Rural, texto oficial** [V]: *"Elige cómo operar tu cuenta: **Talonario de Cheques o Tarjeta de Débito**"* — es una **o** excluyente, no ambas.

### 4.7 Comisiones

**Marco legal — por qué no hay tarifario nacional.** **Ley de Bancos, Art. 42** [V, texto literal]:

> *"Los bancos autorizados conforme esta Ley **pactarán libremente con los usuarios las tasas de interés, comisiones y demás cargos** que apliquen en sus operaciones y servicios. En ningún caso podrán cargarse comisiones o gastos por servicios que no correspondan a servicios efectivamente prestados o gastos habidos. En todos los contratos de índole financiera que los bancos suscriban, deberán hacer constar, de forma expresa, **la tasa efectiva anual equivalente**…"*

**No hay techo legal a comisiones ni a tasas de interés en Guatemala.** La única obligación de transparencia es declarar la TEA en el contrato.

**BAC Credomatic — tarifario oficial vigente 1 de julio de 2026** [V] — el más completo y actual del mercado:

| Concepto | Quetzales |
|---|---|
| **Manejo de cuenta monetaria** | **Q30/mes** si el saldo promedio mensual < **Q2,500** |
| **Cuenta inactiva** (180 días sin movimiento) | **Q8** |
| **Cuenta durmiente** (360 días sin movimiento) | **Q15** |
| Primera chequera de 24 cheques | **Q0** |
| Chequera de 24 cheques (saldo prom. < Q15,000) | Q35 |
| **Cheque rechazado** | **Q160** |
| **Retiro en ventanilla** | **Q10** |
| 2.º retiro en ventanilla, ahorro con saldo < Q10,000 | Q15 |
| **Emisión de tarjeta de débito adicional o reposición** | **Q50** |
| Cheque de caja (agencia / en línea) | Q75 / Q50 |
| **Sobregiro** | **30 % anual** sobre monto × días, **mínimo Q25 diarios** |
| Desinversión anticipada de depósito a plazo | 3 % anual por días transcurridos y faltantes |

**BAC — retiros en cajero de otro banco** [V]:

| Escenario | Cargo |
|---|---|
| Cuenta **planilla** — cajeros BAC o red 5B | **Sin costo** |
| Cuenta **planilla** — **cajeros BI** | **Q10 desde el primer retiro** |
| Cuenta **no planilla** — cajeros BAC o red 5B | 7 retiros gratis/mes; desde el 8.º: **Q7 c/u** |
| Cuenta **no planilla** — **cajeros BI** | **Q10 desde el primer retiro** |
| Consultas en cajeros BI | **Q10 desde la primera** |
| Retiros en cajeros del exterior | **mínimo US$4** |

**CHN — tarifario de cuenta monetaria** [V]:

| Concepto | Monto |
|---|---|
| Chequera de 25 / 50 cheques | Q25 / Q50 (**se cobra desde la segunda solicitud**) |
| **Transacciones en cajeros de OTRAS REDES** | **Q7.00 por transacción** |
| Consulta de saldo en cajero | Q2.00 desde la 2.ª del mismo día |
| **Cheque rechazado por falta de fondos** | **Q120.00** |
| Reposición de tarjeta de débito | Q50 (**la primera es sin costo**) |
| **★ Manejo de cuenta SIN MOVIMIENTO** | **Q50.00 MENSUALES** si tiene más de 1 año sin movimiento **y** saldo < Q1,000 |
| Alertas SMS | Q10.00 mensuales |
| Transferencia LBTR | Q50.00 |

> **Ese cargo de Q50 mensuales del CHN es el más agresivo que se encontró: una cuenta olvidada con Q800 queda vacía en 16 meses.**

**Bantrab** [V, documento TCS-001-2018 publicado como vigente — ⚠️ puede estar desactualizado]:

| Concepto | Monto |
|---|---|
| Chequera de 25 / 50 cheques | Q10 / Q15 (**no se cobra la primera**) |
| **Cheque rechazado** | **Q125** |
| **Inactividad cuenta monetaria** | 3–6 años: **Q20/mes** · 6–9 años: Q50/mes · 9+ años: Q100/mes |
| **Inactividad cuenta de ahorro** | 3–6 años: Q20/mes · 6–9 años: Q100/mes · 9+ años: **Q200/mes** |
| Reposición de tarjeta de débito | Q30 |
| **Retiro/consulta en red 5B** | Q5 por transacción **desde la 6.ª del mes** |
| **Retiro en redes externas (BI y BAC)** | **Q5 por transacción** |
| Membresía de tarjeta de débito | Q5 mensual |

**G&T Continental** [V parcial]: cuenta de ahorro inactiva **Q25 mensuales** con 1 año o más de inactividad y saldo ≤ Q500 · descuento del **25 % de los intereses proyectados** en cuentas inactivas · impresión de estado de cuenta en agencia Q30 · **manejo de cuenta y chequeras sin cargo en cuentas de planilla digital**.

**Banrural** [V]: **no publica tarifario de comisiones de cuentas.** Su documento rotulado "Tarifario de servicios" contiene solo comisiones de crédito (apertura de crédito empresarial: Q150 para Q25–50 mil, hasta 0.25 % para más de Q500 mil). Su **Art. 48** dice: *"Las cuentas que no sufran movimiento durante **seis (6) meses** serán colocadas como inactivas… se les efectuarán **cargos mensuales por servicios**… **Al agotarse el saldo por dichos cargos se procederá a la cancelación de la cuenta**."*

**Banco Industrial** ⚠️: sus páginas de cargos y comisiones **no fueron verificables** durante esta investigación porque el dominio resuelve a una IP interna desde la red desde la que se hizo el estudio. Los datos de BI en esta sección vienen de agregadores o de terceros. **Dato cruzado que sí es sólido: BAC cobra Q10 desde el primer retiro y Bantrab Q5 por transacción a sus clientes por usar cajeros BI. La red BI es la más cara de acceder desde fuera.**

**Cuentas inactivas — el desenlace legal.** **Ley de Bancos, Art. 41 Ter** [V, texto literal]:

> *"Las cuentas de depósitos monetarios y de ahorro, en moneda nacional, **con saldos menores a un mil Quetzales (Q.1,000.00)**… que durante un período de **diez años** permanezcan inactivas… **prescribirán, de pleno derecho… en favor del Fondo para la Protección del Ahorro**."*

**Pero en la práctica los 10 años casi nunca se alcanzan:** el banco marca la cuenta inactiva a los 6–12 meses → cobra Q8 a Q50 mensuales → el saldo se consume → cancela la cuenta. **Las comisiones vacían la cuenta mucho antes de que prescriba.**

### 4.8 Tasas activas por destino

**Moneda nacional, julio 2026** [V] — [Banguat, Cuadro V.4](https://banguat.gob.gt/sites/default/files/banguat/estamonfin/estamonfin054.xls), fuente original Superintendencia de Bancos:

| Destino del crédito | Tasa MN | Tasa ME |
|---|---|---|
| **★ TARJETA DE CRÉDITO** | **45.84 %** | 40.88 % |
| **Consumo (sin tarjeta)** | **18.68 %** | 7.92 % |
| Agricultura, ganadería y pesca | 12.87 % | 7.29 % |
| Comercio | 11.97 % | 7.67 % |
| **Vivienda (actividades inmobiliarias)** | **9.42 %** | 7.64 % |
| Industrias manufactureras | 8.55 % | 6.95 % |
| Transporte y comunicaciones | 8.39 % | — |
| Construcción | 8.22 % | 7.40 % |

### 4.9 Tarjeta de crédito: la cifra más importante del informe

**Tasa promedio ponderada de tarjeta de crédito en moneda nacional: 45.84 % anual (julio 2026).** [V] Banguat.

**Serie reciente** [V]:

| Periodo | Tasa TC |
|---|---|
| Dic 2024 | 54.36 % |
| **Ene 2025** | **42.69 %** ← caída abrupta |
| Dic 2025 | 45.50 % |
| Jul 2026 | **45.84 %** |

El salto de 54.36 % a 42.69 % coincide con la entrada en vigor de la **Ley de Tarjetas de Crédito (Decreto 2-2024, vigente desde el 1 de septiembre de 2024)** y una reclasificación estadística. Desde entonces se estabilizó en torno a 45–46 %.

**Composición de la cartera de tarjetas al 31 dic 2025** [V] — [Banguat, Informe de Estabilidad Financiera dic 2025](https://banguat.gob.gt/sites/default/files/banguat/Publica/Informe_de_Estabilidad_Financiera_dic2025.pdf):

| Concepto | Valor |
|---|---|
| Saldo total de tarjetas | **Q47,279.5 millones** (US$6,146 M), +3.8 % interanual |
| **Crédito revolvente** | **61.6 %** (Q29,110.3 MM) |
| Extrafinanciamientos | 33.6 % |
| Convenios de pago | 4.8 % |
| Tarjetas como % del crédito al consumo | 32.4 % |
| Tarjetas como % del endeudamiento total de los hogares | 24.2 % |

**Tasas por producto — publicación oficial de DIACO al 31 mar 2026** [V] — [DIACO, tasas de tarjetas de crédito](https://diaco.gob.gt/media/2026/05/Tasaspdf-marzo-2026.pdf), 314 filas en moneda nacional de 39 emisores:

| Tasa mensual | Tasa efectiva anual (TEA) |
|---|---|
| Mínima: **0.99 %** | 12.5 % |
| Común corporativa/PYME: 1.50 % | 19.6 % |
| **Mediana del mercado: 4.00 %** | **60.1 %** |
| Común en tarjetas clásicas: 5.00 % | 79.6 % |
| **Máxima: 6.95 %** | **124.0 %** |

Las tasas mensuales son **[V]** de DIACO; la conversión a TEA es **[E]**, cálculo propio con (1+i)^12 − 1. **Además se aplica 12 % de IVA sobre los intereses** (Decreto 27-92), que encarece el costo real unos 3 puntos adicionales.

**Tasas por tipo de línea, dic 2025** [V] Banguat IEF:

| Producto | MN |
|---|---|
| **Líneas revolventes de tarjeta** | **51.9 %** |
| Extrafinanciamientos | 28.1 % |
| Convenios de pago | 17.7 % |
| Consumo sin tarjeta | 18.4 % |
| **Hipotecario vivienda** | **8.8 %** |

> **El crédito rotativo de tarjeta cuesta casi 6 veces más que una hipoteca.** Y con la tasa líder en 3.50 % y la inflación en 2.70 %, una tarjeta al 45.84 % cobra **más de 13 veces la tasa de política monetaria** y unos **43 puntos reales** por encima de la inflación.

**¿Existe una tasa máxima legal? NO.** [V]

- El Decreto 7-2015, la primera Ley de Tarjeta de Crédito, fue **anulado por la Corte de Constitucionalidad en 2018**.
- El **Decreto 2-2024** vigente **no fija techo de tasa**: rige la libre contratación del Art. 42 de la Ley de Bancos.
- Lo que **sí** exige el Decreto 2-2024: divulgar la tasa anualizada; calcular intereses sobre el saldo de capital financiado por los días usados; **prohibir la capitalización de intereses** sin autorización del tarjetahabiente; que **el interés moratorio no exceda la tasa de financiamiento pactada**; y que la SIB publique mensualmente la tasa promedio ponderada por emisor.

**Morosidad** [V] Banguat IEF dic 2025:

| Indicador | dic 2024 | **dic 2025** |
|---|---|---|
| **Morosidad de tarjetas de crédito** | 5.3 % | **5.5 %** |
| Morosidad de consumo (total) | 4.0 % | 3.9 % |
| **Morosidad del sistema bancario** | 2.5 % | **2.4 %** |
| Morosidad vivienda | 2.9 % | 2.9 % |

🚩 **Desmentido:** circuló en prensa (agosto 2026) que *"la mora en tarjetas de crédito supera el 43 %"*. **Esa cifra no debe usarse:** ninguna fuente oficial la respalda. El dato correcto es **5.5 %**. El 43–45 % probablemente confunde con otro dato real: **las tarjetas representan el 45.7 % de la cartera vencida del crédito de consumo**.

### 4.10 Préstamos personales y por segmento

| Producto | Tasa | Plazo | Monto | Etiqueta |
|---|---|---|---|---|
| **BI — Bi Fácil** (banca personal) | **19.00 % – 19.60 %** | 12 a 36 meses | máx. Q250,000 | [V-sec] requiere débito a cuenta monetaria BI y **1 año de estabilidad laboral** |
| **BI — Empresarial Express** (fiduciario) | 14 % – 18 % | hasta 5 años | — | [V-sec] |
| Sistema — consumo sin tarjeta | **18.68 %** | — | — | [V] Banguat jul 2026 |

**Tasas por segmento — dato oficial de Banrural al 31 jul 2026** [V]:

| Segmento | MN mín | MN máx | **MN moda** |
|---|---|---|---|
| Créditos empresariales | 4.75 % | 57.00 % | **9.00 %** |
| Créditos productivos (≈ microcrédito) | 4.60 % | 38.00 % | **22.50 %** |
| **Hipotecarios para vivienda** | **4.00 %** | 22.50 % | **10.00 %** |
| **Créditos de consumo** | 4.00 % | **59.40 %** | **59.40 %** |

> **Lectura crítica:** la **moda** (la tasa más frecuente) del crédito de consumo en Banrural es **59.40 %** — el crédito de consumo masivo se coloca **en el techo, no en el promedio**. Y la moda hipotecaria real es **10.00 %**, no el "desde 7 %" de la publicidad.

### 4.11 Hipotecas

| Banco | Plazo máx. | Financiamiento | Enganche | Tasa anunciada | Etiqueta |
|---|---|---|---|---|---|
| **Banco Industrial** | **5 a 25 años** | hasta **80 %** del avalúo | **20 %** | desde **7 %** en Q / 6.75 % en US$ | [V-sec] |
| **BAC Credomatic** | **30 años** | **80 %** del avalúo comercial; **95 % vía FHA** | **20 %** (5 % en vivienda nueva FHA) | **desde 8.50 %** | [V] |
| **Banrural** | hasta **30 años** | no publica | no publica | no publica; **moda real 10.00 %** | [V] la moda |
| **G&T Continental** | hasta **20 años** (30 en su programa FHA) | hasta **80 %** | 20 % | vía FHA: 6 % variable + 1 % seguro FHA + 0.26 % desgravamen = **7.26 % conjunta** | [V-sec] |
| **CHN** | no publica | no publica | no publica | no publica | [V] la ausencia |

**Financiamiento de BI según garantía** [V-sec]: 50 % si es terreno · 70 % si es casa · **80 % si es casa con menos de 5 años de antigüedad**.

⚠️ **Advertencia sobre las tasas "desde":** ningún banco guatemalteco publica un tarifario hipotecario fechado y legible. Todas las tasas "desde" son gancho para el mejor perfil. **El contraste con la moda real de Banrural (10.00 % frente a un mercado que anuncia "desde 7 %") mide la brecha.**

**Relación cuota/ingreso — hallazgo contraintuitivo:** **no existe un límite regulatorio nacional.** El Reglamento para la Administración del Riesgo de Crédito (**JM-93-2005**) define capacidad de pago pero delega el umbral a cada banco: la evaluación se hace *"conforme a las políticas aprobadas por el consejo de administración de cada institución"*. [V]

| Referencia | Valor |
|---|---|
| Límite regulatorio de la SIB / Junta Monetaria | **No existe cifra fija** [V] |
| Banco Industrial | endeudamiento hasta **30 % sobre los ingresos** [V-sec] |
| El "30–40 %" que circula en blogs | **no verificable** en ninguna fuente oficial |

**Gastos de cierre** [V-sec, coherente entre fuentes fiscales]:

| Concepto | Tasa | Aplica a |
|---|---|---|
| **IVA** | **12 %** | **Primera** venta del inmueble (vivienda nueva) |
| **Timbres Fiscales** | **3 %** | **Segunda y posteriores** ventas |
| **IUSI** (Decreto 15-98) | hasta Q2,000 exento · Q2,000–20,000 → 2 por millar · Q20,000–70,000 → 6 por millar · más de Q70,000 → **9 por millar** | anual, en 4 cuotas trimestrales, sobre el valor de **matrícula fiscal** (muy inferior al de mercado) |
| **Gastos de cierre totales** | **4 % a 8 %** del valor | [E] estimación de mercado |
| Honorarios notariales | 1 % a 2 % | [E] |
| Inscripción de hipoteca en el Registro de la Propiedad | ≈ Q250 | [E] |

Ejemplo: un inmueble inscrito en Q100,000 paga **Q606 anuales** de IUSI. [E] cálculo con la escala verificada.

**FHA — Instituto de Fomento de Hipotecas Aseguradas** [V] — [fha.gob.gt](https://fha.gob.gt/quienessomos/sistemaFHA):

Institución estatal creada el 7 de junio de 1961. **No presta dinero: asegura** los créditos hipotecarios de largo plazo que otorgan los bancos. Eso es lo que permite al banco aceptar un enganche mucho menor: el riesgo lo absorbe el Estado.

| Concepto | Valor |
|---|---|
| **Plazo máximo** | **hasta 30 años** |
| **Enganche — vivienda nueva** | **desde 5 %** |
| **Enganche — vivienda existente** | **desde 10 %** |
| **Prima FHA total** | **1.26 %** sobre el monto financiado |
| — seguro de hipoteca | 1.00 % |
| — seguro de desgravamen | 0.26 % |
| Evaluación | capacidad de pago **por núcleo familiar**, no individual |
| Bancos con producto FHA | CHN, BAC (financia hasta 95 %), G&T, Banco Industrial |

⚠️ **La prima FHA se SUMA a la tasa, no está incluida.** Ejemplo real de G&T: 6 % variable + 1 % FHA + 0.26 % desgravamen = **7.26 % conjunta**.

**FOPAVI — Fondo para la Vivienda** [V] — [fopavi.gob.gt](https://fopavi.gob.gt/acerca/requisitos/): subsidio **directo no reembolsable** del Ministerio de Comunicaciones, Infraestructura y Vivienda.

| Dato | Valor |
|---|---|
| **Monto máximo del subsidio** | **Q35,000.00** (en 4 desembolsos) |
| **Ingreso máximo del hogar** | **hasta 4 salarios mínimos mensuales** |
| Vivienda tipo | **36 m²**: 2 dormitorios, sala-comedor, cocina, baño y pila; lote mínimo 6 × 15 m |
| Costo del trámite | **Q0** |
| **Tiempo oficial de resolución** | **11 meses, 1 semana y 4 días** |
| Compromiso posterior | ocupar en máximo 6 meses y **residir y mantenerla al menos 5 años** |

**Seguros obligatorios en hipoteca:** BAC incluye vida + daños + desempleo o invalidez **dentro de la cuota mensual**; G&T exige vida con cobertura de la deuda; Banrural exige vida sobre saldo deudor. [V]

**Fiador en hipoteca:** en el crédito hipotecario **el inmueble es la garantía**. No se encontró ningún banco que exija fiador adicional. [V]

### 4.12 Requisitos

**Para abrir una cuenta — el marco antilavado.** La **Ley contra el Lavado de Dinero (Decreto 67-2001), Art. 20 y 21** [V, texto literal] prohíbe cuentas anónimas y obliga a *"verificar fehacientemente la identidad, razón social o denominación de la persona, edad, ocupación u objeto social, estado civil, domicilio, nacionalidad, personería, capacidad legal y personalidad"*. Por eso todo banco guatemalteco pide llenar **"formularios IVE"** (Intendencia de Verificación Especial) — es mandato legal, no burocracia del banco. El Art. 24 obliga a registrar toda transacción en efectivo que **supere US$10,000**.

**Requisitos prácticos verificados — Banrural Cuenta Rural** [V]:

- **DPI** (Documento Personal de Identificación)
- **Recibo de servicios** (agua, luz o teléfono)
- **Monto mínimo de apertura: Q500.00 o US$100**
- Extranjeros: pasaporte vigente, recibo reciente de servicios, **constancia de trabajo**, documento de condición migratoria; si no es residente, mandato a favor de un guatemalteco residente

**Para calificar a un crédito — Reglamento JM-93-2005** [V, citas textuales]:

**Art. 14 (persona individual):** nombre completo, **NIT**, DPI, actividad y ocupación principal, dirección y teléfono; si trabaja en relación de dependencia: **nombre, dirección y teléfono del empleador, cargo y antigüedad laboral**; solicitud firmada; fotocopia del documento de identidad; **referencias bancarias y/o comerciales**; y **constancia de consulta al Sistema de Información de Riesgos Crediticios (SIRC)**.

**Art. 19 (hipotecario para vivienda):** estado patrimonial y estado de ingresos y egresos con **antigüedad no mayor de 4 meses**; si es asalariado, **certificación reciente de ingresos y de antigüedad laboral, debidamente verificada**.

**Art. 20 (consumo):** estado patrimonial solo **cuando el crédito supere Q80,000**. Por debajo, si es asalariado **basta la certificación de ingresos y antigüedad laboral**.

> **Nota:** el reglamento **no exige declaraciones de IVA/ISR**. Exige NIT, patente de comercio y estados financieros certificados. Las declaraciones y el RTU son práctica bancaria complementaria, no exigencia legal. [V]

**El buró de crédito en Guatemala — tres sistemas distintos:**

| Sistema | Qué es | Cómo se consulta |
|---|---|---|
| **SIRC** — Sistema de Información de Riesgos Crediticios | La "central de riesgos" oficial, administrada por la **SIB**, alimentada obligatoriamente por las entidades supervisadas (Ley de Bancos Arts. 58 y 61; Acuerdo SIB 05-2011). Los bancos lo consultan **exclusivamente para análisis de crédito** | Solo entidades supervisadas |
| **Constancia de récord crediticio (SIB)** | La vía del ciudadano. Contiene morosidad, deuda por institución, número y tipo de crédito, tipo de garantía, saldo de capital e intereses, fecha del último pago | **GRATUITO.** En línea (el banco habilita usuario y contraseña) o presencial en oficinas centrales de la SIB, **sin cita previa, solo con DPI** |
| **Infornet** (buró privado) | Referencias crediticias más **información judicial y registral**. Fuentes: bancos, financieras y juzgados | El ciudadano **puede consultar, agregar, actualizar o corregir su información "sin costo alguno"** y sin intermediarios |

⚠️ **TransUnion Guatemala** opera en el país, pero **no publica el procedimiento, costo ni frecuencia** para que un guatemalteco obtenga su propio reporte. **El "reporte anual gratuito" de AnnualCreditReport.com es una figura de la ley estadounidense y NO existe en Guatemala.** [V]

**En Guatemala la vía gratuita y confiable para conocer el propio historial es la SIB, no los burós privados.** El propio Infornet dirige a los consumidores a la SIB.

---
## 5. Remesas familiares

Guatemala es **el país de América Latina con mayor dependencia económica de las remesas**. Para un juego financiero guatemalteco, las remesas no son un detalle de color: son el segundo motor del ingreso de los hogares después del trabajo.

### 5.1 Volumen y peso macroeconómico

| Indicador | Valor | Etiqueta |
|---|---|---|
| **Remesas 2025 (año completo)** | **US$25,530.2 millones** (≈ Q195,306 millones) | [V] [Banguat vía Prensa Libre, 7 ene 2026](https://www.prensalibre.com/economia/ingresos-por-remesas-familiares-alcanzan-record-historico-en-guatemala-y-alcanzan-us25-mil-530-2-millones-breaking/) |
| Remesas 2024 | US$21,510.2 millones | [V] Banguat |
| **Crecimiento 2025 vs. 2024** | **+18.7 %** (+US$4,020 millones) | [V] Banguat |
| **Peso en el PIB (2025)** | **20.7 %** | [V] [Banguat vía Prensa Libre](https://www.prensalibre.com/economia/como-las-remesas-familiares-se-consolidaron-como-motor-clave-de-la-economia-en-el-2025-al-aportar-el-20-7-del-pib/) |
| Peso en el PIB (2023 y 2024) | 19 % | [V] misma fuente |
| Promedio mensual 2025 | US$2,127.5 millones | [V] Banguat |
| **Promedio diario 2025** | **≈ US$100 millones/día** (primera vez en la historia) | [V] Banguat |
| Mes récord histórico | julio 2026: **US$2,468.6 millones** | [V] [Banguat vía La Hora, 6 ago 2026](https://lahora.gt/lh-economia/esmith/2026/08/06/guatemala-recibio-en-julio-usd-2-mil-468-millones-el-monto-mas-alto-mensual-segun-el-banguat/) |
| **Acumulado ene–jul 2026** | **US$15,447.1 millones** (+6.6 % interanual) | [V] [Banguat vía Prensa Libre](https://www.prensalibre.com/economia/remesas-en-guatemala-a-julio-alcanzan-us15-mil-447-millones-y-se-consolidan-como-motor-economico/) |
| Acumulado últimos 12 meses (a jul 2026) | US$26,484 millones (+10.7 %) | [V] Banguat vía La Hora |
| **Proyección Banguat cierre 2026** | **US$26,806 millones** (+5 %) | [V] [Banguat](https://emisorasunidas.com/nacional/2026/05/21/banco-guatemala-banguat-crecimiento-economico-remesas/) |
| Hogares receptores | ≈ **1.7 millones de hogares** / más de 6 millones de beneficiarios | [V-sec] Banguat / OIM citados en prensa |

**Contexto del salto de 2025:** el crecimiento de 18.7 % se atribuye al buen desempeño del empleo hispano en EE. UU. **y a los envíos anticipados por temor a las medidas migratorias** del segundo período de Trump. [V] Prensa Libre / Banguat. Es un pico anómalo: la proyección 2026 vuelve a un crecimiento normal de 5 %.

### 5.2 Monto promedio por envío

**El Banguat no publica el número de transacciones ni el monto promedio por envío** en sus series abiertas. Las cifras disponibles son:

| Indicador | Valor | Etiqueta |
|---|---|---|
| Monto promedio por transferencia | **US$462** | [V-sec, DATO ANTIGUO] CEMLA 2017, citado en [RemitScope/BID, doc. país Guatemala](https://remitscope.org/wp-content/uploads/2024/11/Diagnostics_Guatemala_WEB.pdf) |
| Monto promedio mensual por remitente | **US$879** | [V-sec] misma fuente |
| **Monto promedio por envío (2026)** | **US$550 – US$650** (≈ Q4,200 – Q4,950) | **[E]** — actualización del dato CEMLA 2017 por la inflación acumulada en EE. UU. y el crecimiento del flujo total |
| **Ingreso mensual promedio de un hogar receptor** | **≈ US$1,250 (≈ Q9,530)** | **[E]** — cálculo propio: US$25,530 M / 1.7 M hogares / 12 meses. Ojo: es un promedio inflado por hogares que reciben mucho; la mediana es sustancialmente menor |

**Advertencia:** el promedio de US$1,250/mes por hogar receptor es matemáticamente correcto pero engañoso — supera el ingreso laboral promedio de un hogar guatemalteco entero. La distribución de remesas es tan asimétrica como la del ingreso laboral. Para el juego, use un rango **[E] de Q1,500–Q4,000 mensuales** como remesa típica de un hogar de ingreso medio-bajo.

### 5.3 Comisiones y tipos de cambio de los operadores

| Operador | Comisión | Margen sobre el tipo de cambio | Costo efectivo total | Etiqueta |
|---|---|---|---|---|
| **Wise** | ≈ US$1.80 por envío de US$200 (<1 %) | usa el tipo **mid-market** (sin margen) | **≈ 0.9 % – 1.5 %** | [V-sec] [Dineroza](https://www.dineroza.com/remesas/guatemala) / [LivingInGuatemala](https://livinginguatemala.com/remittances/best-ways-from-usa/) |
| **Remitly** (Economy) | competitivo; **primer envío gratis** | margen moderado | ≈ 1.5 % – 3 % | [V-sec] misma |
| **Remitly Express** | mayor comisión | margen | ≈ 3 % – 4 % (entrega en minutos) | [V-sec] misma |
| **Xoom (PayPal)** | media | margen | ≈ 2 % – 4 % | [V-sec] misma |
| **Western Union** | **Q7.70 – Q167** según monto | **1.5 % – 2 %** sobre el tipo Banguat (otras fuentes reportan hasta 5 %) | **≈ 3 % – 5 %** | [V-sec] [Wise blog](https://wise.com/gt/blog/remesa-western-union-guatemala) / [Comparalatam](https://comparalatam.com/gt/change/western-union.html) |
| **MoneyGram / Ria** | similar a WU | margen 2 % – 5 % | ≈ 3 % – 5 % | [V-sec] LivingInGuatemala |
| **Bancos (wire tradicional)** | alta | margen 2 % – 5 % | ≈ 3 % – 6 % | [V-sec] misma |

**Referencia de tipo de cambio:** tipo de cambio de referencia Banguat al 4 sep 2026 = **Q7.62635 / US$1** [V]. Las fuentes secundarias citan Q7.73–Q7.75 como el tipo que aplican los operadores al público — es decir, el receptor recibe **menos** quetzales por dólar de lo que sugiere el tipo oficial. Esa diferencia es el margen cambiario oculto.

**El cálculo que el juego debe enseñar [E]:** en un envío de **US$500**:

| Vía | Comisión | Pérdida cambiaria | Recibe (aprox.) |
|---|---|---|---|
| Wise (a cuenta bancaria) | ≈ US$4.50 | ≈ US$0 | **≈ Q3,779** |
| Western Union (efectivo) | ≈ US$10 | ≈ US$10 (2 %) | **≈ Q3,660** |
| Banco tradicional | ≈ US$15 | ≈ US$15 (3 %) | **≈ Q3,585** |

Diferencia entre la mejor y la peor opción: **≈ Q194 por envío**, o **≈ Q2,300 al año** si se envía mensualmente. Eso es medio salario mínimo tirado a la basura por no comparar. **[E]** — cálculo propio con las comisiones y márgenes verificados arriba.

### 5.4 Cómo recibe la gente las remesas en la práctica

Datos de la **Encuesta Nacional de Inclusión Financiera de los Hogares (ENIFH) 2025 del INE** — primera encuesta nacional propia de inclusión financiera; muestra de 10,500 viviendas, población de 18 años o más, trabajo de campo mayo–junio 2025, publicada en diciembre de 2025. [V] — [INE, Informe de resultados ENIFH](https://www.ine.gob.gt/wp-content/uploads/2025/12/INFORME-DE-RESULTADOS-ENIFH.pdf)

| Canal de cobro | % de hogares receptores | Etiqueta |
|---|---|---|
| **Cobro en efectivo en agencia bancaria** | **71.7 %** | [V] ENIFH 2025 |
| **Retiro en efectivo por agente bancario / tienda de barrio** | **53.7 %** | [V] misma |
| **Depósito en cuenta bancaria** | **44.9 %** | [V] misma |
| A través de una remesadora | 9.8 % | [V] misma |
| **Billetera electrónica / monedero digital** | **3.6 %** | [V] misma |

(Los porcentajes suman más de 100 % porque un mismo hogar usa varios canales.)

**Cuántos hogares reciben y en qué se gasta la remesa** [V] ENIFH 2025:

| Indicador | Valor |
|---|---|
| Hogares que reciben remesas | **22.5 %** |
| Adultos que recibieron remesas | 21.7 % (mujeres 22.8 %) |
| **Destino: pago de bienes y servicios** | **48.7 %** |
| Destino: otros | 20.3 % |
| Destino: inversiones | 13.1 % |
| Destino: pago de deudas | 10.3 % |
| **Destino: AHORRO** | **7.6 %** |

**Concentración del mercado:** **Banrural y Banco Industrial concentran más del 80 %** del mercado de pago de remesas en Guatemala. Banrural domina por su red de agentes rurales, la más extensa del país. [V-sec] [RemitScope / BID, doc. país Guatemala](https://remitscope.org/wp-content/uploads/2024/11/Diagnostics_Guatemala_WEB.pdf)

**El hallazgo clave:** según el mismo diagnóstico, **solo el 18 % de los receptores tiene cuenta bancaria, y aun teniéndola prefieren retirar en efectivo**. [V-sec] RemitScope/BID. El presidente del Banguat ha señalado que históricamente **el 80 % de los receptores retiraba el efectivo sin mantener cuenta**.

> **El dato que resume la sección:** entran al país **más de US$25,500 millones al año** — más del 20 % del PIB — y **solo el 7.6 % de esos hogares destina algo al ahorro**. El 71.7 % lo saca en efectivo por la ventanilla el mismo día.

**Implicación de diseño:** la remesa llega, se convierte en efectivo el mismo día y se gasta. El punto de fuga pedagógico está justo ahí: el juego puede mostrar qué pasaría si una fracción de la remesa se depositara en lugar de retirarse — y cómo el hábito del efectivo cuesta en comisiones, en seguridad y en historial crediticio (sin movimientos bancarios no hay historial, y sin historial no hay crédito barato).

⚠️ **Advertencia para el diseño de un canal digital en el juego:** **Tigo Money, el mayor monedero electrónico del país, cerró operaciones el 30 de junio de 2026** tras 16 años. [V] — [aviso oficial de Tigo Guatemala](https://ayuda.tigo.com.gt/hc/centro-de-ayuda/articles/991178103694511). Su sustituto en remesas es **Zigi** (Banco Industrial + Intermex, lanzada en diciembre de 2025), que permite recibir remesas con solo el número de teléfono. Ninguno de los dos publica su número de usuarios.

---
## 6. Inclusión y educación financiera

### 6.1 Antes de cualquier cifra: hay dos Guatemalas en los datos

Es indispensable entender esto o el resto confunde. **Existen tres mediciones de "bancarización" y difieren en 30 puntos:**

| Enfoque | Qué mide | Cifra | Fuente |
|---|---|---|---|
| **OFERTA** (supply-side) | Cuentas registradas en bancos ÷ población adulta | **68.4 %** | [V] SIB, Boletín Trimestral No. 49, dic 2025 |
| **DEMANDA** (encuesta nacional a hogares) | Personas que declaran tener un producto financiero | **42.2 %** | [V] INE, ENIFH 2025 |
| **DEMANDA internacional** | Adultos 15+ con cuenta | **38.3 %** | [V] Banco Mundial, Global Findex 2025 |

La propia Estrategia Nacional de Inclusión Financiera advierte en su nota al pie: *"este indicador no discrimina si un titular en particular posee más de una cuenta bancaria, por lo que la medición podría estar sobrestimada"*. [V]

Los números detrás: **20.4 millones de cuentas** pero solo **7.87 millones de depositantes únicos** — **1.8 cuentas por adulto**. [V] SIB dic 2025.

> **Los funcionarios citan públicamente 68 %–85 %; las encuestas a la gente dicen 38 %–42 %. La brecha de 26 a 30 puntos es en sí misma el dato más importante de esta sección.** Para un juego educativo, use la cifra de demanda: **~40 % de los adultos guatemaltecos tiene una cuenta**.

### 6.2 Tenencia de cuenta — Global Findex

[V] — Banco Mundial, Global Findex, consultado 4 sep 2026. La ronda 2025 tiene trabajo de campo mayo–diciembre 2024.

| Segmento | 2011 | 2014 | 2017 | **Findex 2021** | **Findex 2025** |
|---|---|---|---|---|---|
| **Total adultos 15+** | 22.3 % | 41.3 % | 44.1 % | 37.0 % | **38.3 %** |
| Hombres | 29.9 % | 48.8 % | 46.4 % | 39.9 % | **44.6 %** |
| Mujeres | 15.6 % | 34.7 % | 42.1 % | 34.3 % | **32.5 %** |
| **Brecha de género** | 14.3 pp | 14.1 pp | 4.3 pp | 5.6 pp | **12.1 pp** ⚠️ |
| Urbano | — | — | — | — | **50.6 %** |
| Rural | — | — | — | — | **32.7 %** |
| 40 % más pobre | 11.7 % | 29.1 % | 30.4 % | 33.9 % | **28.3 %** |
| 60 % más rico | 29.4 % | 49.5 % | 53.1 % | 39.0 % | **44.9 %** |
| Primaria o menos | 12.8 % | 26.2 % | 32.7 % | 29.0 % | **28.4 %** |
| Secundaria o más | 34.4 % | 53.2 % | 55.8 % | 46.4 % | **50.1 %** |
| **Jóvenes 15–24** | 21.7 % | 36.9 % | 41.6 % | 38.2 % | **34.8 %** |
| **Cuenta de dinero móvil** | — | 1.8 % | 2.1 % | 5.2 % | **3.3 %** ⚠️ |
| Cuenta "digitalmente habilitada" | — | — | — | — | 13.2 % |

**Tres retrocesos reales, no ruido estadístico:**

1. Guatemala está **6 puntos por debajo de su propio nivel de 2017** (44.1 % → 38.3 %).
2. **Las mujeres retrocedieron** de 34.3 % a 32.5 %; la brecha de género se **duplicó** de 5.6 a 12.1 pp.
3. **El 40 % más pobre retrocedió** de 33.9 % a 28.3 %.

**Comparación regional (2024)** [V]:

| País / región | Cuenta | Pagos digitales |
|---|---|---|
| Costa Rica | 71.4 % | 60.5 % |
| **América Latina y Caribe** | **69.7 %** | **59.4 %** |
| Panamá | 64.1 % | 52.1 % |
| México | 53.0 % | 41.4 % |
| El Salvador | 43.4 % | 28.0 % |
| Honduras | 42.4 % | 30.0 % |
| **GUATEMALA** | **38.3 %** | **22.6 %** |
| Nicaragua | 23.5 % | 16.4 % |
| Mundo | 78.7 % | — |

**Guatemala es el penúltimo de América Latina, solo por encima de Nicaragua, y está 31.4 puntos por debajo del promedio regional.**

### 6.3 ENIFH 2025 — la primera encuesta nacional propia

**Ficha técnica** [V] — [INE, Informe de resultados ENIFH, dic 2025](https://www.ine.gob.gt/wp-content/uploads/2025/12/INFORME-DE-RESULTADOS-ENIFH.pdf): muestreo probabilístico bietápico estratificado por conglomerados, marco del Censo 2018, **10,500 viviendas / 1,050 sectores censales**, 44 estratos, 95 % de confianza, población de **18 años o más**, campo mayo–junio 2025, representativa en los 22 departamentos.

| Indicador | Total | Hombres | Mujeres | Urbano | Rural | Ind./afro |
|---|---|---|---|---|---|---|
| **Al menos un producto financiero** | **42.2 %** | 46.4 % | 38.3 % | 51.3 % | 30.9 % | **27.7 %** |
| Ahorro formal | 38.6 % | 42.6 % | 34.9 % | 47.5 % | 27.5 % | 24.1 % |
| Ahorro informal | 41.3 % | 42.0 % | 40.7 % | — | — | 36.9 % |
| Algún crédito | 36.0 % | 39.7 % | 32.6 % | 39.6 % | 31.6 % | 30.4 % |
| **Crédito en institución FINANCIERA** | **15.5 %** | 18.6 % | 12.5 % | — | — | 10.0 % |
| **Crédito en institución NO financiera** | **26.2 %** | 28.0 % | 24.6 % | — | — | 24.5 % |
| **Tarjeta de crédito** | **11.0 %** | 14.2 % | 7.9 % | — | — | 5.1 % |
| Tarjeta de débito | 24.8 % | 29.9 % | 20.0 % | — | — | 13.3 % |
| Usó cajero automático (último año) | 26.8 % | 31.9 % | 22.0 % | — | — | **13.7 %** |
| **Tiene seguro** | **11.0 %** | 14.3 % | 8.0 % | — | — | 4.7 % |
| **Ahorra para la vejez** | **14.1 %** | 17.1 % | 11.3 % | — | — | 11.8 % |

**Brecha territorial (al menos un producto financiero)** [V]: Guatemala **63.3 %** · El Progreso 56.9 % · Escuintla 53.6 % ··· Totonicapán 26.6 % · Alta Verapaz 24.3 % · **Huehuetenango 19.5 %**.

**Un adulto de la capital tiene 3.2 veces más probabilidad de estar bancarizado que uno de Huehuetenango.**

### 6.4 Pagos digitales: el dato que más debería alarmar

[V] Global Findex:

| Indicador | 2014 | 2017 | 2021 | **2024** |
|---|---|---|---|---|
| **Hizo o recibió un pago digital** | 29.0 % | **33.3 %** | 25.9 % | **22.6 %** ↓ |
| Hizo un pago digital | 19.8 % | 26.7 % | 22.0 % | **17.2 %** ↓ |
| **Pago digital a comercio** | — | — | 8.8 % | **5.5 %** ↓ |
| Pagó en tienda con celular o tarjeta | — | — | 8.2 % | **5.1 %** ↓ |
| Compró algo en línea | — | — | 8.6 % | 7.2 % |
| Pago digital en compra en línea | — | — | 2.6 % | **1.4 %** |
| **Pagó CONTRA ENTREGA EN EFECTIVO una compra en línea** | — | — | 6.0 % | **5.8 %** |

**Los pagos digitales en Guatemala llevan siete años cayendo** — de 33.3 % (2017) a 22.6 % (2024). Y eso ocurre mientras **80.9 % de los adultos tiene celular, 63.1 % un smartphone y 71.1 % usó internet en los últimos 3 meses**. [V] Findex 2025.

> **El problema no es el acceso al teléfono: es que la gente no lo usa para pagar. 4 de cada 5 compras en línea se pagan en efectivo contra entrega.**

**Dominio absoluto del efectivo** [V] ENIFH 2025:

| Forma de pago | Compras < Q200 | Compras > Q200 |
|---|---|---|
| **Efectivo** | **93.8 %** | **88.6 %** |
| Tarjeta de débito | 3.4 % | 5.7 % |
| Tarjeta de crédito | 1.2 % | 2.0 % |
| Otros (cheque, transferencia, QR) | 1.6 % | 3.6 % |

Entre pueblos indígenas y afrodescendientes el efectivo sube a **97.1 %** y **94.2 %**.

**Razón declarada de pagar en efectivo** [V] Findex 2025: *"está acostumbrado a pagar con efectivo"* **22.2 %** · *"el comercio solo acepta efectivo"* 3.2 % · *"no confía en pagos con tarjeta o teléfono"* 1.6 %.

> **La inercia cultural pesa 7 veces más que la falta de aceptación del comercio.** Eso convierte el hábito —no la infraestructura— en el objetivo pedagógico correcto.

**Dinero móvil — un retroceso estructural:**

| Dato | Valor | Etiqueta |
|---|---|---|
| Adultos con cuenta de dinero móvil | **3.3 %** (era 5.2 % en 2021) | [V] Findex 2025 |
| Hogares que reciben remesas por billetera electrónica | 3.6 % | [V] ENIFH 2025 |
| **Marco legal de dinero electrónico** | **NO EXISTE LEY.** Solo un anteproyecto con opinión favorable de la Junta Monetaria | [V] ENIF 2024-2027 |

🔴 **HECHO CRÍTICO: TIGO MONEY CERRÓ.** El mayor monedero electrónico del país **finalizó operaciones el 30 de junio de 2026**, tras 16 años. Último día para recibir dinero: 31 de marzo de 2026. [V] — [aviso oficial de Tigo Guatemala](https://ayuda.tigo.com.gt/hc/centro-de-ayuda/articles/991178103694511). **Su número de usuarios nunca se publicó**; el dato de ">500 mil usuarios activos" que circula es de 2017 y ya no aplica.

**Zigi** (Banco Industrial + Intermex), lanzada en diciembre de 2025 para recibir remesas con solo el número de teléfono, con tarjeta de débito Mastercard. **Número de usuarios: no publicado.** [V]

**Servicios financieros móviles según la SIB (solo bancos), al 31 dic 2025** [V]:

| Indicador | Valor |
|---|---|
| Productos afiliados a SFM | **24,087,357** |
| **Concentración: Banco Industrial** | **50.6 %** de los productos afiliados |
| Banrural / Promerica / BAC | 13.0 % / 10.1 % / 7.3 % |
| Transacciones oct–dic 2025 | 90.9 millones de operaciones · Q115,801 MM · **ticket promedio Q1,274** |

⚠️ **Advertencia metodológica:** el salto de 3.7 M (2022) a 19.8 M (2023) productos afiliados **es un cambio de definición, no crecimiento real** (desde jun 2023 se incluyen apps y todos los tipos de producto). Solo la serie de afiliación **física** es comparable en todo el período.

### 6.5 La población excluida y por qué

**Adultos sin cuenta: 61.7 % — aproximadamente 7.8 millones de personas.** [E] cálculo propio: 61.7 % de ~12.6 M de adultos 15+.

**Barreras según Findex 2025** [V]:

| Razón para no tener cuenta | % de adultos 15+ | % de los NO bancarizados |
|---|---|---|
| **Los servicios financieros son muy caros** | 37.3 % | **60.0 %** |
| **Las instituciones están muy lejos** | 30.5 % | **48.7 %** |
| Alguien de la familia ya tiene una | 20.2 % | 31.9 % |
| **Falta de confianza en las instituciones** | 20.2 % | ≈32.7 % |
| Falta de documentación necesaria | 14.5 % | ≈23.5 % |
| Fondos insuficientes | 14.1 % | 22.6 % |

**Barreras según ENIFH 2025 — razón para no tener cuenta de ahorro formal** [V]:

| Razón | % |
|---|---|
| **No le alcanza** | **42.8 %** |
| No necesita | 21.1 % |
| **No sabe qué es o cómo usarla** | **10.4 %** |
| Falta de confianza | 5.3 % |
| Piden requisitos que no tiene | 4.5 % |
| La sucursal está lejos | 3.3 % |
| Intereses bajos o comisión alta | 2.9 % |
| No quiere que le cobren impuestos | 1.9 % |

**Dato revelador:** solo **22.7 %** de los adultos sin cuenta cree que **podría usarla sin ayuda** si se la abrieran. Y solo **8.5 %** de los no bancarizados ha tenido una cuenta alguna vez. [V] Findex 2025.

### 6.6 La infraestructura NO es el cuello de botella

**Puntos de acceso al 31 dic 2025** [V] SIB (denominador oficial: 11,503,100 adultos):

| Tipo | Cantidad | % |
|---|---|---|
| **Establecimientos de agentes bancarios** | **61,076** | 89.7 % |
| Cajeros automáticos | 4,215 | 6.2 % |
| Agencias bancarias | 2,787 | 4.1 % |
| **TOTAL** | **68,078** | 100 % |

| Indicador | Valor |
|---|---|
| Puntos de acceso por 100,000 adultos | **592** |
| **Municipios con al menos un punto de acceso** | **100 %** (340 de 340) |
| Mayor densidad: Petén | 122.5 por 10,000 adultos |
| Menor densidad: Alta Verapaz | 46.7 por 10,000 adultos |

Serie histórica: de 14,920 puntos (2019) a 68,078 (dic 2025) — **crecimiento de 356 % en seis años**, impulsado casi enteramente por agentes bancarios. [V]

**Contraste internacional (por 100,000 adultos, 2024)** [V] IMF Financial Access Survey / Banco Mundial:

| Indicador | Guatemala | ALC | Costa Rica | Honduras |
|---|---|---|---|---|
| **Sucursales bancarias** | **21.9** | 11.7 | 15.1 | 16.0 |
| Cajeros automáticos | 33.6 | 42.0 | 64.0 | 27.5 |
| Prestatarios (por 1,000 adultos) | 167.4 | 209.0 | 259.8 | 120.8 |

> **Guatemala tiene casi el DOBLE de sucursales per cápita que el promedio regional y, aun así, la mitad de la bancarización. El problema no es dónde están los bancos.**

**Cuentas y deudores al 31 dic 2025** [V] SIB:

| Concepto | Cantidad | Monto |
|---|---|---|
| Cuentas de ahorro | 13,160,112 | Q118,543 MM |
| Cuentas monetarias | 7,062,004 | Q51,802 MM |
| Cuentas a plazo | 147,607 | Q82,679 MM |
| **TOTAL cuentas de depósito** | **20,369,723** | **Q253,024 MM** |
| **Depositantes ÚNICOS** | **7,871,619** | — |
| Deudores de tarjeta de crédito | 1,640,226 | Q18,495 MM |
| Deudores de préstamos | 1,923,733 | Q141,118 MM |
| **Adultos con al menos un préstamo bancario** | **16.8 %** | de 33.6 % en Guatemala a **6.3 % en Totonicapán** |

Depósitos per cápita: **Q60,546 en Guatemala vs. Q3,666 en Totonicapán** (16.5×). [V]

❌ **NO PUBLICADO:** el número total de tarjetas de crédito y de débito vigentes. Ni la SIB, ni Banguat, ni el FMI lo publican. El mejor proxy es **3,733,238 activos crediticios de tarjeta con saldo en bancos** (piso, no total). Para débito **no existe ni proxy**.

**Sistema de pagos: el mayorista se digitaliza, el minorista no** [V] — [Banguat, operaciones LBTR](https://banguat.gob.gt/sites/default/files/banguat/Publica/SPagos/quetzales.pdf):

| Año | Cheques | Transferencias instantáneas (TIF) | Razón TIF/cheque |
|---|---|---|---|
| 2021 | 10,917,006 | 24,510,730 | 2.2× |
| 2023 | 8,671,220 | 64,658,510 | 7.5× |
| **2025** | **6,704,266** | **121,496,540** | **18.1×** |

Cheques **−38.6 %**; transferencias instantáneas **+396 %** (2021–2025). Ticket promedio de una TIF en 2025: **Q1,625**.

> **La contradicción central:** el sistema mayorista se digitaliza a gran velocidad, pero el pago cotidiano de la gente sigue siendo **93.8 % efectivo**. La digitalización llegó a los bancos, no a la tienda de la esquina.

### 6.7 Crédito formal vs. informal

**El crédito informal casi DUPLICA al formal** [V] ENIFH 2025:

| Tipo de crédito | % de adultos 18+ |
|---|---|
| **En instituciones NO financieras** (casas de empeño, adelantos, amigos, familiares, ONG, asociaciones comunales, **prestamistas "gota a gota"**) | **26.2 %** |
| **En instituciones financieras** (bancos, cooperativas, microfinancieras) | **15.5 %** |

**Garantía usada** [V]: **71.8 % no dejó ninguna garantía** · hipoteca 12.4 % · otros 9.3 % · fiador 6.5 %.

**Destino principal del crédito** [V]: comprar o reparar casa 41.0 % · **gastos de comida 25.8 %** (29.1 % entre mujeres) · otros 19.7 % · **atender emergencias 13.5 %**.

> **Casi el 40 % del crédito guatemalteco financia consumo de subsistencia, no inversión.**

**Endeudamiento según Findex** [V]:

| Indicador | 2021 | 2024 |
|---|---|---|
| Pidió prestado (cualquier fuente) | 31.7 % | **41.3 %** ↑ |
| **De banco o institución financiera formal** | 11.2 % | **8.7 %** ↓ |
| De familia o amigos | 22.3 % | 15.3 % |
| **Compró comida al fiado** | — | **18.9 %** |
| Se endeudó por salud o motivos médicos | 16.2 % | 18.8 % |
| Tiene tarjeta de crédito | 5.5 % | **4.2 %** ↓ |
| **Pagó el saldo completo de la tarjeta a tiempo** | 3.8 % | **2.5 %** |

**El endeudamiento total subió 10 puntos mientras el crédito bancario formal bajó.** Y "comprar comida al fiado" (18.9 %) supera al crédito bancario formal (8.7 %) por más del doble.

**Ahorro** [V]:

| Indicador | Findex 2021 | Findex 2024 |
|---|---|---|
| Ahorró algo de dinero | 32.5 % | 34.0 % |
| **Ahorró en institución financiera** | 10.3 % | **10.3 %** |
| Ahorró para la vejez | — | 3.2 % |

**Formas de ahorro informal** [V] ENIFH 2025:

| Forma | Nacional |
|---|---|
| **Guardó dinero en su casa** | **27.0 %** |
| Comprando animales o bienes | 13.6 % |
| **Participó en cuchubal** | **8.7 %** |
| Prestando dinero a terceros | 5.1 % |
| Guardó dinero con familiares | 5.1 % |
| Caja de ahorro del trabajo | 4.8 % |

**Resiliencia financiera** [V] Findex:

| Indicador | 2021 | 2024 |
|---|---|---|
| Podría reunir fondos de emergencia en 30 días | 78.7 % | 84.7 % |
| — pero le sería **muy difícil** | 35.8 % | **45.2 %** |
| **Fuente principal: familia o amigos** | 41.6 % | **34.2 %** |
| Fuente principal: ahorros | 11.9 % | 16.2 % |

**Mayor preocupación financiera declarada** [V]: pagar gastos o recibos mensuales **36.8 %** · costos médicos ante enfermedad grave 22.5 % · dinero para la vejez 12.1 %.

### 6.8 Usura y "gota a gota"

| Dato | Valor | Etiqueta |
|---|---|---|
| **Interés mínimo cobrado por el "gota a gota"** | **20 % DIARIO** | [V-sec] Insight Crime vía La Hora, abr 2026 |
| Montos típicos | Q500 a Q5,000, plazos de días a semanas con pago diario | [V-sec] Prensa Libre, dic 2024 |
| **Denuncias por secuestro modalidad "gota a gota"** (2024 → 2025 → ene-may 2026) | **7 → 66 → 77** | [V-sec] Fiscalía contra el Secuestro, vía Infobae ago 2026 |
| Rescate/extorsión típica exigida | Q5,000 – Q10,000 | [V-sec] |
| **Pena por usura** (Art. 276 del Código Penal reformado) | **4 a 10 años** de prisión + multa de **Q200,000 a Q500,000** (antes: 6 meses a 2 años) | [V-sec] La Hora, abr 2026 |

### 6.9 Los errores y desconocimientos financieros más comunes

**El dato más contundente de todo el informe** [V] ENIFH 2025:

| Adultos que **conocen la diferencia entre tasa de interés nominal, real y efectiva** | % |
|---|---|
| **Total nacional** | **5.2 %** |
| Hombres | 7.0 % |
| Mujeres | 3.5 % |
| Pueblos indígenas y afrodescendientes | 3.0 % |

> **Solo 1 de cada 20 adultos guatemaltecos distingue una tasa nominal de una efectiva. Esa es exactamente la brecha que explota una tarjeta al 5 % mensual (79.6 % TEA) o un "gota a gota" al 20 % diario.**

**Otros indicadores de desconocimiento** [V] ENIFH 2025 salvo indicación:

| Indicador | Valor |
|---|---|
| **No sabría a qué institución acudir** ante un problema con un producto financiero | **53.3 %** |
| Acudiría al banco 35.8 % · a la SIB 4.4 % · a DIACO 1.7 % | — |
| Ha presentado alguna vez un reclamo financiero | 5.7 % (indígenas 2.7 %) |
| **Sabe qué es un seguro** | **47.7 %** (indígenas 30.0 %) |
| Tiene un seguro | 11.0 % |
| No tiene seguro porque "no sabe qué son, cómo funcionan o dónde solicitarlos" | 13.0 % |
| No tiene cuenta porque "no sabe qué es o cómo usarla" | 10.4 % |
| Cree que podría usar una cuenta sin ayuda (entre no bancarizados) | 22.7 % [V] Findex |
| **Adultos financieramente alfabetizados** (3 de 4 conceptos: numeracidad, interés compuesto, inflación, diversificación) | **26 %** (mundo 33 %; Costa Rica 35 %; El Salvador 21 %) — [V-sec] **⚠️ dato de 2014**, único benchmark internacional existente |

❌ **Vacíos confirmados:** Guatemala **NO participa** en la Encuesta de Capacidades Financieras de la **CAF** (sí lo hacen Colombia, Perú, Chile, Panamá, Costa Rica). **No existe** puntaje **OCDE/INFE** para Guatemala. Fuera del 26 % de S&P (2014), **no hay medición internacional de alfabetización financiera para el país**.

**Los errores concretos, documentados con cifras:**

| # | Error | Evidencia |
|---|---|---|
| 1 | **No entender el costo del crédito** | 5.2 % distingue tasa nominal de efectiva [V] |
| 2 | **Endeudarse para consumir, no para invertir** | 25.8 % de los créditos van a **comida**; 13.5 % a emergencias; **18.9 % compró comida al fiado** [V] |
| 3 | **No pagar el saldo completo de la tarjeta (revolvencia)** | Solo **2.5 % de los adultos** paga el saldo completo, de un 4.2 % que tiene tarjeta → **más del 40 % de los tarjetahabientes no liquida su saldo**. En la cartera nacional, **61.6 % del saldo de tarjetas es crédito revolvente** [V] |
| 4 | **Prestar y pedir prestado sin garantía ni contrato** | **71.8 % de los préstamos no dejó ninguna garantía** [V] |
| 5 | **No presupuestar ni ahorrar formalmente** | 41.3 % ahorra informalmente; **27.0 % guarda el dinero en su casa**; solo 14.1 % hace algo para la vejez [V] |
| 6 | **Mezclar finanzas personales y del negocio** | FUNDEA (ago 2026): *"Los emprendedores no definen claramente el destino de los fondos y no separan las finanzas personales de las del negocio"* — [V] declaración cualitativa, **sin cifra asociada** |
| 7 | **No poder demostrar ingresos ni tener historial** | Razones de rechazo de crédito: no pudo comprobar ingresos o eran insuficientes **27.8 %** · problemas con el buró **19.9 %** · piden documentos que no tiene 16.0 % · falta de garantía o fiador 10.0 % · **no tiene historial crediticio 8.5 %** [V] |
| 8 | **Salirse del crédito por descubrir tarde su costo** | Razón por la que dejó de tener crédito o tarjeta: ya no lo necesita 33.8 % · **le cobran intereses muy altos 22.1 %** · **no se quiere volver a endeudar 17.7 %** [V] |
| 9 | **Caer en esquemas piramidales** | Ver abajo |
| 10 | **No saber a quién reclamar** | 53.3 % no sabría a qué institución acudir [V] |

### 6.10 Estafas financieras

**Ciberdelitos y estafas** [V-sec] Ministerio Público, vía Infobae y Emisoras Unidas:

| Indicador | Valor |
|---|---|
| Ciberdelitos registrados 2019 | 1,292 |
| **Ciberdelitos registrados 2025** | **14,871 (+1,051 %)** |
| **Denuncias por estafas electrónicas, ene–jun 2026** | **7,925** |
| Denuncias diarias por estafa que recibe el MP | **más de 50** |
| % de la información que buscan los ciberdelincuentes que es financiera | **90 %** |
| Denuncias por clonación de tarjetas y estafas digitales (jun 2026) | 151 gestiones ≈ **Q11 millones** |

**Caso emblemático: el esquema piramidal KEDA / KMEC / XTRA (2024–2025)** [V-sec] Prensa Libre, Agencia Ocote:

| Dato | Valor |
|---|---|
| Monto contabilizado por el MP | **Q69 millones** |
| Monto total denunciado por víctimas | ≈ **Q151 millones** |
| Departamento más golpeado | **Alta Verapaz (24 casos)** |
| Inversión exigida | Q5,000 – Q10,000 inicial (algunos hasta Q40,000) |
| Promesa | *"duplicar o triplicar el capital en dos meses"* |
| Producto ficticio | dispensadores de "baterías digitales portátiles" en aeropuertos del extranjero |
| Estatus regulatorio | **La SIB confirmó que KMEC NO está regulada**; la SAT no halló NIT |

**Modalidades documentadas por MP / SIB / PNC** [V-sec]: phishing (la más frecuente en volumen) · **esquemas Ponzi y piramidales (las mayores pérdidas económicas)** · estafa por WhatsApp · clonación de tarjetas y venta de datos en Dark Web · **SIM swapping** (creciente) · falso pariente en el extranjero · **ofertas de empleo falsas que piden el DPI para tramitar créditos a nombre de la víctima** · códigos QR y apps con malware · falsas remesas · deepfakes y phishing potenciado por IA.

La SIB mantiene una sección oficial de [alertas de estafa y entidades no supervisadas](https://www.sib.gob.gt/alertas-de-estafa-y-entidades-no-supervisadas/). [V]

**DIACO 2025** [V-sec]: más de **20,000 quejas** recibidas · **Q36.19 millones** recuperados para consumidores, de los cuales **Q4.52 millones** por la Unidad de Protección de Servicios Financieros · **servicios financieros y tarjetas de crédito = 25 % de las quejas** (3.er lugar, tras reparación de vehículos 43 % y comercio general 32 %).

### 6.11 Iniciativas oficiales de educación financiera

**Gobernanza:** la **Comisión de Inclusión Financiera (COMIF)**, creada por resolución **JM-36-2019** de la Junta Monetaria, integra al **Banco de Guatemala (que coordina)**, la **Superintendencia de Bancos** y el **Ministerio de Economía**. [V]

La **ENIF 2024-2027** fue formulada con **222 representantes de 103 entidades adherentes**, con apoyo del Banco Mundial, USAID, A2ii y El Diálogo. Estructura: 4 pilares (inclusión financiera digital · MIPYME · jóvenes · mujeres) × 4 mesas temáticas (pagos · financiamiento · ahorro · seguros) × 4 ejes transversales, uno de ellos **educación financiera**. [V] — [ENIF 2024-2027](https://www.enif.gt/wp-content/uploads/2025/02/ENIF-2024-2027-1.pdf)

| Institución | Programa | Detalle |
|---|---|---|
| **Banguat** | Programa de Educación Económico-Financiera | Festival de Educación Económica Financiera; colección "Libritos del BANGUAT"; app **BANGUAPP**; concursos estudiantiles |
| **Banguat** | **Global Money Week** | Coordina la representación de Guatemala; convocado por MINEDUC; coordinado mundialmente por la OCDE |
| **SIB** | Programa de Educación Financiera (desde **2008**) | Conferencias, formación a docentes y formadores, voluntariado; guías "ABC De Educación Financiera"; marca **"Construye tus Finanzas"** |
| **SIB** | Curso virtual **"Finanzas Personales"** (desde 2019) | Planificación financiera, ahorro, **manejo responsable del crédito**, medios de pago, seguros, prevención de lavado |
| **SIB** | App **SIB Móvil** | Historial crediticio, estatus de entidades supervisadas, indicadores de inclusión, material educativo |
| **COMIF + MINEDUC** | Convenio de Cooperación Marco | **Incorporación de educación financiera al Currículum Nacional Base (CNB) para 2027.** DIGECUR elaboró el "Barrido Curricular" (2022) |
| **ABG** | Ferias financieras de la familia | Anuales |

**El problema de escala — y la oportunidad para el juego:** [V] ENIF 2024-2027

Las cuatro Jornadas de Educación Financiera del ciclo ENIF 2019-2023 alcanzaron **en total 9,149 participaciones**. La **meta oficial de la Mesa Técnica de Educación Financiera para 2027** es pasar de una línea base de **5,871 participaciones (2023) a 7,045 (2027)**.

> **Contraste brutal: la meta oficial de alcance de la educación financiera para 2027 es de ~7,000 personas, en un país con 11.5 millones de adultos, de los cuales 7.8 millones están fuera del sistema financiero y unos 10.9 millones no entienden qué es una tasa de interés efectiva. La meta cubre el 0.06 % de la población adulta.**

### 6.12 Cifras que NO deben usarse

| Cifra que circula | Veredicto |
|---|---|
| **"Mora en tarjetas de crédito supera el 43 %"** (prensa, ago 2026) | ⛔ **NO USAR.** Sin sustento oficial ni métrica definida. La cifra real es **5.5 %** (Banguat IEF dic 2025). El 43–45 % probablemente confunde con "las tarjetas son el 45.7 % de la cartera vencida del consumo" |
| **"Inclusión financiera del 85 %"** (declaraciones oficiales, jul 2026) | ⚠️ Es una **estimación de oferta** que suma bancos + cooperativas + fintech, no comparable con Findex (38.3 %) ni ENIFH (42.2 %) |
| **"68 %–68.4 % de bancarización"** | ✅ Verificado como dato SIB, pero **cuenta cuentas, no personas**: 20.4 M cuentas / 7.87 M depositantes únicos |
| **"SIB detectó 60 entidades no autorizadas en 2025"** | ⛔ **ES ECUADOR, no Guatemala** |
| Puntaje CAF u OCDE/INFE de capacidades financieras para Guatemala | ⛔ **NO EXISTE.** Guatemala no participa |
| **"26 % de alfabetización financiera" (S&P)** | ✅ Real, pero es de **2014**. Citarlo siempre con su año |
| **"Tigo Money: 500 mil usuarios activos"** | ⚠️ Dato de 2017. Y **el servicio cerró en junio de 2026** |
| Número de tarjetas de crédito o débito vigentes | ⛔ **NO SE PUBLICA** |
| **finazo.lat** como fuente de tasas de crédito educativo | ⛔ **DESCARTADA.** Publica un supuesto organismo "INAEF" que no existe en ninguna fuente oficial guatemalteca |

### 6.13 El diagnóstico que debería guiar el diseño del juego

Guatemala **no** tiene un problema de infraestructura: tiene el **doble de sucursales per cápita** que el promedio regional y **100 % de cobertura municipal**. **No** tiene un problema de tecnología: **81 % tiene celular, 63 % smartphone, 71 % usa internet**.

Tiene un problema de **comprensión y confianza**:

- **5.2 %** entiende una tasa de interés efectiva
- **53.3 %** no sabe a quién reclamar
- **22.7 %** de los no bancarizados cree que podría usar una cuenta sin ayuda
- **93.8 %** paga todo en efectivo, principalmente por costumbre
- El crédito informal (26.2 %) **duplica** al formal (15.5 %)
- Los pagos digitales y la tenencia de cuenta **están retrocediendo desde 2017**

**Ese es el terreno exacto donde un juego de educación financiera puede intervenir.**

---
## Anexo A. El jugador tipo: la juventud guatemalteca en cifras

Si el juego apunta a jóvenes, este es el perfil real del público:

| Indicador | Valor | Etiqueta |
|---|---|---|
| Población de 15 a 24 años (2026) | ≈ **3.5 millones** (19 % de la población) | [V-sec] [Infobae, informe de juventudes, ago 2026](https://www.infobae.com/guatemala/2026/08/17/informe-sobre-juventudes-en-guatemala-advierte-brechas-en-salud-educacion-y-empleo/) |
| **Jóvenes 15–24 que ni estudian ni trabajan ("ninis")** | **26.9 %** | [V-sec] INE (2022–2023) citado en [Plaza Pública](https://plazapublica.com.gt/ensayo/ensayo/el-primer-empleo-como-politica-de-desarrollo-una-apuesta-estrategica-para-la-juventud-en-guatemala/) |
| De esos "ninis", cuántos hacen trabajo doméstico y de cuidados no remunerado | **9 de cada 10** | [V-sec] misma fuente |
| Jóvenes 15–29 ocupados en la informalidad | **6 de cada 10** | [V-sec] [ODEP-URL, feb 2026](https://odep.url.edu.gt/investigaciones/monitoreo-de-coyuntura/2026/02/empleo-juvenil-y-derechos-laborales-examinar-politicas-publicas-para-la-insercion-laboral-digna-de-jovenes-en-guatemala/) |
| Jóvenes asalariados sin contrato, sin prestaciones y sin seguro social | **3 de cada 4** | [V-sec] misma fuente |
| Hogares con emigrantes internacionales que tienen al menos uno de 13–30 años | **7 de cada 10** | [V-sec] Plaza Pública |
| Principal motivación declarada para emigrar | **37 %**: mala situación económica (bajos salarios, falta de empleo) | [V-sec] [Infobae, may 2026](https://www.infobae.com/guatemala/2026/05/28/cuantos-guatemaltecos-migrarian-si-tuvieran-los-recursos-y-cuales-son-sus-destinos-preferidos/) |
| **Pico de ingreso mediano por edad** | ~Q3,000 entre los **26 y 29 años**, y luego se aplana | [V] IIES-USAC, ENEIC-T2 2025 |

**Implicación de diseño:** el jugador guatemalteco típico no está eligiendo entre "invertir en bolsa o en bienes raíces". Está eligiendo entre seguir estudiando, entrar al mercado informal, montar un negocio, o migrar. El juego será creíble en la medida en que esas cuatro rutas existan y tengan trade-offs honestos.

## Anexo B. Precios de referencia para decisiones del juego

| Bien / decisión | Precio | Etiqueta |
|---|---|---|
| Almuerzo en comedor | Q25 – Q35 | [V-sec] |
| Gasolina | ≈ Q39 / galón (ago 2026) | [V-sec] |
| Viaje en Transmetro | Q1.00 | [V-sec] |
| Viaje en bus urbano | Q5.00 (rutas normales) / Q7.50 (rutas nuevas) / tope Q6–Q7 | [V-sec] |
| Smartphone gama alta (Samsung Galaxy S26 5G 256 GB) | **Q8,499**, financiable hasta 36 cuotas | [V-sec] [Samsung Guatemala](https://shop.samsung.com/latin/cac/gt/unpacked) |
| Smartphone gama media | Q1,500 – Q3,500 | [E] |
| Smartphone gama baja / entrada | Q500 – Q1,200 | [E] |
| Moto 150 cc nueva (Honda/Italika y similares) | Q9,000 – Q20,000 | [E] — rango de mercado; Banco Industrial (BiMoto) segmenta su catálogo en tramos de <Q10,000, Q10,000–Q50,000 y >Q50,000 [V-sec] |
| **Financiamiento de vehículo nuevo** | banco financia **80 %–90 %** del valor; tasa **≈ 18 %** referencial; plazo hasta **7 años** | [V-sec] [CalculaFinanciamiento GT](https://www.calculafinanciamiento.com/guatemala/auto/guia/) |
| **Financiamiento de vehículo usado** | banco financia **60 %–80 %** del avalúo; tasa **3–5 puntos más alta** que un carro nuevo; plazo máximo **3–5 años** | [V-sec] misma fuente |

**Implicación de diseño:** el crédito automotriz es probablemente la primera deuda grande de un joven guatemalteco con empleo formal. Con una tasa de ~18 % a 7 años, el jugador debería poder ver que termina pagando mucho más que el precio de lista — es una lección más cercana a su vida que una hipoteca.

---

## Tabla maestra de cifras clave

Todas las cifras están en quetzales salvo indicación. **[V]** = verificado con fuente · **[V-sec]** = verificado contra fuente secundaria · **[E]** = estimación propia.

### Macro y salarios

| # | Concepto | Cifra | Fecha | Etiq. |
|---|---|---|---|---|
| 1 | Tipo de cambio de referencia | **Q7.62635 / US$1** | 4 sep 2026 | [V] |
| 2 | Inflación interanual | **2.70 %** | jul 2026 | [V] |
| 3 | Tasa líder de política monetaria | **3.50 %** | 26 ago 2026 | [V] |
| 4 | **Salario mínimo no agrícola CE1** (con bono Q250) | **Q4,252.28** | 2026 | [V] |
| 5 | Salario mínimo agrícola CE1 | Q4,041.20 | 2026 | [V] |
| 6 | Salario mínimo maquila CE1 | Q3,659.73 | 2026 | [V] |
| 7 | Salario mínimo no agrícola CE2 | Q4,066.90 | 2026 | [V] |
| 8 | Bonificación incentivo (obligatoria, sin IGSS) | **Q250/mes** | Decreto 78-89 | [V] |
| 9 | Descuento IGSS del trabajador | **4.83 %** del salario ordinario | 2026 | [V] |
| 10 | ISR asalariados | 5 % hasta Q300,000 anuales; 7 % sobre el excedente | 2026 | [V] |
| 11 | Deducción personal ISR | **Q51,024** anuales | 2026 | [V] |
| 12 | Pagos anuales de salario (con Bono 14 y aguinaldo) | **14** | — | [V] |
| 13 | **Ingreso laboral promedio nacional** | **Q2,797** (US$376) | T1 2026 | [V] |
| 14 | **Ingreso laboral MEDIANO nacional** | **Q2,300** | T2 2025 | [V] |
| 15 | Mediana hombres / mujeres | Q2,800 / **Q1,400** | T2 2025 | [V] |
| 16 | Ingreso mediano sector FORMAL / INFORMAL | Q3,600 / **Q1,500** | T2 2025 | [V] |
| 17 | Ingreso promedio urbano metropolitano / rural | Q3,901 / **Q1,986** | T2 2025 | [V] |
| 18 | P25 / P75 / P90 / P99 del ingreso | Q1,000 / Q3,600 / Q5,000 / **Q12,000** | T2 2025 | [V] |
| 19 | **Tasa de informalidad** | **66.2 %** (5.3 millones) | T2 2025 | [V] |
| 20 | Cotizantes activos al IGSS | 1,742,810 (**~22 %** de los ocupados) | cierre 2025 | [V] / [E] |
| 21 | Pobreza total / extrema | **56.0 %** / 16.2 % | ENCOVI 2023 | [V] |

### Ingreso por nivel educativo (mediana, sector formal, ENEIC-T2 2025) — todo [V]

| # | Nivel | Mediana mensual | Salto vs. nivel anterior |
|---|---|---|---|
| 22 | Sin educación formal | hasta Q2,400 | — |
| 23 | Primaria completa | ~Q3,000 | +25 % |
| 24 | Básico | Q3,325 | +11 % |
| 25 | **Diversificado (bachiller)** | **Q3,800** | +14 % |
| 26 | **Superior (licenciatura)** | **Q4,300** | **+13 %** |
| 27 | **Maestría** | **Q10,000** | **+133 %** |
| 28 | Doctorado | Q12,500 | +25 % |
| 29 | Media del nivel superior (no mediana) | Q5,737.13 | — |

### Salarios por ocupación (índices de bolsas de empleo, [V-sec] salvo indicación)

| # | Ocupación | Mensual |
|---|---|---|
| 30 | Repartidor / motorista de reparto | Q3,762 |
| 31 | Albañil | Q3,920 |
| 32 | Vendedor | Q4,196 |
| 33 | Maestro (docente) | Q4,796 |
| 34 | Agente de call center bilingüe | Q5,500 base, hasta Q9,000+ |
| 35 | Maestro de obra | Q6,625 |
| 36 | Chofer / motorista | Q4,000 – Q7,000 |
| 37 | Piloto de camión | Q6,000 – Q12,000 |
| 38 | Auxiliar contable | desde Q3,500 |
| 39 | CPA / gerente financiero | hasta Q30,000+ |
| 40 | Ingeniero junior / senior | Q6,000–Q10,000 / Q12,000–Q25,000 **[E]** |
| 41 | Emprendedor de tienda de barrio (ganancia neta) | Q1,500 – Q4,000 **[E]** |

### Costo de vida

| # | Concepto | Cifra | Fecha | Etiq. |
|---|---|---|---|---|
| 42 | **CBA Urbana per cápita** | **Q945.74** | jul 2026 | [V] |
| 43 | CBA Rural per cápita | Q730.23 | jul 2026 | [V] |
| 44 | **Canasta Ampliada Urbana per cápita** | **Q2,283.35** | jun 2026 | [V] |
| 45 | Canasta Ampliada Rural per cápita | Q1,431.01 | jun 2026 | [V] |
| 46 | Hogar de referencia del INE | **4.16 personas** | ENIGH 2022-23 | [V] |
| 47 | CBA Urbana por hogar | ≈ Q3,934 | jul 2026 | [V-sec] |
| 48 | Canasta Ampliada Urbana por hogar | ≈ Q9,499 | jun 2026 | [E] |
| 49 | Renta: cuarto en casa compartida | Q800 – Q1,500 | 2026 | [E] |
| 50 | Renta: apartamento zonas periféricas | Q2,300 – Q4,600 | 2026 | [V-sec] |
| 51 | Renta: estudio o 1 dorm. en zonas 10/14/15 | Q3,000 – Q7,900 | 2026 | [V-sec] |
| 52 | Electricidad EEGSA, tarifa social / no social | Q1.42 / Q1.51 por kWh | may–jul 2026 | [V-sec] |
| 53 | Recibo típico de luz (200 kWh) | Q370 – Q390 | 2026 | [V-sec] |
| 54 | Internet residencial 30–100 Mbps | Q159 – Q500 | 2026 | [V-sec] |
| 55 | Celular prepago (10–30 GB) | Q75 – Q100/mes | 2026 | [V-sec] |
| 56 | Celular pospago | Q140 – Q700/mes | 2026 | [V-sec] |
| 57 | Transmetro / bus urbano / rutas nuevas | **Q1.00** / Q5.00 / Q7.50 | 2026 | [V-sec] |
| 58 | Tope temporal de pasaje urbano | Q6 – Q7 | desde ago 2026 | [V-sec] |
| 59 | Gasolina | ≈ Q39 / galón | ago 2026 | [V-sec] |
| 60 | Almuerzo en comedor | Q25 – Q35 | 2026 | [V-sec] |
| 61 | **Presupuesto mensual, joven soltero, escenario austero** | **Q2,200 – Q3,300** | 2026 | [E] |
| 62 | **Presupuesto mensual, joven soltero, apto. propio periférico** | **Q4,500 – Q6,500** | 2026 | [E] |
| 63 | **Capacidad de ahorro realista de un joven capitalino** | **Q300 – Q800/mes** | 2026 | [E] |

### Educación

| # | Concepto | Cifra | Etiq. |
|---|---|---|---|
| 64 | **USAC: inscripción y matrícula 2026** | **Q0.00** (antes Q101 / Q91) | [V] |
| 65 | USAC: prueba de orientación vocacional | Q70 (pago único) | [V] |
| 66 | USAC: título de licenciatura | Q115 | [V] |
| 67 | **USAC: arancel total anual** | **Q0 – Q170** | [E] |
| 68 | USAC: transporte mensual (típico capitalino) | Q200 – Q500 | [E] |
| 69 | **URL: Profesorado, costo anual** | ≈ Q6,980 | [V]+[E] |
| 70 | **UVG: Profesorado, costo anual** | ≈ Q13,726 | [V]+[E] |
| 71 | UVG: Ingeniería Industrial vespertina, anual | ≈ Q53,686 | [V]+[E] |
| 72 | UVG: Administración de Empresas, anual | ≈ Q74,310 | [V]+[E] |
| 73 | **UVG: Ingeniería Industrial, anual** | **≈ Q77,054** | [V]+[E] |
| 74 | UFM: proceso de admisión / cuota mensual de servicios | Q525 / Q500 | [V] |
| 75 | UFM: Medicina, anual | ≈ Q102,000 – Q133,000 | **[E]** agregador |
| 76 | UMG y Galileo | **NO publican tarifario** | [V] la ausencia |
| 77 | Duración: técnico universitario USAC | **3 años** | [V] |
| 78 | Duración: licenciatura tras el técnico | **+2 años** (5 en total) | [V] |
| 79 | Duración: ingenierías USAC | **5 años / 10 semestres / 300 créditos CLAR** | [V] |
| 80 | Duración del EPS | 3 o 6 meses (optativo) | [V] |
| 81 | Tiempo extra entre cierre de pénsum y graduación | 1 – 3 años | [E] |
| 82 | **Crédito educativo BI Fácil Escolar** | hasta Q8,000 al **18 %**, 6–10 meses, **sin fiador** | [V] ⚠️ página de 2016 |
| 83 | Crédito escolar Banrural | Q1,000 – Q30,000, hasta 24 meses | [V] |
| 84 | **Becas por Nuestro Futuro** (fondo estatal) | Q250 millones, **beca NO reembolsable**, 3 convocatorias/año | [V] |
| 85 | MIDES Beca Educación Superior | **Q2,500 al AÑO** (Q1,800 + Q700), edad 16–28 | [V] |
| 86 | **Prima salarial universitario sobre bachiller** | **+21.2 %** (era +31.2 % en 2002) | [V] |
| 87 | Prima universitario sobre sin educación | +98.9 % (era +137 % en 2002) | [V] |
| 88 | Retorno por año adicional de estudio | **6.8 %** | [V] |
| 89 | Probabilidad de pobreza: secundaria vs. universidad | **39 % vs. 5 %** | [V] |
| 90 | **Embudo: de 100,000 en primaria, cuántos entran a la universidad** | **12,000** | [V] |
| 91 | Jóvenes excluidos antes de poder intentar la universidad | **74 %** | [V] |
| 92 | Población de 18–26 años que inicia estudios universitarios | **2.6 %** | [V] |
| 93 | Puestos de trabajo que requieren solo nivel medio (Fundesa 2017) | **52 %** | [V] |

### Productos bancarios

| # | Concepto | Cifra | Fecha | Etiq. |
|---|---|---|---|---|
| 94 | **Tasa pasiva promedio ponderada del sistema (MN)** | **4.63 %** | ago 2026 | [V] |
| 95 | **Tasa activa promedio ponderada del sistema (MN)** — sin tarjetas | **13.08 %** | ago 2026 | [V] |
| 96 | Spread de intermediación | 8.45 pp | ago 2026 | [V] |
| 97 | **Cuenta monetaria (depósitos transferibles)** | **1.27 %** | jul 2026 | [V] |
| 98 | **Cuenta de ahorro** | **2.65 %** | jul 2026 | [V] |
| 99 | **Depósito a plazo** | **6.35 %** | jul 2026 | [V] |
| 100 | Cuenta de ahorro básica de BI (Ahorro Corriente) | **0.50 %** (0 % con menos de Q100) | 2026 | [V-sec] |
| 101 | Mejores cuentas de ahorro del mercado a Q10,000 | 6.17 % (Bantrab, G&T) | sep 2026 | [V-sec] |
| 102 | Plazo fijo a Q10,000 / 365 días: rango del mercado | **1.52 % (BI) a 6.50 % (Azteca)** | sep 2026 | [V-sec] |
| 103 | **Retención de ISR sobre intereses** | **10 %** | Decreto 10-2012 | [V] |
| 104 | **Cobertura del FOPA (seguro de depósito)** | **Q20,000** por persona por banco | Art. 87 Ley de Bancos | [V] |
| 105 | Apertura de cuenta monetaria | Q500 (Banrural, G&T) a Q2,500 (BAC) | 2026 | [V] |
| 106 | Apertura de cuenta de ahorro | Q0 (CHN) a Q1,000 | 2026 | [V] |
| 107 | Comisión de manejo de cuenta monetaria BAC | **Q30/mes** si el saldo promedio < Q2,500 | jul 2026 | [V] |
| 108 | Cuenta inactiva BAC (180 d) / durmiente (360 d) | Q8 / Q15 mensuales | jul 2026 | [V] |
| 109 | **Cuenta sin movimiento CHN** | **Q50 MENSUALES** (más de 1 año y saldo < Q1,000) | 2026 | [V] |
| 110 | Cheque rechazado (BAC / CHN / Bantrab) | Q160 / Q120 / Q125 | 2026 | [V] |
| 111 | Retiro en cajero de otro banco | Q5 – Q10 por transacción | 2026 | [V] |
| 112 | Sobregiro BAC | 30 % anual, mínimo **Q25 diarios** | jul 2026 | [V] |
| 113 | **★ TARJETA DE CRÉDITO — promedio ponderado** | **45.84 %** anual | jul 2026 | [V] |
| 114 | **Líneas revolventes de tarjeta** | **51.9 %** anual | dic 2025 | [V] |
| 115 | Tarjeta de crédito: mediana del mercado | **4.00 % mensual ≈ 60.1 % TEA** | mar 2026 | [V]+[E] |
| 116 | **Tarjeta de crédito: máxima publicada** | **6.95 % mensual ≈ 124 % TEA** | mar 2026 | [V]+[E] |
| 117 | IVA sobre intereses de tarjeta | 12 % | Decreto 27-92 | [V] |
| 118 | **¿Existe tasa máxima legal para tarjetas?** | **NO.** Rige la libre contratación (Art. 42 Ley de Bancos) | 2026 | [V] |
| 119 | Crédito de consumo sin tarjeta | **18.68 %** | jul 2026 | [V] |
| 120 | Préstamo personal BI Fácil | 19.00 % – 19.60 %, 12–36 meses, máx. Q250,000 | 2026 | [V-sec] |
| 121 | **Moda real del crédito de consumo (Banrural)** | **59.40 %** | jul 2026 | [V] |
| 122 | Microcrédito / créditos productivos (moda Banrural) | 22.50 % | jul 2026 | [V] |
| 123 | **Hipotecario vivienda — promedio del sistema** | **9.42 %** | jul 2026 | [V] |
| 124 | **Moda real del hipotecario (Banrural)** | **10.00 %** (vs. "desde 7 %" publicitado) | jul 2026 | [V] |
| 125 | Hipoteca: plazo típico | **20 a 30 años** | 2026 | [V] |
| 126 | **Hipoteca: enganche típico** | **20 %** (el banco financia el 80 %) | 2026 | [V] |
| 127 | **Hipoteca vía FHA: enganche** | **5 %** vivienda nueva / **10 %** existente | 2026 | [V] |
| 128 | Prima FHA (se SUMA a la tasa) | **1.26 %** (1.00 % hipoteca + 0.26 % desgravamen) | 2026 | [V] |
| 129 | ¿Existe límite regulatorio de cuota/ingreso? | **NO.** Política de cada banco (BI: 30 %) | JM-93-2005 | [V] |
| 130 | Gastos de cierre de una compra de vivienda | 4 % – 8 % del valor | 2026 | [E] |
| 131 | IVA (1.ª venta) / Timbres (2.ª y siguientes) | 12 % / 3 % | 2026 | [V-sec] |
| 132 | **Subsidio FOPAVI (no reembolsable)** | **Q35,000**, ingreso máx. 4 salarios mínimos | 2026 | [V] |
| 133 | Financiamiento de vehículo nuevo | 80 %–90 %, ≈18 %, hasta 7 años | 2026 | [V-sec] |
| 134 | Consulta del récord crediticio en la SIB | **GRATUITA** | 2026 | [V] |
| 135 | Morosidad de tarjetas / del sistema bancario | **5.5 %** / 2.4 % | dic 2025 | [V] |

### Remesas

| # | Concepto | Cifra | Fecha | Etiq. |
|---|---|---|---|---|
| 136 | **Remesas 2025 (año completo)** | **US$25,530.2 millones** (≈ Q195,306 M) | 2025 | [V] |
| 137 | Crecimiento 2025 | **+18.7 %** | 2025 | [V] |
| 138 | **Peso en el PIB** | **20.7 %** | 2025 | [V] |
| 139 | Ingreso diario promedio | ≈ US$100 millones/día | 2025 | [V] |
| 140 | Acumulado ene–jul 2026 | US$15,447.1 millones (+6.6 %) | jul 2026 | [V] |
| 141 | Proyección Banguat cierre 2026 | US$26,806 millones (+5 %) | 2026 | [V] |
| 142 | Hogares receptores | ≈ **1.7 millones** / **22.5 %** de los hogares | 2025 | [V] |
| 143 | Monto promedio por envío | US$462 (CEMLA **2017**) | 2017 | [V-sec] ⚠️ antiguo |
| 144 | **Monto promedio por envío, estimación actualizada** | **US$550 – US$650** (≈ Q4,200 – Q4,950) | 2026 | **[E]** |
| 145 | Remesa mensual típica de un hogar de ingreso medio-bajo | Q1,500 – Q4,000 | 2026 | **[E]** |
| 146 | **Comisión Wise** (a cuenta bancaria) | ≈ 0.9 % – 1.5 %, tipo mid-market | 2026 | [V-sec] |
| 147 | Comisión Remitly / Xoom | ≈ 1.5 % – 4 % | 2026 | [V-sec] |
| 148 | **Comisión Western Union / MoneyGram** | **3 % – 5 %** (Q7.70–Q167 + margen cambiario de 1.5–5 %) | 2026 | [V-sec] |
| 149 | Costo de elegir mal el operador en un envío de US$500 | ≈ **Q194 por envío** (≈ Q2,300/año si es mensual) | 2026 | **[E]** |
| 150 | **Cobro en efectivo en agencia bancaria** | **71.7 %** de los hogares receptores | ENIFH 2025 | [V] |
| 151 | Retiro por agente bancario o tienda | 53.7 % | ENIFH 2025 | [V] |
| 152 | Depósito en cuenta | 44.9 % | ENIFH 2025 | [V] |
| 153 | Billetera electrónica | **3.6 %** | ENIFH 2025 | [V] |
| 154 | **Remesa destinada al AHORRO** | **7.6 %** | ENIFH 2025 | [V] |
| 155 | Concentración del pago de remesas | **Banrural + BI = más del 80 %** del mercado | 2024 | [V-sec] |
| 156 | Receptores de remesas con cuenta bancaria | **18 %** | 2024 | [V-sec] |

### Inclusión financiera

| # | Concepto | Cifra | Fecha | Etiq. |
|---|---|---|---|---|
| 157 | **Adultos con cuenta — enfoque DEMANDA (Findex)** | **38.3 %** | 2025 | [V] |
| 158 | Adultos con producto financiero — ENIFH | **42.2 %** | 2025 | [V] |
| 159 | Bancarización — enfoque OFERTA (SIB) | 68.4 % ⚠️ cuenta cuentas, no personas | dic 2025 | [V] |
| 160 | Cuentas totales / depositantes únicos | 20.4 M / **7.87 M** (1.8 cuentas por adulto) | dic 2025 | [V] |
| 161 | Nivel de 2017 (para dimensionar el retroceso) | 44.1 % | 2017 | [V] |
| 162 | Hombres / mujeres con cuenta | 44.6 % / **32.5 %** (brecha 12.1 pp) | 2025 | [V] |
| 163 | Urbano / rural con cuenta | 50.6 % / **32.7 %** | 2025 | [V] |
| 164 | Jóvenes 15–24 con cuenta | **34.8 %** (era 41.6 % en 2017) | 2025 | [V] |
| 165 | Guatemala vs. promedio de América Latina | **38.3 % vs. 69.7 %** (penúltimo de la región) | 2024 | [V] |
| 166 | **Adultos SIN cuenta** | 61.7 % ≈ **7.8 millones de personas** | 2025 | [V]+[E] |
| 167 | **Pagos digitales** | **22.6 %** (era 33.3 % en 2017) | 2024 | [V] |
| 168 | Cuenta de dinero móvil | **3.3 %** (era 5.2 % en 2021) | 2025 | [V] |
| 169 | **Compras menores a Q200 pagadas en efectivo** | **93.8 %** | ENIFH 2025 | [V] |
| 170 | Compras mayores a Q200 pagadas en efectivo | 88.6 % | ENIFH 2025 | [V] |
| 171 | Razón principal de usar efectivo | "está acostumbrado" **22.2 %** | 2025 | [V] |
| 172 | **Tigo Money** | **CERRÓ el 30 de junio de 2026** | 2026 | [V] |
| 173 | Ley de dinero electrónico | **NO EXISTE** (solo anteproyecto) | 2026 | [V] |
| 174 | Adultos con celular / smartphone / internet | 80.9 % / 63.1 % / 71.1 % | 2025 | [V] |
| 175 | **Crédito informal vs. formal** | **26.2 % vs. 15.5 %** | ENIFH 2025 | [V] |
| 176 | Adultos con tarjeta de crédito | **11.0 %** (ENIFH) / 4.2 % (Findex) | 2025 | [V] |
| 177 | **Préstamos otorgados sin ninguna garantía** | **71.8 %** | ENIFH 2025 | [V] |
| 178 | **Créditos destinados a comprar comida** | **25.8 %** | ENIFH 2025 | [V] |
| 179 | Compró comida al fiado en el último año | 18.9 % | 2024 | [V] |
| 180 | Guarda el dinero en su casa | **27.0 %** | ENIFH 2025 | [V] |
| 181 | Participa en cuchubal | 8.7 % | ENIFH 2025 | [V] |
| 182 | Ahorra algo para la vejez | **14.1 %** (ENIFH) / 3.2 % (Findex) | 2025 | [V] |
| 183 | Tiene un seguro | 11.0 % | ENIFH 2025 | [V] |
| 184 | **★ Entiende la diferencia entre tasa nominal, real y efectiva** | **5.2 %** | ENIFH 2025 | [V] |
| 185 | **No sabría a qué institución acudir ante un problema financiero** | **53.3 %** | ENIFH 2025 | [V] |
| 186 | Paga el saldo completo de su tarjeta a tiempo | **2.5 %** de los adultos (de un 4.2 % que tiene tarjeta) | 2024 | [V] |
| 187 | Saldo de tarjetas que es crédito revolvente | **61.6 %** | dic 2025 | [V] |
| 188 | Alfabetización financiera (S&P) | 26 % (mundo 33 %) ⚠️ **dato de 2014** | 2014 | [V-sec] |
| 189 | Brecha territorial: capital vs. Huehuetenango | **63.3 % vs. 19.5 %** | ENIFH 2025 | [V] |
| 190 | Puntos de acceso bancario | 68,078 (**592 por 100,000 adultos**); **100 % de los municipios** | dic 2025 | [V] |
| 191 | Sucursales por 100,000 adultos: Guatemala vs. ALC | **21.9 vs. 11.7** (el doble que la región) | 2024 | [V] |
| 192 | **Interés del "gota a gota"** | **desde 20 % DIARIO** | 2026 | [V-sec] |
| 193 | Pena por usura (Art. 276 Código Penal) | 4 a 10 años + multa de Q200,000 a Q500,000 | 2026 | [V-sec] |
| 194 | Ciberdelitos: 2019 → 2025 | **1,292 → 14,871 (+1,051 %)** | 2025 | [V-sec] |
| 195 | Denuncias por estafas electrónicas ene–jun 2026 | 7,925 (más de 50 diarias) | 2026 | [V-sec] |
| 196 | Esquema piramidal KEDA/KMEC | Q69 M contabilizados; ≈Q151 M denunciados | 2025 | [V-sec] |
| 197 | **Meta oficial de alcance de la educación financiera para 2027** | **7,045 participaciones** = **0.06 %** de los adultos | ENIF 2024-27 | [V]+[E] |

---

## Las diez lecciones que este informe le da al diseño del juego

1. **El año tiene 14 pagos, no 12.** Julio (Bono 14), diciembre y enero (aguinaldo en dos mitades) son los tres puntos de decisión financiera más importantes del calendario guatemalteco.

2. **El salario mínimo está por encima de lo que gana la mayoría.** La mediana nacional (Q2,300) es la mitad del mínimo no agrícola CE1 (Q4,252.28). Dos de cada tres trabajadores están en la informalidad y fuera de su alcance.

3. **La licenciatura rinde poco; la maestría y el inglés rinden mucho.** De bachiller a licenciado: **+13 %** de ingreso mediano. De licenciado a maestría: **+133 %**. Un agente de call center bilingüe gana 2–3× el promedio del sector servicios.

4. **La curva de ingresos se aplana a los 28 años y cae después de los 50.** No hay ascenso continuo por antigüedad. Eso hace que ahorrar temprano no sea una virtud opcional, sino la única salida.

5. **La USAC es gratis; el costo es el tiempo y el transporte.** Q0 de arancel, pero solo 12,000 de cada 100,000 niños que entran a primaria llegan a ella, y entre el cierre de pénsum y la graduación se pierden 1 a 3 años más.

6. **La tarjeta de crédito al 45.84 % promedio (hasta 124 % TEA) contra una cuenta de ahorro al 2.65 %** es el contraste que un juego financiero guatemalteco tiene que enseñar. No hay techo legal a esa tasa.

7. **Las comisiones vacían las cuentas pequeñas.** Q30/mes de manejo si el saldo baja de Q2,500; Q50/mes en una cuenta olvidada del CHN. Una cuenta con Q800 desaparece en 16 meses sin que nadie la toque.

8. **Entran US$25,500 millones de remesas al año y solo el 7.6 % se ahorra.** El 71.7 % se retira en efectivo por ventanilla el mismo día. Elegir mal el operador cuesta ~Q2,300 al año.

9. **El problema no es el acceso, es la comprensión.** Guatemala tiene el doble de sucursales per cápita que la región, 100 % de cobertura municipal y 81 % de penetración de celular — y aun así solo el 5.2 % entiende qué es una tasa efectiva y el 93.8 % paga todo en efectivo por costumbre.

10. **El crédito informal duplica al formal, y casi el 40 % del crédito financia comida y emergencias.** Un juego honesto tiene que incluir la casa de empeño, el fiado de la tienda, el cuchubal y el "gota a gota" al 20 % diario — porque ese es el sistema financiero real de la mayoría.

---

## Metodología, límites y advertencias

**Fuentes primarias usadas directamente:** Banco de Guatemala (series Excel imm04 e imm05, cuadros V.4 a V.7, Informe de Estabilidad Financiera dic 2025, operaciones LBTR, tipo de cambio de referencia), INE (informes CBA mensuales, boletines ENEIC, ENIFH 2025, ENCOVI 2023), Superintendencia de Bancos (vía los espejos accesibles de Banguat y ENIF), DIACO (tasas de tarjetas al 31 mar 2026), Banco Mundial (API de Global Findex), IGSS, Ministerio de Trabajo (Acuerdo Gubernativo 256-2025), leyes (Decretos 19-2002, 67-2001, 10-2012, 2-2024, 42-92, 76-78, 78-89), reglamentos (JM-93-2005, JM-36-2019), tarifarios oficiales de BAC, CHN, Bantrab, Banrural, G&T y Banco Azteca, tarifarios universitarios de UVG, UFM, URL y USAC, y las estrategias ENIF 2024-2027, FHA y FOPAVI.

**Fuentes académicas:** IIES-USAC (Boletín "Economía al día" No. 2, feb 2026, con microdatos ENEIC-T2 2025); Guillermo Díaz, URL (*Atlantic Review of Economics*, 2019, modelo de Mincer sobre ENEI 2002/2010/2018); ODEP-URL (embudo educativo, nov 2025).

**Límites que hay que tener presentes:**

1. **El INE no publica ingreso por nivel educativo** en sus boletines. Los datos de la sección 1.5 vienen del procesamiento académico de la microdata por el IIES-USAC, no de un boletín oficial. Son sólidos, pero son una elaboración de tercero.
2. **La Superintendencia de Bancos bloquea el acceso automatizado** a su portal. Sus datos se obtuvieron por los espejos oficiales de Banguat y ENIF, que citan a la SIB como fuente.
3. **Los sitios de Banco Industrial no fueron verificables** desde la red donde se hizo la investigación (resuelven a IPs internas). Todos los datos de BI están marcados como [V-sec] y deberían reverificarse desde una red externa.
4. **UMG y Galileo no publican tarifario**; se verificó que la ausencia es real. Cualquier cifra suya en este informe es estimación de agregador.
5. **El monto promedio por envío de remesa no lo publica el Banguat.** El dato de US$462 es de CEMLA 2017; la cifra actualizada es estimación propia.
6. **Los rangos de "costo de vida" de portales expat están sesgados al alza.** Se recalibraron para un joven guatemalteco y se marcaron como [E] donde fue necesario.
7. **Guatemala no participa en las encuestas de capacidades financieras de la CAF ni de la OCDE/INFE.** El único benchmark internacional de alfabetización financiera es de S&P y es de 2014.
