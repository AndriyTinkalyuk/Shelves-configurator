import * as THREE from 'three';
import Resources from '../Utils/Resources';
import type { GLTF } from 'three/examples/jsm/Addons.js';

export default class Arena {
    private scene: THREE.Scene;
    private model: THREE.Group;

    constructor(scene: THREE.Scene, resources: Resources) {
        this.scene = scene;
        
        // Витягуємо GLTF і отримуємо сцену
        const gltf = resources.get<GLTF>('arena');
        this.model = gltf.scene;
        
        this.scene.add(this.model);
    }
}
