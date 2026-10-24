import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab = 'tutorial' | 'game' | 'simulator' | 'challenges' | 'verification';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onToggleMute,
  onResetAll,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('tutorial')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              <span className="font-mono">M</span>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap block">
                MatrizLab
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold block -mt-1">
                Aprende Jugando
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onTabChange('tutorial')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'tutorial'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Guía & Conceptos
          </button>
          <button
            onClick={() => onTabChange('game')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'game'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Juego de Casos
          </button>
          <button
            onClick={() => onTabChange('simulator')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'simulator'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Simulador What-If
          </button>
          <button
            onClick={() => onTabChange('challenges')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'challenges'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            4. Retos & Niveles
          </button>
          <button
            onClick={() => onTabChange('verification')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'verification'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            5. Verificación Numérica
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onResetAll();
            }}
            title="Reiniciar valores a estándar"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-200 bg-white gap-2">
        <button
          onClick={() => onTabChange('tutorial')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'tutorial' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Guía
        </button>
        <button
          onClick={() => onTabChange('game')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'game' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Juego
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Simulador
        </button>
        <button
          onClick={() => onTabChange('challenges')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'challenges' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Retos
        </button>
        <button
          onClick={() => onTabChange('verification')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'verification' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Cálculos
        </button>
      </div>
    </header>
  );
};
