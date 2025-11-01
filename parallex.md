<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parallax Scroll Effect</title>
    
    <!-- Load Tailwind CSS --><script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Load GSAP (GreenSock), ScrollTrigger plugin, and Lenis --><script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>

    <script>
        // Configure Tailwind CSS
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        inter: ['Inter', 'sans-serif'],
                    },
                },
            },
        };
    </script>

    <style>
        /* We need some custom CSS for the core parallax layering */
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #111827; /* Dark background */
        }

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
            background: linear-gradient(to top, #111827, transparent);
            z-index: 5; /* On top of all layers, ensuring fade covers elements */
        }

        .parallax__content {
            /* This is the content *after* the parallax header */
            position: relative; /* Ensures it sits below the header */
            background-color: #111827;
            color: #f3f4f6;
            z-index: 10; /* Sits above the parallax elements */
        }

        .osmo-icon-svg {
            width: 6rem;
            height: 6rem;
            color: #3b82f6; /* Blue color for the icon */
        }
    </style>
</head>
<body class="font-inter">

    <!-- 
        This is the HTML structure from your React component.
        I've added Tailwind classes for the content section.
    --><div class="parallax">
        
        <!-- Parallax Header Section --><section class="parallax__header">
            <div class="parallax__visuals">
                <div data-parallax-layers class="parallax__layers">
                    <!-- Layer 1 (Furthest Back) --><img src="https://i.im.ge/2025/10/31/nzQCxC.Gemini-Generated-Image-c1b0j1c1b0j1c1b0.png" loading="eager" width="800" data-parallax-layer="1" alt="Parallax background layer 1" class="parallax__layer-img" />
                    
                    <!-- Layer 2 --><img src="https://i.im.ge/2025/10/31/nzQguf.Gemini-Generated-Image-51onn551onn551on-Photoroom.png" loading="eager" width="800" data-parallax-layer="2" alt="Parallax background layer 2" class="parallax__layer-img" />
                    
                    <!-- Layer 4 (now behind the title) --><img src="https://i.im.ge/2025/10/31/nzQyQD.gemini-2-5-flash-image-preview-nano-banana-a-Generate-3-different-Photoroom.png" loading="eager" width="800" data-parallax-layer="4" alt="Parallax foreground layer" class="parallax__layer-img" />

                    <!-- Layer 3 (Title - now in front) --><div data-parallax-layer="3" class="parallax__layer-title">
                        <h2 class="parallax__title">Resources</h2>
                    </div>
                    
                </div>
                
                <!-- Gradient fade to smooth transition to content --><div class="parallax__fade"></div>
            </div>
        </section>

        <!-- Content Section (to scroll into) --><!--
        <section class="parallax__content">
            <div class="container mx-auto max-w-4xl px-6 py-24">
                
                --><!-- The SVG icon from your component --><!--
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" class="osmo-icon-svg mb-8">
                    <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
                </svg>

                <h3 class="text-4xl md:text-5xl font-bold mb-6 text-gray-100">Content Section</h3>
                <p class="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                    This is the content that appears after the parallax effect. Scrolling down moves the layers in the header at different speeds, creating a 3D depth effect.
                </p>
                <p class="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.
                </all>
                <p class="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                    Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                </p>
                <p class="text-lg md:text-xl text-gray-300 leading-relaxed">
                    Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vestibulum id ligula porta felis euismod semper. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                </p>
            </div>
        </section>
        -->
    </div>

    <script>
        // This is the logic from your component's useEffect
        document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);

            const triggerElement = document.querySelector('[data-parallax-layers]');

            if (triggerElement) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: triggerElement,
                        start: "0% 0%", // When the top of the trigger hits the top of the viewport
                        end: "100% 0%", // When the bottom of the trigger hits the top of the viewport
                        scrub: 0.5 // Smooth scrubbing
                    }
                });

                // The layers from your component
                const layers = [
                    { layer: "1", yPercent: 70 }, // Furthest back
                    { layer: "2", yPercent: 55 }, 
                    { layer: "4", yPercent: 10 }, // This is the image (behind the text)
                    { layer: "3", yPercent: 40 }  // This is the title (in front)
                ];

                layers.forEach((layerObj, idx) => {
                    tl.to(
                        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
                        {
                            yPercent: layerObj.yPercent,
                            ease: "none"
                        },
                        idx === 0 ? undefined : "<" // All animations start at the same time
                    );
                });
            }

            // Set up Lenis for smooth scrolling
            const lenis = new Lenis();

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        });
    </script>

</body>
</html>

