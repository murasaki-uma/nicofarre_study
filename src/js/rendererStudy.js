'use strict'
import * as THREE from 'three'
// console.log(particleTex);
export default class rendererStudy{
    constructor(manager)
    {


        this.manager = manager;

        this.camera = null;
        this.scene = null;

        this.mesh = null;
        this.renderer = null;
        this.init();
    }






    onWindowResize()
    {


    }

    init() {






        this.camera = new THREE.PerspectiveCamera( 90, 1920 / 1080, 5, 10000 );
        this.camera.position.set(0,0,50);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.scene = new THREE.Scene();
        
        
        let boxGeo = new THREE.BoxGeometry(10,10,10);
        let boxMat = new THREE.MeshBasicMaterial(0xffffff*Math.random());

        this.mesh = new THREE.Mesh(boxGeo,boxMat);
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(1920,1080 );
        document.body.appendChild( this.renderer.domElement );



        this.update();

    }


    onKeyDown(e)
    {

    }

    mouseMove(e)
    {





    }

    onMouseDown  =(e)=>
    {


    }

    onMouseUp =(e)=>
    {



    }





    onClick(e)
    {


    }










    update=()=> {

        this.mesh.rotateX(0.01);


        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.update)
      
    }




}