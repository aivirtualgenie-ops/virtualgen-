import * as THREE from "three";

/* =========================================================
   VIRTUAL GENIE AI — IMMERSIVE 3D HOMEPAGE
========================================================= */

const world = document.getElementById("world");

if (!world) {
    console.error("Virtual Genie: #world missing.");
    throw new Error("#world is required");
}


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x020304);

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
        0.1,
        300
    );

camera.position.set(
    0,
    0,
    10
);


const renderer =
    new THREE.WebGLRenderer({
        antialias:
            window.devicePixelRatio < 2,

        alpha: false,

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
   MOBILE QUALITY
========================================================= */

const isMobile =
    window.innerWidth < 800;

const ringCount =
    isMobile ? 85 : 150;

const particleCount =
    isMobile ? 350 : 900;


/* =========================================================
   LIGHTING
========================================================= */

scene.add(
    new THREE.AmbientLight(
        0x26384a,
        0.55
    )
);


const blue =
    new THREE.PointLight(
        0x168cff,
        8,
        45
    );

const cyan =
    new THREE.PointLight(
        0x00d9ff,
        7,
        40
    );

const orange =
    new THREE.PointLight(
        0xff6418,
        6,
        35
    );

scene.add(
    blue,
    cyan,
    orange
);


/* =========================================================
   WORLD
========================================================= */

const worldGroup =
    new THREE.Group();

scene.add(
    worldGroup
);


/* =========================================================
   TUNNEL RINGS
========================================================= */

const tunnelLength = 220;
const tunnelRadius = 8.5;


const ringMaterial =
    new THREE.LineBasicMaterial({
        color: 0x17405a,
        transparent: true,
        opacity: .7
    });


function makeRing(
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
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            )
        );

    }

    return new THREE.Line(
        new THREE.BufferGeometry()
            .setFromPoints(points),

        ringMaterial
    );
}


for (
    let i = 0;
    i < ringCount;
    i++
) {

    const ring =
        makeRing(
            tunnelRadius,
            isMobile ? 14 : 22
        );

    const depth =
        i *
        tunnelLength /
        ringCount;

    ring.position.z =
        -depth;

    ring.rotation.z =
        Math.sin(i * .19) *
        .035;

    ring.scale.x =
        1 +
        Math.sin(i * .13) *
        .025;

    ring.scale.y =
        1 +
        Math.cos(i * .17) *
        .025;

    ring.userData.depth =
        depth;

    worldGroup.add(
        ring
    );
}


/* =========================================================
   TUNNEL SPINES
========================================================= */

const spineMaterial =
    new THREE.LineBasicMaterial({
        color: 0x0b3046,
        transparent: true,
        opacity: .7
    });


const spinePoints = [

    [ 7.2,  5.2 ],
    [-7.2,  5.2 ],
    [ 7.2, -5.2 ],
    [-7.2, -5.2 ]

];


spinePoints.forEach(
    ([x, y]) => {

        const line =
            new THREE.Line(
                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            x,
                            y,
                            5
                        ),

                        new THREE.Vector3(
                            x * .82,
                            y * .82,
                            -tunnelLength
                        )

                    ]),

                spineMaterial
            );

        worldGroup.add(
            line
        );

    }
);


/* =========================================================
   MOVING LIGHT STREAKS
========================================================= */

const streaks =
    new THREE.Group();

scene.add(
    streaks
);


const streakColors = [
    0x168cff,
    0x00d9ff,
    0xff6418,
    0x9b5cff,
    0xc9ff35
];


const streakCount =
    isMobile ? 45 : 100;


for (
    let i = 0;
    i < streakCount;
    i++
) {

    const material =
        new THREE.MeshBasicMaterial({
            color:
                streakColors[
                    i %
                    streakColors.length
                ],

            transparent:true,

            opacity:
                .25 +
                Math.random() * .5
        });


    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .025,
                .025,
                .5 +
                Math.random() * 3
            ),
            material
        );


    const angle =
        Math.random() *
        Math.PI *
        2;

    const radius =
        4.5 +
        Math.random() * 4;


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


    streaks.add(
        mesh
    );

}


/* =========================================================
   PARTICLES
========================================================= */

const positions =
    new Float32Array(
        particleCount * 3
    );

const particleSpeeds =
    new Float32Array(
        particleCount
    );


for (
    let i = 0;
    i < particleCount;
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

    positions[n] =
        Math.cos(angle) *
        radius;

    positions[n + 1] =
        Math.sin(angle) *
        radius;

    positions[n + 2] =
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
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({

        color:0x65bfff,

        size:
            isMobile
                ? .035
                : .045,

        transparent:true,

        opacity:.62,

        depthWrite:false

    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
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


const productLayers = [

    {
        z:-45,
        title:"AI RECEPTIONIST",
        color:0x168cff
    },

    {
        z:-105,
        title:"AI AUTOMATIONS",
        color:0x9b5cff
    },

    {
        z:-165,
        title:"BUSINESS OS",
        color:0xc9ff35
    }

];


function createProductWorld(
    data
) {

    const group =
        new THREE.Group();


    /*
       Central intelligence core
    */

    const core =
        new THREE.Mesh(

            new THREE.IcosahedronGeometry(
                1.15,
                1
            ),

            new THREE.MeshBasicMaterial({
                color:data.color,
                wireframe:true,
                transparent:true,
                opacity:.9
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

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    1.8 +
                    i * .65,

                    .012,
                    8,
                    80
                ),

                new THREE.MeshBasicMaterial({
                    color:data.color,
                    transparent:true,
                    opacity:.4
                })

            );


        ring.rotation.x =
            Math.PI /
            2 +
            i * .35;

        ring.rotation.y =
            i * .7;

        ring.userData.speed =
            .001 +
            i * .0008;

        group.add(
            ring
        );

    }


    /*
       Business nodes
    */

    const nodeGeometry =
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

                nodeGeometry,

                new THREE.MeshBasicMaterial({
                    color:data.color
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


    group.userData =
        {
            baseZ:data.z,
            phase:
                Math.random() *
                Math.PI *
                2
        };


    productWorld.add(
        group
    );

}


productLayers.forEach(
    createProductWorld
);


/* =========================================================
   SCROLL ENGINE
========================================================= */

let targetProgress = 0;
let smoothProgress = 0;

let previousScroll =
    window.scrollY;

let scrollVelocity = 0;


function updateScroll() {

    const max =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    targetProgress =
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
    updateScroll,
    {
        passive:true
    }
);


/* =========================================================
   POINTER
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


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(
    time
) {

    smoothProgress +=
        (
            targetProgress -
            smoothProgress
        ) *
        .055;


    /*
       This is the actual
       tunnel travel.
    */

    const destinationZ =
        10 -
        smoothProgress *
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


    const pointerInfluenceX =
        pointerX *
        (isMobile ? .05 : .45);


    const pointerInfluenceY =
        pointerY *
        (isMobile ? .03 : .25);


    camera.position.z +=
        (
            destinationZ -
            camera.position.z
        ) *
        .06;


    camera.position.x +=
        (
            swayX +
            pointerInfluenceX -
            camera.position.x
        ) *
        .025;


    camera.position.y +=
        (
            swayY -
            pointerInfluenceY -
            camera.position.y
        ) *
        .025;


    /*
       The faster the user scrolls,
       the more the tunnel reacts.
    */

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


    camera.rotation.x +=
        (
            pointerY *
            .018 -
            camera.rotation.x
        ) *
        .025;

}


/* =========================================================
   ANIMATE TUNNEL
========================================================= */

function animateTunnel(
    time
) {

    worldGroup.rotation.z =
        Math.sin(
            time * .00008
        ) *
        .008;


    /*
       Light streak movement.
    */

    streaks.children.forEach(
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
       Particle movement.
    */

    const position =
        particleGeometry
            .attributes
            .position;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const z =
            position.getZ(i);


        position.setZ(
            i,

            z +
            particleSpeeds[i]
        );


        if (
            position.getZ(i) >
            10
        ) {

            position.setZ(
                i,
                -tunnelLength
            );

        }

    }


    position.needsUpdate =
        true;

}


/* =========================================================
   ANIMATE PRODUCT WORLDS
========================================================= */

function animateProducts(
    time
) {

    productWorld.children.forEach(
        group => {

            const phase =
                group.userData.phase;


            group.rotation.y =
                time * .00025;


            group.rotation.x =
                Math.sin(
                    time * .0004 +
                    phase
                ) *
                .08;


            group.position.y =
                Math.sin(
                    time * .0007 +
                    phase
                ) *
                .15;


            group.children.forEach(
                (child,index) => {

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
   LIGHT MOTION
========================================================= */

function animateLights(
    time
) {

    blue.position.x =
        Math.sin(
            time * .00045
        ) * 6;

    blue.position.y =
        Math.cos(
            time * .00035
        ) * 4;


    cyan.position.x =
        Math.cos(
            time * .00032
        ) * 8;

    cyan.position.z =
        -30 +
        Math.sin(
            time * .0004
        ) * 20;


    orange.position.y =
        Math.sin(
            time * .0005
        ) * 6;

    orange.position.z =
        -80 +
        Math.cos(
            time * .0003
        ) * 30;

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
   PRODUCT ROUTING
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


/* =========================================================
   TRANSITION STYLE
========================================================= */

const transitionCSS =
    document.createElement(
        "style"
    );


transitionCSS.textContent = `

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
        opacity .3s ease;

}

#vg-transition.active{

    opacity:1;

    visibility:visible;

    pointer-events:auto;

}

.vg-transition-inner{

    width:min(430px,82vw);

    text-align:center;

}

.vg-transition-core{

    position:relative;

    width:100px;
    height:100px;

    margin:
        0 auto
        35px;

    border:
        1px solid
        rgba(22,140,255,.6);

    border-radius:50%;

    animation:
        vgCoreSpin
        2s
        linear
        infinite;

}

.vg-transition-core span{

    position:absolute;

    left:50%;
    top:50%;

    width:8px;
    height:8px;

    margin:-4px;

    border-radius:50%;

    background:#168cff;

    box-shadow:
        0 0 18px
        rgba(22,140,255,.9);

}

.vg-transition-core span:nth-child(1){
    transform:
        translateY(-46px);
}

.vg-transition-core span:nth-child(2){
    transform:
        translateX(46px);
}

.vg-transition-core span:nth-child(3){
    transform:
        translateY(46px);
}

@keyframes vgCoreSpin{

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

    margin-top:16px;

    font-size:30px;

    letter-spacing:-.04em;

}

.vg-transition-status{

    margin-top:12px;

    color:#777;

    font-size:11px;

}

.vg-progress{

    width:100%;

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
        ease
        forwards;

}

@keyframes vgProgress{

    to{
        width:100%;
    }

}

`;

document.head.appendChild(
    transitionCSS
);


/* =========================================================
   PRODUCT NAVIGATION
========================================================= */

function openProduct(
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


/*
   One routing system only.
*/

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


if (loading) {

    setTimeout(
        () => {

            loading.classList.add(
                "hidden"
            );

        },
        650
    );

}


/* =========================================================
   RENDER
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

    animateTunnel(
        time
    );

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


updateScroll();

animate();


console.log(
    "Virtual Genie AI — immersive tunnel online."
);
