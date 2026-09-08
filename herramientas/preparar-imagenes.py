# -*- coding: utf-8 -*-
"""Mi Primer Quetzal - prepara las imagenes que el juego carga

Los PNG de `assets/visuales/` son los MAESTROS y este script no los toca nunca.
Lo que hace es escribir en `assets/juego/` las copias que el navegador carga de
verdad, y esas copias son otra cosa: WebP, al tamano en que se ven, limpias.

    python herramientas/preparar-imagenes.py

No hace falta para jugar ni para programar: `assets/juego/` va dentro del
repositorio, igual que `vendor/`. Se corre solo cuando llegan imagenes nuevas o
cuando hay que cambiar un tamano.

Necesita Pillow y numpy (`pip install pillow numpy`). Es la unica parte del
proyecto que pide Python, y por eso es una herramienta y no parte del juego.

---------------------------------------------------------------------------
Por que hay que reescribirlas y no usar los maestros directamente
---------------------------------------------------------------------------

1. PESO. Los 73 maestros suman 126 MB: entre 0.7 y 3.6 MB cada uno. El personaje
   se ve en pantalla a unos 80 px de ancho y el local a unos 90. Cargar 2 MB
   para pintar 90 px rompe la promesa de que el juego abre con doble clic y
   funciona sin internet. Las copias suman poco mas de 1 MB entre todas, y
   `pruebas/arte.js` falla si se pasan del tope.

2. EL CUADRICULADO HORNEADO. El generador que hizo las imagenes dejo pintado
   el patron de cuadros gris y blanco que los editores usan para SENALAR
   transparencia, y lo dejo OPACO. `herramientas/quitar-fondo-cuadriculado.ps1`
   limpio lo que tocaba los bordes, pero los huecos cerrados —el interior del
   asa de la canasta, la zona de la que cuelga el rotulo— se quedaron con el
   cuadriculado adentro. En pantalla eso se ve como una mancha de cuadros gris.

   Aqui se limpia midiendo lo que de verdad lo delata: una zona donde alternan
   DOS tonos desaturados (blanco ~255 y gris ~208) y no hay nada mas. Un tenis
   blanco o un toldo de lona son de UN tono, asi que no se tocan. La medida se
   hace con filtros locales, no pixel por pixel, para que el borde del
   cuadriculado tambien caiga.

3. EL MARGEN VACIO. El personaje ocupa unos 550 px de los 1024 de ancho del
   maestro: el resto es transparencia. Recortarla deja la imagen mas nitida al
   mismo peso. Pero se recorta con una caja COMUN a los 23 personajes, no con
   la de cada uno: si cada profesion se recortara a su medida, el mismo chico
   cambiaria de tamano y de sitio al cambiar de trabajo.

   Los locales van al contrario: cada uno con SU caja. Un local no es la misma
   cosa retratada dos veces, es otra cosa, y el margen que le sobra abajo va de
   0 px (distribuidora n2) a 122 (lavado n4). Con caja comun, el lavado con
   sucursal saldria flotando un 15% por encima de la calle.
"""

import os
import sys
import glob
import json

try:
    from PIL import Image, ImageFilter
    import numpy as np
except ImportError:
    sys.exit('Falta Pillow o numpy: pip install pillow numpy')

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAESTROS = os.path.join(RAIZ, 'assets', 'visuales')
DESTINO = os.path.join(RAIZ, 'assets', 'juego')

# Calidad del WebP. 82 no se distingue de 100 a estos tamanos y pesa la mitad.
CALIDAD = 82

# ---------------------------------------------------------------------------
# 1. quitar el cuadriculado horneado
# ---------------------------------------------------------------------------

def _frac(mascara, radio):
    """Fraccion de vecinos que cumplen la mascara, con un filtro de caja."""
    im = Image.fromarray((mascara * 255).astype(np.uint8), 'L')
    im = im.filter(ImageFilter.BoxBlur(radio))
    return np.asarray(im).astype(np.float32) / 255.0


def limpiar_cuadriculado(im):
    """Devuelve la imagen con el cuadriculado horneado puesto en transparente,
    y cuantos pixeles quito."""
    a = np.asarray(im.convert('RGBA'))
    r, g, b, al = (a[..., i].astype(np.int16) for i in range(4))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    opaco = al > 200
    desat = (mx - mn) < 14

    blanco = opaco & desat & (mx >= 244)
    gris = opaco & desat & (mx >= 192) & (mx <= 228)
    # "otro" es todo lo que es dibujo de verdad: color, o oscuro, o el contorno
    otro = opaco & ~(desat & (mx >= 188))

    fb, fg, fo = _frac(blanco, 12), _frac(gris, 12), _frac(otro, 12)

    # El cuadriculado: mucho de los DOS tonos, nada de dibujo alrededor, y la
    # vecindad LLENA de esos dos tonos.
    #
    # Esa ultima condicion es la que faltaba en la primera version, y sin ella
    # el limpiador se COMIO LOS RAYOS DE LAS RUEDAS de la bicicleta: son lineas
    # finas blancas y grises sobre transparente, asi que localmente parecian el
    # patron. El cuadriculado llena su vecindad; unos rayos no llenan nada.
    cuadros = (fb > 0.15) & (fg > 0.15) & (fo < 0.10) & ((fb + fg) > 0.55)
    if not cuadros.any():
        return im, 0

    # Se ensancha un poco para que el borde difuso del patron caiga tambien
    cerca = _frac(cuadros, 4) > 0.02
    fuera = cerca & opaco & desat & (mx >= 180)

    n = int(fuera.sum())
    if not n:
        return im, 0
    b2 = a.copy()
    b2[..., 3] = np.where(fuera, 0, b2[..., 3])
    return Image.fromarray(b2, 'RGBA'), n


# ---------------------------------------------------------------------------
# 2. recortar y redimensionar
# ---------------------------------------------------------------------------

def caja_util(im):
    c = im.convert('RGBA').getchannel('A').getbbox()
    return c or (0, 0, im.size[0], im.size[1])


def union(cajas):
    return (min(c[0] for c in cajas), min(c[1] for c in cajas),
            max(c[2] for c in cajas), max(c[3] for c in cajas))


def encajar(im, caja, ancho, alto):
    """Recorta por `caja` y mete el resultado en un lienzo de ancho x alto sin
    deformarlo: centrado a lo ancho y APOYADO ABAJO.

    Lo de abajo importa. Todo lo que sale en la escena se para en el suelo: el
    chico, el local, la bicicleta. Si el objeto queda centrado en su lienzo, un
    dibujo mas ancho que alto —la carreta— se lleva la mitad del hueco vacio
    debajo y en pantalla sale flotando sobre la plataforma.
    """
    trozo = im.crop(caja)
    trozo.thumbnail((ancho, alto), Image.LANCZOS)
    lienzo = Image.new('RGBA', (ancho, alto), (0, 0, 0, 0))
    lienzo.paste(trozo, ((ancho - trozo.size[0]) // 2, alto - trozo.size[1]))
    return lienzo


def guardar(im, ruta):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    im.save(ruta, 'WEBP', quality=CALIDAD, method=6)
    return os.path.getsize(ruta)


# ---------------------------------------------------------------------------
# 3. que se prepara, y a que tamano
# ---------------------------------------------------------------------------
#
# Los tamanos salen de medir la pantalla, no a ojo:
#
#   personaje  en la escena se ve a ~80 px de ancho, y en el perfil a ~120.
#              A 2x de densidad de pantalla eso son 240: 256x384 sobra, y
#              mantiene la relacion 2:3 que piden las notas de las imagenes.
#   negocio    el local mas grande de la calle se ve a ~90 px, o 180 a 2x.
#              192 sobra, y a ese tamano los 36 locales por tipo caben en el
#              presupuesto de peso; a 256 no cabian. Los cuatro genericos se
#              quedan en 256 porque son cuatro y ya estaban escritos asi.
#   mejoras    las piezas del margen se ven a ~40 px. 192 sobra.
#   plataforma cruza la escena entera, ~440 px, o 880 a 2x.
#   moneda     ~22 px.

PERSONAJE = (256, 384)
CUADRO = (256, 256)
PIEZA = (192, 192)
LOCAL = (192, 192)

# Los nueve tipos de negocio de datos/negocios.js que tienen local ilustrado.
# Es una lista y no un glob para que un directorio a medio entregar no entre
# al juego a medias: si falta un nivel, el script lo dice y no escribe nada.
TIPOS_CON_LOCAL = ['cafeinternet', 'comedor', 'distribuidora', 'dulces',
                   'lavado', 'papeleria', 'refrescos', 'taller', 'tortilleria']

# 'clave del juego' -> ruta del maestro
def plan():
    p = {}
    for f in sorted(glob.glob(os.path.join(MAESTROS, 'personaje', '*.png'))):
        p['personaje/' + os.path.basename(f)[:-4]] = (f, PERSONAJE, 'personaje')
    for f in sorted(glob.glob(os.path.join(MAESTROS, 'personaje', 'profesiones', '*.png'))):
        p['personaje/' + os.path.basename(f)[:-4]] = (f, PERSONAJE, 'personaje')

    # Los cuatro locales GENERICOS. No sobran aunque ya haya uno por tipo: son
    # lo que se ve si manana alguien agrega un decimo tipo de negocio a
    # datos/negocios.js y nadie lo ha ilustrado todavia.
    negocios = {'nivel-1-canasta': 'negocio/n1', 'nivel-2-carreta': 'negocio/n2',
                'nivel-3-puesto': 'negocio/n3', 'nivel-4-local': 'negocio/n4'}
    for base, clave in negocios.items():
        p[clave] = (os.path.join(MAESTROS, 'negocio', base + '.png'), CUADRO, 'suelto')

    # Y los 36 de los nueve tipos, cuatro niveles cada uno.
    for t in TIPOS_CON_LOCAL:
        for n in range(1, 5):
            p['negocio/%s/n%d' % (t, n)] = (
                os.path.join(MAESTROS, 'negocio', t, 'n%d.png' % n), LOCAL, 'suelto')

    mejoras = {
        'oficio/caja-herramientas': 'mejoras/oficio-1',
        'oficio/rotulo': 'mejoras/oficio-2',
        'oficio/bicicleta': 'mejoras/oficio-3',
        'estudio/mochila': 'mejoras/escuela-1',
        'estudio/libros': 'mejoras/escuela-2',
        'estudio/internet': 'mejoras/escuela-3',
        'descanso/rincon': 'mejoras/casa-1',
        'descanso/cama': 'mejoras/casa-2',
    }
    for base, clave in mejoras.items():
        p[clave] = (os.path.join(MAESTROS, 'mejoras', base + '.png'), PIEZA, 'suelto')

    p['escena/plataforma'] = (os.path.join(MAESTROS, 'escena', 'plataforma.png'),
                              (1024, 600), 'suelto')
    p['escena/moneda'] = (os.path.join(MAESTROS, 'escena', 'moneda.png'),
                          (96, 96), 'suelto')
    return p


def main():
    tareas = plan()
    faltan = [f for f, _, _ in tareas.values() if not os.path.exists(f)]
    if faltan:
        sys.exit('No estan estos maestros:\n  ' + '\n  '.join(faltan))

    print('Limpiando el cuadriculado horneado y midiendo el recorte...')
    limpias, cajas_personaje = {}, []
    for clave, (ruta, _, grupo) in tareas.items():
        im = Image.open(ruta).convert('RGBA')
        im, quitados = limpiar_cuadriculado(im)
        if quitados:
            pct = quitados / (im.size[0] * im.size[1]) * 100
            print(f'  {clave:34} -{quitados:>9,} px de cuadriculado ({pct:.1f}%)')
        limpias[clave] = im
        if grupo == 'personaje':
            cajas_personaje.append(caja_util(im))

    # La caja COMUN del personaje, con un poco de aire, para que el mismo chico
    # no cambie de tamano al cambiar de trabajo.
    cp = union(cajas_personaje)
    aire = 12
    cp = (max(0, cp[0] - aire), max(0, cp[1] - aire), cp[2] + aire, cp[3] + aire)
    print(f'\nCaja comun del personaje: {cp[2]-cp[0]}x{cp[3]-cp[1]} '
          f'(de {limpias["personaje/base"].size[0]}x{limpias["personaje/base"].size[1]})')

    print('\nEscribiendo assets/juego/ ...')
    total, indice = 0, {}
    for clave, (_, tam, grupo) in sorted(tareas.items()):
        im = limpias[clave]
        caja = cp if grupo == 'personaje' else caja_util(im)
        salida = os.path.join(DESTINO, clave + '.webp')
        bytes_ = guardar(encajar(im, caja, *tam), salida)
        total += bytes_
        indice[clave] = tam
        print(f'  {clave + ".webp":38} {tam[0]:>4}x{tam[1]:<4} {bytes_/1024:7.1f} KB')

    print(f'\n{len(tareas)} imagenes, {total/1024:.0f} KB en total '
          f'(los maestros pesan 126 MB).')

    # El indice de tamanos, para que la interfaz pueda poner width y height y
    # la pagina no salte mientras cargan.
    with open(os.path.join(DESTINO, 'tamanos.json'), 'w', encoding='utf-8') as f:
        json.dump(indice, f, indent=1, sort_keys=True)
    print('Y assets/juego/tamanos.json con las medidas.')


if __name__ == '__main__':
    main()
