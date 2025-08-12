import * as THREE from 'three';
import type Resources from '../Utils/Resources';
import Arena from './Arena';

export default class World {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene, resources: Resources) {
        this.scene = scene;

        // Створюємо арену
        const arena = new Arena(this.scene, resources);

        const directionLight = new THREE.DirectionalLight('white', 1);
        directionLight.position.set(5, 10, 7.5);
        this.scene.add(directionLight);
    }
        
    
}