import * as THREE from 'three';
import vertex from '/shaders/vertex.glsl';
import fragment from '/shaders/fragment.glsl';
import {camera, scene} from "./setup";

const geometries = {
    'sphere': new THREE.SphereGeometry(1, 32, 32),
    'capsule': new THREE.CapsuleGeometry(1, 1, 32),
    'cone': new THREE.ConeGeometry(1, 1, 32),
    'cylinder': new THREE.CylinderGeometry(1, 1, 1, 32),
    'torus': new THREE.TorusGeometry(1, 0.2, 32, 32),
    'torusKnot': new THREE.TorusKnotGeometry(1, 0.2, 32, 32),
}
export let shape
export let wireframeOn = {value: false}

export const shaderData = {
    colorSpeed: 0.01,
    colorTime: { value: 0 },
    colorFunction: { value: 0 },
    normalColor: { value: new THREE.Color( 0xdd00ff ) },
    crushedColor: { value: new THREE.Color( 0x00ff00 ) },

    weight: 0.01,
    shakeTime: { value: 0 },
    shakeStrength : 0.0002,
    unshakeStrength : 0.0002,
    shakeProgress: { value: 0 },

    fractureStrength: 0.005,
    fractureThreshold : 0.05,
    isFractured: { value: false },
    fractureProgress: { value: 0 },

    recoveryDelay: 3,
    recoveryStrength: 0.001
}

export function setupShape()
{
    changeShape('sphere');
    setupEventListeners();
}

function setupEventListeners()
{
    let startShaking, stopShaking, fractureLoop, recoveryLoop, recoveryTimer;
    let shakeProgress = shaderData.shakeProgress;

    let isFractured = shaderData.isFractured;
    let fractureProgress = shaderData.fractureProgress;

    window.addEventListener('mousedown', (ev) =>
    {
        if(startShaking || !isMouseOnShape(ev) || ev.buttons !== 1 || isFractured.value) return;
        clearInterval(stopShaking); stopShaking = null;
        startShaking = setInterval(shake);
    });
    window.addEventListener('mouseup', () =>
    {
        if(stopShaking || recoveryTimer) return;
        if(isFractured.value) recover();
        else unshake();
    });

    //#region Helpers
    function shake()
    {
        shakeProgress.value += shaderData.shakeStrength;
        if(shakeProgress.value >= shaderData.fractureThreshold)
        {
            clearInterval(startShaking); startShaking = null;
            isFractured.value = true;
            fractureLoop = setInterval(fracture);
        }
    }

    function fracture()
    {
        fractureProgress.value += shaderData.fractureStrength;
        if(fractureProgress.value >= 1)
        {
            clearInterval(fractureLoop); fractureLoop = null;
            fractureProgress.value = 1;
        }
    }

    function recover()
    {
        recoveryTimer = setTimeout(() =>
        {
            clearInterval(fractureLoop); fractureLoop = null;
            recoveryLoop = setInterval(() =>
            {
                fractureProgress.value -= shaderData.recoveryStrength;
                if(fractureProgress.value <= 0)
                {
                    clearInterval(recoveryLoop); recoveryLoop = null;
                    fractureProgress.value = 0;
                    recoveryTimer = null;
                    isFractured.value = false;
                    shakeProgress.value = 0;
                }
            });

        }, shaderData.recoveryDelay * 1000);
    }

    function unshake()
    {
        clearInterval(startShaking); startShaking = null;
        stopShaking = setInterval(() =>
        {
            shakeProgress.value -= shaderData.unshakeStrength;
            if(shakeProgress.value <= 0)
            {
                clearInterval(stopShaking); stopShaking = null;
                shakeProgress.value = 0;
            }
        });
    }
    //#endregion
}

export function changeShape(newShape)
{
    if(shape) scene.remove(shape);
    shape = new THREE.Mesh(
        geometries[newShape],
        new THREE.ShaderMaterial({
            uniforms: shaderData,
            vertexShader: vertex,
            fragmentShader: fragment,
            wireframe: wireframeOn.value
        })
    );
    scene.add(shape);
}

export function updateShape(time)
{
    shaderData.shakeTime.value = time * shaderData.weight;
    shaderData.colorTime.value = time * shaderData.colorSpeed;
}

//#region Helpers
function isMouseOnShape(ev)
{
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster(undefined, undefined);

    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    return intersects.length > 0;
}
//#endregion