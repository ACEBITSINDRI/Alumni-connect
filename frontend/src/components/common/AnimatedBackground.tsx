import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedBackgroundProps {
  variant?: 'stars' | 'grid' | 'particles' | 'waves' | 'construction' | 'aurora';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'stars' }) => {
  const { theme } = useTheme();

  if (theme !== 'dark') return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {variant === 'stars' && <StarsBackground />}
      {variant === 'grid' && <GridBackground />}
      {variant === 'particles' && <ParticlesBackground />}
      {variant === 'waves' && <WavesBackground />}
      {variant === 'construction' && <ConstructionBackground />}
      {variant === 'aurora' && <AuroraBackground />}
    </div>
  );
};

// Stars Background - Twinkling stars effect
const StarsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Grid Background - Glowing grid lines
const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="gridGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <animate attributeName="x1" values="0%;100%;0%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="y1" values="0%;100%;0%" dur="15s" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(249, 115, 22, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#gridGlow)" opacity="0.1" />
      </svg>
    </div>
  );
};

// Particles Background - Floating particles
const ParticlesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-orange-400 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            opacity: 0.3 + Math.random() * 0.3,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-10px, -40px) scale(0.9);
          }
          75% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Waves Background - Animated gradient waves
const WavesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-30">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6">
              <animate attributeName="stop-color" values="#3b82f6;#f97316;#3b82f6" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#f97316">
              <animate attributeName="stop-color" values="#f97316;#3b82f6;#f97316" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#wave1)"
          d="M0,160 Q250,200 500,160 T1000,160 T1500,160 T2000,160 V400 H0 Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="M0,160 Q250,200 500,160 T1000,160 T1500,160 T2000,160 V400 H0 Z;
                    M0,140 Q250,180 500,140 T1000,140 T1500,140 T2000,140 V400 H0 Z;
                    M0,160 Q250,200 500,160 T1000,160 T1500,160 T2000,160 V400 H0 Z"
          />
        </path>
        <path
          fill="url(#wave1)"
          opacity="0.5"
          d="M0,200 Q250,240 500,200 T1000,200 T1500,200 T2000,200 V400 H0 Z"
        >
          <animate
            attributeName="d"
            dur="15s"
            repeatCount="indefinite"
            values="M0,200 Q250,240 500,200 T1000,200 T1500,200 T2000,200 V400 H0 Z;
                    M0,220 Q250,180 500,220 T1000,220 T1500,220 T2000,220 V400 H0 Z;
                    M0,200 Q250,240 500,200 T1000,200 T1500,200 T2000,200 V400 H0 Z"
          />
        </path>
      </svg>
    </div>
  );
};

// Construction Background - Civil engineering themed elements
const ConstructionBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      {/* Bridge structures */}
      {[...Array(3)].map((_, i) => (
        <svg
          key={`bridge-${i}`}
          className="absolute animate-pulse-slow"
          width="200"
          height="100"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        >
          <path
            d="M 10 80 Q 100 20 190 80"
            stroke="rgba(249, 115, 22, 0.6)"
            strokeWidth="3"
            fill="none"
          />
          <line x1="50" y1="40" x2="50" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
          <line x1="150" y1="40" x2="150" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
        </svg>
      ))}

      {/* Building structures */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`building-${i}`}
          className="absolute border-2 border-blue-500 animate-build"
          style={{
            left: `${60 + i * 15}%`,
            bottom: '10%',
            width: `${40 + Math.random() * 30}px`,
            height: `${60 + Math.random() * 40}px`,
            animationDelay: `${i * 1.5}s`,
          }}
        >
          {[...Array(3)].map((_, j) => (
            <div
              key={j}
              className="absolute w-2 h-2 bg-orange-400"
              style={{
                left: `${20 + j * 30}%`,
                top: `${20 + j * 25}%`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Geometric shapes - representing planning */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx={`${20 + i * 20}%`}
            cy={`${30 + (i % 2) * 30}%`}
            r={`${5 + Math.random() * 10}`}
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="2"
            filter="url(#glow)"
            className="animate-pulse-slow"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes build {
          0% {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
          }
          50% {
            opacity: 0.5;
            transform: scaleY(0.5);
          }
          100% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        .animate-build {
          animation: build 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

// Aurora Background - Northern Lights with Chenab Bridge Animation
const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-40">
      {/* Aurora Northern Lights */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Aurora Gradient 1 - Green to Blue */}
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981">
              <animate attributeName="stop-color" values="#10b981;#3b82f6;#8b5cf6;#10b981" dur="15s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#3b82f6">
              <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#ec4899;#3b82f6" dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b5cf6">
              <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#10b981;#8b5cf6" dur="18s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Aurora Gradient 2 - Purple to Pink */}
          <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6">
              <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#f97316;#8b5cf6" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ec4899">
              <animate attributeName="stop-color" values="#ec4899;#f97316;#8b5cf6;#ec4899" dur="16s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Glow Filter */}
          <filter id="auroraGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Aurora Waves */}
        <path
          fill="url(#aurora1)"
          opacity="0.6"
          filter="url(#auroraGlow)"
          d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V0 H0 Z"
        >
          <animate
            attributeName="d"
            dur="25s"
            repeatCount="indefinite"
            values="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V0 H0 Z;
                    M0,120 Q250,80 500,120 T1000,120 T1500,120 T2000,120 V0 H0 Z;
                    M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100 V0 H0 Z"
          />
        </path>

        <path
          fill="url(#aurora2)"
          opacity="0.5"
          filter="url(#auroraGlow)"
          d="M0,150 Q300,100 600,150 T1200,150 T1800,150 T2400,150 V0 H0 Z"
        >
          <animate
            attributeName="d"
            dur="30s"
            repeatCount="indefinite"
            values="M0,150 Q300,100 600,150 T1200,150 T1800,150 T2400,150 V0 H0 Z;
                    M0,130 Q300,170 600,130 T1200,130 T1800,130 T2400,130 V0 H0 Z;
                    M0,150 Q300,100 600,150 T1200,150 T1800,150 T2400,150 V0 H0 Z"
          />
        </path>

        {/* Shimmer particles */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={`shimmer-${i}`}
            cx={`${(i * 5) % 100}%`}
            cy={`${10 + (i * 3) % 40}%`}
            r="2"
            fill="#fff"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur={`${3 + Math.random() * 4}s`}
              repeatCount="indefinite"
              begin={`${Math.random() * 5}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Chenab Bridge Animation - 2D Construction */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
        <svg viewBox="0 0 800 300" className="w-full h-auto">
          <defs>
            <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Main Bridge Deck - Animating construction */}
          <g className="animate-bridge-build">
            <path
              d="M 50 200 Q 400 180 750 200"
              stroke="url(#bridgeGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1000"
                to="0"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Main Arch - World's highest railway bridge arch */}
          <g className="animate-arch-build">
            <path
              d="M 200 200 Q 400 80 600 200"
              stroke="#3b82f6"
              strokeWidth="6"
              fill="none"
              opacity="0.8"
              strokeDasharray="800"
              strokeDashoffset="800"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="800"
                to="0"
                dur="10s"
                repeatCount="indefinite"
                begin="1s"
              />
            </path>
          </g>

          {/* Support Cables - Multiple cables */}
          {[...Array(15)].map((_, i) => {
            const x = 200 + (i * 400 / 14);
            const archY = 80 + Math.pow((x - 400) / 200, 2) * 120;
            return (
              <line
                key={`cable-${i}`}
                x1={x}
                y1={archY}
                x2={x}
                y2="200"
                stroke="#f97316"
                strokeWidth="1.5"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.7"
                  dur="0.5s"
                  begin={`${2 + i * 0.3}s`}
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </line>
            );
          })}

          {/* Support Pillars */}
          <g opacity="0.6">
            {/* Left Pillar */}
            <rect x="180" y="200" width="20" height="80" fill="#64748b">
              <animate attributeName="height" from="0" to="80" dur="3s" begin="5s" fill="freeze" repeatCount="indefinite" />
            </rect>
            {/* Right Pillar */}
            <rect x="600" y="200" width="20" height="80" fill="#64748b">
              <animate attributeName="height" from="0" to="80" dur="3s" begin="5.5s" fill="freeze" repeatCount="indefinite" />
            </rect>
          </g>

          {/* Bridge Details - Deck sections */}
          <g opacity="0.4">
            {[...Array(30)].map((_, i) => (
              <rect
                key={`deck-${i}`}
                x={50 + i * 24}
                y="198"
                width="20"
                height="4"
                fill="#94a3b8"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.8"
                  dur="0.3s"
                  begin={`${6 + i * 0.1}s`}
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </rect>
            ))}
          </g>

          {/* Lighting/Glow effect on bridge */}
          <circle cx="400" cy="140" r="40" fill="url(#aurora1)" opacity="0.2">
            <animate attributeName="r" values="40;50;40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Construction Progress Text */}
          <text x="400" y="260" textAnchor="middle" fill="#94a3b8" fontSize="12" opacity="0.6">
            <tspan>Chenab Bridge - World's Highest Railway Bridge</tspan>
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </text>
        </svg>
      </div>

      <style>{`
        @keyframes bridge-build {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-bridge-build {
          animation: bridge-build 2s ease-out forwards;
        }

        @keyframes arch-build {
          0% { opacity: 0; }
          30% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-arch-build {
          animation: arch-build 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
