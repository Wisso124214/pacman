import { colors as allColors } from './consts.js';


class Ghost extends HTMLElement {
  constructor(id) {
    super();

    this.id = 'ghost'+id;
    this.x = 75;
    this.y = 75;
    this.speed = 10;
    this.direction = 'right';
    this.idDirection = 0;
    this.state = 'scared';    //default, scared, blinking
    this.startBlinking = performance.now();
    this.isBlinking = false;
    this.timeAnimationBlinking = 500;

    //colors
    this.colors = {
      default: {
        body: allColors.ghost.colors[id] === undefined ? allColors.ghost.colors[0] : allColors.ghost.colors[id],
        eyes: {
          sclera: allColors.ghost.sclera,
          pupil: allColors.ghost.pupil,
        },
      },
      scared: {
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

  printScaredFace(state) {
    this.printBodyGhost(state);

    const xLeftEye = 93;
    const yEyes = 98;
    const xRightEye = 101;
    
    const radiusEye = 2.5;
    
    const xMouth = 87;
    const yMouth = 106;
    
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
    ctx.fillStyle = this.colors[state].body;

    ctx.beginPath();
    ctx.moveTo(83, 111);
    ctx.lineTo(84, 102);
    ctx.bezierCurveTo(84, 92, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 92, 110, 107);
    ctx.bezierCurveTo(111, 111, 112, 124, 103, 111);
    ctx.lineTo(97, 116);
    ctx.lineTo(91, 111);
    ctx.bezierCurveTo(84, 119, 82, 116, 83, 111);
    ctx.fill();
  }

  printGhost() {
    
    if (this.state === 'scared') {
      this.printScaredFace(this.state);

    } else if (this.state === 'blinking') {
      this.printScaredFace(this.isBlinking ? 'blinking' : 'scared');
      
      if ((performance.now() - this.startBlinking) > this.timeAnimationBlinking) {
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
        xLeftEye = 94;
        yLeftEye = 95;
        xRightEye = 104;
        yRightEye = 95;
        arcXLeftEye = xLeftEye+widthEye*5/32;
        arcYLeftEye = yLeftEye+heightEye/2;
        arcXRightEye = xRightEye+widthEye*5/32;
        arcYRightEye = yRightEye+heightEye/2;
        
      } else if (this.direction === 'down') {
        xLeftEye = 92;
        yLeftEye = 97;
        xRightEye = 102;
        yRightEye = 97;
        arcXLeftEye = xLeftEye;
        arcYLeftEye = yLeftEye+widthEye*13/16;
        arcXRightEye = xRightEye;
        arcYRightEye = yRightEye+widthEye*13/16;

      } else if (this.direction === 'left') {
        xLeftEye = 90;
        yLeftEye = 95;
        xRightEye = 100;
        yRightEye = 95;
        arcXLeftEye = xLeftEye-widthEye*5/32;
        arcYLeftEye = yLeftEye+heightEye/2;
        arcXRightEye = xRightEye-widthEye*5/32;
        arcYRightEye = yRightEye+heightEye/2;
        
      } else if (this.direction === 'up') {
        xLeftEye = 92;
        yLeftEye = 92;
        xRightEye = 102;
        yRightEye = 92;
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
}

customElements.define("lb-ghost", Ghost);
export default Ghost;