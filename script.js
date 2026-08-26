/* =========================================================
   VIRTUAL GENIE
   WEBGL EXPERIENCE ENGINE
   MOBILE FIRST
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       BASIC SETUP
    ===================================================== */

    const canvas =
        document.getElementById("experience");

    if (!canvas || typeof THREE === "undefined") {
        console.error("Virtual Genie: Three.js or canvas missing.");
        return;
    }


    const isMobile =
        window.matchMedia("(max-width: 700px)").matches;

    const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;


    const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1.35 : 1.8
    );


    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x050505);


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(
            isMobile ? 54 : 48,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );


    camera.position.set(
        0,
        0,
        isMobile ? 9 : 10
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: !isMobile,
            alpha: false,
            powerPreference: "high-performance"
        });


    renderer.setPixelRatio(pixelRatio);

    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
        false
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /* =====================================================
       GROUPS
    ===================================================== */

    const world =
        new THREE.Group();

    const coreGroup =
        new THREE.Group();

    const panelGroup =
        new THREE.Group();

    const particleGroup =
        new THREE.Group();


    scene.add(world);

    world.add(coreGroup);
    world.add(panelGroup);
    world.add(particleGroup);


    /* =====================================================
       UTILITY
    ===================================================== */

    const clamp = (
        value,
        min,
        max
    ) =>
        Math.max(
            min,
            Math.min(max, value)
        );


    const lerp = (
        a,
        b,
        amount
    ) =>
        a + (b - a) * amount;


    /* =====================================================
       PARTICLE FIELD
    ===================================================== */

    const particleCount =
        isMobile ? 950 : 1900;


    const particlePositions =
        new Float32Array(
            particleCount * 3
        );


    const particleColors =
        new Float32Array(
            particleCount * 3
        );


    const particleSizes =
        new Float32Array(
            particleCount
        );


    const particleData = [];


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 = i * 3;


        /*
           Large 3D cloud.
           We deliberately keep it sparse
           on mobile.
        */

        const radius =
            4.5 +
            Math.random() * 7;


        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        const y =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        const z =
            radius *
            Math.cos(phi);


        particlePositions[i3] =
            x;

        particlePositions[i3 + 1] =
            y;

        particlePositions[i3 + 2] =
            z;


        /*
           Mostly white/grey particles.
           A very small number get a
           restrained cool accent.
        */

        const accent =
            Math.random() > 0.9;


        if (accent) {

            particleColors[i3] =
                0.55;

            particleColors[i3 + 1] =
                0.50;

            particleColors[i3 + 2] =
                0.72;

        } else {

            const brightness =
                0.35 +
                Math.random() * 0.65;


            particleColors[i3] =
                brightness;

            particleColors[i3 + 1] =
                brightness;

            particleColors[i3 + 2] =
                brightness * 0.98;

        }


        particleSizes[i] =
            isMobile
                ? 1.1 + Math.random() * 1.8
                : 1.0 + Math.random() * 2.3;


        particleData.push({
            baseX: x,
            baseY: y,
            baseZ: z,
            speed:
                0.15 +
                Math.random() * 0.45,
            phase:
                Math.random() *
                Math.PI *
                2
        });

    }


    const particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            particlePositions,
            3
        )
    );


    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            particleColors,
            3
        )
    );


    particleGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            particleSizes,
            1
        )
    );


    /*
       Small circular particle texture.
    */

    const particleCanvas =
        document.createElement("canvas");

    particleCanvas.width = 32;
    particleCanvas.height = 32;


    const particleContext =
        particleCanvas.getContext("2d");


    const particleGradient =
        particleContext.createRadialGradient(
            16,
            16,
            0,
            16,
            16,
            16
        );


    particleGradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );


    particleGradient.addColorStop(
        0.35,
        "rgba(255,255,255,.75)"
    );


    particleGradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    particleContext.fillStyle =
        particleGradient;


    particleContext.fillRect(
        0,
        0,
        32,
        32
    );


    const particleTexture =
        new THREE.CanvasTexture(
            particleCanvas
        );


    const particleMaterial =
        new THREE.PointsMaterial({
            size:
                isMobile
                    ? 0.055
                    : 0.065,

            map: particleTexture,

            transparent: true,

            opacity: 0.78,

            vertexColors: true,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    particleGroup.add(
        particles
    );


    /* =====================================================
       CENTRAL CORE
    ===================================================== */

    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xf1f0eb,
            wireframe: true,
            transparent: true,
            opacity: 0.58
        });


    const coreGeometry =
        new THREE.IcosahedronGeometry(
            isMobile ? 0.72 : 0.9,
            2
        );


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );


    coreGroup.add(core);


    /* =====================================================
       CENTRAL RINGS
    ===================================================== */

    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xcfcfc8,
            transparent: true,
            opacity: 0.32
        });


    function createRing(
        radius,
        rotationX,
        rotationY,
        opacity
    ) {

        const geometry =
            new THREE.TorusGeometry(
                radius,
                isMobile
                    ? 0.008
                    : 0.012,
                8,
                96
            );


        const material =
            ringMaterial.clone();


        material.opacity =
            opacity;


        const ring =
            new THREE.Mesh(
                geometry,
                material
            );


        ring.rotation.x =
            rotationX;

        ring.rotation.y =
            rotationY;


        coreGroup.add(ring);


        return ring;

    }


    const ringA =
        createRing(
            1.05,
            Math.PI / 2,
            0,
            0.42
        );


    const ringB =
        createRing(
            1.35,
            0.8,
            0.5,
            0.20
        );


    const ringC =
        createRing(
            1.7,
            1.4,
            -0.3,
            0.12
        );


    /* =====================================================
       INNER LIGHT
    ===================================================== */

    const lightGeometry =
        new THREE.SphereGeometry(
            0.12,
            16,
            16
        );


    const lightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xf4f2ec
        });


    const coreLight =
        new THREE.Mesh(
            lightGeometry,
            lightMaterial
        );


    coreGroup.add(
        coreLight
    );


    /* =====================================================
       PANEL TEXTURE CREATOR
    ===================================================== */

    function createPanelTexture(
        eyebrow,
        title,
        lines,
        accentText
    ) {

        const width =
            isMobile ? 720 : 900;


        const height =
            isMobile ? 460 : 520;


        const c =
            document.createElement(
                "canvas"
            );


        c.width = width;
        c.height = height;


        const ctx =
            c.getContext("2d");


        ctx.fillStyle =
            "#0a0a0a";


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
           Outer border
        */

        ctx.strokeStyle =
            "rgba(241,240,235,.28)";


        ctx.lineWidth = 2;


        ctx.strokeRect(
            1,
            1,
            width - 2,
            height - 2
        );


        /*
           Eyebrow
        */

        ctx.fillStyle =
            "#777773";


        ctx.font =
            "700 18px Arial";


        ctx.letterSpacing =
            "4px";


        ctx.fillText(
            eyebrow.toUpperCase(),
            42,
            55
        );


        /*
           Main title
        */

        ctx.fillStyle =
            "#f1f0eb";


        ctx.font =
            "600 47px Arial";


        const titleLines =
            title.split("\n");


        titleLines.forEach(
            (line, index) => {

                ctx.fillText(
                    line,
                    42,
                    130 +
                    index * 58
                );

            }
        );


        /*
           Divider
        */

        ctx.strokeStyle =
            "rgba(241,240,235,.14)";


        ctx.beginPath();

        ctx.moveTo(
            42,
            245
        );

        ctx.lineTo(
            width - 42,
            245
        );

        ctx.stroke();


        /*
           Body lines
        */

        ctx.fillStyle =
            "#8b8b86";


        ctx.font =
            "22px Arial";


        lines.forEach(
            (line, index) => {

                ctx.fillText(
                    line,
                    42,
                    300 +
                    index * 38
                );

            }
        );


        /*
           Accent/result
        */

        ctx.fillStyle =
            "#d8ff5a";


        ctx.font =
            "700 16px Arial";


        ctx.fillText(
            accentText.toUpperCase(),
            42,
            height - 35
        );


        return new THREE.CanvasTexture(
            c
        );

    }


    /* =====================================================
       FLOATING PANELS
    ===================================================== */

    const panelDefinitions = [

        {
            eyebrow:
                "AI RECEPTIONIST",

            title:
                "EVERY CALL\nBECOMES ACTION.",

            lines: [
                "ANSWER",
                "QUALIFY",
                "BOOK",
                "FOLLOW UP"
            ],

            accent:
                "LIVE SYSTEM",

            position:
                [-2.7, 0.8, -0.7],

            rotation:
                [0.05, 0.25, -0.06],

            scale:
                1
        },


        {
            eyebrow:
                "LEAD GENERATION",

            title:
                "FIND THE SIGNAL\nIN THE NOISE.",

            lines: [
                "DISCOVER",
                "STRUCTURE",
                "QUALIFY",
                "DELIVER"
            ],

            accent:
                "128 OPPORTUNITIES",

            position:
                [2.6, -0.3, -2],

            rotation:
                [-0.04, -0.25, 0.05],

            scale:
                0.86
        },


        {
            eyebrow:
                "AI INFRASTRUCTURE",

            title:
                "CONNECT\nEVERYTHING.",

            lines: [
                "CRM",
                "PHONE",
                "DATA",
                "AUTOMATION"
            ],

            accent:
                "SYSTEM CONNECTED",

            position:
                [-2.2, -1.8, -3.4],

            rotation:
                [0.08, 0.18, 0.04],

            scale:
                0.74
        },


        {
            eyebrow:
                "BUSINESS OS",

            title:
                "ONE SYSTEM.\nONE COMMAND CENTER.",

            lines: [
                "SALES",
                "OPERATIONS",
                "CUSTOMERS",
                "INTELLIGENCE"
            ],

            accent:
                "SYSTEM ONLINE",

            position:
                [2.5, 1.8, -4.2],

            rotation:
                [-0.08, -0.18, -0.04],

            scale:
                0.68
        }

    ];


    const panelObjects = [];


    panelDefinitions.forEach(
        definition => {

            const texture =
                createPanelTexture(
                    definition.eyebrow,
                    definition.title,
                    definition.lines,
                    definition.accent
                );


            const geometry =
                new THREE.PlaneGeometry(
                    3.8,
                    2.42
                );


            const material =
                new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide
                });


            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );


            mesh.position.set(
                ...definition.position
            );


            mesh.rotation.set(
                ...definition.rotation
            );


            mesh.scale.setScalar(
                definition.scale
            );


            panelGroup.add(
                mesh
            );


            panelObjects.push({
                mesh,
                material,
                basePosition:
                    new THREE.Vector3(
                        ...definition.position
                    ),

                baseRotation:
                    new THREE.Euler(
                        ...definition.rotation
                    ),

                phase:
                    Math.random() *
                    Math.PI *
                    2
            });

        }
    );


    /* =====================================================
       ORBITING WIRES
    ===================================================== */

    const wireMaterial =
        new THREE.LineBasicMaterial({
            color: 0x70706a,
            transparent: true,
            opacity: 0.16
        });


    const wireGroup =
        new THREE.Group();


    world.add(
        wireGroup
    );


    function createWire(
        start,
        end
    ) {

        const points = [

            new THREE.Vector3(
                ...start
            ),

            new THREE.Vector3(
                ...end
            )

        ];


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);


        const line =
            new THREE.Line(
                geometry,
                wireMaterial.clone()
            );


        wireGroup.add(line);

    }


    createWire(
        [0, 0, 0],
        [-2.7, 0.8, -0.7]
    );


    createWire(
        [0, 0, 0],
        [2.6, -0.3, -2]
    );


    createWire(
        [0, 0, 0],
        [-2.2, -1.8, -3.4]
    );


    createWire(
        [0, 0, 0],
        [2.5, 1.8, -4.2]
    );


    /* =====================================================
       INTERACTION
    ===================================================== */

    let pointerX = 0;
    let pointerY = 0;

    let targetPointerX = 0;
    let targetPointerY = 0;


    function updatePointer(
        x,
        y
    ) {

        targetPointerX =
            (
                x /
                window.innerWidth -
                0.5
            );


        targetPointerY =
            (
                y /
                window.innerHeight -
                0.5
            );

    }


    window.addEventListener(
        "mousemove",
        event => {

            updatePointer(
                event.clientX,
                event.clientY
            );

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "touchmove",
        event => {

            if (
                event.touches &&
                event.touches[0]
            ) {

                updatePointer(
                    event.touches[0].clientX,
                    event.touches[0].clientY
                );

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MENU
    ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const menu =
        document.getElementById(
            "menu"
        );


    if (
        menuToggle &&
        menu
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                const open =
                    menu.classList.toggle(
                        "open"
                    );


                menuToggle.classList.toggle(
                    "active",
                    open
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    open
                        ? "true"
                        : "false"
                );


                document.body.classList.toggle(
                    "menu-open",
                    open
                );

            }
        );


        menu.querySelectorAll("a")
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        () => {

                            menu.classList.remove(
                                "open"
                            );

                            menuToggle.classList.remove(
                                "active"
                            );

                            menuToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            document.body.classList.remove(
                                "menu-open"
                            );

                        }
                    );

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    menu.classList.remove(
                        "open"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                }

            }
        );

    }


    /* =====================================================
       SCROLL STATE
    ===================================================== */

    let scrollTarget = 0;
    let scrollCurrent = 0;


    function updateScroll() {

        const maxScroll =
            Math.max(
                1,
                document.documentElement
                    .scrollHeight -
                window.innerHeight
            );


        scrollTarget =
            clamp(
                window.scrollY /
                maxScroll,
                0,
                1
            );

    }


    window.addEventListener(
        "scroll",
        updateScroll,
        {
            passive: true
        }
    );


    updateScroll();


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.fov =
            window.innerWidth < 700
                ? 54
                : 48;


        camera.updateProjectionMatrix();


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                window.innerWidth < 700
                    ? 1.35
                    : 1.8
            )
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight,
            false
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    /* =====================================================
       ANIMATION CLOCK
    ===================================================== */

    const clock =
        new THREE.Clock();


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        const elapsed =
            clock.getElapsedTime();


        /*
           Smooth input
        */

        pointerX =
            lerp(
                pointerX,
                targetPointerX,
                0.035
            );


        pointerY =
            lerp(
                pointerY,
                targetPointerY,
                0.035
            );


        /*
           Smooth scroll
        */

        scrollCurrent =
            lerp(
                scrollCurrent,
                scrollTarget,
                0.045
            );


        /* ================================================
           PARTICLES
        ================================================ */

        const positions =
            particleGeometry
                .attributes
                .position
                .array;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const i3 =
                i * 3;


            const p =
                particleData[i];


            const wave =
                Math.sin(
                    elapsed *
                    p.speed +
                    p.phase
                );


            positions[i3] =
                p.baseX +
                Math.sin(
                    elapsed * 0.15 +
                    p.phase
                ) *
                0.12;


            positions[i3 + 1] =
                p.baseY +
                wave *
                0.09;


            positions[i3 + 2] =
                p.baseZ +
                Math.cos(
                    elapsed * 0.12 +
                    p.phase
                ) *
                0.12;

        }


        particleGeometry
            .attributes
            .position
            .needsUpdate = true;


        /*
           Particle field rotates.
        */

        particleGroup.rotation.y =
            elapsed * 0.018 +
            pointerX * 0.08;


        particleGroup.rotation.x =
            pointerY * 0.04;


        /* ================================================
           CENTRAL CORE
        ================================================ */

        core.rotation.x =
            elapsed * 0.18;


        core.rotation.y =
            elapsed * 0.28;


        ringA.rotation.z =
            elapsed * 0.32;


        ringB.rotation.x =
            elapsed * 0.21;


        ringB.rotation.z =
            elapsed * -0.18;


        ringC.rotation.y =
            elapsed * -0.12;


        coreGroup.rotation.y =
            pointerX * 0.25;


        coreGroup.rotation.x =
            pointerY * 0.15;


        /*
           Core slowly moves backwards
           as the user scrolls.
        */

        coreGroup.position.z =
            scrollCurrent * 3.2;


        coreGroup.position.y =
            -scrollCurrent * 0.5;


        coreGroup.scale.setScalar(
            1 -
            scrollCurrent * 0.28
        );


        /* ================================================
           PANELS
        ================================================ */

        panelObjects.forEach(
            (object, index) => {

                const mesh =
                    object.mesh;


                const phase =
                    object.phase;


                /*
                   Floating movement
                */

                mesh.position.x =
                    object.basePosition.x +
                    Math.sin(
                        elapsed * 0.45 +
                        phase
                    ) *
                    0.06;


                mesh.position.y =
                    object.basePosition.y +
                    Math.cos(
                        elapsed * 0.35 +
                        phase
                    ) *
                    0.07;


                /*
                   Slight rotation
                */

                mesh.rotation.x =
                    object.baseRotation.x +
                    Math.sin(
                        elapsed * 0.3 +
                        phase
                    ) *
                    0.015;


                mesh.rotation.y =
                    object.baseRotation.y +
                    Math.cos(
                        elapsed * 0.25 +
                        phase
                    ) *
                    0.02;


                /*
                   Scroll-driven reveal.

                   Each panel enters at a
                   different point in the journey.
                */

                const start =
                    0.14 +
                    index * 0.12;


                const reveal =
                    clamp(
                        (
                            scrollCurrent -
                            start
                        ) / 0.18,
                        0,
                        1
                    );


                object.material.opacity =
                    reveal * 0.92;


                /*
                   Panels move toward camera
                   during their reveal.
                */

                mesh.position.z =
                    object.basePosition.z +
                    (1 - reveal) *
                    -2;


                mesh.rotation.z +=
                    pointerX *
                    0.005;

            }
        );


        /* ================================================
           WIRES
        ================================================ */

        wireGroup.rotation.y =
            elapsed * 0.025 +
            pointerX * 0.08;


        wireGroup.rotation.x =
            pointerY * 0.04;


        /*
           Fade wires as scene progresses.
        */

        wireGroup.children
            .forEach(
                line => {

                    line.material.opacity =
                        0.16 *
                        (
                            1 -
                            scrollCurrent *
                            0.5
                        );

                }
            );


        /* ================================================
           CAMERA
        ================================================ */

        /*
           The camera doesn't simply scroll
           vertically.

           It travels through the scene.
        */

        const cameraZ =
            (
                isMobile
                    ? 9
                    : 10
            ) -
            scrollCurrent * 5.8;


        camera.position.z =
            lerp(
                camera.position.z,
                cameraZ,
                0.035
            );


        camera.position.x =
            lerp(
                camera.position.x,
                pointerX * 0.7,
                0.035
            );


        camera.position.y =
            lerp(
                camera.position.y,
                -pointerY * 0.45 +
                scrollCurrent * 0.7,
                0.035
            );


        /*
           Look slightly forward through
           the environment.
        */

        const lookTarget =
            new THREE.Vector3(
                pointerX * 0.2,
                -scrollCurrent * 0.15,
                -1.5
            );


        camera.lookAt(
            lookTarget
        );


        /* ================================================
           RENDER
        ================================================ */

        renderer.render(
            scene,
            camera
        );

    }


    /* =====================================================
       START
    ===================================================== */

    animate();


})();
