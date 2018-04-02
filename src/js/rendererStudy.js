'use strict'
import * as THREE from 'three'

export default class rendererStudy{
    constructor(manager)
    {


        this.manager = manager;

        this.camera = null;
        this.scene = null;
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.planeA = null;
        this.planeB = null;
        this.renderer = null;
        this.init();
    }






    onWindowResize()
    {


    }

    init() {






        this.camera = new THREE.OrthographicCamera(0, this.WIDTH, 0, this.HEIGHT, 0.001, 10000);
        this.camera.position.set(0,0,1080/2);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.scene = new THREE.Scene();
        
        
        let planeAGeo = new THREE.PlaneBufferGeometry(1480,280,2,2);
        let planeAMat = new THREE.MeshBasicMaterial({color:0xED2429,side:THREE.DoubleSide});

        this.planeA = new THREE.Mesh(planeAGeo,planeAMat);
        this.planeA.position.set(40+planeAGeo.parameters.width/2,40+planeAGeo.parameters.height/2,0);
        this.scene.add(this.planeA);



        let planeBGeo = new THREE.PlaneBufferGeometry(1480,280,2,2);
        let planeBMat = new THREE.MeshBasicMaterial({color:0x63C331,side:THREE.DoubleSide});

        this.planeB = new THREE.Mesh(planeBGeo,planeBMat);
        this.planeB.position.set(40+planeBGeo.parameters.width/2,this.HEIGHT-planeBGeo.parameters.height/2-120,0);
        this.scene.add(this.planeB);







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

        // this.mesh.rotateX(0.01);


        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.update)
      
    }




}