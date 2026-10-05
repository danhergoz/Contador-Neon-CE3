import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
} from 'lucide-react';
import { CyberBackground } from './components/CyberBackground';
import { AnimatedDigit } from './components/AnimatedDigit';
import { CunLogo } from './components/CunLogo';
import { soundEngine } from './components/SoundEngine';

const DEFAULT_DURATION = 5 * 60; // 5 minutos (300 segundos)

const PRESETS = [
  { label: '01:00', seconds: 60 },
  { label: '03:00', seconds: 180 },
  { label: '05:00', seconds: 300 },
  { label: '10:00', seconds: 600 },
  { label: '15:00', seconds: 900 },
];

export default function App() {
  const [totalDuration, setTotalDuration] = useState<number>(DEFAULT_DURATION);
  const [remainingMs, setRemainingMs] = useState<number>(DEFAULT_DURATION * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastWholeSecondRef = useRef<number>(DEFAULT_DURATION);

  // Derived whole seconds
  const totalSecondsLeft = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSecondsLeft / 60);
  const seconds = totalSecondsLeft % 60;

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');

  // Continuous progress (0 to 1) for ultra-smooth 60fps ring animation
  const smoothProgress =
    totalDuration > 0
      ? Math.max(0, Math.min(1, remainingMs / (totalDuration * 1000)))
      : 0;

  // Sub-second progress within the current second (0 to 1)
  const subSecondFraction = (remainingMs % 1000) / 1000;

  const isWarning = isRunning && totalSecondsLeft <= 30 && totalSecondsLeft > 0;

  // High-precision animation loop for smooth sub-second ring & accurate second transitions
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    endTimeRef.current = performance.now() + remainingMs;

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      const currentWholeSec = Math.ceil(left / 1000);
      if (currentWholeSec !== lastWholeSecondRef.current && currentWholeSec > 0) {
        lastWholeSecondRef.current = currentWholeSec;
        if (soundEnabled) {
          soundEngine.playTick(currentWholeSec <= 30);
        }
      }

      if (left <= 0) {
        lastWholeSecondRef.current = 0;
        setIsRunning(false);
        setIsComplete(true);
        if (soundEnabled) {
          soundEngine.playComplete();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, soundEnabled]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setRemainingMs(totalDuration * 1000);
    lastWholeSecondRef.current = totalDuration;
    if (soundEnabled) soundEngine.playAction('reset');
  }, [totalDuration, soundEnabled]);

  const handleTogglePlay = useCallback(() => {
    if (isComplete || remainingMs <= 0) {
      setIsComplete(false);
      setRemainingMs(totalDuration * 1000);
      lastWholeSecondRef.current = totalDuration;
      setIsRunning(true);
      if (soundEnabled) soundEngine.playAction('start');
      return;
    }

    setIsRunning((prev) => {
      const next = !prev;
      if (soundEnabled) {
        soundEngine.playAction(next ? 'start' : 'pause');
      }
      return next;
    });
  }, [isComplete, remainingMs, totalDuration, soundEnabled]);

  const handleSelectPreset = (secondsValue: number) => {
    setIsRunning(false);
    setIsComplete(false);
    setTotalDuration(secondsValue);
    setRemainingMs(secondsValue * 1000);
    lastWholeSecondRef.current = secondsValue;
    if (soundEnabled) soundEngine.playAction('reset');
  };

  const handleAdjustSeconds = (deltaSeconds: number) => {
    const newRemaining = Math.max(
      1000,
      Math.min(59 * 60 * 1000, remainingMs + deltaSeconds * 1000)
    );
    const newTotal = Math.max(totalDuration, Math.ceil(newRemaining / 1000));
    setRemainingMs(newRemaining);
    setTotalDuration(newTotal);
    setIsComplete(false);
    lastWholeSecondRef.current = Math.ceil(newRemaining / 1000);
    if (isRunning) {
      endTimeRef.current = performance.now() + newRemaining;
    }
    if (soundEnabled) soundEngine.playTick(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts (Esc: return from final "Iniciamos" screen, Space: Play/Pause, R: Reset, M: Mute)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
        return;
      }
      if (isComplete) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((s) => !s);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTogglePlay, handleReset, isComplete]);

  // SVG Ring Geometry
  const size = 440;
  const center = size / 2;
  const mainRadius = 174;
  const mainCircumference = 2 * Math.PI * mainRadius;
  const strokeDashoffset = mainCircumference * (1 - smoothProgress);

  // Current active second index (0..59) for the 60-tick outer crown
  const activeTickIndex = (60 - (seconds % 60)) % 60;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden select-none">
      {/* Atmospheric Cyber-City, Wireframe Gears & Circuit Backdrop */}
      <CyberBackground
        isRunning={isRunning}
        secondTick={totalSecondsLeft}
        progress={smoothProgress}
      />

      {/* Zone 1-2-3 Minimalist Top Bar */}
      <header className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between border-b border-cyan-400/15">
        {/* Zone 1: White CUN Logo + Course Title "Creación de Empresas 3" */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectPreset(DEFAULT_DURATION);
          }}
          className="flex items-center gap-4 group focus-visible:outline-none"
        >
          <CunLogo
            className="h-7 sm:h-8 w-auto transition-transform duration-200 group-hover:scale-[1.03]"
            showSubtext={false}
          />
          <span className="font-display text-base sm:text-xl font-bold tracking-wide text-white neon-white-text-subtle whitespace-nowrap">
            Creación de Empresas 3
          </span>
        </a>

        {/* Zone 2: Minimalist Duration Presets (Clean Typography Links) */}
        <nav
          aria-label="Preajustes de tiempo"
          className="hidden lg:flex items-center gap-7 text-sm font-mono-tabular"
        >
          {PRESETS.map((preset) => {
            const isSelected = totalDuration === preset.seconds;
            return (
              <button
                key={preset.seconds}
                onClick={() => handleSelectPreset(preset.seconds)}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded ${
                  isSelected
                    ? 'text-white font-semibold neon-white-text-subtle'
                    : 'text-cyan-200/55 hover:text-cyan-100'
                }`}
              >
                {preset.label}
                {isSelected && (
                  <motion.span
                    layoutId="activePresetLine"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-white rounded-full shadow-[0_0_10px_#22d3ee]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Minimalist Utility Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Silenciar pulsos sonoros' : 'Activar pulsos sonoros'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-cyan-100/85 hover:text-white bg-cyan-950/35 hover:bg-cyan-900/45 border border-cyan-300/20 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-cyan-400/50" />
            )}
            <span className="hidden md:inline">{soundEnabled ? 'Audio activo' : 'Silencio'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="Alternar pantalla completa"
            className="p-2 rounded-lg text-cyan-100/85 hover:text-white bg-cyan-950/35 hover:bg-cyan-900/45 border border-cyan-300/20 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Focal Anchor: White CUN Identity + "Iniciamos en:" + 05:00 Counter */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {/* All-White Institutional CUN Logo & Heading */}
        <div className="flex flex-col items-center mb-2 sm:mb-3 text-center">
          <CunLogo className="h-14 sm:h-16 w-auto mb-3" showSubtext={true} />
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-white neon-white-text">
            Iniciamos en:
          </h1>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Gentle Attenuated Outer Second-Tick Ripple Ring */}
          <AnimatePresence mode="popLayout">
            {isRunning && (
              <motion.div
                key={`ripple-${totalSecondsLeft}`}
                initial={{ opacity: 0.32, scale: 0.98 }}
                animate={{ opacity: 0, scale: 1.08 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-[320px] h-[320px] sm:w-[386px] sm:h-[386px] rounded-full border border-white/30 shadow-[0_0_24px_rgba(34,211,238,0.35)] pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Neon HUD Circular Frame & Smooth Progress SVG */}
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] overflow-visible"
          >
            <defs>
              <linearGradient id="neonWhiteStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#f0fdff" />
                <stop offset="100%" stopColor="#a5f3fc" />
              </linearGradient>
            </defs>

            {/* Outer 60-Second Crown Ticks with Smooth Trailing Illumination */}
            <g transform={`translate(${center}, ${center})`}>
              {Array.from({ length: 60 }).map((_, i) => {
                const angleDeg = i * 6 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const isMajor = i % 5 === 0;
                const innerR = isMajor ? 198 : 201;
                const outerR = isMajor ? 210 : 207;

                const x1 = Math.cos(angleRad) * innerR;
                const y1 = Math.sin(angleRad) * innerR;
                const x2 = Math.cos(angleRad) * outerR;
                const y2 = Math.sin(angleRad) * outerR;

                const diff = (activeTickIndex - i + 60) % 60;
                const isCurrentTick = isRunning && diff === 0;
                const isTrailTick = isRunning && diff > 0 && diff <= 5;

                let strokeColor = 'rgba(165, 243, 252, 0.22)';
                let strokeW = isMajor ? 2.2 : 1.3;

                if (isCurrentTick) {
                  strokeColor = '#ffffff';
                  strokeW = 3.2;
                } else if (isTrailTick) {
                  const trailAlpha = (6 - diff) / 6;
                  strokeColor = `rgba(255, 255, 255, ${0.22 + trailAlpha * 0.6})`;
                  strokeW = isMajor ? 2.5 : 1.9;
                } else if (isMajor) {
                  strokeColor = 'rgba(207, 250, 254, 0.45)';
                }

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    className={isCurrentTick ? 'neon-svg-glow' : ''}
                    style={{
                      transition: 'stroke 350ms ease, stroke-width 350ms ease',
                    }}
                  />
                );
              })}
            </g>

            {/* Subtle Inner Geometric HUD Ring */}
            <circle
              cx={center}
              cy={center}
              r={148}
              fill="rgba(4, 18, 36, 0.42)"
              stroke="rgba(103, 232, 249, 0.18)"
              strokeWidth="1.2"
              strokeDasharray="8 6"
            />

            {/* Background Track for Primary Neon Ring */}
            <circle
              cx={center}
              cy={center}
              r={mainRadius}
              fill="none"
              stroke="rgba(34, 211, 238, 0.16)"
              strokeWidth="7"
            />

            {/* Primary Bold White-Neon Glowing Progress Ring */}
            <circle
              cx={center}
              cy={center}
              r={mainRadius}
              fill="none"
              stroke="url(#neonWhiteStroke)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeDasharray={mainCircumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              className="neon-svg-glow"
            />

            {/* Leading Luminous Orb at the Tip of the Countdown Arc */}
            {smoothProgress > 0.005 && (
              <g
                transform={`translate(${
                  center +
                  Math.cos(((360 * smoothProgress - 90) * Math.PI) / 180) * mainRadius
                }, ${
                  center +
                  Math.sin(((360 * smoothProgress - 90) * Math.PI) / 180) * mainRadius
                })`}
              >
                <circle r="9" fill="rgba(34, 211, 238, 0.45)" className="neon-svg-glow" />
                <circle r="4.5" fill="#ffffff" className="neon-svg-glow" />
              </g>
            )}
          </svg>

          {/* Center Digital Readout Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            {/* Quiet Unboxed Top Metadata inside HUD */}
            <div className="flex items-center gap-2 text-xs font-mono-tabular tracking-widest text-cyan-200/80 mb-2">
              <span>CREACIÓN DE EMPRESAS 3</span>
              <span aria-hidden="true">·</span>
              <span>{Math.round(smoothProgress * 100)}%</span>
            </div>

            {/* MM:SS Attenuated Cross-Fade Digits */}
            <div
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              className="flex items-center justify-center text-[4rem] sm:text-[5.25rem] leading-none"
            >
              <AnimatedDigit
                digit={minStr[0]}
                isWarning={isWarning}
                isComplete={isComplete}
              />
              <AnimatedDigit
                digit={minStr[1]}
                isWarning={isWarning}
                isComplete={isComplete}
              />

              {/* Smoothly Breathing Neon Colon Separator */}
              <motion.span
                animate={{
                  opacity: isRunning ? (subSecondFraction > 0.5 ? 0.95 : 0.45) : 0.9,
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="mx-0.5 sm:mx-1 -translate-y-1 font-display font-bold neon-white-text select-none"
              >
                :
              </motion.span>

              <AnimatedDigit
                digit={secStr[0]}
                isWarning={isWarning}
                isComplete={isComplete}
              />
              <AnimatedDigit
                digit={secStr[1]}
                isWarning={isWarning}
                isComplete={isComplete}
              />
            </div>

            {/* Sub-Second Fluid Bar & Status Text */}
            <div className="mt-4 flex flex-col items-center gap-2 w-44">
              <div className="w-full h-[3px] rounded-full bg-cyan-950/80 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full shadow-[0_0_8px_#ffffff,0_0_16px_#22d3ee]"
                  style={{
                    width: `${isRunning ? subSecondFraction * 100 : smoothProgress * 100}%`,
                    transition: isRunning ? 'none' : 'width 200ms ease',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-tabular text-cyan-100/80">
                <span>
                  {isComplete
                    ? 'FINALIZADO'
                    : isRunning
                    ? 'EN CURSO'
                    : remainingMs < totalDuration * 1000
                    ? 'EN PAUSA'
                    : 'LISTO'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {String(Math.floor(totalDuration / 60)).padStart(2, '0')}:
                  {String(totalDuration % 60).padStart(2, '0')} MIN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Control Deck */}
        <div className="mt-6 flex items-center gap-3 sm:gap-4">
          {/* -30s Button */}
          <button
            onClick={() => handleAdjustSeconds(-30)}
            disabled={remainingMs <= 30000}
            aria-label="Restar 30 segundos"
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-mono-tabular font-medium text-cyan-100/85 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/55 border border-cyan-300/25 disabled:opacity-35 disabled:pointer-events-none transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>30s</span>
          </button>

          {/* Primary Play / Pause Button with Signature White-Neon Rim */}
          <button
            onClick={handleTogglePlay}
            className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-display text-sm sm:text-base font-semibold tracking-wider text-slate-950 bg-white hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.85),0_0_42px_rgba(34,211,238,0.55)] hover:shadow-[0_0_26px_rgba(255,255,255,1),0_0_55px_rgba(34,211,238,0.8)] active:scale-[0.98] transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
                <span>INICIAR</span>
              </>
            )}
          </button>

          {/* Reset to 05:00 Button */}
          <button
            onClick={handleReset}
            aria-label="Reiniciar contador"
            className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium text-white bg-cyan-950/45 hover:bg-cyan-900/60 border border-white/35 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:border-white/70 transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>

          {/* +30s Button */}
          <button
            onClick={() => handleAdjustSeconds(30)}
            aria-label="Sumar 30 segundos"
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-mono-tabular font-medium text-cyan-100/85 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/55 border border-cyan-300/25 transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>30s</span>
          </button>
        </div>

        {/* Mobile Preset Switcher */}
        <div className="flex lg:hidden items-center gap-4 mt-4 text-xs font-mono-tabular">
          {PRESETS.map((preset) => {
            const isSelected = totalDuration === preset.seconds;
            return (
              <button
                key={preset.seconds}
                onClick={() => handleSelectPreset(preset.seconds)}
                className={`py-1 transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'text-white font-semibold underline underline-offset-4 decoration-cyan-300'
                    : 'text-cyan-200/55'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </main>

      {/* Quiet Minimalist Footer with Keyboard Shortcuts */}
      <footer className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-3.5 flex items-center justify-center sm:justify-between text-xs text-cyan-200/50">
        <div className="flex items-center gap-2 font-mono-tabular">
          <span>Espacio: Iniciar / Pausar</span>
          <span aria-hidden="true">·</span>
          <span>R / Esc: Reiniciar</span>
          <span aria-hidden="true">·</span>
          <span>M: Audio</span>
        </div>
        <div className="hidden sm:block font-mono-tabular">
          CUN · Creación de Empresas 3
        </div>
      </footer>

      {/* Full-Screen Fade to Black + Slow "Iniciamos" Reveal upon Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="completion-blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{
                delay: 1.4,
                duration: 2.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider text-white neon-white-text"
            >
              Iniciamos
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
