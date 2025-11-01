"use client";

import React from "react";
import { useId } from "react";

export function FeaturesSectionWithCardGradient() {
  return (
    <div className="py-20 lg:py-40 bg-black/20 backdrop-blur-sm">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Platform Features
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Built with privacy-first principles to ensure your safety and security
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 max-w-7xl mx-auto px-4">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Grid size={20} />
            <h3 className="text-base font-bold text-neutral-800 dark:text-white relative z-20 mb-3">
              {feature.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm font-normal relative z-20 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = [
  {
    title: "End-to-End Encryption",
    description:
      "Your reports are protected with military-grade encryption, ensuring only authorized parties can access your sensitive information.",
  },
  {
    title: "Complete Anonymity",
    description:
      "Submit reports without revealing your identity. Our system removes all personal identifiers before processing your submission.",
  },
  {
    title: "AI-Powered Triage",
    description:
      "Smart categorization and prioritization of reports using advanced AI to ensure urgent cases get immediate attention.",
  },
  {
    title: "Verified NGO Network",
    description:
      "Connect with trusted and verified non-profit organizations that can provide the help and support you need.",
  },
  {
    title: "Real-Time Support",
    description:
      "Get immediate assistance through our integrated chat system with trained professionals ready to help you 24/7.",
  },
  {
    title: "Secure Document Upload",
    description:
      "Safely upload evidence and documents with encrypted storage and secure sharing with authorized organizations.",
  },
  {
    title: "Multi-Language Support",
    description:
      "Access our platform in multiple languages to ensure everyone can report safely and comfortably in their preferred language.",
  },
  {
    title: "Legal Protection Guidance",
    description:
      "Receive guidance on your legal rights and protections throughout the reporting process from qualified legal experts.",
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  // Deterministic, per-instance pattern to avoid hydration mismatches
  const stablePattern = React.useMemo(() => {
    if (pattern) return pattern;
    return [
      [7, 2],
      [9, 5],
      [8, 1],
      [10, 4],
      [7, 6],
    ];
  }, [pattern]);
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-purple-900/20 from-blue-100/20 to-pink-300/20 dark:to-purple-900/20 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={stablePattern}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-purple-400/10 dark:stroke-purple-400/10 stroke-blue-400/10 fill-blue-400/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, i: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${i}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
