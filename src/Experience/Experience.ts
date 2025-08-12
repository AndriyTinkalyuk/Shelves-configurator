import * as THREE from 'three';

import Renderer from './Renderer';
import Sizes from './Utils/Sizes';
import Camera from './Camera';
import World from './World/World';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import sources from '../sources';

export default class Experience {
    private static _instance: Experience | null = null;

    public readonly canvas: HTMLCanvasElement;
    public readonly scene: THREE.Scene;
    public readonly renderer: Renderer;
    public readonly sizes: Sizes;
    public readonly camera: Camera;
    public world: World | null = null;
    public readonly time: Time;
    public readonly resources: Resources;

    private constructor(canvas: HTMLCanvasElement) {
        // setup
        this.canvas = canvas;
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.sizes = new Sizes(this.canvas);
        this.camera = new Camera(this.sizes, this.scene, this.canvas);
        this.renderer = new Renderer(this.sizes, this.canvas, this.scene, this.camera.instance);
        this.resources = new Resources(sources, this.renderer.instance, this.scene);
       

        // реакція на resize
        this.sizes.on('resize', () => {
            this.resize();
            
        });

        // реакція на tick
        this.time.on('tick', () => {
            this.update();
        });

        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.world = new World(this.scene, this.resources);
        });
    }

    static init(canvas: HTMLCanvasElement): Experience {
        console.log('Experience created');
        if (!this._instance) {
            this._instance = new Experience(canvas);
        }
        return this._instance;
    }

    static get instance(): Experience | null {
        if (!this._instance) {
            console.warn('Experience not initialized');
        }
        return this._instance;
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();

        requestAnimationFrame(() => {
            this.renderer.instance.render(this.scene, this.camera.instance);
        });
    }

    update() {
        this.renderer.update();
    }
}
