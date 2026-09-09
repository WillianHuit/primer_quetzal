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
  ui['Empiezas con'] = 'You start with';
  ui['Empezar así'] = 'Start this way';
  ui['Empezar'] = 'Start';
  ui['nada'] = 'nothing';
  ui['no'] = 'no';

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
  // ---------- la ruta que se va abriendo ----------
  // Los textos de los peldaños viven en datos/progreso.js y se traducen por
  // clave, igual que los nombres de los productos. Si falta uno, el juego lo
  // muestra en español en vez de romperse.
  ui['Paso {0} de {1}'] = 'Step {0} of {1}';
  ui['Llévame ahí'] = 'Take me there';
  ui['Ya sé jugar'] = 'I know how to play';
  ui['Se abrió algo nuevo'] = 'Something new opened up';
  ui['Lo que sigue'] = 'What comes next';
  ui['Tu ruta'] = 'Your path';

  X.progreso_pista = {
    verTrabajo: 'No job means no money coming in. Tap the Work tab, down here.',
    empleo: 'Pick an opening and take it. Formal pays you less in hand, but it brings Bono 14, a Christmas bonus and insurance; informal gives you 10% more and none of that.',
    verMes: 'You have a job now. Go back to the Month tab to decide how you spend the four weeks.',
    ponerTrabajo: 'The activities opened up. Tap Work to spend that week working.',
    verBanco: 'Before you close the month, go into the Bank.',
    cuenta: 'Open your checking account. That is where the pay lands and where the spending comes out of.',
    primerMes: 'That is it. Close the month and look at the summary: a bar will show you where every quetzal went.',
    credito: 'Keep closing months with a job. By the third the bank can start seeing you as a customer.',
    plazo: 'Build up something in your savings account. At half the term deposit minimum I will show it to you.',
    tarjeta: 'Build credit history. Paying a loan on time is what raises your score, and a score is what brings the card.'
  };

  X.progreso_titulo = {
    empleo: 'The bank opened up',
    cuenta: 'The savings account opened up',
    primerMes: 'Side gigs opened up',
    credito: 'Credit opened up',
    plazo: 'The term deposit opened up',
    tarjeta: 'The credit card opened up',
    migrar: 'Leaving the country opened up',
    pension: 'The pension plan opened up',
    casa: 'Owning a home opened up'
  };

  X.progreso_texto = {
    empleo: 'Money now has somewhere to come from. What you still need is somewhere for it to land: a checking account.',
    cuenta: 'With two accounts you can keep what you spend apart from what you keep, and move money between them.',
    primerMes: 'One week of the month can go to a side gig. They pay little, and several of them teach you something that saves you money later.',
    credito: 'Both doors show up at once: the bank loan and the street lender.',
    plazo: 'You leave an amount untouched for an agreed term and it returns quite a bit more than plain savings.',
    tarjeta: 'Your credit history is now enough for the bank to give you a card.',
    migrar: 'At your age you can now attempt the trip to the United States.',
    pension: 'A small monthly contribution that is not touched until retirement.',
    casa: 'Your credit history now reaches the minimum the bank asks for before granting a mortgage.'
  };

  X.progreso_leccion = {
    empleo: 'In cash your money shrinks on its own, it leaks into things you do not remember. An account does not make you rich, but it stops making you poor without noticing.',
    cuenta: 'Saving in the same account you spend from is not saving. The savings account pays more and, above all, puts a step between your impulse and your money.',
    primerMes: 'Compare before you accept: a week of side work rarely pays what a week of your job pays. Time has a price too.',
    credito: 'Look at them side by side before you touch either. The bank asks for history and charges you per year what the street lender charges per month. That is the whole difference, and it is enormous.',
    plazo: 'What makes it pay is exactly what makes it inconvenient: you cannot touch it. Take it out early and you lose what it earned. Only money you truly will not need goes there.',
    tarjeta: 'The card is not your money, it is very expensive borrowed money with a month of grace. Paid in full it is free and builds history; paying the minimum it is the most expensive debt you will ever carry.',
    migrar: 'You earn far more in dollars and you spend far more in dollars. You build no credit history here, every transfer loses a fee, and the trip is paid for before you leave.',
    pension: 'It is the only product in the game where arriving early is worth more than putting in a lot. What separates a decent pension from a pittance is not the size of the contribution, it is the years it spent working.',
    casa: 'The house is yours the day you finish paying for it, not the day they hand you the keys. Until then you live in the bank house and pay for the privilege.'
  };

  // ---------- portada que explica el juego ----------
  ui['Un simulador para aprender a usar el banco sin arriesgar dinero de verdad.'] =
    'A simulator for learning to use a bank without risking real money.';
  ui['Usas productos bancarios de verdad'] = 'You use real banking products';
  ui['Cuenta monetaria, ahorro, plazo fijo, préstamo, tarjeta, hipoteca y pensión. Con las tasas que se cobran en Guatemala.'] =
    'Checking, savings, fixed-term deposit, loan, credit card, mortgage and pension. At the rates actually charged in Guatemala.';
  ui['Llegas a los 65 y ves el resultado'] = 'You reach 65 and see how it went';
  ui['Una gráfica de toda tu vida y el recuento de lo que cada decisión te costó o te dio.'] =
    'A chart of your whole life and a tally of what each decision cost you or earned you.';
  ui['Banco Cardamomo es un banco inventado. Los precios, sueldos y tasas son de Guatemala y están documentados.'] =
    'Banco Cardamomo is a made-up bank. The prices, wages and rates are Guatemalan and every one of them is sourced.';

  // ---------- apartados de trabajo y pestaña de noticias ----------
  ui['Mi empleo'] = 'My job';
  ui['Ofertas'] = 'Openings';
  ui['Irme del país'] = 'Leaving the country';
  ui['En informal ganas más en la mano cada mes, pero sin Bono 14, sin aguinaldo, sin seguro y sin forma de comprobar ingresos cuando pidas un crédito.'] =
    'Informal pays you more in hand every month, but with no Bono 14, no Christmas bonus, no insurance and no way to prove income when you apply for credit.';
  ui['Noticias'] = 'News';
  ui['Promociones vigentes'] = 'Offers in effect';
  ui['Le quedan'] = 'Time left';
  ui['Lo que ha pasado'] = 'What has happened';
  ui['Todavía no ha pasado nada digno de contarse. Los imprevistos y las promociones van a aparecer aquí.'] =
    'Nothing worth reporting yet. Surprises and bank offers will show up here.';

  // ---------- graficos y resumen visual del mes ----------
  ui['Entró'] = 'In';
  ui['Salió'] = 'Out';
  ui['Te quedó'] = 'Left over';
  ui['Te faltó'] = 'Short by';
  ui['Transporte'] = 'Transport';
  ui['Deudas e intereses'] = 'Debt and interest';
  ui['Impuestos y aportes'] = 'Taxes and contributions';
  ui['máximo {0}'] = 'peak {0}';
  ui['Tu patrimonio a lo largo de la vida'] = 'Your net worth over your lifetime';

  ui['Intereses pagados'] = 'Interest paid';
  ui['Tasa nominal'] = 'Nominal rate';
  ui['Tasa efectiva'] = 'Effective rate';


  /* ==========================================================
   * Version 3: la ninez, las jornadas, el personaje y las
   * tarjetas de decision.
   * ========================================================== */

  // ---------- la escalera educativa nueva ----------
  datos.basicos = { nombre: 'Middle school',
    descripcion: 'Three years. Without middle school almost no job will look at you.' };
  datos.bachillerato = { nombre: 'High school diploma',
    descripcion: 'Two years. The shortest one, and the one everybody asks for.' };
  datos.perito = { nombre: 'Accounting diploma',
    descripcion: 'Three years. One more than high school, and you come out with a trade.' };

  // ---------- los trabajitos de nino ----------
  datos.limonada = { nombre: 'Selling lemonade',
    descripcion: 'A jug, some ice and a table on the sidewalk.' };
  datos.periodicos = { nombre: 'Selling newspapers',
    descripcion: 'Early on the corner. Pays very little and pays every day.' };
  datos.dulces = { nombre: 'Selling candy',
    descripcion: 'On the bus or at school. One day you sell out, the next you sell nothing.' };

  // ---------- pantallas nuevas ----------
  ui['Yo'] = 'Me';
  ui['Entra'] = 'In';
  ui['Sale'] = 'Out';
  ui['Queda'] = 'Left';
  ui['Ahora'] = 'Now';
  ui['Mesada'] = 'Allowance';
  ui['En la mano'] = 'In hand';
  ui['Monetaria'] = 'Checking';
  ui['Ahorro'] = 'Savings';
  ui['Plazo fijo'] = 'Term deposit';
  ui['Tus gastos'] = 'What you spend';
  ui['Antes gastabas'] = 'You used to spend';
  ui['sin trabajo'] = 'no job';
  ui['menor de edad'] = 'under 18';
  ui['Ver a dónde se va'] = 'See where it goes';
  ui['Ocultar el detalle'] = 'Hide the detail';
  ui['¿Por qué?'] = 'Why?';
  ui['Sí, hazlo'] = 'Yes, do it';
  ui['Mejor no'] = 'Never mind';
  ui['Tienes que decidir'] = 'You have to decide';

  // ---------- las jornadas del mes ----------
  ui['Sem {0}'] = 'Wk {0}';
  ui['Mañana'] = 'Morning';
  ui['Tarde'] = 'Afternoon';
  ui['mañana'] = 'morning';
  ui['tarde'] = 'afternoon';
  ui['Mañana o tarde'] = 'Morning or afternoon';
  ui['Toma tus mañanas'] = 'Takes your mornings';
  ui['Jornada de la mañana'] = 'Morning shift';
  ui['Jornada de la tarde'] = 'Afternoon shift';
  ui['Horario libre'] = 'Free schedule';
  ui['Esa jornada es del colegio. Mientras estés inscrito no se puede vaciar.'] =
    'That half-day belongs to school. While you are enrolled it cannot be cleared.';
  ui['El colegio te toma esa jornada de las cuatro semanas y no se puede vaciar. La otra jornada es tuya.'] =
    'School takes that half-day of all four weeks and it cannot be cleared. The other half-day is yours.';
  ui['Cada jornada que le dedicas avanza un cuarto de mes de carrera. Cuatro al mes es el ritmo normal.'] =
    'Each half-day you give it advances a quarter of a month of the program. Four a month is the normal pace.';
  ui['Trabajas {0} de {1} jornadas: cobras el {2} del sueldo.'] =
    'You work {0} of {1} half-days: you collect {2} of the pay.';
  ui['Reparte al menos una jornada antes de cerrar.'] = 'Assign at least one half-day before closing.';
  ui['Todavía no tienes trabajo. Búscalo en la pestaña Trabajo.'] =
    'You have no job yet. Look for one under Work.';

  // ---------- la decision de estudiar ----------
  ui['Saliste de primaria. ¿Y ahora?'] = 'You finished primary school. Now what?';
  ui['Te graduaste. ¿Sigues estudiando?'] = 'You graduated. Keep studying?';
  ui['No, a trabajar'] = 'No, go to work';
  ui['A trabajar'] = 'Go to work';
  ui['Dejar de estudiar'] = 'Drop out';
  ui['¿Dejar de estudiar?'] = 'Drop out of school?';
  ui['Pierdes lo que llevas avanzado. Si vuelves después, empiezas de cero.'] =
    'You lose everything you have advanced. If you come back later, you start from zero.';
  ui['Puedes cambiar de opinión después. Esta pantalla no se cierra nunca.'] =
    'You can change your mind later. This screen never closes.';
  ui['Te vas a trabajar'] = 'You are going to work';
  ui['Nadie te va a obligar. La pestaña de Estudio se queda ahí y puedes inscribirte cuando quieras.'] =
    'Nobody is going to force you. The Study tab stays there and you can enroll whenever you want.';
  ui['Seis de cada diez chicos guatemaltecos no terminan básicos. La mayoría no lo decidió en una pantalla: se le fue haciendo tarde.'] =
    'Six out of ten Guatemalan kids do not finish middle school. Most of them never decided it on a screen: it just got late.';
  ui['Ya llegaste hasta donde llega la escalera.'] = 'You have climbed as high as the ladder goes.';
  ui['Ya llegaste hasta donde llega la escalera. Nada más que estudiar.'] =
    'You have climbed as high as the ladder goes. Nothing left to study.';
  ui['Qué se gana con cada nivel'] = 'What each level is worth';
  ui['En Guatemala un trabajador sin básicos gana alrededor de Q2,400 al mes. Con diversificado, Q3,800. Con licenciatura, Q4,300, que es apenas 13% más. Con maestría, Q10,000.'] =
    'In Guatemala a worker without middle school earns about Q2,400 a month. With high school, Q3,800. With a bachelor’s, Q4,300 — barely 13% more. With a master’s, Q10,000.';
  ui['O sea que los saltos grandes están al principio y al final de la escalera, no en el medio.'] =
    'Which means the big jumps are at the bottom and at the top of the ladder, not in the middle.';
  ui['Faltan {0} meses'] = '{0} months to go';
  ui['Pública: gratis'] = 'Public: free';
  ui['Privada: {0}'] = 'Private: {0}';
  ui[' al mes'] = ' a month';
  ui['El costo real de estudiar en Guatemala no es la colegiatura: la pública es gratis. Es el sueldo que dejas de ganar mientras estudias.'] =
    'The real cost of studying in Guatemala is not tuition — public school is free. It is the pay you give up while you study.';
  ui['Empiezas {0}. Cada jornada que le dediques avanza un cuarto de mes de carrera, y esa jornada no la estás trabajando.'] =
    'You are starting {0}. Each half-day you give it advances a quarter of a month, and that half-day is not being worked.';
  ui['Empiezas {0}. El colegio te toma la jornada de la {1} de las cuatro semanas; la otra es tuya para trabajar.'] =
    'You are starting {0}. School takes your {1} half-day of all four weeks; the other one is yours to work.';

  // ---------- el trabajo ----------
  ui['Todavía no trabajas. Mira las Ofertas.'] = 'You are not working yet. Check the Offers.';
  ui['al mes, mes completo'] = 'a month, full month';
  ui['{0} meses aquí'] = '{0} months here';
  ui['Mercado: {0}'] = 'Market: {0}';
  ui['+{0} por jornada'] = '+{0} per half-day';
  ui['{0} por jornada'] = '{0} per half-day';
  ui['{0} al mes'] = '{0} a month';
  ui['capital {0}'] = '{0} capital';
  ui['hasta {0}'] = 'up to {0}';
  ui['a los {0}'] = 'at {0}';
  ui['Qué te falta por ser informal'] = 'What being off the books costs you';

  // ---------- el banco partido en apartados ----------
  ui['Cuentas'] = 'Accounts';
  ui['Crédito'] = 'Credit';
  ui['Vivienda'] = 'Housing';
  ui['Siendo menor de edad la abres con un adulto, y con menos dinero.'] =
    'As a minor you open it with an adult, and with much less money.';

  // ---------- cumplir la mayoria de edad ----------
  ui['Cumpliste {0}'] = 'You turned {0}';
  ui['Ya eres mayor de edad. Desde este mes te toca tu parte del gasto de la casa, puedes firmar un contrato formal y el banco te puede prestar.'] =
    'You are an adult now. From this month your share of the household costs is yours, you can sign a formal contract, and the bank can lend to you.';
  ui['Ese salto le pasa a todo el mundo y a casi nadie le avisan. El que llega a los 18 con algo guardado aguanta el golpe; el que llega en cero, empieza pidiendo prestado.'] =
    'That jump happens to everyone and almost nobody gets warned. Whoever turns 18 with something saved absorbs the hit; whoever turns 18 with nothing starts out borrowing.';

  // ---------- la portada ----------
  ui['De los 13 a la jubilación'] = 'From 13 to retirement';
  ui['Cada mes tienes ocho jornadas: cuatro semanas de mañana y tarde. Decides en qué usas cada una. Al terminar el mes cobras, pagas tus gastos y el juego avanza; después de los 22 los turnos se vuelven trimestres y luego años, para que puedas llegar hasta la jubilación.'] =
    'Every month you have eight half-days: four weeks of mornings and afternoons. You decide what each one is for. When the month ends you get paid, your expenses come out and the game moves on; after 22 the turns become quarters and then years, so you can reach retirement.';
  ui['Tienes 13 años y todavía no puedes trabajar de verdad. Lo primero que hay que decidir no es dónde trabajar, es si vas a estudiar.'] =
    'You are 13 and you cannot really work yet. The first thing to decide is not where to work, it is whether you are going to study.';
  ui['Empiezas con 13 años, saliendo de primaria'] = 'You start at 13, out of primary school';
  ui['Lo primero que decides es si vas a seguir estudiando. Eliges de qué familia sales y en qué Guatemala te toca vivir.'] =
    'The first thing you decide is whether you keep studying. You choose which family you come from and which Guatemala you live in.';
  ui['Cada mes reparte ocho jornadas'] = 'Every month you split eight half-days';
  ui['Cuatro semanas de mañana y tarde. El colegio te toma una jornada; la otra la decides tú: trabajar, descansar o buscarte algo extra.'] =
    'Four weeks of mornings and afternoons. School takes one half-day; the other one is yours: work, rest or find a side gig.';

  // ---------- tarjetas de decision ----------
  datos.feria = { titulo: 'The fair came to town',
    texto: 'All your friends are going. Admission and the rides are Q60, almost everything you have saved.',
    leccion: 'Spending is not wrong. What is wrong is spending without knowing how much you had saved or what it was for.' };
  datos.bicicleta = { titulo: 'A used bicycle',
    texto: 'A neighbour is selling his bike for Q250. With it you would deliver twice as much in the same time.',
    leccion: 'Some purchases pay for themselves. A tool that makes you more productive is not an expense — it is the only thing that really raises what you earn per hour.' };
  datos.rifa = { titulo: 'A raffle that never fails',
    texto: 'An acquaintance is selling Q50 tickets for a phone raffle. He swears almost nobody bought and that you are going to win.',
    leccion: 'Nobody who guarantees you a win is telling you the truth. If it were certain, they would not be offering it to you.' };
  datos.tareas = { titulo: 'Someone pays you to do their homework',
    texto: 'A classmate offers you Q40 to do his homework for the month.',
    leccion: 'Your word is an asset. It is what they will ask your neighbours about the day you need a co-signer, and it does not cost Q40.' };
  datos.zapatos = { titulo: 'Your little brother outgrew his shoes',
    texto: 'There is no money at home this month. You have Q150 saved.',
    leccion: 'Helping at home is not a financial mistake. The mistake is doing it without knowing what you have left, because then the month it is your turn there will be nothing.' };
  datos.celularusado = { titulo: 'A second-hand phone',
    texto: 'Q400 for a used phone. Without one nobody tells you when there is work.',
    leccion: 'Before buying something big, ask whether it will make you money or just help you spend it faster. Both feel the same the day you buy it.' };
  datos.graduacion = { titulo: 'The graduation party',
    texto: 'The class fee is Q700: ring, dinner and photos.',
    leccion: 'A single night can cost what three months of saving cost. Paying for it is not wrong; paying for it without ever seeing that number is.' };
  datos.negociodeamigo = { titulo: 'A friend asks you for a loan',
    texto: 'He wants Q1,200 to start a business. He says he will pay you back in three months. Nothing in writing.',
    leccion: 'Lending to a friend with nothing in writing is giving the money away with the illusion that it comes back. If you are going to do it, do it for an amount you could afford to lose.' };
  datos.curso = { titulo: 'An English course',
    texto: 'Six months of classes for Q900. With English the best pay you can get without a degree opens up.',
    leccion: 'A bilingual call centre pays Q4,500 with no university needed. That is the best return per quetzal invested that the country offers.' };
  datos.horasdomingo = { titulo: 'They offer you Sundays',
    texto: 'Four Sundays of work, paid separately. It is a month with no rest.',
    leccion: 'Exhaustion charges interest: in this game, getting sick costs more than the overtime that made you sick.' };
  datos.motoencuotas = { titulo: 'A motorbike on instalments',
    texto: 'Q650 a month for three years, no down payment. With a bike you deliver more and you arrive on time.',
    leccion: 'A small payment for a long time is a big price. Q650 for 36 months is Q23,400 for a bike that costs Q14,000 in cash.' };
  datos.aguinaldocompleto = { titulo: 'Your Christmas bonus just landed',
    texto: 'It is money you were not planning to spend. It is sitting in your account, all of it.',
    leccion: 'The Christmas bonus and the Bono 14 are the only two months of the year when a Guatemalan wage earner has money left over. What gets decided those two months is almost all the wealth of a lifetime.' };

  var op = X.opciones;
  op['feria:0'] = 'Go to the fair';            op['feria:1'] = 'Stay home';
  op['bicicleta:0'] = 'Buy it';                op['bicicleta:1'] = 'Cannot afford it';
  op['rifa:0'] = 'Buy a ticket';               op['rifa:1'] = 'No, thanks';
  op['tareas:0'] = 'Take the money';           op['tareas:1'] = 'Better not';
  op['zapatos:0'] = 'I will buy them';         op['zapatos:1'] = 'I cannot';
  op['celularusado:0'] = 'Buy it';             op['celularusado:1'] = 'Wait';
  op['graduacion:0'] = 'Pay the full fee';     op['graduacion:1'] = 'Just the dinner';
  op['graduacion:2'] = 'Skip it';
  op['negociodeamigo:0'] = 'Lend it to him';   op['negociodeamigo:1'] = 'Lend him half';
  op['negociodeamigo:2'] = 'I do not have it';
  op['curso:0'] = 'Sign up';                   op['curso:1'] = 'Too expensive';
  op['horasdomingo:0'] = 'I will take them';   op['horasdomingo:1'] = 'I need to rest';
  op['motoencuotas:0'] = 'Sign';               op['motoencuotas:1'] = 'Save up and buy it';
  op['aguinaldocompleto:0'] = 'Into savings';  op['aguinaldocompleto:1'] = 'Buy myself something';

  // ---------- los peldanos nuevos de la ruta ----------
  var pp = X.progreso_pista, pt = X.progreso_titulo,
      px = X.progreso_texto, pl = X.progreso_leccion;

  pp.verEstudio = 'You are 13 and you just finished primary school. Tap Study: there is something to decide.';
  pp.decidirEstudio = 'Three ways out, and all three cost you something: public middle school, private, or go to work. You choose.';

  /* La primera tarea, que es la que abre el trabajo. */
  pp.primeraTarea = 'Put a half-day into homework: tap a free slot and pick Homework. Homework does not pay, it gives experience.';
  pt.primeraTarea = 'You did your first homework';
  px.primeraTarea = 'That half-day did not earn you a single quetzal, and it was still the best paid of the month: experience is what will get you into the courses that ask for more.';
  pl.primeraTarea = 'Money gets spent; what you learned does not. It is the one thing in this game that, once you have it, is yours.';

  /* El trabajo llega despues: los primeros cuatro turnos son solo colegio. */
  pp.primerTrabajo = 'These months are yours: spread them out however you like and close them when you are ready. Work arrives in a few months.';
  pt.primerTrabajo = 'Work is open';
  px.primerTrabajo = 'You have been in class a few months and can now look for something for the afternoons. At your age there are no wages: there are three odd jobs on your own, no contract and no boss.';
  pl.primerTrabajo = 'Every half-day you give to work is one you do not give to homework. Nobody will tell you which is better, because it depends on where you want to end up.';

  /* Y el imperio, cuando ya hay con que. */
  pt.imperio = 'Your Empire is open';
  px.imperio = 'You have enough to open something of your own. Start small: a candy stand costs Q450. And Extra has odd jobs that pay on the side.';
  pl.imperio = 'A business is measured with two numbers, not one: what it sells and what is left after paying for the goods and the rent. A business that sells twice as much as another can earn half. That second number is the only one that matters.';
  px.primeraTarea = 'That half-day did not earn you a single quetzal, and it was still the best paid of the month: experience is what will get you into the courses that ask for more.';
  pt.decidirEstudio = 'Work is open';
  px.decidirEstudio = 'You decided what to do with your mornings. What you do with your afternoons is what will pay for everything else.';
  pl.decidirEstudio = 'Studying is not free: it is paid for with the hours you could be earning. And not studying is not free either: in Guatemala a worker without middle school earns half of what one with high school earns, for life.';
  pp.verTrabajo = 'Now tap Work. At 13 there are no salaries, but there are odd jobs.';
  pp.empleo = 'All three are yours to pick from. They pay a few quetzales per half-day: that is what exists at your age.';
  px.empleo = 'Money is coming in now, even if it is very little. What you are missing is somewhere for it to land.';
  pp.verMes = 'Go back to the Month tab. That is where you split your time, which is the only thing you really have.';
  pp.tocarJornada = 'Every week has a morning and an afternoon. Tap a free slot.';
  pp.ponerTrabajo = 'The activities opened up. Tap Work to spend that half-day working.';
  pp.jornadas = 'Fill in the slots that are left. Working everything pays more, but it leaves you with no energy, and getting sick costs more than one half-day.';
  pt.jornadas = 'You split up the month';
  px.jornadas = 'That is the whole game: eight half-days, and they are never enough for everything you would like to do.';
  pl.jornadas = 'School takes one half-day of each week and that one is not for sale. What you actually decide is the other one: work, rest, or find yourself something extra.';
  pp.primerMes = 'Close the month and look at the summary: it shows you in one bar where every quetzal went.';
  pl.primerMes = 'Compare before you accept: one half-day of a side gig rarely pays what one half-day of your job pays. Time has a price too.';
  px.primerMes = 'One half-day of the month can be spent on a side gig. They pay little, and several of them teach you something that saves you money later.';
  pp.verBanco = 'Go into the Bank. With the little you have you can already open an account.';
  pp.cuenta = 'Open your checking account. As a minor you open it with an adult and with very little money.';
  pp.noticias = 'Close another month. With two months of running you will start to see what you can and cannot afford.';
  pt.noticias = 'The news opened up';
  px.noticias = 'The job market, the promotions the bank has running, and everything that has happened to you, month by month.';
  pl.noticias = 'The job market tells you what the country is asking for NOW. Looking at it before you choose a program is the difference between studying five years for something saturated and two for something nobody can find.';
  pp.credito = 'At 18 the bank can start looking at you as a customer. With a job, better still.';

  // El banco ya no llega por tutorial, llega cuando duele no tenerlo
  pp.banco = 'Look at how much leaks out of your cash every month in the summary. When that starts to hurt, a bank account will make sense.';
  pt.banco = 'The bank opened up';
  px.banco = 'You can open a savings account. As a minor you open it with an adult and with very little money, and it charges no maintenance fee.';
  pl.banco = 'Look at the "small leaks" line in your summaries: that is your money walking off without you deciding it. An account does not make you rich; it stops making you poor without you noticing.';
  pp.monetaria = 'With a formal job your employer is going to ask you for a checking account to pay you into.';
  pt.monetaria = 'The checking account opened up';
  px.monetaria = 'This is the account you operate with: a company deposits your pay here, and your spending comes out of here. With two accounts you can keep what you spend apart from what you keep.';
  pl.monetaria = 'Watch the maintenance fee. If a company deposits your salary, the bank waives it; if not, it is Q12 a month just for having the account open. A product you do not need is not free.';


  /* ==========================================================
   * Version 3.1: los niveles de dificultad, el manejo de cuenta
   * y las ofertas con dibujo.
   * ========================================================== */

  // ---------- la pantalla de inicio ----------
  ui['¿Qué tan duro lo quieres?'] = 'How hard do you want it?';
  ui['No cambia las reglas. Cambia con qué familia te toca empezar.'] =
    'It does not change the rules. It changes which family you start with.';
  ui['Prefiero elegir yo'] = 'I would rather choose myself';
  ui['Hay trabajo formal'] = 'Formal work exists';
  ui['Solo trabajo informal'] = 'Only informal work';
  ui['{0} de mesada'] = '{0} allowance';
  ui['sin mesada'] = 'no allowance';
  ui['empiezas con {0}'] = 'start with {0}';
  ui['de grande aportas {0}'] = 'as an adult you chip in {0}';
  ui['no aportas en casa'] = 'you chip in nothing at home';

  X.nivel_resumen = {
    facil: 'Your parents have enough. They give you an allowance and nobody depends on you.',
    medio: 'Your brother sends money from the United States when he can. As an adult you chip in at home.',
    dificil: 'There is nothing to spare at home and work with a contract does not exist. You are going to be the provider.'
  };
  ui['Fácil'] = 'Easy';
  ui['Medio'] = 'Medium';
  ui['Difícil'] = 'Hard';

  // ---------- el manejo de cuenta ----------
  ui['Manejo de cuenta'] = 'Account maintenance fee';
  ui['Qué es el manejo de cuenta'] = 'What the maintenance fee is';
  ui['manejo {0} al mes'] = '{0} a month fee';
  ui['sin manejo de cuenta'] = 'no maintenance fee';
  ui['{0}% al año'] = '{0}% a year';
  ui['abres con {0}'] = 'open it with {0}';
  ui['El manejo de cuenta se te cobra cada mes solo por tenerla abierta. Va de Q10 a Q15 según el banco.'] =
    'The maintenance fee is charged every month just for having the account open. It runs from Q10 to Q15 depending on the bank.';
  ui['Si tu sueldo lo deposita una empresa no te lo cobran, porque al banco le interesa tener tu planilla. El que lo paga es justo el que abrió la cuenta sin necesitarla.'] =
    'If a company deposits your salary they waive it, because the bank wants your payroll. The one who pays it is precisely the one who opened the account without needing it.';
  ui['No te lo cobrarían si una empresa te depositara el sueldo.'] =
    'They would not charge it if a company deposited your salary.';
  ui['La monetaria es para mover dinero: recibir el salario de una empresa, pagar y transferir. Paga apenas 1.27% al año, así que no es para guardar.'] =
    'Checking is for moving money: receiving a company salary, paying and transferring. It pays barely 1.27% a year, so it is not for saving.';
  ui['Ojo: como nadie te deposita planilla, el banco te va a cobrar {0} de manejo cada mes. Ese cargo desaparece el día que una empresa te pague el sueldo aquí.'] =
    'Careful: since nobody deposits payroll for you, the bank will charge you {0} a month in fees. That charge disappears the day a company pays your salary in here.';
  ui['Tu sueldo entra aquí en vez de al bolsillo, y como te lo deposita una empresa no te cobran manejo de cuenta.'] =
    'Your pay lands here instead of in your pocket, and since a company deposits it they waive the maintenance fee.';
  ui['El ahorro paga 2.65% al año, más del doble que la monetaria, y no cobra manejo de cuenta.'] =
    'Savings pays 2.65% a year, more than double checking, and charges no maintenance fee.';

  // ---------- estudiar: todas las opciones a la vez ----------
  ui['Puedes estudiar cualquiera de estas, o ponerte a trabajar. Las dos se pueden.'] =
    'You can study any of these, or go to work. Both are possible.';
  ui['Puedes estudiar o ponerte a trabajar. Las dos se pueden.'] =
    'You can study or go to work. Both are possible.';

  // ---------- ofertas ----------
  ui['Ahora mismo no hay nada que puedas tomar.'] = 'There is nothing you can take right now.';


  /* ==========================================================
   * Version 4: las mejoras, que son la capa de tycoon.
   * ========================================================== */

  ui['Mejoras'] = 'Upgrades';
  ui['Tu negocio'] = 'Your business';
  ui['Queda limpio'] = 'Net';
  ui['todavía nada'] = 'nothing yet';
  ui['Nivel {0} de {1}'] = 'Level {0} of {1}';
  ui['Al máximo. No hay nada más que mejorar aquí.'] = 'Maxed out. Nothing more to upgrade here.';
  ui['Comprar por {0}'] = 'Buy for {0}';
  ui['Compraste: {0}'] = 'You bought: {0}';
  ui['Mantenimiento de tus mejoras'] = 'Upkeep on your upgrades';
  ui['-{0} al mes de mantenimiento'] = '-{0} a month in upkeep';
  ui['+{0} de energía al descansar'] = '+{0} energy when resting';
  ui['estudias {0}% más rápido'] = 'study {0}% faster';
  ui['se paga en {0} meses'] = 'pays for itself in {0} months';
  ui['Te costó {0} y se paga sola en {1} meses. De ahí en adelante es ganancia.'] =
    'It cost you {0} and pays for itself in {1} months. After that it is profit.';
  ui['Te costó {0}. Esta no se paga en dinero: se paga en tiempo y en salud.'] =
    'It cost you {0}. This one does not pay you back in money: it pays you back in time and health.';
  ui['Llevas {0} de {1}'] = '{0} of {1} saved up';

  // ---------- las cuatro cadenas ----------
  X.cadena_nombre = {
    oficio: 'Your tools',
    escuela: 'Your studying',
    casa: 'Your rest'
  };

  /* Los motivos por los que algo no se puede todavia. Los comparten las
   * mejoras y los negocios, porque en pantalla se leen igual. */
  /* Por que todavia no puedes pedir la planilla. Las claves son el `motivo`
   * que devuelve Motor.faltaParaPlanilla(). */
  /* Por que una carrera todavia no se puede empezar. Las claves son el
   * `motivo` que devuelve Motor.faltaParaCarrera(). */
  X.carrera_falta = {
    experiencia: 'You need more experience for this one. You earn it doing homework.',
    nivel: 'You have to finish the previous level first.',
    repetida: 'You already have that level or a higher one.'
  };

  X.planilla_falta = {
    nuevo: 'You have not been here long enough. Nobody puts a brand new hire on the payroll.',
    espera: 'You asked not long ago. Let a few months pass before asking again.',
    yaEsta: 'You are already on the payroll.',
    soloInformal: 'Nobody hires you for this: you do it on your own. A contract needs a real job.'
  };
  X.planilla_negado = {
    no: 'They said no. It happens, and that is why two out of three people in this country work without a contract.'
  };

  X.mejora_falta = {
    dinero: 'Not enough money yet.',
    edad: 'Not until you are older.',
    orden: 'You need the previous upgrade first.',
    repetida: 'You already have it.',
    repetido: 'You already have one.',
    nivel: 'You need to finish school first.',
    techo: 'You are already running all you can manage. Sell one on, or keep studying.',
    plazas: 'Nobody else fits in here.',
    maximo: 'It is already at the highest level.',
    noexiste: 'That does not exist.'
  };

  // ---------- las mejoras, una por una ----------
  datos.herramienta = { nombre: 'Your own tools' };
  datos.uniforme = { nombre: 'Work clothes' };
  datos.transporte = { nombre: 'A way to get around' };
  datos.utiles = { nombre: 'A full set of school supplies' };
  datos.libros = { nombre: 'Books of your own' };
  datos.internet = { nombre: 'Internet at home' };
  datos.escritorio = { nombre: 'A corner of your own' };
  datos.cama = { nombre: 'A real bed' };

  X.mejora_leccion = {
    herramienta: 'With borrowed tools you earn whatever they let you earn. It is the smallest purchase that raises what you charge per hour.',
    uniforme: 'Showing up well is not vanity: it is what makes them call you again. In work by the job, half the income is being recommended.',
    transporte: 'Getting around on your own opens up twice the work, and adds a fixed cost of fuel and maintenance. Almost every big upgrade is like that: it raises the income and it raises the floor.',
    utiles: 'Studying without supplies is studying halfway. It is the cheapest investment in the game and the one fewest people make.',
    libros: 'Books do not expire and they serve the sibling coming up behind you. Some purchases are used once and some stay.',
    internet: 'Q230 a month forever. Before signing anything with a monthly payment, multiply it by the months you are going to pay it: that is Q2,760 a year.',
    escritorio: 'Resting better is not a luxury: it is what lets you work one more half-day without getting sick, and getting sick costs more than any upgrade.',
    cama: 'Health is the asset that does not show up on any bank statement, and the only one that, if it breaks, takes all the others with it.'
  };

  /* ======================================================================
   * El imperio: los negocios, la gente y los dos techos
   * ====================================================================== */

  // ---------- la pantalla ----------
  ui['Tu imperio'] = 'Your empire';
  ui['Montas tu propio negocio'] = 'You build your own business';
  ui['Empiezas con un puesto de dulces de Q450 y llegas a tener varios, con gente trabajando para ti. Cada uno se ve crecer en tu calle.'] =
    'You start with a Q450 candy stand and end up with several, with people working for you. Each one you watch grow on your street.';
  ui['Tus negocios'] = 'Your businesses';
  ui['Mejoras para ti'] = 'Upgrades for you';
  ui['Abrir un negocio'] = 'Open a business';

  /* Las actividades de Trabajo y Estudio: los turnos extra, la practica y la
   * peticion de planilla, que es la leccion del juego vista desde el lado del
   * trabajador. */
  ui['Turnos'] = 'Shifts';

  /* Las tareas del colegio y la experiencia: la tarea no paga, ensena, y lo
   * que ensena es lo que despues abre las carreras que piden mas. */
  ui['Las tareas'] = 'Homework';
  ui['Tareas pendientes: {0}'] = 'Homework due: {0}';
  ui['No pasaste esta tarea'] = 'You did not pass this one';
  ui['Cuatro errores y se acabó. La jornada se gastó igual, pero la puedes repetir el mes que viene.'] =
    'Four mistakes and that is it. The half-day is spent all the same, but you can retake it next month.';

  /* Al cerrar el mes, primero se hace lo que se prometio. */
  ui['Te toca hacer una tarea'] = 'You have one homework to do';
  ui['Te tocan {0} tareas'] = 'You have {0} homeworks to do';
  ui['Pusiste una jornada en tareas. Hazla antes de cerrar el mes.'] =
    'You put a half-day into homework. Do it before closing the month.';
  ui['Pusiste {0} jornadas en tareas. Elige cuál haces primero.'] =
    'You put {0} half-days into homework. Pick which one you do first.';
  ui['Dejarlas para otro mes'] = 'Leave them for another month';
  ui['Si las dejas, esas jornadas se pierden: el tiempo no se guarda.'] =
    'If you leave them, those half-days are gone: time does not carry over.';

  /* Y la boleta del mes, mientras el juego todavia no habla de dinero. */
  ui['Experiencia'] = 'Experience';
  ui['Llevas'] = 'You have';
  ui['Las tareas son del colegio. Inscríbete en algo y aparecen.'] =
    'Homework belongs to school. Enroll in something and it shows up.';
  ui['{0} todavía no tiene tareas propias. La experiencia sigue subiendo por estar inscrito.'] =
    '{0} does not have its own homework yet. Experience still goes up just by being enrolled.';
  ui['Tarea'] = 'Homework';
  ui['Hecha'] = 'Done';
  ui['clase'] = 'class';
  ui['hasta +{0} de experiencia'] = 'up to +{0} experience';
  ui['No pagan nada: dan experiencia, y la experiencia es lo que te deja entrar a las carreras que piden más. Cada una cuesta una jornada.'] =
    'They pay nothing: they give experience, and experience is what gets you into the courses that ask for more. Each one costs a half-day.';
  ui['Ponle una jornada a las tareas en la pestaña del mes.'] =
    'Put a half-day into homework on the month screen.';
  ui['Ponle una jornada a Extra en la pestaña del mes.'] =
    'Put a half-day into Extra on the month screen.';
  ui['Tu experiencia'] = 'Your experience';
  ui['Con {0} más se abre {1}'] = '{0} more opens up {1}';
  ui['Te alcanza para cualquier carrera del juego. Las tareas ya hicieron su trabajo.'] =
    'You have enough for any course in the game. The homework did its job.';
  ui['Se gana haciendo tareas, y más despacio con solo estar inscrito. No se gasta y no se pierde nunca.'] =
    'You earn it doing homework, and more slowly just by being enrolled. It is never spent and never lost.';
  ui['Pide {0} de experiencia'] = 'Asks for {0} experience';
  ui['Experiencia ganada'] = 'Experience earned';
  ui['Experiencia total'] = 'Total experience';
  ui['Ver línea por línea'] = 'See it line by line';
  ui['Tus negocios'] = 'Your businesses';
  ui['Los de oficio salen también en Trabajo y los que enseñan en Estudio, al lado de lo que tienen que ver. Aquí están todos.'] =
    'The trade ones also show up under Work and the teaching ones under Study, next to what they relate to. Here are all of them.';
  ui['Hacerlo'] = 'Do it';
  ui['Practicar'] = 'Practice';
  ui['Trabajos sueltos que se pagan aparte del sueldo. Cada uno cuesta una jornada de Extra.'] =
    'Odd jobs paid on top of your wage. Each one costs a half-day of Extra.';
  ui['Todavía no hay turnos extra para ti. Se abren al subir de nivel educativo.'] =
    'No extra shifts for you yet. They open up as your education level rises.';
  ui['Jornadas de estudio este mes'] = 'Study half-days this month';
  ui['Ponerle una jornada'] = 'Put a half-day in';
  ui['Pedir que te pongan en planilla'] = 'Ask to be put on the payroll';
  ui['Pedirlo'] = 'Ask for it';
  ui['pierdes {0} al mes'] = 'you lose {0} a month';
  ui['ganas {0} al año'] = 'you gain {0} a year';
  ui['y empiezas historial'] = 'and you start a credit history';
  ui['Bono 14 y aguinaldo son dos sueldos más al año. En la mano recibes menos cada mes; en el año recibes bastante más, y el banco por fin puede comprobar lo que ganas.'] =
    'Bono 14 and aguinaldo are two extra months of pay a year. In hand you get less each month; over the year you get considerably more, and the bank can finally verify what you earn.';
  ui['Con {0} meses aquí, la probabilidad de que digan que sí es'] =
    'With {0} months here, the chance they say yes is';
  ui['Te pusieron en planilla'] = 'They put you on the payroll';
  ui['Desde este mes cotizas al IGSS y te toca Bono 14 y aguinaldo: dos sueldos más al año. En la mano vas a recibir un poco menos cada mes.'] =
    'From this month you pay into social security and you get Bono 14 and aguinaldo: two extra months of pay a year. In hand you will receive a little less each month.';
  ui['Es la misma cuenta que haces tú cuando contratas a alguien en tus negocios, vista desde el otro lado. Al patrón el formal le cuesta 1.42 veces el sueldo; al trabajador le da dos sueldos más al año y un historial que el banco puede mirar.'] =
    'It is the same sum you do when you hire someone in your businesses, seen from the other side. To the boss, a formal worker costs 1.42 times the wage; to the worker it gives two extra months of pay a year and a history the bank can look at.';
  ui['Te dijeron que no'] = 'They said no';
  ui['Administrar este negocio'] = 'Manage this business';
  ui['Por ahora no hay nada que puedas abrir.'] = 'There is nothing you can open right now.';

  /* La calle como tablero: se toca un local y se mete una jornada adentro. */
  ui['Mes repartido'] = 'Month spent';
  ui['El mes ya está repartido'] = 'The month is already spent';
  ui['Las ocho jornadas están ocupadas. Vacía una en la rejilla de abajo si quieres cambiar algo.'] =
    'All eight half-days are taken. Empty one in the grid below if you want to change something.';
  ui['Venden'] = 'They sell';
  ui['Vende'] = 'Sells';
  ui['Le sale'] = 'Costs it';
  ui['Le queda'] = 'Keeps';
  ui['Tienes {0} para invertir.'] = 'You have {0} to invest.';
  ui['Lo que han dejado tus negocios'] = 'What your businesses have left you';
  ui['Negocios a la vez'] = 'Businesses at once';
  ui['Gente que puedes administrar'] = 'People you can manage';
  ui['de'] = 'of';
  ui['al mes'] = 'a month';
  ui['nadie todavía'] = 'nobody yet';
  ui['Tu gente'] = 'Your people';
  ui['{0}: {1}'] = '{0}: {1}';

  // ---------- las pastillas ----------
  ui['vende {0} al mes'] = 'sells {0} a month';
  ui['le quedan {0}'] = 'keeps {0}';
  ui['margen del {0}%'] = '{0}% margin';
  ui['caben {0}'] = 'fits {0}';
  ui['cabe una persona'] = 'fits one person';
  ui['se paga en un mes'] = 'pays for itself in a month';
  ui['vende {0}% más'] = 'sells {0}% more';
  ui['+{0} plazas'] = '+{0} spots';
  ui['{0} de {1} plazas llenas'] = '{0} of {1} spots filled';
  ui['{0} jornadas tuyas'] = '{0} half-days of your own';
  ui['Esas cifras son con una sola persona adentro: tú.'] =
    'Those figures are with one single person inside: you.';

  // ---------- abrir, subir, traspasar ----------
  ui['Abrir por {0}'] = 'Open for {0}';
  ui['Subir por {0}'] = 'Upgrade for {0}';
  ui['Abriste: {0}'] = 'You opened: {0}';
  ui['Ya tienes {0} negocio(s)'] = 'You now have {0} business(es)';
  ui['Traspasarlo y recuperar {0}'] = 'Sell it on and get back {0}';
  ui['Cerrarlo (te cuesta {0})'] = 'Close it (costs you {0})';
  ui['¿Traspasar {0}?'] = 'Sell on {0}?';
  ui['¿Cerrar {0}?'] = 'Close {0}?';
  ui['Llevas {0} invertidos y recuperas {1}. Lo que ya pusiste no vuelve completo.'] =
    'You have {0} invested and you get back {1}. What you already put in does not come back whole.';
  ui['Ya llevas los {0} negocios que puedes administrar. Para llevar más, hay que estudiar más.'] =
    'You are already running the {0} businesses you can manage. To run more, you have to study more.';
  ui['Está lleno: no cabe una jornada más. Súbele el nivel.'] =
    'It is full: not one more half-day fits. Upgrade it.';
  ui['Te costó {0}. Ahora vende más y caben {1} personas más adentro.'] =
    'It cost you {0}. Now it sells more and {1} more people fit inside.';
  ui['Ponle jornadas en la pestaña del mes para que produzca. Un negocio al que nadie atiende rinde {0}% menos.'] =
    'Give it half-days on the month tab so it produces. A business nobody minds yields {0}% less.';
  ui['Vacío no vende nada y la renta corre igual. Ponle una jornada en la pestaña del mes, o contrata a alguien.'] =
    'Empty it sells nothing and the rent runs all the same. Give it a half-day on the month tab, or hire somebody.';
  ui['No le pusiste ninguna jornada este mes, así que rinde {0}% menos. Delegar funciona; desaparecer, no.'] =
    'You gave it no half-days this month, so it yields {0}% less. Delegating works; disappearing does not.';

  // ---------- la gente ----------
  ui['Contratar'] = 'Hire';
  ui['Contrataste a alguien'] = 'You hired someone';
  ui['Despedir'] = 'Let go';
  ui['Despedir ({0})'] = 'Let go ({0})';
  ui['Planilla de tu gente'] = 'Your payroll';
  ui['Renta y luz de tus negocios'] = 'Rent and power for your businesses';
  ui['Le pagaste la indemnización'] = 'You paid the severance';
  ui['Te costó {0} sacarlo.'] = 'Letting them go cost you {0}.';
  ui['Le vas a pagar {0} de sueldo, y a ti te va a costar {1} cada mes.'] =
    'You are going to pay them {0} in wages, and it is going to cost you {1} every month.';
  ui['Te va a costar {0} cada mes, y es lo único que va a recibir.'] =
    'It is going to cost you {0} every month, and that is all they are going to get.';
  ui['Le pagas {0} de sueldo y te cuesta {1}: encima van el IGSS, el aguinaldo, el Bono 14 y las vacaciones.'] =
    'You pay them {0} in wages and it costs you {1}: on top go social security, the Christmas bonus, the July bonus and holiday pay.';

  // ---------- las lecciones ----------
  ui['El sueldo NUNCA es lo que cuesta un empleado. Encima van el IGSS, el IRTRA, el INTECAP, el aguinaldo, el Bono 14 y las vacaciones: un 42% más. Quien no cuenta eso quiebra su negocio sin entender por qué.'] =
    'The wage is NEVER what an employee costs. On top go social security, the workers\' recreation levy, the training levy, the Christmas bonus, the July bonus and holiday pay: 42% more. Anyone who does not count that sinks their business without understanding why.';
  ui['Sin contrato es más barato hoy. A cambio esa persona se va a ir más pronto, no cotiza para su pensión, y si cae inspección la multa son tres sueldos.'] =
    'No contract is cheaper today. In exchange that person is going to leave sooner, pays nothing towards their pension, and if an inspector shows up the fine is three months of wages.';
  ui['Un sueldo por cada año trabajado. Es el otro lado del contrato: lo mismo que protege al trabajador es lo que le cuesta al patrón deshacerse de él. Por eso hay que contratar pensando, no de prisa.'] =
    'One month of wages for every year worked. That is the other side of a contract: the very thing that protects the worker is what it costs the boss to be rid of them. That is why you hire thinking, not in a hurry.';
  ui['Subir un negocio no sirve de nada si no tienes con qué llenar las plazas nuevas. Primero la gente, después el tamaño.'] =
    'Upgrading a business is worth nothing if you have no way to fill the new spots. People first, size after.';
  ui['Los dos suben cuando terminas de estudiar. Llevar dos negocios son dos contabilidades, y una planilla hay que saber llevarla.'] =
    'Both go up when you finish studying. Running two businesses is two sets of books, and a payroll is something you have to know how to keep.';
  ui['Cómo se lee un negocio'] = 'How you read a business';
  ui['Un negocio se mide con dos números, no con uno: lo que vende y lo que le queda. Un negocio que vende el doble que otro puede ganar la mitad.'] =
    'A business is measured with two numbers, not one: what it sells and what it keeps. A business that sells twice as much as another can earn half as much.';
  ui['Y una mejora no es un gasto: es una inversión, y una inversión se mide en cuántos meses tarda en pagarse sola. Divide lo que cuesta entre lo que te deja al mes.'] =
    'And an upgrade is not an expense: it is an investment, and an investment is measured in how many months it takes to pay for itself. Divide what it costs by what it leaves you per month.';

  // ---------- los niveles de un negocio ----------
  X.nivel_negocio = {
    'Recién abierto': 'Just opened',
    'Con equipo': 'With equipment',
    'Con nombre': 'With a name',
    'Con sucursal': 'With a branch'
  };

  // ---------- las dos formas de contratar ----------
  X.planilla_nombre = {
    informal: 'No contract',
    formal: 'On contract'
  };
  X.planilla_nota = {
    informal: 'Cheap today. They leave you, and if an inspector shows up the fine is three months of wages.',
    formal: 'Costs the wage times 1.42, plus Q250. They stay, and there is no fine to fear.'
  };

  // ---------- los negocios, uno por uno ----------
  datos.dulces = {
    nombre: 'Candy stand',
    descripcion: 'A box of sweets bought wholesale and a street corner.'
  };
  datos.refrescos = {
    nombre: 'Cold drinks stand',
    descripcion: 'A cooler, an awning and a spot where people walk by.'
  };
  datos.lavado = {
    nombre: 'Car wash',
    descripcion: 'Water, soap, two hoses and willingness.'
  };
  datos.tortilleria = {
    nombre: 'Tortilla shop',
    descripcion: 'Corn, a griddle and customers every single day.'
  };
  datos.papeleria = {
    nombre: 'Stationery shop',
    descripcion: 'Notebooks, photocopies and everything that runs out in January.'
  };
  datos.comedor = {
    nombre: 'Lunch counter',
    descripcion: 'Set lunches for the people who work nearby.'
  };
  datos.taller = {
    nombre: 'Motorcycle shop',
    descripcion: 'Tools, spare parts and hands that know how.'
  };
  datos.cafeinternet = {
    nombre: 'Internet cafe',
    descripcion: 'Ten machines, a printer and a good signal.'
  };
  datos.distribuidora = {
    nombre: 'Wholesale distributor',
    descripcion: 'A warehouse, a truck and a route of shops expecting you.'
  };

  X.negocio_leccion = {
    dulces: 'Buy wholesale and sell retail: of every Q100 you sell, Q35 stays with you. That is the margin, and it is the first thing to know about any business.',
    refrescos: 'This business, minded by you alone, leaves you almost exactly what an informal worker earns in Guatemala. The difference is that here the business is yours, and here a second person fits.',
    lavado: 'Look at the margin: 60%, almost double the candy stand. A service does not have to buy what it sells. Selling your work leaves more than reselling things.',
    tortilleria: 'Compare it with the car wash: the tortilla shop sells almost twice as much and earns less. Selling a lot is not earning a lot. The only thing that matters is what is left.',
    papeleria: 'This is the first business that asks you for finished middle school, and it is no whim: you have to keep stock, get a licence and sign a lease. It is the first time school turns into money directly.',
    comedor: 'Q2,400 a month in rent and power that you pay even if it rains and nobody comes. That is the fixed cost, and it is what sinks businesses: not selling little one month, but having to pay all the same.',
    taller: 'Q120,000 to open it, and minded by you alone it takes two years to pay back. Full of people it takes seven months. A big business is not paid for with your work: it is paid for with everyone else\'s.',
    cafeinternet: 'High margin and high fixed cost at the same time. The machines are already paid for, so almost everything that comes in stays; but the Q3,800 of rent and internet run whether anybody comes or not.',
    distribuidora: 'With a single person inside this business earns almost nothing: the margin is 22% and the rent eats it. Full of people it leaves Q28,480 a month. Some businesses only exist if they are big, and that is why you have to know which is which before putting your money in.'
  };

})(typeof TEXTOS_EN !== 'undefined' ? TEXTOS_EN : undefined);
