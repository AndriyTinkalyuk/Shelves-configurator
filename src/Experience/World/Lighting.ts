import * as THREE from 'three';

export default class Lighting {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.init();
    }

    private init() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
       
        directionalLight.position.set(4, 4, -4);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 10;
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.normalBias = 0.05;
        this.scene.add(directionalLight);

        directionalLight.target.position.set(0, 1, 0);
        this.scene.add(directionalLight.target);

        // const helper = new THREE.DirectionalLightHelper(directionalLight);
        // this.scene.add(helper);
       
    }
}
