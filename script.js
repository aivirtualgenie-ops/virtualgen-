import * as THREE from "three";

/* =========================================================
   VIRTUAL GENIE AI
   3D SCROLL TUNNEL
   ---------------------------------------------------------
   - Procedural 3D tunnel
   - Scroll = camera travel
   - Floating AI task interfaces
   - Animated lights
   - Mobile optimized
   - Touch compatible
   - No GLB / Blender required
========================================================= */


/* =========================================================
   SETUP
========================================================= */

const world = document.getElementById("world");
const loading = document.getElementById("loading");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x020304);

scene.fog = new THREE.FogExp2(
    0x020304,
    0.018
);


const camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / window.innerHeight,
    0.1,
    250
);

camera.position.set(0, 0, 8);


const renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    alpha: false,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

world.appendChild(renderer.domElement);


/* =========================================================
   QUALITY
========================================================= */

const isMobile = window.innerWidth <= 800;

const quality = {
    rings: isMobile ? 90 : 150,
    ringSegments: isMobile ? 10 : 16,
    stars: isMobile ? 250 : 550,
    panels: isMobile ? 8 : 12
};


/* =========================================================
   LIGHTING
========================================================= */

const ambient = new THREE.AmbientLight(
    0x31506a,
    0.45
);

scene.add(ambient);


const blueLight = new THREE.PointLight(
    0x168cff,
    7,
    35
);

blueLight.position.set(
    0,
    0,
    -10
);

scene.add(blueLight);


const cyanLight = new THREE.PointLight(
    0x00d9ff,
    5,
    30
);

cyanLight.position.set(
    -8,
    3,
    -25
);

scene.add(cyanLight);


const orangeLight = new THREE.PointLight(
    0xff7a18,
    4,
    28
);

orangeLight.position.set(
    8,
    -4,
    -40
);

scene.add(orangeLight);


/* =========================================================
   TUNNEL
========================================================= */

const tunnel = new THREE.Group();

scene.add(tunnel);

const tunnelLength = 180;
const tunnelRadius = 8;


/* Tunnel ring material */

const ringMaterial = new THREE.LineBasicMaterial({
    color: 0x16364d,
    transparent: true,
    opacity: 0.55
});


/* Create rings */

for (
    let i = 0;
    i < quality.rings;
    i++
) {

    const z =
        -i *
        (tunnelLength / quality.rings);

    const ring = createTunnelRing(
        tunnelRadius,
        quality.ringSegments
    );

    ring.position.z = z;

    /*
        Slight organic variation so the tunnel
        doesn't look like a perfect tube.
    */

    ring.rotation.z =
        Math.sin(i * 0.27) * 0.035;

    ring.scale.x =
        1 +
        Math.sin(i * 0.17) * 0.025;

    ring.scale.y =
        1 +
        Math.cos(i * 0.21) * 0.025;

    tunnel.add(ring);
}


/* =========================================================
   TUNNEL FLOOR
========================================================= */

const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x071018,
    side: THREE.DoubleSide
});

const floorGeometry =
    new THREE.PlaneGeometry(
        18,
        tunnelLength
    );

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x = -Math.PI / 2;

floor.position.z =
    -tunnelLength / 2;

tunnel.add(floor);


/* =========================================================
   TUNNEL CEILING / SIDE STRUCTURE
========================================================= */

const structuralMaterial =
    new THREE.LineBasicMaterial({
        color: 0x0c2638,
        transparent: true,
        opacity: 0.8
    });


function createStructuralLine(
    x,
    y,
    rotationZ = 0
) {

    const points = [
        new THREE.Vector3(
            x,
            y,
            0
        ),

        new THREE.Vector3(
            x * 0.85,
            y * 0.85,
            -tunnelLength
        )
    ];

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const line =
        new THREE.Line(
            geometry,
            structuralMaterial
        );

    line.rotation.z = rotationZ;

    tunnel.add(line);
}


createStructuralLine(7, 5);
createStructuralLine(-7, 5);
createStructuralLine(7, -5);
createStructuralLine(-7, -5);


/* =========================================================
   TUNNEL RING FUNCTION
========================================================= */

function createTunnelRing(
    radius,
    segments
) {

    const points = [];

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            (i / segments) *
            Math.PI *
            2;

        const x =
            Math.cos(angle) *
            radius;

        const y =
            Math.sin(angle) *
            radius;

        points.push(
            new THREE.Vector3(
                x,
                y,
                0
            )
        );
    }

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    return new THREE.Line(
        geometry,
        ringMaterial
    );
}


/* =========================================================
   LIGHT STRIPS
========================================================= */

const lightGroup =
    new THREE.Group();

scene.add(lightGroup);


const lightMaterials = [
    new THREE.MeshBasicMaterial({
        color: 0x168cff
    }),

    new THREE.MeshBasicMaterial({
        color: 0x00d9ff
    }),

    new THREE.MeshBasicMaterial({
        color: 0xff7a18
    }),

    new THREE.MeshBasicMaterial({
        color: 0x9b5cff
    })
];


for (
    let i = 0;
    i < (isMobile ? 30 : 60);
    i++
) {

    const length =
        0.5 +
        Math.random() * 2.2;

    const geometry =
        new THREE.BoxGeometry(
            0.025,
            0.025,
            length
        );

    const material =
        lightMaterials[
            i %
            lightMaterials.length
        ];

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    const angle =
        Math.random() *
        Math.PI *
        2;

    const radius =
        5.8 +
        Math.random() *
        1.5;

    mesh.position.x =
        Math.cos(angle) *
        radius;

    mesh.position.y =
        Math.sin(angle) *
        radius;

    mesh.position.z =
        -Math.random() *
        tunnelLength;

    mesh.rotation.z =
        angle;

    lightGroup.add(mesh);
}


/* =========================================================
   PARTICLES / DATA
========================================================= */

const particleGeometry =
    new THREE.BufferGeometry();

const particlePositions =
    new Float32Array(
        quality.stars * 3
    );

for (
    let i = 0;
    i < quality.stars;
    i++
) {

    const i3 = i * 3;

    const angle =
        Math.random() *
        Math.PI *
        2;

    const radius =
        2 +
        Math.random() * 9;

    particlePositions[i3] =
        Math.cos(angle) *
        radius;

    particlePositions[i3 + 1] =
        Math.sin(angle) *
        radius;

    particlePositions[i3 + 2] =
        -Math.random() *
        tunnelLength;
}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        particlePositions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x75bfff,
        size: isMobile ? 0.035 : 0.05,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =========================================================
   AI PANELS
========================================================= */

const panels =
    new THREE.Group();

scene.add(panels);


const panelData = [

    {
        title: "INCOMING CALL",
        text: "+1 (512) 555-0198",
        accent: 0x168cff
    },

    {
        title: "AI RECEPTIONIST",
        text: "CALL QUALIFIED",
        accent: 0x00d9ff
    },

    {
        title: "APPOINTMENT",
        text: "BOOKED • 2:00 PM",
        accent: 0x9b5cff
    },

    {
        title: "CRM UPDATE",
        text: "NEW LEAD • $12,500",
        accent: 0xff7a18
    },

    {
        title: "AUTOMATION",
        text: "WORKFLOW ACTIVE",
        accent: 0x00d9ff
    },

    {
        title: "FOLLOW-UP",
        text: "EMAIL SENT",
        accent: 0x168cff
    },

    {
        title: "ANALYTICS",
        text: "REVENUE +18.4%",
        accent: 0x9b5cff
    },

    {
        title: "BUSINESS OS",
        text: "SYSTEM CONNECTED",
        accent: 0xff7a18
    },

    {
        title: "LEAD SCORE",
        text: "QUALIFICATION 92%",
        accent: 0x00d9ff
    },

    {
        title: "TASK COMPLETE",
        text: "ACTION EXECUTED",
        accent: 0x168cff
    },

    {
        title: "DATA SYNC",
        text: "CRM UPDATED",
        accent: 0x9b5cff
    },

    {
        title: "WORKFLOW",
        text: "RUNNING AUTOMATICALLY",
        accent: 0xff7a18
    }

];


function createPanel(
    data,
    index
) {

    const group =
        new THREE.Group();

    const width = 3.8;
    const height = 2.1;

    /*
        Border
    */

    const borderPoints = [
        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        )
    ];

    const borderGeometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                borderPoints
            );

    const borderMaterial =
        new THREE.LineBasicMaterial({
            color: data.accent,
            transparent: true,
            opacity: 0.8
        });

    const border =
        new THREE.Line(
            borderGeometry,
            borderMaterial
        );

    group.add(border);


    /*
        Center data lines
    */

    const lineMaterial =
        new THREE.LineBasicMaterial({
            color: data.accent,
            transparent: true,
            opacity: 0.35
        });


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const lineWidth =
            1 +
            Math.random() *
            1.6;

        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints([

                    new THREE.Vector3(
                        -1.25,
                        0.15 -
                        i * 0.3,
                        0.01
                    ),

                    new THREE.Vector3(
                        -1.25 +
                        lineWidth,
                        0.15 -
                        i * 0.3,
                        0.01
                    )

                ]);

        const line =
            new THREE.Line(
                geometry,
                lineMaterial
            );

        group.add(line);
    }


    /*
        Small status indicator
    */

    const dotGeometry =
        new THREE.CircleGeometry(
            0.07,
            12
        );

    const dotMaterial =
        new THREE.MeshBasicMaterial({
            color: data.accent
        });

    const dot =
        new THREE.Mesh(
            dotGeometry,
            dotMaterial
        );

    dot.position.set(
        -1.55,
        0.72,
        0.02
    );

    group.add(dot);


    /*
        Position around tunnel
    */

    const angle =
        (index / panelData.length) *
        Math.PI *
        2;

    const radius = 5.1;

    group.position.set(
        Math.cos(angle) *
        radius,

        Math.sin(angle) *
        radius,

        -12 -
        index * 13
    );


    /*
        Face the camera
    */

    group.lookAt(
        new THREE.Vector3(
            0,
            0,
            group.position.z
        )
    );


    group.userData = {
        baseX: group.position.x,
        baseY: group.position.y,
        baseZ: group.position.z,
        phase: Math.random() * Math.PI * 2,
        speed:
            0.4 +
            Math.random() * 0.4
    };


    panels.add(group);
}


panelData.forEach(
    (data, index) => {
        createPanel(
            data,
            index
        );
    }
);


/* =========================================================
   CENTRAL ENERGY CORE
========================================================= */

const coreGroup =
    new THREE.Group();

coreGroup.position.z =
    -55;

scene.add(coreGroup);


const coreGeometry =
    new THREE.IcosahedronGeometry(
        1.2,
        2
    );


const coreMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x168cff,
        wireframe: true,
        transparent: true,
        opacity: 0.85
    });


const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

coreGroup.add(core);


/* Outer rings */

for (
    let i = 0;
    i < 3;
    i++
) {

    const geometry =
        new THREE.TorusGeometry(
            1.8 + i * 0.55,
            0.015,
            8,
            48
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                i === 1
                    ? 0xff7a18
                    : 0x168cff,
            transparent: true,
            opacity: 0.7
        });

    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.userData.speed =
        0.3 +
        i * 0.15;

    coreGroup.add(ring);
}


/* =========================================================
   SCROLL STATE
========================================================= */

let targetScroll = 0;
let currentScroll = 0;

let lastScroll = 0;
let scrollVelocity = 0;


/*
    We don't use scrollY directly for camera
    movement. Instead we smooth it.
*/

function updateScroll() {

    const maxScroll =
        document.documentElement
            .scrollHeight -
        window.innerHeight;

    if (maxScroll <= 0) {
        targetScroll = 0;
        return;
    }

    targetScroll =
        window.scrollY /
        maxScroll;

    scrollVelocity =
        targetScroll -
        lastScroll;

    lastScroll =
        targetScroll;
}

window.addEventListener(
    "scroll",
    updateScroll,
    {
        passive: true
    }
);


/* =========================================================
   CAMERA JOURNEY
========================================================= */

function updateCamera(time) {

    /*
        Smooth scrolling
    */

    currentScroll +=
        (
            targetScroll -
            currentScroll
        ) *
        0.075;


    /*
        Main tunnel travel

        Start around Z = 7
        Finish around Z = -105
    */

    const tunnelTravel =
        THREE.MathUtils.lerp(
            7,
            -105,
            currentScroll
        );


    camera.position.z =
        tunnelTravel;


    /*
        Slight organic camera movement
    */

    const sway =
        Math.sin(
            time * 0.00035
        ) * 0.12;

    const swayY =
        Math.cos(
            time * 0.00028
        ) * 0.08;


    camera.position.x +=
        (
            sway -
            camera.position.x
        ) * 0.025;


    camera.position.y +=
        (
            swayY -
            camera.position.y
        ) * 0.025;


    /*
        Scroll gives the camera a tiny tilt.
    */

    camera.rotation.z =
        THREE.MathUtils.lerp(
            camera.rotation.z,
            scrollVelocity * -1.8,
            0.06
        );


    camera.rotation.x =
        THREE.MathUtils.lerp(
            camera.rotation.x,
            scrollVelocity * 0.5,
            0.06
        );
}


/* =========================================================
   SECTION DEPTH
========================================================= */

function updateSections() {

    const sections =
        document.querySelectorAll(
            ".tunnel-section"
        );

    sections.forEach(
        (section, index) => {

            const rect =
                section.getBoundingClientRect();

            /*
                Don't interfere with actual page layout.

                Instead use visibility to slightly
                change opacity based on distance.
            */

            const center =
                rect.top +
                rect.height / 2;

            const distance =
                Math.abs(
                    center -
                    window.innerHeight / 2
                );

            const opacity =
                THREE.MathUtils.clamp(
                    1 -
                    distance /
                    window.innerHeight *
                    0.7,

                    0.35,
                    1
                );

            const copy =
                section.querySelector(
                    ".section-copy"
                );

            if (copy) {

                copy.style.opacity =
                    opacity.toFixed(2);

                copy.style.transform =
                    `translateY(${
                        Math.min(
                            distance * 0.03,
                            35
                        )
                    }px)`;

            }

        }
    );
}


/* =========================================================
   ANIMATE PANELS
========================================================= */

function animatePanels(time) {

    panels.children.forEach(
        (panel) => {

            const data =
                panel.userData;

            const float =
                Math.sin(
                    time * 0.001 *
                    data.speed +
                    data.phase
                );


            panel.position.x =
                data.baseX +
                float * 0.12;


            panel.position.y =
                data.baseY +
                Math.cos(
                    time * 0.0008 *
                    data.speed +
                    data.phase
                ) * 0.12;


            /*
                Gentle rotation makes them
                feel suspended in space.
            */

            panel.rotation.z =
                float * 0.015;

        }
    );
}


/* =========================================================
   ANIMATE LIGHTS
========================================================= */

function animateLights(time) {

    lightGroup.children.forEach(
        (light, index) => {

            const pulse =
                0.8 +
                Math.sin(
                    time * 0.002 +
                    index
                ) * 0.2;

            light.scale.x =
                pulse;

        }
    );


    /*
        Move point lights slowly.
    */

    blueLight.position.x =
        Math.sin(
            time * 0.0005
        ) * 4;

    blueLight.position.y =
        Math.cos(
            time * 0.0004
        ) * 3;


    cyanLight.position.x =
        Math.cos(
            time * 0.00035
        ) * 7;


    orangeLight.position.y =
        Math.sin(
            time * 0.00045
        ) * 5;
}


/* =========================================================
   ANIMATE CORE
========================================================= */

function animateCore(time) {

    core.rotation.x =
        time * 0.00035;

    core.rotation.y =
        time * 0.0005;


    coreGroup.children
        .forEach(
            (child, index) => {

                if (
                    child.geometry &&
                    child.geometry.type ===
                    "TorusGeometry"
                ) {

                    child.rotation.z =
                        time *
                        0.00025 *
                        (index + 1);

                    child.rotation.y =
                        time *
                        0.00015 *
                        (index + 1);

                }

            }
        );


    /*
        Core pulses when user is scrolling.
    */

    const pulse =
        1 +
        Math.min(
            Math.abs(
                scrollVelocity
            ) * 15,
            0.35
        );

    core.scale.setScalar(
        THREE.MathUtils.lerp(
            core.scale.x,
            pulse,
            0.08
        )
    );
}


/* =========================================================
   MOBILE PARALLAX
========================================================= */

let pointerX = 0;
let pointerY = 0;

window.addEventListener(
    "pointermove",
    (event) => {

        pointerX =
            (
                event.clientX /
                window.innerWidth -
                0.5
            );

        pointerY =
            (
                event.clientY /
                window.innerHeight -
                0.5
            );

    },
    {
        passive: true
    }
);


function updateParallax() {

    /*
        Very subtle so it doesn't fight
        the scroll-controlled camera.
    */

    const targetX =
        pointerX * 0.25;

    const targetY =
        pointerY * 0.18;

    camera.position.x +=
        (
            targetX -
            camera.position.x
        ) * 0.01;

    camera.position.y +=
        (
            targetY -
            camera.position.y
        ) * 0.01;
}


/* =========================================================
   MENU
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
                mobileMenu.classList
                    .toggle("open");

            menuButton.classList
                .toggle("active", open);

            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );

            document.body.classList
                .toggle(
                    "menu-open",
                    open
                );

        }
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu
                            .classList
                            .remove("open");

                        menuButton
                            .classList
                            .remove(
                                "active"
                            );

                        menuButton
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        document.body
                            .classList
                            .remove(
                                "menu-open"
                            );

                    }
                );

            }
        );
}


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

setTimeout(
    () => {

        if (loading) {
            loading.classList.add(
                "hidden"
            );
        }

    },
    800
);


/* =========================================================
   RENDER LOOP
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );

    const time =
        performance.now();


    updateCamera(time);

    updateParallax();

    animatePanels(time);

    animateLights(time);

    animateCore(time);

    updateSections();


    /*
        Very subtle tunnel rotation.
        Camera remains the primary motion.
    */

    tunnel.rotation.z =
        Math.sin(
            time * 0.00008
        ) * 0.006;


    /*
        Particles drift very slowly.
    */

    particles.rotation.z =
        time * 0.000015;


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   INITIAL STATE
========================================================= */

updateScroll();

console.log(
    "Virtual Genie AI — 3D tunnel initialized."
);
/* =========================================================
   PRODUCT JOURNEY TRANSITIONS
   ========================================================= */

const productRoutes = {
    receptionist: "ai-receptionist.html",
    automation: "ai-automations.html",
    os: "business-os.html"
};


/* =========================================================
   TRANSITION OVERLAY
========================================================= */

const transitionStyle = document.createElement("style");

transitionStyle.textContent = `
    #vg-transition {
        position: fixed;
        inset: 0;
        z-index: 9999;

        display: flex;
        align-items: center;
        justify-content: center;

        background: #020304;

        opacity: 0;
        visibility: hidden;

        pointer-events: none;

        transition:
            opacity .35s ease,
            visibility .35s ease;
    }

    #vg-transition.active {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
    }

    .vg-transition-inner {
        width: min(430px, 82vw);

        text-align: center;

        color: #f1f0eb;
    }

    .vg-transition-label {
        margin-bottom: 34px;

        color: #777;

        font-family: "DM Sans", sans-serif;

        font-size: 9px;

        letter-spacing: .28em;
    }

    .vg-phone {
        position: relative;

        width: 92px;
        height: 92px;

        margin: 0 auto 35px;

        display: grid;
        place-items: center;

        border: 1px solid rgba(201,255,53,.55);

        border-radius: 50%;

        color: #c9ff35;

        font-size: 35px;

        box-shadow:
            0 0 0 0 rgba(201,255,53,.3);

        animation:
            vg-ring 1.25s infinite;
    }

    .vg-phone::before,
    .vg-phone::after {
        content: "";

        position: absolute;

        inset: -14px;

        border: 1px solid rgba(201,255,53,.18);

        border-radius: 50%;

        animation:
            vg-wave 1.7s infinite;
    }

    .vg-phone::after {
        inset: -30px;

        animation-delay: .45s;
    }

    @keyframes vg-ring {

        0% {
            transform: rotate(0deg) scale(1);
        }

        8% {
            transform: rotate(-12deg) scale(1.05);
        }

        16% {
            transform: rotate(12deg) scale(1.05);
        }

        24% {
            transform: rotate(-9deg) scale(1.03);
        }

        32% {
            transform: rotate(9deg) scale(1.03);
        }

        40% {
            transform: rotate(0deg) scale(1);
        }

        100% {
            transform: rotate(0deg) scale(1);
        }

    }

    @keyframes vg-wave {

        0% {
            transform: scale(.65);
            opacity: .8;
        }

        100% {
            transform: scale(1.35);
            opacity: 0;
        }

    }

    .vg-transition-title {
        font-family: "DM Sans", sans-serif;

        font-size: clamp(
            28px,
            6vw,
            44px
        );

        font-weight: 500;

        letter-spacing: -.04em;
    }

    .vg-transition-status {
        margin-top: 15px;

        color: #777;

        font-size: 12px;

        line-height: 1.6;
    }

    .vg-progress {
        width: 100%;
        height: 1px;

        margin-top: 35px;

        background: rgba(255,255,255,.12);

        overflow: hidden;
    }

    .vg-progress span {
        display: block;

        width: 0%;
        height: 100%;

        background: #c9ff35;

        animation:
            vg-progress 1.65s
            cubic-bezier(.65,0,.35,1)
            forwards;
    }

    @keyframes vg-progress {

        from {
            width: 0%;
        }

        to {
            width: 100%;
        }

    }

    .vg-transition-system {
        display: none;
    }

    .vg-transition.system .vg-phone {
        display: none;
    }

    .vg-transition.system .vg-transition-system {
        display: block;
    }

    .vg-system-core {
        width: 90px;
        height: 90px;

        margin: 0 auto 35px;

        border: 1px solid rgba(22,140,255,.7);

        border-radius: 50%;

        position: relative;

        animation:
            vg-core 2s linear infinite;
    }

    .vg-system-core::before,
    .vg-system-core::after {
        content: "";

        position: absolute;

        inset: 15px;

        border:
            1px solid
            rgba(22,140,255,.45);

        border-radius: 50%;
    }

    .vg-system-core::after {
        inset: 30px;

        background: #168cff;

        box-shadow:
            0 0 25px
            rgba(22,140,255,.8);
    }

    @keyframes vg-core {

        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }

    }

    @media (max-width: 800px) {

        .vg-phone {
            width: 78px;
            height: 78px;
        }

        .vg-transition-title {
            font-size: 32px;
        }

    }

    @media (prefers-reduced-motion: reduce) {

        .vg-phone,
        .vg-phone::before,
        .vg-phone::after,
        .vg-system-core,
        .vg-progress span {
            animation: none;
        }

        .vg-progress span {
            width: 100%;
        }

    }
`;

document.head.appendChild(
    transitionStyle
);


/* =========================================================
   CREATE TRANSITION DOM
========================================================= */

const transition =
    document.createElement("div");

transition.id =
    "vg-transition";

transition.innerHTML = `

    <div class="vg-transition-inner">

        <div class="vg-phone">
            ☎
        </div>

        <div class="vg-transition-system">
            <div class="vg-system-core"></div>
        </div>

        <div class="vg-transition-label">
            VIRTUAL GENIE AI
        </div>

        <div class="vg-transition-title">
            Connecting your system.
        </div>

        <div class="vg-transition-status">
            Initializing intelligent workflow...
        </div>

        <div class="vg-progress">
            <span></span>
        </div>

    </div>

`;

document.body.appendChild(
    transition
);


/* =========================================================
   START PRODUCT TRANSITION
========================================================= */

function openProduct(
    product,
    event
) {

    if (event) {
        event.preventDefault();
    }

    const destination =
        productRoutes[product];

    if (!destination) {
        return;
    }


    /*
        Different visual language
        for different products.
    */

    const title =
        transition.querySelector(
            ".vg-transition-title"
        );

    const status =
        transition.querySelector(
            ".vg-transition-status"
        );


    transition.classList.remove(
        "system"
    );


    if (product === "receptionist") {

        title.textContent =
            "Your AI receptionist is calling.";

        status.textContent =
            "Connecting voice intelligence...";

    }


    if (product === "automation") {

        transition.classList.add(
            "system"
        );

        title.textContent =
            "Activating automation.";

        status.textContent =
            "Connecting workflows and business systems...";

    }


    if (product === "os") {

        transition.classList.add(
            "system"
        );

        title.textContent =
            "Booting your Business OS.";

        status.textContent =
            "Connecting your intelligent operating layer...";

    }


    /*
        Restart progress animation.
    */

    const progress =
        transition.querySelector(
            ".vg-progress span"
        );

    progress.style.animation =
        "none";

    void progress.offsetWidth;

    progress.style.animation =
        "";


    /*
        Stop background scrolling.
    */

    document.body.style.overflow =
        "hidden";


    /*
        Show transition.
    */

    transition.classList.add(
        "active"
    );


    /*
        Navigate after animation.
    */

    setTimeout(
        () => {

            window.location.href =
                destination;

        },
        1750
    );
}


/* =========================================================
   NAVIGATION HOOKS
========================================================= */


/*
    Header navigation
*/

document
    .querySelectorAll(
        'nav a[href="#receptionist"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "receptionist",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        'nav a[href="#automation"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "automation",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        'nav a[href="#os"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "os",
                        event
                    );

                }
            );

        }
    );


/* =========================================================
   MOBILE MENU LINKS
========================================================= */

document
    .querySelectorAll(
        '.mobile-menu a[href="#receptionist"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "receptionist",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        '.mobile-menu a[href="#automation"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "automation",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        '.mobile-menu a[href="#os"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "os",
                        event
                    );

                }
            );

        }
    );


/* =========================================================
   HERO / SECTION CTA LINKS
========================================================= */

document
    .querySelectorAll(
        'a[href="#receptionist"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "receptionist",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        'a[href="#automation"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "automation",
                        event
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        'a[href="#os"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    openProduct(
                        "os",
                        event
                    );

                }
            );

        }
    );


console.log(
    "Virtual Genie AI — product journeys enabled."
);
