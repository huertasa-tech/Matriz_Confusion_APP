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
  const metricList: { type: MetricType; icon: React.ReactNode; color: string }[] = [
    {
      type: 'accuracy',
      icon: <Target className="w-4 h-4" />,
      color: 'text-indigo-400'
    },
    {
      type: 'precision',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-emerald-400'
    },
    {
      type: 'recall',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-sky-400'
    },
    {
      type: 'specificity',
      icon: <Eye className="w-4 h-4" />,
      color: 'text-cyan-400'
    },
    {
      type: 'f1',
      icon: <Layers className="w-4 h-4" />,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Métricas de Evaluación de Clasificación</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Haz clic en cualquier métrica para <strong className="text-amber-300">resaltar visualmente</strong> sus celdas (numerador y denominador) en la matriz.
          </p>
        </div>

        {activeMetricType && (
          <button
            onClick={() => {
              sound.playPop();
              onSelectMetric(null);
            }}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Quitar resaltado
          </button>
        )}
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {metricList.map(({ type, icon, color }) => {
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
                  ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded bg-slate-900 ${color}`}>{icon}</div>
                  <span className="text-xs font-bold text-slate-200">{m.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  {m.shortName}
                </span>
              </div>

              {/* Big value readout */}
              <div className="my-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
                    {m.percentage}
                  </span>
                  <span className="text-xs font-mono text-slate-400">({m.formatted})</span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      m.value === null
                        ? 'bg-slate-700'
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
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-indigo-300 truncate" title={m.formula}>
                  {m.formula}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5" title={m.formulaExpanded}>
                  {m.formulaExpanded}
                </div>
              </div>

              {/* Highlight toggle hint */}
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={`text-[10px] font-medium ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                  {isSelected ? '● Resaltando celdas' : '○ Clic para ver celdas'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded detail box for the selected metric */}
      {activeMetricType && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white">
                  Entendiendo {metrics[activeMetricType].name} ({metrics[activeMetricType].shortName})
                </h4>
                <span className="font-mono text-xs text-amber-300 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded">
                  Valor actual: {metrics[activeMetricType].percentage}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {metrics[activeMetricType].plainDescription}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-0.5">Interpretación práctica:</span>
                  <span className="text-slate-400">{metrics[activeMetricType].interpretation}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-0.5">Analogía cotidiana:</span>
                  <span className="text-slate-400">{metrics[activeMetricType].analogy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
