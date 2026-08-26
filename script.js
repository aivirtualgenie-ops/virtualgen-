/* =========================================================
   VIRTUAL GENIE
   INTERACTION + WEBGL EXPERIENCE
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       BASIC SETUP
    ====================================================== */

    const body = document.body;
    const canvas = document.getElementById("experience");

    if (!canvas) {
        return;
    }


    /* =====================================================
       REDUCED MOTION
    ====================================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {

        const closeMenu = () => {

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenu.classList.remove("open");

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            body.classList.remove("menu-open");
        };


        const openMenu = () => {

            menuToggle.classList.add("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            mobileMenu.classList.add("open");

            mobileMenu.setAttribute(
                "aria-hidden",
                "false"
            );

            body.classList.add("menu-open");
        };


        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    menuToggle.classList.contains("active");

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );


        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    menuToggle.classList.contains("active")
                ) {
                    closeMenu();
                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 900 &&
                    menuToggle.classList.contains("active")
                ) {
                    closeMenu();
                }

            }
        );
    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ====================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: reduceMotion
                            ? "auto"
                            : "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       SCROLL STATE
    ====================================================== */

    let scrollY = window.scrollY || 0;
    let targetScroll = scrollY;

    let viewportWidth =
        window.innerWidth;

    let viewportHeight =
        window.innerHeight;


    window.addEventListener(
        "scroll",
        () => {

            targetScroll =
                window.scrollY || 0;

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        () => {

            viewportWidth =
                window.innerWidth;

            viewportHeight =
                window.innerHeight;

        }
    );


    /* =====================================================
       HERO PARALLAX
    ====================================================== */

    const heroContent =
        document.querySelector(".hero-content");

    const heroTop =
        document.querySelector(".hero-top");

    const heroBottom =
        document.querySelector(".hero-bottom");


    const updateHero = () => {

        if (!heroContent) {
            return;
        }

        const heroHeight =
            viewportHeight;

        const progress =
            Math.min(
                Math.max(
                    scrollY / heroHeight,
                    0
                ),
                1
            );


        if (reduceMotion) {
            return;
        }


        const contentY =
            progress * -90;

        const opacity =
            1 - progress * 1.15;


        heroContent.style.transform =
            `translate3d(0, ${contentY}px, 0)`;

        heroContent.style.opacity =
            Math.max(opacity, 0);


        if (heroTop) {

            heroTop.style.transform =
                `translate3d(0, ${progress * -25}px, 0)`;

            heroTop.style.opacity =
                Math.max(
                    1 - progress * 1.5,
                    0
                );
        }


        if (heroBottom) {

            heroBottom.style.transform =
                `translate3d(0, ${progress * 25}px, 0)`;

            heroBottom.style.opacity =
                Math.max(
                    1 - progress * 2,
                    0
                );
        }

    };


    /* =====================================================
       INTERSECTION OBSERVER
    ====================================================== */

    const revealItems =
        document.querySelectorAll(
            ".system-intro-content, " +
            ".system-product, " +
            ".process-item, " +
            ".final-cta"
        );


    if (
        !reduceMotion &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -8% 0px"
                }
            );


        revealItems.forEach(
            element => observer.observe(element)
        );

    } else {

        revealItems.forEach(
            element =>
                element.classList.add(
                    "is-visible"
                )
        );

    }


    /* =====================================================
       THREE.JS CHECK
    ====================================================== */

    if (
        typeof THREE === "undefined"
    ) {

        console.warn(
            "Three.js was not loaded."
        );

        return;

    }


    /* =====================================================
       THREE.JS SCENE
    ====================================================== */

    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(
            45,
            viewportWidth / viewportHeight,
            0.1,
            100
        );


    camera.position.z =
        viewportWidth < 700
            ? 7
            : 6;


    const renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            viewportWidth < 700 ? 1.5 : 2
        )
    );


    renderer.setSize(
        viewportWidth,
        viewportHeight,
        false
    );


    renderer.setClearColor(
        0x000000,
        0
    );


    /* =====================================================
       PARTICLE SYSTEM
    ====================================================== */

    const particleCount =
        viewportWidth < 700
            ? 650
            : 1200;


    const positions =
        new Float32Array(
            particleCount * 3
        );


    const basePositions =
        new Float32Array(
            particleCount * 3
        );


    const particleSizes =
        new Float32Array(
            particleCount
        );


    const randoms =
        new Float32Array(
            particleCount
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 =
            i * 3;


        /*
         * Wide, architectural field.
         *
         * The points are deliberately sparse.
         * This is not a "glowing AI cloud".
         */

        const x =
            (Math.random() - 0.5) * 9;

        const y =
            (Math.random() - 0.5) * 6;

        const z =
            (Math.random() - 0.5) * 5;


        positions[i3] =
            x;

        positions[i3 + 1] =
            y;

        positions[i3 + 2] =
            z;


        basePositions[i3] =
            x;

        basePositions[i3 + 1] =
            y;

        basePositions[i3 + 2] =
            z;


        particleSizes[i] =
            Math.random() *
            1.2 +
            0.35;


        randoms[i] =
            Math.random();

    }


    const particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
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
     * Simple white material.
     *
     * No colored gradients.
     */

    const particleMaterial =
        new THREE.PointsMaterial({

            color: 0xf2f1ec,

            size:
                viewportWidth < 700
                    ? 0.018
                    : 0.022,

            transparent: true,

            opacity:
                viewportWidth < 700
                    ? 0.26
                    : 0.32,

            depthWrite: false,

            blending:
                THREE.NormalBlending

        });


    const particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    scene.add(particles);


    /* =====================================================
       ARCHITECTURAL LINES
    ====================================================== */

    const lineGroup =
        new THREE.Group();


    scene.add(lineGroup);


    const lineMaterial =
        new THREE.LineBasicMaterial({
            color: 0xf2f1ec,
            transparent: true,
            opacity:
                viewportWidth < 700
                    ? 0.06
                    : 0.085
        });


    const lineCount =
        viewportWidth < 700
            ? 10
            : 18;


    for (
        let i = 0;
        i < lineCount;
        i++
    ) {

        const geometry =
            new THREE.BufferGeometry();


        const points = [];


        const y =
            -3.2 +
            (i / lineCount) * 6.4;


        points.push(
            new THREE.Vector3(
                -5,
                y,
                -1
            )
        );


        points.push(
            new THREE.Vector3(
                5,
                y,
                -1
            )
        );


        geometry.setFromPoints(
            points
        );


        const line =
            new THREE.Line(
                geometry,
                lineMaterial
            );


        lineGroup.add(line);

    }


    /* =====================================================
       VERTICAL STRUCTURE LINES
    ====================================================== */

    const verticalCount =
        viewportWidth < 700
            ? 5
            : 9;


    for (
        let i = 0;
        i < verticalCount;
        i++
    ) {

        const geometry =
            new THREE.BufferGeometry();


        const points = [];


        const x =
            -4.5 +
            (i / (verticalCount - 1)) * 9;


        points.push(
            new THREE.Vector3(
                x,
                -3,
                -1
            )
        );


        points.push(
            new THREE.Vector3(
                x,
                3,
                -1
            )
        );


        geometry.setFromPoints(
            points
        );


        const line =
            new THREE.Line(
                geometry,
                lineMaterial
            );


        lineGroup.add(line);

    }


    /* =====================================================
       INTERACTION
    ====================================================== */

    let pointerX = 0;
    let pointerY = 0;

    let smoothPointerX = 0;
    let smoothPointerY = 0;


    const updatePointer =
        (x, y) => {

            pointerX =
                (x / viewportWidth - 0.5) *
                2;

            pointerY =
                (y / viewportHeight - 0.5) *
                2;

        };


    window.addEventListener(
        "pointermove",
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
                !event.touches ||
                !event.touches[0]
            ) {
                return;
            }

            updatePointer(
                event.touches[0].clientX,
                event.touches[0].clientY
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       PRODUCT STATE
    ====================================================== */

    const products =
        document.querySelectorAll(
            ".system-product"
        );


    let activeProduct =
        "receptionist";


    const productObserver =
        "IntersectionObserver" in window
            ? new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio > 0.35
                        ) {

                            const system =
                                entry.target.dataset.system;

                            if (system) {

                                activeProduct =
                                    system;

                            }

                        }

                    });

                },
                {
                    threshold: [
                        0.35,
                        0.55,
                        0.75
                    ]
                }
            )
            : null;


    if (productObserver) {

        products.forEach(
            product =>
                productObserver.observe(product)
        );

    }


    /* =====================================================
       SYSTEM VISUAL STATE
    ====================================================== */

    const systemTargets = {

        receptionist: {
            rotation: 0.18,
            spread: 0.82
        },

        leads: {
            rotation: 0.45,
            spread: 1.18
        },

        infrastructure: {
            rotation: 0.75,
            spread: 1.42
        },

        "business-os": {
            rotation: 1.05,
            spread: 1.68
        }

    };


    let currentSpread = 1;
    let targetSpread = 1;

    let currentRotation = 0;
    let targetRotation = 0;


    /* =====================================================
       SCROLL → SYSTEM STATE
    ====================================================== */

    const updateSystemTarget =
        () => {

            const target =
                systemTargets[
                    activeProduct
                ] ||
                systemTargets.receptionist;


            targetSpread =
                target.spread;

            targetRotation =
                target.rotation;

        };


    /* =====================================================
       ANIMATION
    ====================================================== */

    let time = 0;


    const animate =
        () => {

            requestAnimationFrame(
                animate
            );


            /*
             * Smooth scroll value.
             */

            scrollY +=
                (
                    targetScroll -
                    scrollY
                ) *
                (
                    reduceMotion
                        ? 1
                        : 0.085
                );


            time +=
                reduceMotion
                    ? 0.001
                    : 0.006;


            updateHero();

            updateSystemTarget();


            /*
             * Smooth pointer.
             */

            smoothPointerX +=
                (
                    pointerX -
                    smoothPointerX
                ) * 0.035;


            smoothPointerY +=
                (
                    pointerY -
                    smoothPointerY
                ) * 0.035;


            /*
             * Smooth visual system state.
             */

            currentSpread +=
                (
                    targetSpread -
                    currentSpread
                ) * 0.025;


            currentRotation +=
                (
                    targetRotation -
                    currentRotation
                ) * 0.025;


            /* ---------------------------------------------
               PARTICLES
            --------------------------------------------- */

            const positionAttribute =
                particleGeometry.attributes.position;


            const array =
                positionAttribute.array;


            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                const i3 =
                    i * 3;


                const baseX =
                    basePositions[i3];

                const baseY =
                    basePositions[i3 + 1];

                const baseZ =
                    basePositions[i3 + 2];


                const random =
                    randoms[i];


                /*
                 * Very restrained movement.
                 * More like a living system than particles.
                 */

                const wave =
                    Math.sin(
                        time * 0.75 +
                        random * 12
                    ) * 0.018;


                const drift =
                    Math.cos(
                        time * 0.45 +
                        random * 8
                    ) * 0.012;


                array[i3] =
                    baseX *
                    currentSpread +
                    smoothPointerX *
                    0.12 +
                    wave;


                array[i3 + 1] =
                    baseY *
                    currentSpread -
                    smoothPointerY *
                    0.10 +
                    drift;


                array[i3 + 2] =
                    baseZ *
                    currentSpread;

            }


            positionAttribute.needsUpdate =
                true;


            /* ---------------------------------------------
               PARTICLE ROTATION
            --------------------------------------------- */

            particles.rotation.y =
                currentRotation * 0.16 +
                smoothPointerX * 0.035;


            particles.rotation.x =
                smoothPointerY * 0.018;


            /* ---------------------------------------------
               LINE SYSTEM
            --------------------------------------------- */

            lineGroup.rotation.y =
                currentRotation * 0.045 +
                smoothPointerX * 0.025;


            lineGroup.rotation.x =
                smoothPointerY * 0.012;


            /*
             * Slow system movement.
             */

            lineGroup.position.y =
                Math.sin(
                    time * 0.4
                ) * 0.025;


            /* ---------------------------------------------
               CAMERA
            --------------------------------------------- */

            camera.position.x +=
                (
                    smoothPointerX * 0.20 -
                    camera.position.x
                ) * 0.018;


            camera.position.y +=
                (
                    -smoothPointerY * 0.12 -
                    camera.position.y
                ) * 0.018;


            camera.lookAt(
                0,
                0,
                0
            );


            renderer.render(
                scene,
                camera
            );

        };


    animate();


    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            viewportWidth =
                window.innerWidth;

            viewportHeight =
                window.innerHeight;


            camera.aspect =
                viewportWidth /
                viewportHeight;


            camera.fov =
                viewportWidth < 700
                    ? 48
                    : 45;


            camera.updateProjectionMatrix();


            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio || 1,
                    viewportWidth < 700
                        ? 1.5
                        : 2
                )
            );


            renderer.setSize(
                viewportWidth,
                viewportHeight,
                false
            );


            particleMaterial.size =
                viewportWidth < 700
                    ? 0.018
                    : 0.022;


            particleMaterial.opacity =
                viewportWidth < 700
                    ? 0.26
                    : 0.32;

        }
    );


    /* =====================================================
       PAGE VISIBILITY
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {
                renderer.setAnimationLoop(
                    null
                );
            } else {
                renderer.setAnimationLoop(
                    null
                );
            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    updateHero();
    updateSystemTarget();

})();
