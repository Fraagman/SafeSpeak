"use client";

import React from "react";
import { useId } from "react";

export function FeaturesSectionWithCardGradient() {
  return (
    <div className="py-20 lg:py-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
          >
            <Grid size={20} />
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
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
  const p =
    pattern ?? [
      [7, 2],
      [9, 5],
      [8, 1],
      [10, 4],
      [7, 6],
    ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
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
