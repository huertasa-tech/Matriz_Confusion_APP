import { ChallengeQuestion, Badge } from '../types/confusionMatrix';

export const LEVELS = [
  {
    level: 1,
    title: 'Nivel 1: Reconoce la Matriz',
    description: 'Aprende a ubicar cada uno de los 4 cuadrantes fundamentales según la Realidad y la Predicción.',
    badgeId: 'badge-1'
  },
  {
    level: 2,
    title: 'Nivel 2: Clasifica los Casos',
    description: 'Determina si una situación concreta es un acierto o un error de clasificación.',
    badgeId: 'badge-2'
  },
  {
    level: 3,
    title: 'Nivel 3: Domina los Errores',
    description: 'Distingue con precisión quirúrgica entre el Error Tipo I (Falso Positivo) y el Error Tipo II (Falso Negativo).',
    badgeId: 'badge-3'
  },
  {
    level: 4,
    title: 'Nivel 4: Interpreta las Métricas',
    description: 'Comprende el significado profundo de Accuracy, Precision, Recall, Especificidad y F1-Score.',
    badgeId: 'badge-4'
  },
  {
    level: 5,
    title: 'Nivel 5: Toma Decisiones en Producción',
    description: 'Selecciona la estrategia y el modelo adecuado equilibrando los costos de equivocarse.',
    badgeId: 'badge-5'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Explorador de Cuadrantes',
    description: 'Superaste el Nivel 1 identificando las 4 celdas de la matriz de confusión.',
    icon: 'Compass',
    unlocked: false
  },
  {
    id: 'badge-2',
    title: 'Clasificador Sagaz',
    description: 'Superaste el Nivel 2 categorizando situaciones reales con exactitud.',
    icon: 'Target',
    unlocked: false
  },
  {
    id: 'badge-3',
    title: 'Domador de Errores',
    description: 'Superaste el Nivel 3 diferenciando Falsos Positivos de Falsos Negativos.',
    icon: 'ShieldAlert',
    unlocked: false
  },
  {
    id: 'badge-4',
    title: 'Maestro de Métricas',
    description: 'Superaste el Nivel 4 interpretando fórmulas y porcentajes de evaluación.',
    icon: 'Gauge',
    unlocked: false
  },
  {
    id: 'badge-5',
    title: 'Científico de Datos Senior',
    description: 'Superaste el Nivel 5 tomando decisiones informadas según el costo de los errores.',
    icon: 'Award',
    unlocked: false
  }
];

export const CHALLENGES: ChallengeQuestion[] = [
  // --- NIVEL 1: RECONOCE LA MATRIZ ---
  {
    id: 'l1-q1',
    level: 1,
    title: 'Concepto Fundamental: ¿Qué es un Falso Positivo?',
    question: 'Si un modelo predice que un correo es SPAM (positivo), pero en realidad es un mensaje auténtico de un amigo (negativo), ¿qué celda de la matriz representa este resultado?',
    options: [
      {
        id: 'a',
        text: 'Falso Positivo (FP)',
        isCorrect: true,
        explanation: '¡Correcto! El modelo dio positivo ("es spam"), pero mintió/falló porque en realidad era negativo (legítimo). Es una Falsa Alarma.'
      },
      {
        id: 'b',
        text: 'Verdadero Positivo (VP)',
        isCorrect: false,
        explanation: 'Incorrecto. Para ser Verdadero Positivo, el correo tendría que haber sido realmente spam en la vida real.'
      },
      {
        id: 'c',
        text: 'Falso Negativo (FN)',
        isCorrect: false,
        explanation: 'Incorrecto. Un falso negativo ocurre cuando el modelo predice negativo pero la realidad era positiva.'
      },
      {
        id: 'd',
        text: 'Verdadero Negativo (VN)',
        isCorrect: false,
        explanation: 'Incorrecto. En este caso el modelo emitió una predicción positiva ("Spam"), no negativa.'
      }
    ],
    hint: 'Piensa en dos partes: "Positivo" porque el modelo dijo que sí tenía la condición, y "Falso" porque se equivocó.'
  },
  {
    id: 'l1-q2',
    level: 1,
    title: 'Descarte Correcto: ¿Qué es un Verdadero Negativo?',
    question: 'En un test médico para detectar una enfermedad, un paciente completamente sano recibe un resultado que dice "Sin enfermedad". ¿Cómo se clasifica esto?',
    options: [
      {
        id: 'a',
        text: 'Falso Negativo (FN)',
        isCorrect: false,
        explanation: 'No, porque el paciente realmente no tiene la enfermedad. El test no cometió ningún error.'
      },
      {
        id: 'b',
        text: 'Verdadero Negativo (VN)',
        isCorrect: true,
        explanation: '¡Exacto! El paciente está sano (negativo) y el test predijo negativo con total verdad. Descarte impecable.'
      },
      {
        id: 'c',
        text: 'Verdadero Positivo (VP)',
        isCorrect: false,
        explanation: 'No, porque el resultado emitido fue negativo ("Sin enfermedad"), no positivo.'
      },
      {
        id: 'd',
        text: 'Falso Positivo (FP)',
        isCorrect: false,
        explanation: 'No, una falsa alarma ocurriría si le dijeran que está enfermo cuando no lo está.'
      }
    ],
    hint: 'La realidad es que no hay enfermedad (negativo) y el modelo dijo que no hay enfermedad (negativo).'
  },
  {
    id: 'l1-q3',
    level: 1,
    title: 'La Omisión Peligrosa: ¿Qué es un Falso Negativo?',
    question: 'Un paciente sí tiene apendicitis aguda (positivo), pero el algoritmo médico predice "Sin hallazgos patológicos" (negativo) y lo envía a casa. ¿Qué tipo de celda es?',
    options: [
      {
        id: 'a',
        text: 'Falso Negativo (FN)',
        isCorrect: true,
        explanation: '¡Acertaste! El modelo predijo negativo, pero la realidad era positiva. Es una omisión con grave riesgo para la salud.'
      },
      {
        id: 'b',
        text: 'Falso Positivo (FP)',
        isCorrect: false,
        explanation: 'No, el modelo no emitió una alarma positiva, sino un resultado falsamente tranquilizador.'
      },
      {
        id: 'c',
        text: 'Verdadero Positivo (VP)',
        isCorrect: false,
        explanation: 'No, el modelo no detectó la condición.'
      },
      {
        id: 'd',
        text: 'Verdadero Negativo (VN)',
        isCorrect: false,
        explanation: 'No, porque el paciente realmente estaba enfermo.'
      }
    ],
    hint: 'El modelo dijo que NO había problema, pero SÍ lo había: es un error de omisión o "falso negativo".'
  },

  // --- NIVEL 2: CLASIFICA LOS CASOS ---
  {
    id: 'l2-q1',
    level: 2,
    title: 'Sistema de Alarma contra Incendios',
    question: 'Una alarma de humo en un edificio suena ruidosamente a las 3:00 AM. Al llegar los bomberos, descubren que un vecino quemó pan tostado pero no hay fuego ni peligro. ¿Cómo clasifica el sistema este incidente?',
    options: [
      {
        id: 'a',
        text: 'Falso Positivo (Falsa alarma)',
        isCorrect: true,
        explanation: '¡Correcto! El sensor predijo peligro/incendio (positivo), pero no había un incendio real (negativo).'
      },
      {
        id: 'b',
        text: 'Verdadero Positivo',
        isCorrect: false,
        explanation: 'Incorrecto. Solo sería VP si hubiera habido un incendio real con llamas y riesgo estructural.'
      },
      {
        id: 'c',
        text: 'Falso Negativo',
        isCorrect: false,
        explanation: 'Incorrecto. FN significaría que había un incendio y la alarma se quedó en silencio.'
      },
      {
        id: 'd',
        text: 'Verdadero Negativo',
        isCorrect: false,
        explanation: 'Incorrecto. El sistema activó la alarma, por lo que predijo positivo.'
      }
    ],
    hint: 'La alarma se disparó (predicción positiva), pero no había peligro real (condición negativa).'
  },
  {
    id: 'l2-q2',
    level: 2,
    title: 'Radar de Velocidad en Autopista',
    question: 'Un vehículo transita a 140 km/h en una zona con límite de 80 km/h. La cámara inteligente toma la fotografía y emite la multa correspondiente. ¿Qué es este evento?',
    options: [
      {
        id: 'a',
        text: 'Verdadero Positivo (Detección certera)',
        isCorrect: true,
        explanation: '¡Excelente! El conductor infringía el límite (positivo) y el radar lo detectó y multó (positivo).'
      },
      {
        id: 'b',
        text: 'Falso Positivo',
        isCorrect: false,
        explanation: 'No, porque el vehículo realmente iba con exceso de velocidad; la infracción es real.'
      },
      {
        id: 'c',
        text: 'Verdadero Negativo',
        isCorrect: false,
        explanation: 'No, porque la condición de exceso de velocidad sí existía.'
      },
      {
        id: 'd',
        text: 'Falso Negativo',
        isCorrect: false,
        explanation: 'No, el sistema no dejó escapar la infracción.'
      }
    ],
    hint: 'La infracción era real y el sistema la atrapó con éxito.'
  },

  // --- NIVEL 3: DOMINA LOS ERRORES ---
  {
    id: 'l3-q1',
    level: 3,
    title: 'Dilema Médico vs Dilema Spam',
    question: '¿Por qué en un diagnóstico de cáncer de mama se considera mucho más grave un Falso Negativo que un Falso Positivo?',
    options: [
      {
        id: 'a',
        text: 'Porque un Falso Negativo deja a la paciente enferma sin tratamiento, arriesgando su vida; mientras que un Falso Positivo solo genera una prueba confirmatoria posterior.',
        isCorrect: true,
        explanation: '¡Perfecto! El costo de omitir un cáncer es fatal e irreversible. En cambio, un falso positivo genera angustia temporal, pero se aclara con una biopsia o ecografía.'
      },
      {
        id: 'b',
        text: 'Porque los Falsos Positivos nunca cuestan dinero en un hospital.',
        isCorrect: false,
        explanation: 'Incorrecto. Los falsos positivos sí generan costos por pruebas adicionales, pero no ponen en riesgo vital inmediato al paciente sano.'
      },
      {
        id: 'c',
        text: 'Porque matemáticamente un Falso Negativo siempre reduce más el Accuracy.',
        isCorrect: false,
        explanation: 'Incorrecto. En la fórmula de Accuracy, un FN y un FP tienen exactamente el mismo peso aritmético; la diferencia es humana y clínica.'
      },
      {
        id: 'd',
        text: 'Porque los Falsos Negativos solo ocurren cuando el modelo fue mal entrenado.',
        isCorrect: false,
        explanation: 'Incorrecto. Ningún modelo es perfecto y el compromiso entre ambos errores depende del umbral de decisión.'
      }
    ],
    hint: 'Compara las consecuencias vitales de enviar a casa a una persona enferma versus hacerle un examen extra a una persona sana.'
  },
  {
    id: 'l3-q2',
    level: 3,
    title: 'Filtro de Fraude Bancario en Tarjetas',
    question: 'Un cliente intenta pagar su cena en el extranjero y el banco bloquea su tarjeta diciendo "Transacción sospechosa de fraude", aunque es el titular legítimo. ¿Qué error cometió el modelo del banco?',
    options: [
      {
        id: 'a',
        text: 'Falso Positivo (Error Tipo I)',
        isCorrect: true,
        explanation: '¡Exacto! El modelo predijo Positivo ("Es fraude"), pero la transacción era Negativa ("Legítima"). El cliente pasa un mal momento en el restaurante.'
      },
      {
        id: 'b',
        text: 'Falso Negativo (Error Tipo II)',
        isCorrect: false,
        explanation: 'No, un FN sería permitir que un ladrón gaste el dinero sin que el banco se dé cuenta.'
      },
      {
        id: 'c',
        text: 'Verdadero Positivo',
        isCorrect: false,
        explanation: 'No, porque la transacción no era un fraude real.'
      },
      {
        id: 'd',
        text: 'Verdadero Negativo',
        isCorrect: false,
        explanation: 'No, porque la tarjeta fue bloqueada indebidamente.'
      }
    ],
    hint: 'El banco dio una falsa alarma de fraude sobre una compra válida.'
  },

  // --- NIVEL 4: INTERPRETA LAS MÉTRICAS ---
  {
    id: 'l4-q1',
    level: 4,
    title: 'La Trampa de la Exactitud (Accuracy)',
    question: 'En un chequeo a 1,000 personas, solo 5 tienen una enfermedad rarísima (995 están sanas). Un modelo perezoso dice que "TODO EL MUNDO ESTÁ SANO" (predice siempre negativo). ¿Cuál es su Exactitud (Accuracy)?',
    options: [
      {
        id: 'a',
        text: '99.5% de Exactitud, pero el modelo es completamente inútil porque su Recall es 0%.',
        isCorrect: true,
        explanation: '¡Impresionante análisis! Acierta 995 de 1,000 casos (99.5% de Accuracy), pero no detecta a NINGUNO de los 5 enfermos (Recall = 0/5 = 0%). Esto demuestra por qué el Accuracy es engañoso en clases desbalanceadas.'
      },
      {
        id: 'b',
        text: '50% de Exactitud porque solo acierta la mitad de las clases.',
        isCorrect: false,
        explanation: 'Incorrecto. La fórmula de Accuracy cuenta casos totales: (0 + 995) / 1000 = 99.5%.'
      },
      {
        id: 'c',
        text: '0% de Exactitud porque no predijo ningún positivo.',
        isCorrect: false,
        explanation: 'Incorrecto. El Recall es 0%, pero la Exactitud global es del 99.5%.'
      },
      {
        id: 'd',
        text: 'No se puede calcular sin conocer los Falsos Positivos.',
        isCorrect: false,
        explanation: 'Incorrecto. Como predijo todo negativo, los FP son exactamente 0.'
      }
    ],
    hint: 'Calcula cuántos sanos acertó (995) sobre el total de personas (1000).'
  },
  {
    id: 'l4-q2',
    level: 4,
    title: 'Precisión vs Sensibilidad (Recall)',
    question: '¿Qué fórmula mide: "De todas las alertas que disparó el modelo, ¿qué porcentaje fueron realmente ciertas?"',
    options: [
      {
        id: 'a',
        text: 'Precisión = VP / (VP + FP)',
        isCorrect: true,
        explanation: '¡Correcto! En el denominador están todas las predicciones positivas (VP + FP), y en el numerador solo los aciertos positivos (VP).'
      },
      {
        id: 'b',
        text: 'Sensibilidad (Recall) = VP / (VP + FN)',
        isCorrect: false,
        explanation: 'No, Recall mide cuántos de los positivos REALES fueron encontrados, no cuántas de las alertas emitidas eran ciertas.'
      },
      {
        id: 'c',
        text: 'Especificidad = VN / (VN + FP)',
        isCorrect: false,
        explanation: 'No, mide la tasa de negativos reales correctamente descartados.'
      },
      {
        id: 'd',
        text: 'Exactitud = (VP + VN) / Total',
        isCorrect: false,
        explanation: 'No, mide el porcentaje global de aciertos sin enfocarse en las alertas positivas.'
      }
    ],
    hint: 'Revisa qué hay en el denominador: las alertas disparadas son las predicciones positivas (VP + FP).'
  },

  // --- NIVEL 5: TOMA DECISIONES EN PRODUCCIÓN ---
  {
    id: 'l5-q1',
    level: 5,
    title: 'Elige el Modelo para un Hospital',
    question: 'Un hospital debe implementar un modelo de detección de sepsis temprana en la Unidad de Cuidados Intensivos. Tienen dos candidatos. ¿Cuál deberían elegir?',
    options: [
      {
        id: 'a',
        text: 'Modelo B: Recall del 98% y Precisión del 75% (prioriza no dejar morir a ningún paciente por sepsis, aunque haya algunas falsas alarmas que el personal revise).',
        isCorrect: true,
        explanation: '¡Excelente decisión clínica! En emergencias con riesgo vital, un Falso Negativo significa muerte. Es preferible que una enfermera revise unas pocas alarmas extras a que un paciente crítico pase desapercibido.'
      },
      {
        id: 'b',
        text: 'Modelo A: Precisión del 99% pero Recall del 65% (cuando suena la alarma es casi seguro que es sepsis, pero deja escapar al 35% de los enfermos).',
        isCorrect: false,
        explanation: 'Peligroso: un Recall del 65% significa que 35 de cada 100 pacientes con sepsis no recibirán antibióticos a tiempo.'
      },
      {
        id: 'c',
        text: 'Ninguno de los dos, hasta que un modelo alcance 100% en todas las métricas.',
        isCorrect: false,
        explanation: 'En el mundo real no existen modelos 100% perfectos; la ingeniería de datos consiste en gestionar el compromiso (trade-off).'
      },
      {
        id: 'd',
        text: 'El que tenga mayor Especificidad sin importar el Recall.',
        isCorrect: false,
        explanation: 'Incorrecto. La prioridad médica aquí es rescatar a los enfermos (positivos).'
      }
    ],
    hint: 'Pregúntate: ¿Qué es peor en una UCI? ¿Que suene una alarma innecesaria o que un paciente muera porque nadie se enteró?'
  },
  {
    id: 'l5-q2',
    level: 5,
    title: 'Elige el Modelo para Bloquear Spam en Gmail',
    question: 'El equipo de correo de Google debe elegir un filtro de spam para 1,500 millones de usuarios. ¿Qué métrica deben cuidar con mayor rigor extremo para evitar quejas masivas?',
    options: [
      {
        id: 'a',
        text: 'Alta Precisión (Precision > 99.9%) para evitar que correos de trabajo o emergencias familiares terminen en la papelera.',
        isCorrect: true,
        explanation: '¡Brillante! Si la precisión baja, los usuarios sufrirán Falsos Positivos (correos vitales perdidos). Es mucho más tolerable que un spam ocasional llegue a la bandeja a que no recibas la oferta de empleo de tu vida.'
      },
      {
        id: 'b',
        text: 'Alto Recall sin importar la Precisión, para que no entre ni una sola publicidad.',
        isCorrect: false,
        explanation: 'Mala idea: para capturar el 100% del spam terminarás enviando cientos de correos legítimos al basurero.'
      },
      {
        id: 'c',
        text: 'Solo fijarse en el tamaño del modelo en megabytes.',
        isCorrect: false,
        explanation: 'Incorrecto. El impacto en la experiencia del usuario depende de la tasa de Falsos Positivos.'
      },
      {
        id: 'd',
        text: 'Ignorar la matriz de confusión y usar solo el promedio de tiempo de respuesta.',
        isCorrect: false,
        explanation: 'Incorrecto. La evaluación de calidad requiere la matriz de confusión.'
      }
    ],
    hint: 'Piensa en qué te daría más rabia: ¿ver una publicidad en tu buzón, o que borren sin avisarte el correo con tu pasaje de avión?'
  }
];
