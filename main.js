import {orbitControl, postProcessing, renderer, setupScene} from "./modules/setup";
import {setupShape, updateShape} from "./modules/shape";
import {setupGUI} from "./modules/gui";

setupScene();
setupShape();
setupGUI();

renderer.setAnimationLoop( animate );
function animate(time)
{
    updateShape(time);
    orbitControl.update();
    postProcessing.render(undefined);
}
