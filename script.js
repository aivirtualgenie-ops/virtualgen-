/* =========================================================
   VIRTUAL GENIE — AI SYSTEM ENGINE
   Dynamic AI workforce / neural operating layer
   Mobile-first • GitHub Pages compatible
   ========================================================= */

(() => {
    "use strict";

    /* ---------------------------------------------------------
       CONFIG
    --------------------------------------------------------- */

    const CONFIG = {
        nodeCount: 58,
        connectionDistance: 2.25,
        particleCount: 85,

        // Camera depth controlled by scrolling
        cameraStartZ: 8,
        cameraDepth: 3.2,

        // Animation speed
        rotationSpeed: 0.00018,
        particleSpeed: 0.0007,

        // Colours
        background: 0x050505,
        white: 0xf4f2ec,
        muted: 0x777777,

        // System colours
        ai: 0xb9ff3d,
        data: 0x58b7ff,
        human: 0xffb84d,
        automation: 0xa889ff
    };

    /* ---------------------------------------------------------
       REDUCED MOTION
    --------------------------------------------------------- */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ---------------------------------------------------------
       PAGE STATE
    --------------------------------------------------------- */

    let currentSection = 0;
    let targetScroll = window.scrollY;
    let smoothScroll = window.scrollY;

    const sections = Array.from(
        document.querySelectorAll("section")
    );


    /* ---------------------------------------------------------
       CREATE CANVAS
    --------------------------------------------------------- */

    let canvas = document.getElementById("vg-ai-system");

    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "vg-ai-system";

        canvas.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.prepend(canvas);
    }


    /* ---------------------------------------------------------
       CANVAS CSS
    --------------------------------------------------------- */

    const canvasStyle = document.createElement("style");

    canvasStyle.textContent = `
        #vg-ai-system {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.92;
            display: block;
        }

        body > *:not(#vg-ai-system) {
            position: relative;
            z-index: 1;
        }

        section,
        header,
        footer,
        nav {
            position: relative;
            z-index: 2;
        }

        .vg-system-status {
            position: fixed;
            left: 32px;
            bottom: 28px;
            z-index: 20;

            display: flex;
            align-items: center;
            gap: 9px;

            color: rgba(244,242,236,.55);
            font-family: Arial, sans-serif;
            font-size: 10px;
            letter-spacing: .28em;
            text-transform: uppercase;

            pointer-events: none;
            transition: opacity .4s ease;
        }

        .vg-system-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #b9ff3d;
            box-shadow: 0 0 14px rgba(185,255,61,.45);
        }

        .vg-task-label {
            position: fixed;
            right: 32px;
            bottom: 28px;
            z-index: 20;

            color: rgba(244,242,236,.38);
            font-family: Arial, sans-serif;
            font-size: 9px;
            letter-spacing: .22em;
            text-transform: uppercase;

            pointer-events: none;
            transition: opacity .35s ease;
        }

        @media(max-width:700px) {
            .vg-system-status {
                left: 22px;
                bottom: 20px;
                font-size: 8px;
            }

            .vg-task-label {
                right: 22px;
                bottom: 20px;
                font-size: 8px;
            }

            #vg-ai-system {
                opacity: .75;
            }
        }
    `;

    document.head.appendChild(canvasStyle);


    /* ---------------------------------------------------------
       THREE.JS
    --------------------------------------------------------- */

    const THREE_URL =
        "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";


    async function startSystem() {

        let THREE;

        try {
            THREE = await import(THREE_URL);
        } catch (error) {
            console.warn(
                "Virtual Genie: Three.js could not load.",
                error
            );

            canvas.style.display = "none";
            return;
        }


        /* -----------------------------------------------------
           RENDERER
        ----------------------------------------------------- */

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 1.7)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setClearColor(
            CONFIG.background,
            1
        );


        /* -----------------------------------------------------
           SCENE
        ----------------------------------------------------- */

        const scene = new THREE.Scene();

        scene.fog = new THREE.FogExp2(
            CONFIG.background,
            0.055
        );


        /* -----------------------------------------------------
           CAMERA
        ----------------------------------------------------- */

        const camera = new THREE.PerspectiveCamera(
            52,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.set(
            0,
            0,
            CONFIG.cameraStartZ
        );


        /* -----------------------------------------------------
           MAIN SYSTEM GROUP
        ----------------------------------------------------- */

        const system = new THREE.Group();

        scene.add(system);


        /* -----------------------------------------------------
           NODE DATA
        ----------------------------------------------------- */

        const nodes = [];

        const nodeColours = [
            CONFIG.ai,
            CONFIG.data,
            CONFIG.human,
            CONFIG.automation
        ];


        /* -----------------------------------------------------
           NODE MATERIALS
        ----------------------------------------------------- */

        const nodeGeometry =
            new THREE.SphereGeometry(
                0.035,
                8,
                8
            );


        /* -----------------------------------------------------
           CREATE NODES
        ----------------------------------------------------- */

        for (
            let i = 0;
            i < CONFIG.nodeCount;
            i++
        ) {

            // Elliptical / organic system distribution
            const angle =
                Math.random() * Math.PI * 2;

            const radius =
                Math.pow(Math.random(), 0.55) * 4.5;

            const x =
                Math.cos(angle) *
                radius *
                (0.65 + Math.random() * 0.45);

            const y =
                Math.sin(angle) *
                radius *
                0.55;

            const z =
                (Math.random() - 0.5) * 4.8;

            const colour =
                nodeColours[
                    Math.floor(
                        Math.random() *
                        nodeColours.length
                    )
                ];

            const material =
                new THREE.MeshBasicMaterial({
                    color: colour,
                    transparent: true,
                    opacity: 0.7
                });

            const mesh =
                new THREE.Mesh(
                    nodeGeometry,
                    material
                );

            mesh.position.set(
                x,
                y,
                z
            );

            mesh.userData = {
                baseX: x,
                baseY: y,
                baseZ: z,
                phase: Math.random() * Math.PI * 2,
                speed:
                    0.0004 +
                    Math.random() * 0.0008,
                colour
            };

            system.add(mesh);
            nodes.push(mesh);
        }


        /* -----------------------------------------------------
           CONNECTIONS
        ----------------------------------------------------- */

        const connectionGeometry =
            new THREE.BufferGeometry();

        const connectionPositions = [];

        const connectionColours = [];

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < nodes.length;
                j++
            ) {

                const a = nodes[i];
                const b = nodes[j];

                const distance =
                    a.position.distanceTo(
                        b.position
                    );

                if (
                    distance <
                    CONFIG.connectionDistance
                ) {

                    connectionPositions.push(
                        a.position.x,
                        a.position.y,
                        a.position.z,

                        b.position.x,
                        b.position.y,
                        b.position.z
                    );

                    connectionColours.push(
                        0.18,
                        0.22,
                        0.2,

                        0.18,
                        0.22,
                        0.2
                    );
                }
            }
        }

        connectionGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                connectionPositions,
                3
            )
        );

        connectionGeometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(
                connectionColours,
                3
            )
        );

        const connectionMaterial =
            new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.28
            });

        const connections =
            new THREE.LineSegments(
                connectionGeometry,
                connectionMaterial
            );

        system.add(connections);


        /* -----------------------------------------------------
           DATA PARTICLES
        ----------------------------------------------------- */

        const particleGeometry =
            new THREE.BufferGeometry();

        const particlePositions = [];

        const particleVelocities = [];

        for (
            let i = 0;
            i < CONFIG.particleCount;
            i++
        ) {

            const node =
                nodes[
                    Math.floor(
                        Math.random() *
                        nodes.length
                    )
                ];

            particlePositions.push(
                node.position.x,
                node.position.y,
                node.position.z
            );

            particleVelocities.push(
                (Math.random() - 0.5) * 0.001,
                (Math.random() - 0.5) * 0.001,
                (Math.random() - 0.5) * 0.001
            );
        }

        particleGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                particlePositions,
                3
            )
        );

        const particleMaterial =
            new THREE.PointsMaterial({
                color: CONFIG.data,
                size: 0.035,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });

        const particles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            );

        system.add(particles);


        /* -----------------------------------------------------
           CENTRAL INTELLIGENCE NODE
        ----------------------------------------------------- */

        const coreGeometry =
            new THREE.IcosahedronGeometry(
                0.23,
                1
            );

        const coreMaterial =
            new THREE.MeshBasicMaterial({
                color: CONFIG.ai,
                wireframe: true,
                transparent: true,
                opacity: 0.82
            });

        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );

        system.add(core);


        /* -----------------------------------------------------
           INNER CORE
        ----------------------------------------------------- */

        const innerGeometry =
            new THREE.SphereGeometry(
                0.075,
                12,
                12
            );

        const innerMaterial =
            new THREE.MeshBasicMaterial({
                color: CONFIG.white
            });

        const innerCore =
            new THREE.Mesh(
                innerGeometry,
                innerMaterial
            );

        system.add(innerCore);


        /* -----------------------------------------------------
           ORBITAL DATA PATHS
           Not a solar-system look — subtle system geometry.
        ----------------------------------------------------- */

        const orbitGroup =
            new THREE.Group();

        system.add(orbitGroup);

        const orbitColours = [
            CONFIG.ai,
            CONFIG.data,
            CONFIG.automation
        ];

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const curve =
                new THREE.EllipseCurve(
                    0,
                    0,
                    1.4 + i * 0.75,
                    0.65 + i * 0.4,
                    0,
                    Math.PI * 2,
                    false,
                    0
                );

            const points =
                curve.getPoints(100);

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);

            const material =
                new THREE.LineBasicMaterial({
                    color:
                        orbitColours[i],
                    transparent: true,
                    opacity: 0.12
                });

            const line =
                new THREE.Line(
                    geometry,
                    material
                );

            line.rotation.x =
                Math.PI * (
                    0.25 + i * 0.16
                );

            line.rotation.z =
                i * 0.6;

            orbitGroup.add(line);
        }


        /* -----------------------------------------------------
           TASK LABELS
        ----------------------------------------------------- */

        const status =
            document.createElement("div");

        status.className =
            "vg-system-status";

        status.innerHTML = `
            <span class="vg-system-status-dot"></span>
            <span>AI SYSTEM ONLINE</span>
        `;

        document.body.appendChild(status);


        const taskLabel =
            document.createElement("div");

        taskLabel.className =
            "vg-task-label";

        document.body.appendChild(
            taskLabel
        );


        const tasks = [
            "LEAD RECEIVED",
            "AI QUALIFYING",
            "CRM UPDATED",
            "FOLLOW-UP SENT",
            "APPOINTMENT BOOKED",
            "CALL ANSWERED",
            "DATA ENRICHED",
            "WORKFLOW EXECUTED",
            "REPORT GENERATED",
            "DEAL CREATED"
        ];


        /* -----------------------------------------------------
           TASK ANIMATION
        ----------------------------------------------------- */

        let taskIndex = 0;

        function updateTask() {

            taskLabel.textContent =
                tasks[taskIndex];

            taskIndex =
                (taskIndex + 1) %
                tasks.length;
        }

        updateTask();

        setInterval(
            updateTask,
            reducedMotion ? 6000 : 2600
        );


        /* -----------------------------------------------------
           SECTION DETECTION
        ----------------------------------------------------- */

        function detectSection() {

            if (!sections.length) {
                currentSection = 0;
                return;
            }

            const middle =
                window.scrollY +
                window.innerHeight * 0.45;

            let closest = 0;
            let closestDistance = Infinity;

            sections.forEach(
                (section, index) => {

                    const rect =
                        section.getBoundingClientRect();

                    const position =
                        rect.top +
                        window.scrollY;

                    const distance =
                        Math.abs(
                            position - middle
                        );

                    if (
                        distance <
                        closestDistance
                    ) {
                        closestDistance =
                            distance;

                        closest = index;
                    }
                }
            );

            currentSection = closest;
        }


        window.addEventListener(
            "scroll",
            () => {
                targetScroll =
                    window.scrollY;

                detectSection();
            },
            {
                passive: true
            }
        );


        /* -----------------------------------------------------
           RESIZE
        ----------------------------------------------------- */

        function resize() {

            const width =
                window.innerWidth;

            const height =
                window.innerHeight;

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height
            );

            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio || 1,
                    width < 700 ? 1.25 : 1.7
                )
            );
        }

        window.addEventListener(
            "resize",
            resize
        );


        /* -----------------------------------------------------
           ANIMATION
        ----------------------------------------------------- */

        const clock =
            new THREE.Clock();

        let animationFrame;

        function animate() {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

            const elapsed =
                clock.getElapsedTime();


            /* ---------------------------------------------
               SMOOTH SCROLL
            --------------------------------------------- */

            if (!reducedMotion) {

                smoothScroll +=
                    (
                        targetScroll -
                        smoothScroll
                    ) * 0.075;

            } else {

                smoothScroll =
                    targetScroll;
            }


            /* ---------------------------------------------
               NORMALIZED SCROLL
            --------------------------------------------- */

            const pageHeight =
                Math.max(
                    1,
                    document.documentElement
                        .scrollHeight -
                    window.innerHeight
                );

            const scrollProgress =
                Math.min(
                    1,
                    Math.max(
                        0,
                        smoothScroll /
                        pageHeight
                    )
                );


            /* ---------------------------------------------
               CAMERA DIVE
            --------------------------------------------- */

            const sectionProgress =
                Math.min(
                    1,
                    currentSection /
                    Math.max(
                        sections.length - 1,
                        1
                    )
                );

            const targetCameraZ =
                CONFIG.cameraStartZ -
                (
                    scrollProgress *
                    CONFIG.cameraDepth
                );

            camera.position.z +=
                (
                    targetCameraZ -
                    camera.position.z
                ) * 0.045;


            /* ---------------------------------------------
               CAMERA X / Y
               Gives the background a subtle living motion.
            --------------------------------------------- */

            const targetCameraX =
                Math.sin(
                    scrollProgress *
                    Math.PI * 2
                ) * 0.35;

            const targetCameraY =
                Math.cos(
                    scrollProgress *
                    Math.PI * 1.5
                ) * 0.18;

            camera.position.x +=
                (
                    targetCameraX -
                    camera.position.x
                ) * 0.025;

            camera.position.y +=
                (
                    targetCameraY -
                    camera.position.y
                ) * 0.025;


            /* ---------------------------------------------
               SYSTEM ROTATION
            --------------------------------------------- */

            if (!reducedMotion) {

                system.rotation.y =
                    elapsed *
                    CONFIG.rotationSpeed *
                    1000;

                system.rotation.x =
                    Math.sin(
                        elapsed * 0.08
                    ) * 0.06;

                system.rotation.z =
                    Math.sin(
                        elapsed * 0.045
                    ) * 0.025;
            }


            /* ---------------------------------------------
               NODES FLOAT
            --------------------------------------------- */

            nodes.forEach(
                (node) => {

                    if (reducedMotion)
                        return;

                    const data =
                        node.userData;

                    node.position.x =
                        data.baseX +
                        Math.sin(
                            elapsed *
                            data.speed *
                            1000 +
                            data.phase
                        ) * 0.035;

                    node.position.y =
                        data.baseY +
                        Math.cos(
                            elapsed *
                            data.speed *
                            900 +
                            data.phase
                        ) * 0.035;

                    node.position.z =
                        data.baseZ +
                        Math.sin(
                            elapsed *
                            data.speed *
                            700 +
                            data.phase
                        ) * 0.045;
                }
            );


            /* ---------------------------------------------
               CORE PULSE
            --------------------------------------------- */

            if (!reducedMotion) {

                const pulse =
                    1 +
                    Math.sin(
                        elapsed * 2.2
                    ) * 0.12;

                core.scale.setScalar(
                    pulse
                );

                innerCore.scale.setScalar(
                    1 +
                    Math.sin(
                        elapsed * 3
                    ) * 0.18
                );
            }


            /* ---------------------------------------------
               DATA PARTICLES
            --------------------------------------------- */

            const particleArray =
                particleGeometry
                    .attributes
                    .position
                    .array;

            if (!reducedMotion) {

                for (
                    let i = 0;
                    i < particleArray.length;
                    i += 3
                ) {

                    particleArray[i] +=
                        particleVelocities[i];

                    particleArray[i + 1] +=
                        particleVelocities[i + 1];

                    particleArray[i + 2] +=
                        particleVelocities[i + 2];

                    // recycle particles
                    if (
                        Math.abs(
                            particleArray[i]
                        ) > 5
                    ) {
                        particleArray[i] *= -0.9;
                    }

                    if (
                        Math.abs(
                            particleArray[i + 1]
                        ) > 3
                    ) {
                        particleArray[i + 1] *= -0.9;
                    }

                    if (
                        Math.abs(
                            particleArray[i + 2]
                        ) > 3
                    ) {
                        particleArray[i + 2] *= -0.9;
                    }
                }

                particleGeometry
                    .attributes
                    .position
                    .needsUpdate = true;
            }


            /* ---------------------------------------------
               ORBIT MOVEMENT
            --------------------------------------------- */

            if (!reducedMotion) {

                orbitGroup.rotation.y =
                    elapsed * 0.035;

                orbitGroup.rotation.z =
                    elapsed * 0.018;
            }


            /* ---------------------------------------------
               SECTION-BASED COLOUR EMPHASIS
            --------------------------------------------- */

            const activeColour =
                currentSection % 4;

            nodes.forEach(
                (node, index) => {

                    const active =
                        index % 4 ===
                        activeColour;

                    node.material.opacity =
                        active
                            ? 0.95
                            : 0.42;
                }
            );


            /* ---------------------------------------------
               RENDER
            --------------------------------------------- */

            renderer.render(
                scene,
                camera
            );
        }


        /* -----------------------------------------------------
           START
        ----------------------------------------------------- */

        resize();
        detectSection();
        animate();


        /* -----------------------------------------------------
           PAGE LOAD FADE
        ----------------------------------------------------- */

        canvas.style.opacity = "0";

        requestAnimationFrame(
            () => {

                canvas.style.transition =
                    "opacity 1.2s ease";

                canvas.style.opacity =
                    window.innerWidth < 700
                        ? "0.72"
                        : "0.9";
            }
        );


        /* -----------------------------------------------------
           CLEANUP
        ----------------------------------------------------- */

        window.addEventListener(
            "pagehide",
            () => {

                cancelAnimationFrame(
                    animationFrame
                );

                renderer.dispose();

                nodeGeometry.dispose();
                connectionGeometry.dispose();
                particleGeometry.dispose();

                coreGeometry.dispose();
                innerGeometry.dispose();
            }
        );

    }


    /* ---------------------------------------------------------
       INITIALIZE
    --------------------------------------------------------- */

    startSystem();


    /* =========================================================
       MOBILE NAVIGATION
       ========================================================= */

    const menuButton =
        document.querySelector(
            "[data-menu], .menu-toggle, .hamburger"
        );

    const navigation =
        document.querySelector(
            "nav, .mobile-menu, .menu"
        );

    if (
        menuButton &&
        navigation
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                const open =
                    navigation.classList.toggle(
                        "is-open"
                    );

                menuButton.setAttribute(
                    "aria-expanded",
                    String(open)
                );
            }
        );
    }


    /* =========================================================
       SMOOTH INTERNAL LINKS
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link)
                return;

            const id =
                link.getAttribute("href");

            if (
                !id ||
                id === "#"
            )
                return;

            const target =
                document.querySelector(id);

            if (!target)
                return;

            event.preventDefault();

            target.scrollIntoView({
                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth",
                block: "start"
            });
        }
    );

})();
/* =========================================================
   SCROLL REVEALS
   ========================================================= */

(() => {

    const revealElements =
        document.querySelectorAll(
            ".eyebrow, .section-label, .kicker, " +
            ".hero-title, .hero-description, " +
            ".system-title, .system-copy, " +
            ".product-title, .product-description, " +
            ".build-item, .flow-step, " +
            ".bos-row, .final-cta h2"
        );

    revealElements.forEach(
        element => {
            element.classList.add("reveal");
        }
    );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -8% 0px"
            }
        );

    revealElements.forEach(
        element => {
            observer.observe(element);
        }
    );

})();
