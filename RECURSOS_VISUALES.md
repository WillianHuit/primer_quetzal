# Recursos visuales

Estado al 8 de septiembre de 2026. Este documento registra únicamente recursos
ya creados y explica dónde debe colocarlos una implementación posterior. Los
archivos todavía **no están conectados al juego**.

---

## 0. Lo que se creó hoy

### La progresión visual del negocio

Se crearon cuatro PNG independientes con fondo transparente real. Sustituyen
los cuatro dibujos de `NEGOCIO` en `js/escena.js`:

| Nivel | Archivo creado | Sustituye | Uso previsto |
|---|---|---|---|
| 1 | `assets/visuales/negocio/nivel-1-canasta.png` | `NEGOCIO[1]` | Primera mejora: `canasta` |
| 2 | `assets/visuales/negocio/nivel-2-carreta.png` | `NEGOCIO[2]` | Segunda mejora: `carreta` |
| 3 | `assets/visuales/negocio/nivel-3-puesto.png` | `NEGOCIO[3]` | Tercera mejora: `puesto` |
| 4 | `assets/visuales/negocio/nivel-4-local.png` | `NEGOCIO[4]` | Cuarta mejora: `local` |

Todos miden **1254 × 1254 px**. Comparten perspectiva frontal a tres cuartos,
contorno verde oscuro, luz superior izquierda y la paleta del proyecto. El
crecimiento es legible: canasta → carreta → puesto → local.

### El protagonista

Se creó un protagonista único y consistente. Todos sus estados parten del mismo
rostro, tono de piel, cabello, proporciones y dirección de pose:

| Estado | Archivo creado | Sustituye | Uso previsto |
|---|---|---|---|
| Neutro | `assets/visuales/personaje/base.png` | `Personaje.dibujar({})` | Perfil, barra y escena sin actividad especial |
| Estudiante | `assets/visuales/personaje/estudiante.png` | `Personaje.dibujar({ estudia: true })` | Tarjetas y escena mientras estudia |
| Graduado | `assets/visuales/personaje/graduado.png` | `Personaje.dibujar({ graduado: true })` | Estado con birrete y diploma |

Los tres miden **1024 × 1536 px** y conservan identidad, pose, proporciones,
vestuario base y encuadre.

### Las profesiones

Se creó un PNG por cada identificador de `ROPA` en `js/personaje.js`. Los nombres
coinciden con los `id`, para que la integración pueda resolverlos directamente:

| Grupo | Archivos creados |
|---|---|
| Trabajos infantiles | `limonada.png`, `periodicos.png`, `dulces.png` |
| Servicios y oficios | `repartidor.png`, `tienda.png`, `construccion.png`, `vendedor.png`, `callcenter.png`, `tiendapropia.png` |
| Técnicos y profesionales | `auxcontable.png`, `refrigeracion.png`, `soporte.png`, `docente.png`, `contador.png`, `ingeniero.png`, `gerente.png` |
| Trabajo en Estados Unidos | `construccion_us.png`, `restaurante_us.png`, `limpieza_us.png`, `tecnico_us.png` |

Los 20 archivos están en `assets/visuales/personaje/profesiones/`, miden
**1024 × 1536 px** y usan fondo transparente.

### Lenguaje visual compartido

- Ilustración 2D pulida para juego móvil, juvenil sin ser infantil.
- Formas redondeadas, volumen suave y siluetas legibles a tamaño reducido.
- Paleta basada en `css/estilo.css`: verde `#1f7a5a`, menta `#e6f3ee`, tinta
  `#16211d`, ámbar `#b5811f`, azul `#2c5f8a` y rojo `#b8422e`.
- Sin texto, números, logotipos, marcas de agua ni símbolos financieros
  dependientes del idioma.
- Los 37 archivos creados hasta ahora tienen canal alfa: la esquina superior izquierda tiene
  alfa 0 y el centro del objeto alfa 255.

---

## 1. Instrucciones para la IA que los coloque

### Alcance

No regenerar estas imágenes y no modificar los PNG. La tarea de integración es
reemplazar las salidas SVG de escena y personaje por etiquetas `<img>` o fondos
CSS, manteniendo el estado del juego y sus nombres públicos.

### Negocio

1. En `js/escena.js`, conservar `o.negocio` como selector de nivel.
2. Para niveles 1–4, mapear el número al archivo de la tabla anterior.
3. Mantener el nivel 0 como espacio vacío; puede resolverse con CSS y no necesita
   un recurso gráfico.
4. Dibujar el PNG dentro de la zona actual del negocio, aproximadamente entre
   `x=92` y `x=168` del `viewBox` conceptual de 200 × 116.
5. Usar `object-fit: contain`; nunca recortar techos, ruedas o asas.
6. Mantener las monedas animadas como una capa separada. No están horneadas en
   ninguno de los PNG.

### Personaje

1. En `js/personaje.js`, usar `base.png` cuando no existe un estado más específico.
2. Cuando exista `op.trabajo`, cargar
   `assets/visuales/personaje/profesiones/<op.trabajo>.png`.
3. Usar `estudiante.png` cuando `op.estudia` sea verdadero y `graduado.png`
   cuando `op.graduado` sea verdadero, salvo que el uniforme tenga prioridad.
4. Mantener la relación de aspecto **2:3** y `object-fit: contain`.
5. Reutilizar el mismo archivo a distintos tamaños; no crear copias para barra,
   tarjeta, perfil y escena.
6. Si coinciden trabajo, estudio y graduación, conservar la prioridad funcional
   del juego y documentar cuál estado domina; los PNG son personajes completos.

### Rendimiento y accesibilidad

- Crear WebP derivados durante la integración y conservar estos PNG como
  originales maestros.
- Añadir `width` y `height` explícitos para evitar saltos de diseño.
- Los recursos son decorativos cuando el nombre del nivel o del empleo ya está
  escrito: usar `alt=""` en esos casos.
- No borrar todavía los generadores SVG. Mantenerlos como respaldo hasta que
  las pruebas visuales confirmen el nuevo diseño.

---

## 2. Lo que no se colocó

- No se modificó `index.html`, `css/estilo.css`, `js/escena.js`,
  `js/personaje.js` ni `js/ui.js`.
- No se insertó ninguna imagen en el README ni en una pantalla del juego.
- Se retiraron las tres portadas promocionales creadas por error en la primera
  interpretación de la tarea; no forman parte de esta entrega.

---

## 3. Recursos visuales que siguen pendientes

### Personaje

La familia principal está completa: base, estudiante, graduado y las 20 entradas
de `ROPA`. Solo quedarían estados combinados si la integración decide que deben
verse simultáneamente uniforme, mochila y birrete.

### Escenario y mejoras laterales

También están terminados los recursos que completan la escena:

| Sistema | Archivos creados | Sustituye |
|---|---|---|
| Escena común | `escena/plataforma.png`, `escena/moneda.png` | `suelo()` y las monedas de `monedas()` |
| Herramientas | `mejoras/oficio/caja-herramientas.png`, `mejoras/oficio/rotulo.png`, `mejoras/oficio/bicicleta.png` | Los tres niveles de `OFICIO` |
| Estudio | `mejoras/estudio/mochila.png`, `mejoras/estudio/libros.png`, `mejoras/estudio/internet.png` | Los tres niveles de `ESCUELA` |
| Descanso | `mejoras/descanso/rincon.png`, `mejoras/descanso/cama.png` | Los dos niveles de `CASA` |

Todos son PNG maestros de **1254 × 1254 px**, excepto la plataforma horizontal,
de **1672 × 941 px**. La moneda se mantiene separada para que la integración
pueda animarla sin mover el resto del escenario.

### Iconos

Los 78 iconos de interfaz no se convirtieron a PNG. Son controles que se muestran
desde aproximadamente 16 px y cambian de color mediante `currentColor`; en ese
caso el formato raster perdería nitidez, multiplicaría descargas y eliminaría
los estados cromáticos. Si se reemplazan, debe hacerse como una familia vectorial
completa y coherente —por ejemplo, redibujando los trazos o usando el respaldo de
Lucide que ya contiene el proyecto—, no mediante generación raster individual.

---

## 4. Herramienta auxiliar creada

`herramientas/quitar-fondo-cuadriculado.ps1` elimina por inundación el patrón
gris conectado a los bordes que el generador dejó horneado pese a solicitar
transparencia. Convierte el resultado a PNG ARGB sin borrar blancos encerrados
dentro del objeto. Se utilizó en los 37 recursos y puede reutilizarse si una
generación futura presenta el mismo defecto.
