import { GameCaseItem } from '../types/confusionMatrix';

export const GAME_CASES: GameCaseItem[] = [
  // --- SPAM SCENARIO CASES ---
  {
    id: 'spam-1',
    scenarioId: 'spam',
    title: '¡Felicidades! Has ganado 50,000 USD en la lotería del Reino Unido',
    summary: 'Remitente: premios@sorteo-millonario-urgente.xyz. Contiene enlace acortado y solicita datos bancarios en 24h.',
    clues: [
      'Dominio sospechoso y no oficial (.xyz)',
      'Urgencia artificial: "Responde antes de 24 horas"',
      'Promesa de dinero sin haber participado jamás en ningún sorteo'
    ],
    actualPositive: true, // Ground truth: es Spam
    contextDetail: 'Correo no solicitado con técnicas clásicas de phishing y promesa monetaria.',
    explanationIfPositive: '¡Excelente predicción! Al clasificarlo como Positivo (Spam) acertaste: es un Verdadero Positivo (VP). Protegiste al usuario de una estafa.',
    explanationIfNegative: 'Cuidado: lo clasificaste como Legítimo cuando en realidad era Spam. Esto es un Falso Negativo (FN). El usuario verá un correo fraudulento en su bandeja.'
  },
  {
    id: 'spam-2',
    scenarioId: 'spam',
    title: 'Carta de Admisión: Maestría en Ciencias de Datos',
    summary: 'Remitente: admisiones@universidad-nacional.edu. Adjunto: PDF firmado digitalmente con instrucciones de matrícula.',
    clues: [
      'Dominio educativo verificado (.edu)',
      'Personalizado con el nombre completo y número de expediente del postulante',
      'El usuario postuló activamente a este posgrado hace un mes'
    ],
    actualPositive: false, // Ground truth: NO es Spam (es Legítimo)
    contextDetail: 'Mensaje académico legítimo de altísima importancia profesional y personal.',
    explanationIfPositive: '¡Cuidado! Marcaste este correo como Spam cuando era legítimo: cometiste un Falso Positivo (FP). Si se va a Spam, ¡el estudiante podría perder su cupo universitario!',
    explanationIfNegative: '¡Perfecto descarte! Al predecir Negativo (Legítimo) acertaste con la realidad: es un Verdadero Negativo (VN). El correo llega directo a la bandeja.'
  },
  {
    id: 'spam-3',
    scenarioId: 'spam',
    title: 'Boletín de novedades tecnológicas de GitHub',
    summary: 'Remitente: notifications@github.com. Lista los repositorios en tendencia y mejoras de la semana.',
    clues: [
      'Remitente autenticado con SPF y DKIM válido de github.com',
      'Incluye pie de página con enlace funcional de "Desuscribirse"',
      'No solicita contraseñas ni transferencias de dinero'
    ],
    actualPositive: false, // Ground truth: Legítimo
    contextDetail: 'Boletín informativo al que el usuario se suscribió de manera voluntaria.',
    explanationIfPositive: 'Cometiste un Falso Positivo (FP): era un correo legítimo y lo enviaste a Spam. Aunque molesto, no es catastrófico, pero degrada la confianza del usuario.',
    explanationIfNegative: '¡Bien hecho! Es un Verdadero Negativo (VN). Un correo legítimo que se mantiene en la bandeja donde corresponde.'
  },
  {
    id: 'spam-4',
    scenarioId: 'spam',
    title: 'Urgente: Tu cuenta bancaria ha sido bloqueada',
    summary: 'Remitente: seguridad@banc0-nacion-seguro.info. "Haz clic aquí para verificar tu clave secreta de 6 dígitos".',
    clues: [
      'Remitente con sustitución de letras por números (banc0 con cero)',
      'Intento directo de robar credenciales de seguridad',
      'El banco real nunca solicita claves secretas por hipervínculo'
    ],
    actualPositive: true, // Ground truth: Spam/Phishing
    contextDetail: 'Ataque de suplantación de identidad financiera de alto riesgo.',
    explanationIfPositive: '¡Gran detección! Es un Verdadero Positivo (VP). Salvaste al usuario de entregar las llaves de su cuenta bancaria.',
    explanationIfNegative: '¡Peligro! Es un Falso Negativo (FN). Al no detectarlo, el usuario puede asustarse, abrir el enlace y ser víctima de robo de credenciales.'
  },
  {
    id: 'spam-5',
    scenarioId: 'spam',
    title: 'Factura mensual de servicio de Internet y telefonía',
    summary: 'Remitente: facturacion@telecomunicaciones.com. Adjunto: factura_octubre.xml y comprobante en PDF.',
    clues: [
      'Monto coincide con el plan contratado habitual',
      'Enviado en la fecha de corte regular de cada mes',
      'Firma electrónica tributaria válida'
    ],
    actualPositive: false, // Ground truth: Legítimo
    contextDetail: 'Comprobante tributario mensual necesario para la contabilidad del hogar o empresa.',
    explanationIfPositive: 'Falso Positivo (FP): marcaste una factura real como spam. El usuario no la verá y corre el riesgo de que le suspendan el servicio por no pagar.',
    explanationIfNegative: 'Verdadero Negativo (VN): la factura legítima queda en la bandeja principal para su pago oportuno.'
  },

  // --- HEALTH SCENARIO CASES ---
  {
    id: 'health-1',
    scenarioId: 'health',
    title: 'Paciente 101: Dolor precordial opresivo con irradiación a brazo izquierdo',
    summary: 'Varón de 58 años, fumador, presenta dolor torácico de 40 min de duración y sudoración fría profusa.',
    clues: [
      'Electrocardiograma muestra elevación marcada del segmento ST',
      'Troponina I sérica marcadamente elevada (4.8 ng/mL, ref < 0.04)',
      'Historial de hipertensión y dislipidemia descontrolada'
    ],
    actualPositive: true, // Ground truth: Tiene afección cardíaca
    contextDetail: 'Síndrome coronario agudo en curso con necrosis miocárdica activa.',
    explanationIfPositive: '¡Detección salvavidas! Es un Verdadero Positivo (VP). El paciente ingresa de emergencia a hemodinamia y se salva su vida.',
    explanationIfNegative: '¡Error catastrófico! Esto fue un Falso Negativo (FN). Descartaste a un paciente que estaba sufriendo un infarto; las consecuencias son fatales.'
  },
  {
    id: 'health-2',
    scenarioId: 'health',
    title: 'Paciente 102: Chequeo de rutina anual en deportista amateur',
    summary: 'Mujer de 24 años, corredora de fondo, asintomática. Consulta por electrocardiograma precompetitivo.',
    clues: [
      'Bradicardia sinusal fisiológica propia de atleta (48 lpm)',
      'Marcadores cardíacos en sangre normales y ecocardiograma sin anomalías',
      'Sin disnea ni antecedentes familiares de cardiopatía temprana'
    ],
    actualPositive: false, // Ground truth: Sana
    contextDetail: 'Adaptación atlética fisiológica normal del corazón.',
    explanationIfPositive: 'Cometiste un Falso Positivo (FP). Diagnosticaste erróneamente patología en una deportista sana. Se suspenderá su entrenamiento y sufrirá estrés innecesario.',
    explanationIfNegative: '¡Muy bien! Verdadero Negativo (VN). La deportista recibe su certificado de aptitud y sigue con su vida sana.'
  },
  {
    id: 'health-3',
    scenarioId: 'health',
    title: 'Paciente 103: Molestia atípica con factores de riesgo silentes',
    summary: 'Mujer de 64 años, diabética, presenta fatiga inusual y náuseas leves sin dolor clásico.',
    clues: [
      'En mujeres diabéticas los infartos suelen ser indoloros (isquemia silente)',
      'Curva ascendente de biomarcadores enzimáticos cardíacos',
      'Prueba de esfuerzo previa con cambios isquémicos limítrofes'
    ],
    actualPositive: true, // Ground truth: Tiene afección
    contextDetail: 'Presentación atípica frecuente en pacientes con neuropatía autonómica diabética.',
    explanationIfPositive: '¡Excelente ojo clínico! Verdadero Positivo (VP). Identificaste una isquemia silente difícil de detectar.',
    explanationIfNegative: 'Falso Negativo (FN). Confundiste un infarto atípico con una simple indigestión. Este es el motivo por el cual en medicina se valora tanto el Recall.'
  },
  {
    id: 'health-4',
    scenarioId: 'health',
    title: 'Paciente 104: Ansiedad aguda y palpitaciones tras consumo de cafeína',
    summary: 'Estudiante de 21 años en semana de exámenes tras ingerir 4 bebidas energizantes.',
    clues: [
      'Taquicardia sinusal transitoria (105 lpm) sin daño estructural',
      'Troponinas negativas repetidas a las 0h y 3h',
      'Síntomas ceden con hidratación y reposo'
    ],
    actualPositive: false, // Ground truth: Sana (sin cardiopatía)
    contextDetail: 'Efecto estimulante transitorio por cafeína con cuadro de pánico secundario.',
    explanationIfPositive: 'Falso Positivo (FP). Clasificaste la ansiedad como cardiopatía grave. Requerirá más observación y gastos, pero no pone en riesgo su vida.',
    explanationIfNegative: 'Verdadero Negativo (VN). Descartaste correctamente el daño miocárdico y tranquilizaste al estudiante.'
  },

  // --- TRANSIT SCENARIO CASES ---
  {
    id: 'transit-1',
    scenarioId: 'transit',
    title: 'Línea 42: Avenida Central con fuerte aguacero y semáforo averiado',
    summary: 'Viernes 18:30 h (hora pico). Sensor vial reporta velocidad promedio de 4 km/h en el tramo principal.',
    clues: [
      'Colapso vehicular en 3 intersecciones clave consecutivas',
      'Lluvia torrencial que reduce visibilidad y adherencia',
      'Retraso acumulado en el tramo anterior de 22 minutos'
    ],
    actualPositive: true, // Ground truth: Llegará tarde
    contextDetail: 'Retraso crítico severo que impactará a cientos de viajeros.',
    explanationIfPositive: '¡Verdadero Positivo (VP)! Predijiste el retraso y el centro de control puede alertar a la app de los usuarios y activar desvíos.',
    explanationIfNegative: 'Falso Negativo (FN): Aseguraste que llegaría a tiempo, pero el bus llegará 25 minutos tarde. Los usuarios esperarán a oscuras bajo la lluvia.'
  },
  {
    id: 'transit-2',
    scenarioId: 'transit',
    title: 'Línea 15: Domingo por la mañana con carril exclusivo despejado',
    summary: 'Domingo 08:15 h. Monitoreo GPS registra velocidad constante de 38 km/h sin incidentes en la ruta.',
    clues: [
      'Cero congestión en la plataforma vial',
      'Carril segregado "Solo Bus" en óptimas condiciones',
      'El bus precedente va 3 minutos adelantado'
    ],
    actualPositive: false, // Ground truth: A tiempo
    contextDetail: 'Condiciones de tránsito ideales de fin de semana.',
    explanationIfPositive: 'Falso Positivo (FP): Predijiste un retraso fantasma. Si el sistema envía una unidad auxiliar de emergencia, se gastará diésel innecesariamente.',
    explanationIfNegative: 'Verdadero Negativo (VN): Pronosticaste que el bus llegaría puntual y así fue. Operación eficiente y sin sobrecostos.'
  },
  {
    id: 'transit-3',
    scenarioId: 'transit',
    title: 'Línea 78: Autopista Norte con obra de repavimentación imprevista',
    summary: 'Martes 07:45 h. Cuadrilla municipal cerró 2 de 3 carriles sin previo aviso para bacheo.',
    clues: [
      'Fila de vehículos de más de 3.5 kilómetros',
      'La ruta no tiene salidas intermedias de escape',
      'Tiempo de cruce estimado en 35 minutos para un trayecto habitual de 6 minutos'
    ],
    actualPositive: true, // Ground truth: Retrasado
    contextDetail: 'Bloqueo imprevisto de alta densidad matutina.',
    explanationIfPositive: '¡Verdadero Positivo (VP)! El sistema pudo reorganizar los transbordos a tiempo.',
    explanationIfNegative: 'Falso Negativo (FN). El sistema ignoró el colapso vial y los pasajeros perdieron sus conexiones de metro.'
  }
];
