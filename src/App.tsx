/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { TutorialView } from './components/TutorialView';
import { GameView } from './components/GameView';
import { SimulatorView } from './components/SimulatorView';
import { ChallengesView } from './components/ChallengesView';
import { VerificationView } from './components/VerificationView';
import { CellDetailModal } from './components/CellDetailModal';
import { SCENARIOS } from './data/scenarios';
import { CellType, MatrixValues, ScenarioId } from './types/confusionMatrix';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('tutorial');
  const [scenarioId, setScenarioId] = useState<ScenarioId>('spam');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<CellType | null>(null);

  // Active matrix values for the simulator mode, initialized to current scenario defaults
  const [matrixValues, setMatrixValues] = useState<MatrixValues>(
    SCENARIOS[scenarioId].defaultValues
  );

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
    if (!next) sound.playPop();
  };

  const handleScenarioChange = (newScenarioId: ScenarioId) => {
    setScenarioId(newScenarioId);
    setMatrixValues(SCENARIOS[newScenarioId].defaultValues);
  };

  const handleResetAll = () => {
    setMatrixValues(SCENARIOS[scenarioId].defaultValues);
    setSelectedCell(null);
  };

  const currentScenario = SCENARIOS[scenarioId];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          sound.playPop();
          setActiveTab(tab);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetAll={handleResetAll}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tutorial' && (
          <TutorialView
            onStartGame={() => {
              sound.playSuccess();
              setActiveTab('game');
            }}
            onOpenSimulator={() => {
              sound.playPop();
              setActiveTab('simulator');
            }}
          />
        )}

        {activeTab === 'game' && (
          <GameView
            scenarioId={scenarioId}
            onScenarioChange={handleScenarioChange}
            onSelectCell={(cell) => setSelectedCell(cell)}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            scenario={currentScenario}
            matrixValues={matrixValues}
            onChangeMatrix={setMatrixValues}
            onSelectCell={(cell) => setSelectedCell(cell)}
          />
        )}

        {activeTab === 'challenges' && <ChallengesView />}

        {activeTab === 'verification' && <VerificationView />}
      </main>

      {/* Cell Detail Explanatory Modal */}
      <CellDetailModal
        cellType={selectedCell}
        scenario={currentScenario}
        onClose={() => setSelectedCell(null)}
      />

      {/* Subtle Educational Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            MatrizLab · Herramienta interactiva de aprendizaje para analítica de datos y Machine Learning.
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>VP · VN · FP · FN</span>
            <span>·</span>
            <span>Accuracy · Precision · Recall · Specificity · F1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
