import React from 'react';

interface CunLogoProps {
  className?: string;
  showSubtext?: boolean;
}

/**
 * High-precision all-white vector reproduction of Logo_CUN (Blanco).png
 * "cun" calligraphic mark + "Corporación Unificada Nacional de Educación Superior" in pure white (#FFFFFF)
 */
export const CunLogo: React.FC<CunLogoProps> = ({
  className = 'h-14 w-auto',
  showSubtext = true,
}) => {
  return (
    <svg
      viewBox={showSubtext ? '60 45 880 450' : '80 55 840 265'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none neon-svg-glow-soft`}
      role="img"
      aria-label="CUN - Corporación Unificada Nacional de Educación Superior"
    >
      {/* Letter "n" (Pure White #FFFFFF) */}
      <path
        d="M 556 172
           C 582 126, 616 92, 642 94
           C 666 96, 668 126, 658 158
           C 655 168, 658 172, 666 165
           C 698 136, 738 96, 772 98
           C 800 100, 804 134, 792 178
           C 780 218, 778 232, 788 232
           C 802 232, 845 194, 892 146
           C 896 142, 900 145, 899 154
           C 898 168, 895 178, 888 186
           C 846 232, 802 276, 770 274
           C 738 272, 732 236, 746 184
           C 754 152, 754 136, 742 138
           C 722 140, 664 196, 612 252
           C 596 268, 572 266, 566 244
           C 562 228, 574 198, 608 158
           C 618 146, 618 136, 610 136
           C 598 136, 578 156, 554 182
           Z"
        fill="#FFFFFF"
      />

      {/* Letter "u" body (Pure White #FFFFFF) */}
      <path
        d="M 350 84
           C 355 78, 362 82, 366 92
           C 386 144, 422 246, 464 246
           C 506 246, 554 142, 582 78
           C 586 70, 591 72, 590 82
           C 586 124, 536 298, 464 300
           C 394 302, 342 198, 324 142
           C 318 122, 334 98, 350 84
           Z"
        fill="#FFFFFF"
      />

      {/* Floating Dot above "u" (Pure White #FFFFFF) */}
      <ellipse
        cx="463"
        cy="111"
        rx="37"
        ry="43"
        transform="rotate(-4 463 111)"
        fill="#FFFFFF"
      />

      {/* Letter "c" (Pure White #FFFFFF) */}
      <path
        d="M 266 135
           C 274 146, 294 142, 300 126
           C 306 106, 286 88, 254 90
           C 186 94, 104 168, 104 248
           C 104 288, 134 308, 174 302
           C 226 294, 294 236, 352 178
           C 356 174, 356 152, 354 138
           C 352 134, 348 136, 342 142
           C 286 198, 224 252, 180 256
           C 156 258, 146 242, 152 216
           C 162 172, 214 126, 254 126
           C 262 126, 263 130, 266 135
           Z"
        fill="#FFFFFF"
      />

      {/* Institutional Typography (Pure White #FFFFFF) */}
      {showSubtext && (
        <g fill="#FFFFFF" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">
          <text
            x="500"
            y="402"
            textAnchor="middle"
            fontSize="54"
            letterSpacing="-0.5"
          >
            Corporación Unificada Nacional
          </text>
          <text
            x="500"
            y="466"
            textAnchor="middle"
            fontSize="54"
            letterSpacing="-0.5"
          >
            de Educación Superior
          </text>
        </g>
      )}
    </svg>
  );
};
