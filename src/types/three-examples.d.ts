declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  
  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    render(): void;
    setSize(width: number, height: number): void;
    addPass(pass: Pass): void;
    insertPass(pass: Pass, index: number): void;
    isLastEnabledPass(passIndex: number): boolean;
    renderToScreen: boolean;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Camera, Scene, WebGLRenderer } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  
  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera, overrideMaterial?: any, clearColor?: any, clearAlpha?: number);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2, WebGLRenderTarget } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  
  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
    renderTarget: WebGLRenderTarget;
  }
}

declare module 'three/examples/jsm/postprocessing/Pass' {
  import { WebGLRenderer, WebGLRenderTarget } from 'three';
  
  export class Pass {
    enabled: boolean;
    needsSwap: boolean;
    clear: boolean;
    renderToScreen: boolean;
    
    setSize(width: number, height: number): void;
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime?: number, maskActive?: boolean): void;
  }
}
