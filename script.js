/* =========================================
   VIRTUAL GENIE — MAIN JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.querySelector(".menu");
const navigation = document.querySelector(".nav nav");

if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {

        navigation.classList.toggle("mobile-open");

    });

}


/* =========================================
   CONTACT FORM → GMAIL
========================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Get form values */

        const name =
            document.getElementById("name").value.trim();

        const business =
            document.getElementById("business").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* Gmail subject */

        const subject =
            encodeURIComponent(
                "New Virtual Genie Enquiry — " + business
            );


        /* Gmail email body */

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


        /* Gmail compose URL */

        const gmailURL =
            `https://mail.google.com/mail/?view=cm&fs=1&to=virtualgenieai@gmail.com&su=${subject}&body=${body}`;


        /* Open Gmail */

        window.open(
            gmailURL,
            "_blank"
        );


        /* Show confirmation */

        const formMessage =
            document.getElementById("form-msg");


        if (formMessage) {

            formMessage.textContent =
                "Opening Gmail with your enquiry...";

            formMessage.style.marginTop =
                "15px";

        }

    });

}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".product-card, .feature-grid > div, .steps > div, .flow, .dark-band"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* =========================================
   SIMPLE HERO PARALLAX
========================================= */

const heroOrbit =
    document.querySelector(".hero-orbit");


if (heroOrbit && window.innerWidth > 800) {

    window.addEventListener("mousemove", (event) => {

        const x =
            (event.clientX / window.innerWidth - 0.5) * 10;

        const y =
            (event.clientY / window.innerHeight - 0.5) * 10;


        heroOrbit.style.transform =
            `translate(${x}px, ${y}px)`;

    });

}


/* =========================================
   CURRENT YEAR
========================================= */

const yearElements =
    document.querySelectorAll(
        "[data-year]"
    );


yearElements.forEach((element) => {

    element.textContent =
        new Date().getFullYear();

});
