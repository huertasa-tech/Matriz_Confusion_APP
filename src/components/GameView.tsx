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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        {/* Scenario Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto">
          {scenarioButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                sound.playPop();
                onScenarioChange(btn.id);
                handleRestartRound();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                scenarioId === btn.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Live Score & Streak */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
            <Trophy className="w-4 h-4" />
            <span>Puntos: <strong className="text-white text-sm tabular-nums">{score}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-lg">
            <Flame className="w-4 h-4" />
            <span>Racha: <strong className="text-white text-sm tabular-nums">{streak}</strong></span>
          </div>

          <button
            onClick={handleRestartRound}
            title="Reiniciar ronda de casos"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Split: Left (Case Player) / Right (Live Matrix & Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Case Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Header / Progress */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                  Caso {Math.min(currentIndex + 1, scenarioCases.length)} de {scenarioCases.length}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Progreso: {Math.round(((currentIndex) / scenarioCases.length) * 100)}%
              </div>
            </div>

            {/* Progress bar line */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-5">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex) / scenarioCases.length) * 100}%` }}
              />
            </div>

            {!roundCompleted && currentCase ? (
              <div className="space-y-4">
                {/* Case Title & Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {currentCase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {currentCase.summary}
                  </p>
                </div>

                {/* Clues / Features */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Características observadas:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentCase.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                        <span className="text-indigo-400 font-mono font-bold">•</span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ground truth prompt question */}
                <div className="pt-2 text-center text-xs text-slate-300 font-medium">
                  ¿Cómo clasificas este caso?
                </div>

                {/* Decision Buttons (If not yet decided) */}
                {!lastResult ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleDecision(true)}
                      className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 flex flex-col items-center gap-1"
                    >
                      <span>Clasificar como</span>
                      <span className="text-[11px] font-normal opacity-90 truncate max-w-full">
                        POSITIVO (+)
                      </span>
                    </button>

                    <button
                      onClick={() => handleDecision(false)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 font-bold text-xs sm:text-sm transition-all border border-slate-700 flex flex-col items-center gap-1"
                    >
                      <span>Clasificar como</span>
                      <span className="text-[11px] font-normal opacity-90 truncate max-w-full">
                        NEGATIVO (-)
                      </span>
                    </button>
                  </div>
                ) : (
                  /* Feedback Reveal Card */
                  <div
                    className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 ${
                      lastResult.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {lastResult.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>¡Decisión Correcta!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-rose-400" />
                          <span>Error de Clasificación</span>
                        </>
                      )}
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 ml-auto uppercase font-bold">
                        {lastResult.cellResult.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-200 mt-2">
                      <p>
                        <strong>Tu predicción:</strong> {lastResult.userPrediction ? 'Positivo (+)' : 'Negativo (-)'}
                      </p>
                      <p>
                        <strong>Realidad objetiva:</strong> {lastResult.actualPositive ? 'Positivo (Condición presente)' : 'Negativo (Condición ausente)'}
                      </p>
                      <p className="pt-2 text-xs leading-relaxed text-slate-300 border-t border-white/10">
                        {lastResult.explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNextCase}
                      className="w-full mt-4 py-2.5 px-4 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
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
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">¡Ronda de Casos Completada!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Has procesado todos los casos de este escenario. Mira en la matriz de la derecha cómo quedaron tus aciertos y errores.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs max-w-xs mx-auto">
                  Puntuación final: <strong className="text-emerald-400 text-sm">{score} pts</strong>
                </div>

                <button
                  onClick={handleRestartRound}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar otra ronda</span>
                </button>
              </div>
            )}
          </div>

          {/* Scenario Context Box */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Regla del Escenario: {scenario.title}</span>
            </div>
            <p className="leading-relaxed">{scenario.contextNote}</p>
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
