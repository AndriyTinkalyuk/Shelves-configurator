import type EventBus from "../Utils/EventBus";

interface CatalogItem {
    id: string;
    name: string;
    img: string;
}

export default class CatalogManager {
    catalogItems: CatalogItem[];
    bus: EventBus;
    catalogContainer: any;
    private catalogRoot = document.querySelector('.catalog') as HTMLElement | null;

    constructor(bus: EventBus) {
        // Initialize catalog items
        this.catalogItems = [];
        this.bus = bus;
        this.catalogContainer = document.querySelector('.catalog-container');
        

        document.body.addEventListener('click',(event) => this.showCatalog(event));

    }

    addCatalogItem(item: CatalogItem) {
        this.catalogItems.push(item);
    }

    getCatalogItems() {
        return this.catalogItems;
    }

    initCatalog() {
        // Initialize the catalog with some items
        this.addCatalogItem({
            id: '1',
            name: 'Plant',
            img: '/image/plant.webp'
        });
        this.addCatalogItem({
            id: '2',
            name: 'Statue',
            img: '/image/statue.webp'
        });
    }


    renderCatalog() {
        if (this.catalogContainer) {
            this.catalogContainer.innerHTML = ''; // Clear existing items
            this.catalogItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'catalog-item';
                itemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <h3>${item.name}</h3>
                `;
                this.catalogContainer.appendChild(itemElement);

                itemElement.addEventListener('click', () => {
                    this.bus.trigger('catalogItemSelected', [item.id]);
                    console.log('Catalog item selected:', item.id);
                });
            });
        }
    }

   showCatalog = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const hitPoint = target.closest('.point');   
  const inCatalog = target.closest('.catalog');

  if (hitPoint) {
    this.catalogRoot?.classList.add('visible');
    event.stopPropagation();
    return;
  } else {
    if(inCatalog) {
        return
    }
    this.catalogRoot?.classList.remove('visible');
  }

};
}