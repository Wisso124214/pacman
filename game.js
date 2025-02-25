import PacMan from './pacman.js';
import Ghost from './ghost.js';
import { colors } from './consts.js';

class PacMan_Game extends HTMLElement {
  constructor() {
    super();
    
    this.id = 'pacman-game';
    this.shadow = this.attachShadow({ mode: "open" });

    this.initializeVariables();

    this.pacman = new PacMan();    
    this.arrGhosts = [0]

    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
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
  }

  initializeVariables() {
    globalThis.fps = 1000 / 20;

    this.hallWidth = 22;
    // this.sizeOffset = (Math.abs((this.hallWidth * this.map.length) - this.canvas.width))*2;
    this.sizeOffset = 20;
    this.borderWidth = 3;
    this.pelletsWidth = 3.5;
    this.canvasWidth = 650;
    this.canvasHeight = 760;
    this.score = 0;
    
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
      '     ║.|| ╔══--══╗ ||.║     ',
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

    const map = this.map;
    const pelletSize = 6;
    const borderDoubleMargin = 12;

    let x0, y0;
    let x1, y1;
    let x2, y2;
    let bx0, by0;
    let bx1, by1;
    let bx2, by2; 
    let radiusDoubleBorder1;
    let radiusDoubleBorder2;
    let isDownBorderLeft = null;
    let isDownBorderRight = null;
    let isDownBorderDown = null;

    const radius = this.hallWidth*5/10;

    for (let i in map) {
      for (let j in map[i]) {
        
        ctx.strokeStyle = colors.shapesColor;
        ctx.lineWidth = this.borderWidth;
        ctx.beginPath()
        
        switch(map[i][j]) {
          case '.':

            ctx.fillStyle = colors.pelletsColor;
            ctx.fillRect(this.sizeOffset + this.hallWidth*j + this.hallWidth/2 - this.pelletsWidth/2, this.sizeOffset + this.hallWidth*i + this.hallWidth/2 - this.pelletsWidth/2, this.pelletsWidth, this.pelletsWidth);
            break;
          case '*':

            ctx.fillStyle = colors.pelletsColor;
            ctx.arc(this.sizeOffset + this.hallWidth*j + this.hallWidth/2, this.sizeOffset + this.hallWidth*i + this.hallWidth/2, pelletSize, 0, Math.PI * 2, true);
            ctx.fill();
            break;

          case '┌':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            break;
          case '┐':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y2 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            break;
          case '└':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y0 = 0 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            break;
          case '┘':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y2 = 0 + this.sizeOffset + this.hallWidth*i;
            break;
          case '─':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            break;
          case '|':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y0 = 0 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            break;
          case '║':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y0 = 0 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y1 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            
            bx0 = x0 - borderDoubleMargin;
            by0 = y0;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1;
            break;
          case '═':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            x1 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            
            bx0 = x0;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1;
            by1 = y1 - borderDoubleMargin;
            break;
          case '╔':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y0 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;

            bx0 = x0 - borderDoubleMargin;
            by0 = y0;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2;
            by2 = y2 - borderDoubleMargin;
            radiusDoubleBorder2 = radius*3/2;
            radiusDoubleBorder1 = radius/2;
            break;
          case '╗':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin;
            x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
            y2 = this.hallWidth + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;

            bx0 = x0;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1 + borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2 + borderDoubleMargin;
            by2 = y2;

            radiusDoubleBorder2 = radius*3/2;
            radiusDoubleBorder1 = radius/2;

            break;
          case '╚':
            
            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y0 = 0 + this.sizeOffset + this.hallWidth*i - borderDoubleMargin/2;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i - borderDoubleMargin/2;
            x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i - borderDoubleMargin/2;

            bx0 = x0 - borderDoubleMargin;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 + borderDoubleMargin;
            bx2 = x2 - borderDoubleMargin/2;
            by2 = y2 + borderDoubleMargin;
            
            radiusDoubleBorder1 = radius/2;
            radiusDoubleBorder2 = radius*3/2;
            break;
          case '╝':
            
            x0 = 0 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
            y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y2 = 0 + this.sizeOffset + this.hallWidth*i;
            
            bx0 = x0 - borderDoubleMargin;
            by0 = y0 - borderDoubleMargin;
            bx1 = x1 - borderDoubleMargin;
            by1 = y1 - borderDoubleMargin;
            bx2 = x2 - borderDoubleMargin;
            by2 = y2;

            radiusDoubleBorder1 = radius*3/2;
            radiusDoubleBorder2 = radius/2;
            break;
          case '╠':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
            y0 = 0 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
            y1 = this.hallWidth + this.sizeOffset + this.hallWidth*i;

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderLeft === null) {
              isDownBorderLeft = i % 2;
            }

            if (isDownBorderLeft % 2 === i % 2) {
              x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y0 = 0 + this.sizeOffset + this.hallWidth*i;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;

            } else {
              x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y0 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
              y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            }

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius*2/3)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderLeft = i % 2;
            break;
          case '╣':

            x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y0 = 0 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j + borderDoubleMargin/2;
            y1 = this.hallWidth + this.sizeOffset + this.hallWidth*i;

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderRight === null) {
              isDownBorderRight = i % 2;
            }

            if (isDownBorderRight % 2 === i % 2) {
              x0 = 0 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y2 = 0 + this.sizeOffset + this.hallWidth*i;

            } else {
              x0 = 0 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y1 =  this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
              x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j - borderDoubleMargin/2;
              y2 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
            }

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius*2/3)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderRight = i % 2;
            break;
          
          case '╦':

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i - borderDoubleMargin/2;
            x1 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i - borderDoubleMargin/2;

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();


            if (isDownBorderDown === null) {
              isDownBorderDown = j % 2;
            }

            if (isDownBorderDown % 2 === j % 2) {
              x0 = 0 + this.sizeOffset + this.hallWidth*j;
              y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j ;
              y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
              x2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
              y2 = this.hallWidth + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
              
            } else {
              x0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
              y0 = this.hallWidth + this.sizeOffset + this.hallWidth*i;
              x1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*j;
              y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
              x2 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
              y2 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i + borderDoubleMargin/2;
            }

            ctx.beginPath()
            ctx.moveTo(x0, y0);
            ctx.arcTo(x1, y1, x2, y2, radius*2/3)
            ctx.lineTo(x2, y2);
            ctx.stroke();

            isDownBorderDown = j % 2;
            break;
          
          case '-':

            ctx.strokeStyle = colors.pelletsColor;

            x0 = 0 + this.sizeOffset + this.hallWidth*j;
            y0 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            x1 = this.hallWidth + this.sizeOffset + this.hallWidth*j;
            y1 = this.hallWidth/2 + this.sizeOffset + this.hallWidth*i;
            break;
        }

        if (map[i][j] === '┌' || map[i][j] === '┐' || map[i][j] === '└' || map[i][j] === '┘') {
          ctx.moveTo(x0, y0);
          ctx.arcTo(x1, y1, x2, y2, radius)
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
        } else if (map[i][j] === '-' || map[i][j] === '─' || map[i][j] === '|') {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();

        } else if (map[i][j] === '╔' || map[i][j] === '╗' || map[i][j] === '╚' || map[i][j] === '╝') {
          ctx.moveTo(x0, y0);
          ctx.arcTo(x1, y1, x2, y2, radiusDoubleBorder1)
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.moveTo(bx0, by0);
          ctx.arcTo(bx1, by1, bx2, by2, radiusDoubleBorder2)
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

    const text = 'Score: ' + this.score;

    ctx.font="bold 28px Courier New";
    ctx.fillText(text, this.sizeOffset*1.5, this.canvas.height - 20);

    this.printPacmanLives(this.pacman.getLives());
  }

  printPacmanLives(lives) {

    const thisMouthSize = 3;
    const radius = 15;

    const x = this.canvas.width - this.sizeOffset*2;
    const y = this.canvas.height - radius*2;
    

    for (let i = 0; i > -lives; i--) {
      ctx.fillStyle = colors.pacManColor;
      ctx.beginPath();

      const lifeX = x + radius*2*i + radius*i/3;
      const lifeY = y;
      
      let mouthX = lifeX - thisMouthSize;
      let mouthY = lifeY;

      ctx.lineTo(mouthX, mouthY);
      ctx.arc(lifeX, lifeY, radius, Math.PI / 7 + (Math.PI / 2) * 0, -Math.PI / 7 + (Math.PI / 2) * 0, false);
      
      ctx.fill();
    }
  }

  getHallWidth() {
    return this.hallWidth;
  }

  getSizeOffset() {
    return this.sizeOffset;
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
  }

  increaseScore(increase) {
    this.score += increase;
  }

  isColliding(x, y) {
    const xMap = Math.ceil(x / this.hallWidth);
    const yMap = Math.floor(y / this.hallWidth);

    const nonWallChars = [' ', '*', '.'];
    const mapChar = this.map[yMap][xMap-1];

    for (let n in nonWallChars) {
      if (mapChar === nonWallChars[n]) {
        return {
          x: xMap,
          y: yMap,
          char: mapChar,
        };
      }
    }

    return {
      x: xMap,
      y: yMap,
      char: 'wall',
    };
  }

  checkIsInIntersection(x, y) {
    let ammo = 0;

    if (this.isColliding(x, y - this.hallWidth).char !== 'wall') {
      ammo++;
    }
    if (this.isColliding(x, y + this.hallWidth).char !== 'wall') {
      ammo++;
    }
    if (this.isColliding(x - this.hallWidth, y).char !== 'wall') {
      ammo++;
    }
    if (this.isColliding(x + this.hallWidth, y).char !== 'wall') {
      ammo++;
    }

    return ammo >= 3;
  }

  setGhostsVulnerable() {
    for(let a of this.arrGhosts) {
      this['ghost'+a].setVulnerable();
    }
  }
}

customElements.define('lb-pacman-game', PacMan_Game);