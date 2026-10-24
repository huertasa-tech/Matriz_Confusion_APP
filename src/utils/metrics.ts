import { MatrixValues, MetricCalculation, MetricType, CellType } from '../types/confusionMatrix';

export function calculateMetrics(matrix: MatrixValues): Record<MetricType, MetricCalculation> {
  const { tp, tn, fp, fn } = matrix;
  const total = tp + tn + fp + fn;

  // 1. Accuracy (Exactitud)
  const accNumerator = tp + tn;
  const accDenominator = total;
  const accVal = accDenominator > 0 ? accNumerator / accDenominator : null;

  // 2. Precision (Precisión)
  const precNumerator = tp;
  const precDenominator = tp + fp;
  const precVal = precDenominator > 0 ? precNumerator / precDenominator : null;

  // 3. Recall / Sensitivity (Sensibilidad o Exhaustividad)
  const recNumerator = tp;
  const recDenominator = tp + fn;
  const recVal = recDenominator > 0 ? recNumerator / recDenominator : null;

  // 4. Specificity (Especificidad)
  const specNumerator = tn;
  const specDenominator = tn + fp;
  const specVal = specDenominator > 0 ? specNumerator / specDenominator : null;

  // 5. F1-Score (Media Armónica entre Precision y Recall)
  let f1Val: number | null = null;
  if (precVal !== null && recVal !== null) {
    const sum = precVal + recVal;
    if (sum > 0) {
      f1Val = (2 * precVal * recVal) / sum;
    } else {
      f1Val = 0;
    }
  }

  const formatValue = (v: number | null) => (v === null ? 'No definido' : v.toFixed(3));
  const formatPercentage = (v: number | null) => (v === null ? 'N/D' : `${(v * 100).toFixed(1)}%`);

  return {
    accuracy: {
      name: 'Exactitud',
      shortName: 'Accuracy',
      value: accVal,
      formatted: formatValue(accVal),
      percentage: formatPercentage(accVal),
      formula: 'Accuracy = (VP + VN) / (VP + VN + FP + FN)',
      formulaExpanded: `${tp} + ${tn} / (${tp} + ${tn} + ${fp} + ${fn}) = ${accNumerator} / ${accDenominator}`,
      numeratorCells: ['tp', 'tn'] as CellType[],
      denominatorCells: ['tp', 'tn', 'fp', 'fn'] as CellType[],
      numeratorValue: accNumerator,
      denominatorValue: accDenominator,
      plainDescription: 'Proporción total de predicciones correctas sobre todos los casos analizados.',
      interpretation: 'Mide el rendimiento global. Cuidado: puede ser engañosa si los datos están muy desbalanceados.',
      analogy: 'De todos los disparos realizados, ¿qué porcentaje dio en el blanco?'
    },
    precision: {
      name: 'Precisión',
      shortName: 'Precision',
      value: precVal,
      formatted: formatValue(precVal),
      percentage: formatPercentage(precVal),
      formula: 'Precision = VP / (VP + FP)',
      formulaExpanded: `${tp} / (${tp} + ${fp}) = ${precNumerator} / ${precDenominator}`,
      numeratorCells: ['tp'] as CellType[],
      denominatorCells: ['tp', 'fp'] as CellType[],
      numeratorValue: precNumerator,
      denominatorValue: precDenominator,
      plainDescription: 'De todos los casos que el modelo predijo como positivos, ¿cuántos lo eran en realidad?',
      interpretation: 'Indica la confiabilidad de una alarma positiva. Alta precisión significa muy pocos falsos positivos.',
      analogy: 'Cuando suena la sirena de bomberos, ¿qué porcentaje de veces hay un fuego de verdad?'
    },
    recall: {
      name: 'Sensibilidad',
      shortName: 'Recall',
      value: recVal,
      formatted: formatValue(recVal),
      percentage: formatPercentage(recVal),
      formula: 'Recall = VP / (VP + FN)',
      formulaExpanded: `${tp} / (${tp} + ${fn}) = ${recNumerator} / ${recDenominator}`,
      numeratorCells: ['tp'] as CellType[],
      denominatorCells: ['tp', 'fn'] as CellType[],
      numeratorValue: recNumerator,
      denominatorValue: recDenominator,
      plainDescription: 'De todos los casos que realmente eran positivos en la realidad, ¿cuántos logró encontrar el modelo?',
      interpretation: 'Mide la capacidad de no dejar escapar ningún caso positivo. Vital en medicina y seguridad.',
      analogy: 'Si hay 100 personas enfermas en una sala, ¿a cuántas de ellas logra diagnosticar el test?'
    },
    specificity: {
      name: 'Especificidad',
      shortName: 'Specificity',
      value: specVal,
      formatted: formatValue(specVal),
      percentage: formatPercentage(specVal),
      formula: 'Specificity = VN / (VN + FP)',
      formulaExpanded: `${tn} / (${tn} + ${fp}) = ${specNumerator} / ${specDenominator}`,
      numeratorCells: ['tn'] as CellType[],
      denominatorCells: ['tn', 'fp'] as CellType[],
      numeratorValue: specNumerator,
      denominatorValue: specDenominator,
      plainDescription: 'De todos los casos que realmente eran negativos, ¿cuántos descartó correctamente el modelo?',
      interpretation: 'Mide la capacidad de confirmar que una persona sana está sana o que un correo limpio pase sin problemas.',
      analogy: 'De las personas que no tienen la enfermedad, ¿a cuántas se les confirma con certeza que están sanas?'
    },
    f1: {
      name: 'Puntuación F1',
      shortName: 'F1-Score',
      value: f1Val,
      formatted: formatValue(f1Val),
      percentage: formatPercentage(f1Val),
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      formulaExpanded: precVal !== null && recVal !== null && (precVal + recVal) > 0
        ? `2 × (${precVal.toFixed(3)} × ${recVal.toFixed(3)}) / (${precVal.toFixed(3)} + ${recVal.toFixed(3)})`
        : 'Indefinido (denominador cero)',
      numeratorCells: ['tp'] as CellType[],
      denominatorCells: ['tp', 'fp', 'fn'] as CellType[],
      numeratorValue: 2 * (precVal || 0) * (recVal || 0),
      denominatorValue: (precVal || 0) + (recVal || 0),
      plainDescription: 'Media armónica entre Precisión y Sensibilidad. Busca el balance justo entre ambas.',
      interpretation: 'Es excelente cuando hay clases desbalanceadas porque penaliza fuertemente si una de las dos métricas es muy baja.',
      analogy: 'Un velocista que también debe correr maratón: solo obtiene buena nota si rinde en ambas disciplinas.'
    }
  };
}

export const CELL_DEFINITIONS: Record<CellType, {
  name: string;
  abbreviation: string;
  reality: 'Positivo' | 'Negativo';
  prediction: 'Positivo' | 'Negativo';
  badgeType: 'success' | 'danger' | 'warning';
  title: string;
  concept: string;
  statisticalTerm: string;
  explanation: string;
  example: string;
  consequence: string;
}> = {
  tp: {
    name: 'Verdadero Positivo',
    abbreviation: 'VP / TP',
    reality: 'Positivo',
    prediction: 'Positivo',
    badgeType: 'success',
    title: 'Acierto Positivo (Detección exitosa)',
    concept: 'El modelo predijo POSITIVO y la realidad es POSITIVO.',
    statisticalTerm: 'Acierto en Hipótesis Alternativa',
    explanation: 'El sistema identificó con éxito la presencia de la condición o evento que se buscaba detectar.',
    example: 'El test detectó una enfermedad y el paciente realmente la padece; o el filtro marcó como Spam un correo basura real.',
    consequence: 'Éxito operativo: se activa el tratamiento médico a tiempo o el usuario no ve publicidad engañosa en su bandeja.'
  },
  tn: {
    name: 'Verdadero Negativo',
    abbreviation: 'VN / TN',
    reality: 'Negativo',
    prediction: 'Negativo',
    badgeType: 'success',
    title: 'Acierto Negativo (Descarte correcto)',
    concept: 'El modelo predijo NEGATIVO y la realidad es NEGATIVO.',
    statisticalTerm: 'Acierto en Hipótesis Nula',
    explanation: 'El sistema determinó correctamente la ausencia de la condición.',
    example: 'El test dio negativo a una persona sana, o el filtro dejó pasar a la bandeja un correo legítimo de tu jefe.',
    consequence: 'Tranquilidad y flujo normal: la persona sana se va a casa tranquila y el trabajo continúa sin interrupciones.'
  },
  fp: {
    name: 'Falso Positivo',
    abbreviation: 'FP',
    reality: 'Negativo',
    prediction: 'Positivo',
    badgeType: 'warning',
    title: 'Error Tipo I (Falsa Alarma)',
    concept: 'El modelo predijo POSITIVO, pero la realidad era NEGATIVO.',
    statisticalTerm: 'Error Tipo I (Falsa Alarma)',
    explanation: 'El sistema dio la alarma cuando en realidad todo estaba en orden o normal.',
    example: 'Se envía a la carpeta de Spam una oferta de trabajo importante de tu universidad, o se asusta a un paciente sano con un diagnóstico positivo que requerirá una dolorosa biopsia innecesaria.',
    consequence: 'Pérdida de confianza, costos innecesarios en pruebas confirmatorias o correos críticos extraviados.'
  },
  fn: {
    name: 'Falso Negativo',
    abbreviation: 'FN',
    reality: 'Positivo',
    prediction: 'Negativo',
    badgeType: 'danger',
    title: 'Error Tipo II (Omisión Peligrosa)',
    concept: 'El modelo predijo NEGATIVO, pero la realidad era POSITIVO.',
    statisticalTerm: 'Error Tipo II (Falso Tranquilizante)',
    explanation: 'El sistema omitió la condición real y aseguró erróneamente que no había nada.',
    example: 'Un paciente con una enfermedad grave recibe un resultado negativo y se va a casa creyendo que está sano mientras la enfermedad progresa; o un malware peligroso entra como si fuera inocuo.',
    consequence: 'Riesgo crítico o catastrófico: falta de intervención oportuna, agravamiento de enfermedades o brechas de seguridad.'
  }
};
