import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  Plus,
  Minus
} from 'lucide-react';
import { CellType, MatrixValues, MetricCalculation, ScenarioDefinition } from '../types/confusionMatrix';
import { CELL_DEFINITIONS } from '../utils/metrics';
import { sound } from '../utils/audio';

interface MatrixGridProps {
  values: MatrixValues;
  scenario: ScenarioDefinition;
  activeMetric?: MetricCalculation | null;
  selectedCell?: CellType | null;
  onSelectCell: (cell: CellType) => void;
  onModifyValue?: (cell: CellType, delta: number) => void;
  allowQuickAdjust?: boolean;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  values,
  scenario,
  activeMetric,
  selectedCell,
  onSelectCell,
  onModifyValue,
  allowQuickAdjust = true
}) => {
  const { tp, tn, fp, fn } = values;
  const total = tp + tn + fp + fn;

  // Marginal totals
  const totalActualPositives = tp + fn;
  const totalActualNegatives = fp + tn;
  const totalPredictedPositives = tp + fp;
  const totalPredictedNegatives = fn + tn;

  const getCellHighlight = (cell: CellType) => {
    if (!activeMetric) return null;
    const isNum = activeMetric.numeratorCells.includes(cell);
    const isDen = activeMetric.denominatorCells.includes(cell);
    if (isNum) return 'numerator';
    if (isDen) return 'denominator';
    return 'inactive';
  };

  const renderCell = (
    cellType: CellType,
    val: number,
    title: string,
    badgeText: string,
    icon: React.ReactNode,
    baseColorClasses: {
      bg: string;
      border: string;
      text: string;
      accentBg: string;
      glow: string;
    }
  ) => {
    const highlight = getCellHighlight(cellType);
    const isSelected = selectedCell === cellType;
    const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';

    let cardBorder = baseColorClasses.border;
    let cardBg = baseColorClasses.bg;
    let highlightTag = null;

    if (highlight === 'numerator') {
      cardBorder = 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20';
      cardBg = 'bg-amber-950/30';
      highlightTag = (
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-900/60 border border-amber-600/50 px-2 py-0.5 rounded">
          NUMERADOR ↑
        </span>
      );
    } else if (highlight === 'denominator') {
      cardBorder = 'border-indigo-400 ring-1 ring-indigo-400/30';
      cardBg = 'bg-indigo-950/20';
      highlightTag = (
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
          DENOMINADOR ↓
        </span>
      );
    } else if (highlight === 'inactive') {
      cardBg = 'opacity-40 grayscale-[40%] bg-slate-900/40';
    }

    if (isSelected) {
      cardBorder += ' ring-2 ring-white/70 scale-[1.01]';
    }

    return (
      <div
        onClick={() => {
          sound.playPop();
          onSelectCell(cellType);
        }}
        className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${cardBg} ${cardBorder} hover:brightness-110 group`}
      >
        {/* Top row in cell */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${baseColorClasses.accentBg} ${baseColorClasses.text}`}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-100">{title}</span>
                <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                  {badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {CELL_DEFINITIONS[cellType].concept}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {highlightTag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playPop();
                onSelectCell(cellType);
              }}
              title="Ver explicación detallada"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Big Value & Bar */}
        <div className="my-2 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {val}
            </span>
            <span className="text-xs font-mono text-slate-400">
              casos ({percentage}%)
            </span>
          </div>

          {allowQuickAdjust && onModifyValue && (
            <div
              className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onModifyValue(cellType, -1);
                }}
                disabled={val <= 0}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
                title="Restar 1"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onModifyValue(cellType, 1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Sumar 1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Proportional visual bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-300 ${baseColorClasses.glow}`}
            style={{ width: `${Math.min(100, Math.max(0, total > 0 ? (val / total) * 100 : 0))}%` }}
          />
        </div>

        {/* Bottom context snippet */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span className="text-slate-500">Significado: </span>
          <span className="text-slate-300 font-medium">
            {cellType === 'tp' && `Detectado correctamente como ${scenario.positiveLabel}`}
            {cellType === 'fn' && `Se omitió; era ${scenario.positiveLabel}`}
            {cellType === 'fp' && `Falsa alarma; era ${scenario.negativeLabel}`}
            {cellType === 'tn' && `Descartado correctamente como ${scenario.negativeLabel}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Top Banner: Explanation & Metric Focus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Matriz de Confusión Binaria (2 × 2)</span>
            <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Total: {total.toLocaleString()} casos
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cruza la <strong className="text-slate-200">Realidad</strong> (filas) contra la{' '}
            <strong className="text-slate-200">Predicción del Modelo</strong> (columnas).
          </p>
        </div>

        {activeMetric && (
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-lg px-3 py-1.5 text-xs text-amber-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Inspeccionando <strong className="font-semibold text-amber-100">{activeMetric.name}</strong>:
              resaltando numerador y denominador
            </span>
          </div>
        )}
      </div>

      {/* The 2x2 Grid with Marginal Labels */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[620px]">
          {/* Header Row: Prediction Columns */}
          <div className="grid grid-cols-12 gap-3 mb-3 text-center">
            {/* Top-left empty corner */}
            <div className="col-span-3 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                Filas: Realidad
              </span>
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                Cols: Predicción
              </span>
            </div>

            {/* Column 1: Predicción Positiva */}
            <div className="col-span-4 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-indigo-300">Predicción Positiva (+)</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">El modelo afirma que SÍ tiene la condición</p>
            </div>

            {/* Column 2: Predicción Negativa */}
            <div className="col-span-4 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-300">Predicción Negativa (-)</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">El modelo afirma que NO tiene la condición</p>
            </div>

            {/* Total Column Header */}
            <div className="col-span-1 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center justify-center">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Total Real</span>
            </div>
          </div>

          {/* Row 1: Real Positivo */}
          <div className="grid grid-cols-12 gap-3 mb-3 items-stretch">
            {/* Row Label */}
            <div className="col-span-3 p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-100">Real Positivo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {scenario.positiveDescription}
              </p>
            </div>

            {/* Cell 1,1: TP (Verdadero Positivo) */}
            <div className="col-span-4">
              {renderCell('tp', tp, 'Verdadero Positivo', 'VP / TP', <CheckCircle2 className="w-5 h-5" />, {
                bg: 'bg-emerald-950/20',
                border: 'border-emerald-600/40',
                text: 'text-emerald-400',
                accentBg: 'bg-emerald-900/50',
                glow: 'bg-emerald-500'
              })}
            </div>

            {/* Cell 1,2: FN (Falso Negativo) */}
            <div className="col-span-4">
              {renderCell('fn', fn, 'Falso Negativo', 'FN', <AlertOctagon className="w-5 h-5" />, {
                bg: 'bg-rose-950/20',
                border: 'border-rose-600/40',
                text: 'text-rose-400',
                accentBg: 'bg-rose-900/50',
                glow: 'bg-rose-500'
              })}
            </div>

            {/* Row 1 Total */}
            <div className="col-span-1 p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {totalActualPositives}
              </span>
              <span className="text-[10px] text-slate-400">
                {total > 0 ? `${((totalActualPositives / total) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Row 2: Real Negativo */}
          <div className="grid grid-cols-12 gap-3 mb-3 items-stretch">
            {/* Row Label */}
            <div className="col-span-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-100">Real Negativo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {scenario.negativeDescription}
              </p>
            </div>

            {/* Cell 2,1: FP (Falso Positivo) */}
            <div className="col-span-4">
              {renderCell('fp', fp, 'Falso Positivo', 'FP', <AlertTriangle className="w-5 h-5" />, {
                bg: 'bg-amber-950/20',
                border: 'border-amber-600/40',
                text: 'text-amber-400',
                accentBg: 'bg-amber-900/50',
                glow: 'bg-amber-500'
              })}
            </div>

            {/* Cell 2,2: TN (Verdadero Negativo) */}
            <div className="col-span-4">
              {renderCell('tn', tn, 'Verdadero Negativo', 'VN / TN', <ShieldCheck className="w-5 h-5" />, {
                bg: 'bg-cyan-950/20',
                border: 'border-cyan-600/40',
                text: 'text-cyan-400',
                accentBg: 'bg-cyan-900/50',
                glow: 'bg-cyan-500'
              })}
            </div>

            {/* Row 2 Total */}
            <div className="col-span-1 p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {totalActualNegatives}
              </span>
              <span className="text-[10px] text-slate-400">
                {total > 0 ? `${((totalActualNegatives / total) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Bottom Marginal Row: Column Totals */}
          <div className="grid grid-cols-12 gap-3 text-center pt-1 border-t border-slate-800">
            <div className="col-span-3 p-2 rounded-lg bg-slate-950/40 flex items-center justify-center">
              <span className="text-xs font-mono font-semibold text-slate-400">Total Predicho</span>
            </div>

            <div className="col-span-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between px-4">
              <span className="text-xs text-slate-400">Predichos (+): VP + FP</span>
              <span className="text-sm font-mono font-bold text-indigo-300 tabular-nums">
                {totalPredictedPositives} ({total > 0 ? `${((totalPredictedPositives / total) * 100).toFixed(0)}%` : '0%'})
              </span>
            </div>

            <div className="col-span-4 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between px-4">
              <span className="text-xs text-slate-400">Predichos (-): FN + VN</span>
              <span className="text-sm font-mono font-bold text-slate-300 tabular-nums">
                {totalPredictedNegatives} ({total > 0 ? `${((totalPredictedNegatives / total) * 100).toFixed(0)}%` : '0%'})
              </span>
            </div>

            <div className="col-span-1 p-2 rounded-lg bg-indigo-950/40 border border-indigo-700/60 flex flex-col items-center justify-center">
              <span className="text-[9px] text-indigo-300 font-mono">TOTAL</span>
              <span className="text-xs font-mono font-extrabold text-white tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
