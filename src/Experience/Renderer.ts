import * as THREE from "three";
import Sizes from "./Utils/Sizes";

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    public instance!: THREE.WebGLRenderer;
    private sizes: Sizes;
    private camera: THREE.PerspectiveCamera;

    constructor(
        sizes: Sizes,
        canvas: HTMLCanvasElement,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera)
    {
        this.canvas = canvas;
        this.scene = scene;
        this.sizes = sizes;
        this.camera = camera;

        this.setInstance();
    }


    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor(0x0b1220, 1);
    }

     resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() { 
        this.instance.render(this.scene, this.camera)
    }
}