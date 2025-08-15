import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Фабрика
export interface ItemOptions {
  position?: THREE.Vector3;
  scale?: number | THREE.Vector3;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export default class ItemFactory {
  private loader = new GLTFLoader();
  private readonly itemPath: Record<string, string>;

  constructor(itemPath: Record<string, string>) {
    this.itemPath = itemPath;
  }

  async create(id: string, opts: ItemOptions = {}): Promise<THREE.Object3D> {
    const path = this.itemPath[id];
    if (!path) throw new Error(`Unknown item id: ${id}`);

    const gltf = await new Promise<GLTF>((res, rej) =>
      this.loader.load(path, res, undefined, rej)
    );

    gltf.scene.traverse(obj => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = opts.castShadow ?? true;
        m.receiveShadow = opts.receiveShadow ?? true;
      }
    });

    if (opts.scale) {
      if (typeof opts.scale === 'number') gltf.scene.scale.setScalar(opts.scale);
      else gltf.scene.scale.copy(opts.scale);
    } else {
      gltf.scene.scale.setScalar(0.3);
    }

    if (opts.position) gltf.scene.position.copy(opts.position);

    return gltf.scene;
  }
}
