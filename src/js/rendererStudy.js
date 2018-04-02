'use strict'
// import {TweenMax, Power2, Power1, TimelineLite} from "gsap";
// import * as THREE from "three";
import SE from './SE';
const postVert= require('./GLSL/postVert.glsl');
const postFlag = require('./GLSL/postFlag.glsl');
// import 'imports-loader?THREE=three!../../node_modules/three/examples/js/CurveExtras';

const se_settings = require('./JSON/se_setting');
import PopUpMessageManager from './PopUpMessageManager';
const organsPos ={

    brain:new THREE.Vector3(625/1000,0,27/1000),
    bone:new THREE.Vector3(196/1000,0,138/1000),
    pancreas:new THREE.Vector3(689/1000,0,342/1000),
    mascle:new THREE.Vector3(941/1000,0,342/1000),
    heart:new THREE.Vector3(334/1000,0,406/1000),
    kidney:new THREE.Vector3(74/1000,0,566/1000),
    intestine:new THREE.Vector3(581/1000,0,635/1000),
    fat:new THREE.Vector3(839/1000,0,797/1000),
    blood:new THREE.Vector3(405/1000,0,926/1000),

};

const soundFileNames = [
    './assets/sounds/ANP.mp3',
    './assets/sounds/EPO.mp3',
    './assets/sounds/RENIN.mp3',
    './assets/sounds/CASILIO.mp3',
    './assets/sounds/INCRETIN.mp3',
    './assets/sounds/FGF.mp3',
    './assets/sounds/OSTEOCALCIN.mp3',
    './assets/sounds/INSULIN.mp3',
    './assets/sounds/LEPTIN.mp3',
    './assets/sounds/VEGF.mp3',
    './assets/sounds/BMP_7.mp3',
    './assets/sounds/CATHEPSINB.mp3',
    './assets/sounds/IL6.mp3',
];

const soundNames = [
    "ANP",
    "EPO",
    "RENIN",
    "CASILIO",
    "INCRETIN",
    "FGF23",
    "OSTEOCALCIN",
    "INSULIN",
    "LEPTIN",
    "VEFG",
    "BMP_7",
    "CATHEPSINβ",
    "IL6",
];

const textureName = {
    blood:'./assets/img/webgl/blood.png',
    bone:'./assets/img/webgl/bone.png',
    brain:'./assets/img/webgl/brain.png',
    fat:'./assets/img/webgl/fat.png',
    heart:'./assets/img/webgl/heart.png',
    intestine:'./assets/img/webgl/intestine.png',
    kidney:'./assets/img/webgl/kidney.png',
    mascle:'./assets/img/webgl/mascle.png',
    pancreas:'./assets/img/webgl/pancreas.png',
};
const particleTex = require('./img/webgl/spark1.png');


import Organ from "./Organs";
import InteractiveParticles from './InteractiveParticles';

// console.log(particleTex);
export default class ScenePartcles{
    constructor(manager,bgm, domStyles)
    {

        this.domStyles = domStyles;
        // console.log("scene particle");

        this.timer = 0.0;
        this.threshold = null;
        this.manager = manager;

        this.bgm = bgm;

        // 基本セット
        this.camera = null;
        this.scene = null;
        this.renderer = this.manager.renderer;


        this.width = 700;
        this.depth = 700;
        this.brain = null;
        this.bone = null;
        this.pancreas = null;
        this.mascle = null;
        this.heart = null;
        this.kidney = null;
        this.intestine = null;
        this.fat = null;
        this.blood = null;
        this.organs = [];
        this.postCamera;
        this.postTarget;
        this.postScene;


        this.organTimerQue;

        this.cameraResetDelay =new Date();

        this.isPost = true;

        this.noiseTimer = {value:0.0};

        this.fadeinOpacity = {value:0.0};

        this.timerSpeed = 0.005;

        this.messegeSoundBuffers = new Map();

        this.interactiveParticles = [];

        this.seAudios = [];
        this.messageAudios = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.INTERSECTED;
        this.radius = 20;
        this.theta = 0;
        this.intersectedobjs = new THREE.Group();

        this.organsMapedNumber = new Map();

        this.mapdedOrgas = new Map();

        this.cameraRandomYRange = 140;

        this.isClickable = true;
        this.voiceDelay = 0;

        this.cameraAutoTimeStamp = new Date();

        this.popupMessageManager = new PopUpMessageManager(this.manager);



        this.ground;
        this.modifiedHeightSmooth = 0.0;
        this.controllerDomElement = document.getElementById('controller');
        this.initPostScene();



        this.about = document.getElementById('about');
        this.about.style.opacity = 0.0;


        this.dragRotateValues = {
            onDown:false,
            dragStartX:0,
            dragStartY:0,
            dragEndX:0,
            dragEndY:0,
            modifiedRadian:0.0,
            modifiedHeight:0.0,
            dragStartRadian:0.0,
            dragStartHeight:0.0,
        };

        this.modifiedRadianSmooth = 0.0;

        this.randamMessageDelay = 0.0;



        this.init();
    }


    initPostScene()
    {

        this.postScene = new THREE.Scene();

        let dpr = this.manager.renderer.getPixelRatio();


        this.postTarget = new THREE.WebGLRenderTarget( $("#content").width() * dpr, $("#content").height() * dpr );
        this.postTarget.texture.format = THREE.RGBAFormat;
        this.postTarget.texture.minFilter = THREE.NearestFilter;
        this.postTarget.texture.magFilter = THREE.NearestFilter;
        this.postTarget.texture.generateMipmaps = false;
        this.postTarget.stencilBuffer = false;
        this.postTarget.depthBuffer = true;
        // this.postTarget.texture.transparent = true;
        this.postTarget.depthTexture = new THREE.DepthTexture();
        this.postTarget.depthTexture.type = THREE.UnsignedShortType;


        this.postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
        let postMaterial = new THREE.ShaderMaterial( {
            vertexShader: postVert,
            fragmentShader: postFlag,
            transparent:true,
            uniforms: {
                // cameraNear: { value: camera.near },
                // cameraFar:  { value: camera.far },
                texture:   { value: this.postTarget.texture },
                timer:this.noiseTimer,
                opacity:this.fadeinOpacity
                // tDepth:     { value: target.depthTexture }
            }
        });
        let postPlane = new THREE.PlaneBufferGeometry( 2, 2 );
        let postQuad = new THREE.Mesh( postPlane, postMaterial );

        this.postScene.add( postQuad );

        // console.log(cosonle);Tw
        TweenMax.to(this.fadeinOpacity,3.0, {
            value:1.0,
            delay:0.5,
            ease: Power1.easeInOut,
        });
    }


    initValues()
    {


    }


    onWindowResize()
    {

        // console.log(resize);
        let aspect = $("#content").width() / $("#content").height();
        let dpr = 1.0;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        this.postTarget.setSize(  $("#content").width() * dpr, $("#content").height() * dpr );
    }

    init() {




        // console.log(this.messegeSoundBuffers);



        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 5, 15000 );
        this.camera.position.set(0,100,100);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.scene = new THREE.Scene();


        this.brain = new Organ( this.manager, "brain",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.brain.setPos(organsPos["brain"]);
        this.brain.setup();
        this.organs.push(this.brain);

        this.mapdedOrgas.set('brain',this.brain);

        this.bone = new Organ( this.manager, "bone",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.bone.setPos(organsPos["bone"]);
        this.interactiveParticles.push(this.bone.addDestination("kidney","FGF23"));
        this.interactiveParticles.push(this.bone.addDestination("brain","OSTEOCALCIN"));
        this.bone.setup();
        this.organs.push(this.bone);
        this.mapdedOrgas.set('bone',this.bone);

        this.pancreas = new Organ(this.manager, "pancreas",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.pancreas.setPos(organsPos["pancreas"]);
        this.interactiveParticles.push(this.pancreas.addDestination("mascle","INSULIN"));
        this.interactiveParticles.push(this.pancreas.addDestination("brain","INSULIN"));
        this.pancreas.setup();
        this.organs.push(this.pancreas);
        this.mapdedOrgas.set('pancreas',this.pancreas);

        this.mascle = new Organ(this.manager, "mascle",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.mascle.setPos(organsPos["mascle"]);
        this.interactiveParticles.push(this.mascle.addDestination("fat","IL6"));
        this.interactiveParticles.push(this.mascle.addDestination("brain","CATHEPSINβ"));
        this.mascle.setup();
        this.organs.push(this.mascle);
        this.mapdedOrgas.set('mascle',this.mascle);

        this.heart = new Organ(this.manager, "heart",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.heart.setPos(organsPos["heart"]);
        this.interactiveParticles.push(this.heart.addDestination("kidney","ANP"));
        this.interactiveParticles.push(this.heart.addDestination("blood","ANP"));
        this.heart.setup();
        this.organs.push(this.heart);
        this.mapdedOrgas.set('heart',this.heart);

        this.kidney = new Organ(this.manager, "kidney",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.kidney.setPos(organsPos['kidney']);
        this.interactiveParticles.push(this.kidney.addDestination("heart","RENIN"));
        this.interactiveParticles.push(this.kidney.addDestination("blood","RENIN"));
        this.interactiveParticles.push(this.kidney.addDestination("bone","CASILIO"));
        this.interactiveParticles.push(this.kidney.addDestination("intestine","CASILIO"));
        this.interactiveParticles.push(this.kidney.addDestination("bone","EPO"));
        this.kidney.setup();
        this.organs.push(this.kidney);
        this.mapdedOrgas.set('kidney',this.kidney);


        this.intestine = new Organ(this.manager, "intestine",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.intestine.setPos(organsPos['intestine']);
        this.interactiveParticles.push(this.intestine.addDestination("brain","INCRETIN"));
        this.interactiveParticles.push(this.intestine.addDestination("pancreas","INCRETIN"));
        this.interactiveParticles.push(this.intestine.addDestination("fat","INCRETIN"));
        this.intestine.setup();
        this.organs.push(this.intestine);
        this.mapdedOrgas.set('intestine',this.intestine);

        this.fat = new Organ(this.manager, "fat",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.fat.setPos(organsPos['fat']);
        this.interactiveParticles.push(this.fat.addDestination("brain","LEPTIN"));
        this.interactiveParticles.push(this.fat.addDestination("bone","BMP_7"));
        this.interactiveParticles.push(this.fat.addDestination("blood","VEFG"));
        this.fat.setup();
        this.organs.push(this.fat);
        this.mapdedOrgas.set('fat',this.fat);


        this.blood = new Organ(this.manager, "blood",this.scene,this.width,this.depth, this.camera,this.messegeSoundBuffers);
        this.blood.setPos(organsPos['blood']);
        this.blood.setup();
        this.organs.push(this.blood);
        this.mapdedOrgas.set('blood',this.blood);

        this.cameraMovingYRadian = {value:0};
        this.cameraMovingYHeight = {value:150};
        this.cameraRotateWidthMin = 90;


        this.manager.gui.organsSize.onChange((value)=>{
            for(let i  =0; i < this.organs.length; i++)
            {
                this.organs[i].setOrganSize(value);
            }
        });






        this.isCameraMoving = false;
        this.cameraRotateRad = {value:0};
        this.cameraRotateWidth = {value:180};
        this.cameraModifiedPos = new THREE.Vector3(
            Math.sin(this.timer) * this.cameraRotateWidth.value,
            0,
            Math.cos(this.timer) * this.cameraRotateWidth.value
        );

        this.cameraModiMaxY = 200;
        this.cameraPosition = new THREE.Vector3(0,this.cameraModiMaxY,0);

        this.lookat = new THREE.Vector3(0,0,0);
        this.controllerPoints = document.querySelectorAll('.organsPos_point');

        this.cameraAnimationDuration = 2.0;
        for(let i = 0; i < this.controllerPoints.length; i++)
        {

            let clickedOrgan;
            this.controllerPoints[i].addEventListener('click',()=>{

                this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;


                if(this.isClickable) {

                    this.domStyles.scaleDown();

                    this.isClickable = false;
                    let isClicked = this.controllerPoints[i].classList.contains('onClick');

                    for (let _i = 0; _i < this.controllerPoints.length; _i++) {
                        this.controllerPoints[_i].classList.remove('onClick');

                    }
                    // console.log(this.controllerPoints[i].classList);
                    // console.log(this.mapdedOrgas.get(this.controllerPoints[i].classList[1]));

                    clickedOrgan = this.mapdedOrgas.get(this.controllerPoints[i].classList[1]);


                    this.timerSpeed = 0.0;
                    //
                    let pos;
                    let camerarotatewidth = this.cameraRotateWidthMin;
                    let modiY = (Math.random() * this.cameraRandomYRange) - this.cameraRandomYRange/2;
                    if (!isClicked) {
                        pos = clickedOrgan.position;
                        this.controllerPoints[i].classList.add('onClick');
                        // this.domStyles.scaleUp(this.controllerPoints[i].classList);
                        this.domStyles.scaleUp(this.controllerPoints[i].classList[1]);
                        clickedOrgan.onClick();
                        console.log(clickedOrgan.name)
                        this.organTimerQue = this.controllerPoints[i];
                        this.cameraResetDelay = new Date();

                    } else {
                        pos = new THREE.Vector3(0, 0, 0);
                        camerarotatewidth = 300;
                        modiY = this.cameraModiMaxY;
                        this.domStyles.resetPopup();

                    }


                    this.isCameraMoving = true;
                    TweenMax.to(this.cameraPosition, this.cameraAnimationDuration, {
                        x: pos.x,
                        y: pos.y + modiY,
                        z: pos.z,
                        ease: Power2.easeInOut,
                        onComplete:()=>{
                            setTimeout(()=>{
                                this.isClickable = true;
                            },300);
                        }

                    });

                    TweenMax.to(this.lookat, this.cameraAnimationDuration, {
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                        ease: Power2.easeInOut,
                        onComplete: () => {
                            this.isCameraMoving = false;
                        }
                    });


                    TweenMax.to(this.cameraRotateWidth, this.cameraAnimationDuration, {
                        value: camerarotatewidth,
                        ease: Power2.easeInOut,
                    });

                    TweenMax.to(this.dragRotateValues, this.cameraAnimationDuration, {
                        modifiedHeight: 0.0,
                        ease: Power2.easeInOut,
                    });



                }
            });



            // setTimeout(()=>{
            //     this.resetCameraAndOrgansAnimation();
            // },170000);



        }


        this.refDistance = 200;


        // this.particleTest = new InteractiveParticles(this.manager,this.camera,this.scene,organsPos['blood'],organsPos['kidney'],new THREE.Color().setRGB(255.0,0,255.0),this.width,this.depth);
        var audioLoader = new THREE.AudioLoader();
        var listener = new THREE.AudioListener();
        this.camera.add( listener );
        for(let i = 0; i < soundNames.length; i++)
        {
            audioLoader.load( soundFileNames[i],  ( buffer )=> {

                for(let j = 0; j < this.interactiveParticles.length; j++)
                {
                    if(soundNames[i] == this.interactiveParticles[j].name)
                    {
                        var audio = new THREE.PositionalAudio(listener);
                        audio.setBuffer(buffer);
                        audio.setRefDistance( this.refDistance );
                        this.interactiveParticles[j].setAudio(audio);
                        this.messageAudios.push(audio);
                    }
                }

            });
        }

        for(let i = 1; i <= 21; i++)
        {
            audioLoader.load( './assets/sounds/'+i.toString()+".mp3",  ( buffer )=> {

                // console.log(buffer);

                var audio = new THREE.PositionalAudio(listener);
                audio.setBuffer(buffer);
                audio.setRefDistance( this.refDistance );
                this.messageAudios.push(audio);
                if(i == 1)
                {
                    this.heart.getMessage('kidney'+'ANP').setAudio(audio,'finished');
                }

                if(i == 2)
                {
                    this.heart.getMessage('blood'+'ANP').setAudio(audio,'finished');
                }


                if(i == 3)
                {
                    this.heart.getMessage('blood'+'ANP').setAudio(audio,'finished');
                }
                //
                //
                if(i == 4)
                {
                    this.kidney.getMessage('bone'+'EPO').setAudio(audio,'finished');
                }

                if(i == 5)
                {
                    this.kidney.getMessage('heart'+'RENIN').setAudio(audio,'finished');
                }

                if(i == 6)
                {
                    this.kidney.getMessage('blood'+'RENIN').setAudio(audio,'finished');
                }

                if(i == 7)
                {
                    this.kidney.getMessage('intestine'+'CASILIO').setAudio(audio,'finished');
                }
                if(i == 8)
                {
                    this.kidney.getMessage('bone'+'CASILIO').setAudio(audio,'finished');
                }

                if(i == 9)
                {
                    this.intestine.getMessage('fat'+'INCRETIN').setAudio(audio,'finished');
                }

                if(i == 10)
                {
                    this.intestine.getMessage('pancreas'+'INCRETIN').setAudio(audio,'finished');
                }

                if(i == 11)
                {
                    this.intestine.getMessage('brain'+'INCRETIN').setAudio(audio,'finished');
                }


                if(i == 12)
                {
                    this.bone.getMessage('kidney'+'FGF23').setAudio(audio,'finished');
                }


                if(i == 13)
                {
                    this.bone.getMessage('brain'+'OSTEOCALCIN').setAudio(audio,'finished');
                }


                if(i == 14)
                {
                    this.pancreas.getMessage('mascle'+'INSULIN').setAudio(audio,'finished');
                }
                if(i == 15)
                {
                    this.pancreas.getMessage('brain'+'INSULIN').setAudio(audio,'finished');
                }

                if(i == 16)
                {
                    this.fat.getMessage('brain'+'LEPTIN').setAudio(audio,'finished');
                }

                if(i == 17)
                {
                    this.fat.getMessage('brain'+'LEPTIN').setAudio(audio,'finished');
                }

                if(i == 18)
                {

                    this.fat.getMessage('blood'+'VEFG').setAudio(audio,'finished');
                }

                if(i == 19)
                {
                    this.fat.getMessage('bone'+'BMP_7').setAudio(audio,'finished');
                }

                if(i == 20)
                {
                    this.mascle.getMessage('brain'+'CATHEPSINβ').setAudio(audio,'finished');
                }

                if(i == 21)
                {
                    this.mascle.getMessage('fat'+'IL6').setAudio(audio,'finished');
                }

            });
        }


        // console.log('scene');

        for(let i = 0; i < se_settings.array.length; i++ )
        {

            // console.log(se_settings.array[i]);
            let num = se_settings.array[i].num;
            if (num < 10) {
                num = '0' + num;
            } else {
                num = num.toString();
            }


            audioLoader.load('./assets/sounds/se' + num + '.mp3', (buffer) => {
                // console.log('se 01', buffer);


                var audio = new THREE.Audio(listener);
                audio.setBuffer(buffer);
                audio.setVolume(1.2);
                // audio.play();
                // audio.setRefDistance( this.refDistance );
                // this.kidney.setSE(audio,{is1A:true,is2A:true},4,6,this.bgm);

                let array = se_settings.array[i];

                // console.log(array.isB);


                let organ = this.mapdedOrgas.get(se_settings.array[i].name);

                let debugmode = false;
                // if(num == 31 || num == 32 || num == 26 || num == 27 || num == 28)
                // {
                //     debugmode = true;
                // }
                let se = new SE(array.name+ " " + num, audio, array.is1A,array.isB,array.is2A,array.isA1,array.isA2, array.bar, array.bar2, this.bgm, debugmode);
                // console.log(se);
                organ.setSE(se);
                this.seAudios.push(audio);
            });




        }



        let boxsize = 40;
        var geometry = new THREE.SphereBufferGeometry( boxsize, 6,6 );
        for ( var i = 0; i < this.organs.length; i ++ ) {
            var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color:0xffffff,visible:false,wireframe:true } ) );
            object.position.x = this.organs[i].position.x;
            object.position.y = this.organs[i].position.y-boxsize/2;
            object.position.z = this.organs[i].position.z;
            object.name = this.organs[i].name;
            this.organsMapedNumber.set(this.organs[i].name,this.organs[i]);
            this.intersectedobjs.add( object );
        }

        // console.log(this.organsMapedNumber);
        this.scene.add(this.intersectedobjs);
        this.raycaster = new THREE.Raycaster();


        let groundTexture = new THREE.TextureLoader().load('./assets/img/webgl/vitruvius_ground.png');
        groundTexture.anisotropy = 10;
        let planeGeo= new THREE.PlaneGeometry(800,800,1,1);
        let planeMat = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,map:groundTexture,blending:THREE.AdditiveBlending,opacity:1});

        this.ground = new THREE.Mesh(planeGeo,planeMat);

        this.ground.rotateX(-Math.PI/2);
        this.ground.position.y = -200;
        this.scene.add(this.ground);

        this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;
        this.isCameraAutoAnimation = false;

        document.addEventListener('mousedown',this.onMouseDown);
        document.addEventListener('mouseup',this.onMouseUp);
        document.addEventListener('wheel',this.onWheel);


    }


    onWheel=(e)=>
    {
        // console.log(this.about.style.opacity);
        if(this.about.style.opacity == 0.0) {


            // console.log(e.deltaY);



            this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;

            if (e.deltaY > 0) {
                this.dragRotateValues.modifiedHeight += 12;
            } else {
                this.dragRotateValues.modifiedHeight -= 12;
            }


            if(this.dragRotateValues.modifiedHeight < -550)
            {
                this.dragRotateValues.modifiedHeight = -550;
            }

            if(this.dragRotateValues.modifiedHeight > 260)
            {
                this.dragRotateValues.modifiedHeight = 260;
            }
            // console.log(this.dragRotateValues.modifiedHeight);
        }

    }

    onKeyDown(e)
    {

    }

    mouseMove(e)
    {



        e.preventDefault();
        this.mouse.x = ( e.clientX / $("#content").width() ) * 2 - 1;
        this.mouse.y = - ( e.clientY / $("#content").height() ) * 2 + 1;

        if(this.dragRotateValues.onDown)
        {


            this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;

            this.dragRotateValues.modifiedRadian = (-(e.clientX - this.dragRotateValues.dragStartX)/window.innerWidth)*6.0+this.dragRotateValues.dragStartRadian;


            this.dragRotateValues.modifiedHeight = ((e.clientY - this.dragRotateValues.dragStartY)/window.innerHeight)*300.0+this.dragRotateValues.dragStartHeight;

            // console.log('diff',this.dragRotateValues.modifiedHeight);
        }

    }

    onMouseDown  =(e)=>
    {

        this.isCameraMoving = true;
        // console.log(e);
        e.preventDefault();
        this.dragRotateValues.onDown = true;
        this.dragRotateValues.dragStartX = e.clientX;
        this.dragRotateValues.dragStartY = e.clientY;

        this.dragRotateValues.dragStartRadian = this.dragRotateValues.modifiedRadian;
        this.dragRotateValues.dragStartHeight = this.dragRotateValues.modifiedHeight;

    }

    onMouseUp =(e)=>
    {

        this.isCameraMoving = false;
        e.preventDefault();

        this.dragRotateValues.onDown = false;
        // console.log(e);

    }


    groundFadeOut()
    {
        TweenMax.to(this.ground.material,2.0, {
            opacity:0.1,
            ease: Power2.easeInOut,

        });
    }


    groundFadeIn()
    {
        TweenMax.to(this.ground.material,2.0, {
            opacity:1.0,
            ease: Power2.easeInOut,

        });
    }

    onClick(e)
    {



        if(this.INTERSECTED != null && !this.controllerDomElement.classList.contains('mouseon') && this.isClickable && this.about.style.opacity == 0.0){


            this.isCameraAutoAnimation = false;

            this.isClickable = false;
            this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;

            let intersectedOrgan = this.organsMapedNumber.get(this.INTERSECTED.name);

            let isClicked = document.querySelector('.'+this.INTERSECTED.name).classList.contains('onClick');
            //


            this.domStyles.scaleDown();
            for(let _o = 0; _o < this.organs.length; _o++)
            {

                if(!isClicked)
                {


                    if(this.organs[_o].name == this.INTERSECTED.name && this.bgm.currentTiming != 'kick')
                    {
                        this.organs[_o].onClick();
                        // this.organs[_o].isC
                        console.log(this.organs[_o].name);

                    } else
                    {
                        document.querySelector('.'+this.organs[_o].name).classList.remove('onClick');
                    }
                } else
                {

                    document.querySelector('.'+this.organs[_o].name).classList.remove('onClick');
                }

            }


            let pos = intersectedOrgan.position;
            let camerarotatewidth = this.cameraRotateWidthMin;
            let modiY = (Math.random() * this.cameraRandomYRange) - this.cameraRandomYRange/2;

            if(isClicked)
            {
                pos = new THREE.Vector3(0,0,0);
                camerarotatewidth = 300;
                this.domStyles.resetPopup();
                modiY = this.cameraModiMaxY;
                this.groundFadeIn();
                document.querySelector('.'+this.INTERSECTED.name).classList.remove('onClick');
            } else
            {
                this.groundFadeOut();


                this.popupMessageManager.setOrgan(this.mapdedOrgas.get(this.INTERSECTED.name));

                document.querySelector('.'+this.INTERSECTED.name).classList.add('onClick');
                this.domStyles.scaleUp(this.INTERSECTED.name);

                this.organTimerQue = document.querySelector('.'+this.INTERSECTED.name);
               this.cameraResetDelay = new Date();
                // this.clickDelay = 60 * 4.5;



            }


            this.isCameraMoving = true;
            TweenMax.to(this.cameraPosition,this.cameraAnimationDuration, {
                x:pos.x,
                y:pos.y +modiY,
                z:pos.z,
                ease: Power2.easeInOut,
                onComplete:()=>{
                    setTimeout(()=>{
                        this.isClickable = true;
                    },300);
                }

            });

            TweenMax.to(this.lookat,this.cameraAnimationDuration, {
                x:pos.x,
                y:pos.y,
                z:pos.z,
                ease: Power2.easeInOut,
                onComplete:()=>{
                    this.isCameraMoving = false;
                }
            });


            TweenMax.to(this.cameraRotateWidth,this.cameraAnimationDuration, {
                value:camerarotatewidth,
                ease: Power2.easeInOut,
            });


            TweenMax.to( this.dragRotateValues,this.cameraAnimationDuration,{
                modifiedHeight:0.0,
                ease:Power2.easeInOut,
            });

            // this.domStyles.scaleUpOnClicked();



        }


        // }
    }



    resetCameraAndOrgansAnimation()
    {


        this.isClickable = false;
        this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;
        // this.isCameraAutoAnimation = false;
        // this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;

        // let intersectedOrgan = this.organsMapedNumber.get(this.INTERSECTED.name);

        // let isClicked = document.querySelector('.'+this.INTERSECTED.name).classList.contains('onClick');
        //


        this.domStyles.scaleDown();
        for(let _o = 0; _o < this.organs.length; _o++)
        {



            document.querySelector('.'+this.organs[_o].name).classList.remove('onClick');


        }


        // let pos = intersectedOrgan.position;
        // let camerarotatewidth = this.cameraRotateWidthMin;
        // let modiY = (Math.random() * this.cameraRandomYRange);

        let pos = new THREE.Vector3(0,0,0);
        let camerarotatewidth = 300;
        this.domStyles.resetPopup();
        let modiY = this.cameraModiMaxY;
            this.groundFadeIn();



        this.isCameraMoving = true;
        TweenMax.to(this.cameraPosition,this.cameraAnimationDuration, {
            x:pos.x,
            y:pos.y +modiY,
            z:pos.z,
            ease: Power2.easeInOut,
            onComplete:()=>{
                setTimeout(()=>{
                    this.isClickable = true;
                },300);
            }

        });

        TweenMax.to(this.lookat,this.cameraAnimationDuration, {
            x:pos.x,
            y:pos.y,
            z:pos.z,
            ease: Power2.easeInOut,
            onComplete:()=>{
                this.isCameraMoving = false;
            }
        });


        TweenMax.to(this.cameraRotateWidth,this.cameraAnimationDuration, {
            value:camerarotatewidth,
            ease: Power2.easeInOut,
        });


        TweenMax.to( this.dragRotateValues,this.cameraAnimationDuration,{
            modifiedHeight:0.0,
            ease:Power2.easeInOut,
        });


    }


    cameraMove()
    {


        this.isCameraAutoAnimation = true;


        this.isClickable = true;
        // this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;

        let num = Math.floor(Math.random()*this.organs.length);
        let intersectedOrgan = this.organs[num];

        let isClicked = document.querySelector('.'+intersectedOrgan.name).classList.contains('onClick');
        //


        this.domStyles.scaleDown();
        for(let _o = 0; _o < this.organs.length; _o++)
        {

            if(!isClicked)
            {


                if(this.organs[_o].name == intersectedOrgan.name && this.bgm.currentTiming != 'kick')
                {
                    this.organs[_o].onClick();
                } else
                {
                    document.querySelector('.'+this.organs[_o].name).classList.remove('onClick');
                }
            } else
            {

                document.querySelector('.'+this.organs[_o].name).classList.remove('onClick');
            }

        }


        let pos = intersectedOrgan.position;
        let camerarotatewidth = this.cameraRotateWidthMin;
        let modiY =(Math.random() * this.cameraRandomYRange) - this.cameraRandomYRange/2;

        if(isClicked)
        {
            pos = new THREE.Vector3(0,0,0);
            camerarotatewidth = 300;
            this.domStyles.resetPopup();
            modiY = this.cameraModiMaxY;
            this.groundFadeIn();
            document.querySelector('.'+intersectedOrgan.name).classList.remove('onClick');
        } else
        {
            this.groundFadeOut();

            document.querySelector('.'+intersectedOrgan.name).classList.add('onClick');
            this.domStyles.scaleUp(intersectedOrgan.name);

            this.organTimerQue = document.querySelector('.'+intersectedOrgan.name);
            // this.cameraResetDelay = new Date();
            // this.clickDelay = 60 * 4.5;
        }


        this.isCameraMoving = true;
        TweenMax.to(this.cameraPosition,this.cameraAnimationDuration, {
            x:pos.x,
            y:pos.y +modiY,
            z:pos.z,
            ease: Power2.easeInOut,
            onComplete:()=>{
                setTimeout(()=>{
                    this.isClickable = true;
                },300);
            }

        });

        TweenMax.to(this.lookat,this.cameraAnimationDuration, {
            x:pos.x,
            y:pos.y,
            z:pos.z,
            ease: Power2.easeInOut,
            onComplete:()=>{
                this.isCameraMoving = false;
            }
        });


        TweenMax.to(this.cameraRotateWidth,this.cameraAnimationDuration, {
            value:camerarotatewidth,
            ease: Power2.easeInOut,
        });


        TweenMax.to( this.dragRotateValues,this.cameraAnimationDuration,{
            modifiedHeight:0.0,
            ease:Power2.easeInOut,
        });


        this.cameraResetDelay = new Date();


    }

    onClickOrganPoint =(name)=>
    {
        // console.log(name);
    }


    update() {


        this.popupMessageManager.update();
        // console.log(new Date().getTime() - this.cameraResetDelay.getTime());


        if(new Date().getTime() - this.cameraResetDelay.getTime() > 8500 && this.isCameraAutoAnimation == false)
        {


            let onClick = false;

            for(let i = 0; i < this.controllerPoints.length; i++)
            {
                if(this.controllerPoints[i].classList.contains('onClick'))
                {
                    onClick = true;
                }
            }


            if(onClick)
            {
                this.resetCameraAndOrgansAnimation();
                // console.log("reset");
            }

            this.cameraResetDelay =new Date();
        }





        if(this.bgm.currentTiming != "kick")
        {
            if(this.cameraAutoDelay > 0)
            {
                this.cameraAutoDelay --;
            }
            else
            {

                if(new Date().getTime() - this.cameraAutoTimeStamp.getTime() > 8500 )
                {
                    this.cameraMove();
                    // this.cameraAutoDelay = this.manager.gui.values.cameraAutoDelay * 60;
                    this.cameraAutoTimeStamp = new Date();
                }


            }
        }




        for(let i = 0; i < this.seAudios.length; i++)
        {
            this.seAudios[i].setVolume(this.bgm.seVolume);
        }


        if(this.voiceDelay > 0)
        {
            this.voiceDelay --;
            // console.log(this.voiceDelay);
        }

        this.noiseTimer.value ++;


        if(this.bgm.currentTiming == "is1A" || this.bgm.currentTiming == "is2A")
        {
            if(Math.random() <=this.manager.gui.values.randomA || this.voiceDelay <= 0)
            {
                // console.log(true);

                let isPlaying = false;


                let num = Math.floor(Math.random() * this.organs.length);

                this.voiceDelay = this.organs[num].onClick(0)*4;
                // this.voiceDelay = 60* 4;
            }
        }




        if(this.bgm.currentTiming == "isB")
        {
            if(Math.random() <=this.manager.gui.values.randomB || this.voiceDelay == 0)
            {
                // console.log(true);

                let num = Math.floor(Math.random() * this.organs.length);

                this.voiceDelay = this.organs[num].onClick(0)*2;

                // this.voiceDelay = 60* 2;
            }
        }



        // this.timer += 0.005;
        // let rad = 100 + 50 * Math.cos(this.timer);
        // this.camera.position.set(
        //     rad * Math.sin(this.timer),
        //     Math.sin(this.timer*0.7) * 50,
        //     rad * Math.cos(this.timer)
        // );


        if(!this.isCameraMoving)
        {
            this.timerSpeed += (0.005 - this.timerSpeed) * 0.01;
            this.timer +=  this.timerSpeed;
        } else {
            this.timerSpeed = 0.0;
        }


        this.modifiedRadianSmooth += (this.dragRotateValues.modifiedRadian - this.modifiedRadianSmooth) * 0.1;

        this.modifiedHeightSmooth += (this.dragRotateValues.modifiedHeight - this.modifiedHeightSmooth) * 0.1;
        this.cameraModifiedPos = new THREE.Vector3(
            Math.sin(this.timer+this.modifiedRadianSmooth) * this.cameraRotateWidth.value,
            0,
            Math.cos(this.timer+this.modifiedRadianSmooth) * this.cameraRotateWidth.value
        );


        // this.scene.rotation.y = (this.modifiedRadianSmooth);


        this.camera.position.set(
            this.cameraPosition.x + this.cameraModifiedPos.x,
            // this.cameraPosition.y + this.cameraModifiedPos.y + Math.sin(this.cameraMovingYRadian.value) * this.cameraMovingYHeight.value,
            this.cameraPosition.y + this.cameraModifiedPos.y + this.modifiedHeightSmooth,
            this.cameraPosition.z + this.cameraModifiedPos.z,
        );


        this.camera.fov =(this.manager.gui.values.cameraFov);
        this.camera.updateProjectionMatrix();



        this.camera.lookAt(
            this.lookat.x+Math.sin(this.timer*1.2)*10.0,
            this.lookat.y+Math.cos(this.timer*1.8)*10.0,
            this.lookat.z+Math.sin(this.timer*1.5)*10.0
        );
        for(let i = 0; i < this.organs.length; i ++)
        {
            this.organs[i].update();
        }


        // if(this.about.style.opacity == 0.0)
        // {
            this.raycast();
        // }



        // this.particleTest.update();
    }


    raycast()
    {
        this.raycaster.setFromCamera( this.mouse, this.camera );
        var intersects = this.raycaster.intersectObjects( this.intersectedobjs.children );
        if ( intersects.length > 0 ) {
            if ( this.INTERSECTED != intersects[ 0 ].object ) {
                // if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

                for(let i = 0; i < this.organs.length; i++)
                {
                    this.organs[i].mouseOut();
                }

                this.INTERSECTED = intersects[ 0 ].object;


                let intersectedOrgan = this.organsMapedNumber.get(this.INTERSECTED.name);

                if(this.about.style.opacity == 0.0)
                {
                    document.body.style.cursor = 'pointer';
                    if(this.isClickable)
                    {
                        intersectedOrgan.mouseOn();
                    }
                }



            }
        } else {
            if ( this.INTERSECTED )
            {



                let intersectedOrgan = this.organsMapedNumber.get(this.INTERSECTED.name);

                intersectedOrgan.mouseOut();
                document.body.style.cursor = 'default';
            }
                // this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }
    }




}