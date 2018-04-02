'use strict'

const DEBUG_MODE = false;
import AudioManager from "./AudioManager";

// const css = require('../styl/main.styl');



import '../styl/controller.less';
const controller = require('../pug/JintaiViewerController.pug');
const volumedom = require('../pug/audioButton.pug');
const debugviewr = require('../pug/debugViewr.pug');
const messageimgs = require('../pug/messages.pug');
import SceneManager from './SceneManager';
import ScenePartcles from './ScenePartcles';
import ControllerStyle from "./ControllerStyle";
import InteractiveBox from "./InteractiveBox";
import GUI from "./gui";



const MainStart =  ()=> {



    if(DEBUG_MODE)
    {
        var debug = document.createElement('div');
        // div.style.display = 'none';
        debug.id = "debug";
        debug.innerHTML = debugviewr;
        document.body.appendChild(debug);
    }


    var div = document.createElement('div');
    div.id = "controller";
    div.innerHTML = controller;

    let messagewrapper = document.createElement('div');
    messagewrapper.id = 'messages';
    messagewrapper.innerHTML = messageimgs;


    let volumeButton = document.createElement('div');
    volumeButton.classList.add('volumeButton');
    volumeButton.innerHTML =volumedom;



    document.body.appendChild(div);
    document.body.appendChild(volumeButton);



    document.getElementById('showcase').appendChild(messagewrapper);


    const gui = new GUI();


    const audio = new AudioManager(gui);
    const manager = new SceneManager('main',gui);
    const interactivebox = new InteractiveBox();
    const domStyles = new ControllerStyle(audio);
    const scene_particle = new ScenePartcles(manager,audio, domStyles);
    manager.addScene(scene_particle);
    // manager.addScene(interactivebox);
    manager.update();
}

$(document).on("MainStart", MainStart);
// const MainStart = ()=> {
//
//
//     webgl();
// };

