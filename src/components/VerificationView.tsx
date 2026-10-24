import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  RotateCcw,
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
      description: 'VP=100, VN=100, FP=0, FN=0. Todos los indicadores dan 1.000 (100%).',
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Auditoría Matemática Rigurosa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Verificador y Comprobación de Fórmulas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Ingresa cualquier valor o prueba casos de control para auditar el paso a paso matemático y comprobar la coherencia de todos los cálculos.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setTestValues({ tp: 80, tn: 90, fp: 20, fn: 10 });
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Ejemplo</span>
          </button>
        </div>

        {/* Quick Benchmark Presets */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-mono uppercase text-slate-600 font-bold tracking-wider">
            Casos de Prueba Canónicos:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {benchmarkPresets.map((bp, i) => (
              <button
                key={i}
                onClick={() => {
                  sound.playPop();
                  setTestValues(bp.values);
                }}
                className="p-3 text-left rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all text-xs group shadow-2xs"
              >
                <span className="font-extrabold text-slate-900 block group-hover:text-indigo-900 truncate">
                  {bp.name}
                </span>
                <span className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 font-medium">
                  {bp.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Matrix Values Form */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono">
          Valores de Entrada de la Matriz:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <label className="block text-xs font-mono text-emerald-900 font-bold mb-1">
              Verdaderos Positivos (VP)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.tp}
              onChange={(e) => handleInputChange('tp', e.target.value)}
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg font-extrabold focus:border-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
            <label className="block text-xs font-mono text-rose-900 font-bold mb-1">
              Falsos Negativos (FN)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.fn}
              onChange={(e) => handleInputChange('fn', e.target.value)}
              className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg font-extrabold focus:border-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <label className="block text-xs font-mono text-amber-900 font-bold mb-1">
              Falsos Positivos (FP)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.fp}
              onChange={(e) => handleInputChange('fp', e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg font-extrabold focus:border-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
            <label className="block text-xs font-mono text-sky-900 font-bold mb-1">
              Verdaderos Negativos (VN)
            </label>
            <input
              type="number"
              min="0"
              value={testValues.tn}
              onChange={(e) => handleInputChange('tn', e.target.value)}
              className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg font-extrabold focus:border-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 font-semibold border-t border-slate-100">
          <span>Casos Totales (N): <strong className="text-slate-900 text-sm">{total}</strong></span>
          <span>Positivos Reales (VP + FN): <strong className="text-slate-900 text-sm">{testValues.tp + testValues.fn}</strong></span>
          <span>Negativos Reales (VN + FP): <strong className="text-slate-900 text-sm">{testValues.tn + testValues.fp}</strong></span>
        </div>
      </div>

      {/* Step-by-Step Proof Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Desglose Matemático Paso a Paso de las 5 Métricas</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs">
                <th className="pb-3 font-bold">Métrica</th>
                <th className="pb-3 font-bold">Fórmula Teórica</th>
                <th className="pb-3 font-bold">Sustitución Numérica</th>
                <th className="pb-3 font-bold text-right">Resultado</th>
                <th className="pb-3 font-bold text-right">Porcentaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {/* Accuracy */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-slate-900">Exactitud (Accuracy)</td>
                <td className="py-3.5 text-indigo-700 font-semibold">(VP + VN) / Total</td>
                <td className="py-3.5 text-slate-700 font-medium">
                  ({testValues.tp} + {testValues.tn}) / {total} = {testValues.tp + testValues.tn} / {total}
                </td>
                <td className="py-3.5 text-right text-slate-900 font-extrabold">{metrics.accuracy.formatted}</td>
                <td className="py-3.5 text-right text-indigo-700 font-extrabold">{metrics.accuracy.percentage}</td>
              </tr>

              {/* Precision */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-slate-900">Precisión (Precision)</td>
                <td className="py-3.5 text-indigo-700 font-semibold">VP / (VP + FP)</td>
                <td className="py-3.5 text-slate-700 font-medium">
                  {testValues.tp} / ({testValues.tp} + {testValues.fp}) = {testValues.tp} / {testValues.tp + testValues.fp}
                </td>
                <td className="py-3.5 text-right text-slate-900 font-extrabold">{metrics.precision.formatted}</td>
                <td className="py-3.5 text-right text-emerald-700 font-extrabold">{metrics.precision.percentage}</td>
              </tr>

              {/* Recall */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-slate-900">Sensibilidad (Recall)</td>
                <td className="py-3.5 text-indigo-700 font-semibold">VP / (VP + FN)</td>
                <td className="py-3.5 text-slate-700 font-medium">
                  {testValues.tp} / ({testValues.tp} + {testValues.fn}) = {testValues.tp} / {testValues.tp + testValues.fn}
                </td>
                <td className="py-3.5 text-right text-slate-900 font-extrabold">{metrics.recall.formatted}</td>
                <td className="py-3.5 text-right text-sky-700 font-extrabold">{metrics.recall.percentage}</td>
              </tr>

              {/* Specificity */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-slate-900">Especificidad (Specificity)</td>
                <td className="py-3.5 text-indigo-700 font-semibold">VN / (VN + FP)</td>
                <td className="py-3.5 text-slate-700 font-medium">
                  {testValues.tn} / ({testValues.tn} + {testValues.fp}) = {testValues.tn} / {testValues.tn + testValues.fp}
                </td>
                <td className="py-3.5 text-right text-slate-900 font-extrabold">{metrics.specificity.formatted}</td>
                <td className="py-3.5 text-right text-teal-700 font-extrabold">{metrics.specificity.percentage}</td>
              </tr>

              {/* F1 */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-slate-900">Puntuación F1 (F1-Score)</td>
                <td className="py-3.5 text-indigo-700 font-semibold">2 × (P × R) / (P + R)</td>
                <td className="py-3.5 text-slate-700 font-medium">
                  {metrics.precision.value !== null && metrics.recall.value !== null ? (
                    `2 × (${metrics.precision.formatted} × ${metrics.recall.formatted}) / (${metrics.precision.formatted} + ${metrics.recall.formatted})`
                  ) : (
                    'No computable (P o R indefinido)'
                  )}
                </td>
                <td className="py-3.5 text-right text-slate-900 font-extrabold">{metrics.f1.formatted}</td>
                <td className="py-3.5 text-right text-amber-700 font-extrabold">{metrics.f1.percentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Division by zero safety explanation */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Manejo de Casos Extremos (División por Cero)</span>
        </div>
        <p className="leading-relaxed font-medium">
          Si el denominador de cualquier fórmula es igual a cero (por ejemplo, si el modelo no hace ninguna predicción positiva, haciendo VP + FP = 0),
          la aplicación previene divisiones ilegales de punto flotante mostrando explícitamente <strong>«No definido»</strong>.
        </p>
      </div>
    </div>
  );
};
