import {Pane} from 'tweakpane';
import {changeShape, shaderData, shape, wireframeOn} from "./shape";
import {backgroundColor, bloomPass, filmPass, scene} from "./setup";
import * as THREE from "three";

const mainPane = new Pane({title: 'Shape Controls'});
const ppPane = new Pane({title: 'Post Processing'});

export function setupGUI()
{
    setupPaneCSS();
    setupShapeGUI();
    setupColorGUI();
    setupShakeGUI();
    setupFractureGUI();
    setupPP();
}

function setupPaneCSS()
{
    let style = mainPane.element.style;
    
    style.position = 'fixed';
    style.top = '10px'; style.right = '10px';
    style.transformOrigin = 'top right';
    style.transform = 'scale(1.5)';
    
    style = ppPane.element.style;
    style.position = 'fixed';
    style.top = '10px'; style.left = '10px';
    style.transformOrigin = 'top left';
    style.transform = 'scale(1.5)';
}

function setupShapeGUI()
{
    mainPane.addBlade(
        {
            view: 'list', label: 'Shape',
            options:
            [
                {text: 'Sphere', value: 'sphere'},
                {text: 'Capsule', value: 'capsule'},
                {text: 'Cone', value: 'cone'},
                {text: 'Cylinder', value: 'cylinder'},
                {text: 'Torus', value: 'torus'},
                {text: 'Torus Knot', value: 'torusKnot'},
            ],
            value: 'sphere'
        }
    ).on('change', (ev) => changeShape(ev.value));

    mainPane.addBinding(wireframeOn, 'value', {label: 'Wireframe'}).on(
        'change', (ev) => shape.material.wireframe = ev.value
    );
}

function setupColorGUI()
{
    const colorFolder = mainPane.addFolder({title: 'Color', expanded: false});
    
    colorFolder.addBinding(
        {normalColor: '#dd00ff'}, 'normalColor', 
        {label: 'Normal Color'}).on('change', 
        (ev) => shaderData.normalColor.value.set(ev.value)
    );
    
    colorFolder.addBinding(
        {crushedColor: '#00ff00'}, 'crushedColor', 
        {label: 'Crushed Color'}).on('change', 
        (ev) => shaderData.crushedColor.value.set(ev.value)
    );

    colorFolder.addBinding(backgroundColor, 'color', {label: 'Background Color'}).on(
        'change', (ev) => scene.background = new THREE.Color(ev.value)
    );

    colorFolder.addBlade({
        view: 'list',
        label: 'Color Function',
        options:
        [
            {text: 'Sine', value: 0},
            {text: 'Cosine', value: 1},
            {text: 'Tangent', value: 2},
        ],
        value: 0
    }).on('change', (ev) => shaderData.colorFunction.value = ev.value);


    colorFolder.addBinding(shaderData, 'colorSpeed', {label: 'Pulsing Speed', min: 0, max: 0.1});
}

function setupShakeGUI()
{
    const vibrationFolder = mainPane.addFolder({title: 'Vibration', expanded: false});

    vibrationFolder.addBinding(
        shaderData, 'shakeStrength',
        {label: 'Shake Strength', min: 0, max: 0.0005}
    );

    vibrationFolder.addBinding(
        shaderData, 'unshakeStrength',
        {label: 'Unshake Strength', min: 0, max: 0.0005}
    );

    vibrationFolder.addBinding(shaderData, 'weight', {label: 'Weight', min: 0, max: 1});
}

function setupFractureGUI()
{
    const fractureFolder = mainPane.addFolder({title: 'Crushing', expanded: false});
    fractureFolder.addBinding(shaderData, 'fractureStrength', {label: 'Strength', min: 0, max: 0.05});
    fractureFolder.addBinding(shaderData, 'fractureThreshold', {label: 'Threshold', min: 0, max: 0.5});
    fractureFolder.addBinding(shaderData, 'recoveryDelay', {label: 'Recovery Delay', min: 0, max: 10});
    fractureFolder.addBinding(shaderData, 'recoveryStrength', {label: 'Recovery Strength', min: 0, max: 0.05});
}

function setupPP()
{
    const bloomFolder = ppPane.addFolder({title: 'Bloom', expanded: false});
    bloomFolder.addBinding(bloomPass, 'enabled', {label: 'Enabled'});
    bloomFolder.addBinding(bloomPass, 'threshold', {label: 'Threshold', min: 0, max: 1});
    bloomFolder.addBinding(bloomPass, 'strength', {label: 'Strength', min: 0, max: 0.5});
    bloomFolder.addBinding(bloomPass, 'radius', {label: 'Radius', min: 0, max: 10});

    const filmFolder = ppPane.addFolder({title: 'Film', expanded: false});
    filmFolder.addBinding(filmPass, 'enabled', {label: 'Enabled'});
    filmFolder.addBinding(filmPass.uniforms.intensity, 'value', {label: 'Intensity', min: 0, max: 10});
    filmFolder.addBinding(filmPass.uniforms.grayscale, 'value', {label: 'Grayscale'});
}