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
        this.instance.position.set(-0.7, 1, -3)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

        // межі наближення/віддалення (відстань від камери до target)
        this.controls.minDistance = 1;
        this.controls.maxDistance = 5;
        this.controls.target.set(0, 0.8, 0);
        this.controls.update();
             // не дозволяємо заходити під горизонт
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.001; // трішки менше 90°, щоб не «перескакувало»

        // не даємо перетягнути таргет нижче нуля під час пану
        this.controls.addEventListener('change', () => {
        if (this.controls.target.y < 0) {
            this.controls.target.y = 0;
            this.controls.update();
        }
});

    }
    resize() { 
       this.instance.aspect = this.sizes.width / this.sizes.height
       this.instance.updateProjectionMatrix()
    }
}