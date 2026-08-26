/* =========================================================
   VIRTUAL GENIE AI
   INTERACTION + VISUAL ENGINE
   NO FRAMEWORKS REQUIRED
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const canvas = document.getElementById("scene");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-links a");

    if (!canvas) {
        console.warn("Virtual Genie: #scene canvas not found.");
        return;
    }

    const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true
    });

    if (!ctx) {
        console.warn("Virtual Genie: Canvas unavailable.");
        return;
    }


    /* =====================================================
       STATE
    ===================================================== */

    let width = 0;
    let height = 0;
    let dpr = 1;

    let scrollY = window.scrollY || 0;
    let targetScroll = scrollY;

    let mouseX = 0.5;
    let mouseY = 0.5;

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    let time = 0;

    let reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       PARTICLE SYSTEM
    ===================================================== */

    const particles = [];

    const PARTICLE_COUNT =
        window.innerWidth < 700
            ? 85
            : 150;


    function random(min, max) {
        return Math.random() * (max - min) + min;
    }


    function createParticle() {

        return {
            x: random(-1, 1),
            y: random(-1, 1),
            z: random(0.1, 1),

            size: random(0.4, 1.5),

            speed:
                random(0.0008, 0.0022),

            phase:
                random(0, Math.PI * 2),

            drift:
                random(0.3, 1),

            brightness:
                random(0.25, 0.9)
        };
    }


    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {
        particles.push(
            createParticle()
        );
    }


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    resize();

    window.addEventListener(
        "resize",
        resize,
        {
            passive: true
        }
    );


    /* =====================================================
       POINTER
    ===================================================== */

    function updatePointer(
        x,
        y
    ) {

        targetMouseX =
            x / width;

        targetMouseY =
            y / height;
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


    /* =====================================================
       SCROLL
    ===================================================== */

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


    /* =====================================================
       SMOOTH VALUES
    ===================================================== */

    function lerp(
        current,
        target,
        amount
    ) {

        return (
            current +
            (target - current) *
            amount
        );
    }


    /* =====================================================
       BACKGROUND
    ===================================================== */

    function drawBackground() {

        ctx.fillStyle =
            "#050505";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }


    /* =====================================================
       PARTICLES
    ===================================================== */

    function drawParticles() {

        const centerX =
            width * 0.68;

        const centerY =
            height * 0.48;

        const radius =
            Math.min(
                width,
                height
            ) * 0.42;


        particles.forEach(
            particle => {

                const rotation =
                    time *
                    particle.speed *
                    100;

                const px =
                    particle.x *
                    radius;

                const py =
                    particle.y *
                    radius;

                const wobble =
                    Math.sin(
                        time * 0.0007 +
                        particle.phase
                    ) *
                    particle.drift *
                    7;

                const depth =
                    0.35 +
                    particle.z *
                    0.65;

                const parallaxX =
                    (
                        targetMouseX -
                        0.5
                    ) *
                    35 *
                    depth;

                const parallaxY =
                    (
                        targetMouseY -
                        0.5
                    ) *
                    25 *
                    depth;


                const x =
                    centerX +
                    px +
                    wobble +
                    parallaxX;

                const y =
                    centerY +
                    py +
                    parallaxY;


                /*
                    Fade visual away from the centre.
                */

                const distance =
                    Math.sqrt(
                        px * px +
                        py * py
                    );

                const fade =
                    Math.max(
                        0,
                        1 -
                        distance /
                        (radius * 1.15)
                    );


                const alpha =
                    particle.brightness *
                    fade *
                    0.42;


                if (
                    alpha <= 0
                ) {
                    return;
                }


                const size =
                    particle.size *
                    depth;


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(243,242,237,${alpha})`;

                ctx.fill();
            }
        );
    }


    /* =====================================================
       SYSTEM CORE
    ===================================================== */

    function drawCore() {

        const mobile =
            width < 700;

        const coreSize =
            mobile
                ? Math.min(width * 0.30, 130)
                : Math.min(width * 0.20, 210);


        const x =
            width * 0.70;

        const y =
            height * 0.49;


        const movementX =
            (
                mouseX -
                0.5
            ) *
            (mobile ? 10 : 28);

        const movementY =
            (
                mouseY -
                0.5
            ) *
            (mobile ? 8 : 20);


        const cx =
            x + movementX;

        const cy =
            y + movementY;


        /* Outer ring */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            coreSize,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(243,242,237,0.08)";

        ctx.lineWidth = 1;

        ctx.stroke();


        /* Second ring */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            coreSize * 0.72,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(243,242,237,0.11)";

        ctx.stroke();


        /* Core */

        const pulse =
            1 +
            Math.sin(
                time * 0.002
            ) *
            0.025;


        const coreRadius =
            coreSize *
            0.30 *
            pulse;


        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            coreRadius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(243,242,237,0.035)";

        ctx.fill();


        ctx.strokeStyle =
            "rgba(243,242,237,0.28)";

        ctx.stroke();


        /* Small central point */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#b9ff35";

        ctx.fill();
    }


    /* =====================================================
       SYSTEM LINES
    ===================================================== */

    function drawSystemLines() {

        const mobile =
            width < 700;

        if (mobile) {
            return;
        }


        const cx =
            width * 0.70;

        const cy =
            height * 0.49;

        const size =
            Math.min(
                width,
                height
            ) * 0.25;


        ctx.strokeStyle =
            "rgba(243,242,237,0.045)";

        ctx.lineWidth = 1;


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const angle =
                (
                    i /
                    8
                ) *
                Math.PI *
                2 +
                time * 0.0001;


            const x1 =
                cx +
                Math.cos(angle) *
                size *
                0.65;

            const y1 =
                cy +
                Math.sin(angle) *
                size *
                0.65;


            const x2 =
                cx +
                Math.cos(angle) *
                size *
                1.25;

            const y2 =
                cy +
                Math.sin(angle) *
                size *
                1.25;


            ctx.beginPath();

            ctx.moveTo(
                x1,
                y1
            );

            ctx.lineTo(
                x2,
                y2
            );

            ctx.stroke();
        }
    }


    /* =====================================================
       HERO DEPTH
    ===================================================== */

    function updateHeroDepth() {

        const hero =
            document.querySelector(
                ".hero"
            );

        if (!hero) {
            return;
        }


        const progress =
            Math.min(
                scrollY /
                Math.max(
                    height,
                    1
                ),
                1
            );


        const copy =
            document.querySelector(
                ".hero-copy"
            );

        if (copy) {

            copy.style.transform =
                `translate3d(
                    0,
                    ${progress * -70}px,
                    0
                )`;

            copy.style.opacity =
                Math.max(
                    0,
                    1 -
                    progress *
                    1.25
                );
        }
    }


    /* =====================================================
       ANIMATION LOOP
    ===================================================== */

    function render(timestamp) {

        time =
            timestamp || 0;


        /* Smooth pointer */

        mouseX =
            lerp(
                mouseX,
                targetMouseX,
                reducedMotion
                    ? 1
                    : 0.055
            );

        mouseY =
            lerp(
                mouseY,
                targetMouseY,
                reducedMotion
                    ? 1
                    : 0.055
            );


        /* Smooth scroll */

        scrollY =
            lerp(
                scrollY,
                targetScroll,
                0.08
            );


        drawBackground();

        drawParticles();

        drawSystemLines();

        drawCore();

        updateHeroDepth();


        requestAnimationFrame(
            render
        );
    }


    requestAnimationFrame(
        render
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMenu() {

        if (!menuButton || !mobileMenu) {
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
    }


    function closeMenu() {

        if (!menuButton || !mobileMenu) {
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
    }


    function toggleMenu() {

        if (
            mobileMenu &&
            mobileMenu.classList.contains(
                "open"
            )
        ) {

            closeMenu();

        } else {

            openMenu();
        }
    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            toggleMenu
        );
    }


    /* Close after selecting a page */

    mobileLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        }
    );


    /* Escape closes menu */

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


    /* =====================================================
       INTERSECTION ANIMATIONS
    ===================================================== */

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


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const offset =
                        parseInt(
                            getComputedStyle(
                                document.documentElement
                            )
                                .getPropertyValue(
                                    "--nav-height"
                                )
                        ) || 76;


                    const position =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        offset;


                    window.scrollTo({
                        top: position,
                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth"
                    });

                }
            );

        }
    );


    /* =====================================================
       PAGE LOAD
    ===================================================== */

    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "loaded"
            );

        }
    );


    console.log(
        "Virtual Genie AI — system online."
    );

})();
