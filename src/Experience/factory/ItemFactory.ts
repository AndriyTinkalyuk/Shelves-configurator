import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import type EventBus from '../Utils/EventBus';
export default class ItemFactory {
    scene: THREE.Scene;
    bus: EventBus;
    itemPath: { [key: string]: string };
    loader: GLTFLoader;
    position: THREE.Vector3 | null;
    element: HTMLElement | null;

    constructor(scene: THREE.Scene, bus: EventBus) {
        this.loader = new GLTFLoader();
        this.scene = scene;
        this.bus = bus;
        this.position = null;
        this.element = null;

        this.itemPath = {
            "1" : "/model/plant/potted_plant_02_2k.gltf",
            "2" : "/model/statue/marble_bust_01_2k.gltf"
        };

        this.bus.on('catalogItemSelected', (itemId: string) => {
            this.createItem(itemId);
            if(this.element){
                this.element.style.display = 'none';
            }
        });

        this.bus.on('spotClicked', (payload) => {
            this.position = payload.position;
            this.element = payload.element;
        });
    }

    createItem(id: string) {
        const item = this.itemPath[id];
        if (item) {
            this.loader.load(item, (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                gltf.scene.scale.set(0.3, 0.3, 0.3);
                if (this.position) {
                    gltf.scene.position.copy(this.position);
                    gltf.scene.position.y -= 0.15;
                }
                this.scene.add(gltf.scene);
            })
        }
    }
}