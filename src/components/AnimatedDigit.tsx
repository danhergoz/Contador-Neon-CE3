import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface AnimatedDigitProps {
  digit: string;
  isWarning?: boolean;
  isComplete?: boolean;
}

export const AnimatedDigit: React.FC<AnimatedDigitProps> = ({
  digit,
  isWarning = false,
  isComplete = false,
}) => {
  const glowClass = isComplete
    ? 'neon-white-text'
    : isWarning
    ? 'neon-amber-text'
    : 'neon-white-text';

  return (
    <div className="relative inline-flex items-center justify-center w-[0.68em] h-[1.15em] overflow-visible select-none">
      {/* Subtle vertical guide frame behind each digit */}
      <div className="absolute inset-x-1 inset-y-2 rounded-xl bg-cyan-950/15 border border-cyan-300/10 backdrop-blur-[2px] pointer-events-none" />

      {/* Smooth attenuated cross-fade dissolve transition between digits */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="sync" initial={false}>
          <motion.span
            key={digit}
            initial={{
              opacity: 0,
              scale: 0.97,
              filter: 'blur(3px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: 'blur(3px)',
            }}
            transition={{
              duration: 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`absolute inset-0 flex items-center justify-center font-display font-bold leading-none tracking-tight tabular-nums ${glowClass}`}
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
