import Experience from './Experience/Experience'
import './style.css'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

console.log(canvas);

const experience = Experience.init(canvas)