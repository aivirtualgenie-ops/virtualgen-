/* =========================================================
   VIRTUAL GENIE
   NEURAL LATTICE EXPERIENCE
   MOBILE-FIRST WEBGL
========================================================= */

(() => {
    "use strict";

    const canvas = document.getElementById("experience");

    if (!canvas || typeof THREE === "undefined") {
        console.error("Virtual Genie: WebGL initialization failed.");
        return;
    }

    /* =====================================================
       DEVICE / PERFORMANCE
    ===================================================== */

    const mobile =
        window.matchMedia("(max-width: 700px)").matches;

    const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    const DPR = Math.min(
        window.devicePixelRatio || 1,
        mobile ? 1.25 : 1.7
    );

    const NODE_COUNT = mobile ? 520 : 1050;
    const CONNECTION_COUNT = mobile ? 650 : 1700;
    const SIGNAL_COUNT = mobile ? 10 : 24;

    const BG = 0x050505;
    const WHITE = 0xf1f0eb;
    const SOFT = 0x858581;
    const ACCENT = 0xd8ff5a;


    /* =====================================================
       HELPERS
    ===================================================== */

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    const lerp = (a, b, t) =>
        a + (b - a) * t;

    const smoothstep = (a, b, x) => {
        const t = clamp((x - a) / (b - a), 0, 1);
        return t * t * (3 - 2 * t);
    };


    /* =====================================================
       SCENE
    ===================================================== */

    const scene = new THREE.Scene();

    scene.background =
        new THREE.Color(BG);


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(
            mobile ? 58 : 48,
            window.innerWidth / window.innerHeight,
            0.1,
            200
        );

    camera.position.set(
        0,
        0,
        mobile ? 9.5 : 11
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: !mobile,
            alpha: false,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(DPR);

    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
        false
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /* =====================================================
       MASTER WORLD
    ===================================================== */

    const world =
        new THREE.Group();

    scene.add(world);


    /* =====================================================
       NEURAL LATTICE
    ===================================================== */

    const nodes = [];

    const nodePositions =
        new Float32Array(
            NODE_COUNT * 3
        );

    const nodeColors =
        new Float32Array(
            NODE_COUNT * 3
        );

    const nodeSizes =
        new Float32Array(
            NODE_COUNT
        );


    /*
       Instead of random stars, build a
       structured 3D intelligence field.

       Nodes are distributed around a
       distorted cylindrical / spherical
       volume.
    */

    for (let i = 0; i < NODE_COUNT; i++) {

        const i3 = i * 3;

        const depth =
            Math.random() * 2 - 1;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            1.8 +
            Math.pow(
                Math.random(),
                0.55
            ) * 5.8;

        const vertical =
            depth * 5.2;

        /*
           Organic distortion.
        */

        const wave =
            Math.sin(
                angle * 3 +
                depth * 5
            ) * 0.45;

        const x =
            Math.cos(angle) *
            radius +
            wave;

        const y =
            vertical +
            Math.sin(
                angle * 2
            ) * 0.55;

        const z =
            Math.sin(angle) *
            radius;


        nodePositions[i3] = x;
        nodePositions[i3 + 1] = y;
        nodePositions[i3 + 2] = z;


        /*
           Mostly monochrome.

           A restrained number of nodes
           use the Virtual Genie accent.
        */

        if (Math.random() > 0.93) {

            nodeColors[i3] =
                0.72;

            nodeColors[i3 + 1] =
                0.92;

            nodeColors[i3 + 2] =
                0.25;

        } else {

            const brightness =
                0.28 +
                Math.random() * 0.55;

            nodeColors[i3] =
                brightness;

            nodeColors[i3 + 1] =
                brightness;

            nodeColors[i3 + 2] =
                brightness * 0.96;
        }


        nodeSizes[i] =
            mobile
                ? 0.045 + Math.random() * 0.065
                : 0.04 + Math.random() * 0.075;


        nodes.push({
            x,
            y,
            z,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.08 +
                Math.random() *
                0.25
        });
    }


    const nodeGeometry =
        new THREE.BufferGeometry();


    nodeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            nodePositions,
            3
        )
    );


    nodeGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            nodeColors,
            3
        )
    );


    nodeGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            nodeSizes,
            1
        )
    );


    /* =====================================================
       NODE TEXTURE
    ===================================================== */

    const nodeCanvas =
        document.createElement("canvas");

    nodeCanvas.width = 32;
    nodeCanvas.height = 32;

    const nodeContext =
        nodeCanvas.getContext("2d");

    const nodeGradient =
        nodeContext.createRadialGradient(
            16,
            16,
            0,
            16,
            16,
            16
        );

    nodeGradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );

    nodeGradient.addColorStop(
        0.25,
        "rgba(255,255,255,.9)"
    );

    nodeGradient.addColorStop(
        0.55,
        "rgba(255,255,255,.25)"
    );

    nodeGradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    nodeContext.fillStyle =
        nodeGradient;

    nodeContext.fillRect(
        0,
        0,
        32,
        32
    );


    const nodeTexture =
        new THREE.CanvasTexture(
            nodeCanvas
        );


    const nodeMaterial =
        new THREE.PointsMaterial({
            size:
                mobile
                    ? 0.08
                    : 0.095,

            map: nodeTexture,

            transparent: true,

            opacity: 0.72,

            vertexColors: true,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const nodeCloud =
        new THREE.Points(
            nodeGeometry,
            nodeMaterial
        );


    world.add(nodeCloud);


    /* =====================================================
       CONNECTIONS
    ===================================================== */

    /*
       We connect nearby nodes.

       Doing this only once keeps the
       animation cheap enough for phones.
    */

    const connectionPositions =
        new Float32Array(
            CONNECTION_COUNT * 6
        );


    for (
        let i = 0;
        i < CONNECTION_COUNT;
        i++
    ) {

        /*
           Choose a source node.
        */

        const a =
            Math.floor(
                Math.random() *
                NODE_COUNT
            );


        /*
           Look for a nearby node.

           We don't perform a full
           nearest-neighbour calculation
           because that is expensive on
           mobile.
        */

        let b =
            a +
            Math.floor(
                (Math.random() * 50) -
                25
            );


        if (b < 0) {
            b += NODE_COUNT;
        }

        if (b >= NODE_COUNT) {
            b -= NODE_COUNT;
        }


        const aNode =
            nodes[a];

        const bNode =
            nodes[b];


        const i6 =
            i * 6;


        connectionPositions[i6] =
            aNode.x;

        connectionPositions[i6 + 1] =
            aNode.y;

        connectionPositions[i6 + 2] =
            aNode.z;

        connectionPositions[i6 + 3] =
            bNode.x;

        connectionPositions[i6 + 4] =
            bNode.y;

        connectionPositions[i6 + 5] =
            bNode.z;

    }


    const connectionGeometry =
        new THREE.BufferGeometry();


    connectionGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            connectionPositions,
            3
        )
    );


    const connectionMaterial =
        new THREE.LineBasicMaterial({
            color: SOFT,

            transparent: true,

            opacity:
                mobile
                    ? 0.09
                    : 0.13,

            depthWrite: false
        });


    const connections =
        new THREE.LineSegments(
            connectionGeometry,
            connectionMaterial
        );


    world.add(connections);


    /* =====================================================
       CENTRAL INTELLIGENCE CORE
    ===================================================== */

    const core =
        new THREE.Group();

    world.add(core);


    /*
       Main wireframe sphere.
    */

    const coreGeometry =
        new THREE.IcosahedronGeometry(
            mobile
                ? 0.82
                : 1.05,
            2
        );


    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: WHITE,

            wireframe: true,

            transparent: true,

            opacity: 0.42
        });


    const coreMesh =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );


    core.add(coreMesh);


    /* =====================================================
       CORE RINGS
    ===================================================== */

    function ring(
        radius,
        rotation,
        opacity
    ) {

        const geometry =
            new THREE.TorusGeometry(
                radius,
                mobile
                    ? 0.009
                    : 0.014,
                8,
                128
            );


        const material =
            new THREE.MeshBasicMaterial({
                color: WHITE,

                transparent: true,

                opacity
            });


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        mesh.rotation.set(
            ...rotation
        );


        core.add(mesh);

        return mesh;
    }


    const ring1 =
        ring(
            1.15,
            [
                Math.PI / 2,
                0,
                0
            ],
            0.42
        );


    const ring2 =
        ring(
            1.48,
            [
                0.7,
                0.3,
                0.2
            ],
            0.18
        );


    const ring3 =
        ring(
            1.85,
            [
                1.3,
                -0.5,
                0.3
            ],
            0.10
        );


    /* =====================================================
       CORE POINT
    ===================================================== */

    const pointGeometry =
        new THREE.SphereGeometry(
            0.11,
            16,
            16
        );


    const pointMaterial =
        new THREE.MeshBasicMaterial({
            color: ACCENT
        });


    const corePoint =
        new THREE.Mesh(
            pointGeometry,
            pointMaterial
        );


    core.add(
        corePoint
    );


    /* =====================================================
       SIGNAL PARTICLES
    ===================================================== */

    const signalGeometry =
        new THREE.BufferGeometry();


    const signalPositions =
        new Float32Array(
            SIGNAL_COUNT * 3
        );


    const signalColors =
        new Float32Array(
            SIGNAL_COUNT * 3
        );


    const signals = [];


    for (
        let i = 0;
        i < SIGNAL_COUNT;
        i++
    ) {

        const a =
            Math.floor(
                Math.random() *
                NODE_COUNT
            );


        const b =
            Math.floor(
                Math.random() *
                NODE_COUNT
            );


        const start =
            nodes[a];

        const end =
            nodes[b];


        signals.push({
            start,
            end,

            progress:
                Math.random(),

            speed:
                0.12 +
                Math.random() *
                0.22
        });


        const i3 =
            i * 3;


        signalPositions[i3] =
            start.x;

        signalPositions[i3 + 1] =
            start.y;

        signalPositions[i3 + 2] =
            start.z;


        signalColors[i3] =
            0.85;

        signalColors[i3 + 1] =
            1;

        signalColors[i3 + 2] =
            0.3;

    }


    signalGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            signalPositions,
            3
        )
    );


    signalGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            signalColors,
            3
        )
    );


    const signalMaterial =
        new THREE.PointsMaterial({
            size:
                mobile
                    ? 0.12
                    : 0.14,

            map: nodeTexture,

            transparent: true,

            opacity: 1,

            vertexColors: true,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const signalCloud =
        new THREE.Points(
            signalGeometry,
            signalMaterial
        );


    world.add(
        signalCloud
    );


    /* =====================================================
       POINTER / TOUCH
    ===================================================== */

    let pointerX = 0;
    let pointerY = 0;

    let targetX = 0;
    let targetY = 0;


    function setPointer(
        x,
        y
    ) {

        targetX =
            (
                x /
                window.innerWidth -
                0.5
            );


        targetY =
            (
                y /
                window.innerHeight -
                0.5
            );
    }


    window.addEventListener(
        "mousemove",
        event => {

            setPointer(
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

                setPointer(
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
       SCROLL
    ===================================================== */

    let scrollTarget = 0;
    let scrollCurrent = 0;


    function readScroll() {

        const max =
            Math.max(
                1,
                document.documentElement.scrollHeight -
                window.innerHeight
            );


        scrollTarget =
            clamp(
                window.scrollY / max,
                0,
                1
            );
    }


    window.addEventListener(
        "scroll",
        readScroll,
        {
            passive: true
        }
    );


    readScroll();


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
       HERO HTML MOTION
    ===================================================== */

    const heroContent =
        document.querySelector(
            ".hero-content"
        );

    const heroIndex =
        document.querySelector(
            ".hero-index"
        );

    const heroStatus =
        document.querySelector(
            ".hero-status"
        );


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.fov =
            window.innerWidth < 700
                ? 58
                : 48;


        camera.updateProjectionMatrix();


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                window.innerWidth < 700
                    ? 1.25
                    : 1.7
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
       ANIMATION
    ===================================================== */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const time =
            clock.getElapsedTime();


        /* ================================================
           INPUT
        ================================================ */

        pointerX =
            lerp(
                pointerX,
                targetX,
                0.035
            );


        pointerY =
            lerp(
                pointerY,
                targetY,
                0.035
            );


        scrollCurrent =
            lerp(
                scrollCurrent,
                scrollTarget,
                0.035
            );


        /* ================================================
           WORLD MOVEMENT
        ================================================ */

        const movement =
            reducedMotion
                ? 0
                : 1;


        world.rotation.y =
            pointerX *
            0.10 +
            time *
            0.012 *
            movement;


        world.rotation.x =
            pointerY *
            0.045;


        /*
           Slowly push the entire field
           through the camera as the page
           progresses.
        */

        world.position.z =
            scrollCurrent *
            3.2;


        world.position.y =
            -scrollCurrent *
            1.3;


        /* ================================================
           NODE BREATHING
        ================================================ */

        const positions =
            nodeGeometry
                .attributes
                .position
                .array;


        for (
            let i = 0;
            i < NODE_COUNT;
            i++
        ) {

            const node =
                nodes[i];

            const i3 =
                i * 3;


            const wave =
                Math.sin(
                    time *
                    node.speed +
                    node.phase
                );


            positions[i3] =
                node.x +
                Math.sin(
                    time * 0.10 +
                    node.phase
                ) *
                0.10;


            positions[i3 + 1] =
                node.y +
                wave *
                0.08;


            positions[i3 + 2] =
                node.z +
                Math.cos(
                    time * 0.08 +
                    node.phase
                ) *
                0.10;
        }


        nodeGeometry
            .attributes
            .position
            .needsUpdate = true;


        /* ================================================
           CONNECTION MOVEMENT
        ================================================ */

        connections.rotation.y =
            Math.sin(
                time * 0.08
            ) *
            0.05;


        connections.rotation.x =
            Math.cos(
                time * 0.06
            ) *
            0.025;


        /* ================================================
           CORE
        ================================================ */

        core.rotation.x =
            time *
            0.16 *
            movement;


        core.rotation.y =
            time *
            0.25 *
            movement;


        core.position.x =
            pointerX *
            0.25;


        core.position.y =
            pointerY *
            0.16;


        /*
           The core becomes smaller as
           the camera travels deeper.
        */

        const coreScale =
            1 -
            scrollCurrent *
            0.32;


        core.scale.setScalar(
            coreScale
        );


        ring1.rotation.z =
            time *
            0.35 *
            movement;


        ring2.rotation.x =
            time *
            -0.22 *
            movement;


        ring2.rotation.z =
            time *
            0.17 *
            movement;


        ring3.rotation.y =
            time *
            -0.11 *
            movement;


        /*
           Core pulse.
        */

        const pulse =
            1 +
            Math.sin(
                time * 1.7
            ) *
            0.035;


        corePoint.scale.setScalar(
            pulse
        );


        /* ================================================
           SIGNALS
        ================================================ */

        const signalPositions =
            signalGeometry
                .attributes
                .position
                .array;


        signals.forEach(
            (signal, index) => {

                signal.progress +=
                    signal.speed *
                    0.01 *
                    movement;


                if (
                    signal.progress >= 1
                ) {

                    signal.progress = 0;


                    const randomNode =
                        nodes[
                            Math.floor(
                                Math.random() *
                                NODE_COUNT
                            )
                        ];


                    signal.start =
                        randomNode;


                    signal.end =
                        nodes[
                            Math.floor(
                                Math.random() *
                                NODE_COUNT
                            )
                        ];

                }


                const p =
                    signal.progress;


                /*
                   Smooth movement rather
                   than linear movement.
                */

                const eased =
                    p * p *
                    (3 - 2 * p);


                const x =
                    lerp(
                        signal.start.x,
                        signal.end.x,
                        eased
                    );


                const y =
                    lerp(
                        signal.start.y,
                        signal.end.y,
                        eased
                    );


                const z =
                    lerp(
                        signal.start.z,
                        signal.end.z,
                        eased
                    );


                const i3 =
                    index * 3;


                signalPositions[i3] =
                    x;

                signalPositions[i3 + 1] =
                    y;

                signalPositions[i3 + 2] =
                    z;

            }
        );


        signalGeometry
            .attributes
            .position
            .needsUpdate = true;


        /* ================================================
           CAMERA JOURNEY
        ================================================ */

        /*
           This is important.

           The animation isn't simply
           "scrolling a background."

           The camera actually travels
           into the system.
        */

        const baseZ =
            mobile
                ? 9.5
                : 11;


        const targetCameraZ =
            baseZ -
            scrollCurrent *
            7.0;


        camera.position.z =
            lerp(
                camera.position.z,
                targetCameraZ,
                0.035
            );


        camera.position.x =
            lerp(
                camera.position.x,
                pointerX *
                0.75,
                0.035
            );


        camera.position.y =
            lerp(
                camera.position.y,
                -pointerY *
                0.45 +
                scrollCurrent *
                0.8,
                0.035
            );


        /*
           Camera looks deeper into the
           lattice as the user scrolls.
        */

        const target =
            new THREE.Vector3(
                pointerX *
                0.15,

                scrollCurrent *
                -0.4,

                -2.0
            );


        camera.lookAt(
            target
        );


        /* ================================================
           HERO TEXT FADES INTO THE SYSTEM
        ================================================ */

        if (heroContent) {

            const opacity =
                1 -
                smoothstep(
                    0.02,
                    0.20,
                    scrollCurrent
                );


            heroContent.style.opacity =
                opacity;


            heroContent.style.transform =
                `translate3d(
                    0,
                    ${scrollCurrent * -45}px,
                    0
                )`;

        }


        if (heroIndex) {

            heroIndex.style.opacity =
                1 -
                smoothstep(
                    0.01,
                    0.16,
                    scrollCurrent
                );

        }


        if (heroStatus) {

            heroStatus.style.opacity =
                1 -
                smoothstep(
                    0.01,
                    0.16,
                    scrollCurrent
                );

        }


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

    resize();

    animate();

})();
