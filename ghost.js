import { colors as allColors } from './consts.js';


class Ghost extends HTMLElement {
  constructor(id, color, player) {
    super();
    
    this.id = 'ghost'+id;
    this.numberGhost = id;
    this.parent = document.getElementById("pacman-game");
    this.pacman = this.parent.getPacman();
    this.hallWidth = this.parent.getHallWidth();
    this.sizeOffset = this.parent.getSizeOffset();
    this.startDeadInterval = performance.now() + 1000;

    this.initialize(color);
    
    this.player = player === undefined ? '' : player;
    this.vulnerableTime = 10000;
    this.blinkingTime = 3000;
    
    //colors
    this.colors = {
      default: {
        body: color ? color : allColors.ghost.defaultColor,
        eyes: {
          sclera: allColors.ghost.sclera,
          pupil: allColors.ghost.pupil,
        },
      },
      vulnerable: {
        body: 'blue',
        face: 'white',
      },
      blinking: {
        body: 'white',
        face: 'red',
      },
      dead: {
        body: 'transparent',
        face: 'transparent',
      },
    }
  }

  initialize(color) {
    this.isOnBox = true;
    this.isOpenDoorBox = false;
    
    let x = 14;
    let y = 15;

    switch (this.id.split('ghost')[1]) {
      case '0': 
        x = 14;
        break;
      case '1':
        x = 12;
        break;
      case '2':
        x = 16;
        break;
      default:
        x = 14 + Math.floor(Math.random() * 2) * Math.pow(-1, Math.floor(Math.random() * 2));
        break;
    }
    
    this.x = x * this.hallWidth + this.sizeOffset;
    this.y = y * this.hallWidth + this.sizeOffset;
    this.lastX = this.x;
    this.lastY = this.y;
    this.direction = 'up';
    this.nextDirection = 'down';
    this.startBlinking = performance.now();
    this.isBlinking = false;
    // this.probMove = 0.5;
    this.probMove = 0;        //1 random, 0 pacman

    this.speed = 40 / 10;
    this.idDirection = 0;
    this.state = 'default';    //default, vulnerable, blinking
    console.log(this.state, color)

    this.isAnimationMoving = false;
    this.startAnimationMoving = performance.now();
    this.timeAnimationBlinking = this.blinkingTime / 6;

    this.idMove = this.getIdMove();

    if (this.isConnected) {
      this.autoMove();
    }
  }

  connectedCallback() {
    this.autoMove();
  }

  autoMove() {

    if (this.player === '') {
      this.getOutBox();
    } else {
      this.isOpenDoorBox = true;
    }
  }

  getOutBox() {
    let delay = 0;

    if (this.numberGhost > 0) {
      delay = Math.floor(Math.random() * 8000 + 2000);
    }

    this.idUpDown = setInterval(() => {
      const offsetWalls = this.hallWidth / 2;
      let x = this.x - this.sizeOffset;
      let y = this.y - this.sizeOffset;

      switch (this.direction) {
        case 'down':
          y += offsetWalls;
          break;
        case 'up':
          y -= offsetWalls;
      }
      const objCollision = this.parent.isColliding(x, y);

      if (objCollision.char === 'wall' || objCollision.char === '-') {
        this.setNextDirection(this.direction === 'up' ? 'down' : 'up')
      }
    }, fps)

    setTimeout(() => {
      this.isOpenDoorBox = true;
      clearInterval(this.idUpDown);

      this.idSide = setInterval(() => {
        const x = (this.x - this.sizeOffset)/this.hallWidth;
        const y = (this.y - this.sizeOffset)/this.hallWidth;

        if (x > 15) {
          this.setNextDirection('left');
        } else if (x < 14) {
          this.setNextDirection('right');
        } else {
          this.setNextDirection('up');
        }

        if (Math.floor(y) === 11) {
          
          clearInterval(this.idSide);
          this.setNextDirection(['right', 'left'][Math.round(Math.random()*1)])
          
          setTimeout(() => {
            this.isOnBox = false;
            this.isOpenDoorBox = false;
          }, 500);
        }
      }, fps)
    }, delay);
  }

  checkPacmanCollision() {
    
    const xPacman = this.pacman.getXPacMan() - this.sizeOffset;
    const yPacman = this.pacman.getYPacMan() - this.sizeOffset;

    const radiusPacman = this.pacman.getRadius();
    const x = this.x - this.sizeOffset;
    const y = this.y - this.sizeOffset;

    const pacmanOffset = this.hallWidth / 2;
    const x1 = xPacman - radiusPacman - pacmanOffset;
    const x2 = xPacman + radiusPacman + pacmanOffset;
    const y1 = yPacman - radiusPacman - pacmanOffset;
    const y2 = yPacman + radiusPacman + pacmanOffset;

    if (x1 < x && x < x2 && y1 < y && y < y2) {
      if (this.state !== 'default') {
        this.state = 'dead';
        console.log(this.state, this.colors.default.body)
        this.reset(Math.random() * 5000 + 2000);

      } else if (this.state === 'default') {
        this.startDeadInterval = performance.now();
        this.parent.setGameState('pacman-dead');
      }
    }
  }
  
  checkMapsCollision() {
    const offsetWalls = this.hallWidth / 4;
    //check this.x and this.y
    let x = this.x - this.sizeOffset;
    let y = this.y - this.sizeOffset;

    const offsetCollision = this.hallWidth / 6;
    let xCollision = x;
    let yCollision = y;

    switch (this.direction) {
      case 'right':
        x += offsetWalls;
        xCollision -= offsetCollision;
        break;
      case 'down':
        y += offsetWalls;
        yCollision -= offsetCollision;
        break;
      case 'left':
        x -= offsetWalls;
        xCollision += offsetCollision;
        break;
      case 'up':
        y -= offsetWalls;
        yCollision += offsetCollision;
        break;
    }

    const objCollision = this.parent.isColliding(x, y);

    if (!this.isOnBox && this.player === '') {
      const arrDirections = this.parent.checkIsInIntersection(xCollision, yCollision);

      const random = Math.random();

      if (random < this.probMove) {
        const xPacman = this.pacman.getXPacMan();
        const yPacman = this.pacman.getYPacMan();

        if (yPacman < this.y) {
          let subArrDirections = []
          if (arrDirections.includes('up')) {
            
            if (this.state !== 'default' && arrDirections.includes('down')) {
              // this.setNextDirection('down');
              subArrDirections.push('down');
            } else {
              // this.setNextDirection('up');
              subArrDirections.push('up');
            }
          } else if (xPacman < this.x) {

            if (arrDirections.includes('left')) {
              
              if (this.state !== 'default' && arrDirections.includes('right')) {
                // this.setNextDirection('right');
                subArrDirections.push('right');
              } else {
                // this.setNextDirection('left');
                subArrDirections.push('left');
              }
            } else if (arrDirections.includes('right')) {
              
              if (this.state !== 'default' && arrDirections.includes('left')) {
                // this.setNextDirection('left');
                subArrDirections.push('left');
              } else {
                // this.setNextDirection('right');
                subArrDirections.push('right');
              }
            } else if (arrDirections.includes('down')) {
              
              if (this.state !== 'default' && arrDirections.includes('up')) {
                // this.setNextDirection('up');
                subArrDirections.push('up');
              } else {
                // this.setNextDirection('down');
                subArrDirections.push('down');
              }
            }

            if (subArrDirections.length > 0) {
              const subDirection = subArrDirections[Math.floor(Math.random() * subArrDirections.length)];
              this.setNextDirection(subDirection);
            }
          }
        } else {
          
          let subArrDirections = []
          if (arrDirections.includes('down')) {
            
            if (this.state !== 'default' && arrDirections.includes('down')) {
              // this.setNextDirection('up');
              subArrDirections.push('up');
            } else {
              // this.setNextDirection('down');
              subArrDirections.push('down');
            }
          } else if (xPacman < this.x) {

            if (arrDirections.includes('left')) {
              
              if (this.state !== 'default' && arrDirections.includes('right')) {
                // this.setNextDirection('right');
                subArrDirections.push('right');
              } else {
                // this.setNextDirection('left');
                subArrDirections.push('left');
              }
            } else if (arrDirections.includes('right')) {
              
              if (this.state !== 'default' && arrDirections.includes('left')) {
                // this.setNextDirection('left');
                subArrDirections.push('left');
              } else {
                // this.setNextDirection('right');
                subArrDirections.push('right');
              }
            } else if (arrDirections.includes('up')) {
              
              if (this.state !== 'default' && arrDirections.includes('up')) {
                // this.setNextDirection('down');
                subArrDirections.push('down');
              } else {
                // this.setNextDirection('up');
                subArrDirections.push('up');
              }
            }

            if (subArrDirections.length > 0) {
              const random = Math.floor(Math.random() * subArrDirections.length);
              const subDirection = subArrDirections[random];
              this.setNextDirection(subDirection);
            }
          }
        }
      } else {

        //Random direction
        if (arrDirections.length >= 2) {
          let ran;
          
          do {
            ran = Math.floor(Math.random() * arrDirections.length);
          } while (arrDirections[ran] === this.parent.getOppositeDirection(this.direction))
          
          this.setNextDirection(arrDirections[ran]);
        }
      }
    }

    const isWalls = this.isOpenDoorBox ? objCollision.char === 'wall' : objCollision.char === 'wall' || objCollision.char === '-';

    if (isWalls) {
      if (this.direction === 'right') {
        this.x = this.x - this.speed;
      } else if (this.direction === 'down') {
        this.y = this.y - this.speed;
      } else if (this.direction === 'left') {
        this.x = this.x + this.speed;
      } else if (this.direction === 'up') {
        this.y = this.y + this.speed;
      }
    }
  }

  getIdMove() {
    this.idKeepMove = setInterval(() => {
      if (!this.isOnBox) {
        if (this.x === this.lastX && this.y === this.lastY && this.player === '') {
          const offsetWalls = this.hallWidth / 4;
          
          let x = this.x - this.sizeOffset;
          let y = this.y - this.sizeOffset;
      
          const offsetCollision = this.hallWidth / 6;
          let xCollision = x;
          let yCollision = y;
      
          switch (this.direction) {
            case 'right':
              x += offsetWalls;
              xCollision -= offsetCollision;
              break;
            case 'down':
              y += offsetWalls;
              yCollision -= offsetCollision;
              break;
            case 'left':
              x -= offsetWalls;
              xCollision += offsetCollision;
              break;
            case 'up':
              y -= offsetWalls;
              yCollision += offsetCollision;
              break;
          }

          const arrDirections = this.parent.checkIsInIntersection(xCollision, yCollision);
          const dir = arrDirections[Math.floor(Math.random() * (arrDirections.length))]
          this.setNextDirection(dir)
          
          if (dir === undefined) {
            console.log(dir, this.colors.default.body)
          }
        }

        this.lastX = this.x;
        this.lastY = this.y;
      }
    }, fps * 10);

    return setInterval(() => {
      this.checkMapsCollision();
      this.checkPacmanCollision();

      if (this.isOpenDoorBox) {
        const y = (this.y - this.sizeOffset) / this.hallWidth;

        if (y <= 12 && this.player !== '') {
          this.isOpenDoorBox = false;
          this.isOnBox = false;
          console.log('door closed')
        }
      }

      if (this.parentNode) {
        switch (this.direction) {
          case 'right': 
            this.x = (this.x + this.speed);
            break;
          case 'down': 
            this.y = (this.y + this.speed);
            break;
          case 'left': 
            this.x = (this.x - this.speed);
            break;
          case 'up': 
            this.y = (this.y - this.speed);
            break;
        }
        
        this.parent.checkIsFreeDirection(this.x - this.sizeOffset, this.y - this.sizeOffset, this.nextDirection) && this.setDirection(this.nextDirection);
      }
    }, fps);
  }

  setDirection(direction) {
    this.direction = direction;
    this.idDirection = {
      right: 0,
      down: 1,
      left: 2,
      up: 3,
    }[direction];
  }

  setNextDirection(direction) {
    this.nextDirection = direction;
  }

  getDirection() {
    return this.direction;
  }

  printVulnerableFace(state) {
    this.printBodyGhost(state);

    const xLeftEye = this.x - 4;
    const yEyes = this.y - 4;
    const xRightEye = this.x + 4;
    
    const radiusEye = 2.5;
    
    const xMouth = this.x - 10;
    const yMouth = this.y + 4;
    
    const heightMouth = 3;
    const widthMouth = 3.4;
    const ammoLines = 6;
    const lineWidthMouth = 2;


    ctx.beginPath();
    ctx.fillStyle = this.colors[state].face;

    ctx.arc(xLeftEye, yEyes, radiusEye, 0, Math.PI * 2, true);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(xRightEye, yEyes, radiusEye, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.lineWidth = lineWidthMouth;
    ctx.strokeStyle = this.colors[state].face;

    // Mouth
    ctx.beginPath();
    ctx.moveTo(xMouth, yMouth + (heightMouth/2));
    
    for (let a = 0; a <= ammoLines; a++) {
      ctx.lineTo(xMouth + a * widthMouth, yMouth + ((heightMouth/2)*Math.pow((-1), a)));
    }
    ctx.stroke();
  }

  printBodyGhost(state) {
    

    if (performance.now() - this.startAnimationMoving > 100) {
      this.isAnimationMoving = !this.isAnimationMoving;
      this.startAnimationMoving = performance.now();
    }

    ctx.fillStyle = this.colors[state].body;
    ctx.beginPath();
    ctx.moveTo(this.x - 15, this.y + 9);
    ctx.lineTo(this.x - 14, this.y);
    ctx.bezierCurveTo(this.x - 13, this.y - 10, this.x - 8, this.y - 14, this.x, this.y - 14);
    ctx.bezierCurveTo(this.x + 8, this.y - 14, this.x + 14, this.y - 8, this.x + 13, this.y + 5);
    

    if (this.isAnimationMoving) {

      ctx.bezierCurveTo(this.x + 14, this.y + 9, this.x + 13, this.y + 18, this.x + 11, this.y + 14);
      ctx.bezierCurveTo(this.x + 11, this.y + 15, this.x + 10, this.y + 14, this.x + 8, this.y + 9);
      ctx.bezierCurveTo(this.x + 8, this.y + 9, this.x + 5, this.y + 14, this.x + 4, this.y + 14);
      ctx.lineTo(this.x + 2, this.y + 14);
      ctx.bezierCurveTo(this.x + 2, this.y + 14, this.x + 1, this.y + 10, this.x - 1, this.y + 9);
      ctx.bezierCurveTo(this.x - 1, this.y + 9, this.x - 4, this.y + 11, this.x - 4, this.y + 14);
      ctx.bezierCurveTo(this.x - 4, this.y + 14, this.x - 3, this.y + 14, this.x - 6, this.y + 14);
      ctx.bezierCurveTo(this.x - 6, this.y + 14, this.x - 8, this.y + 14, this.x - 10, this.y + 8);
      ctx.bezierCurveTo(this.x - 10, this.y + 8, this.x - 11, this.y + 14, this.x - 13, this.y + 14);
      ctx.bezierCurveTo(this.x - 13, this.y + 14, this.x - 16, this.y + 14, this.x - 15, this.y + 9);
    } else {

      ctx.bezierCurveTo(this.x + 14, this.y + 9, this.x + 15, this.y + 21, this.x + 6, this.y + 9);
      ctx.bezierCurveTo(this.x + 6, this.y + 9, this.x + 1, this.y + 14, this.x, this.y + 14);
      ctx.bezierCurveTo(this.x, this.y + 14, this.x - 2, this.y + 14, this.x - 7, this.y + 9);
      ctx.bezierCurveTo(this.x - 13, this.y + 17, this.x - 16, this.y + 14, this.x - 15, this.y + 9);
    }

    ctx.fill();
  }

  printGhost() {
    
    if (this.state === 'vulnerable') {
      this.printVulnerableFace(this.state);

    } else if (this.state === 'blinking') {
      this.printVulnerableFace(this.isBlinking ? 'blinking' : 'vulnerable');
      
      if ((performance.now() - this.startBlinking) > this.timeAnimationBlinking / 1.5) {
        this.isBlinking = !this.isBlinking;
        this.startBlinking = performance.now();
      }
    } else {
      this.printBodyGhost(this.state);

      const widthEye = 8.5;
      const heightEye = 9.5;
      
      let xLeftEye;
      let yLeftEye;
      let xRightEye;
      let yRightEye;
      let arcXLeftEye;
      let arcYLeftEye;
      let arcXRightEye;
      let arcYRightEye;


      if (this.direction === 'right') {
        xLeftEye = this.x - 4;
        yLeftEye = this.y - 7;
        xRightEye = this.x + 6;
        yRightEye = this.y - 7;
        arcXLeftEye = xLeftEye+widthEye*5/32;
        arcYLeftEye = yLeftEye+heightEye/2;
        arcXRightEye = xRightEye+widthEye*5/32;
        arcYRightEye = yRightEye+heightEye/2;
        
      } else if (this.direction === 'down') {
        xLeftEye = this.x - 5;
        yLeftEye = this.y - 5;
        xRightEye = this.x + 5;
        yRightEye = this.y - 5;
        arcXLeftEye = xLeftEye;
        arcYLeftEye = yLeftEye+widthEye*13/16;
        arcXRightEye = xRightEye;
        arcYRightEye = yRightEye+widthEye*13/16;

      } else if (this.direction === 'left') {
        xLeftEye = this.x - 7;
        yLeftEye = this.y - 7;
        xRightEye = this.x + 3;
        yRightEye = this.y - 7;
        arcXLeftEye = xLeftEye-widthEye*5/32;
        arcYLeftEye = yLeftEye+heightEye/2;
        arcXRightEye = xRightEye-widthEye*5/32;
        arcYRightEye = yRightEye+heightEye/2;
        
      } else if (this.direction === 'up') {
        xLeftEye = this.x - 5;
        yLeftEye = this.y - 10;
        xRightEye = this.x + 5;
        yRightEye = this.y - 10;
        arcXLeftEye = xLeftEye;
        arcYLeftEye = yLeftEye+widthEye*5/16;
        arcXRightEye = xRightEye;
        arcYRightEye = yRightEye+widthEye*5/16;

      } else {
        xLeftEye = this.x - 5;
        yLeftEye = this.y - 7;
        xRightEye = this.x + 5;
        yRightEye = this.y - 7;
        arcXLeftEye = xLeftEye;
        arcYLeftEye = yLeftEye+heightEye/2;
        arcXRightEye = xRightEye;
        arcYRightEye = yRightEye+heightEye/2;
      }

      // Eyes sclera
      ctx.fillStyle = this.colors.default.eyes.sclera;
      ctx.beginPath();
      
      ctx.moveTo(xLeftEye, yLeftEye);
      ctx.bezierCurveTo(xLeftEye - (widthEye*3/8) , yLeftEye                    , xLeftEye - (widthEye/2)   , yLeftEye + (heightEye*3/10) , xLeftEye - (widthEye/2) , yLeftEye + (heightEye/2));
      ctx.bezierCurveTo(xLeftEye - (widthEye/2)   , yLeftEye + (heightEye*7/10) , xLeftEye - (widthEye*3/8) , yLeftEye +  heightEye       , xLeftEye                , yLeftEye +  heightEye);
      ctx.bezierCurveTo(xLeftEye + (widthEye*3/8) , yLeftEye +  heightEye       , xLeftEye + (widthEye/2)   , yLeftEye + (heightEye*7/10) , xLeftEye + (widthEye/2) , yLeftEye + (heightEye/2));
      ctx.bezierCurveTo(xLeftEye + (widthEye/2)   , yLeftEye + (heightEye*3/10) , xLeftEye + (widthEye*3/8) , yLeftEye                    , xLeftEye                , yLeftEye);
      ctx.fill();

      ctx.moveTo(xRightEye, yRightEye);
      ctx.bezierCurveTo(xRightEye - (widthEye*3/8) , yRightEye                    , xRightEye - (widthEye/2)   , yRightEye + (heightEye*3/10) , xRightEye - (widthEye/2) , yRightEye + (heightEye/2));
      ctx.bezierCurveTo(xRightEye - (widthEye/2)   , yRightEye + (heightEye*7/10) , xRightEye - (widthEye*3/8) , yRightEye +  heightEye       , xRightEye                , yRightEye +  heightEye);
      ctx.bezierCurveTo(xRightEye + (widthEye*3/8) , yRightEye +  heightEye       , xRightEye + (widthEye/2)   , yRightEye + (heightEye*7/10) , xRightEye + (widthEye/2) , yRightEye + (heightEye/2));
      ctx.bezierCurveTo(xRightEye + (widthEye/2)   , yRightEye + (heightEye*3/10) , xRightEye + (widthEye*3/8) , yRightEye                    , xRightEye                , yRightEye);
      ctx.fill();

      // Eyes pupil
      ctx.fillStyle = this.colors.default.eyes.pupil;
      ctx.beginPath();
      ctx.arc(arcXLeftEye, arcYLeftEye , widthEye/4+.1, 0, Math.PI * 2, true);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(arcXRightEye, arcYRightEye, widthEye/4+.1, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  setVulnerable() {
    this.state = 'vulnerable';
    console.log(this.state, this.colors.default.body)

    setTimeout(() => {
      if (this.state !== 'default') {
        this.state = 'blinking';
        console.log(this.state, this.colors.default.body)

        setTimeout(() => {
          this.state = 'default';
          console.log(this.state, this.colors.default.body)
        }, this.blinkingTime);
      }
    }, this.vulnerableTime - this.blinkingTime);
  }

  pause() {
    clearInterval(this.idMove);
    clearInterval(this.idKeepMove);
    clearInterval(this.idUpDown);
    clearInterval(this.idSide);
  }

  continue() {
    this.idMove = this.getIdMove();
  }

  reset(time) {
    this.pause();

    setTimeout(() => {
      this.initialize(this.colors.default.body);
    }, time);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

customElements.define("lb-ghost", Ghost);
export default Ghost;