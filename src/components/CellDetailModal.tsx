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
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case 'tn':
        return <ShieldCheck className="w-6 h-6 text-sky-600" />;
      case 'fp':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'fn':
        return <AlertOctagon className="w-6 h-6 text-rose-600" />;
    }
  };

  const getCardTheme = () => {
    switch (cellType) {
      case 'tp':
        return {
          border: 'border-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconBg: 'bg-emerald-50'
        };
      case 'tn':
        return {
          border: 'border-sky-300',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          iconBg: 'bg-sky-50'
        };
      case 'fp':
        return {
          border: 'border-amber-300',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-50'
        };
      case 'fn':
        return {
          border: 'border-rose-300',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          iconBg: 'bg-rose-50'
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl bg-white border ${theme.border} rounded-3xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`p-3 rounded-2xl border ${theme.border} ${theme.iconBg} shadow-xs`}>
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{def.name}</h3>
              <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border ${theme.badge}`}>
                {def.abbreviation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold font-mono">{def.statisticalTerm}</p>
          </div>
        </div>

        {/* Quick Truth vs Prediction */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold font-mono block">
              1. Realidad (Ground Truth)
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
              {def.reality}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {def.reality === 'Positivo' ? scenario.positiveLabel : scenario.negativeLabel}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold font-mono block">
              2. Predicción del Modelo
            </span>
            <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
              {def.prediction}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              El modelo dijo: {def.prediction === 'Positivo' ? 'SÍ está presente' : 'NO está presente'}
            </span>
          </div>
        </div>

        {/* In-depth details */}
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              ¿Qué significa de forma sencilla?
            </h4>
            <p className="text-slate-800 leading-relaxed font-medium">{def.explanation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
              <span>Ejemplo en el escenario actual: {scenario.title}</span>
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium">
              {cellType === 'tp' && `Un caso donde ${scenario.positiveDescription.toLowerCase()} y el algoritmo lo detecta acertadamente.`}
              {cellType === 'tn' && `Un caso donde ${scenario.negativeDescription.toLowerCase()} y el algoritmo lo descarta de forma impecable.`}
              {cellType === 'fp' && `${scenario.fpConsequence.title}: ${scenario.fpConsequence.description}`}
              {cellType === 'fn' && `${scenario.fnConsequence.title}: ${scenario.fnConsequence.description}`}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Consecuencias prácticas en el mundo real
            </h4>
            <p className="text-slate-800 leading-relaxed font-medium">{def.consequence}</p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              ¿En qué métricas interviene?
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {cellType === 'tp' && (
                <>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    Exactitud (Numerador)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    Precisión (Numerador y Denominador)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    Sensibilidad / Recall (Numerador y Denom.)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    F1-Score (Base armónica)
                  </div>
                </>
              )}
              {cellType === 'tn' && (
                <>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    Exactitud (Numerador)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                    Especificidad (Numerador y Denominador)
                  </div>
                </>
              )}
              {cellType === 'fp' && (
                <>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                    Precisión (Denominador: reduce precisión)
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                    Especificidad (Denominador: reduce especificidad)
                  </div>
                </>
              )}
              {cellType === 'fn' && (
                <>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                    Sensibilidad / Recall (Denominador: reduce recall)
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                    F1-Score (Penaliza fuertemente el score)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Entendido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
