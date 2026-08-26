import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   VIRTUAL GENIE AI
   THREE.JS SENTIENT DIGITAL WORKER
========================================================= */


/* =========================================================
   DOM
========================================================= */

const container =
    document.getElementById("threeScene");

const loaderElement =
    document.getElementById("sceneLoader");

const taskStatus =
    document.getElementById("taskStatus");

const taskTitle =
    document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");


/* =========================================================
   BASIC CHECK
========================================================= */

if (!container) {
    throw new Error("Three.js container not found.");
}


/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x030303);


/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        38,
        window.innerWidth /
            window.innerHeight,
        0.1,
        100
    );

camera.position.set(
    0,
    1.25,
    7
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


container.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
    new THREE.HemisphereLight(
        0x9dbdff,
        0x050505,
        1.5
    );

scene.add(
    ambientLight
);


const keyLight =
    new THREE.DirectionalLight(
        0xffffff,
        3.2
    );

keyLight.position.set(
    3,
    5,
    4
);

keyLight.castShadow = true;

scene.add(
    keyLight
);


const blueLight =
    new THREE.PointLight(
        0x398cff,
        30,
        12
    );

blueLight.position.set(
    -3,
    2,
    2
);

scene.add(
    blueLight
);


const orangeLight =
    new THREE.PointLight(
        0xff6d32,
        18,
        10
    );

orangeLight.position.set(
    3,
    1,
    -1
);

scene.add(
    orangeLight
);


/* =========================================================
   FLOOR
========================================================= */

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: .8,
        metalness: .15
    });


const floor =
    new THREE.Mesh(
        new THREE.CircleGeometry(
            12,
            64
        ),
        floorMaterial
    );


floor.rotation.x =
    -Math.PI / 2;

floor.position.y =
    -1.15;

floor.receiveShadow = true;

scene.add(
    floor
);


/* =========================================================
   FLOOR RING
========================================================= */

const ringMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x3f8cff,
        transparent: true,
        opacity: .18,
        side: THREE.DoubleSide
    });


const floorRing =
    new THREE.Mesh(
        new THREE.RingGeometry(
            2.1,
            2.12,
            96
        ),
        ringMaterial
    );


floorRing.rotation.x =
    -Math.PI / 2;

floorRing.position.y =
    -1.13;

scene.add(
    floorRing
);


/* =========================================================
   AMBIENT PARTICLES
========================================================= */

const particleCount =
    window.innerWidth < 700
        ? 450
        : 900;


const particlePositions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const radius =
        3 +
        Math.random() * 7;

    const angle =
        Math.random() *
        Math.PI *
        2;

    const height =
        -1 +
        Math.random() * 6;

    particlePositions[
        i * 3
    ] =
        Math.cos(angle) *
        radius;

    particlePositions[
        i * 3 + 1
    ] =
        height;

    particlePositions[
        i * 3 + 2
    ] =
        Math.sin(angle) *
        radius;

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


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x79aaff,
        size:
            window.innerWidth < 700
                ? .018
                : .025,
        transparent: true,
        opacity: .5,
        depthWrite: false
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
   GENIE
========================================================= */

let genie = null;

let mixer = null;

let animations = [];

let currentAction = null;

let currentTask = 0;

let modelReady = false;


/* =========================================================
   CHARACTER ANIMATION STORAGE
========================================================= */

const actions = {};


/* =========================================================
   LOAD GLB
========================================================= */

const gltfLoader =
    new GLTFLoader();


gltfLoader.load(

    "models/genie.glb",

    gltf => {

        genie =
            gltf.scene;

        genie.position.set(
            0,
            -1.05,
            0
        );

        genie.scale.setScalar(
            1.65
        );


        genie.traverse(
            object => {

                if (
                    object.isMesh
                ) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;

                    if (
                        object.material
                    ) {

                        object.material
                            .roughness = .42;

                        object.material
                            .metalness = .3;

                    }

                }

            }
        );


        scene.add(
            genie
        );


        /* -----------------------------------------
           ANIMATION MIXER
        ----------------------------------------- */

        if (
            gltf.animations &&
            gltf.animations.length
        ) {

            mixer =
                new THREE.AnimationMixer(
                    genie
                );

            animations =
                gltf.animations;


            animations.forEach(
                clip => {

                    const action =
                        mixer.clipAction(
                            clip
                        );

                    actions[
                        clip.name.toLowerCase()
                    ] =
                        action;

                }
            );

        }


        modelReady = true;


        if (loaderElement) {

            loaderElement.classList.add(
                "hidden"
            );

        }


        /*
         * Start with the first
         * available idle animation.
         */

        playAnimationByName(
            [
                "idle",
                "breathing",
                "stand",
                "standing"
            ]
        );


        updateTask(
            0
        );

    },

    undefined,

    error => {

        console.error(
            "Could not load models/genie.glb",
            error
        );


        if (loaderElement) {

            loaderElement.innerHTML =
                `
                <span class="loader-dot"></span>
                <span>3D MODEL NOT FOUND</span>
                `;

        }

    }

);


/* =========================================================
   ANIMATION FINDER
========================================================= */

function findAnimation(
    possibleNames
) {

    const names =
        Object.keys(actions);


    for (
        const requested
        of possibleNames
    ) {

        const exact =
            requested.toLowerCase();

        const match =
            names.find(
                name =>
                    name === exact
            );

        if (match) {
            return actions[match];
        }

    }


    /*
     * Fuzzy search.
     */

    for (
        const requested
        of possibleNames
    ) {

        const match =
            names.find(
                name =>
                    name.includes(
                        requested.toLowerCase()
                    )
            );

        if (match) {
            return actions[match];
        }

    }


    return null;
}


/* =========================================================
   PLAY ANIMATION
========================================================= */

function playAnimationByName(
    possibleNames,
    fadeDuration = .45
) {

    if (!mixer) {
        return;
    }


    const nextAction =
        findAnimation(
            possibleNames
        );


    if (!nextAction) {

        /*
         * The model may not contain
         * this specific animation.
         *
         * Don't break the scene.
         */

        return;

    }


    if (
        currentAction ===
        nextAction
    ) {

        return;

    }


    nextAction
        .reset()
        .fadeIn(
            fadeDuration
        )
        .play();


    if (currentAction) {

        currentAction
            .fadeOut(
                fadeDuration
            );

    }


    currentAction =
        nextAction;

}


/* =========================================================
   TASK DEFINITIONS
========================================================= */

const tasks = [

    {
        title:
            "OBSERVING",

        description:
            "Monitoring your business environment.",

        animations: [
            "idle",
            "breathing",
            "stand"
        ]
    },


    {
        title:
            "RECEIVING CALL",

        description:
            "Understanding an incoming customer request.",

        animations: [
            "phone",
            "call",
            "talk",
            "gesture"
        ]
    },


    {
        title:
            "THINKING",

        description:
            "Understanding the customer and deciding what happens next.",

        animations: [
            "think",
            "thinking",
            "idle"
        ]
    },


    {
        title:
            "BOOKING APPOINTMENT",

        description:
            "Finding the right time and confirming the appointment.",

        animations: [
            "typing",
            "computer",
            "reach",
            "gesture"
        ]
    },


    {
        title:
            "UPDATING CRM",

        description:
            "Recording the customer and updating business data.",

        animations: [
            "typing",
            "computer",
            "gesture"
        ]
    },


    {
        title:
            "RUNNING AUTOMATION",

        description:
            "Connecting systems and completing the workflow.",

        animations: [
            "gesture",
            "reach",
            "work",
            "computer"
        ]
    },


    {
        title:
            "COMPLETE",

        description:
            "Task completed. Returning to standby.",

        animations: [
            "idle",
            "breathing",
            "stand"
        ]
    }

];


/* =========================================================
   UPDATE TASK
========================================================= */

function updateTask(
    index
) {

    index =
        Math.max(
            0,
            Math.min(
                tasks.length - 1,
                index
            )
        );


    currentTask =
        index;


    const task =
        tasks[index];


    if (taskTitle) {

        taskTitle.textContent =
            task.title;

    }


    if (taskDescription) {

        taskDescription.textContent =
            task.description;

    }


    if (taskStatus) {

        const number =
            String(
                index + 1
            ).padStart(
                2,
                "0"
            );


        const numberElement =
            taskStatus.querySelector(
                ".task-status-number"
            );


        if (numberElement) {

            numberElement.textContent =
                number;

        }

    }


    playAnimationByName(
        task.animations
    );

}


/* =========================================================
   SCROLL STATE
========================================================= */

let targetScroll =
    window.scrollY;

let smoothScroll =
    window.scrollY;


window.addEventListener(
    "scroll",
    () => {

        targetScroll =
            window.scrollY;

    },
    {
        passive: true
    }
);


/* =========================================================
   POINTER
========================================================= */

let pointerX = 0;
let pointerY = 0;

let targetPointerX = 0;
let targetPointerY = 0;


window.addEventListener(
    "pointermove",
    event => {

        targetPointerX =
            (
                event.clientX /
                window.innerWidth -
                .5
            );

        targetPointerY =
            (
                event.clientY /
                window.innerHeight -
                .5
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   CAMERA + CHARACTER MOTION
========================================================= */

function updateScene(
    time
) {

    smoothScroll +=
        (
            targetScroll -
            smoothScroll
        ) * .075;


    pointerX +=
        (
            targetPointerX -
            pointerX
        ) * .045;


    pointerY +=
        (
            targetPointerY -
            pointerY
        ) * .045;


    const hero =
        document.querySelector(
            ".hero"
        );


    if (!hero) {
        return;
    }


    const heroHeight =
        hero.offsetHeight;


    const heroProgress =
        THREE.MathUtils.clamp(
            smoothScroll /
                heroHeight,
            0,
            1
        );


    /* -----------------------------------------
       CAMERA
    ----------------------------------------- */

    const cameraTargetX =
        pointerX * .55;

    const cameraTargetY =
        1.25 -
        pointerY * .18 -
        heroProgress * .2;

    const cameraTargetZ =
        7 -
        heroProgress * 2.0;


    camera.position.x +=
        (
            cameraTargetX -
            camera.position.x
        ) * .035;


    camera.position.y +=
        (
            cameraTargetY -
            camera.position.y
        ) * .035;


    camera.position.z +=
        (
            cameraTargetZ -
            camera.position.z
        ) * .035;


    camera.lookAt(
        0,
        .6,
        0
    );


    /* -----------------------------------------
       CHARACTER
    ----------------------------------------- */

    if (genie) {

        const breathing =
            Math.sin(
                time * .0015
            ) * .018;


        genie.position.x =
            pointerX * .28;


        genie.position.y =
            -1.05 +
            breathing;


        genie.rotation.y =
            pointerX * -.12;


        genie.rotation.x =
            pointerY * .035;


        /*
         * As the user scrolls,
         * the camera approaches the AI.
         */

        const scale =
            1.65 +
            heroProgress * .25;

        genie.scale.setScalar(
            scale
        );

    }


    /* -----------------------------------------
       PARTICLES
    ----------------------------------------- */

    particles.rotation.y =
        time * .000025;

    particles.rotation.x =
        Math.sin(
            time * .00008
        ) * .03;


    /* -----------------------------------------
       FLOOR RING
    ----------------------------------------- */

    floorRing.rotation.z =
        time * .00025;


    floorRing.material.opacity =
        .12 +
        Math.sin(
            time * .002
        ) * .04;


    /* -----------------------------------------
       LIGHTS
    ----------------------------------------- */

    blueLight.position.x =
        -3 +
        pointerX * 2;

    blueLight.position.y =
        2 -
        pointerY * 1.5;


    orangeLight.position.x =
        3 -
        pointerX * 2;

    orangeLight.position.y =
        1 +
        pointerY;


    /* -----------------------------------------
       SCROLL TASKS
    ----------------------------------------- */

    /*
     * Hero progress is divided into
     * intentional behavioral states.
     */

    let nextTask;


    if (
        heroProgress < .12
    ) {

        nextTask = 0;

    } else if (
        heroProgress < .28
    ) {

        nextTask = 1;

    } else if (
        heroProgress < .43
    ) {

        nextTask = 2;

    } else if (
        heroProgress < .60
    ) {

        nextTask = 3;

    } else if (
        heroProgress < .77
    ) {

        nextTask = 4;

    } else if (
        heroProgress < .92
    ) {

        nextTask = 5;

    } else {

        nextTask = 6;

    }


    if (
        nextTask !==
        currentTask
    ) {

        updateTask(
            nextTask
        );

    }

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
                2
            )
        );


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================================
   CLOCK
========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   RENDER LOOP
========================================================= */

function render() {

    requestAnimationFrame(
        render
    );


    const delta =
        clock.getDelta();

    const elapsed =
        clock.elapsedTime;


    if (mixer) {

        mixer.update(
            delta
        );

    }


    updateScene(
        elapsed * 1000
    );


    renderer.render(
        scene,
        camera
    );

}


render();


/* =========================================================
   INITIAL TASK
========================================================= */

updateTask(
    0
);
