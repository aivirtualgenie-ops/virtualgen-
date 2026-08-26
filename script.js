import * as THREE from "three";


/* =========================================================
   INITIALIZE
========================================================= */

const world =
    document.getElementById("world");


if (!world) {

    throw new Error(
        "Virtual Genie: #world not found."
    );

}


/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x020304
    );

scene.fog =
    new THREE.FogExp2(
        0x020304,
        0.012
    );


const camera =
    new THREE.PerspectiveCamera(
        58,
        window.innerWidth /
        window.innerHeight,
        .1,
        300
    );


camera.position.set(
    0,
    0,
    10
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        antialias:
            window.devicePixelRatio < 2,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.5
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


world.appendChild(
    renderer.domElement
);


/* =========================================================
   QUALITY
========================================================= */

const mobile =
    window.innerWidth <= 800;

const RINGS =
    mobile ? 80 : 145;

const PARTICLES =
    mobile ? 300 : 800;


/* =========================================================
   LIGHTS
========================================================= */

scene.add(
    new THREE.AmbientLight(
        0x25394b,
        .55
    )
);


const blueLight =
    new THREE.PointLight(
        0x168cff,
        8,
        45
    );

const cyanLight =
    new THREE.PointLight(
        0x00d9ff,
        7,
        40
    );

const orangeLight =
    new THREE.PointLight(
        0xff6418,
        6,
        35
    );


scene.add(
    blueLight,
    cyanLight,
    orangeLight
);


/* =========================================================
   WORLD GROUP
========================================================= */

const tunnel =
    new THREE.Group();

scene.add(
    tunnel
);


/* =========================================================
   TUNNEL
========================================================= */

const tunnelLength =
    230;

const tunnelRadius =
    8.5;


const ringMaterial =
    new THREE.LineBasicMaterial({

        color:
            0x17405a,

        transparent:
            true,

        opacity:
            .72

    });


function createRing() {

    const points = [];

    const segments =
        mobile
            ? 14
            : 22;


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            i /
            segments *
            Math.PI *
            2;


        points.push(

            new THREE.Vector3(

                Math.cos(angle) *
                tunnelRadius,

                Math.sin(angle) *
                tunnelRadius,

                0

            )

        );

    }


    return new THREE.Line(

        new THREE.BufferGeometry()
            .setFromPoints(
                points
            ),

        ringMaterial

    );

}


for (
    let i = 0;
    i < RINGS;
    i++
) {

    const ring =
        createRing();


    ring.position.z =
        -(
            i *
            tunnelLength /
            RINGS
        );


    ring.rotation.z =
        Math.sin(
            i * .2
        ) *
        .035;


    ring.scale.x =
        1 +
        Math.sin(
            i * .13
        ) *
        .025;


    ring.scale.y =
        1 +
        Math.cos(
            i * .17
        ) *
        .025;


    tunnel.add(
        ring
    );

}


/* =========================================================
   TUNNEL SPINES
========================================================= */

const spineMaterial =
    new THREE.LineBasicMaterial({

        color:
            0x0b3046,

        transparent:
            true,

        opacity:
            .8

    });


[
    [7.2,5.2],
    [-7.2,5.2],
    [7.2,-5.2],
    [-7.2,-5.2]

].forEach(
    ([x,y]) => {

        tunnel.add(

            new THREE.Line(

                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            x,
                            y,
                            8
                        ),

                        new THREE.Vector3(
                            x * .82,
                            y * .82,
                            -tunnelLength
                        )

                    ]),

                spineMaterial

            )

        );

    }
);


/* =========================================================
   LIGHT STREAKS
========================================================= */

const streakGroup =
    new THREE.Group();

scene.add(
    streakGroup
);


const streakColors = [

    0x168cff,
    0x00d9ff,
    0xff6418,
    0x9b5cff,
    0xc9ff35

];


const streakCount =
    mobile ? 40 : 100;


for (
    let i = 0;
    i < streakCount;
    i++
) {

    const mesh =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                .025,
                .025,
                .5 +
                Math.random() * 3
            ),

            new THREE.MeshBasicMaterial({

                color:
                    streakColors[
                        i %
                        streakColors.length
                    ],

                transparent:
                    true,

                opacity:
                    .2 +
                    Math.random() * .55

            })

        );


    const angle =
        Math.random() *
        Math.PI *
        2;


    const radius =
        4.5 +
        Math.random() *
        4;


    mesh.position.set(

        Math.cos(angle) *
        radius,

        Math.sin(angle) *
        radius,

        -Math.random() *
        tunnelLength

    );


    mesh.rotation.z =
        angle;


    mesh.userData.speed =
        .025 +
        Math.random() *
        .08;


    streakGroup.add(
        mesh
    );

}


/* =========================================================
   PARTICLES
========================================================= */

const particlePositions =
    new Float32Array(
        PARTICLES * 3
    );


const particleSpeeds =
    new Float32Array(
        PARTICLES
    );


for (
    let i = 0;
    i < PARTICLES;
    i++
) {

    const n =
        i * 3;


    const angle =
        Math.random() *
        Math.PI *
        2;


    const radius =
        1.5 +
        Math.random() *
        9;


    particlePositions[n] =
        Math.cos(angle) *
        radius;


    particlePositions[n + 1] =
        Math.sin(angle) *
        radius;


    particlePositions[n + 2] =
        -Math.random() *
        tunnelLength;


    particleSpeeds[i] =
        .015 +
        Math.random() *
        .08;

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


const particles =
    new THREE.Points(

        particleGeometry,

        new THREE.PointsMaterial({

            color:
                0x65bfff,

            size:
                mobile
                    ? .035
                    : .045,

            transparent:
                true,

            opacity:
                .62,

            depthWrite:
                false

        })

    );


scene.add(
    particles
);


/* =========================================================
   PRODUCT WORLDS
========================================================= */

const productWorld =
    new THREE.Group();

scene.add(
    productWorld
);


const worlds = [

    {
        z:-48,
        color:0x168cff
    },

    {
        z:-112,
        color:0x9b5cff
    },

    {
        z:-176,
        color:0xc9ff35
    }

];


function buildWorld(
    data
) {

    const group =
        new THREE.Group();


    /*
       Central AI core
    */

    const core =
        new THREE.Mesh(

            new THREE.IcosahedronGeometry(
                1.15,
                1
            ),

            new THREE.MeshBasicMaterial({

                color:
                    data.color,

                wireframe:
                    true,

                transparent:
                    true,

                opacity:
                    .9

            })

        );


    group.add(
        core
    );


    /*
       Orbiting rings
    */

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const orbit =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    1.8 +
                    i * .65,
                    .012,
                    8,
                    80
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        data.color,

                    transparent:
                        true,

                    opacity:
                        .4

                })

            );


        orbit.rotation.x =
            Math.PI /
            2 +
            i * .35;


        orbit.rotation.y =
            i * .7;


        orbit.userData.speed =
            .001 +
            i * .0008;


        group.add(
            orbit
        );

    }


    /*
       Intelligence nodes
    */

    const geometry =
        new THREE.SphereGeometry(
            .12,
            10,
            10
        );


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const angle =
            i /
            10 *
            Math.PI *
            2;


        const radius =
            3.2 +
            Math.sin(i) *
            .4;


        const node =
            new THREE.Mesh(

                geometry,

                new THREE.MeshBasicMaterial({

                    color:
                        data.color

                })

            );


        node.position.set(

            Math.cos(angle) *
            radius,

            Math.sin(angle) *
            radius,

            Math.sin(i * 2) *
            .7

        );


        group.add(
            node
        );

    }


    group.position.z =
        data.z;


    group.userData.phase =
        Math.random() *
        Math.PI *
        2;


    productWorld.add(
        group
    );

}


worlds.forEach(
    buildWorld
);


/* =========================================================
   SCROLL
========================================================= */

let targetScroll =
    0;

let smoothScroll =
    0;

let previousScroll =
    window.scrollY;

let scrollVelocity =
    0;


function readScroll() {

    const max =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    targetScroll =
        max <= 0
            ? 0
            : window.scrollY / max;


    scrollVelocity =
        window.scrollY -
        previousScroll;


    previousScroll =
        window.scrollY;

}


window.addEventListener(
    "scroll",
    readScroll,
    {
        passive:true
    }
);


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(
    time
) {

    smoothScroll +=
        (
            targetScroll -
            smoothScroll
        ) *
        .055;


    const targetZ =
        10 -
        smoothScroll *
        205;


    const swayX =
        Math.sin(
            time * .00025
        ) *
        .16;


    const swayY =
        Math.cos(
            time * .0002
        ) *
        .11;


    camera.position.z +=
        (
            targetZ -
            camera.position.z
        ) *
        .06;


    camera.position.x +=
        (
            swayX -
            camera.position.x
        ) *
        .025;


    camera.position.y +=
        (
            swayY -
            camera.position.y
        ) *
        .025;


    const targetRotation =
        THREE.MathUtils.clamp(
            -scrollVelocity *
            .0008,
            -.045,
            .045
        );


    camera.rotation.z +=
        (
            targetRotation -
            camera.rotation.z
        ) *
        .08;

}


/* =========================================================
   POINTER
========================================================= */

let pointerX =
    0;

let pointerY =
    0;


window.addEventListener(
    "pointermove",
    event => {

        pointerX =
            event.clientX /
            window.innerWidth -
            .5;


        pointerY =
            event.clientY /
            window.innerHeight -
            .5;

    },
    {
        passive:true
    }
);


function updatePointer() {

    if (mobile) {
        return;
    }


    const x =
        pointerX * .35;

    const y =
        pointerY * .2;


    camera.position.x +=
        (
            x -
            camera.position.x
        ) *
        .008;


    camera.position.y +=
        (
            y -
            camera.position.y
        ) *
        .008;

}


/* =========================================================
   ANIMATE TUNNEL
========================================================= */

function animateTunnel() {

    tunnel.rotation.z =
        Math.sin(
            performance.now() *
            .00008
        ) *
        .008;


    /*
       Light streaks.
    */

    streakGroup.children.forEach(
        streak => {

            streak.position.z +=
                streak.userData.speed;


            if (
                streak.position.z >
                10
            ) {

                streak.position.z =
                    -tunnelLength;

            }

        }
    );


    /*
       Particles.
    */

    const positions =
        particleGeometry
            .attributes
            .position;


    for (
        let i = 0;
        i < PARTICLES;
        i++
    ) {

        let z =
            positions.getZ(i);


        z +=
            particleSpeeds[i];


        if (
            z > 10
        ) {

            z =
                -tunnelLength;

        }


        positions.setZ(
            i,
            z
        );

    }


    positions.needsUpdate =
        true;

}


/* =========================================================
   PRODUCT WORLD ANIMATION
========================================================= */

function animateProducts(
    time
) {

    productWorld.children.forEach(
        group => {

            const phase =
                group.userData.phase;


            group.rotation.y =
                time *
                .00025;


            group.rotation.x =
                Math.sin(
                    time *
                    .0004 +
                    phase
                ) *
                .08;


            group.position.y =
                Math.sin(
                    time *
                    .0007 +
                    phase
                ) *
                .15;


            group.children.forEach(
                child => {

                    if (
                        child.userData
                        .speed
                    ) {

                        child.rotation.z +=
                            child.userData.speed;

                    }

                }
            );

        }
    );

}


/* =========================================================
   LIGHT ANIMATION
========================================================= */

function animateLights(
    time
) {

    blueLight.position.x =
        Math.sin(
            time *
            .00045
        ) *
        6;


    blueLight.position.y =
        Math.cos(
            time *
            .00035
        ) *
        4;


    cyanLight.position.x =
        Math.cos(
            time *
            .00032
        ) *
        8;


    cyanLight.position.z =
        -30 +
        Math.sin(
            time *
            .0004
        ) *
        20;


    orangeLight.position.y =
        Math.sin(
            time *
            .0005
        ) *
        6;


    orangeLight.position.z =
        -80 +
        Math.cos(
            time *
            .0003
        ) *
        30;

}


/* =========================================================
   SECTION WORLDS
========================================================= */

const sectionElements =
    document.querySelectorAll(
        ".tunnel-section[data-world]"
    );


let activeWorld =
    "";


function updateSectionWorld() {

    const center =
        window.innerHeight *
        .5;


    let closest =
        null;


    let distance =
        Infinity;


    sectionElements.forEach(
        section => {

            const rect =
                section
                    .getBoundingClientRect();


            const sectionCenter =
                rect.top +
                rect.height / 2;


            const d =
                Math.abs(
                    sectionCenter -
                    center
                );


            if (
                d < distance
            ) {

                distance =
                    d;

                closest =
                    section;

            }

        }
    );


    if (!closest) {
        return;
    }


    const worldName =
        closest.dataset.world;


    if (
        worldName ===
        activeWorld
    ) {

        return;

    }


    activeWorld =
        worldName;


    document.body.dataset.world =
        worldName;


    const colors = {

        receptionist:
            0x168cff,

        automation:
            0x9b5cff,

        os:
            0xc9ff35

    };


    const color =
        colors[
            worldName
        ];


    if (color) {

        const target =
            new THREE.Color(
                color
            );


        ringMaterial.color.lerp(
            target,
            .35
        );

        blueLight.color.lerp(
            target,
            .35
        );

    }

}


window.addEventListener(
    "scroll",
    updateSectionWorld,
    {
        passive:true
    }
);


/* =========================================================
   SECTION REVEALS
========================================================= */

const sectionObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "active"
                            );

                    }

                }
            );

        },

        {
            threshold:
                .35
        }

    );


sectionElements.forEach(
    section =>
        sectionObserver.observe(
            section
        )
);


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (
    menuButton &&
    mobileMenu
) {

    menuButton.addEventListener(
        "click",
        () => {

            const open =
                mobileMenu
                    .classList
                    .toggle(
                        "open"
                    );


            menuButton
                .classList
                .toggle(
                    "active",
                    open
                );


            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    mobileMenu
        .querySelectorAll(
            "a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu
                            .classList
                            .remove(
                                "open"
                            );


                        menuButton
                            .classList
                            .remove(
                                "active"
                            );

                    }
                );

            }
        );

}


/* =========================================================
   PRODUCT TRANSITION
========================================================= */

const routes = {

    receptionist:
        "ai-receptionist.html",

    automation:
        "ai-automations.html",

    os:
        "business-os.html"

};


const transition =
    document.createElement(
        "div"
    );


transition.id =
    "vg-transition";


transition.innerHTML = `

    <div class="vg-transition-inner">

        <div class="vg-transition-core">

            <span></span>
            <span></span>
            <span></span>

        </div>

        <div class="vg-transition-label">
            VIRTUAL GENIE AI
        </div>

        <div class="vg-transition-title">
            Connecting system.
        </div>

        <div class="vg-transition-status">
            Initializing intelligence...
        </div>

        <div class="vg-progress">
            <span></span>
        </div>

    </div>

`;


document.body.appendChild(
    transition
);


function openProduct(
    product,
    event
) {

    const destination =
        routes[
            product
        ];


    if (!destination) {
        return;
    }


    event.preventDefault();


    const title =
        transition.querySelector(
            ".vg-transition-title"
        );


    const status =
        transition.querySelector(
            ".vg-transition-status"
        );


    if (
        product ===
        "receptionist"
    ) {

        title.textContent =
            "Connecting AI Receptionist.";

        status.textContent =
            "Initializing voice intelligence...";

    }


    if (
        product ===
        "automation"
    ) {

        title.textContent =
            "Activating AI Automations.";

        status.textContent =
            "Connecting intelligent workflows...";

    }


    if (
        product ===
        "os"
    ) {

        title.textContent =
            "Booting Business OS.";

        status.textContent =
            "Connecting your operating layer...";

    }


    transition.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            window.location.href =
                destination;

        },
        1550
    );

}


document
    .querySelectorAll(
        "a[data-product]"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        link.dataset.product,
                        event
                    );

                }
            );

        }
    );


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================================
   LOADING
========================================================= */

const loading =
    document.getElementById(
        "loading"
    );


setTimeout(
    () => {

        if (loading) {

            loading.classList.add(
                "hidden"
            );

        }

    },
    700
);


/* =========================================================
   LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        performance.now();


    updateCamera(
        time
    );

    updatePointer();

    animateTunnel();

    animateProducts(
        time
    );

    animateLights(
        time
    );


    renderer.render(
        scene,
        camera
    );

}


readScroll();

updateSectionWorld();

animate();
