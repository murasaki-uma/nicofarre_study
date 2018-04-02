'use strict'

const DEBUG_MODE = false;



import '../styl/main.less';
import RendererStudy from './rendererStudy';


const MainStart =  ()=> {

    const scene = new RendererStudy();

}
document.addEventListener("DOMContentLoaded", (event)=> {
    MainStart();
});
