import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { MatrixValues } from '../types/confusionMatrix';
import { calculateMetrics } from '../utils/metrics';
import { sound } from '../utils/audio';

export const VerificationView: React.FC = () => {
  // Canonical verification benchmark
  const [testValues, setTestValues] = useState<MatrixValues>({
    tp: 80,
    tn: 90,
    fp: 20,
    fn: 10
  });

  const benchmarkPresets: { name: string; values: MatrixValues; description: string }[] = [
    {
      name: 'Ejemplo Canónico Estándar (200 casos)',
      description: 'VP=80, VN=90, FP=20, FN=10. Ideal para comprobar con papel y lápiz.',
      values: { tp: 80, tn: 90, fp: 20, fn: 10 }
    },
    {
      name: 'Clasificador Perfecto (100% en todo)',
      description: 'VP=100, VN=100, FP=0, FN=0. Todos los indicadores deben dar 1.000 (100%).',
      values: { tp: 100, tn: 100, fp: 0, fn: 0 }
    },
    {
      name: 'Matriz Vacía (0 casos en todo)',
      description: 'Comprobación de robustez ante división por cero.',
      values: { tp: 0, tn: 0, fp: 0, fn: 0 }
    },
    {
      name: 'Cero Predicciones Positivas (VP=0, FP=0)',
      description: 'Verifica que la Precisión muestre "No definido" sin arrojar NaN ni error.',
      values: { tp: 0, tn: 100, fp: 0, fn: 20 }
    }
  ];

  const handleInputChange = (field: keyof MatrixValues, valStr: string) => {
    const num = Math.max(0, parseInt(valStr, 10) || 0);
    setTestValues((prev) => ({
      ...prev,
      [field]: num
    }));
  };

  const metrics = calculateMetrics(testValues);
  const total = testValues.tp + testValues.tn + testValues.fp + testValues.fn;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Auditoría Matemática Rigurosa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Verificador y Comprobación de Fórmulas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ingresa cualquier valor o prueba casos de control para auditar el paso a paso matemático y comprobar la coherencia de todos los cálculos.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setTestValues({ tp: 80, tn: 90, fp: 20, fn: 10 });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Ejemplo</span>
          </button>
        </div>

        {/* Quick Benchmark Presets */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
            Casos de Prueba Canónicos:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {benchmarkPresets.map((bp, i) => (
              <button
                key={i}
                onClick={() => {
                  sound.playPop();
                  setTestValues(bp.values);
                }}
                className="p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-xs group"
              >
                <span className="font-semibold text-slate-200 block group-hover:text-white truncate">
                  {bp.name}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {bp.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Matrix Values Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Valores de Entrada de la Matriz:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-mono text-emerald-400 font-semibold mb-1">
              Verdaderos Positivos (VP)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.tp}
              onChange={(e) => handleInputChange('tp', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-mono text-rose-400 font-semibold mb-1">
              Falsos Negativos (FN)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.fn}
              onChange={(e) => handleInputChange('fn', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-mono text-amber-400 font-semibold mb-1">
              Falsos Positivos (FP)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.fp}
              onChange={(e) => handleInputChange('fp', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-mono text-cyan-400 font-semibold mb-1">
              Verdaderos Negativos (VN)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.tn}
              onChange={(e) => handleInputChange('tn', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg font-bold focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Casos Totales (N): <strong className="text-white text-sm">{total}</strong></span>
          <span>Positivos Reales (VP + FN): <strong className="text-white text-sm">{testValues.tp + testValues.fn}</strong></span>
          <span>Negativos Reales (VN + FP): <strong className="text-white text-sm">{testValues.tn + testValues.fp}</strong></span>
        </div>
      </div>

      {/* Step-by-Step Proof Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Desglose Matemático Paso a Paso de las 5 Métricas</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs">
                <th className="pb-3 font-semibold">Métrica</th>
                <th className="pb-3 font-semibold">Fórmula Teórica</th>
                <th className="pb-3 font-semibold">Sustitución Numérica</th>
                <th className="pb-3 font-semibold text-right">Resultado</th>
                <th className="pb-3 font-semibold text-right">Porcentaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {/* Accuracy */}
              <tr>
                <td className="py-3 font-sans font-bold text-white">Exactitud (Accuracy)</td>
                <td className="py-3 text-indigo-300">(VP + VN) / Total</td>
                <td className="py-3 text-slate-300">
                  ({testValues.tp} + {testValues.tn}) / {total} = {testValues.tp + testValues.tn} / {total}
                </td>
                <td className="py-3 text-right text-white font-bold">{metrics.accuracy.formatted}</td>
                <td className="py-3 text-right text-emerald-400 font-bold">{metrics.accuracy.percentage}</td>
              </tr>

              {/* Precision */}
              <tr>
                <td className="py-3 font-sans font-bold text-white">Precisión (Precision)</td>
                <td className="py-3 text-indigo-300">VP / (VP + FP)</td>
                <td className="py-3 text-slate-300">
                  {testValues.tp} / ({testValues.tp} + {testValues.fp}) = {testValues.tp} / {testValues.tp + testValues.fp}
                </td>
                <td className="py-3 text-right text-white font-bold">{metrics.precision.formatted}</td>
                <td className="py-3 text-right text-emerald-400 font-bold">{metrics.precision.percentage}</td>
              </tr>

              {/* Recall */}
              <tr>
                <td className="py-3 font-sans font-bold text-white">Sensibilidad (Recall)</td>
                <td className="py-3 text-indigo-300">VP / (VP + FN)</td>
                <td className="py-3 text-slate-300">
                  {testValues.tp} / ({testValues.tp} + {testValues.fn}) = {testValues.tp} / {testValues.tp + testValues.fn}
                </td>
                <td className="py-3 text-right text-white font-bold">{metrics.recall.formatted}</td>
                <td className="py-3 text-right text-emerald-400 font-bold">{metrics.recall.percentage}</td>
              </tr>

              {/* Specificity */}
              <tr>
                <td className="py-3 font-sans font-bold text-white">Especificidad (Specificity)</td>
                <td className="py-3 text-indigo-300">VN / (VN + FP)</td>
                <td className="py-3 text-slate-300">
                  {testValues.tn} / ({testValues.tn} + {testValues.fp}) = {testValues.tn} / {testValues.tn + testValues.fp}
                </td>
                <td className="py-3 text-right text-white font-bold">{metrics.specificity.formatted}</td>
                <td className="py-3 text-right text-emerald-400 font-bold">{metrics.specificity.percentage}</td>
              </tr>

              {/* F1 */}
              <tr>
                <td className="py-3 font-sans font-bold text-white">Puntuación F1 (F1-Score)</td>
                <td className="py-3 text-indigo-300">2 × (P × R) / (P + R)</td>
                <td className="py-3 text-slate-300">
                  {metrics.precision.value !== null && metrics.recall.value !== null ? (
                    `2 × (${metrics.precision.formatted} × ${metrics.recall.formatted}) / (${metrics.precision.formatted} + ${metrics.recall.formatted})`
                  ) : (
                    'No computable (P o R indefinido)'
                  )}
                </td>
                <td className="py-3 text-right text-white font-bold">{metrics.f1.formatted}</td>
                <td className="py-3 text-right text-amber-400 font-bold">{metrics.f1.percentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Division by zero safety explanation */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Manejo de Casos Extremos (División por Cero)</span>
        </div>
        <p className="leading-relaxed">
          Si el denominador de cualquier fórmula es igual a cero (por ejemplo, si el modelo no hace ninguna predicción positiva, haciendo VP + FP = 0),
          la aplicación previene divisiones ilegales de punto flotante mostrando explícitamente <strong>«No definido»</strong>.
        </p>
      </div>
    </div>
  );
};
