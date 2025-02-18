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
    const borderDoubleMargin = 8;

    const test = [
      '.*.',
      '┌─┐',
      '| |',
      '└─┘',
      '╔══╦╦══╗',
      '║  ||  ║',
      '║      ║',
      '╠─┐  ┌─╣',
      '╠─┘  └─╣',
      '║      ║',
      '╚══════╝',
    ]

    let x0, y0;
    let x1, y1;
    let x2, y2;
    let bx0, by0;
    let bx1, by1;
    let bx2, by2; 
    let radiusDoubleBorder;
    let isDownBorderLeft = null;
    let isDownBorderRight = null;
    let isDownBorderDown = null;

    const radius = hallWidth*5/10;

    // const map = this.map;
    const map = this.map;

    for (let i in map) {
      for (let j in map[i]) {
        
        ctx.strokeStyle = colors.shapesColor;
        ctx.lineWidth = this.borderWidth;
        ctx.beginPath()
        
        switch(map[i][j]) {
          case '.':

            ctx.fillStyle = colors.dotsColor;
            ctx.fillRect(sizeOffset + hallWidth*j + hallWidth/2, sizeOffset + hallWidth*i + hallWidth/2, this.dotsWidth, this.dotsWidth);
            break;
          case '*':

            ctx.fillStyle = colors.dotsColor;
            ctx.arc(sizeOffset + hallWidth*j + hallWidth/2 + pelletSize*1/3, sizeOffset + hallWidth*i + hallWidth/2 + pelletSize*1/3, pelletSize, 0, Math.PI * 2, true);
            ctx.fill();
            break;

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
          case '║':

            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 = hallWidth + sizeOffset + hallWidth*i;
            
            bx0 = x0 - borderDoubleMargin;
            by0 = y0;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1;
            break;
          case '═':

            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth + sizeOffset + hallWidth*j;
            y1 = hallWidth/2 + sizeOffset + hallWidth*i;
            
            bx0 = x0;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1;
            by1 = y1 - borderDoubleMargin;
            break;
          case '╔':

            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = hallWidth + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 = hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth + sizeOffset + hallWidth*j;
            y2 = hallWidth/2 + sizeOffset + hallWidth*i;

            bx0 = x0 - borderDoubleMargin;
            by0 = y0;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2;
            by2 = y2 - borderDoubleMargin;
            radiusDoubleBorder = radius*3/2;
            break;
          case '╗':

            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth/2 + sizeOffset + hallWidth*j;
            y2 = hallWidth + sizeOffset + hallWidth*i;

            bx0 = x0;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2;
            by2 = y2 - borderDoubleMargin;
            radiusDoubleBorder = radius*3/2;
            break;
          case '╚':
            
            x0 = hallWidth/2 + sizeOffset + hallWidth*j;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth + sizeOffset + hallWidth*j;
            y2 = hallWidth/2 + sizeOffset + hallWidth*i;

            bx0 = x0 - borderDoubleMargin;
            by0 = y0;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2 - borderDoubleMargin;
            radiusDoubleBorder = radius*3/2;
            by2 = y2;
            break;
          case '╝':
            
            x0 = 0 + sizeOffset + hallWidth*j;
            y0 = hallWidth/2 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j;
            y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
            x2 = hallWidth/2 + sizeOffset + hallWidth*j;
            y2 = 0 + sizeOffset + hallWidth*i;
            
            bx0 = x0 - borderDoubleMargin;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2 - borderDoubleMargin;
            by2 = y2;
            radiusDoubleBorder = radius*1/3;
            break;
          case '╠':

            x0 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y1 = hallWidth + sizeOffset + hallWidth*i;

            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderLeft === null) {
              isDownBorderLeft = i % 2;
            }

            if (isDownBorderLeft % 2 === i % 2) {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = 0 + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;

            } else {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = hallWidth + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 = hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;
            }

            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderLeft = i % 2;
          /*case '╣':

            x0 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y1 = hallWidth + sizeOffset + hallWidth*i;

            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderRight === null) {
              isDownBorderRight = i % 2;
            }

            if (isDownBorderRight % 2 === i % 2) {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = 0 + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;

            } else {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = hallWidth + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 = hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;
            }

            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderRight = i % 2;
          
          case '╦':

            x0 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y0 = 0 + sizeOffset + hallWidth*i;
            x1 = hallWidth/2 + sizeOffset + hallWidth*j - borderDoubleMargin;
            y1 = hallWidth + sizeOffset + hallWidth*i;

            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderLeft === null) {
              isDownBorderLeft = i % 2;
            }

            if (isDownBorderLeft % 2 === i % 2) {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = 0 + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 =  hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;

            } else {
              x0 = hallWidth/2 + sizeOffset + hallWidth*j;
              y0 = hallWidth + sizeOffset + hallWidth*i;
              x1 = hallWidth/2 + sizeOffset + hallWidth*j;
              y1 = hallWidth/2 + sizeOffset + hallWidth*i;
              x2 = hallWidth + sizeOffset + hallWidth*j;
              y2 = hallWidth/2 + sizeOffset + hallWidth*i;
            }

            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderLeft = i % 2;
            break;
            */
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

        } else if (map[i][j] === '╔' || map[i][j] === '╗' || map[i][j] === '╚' || map[i][j] === '╝') {
          ctx.moveTo(x0, y0);
          ctx.arcTo(x1, y1, x2, y2, radius)
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.moveTo(bx0, by0);
          ctx.arcTo(bx1, by1, bx2, by2, radiusDoubleBorder)
          ctx.lineTo(bx2, by2);
          ctx.stroke();
          
        } else if (map[i][j] === '═' || map[i][j] === '║') {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(bx0, by0);
          ctx.lineTo(bx1, by1);
          ctx.stroke();
        }
      }
    }
  }
}

customElements.define('lb-pacman-game', PacMan_Game);