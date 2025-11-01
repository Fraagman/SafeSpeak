"use client";

import { useEffect, useRef } from 'react';

interface ParallaxBackgroundProps {
  className?: string;
}

export function ParallaxBackground({ className = "" }: ParallaxBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const loadGSAP = async () => {
      try {
        console.log('Loading GSAP for parallax...');
        
        // Load GSAP and plugins dynamically
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
        
        console.log('GSAP loaded:', gsap);
        console.log('ScrollTrigger loaded:', ScrollTrigger);
        
        gsap.registerPlugin(ScrollTrigger);
        console.log('ScrollTrigger registered');

        // Load Lenis for smooth scrolling
        const { default: Lenis } = await import('@studio-freight/lenis');
        console.log('Lenis loaded:', Lenis);

        const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');
        console.log('Trigger element found:', triggerElement);

        if (triggerElement) {
          // Kill any existing ScrollTriggers first
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom top",
              scrub: 0.5
            }
          });

          console.log('Timeline created with ScrollTrigger');

          // The layers from the component
          const layers = [
            { layer: "1", yPercent: 150 }, // Furthest back - increased from 70
            { layer: "2", yPercent: 120 }, // Increased from 55
            { layer: "4", yPercent: 30 },  // Increased from 10
            { layer: "3", yPercent: 80 }   // Title - increased from 40
          ];

          layers.forEach((layerObj, idx) => {
            const elements = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
            console.log(`Found ${elements.length} elements for layer ${layerObj.layer}`);
            
            tl.to(
              elements,
              {
                yPercent: layerObj.yPercent,
                ease: "none"
              },
              idx === 0 ? undefined : "<"
            );
          });

          console.log('Parallax animation setup complete');
        }

        // Set up Lenis for smooth scrolling
        const lenis = new Lenis();

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        console.log('Lenis setup complete');

        // Cleanup
        return () => {
          console.log('Cleaning up parallax...');
          lenis.destroy();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
      } catch (error) {
        console.error('Error loading parallax libraries:', error);
      }
    };

    loadGSAP();
  }, []);

  return (
    <div ref={parallaxRef} className={`parallax ${className}`}>
      {/* Parallax Header Section */}
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
          {/* Layer 1 (Furthest Back) */}
          <img 
            src="https://i.im.ge/2025/10/31/nzQCxC.Gemini-Generated-Image-c1b0j1c1b0j1c1b0.png" 
            loading="eager" 
            width="800" 
            data-parallax-layer="1" 
            alt="Parallax background layer 1" 
            className="parallax__layer-img" 
          />
          
          {/* Layer 2 */}
          <img 
            src="https://i.im.ge/2025/10/31/nzQguf.Gemini-Generated-Image-51onn551onn551on-Photoroom.png" 
            loading="eager" 
            width="800" 
            data-parallax-layer="2" 
            alt="Parallax background layer 2" 
            className="parallax__layer-img" 
          />
          
          {/* Layer 4 (now behind the title) */}
          <img 
            src="https://i.im.ge/2025/10/31/nzQyQD.gemini-2-5-flash-image-preview-nano-banana-a-Generate-3-different-Photoroom.png" 
            loading="eager" 
            width="800" 
            data-parallax-layer="4" 
            alt="Parallax foreground layer" 
            className="parallax__layer-img" 
          />

          {/* Layer 3 (Title - now in front) */}
          <div data-parallax-layer="3" className="parallax__layer-title">
            <h2 className="parallax__title">Resources</h2>
          </div>
        </div>
          
          {/* Gradient fade to smooth transition to content */}
          <div className="parallax__fade"></div>
        </div>
      </section>

      <style jsx>{`
        .parallax__header {
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .parallax__visuals {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .parallax__layers {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Base styles for all layers */
        [data-parallax-layer] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
          /* Set initial transform to avoid flicker */
          transform: translate3d(0, 0, 0);
        }

        .parallax__layer-img {
          object-fit: cover;
        }

        /* Define the stacking order (z-index).
           1: Back (Layer 1)
           2: Middle (Layer 2)
           3: Front (Layer 4 - the image)
           4: Title (Layer 3 - the "Resources" text)
        */
        [data-parallax-layer="1"] { z-index: 1; }
        [data-parallax-layer="2"] { z-index: 2; }
        [data-parallax-layer="4"] { z-index: 3; } /* Image is at z-index 3 */
        [data-parallax-layer="3"] {
          z-index: 4; /* Title is at z-index 4 (in front of the image) */
          /* Use flex to center the title */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .parallax__title {
          font-size: clamp(4rem, 12vw, 10rem); /* Responsive font size */
          font-weight: 800;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .parallax__fade {
          position: absolute;
          bottom: -1px; /* Avoid pixel gap */
          left: 0;
          width: 100%;
          height: 10rem;
          /* Fades from transparent to the content background color */
          background: linear-gradient(to top, #0a0a0a, transparent);
          z-index: 5; /* On top of all layers, ensuring fade covers elements */
        }
      `}</style>
    </div>
  );
}
