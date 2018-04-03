'use strict'
import * as THREE from 'three'

export default class SampleScene
{
    constructor()
    {
        this.meshs=[];
        this.scene = null;
        this.time = 0;
        this.init();

    }


    init()
    {
        this.scene = new THREE.Scene();
        for(let i = 0; i < 1000; i ++)
        {
            let geo = new THREE.BoxGeometry(2,2,2);
            let mat = new THREE.MeshBasicMaterial({color:0xffffff*Math.random()});
            let mesh = new THREE.Mesh(geo,mat);
            mesh.position.set(Math.random()*100-50,Math.random()*100-50,Math.random()*100-50);
            this.meshs.push(mesh);
            this.scene.add(mesh)
        }


        this.update();

    }
    update=()=>
    {

        requestAnimationFrame(this.update);

        this.time += 0.001;

        for(let i = 0; i < this.meshs.length; i++)
        {
            this.meshs[i].rotateX(i+this.time);
            this.meshs[i].rotateY(i+this.time);
            this.meshs[i].position.z++;
            if(this.meshs[i].position.z > 50)
            {
                this.meshs[i].position.z = -50;
            }
        }
    }
}