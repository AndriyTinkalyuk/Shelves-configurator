import * as THREE from 'three';
import type Resources from '../Utils/Resources';
import Lighting from './Lighting';
import Shelves from './Shelves';
import Floor from './Floor';

export default class World {
    private scene: THREE.Scene;
    floor: Floor;
    lighting: Lighting;
    shelves: Shelves;

    constructor(scene: THREE.Scene, resources: Resources) {
        this.scene = scene;

         this.shelves = new Shelves(this.scene, resources);
        this.lighting = new Lighting(this.scene);
        this.floor = new Floor(this.scene);
    }
        
    
}