/* =========================================
   VIRTUAL GENIE
   CINEMATIC INTERACTION SYSTEM
========================================= */


/* =========================================
   FULLSCREEN MENU
========================================= */

const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");

if (menuButton && menuPanel) {

    menuButton.addEventListener("click", () => {

        const isOpen =
            menuPanel.classList.toggle("open");

        menuButton.classList.toggle(
            "active",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        document.body.classList.toggle(
            "no-scroll",
            isOpen
        );

    });


    /* Close menu when navigation link is clicked */

    menuPanel
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menuPanel.classList.remove(
                        "open"
                    );

                    menuButton.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.classList.remove(
                        "no-scroll"
                    );

                }
            );

        });


    /* Escape key closes menu */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                menuPanel.classList.contains("open")
            ) {

                menuPanel.classList.remove(
                    "open"
                );

                menuButton.classList.remove(
                    "active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "no-scroll"
                );

            }

        }
    );

}


/* =========================================
   CUSTOM CURSOR
========================================= */

const cursor =
    document.getElementById("cursor");


if (
    cursor &&
    window.matchMedia(
        "(hover: hover)"
    ).matches
) {

    document.body.classList.add(
        "cursor-active"
    );


    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        }
    );


    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) * 0.16;

        cursorY +=
            (mouseY - cursorY) * 0.16;


        cursor.style.left =
            cursorX + "px";

        cursor.style.top =
            cursorY + "px";


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    /* Enlarge cursor over interactive elements */

    document
        .querySelectorAll(
            "a, button, .network-node"
        )
        .forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursor.style.width =
                        "18px";

                    cursor.style.height =
                        "18px";

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursor.style.width =
                        "8px";

                    cursor.style.height =
                        "8px";

                }
            );

        });

}


/* =========================================
   GENIE CORE — MOUSE MOVEMENT
========================================= */

const genieCore =
    document.getElementById(
        "genieCore"
    );


if (
    genieCore &&
    window.matchMedia(
        "(hover: hover)"
    ).matches
) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            targetX =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                ) * 24;


            targetY =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                ) * 24;

        }
    );


    function animateCore() {

        currentX +=
            (targetX - currentX) * 0.035;

        currentY +=
            (targetY - currentY) * 0.035;


        genieCore.style.transform =
            `translate(
                calc(-50% + ${currentX}px),
                calc(-45% + ${currentY}px)
            )`;


        requestAnimationFrame(
            animateCore
        );

    }


    animateCore();

}


/* =========================================
   SCROLL ENGINE
========================================= */

let scrollY = 0;

let lastScrollY = 0;


window.addEventListener(
    "scroll",
    () => {

        scrollY =
            window.scrollY;

    },
    {
        passive: true
    }
);


/* =========================================
   HERO CORE SCROLL ROTATION
========================================= */

const heroSection =
    document.querySelector(
        ".scene-hero"
    );


if (heroSection && genieCore) {

    function updateHero() {

        const rect =
            heroSection.getBoundingClientRect();


        const progress =
            Math.max(
                0,
                Math.min(
                    1,
                    -rect.top /
                    rect.height
                )
            );


        const rotation =
            progress * 35;


        const scale =
            1 -
            progress * 0.15;


        genieCore.style.setProperty(
            "--scroll-rotation",
            rotation + "deg"
        );


        genieCore.style.setProperty(
            "--scroll-scale",
            scale
        );


        requestAnimationFrame(
            updateHero
        );

    }


    updateHero();

}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealItems =
    document.querySelectorAll(
        ".product-copy, " +
        ".infrastructure-copy, " +
        ".bos-copy, " +
        ".visual, " +
        ".network-visual, " +
        ".bos-interface, " +
        ".final-core"
    );


if (
    "IntersectionObserver" in window
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


    revealItems.forEach(
        item => {

            item.classList.add(
                "reveal-item"
            );

            observer.observe(
                item
            );

        }
    );

}


/* =========================================
   DATA POINT ANIMATION
========================================= */

const dataPoints =
    document.querySelectorAll(
        ".data-points i"
    );


if (dataPoints.length) {

    dataPoints.forEach(
        (point, index) => {

            point.style.animationDelay =
                `${index * 90}ms`;

        }
    );

}


/* =========================================
   WAVEFORM ANIMATION
========================================= */

const waveformBars =
    document.querySelectorAll(
        ".waveform i"
    );


if (waveformBars.length) {

    waveformBars.forEach(
        (bar, index) => {

            const baseHeight =
                parseInt(
                    getComputedStyle(
                        bar
                    ).height
                );


            let direction =
                index % 2 === 0
                    ? 1
                    : -1;


            setInterval(
                () => {

                    const variation =
                        Math.random() * 22;


                    const height =
                        Math.max(
                            12,
                            baseHeight +
                            variation *
                            direction
                        );


                    bar.style.height =
                        height + "px";


                    direction *= -1;

                },
                650 + index * 55
            );

        }
    );

}


/* =========================================
   NETWORK PULSE
========================================= */

const networkNodes =
    document.querySelectorAll(
        ".network-node"
    );


if (networkNodes.length) {

    let activeNode = 0;


    setInterval(
        () => {

            networkNodes.forEach(
                node => {

                    node.style.borderColor =
                        "#292929";

                    node.style.color =
                        "#858580";

                }
            );


            const node =
                networkNodes[
                    activeNode
                ];


            if (node) {

                node.style.borderColor =
                    "#777773";

                node.style.color =
                    "#f2f1ec";

            }


            activeNode =
                (
                    activeNode + 1
                ) %
                networkNodes.length;


        },
        1100
    );

}


/* =========================================
   BUSINESS OS LIVE ACTIVITY
========================================= */

const activityItems =
    document.querySelectorAll(
        ".bos-activity p"
    );


if (activityItems.length) {

    let activityIndex = 0;


    setInterval(
        () => {

            activityItems.forEach(
                item => {

                    item.style.opacity =
                        "0.45";

                }
            );


            activityItems[
                activityIndex
            ].style.opacity =
                "1";


            activityIndex =
                (
                    activityIndex + 1
                ) %
                activityItems.length;


        },
        1500
    );

}


/* =========================================
   PARALLAX FOR VISUAL OBJECTS
========================================= */

const parallaxElements =
    document.querySelectorAll(
        ".phone-frame, " +
        ".data-field, " +
        ".network-visual, " +
        ".bos-interface"
    );


if (
    parallaxElements.length &&
    window.matchMedia(
        "(hover: hover)"
    ).matches
) {

    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                );


            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                );


            parallaxElements.forEach(
                (element, index) => {

                    const amount =
                        4 +
                        index * 1.5;


                    element.style.transform =
                        `translate(
                            ${x * amount}px,
                            ${y * amount}px
                        )`;

                }
            );

        }
    );

}


/* =========================================
   SMOOTH ANCHOR LINKS
========================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
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


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


/* =========================================
   CURRENT YEAR
========================================= */

document
    .querySelectorAll(
        "[data-year]"
    )
    .forEach(
        element => {

            element.textContent =
                new Date()
                    .getFullYear();

        }
    );


/* =========================================
   PAGE LOADED
========================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);
