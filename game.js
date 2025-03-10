import PacMan from './pacman.js';
import Ghost from './ghost.js';
import { colors } from './consts.js';

class PacMan_Game extends HTMLElement {
  constructor() {
    super();
    
    this.id = 'pacman-game';
    this.shadow = this.attachShadow({ mode: "open" });

    this.initialize();

    this.pacman = new PacMan('p1');
    this.ghosts = [
      {
        color: colors.ghost.colors[0],
      },
      {
        color: colors.ghost.colors[3],
      },
      {
        color: colors.ghost.colors[2],
        // player: 'p1',
      },
      {
        color: colors.ghost.colors[1],
      },
    ]
    // this.ghosts = [
    //   {
    //     color: colors.ghost.colors[0],
    //   },
    // ]

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

    for(let a in this.ghosts) {
      this['ghost'+a] = new Ghost(a, this.ghosts[a].color, this.ghosts[a].player);
      this.shadow.appendChild(this['ghost'+a]);
    }

    globalThis.onkeydown = (e) => this.manualMovement(e);
  }

  initialize() {
    globalThis.fps = 1000 / 30;
    // globalThis.fps = 1000 / 1000;
    
    this.reviveTime = 1000;
    this.hallWidth = 22;
    // this.sizeOffset = (Math.abs((this.hallWidth * this.map.length) - this.canvas.width))*2;
    this.sizeOffset = 20;
    this.borderWidth = 3;
    this.pelletsWidth = 3.5;
    this.canvasWidth = 650;
    this.canvasHeight = 760;
    this.score = 0;
    this.gameState = 'playing';

    this.nonWallChars = [' ', '*', '.', '-', 't'];
    this.tunnels = [
      [
        {
          x: 5,
          y: 14,
        },
        {
          x: 22,
          y: 14,
        }
      ],
    ]

    /**
     * Caption:
     *  t: tunnel
     *  .: pellet
     *  *: super pellet
     */
    
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
      't     .   ║      ║   .    t ',
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
    ];
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

    if (this.gameState !== 'game-over') {
      this.pacman.printPacMan(ctx, this.pacman.getXPacMan(), this.pacman.getYPacMan(), this.pacman.idDirection, this.pacman.direction, this.pacman.isOpen, colors, this.pacman.mouthSize, this.pacman.radius);
    
      for(let a in this.ghosts) {
        this.shadow.getElementById('ghost'+a).printGhost();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.font = "bold 28px Courier New";
      ctx.fillText('GAME OVER', this.canvas.width/2 - 70, (18 * this.hallWidth) + this.sizeOffset);  
      
      this.gameOver();
    }

    const text = 'Score: ' + this.score;
    
    ctx.beginPath();
    ctx.fillStyle = colors.pelletsColor;
    ctx.font = "bold 28px Courier New";
    ctx.fillText(text, this.sizeOffset*1.5, this.canvas.height - 20);

    this.printPacmanLives(this.pacman.getLives());

    this.checkGameState();
    this.checkIsOnTunnel();

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
    const xMap = Math.ceil(parseInt(x, 10) / this.hallWidth);
    const yMap = Math.floor(parseInt(y, 10) / this.hallWidth);

    if (typeof this.map[yMap] === 'undefined' || typeof this.map[yMap][xMap] === 'undefined') {
      return {
        x: xMap,
        y: yMap,
        char: 'wall',
      }
    }
    const mapChar = this.map[yMap][xMap-1];

    for (let n in this.nonWallChars) {
      if (mapChar === this.nonWallChars[n]) {
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

  checkIsFreeDirection = (x, y, direction) => {
    switch (direction) {
      case 'right':
        x += this.hallWidth;
        break;
      case 'down':
        y += this.hallWidth;
        break;
      case 'left':
        x -= this.hallWidth;
        break;
      case 'up':
        y -= this.hallWidth;
    }

    const objCollision = this.isColliding(x, y);

    return objCollision.char !== 'wall';
  }

  checkIsInIntersection(x, y) {
    let ammo = [];

    if (this.isColliding(x, y - this.hallWidth).char !== 'wall') {
      ammo.push('up')
    }
    if (this.isColliding(x, y + this.hallWidth).char !== 'wall') {
      ammo.push('down')
    }
    if (this.isColliding(x - this.hallWidth, y).char !== 'wall') {
      ammo.push('left')
    }
    if (this.isColliding(x + this.hallWidth, y).char !== 'wall') {
      ammo.push('right')
    }

    return ammo;
  }

  setGhostsVulnerable() {
    for(let a in this.ghosts) {
      this['ghost'+a].setVulnerable();
    }
  }

  getGameCharacters() {
    let characters = [this.pacman]

    for (let g in this.ghosts) {
      characters.push(this['ghost'+g])
    }

    return characters;
  }

  manualMovement(e) {

    const characters = this.getGameCharacters();

    for (let a in characters) {
      const player = characters[a].player;

      if (player === 'p1') {
        
        if (e.key === 'ArrowRight') {
          this[characters[a].id].setNextDirection('right');
        } else 
        if (e.key === 'ArrowDown') {
            this[characters[a].id].setNextDirection('down');
        } else 
        if (e.key === 'ArrowLeft') {
            this[characters[a].id].setNextDirection('left');
        } else 
        if (e.key === 'ArrowUp') {
            this[characters[a].id].setNextDirection('up');
        }
      } else if (player === 'p2') {
  
        if (e.key === 'd' || e.key === 'D') {
          this[characters[a].id].setNextDirection('right');
        } else 
        if (e.key === 's' || e.key === 'S') {
            this[characters[a].id].setNextDirection('down');
        } else 
        if (e.key === 'a' || e.key === 'A') {
            this[characters[a].id].setNextDirection('left');
        } else 
        if (e.key === 'w' || e.key === 'W') {
            this[characters[a].id].setNextDirection('up');
        }
      }

      if (e.key === 'p' || e.key === 'P') {
        if (this.gameState === 'playing') {
          this[characters[a].id].pause();
          this.gameState = 'paused';
        } else if (this.gameState !== 'game-over') {
          this[characters[a].id].continue();
          this.gameState = 'playing';
        }
      }
    }
  }

  getOppositeDirection(direction) {
    let opposite = '';

    switch(direction) {
      case 'up':
        opposite = 'down';
        break;
      case 'down':
        opposite = 'up';
        break;
      case 'left':
        opposite = 'right';
        break;
      case 'right':
        opposite = 'left';
        break;
    }

    return opposite;
  }

  getPacman() {
    return this.pacman;
  }

  getReviveTime() {
    return this.reviveTime;
  }

  setGameState(state) {
    this.gameState = state;
  }

  getGameState() {
    return this.gameState;
  }

  checkIsOnTunnel() {
    const characters = this.getGameCharacters();
    let x, y;

    for (let a in characters) {
      if (characters[a].id === 'pacman') {
        x = characters[a].getXPacMan();
        y = characters[a].getYPacMan();
      } else if (characters[a].id.includes('ghost')) {
        x = characters[a].x;
        y = characters[a].y;
      }
      x = x - this.sizeOffset;
      y = y - this.sizeOffset;

      const objCollision = this.isColliding(x, y);
      const offsetTeleport = 1.5*this.hallWidth;

      if (objCollision.char === 't') {
        for (let ti in this.tunnels) {
          for (let tj in this.tunnels[ti]) {
            // check tunnel direction
            if (this.tunnels[ti][0].y === this.tunnels[ti][1].y) {
              //x

              if (objCollision.x < this.tunnels[ti][tj].x) {
                characters[a].setPosition(this.map[0].length * this.hallWidth - offsetTeleport - this.sizeOffset, this.tunnels[ti][tj].y * this.hallWidth + this.sizeOffset);
              } else if (objCollision.x > this.tunnels[ti][tj].x) {
                characters[a].setPosition(offsetTeleport + this.sizeOffset, this.tunnels[ti][tj].y * this.hallWidth + this.sizeOffset);
              }
            } else if (this.tunnels[ti][0].x === this.tunnels[ti][1].x) {
              //y

              if (objCollision.y < this.tunnels[ti][tj].y) {
                characters[a].setPosition(this.tunnels[ti][tj].x * this.hallWidth + this.sizeOffset, this.map.length * this.hallWidth - offsetTeleport - this.sizeOffset);
              } else if (objCollision.y > this.tunnels[ti][tj].y) {
                characters[a].setPosition(this.tunnels[ti][tj].x * this.hallWidth + this.sizeOffset, offsetTeleport + this.sizeOffset);
              }
            }

            
              
          }
        }
      }
    }
  }

  checkGameState() {
    if (this.gameState === 'pacman-dead' && this.gameState !== 'game-over') {
      this.gameState = 'playing';
      
      if (this.pacman.getLives() > 1) {
        for (let g in this.ghosts) {
          this['ghost'+g].reset(this.reviveTime);
        }
        this.pacman.reset(this.reviveTime);
      } else {
        this.gameState = 'game-over';
      }

      this.pacman.setLives(-1);
    }
  }

  gameOver() {
    for (let g in this.ghosts) {
      this['ghost'+g].pause();
    }
    this.pacman.pause();
  }
}

customElements.define('lb-pacman-game', PacMan_Game);