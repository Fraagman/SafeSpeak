'use client'

import * as React from "react"
import { Waves } from "@/components/ui/wave-background"

export function GlobalWaveBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Waves
        className="w-full h-full"
        strokeColor="rgba(255, 255, 255, 0.3)"
        backgroundColor="rgba(0, 0, 0, 0.85)"
        pointerSize={0.3}
      />
    </div>
  )
}
