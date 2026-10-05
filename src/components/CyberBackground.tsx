import React, { useState } from 'react';
import { motion } from 'motion/react';
import bgImage from '../assets/images/cyber_hud_background_1790636657313.jpg';

interface CyberBackgroundProps {
  isRunning: boolean;
  secondTick: number;
  progress: number;
}

const CANDLESTICKS = [
  { x: 0, bodyTop: 48, bodyHeight: 16, wickTop: 38, wickBottom: 70, bullish: true },
  { x: 18, bodyTop: 36, bodyHeight: 22, wickTop: 28, wickBottom: 66, bullish: true },
  { x: 36, bodyTop: 42, bodyHeight: 18, wickTop: 32, wickBottom: 68, bullish: false },
  { x: 54, bodyTop: 26, bodyHeight: 24, wickTop: 14, wickBottom: 58, bullish: true },
  { x: 72, bodyTop: 18, bodyHeight: 34, wickTop: 6, wickBottom: 60, bullish: false },
  { x: 90, bodyTop: 32, bodyHeight: 22, wickTop: 20, wickBottom: 64, bullish: false },
  { x: 108, bodyTop: 12, bodyHeight: 28, wickTop: 2, wickBottom: 48, bullish: true },
];

export const CyberBackground: React.FC<CyberBackgroundProps> = ({
  isRunning,
  secondTick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#020710]">
      {/* Base Generated High-Resolution Backdrop */}
      {!imgError && (
        <img
          src={bgImage}
          alt="Fondo tecnológico ciber-luminoso con ciudad digital y circuitos"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55 scale-105 transition-transform duration-1000"
        />
      )}

      {/* Radial Teal/Cyan Luminous Core & Deep Navy Vignette (Matches Reference Images) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 52%, rgba(6, 182, 212, 0.28) 0%, rgba(14, 116, 144, 0.16) 32%, rgba(3, 9, 20, 0.86) 68%, rgba(2, 6, 14, 0.98) 100%)
          `,
        }}
      />

      {/* Subtle Second-Tick Ambient Pulse Wave in Center */}
      <motion.div
        key={secondTick}
        initial={{ opacity: isRunning ? 0.36 : 0.15, scale: 0.92 }}
        animate={{ opacity: 0.08, scale: 1.18 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-cyan-400/20 blur-3xl"
      />

      {/* Wireframe Interlocking Gears in Upper Center (From Reference Images) */}
      <div className="absolute left-1/2 top-[16%] -translate-x-1/2 -translate-y-1/2 w-[560px] h-[340px] opacity-25">
        {/* Large Primary Gear */}
        <svg
          viewBox="0 0 200 200"
          className={`absolute left-[110px] top-[10px] w-[230px] h-[230px] text-cyan-300 ${
            isRunning ? 'animate-spin-slow' : ''
          }`}
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="100" cy="100" r="68" strokeDasharray="6 4" />
            <circle cx="100" cy="100" r="54" />
            <circle cx="100" cy="100" r="26" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              return (
                <rect
                  key={i}
                  x="93"
                  y="18"
                  width="14"
                  height="16"
                  rx="2"
                  transform={`rotate(${angle} 100 100)`}
                />
              );
            })}
          </g>
        </svg>

        {/* Secondary Interlocking Gear */}
        <svg
          viewBox="0 0 160 160"
          className={`absolute right-[95px] top-[75px] w-[165px] h-[165px] text-teal-300 ${
            isRunning ? 'animate-spin-reverse-slow' : ''
          }`}
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="80" cy="80" r="48" />
            <circle cx="80" cy="80" r="34" strokeDasharray="4 4" />
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = i * 36;
              return (
                <rect
                  key={i}
                  x="74"
                  y="18"
                  width="12"
                  height="14"
                  rx="1.5"
                  transform={`rotate(${angle} 80 80)`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Circuit Board Traces & Rising Nodes (Left & Right Flanks) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="circuitGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Left Circuit Lines */}
        <g stroke="url(#circuitGrad)" strokeWidth="1.5" fill="none">
          <path d="M 210 850 L 210 520 L 260 470 L 260 210" />
          <path d="M 240 850 L 240 560 L 310 490 L 310 290" />
          <path d="M 160 780 L 160 430 L 200 390 L 200 180" />
          <circle cx="260" cy="210" r="3.5" fill="#fff" />
          <circle cx="310" cy="290" r="3" fill="#22d3ee" />
          <circle cx="200" cy="180" r="3" fill="#fff" />
        </g>

        {/* Right Circuit Lines */}
        <g stroke="url(#circuitGrad)" strokeWidth="1.5" fill="none">
          <path d="M 1230 850 L 1230 500 L 1180 450 L 1180 220" />
          <path d="M 1190 820 L 1190 550 L 1130 490 L 1130 280" />
          <path d="M 1280 790 L 1280 420 L 1240 380 L 1240 160" />
          <circle cx="1180" cy="220" r="3.5" fill="#fff" />
          <circle cx="1130" cy="280" r="3" fill="#22d3ee" />
          <circle cx="1240" cy="160" r="3" fill="#fff" />
        </g>

        {/* Upper-Right Candlestick Chart Motif (Directly from Reference Images) */}
        <g transform="translate(1030, 110)" opacity="0.65">
          {CANDLESTICKS.map((c, idx) => {
            const color = c.bullish ? '#10b981' : '#ef4444';
            return (
              <g key={idx} transform={`translate(${c.x}, 0)`}>
                <line
                  x1="5"
                  y1={c.wickTop}
                  x2="5"
                  y2={c.wickBottom}
                  stroke={color}
                  strokeWidth="1.5"
                />
                <rect
                  x="0"
                  y={c.bodyTop}
                  width="10"
                  height={c.bodyHeight}
                  rx="1"
                  fill={color}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom Cityscape Luminous Horizon Grid Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 opacity-40"
        style={{
          background:
            'linear-gradient(to top, rgba(6, 182, 212, 0.18) 0%, rgba(8, 145, 178, 0.05) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
