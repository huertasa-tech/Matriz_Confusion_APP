import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Gamepad2,
  Sliders,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TutorialViewProps {
  onStartGame: () => void;
  onOpenSimulator: () => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({
  onStartGame,
  onOpenSimulator
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. ¿Qué es un Modelo de Clasificación?',
      subtitle: 'La máquina que toma decisiones binarias',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            En Inteligencia Artificial y Machine Learning, un <strong>modelo de clasificación</strong> es un algoritmo
            entrenado para responder preguntas de tipo sí o no (clasificación binaria).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider block mb-1">
                Filtro de Correo
              </span>
              <p className="text-xs text-slate-300">
                ¿Este correo entrante es <strong>Spam</strong> (Positivo) o <strong>Legítimo</strong> (Negativo)?
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">
                Salud Médica
              </span>
              <p className="text-xs text-slate-300">
                ¿La radiografía muestra signos de <strong>Neumonía</strong> (Positivo) o <strong>Pulmón Sano</strong> (Negativo)?
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">
                Movilidad Urbana
              </span>
              <p className="text-xs text-slate-300">
                ¿El autobús llegará con <strong>Retraso &gt;15m</strong> (Positivo) o <strong>A tiempo</strong> (Negativo)?
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs sm:text-sm text-indigo-200">
            <strong>Nota clave:</strong> La palabra "Positivo" en estadística no significa "bueno ni agradable";
            simplemente significa que <em>se detecta la condición que estamos buscando</em> (ej. tener una enfermedad o ser spam).
          </div>
        </div>
      )
    },
    {
      title: '2. Realidad vs Predicción: El Choque de Dos Mundos',
      subtitle: 'Lo que la máquina cree frente a lo que ocurrió en verdad',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Cada vez que evaluamos un modelo, comparamos dos verdades:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <h4 className="font-bold text-white text-sm">1. La Realidad (Ground Truth)</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                El estado verídico de la situación. Si el paciente realmente tiene el virus, si el correo fue enviado por un estafador o si el bus se pinchó. Es el hecho objetivo.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-indigo-400" />
                <h4 className="font-bold text-white text-sm">2. La Predicción (Prediction)</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                La hipótesis que calcula el modelo tras procesar los datos de entrada (texto, imágenes, sensores). Puede acertar o puede equivocarse.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Al cruzar la <strong>Realidad (2 opciones)</strong> con la <strong>Predicción (2 opciones)</strong>,
            surgen exactamente <strong>2 × 2 = 4 combinaciones posibles</strong>.
          </p>
        </div>
      )
    },
    {
      title: '3. Los 4 Cuadrantes de la Matriz de Confusión',
      subtitle: 'Dos tipos de aciertos y dos tipos de errores',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-xs sm:text-sm">
            La matriz de confusión organiza estos cuatro desenlaces para que no nos engañemos con un solo porcentaje:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* VP */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-600/40">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verdadero Positivo (VP / TP)</span>
              </div>
              <p className="text-slate-300">
                <strong>Real:</strong> SÍ · <strong>Modelo:</strong> SÍ.
              </p>
              <p className="text-slate-400 mt-1">
                Acierto total. El radar detectó el exceso de velocidad real; el test encontró el tumor real.
              </p>
            </div>

            {/* FN */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-600/40">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>Falso Negativo (FN) — Error Tipo II</span>
              </div>
              <p className="text-slate-300">
                <strong>Real:</strong> SÍ · <strong>Modelo:</strong> NO.
              </p>
              <p className="text-slate-400 mt-1">
                Omisión peligrosa. Había un peligro real o enfermedad, pero el modelo aseguró que todo estaba bien.
              </p>
            </div>

            {/* FP */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/40">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Falso Positivo (FP) — Error Tipo I</span>
              </div>
              <p className="text-slate-300">
                <strong>Real:</strong> NO · <strong>Modelo:</strong> SÍ.
              </p>
              <p className="text-slate-400 mt-1">
                Falsa alarma. Todo estaba sano o limpio, pero el modelo disparó la sirena innecesariamente.
              </p>
            </div>

            {/* VN */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-600/40">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verdadero Negativo (VN / TN)</span>
              </div>
              <p className="text-slate-300">
                <strong>Real:</strong> NO · <strong>Modelo:</strong> NO.
              </p>
              <p className="text-slate-400 mt-1">
                Descarte correcto. El paciente sano vuelve a casa tranquilo; el correo legítimo va a la bandeja.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '4. ¿Por qué se llama "Matriz de Confusión"?',
      subtitle: 'Porque revela exactamente en qué se confunde el algoritmo',
      content: (
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-slate-300 leading-relaxed">
            Se llama de confusión porque cuando un sistema falla, no basta con decir «tiene un 10% de error».
            Necesitamos saber <strong>hacia dónde se confunde</strong>:
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-mono text-amber-400 font-bold">Caso 1:</span>
              <p className="text-slate-300">
                ¿Se confunde por <strong>exceso de celo</strong> (Falsos Positivos)?
                Bloquea correos buenos de tus clientes o hace sonar alarmas con humo de tostadas.
              </p>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80">
              <span className="font-mono text-rose-400 font-bold">Caso 2:</span>
              <p className="text-slate-300">
                ¿Se confunde por <strong>ceguera / negligencia</strong> (Falsos Negativos)?
                No detecta un tumor maligno o deja entrar un malware espía a los servidores.
              </p>
            </div>
          </div>

          <p className="text-slate-300">
            En la vida real, <strong>un error rara vez cuesta lo mismo que el otro</strong>.
            Diseñar buen Machine Learning es aprender a calibrar este delicado equilibrio.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Introducción Interactiva</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Domina la Matriz de Confusión jugando
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Aprende qué significan los aciertos y errores de un modelo de clasificación, cómo se calculan las métricas
          (Exactitud, Precisión, Sensibilidad, F1) y por qué un Falso Positivo puede ser mucho más costoso que un Falso Negativo.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => {
              sound.playSuccess();
              onStartGame();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Iniciar Juego de Casos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onOpenSimulator();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700"
          >
            <Sliders className="w-4 h-4" />
            <span>Abrir Simulador What-If</span>
          </button>
        </div>
      </div>

      {/* Step by Step Guide Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Step indicator tabs */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2 overflow-x-auto">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playPop();
                setCurrentStep(idx);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentStep === idx
                  ? 'bg-indigo-600 text-white'
                  : currentStep > idx
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-950 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>Paso {idx + 1}</span>
              {currentStep > idx && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div>
          <div className="mb-4">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
              {steps[currentStep].subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {steps[currentStep].title}
            </h2>
          </div>

          <div className="py-2">
            {steps[currentStep].content}
          </div>

          {/* Stepper controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            <button
              onClick={() => {
                sound.playPop();
                setCurrentStep((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {currentStep + 1} de {steps.length}
            </span>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  sound.playPop();
                  setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                <span>Siguiente paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onStartGame();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
              >
                <span>¡Empezar a jugar ahora!</span>
                <Gamepad2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
