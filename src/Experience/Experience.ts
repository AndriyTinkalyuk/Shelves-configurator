import * as THREE from 'three';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import EventBus from './Utils/EventBus';

import Renderer from './Renderer';
import Camera from './Camera';
import World from './World/World';

import sources from '../sources';

import SpotManager from './ui/SpotManager';
import CatalogManager from './ui/CatalogManager';
import ItemFactory from './factory/ItemFactory';

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
    public readonly spotManager: SpotManager;
    public readonly bus: EventBus;
    public readonly catalogManager: CatalogManager;
    itemFactory: ItemFactory;

    private constructor(canvas: HTMLCanvasElement) {
        // setup
        this.canvas = canvas;
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.bus = new EventBus();
        this.sizes = new Sizes(this.canvas);
        this.camera = new Camera(this.sizes, this.scene, this.canvas);
        this.renderer = new Renderer(this.sizes, this.canvas, this.scene, this.camera.instance);
        this.resources = new Resources(sources, this.renderer.instance);

        this.catalogManager = new CatalogManager(this.bus);
        this.catalogManager.initCatalog();
        this.catalogManager.renderCatalog();
        this.spotManager = new SpotManager(this.camera.instance, this.sizes, this.scene, this.bus);
        this.spotManager.addGridSpots();
        
        // Координатор (поза фабрикою)
        this.itemFactory = new ItemFactory({
          "1": "/model/plant/potted_plant_02_2k.gltf",
          "2": "/model/statue/marble_bust_01_2k.gltf"
        });

        let pendingSpot: { position: THREE.Vector3; element: HTMLElement | null } | null = null;

        this.bus.on('spotClicked', (payload) => {
          pendingSpot = payload;
        });

        this.bus.on('catalogItemSelected', async (itemId: string) => {
          const position = pendingSpot?.position?.clone();
          const element = pendingSpot?.element;

          const obj = await this.itemFactory.create(itemId, {
            position: position ? position.setY(position.y - 0.15) : undefined
          });
      
          this.scene.add(obj);
          if (element) element.style.display = 'none';
          pendingSpot = null;
        });


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

            document.getElementById('loading-screen')?.classList.add('hidden');
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
        this.spotManager.update();
    }
}
