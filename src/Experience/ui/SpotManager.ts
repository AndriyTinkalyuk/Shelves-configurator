import * as THREE from 'three';
import type Sizes from '../Utils/Sizes';
import EventBus from '../Utils/EventBus';

interface Spot {
  position: THREE.Vector3;
  element: HTMLElement | null;
}

export default class SpotManager{
  spots: Spot[];
  camera: THREE.Camera;
  sizes: Sizes;
  raycaster: THREE.Raycaster;
  scene: THREE.Scene;
    bus: EventBus;

  constructor(camera: THREE.Camera, sizes: Sizes, scene: THREE.Scene, bus: EventBus) {
    this.camera = camera;
    this.sizes = sizes;
    this.scene = scene;
    this.spots = [];
    this.bus = bus;

    this.raycaster = new THREE.Raycaster;
  }

  addSpot(spot: Spot) {
   this.spots.push(spot);
  }

  removeSpot(spotElement: HTMLElement) {
    this.spots = this.spots.filter(spot => spot.element !== spotElement);
  }

  getSpots() {
    return this.spots;
  }

  addGridSpots(onclick?: Function) {
    const xs = [-0.35, 0, 0.35];
    const ys = [0.56, 0.935, 1.30];
    const z = 0;

  for (let r = 0; r < ys.length; r++) {
    for (let c = 0; c < xs.length; c++) {
      const position = new THREE.Vector3(xs[c], ys[r], z);             
      
      // робимо DOM-елемент точки
      const el = document.createElement('div');
      el.className = 'point visible';
      el.innerHTML = `
        <div class="point-label">+</div>
        <div class="point-description">Add Decoration</div>
      `;
      // додаємо в DOM
      document.querySelector('.wrapper')?.appendChild(el);

      if (onclick) {
        el.addEventListener('click', () => {
          onclick();
        });
      }

       el.addEventListener('click', () => {
          this.bus.trigger('spotClicked', [{ position: position, element: el}]);
          console.log('Spot clicked:', position);
      });

      // реєструємо в менеджері
      this.addSpot({ position: position, element: el });
    }
  }
}

  
  update() {
    this.spots.forEach(spot => {
      // Update the position or any other properties of the spot
        const screenPosition = spot.position.clone()
        screenPosition.project(this.camera)

        const ndc = new THREE.Vector2(screenPosition.x, screenPosition.y);
        this.raycaster.setFromCamera(ndc, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)
        
        if(intersects.length === 0)
        {
            spot.element?.classList.add('visible')
        }
        else
        {
            const intersectionDistance = intersects[0].distance
            const pointDistance = spot.position.distanceTo(this.camera.position)

            if(intersectionDistance < pointDistance)
            {
                spot.element?.classList.remove('visible')
            }
            else
            {
                spot.element?.classList.add('visible')
            }
        }


        const translateX = screenPosition.x * this.sizes.width * 0.5
        const translateY = - screenPosition.y * this.sizes.height * 0.5

        if (spot.element) {
            spot.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }

    });
  }
}
