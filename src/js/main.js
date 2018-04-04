'use strict'


import '../styl/main.less';
import NicofarreRenderManager from './NicofarreRenderManager';
import SampleScene from "./sampleScene";

const MainStart =  ()=> {

    const nicofarreRenderManager = new NicofarreRenderManager();
    const sampleScene = new SampleScene();
    nicofarreRenderManager.addScene(sampleScene.scene);


    nicofarreRenderManager.update();




}
document.addEventListener("DOMContentLoaded", (event)=> {
    MainStart();
});
