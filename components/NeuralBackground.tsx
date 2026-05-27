"use client";

export function NeuralBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-hero-glow" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-nexora-blue/20 blur-3xl" />
      <div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse-slow rounded-full bg-nexora-purple/20 blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      {/* Neural nodes */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1200 800">
        <g stroke="url(#lineGrad)" strokeWidth="1" fill="none">
          <line x1="100" y1="200" x2="350" y2="150" />
          <line x1="350" y1="150" x2="600" y2="250" />
          <line x1="600" y1="250" x2="900" y2="180" />
          <line x1="350" y1="150" x2="400" y2="400" />
          <line x1="600" y1="250" x2="550" y2="500" />
          <line x1="900" y1="180" x2="1000" y2="450" />
          <line x1="200" y1="550" x2="400" y2="400" />
          <line x1="550" y1="500" x2="800" y2="600" />
        </g>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {[
          [100, 200],
          [350, 150],
          [600, 250],
          [900, 180],
          [400, 400],
          [550, 500],
          [1000, 450],
          [200, 550],
          [800, 600],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#22d3ee" className="animate-pulse" />
        ))}
      </svg>
    </div>
  );
}
