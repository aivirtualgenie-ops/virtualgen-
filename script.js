/* =========================================================
   VIRTUAL GENIE AI
   CINEMATIC HERO ENGINE
   Scroll + Mouse + Touch + Depth + Navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body =
        document.body;

    const hero =
        document.querySelector(".hero");

    const scene =
        document.querySelector(".hero-3d-scene");

    const heroArt =
        document.querySelector(".depth-character");

    const depthBg =
        document.querySelector(".depth-bg");

    const blueLight =
        document.querySelector(".light-blue");

    const orangeLight =
        document.querySelector(".light-orange");

    const panels =
        document.querySelectorAll(".floating-panel");

    const rings =
        document.querySelectorAll(".energy-ring");

    const heroContent =
        document.querySelector(".hero-content");

    const heroGlow =
        document.querySelector(".hero-glow");

    const menuButton =
        document.getElementById("menuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    /* =====================================================
       STATE
    ===================================================== */

    let scrollPosition =
        window.scrollY;

    let smoothScroll =
        window.scrollY;

    let targetMouseX = 0;
    let targetMouseY = 0;

    let mouseX = 0;
    let mouseY = 0;

    let lastTime = 0;

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (
        menuButton &&
        mobileMenu
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                const open =
                    mobileMenu.classList.contains(
                        "open"
                    );

                if (open) {
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


        function openMenu() {

            menuButton.classList.add(
                "active"
            );

            mobileMenu.classList.add(
                "open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                "false"
            );

            body.classList.add(
                "menu-open"
            );

        }


        function closeMenu() {

            menuButton.classList.remove(
                "active"
            );

            mobileMenu.classList.remove(
                "open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            body.classList.remove(
                "menu-open"
            );

        }

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

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

                    const header =
                        document.querySelector(
                            ".site-header"
                        );

                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;

                    const position =
                        target.getBoundingClientRect()
                            .top
                        +
                        window.scrollY
                        -
                        headerHeight;

                    window.scrollTo({

                        top: position,

                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }
            );

        });


    /* =====================================================
       POINTER MOVEMENT
    ===================================================== */

    window.addEventListener(
        "mousemove",
        event => {

            if (reducedMotion) {
                return;
            }

            targetMouseX =
                (
                    event.clientX /
                    window.innerWidth
                    -
                    0.5
                ) * 2;

            targetMouseY =
                (
                    event.clientY /
                    window.innerHeight
                    -
                    0.5
                ) * 2;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH MOVEMENT
    ===================================================== */

    window.addEventListener(
        "touchmove",
        event => {

            if (
                reducedMotion ||
                !event.touches.length
            ) {
                return;
            }

            const touch =
                event.touches[0];

            targetMouseX =
                (
                    touch.clientX /
                    window.innerWidth
                    -
                    0.5
                ) * 1.2;

            targetMouseY =
                (
                    touch.clientY /
                    window.innerHeight
                    -
                    0.5
                ) * 1.2;

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

            scrollPosition =
                window.scrollY;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       HERO MOTION
    ===================================================== */

    function updateHero(progress) {

        if (!hero) {
            return;
        }


        /* ---------------------------------------------
           BACKGROUND
        --------------------------------------------- */

        if (depthBg) {

            const x =
                mouseX * -16;

            const y =
                mouseY * -10 -
                progress * 45;

            const scale =
                1.42 +
                progress * .18;

            depthBg.style.transform =
                `
                translate3d(
                    ${x}px,
                    ${y}px,
                    0
                )
                scale(${scale})
                `;

        }


        /* ---------------------------------------------
           BLUE LIGHT
        --------------------------------------------- */

        if (blueLight) {

            blueLight.style.transform =
                `
                translate3d(
                    ${mouseX * 35}px,
                    ${mouseY * 25 - progress * 35}px,
                    -250px
                )
                scale(${1 + progress})
                `;

        }


        /* ---------------------------------------------
           ORANGE LIGHT
        --------------------------------------------- */

        if (orangeLight) {

            orangeLight.style.transform =
                `
                translate3d(
                    ${mouseX * -25}px,
                    ${mouseY * -18 - progress * 20}px,
                    -180px
                )
                scale(${1 + progress * .7})
                `;

        }


        /* ---------------------------------------------
           GENIE
        --------------------------------------------- */

        if (heroArt) {

            const scale =
                1 +
                progress * .34;

            const x =
                mouseX * 24;

            const y =
                mouseY * 16 -
                progress * 110;

            const rotateX =
                mouseY * 2.5;

            const rotateY =
                mouseX * -3;

            heroArt.style.transform =
                `
                translate3d(
                    ${x}px,
                    ${y}px,
                    150px
                )
                scale(${scale})
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                `;

        }


        /* ---------------------------------------------
           HERO TEXT
        --------------------------------------------- */

        if (heroContent) {

            const opacity =
                Math.max(
                    0,
                    1 -
                    progress * 1.7
                );

            const y =
                progress * -110;

            heroContent.style.opacity =
                opacity;

            heroContent.style.transform =
                `
                translate3d(
                    ${mouseX * 6}px,
                    ${y + mouseY * 4}px,
                    0
                )
                `;

        }


        /* ---------------------------------------------
           ATMOSPHERIC GLOW
        --------------------------------------------- */

        if (heroGlow) {

            heroGlow.style.transform =
                `
                translate3d(
                    ${mouseX * 15}px,
                    ${mouseY * 12 - progress * 55}px,
                    0
                )
                scale(${1 + progress * 1.4})
                `;

        }


        /* ---------------------------------------------
           FLOATING PANELS
        --------------------------------------------- */

        panels.forEach(
            (panel, index) => {

                const direction =
                    index % 2 === 0
                        ? 1
                        : -1;

                const horizontal =
                    mouseX *
                    (8 + index * 4) *
                    direction;

                const vertical =
                    mouseY *
                    (7 + index * 2);

                const scrollX =
                    progress *
                    (index + 1) *
                    7 *
                    direction;

                const scrollY =
                    progress *
                    (index + 1) *
                    -24;

                panel.style.marginLeft =
                    `${horizontal + scrollX}px`;

                panel.style.marginTop =
                    `${vertical + scrollY}px`;

            }
        );


        /* ---------------------------------------------
           ENERGY RINGS
        --------------------------------------------- */

        rings.forEach(
            (ring, index) => {

                const direction =
                    index === 0
                        ? 1
                        : -1;

                ring.style.marginLeft =
                    `${mouseX * 12 * direction}px`;

                ring.style.marginTop =
                    `${mouseY * 8}px`;

            }
        );

    }


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    function getHeroProgress() {

        if (!hero) {
            return 0;
        }

        const heroHeight =
            hero.offsetHeight;

        if (!heroHeight) {
            return 0;
        }

        return Math.min(
            Math.max(
                smoothScroll /
                heroHeight,
                0
            ),
            1
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    function updateNavigation() {

        const navItems =
            document.querySelectorAll(
                ".hero-nav-item"
            );

        if (!navItems.length) {
            return;
        }


        const sections = [

            document.querySelector(
                "#home"
            ),

            document.querySelector(
                "#system"
            ),

            document.querySelector(
                "#statement"
            ),

            document.querySelector(
                "#contact"
            )

        ];


        let activeIndex = 0;


        sections.forEach(
            (section, index) => {

                if (!section) {
                    return;
                }

                const rect =
                    section.getBoundingClientRect();


                if (
                    rect.top <=
                    window.innerHeight * .45
                ) {

                    activeIndex =
                        index;

                }

            }
        );


        navItems.forEach(
            (item, index) => {

                item.classList.toggle(
                    "active",
                    index === activeIndex
                );

            }
        );

    }


    /* =====================================================
       REVEAL SECTIONS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            `
            .system-heading,
            .system-product,
            .statement-section h2,
            .statement-section p,
            .final-cta h2,
            .final-cta p,
            .final-link
            `
        );


    if (!reducedMotion) {

        revealElements.forEach(
            element => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translate3d(0,40px,0)";

                element.style.transition =
                    "opacity .9s cubic-bezier(.22,1,.36,1), " +
                    "transform .9s cubic-bezier(.22,1,.36,1)";

            }
        );


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translate3d(0,0,0)";

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: .12,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       MAIN ANIMATION LOOP
    ===================================================== */

    function animationLoop(time) {

        const delta =
            time - lastTime;

        lastTime = time;


        /*
         * Smooth scrolling value.
         */

        if (reducedMotion) {

            smoothScroll =
                scrollPosition;

        } else {

            smoothScroll +=
                (
                    scrollPosition -
                    smoothScroll
                ) * .075;

        }


        /*
         * Smooth pointer movement.
         */

        if (!reducedMotion) {

            mouseX +=
                (
                    targetMouseX -
                    mouseX
                ) * .055;

            mouseY +=
                (
                    targetMouseY -
                    mouseY
                ) * .055;

        } else {

            mouseX = 0;
            mouseY = 0;

        }


        const progress =
            getHeroProgress();


        updateHero(
            progress
        );


        requestAnimationFrame(
            animationLoop
        );

    }


    requestAnimationFrame(
        animationLoop
    );


    /* =====================================================
       IMAGE PROTECTION
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach(
            image => {

                image.addEventListener(
                    "dragstart",
                    event => {

                        event.preventDefault();

                    }
                );

            }
        );


    /* =====================================================
       INITIAL UPDATE
    ===================================================== */

    updateNavigation();


    window.addEventListener(
        "scroll",
        updateNavigation,
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            updateNavigation();

        },
        {
            passive: true
        }
    );

});
