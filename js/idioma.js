/* Mi Primer Quetzal — idioma
 *
 * Español e inglés. El contexto sigue siendo Guatemala y la moneda sigue
 * siendo el Quetzal: la version en ingles es traduccion, no localizacion.
 *
 * La clave de cada texto ES EL TEXTO EN ESPAÑOL. Asi el juego funciona
 * completo aunque falte una traduccion, y agregar un idioma es escribir un
 * diccionario nuevo sin tocar una linea de codigo.
 *
 *   T('Banco')                        -> 'Bank'
 *   T('Trabajas {0} de 4 semanas', 3) -> 'You work 3 of 4 weeks'
 *   D(trabajo, 'nombre')              -> el nombre del empleo en el idioma activo
 */

var Idioma = (function () {

  var CLAVE = 'miPrimerQuetzal.idioma';
  var actual = 'es';

  function detectar() {
    try {
      var guardado = localStorage.getItem(CLAVE);
      if (guardado === 'es' || guardado === 'en') return guardado;
    } catch (e) {}
    try {
      var nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
      return nav.indexOf('en') === 0 ? 'en' : 'es';
    } catch (e) {}
    return 'es';
  }

  actual = detectar();

  function poner(cod) {
    actual = (cod === 'en') ? 'en' : 'es';
    try { localStorage.setItem(CLAVE, actual); } catch (e) {}
    try { document.documentElement.lang = actual; } catch (e) {}
    return actual;
  }

  function diccionario() {
    return (actual === 'en' && typeof TEXTOS_EN !== 'undefined') ? TEXTOS_EN : null;
  }

  /* Traduce una frase. Los {0}, {1}... se reemplazan por los argumentos. */
  function T(frase) {
    var dic = diccionario();
    var salida = (dic && dic.ui && dic.ui[frase]) ? dic.ui[frase] : frase;
    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      salida = salida.replace(/\{(\d+)\}/g, function (todo, i) {
        return args[i] !== undefined ? args[i] : todo;
      });
    }
    return salida;
  }

  /* Traduce un campo de un objeto de datos que tenga id (trabajos, carreras...) */
  function D(obj, campo) {
    if (!obj) return '';
    var dic = diccionario();
    if (dic && dic.datos && obj.id && dic.datos[obj.id] && dic.datos[obj.id][campo] !== undefined) {
      return dic.datos[obj.id][campo];
    }
    return obj[campo] !== undefined ? obj[campo] : '';
  }

  /* Traduce una entrada suelta por clave explícita (glosario, niveles, viviendas) */
  function K(grupo, clave, respaldo) {
    var dic = diccionario();
    if (dic && dic[grupo] && dic[grupo][clave] !== undefined) return dic[grupo][clave];
    return respaldo !== undefined ? respaldo : clave;
  }

  return {
    actual: function () { return actual; },
    poner: poner,
    alternar: function () { return poner(actual === 'es' ? 'en' : 'es'); },
    T: T, D: D, K: K
  };
})();

// Atajos globales para no escribir Idioma.T por todos lados
function T() { return Idioma.T.apply(null, arguments); }
function D(o, c) { return Idioma.D(o, c); }
function K(g, c, r) { return Idioma.K(g, c, r); }
