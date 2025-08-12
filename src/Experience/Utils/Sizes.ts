import EventBus from "./EventBus"

export default class Sizes extends EventBus {
    private container: HTMLElement;
    public width: number;
    public height: number;
    public pixelRatio: number;

    constructor(canvas: HTMLCanvasElement) {
        super()
        this.container = canvas.parentElement!

        // Setup

        this.width = this.container.clientWidth
        this.height = this.container.clientHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        window.addEventListener('resize', () => { 
        this.width = this.container.clientWidth
        this.height = this.container.clientHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
         })
    }
}