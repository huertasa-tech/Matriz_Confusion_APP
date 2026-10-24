import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  MailCheck,
  HeartPulse,
  Bus,
  Trophy,
  Flame
} from 'lucide-react';
import { GameCaseItem, MatrixValues, ScenarioDefinition, ScenarioId, CellType } from '../types/confusionMatrix';
import { GAME_CASES } from '../data/gameCases';
import { SCENARIOS } from '../data/scenarios';
import { MatrixGrid } from './MatrixGrid';
import { MetricsPanel } from './MetricsPanel';
import { calculateMetrics } from '../utils/metrics';
import { sound } from '../utils/audio';

interface GameViewProps {
  scenarioId: ScenarioId;
  onScenarioChange: (id: ScenarioId) => void;
  onSelectCell: (cell: CellType) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  scenarioId,
  onScenarioChange,
  onSelectCell
}) => {
  // Local matrix built from user decisions in the game
  const [gameMatrix, setGameMatrix] = useState<MatrixValues>({
    tp: 0,
    tn: 0,
    fp: 0,
    fn: 0
  });

  const scenario = SCENARIOS[scenarioId];
  const scenarioCases = GAME_CASES.filter((c) => c.scenarioId === scenarioId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState<{
    userPrediction: boolean;
    actualPositive: boolean;
    cellResult: CellType;
    explanation: string;
    isCorrect: boolean;
  } | null>(null);

  const [roundCompleted, setRoundCompleted] = useState(false);
  const currentCase: GameCaseItem | undefined = scenarioCases[currentIndex];

  const handleDecision = (userPrediction: boolean) => {
    if (!currentCase) return;

    const actual = currentCase.actualPositive;
    let cell: CellType;
    let isCorrect = false;

    if (userPrediction && actual) {
      cell = 'tp';
      isCorrect = true;
      sound.playSuccess();
    } else if (!userPrediction && !actual) {
      cell = 'tn';
      isCorrect = true;
      sound.playSuccess();
    } else if (userPrediction && !actual) {
      cell = 'fp';
      isCorrect = false;
      sound.playIncorrect();
    } else {
      cell = 'fn';
      isCorrect = false;
      sound.playIncorrect();
    }

    // Update game matrix
    setGameMatrix((prev) => ({
      ...prev,
      [cell]: prev[cell] + 1
    }));

    if (isCorrect) {
      setScore((s) => s + 100 + streak * 10);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    setLastResult({
      userPrediction,
      actualPositive: actual,
      cellResult: cell,
      explanation: userPrediction ? currentCase.explanationIfPositive : currentCase.explanationIfNegative,
      isCorrect
    });
  };

  const handleNextCase = () => {
    sound.playPop();
    setLastResult(null);
    if (currentIndex + 1 < scenarioCases.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setRoundCompleted(true);
      sound.playLevelComplete();
    }
  };

  const handleRestartRound = () => {
    sound.playPop();
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setLastResult(null);
    setRoundCompleted(false);
    setGameMatrix({ tp: 0, tn: 0, fp: 0, fn: 0 });
  };

  const metrics = calculateMetrics(gameMatrix);

  const scenarioButtons: { id: ScenarioId; label: string; icon: React.ReactNode }[] = [
    { id: 'spam', label: 'Filtro Anti-Spam', icon: <MailCheck className="w-4 h-4" /> },
    { id: 'health', label: 'Diagnóstico Médico', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'transit', label: 'Buses Urbanos', icon: <Bus className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Scenario Bar & Score Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
        {/* Scenario Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
          {scenarioButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                sound.playPop();
                onScenarioChange(btn.id);
                handleRestartRound();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                scenarioId === btn.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl font-bold">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Puntos: <strong className="text-slate-900 text-sm tabular-nums">{score}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-900 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Racha: <strong className="text-slate-900 text-sm tabular-nums">{streak}</strong></span>
          </div>

          <button
            onClick={handleRestartRound}
            title="Reiniciar ronda de casos"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Case Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            {/* Header / Progress */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
                  Caso {Math.min(currentIndex + 1, scenarioCases.length)} de {scenarioCases.length}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono font-bold">
                Progreso: {Math.round(((currentIndex) / scenarioCases.length) * 100)}%
              </div>
            </div>

            {/* Progress bar line */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-5">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex) / scenarioCases.length) * 100}%` }}
              />
            </div>

            {!roundCompleted && currentCase ? (
              <div className="space-y-4">
                {/* Case Title & Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                    {currentCase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                    {currentCase.summary}
                  </p>
                </div>

                {/* Clues / Features */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                    Características observadas:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {currentCase.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-indigo-600 font-mono font-bold">•</span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Question */}
                <div className="pt-2 text-center text-xs text-slate-700 font-bold">
                  ¿Cómo clasificas este caso?
                </div>

                {/* Decision Buttons */}
                {!lastResult ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleDecision(true)}
                      className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 flex flex-col items-center gap-1"
                    >
                      <span>Clasificar como</span>
                      <span className="text-[11px] font-medium opacity-90 truncate max-w-full">
                        POSITIVO (+)
                      </span>
                    </button>

                    <button
                      onClick={() => handleDecision(false)}
                      className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-extrabold text-xs sm:text-sm transition-all border-2 border-slate-300 shadow-2xs flex flex-col items-center gap-1"
                    >
                      <span>Clasificar como</span>
                      <span className="text-[11px] font-medium text-slate-600 truncate max-w-full">
                        NEGATIVO (-)
                      </span>
                    </button>
                  </div>
                ) : (
                  /* Feedback Reveal Card */
                  <div
                    className={`p-4 rounded-2xl border animate-in zoom-in-95 duration-200 ${
                      lastResult.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {lastResult.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-900 font-extrabold">¡Decisión Correcta!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                          <span className="text-rose-900 font-extrabold">Error de Clasificación</span>
                        </>
                      )}
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white border border-black/10 ml-auto uppercase font-bold shadow-2xs">
                        {lastResult.cellResult.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-800 mt-2.5 font-medium">
                      <p>
                        <strong>Tu predicción:</strong> {lastResult.userPrediction ? 'Positivo (+)' : 'Negativo (-)'}
                      </p>
                      <p>
                        <strong>Realidad objetiva:</strong> {lastResult.actualPositive ? 'Positivo (Condición presente)' : 'Negativo (Condición ausente)'}
                      </p>
                      <p className="pt-2 text-xs leading-relaxed text-slate-700 border-t border-black/10">
                        {lastResult.explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNextCase}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Siguiente caso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Round Complete Card */
              <div className="text-center py-6 space-y-4 animate-in fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">¡Ronda de Casos Completada!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium">
                  Has procesado todos los casos de este escenario. Mira en la matriz de la derecha cómo quedaron tus aciertos y errores.
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs max-w-xs mx-auto">
                  Puntuación final: <strong className="text-emerald-700 text-sm">{score} pts</strong>
                </div>

                <button
                  onClick={handleRestartRound}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 mx-auto shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar otra ronda</span>
                </button>
              </div>
            )}
          </div>

          {/* Scenario Context Box */}
          <div className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Regla del Escenario: {scenario.title}</span>
            </div>
            <p className="leading-relaxed font-medium">{scenario.contextNote}</p>
          </div>
        </div>

        {/* Right Column: Live Confusion Matrix & Real-time Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <MatrixGrid
            values={gameMatrix}
            scenario={scenario}
            onSelectCell={onSelectCell}
            allowQuickAdjust={false}
          />

          <MetricsPanel
            metrics={metrics}
            activeMetricType={null}
            onSelectMetric={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
