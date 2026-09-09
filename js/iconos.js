/* Mi Primer Quetzal — juego de iconos
 *
 * Antes la interfaz usaba emoji. El emoji tiene dos problemas que no se
 * arreglan con CSS: cada sistema lo dibuja distinto (el maletin de Windows no
 * se parece al de Android) y viene con su propio color, asi que nunca combina
 * con la paleta del juego. Cambiaba la cara del juego segun el telefono.
 *
 * Esto los reemplaza con dibujos propios. Son SVG de trazo sobre una
 * cuadricula de 24x24, sin relleno, con el color heredado del texto
 * (currentColor). Eso significa que un icono:
 *
 *   - se ve igual en todos los sistemas,
 *   - toma el color de donde este puesto (blanco en la barra, verde en una
 *     tarjeta activa, rojo en un boton de peligro) sin una linea extra,
 *   - mide 1em, asi que crece y se encoge con la letra que lo rodea.
 *
 * Los dibujos propios son los que manda. Detras hay un respaldo: los iconos
 * de Lucide que vendor/lucide.js trae recortados (ISC, generados por
 * herramientas/traer-librerias.js). Si un nombre no esta dibujado a mano se
 * busca ahi antes de rendirse, y asi se puede agregar contenido nuevo sin
 * dibujar cada icono. Ninguno de los que ya existen cambia.
 *
 * Sigue sin haber nada que descargar: vendor/ va dentro del repositorio, asi
 * que el juego funciona abriendo index.html desde el disco, sin internet y
 * sin instalar nada.
 *
 * ---------------------------------------------------------------------------
 * Como agregar un icono
 * ---------------------------------------------------------------------------
 * Se agrega una linea a TRAZOS con el nombre y el interior del SVG. Reglas
 * para que combine con los demas:
 *
 *   - la cuadricula es de 0 a 24 en los dos ejes; deja como 2 de margen,
 *   - solo trazo, sin relleno: el grosor y las puntas los pone el CSS,
 *   - para un punto macizo (una llanta, un ojo) usa fill="currentColor"
 *     stroke="none" en esa figura suelta.
 *
 * Luego se usa con Ico('nombre'), o poniendo el nombre en el campo `icono`
 * de un dato (un trabajo, un evento, una carrera).
 * ---------------------------------------------------------------------------
 */

var Iconos = (function () {

  var TRAZOS = {

    // ---------- señales de la interfaz ----------

    mas:        '<path d="M12 6v12M6 12h12"/>',
    visto:      '<path d="M4.6 12.8 9.6 17.6 19.6 6.6"/>',
    puntos:     '<circle cx="5.6" cy="12" r="1.4" fill="currentColor" stroke="none"/>' +
                '<circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>' +
                '<circle cx="18.4" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    adelantar:  '<path d="M5.6 6.4 11.2 12l-5.6 5.6M13 6.4 18.6 12 13 17.6"/>',
    alerta:     '<path d="M12 3.8 21.4 20H2.6z"/><path d="M12 9.4v4.6"/>' +
                '<circle cx="12" cy="17.1" r="1" fill="currentColor" stroke="none"/>',
    rayo:       '<path d="M13.4 2.6 5.2 13.6h5.4l-.8 7.8 8.2-10.8h-5.4z"/>',
    mundo:      '<circle cx="12" cy="12" r="8.7"/><path d="M3.3 12h17.4"/>' +
                '<path d="M12 3.3c2.6 2.4 4 5.4 4 8.7s-1.4 6.3-4 8.7c-2.6-2.4-4-5.4-4-8.7s1.4-6.3 4-8.7z"/>',
    sonido:     '<path d="M4 9.6h3.2L12 5.4v13.2L7.2 14.4H4z"/>' +
                '<path d="M15.4 9.4a3.6 3.6 0 0 1 0 5.2"/><path d="M18.1 6.9a7.2 7.2 0 0 1 0 10.2"/>',
    'sonido-off': '<path d="M4 9.6h3.2L12 5.4v13.2L7.2 14.4H4z"/>' +
                '<path d="M15.9 9.8l4.5 4.4M20.4 9.8l-4.5 4.4"/>',

    // ---------- jornadas del dia ----------
    // El mes se reparte por jornadas, y una jornada hay que poder mirarla y
    // saber si es manana o tarde sin leer.

    manana:     '<circle cx="12" cy="11.4" r="4"/>' +
                '<path d="M12 3.4v2M12 17.4v2M4 11.4h2M18 11.4h2"/>' +
                '<path d="M6.3 5.7 7.7 7.1M16.3 15.7l1.4 1.4M17.7 5.7 16.3 7.1M7.7 15.7l-1.4 1.4"/>',
    tarde:      '<path d="M7.4 15.6a4.6 4.6 0 0 1 9.2 0"/>' +
                '<path d="M2.8 15.6h18.4"/><path d="M12 4.4v2.4"/>' +
                '<path d="M5.4 7.4 7 9M18.6 7.4 17 9"/>' +
                '<path d="M4.6 19.4h4.2M11.2 19.4h8.2"/>',
    flecha:     '<path d="M12 3.6v14.2"/><path d="M6.4 12.4 12 18.4l5.6-6"/>',

    // ---------- lugares ----------

    casa:       '<path d="M3.2 10.9 12 4l8.8 6.9"/><path d="M5.5 9.6V20h13V9.6"/>' +
                '<path d="M9.8 20v-5.5h4.4V20"/>',
    'casa-jardin': '<path d="M2.2 10.8 8.4 6l6.2 4.8"/><path d="M4 9.6V20h8.8V9.6"/>' +
                '<path d="M6.9 20v-4.4h2.9V20"/>' +
                '<circle cx="18.6" cy="12.9" r="3"/><path d="M18.6 15.9V20"/>' +
                '<path d="M2.4 20h19.2"/>',
    edificio:   '<path d="M6 20V4.8h12V20"/><path d="M3.4 20h17.2"/>' +
                '<path d="M9.2 8.2h1.6M13.2 8.2h1.6M9.2 12h1.6M13.2 12h1.6"/>' +
                '<path d="M10.6 20v-4h2.8v4"/>',
    tienda:     '<path d="M4 9.6V20h16V9.6"/><path d="M2.6 9.6 4.6 4.8h14.8l2 4.8z"/>' +
                '<path d="M8.2 20v-5.6h4.6V20"/>',
    banco:      '<path d="M3.2 9.8 12 4.6l8.8 5.2"/>' +
                '<path d="M5.6 10.4V17M9.9 10.4V17M14.1 10.4V17M18.4 10.4V17"/>' +
                '<path d="M4.4 17h15.2M3.4 20h17.2"/>',
    hospital:   '<rect x="3.6" y="4.6" width="16.8" height="15.4" rx="2.2"/>' +
                '<path d="M12 8.6v7.6M8.2 12.4h7.6"/>',

    // ---------- trabajo y estudio ----------

    maletin:    '<rect x="3" y="7.6" width="18" height="11.8" rx="2.2"/>' +
                '<path d="M8.8 7.6V6.2a1.6 1.6 0 0 1 1.6-1.6h3.2a1.6 1.6 0 0 1 1.6 1.6v1.4"/>' +
                '<path d="M3 12.9h18"/>',
    birrete:    '<path d="M2.4 9.2 12 4.8l9.6 4.4L12 13.6z"/>' +
                '<path d="M6.9 11.3v4.5h10.2v-4.5"/>' +
                '<path d="M20.6 10.2v4.4"/>' +
                '<circle cx="20.6" cy="15.8" r="1.1"/>',
    casco:      '<path d="M4.8 16.4v-1.8a7.2 7.2 0 0 1 14.4 0v1.8"/>' +
                '<path d="M9.6 8.4V4.8h4.8v3.6"/>' +
                '<path d="M2.8 16.4h18.4a1.6 1.6 0 0 1 0 3.2H2.8a1.6 1.6 0 0 1 0-3.2z"/>',
    portapapeles: '<rect x="4.8" y="5.2" width="14.4" height="15.4" rx="2.2"/>' +
                '<path d="M9 5.4V3.8a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 3.8v1.6z"/>' +
                '<path d="M8.4 10.6h7.2M8.4 14h7.2M8.4 17.2h4.4"/>',
    escuadra:   '<path d="M4.2 4.4v15.4h15.4z"/><path d="M4.2 12.4h7.4M8.2 19.8v-7.4"/>',
    libro:      '<path d="M12 6.6C10.2 5.2 7.6 4.6 4 4.6v13c3.6 0 6.2.6 8 2 1.8-1.4 4.4-2 8-2v-13c-3.6 0-6.2.6-8 2z"/>' +
                '<path d="M12 6.6v13"/>',
    libros:     '<path d="M4 5h3.8v14H4z"/><path d="M9.4 5h3.8v14H9.4z"/>' +
                '<path d="M15.2 6.4l3.7 1L16 20.6l-3.7-1z"/>',
    calculadora: '<rect x="4.4" y="2.8" width="15.2" height="18.4" rx="2.2"/>' +
                '<path d="M7.6 6.4h8.8v3.2H7.6z"/>' +
                '<path d="M8.2 13h.01M12 13h.01M15.8 13h.01M8.2 17.2h.01M12 17.2h.01M15.8 17.2h.01"/>',
    computadora: '<rect x="3.6" y="4.4" width="16.8" height="11" rx="2"/><path d="M2 18.6h20"/>',
    // La rama de arte del diversificado: paleta con tres pozos de pintura
    paleta:     '<path d="M12 3.2c-4.9 0-8.8 3.5-8.8 7.9 0 4.3 3.9 7.7 8.8 7.7.9 0 1.6.7 1.6 1.6' +
                'S12.9 22 12 22c.5 0 1 0 1.5-.1 3.9-.5 7.3-3.9 7.3-8.6 0-5.6-4-10.1-8.8-10.1z"/>' +
                '<path d="M7.4 9.4h.01M11 7.4h.01M15.2 9.6h.01M16.6 13.6h.01"/>',
    engranaje:  '<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.6"/>' +
                '<path d="M18 12h2.6M6 12H3.4M12 18v2.6M12 6V3.4"/>' +
                '<path d="M16.3 16.3l1.8 1.8M7.7 7.7 5.9 5.9M16.3 7.7l1.8-1.8M7.7 16.3 5.9 18.1"/>',
    audifonos:  '<path d="M4.4 15.4v-3a7.6 7.6 0 0 1 15.2 0v3"/>' +
                '<path d="M4.4 13.4h2.4a1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1H5.6a1.2 1.2 0 0 1-1.2-1.2z"/>' +
                '<path d="M19.6 13.4h-2.4a1 1 0 0 0-1 1v3.6a1 1 0 0 0 1 1h1.2a1.2 1.2 0 0 0 1.2-1.2z"/>' +
                '<path d="M16.4 19.4a3.8 3.8 0 0 1-3.8 1.6"/>',
    ladrillo:   '<path d="M3.2 5.6h17.6v4.4H3.2zM3.2 10h17.6v4.4H3.2zM3.2 14.4h17.6v4.4H3.2z"/>' +
                '<path d="M9.2 5.6V10M15.2 5.6V10M6.2 10v4.4M12.2 10v4.4M18.2 10v4.4M9.2 14.4v4.4M15.2 14.4v4.4"/>',
    'llave-inglesa': '<path d="M20.4 4.2 17 7.6l-1.8-1.8 3.4-3.4a5.6 5.6 0 0 0-7 7L4.4 16.9a2.2 2.2 0 0 0 3.1 3.1l7.5-7.5a5.6 5.6 0 0 0 5.4-8.3z"/>',
    martillo:   '<path d="M9.3 2.6 12.6 7.3 6.7 11.5 3.4 6.8z"/>' +
                '<path d="M8.8 9.9 16.4 20.9a1.7 1.7 0 0 0 2.8-1.9L11.9 8"/>',
    sarten:     '<circle cx="9.6" cy="12" r="6.4"/><circle cx="9.6" cy="12" r="2"/>' +
                '<path d="M16 12h5.4"/>',
    escoba:     '<path d="M12 3.4v9"/><path d="M5.6 12.4h12.8l1.6 8H4z"/>' +
                '<path d="M8.4 12.4v8M12 12.4v8M15.6 12.4v8"/>',
    mochila:    '<path d="M6.4 9.4a5.6 5.6 0 0 1 11.2 0V20a1.4 1.4 0 0 1-1.4 1.4H7.8A1.4 1.4 0 0 1 6.4 20z"/>' +
                '<path d="M9.4 8.6V6.2a2.6 2.6 0 0 1 5.2 0v2.4"/>' +
                '<path d="M9 15.4h6"/><path d="M9.8 12.6h4.4"/>',
    limonada:   '<path d="M7 6.6h10l-1.2 13a1.4 1.4 0 0 1-1.4 1.3h-4.8a1.4 1.4 0 0 1-1.4-1.3z"/>' +
                '<path d="M7.4 11h9.2"/><path d="M14.2 6.4 16.8 2.6"/>' +
                '<circle cx="10.6" cy="15.6" r="1.1"/>',
    dulce:      '<circle cx="12" cy="12" r="4.4"/>' +
                '<path d="M8.6 9.2 4.4 5.8l.8 4.6-4 1.6 4 1.6-.8 4.6 4.2-3.4"/>' +
                '<path d="M15.4 9.2l4.2-3.4-.8 4.6 4 1.6-4 1.6.8 4.6-4.2-3.4"/>',
    balanza:    '<path d="M12 4.2v15.6"/><path d="M7.4 19.8h9.2"/>' +
                '<path d="M4 7.4h16"/><path d="M4 7.4 1.8 12.6h4.4z"/>' +
                '<path d="M20 7.4 17.8 12.6h4.4z"/>' +
                '<circle cx="12" cy="4.2" r="1.3"/>',
    canasta:    '<path d="M3 9.4h18l-1.8 9.4a2 2 0 0 1-2 1.6H6.8a2 2 0 0 1-2-1.6z"/>' +
                '<path d="M8.2 9.4 12 3.8l3.8 5.6"/><path d="M9.6 13v3.8M14.4 13v3.8"/>',
    carrito:    '<path d="M2.6 4.2h2.6l2.6 10.4h9.8"/><path d="M6.8 7.4h14.6l-1.8 6.2"/>' +
                '<circle cx="9" cy="19" r="1.6"/><circle cx="17.4" cy="19" r="1.6"/>',
    copo:       '<path d="M12 2.8v18.4M4.1 7.4l15.8 9.2M19.9 7.4 4.1 16.6"/>' +
                '<path d="M9.4 5.2 12 7.4l2.6-2.2M9.4 18.8 12 16.6l2.6 2.2"/>',
    palmera:    '<path d="M12 20.6c0-5.6.8-9.5 2.2-11.6"/>' +
                '<path d="M14.2 9c-2.6-1.6-5.6-1-7.4 1M14.2 9c.6-3 3-4.8 5.8-4.6' +
                'M14.2 9c-1-2.6-.2-5.2 2-6.6M14.2 9c2.8.2 4.8 2 5.2 4.6"/>' +
                '<path d="M8.6 20.6h7.6"/>',

    // ---------- dinero y banco ----------

    moneda:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6.6"/>' +
                '<circle cx="12" cy="11.4" r="2.6"/><path d="M12.9 12.9 15 15"/>',
    billete:    '<rect x="2.6" y="6.6" width="18.8" height="10.8" rx="1.8"/>' +
                '<circle cx="12" cy="12" r="2.6"/><path d="M6 10v4M18 10v4"/>',
    tarjeta:    '<rect x="2.4" y="5.4" width="19.2" height="13.2" rx="2.4"/>' +
                '<path d="M2.4 10h19.2"/><path d="M6 14.6h3.6"/>',
    cartera:    '<rect x="2.6" y="5.4" width="16" height="13.6" rx="2.2"/>' +
                '<path d="M13.4 11.2h7.2v3.4h-7.2a1.7 1.7 0 0 1 0-3.4z"/>',
    barras:     '<path d="M4 20h16"/><path d="M7.4 20v-8M12 20V6.6M16.6 20v-5.4"/>',
    tendencia:  '<path d="M3.6 16.4 9 11l3.4 3.4L20.4 6.4"/><path d="M15.6 6.4h4.8v4.8"/>',
    recibo:     '<path d="M6 3.4h12v17.2l-3-1.8-3 1.8-3-1.8-3 1.8z"/>' +
                '<path d="M9 8h6M9 11.6h6M9 15.2h3.6"/>',
    hojas:      '<path d="M8.4 3.4h7l4.2 4.2v9.8H8.4z"/><path d="M15.4 3.4v4.2h4.2"/>' +
                '<path d="M15.6 17.4v3.2H4.4V6.8h3.6"/>',
    documento:  '<path d="M13.4 3.4H7a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/>' +
                '<path d="M13.4 3.4V9H19"/><path d="M8.6 13h6.8M8.6 16.4h4.4"/>',
    periodico:  '<path d="M3.4 6.6h13.2v13.8H5.4a2 2 0 0 1-2-2z"/>' +
                '<path d="M16.6 9.6h2.6a1.4 1.4 0 0 1 1.4 1.4v7.4a2 2 0 0 1-2 2"/>' +
                '<path d="M6.4 9.8h7.4M6.4 13.2h7.4M6.4 16.6h4.4"/>',
    etiqueta:   '<path d="M20.6 12.8 12.8 20.6a1.8 1.8 0 0 1-2.6 0L3.4 13.8a1.8 1.8 0 0 1-.5-1.3l.3-8a1.8 1.8 0 0 1 1.7-1.7l8-.3a1.8 1.8 0 0 1 1.3.5l6.8 6.8a1.8 1.8 0 0 1 0 2.6z"/>' +
                '<circle cx="8" cy="8" r="1.6"/>',
    llave:      '<circle cx="8" cy="8.4" r="4.4"/><path d="M11.1 11.5 20 20.4"/>' +
                '<path d="M15.6 16 18 13.6M18 18.4l2.4-2.4"/>',
    salvavidas: '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="3.8"/>' +
                '<path d="M5.4 5.4 9.3 9.3M18.6 5.4 14.7 9.3M5.4 18.6 9.3 14.7M18.6 18.6 14.7 14.7"/>',

    // ---------- gente, tiempo y viaje ----------

    persona:    '<circle cx="12" cy="6.8" r="3.4"/>' +
                '<path d="M5.6 20.4c0-3.6 2.9-6.4 6.4-6.4s6.4 2.8 6.4 6.4"/>',
    personas:   '<circle cx="8.6" cy="7.6" r="3.2"/>' +
                '<path d="M2.8 20c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8"/>' +
                '<path d="M16 5.2a3.2 3.2 0 0 1 0 6"/><path d="M17.4 14.6c2.2.7 3.8 2.8 3.8 5.4"/>',
    luna:       '<path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.6 8.6 0 1 0 10.4 10.4z"/>',
    reloj:      '<circle cx="12" cy="13.2" r="7.4"/><path d="M12 9.4v3.8l2.6 1.8"/>' +
                '<path d="M6.4 4.6 4.2 6.8M17.6 4.6l2.2 2.2"/>',
    calendario: '<rect x="3.4" y="5.6" width="17.2" height="14.4" rx="2.2"/>' +
                '<path d="M3.4 10.4h17.2"/><path d="M8.4 3.6v3.6M15.6 3.6v3.6"/>' +
                '<path d="M7.6 14h2.2M14.2 14h2.2M7.6 17.2h2.2M14.2 17.2h2.2"/>',
    avion:      '<path d="M21 3.4 3.6 11.2l6.2 2.4 2.4 6.2z"/><path d="M21 3.4 9.8 13.6"/>',
    'avion-baja': '<g transform="rotate(30 12 11)">' +
                '<path d="M20.4 4.2 4.6 11.4l5.6 2.2 2.2 5.6z"/><path d="M20.4 4.2 10.2 13.6"/></g>' +
                '<path d="M3 21.2h18"/>',
    moto:       '<circle cx="5.8" cy="16.8" r="3.2"/><circle cx="18.2" cy="16.8" r="3.2"/>' +
                '<path d="M8.8 16.4h6.2l-2.4-7.6H9.4"/><path d="M12.6 8.8h3.4l2.2 7.8"/>',
    auto:       '<path d="M3.2 14.6 5.4 9a2.4 2.4 0 0 1 2.2-1.5h8.8A2.4 2.4 0 0 1 18.6 9l2.2 5.6"/>' +
                '<path d="M2.6 14.6h18.8v3.6H2.6z"/>' +
                '<circle cx="6.8" cy="18.2" r="1.6"/><circle cx="17.2" cy="18.2" r="1.6"/>',
    bus:        '<rect x="3.2" y="3.6" width="17.6" height="12.4" rx="2.2"/>' +
                '<path d="M3.2 9.4h17.6"/><path d="M8.2 12.6h1.6M14.2 12.6h1.6"/>' +
                '<circle cx="7.4" cy="18.4" r="1.9"/><circle cx="16.6" cy="18.4" r="1.9"/>',
    carretera:  '<path d="M7.4 3.4 4.4 20.6M16.6 3.4l3 17.2"/>' +
                '<path d="M12 4.4v3.2M12 10.4v3.2M12 16.4v3.2"/>',
    barrera:    '<path d="M3.2 8.6h17.6v6.8H3.2z"/><path d="M6 15.4V20M18 15.4V20"/>' +
                '<path d="M7.6 8.6 4.2 12M12.2 8.6 8.8 12M16.8 8.6 13.4 12M20.8 9.8 18 12.6"/>',
    celular:    '<rect x="6.6" y="2.6" width="10.8" height="18.8" rx="2.6"/>' +
                '<path d="M10.6 5.6h2.8"/>' +
                '<circle cx="12" cy="18.2" r="1" fill="currentColor" stroke="none"/>',
    'celular-app': '<rect x="3" y="2.6" width="9.6" height="18.8" rx="2.4"/>' +
                '<circle cx="7.8" cy="18.2" r="1" fill="currentColor" stroke="none"/>' +
                '<path d="M14.6 8.8h6.6M18.4 6 21.2 8.8l-2.8 2.8"/>',
    diente:     '<path d="M8.2 3.8c-2.6 0-4.4 2-4.4 4.8 0 2.4.8 3.6 1.4 5.6.5 1.6.4 5.8 2.2 5.8 1.6 0 1.8-3.4 2.6-5 .5-1 1.5-1 2 0 .8 1.6 1 5 2.6 5 1.8 0 1.7-4.2 2.2-5.8.6-2 1.4-3.2 1.4-5.6 0-2.8-1.8-4.8-4.4-4.8-1.6 0-2.4.8-3.8.8s-2.2-.8-3.8-.8z"/>',
    plato:      '<path d="M3.4 11.4h17.2a8.6 8.6 0 0 1-17.2 0z"/>' +
                '<path d="M8 8.2c0-1.4 1.8-1.8 1.8-3.2M12 8.2c0-1.6 1.8-2 1.8-3.6M16 8.2c0-1.4 1.8-1.8 1.8-3.2"/>',
    paquete:    '<path d="M3.4 8.2 12 3.6l8.6 4.6v7.6L12 20.4l-8.6-4.6z"/>' +
                '<path d="M3.4 8.2 12 12.8l8.6-4.6M12 12.8v7.6"/>',
    anzuelo:    '<path d="M16.8 4.6v9.2a5.2 5.2 0 0 1-10.4 0v-1.2"/><path d="M13.8 4.6h6"/>' +
                '<path d="M6.4 12.6 9.2 15.4"/>',

    // ---------- juego ----------

    mando:      '<rect x="2.4" y="8" width="19.2" height="10.4" rx="4.4"/>' +
                '<path d="M7.6 11.4v3.6M5.8 13.2h3.6"/>' +
                '<circle cx="15.9" cy="12.4" r="1.1" fill="currentColor" stroke="none"/>' +
                '<circle cx="18.3" cy="14.8" r="1.1" fill="currentColor" stroke="none"/>',
    bandera:    '<path d="M6 21V3.4"/><path d="M6 4.4h11.6l-2.2 4 2.2 4H6"/>',
    'bandera-meta': '<path d="M5.4 21V3.8"/>' +
                '<path d="M5.4 4.6h6.5v4.2H5.4zM11.9 8.8h6.7V13h-6.7z" fill="currentColor" stroke="none"/>' +
                '<path d="M5.4 4.6h13.2V13H5.4z"/><path d="M5.4 8.8h13.2M11.9 4.6V13"/>',
    confeti:    '<path d="M4.4 20.4 9 8.2l6.8 6.8z"/>' +
                '<path d="M13.4 6.6 15 5M17.6 9.4 19.4 8M16.4 4.4l.6-1.8M20.4 12.2l1.8-.6M19.6 5.6 21 4.2"/>',
    'globo-fiesta': '<path d="M12 14.6c3 0 5.4-2.8 5.4-6.2S15 2.2 12 2.2 6.6 5 6.6 8.4s2.4 6.2 5.4 6.2z"/>' +
                '<path d="M10.8 15.8h2.4l-.6 1.6h-1.2z"/>' +
                '<path d="M12 17.4c0 1.8 2 1.8 2 3.4"/>'
  };

  /* Devuelve el SVG de un icono. `clase` agrega clases al svg, por ejemplo
   * para pintarlo distinto en un sitio concreto. */
  /* El interior del SVG de un nombre: primero los dibujos propios y, si no
   * esta, el respaldo de Lucide. Cadena vacia si no existe en ninguno, que es
   * lo que deja un hueco en vez de romper la vista. */
  function trazo(nombre) {
    if (Object.prototype.hasOwnProperty.call(TRAZOS, nombre)) return TRAZOS[nombre];
    if (typeof LUCIDE_TRAZOS !== 'undefined' &&
        Object.prototype.hasOwnProperty.call(LUCIDE_TRAZOS, nombre)) {
      return LUCIDE_TRAZOS[nombre];
    }
    return '';
  }

  function svg(nombre, clase) {
    var d = trazo(nombre);
    if (!d) return '';
    return '<svg class="ic' + (clase ? ' ' + clase : '') + '" viewBox="0 0 24 24" ' +
           'aria-hidden="true" focusable="false">' + d + '</svg>';
  }

  return {
    svg: svg,
    trazo: trazo,
    // `tiene` responde por los dos juegos: es lo que preguntan las pruebas y
    // los datos cuando quieren saber si un nombre se va a dibujar o no.
    tiene: function (n) { return !!trazo(n); },
    propio: function (n) { return Object.prototype.hasOwnProperty.call(TRAZOS, n); },
    nombres: function () { return Object.keys(TRAZOS); },
    nombresDeRespaldo: function () {
      return typeof LUCIDE_TRAZOS !== 'undefined' ? Object.keys(LUCIDE_TRAZOS) : [];
    },
    TRAZOS: TRAZOS
  };
})();

/* Atajo global, igual que T() para los textos. Ico('casa') devuelve el SVG. */
function Ico(nombre, clase) { return Iconos.svg(nombre, clase); }
