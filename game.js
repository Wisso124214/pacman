import PacMan from './pacman.js';
import Ghost from './ghost.js';
import { colors } from './consts.js';

class PacMan_Game extends HTMLElement {
  constructor() {
    super();

    this.id = 'pacman-game';
    this.shadow = this.attachShadow({ mode: "open" });

    this.fps = 1000 / 60;
    this.borderWidth = 1.25;
    this.dotsWidth = 3.5;
    this.dotsSeparation = 20;

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = 150;
    this.canvas.height = 150;
    
    const pacman = new PacMan();    
    const ghost = new Ghost();
    
    this.shadow.appendChild(this.canvas);

    if (this.canvas.getContext) {
      globalThis.ctx = this.canvas.getContext("2d");
    } else {
      alert("ERROR. Canvas is not supported in your browser");
    }

    this.shadow.appendChild(pacman);
    this.shadow.appendChild(ghost);
  }

  connectedCallback() {
    requestAnimationFrame(this.printFrame.bind(this));
  }

  printFrame() {
    this.start = performance.now();

    ctx.fillStyle = colors.backgroundColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Map shapes 
    ctx.strokeStyle = colors.shapesColor;
    roundedRect(ctx, 12, 12, 150, 150, 15, this.borderWidth);
    roundedRect(ctx, 19, 19, 150, 150, 9, this.borderWidth);
    roundedRect(ctx, 53, 53, 49, 33, 10, this.borderWidth);
    roundedRect(ctx, 53, 119, 49, 16, 6, this.borderWidth);
    roundedRect(ctx, 135, 53, 49, 33, 10, this.borderWidth);
    roundedRect(ctx, 135, 119, 25, 49, 10, this.borderWidth);

    // Dots
    ctx.fillStyle = colors.dotsColor;
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * this.dotsSeparation, 35, this.dotsWidth, this.dotsWidth);
    }
    
    /*for (let i = 0; i < 6; i++) {
      ctx.fillRect(115, 51 + i * this.dotsSeparation, this.dotsWidth, this.dotsWidth);
    }*/
    
    /*for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * this.dotsSeparation, 99, this.dotsWidth, this.dotsWidth);
    }*/

    const pacman = this.shadow.getElementById("pacman");

    pacman.printPacMan(ctx, pacman.getXPacMan(), pacman.getYPacMan(), pacman.direction, pacman.strDirection, pacman.isOpen, colors, pacman.mouthSize, pacman.radius);
    this.shadow.getElementById("ghost").printGhost();

    //sleep
    while (performance.now() - this.start < this.fps) { }
    requestAnimationFrame(this.printFrame.bind(this));
  }
}

// Una función auxiliar para dibujar un rectángulo con esquinas redondeadas.
function roundedRect(ctx, x, y, width, height, radius, borderWidth) {

  if (typeof borderWidth === 'undefined') {
    borderWidth = 1;
  }

  for (let i = 0; i < borderWidth; i+=.25) {
    ctx.beginPath();
    ctx.moveTo(x-i, y-i + radius);
    ctx.arcTo(x-i, y-i + height, x-i + radius, y-i + height, radius);
    ctx.arcTo(x-i + width, y-i + height, x-i + width, y-i + height - radius, radius);
    ctx.arcTo(x-i + width, y-i, x-i + width - radius, y-i, radius);
    ctx.arcTo(x-i, y-i, x-i, y-i + radius, radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x-i, y+i + radius);
    ctx.arcTo(x-i, y+i + height, x-i + radius, y+i + height, radius);
    ctx.arcTo(x-i + width, y+i + height, x-i + width, y+i + height - radius, radius);
    ctx.arcTo(x-i + width, y+i, x-i + width - radius, y+i, radius);
    ctx.arcTo(x-i, y+i, x-i, y+i + radius, radius);
    ctx.stroke();
  }
}

customElements.define('lb-pacman-game', PacMan_Game);