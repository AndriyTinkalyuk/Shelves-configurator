import * as THREE from 'three';
import type Resources from '../Utils/Resources';

export default class Shelves {
    private model: THREE.Group<THREE.Object3DEventMap>;

    constructor(scene: THREE.Scene, resources: Resources) {
        
        this.model = (resources.get('shelves') as { scene: THREE.Group<THREE.Object3DEventMap> }).scene;
        console.log(this.model);

        this.model.rotation.y = Math.PI / 2.5; // Rotate the model to face the camera
        this.model.position.set(0, 0, 0); // Set the position of the model
        console.log(this.model);

        this.model.traverse((o : any) => {
            if(o.isMesh) {  
            o.castShadow = true;
            o.receiveShadow = true;
            }
        })
        scene.add(this.model);
    }

}