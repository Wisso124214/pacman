import PacMan from './pacman.js';
import Ghost from './ghost.js';
import { colors } from './consts.js';

class PacMan_Game extends HTMLElement {
  constructor() {
    super();
    
    globalThis.fps = 1000 / 20;

    this.id = 'pacman-game';
    this.shadow = this.attachShadow({ mode: "open" });

    this.borderWidth = 3;
    this.dotsWidth = 3.5;
    this.dotsSeparation = 20;

    this.pacman = new PacMan();    
    this.arrGhosts = [0]

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = 300;
    this.canvas.height = 300;
    this.shadow.appendChild(this.canvas);

    if (this.canvas.getContext) {
      globalThis.ctx = this.canvas.getContext("2d");
    } else {
      alert("ERROR. Canvas is not supported in your browser");
    }

    this.shadow.appendChild(this.pacman);

    for(let a of this.arrGhosts) {

      this['ghost'+a] = new Ghost(a);
      this.shadow.appendChild(this['ghost'+a]);
    }
    
    globalThis.onkeydown = (e) => {
      
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
          this.shadow.getElementById('pacman').setDirection('right');
      } else 
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
          this.shadow.getElementById('pacman').setDirection('down');
      } else 
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
          this.shadow.getElementById('pacman').setDirection('left');
      } else 
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
          this.shadow.getElementById('pacman').setDirection('up');
      }
      
      /*
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        for(let a of this.arrGhosts) {
          this.shadow.getElementById('ghost'+a).setDirection('right');
        }
      } else 
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        for(let a of this.arrGhosts) {
          this.shadow.getElementById('ghost'+a).setDirection('down');
        }
      } else 
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        for(let a of this.arrGhosts) {
          this.shadow.getElementById('ghost'+a).setDirection('left');
        }
      } else 
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        for(let a of this.arrGhosts) {
          this.shadow.getElementById('ghost'+a).setDirection('up');
        }
      }
      */
    }
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
    this.drawMapShapes();

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

    this.pacman.printPacMan(ctx, this.pacman.getXPacMan(), this.pacman.getYPacMan(), this.pacman.idDirection, this.pacman.direction, this.pacman.isOpen, colors, this.pacman.mouthSize, this.pacman.radius);
    
    for(let a of this.arrGhosts) {
      this.shadow.getElementById("ghost"+a).printGhost();
    }

    //sleep
    while (performance.now() - this.start < this.fps) { }
    requestAnimationFrame(this.printFrame.bind(this));
  }

  drawMapShapes() {
    roundedRect(ctx, 12, 12, 150, 150, 10, this.borderWidth);
    roundedRect(ctx, 19, 19, 150, 150, 6, this.borderWidth);
    roundedRect(ctx, 53, 53, 49, 33, 18, this.borderWidth);
    roundedRect(ctx, 53, 119, 49, 16, 18, this.borderWidth);
    roundedRect(ctx, 135, 53, 49, 33, 18, this.borderWidth);
    roundedRect(ctx, 135, 119, 25, 49, 18, this.borderWidth);
  }
}

// Una función auxiliar para dibujar un rectángulo con esquinas redondeadas.
function roundedRect(ctx, x, y, width, height, radiusPercent, borderWidth) {

  if (typeof borderWidth === 'undefined') {
    borderWidth = 1;
  }

  const radius = ((width + height) / 2) * (radiusPercent / 100);

  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}

customElements.define('lb-pacman-game', PacMan_Game);