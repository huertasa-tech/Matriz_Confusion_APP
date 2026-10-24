import React from 'react';
import { X, CheckCircle2, ShieldCheck, AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';
import { CellType, ScenarioDefinition } from '../types/confusionMatrix';
import { CELL_DEFINITIONS } from '../utils/metrics';

interface CellDetailModalProps {
  cellType: CellType | null;
  scenario: ScenarioDefinition;
  onClose: () => void;
}

export const CellDetailModal: React.FC<CellDetailModalProps> = ({
  cellType,
  scenario,
  onClose
}) => {
  if (!cellType) return null;

  const def = CELL_DEFINITIONS[cellType];

  const getIcon = () => {
    switch (cellType) {
      case 'tp':
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      case 'tn':
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      case 'fp':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case 'fn':
        return <AlertOctagon className="w-6 h-6 text-rose-400" />;
    }
  };

  const getBorderColor = () => {
    switch (cellType) {
      case 'tp':
        return 'border-emerald-500/40 shadow-emerald-950/50';
      case 'tn':
        return 'border-cyan-500/40 shadow-cyan-950/50';
      case 'fp':
        return 'border-amber-500/40 shadow-amber-950/50';
      case 'fn':
        return 'border-rose-500/40 shadow-rose-950/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl bg-slate-900 border ${getBorderColor()} rounded-2xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">{def.name}</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {def.abbreviation}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{def.statisticalTerm}</p>
          </div>
        </div>

        {/* Quick Truth vs Prediction badge */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
              1. Realidad (Ground Truth)
            </span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">
              {def.reality}
            </span>
            <span className="text-xs text-slate-400">
              {def.reality === 'Positivo' ? scenario.positiveLabel : scenario.negativeLabel}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
              2. Predicción del Modelo
            </span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">
              {def.prediction}
            </span>
            <span className="text-xs text-slate-400">
              El modelo dijo: {def.prediction === 'Positivo' ? 'SÍ está presente' : 'NO está presente'}
            </span>
          </div>
        </div>

        {/* In-depth details */}
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              ¿Qué significa?
            </h4>
            <p className="text-slate-300 leading-relaxed">{def.explanation}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1 flex items-center gap-1.5">
              <span>Ejemplo en el escenario actual: {scenario.title}</span>
            </h4>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              {cellType === 'tp' && `Un caso donde ${scenario.positiveDescription.toLowerCase()} y el algoritmo lo detecta acertadamente.`}
              {cellType === 'tn' && `Un caso donde ${scenario.negativeDescription.toLowerCase()} y el algoritmo lo descarta de forma impecable.`}
              {cellType === 'fp' && `${scenario.fpConsequence.title}: ${scenario.fpConsequence.description}`}
              {cellType === 'fn' && `${scenario.fnConsequence.title}: ${scenario.fnConsequence.description}`}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Consecuencias prácticas
            </h4>
            <p className="text-slate-300 leading-relaxed">{def.consequence}</p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              ¿En qué métricas interviene?
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {cellType === 'tp' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Exactitud (Numerador)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Precisión (Numerador y Denominador)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Sensibilidad / Recall (Numerador y Denominador)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    F1-Score (Base de cálculo)
                  </div>
                </>
              )}
              {cellType === 'tn' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Exactitud (Numerador)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    Especificidad (Numerador y Denominador)
                  </div>
                </>
              )}
              {cellType === 'fp' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    Precisión (Denominador: reduce la precisión)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    Especificidad (Denominador: reduce especificidad)
                  </div>
                </>
              )}
              {cellType === 'fn' && (
                <>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-rose-300">
                    Sensibilidad / Recall (Denominador: reduce recall)
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-rose-300">
                    F1-Score (Penaliza fuertemente el score)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Entendido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
