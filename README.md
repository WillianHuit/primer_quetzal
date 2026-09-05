# Mi Primer Quetzal

Simulador de vida financiera para aprender a usar productos bancarios. El jugador toma a
una persona de 18 años sin cuenta bancaria y la acompaña hasta la jubilación a los 65.
Español e inglés, para celular, sin instalar nada.

Banco ficticio: **Banco Cardamomo**. País: Guatemala. Moneda: Quetzal.

## Jugarlo

Abre `index.html` con doble clic. No necesita servidor, ni npm, ni conexión.

## Publicarlo en GitHub Pages

El repositorio ya está iniciado y con el primer commit hecho, en la rama `main`. Faltan
tres pasos que hay que hacer desde el navegador porque en esta máquina no está instalada
la herramienta de línea de comandos de GitHub.

1. En `github.com/new`, crea un repositorio **vacío** llamado `mi-primer-quetzal`. No
   marques nada de README, licencia ni `.gitignore`: el repositorio local ya los tiene.
2. Desde esta carpeta, conecta y sube:

   ```
   git remote add origin https://github.com/TU-USUARIO/mi-primer-quetzal.git
   git push -u origin main
   ```

3. En el repositorio, entra a **Settings** y luego a **Pages**. En *Source* elige
   **Deploy from a branch**, en *Branch* elige `main` y la carpeta `/ (root)`, y guarda.

En un par de minutos queda en `https://TU-USUARIO.github.io/mi-primer-quetzal/`. No hay
paso de compilación: GitHub sirve los archivos tal cual.

`node_modules` está en el `.gitignore`, así que no se sube. El juego no lo necesita.

## Qué incluye

Empiezas eligiendo de dónde sales (familia con recursos, familia que te manda remesas, o
familia que depende de ti) y en qué Guatemala te toca vivir (empleo formal o economía
informal). De ahí en adelante:

- **Turnos** de cuatro semanas que reparten trabajo, estudio, trabajos extra y descanso.
  Después de los 30 pasan a trimestres y luego a años, para llegar a los 65.
- **Trece empleos** con eje formal e informal, más un mercado laboral que se mueve.
- **Cuatro rutas de estudio**, desde técnico hasta maestría.
- **Productos bancarios**: cuenta monetaria, ahorro, depósito a plazo, préstamo personal,
  tarjeta de crédito, hipoteca y plan de pensiones. Y el prestamista del barrio.
- **Historial de crédito** con puntaje visible, fiador y garantía.
- **Remesas** por los dos lados: las recibes de joven, y si migras eres quien las manda.
- **Ocho minijuegos**, tres de ellos exclusivos de tu carrera.
- **Reportes** anuales y de jubilación, glosario, tres ranuras de partida y código
  exportable.

## Cambiar los números sin programar

Todos los valores editables viven en `datos/`. Cambia el número, guarda y recarga.

| Archivo | Qué controla |
|---|---|
| `config.js` | Economía general, gastos, energía, tasas, remesas, compresión del tiempo |
| `trabajos.js` | Los trece empleos y sus salarios |
| `carreras.js` | Rutas de estudio, duración, costos y demanda del mercado |
| `creditos.js` | Préstamo, tarjeta, prestamista informal, puntaje y fiador |
| `largoplazo.js` | Casas, hipoteca y plan de pensiones |
| `origenes.js` | Los tres puntos de partida del personaje |
| `migracion.js` | Costo del viaje, empleos allá, canales de envío y comisiones |
| `eventos.js` | Eventos de vida y promociones del banco |
| `glosario.js` | Los términos que explica el juego |
| `textos.en.js` y `textos.en.v2.js` | La traducción al inglés |

Las cifras marcadas `ESTIMACION` en los comentarios necesitan validación. Las demás vienen
de fuente verificada y están documentadas en `docs/investigacion-economia-guatemala.md`.

## Probarlo

Las pruebas corren sin navegador con Node y son deterministas.

```
node pruebas/todas.js          # las seis suites, 157 comprobaciones
```

O una por una:

```
node pruebas/balanceo.js           # cinco estrategias a 24 meses
node pruebas/vidas-completas.js    # cuatro vidas hasta la jubilación
node pruebas/ciclo-credito.js      # fiador, garantía, puntaje, mora, tarjeta
node pruebas/largo-plazo.js        # hipoteca, pensión, orígenes y migración
node pruebas/interfaz-bilingue.js  # las cinco pestañas en ambos idiomas
node pruebas/dom-real.js           # una partida de verdad en un navegador simulado
```

`balanceo.js` es el que hay que mirar al tocar la economía a corto plazo: compara estrategias
a 24 meses y deja ver si algún incentivo quedó al revés. Ya atrapó tres veces que quemarse
rendía más que cuidarse.

`vidas-completas.js` es el que hay que mirar al tocar los costos de estudio o los sueldos.
Además de jugar cuatro vidas hasta los 65, corre cuatro rutas educativas sobre veintiuna
semillas y compara la mediana del patrimonio final. Si estudiar dejara de rendir, la suite
falla y dice cuál escalón se invirtió. Todas las corridas usan azar con semilla, así que dan
el mismo resultado siempre.

`dom-real.js` es la única que necesita `npm install`, porque usa jsdom para cargar el
`index.html` real y tocar botones de verdad: abre ventanas, llena campos, cambia de idioma
y juega un minijuego esperando sus temporizadores. Si jsdom no está instalado, esa suite se
salta sola y las otras cinco siguen corriendo.

**El juego no tiene dependencias.** El `package.json` existe solo para esa prueba.

`pruebas/comun.js` carga el juego en un entorno aislado con un DOM mínimo. Si agregas un
archivo al juego, agrégalo también a la lista `ARCHIVOS` de ese módulo y a `index.html`.

## Agregar cosas

- **Un minijuego**: crea un archivo en `js/minijuegos/`, llama a `Minijuegos.registrar()` y
  súmalo a `index.html`. Si pones `requiereCarrera`, solo se abre al graduarse de esa
  carrera.
- **Un idioma**: escribe un diccionario nuevo como `textos.en.js`. La clave de cada texto
  es la frase en español, así que una traducción incompleta nunca rompe el juego.

## Documentos

- `docs/diseno-mi-primer-quetzal.md` — el diseño completo y las decisiones tomadas.
- `docs/investigacion-economia-guatemala.md` — las 197 cifras que sostienen el juego.
