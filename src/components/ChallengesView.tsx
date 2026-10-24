import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Lock,
  Unlock,
  Lightbulb
} from 'lucide-react';
import { CHALLENGES, LEVELS, BADGES } from '../data/challenges';
import { ChallengeQuestion } from '../types/confusionMatrix';
import { sound } from '../utils/audio';

export const ChallengesView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('matrizlab_unlocked_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const levelQuestions = CHALLENGES.filter((q) => q.level === selectedLevel);
  const currentQuestion: ChallengeQuestion | undefined = levelQuestions[currentQuestionIndex];

  // Save badges to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('matrizlab_unlocked_badges', JSON.stringify(unlockedBadges));
    } catch {
      // ignore
    }
  }, [unlockedBadges]);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    sound.playPop();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const chosen = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      sound.playSuccess();
    } else {
      sound.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);

    if (currentQuestionIndex + 1 < levelQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Level completed! Unlock badge
      const badgeId = LEVELS.find((l) => l.level === selectedLevel)?.badgeId;
      if (badgeId && !unlockedBadges.includes(badgeId)) {
        setUnlockedBadges((prev) => [...prev, badgeId]);
      }
      sound.playLevelComplete();

      // If there's a next level, advance
      if (selectedLevel < 5) {
        setSelectedLevel((l) => l + 1);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleResetProgress = () => {
    sound.playPop();
    setUnlockedBadges([]);
    setSelectedLevel(1);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Level Selector & Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span>Campamento de Entrenamiento</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Retos y Niveles de Maestría
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Supera los 5 niveles progresivos para desbloquear tus credenciales de Machine Learning.
            </p>
          </div>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 whitespace-nowrap self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Progreso</span>
          </button>
        </div>

        {/* Level Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {LEVELS.map((lvl) => {
            const isUnlocked = lvl.level === 1 || unlockedBadges.includes(`badge-${lvl.level - 1}`);
            const isCompleted = unlockedBadges.includes(lvl.badgeId);
            const isCurrent = selectedLevel === lvl.level;

            return (
              <button
                key={lvl.level}
                onClick={() => {
                  sound.playPop();
                  setSelectedLevel(lvl.level);
                  setCurrentQuestionIndex(0);
                  setSelectedOptionId(null);
                  setIsAnswerSubmitted(false);
                  setShowHint(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-600'}`}>
                    Nivel {lvl.level}
                  </span>
                  {isCompleted ? (
                    <Award className="w-4 h-4 text-amber-500" />
                  ) : isUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-indigo-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="text-[11px] font-bold text-slate-900 truncate">
                  {lvl.title.replace(`Nivel ${lvl.level}: `, '')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Badges Ribbon */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Insignias Desbloqueadas ({unlockedBadges.length} de {BADGES.length}):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {BADGES.map((b) => {
              const isGot = unlockedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    isGot
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400 grayscale opacity-60'
                  }`}
                >
                  <Award className={`w-4 h-4 shrink-0 ${isGot ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <span className="font-extrabold block truncate text-[11px]">{b.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Challenge Card */}
      {currentQuestion ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
                Nivel {selectedLevel} · Pregunta {currentQuestionIndex + 1} de {levelQuestions.length}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentQuestion.title}
              </h3>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Ocultar pista' : 'Ver pista'}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm animate-in fade-in font-medium">
              <strong className="text-amber-900 font-bold">Pista:</strong> {currentQuestion.hint}
            </div>
          )}

          {/* Question Text */}
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionClasses = 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-800';

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  optionClasses = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  optionClasses = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                } else {
                  optionClasses = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-50';
                }
              } else if (isSelected) {
                optionClasses = 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 text-indigo-950 font-bold';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer ${optionClasses}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono uppercase font-bold text-slate-500 mt-0.5">
                      {opt.id})
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="leading-relaxed font-semibold">{opt.text}</p>
                      {isAnswerSubmitted && (opt.isCorrect || isSelected) && (
                        <p className={`text-xs mt-2 pt-2 border-t leading-relaxed font-medium ${
                          opt.isCorrect ? 'border-emerald-200 text-emerald-900' : 'border-rose-200 text-rose-900'
                        }`}>
                          {opt.explanation}
                        </p>
                      )}
                    </div>

                    {isAnswerSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit / Next Button */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-100"
              >
                Comprobar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-100"
              >
                <span>
                  {currentQuestionIndex + 1 < levelQuestions.length ? 'Siguiente Pregunta' : 'Completar Nivel'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-700 font-semibold">Selecciona un nivel arriba para comenzar los retos.</p>
        </div>
      )}
    </div>
  );
};
