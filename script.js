/* =========================================
   VIRTUAL GENIE — MAIN JAVASCRIPT
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuButton = document.querySelector(".menu");
const navigation = document.querySelector(".nav nav");

if (menuButton && navigation) {

    menuButton.addEventListener("click", function () {

        const isOpen =
            navigation.classList.toggle("mobile-open");

        menuButton.classList.toggle(
            "menu-open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    /* Close menu after selecting a page */

    navigation
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove(
                    "mobile-open"
                );

                menuButton.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


    /* Close menu when tapping outside */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                navigation.classList.remove(
                    "mobile-open"
                );

                menuButton.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================
   CONTACT FORM → GMAIL
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const business =
                document
                    .getElementById("business")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            const subject =
                encodeURIComponent(
                    "New Virtual Genie Enquiry — " +
                    business
                );


            const body =
                encodeURIComponent(
`NEW VIRTUAL GENIE WEBSITE ENQUIRY

Name:
${name}

Business:
${business}

Email:
${email}

Phone:
${phone || "Not provided"}

What they want to build:
${message || "Not specified"}

--------------------------------
Submitted through Virtual Genie website`
                );


            const gmailURL =
                "https://mail.google.com/mail/?" +
                "view=cm&fs=1" +
                "&to=virtualgenieai@gmail.com" +
                "&su=" + subject +
                "&body=" + body;


            window.open(
                gmailURL,
                "_blank"
            );


            const formMessage =
                document.getElementById(
                    "form-msg"
                );


            if (formMessage) {

                formMessage.textContent =
                    "Opening Gmail with your enquiry...";

            }

        }
    );

}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".product-card, " +
        ".feature-grid > div, " +
        ".steps > div, " +
        ".flow, " +
        ".dark-band, " +
        ".product-row, " +
        ".workflow-step"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(
        function (element) {

            element.classList.add(
                "reveal"
            );

            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================
   HERO PARALLAX
========================================= */

const heroOrbit =
    document.querySelector(
        ".hero-orbit"
    );


if (
    heroOrbit &&
    window.innerWidth > 800
) {

    window.addEventListener(
        "mousemove",
        function (event) {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                ) * 10;


            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                ) * 10;


            heroOrbit.style.transform =
                `translate(${x}px, ${y}px)`;

        }
    );

}


/* =========================================
   CURRENT YEAR
========================================= */

document
    .querySelectorAll("[data-year]")
    .forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });
