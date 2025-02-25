import { colors as allColors } from './consts.js';


class Ghost extends HTMLElement {
  constructor(id) {
    super();

    this.id = 'ghost'+id;
    this.parent = document.getElementById("pacman-game");
    this.hallWidth = this.parent.getHallWidth();
    this.sizeOffset = this.parent.getSizeOffset();
    
    let x = 14;
    let y = 15;

    switch (id) {
      case 1:
        x = 12;
        break;
      case 2:
        x = 16;
        break;
    }
    
    this.x = x * this.hallWidth + this.sizeOffset;
    this.y = y * this.hallWidth + this.sizeOffset;
    this.direction = 'right';
    this.startBlinking = performance.now();
    this.isBlinking = false;
    
    
    this.vulnerableTime = 10000;
    this.blinkingTime = 3000;
    this.speed = 10;
    this.idDirection = 0;
    this.state = 'default';    //default, vulnerable, blinking
    
    this.isAnimationMoving = false;
    this.startAnimationMoving = performance.now();
    this.timeAnimationBlinking = this.blinkingTime / 6;

    //colors
    this.colors = {
      default: {
        body: allColors.ghost.colors[id] === undefined ? allColors.ghost.colors[0] : allColors.ghost.colors[id],
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
    }
    
    //this.idMove = this.getIdMove();
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

    setTimeout(() => {
      this.state = 'blinking';

      setTimeout(() => {
        this.state = 'default';
      }, this.blinkingTime);
    }, this.vulnerableTime - this.blinkingTime);
  }
}

customElements.define("lb-ghost", Ghost);
export default Ghost;