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
   CONTACT FORM
========================================= */

function submitDemo(event) {

    event.preventDefault();

    const form = event.target;

    const message = document.getElementById("form-msg");

    if (!message) {
        return false;
    }

    message.textContent =
        "Thanks — your request has been received. We'll be in touch.";

    message.style.marginTop = "15px";

    form.reset();

    return false;
}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".product-card, .feature-grid > div, .steps > div, .flow, .dark-band"
);


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                revealObserver.unobserve(entry.target);

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


/* =========================================
   SIMPLE HERO PARALLAX
========================================= */

const heroOrbit = document.querySelector(".hero-orbit");

if (heroOrbit) {

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
    document.querySelectorAll("[data-year]");

yearElements.forEach((element) => {

    element.textContent =
        new Date().getFullYear();

});
