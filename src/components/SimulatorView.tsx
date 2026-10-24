import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MatrixValues, MetricType, ScenarioDefinition, CellType } from '../types/confusionMatrix';
import { MatrixGrid } from './MatrixGrid';
import { MetricsPanel } from './MetricsPanel';
import { calculateMetrics } from '../utils/metrics';
import { sound } from '../utils/audio';

interface SimulatorViewProps {
  scenario: ScenarioDefinition;
  matrixValues: MatrixValues;
  onChangeMatrix: (values: MatrixValues) => void;
  onSelectCell: (cell: CellType) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  scenario,
  matrixValues,
  onChangeMatrix,
  onSelectCell
}) => {
  const [activeMetricType, setActiveMetricType] = useState<MetricType | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const metrics = calculateMetrics(matrixValues);

  const updateCell = (cell: CellType, delta: number) => {
    const nextVal = Math.max(0, matrixValues[cell] + delta);
    onChangeMatrix({
      ...matrixValues,
      [cell]: nextVal
    });
  };

  const handlePreset = (presetValues: MatrixValues) => {
    sound.playPop();
    onChangeMatrix(presetValues);
  };

  const presets = [
    {
      name: 'Equilibrado Óptimo',
      desc: 'Buen balance entre alta precisión y alto recall.',
      values: { tp: 120, tn: 800, fp: 15, fn: 10 }
    },
    {
      name: 'Modelo Paranoico (Todo Positivo)',
      desc: 'Marca todo como positivo: Recall 100%, pero la Precisión colapsa por tantos Falsos Positivos.',
      values: { tp: 130, tn: 0, fp: 815, fn: 0 }
    },
    {
      name: 'Modelo Perezoso (Todo Negativo)',
      desc: 'Dice que nada pasa: Especificidad 100%, pero Recall es 0% (omite todos los positivos).',
      values: { tp: 0, tn: 815, fp: 0, fn: 130 }
    },
    {
      name: 'Desbalance Extremo (Trampa de Accuracy)',
      desc: '99% de personas sanas y 1% enfermas: el modelo acierta el 99% sin detectar la enfermedad.',
      values: { tp: 0, tn: 990, fp: 0, fn: 10 }
    },
    {
      name: 'Moneda al Aire (Azar 50/50)',
      desc: 'Comportamiento equivalente a adivinar sin aprender nada.',
      values: { tp: 250, tn: 250, fp: 250, fn: 250 }
    }
  ];

  const questions = [
    {
      q: '¿Qué sucede si aumentan los Falsos Positivos (FP)?',
      answer: 'La PRECISIÓN cae bruscamente. Cada falso positivo es una alarma infundada. En spam, significa que correos importantes van a la basura; en compras con tarjeta, que se bloquean transacciones legítimas. Sin embargo, el Recall no se ve afectado porque la cantidad de casos positivos reales sigue intacta.'
    },
    {
      q: '¿Qué pasa si el modelo deja de detectar casos positivos (aumentan los Falsos Negativos)?',
      answer: 'El RECALL (Sensibilidad) se desploma hacia cero. El modelo se vuelve "ciego" ante el peligro real. En medicina, esto es crítico: los pacientes enfermos son enviados a casa sin saber que tienen una patología grave.'
    },
    {
      q: '¿Por qué la Exactitud (Accuracy) puede mentirnos cuando los datos están desbalanceados?',
      answer: 'Si el 99% de los correos son legítimos y solo el 1% es spam, un modelo tramposo que siempre diga "Todo es legítimo" tendrá un Accuracy del 99%. A primera vista parece un modelo excelente, pero en realidad es completamente inservible porque no detectó ningún spam (su Recall es 0%).'
    },
    {
      q: '¿Cuándo conviene guiarse por la puntuación F1-Score?',
      answer: 'Cuando necesitas un equilibrio estricto entre Precisión y Sensibilidad (Recall), especialmente con clases desbalanceadas. Como es una media armónica, si una de las dos métricas es muy baja, el F1-Score castiga duramente el resultado final.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Laboratorio Interactivo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Simulador "What-If" de Clasificación
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Modifica libremente los valores de cada celda y observa cómo las métricas y la distribución se transforman en tiempo real.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onChangeMatrix(scenario.defaultValues);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 whitespace-nowrap self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Escenario</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Presets Demostrativos:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {presets.map((pr, idx) => (
            <button
              key={idx}
              onClick={() => handlePreset(pr.values)}
              className="p-3.5 text-left rounded-2xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all text-xs group shadow-xs"
            >
              <span className="font-extrabold text-slate-900 block group-hover:text-indigo-900 mb-0.5">
                {pr.name}
              </span>
              <p className="text-[11px] text-slate-600 leading-tight font-medium">
                {pr.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Direct Fine-tuning Steppers */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* VP */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-mono text-emerald-900 font-extrabold block mb-1">
            VP (Verdaderos Positivos)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
              {matrixValues.tp}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCell('tp', -10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="-10"
              >
                -10
              </button>
              <button
                onClick={() => updateCell('tp', 10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="+10"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* FN */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
          <span className="text-[11px] font-mono text-rose-900 font-extrabold block mb-1">
            FN (Falsos Negativos)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
              {matrixValues.fn}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCell('fn', -10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="-10"
              >
                -10
              </button>
              <button
                onClick={() => updateCell('fn', 10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="+10"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* FP */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-[11px] font-mono text-amber-900 font-extrabold block mb-1">
            FP (Falsos Positivos)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
              {matrixValues.fp}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCell('fp', -10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="-10"
              >
                -10
              </button>
              <button
                onClick={() => updateCell('fp', 10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="+10"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* VN */}
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
          <span className="text-[11px] font-mono text-sky-900 font-extrabold block mb-1">
            VN (Verdaderos Negativos)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-extrabold text-slate-900 tabular-nums">
              {matrixValues.tn}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateCell('tn', -10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="-10"
              >
                -10
              </button>
              <button
                onClick={() => updateCell('tn', 10)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 shadow-2xs"
                title="+10"
              >
                +10
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix */}
      <MatrixGrid
        values={matrixValues}
        scenario={scenario}
        activeMetric={activeMetricType ? metrics[activeMetricType] : null}
        onSelectCell={onSelectCell}
        onModifyValue={updateCell}
        allowQuickAdjust={true}
      />

      {/* Real-time Metrics with Interactive Highlighting */}
      <MetricsPanel
        metrics={metrics}
        activeMetricType={activeMetricType}
        onSelectMetric={setActiveMetricType}
      />

      {/* Guided Reflection Questions Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Preguntas Orientadoras para Reflexionar</span>
        </div>

        <div className="space-y-3">
          {questions.map((item, idx) => {
            const isOpen = expandedQuestion === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50"
              >
                <button
                  onClick={() => {
                    sound.playPop();
                    setExpandedQuestion(isOpen ? null : idx);
                  }}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 text-xs sm:text-sm text-slate-700 border-t border-slate-200 leading-relaxed bg-white font-medium">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
