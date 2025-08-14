import * as THREE from 'three';

export default class Floor {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.init();
    }

    private init() {
        const floorGeometry = new THREE.PlaneGeometry(5, 5);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true; 
        floorMaterial.metalness = 0.1;
        floorMaterial.roughness = 0.9;
        this.scene.add(floor);
    }
}
