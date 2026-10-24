export type CellType = 'tp' | 'tn' | 'fp' | 'fn';

export interface MatrixValues {
  tp: number; // Verdaderos Positivos
  tn: number; // Verdaderos Negativos
  fp: number; // Falsos Positivos
  fn: number; // Falsos Negativos
}

export type MetricType = 'accuracy' | 'precision' | 'recall' | 'specificity' | 'f1';

export interface MetricCalculation {
  name: string;
  shortName: string;
  value: number | null; // null if division by zero
  formatted: string;
  percentage: string;
  formula: string;
  formulaExpanded: string;
  numeratorCells: CellType[];
  denominatorCells: CellType[];
  numeratorValue: number;
  denominatorValue: number;
  plainDescription: string;
  interpretation: string;
  analogy: string;
}

export type ScenarioId = 'spam' | 'health' | 'transit';

export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  tagline: string;
  icon: string;
  positiveLabel: string;
  negativeLabel: string;
  positiveDescription: string;
  negativeDescription: string;
  fpConsequence: {
    title: string;
    description: string;
    severity: 'media' | 'alta' | 'crítica';
  };
  fnConsequence: {
    title: string;
    description: string;
    severity: 'media' | 'alta' | 'crítica';
  };
  contextNote: string;
  defaultValues: MatrixValues;
}

export interface GameCaseItem {
  id: string;
  scenarioId: ScenarioId;
  title: string;
  summary: string;
  clues: string[];
  actualPositive: boolean; // Ground truth
  contextDetail: string;
  explanationIfPositive: string;
  explanationIfNegative: string;
}

export interface ChallengeQuestion {
  id: string;
  level: number;
  title: string;
  scenarioContext?: string;
  matrixContext?: MatrixValues;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
