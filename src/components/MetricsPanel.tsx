import React from 'react';
import { Target, Zap, Activity, Eye, HelpCircle, Layers } from 'lucide-react';
import { MetricCalculation, MetricType } from '../types/confusionMatrix';
import { sound } from '../utils/audio';

interface MetricsPanelProps {
  metrics: Record<MetricType, MetricCalculation>;
  activeMetricType: MetricType | null;
  onSelectMetric: (type: MetricType | null) => void;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  activeMetricType,
  onSelectMetric
}) => {
  const metricList: { type: MetricType; icon: React.ReactNode; color: string; badgeBg: string }[] = [
    {
      type: 'accuracy',
      icon: <Target className="w-4 h-4" />,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      type: 'precision',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      type: 'recall',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      type: 'specificity',
      icon: <Eye className="w-4 h-4" />,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      type: 'f1',
      icon: <Layers className="w-4 h-4" />,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Métricas de Evaluación del Modelo</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Haz clic en cualquier métrica para <strong className="text-indigo-600 font-bold">resaltar visualmente</strong> sus celdas (numerador y denominador) en la matriz.
          </p>
        </div>

        {activeMetricType && (
          <button
            onClick={() => {
              sound.playPop();
              onSelectMetric(null);
            }}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto border border-slate-200"
          >
            Quitar resaltado
          </button>
        )}
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {metricList.map(({ type, icon, color, badgeBg }) => {
          const m = metrics[type];
          const isSelected = activeMetricType === type;

          return (
            <div
              key={type}
              onClick={() => {
                sound.playPop();
                onSelectMetric(isSelected ? null : type);
              }}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1.5 rounded-lg bg-white shadow-xs border border-slate-100 ${color}`}>
                    {icon}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeBg}`}>
                  {m.shortName}
                </span>
              </div>

              {/* Big value readout */}
              <div className="my-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                    {m.percentage}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-600">({m.formatted})</span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      m.value === null
                        ? 'bg-slate-300'
                        : m.value >= 0.8
                        ? 'bg-emerald-500'
                        : m.value >= 0.5
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: m.value !== null ? `${Math.min(100, m.value * 100)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Formula */}
              <div className="mt-2 pt-2 border-t border-slate-200/80">
                <div className="text-[10px] font-mono font-bold text-indigo-700 truncate" title={m.formula}>
                  {m.formula}
                </div>
                <div className="text-[10px] font-mono text-slate-600 truncate mt-0.5" title={m.formulaExpanded}>
                  {m.formulaExpanded}
                </div>
              </div>

              {/* Highlight toggle hint */}
              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {isSelected ? '● Resaltando celdas' : '○ Clic para ver celdas'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded detail box for the selected metric */}
      {activeMetricType && (
        <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900">
                  Entendiendo {metrics[activeMetricType].name} ({metrics[activeMetricType].shortName})
                </h4>
                <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 rounded-full">
                  Valor actual: {metrics[activeMetricType].percentage}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {metrics[activeMetricType].plainDescription}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Interpretación práctica:</span>
                  <span className="text-slate-600 font-medium">{metrics[activeMetricType].interpretation}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Analogía cotidiana:</span>
                  <span className="text-slate-600 font-medium">{metrics[activeMetricType].analogy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
