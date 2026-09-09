/* Mi Primer Quetzal — English
 *
 * Translation, not localization: the setting stays Guatemala and the currency
 * stays the Quetzal (Q). Written for the Guatemalan diaspora and for anyone
 * who wants to see the project.
 *
 * Keys are the Spanish source strings. A missing key simply falls back to
 * Spanish, so the game never breaks because of a gap in here.
 */

var TEXTOS_EN = {

  // ---------- interface ----------
  ui: {
    // shell and time
    '{0} {1} · {2} años': '{0} {1} · age {2}',
    'turnos por {0}': '{0} turns',
    'debe {0}': 'owes {0}',
    'Tu {0}': 'Your {0}',
    'Terminar el {0}': 'End the {0}',
    'Adelantar hasta que pase algo': 'Skip ahead until something happens',
    'Adelantaste {0} meses.': 'You skipped {0} months.',
    'Este reparto se repite los {0} meses del {1}.': 'This split repeats for all {0} months of the {1}.',

    // week slots
    'Trabajo': 'Work', 'Estudio': 'School', 'Extra': 'Side gig', 'Hecho': 'Done',
    'Descanso': 'Rest', 'Libre': 'Free', 'Mes': 'Month', 'Banco': 'Bank',
    'Trabajar': 'Work', 'Estudiar': 'Study', 'Descansar': 'Rest', 'Vaciar': 'Clear',
    'Tu primer año es tranquilo. No van a caer imprevistos mientras agarras el ritmo.':
      'Your first year is calm. Nothing bad will hit you while you learn the ropes.',

    // month preview
    '{0} y gastos': '{0} and expenses',
    'Colegiatura': 'Tuition',
    'Cuotas de crédito': 'Loan payments',
    'Pago de tarjeta': 'Card payment',
    'Lo que quedaste debiendo': 'What you still owe',
    'Se te irá del efectivo': 'Will leak from your cash',

    // work
    'Formal': 'Formal', 'Informal': 'Informal',
    '{0} meses': '{0} months',
    'Renunciar': 'Quit',
    'Mercado laboral': 'Job market',
    'La demanda cambia con los años. Investiga antes de estudiar, y aun así no des nada por seguro.':
      'Demand shifts over the years. Research before you study, and still assume nothing.',
    'Ofertas': 'Openings',
    'ingreso variable': 'variable income',
    'Necesitas nivel {0}.': 'You need {0} level.',
    'Aceptar formal': 'Take it formal',
    'Informal (+{0})': 'Informal (+{0})',
    'Demanda alta': 'High demand', 'Demanda media': 'Average demand',
    'Mercado apretado': 'Tight market', 'Saturada': 'Oversupplied',

    // study
    'Tu nivel': 'Your level',
    'En Guatemala la licenciatura sube el ingreso mediano apenas 13% sobre un bachiller. La maestría lo sube 133%. La ruta larga paga solo si la terminas.':
      'In Guatemala a bachelor’s degree raises median income only 13% over a high school diploma. A master’s raises it 133%. The long road pays only if you finish it.',
    'Privada': 'Private', 'Pública': 'Public', 'gratis': 'free',
    '{0} al año': '{0} per year',
    'Ya tienes ese nivel o uno mayor.': 'You already have that level or higher.',

    // bank
    'Banco Cardamomo': 'Cardamom Bank',
    'Efectivo en mano': 'Cash on hand',
    'Cuenta monetaria': 'Checking account',
    'Cuenta de ahorro': 'Savings account',
    'Depósito a plazo': 'Term deposit',
    'sin abrir': 'not opened',
    'Lo que debes': 'What you owe',
    'Patrimonio': 'Net worth',
    'Tu historial de crédito': 'Your credit history',
    '{0} de 100': '{0} out of 100',
    'No pedir nunca nada prestado tampoco construye historial. Por eso mucha gente responsable no califica cuando de verdad lo necesita.':
      'Never borrowing anything builds no history either. That is why plenty of responsible people do not qualify when they finally need it.',
    'Te firmarían de fiador': 'Someone would co-sign for you',
    'sí': 'yes', 'todavía no': 'not yet',
    'Abrir cuenta': 'Open an account',
    'Rendimiento anual': 'Annual yield',
    'Abrir con {0}': 'Open with {0}',
    'Mover dinero': 'Move money',
    'Efectivo ▸ Monetaria': 'Cash ▸ Checking',
    'Monetaria ▸ Efectivo': 'Checking ▸ Cash',
    'Efectivo ▸ Ahorro': 'Cash ▸ Savings',
    'Monetaria ▸ Ahorro': 'Checking ▸ Savings',
    'Ahorro ▸ Efectivo': 'Savings ▸ Cash',
    'Mover a {0}': 'Move to {0}',
    'Monto': 'Amount', 'Tasa': 'Rate', 'Mínimo': 'Minimum', 'Abrir': 'Open',
    'Rendimiento acumulado': 'Interest earned so far',
    'Le faltan': 'Remaining',
    'Sacarlo antes (pierdes lo ganado)': 'Withdraw early (you lose the interest)',
    'Sacaste tu depósito': 'You withdrew your deposit',
    'Perdiste {0} de rendimiento acumulado.': 'You lost {0} of accrued interest.',

    // credit
    'Crédito': 'Credit',
    'Préstamo del barrio': 'Street loan',
    'Préstamo personal': 'Personal loan',
    'Saldo': 'Balance', 'Cuota': 'Payment',
    '{0}% anual': '{0}% per year',
    '{0} cuotas': '{0} payments',
    'Llevas {0} cuota(s) de atraso.': 'You are {0} payment(s) behind.',
    'Abonar de más': 'Pay extra',
    'Tarjeta de crédito': 'Credit card',
    'Límite': 'Limit', 'Usado': 'Used',
    'Cada mes pago': 'Each month I pay',
    'solo el mínimo': 'only the minimum',
    'todo el saldo': 'the full balance',
    'Pagando solo el mínimo, esta deuda casi no baja y los intereses se acumulan sobre los intereses.':
      'Paying only the minimum, this debt barely shrinks and interest piles on top of interest.',
    'Comprar con la tarjeta': 'Buy with the card',
    'Abonar': 'Pay',
    'Pedir préstamo': 'Apply for a loan',
    'Pedir tarjeta': 'Apply for a card',
    'Prestamista del barrio': 'Street lender',
    'Abonar a la tarjeta': 'Pay the card',
    'Abonar al préstamo': 'Pay down the loan',
    'Máximo con tu historial': 'Maximum with your history',
    'Aquí está el círculo vicioso.': 'Here is the vicious circle.',
    'Tu historial es corto, así que te piden fiador o garantía. Todavía nadie te firma.':
      'Your history is thin, so they ask for a co-signer or collateral. Nobody will sign for you yet.',
    'No te lo niegan por caro, te lo niegan porque no tienes historial ni quién te firme.':
      'They are not turning you down over price. They are turning you down because you have no history and nobody to vouch for you.',
    'Dejas tu ahorro congelado y el banco te presta contra él. Es la forma más común de empezar a construir historial.':
      'You freeze your savings and the bank lends against them. It is the most common way to start building history.',
    'Pedir con garantía de mi ahorro': 'Borrow against my savings',
    'Ahora no': 'Not now',
    'Conseguiste quién te firme de fiador.': 'You found someone to co-sign.',
    'Plazo': 'Term',
    'Cuota mensual': 'Monthly payment',
    'Vas a pagar en total': 'You will pay in total',
    'De eso, intereses': 'Of that, interest',
    'La tasa dice {0}%, pero lo que importa es que por {1} vas a devolver {2}.':
      'The rate says {0}%, but what matters is that for {1} you will pay back {2}.',
    'Pedir el préstamo': 'Take the loan',
    'Préstamo con garantía': 'Secured loan',
    'Dejas ese mismo monto congelado en tu ahorro.': 'That same amount gets frozen in your savings.',
    'Presta a cualquiera, hoy mismo, sin papeles. Cobra veinticinco por ciento al mes.':
      'Lends to anyone, today, no paperwork. Charges twenty-five percent a month.',
    'Interés': 'Interest',
    '{0} mensual': '{0} per month',
    'En términos anuales': 'In annual terms',
    'Léelo dos veces.': 'Read that twice.',
    'Veinte por ciento al mes suena poco. Al año son más de setecientos por ciento. En Guatemala no hay techo legal a las tasas.':
      'Twenty percent a month sounds small. Over a year it is more than seven hundred percent. Guatemala has no legal cap on interest rates.',
    'Cuota a 6 meses': 'Payment over 6 months',
    'Vas a devolver': 'You will pay back',
    'Solo de intereses': 'Interest alone',
    'Aceptar de todos modos': 'Take it anyway',
    'Mejor no': 'Never mind',
    'Sin historial': 'No history',

    // housing
    'Vivienda': 'Housing',
    'actual': 'current',
    'Costo total al mes': 'Total monthly cost',
    'Ingreso exigido': 'Income required',
    'Mudarse aquí': 'Move here',
    'Todavía no': 'Not yet',

    // side gigs
    'Trabajos extra': 'Side gigs',
    'paga': 'pays', 'enseña': 'teaches', 'de tu profesión': 'your field',
    'Jugar': 'Play',
    'Hay {0} más que se abren al subir de nivel educativo.':
      '{0} more unlock as your education level goes up.',
    'Puntos': 'Points', 'Aciertos': 'Correct',
    '{0} de {1}': '{0} of {1}',
    'Te pagaron': 'You were paid',
    'Lo que practicaste.': 'What you practiced.',

    // turn summary
    'Salario': 'Salary', 'Bono de ley': 'Statutory bonus', 'Remesas': 'Remittances',
    'Ingresos extra': 'Extra income', 'Comisión de remesa': 'Remittance fee',
    'Vivienda y gastos': 'Housing and expenses', 'Cuotas pagadas': 'Loan payments made',
    'Intereses que pagaste': 'Interest you paid', 'Imprevistos': 'Unexpected costs',
    'Enfermedad': 'Illness', 'Gastos hormiga': 'Money that leaked away',
    'Efectivo perdido': 'Cash lost', 'Intereses ganados': 'Interest earned',
    'Impuesto sobre intereses': 'Tax on interest', 'Quedaste debiendo': 'You still owe',
    'Siguiente': 'Next', 'Seguir': 'Continue', 'Cerrar': 'Close',
    'Entendido': 'Got it', 'Listo': 'Done', 'Listo.': 'Done.',
    'Aceptar': 'Accept', 'Confirmar': 'Confirm', 'Cancelar': 'Cancel',
    'Está bien': 'All right', 'Disponible: {0}': 'Available: {0}',
    'Lo que importa.': 'What matters.', 'Letra chica:': 'Fine print:',
    'No se pudo': 'Could not do it', 'No se puede': 'Not possible',
    'No calificas': 'You do not qualify', 'No sirvió': 'That did not work',
    'No has hecho nada': 'You have done nothing',

    // graduation and reports
    'Te graduaste': 'You graduated',
    'Terminaste {0}. Ya calificas para empleos que antes no podías tomar.':
      'You finished {0}. You now qualify for jobs that were closed to you.',
    'Ojo con la expectativa. En Guatemala una licenciatura sube el ingreso mediano apenas 13% sobre un bachiller. El salto grande está en la maestría.':
      'Careful with expectations. In Guatemala a bachelor’s degree raises median income only 13% over a high school diploma. The big jump is the master’s.',
    'Cerraste el año {0}': 'You closed out {0}',
    'Edad': 'Age', '{0} años': '{0} years old',
    'Cambió en el año': 'Change over the year',
    'Deuda': 'Debt', 'Historial de crédito': 'Credit history',
    'Nivel educativo': 'Education level',
    'Llevas {0} perdidos en gastos hormiga del efectivo. Es dinero que no compró nada que recuerdes.':
      'You have lost {0} to cash leaking away. That is money that bought nothing you can remember.',
    'Llevas {0} pagados en intereses y {1} ganados. Vas prestándole tu dinero al banco, no al revés.':
      'You have paid {0} in interest and earned {1}. You are lending the bank your money, not the other way round.',
    'Tu vida en números': 'Your life in numbers',
    'Edad final': 'Final age', 'Último empleo': 'Last job', 'Sin trabajo': 'No job',
    'Balance de intereses': 'Interest balance',
    'Perdido en gastos hormiga': 'Lost to leaking cash',
    'Comisiones de remesa': 'Remittance fees',
    'Lo que dice tu partida': 'What your run says',
    'Cómo vas': 'How you are doing', 'Cómo voy': 'How am I doing',
    'Ingresos acumulados': 'Total income', 'Gastos acumulados': 'Total spending',
    'Meses estudiando': 'Months studying', 'Vidas anteriores': 'Previous lives',
    'Ver mi reporte de vida': 'See my life report',
    'Te jubilaste': 'You retired',
    'Llegaste a los {0} años. Tu vida financiera terminó y el reporte ya está listo.':
      'You reached {0}. Your financial life is over and the report is ready.',

    // glossary and menu
    'Glosario': 'Glossary', 'Opciones': 'Options',
    'Sonido activado': 'Sound on', 'Sonido apagado': 'Sound off',
    'Tu partida': 'Your game',
    'Copiar código de partida': 'Copy save code', 'Pegar un código': 'Paste a code',
    'Empezar de nuevo': 'Start over',
    'Tu código de partida': 'Your save code',
    'Cópialo y guárdalo. Con él puedes seguir tu partida en otro dispositivo.':
      'Copy it and keep it. With it you can continue on another device.',
    'Pegar código': 'Paste code',
    'Esto reemplaza tu partida actual.': 'This replaces your current game.',
    'Cargar': 'Load',
    'Ese código no se pudo leer.': 'That code could not be read.',
    '¿Empezar de nuevo?': 'Start over?',
    'Se borra tu partida y no hay forma de recuperarla.':
      'Your game is deleted and there is no way to get it back.',
    'Sí, borrar': 'Yes, delete it',

    // start screen
    'Tus partidas': 'Your games',
    'Ranura {0} · vacía': 'Slot {0} · empty',
    'Ranura {0} · {1} años': 'Slot {0} · age {1}',
    'Empezar aquí': 'Start here',
    'Seguir jugando': 'Continue', 'Borrar': 'Delete',
    '¿En qué Guatemala te toca vivir?': 'Which Guatemala do you get to live in?',
    'Empleo formal urbano': 'Formal urban employment',
    'Contrato, Bono 14, aguinaldo y seguro social. Puedes construir historial de crédito.':
      'A contract, the statutory July and December bonuses, and social security. You can build credit history.',
    'Economía informal': 'The informal economy',
    'Sin contrato ni prestaciones, con ingresos más bajos. Es donde vive el 65% del país.':
      'No contract, no benefits, lower income. It is where 65% of the country lives.',
    'Jugar así': 'Play this way',

    // teaching cards
    'Cómo funciona': 'How it works',
    'Aceptaste un trabajo informal': 'You took an informal job',
    'Vas a recibir {0} más en la mano cada mes. A cambio no tienes Bono 14 ni aguinaldo, no cotizas al seguro y el banco no puede comprobar tus ingresos.':
      'You will take home {0} more each month. In exchange you get no statutory bonuses, you pay into no social security, and the bank cannot verify your income.',
    'Dos tercios de los guatemaltecos trabajan así. Es más dinero hoy y menos toda la vida, porque sin historial nadie te presta cuando lo necesitas.':
      'Two thirds of Guatemalans work this way. It is more money today and less for a lifetime, because with no record nobody lends to you when you need it.',
    'Te inscribiste': 'You enrolled',
    'Abriste tu cuenta monetaria': 'You opened your checking account',
    'Abriste tu cuenta de ahorro': 'You opened your savings account',
    'Sobre lo que ganes de intereses te retienen 10% de impuesto. El rendimiento que te prometen nunca es el que recibes.':
      'Ten percent tax is withheld on whatever interest you earn. The yield they advertise is never the yield you get.',
    'Abriste un depósito a plazo': 'You opened a term deposit',
    'Dejas el dinero quieto doce meses y rinde 6.35% al año, más del doble que el ahorro.':
      'You leave the money untouched for twelve months and it yields 6.35% a year, more than double savings.',
    'Aquí es donde se ve el interés compuesto. Los intereses que ganas también empiezan a ganar intereses, y por eso ahorrar a los 20 vale muchísimo más que a los 40.':
      'This is where compound interest shows up. The interest you earn starts earning interest of its own, which is why saving at 20 is worth far more than saving at 40.',
    'Mínimo {0}, a doce meses.': 'Minimum {0}, twelve-month term.',
    'Te dieron tarjeta de crédito': 'You got a credit card',
    'Tu límite es {0}. Cada mes puedes pagar todo el saldo o solo el mínimo.':
      'Your limit is {0}. Each month you can pay the full balance or just the minimum.',
    'La tasa es 45.84% al año. Pagando solo el mínimo, una compra de Q1,000 puede terminar costándote más del doble. Es el error financiero más caro y más común de tu edad.':
      'The rate is 45.84% a year. Paying only the minimum, a Q1,000 purchase can end up costing you more than double. It is the most expensive and most common money mistake at your age.',
    'Tu primer crédito': 'Your first loan',
    'Dejaste {0} de tu ahorro congelado como garantía y el banco te prestó el mismo monto. Tu cuota es {1}.':
      'You froze {0} of your savings as collateral and the bank lent you the same amount. Your payment is {1}.',
    'Parece absurdo pedir prestado el dinero que ya tienes, pero es la forma más común de empezar a construir historial. Cada cuota que pagues a tiempo sube tu puntaje.':
      'Borrowing money you already have looks absurd, but it is the most common way to start building a record. Every payment you make on time raises your score.',
    'Le pediste al prestamista': 'You borrowed from the street lender',
    'Tienes el dinero hoy, sin papeles y sin fiador. Tu cuota es {0} por seis meses.':
      'You have the money today, no paperwork and no co-signer. Your payment is {0} for six months.',
    'Este préstamo no construye ningún historial. Al contrario: te consume el ingreso que necesitas para calificar en el banco. Es la trampa donde cae el 26.2% del país.':
      'This loan builds no record at all. Worse, it eats the income you need to qualify at a bank. It is the trap 26.2% of the country falls into.'
  },

  // ---------- data by id: jobs, careers, minigames, events, promotions ----------
  datos: {
    repartidor: { nombre: 'Motorcycle courier',
      descripcion: 'You deliver orders. Paid per trip, almost always off the books.' },
    tienda: { nombre: 'Shop clerk',
      descripcion: 'You work the counter. Long hours, steady pay.' },
    construccion: { nombre: 'Construction helper',
      descripcion: 'Hard work paid by the job. When there is a job.' },
    vendedor: { nombre: 'Commission salesperson',
      descripcion: 'Low base plus commission. A good month is great, a bad one hurts.' },
    callcenter: { nombre: 'Bilingual call center agent',
      descripcion: 'You need English. It is the best pay in the country without a degree.' },
    tiendapropia: { nombre: 'Your own shop',
      descripcion: 'Your business. You need capital and the nerve to ride out the bad months.' },
    auxcontable: { nombre: 'Accounting assistant',
      descripcion: 'Office, payroll, benefits.' },
    refrigeracion: { nombre: 'Refrigeration technician',
      descripcion: 'A trade with high demand and little competition.' },
    soporte: { nombre: 'IT support',
      descripcion: 'A technician with a contract. Good way in.' },
    docente: { nombre: 'Teacher',
      descripcion: 'Steady and secure. The ceiling is low.' },
    contador: { nombre: 'Accountant',
      descripcion: 'Degree and licence. You can take work on the side.' },
    ingeniero: { nombre: 'Junior engineer',
      descripcion: 'Five years of study. Here it actually shows.' },
    gerente: { nombre: 'Manager or specialist',
      descripcion: 'The real jump from education is the master’s, not the bachelor’s.' },

    tecnico: { nombre: 'Technical program',
      descripcion: 'Two years. A trade with high demand and little competition.' },
    admin: { nombre: 'Business administration degree',
      descripcion: 'Five years. It is the degree with the most graduates in the country.' },
    ingenieria: { nombre: 'Engineering degree',
      descripcion: 'Five years, and the private option is brutally expensive. Public is free.' },
    maestria: { nombre: 'Master’s degree',
      descripcion: 'Two more years. This is where pay actually doubles.' },

    reparto: { nombre: 'Motorcycle delivery',
      descripcion: 'Dodge traffic and get the orders there on time.' },
    cambio: { nombre: 'Give the change',
      descripcion: 'Someone buys something and overpays. How much do you give back?',
      ensena: 'If you do not know what to hand back, you do not know what you earned.' },
    precios: { nombre: 'Which one is cheaper?',
      descripcion: 'Two sizes, two prices. Pick the one that costs less.',
      ensena: 'Cheap is not the price: it is the price per unit. And the big pack does not always win.' },
    estafas: { nombre: 'Scam hunter',
      descripcion: 'Messages come in. Decide which ones are fraud.',
      ensena: 'No bank asks for your PIN by text, and urgency is the warning sign.' },
    presupuesto: { nombre: 'Balance the month',
      descripcion: 'Split up the paycheck. Surprises are coming.',
      ensena: 'Without a cushion, any surprise turns into expensive debt.' },
    caja: { nombre: 'Closing the till',
      descripcion: 'Balance the day’s till and find the discrepancy.',
      ensena: 'Keeping books is what separates a business from a hobby.' },

    diente: { titulo: 'Your tooth is killing you',
      texto: 'You put it off for weeks. The dentist wants Q900 and it cannot wait.' },
    celular: { titulo: 'You broke your phone',
      texto: 'You dropped it and the screen is gone. Without a phone, work cannot reach you.' },
    familia: { titulo: 'Family emergency',
      texto: 'Your mother got sick and in your family the biggest share falls to you.' },
    moto: { titulo: 'Your ride broke down',
      texto: 'The shop wants Q1,400. Without transport you show up late and get docked.' },
    robo: { titulo: 'You got mugged',
      texto: 'They jumped you leaving work and took whatever you were carrying.' },
    horas: { titulo: 'You are offered overtime',
      texto: 'There is extra work this month. It pays separately but it will cost you energy.' },
    venta: { titulo: 'You sold something you no longer used',
      texto: 'You cleared out old stuff and somebody bought it.' },
    remesaextra: { titulo: 'Your brother sends extra',
      texto: 'He had a good month and wanted to send more than usual.' },
    estafa: { titulo: 'A suspicious message',
      texto: 'A text arrives: "Cardamom Bank: your account will be blocked. Confirm your details here." It looks almost exactly like the bank’s messages.',
      leccion: 'No bank will ever ask for your password or PIN by message or phone call. If they rush you, it is a scam.' },

    tasaahorro: { titulo: 'Preferential savings rate',
      texto: 'For six months your savings account pays 4.50% instead of 2.65%. No hidden conditions.',
      letraChica: 'Applies to the average balance. When the term ends it reverts to the normal rate.' },
    limite: { titulo: 'Congratulations! We raised your limit',
      texto: 'For your good behaviour we have raised your card limit by 60%.',
      letraChica: 'A higher limit is not a prize and it is not your money. It is more possible debt at 45.84% a year.',
      leccion: 'A raised limit does not mean you earned more. It means they can lend you more, expensively.' },
    mesessin: { titulo: 'Twelve months interest free',
      texto: 'Buy now and pay in twelve interest-free instalments.',
      letraChica: 'Interest free, but with a 5% origination fee and mandatory monthly insurance. The real cost is around 14% a year, not zero.',
      leccion: 'Zero interest is almost never zero cost. Find the fee and the insurance before you sign.' },
    seguro: { titulo: 'Life insurance included',
      texto: 'We have activated your life insurance free for the first month.',
      letraChica: 'From the second month Q75 a month comes out of your account unless you cancel it yourself.',
      leccion: 'What switches itself on also charges itself. Check your statement every month.' },
    plazo: { titulo: 'Term deposit at a special rate',
      texto: 'Leave Q5,000 untouched for a year and they pay 7.25% instead of 6.35%.',
      letraChica: 'If you pull the money out before the year is up, you lose the accrued interest.' }
  },

  // ---------- decision buttons, keyed by event id and option index ----------
  opciones: {
    'horas:0': 'Take it', 'horas:1': 'Pass',
    'estafa:0': 'Confirm my details', 'estafa:1': 'Ignore it and call the bank',
    'limite:0': 'Accept the increase', 'limite:1': 'Leave it as it is',
    'seguro:0': 'Keep it active', 'seguro:1': 'Cancel it now'
  },

  // ---------- education levels ----------
  niveles: {
    primaria: 'primary school', basicos: 'middle school',
    diversificado: 'high school', tecnico: 'technical',
    licenciatura: 'bachelor’s', maestria: 'master’s'
  },

  turnos: { mes: 'month', trimestre: 'quarter', 'año': 'year' },

  meses: {
    '0': 'January', '1': 'February', '2': 'March', '3': 'April', '4': 'May', '5': 'June',
    '6': 'July', '7': 'August', '8': 'September', '9': 'October', '10': 'November', '11': 'December'
  },

  dificultad: { normal: 'Formal urban employment', dificil: 'The informal economy' },

  // ---------- credit score bands ----------
  tramos: {
    'Sin historial': 'No history', 'En construcción': 'Building',
    'Aceptable': 'Fair', 'Bueno': 'Good', 'Excelente': 'Excellent'
  },
  tramos_nota: {
    'Sin historial': 'The bank has no idea who you are.',
    'En construcción': 'They ask for a co-signer or collateral.',
    'Aceptable': 'You qualify on your own now.',
    'Bueno': 'Bigger amounts and better rates.',
    'Excelente': 'Now the bank comes looking for you.'
  },

  // ---------- housing ----------
  vivienda_nombre: { familiar: 'Family home', cuarto: 'Shared room', apartamento: 'Your own apartment' },
  vivienda_desc: {
    familiar: 'You live with your family and chip in for expenses.',
    cuarto: 'Independence, but you pay for everything.',
    apartamento: 'Your own space. It costs.'
  },

  // ---------- bank products ----------
  producto_nombre: { monetaria: 'Checking account', ahorro: 'Savings account', plazo: 'Term deposit' },
  producto_desc: {
    monetaria: 'For moving money: getting paid, paying bills, transferring. Pays almost no interest.',
    ahorro: 'For setting money aside on purpose. Pays more than checking.',
    plazo: 'You leave the money untouched for a while and it yields far more.'
  },

  // ---------- glossary ----------
  glosario_termino: {
    'Cuenta monetaria': 'Checking account',
    'Cuenta de ahorro': 'Savings account',
    'Depósito a plazo': 'Term deposit',
    'Tasa nominal y tasa efectiva': 'Nominal rate and effective rate',
    'Interés compuesto': 'Compound interest',
    'Historial de crédito': 'Credit history',
    'Fiador': 'Co-signer',
    'Garantía': 'Collateral',
    'Mora': 'Delinquency',
    'Pago mínimo': 'Minimum payment',
    'Empleo formal e informal': 'Formal and informal employment',
    'Bono 14 y aguinaldo': 'Bono 14 and aguinaldo',
    'Remesa': 'Remittance',
    'Fondo de emergencia': 'Emergency fund',
    'Seguro de depósitos': 'Deposit insurance',
    'ISR sobre intereses': 'Income tax on interest'
  },
  glosario_texto: {
    'Cuenta monetaria': 'An account for moving money: receiving your salary, paying and transferring. In Guatemala it pays around 1.27% a year, next to nothing. It is not for saving, it is for operating.',
    'Cuenta de ahorro': 'An account for setting money aside. It pays about 2.65% a year, more than double checking, because the bank expects you not to move it often.',
    'Depósito a plazo': 'You leave an amount untouched for an agreed period and the bank pays much more, around 6.35% a year. Take it out early and you lose the yield.',
    'Tasa nominal y tasa efectiva': 'The nominal rate is the big number in the ad. The effective rate is what you actually pay or earn once interest on interest, fees and insurance are added in. A card that says 3.8% a month charges 45.84% a year, not 3.8%.',
    'Interés compuesto': 'The interest you earn starts earning interest too. That is why saving at 20 is worth vastly more than saving the same amount at 40.',
    'Historial de crédito': 'The record of whether you pay or not. It is built by borrowing and following through. Never borrowing builds no history either, which is why many responsible people do not qualify.',
    'Fiador': 'Someone who signs with you and answers for your debt if you do not pay. In Guatemala this is the real barrier to credit: they do not deny you because it is expensive, they deny you because nobody will sign.',
    'Garantía': 'Money or property you pledge to back a loan. It is the most common way to get your first loan when you have neither history nor a co-signer.',
    'Mora': 'Falling behind on a payment. Beyond the penalty, it goes on your record and closes doors for years.',
    'Pago mínimo': 'The smallest amount the bank will accept on your card each month. Paying only the minimum keeps the debt from shrinking and ends up costing you several times what you bought.',
    'Empleo formal e informal': 'Formal means a contract: statutory bonuses, social security and provable income. Informal means none of that, even if you sometimes take home more. Two out of three Guatemalans work informally.',
    'Bono 14 y aguinaldo': 'Two extra salaries a year that the law requires for formal workers. Bono 14 in July and the aguinaldo in December and January. That is why the Guatemalan work year has fourteen paydays.',
    'Remesa': 'Money a relative abroad sends home. In Guatemala remittances are 20.7% of the whole economy. Of that, 71.7% is cashed out at a counter and only 7.6% ends up saved.',
    'Fondo de emergencia': 'Money set aside that you only touch when something serious happens. Without it, any surprise turns into expensive debt.',
    'Seguro de depósitos': 'If a bank fails, the protection fund returns up to Q20,000 per person per bank. Above that, the risk is yours.',
    'ISR sobre intereses': 'Of whatever interest you earn, the bank withholds 10% in tax before crediting it. The yield they promise is never the one you receive.'
  },

  // ---------- report lessons ----------
  lecciones: {}
};

// Las plantillas de las lecciones viven en la interfaz, así que se traducen
// como frases normales dentro de ui.
TEXTOS_EN.ui['Se te fueron {0} en gastos hormiga del efectivo. Ese dinero no compró nada que recuerdes.'] =
  '{0} leaked out of your cash without you noticing. That money bought nothing you can remember.';
TEXTOS_EN.ui['Pagaste {0} de intereses y ganaste solo {1}. El crédito te costó mucho más de lo que el ahorro te dio.'] =
  'You paid {0} in interest and earned only {1}. Credit cost you far more than saving ever gave you.';
TEXTOS_EN.ui['Las comisiones de las remesas te costaron {0}. Cobrarlas en cuenta cuesta la mitad.'] =
  'Remittance fees cost you {0}. Receiving them into an account costs half as much.';
TEXTOS_EN.ui['Tu historial de crédito quedó corto. Sin historial, cuando de verdad necesites un préstamo, la única puerta abierta va a ser la cara.'] =
  'Your credit history came up short. With no record, when you genuinely need a loan the only door open is the expensive one.';
TEXTOS_EN.ui['Te graduaste de licenciatura. En Guatemala eso sube el ingreso mediano apenas 13% sobre un bachiller. El salto real está en la maestría.'] =
  'You earned a bachelor’s degree. In Guatemala that lifts median income only 13% over a high school diploma. The real jump is the master’s.';
TEXTOS_EN.ui['Terminaste en empleo informal. Ganaste más en la mano cada mes, pero sin Bono 14, sin aguinaldo, sin seguro y sin forma de comprobar ingresos.'] =
  'You ended up in informal work. More in hand each month, but no statutory bonuses, no insurance, and no way to prove your income.';
TEXTOS_EN.ui['Vas bien. Sigue apartando antes de gastar y cuidando tu historial.'] =
  'You are doing well. Keep setting money aside before you spend, and keep looking after your record.';
