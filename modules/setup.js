import * as THREE from 'three';
import {OrbitControls, OutputPass} from "three/addons";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {FilmPass} from 'three/addons/postprocessing/FilmPass.js';

export const scene = new THREE.Scene();
export const renderer = new THREE.WebGLRenderer();
export const camera =
    new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

export const backgroundColor = {color: '#fcfcfc'}
export let postProcessing, bloomPass, filmPass;

export const orbitControl = new OrbitControls( camera, renderer.domElement );

export function setupScene()
{
    //#region Base
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    scene.background = new THREE.Color(backgroundColor.color);
    camera.position.z = 5;
    //#endregion

    //#region Post-Processing
    postProcessing = new EffectComposer(renderer);
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.1, 0.4, 0.85
    );
    filmPass = new FilmPass(2.5, false);

    postProcessing.addPass(new RenderPass(scene, camera));
    postProcessing.addPass(bloomPass);
    postProcessing.addPass(filmPass);
    postProcessing.addPass(new OutputPass());
    //#endregion

    //#region Event Listeners
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        postProcessing.setSize(window.innerWidth, window.innerHeight);
    })
    //#endregion
}