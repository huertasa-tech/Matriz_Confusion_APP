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
      titleColor: string;
      accentBg: string;
      barColor: string;
      badgeBg: string;
    }
  ) => {
    const highlight = getCellHighlight(cellType);
    const isSelected = selectedCell === cellType;
    const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';

    let cardBorder = baseColorClasses.border;
    let cardBg = baseColorClasses.bg;
    let highlightTag = null;

    if (highlight === 'numerator') {
      cardBorder = 'border-amber-500 ring-2 ring-amber-400 shadow-md shadow-amber-200/50';
      cardBg = 'bg-amber-100/70';
      highlightTag = (
        <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/90 border border-amber-400 px-2 py-0.5 rounded shadow-xs">
          NUMERADOR ↑
        </span>
      );
    } else if (highlight === 'denominator') {
      cardBorder = 'border-indigo-400 ring-2 ring-indigo-300 shadow-md shadow-indigo-100';
      cardBg = 'bg-indigo-50/80';
      highlightTag = (
        <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded shadow-xs">
          DENOMINADOR ↓
        </span>
      );
    } else if (highlight === 'inactive') {
      cardBg = 'opacity-40 grayscale-[50%] bg-slate-50';
    }

    if (isSelected) {
      cardBorder += ' ring-2 ring-slate-900 shadow-md scale-[1.01]';
    }

    return (
      <div
        onClick={() => {
          sound.playPop();
          onSelectCell(cellType);
        }}
        className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${cardBg} ${cardBorder} hover:shadow-md group`}
      >
        {/* Top row in cell */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl shadow-xs ${baseColorClasses.accentBg} ${baseColorClasses.text}`}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-sm sm:text-base ${baseColorClasses.titleColor}`}>
                  {title}
                </span>
                <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${baseColorClasses.badgeBg}`}>
                  {badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
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
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-black/5 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Big Value & Adjustment */}
        <div className="my-2.5 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
              {val}
            </span>
            <span className="text-xs font-mono font-medium text-slate-600">
              casos ({percentage}%)
            </span>
          </div>

          {allowQuickAdjust && onModifyValue && (
            <div
              className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onModifyValue(cellType, -1);
                }}
                disabled={val <= 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors font-bold"
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
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200 text-xs transition-colors font-bold"
                title="Sumar 1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Proportional visual bar */}
        <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-300 rounded-full ${baseColorClasses.barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, total > 0 ? (val / total) * 100 : 0))}%` }}
          />
        </div>

        {/* Bottom context snippet */}
        <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px] text-slate-600">
          <span className="text-slate-500 font-semibold">Significado: </span>
          <span className="text-slate-800 font-semibold">
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
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Top Banner: Explanation & Metric Focus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Matriz de Confusión Binaria (2 × 2)</span>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Total: {total.toLocaleString()} casos
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Cruza la <strong className="text-slate-900 font-bold">Realidad</strong> (filas) contra la{' '}
            <strong className="text-slate-900 font-bold">Predicción del Modelo</strong> (columnas).
          </p>
        </div>

        {activeMetric && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-amber-900 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              Inspeccionando <strong className="font-bold text-amber-950">{activeMetric.name}</strong>:
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
            {/* Top-left corner */}
            <div className="col-span-3 flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-600 font-bold tracking-wider">
                Filas: Realidad
              </span>
              <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold tracking-wider">
                Cols: Predicción
              </span>
            </div>

            {/* Column 1: Predicción Positiva */}
            <div className="col-span-4 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-indigo-900">Predicción Positiva (+)</span>
              </div>
              <p className="text-[11px] text-indigo-700 truncate font-medium">El modelo afirma que SÍ tiene la condición</p>
            </div>

            {/* Column 2: Predicción Negativa */}
            <div className="col-span-4 p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">Predicción Negativa (-)</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate font-medium">El modelo afirma que NO tiene la condición</p>
            </div>

            {/* Total Column Header */}
            <div className="col-span-1 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-700">Total</span>
            </div>
          </div>

          {/* Row 1: Real Positivo */}
          <div className="grid grid-cols-12 gap-3 mb-3 items-stretch">
            {/* Row Label */}
            <div className="col-span-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">Real Positivo</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium line-clamp-2">
                {scenario.positiveDescription}
              </p>
            </div>

            {/* Cell 1,1: TP (Verdadero Positivo) */}
            <div className="col-span-4">
              {renderCell('tp', tp, 'Verdadero Positivo', 'VP / TP', <CheckCircle2 className="w-5 h-5" />, {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                text: 'text-emerald-700',
                titleColor: 'text-emerald-950',
                accentBg: 'bg-emerald-100',
                barColor: 'bg-emerald-500',
                badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              })}
            </div>

            {/* Cell 1,2: FN (Falso Negativo) */}
            <div className="col-span-4">
              {renderCell('fn', fn, 'Falso Negativo', 'FN', <AlertOctagon className="w-5 h-5" />, {
                bg: 'bg-rose-50',
                border: 'border-rose-200',
                text: 'text-rose-700',
                titleColor: 'text-rose-950',
                accentBg: 'bg-rose-100',
                barColor: 'bg-rose-500',
                badgeBg: 'bg-rose-100 text-rose-800 border border-rose-300'
              })}
            </div>

            {/* Row 1 Total */}
            <div className="col-span-1 p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                {totalActualPositives}
              </span>
              <span className="text-[10px] text-slate-600 font-semibold">
                {total > 0 ? `${((totalActualPositives / total) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Row 2: Real Negativo */}
          <div className="grid grid-cols-12 gap-3 mb-3 items-stretch">
            {/* Row Label */}
            <div className="col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">Real Negativo</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium line-clamp-2">
                {scenario.negativeDescription}
              </p>
            </div>

            {/* Cell 2,1: FP (Falso Positivo) */}
            <div className="col-span-4">
              {renderCell('fp', fp, 'Falso Positivo', 'FP', <AlertTriangle className="w-5 h-5" />, {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-700',
                titleColor: 'text-amber-950',
                accentBg: 'bg-amber-100',
                barColor: 'bg-amber-500',
                badgeBg: 'bg-amber-100 text-amber-800 border border-amber-300'
              })}
            </div>

            {/* Cell 2,2: TN (Verdadero Negativo) */}
            <div className="col-span-4">
              {renderCell('tn', tn, 'Verdadero Negativo', 'VN / TN', <ShieldCheck className="w-5 h-5" />, {
                bg: 'bg-sky-50',
                border: 'border-sky-200',
                text: 'text-sky-700',
                titleColor: 'text-sky-950',
                accentBg: 'bg-sky-100',
                barColor: 'bg-sky-500',
                badgeBg: 'bg-sky-100 text-sky-800 border border-sky-300'
              })}
            </div>

            {/* Row 2 Total */}
            <div className="col-span-1 p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                {totalActualNegatives}
              </span>
              <span className="text-[10px] text-slate-600 font-semibold">
                {total > 0 ? `${((totalActualNegatives / total) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Bottom Marginal Row: Column Totals */}
          <div className="grid grid-cols-12 gap-3 text-center pt-2 border-t border-slate-100">
            <div className="col-span-3 p-2 rounded-xl bg-slate-50 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-slate-700">Total Predicho</span>
            </div>

            <div className="col-span-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between px-4">
              <span className="text-xs text-slate-700 font-medium">Predichos (+): VP + FP</span>
              <span className="text-sm font-mono font-bold text-indigo-700 tabular-nums">
                {totalPredictedPositives} ({total > 0 ? `${((totalPredictedPositives / total) * 100).toFixed(0)}%` : '0%'})
              </span>
            </div>

            <div className="col-span-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between px-4">
              <span className="text-xs text-slate-700 font-medium">Predichos (-): FN + VN</span>
              <span className="text-sm font-mono font-bold text-slate-700 tabular-nums">
                {totalPredictedNegatives} ({total > 0 ? `${((totalPredictedNegatives / total) * 100).toFixed(0)}%` : '0%'})
              </span>
            </div>

            <div className="col-span-1 p-2 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center">
              <span className="text-[9px] text-indigo-700 font-mono font-bold">TOTAL</span>
              <span className="text-xs font-mono font-extrabold text-indigo-950 tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
