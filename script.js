import * as THREE from "three";

/* =========================================================
   VIRTUAL GENIE AI
   MAIN 3D TUNNEL + PRODUCT ROUTING
========================================================= */

const world = document.getElementById("world");
const loading = document.getElementById("loading");

if (!world) {
    console.error("Virtual Genie: #world not found.");
}


/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x020304);

scene.fog =
    new THREE.FogExp2(
        0x020304,
        0.018
    );


const camera =
    new THREE.PerspectiveCamera(
        62,
        window.innerWidth /
        window.innerHeight,
        0.1,
        250
    );

camera.position.set(
    0,
    0,
    7
);


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
    mobile ? 75 : 130;

const PARTICLES =
    mobile ? 220 : 500;


/* =========================================================
   LIGHTING
========================================================= */

scene.add(
    new THREE.AmbientLight(
        0x31506a,
        0.45
    )
);


const blueLight =
    new THREE.PointLight(
        0x168cff,
        7,
        35
    );

scene.add(
    blueLight
);


const cyanLight =
    new THREE.PointLight(
        0x00d9ff,
        5,
        30
    );

scene.add(
    cyanLight
);


const orangeLight =
    new THREE.PointLight(
        0xff7a18,
        4,
        28
    );

scene.add(
    orangeLight
);


/* =========================================================
   TUNNEL
========================================================= */

const tunnel =
    new THREE.Group();

scene.add(
    tunnel
);

const tunnelLength = 180;
const tunnelRadius = 8;


const ringMaterial =
    new THREE.LineBasicMaterial({
        color: 0x16364d,
        transparent: true,
        opacity: 0.55
    });


function createRing(
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
            i /
            segments *
            Math.PI *
            2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) *
                radius,

                Math.sin(angle) *
                radius,

                0
            )
        );

    }

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );

    return new THREE.Line(
        geometry,
        ringMaterial
    );
}


for (
    let i = 0;
    i < RINGS;
    i++
) {

    const ring =
        createRing(
            tunnelRadius,
            mobile ? 10 : 16
        );

    ring.position.z =
        -i *
        tunnelLength /
        RINGS;

    ring.rotation.z =
        Math.sin(i * .27) *
        .035;

    ring.scale.x =
        1 +
        Math.sin(i * .17) *
        .025;

    ring.scale.y =
        1 +
        Math.cos(i * .21) *
        .025;

    tunnel.add(
        ring
    );
}


/* =========================================================
   STRUCTURAL LINES
========================================================= */

const structureMaterial =
    new THREE.LineBasicMaterial({
        color: 0x0c2638,
        transparent: true,
        opacity: .8
    });


function structure(
    x,
    y
) {

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints([

                new THREE.Vector3(
                    x,
                    y,
                    0
                ),

                new THREE.Vector3(
                    x * .85,
                    y * .85,
                    -tunnelLength
                )

            ]);

    tunnel.add(
        new THREE.Line(
            geometry,
            structureMaterial
        )
    );
}


structure(7, 5);
structure(-7, 5);
structure(7, -5);
structure(-7, -5);


/* =========================================================
   FLOOR
========================================================= */

const floor =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            18,
            tunnelLength
        ),

        new THREE.MeshBasicMaterial({
            color: 0x071018,
            side: THREE.DoubleSide
        })
    );

floor.rotation.x =
    -Math.PI / 2;

floor.position.z =
    -tunnelLength / 2;

tunnel.add(
    floor
);


/* =========================================================
   LIGHT STRIPS
========================================================= */

const lights =
    new THREE.Group();

scene.add(
    lights
);


const lightColors = [
    0x168cff,
    0x00d9ff,
    0xff7a18,
    0x9b5cff
];


for (
    let i = 0;
    i < (mobile ? 25 : 55);
    i++
) {

    const material =
        new THREE.MeshBasicMaterial({
            color:
                lightColors[
                    i %
                    lightColors.length
                ]
        });

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .025,
                .025,
                .5 +
                Math.random() * 2
            ),
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

    lights.add(
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


for (
    let i = 0;
    i < PARTICLES;
    i++
) {

    const n = i * 3;

    const angle =
        Math.random() *
        Math.PI *
        2;

    const radius =
        2 +
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
            color: 0x75bfff,
            size:
                mobile
                    ? .035
                    : .05,
            transparent: true,
            opacity: .6
        })
    );

scene.add(
    particles
);


/* =========================================================
   PRODUCT PANELS
========================================================= */

const panelGroup =
    new THREE.Group();

scene.add(
    panelGroup
);


const productData = [

    {
        title: "AI RECEPTIONIST",
        status: "CALL RECEIVED",
        color: 0x168cff
    },

    {
        title: "AI RECEPTIONIST",
        status: "LEAD QUALIFIED",
        color: 0x00d9ff
    },

    {
        title: "AI AUTOMATIONS",
        status: "WORKFLOW RUNNING",
        color: 0x9b5cff
    },

    {
        title: "CRM",
        status: "RECORD UPDATED",
        color: 0xff7a18
    },

    {
        title: "AI AUTOMATIONS",
        status: "FOLLOW-UP SENT",
        color: 0x00d9ff
    },

    {
        title: "BUSINESS OS",
        status: "SYSTEM CONNECTED",
        color: 0x168cff
    },

    {
        title: "BUSINESS OS",
        status: "OPERATIONS ACTIVE",
        color: 0x9b5cff
    },

    {
        title: "AI",
        status: "DECISION MADE",
        color: 0xff7a18
    }

];


function createPanel(
    data,
    index
) {

    const group =
        new THREE.Group();


    const width = 3.6;
    const height = 1.9;


    const points = [

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


    const border =
        new THREE.Line(
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                ),

            new THREE.LineBasicMaterial({
                color:
                    data.color,
                transparent:true,
                opacity:.75
            })
        );


    group.add(
        border
    );


    /*
       Internal data bars.
    */

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const length =
            .7 +
            Math.random() *
            1.5;

        const line =
            new THREE.Line(
                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            -1.15,
                            .18 -
                            i * .28,
                            .01
                        ),

                        new THREE.Vector3(
                            -1.15 +
                            length,
                            .18 -
                            i * .28,
                            .01
                        )

                    ]),

                new THREE.LineBasicMaterial({
                    color:
                        data.color,
                    transparent:true,
                    opacity:.35
                })
            );

        group.add(
            line
        );

    }


    const angle =
        index /
        productData.length *
        Math.PI *
        2;

    const radius =
        5.1;


    group.position.set(

        Math.cos(angle) *
        radius,

        Math.sin(angle) *
        radius,

        -13 -
        index * 15

    );


    group.lookAt(
        new THREE.Vector3(
            0,
            0,
            group.position.z
        )
    );


    group.userData = {
        baseX:
            group.position.x,

        baseY:
            group.position.y,

        phase:
            Math.random() *
            Math.PI *
            2
    };


    panelGroup.add(
        group
    );
}


productData.forEach(
    createPanel
);


/* =========================================================
   SCROLL
========================================================= */

let targetScroll = 0;
let smoothScroll = 0;
let previousScroll = 0;
let velocity = 0;


function readScroll() {

    const max =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    targetScroll =
        max > 0
            ? window.scrollY / max
            : 0;


    velocity =
        targetScroll -
        previousScroll;


    previousScroll =
        targetScroll;
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
        .075;


    const z =
        THREE.MathUtils.lerp(
            7,
            -112,
            smoothScroll
        );


    camera.position.z =
        z;


    /*
       Natural camera movement.
    */

    const x =
        Math.sin(
            time * .00035
        ) * .11;


    const y =
        Math.cos(
            time * .00028
        ) * .07;


    camera.position.x +=
        (
            x -
            camera.position.x
        ) *
        .025;


    camera.position.y +=
        (
            y -
            camera.position.y
        ) *
        .025;


    camera.rotation.z +=
        (
            velocity * -1.5 -
            camera.rotation.z
        ) *
        .06;


    camera.rotation.x +=
        (
            velocity * .4 -
            camera.rotation.x
        ) *
        .06;
}


/* =========================================================
   ANIMATE PANELS
========================================================= */

function animatePanels(
    time
) {

    panelGroup.children.forEach(
        panel => {

            const d =
                panel.userData;

            panel.position.x =
                d.baseX +
                Math.sin(
                    time * .001 +
                    d.phase
                ) *
                .12;

            panel.position.y =
                d.baseY +
                Math.cos(
                    time * .0008 +
                    d.phase
                ) *
                .12;

        }
    );
}


/* =========================================================
   LIGHT ANIMATION
========================================================= */

function animateLights(
    time
) {

    lights.children.forEach(
        (light,index) => {

            light.scale.x =
                .8 +
                Math.sin(
                    time * .002 +
                    index
                ) *
                .2;

        }
    );


    blueLight.position.x =
        Math.sin(
            time * .0005
        ) * 4;

    blueLight.position.y =
        Math.cos(
            time * .0004
        ) * 3;


    cyanLight.position.x =
        Math.cos(
            time * .00035
        ) * 7;


    orangeLight.position.y =
        Math.sin(
            time * .00045
        ) * 5;
}


/* =========================================================
   POINTER PARALLAX
========================================================= */

let pointerX = 0;
let pointerY = 0;


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


function updateParallax() {

    if (
        window.innerWidth <= 800
    ) {
        return;
    }


    const targetX =
        pointerX * .18;

    const targetY =
        pointerY * .12;


    camera.position.x +=
        (
            targetX -
            camera.position.x
        ) *
        .008;


    camera.position.y +=
        (
            targetY -
            camera.position.y
        ) *
        .008;
}


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
                mobileMenu.classList
                    .toggle(
                        "open"
                    );

            menuButton.classList
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
        .querySelectorAll("a")
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

        <div class="vg-transition-orb">

            <div></div>
            <div></div>
            <div></div>

        </div>

        <div class="vg-transition-label">
            VIRTUAL GENIE AI
        </div>

        <div class="vg-transition-title">
            Connecting system.
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
   TRANSITION CSS
========================================================= */

const transitionStyle =
    document.createElement(
        "style"
    );


transitionStyle.textContent = `

#vg-transition{

    position:fixed;

    inset:0;

    z-index:99999;

    display:flex;

    align-items:center;

    justify-content:center;

    background:#020304;

    opacity:0;

    visibility:hidden;

    pointer-events:none;

    transition:
        opacity .3s ease,
        visibility .3s ease;

}

#vg-transition.active{

    opacity:1;

    visibility:visible;

    pointer-events:all;

}

.vg-transition-inner{

    width:min(420px,82vw);

    text-align:center;

}

.vg-transition-orb{

    position:relative;

    width:95px;
    height:95px;

    margin:0 auto 35px;

    border:
        1px solid
        rgba(22,140,255,.7);

    border-radius:50%;

    animation:
        vgRotate 2s linear infinite;

}

.vg-transition-orb div{

    position:absolute;

    left:50%;
    top:50%;

    width:7px;
    height:7px;

    margin:-3.5px;

    border-radius:50%;

    background:#168cff;

    box-shadow:
        0 0 15px
        rgba(22,140,255,.8);

}

.vg-transition-orb div:nth-child(1){
    transform:
        translateY(-45px);
}

.vg-transition-orb div:nth-child(2){
    transform:
        translateX(45px);
}

.vg-transition-orb div:nth-child(3){
    transform:
        translateY(45px);
}

@keyframes vgRotate{

    to{
        transform:rotate(360deg);
    }

}

.vg-transition-label{

    color:#666;

    font-size:9px;

    letter-spacing:.3em;

}

.vg-transition-title{

    margin-top:18px;

    font-size:30px;

    letter-spacing:-.04em;

}

.vg-transition-status{

    margin-top:12px;

    color:#777;

    font-size:11px;

}

.vg-progress{

    height:1px;

    margin-top:30px;

    background:
        rgba(255,255,255,.1);

}

.vg-progress span{

    display:block;

    width:0;

    height:100%;

    background:#c9ff35;

}

#vg-transition.active
.vg-progress span{

    animation:
        vgProgress
        1.5s
        cubic-bezier(.65,0,.35,1)
        forwards;

}

@keyframes vgProgress{

    to{
        width:100%;
    }

}

`;


document.head.appendChild(
    transitionStyle
);


/* =========================================================
   PRODUCT CLICK HANDLER
========================================================= */

function navigateProduct(
    product,
    event
) {

    const destination =
        routes[product];


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
            "Activating Automations.";

        status.textContent =
            "Connecting workflows and business systems...";

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


/* =========================================================
   ONLY ONE ROUTER
========================================================= */

document
    .querySelectorAll(
        "a[data-product]"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    navigateProduct(
                        link.dataset.product,
                        event
                    );

                }
            );

        }
    );


/* =========================================================
   FALLBACK FOR EXISTING HASH LINKS
========================================================= */

document
    .querySelectorAll(
        'a[href="#receptionist"],' +
        'a[href="#automation"],' +
        'a[href="#os"]'
    )
    .forEach(
        link => {

            /*
                Avoid duplicate listeners by converting
                the old hash into the data-product system.
            */

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href ===
                "#receptionist"
            ) {

                link.dataset.product =
                    "receptionist";

            }

            if (
                href ===
                "#automation"
            ) {

                link.dataset.product =
                    "automation";

            }

            if (
                href ===
                "#os"
            ) {

                link.dataset.product =
                    "os";

            }


            link.addEventListener(
                "click",
                event => {

                    navigateProduct(
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
   RENDER LOOP
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

    updateParallax();

    animatePanels(
        time
    );

    animateLights(
        time
    );


    tunnel.rotation.z =
        Math.sin(
            time * .00008
        ) * .006;


    particles.rotation.z =
        time * .000015;


    renderer.render(
        scene,
        camera
    );

}


readScroll();

animate();


console.log(
    "Virtual Genie AI — 3D tunnel online."
);
