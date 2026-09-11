# Comodines pendientes del tablero

Estado al 10 de septiembre de 2026.

`datos/tablero.js` ya contiene 8 comodines. Este documento propone **22 nuevos**
para llegar a los 30 pedidos en `PENDIENTE.md`. El número 40 corresponde a las
cadenas que todavía hay que traducir al inglés para los 8 comodines existentes:
pregunta, dos opciones y dos resultados por cada uno.

Los siguientes objetos están listos para que otra IA los revise, traduzca y
copie dentro de `TABLERO_COMODINES`. No se conectaron al juego.

```js
{
  id: 'com_aguacero',
  pregunta: 'Cae un aguacero justo cuando vas a salir.',
  a: { texto: 'Esperar a que baje',
       resultado: 'Llegaste tarde, pero seco y de buen humor.',
       efecto: { energia: 5 } },
  b: { texto: 'Salir de una vez',
       resultado: 'Llegaste a tiempo y pasaste el resto del día mojado.',
       efecto: { energia: -8 } }
},
{
  id: 'com_bus_lleno',
  pregunta: 'La camioneta viene llena y la siguiente tarda media hora.',
  a: { texto: 'Subirte como puedas',
       resultado: 'Llegaste pronto, pero el viaje te dejó molido.',
       efecto: { energia: -9 } },
  b: { texto: 'Esperar la siguiente',
       resultado: 'Viajaste sentado y perdiste buena parte de la mañana.',
       efecto: { energia: -3 } }
},
{
  id: 'com_corte_luz',
  pregunta: 'Se fue la luz en todo el barrio al caer la tarde.',
  a: { texto: 'Buscar velas y seguir',
       resultado: 'Avanzaste a medias y terminaste con dolor de cabeza.',
       efecto: { energia: -8, experiencia: 3 } },
  b: { texto: 'Dar el día por terminado',
       resultado: 'Dormiste temprano y amaneciste como nuevo.',
       efecto: { energia: 10 } }
},
{
  id: 'com_bici_pinchada',
  pregunta: 'Una bicicleta tirada tiene la llanta pinchada y nadie aparece.',
  a: { texto: 'Quedarte a esperar al dueño',
       resultado: 'Volvió preocupado y aprendiste a poner un parche.',
       efecto: { energia: -5, experiencia: 5 } },
  b: { texto: 'Seguir tu camino',
       resultado: 'Llegaste temprano. Nunca supiste de quién era.',
       efecto: { energia: 4 } }
},
{
  id: 'com_mudanza',
  pregunta: 'Una familia nueva está bajando muebles frente a tu casa.',
  a: { texto: 'Ayudar a cargar',
       resultado: 'Terminaste cansado y ya conoces a los nuevos vecinos.',
       efecto: { energia: -10, experiencia: 4 } },
  b: { texto: 'Saludar y seguir',
       resultado: 'Fuiste amable sin regalar la tarde entera.',
       efecto: { energia: 2 } }
},
{
  id: 'com_fiesta_barrio',
  pregunta: 'En la cuadra organizaron música y comida para esta noche.',
  a: { texto: 'Quedarte hasta el final',
       resultado: 'Bailaste, comiste y al día siguiente no querías levantarte.',
       efecto: { energia: -13 } },
  b: { texto: 'Ir solo un rato',
       resultado: 'Compartiste con todos y todavía dormiste bien.',
       efecto: { energia: 4 } }
},
{
  id: 'com_arreglo_vecino',
  pregunta: 'Un vecino está arreglando el techo y te pide una mano.',
  a: { texto: 'Subirte a ayudar',
       resultado: 'Acabaron antes de la lluvia y aprendiste un par de trucos.',
       efecto: { energia: -12, experiencia: 6 } },
  b: { texto: 'Prestarle una herramienta',
       resultado: 'Le sirvió bastante y tú conservaste la tarde.',
       efecto: { energia: 3 } }
},
{
  id: 'com_perro_perdido',
  pregunta: 'Un perro con collar te sigue desde hace tres cuadras.',
  a: { texto: 'Buscar a su familia',
       resultado: 'Te tomó horas, pero volvió a casa moviendo la cola.',
       efecto: { energia: -10, experiencia: 4 } },
  b: { texto: 'Dejarlo en una tienda conocida',
       resultado: 'Lo cuidaron mientras tú seguiste con tu día.',
       efecto: { energia: -2 } }
},
{
  id: 'com_grupo_estudio',
  si: 'estudia',
  pregunta: 'Tus compañeros proponen estudiar juntos para el examen.',
  a: { texto: 'Reunirte con ellos',
       resultado: 'Hablaron demasiado, pero una explicación te destrabó el tema.',
       efecto: { energia: -8, experiencia: 7 } },
  b: { texto: 'Estudiar por tu cuenta',
       resultado: 'Avanzaste en silencio y te quedaron un par de dudas.',
       efecto: { energia: -6, experiencia: 5 } }
},
{
  id: 'com_presentacion',
  si: 'estudia',
  pregunta: 'El grupo no se pone de acuerdo para la presentación de mañana.',
  a: { texto: 'Tomar el mando',
       resultado: 'La sacaste adelante y cargaste con casi todo.',
       efecto: { energia: -14, experiencia: 9 } },
  b: { texto: 'Repartir una última vez',
       resultado: 'No quedó perfecta, pero todos hicieron su parte.',
       efecto: { energia: -7, experiencia: 5 } }
},
{
  id: 'com_apuntes',
  si: 'estudia',
  pregunta: 'Alguien que faltó te pide tus apuntes antes de clase.',
  a: { texto: 'Explicárselos también',
       resultado: 'Perdiste el recreo y entendiste mejor al enseñarlo.',
       efecto: { energia: -6, experiencia: 6 } },
  b: { texto: 'Prestarle el cuaderno',
       resultado: 'Copió rápido y te lo devolvió justo a tiempo.',
       efecto: { experiencia: 2 } }
},
{
  id: 'com_beca_formulario',
  si: 'estudia',
  pregunta: 'Apareció una beca y el formulario vence esta noche.',
  a: { texto: 'Llenarlo con calma',
       resultado: 'Te desvelaste revisando cada dato y enviaste una buena solicitud.',
       efecto: { energia: -12, experiencia: 8 } },
  b: { texto: 'Mandarlo de prisa',
       resultado: 'Lo entregaste a tiempo, aunque se te fue un error.',
       efecto: { energia: -4, experiencia: 3 } }
},
{
  id: 'com_bus_tarea',
  si: 'estudia',
  pregunta: 'Te falta terminar una tarea y todavía queda un viaje largo en bus.',
  a: { texto: 'Hacerla en el camino',
       resultado: 'La letra salió torcida, pero resolviste lo importante.',
       efecto: { energia: -7, experiencia: 5 } },
  b: { texto: 'Descansar durante el viaje',
       resultado: 'Llegaste despejado y con la tarea todavía pendiente.',
       efecto: { energia: 8 } }
},
{
  id: 'com_turno_extra',
  si: 'trabaja',
  pregunta: 'Faltó un compañero y te ofrecen cubrir parte de su turno.',
  a: { texto: 'Cubrirlo',
       resultado: 'El día se hizo eterno, pero notaron que respondiste.',
       efecto: { energia: -14, dinero: 90, experiencia: 4 } },
  b: { texto: 'Mantener tu horario',
       resultado: 'Saliste a tu hora. Mañana también hay trabajo.',
       efecto: { energia: 5 } }
},
{
  id: 'com_error_caja',
  si: 'trabaja',
  pregunta: 'Al cerrar, la caja no cuadra y todos quieren irse.',
  a: { texto: 'Quedarte a revisar',
       resultado: 'Encontraste un recibo mal puesto después de media hora.',
       efecto: { energia: -9, experiencia: 6 } },
  b: { texto: 'Dejarlo para mañana',
       resultado: 'Descansaste, pero el problema amaneció esperándote.',
       efecto: { energia: 5 } }
},
{
  id: 'com_herramienta',
  si: 'trabaja',
  pregunta: 'Un compañero te pide prestada tu mejor herramienta para el turno.',
  a: { texto: 'Prestársela',
       resultado: 'La devolvió gastada, pero terminó un trabajo difícil.',
       efecto: { energia: -3, experiencia: 5 } },
  b: { texto: 'Trabajar juntos',
       resultado: 'Fueron más lentos y ambos aprendieron algo.',
       efecto: { energia: -8, experiencia: 7 } }
},
{
  id: 'com_jefe_favor',
  si: 'trabaja',
  pregunta: 'Tu jefe te pide resolver algo que no estaba en tu puesto.',
  a: { texto: 'Intentarlo',
       resultado: 'Te costó bastante y ahora sabes hacer una cosa más.',
       efecto: { energia: -12, experiencia: 8 } },
  b: { texto: 'Pedir que te enseñen',
       resultado: 'Tardaron más, pero no tuviste que improvisar a ciegas.',
       efecto: { energia: -6, experiencia: 6 } }
},
{
  id: 'com_curso_sabado',
  si: 'trabaja',
  pregunta: 'Ofrecen un curso gratuito el sábado sobre algo que usas en el trabajo.',
  a: { texto: 'Inscribirte',
       resultado: 'Perdiste el descanso y saliste con ideas útiles.',
       efecto: { energia: -12, experiencia: 10 } },
  b: { texto: 'Guardar el sábado',
       resultado: 'Dormiste hasta tarde y volviste con la cabeza fresca.',
       efecto: { energia: 12 } }
},
{
  id: 'com_prestamo_compa',
  si: 'trabaja',
  pregunta: 'Un compañero te pide prestado hasta la próxima quincena.',
  a: { texto: 'Prestarle',
       resultado: 'Te pagó unos días tarde y ahora te debe un favor.',
       efecto: { dinero: -120, experiencia: 4 } },
  b: { texto: 'Decir que no',
       resultado: 'Lo entendió, aunque la conversación quedó incómoda.',
       efecto: { energia: -2 } }
},
{
  id: 'com_vuelto',
  si: 'dinero',
  pregunta: 'En el mercado notas que te dieron vuelto de más.',
  a: { texto: 'Regresarlo',
       resultado: 'La vendedora todavía no había notado el error.',
       efecto: { energia: -2, experiencia: 4 } },
  b: { texto: 'Guardarlo',
       resultado: 'Ganaste unas monedas y pensaste en eso todo el camino.',
       efecto: { dinero: 25, energia: -3 } }
},
{
  id: 'com_cuotas',
  si: 'dinero',
  pregunta: 'Te ofrecen algo que quieres en cuotas pequeñas y sin explicar el total.',
  a: { texto: 'Preguntar el precio completo',
       resultado: 'Era mucho más caro de lo que sonaba por mes.',
       efecto: { energia: -2, experiencia: 7 } },
  b: { texto: 'Aceptar la cuota',
       resultado: 'Saliste contento y el primer cobro llegó antes de lo esperado.',
       efecto: { dinero: -180, energia: 3 } }
},
{
  id: 'com_reparacion',
  si: 'dinero',
  pregunta: 'Tu celular falla y te ofrecen repararlo hoy sin revisar qué tiene.',
  a: { texto: 'Pedir diagnóstico',
       resultado: 'Esperaste un día y la falla era más sencilla de lo que parecía.',
       efecto: { dinero: -60, energia: -3, experiencia: 5 } },
  b: { texto: 'Pagar la reparación rápida',
       resultado: 'Funcionó de una vez, aunque pagaste por la urgencia.',
       efecto: { dinero: -160, energia: 5 } }
}
```

## Reparto del lote

- 8 comodines generales.
- 5 condicionados a `estudia`.
- 6 condicionados a `trabaja`.
- 3 condicionados a `dinero`.
- 22 identificadores nuevos y sin repetir los 8 actuales.

Antes de integrarlos hay que traducir sus 110 cadenas nuevas al inglés, añadir
las 40 cadenas que faltan de los comodines actuales y correr `npm test`.
