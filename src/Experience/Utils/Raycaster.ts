import * as THREE from 'three';

export default class Raycaster {
    public readonly raycaster: THREE.Raycaster;

    constructor() { 
        this.raycaster = new THREE.Raycaster();
    }

    getRaycaster() {
        return this.raycaster;
    }
}   