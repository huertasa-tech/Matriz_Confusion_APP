import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Gamepad2,
  Sliders,
  Check,
  Sparkles,
  BookOpen
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
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
            En Inteligencia Artificial y Machine Learning, un <strong>modelo de clasificación</strong> es un programa de computadora
            entrenado para responder preguntas de tipo sí o no (clasificación binaria).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-2xs">
              <span className="text-indigo-800 font-extrabold text-xs uppercase tracking-wider block mb-1">
                Filtro de Correo
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                ¿Este correo entrante es <strong>Spam</strong> (Positivo) o <strong>Legítimo</strong> (Negativo)?
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 shadow-2xs">
              <span className="text-emerald-800 font-extrabold text-xs uppercase tracking-wider block mb-1">
                Salud Médica
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                ¿La radiografía muestra signos de <strong>Neumonía</strong> (Positivo) o <strong>Pulmón Sano</strong> (Negativo)?
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 shadow-2xs">
              <span className="text-amber-800 font-extrabold text-xs uppercase tracking-wider block mb-1">
                Movilidad Urbana
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                ¿El autobús llegará con <strong>Retraso &gt;15m</strong> (Positivo) o <strong>A tiempo</strong> (Negativo)?
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs sm:text-sm text-indigo-950 font-medium">
            <strong className="text-indigo-900 font-bold">Nota clave para principiantes:</strong> La palabra "Positivo" en estadística no significa "bueno ni feliz";
            simplemente significa que <em>se detecta la condición que estamos buscando</em> (por ejemplo, tener una enfermedad o ser un correo no deseado).
          </div>
        </div>
      )
    },
    {
      title: '2. Realidad vs Predicción: El Choque de Dos Mundos',
      subtitle: 'Lo que la máquina cree frente a lo que ocurrió en verdad',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
            Cada vez que evaluamos un modelo, comparamos dos elementos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <h4 className="font-extrabold text-slate-900 text-sm">1. La Realidad (Ground Truth)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                El estado verídico de la situación: si el paciente realmente tiene el virus, si el correo fue enviado por un estafador o si el bus se pinchó. Es el hecho objetivo comprobado.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <h4 className="font-extrabold text-slate-900 text-sm">2. La Predicción (Prediction)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                La respuesta que calcula el modelo tras procesar los datos (texto, imágenes o sensores). Puede acertar o puede equivocarse.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium">
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
          <p className="text-slate-700 text-xs sm:text-sm font-medium">
            La matriz de confusión organiza estos cuatro desenlaces para que no nos engañemos con un solo porcentaje:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* VP */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verdadero Positivo (VP / TP)</span>
              </div>
              <p className="text-emerald-950 font-semibold">
                <strong>Real:</strong> SÍ · <strong>Modelo:</strong> SÍ.
              </p>
              <p className="text-slate-600 mt-1 font-medium">
                Acierto total. El radar detectó el exceso de velocidad real; el test encontró el tumor real.
              </p>
            </div>

            {/* FN */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Falso Negativo (FN) — Error Tipo II</span>
              </div>
              <p className="text-rose-950 font-semibold">
                <strong>Real:</strong> SÍ · <strong>Modelo:</strong> NO.
              </p>
              <p className="text-slate-600 mt-1 font-medium">
                Omisión peligrosa. Había un peligro real o enfermedad, pero el modelo aseguró falsamente que todo estaba bien.
              </p>
            </div>

            {/* FP */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Falso Positivo (FP) — Error Tipo I</span>
              </div>
              <p className="text-amber-950 font-semibold">
                <strong>Real:</strong> NO · <strong>Modelo:</strong> SÍ.
              </p>
              <p className="text-slate-600 mt-1 font-medium">
                Falsa alarma. Todo estaba sano o limpio, pero el modelo disparó la alarma innecesariamente.
              </p>
            </div>

            {/* VN */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-2 text-sky-900 font-extrabold mb-1">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Verdadero Negativo (VN / TN)</span>
              </div>
              <p className="text-sky-950 font-semibold">
                <strong>Real:</strong> NO · <strong>Modelo:</strong> NO.
              </p>
              <p className="text-slate-600 mt-1 font-medium">
                Descarte correcto. El paciente sano vuelve a casa tranquilo; el correo legítimo va directo a la bandeja.
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
          <p className="text-slate-700 leading-relaxed font-medium">
            Se llama de confusión porque cuando un sistema falla, no basta con decir «tiene un 10% de error».
            Necesitamos saber <strong>hacia dónde se confunde</strong>:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-xs shrink-0">
                Caso 1
              </span>
              <p className="text-slate-700 font-medium">
                ¿Se confunde por <strong>exceso de celo</strong> (Falsos Positivos)?
                Bloquea correos buenos de tus clientes o hace sonar alarmas con humo de tostadas.
              </p>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
              <span className="font-mono text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded text-xs shrink-0">
                Caso 2
              </span>
              <p className="text-slate-700 font-medium">
                ¿Se confunde por <strong>ceguera u omisión</strong> (Falsos Negativos)?
                No detecta un tumor maligno o deja entrar un software malicioso a los servidores.
              </p>
            </div>
          </div>

          <p className="text-slate-700 font-medium">
            En la vida real, <strong>un error casi nunca cuesta lo mismo que el otro</strong>.
            Diseñar buen Machine Learning es aprender a calibrar este equilibrio.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Introducción Interactiva</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Domina la Matriz de Confusión jugando
        </h1>
        <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-medium">
          Aprende qué significan los aciertos y errores de un modelo de clasificación, cómo se calculan las métricas
          (Exactitud, Precisión, Sensibilidad, F1) y por qué un Falso Positivo puede ser mucho más costoso que un Falso Negativo.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => {
              sound.playSuccess();
              onStartGame();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-200 active:scale-95"
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all border border-slate-200 shadow-xs"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Abrir Simulador What-If</span>
          </button>
        </div>
      </div>

      {/* Step by Step Guide Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Step indicator tabs */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2 overflow-x-auto">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playPop();
                setCurrentStep(idx);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                currentStep === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : currentStep > idx
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider block">
              {steps[currentStep].subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {steps[currentStep].title}
            </h2>
          </div>

          <div className="py-2">
            {steps[currentStep].content}
          </div>

          {/* Stepper controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playPop();
                setCurrentStep((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono font-semibold text-slate-500">
              {currentStep + 1} de {steps.length}
            </span>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  sound.playPop();
                  setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
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
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
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
