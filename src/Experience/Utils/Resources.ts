// utils/Resources.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';



import EventBus from './EventBus';


// Опис джерел
export type ResourceType = 'gltfModel' | 'texture' | 'cubeTexture' | 'hdrTexture';

export type ResourceSource =
  | { name: string; type: 'gltfModel'; path: string }
  | { name: string; type: 'texture'; path: string }
  | { name: string; type: 'cubeTexture'; path: string[] } 
  | { name: string; type: 'hdrTexture'; path: string };

type Loaders = {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  hdrLoader: RGBELoader;
};

type ItemsMap = Record<string, unknown>;

export default class Resources extends EventBus {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  private sources: ResourceSource[];
  private items: ItemsMap = {};
  private toLoad = 0;
  private loaded = 0;

  private loaders!: Loaders;
  private pmremGenerator!: THREE.PMREMGenerator;

  

  constructor(sources: ResourceSource[], renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    super();

    this.renderer = renderer;
    this.scene = scene;

    this.sources = sources;
    this.toLoad = this.sources.length;

    this.setLoaders();
    this.startLoading();
  }

  private setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
      hdrLoader: new RGBELoader(),
    };
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
  }

  private startLoading() {
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => this.sourceLoaded(source.name, file),
          undefined,
          (err) => {
            console.error(`Error loading GLTF ${source.name}:`, err);
            this.sourceLoaded(source.name, null);
          }
        );
      }

      if (source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path,
          (tex) => this.sourceLoaded(source.name, tex),
          undefined,
          (err) => {
            console.error(`Error loading texture ${source.name}:`, err);
            this.sourceLoaded(source.name, null);
          }
        );
      }

      if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (cube) => this.sourceLoaded(source.name, cube),
          undefined,
          (err) => {
            console.error(`Error loading cubeTexture ${source.name}:`, err);
            this.sourceLoaded(source.name, null);
          }
        );
      }

      if (source.type === 'hdrTexture') {
        this.loaders.hdrLoader.load(
          source.path,
          (hdrTexture) => {
            hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
            const envMap = this.pmremGenerator.fromEquirectangular(hdrTexture).texture;
            this.items[source.name] = { envMap, hdrTexture };
            this.sourceLoaded(source.name, this.items[source.name]);
          },
          undefined,
          (err) => {
            console.error(`Error loading HDRI ${source.name}:`, err);
            this.sourceLoaded(source.name, null);
          }
        );
      }
    }
  }

  private sourceLoaded(name: string, file: unknown) {
    this.items[name] = file as unknown;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      // Коли все завантажилось — тригеримо подію
      this.trigger('ready', [this.items]);
    }

  }

  // Публічний доступ до ресурсу
public get<T = unknown>(name: string): T {
    return this.items[name] as T;
}


}
