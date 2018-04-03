'use strict'
import * as THREE from 'three'

export default class NicofarreRenderManager{
    constructor(manager)
    {


        this.manager = manager;

        this.camera = null;
        this.scene = null;
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.planeA = null;
        this.planeB = null;
        this.planeC = null;
        this.planeD = null;
        this.planeE = null;
        this.planeF = null;
        this.planeG = null;


        this.nicofarreCamerasNear = 0.1;
        this.nicofarreCamerasFar = 1000;

        this.aspect;

        this.planeA_Camera = null;
        this.planeB_Camera = null;
        this.planeC_Camera = null;
        this.planeD_Camera = null;
        this.planeE_Camera = null;
        this.planeF_Camera = null;
        this.planeG_Camera = null;

        this.renderTargetA = null;
        this.renderTargetC = null;
        this.renderTargetB = null;
        this.renderTargetD = null;
        this.renderTargetE = null;
        this.renderTargetF = null;
        this.renderTargetG = null;
        this.nicofarreCameras = [];
        this.renderer = null;


        this.postScene = new THREE.Scene();

        this.nicofarreScene = null;
        this.init();


        window.addEventListener('keydown',this.onKeyDown);
    }






    onWindowResize()
    {


    }

    setScene(scene)
    {
        this.nicofarreScene = scene;

        console.log(this.nicofarreScene);
    }
    init() {





        this.postScene.add(new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0xffffff})));

        this.camera = new THREE.OrthographicCamera(0, this.WIDTH, 0, this.HEIGHT, 0.001, 10000);
        this.camera.position.set(0,0,1080/2);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.scene = new THREE.Scene();
        


        this.renderTargetA = new THREE.WebGLRenderTarget(1480,280);
        let planeAGeo = new THREE.PlaneBufferGeometry(1480,280,2,2);
        let planeAMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.renderTargetA});
        this.planeA = new THREE.Mesh(planeAGeo,planeAMat);
        this.planeA.position.set(40+planeAGeo.parameters.width/2,40+planeAGeo.parameters.height/2,0);
        this.planeA_Camera = new THREE.PerspectiveCamera(36.8699, 1480/280,this.nicofarreCamerasNear,this.nicofarreCamerasFar);
        this.planeA_Camera.lookAt(new THREE.Vector3(1,0,0));
        this.renderTargetA.texture.format = THREE.RGBFormat;
        this.scene.add(this.planeA);



        this.renderTargetB = new THREE.WebGLRenderTarget(840,280);
        let planeBGeo = new THREE.PlaneBufferGeometry(840,280,2,2);
        let planeBMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.renderTargetB.texture});
        this.planeB = new THREE.Mesh(planeBGeo,planeBMat);
        this.planeB.position.set(40+planeBGeo.parameters.width/2,this.HEIGHT-planeBGeo.parameters.height/2-120,0);
        this.scene.add(this.planeB);
        this.planeB_Camera =new THREE.PerspectiveCamera( 21.4262,840/280,this.nicofarreCamerasNear,this.nicofarreCamerasFar);
        this.renderTargetB.texture.format = THREE.RGBFormat;
        this.nicofarreCameras.push(this.planeB_Camera);


        this.renderTargetD = new THREE.WebGLRenderTarget(840,280);
        let planeDGeo = new THREE.PlaneBufferGeometry(840,280,2,2);
        let planeDMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.renderTargetD.texture});
        this.planeD = new THREE.Mesh(planeDGeo,planeDMat);
        this.planeD.position.set(920+planeDGeo.parameters.width/2,this.HEIGHT-planeDGeo.parameters.height/2-120,0);
        this.scene.add(this.planeD);
        this.planeD_Camera =new THREE.PerspectiveCamera( 21.4262,840/280, this.nicofarreCamerasNear,this.nicofarreCamerasFar );
        this.planeD_Camera.position.z = 0;
        this.planeD_Camera.lookAt(new THREE.Vector3(0,0,1));
        this.renderTargetD.texture.format = THREE.RGBFormat;


        this.renderTargetC = new THREE.WebGLRenderTarget(1480,280);
        let planeCGeo = new THREE.PlaneBufferGeometry(1480,280,2,2);
        let planeCMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.renderTargetC.texture});
        this.planeC = new THREE.Mesh(planeCGeo,planeCMat);
        this.planeC.position.set(40+planeCGeo.parameters.width/2,planeCGeo.parameters.height/2+360,0);
        this.planeC_Camera = new THREE.PerspectiveCamera(36.8699, 1480/280,this.nicofarreCamerasNear,this.nicofarreCamerasFar);
        this.planeC_Camera.lookAt(new THREE.Vector3(-1,0,0));

        this.scene.add(this.planeC);


        let planeEGeo = new THREE.PlaneBufferGeometry(160, 280,2,2);
        let planeEMat = new THREE.MeshBasicMaterial({color:0x3350A9,side:THREE.DoubleSide});
        this.planeE = new THREE.Mesh(planeEGeo,planeEMat);
        this.planeE.position.set(1560+planeEGeo.parameters.width/2,40+planeEGeo.parameters.height/2,0);
        this.scene.add(this.planeE);

        let planeFGeo = new THREE.PlaneBufferGeometry(160, 280,2,2);
        let planeFMat = new THREE.MeshBasicMaterial({color:0xF36925,side:THREE.DoubleSide});
        this.planeF = new THREE.Mesh(planeFGeo,planeFMat);
        this.planeF.position.set(1560+planeFGeo.parameters.width/2,360+planeFGeo.parameters.height/2,0);
        this.scene.add(this.planeF);



        this.renderTargetG = new THREE.WebGLRenderTarget(98,170);
        let planeGGeo = new THREE.PlaneBufferGeometry(98 , 170,2,2);
        let planeGMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.renderTargetG.texture});
        this.planeG = new THREE.Mesh(planeGGeo,planeGMat);
        this.planeG.position.set(this.WIDTH-160+planeGGeo.parameters.width/2,40+planeGGeo.parameters.height/2,0);
        this.planeG_Camera = new THREE.PerspectiveCamera(Math.tan(98/170)*360, 98/170,this.nicofarreCamerasNear,this.nicofarreCamerasFar);

        this.planeG_Camera.lookAt(new THREE.Vector3(0,1,0));
        // this.planeG_Camera.rotateZ(Math.PI/2);
        this.scene.add(this.planeG);




        this.renderer = new THREE.WebGLRenderer( { antialias: true,preserveDrawingBuffer: true } );
        this.renderer.setPixelRatio( 1 );
        this.renderer.setSize(1920,1080 );
        this.renderer.domElement.id = "main";
        document.body.appendChild( this.renderer.domElement );







        // this.update();

    }


    onKeyDown=(e)=>
    {

        if(e.key == 's')
        {
            this.saveCanvas('image/png');
        }
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




    saveCanvas(saveType){
        let imageType = "image/png";
        let fileName = "sample.png";
        // if(saveType === "jpeg"){
        //     imageType = "image/jpeg";
        //     fileName = "sample.jpg";
        // }
        // console.log(this.renderer.domElement.toDataURL());
        let canvas = document.getElementById("main");
        // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
        let base64 = canvas.toDataURL();
        // console.log(base64);
        // base64データをblobに変換
        let blob = this.Base64toBlob(base64);
        // blobデータをa要素を使ってダウンロード
        this.saveBlob(blob, fileName);
    }

    Base64toBlob(base64)
    {
        // カンマで分割して以下のようにデータを分ける
        // tmp[0] : データ形式（data:image/png;base64）
        // tmp[1] : base64データ（iVBORw0k～）
        let tmp = base64.split(',');
        // base64データの文字列をデコード
        let data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        let mime = tmp[0].split(':')[1].split(';')[0];
        //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        let buf = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
        // blobデータを作成
        let blob = new Blob([buf], { type: mime });
        return blob;
    }



// 画像のダウンロード
    saveBlob(blob, fileName)
    {
        let url = (window.URL || window.webkitURL);
        // ダウンロード用のURL作成
        let dataUrl = url.createObjectURL(blob);
        // イベント作成
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a要素を作成
        let a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        // ダウンロード用のURLセット
        a.href = dataUrl;
        // ファイル名セット
        a.download = fileName;
        // イベントの発火
        a.dispatchEvent(event);
    }

    getCameraConstant(  ) {
        return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * this.scenes[this.sceneNum].camera.fov ) /this.scenes[this.sceneNum].camera.zoom );
    }

    getCamera()
    {
        return this.activeCamera;
    }

    toBlob(base64) {
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
        }catch (e){
            return false;
        }
        return blob;
    }








    rendererNico()
    {

        this.renderer.render(this.nicofarreScene,this.planeA_Camera,this.renderTargetA);
        this.renderer.render(this.nicofarreScene,this.planeB_Camera,this.renderTargetB);
        this.renderer.render(this.nicofarreScene,this.planeC_Camera,this.renderTargetC);
        this.renderer.render(this.nicofarreScene,this.planeD_Camera,this.renderTargetD);
        this.renderer.render(this.nicofarreScene,this.planeG_Camera,this.renderTargetG);


        // this.planeB.material.map = this.renderTargetB.texture

    }

    update=()=> {




        this.rendererNico();
        this.renderer.render( this.scene, this.camera );

        requestAnimationFrame(this.update)




      
    }


}