import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./Utils/Sizes";
import * as THREE from 'three';


export default class Camera {

    private sizes: Sizes;
    private scene: THREE.Scene;
    private canvas: HTMLCanvasElement;
    public instance!: THREE.PerspectiveCamera;
    private controls!: OrbitControls;

    constructor(sizes: Sizes, scene: THREE.Scene, canvas: HTMLCanvasElement) {

        this.sizes = sizes
        this.scene = scene
        this.canvas = canvas

          this.setInstance()
        this.setOrbitControls()
    }


    setInstance() { 
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 2000)
        this.instance.position.set(-10,5,15)
        this.instance.lookAt(0, 0, 0);
        this.scene.add(this.instance)
    }

    resize() { 
       this.instance.aspect = this.sizes.width / this.sizes.height
       this.instance.updateProjectionMatrix()
    }

        setOrbitControls() {
            this.controls = new OrbitControls(this.instance, this.canvas)
            this.controls.enableDamping = true
        }
}