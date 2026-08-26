/* =========================================================
   VIRTUAL GENIE AI
   INTERACTION + MOTION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const hero = document.querySelector(".hero");
    const heroArt = document.querySelector(".hero-art-wrap");
    const heroGlow = document.querySelector(".hero-glow");
    const heroContent = document.querySelector(".hero-content");

    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    let scrollY = window.scrollY;
    let targetScrollY = scrollY;

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;

    let ticking = false;


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                menuButton.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });


        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {
                    closeMenu();
                });

            });


        function openMenu() {

            menuButton.classList.add("active");

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            mobileMenu.classList.add("open");

            mobileMenu.setAttribute(
                "aria-hidden",
                "false"
            );

            body.classList.add("menu-open");
        }


        function closeMenu() {

            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenu.classList.remove("open");

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            body.classList.remove("menu-open");
        }

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const id =
                    link.getAttribute("href");

                if (!id || id === "#") {
                    return;
                }

                const target =
                    document.querySelector(id);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerHeight = 72;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            });

        });


    /* =====================================================
       SCROLL ENGINE
    ===================================================== */

    function updateScrollPosition() {

        scrollY = window.scrollY;

        if (!ticking) {

            window.requestAnimationFrame(() => {

                updateHeroMotion();
                updateScrollProgress();
                updateActiveNavigation();

                ticking = false;

            });

            ticking = true;
        }

    }


    window.addEventListener(
        "scroll",
        updateScrollPosition,
        { passive: true }
    );


    /* =====================================================
       HERO CINEMATIC MOTION
    ===================================================== */

    function updateHeroMotion() {

        if (!hero || !heroArt) {
            return;
        }

        const heroHeight =
            hero.offsetHeight;

        const progress =
            Math.min(
                Math.max(
                    scrollY / heroHeight,
                    0
                ),
                1
            );


        /*
         * The artwork slowly moves upward
         * while simultaneously zooming.
         */

        const artY =
            progress * -130;

        const artScale =
            1 + progress * 0.24;

        const artRotate =
            progress * -1.2;


        /*
         * Content leaves the scene more quickly
         * than the artwork.
         */

        const contentY =
            progress * -100;

        const contentOpacity =
            Math.max(
                0,
                1 - progress * 1.55
            );


        /*
         * Background gets deeper as we scroll.
         */

        const glowScale =
            1 + progress * 1.5;

        const glowOpacity =
            Math.max(
                0.02,
                0.12 - progress * 0.07
            );


        heroArt.style.transform =
            `
            translate3d(
                ${mouseX * 0.35}px,
                ${artY + mouseY * 0.25}px,
                0
            )
            scale(${artScale})
            rotate(${artRotate}deg)
            `;


        heroContent.style.transform =
            `
            translate3d(
                ${mouseX * 0.08}px,
                ${contentY + mouseY * 0.06}px,
                0
            )
            `;


        heroContent.style.opacity =
            contentOpacity;


        if (heroGlow) {

            heroGlow.style.transform =
                `
                translate3d(
                    ${mouseX * 0.12}px,
                    ${progress * -60}px,
                    0
                )
                scale(${glowScale})
                `;

            heroGlow.style.opacity =
                glowOpacity;

        }

    }


    /* =====================================================
       MOUSE PARALLAX
    ===================================================== */

    function handlePointerMove(event) {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        targetMouseX =
            ((event.clientX / width) - 0.5) * 30;


        targetMouseY =
            ((event.clientY / height) - 0.5) * 30;

    }


    window.addEventListener(
        "mousemove",
        handlePointerMove,
        { passive: true }
    );


    /* =====================================================
       TOUCH PARALLAX
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;


    window.addEventListener(
        "touchstart",
        event => {

            if (!event.touches.length) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

        },
        { passive: true }
    );


    window.addEventListener(
        "touchmove",
        event => {

            if (!event.touches.length) {
                return;
            }

            const x =
                event.touches[0].clientX;

            const y =
                event.touches[0].clientY;


            targetMouseX =
                ((x / window.innerWidth) - 0.5) * 16;


            targetMouseY =
                ((y / window.innerHeight) - 0.5) * 16;

        },
        { passive: true }
    );


    /* =====================================================
       PARALLAX SMOOTHING
    ===================================================== */

    function animateParallax() {

        mouseX +=
            (targetMouseX - mouseX) * 0.055;

        mouseY +=
            (targetMouseY - mouseY) * 0.055;


        /*
         * Slowly return toward center
         * when the pointer stops moving.
         */

        targetMouseX *= 0.985;
        targetMouseY *= 0.985;


        if (!ticking) {

            window.requestAnimationFrame(() => {

                updateHeroMotion();

            });

        }


        window.requestAnimationFrame(
            animateParallax
        );

    }


    animateParallax();


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    function updateScrollProgress() {

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {
            return;
        }

        const progress =
            Math.min(
                Math.max(
                    window.scrollY / documentHeight,
                    0
                ),
                1
            );


        document.documentElement.style
            .setProperty(
                "--scroll-progress",
                progress
            );

    }


    /* =====================================================
       ACTIVE HERO NAVIGATION
    ===================================================== */

    function updateActiveNavigation() {

        const items =
            document.querySelectorAll(
                ".hero-nav-item"
            );

        if (!items.length) {
            return;
        }


        const sections = [
            document.querySelector(".hero"),
            document.querySelector(".system-section"),
            document.querySelector(".statement-section"),
            document.querySelector(".final-cta")
        ];


        let activeIndex = 0;


        sections.forEach((section, index) => {

            if (!section) {
                return;
            }

            const rect =
                section.getBoundingClientRect();


            if (rect.top <= window.innerHeight * 0.45) {
                activeIndex = index;
            }

        });


        items.forEach((item, index) => {

            item.classList.toggle(
                "active",
                index === activeIndex
            );

        });

    }


    /* =====================================================
       REVEAL ANIMATIONS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".system-heading, " +
            ".system-product, " +
            ".statement-section h2, " +
            ".statement-section p, " +
            ".final-cta h2, " +
            ".final-cta p, " +
            ".final-link"
        );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translate3d(0,35px,0)";

        element.style.transition =
            "opacity .9s cubic-bezier(.22,1,.36,1), " +
            "transform .9s cubic-bezier(.22,1,.36,1)";

    });


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translate3d(0,0,0)";

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =====================================================
       PRODUCT ROW MOTION
    ===================================================== */

    const products =
        document.querySelectorAll(
            ".system-product"
        );


    products.forEach((product, index) => {

        product.style.transitionDelay =
            `${index * 80}ms`;

    });


    /* =====================================================
       HERO LOAD ANIMATION
    ===================================================== */

    if (hero) {

        hero.classList.add("is-loading");


        requestAnimationFrame(() => {

            setTimeout(() => {

                hero.classList.remove(
                    "is-loading"
                );

                hero.classList.add(
                    "is-loaded"
                );

            }, 100);

        });

    }


    /* =====================================================
       PREVENT IMAGE DRAG
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach(img => {

            img.addEventListener(
                "dragstart",
                event => {
                    event.preventDefault();
                }
            );

        });


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateScrollProgress();
    updateActiveNavigation();
    updateHeroMotion();

});
