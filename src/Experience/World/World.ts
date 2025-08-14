import * as THREE from 'three';
import type Resources from '../Utils/Resources';
import Lighting from './Lighting';
import Shelves from './Shelves';
import Floor from './Floor';

export default class World {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene, resources: Resources) {
        this.scene = scene;

        const shelves = new Shelves(this.scene, resources);
        const lighting = new Lighting(this.scene);
        const floor = new Floor(this.scene);
    }
        
    
}