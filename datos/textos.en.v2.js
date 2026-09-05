/* Mi Primer Quetzal — English, versión 2
 *
 * Hipoteca, pensión, orígenes, migración y minijuegos por carrera.
 * Va en archivo aparte para no tocar el diccionario de la versión 1.
 * Se carga después de textos.en.js y le añade entradas.
 */

(function (X) {
  if (typeof X === 'undefined') return;
  var ui = X.ui, datos = X.datos;

  // ---------- pensión ----------
  ui['Plan de pensiones'] = 'Pension plan';
  ui['Acumulado'] = 'Accumulated';
  ui['De eso pusiste tú'] = 'Of that, you put in';
  ui['Lo puso el tiempo'] = 'Time put in the rest';
  ui['Aporte mensual'] = 'Monthly contribution';
  ui['Rendimiento'] = 'Return';
  ui['Aporte mínimo'] = 'Minimum contribution';
  ui['Se retira a los'] = 'Withdrawn at age';
  ui['Abrir plan'] = 'Open a plan';
  ui['Cambiar aporte'] = 'Change contribution';
  ui['Retirar'] = 'Withdraw';
  ui['Retirar antes de tiempo'] = 'Withdraw early';
  ui['Aporte mensual a tu pensión'] = 'Monthly contribution to your pension';
  ui['Nuevo aporte mensual'] = 'New monthly contribution';
  ui['Mínimo {0} al mes.'] = 'Minimum {0} a month.';
  ui['Abriste tu plan de pensiones'] = 'You opened your pension plan';
  ui['Vas a apartar {0} cada mes. Rinde {1}% al año y se retira a los {2}.'] =
    'You will set aside {0} every month. It returns {1}% a year and is withdrawn at {2}.';
  ui['Aportar Q500 al mes desde los 25 hasta los 60 son Q210,000 de tu bolsillo, pero terminan siendo más de Q900,000. La diferencia la pone el tiempo, no tú.'] =
    'Putting in Q500 a month from 25 to 60 is Q210,000 out of your pocket, but it ends up over Q900,000. Time makes the difference, not you.';
  ui['Fíjate en la proporción. Lo que ganaste sin hacer nada ya se acerca a lo que aportaste.'] =
    'Look at the proportion. What you earned doing nothing is closing in on what you contributed.';
  ui['¿Retirar tu pensión?'] = 'Withdraw your pension?';
  ui['Todavía no cumples {0} años. Si retiras ahora pierdes el {1}% de lo que has ganado.'] =
    'You are not {0} yet. Withdrawing now costs you {1}% of what you have earned.';
  ui['Ya puedes retirarla completa.'] = 'You can now withdraw all of it.';
  ui['Retiraste tu pensión'] = 'You withdrew your pension';
  ui['Recibiste {0}. La penalización se quedó con {1}.'] = 'You received {0}. The penalty took {1}.';
  ui['Recibiste {0}.'] = 'You received {0}.';
  ui['Pensión acumulada'] = 'Pension accumulated';
  ui['Aporte a pensión'] = 'Pension contribution';
  ui['Rendimiento de la pensión'] = 'Pension return';

  // ---------- hipoteca ----------
  ui['Casa propia'] = 'Owning a home';
  ui['La decisión financiera más grande de una vida. El banco pide historial, ingreso comprobable y enganche.'] =
    'The biggest financial decision of a lifetime. The bank wants credit history, provable income and a down payment.';
  ui['Precio'] = 'Price';
  ui['Enganche'] = 'Down payment';
  ui['Enganche y gastos'] = 'Down payment and closing costs';
  ui['Gastos de cierre'] = 'Closing costs';
  ui['enganche 5%'] = '5% down';
  ui['Cuota a {0} años'] = 'Payment over {0} years';
  ui['{0} años'] = '{0} years';
  ui['Ver la hipoteca'] = 'See the mortgage';
  ui['Comprar esta casa'] = 'Buy this house';
  ui['El banco te presta'] = 'The bank lends you';
  ui['Vale hoy'] = 'Worth today';
  ui['Debes de hipoteca'] = 'Mortgage balance';
  ui['Es tuyo de verdad'] = 'Actually yours';
  ui['Cuota de hipoteca'] = 'Mortgage payment';
  ui['La casa está pagada. Es completamente tuya.'] = 'The house is paid off. It is entirely yours.';
  ui['Vives en tu propia casa.'] = 'You live in your own house.';
  ui['Vives fuera del país.'] = 'You live outside the country.';
  ui['Llevas {0} cuota(s) de atraso. Con la casa de por medio, esto termina en embargo.'] =
    'You are {0} payment(s) behind. With the house on the line, this ends in foreclosure.';
  ui['Esta vivienda califica al programa de hipotecas aseguradas, que baja el enganche del 20% al 5%. Existe de verdad en Guatemala, para vivienda de interés social.'] =
    'This home qualifies for the insured-mortgage programme, which cuts the down payment from 20% to 5%. It genuinely exists in Guatemala, for affordable housing.';
  ui['A {0} años, por una casa de {1} vas a pagar {2}. Los intereses solos cuestan {3}.'] =
    'Over {0} years, for a {1} house you will pay {2}. The interest alone costs {3}.';
  ui['Compraste tu casa'] = 'You bought your house';
  ui['Pusiste {0} de enganche y el banco te prestó {1}. Tu cuota es {2} por {3} años.'] =
    'You put {0} down and the bank lent you {1}. Your payment is {2} for {3} years.';
  ui['La casa no es tuya el día que te dan las llaves. Es tuya el día que terminas de pagarla. Hasta entonces, dejar de pagar significa perderla y perder lo que ya pusiste.'] =
    'The house is not yours the day you get the keys. It is yours the day you finish paying. Until then, missing payments means losing it and losing everything you put in.';

  // ---------- migración ----------
  ui['Irte del país'] = 'Leaving the country';
  ui['Migrar a Estados Unidos'] = 'Migrate to the United States';
  ui['Irte a Estados Unidos'] = 'Going to the United States';
  ui['Se gana mucho más en dólares y se gasta mucho más. No construyes historial aquí, y cada envío pierde comisión.'] =
    'You earn far more in dollars and spend far more. You build no credit history here, and every transfer loses a fee.';
  ui['Se gana mucho más y se gasta mucho más. Mientras estés fuera no construyes historial de crédito aquí, y cada envío pierde comisión.'] =
    'You earn far more and spend far more. While you are away you build no credit history here, and every transfer loses a fee.';
  ui['Cuesta el viaje'] = 'The trip costs';
  ui['Riesgo de que no salga'] = 'Risk it does not work out';
  ui['Ver qué implica'] = 'See what it involves';
  ui['Costo de vida allá'] = 'Cost of living there';
  ui[' al mes'] = ' a month';
  ui['Si no sale, pierdes lo que pagaste y te quedas aquí. Le pasa a casi uno de cada cinco.'] =
    'If it does not work out, you lose what you paid and you stay here. It happens to nearly one in five.';
  ui['¿En qué vas a trabajar?'] = 'What will you work at?';
  ui['Sueldo'] = 'Pay';
  ui['Este'] = 'This one';
  ui['Te sobra al mes'] = 'Left over each month';
  ui['¿Cuánto mandas a casa?'] = 'How much do you send home?';
  ui['¿Por dónde lo mandas?'] = 'How do you send it?';
  ui['Llega a tu familia'] = 'Reaches your family';
  ui['Se pierde en comisión'] = 'Lost to fees';
  ui['En diez años, solo de comisión'] = 'Over ten years, in fees alone';
  ui['Irme'] = 'Go';
  ui['Te fuiste'] = 'You left';
  ui['Estás en Estados Unidos trabajando. Mandas {0} de lo que te sobra cada mes.'] =
    'You are working in the United States. You send {0} of what is left over each month.';
  ui['Aquí empieza el otro lado de la remesa. Fíjate cuánto llega de verdad a tu familia y cuánto se queda en el camino.'] =
    'This is the other side of the remittance. Watch how much actually reaches your family and how much stays behind.';
  ui['No lograste llegar'] = 'You did not make it';
  ui['Te devolvieron. Perdiste los {0} del viaje y estás de vuelta donde empezaste, con menos.'] =
    'You were turned back. You lost the {0} the trip cost and you are back where you started, with less.';
  ui['Casi uno de cada cinco intentos termina así. Es un riesgo que la gente rara vez pone en la cuenta antes de irse.'] =
    'Nearly one in five attempts ends this way. It is a risk people rarely count before they go.';
  ui['Estás en Estados Unidos.'] = 'You are in the United States.';
  ui['Tiempo fuera'] = 'Time away';
  ui['Tiempo fuera del país'] = 'Time outside the country';
  ui['Ahorro que llevas allá'] = 'Savings you hold there';
  ui['Lo que mandas a casa'] = 'What you send home';
  ui['Mandas'] = 'You send';
  ui['de lo que te sobra'] = 'of what is left over';
  ui['Por'] = 'Via';
  ui['Comisión'] = 'Fee';
  ui['Enviado hasta hoy'] = 'Sent so far';
  ui['Se lo llevaron las comisiones'] = 'Taken by fees';
  ui['Mandar {0}'] = 'Send {0}';
  ui['Regresar a Guatemala'] = 'Go back to Guatemala';
  ui['Volviste a Guatemala'] = 'You came back to Guatemala';
  ui['Estuviste {0} meses fuera y trajiste {1}.'] = 'You were away {0} months and brought back {1}.';
  ui['El dinero volvió contigo. Los años de historial crediticio local, no: tu puntaje se enfrió a la mitad y hay que reconstruirlo.'] =
    'The money came back with you. The years of local credit history did not: your score cooled to half and has to be rebuilt.';
  ui['Cambiaste de canal'] = 'You changed channel';
  ui['Mandar por app cuesta 1% en vez de 4.5%. Sobre cada Q1,000 son Q35 que ya no se pierden.'] =
    'Sending by app costs 1% instead of 4.5%. On every Q1,000 that is Q35 that no longer disappears.';
  ui['Suena a poco. En veinte años de mandar dinero cada mes, esa diferencia es el enganche de una casa.'] =
    'It sounds like nothing. Over twenty years of sending money every month, that difference is a down payment on a house.';
  ui['Mandado a tu familia'] = 'Sent to your family';
  ui['Comisión del envío'] = 'Transfer fee';
  ui['Vivir en Estados Unidos'] = 'Living in the United States';

  // ---------- orígenes ----------
  ui['¿De dónde sales?'] = 'Where are you starting from?';
  ui['No son niveles de dificultad. Son puntos de partida distintos, cada uno con su ventaja y su carga.'] =
    'These are not difficulty levels. They are different starting points, each with its own advantage and its own weight.';
  ui['Empiezas con'] = 'You start with';
  ui['Aportas en casa'] = 'You chip in at home';
  ui['Recibes remesas'] = 'You receive remittances';
  ui['Empezar así'] = 'Start this way';
  ui['Empezar'] = 'Start';
  ui['nada'] = 'nothing';
  ui['no'] = 'no';
  ui['Tienes 18 años, acabas de salir de diversificado y no tienes cuenta bancaria. De aquí a los 65, todo lo decides tú.'] =
    'You are 18, just out of high school, with no bank account. From here to 65, every call is yours.';

  // ---------- lecciones del reporte ----------
  ui['Terminaste de pagar tu casa y vale {0}. Es lo más grande que va a construir la mayoría de la gente, y lo lograste.'] =
    'You finished paying off your house and it is worth {0}. It is the biggest thing most people ever build, and you did it.';
  ui['Tienes casa propia pero todavía debes {0} de hipoteca. La casa es tuya el día que termines de pagarla, no el día que te dan las llaves.'] =
    'You own a home but still owe {0} on the mortgage. The house is yours the day you finish paying, not the day you get the keys.';
  ui['Aportaste {0} a tu pensión y terminaste con {1}. La diferencia no la pusiste tú, la puso el tiempo.'] =
    'You contributed {0} to your pension and ended with {1}. You did not put in the difference. Time did.';
  ui['Las comisiones de tus envíos se llevaron {0} de los {1} que mandaste. Mandar por app en vez de ventanilla cuesta la cuarta parte.'] =
    'Transfer fees took {0} of the {1} you sent. Sending by app instead of at a counter costs a quarter as much.';

  // ---------- casas ----------
  datos.afueras = { nombre: 'House on the outskirts',
    descripcion: 'Far out and plain, but it is yours. Qualifies for the 5% down payment.' };
  datos.intermedia = { nombre: 'House in a middle neighbourhood',
    descripcion: 'Well located with room to spare. The down payment is 20%.' };
  datos.apartamento = { nombre: 'Apartment in the city',
    descripcion: 'Central and comfortable. Also the most expensive to keep.' };

  // ---------- orígenes ----------
  datos.apoyo = { nombre: 'Your family can support you',
    descripcion: 'Your parents have the means. They charge you nothing at home and gave you something to start with. Nobody depends on you.',
    nota: 'You start with a real advantage. What you do with it is on you.' };
  datos.remesas = { nombre: 'Your brother sends money from the States',
    descripcion: 'You live with your family and chip in. Your brother sends money from the United States every two or three months, when he can.',
    nota: 'Income you do not control is no basis for committing to fixed costs.' };
  datos.sosten = { nombre: 'Your family depends on you',
    descripcion: 'You are the one who provides at home. There is no safety net under you, but everyone in your family knows you come through.',
    nota: 'You start with less room. In exchange, finding a co-signer costs you less.' };

  // ---------- empleos en el extranjero ----------
  datos.construccion_us = { nombre: 'Construction',
    descripcion: 'Hard and well paid. No papers, no protection.' };
  datos.restaurante_us = { nombre: 'Restaurant kitchen',
    descripcion: 'Long shifts, steady work.' };
  datos.limpieza_us = { nombre: 'Cleaning',
    descripcion: 'The easiest thing to find when you arrive.' };
  datos.tecnico_us = { nombre: 'Skilled technician',
    descripcion: 'Your qualification counts there. Not everyone can get in here.' };

  // ---------- minijuegos por carrera ----------
  datos.conciliacion = { nombre: 'Bank reconciliation',
    descripcion: 'Match your books against the bank statement.',
    ensena: 'The balance in your app is not the money you actually have available.' };
  datos.obra = { nombre: 'Job estimate',
    descripcion: 'Quote the right amount of material. Neither short nor padded.',
    ensena: 'An estimate with no margin is an estimate that loses money.' };
  datos.inversion = { nombre: 'Investment decision',
    descripcion: 'Two projects, one budget. Pick the one that actually pays.',
    ensena: 'A project is only worth it if it returns more than the money costs.' };

  // ---------- productos y canales ----------
  X.producto_nombre.pension = 'Pension plan';
  X.producto_desc.pension = 'You set a little aside each month for decades. Time does the rest.';
  X.canal_nombre = { ventanilla: 'Counter transfer', app: 'Transfer app' };
  X.varios = {
    leccionEnvio: 'Sending at a counter instead of by app costs about 3.5% of every transfer. ' +
                  'Over twenty years of sending, that difference is a house.'
  };

  // ---------- glosario nuevo ----------
  X.glosario_termino['Usura'] = 'Usury';
  X.glosario_texto['Usura'] =
    'Charging outrageous interest. Guatemalan banking law says rates are freely agreed, and the '+
    'crime of usury punishes charging more than "the maximum rate set by law" — a maximum no law '+
    'actually sets. That is how the neighbourhood lender can charge 25% a month without breaking '+
    'any cap: there is no cap. What the law does require is that every contract state the '+
    'effective annual rate. Look for it before you sign.';
  X.glosario_termino['Hipoteca'] = 'Mortgage';
  X.glosario_termino['Enganche'] = 'Down payment';
  X.glosario_termino['Plan de pensiones'] = 'Pension plan';
  X.glosario_texto['Hipoteca'] =
    'A long-term loan to buy a home, with the house itself as collateral. In Guatemala it runs ' +
    'around 9.42% a year over 20 or 30 years. Stop paying and the bank keeps the house and ' +
    'everything you have paid into it.';
  X.glosario_texto['Enganche'] =
    'The share of the price you put in yourself. Normally 20%. The insured-mortgage programme ' +
    'cuts it to 5% for affordable housing, but then you pay interest on a bigger loan.';
  X.glosario_texto['Plan de pensiones'] =
    'You set an amount aside every month for decades and the return compounds on itself. What ' +
    'makes it work is not how much you put in, it is how many years you leave it alone.';

  // ---------- tasa nominal vs efectiva en la lista de prestamos ----------
  ui['Intereses pagados'] = 'Interest paid';
  ui['Tasa nominal'] = 'Nominal rate';
  ui['Tasa efectiva'] = 'Effective rate';

})(typeof TEXTOS_EN !== 'undefined' ? TEXTOS_EN : undefined);
