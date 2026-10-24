import { ScenarioDefinition } from '../types/confusionMatrix';

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  health: {
    id: 'health',
    title: 'Diagnóstico Médico Preventivo',
    tagline: 'Detección temprana de una afección cardíaca en chequeos clínicos',
    icon: 'HeartPulse',
    positiveLabel: 'Presenta Afección (Positivo)',
    negativeLabel: 'Paciente Sano (Negativo)',
    positiveDescription: 'El paciente presenta marcadores biológicos de riesgo cardíaco.',
    negativeDescription: 'El paciente no presenta la afección cardíaca.',
    fpConsequence: {
      title: 'Falso Positivo (Falsa alarma médica)',
      description: 'El paciente sano recibe un diagnóstico preliminar positivo. Deberá someterse a pruebas invasivas adicionales (cateterismo, estrés farmacológico) y sufre angustia emocional innecesaria, aunque su vida no corre peligro inminente.',
      severity: 'media'
    },
    fnConsequence: {
      title: 'Falso Negativo (Omisión de tratamiento)',
      description: 'El paciente con riesgo real recibe un resultado falsamente limpio ("usted está sano") y se va a casa sin medicación preventiva. Puede sufrir un infarto evitable en los próximos meses.',
      severity: 'crítica'
    },
    contextNote: 'En salud pública y medicina preventiva, generalmente se prefiere maximizar la Sensibilidad (Recall) para minimizar los Falsos Negativos, aceptando algunos Falsos Positivos que luego se filtrarán con pruebas confirmatorias.',
    defaultValues: {
      tp: 85,
      tn: 820,
      fp: 80,
      fn: 15
    }
  },
  spam: {
    id: 'spam',
    title: 'Filtro de Correo Anti-Spam',
    tagline: 'Clasificación de correos entrantes en bandeja de entrada o carpeta de no deseados',
    icon: 'MailCheck',
    positiveLabel: 'Correo Spam / Malicioso (Positivo)',
    negativeLabel: 'Correo Legítimo (Negativo)',
    positiveDescription: 'Mensaje publicitario abusivo, phishing o estafa financiera.',
    negativeDescription: 'Mensaje auténtico de trabajo, familia, facturas o notificaciones.',
    fpConsequence: {
      title: 'Falso Positivo (Pérdida de correo vital)',
      description: 'Un correo crucial (ej. carta de aceptación universitaria, factura de cliente o confirmación de vuelo) es catalogado como Spam y archivado sin que el usuario lo lea. Puede provocar pérdidas económicas o laborales reales.',
      severity: 'crítica'
    },
    fnConsequence: {
      title: 'Falso Negativo (Molestia leve en bandeja)',
      description: 'Un correo spam o publicidad de criptomonedas aparece en la bandeja principal. El usuario simplemente lo borra manualmente en 2 segundos.',
      severity: 'media'
    },
    contextNote: 'En filtros de spam, se exige una Precisión extremadamente alta (Precision > 99%) para evitar a toda costa Falsos Positivos, aun si ocasionalmente se cuela algún spam en la bandeja (Falso Negativo tolerable).',
    defaultValues: {
      tp: 240,
      tn: 710,
      fp: 10,
      fn: 40
    }
  },
  transit: {
    id: 'transit',
    title: 'Movilidad Urbana: Buses Inteligentes',
    tagline: 'Predicción en tiempo real de retrasos en las líneas principales de transporte',
    icon: 'Bus',
    positiveLabel: 'Bus Retrasado >15 min (Positivo)',
    negativeLabel: 'Bus a Tiempo (Negativo)',
    positiveDescription: 'La unidad experimentará una demora severa por congestión o avería.',
    negativeDescription: 'La unidad transita dentro del horario oficial programado.',
    fpConsequence: {
      title: 'Falso Positivo (Sobre-costo de flota)',
      description: 'El sistema predice un retraso que no ocurre y despacha un bus de refuerzo vacío, gastando combustible, chófer y desgastando recursos públicos.',
      severity: 'media'
    },
    fnConsequence: {
      title: 'Falso Negativo (Colapso de estaciones)',
      description: 'El sistema no predice el retraso grave del bus. Las paradas se saturan con cientos de pasajeros furiosos, causando que lleguen tarde a sus empleos o colegios.',
      severity: 'alta'
    },
    contextNote: 'En transporte urbano se busca un equilibrio (F1-Score) para regular la frecuencia de despacho sin desbordar el presupuesto operativo ni arruinar la experiencia ciudadana.',
    defaultValues: {
      tp: 110,
      tn: 520,
      fp: 45,
      fn: 25
    }
  }
};
