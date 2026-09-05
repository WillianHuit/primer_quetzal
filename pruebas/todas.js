/* Corre las cinco pruebas y resume. Uso: node pruebas/todas.js */

const { execFileSync } = require('child_process');
const path = require('path');

const SUITES = [
  ['balanceo.js',           'Balanceo a 24 meses'],
  ['vidas-completas.js',    'Vidas completas hasta los 65'],
  ['ciclo-credito.js',      'Ciclo de crédito'],
  ['largo-plazo.js',        'Hipoteca, pensión, orígenes y migración'],
  ['interfaz-bilingue.js',  'Interfaz en español e inglés'],
  ['dom-real.js',           'Interacción real en el navegador']
];

let fallos = 0;
console.log('');

SUITES.forEach(function (s) {
  const archivo = path.join(__dirname, s[0]);
  let salida = '', codigo = 0;
  try {
    salida = execFileSync(process.execPath, [archivo], { encoding: 'utf8' });
  } catch (err) {
    salida = (err.stdout || '') + (err.stderr || '');
    codigo = err.status || 1;
  }
  const resumen = (salida.match(/^\d+ de \d+ comprobaciones pasaron\.$/m) || [])[0];
  const errores = (salida.match(/^ {2}FALLA .*$/gm) || []);
  const saltada = /jsdom no está instalado/.test(salida);
  const roto = /Error|Cannot|undefined is not/.test(salida) && !resumen && !saltada;

  const estado = saltada ? '·····' : ((errores.length || codigo || roto) ? 'FALLA' : 'OK   ');
  const detalle = saltada ? 'saltada, falta npm install'
                          : (resumen || (roto ? 'se rompió' : 'sin errores'));
  console.log(`  ${estado}  ${s[1].padEnd(42)} ${detalle}`);
  if (saltada) return;
  errores.slice(0, 4).forEach(e => console.log('           ' + e.trim()));
  if (roto) console.log(salida.split('\n').filter(l => /Error|at /.test(l)).slice(0, 3)
                              .map(l => '           ' + l.trim()).join('\n'));
  if (errores.length || codigo || roto) fallos++;
});

console.log('');
if (fallos) { console.log(`${fallos} de ${SUITES.length} suites con problemas.`); process.exitCode = 1; }
else console.log(`Las ${SUITES.length} suites pasan.`);
