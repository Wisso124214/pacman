import PacMan from './pacman.js';
import { colors } from './consts.js';

class PacMan_Game extends HTMLElement {
  constructor() {
    super();

    this.id = 'pacman-game';
    this.shadow = this.attachShadow({ mode: "open" });

    this.fps = 1000 / 60;

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = 150;
    this.canvas.height = 150;
    const pacman = new PacMan();    
    
    this.shadow.appendChild(this.canvas);
    this.shadow.appendChild(pacman);

    if (this.canvas.getContext) {
      globalThis.ctx = this.canvas.getContext("2d");
    } else {
      alert("ERROR. Canvas is not supported in your browser");
    }
  }

  connectedCallback() {
    //this.printFrame();
    requestAnimationFrame(this.printFrame.bind(this));
  }

  printFrame() {

    this.start = performance.now();

    ctx.fillStyle = colors.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Map shapes 
    ctx.strokeStyle = colors.shapesColor;
    roundedRect(ctx, 12, 12, 150, 150, 15);
    roundedRect(ctx, 19, 19, 150, 150, 9);
    roundedRect(ctx, 53, 53, 49, 33, 10);
    roundedRect(ctx, 53, 119, 49, 16, 6);
    roundedRect(ctx, 135, 53, 49, 33, 10);
    roundedRect(ctx, 135, 119, 25, 49, 10);

    // Dots
    ctx.fillStyle = colors.dotsColor;
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 35, 4, 4);
    }
    
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(115, 51 + i * 16, 4, 4);
    }
    
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 99, 4, 4);
    }

    const pacman = this.shadow.getElementById("pacman");

    pacman.printPacMan(ctx, pacman.getXPacMan(), pacman.getYPacMan(), pacman.direction, pacman.strDirection, pacman.isOpen, colors, pacman.mouthSize, pacman.radius);

    //sleep
    while (performance.now() - this.start < this.fps) { }
    requestAnimationFrame(this.printFrame.bind(this));
  }
}

// Una función auxiliar para dibujar un rectángulo con esquinas redondeadas.
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}

customElements.define('lb-pacman-game', PacMan_Game);