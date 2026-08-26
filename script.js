/* =========================================================
   VIRTUAL GENIE AI
   3D INTELLIGENCE SYSTEM
   Three.js / GitHub Pages
========================================================= */

(() => {
    "use strict";

    /* -----------------------------------------------------
       ELEMENTS
    ----------------------------------------------------- */

    const canvas = document.getElementById("scene");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (!canvas) {
        console.warn("Virtual Genie: #scene not found.");
        return;
    }


    /* -----------------------------------------------------
       LOAD THREE.JS
    ----------------------------------------------------- */

    function loadThree() {

        return new Promise((resolve, reject) => {

            if (window.THREE) {
                resolve(window.THREE);
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";

            script.onload = () => {

                if (window.THREE) {
                    resolve(window.THREE);
                } else {
                    reject(
                        new Error(
                            "Three.js failed to initialize."
                        )
                    );
                }

            };

            script.onerror = () => {

                reject(
                    new Error(
                        "Unable to load Three.js."
                    )
                );

            };

            document.head.appendChild(script);

        });
    }


    /* -----------------------------------------------------
       START
    ----------------------------------------------------- */

    loadThree()
        .then(init3D)
        .catch(error => {

            console.warn(
                "Virtual Genie 3D unavailable:",
                error
            );

        });


    /* =====================================================
       3D ENGINE
    ===================================================== */

    function init3D(THREE) {

        const mobile =
            window.innerWidth <= 700;

        const lowPower =
            mobile ||
            navigator.hardwareConcurrency <= 4;


        /* -------------------------------------------------
           RENDERER
        ------------------------------------------------- */

        const renderer =
            new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: !lowPower,
                alpha: true,
                powerPreference:
                    "high-performance"
            });


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                mobile ? 1.5 : 2
            )
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight,
            false
        );


        renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        /* -------------------------------------------------
           SCENE
        ------------------------------------------------- */

        const scene =
            new THREE.Scene();


        /* -------------------------------------------------
           CAMERA
        ------------------------------------------------- */

        const camera =
            new THREE.PerspectiveCamera(
                34,
                window.innerWidth /
                    window.innerHeight,
                0.1,
                100
            );


        camera.position.set(
            0,
            0,
            mobile ? 8.8 : 7.5
        );


        /* -------------------------------------------------
           MAIN SYSTEM
        ------------------------------------------------- */

        const system =
            new THREE.Group();


        scene.add(system);


        /*
            The entire system sits slightly to the
            right on desktop.

            On mobile it moves closer to centre.
        */

        system.position.x =
            mobile ? 0 : 1.45;

        system.position.y =
            mobile ? -0.15 : 0.05;


        /* =================================================
           MATERIALS
        ================================================= */

        const whiteMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xf3f2ed,
                transparent: true,
                opacity: 0.75
            });


        const dimMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xf3f2ed,
                transparent: true,
                opacity: 0.18,
                wireframe: true
            });


        const faintMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xf3f2ed,
                transparent: true,
                opacity: 0.08,
                wireframe: true
            });


        const greenMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xb9ff35
            });


        /* =================================================
           CENTRAL CORE
        ================================================= */

        const coreGeometry =
            new THREE.IcosahedronGeometry(
                mobile ? 0.62 : 0.78,
                mobile ? 1 : 2
            );


        const core =
            new THREE.Mesh(
                coreGeometry,
                dimMaterial
            );


        system.add(core);


        /* -------------------------------------------------
           INNER CORE
        ------------------------------------------------- */

        const innerGeometry =
            new THREE.IcosahedronGeometry(
                mobile ? 0.35 : 0.42,
                1
            );


        const inner =
            new THREE.Mesh(
                innerGeometry,
                faintMaterial
            );


        system.add(inner);


        /* =================================================
           WIREFRAME SHELL
        ================================================= */

        const shellGeometry =
            new THREE.IcosahedronGeometry(
                mobile ? 1.0 : 1.25,
                mobile ? 1 : 2
            );


        const shell =
            new THREE.Mesh(
                shellGeometry,
                faintMaterial
            );


        system.add(shell);


        /* =================================================
           ORBIT RINGS
        ================================================= */

        function createRing(
            radius,
            opacity,
            rotationX,
            rotationY,
            rotationZ
        ) {

            const geometry =
                new THREE.TorusGeometry(
                    radius,
                    0.006,
                    8,
                    mobile ? 64 : 128
                );


            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xf3f2ed,
                    transparent: true,
                    opacity: opacity
                });


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );


            ring.rotation.x =
                rotationX;

            ring.rotation.y =
                rotationY;

            ring.rotation.z =
                rotationZ;


            system.add(ring);

            return ring;
        }


        const ring1 =
            createRing(
                1.45,
                0.24,
                Math.PI / 2,
                0.25,
                0
            );


        const ring2 =
            createRing(
                1.72,
                0.12,
                1.05,
                -0.4,
                0.3
            );


        const ring3 =
            createRing(
                2.05,
                0.07,
                0.35,
                0.8,
                0.9
            );


        /* =================================================
           ORBITAL NODES
        ================================================= */

        const nodeGeometry =
            new THREE.SphereGeometry(
                mobile ? 0.035 : 0.045,
                8,
                8
            );


        const nodes = [];


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const node =
                new THREE.Mesh(
                    nodeGeometry,
                    whiteMaterial
                );


            const angle =
                (
                    i / 6
                ) *
                Math.PI *
                2;


            node.userData.angle =
                angle;


            node.userData.radius =
                1.55 +
                (i % 2) *
                0.35;


            node.userData.speed =
                0.00035 +
                i * 0.00004;


            system.add(node);

            nodes.push(node);
        }


        /* =================================================
           PARTICLE FIELD
        ================================================= */

        const particleCount =
            mobile
                ? 180
                : lowPower
                    ? 280
                    : 520;


        const particlePositions =
            new Float32Array(
                particleCount * 3
            );


        const particleSizes =
            new Float32Array(
                particleCount
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                2.1 +
                Math.random() *
                3.5;


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


            particlePositions[
                i * 3
            ] = x;


            particlePositions[
                i * 3 + 1
            ] = y;


            particlePositions[
                i * 3 + 2
            ] = z;


            particleSizes[i] =
                0.5 +
                Math.random() * 1.5;
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


        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0xf3f2ed,
                size:
                    mobile
                        ? 0.018
                        : 0.022,
                transparent: true,
                opacity: 0.32,
                depthWrite: false
            });


        const particles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            );


        scene.add(particles);


        /* =================================================
           CENTRAL SIGNAL
        ================================================= */

        const signalGeometry =
            new THREE.SphereGeometry(
                0.065,
                12,
                12
            );


        const signal =
            new THREE.Mesh(
                signalGeometry,
                greenMaterial
            );


        system.add(signal);


        /* =================================================
           SIGNAL RINGS
        ================================================= */

        const signalRings = [];


        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const geometry =
                new THREE.RingGeometry(
                    0.14 + i * 0.09,
                    0.145 + i * 0.09,
                    48
                );


            const material =
                new THREE.MeshBasicMaterial({
                    color: 0xb9ff35,
                    transparent: true,
                    opacity: 0.18,
                    side:
                        THREE.DoubleSide
                });


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );


            ring.rotation.x =
                Math.PI / 2;


            system.add(ring);

            signalRings.push(
                ring
            );
        }


        /* =================================================
           CONNECTION LINES
        ================================================= */

        const lineMaterial =
            new THREE.LineBasicMaterial({
                color: 0xf3f2ed,
                transparent: true,
                opacity: 0.08
            });


        const connectionGroup =
            new THREE.Group();


        system.add(
            connectionGroup
        );


        function createConnection(
            a,
            b
        ) {

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints([
                        a,
                        b
                    ]);


            const line =
                new THREE.Line(
                    geometry,
                    lineMaterial
                );


            connectionGroup.add(
                line
            );

        }


        createConnection(
            new THREE.Vector3(
                -1.9,
                0.7,
                0
            ),
            new THREE.Vector3(
                -0.6,
                0.2,
                0
            )
        );


        createConnection(
            new THREE.Vector3(
                1.9,
                -0.7,
                0
            ),
            new THREE.Vector3(
                0.6,
                -0.2,
                0
            )
        );


        createConnection(
            new THREE.Vector3(
                0,
                1.9,
                0
            ),
            new THREE.Vector3(
                0,
                0.6,
                0
            )
        );


        createConnection(
            new THREE.Vector3(
                0,
                -1.9,
                0
            ),
            new THREE.Vector3(
                0,
                -0.6,
                0
            )
        );


        /* =================================================
           MOUSE / TOUCH
        ================================================= */

        let pointerX = 0;
        let pointerY = 0;

        let targetPointerX = 0;
        let targetPointerY = 0;


        function updatePointer(
            clientX,
            clientY
        ) {

            targetPointerX =
                (
                    clientX /
                    window.innerWidth
                ) *
                2 -
                1;


            targetPointerY =
                (
                    clientY /
                    window.innerHeight
                ) *
                2 -
                1;
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
                    event.touches.length
                ) {

                    const touch =
                        event.touches[0];

                    updatePointer(
                        touch.clientX,
                        touch.clientY
                    );
                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           SCROLL
        ================================================= */

        let scrollTarget =
            window.scrollY || 0;

        let scroll =
            scrollTarget;


        window.addEventListener(
            "scroll",
            () => {

                scrollTarget =
                    window.scrollY || 0;

            },
            {
                passive: true
            }
        );


        /* =================================================
           RESIZE
        ================================================= */

        function resize() {

            const w =
                window.innerWidth;

            const h =
                window.innerHeight;


            camera.aspect =
                w / h;


            camera.updateProjectionMatrix();


            renderer.setSize(
                w,
                h,
                false
            );


            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio || 1,
                    w <= 700 ? 1.5 : 2
                )
            );


            /*
                Keep the system appropriately
                positioned on mobile.
            */

            system.position.x =
                w <= 700
                    ? 0
                    : 1.45;


            system.position.y =
                w <= 700
                    ? -0.15
                    : 0.05;
        }


        window.addEventListener(
            "resize",
            resize,
            {
                passive: true
            }
        );


        /* =================================================
           ANIMATION
        ================================================= */

        const clock =
            new THREE.Clock();


        let lastTime = 0;


        function animate() {

            requestAnimationFrame(
                animate
            );


            const elapsed =
                clock.getElapsedTime();


            const delta =
                elapsed -
                lastTime;


            lastTime =
                elapsed;


            /* ---------------------------------------------
               SMOOTH POINTER
            --------------------------------------------- */

            pointerX +=
                (
                    targetPointerX -
                    pointerX
                ) *
                0.035;


            pointerY +=
                (
                    targetPointerY -
                    pointerY
                ) *
                0.035;


            /* ---------------------------------------------
               SMOOTH SCROLL
            --------------------------------------------- */

            scroll +=
                (
                    scrollTarget -
                    scroll
                ) *
                0.06;


            const scrollProgress =
                Math.min(
                    scroll /
                    Math.max(
                        window.innerHeight,
                        1
                    ),
                    6
                );


            /* ---------------------------------------------
               SYSTEM ROTATION
            --------------------------------------------- */

            system.rotation.y =
                elapsed *
                0.075;


            system.rotation.x =
                Math.sin(
                    elapsed *
                    0.18
                ) *
                0.08;


            /*
                Pointer influence.
            */

            system.rotation.y +=
                pointerX *
                0.16;


            system.rotation.x +=
                pointerY *
                0.10;


            /*
                Scroll changes the system's
                orientation instead of simply
                moving it vertically.
            */

            system.rotation.z =
                scrollProgress *
                0.035;


            /* ---------------------------------------------
               CORE
            --------------------------------------------- */

            core.rotation.x =
                elapsed *
                0.13;


            core.rotation.y =
                elapsed *
                0.19;


            inner.rotation.x =
                -elapsed *
                0.20;


            inner.rotation.y =
                elapsed *
                0.28;


            shell.rotation.x =
                elapsed *
                0.035;


            shell.rotation.y =
                -elapsed *
                0.055;


            /* ---------------------------------------------
               RINGS
            --------------------------------------------- */

            ring1.rotation.z =
                elapsed *
                0.12;


            ring1.rotation.x =
                Math.PI / 2 +
                Math.sin(
                    elapsed *
                    0.35
                ) *
                0.12;


            ring2.rotation.y =
                elapsed *
                0.09;


            ring2.rotation.z =
                -elapsed *
                0.07;


            ring3.rotation.x =
                elapsed *
                0.055;


            ring3.rotation.y =
                -elapsed *
                0.045;


            /* ---------------------------------------------
               ORBIT NODES
            --------------------------------------------- */

            nodes.forEach(
                (node, index) => {

                    const angle =
                        node.userData.angle +
                        elapsed *
                        node.userData.speed *
                        1000;


                    const radius =
                        node.userData.radius;


                    node.position.x =
                        Math.cos(angle) *
                        radius;


                    node.position.y =
                        Math.sin(angle) *
                        radius *
                        0.72;


                    node.position.z =
                        Math.sin(
                            angle *
                            1.7
                        ) *
                        0.45;


                    node.scale.setScalar(
                        0.75 +
                        Math.sin(
                            elapsed * 2 +
                            index
                        ) *
                        0.15
                    );

                }
            );


            /* ---------------------------------------------
               SIGNAL
            --------------------------------------------- */

            const pulse =
                1 +
                Math.sin(
                    elapsed * 2.4
                ) *
                0.18;


            signal.scale.setScalar(
                pulse
            );


            signalRings.forEach(
                (ring, index) => {

                    const phase =
                        (
                            elapsed *
                            0.75 +
                            index *
                            0.8
                        ) %
                        2.4;


                    const scale =
                        0.6 +
                        phase *
                        0.45;


                    ring.scale.setScalar(
                        scale
                    );


                    ring.material.opacity =
                        Math.max(
                            0,
                            0.20 -
                            phase *
                            0.075
                        );

                }
            );


            /* ---------------------------------------------
               PARTICLE FIELD
            --------------------------------------------- */

            particles.rotation.y =
                elapsed *
                0.012;


            particles.rotation.x =
                Math.sin(
                    elapsed *
                    0.08
                ) *
                0.04;


            particles.position.x =
                pointerX *
                0.12;


            particles.position.y =
                -pointerY *
                0.08;


            /* ---------------------------------------------
               CAMERA
            --------------------------------------------- */

            const cameraTargetX =
                pointerX *
                (mobile ? 0.12 : 0.28);


            const cameraTargetY =
                -pointerY *
                (mobile ? 0.08 : 0.18);


            camera.position.x +=
                (
                    cameraTargetX -
                    camera.position.x
                ) *
                0.025;


            camera.position.y +=
                (
                    cameraTargetY -
                    camera.position.y
                ) *
                0.025;


            /*
                Subtle camera movement as
                the user scrolls.
            */

            camera.position.z =
                (
                    mobile ? 8.8 : 7.5
                ) +
                Math.min(
                    scrollProgress *
                    0.18,
                    0.9
                );


            camera.lookAt(
                0,
                0,
                0
            );


            /* ---------------------------------------------
               RENDER
            --------------------------------------------- */

            renderer.render(
                scene,
                camera
            );


            /*
                Prevent unused-variable warnings
                in some environments.
            */

            void delta;
        }


        animate();


        /* =================================================
           MENU
        ================================================= */

        function openMenu() {

            if (!menuButton ||
                !mobileMenu) {
                return;
            }


            menuButton.classList.add(
                "active"
            );


            mobileMenu.classList.add(
                "open"
            );


            document.body.classList.add(
                "menu-open"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );


            mobileMenu.setAttribute(
                "aria-hidden",
                "false"
            );
        }


        function closeMenu() {

            if (!menuButton ||
                !mobileMenu) {
                return;
            }


            menuButton.classList.remove(
                "active"
            );


            mobileMenu.classList.remove(
                "open"
            );


            document.body.classList.remove(
                "menu-open"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                () => {

                    if (
                        mobileMenu.classList.contains(
                            "open"
                        )
                    ) {

                        closeMenu();

                    } else {

                        openMenu();

                    }

                }
            );

        }


        /* -------------------------------------------------
           CLOSE MOBILE MENU ON LINK
        ------------------------------------------------- */

        document
            .querySelectorAll(
                ".mobile-links a"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        closeMenu
                    );

                }
            );


        /* -------------------------------------------------
           ESCAPE
        ------------------------------------------------- */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    closeMenu();

                }

            }
        );


        /* =================================================
           REVEAL ANIMATIONS
        ================================================= */

        const revealElements =
            document.querySelectorAll(
                ".section-copy, .product-copy, .process-flow, .final-section > *"
            );


        if (
            "IntersectionObserver"
            in window
        ) {

            const observer =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "is-visible"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            revealElements.forEach(
                element => {

                    element.classList.add(
                        "reveal"
                    );


                    observer.observe(
                        element
                    );

                }
            );

        }


        /* =================================================
           INTERNAL LINKS
        ================================================= */

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        event => {

                            const id =
                                link.getAttribute(
                                    "href"
                                );


                            if (
                                !id ||
                                id === "#"
                            ) {
                                return;
                            }


                            const target =
                                document.querySelector(
                                    id
                                );


                            if (!target) {
                                return;
                            }


                            event.preventDefault();


                            const navHeight =
                                76;


                            const top =
                                target
                                    .getBoundingClientRect()
                                    .top +
                                window.scrollY -
                                navHeight;


                            window.scrollTo({
                                top,
                                behavior:
                                    "smooth"
                            });

                        }
                    );

                }
            );


        console.log(
            "Virtual Genie 3D system online."
        );
    }

})();
