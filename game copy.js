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
    this.pelletsWidth = 3.5;
    this.pelletsSeparation = 20;

    this.pacman = new PacMan();    
    this.arrGhosts = [0]

    this.map = [
      '╔════════════╦╦════════════╗',
      '║............||............║',
      '║.┌──┐.┌───┐.||.┌───┐.┌──┐.║',
      '║*|  |.|   |.||.|   |.|  |*║',
      '║.└──┘.└───┘.└┘.└───┘.└──┘.║',
      '║..........................║',
      '║.┌──┐.┌┐.┌──────┐.┌┐.┌──┐.║',
      '║.└──┘.||.└──┐┌──┘.||.└──┘.║',
      '║......||....||....||......║',
      '╚════╗.|└──┐ || ┌──┘|.╔════╝',
      '     ║.|┌──┘ └┘ └──┐|.║     ',
      '     ║.||          ||.║     ',
      '     ║.|| ╔═----═╗ ||.║     ',
      '═════╝.└┘ ║      ║ └┘.╚═════',
      '      .   ║      ║   .      ',
      '═════╗.┌┐ ║      ║ ┌┐.╔═════',
      '     ║.|| ╚══════╝ ||.║     ',
      '     ║.||          ||.║     ',
      '     ║.|| ┌──────┐ ||.║     ',
      '╔════╝.└┘ └──┐┌──┘ └┘.╚════╗',
      '║............||............║',
      '║.┌──┐.┌───┐.||.┌───┐.┌──┐.║',
      '║.└─┐|.└───┘.└┘.└───┘.|┌─┘.║',
      '║*..||................||..*║',
      '╠─┐.||.┌┐.┌──────┐.┌┐.||.┌─╣',
      '╠─┘.└┘.||.└──┐┌──┘.||.└┘.└─╣',
      '║......||....||....||......║',
      '║.┌────┘└──┐.||.┌──┘└────┐.║',
      '║.└────────┘.└┘.└────────┘.║',
      '║..........................║',
      '╚══════════════════════════╝',
    ]

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = 750;
    this.canvas.height = 800;
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
    this.drawMap();

    this.pacman.printPacMan(ctx, this.pacman.getXPacMan(), this.pacman.getYPacMan(), this.pacman.idDirection, this.pacman.direction, this.pacman.isOpen, colors, this.pacman.mouthSize, this.pacman.radius);
    
    for(let a of this.arrGhosts) {
      this.shadow.getElementById("ghost"+a).printGhost();
    }

    //sleep
    while (performance.now() - this.start < this.fps) { }
    requestAnimationFrame(this.printFrame.bind(this));
  }

  drawMap() {

    const hallWidth = 25;
    const sizeOffset = 20;
    const pelletSize = 5;

    const test = [
      '.*.',
      '┌─┐',
      '| |',
      '└─┘'
    ]

    let x0, y0;
    let x1, y1;
    let x2, y2;

    const radius = hallWidth*5/10;

    const map = this.map;
    // const map = test;

    for (let i in map) {
      
      for (let j in map[i]) {
        
        ctx.strokeStyle = colors.shapesColor;
        ctx.lineWidth = this.borderWidth;
        ctx.beginPath()
        
        switch(map[i][j]) {
          case '┌':
            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = hallWidth + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 = hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth + sizeOffset + hallWidth*j;
            y2 = hallWidth/2 + sizeOffset + hallWidth*i;
            break;
          case '┐':
            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth/2 + sizeOffset + hallWidth*j;
            y2 = hallWidth + sizeOffset + hallWidth*i;
            break;
          case '└':
            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth + sizeOffset + hallWidth*j;
            y2 = hallWidth/2 + sizeOffset + hallWidth*i;
            break;
          case '┘':
            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth/2 + sizeOffset + hallWidth*j;
            y2 = 0 + sizeOffset + hallWidth*i;
            break;
          case '─':
            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth + sizeOffset + hallWidth*j;
            y1 = hallWidth/2 + sizeOffset + hallWidth*i;
            break;
          case '|':
            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 = hallWidth + sizeOffset + hallWidth*i;
            break;
          case '.':
            ctx.fillStyle = colors.pelletsColor;
            ctx.fillRect(sizeOffset + hallWidth*j + hallWidth/2, sizeOffset + hallWidth*i + hallWidth/2, this.pelletsWidth, this.pelletsWidth);
            break;
          case '*':
            ctx.fillStyle = colors.pelletsColor;
            ctx.arc(sizeOffset + hallWidth*j + hallWidth/2 + pelletSize*1/3, sizeOffset + hallWidth*i + hallWidth/2 + pelletSize*1/3, pelletSize, 0, Math.PI * 2, true);
            ctx.fill();
            break;
        }

        if (map[i][j] === '┌' || map[i][j] === '┐' || map[i][j] === '└' || map[i][j] === '┘') {
          ctx.moveTo(x0, y0);
          ctx.arcTo(x1, y1, x2, y2, radius)
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
        } else if (map[i][j] === '─' || map[i][j] === '|') {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }

      // ctx.moveTo(0 + sizeOffset, hallWidth/2 + sizeOffset);
      // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth + sizeOffset, hallWidth*2/5);

      // ctx.moveTo(hallWidth/2 + sizeOffset, 0 + sizeOffset);
      // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth + sizeOffset, hallWidth/2 + sizeOffset, hallWidth*2/5);

      // ctx.moveTo(0 + sizeOffset, hallWidth/2 + sizeOffset);
      // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, 0 + sizeOffset, hallWidth*2/5);

    }
    
   
    // Left Top Corner
    // ctx.beginPath();
    // ctx.strokeStyle = colors.shapesColor;
    // ctx.lineWidth = this.borderWidth;
    // ctx.moveTo(hallWidth/2 + sizeOffset, hallWidth + sizeOffset);
    // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth + sizeOffset, hallWidth/2 + sizeOffset, hallWidth*2/5);
    // ctx.stroke();

    // Right Top Corner
    // ctx.beginPath();
    // ctx.strokeStyle = colors.shapesColor;
    // ctx.lineWidth = this.borderWidth;
    // ctx.moveTo(0 + sizeOffset, hallWidth/2 + sizeOffset);
    // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth + sizeOffset, hallWidth*2/5);
    // ctx.stroke();
    
    // Left Bottom Corner
    // ctx.beginPath();
    // ctx.strokeStyle = colors.shapesColor;
    // ctx.lineWidth = this.borderWidth;
    // ctx.moveTo(hallWidth/2 + sizeOffset, 0 + sizeOffset);
    // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth + sizeOffset, hallWidth/2 + sizeOffset, hallWidth*2/5);
    // ctx.stroke();
    
    
    // Right Bottom Corner
    // ctx.beginPath();
    // ctx.strokeStyle = colors.shapesColor;
    // ctx.lineWidth = this.borderWidth;
    // ctx.moveTo(0 + sizeOffset, hallWidth/2 + sizeOffset);
    // ctx.arcTo(hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, hallWidth/2 + sizeOffset, 0 + sizeOffset, hallWidth*2/5);
    // ctx.stroke();
    
    /*
    roundedRect(ctx, 12, 12, 150, 150, 10, this.borderWidth);
    roundedRect(ctx, 19, 19, 150, 150, 6, this.borderWidth);
    roundedRect(ctx, 53, 53, 49, 33, 18, this.borderWidth);
    roundedRect(ctx, 53, 119, 49, 16, 18, this.borderWidth);
    roundedRect(ctx, 135, 53, 49, 33, 18, this.borderWidth);
    roundedRect(ctx, 135, 119, 25, 49, 18, this.borderWidth);
    */
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