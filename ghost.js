import { colors } from './consts.js';

class Ghost extends HTMLElement {
  constructor() {
    super();

    this.id = 'ghost';
    this.x = 75;
    this.y = 75;
    this.speed = 10;
    //this.idMove = this.getIdMove();
  }

  printGhost() {
    // Ghost
    ctx.fillStyle = colors.ghostColor;
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
    
    // Right
    // const xLeftEye = 94;
    // const yLeftEye = 95;
    // const xRightEye = 104;
    // const yRightEye = 95;
    // ctx.arc(xLeftEye+widthEye*5/32, yLeftEye+heightEye/2, widthEye/4+.2, 0, Math.PI * 2, true);
    // ctx.arc(xRightEye+widthEye*5/32, yRightEye+heightEye/2, widthEye/4+.2, 0, Math.PI * 2, true);

    // Down
    // const xLeftEye = 92;
    // const yLeftEye = 97;
    // const xRightEye = 102;
    // const yRightEye = 97;
    // ctx.arc(xLeftEye, yLeftEye+widthEye*13/16, widthEye/4+.1, 0, Math.PI * 2, true);
    // ctx.arc(xRightEye, yRightEye+widthEye*13/16, widthEye/4+.1, 0, Math.PI * 2, true);

    // Left
    // const xLeftEye = 90;
    // const yLeftEye = 95;
    // const xRightEye = 100;
    // const yRightEye = 95;
    // ctx.arc(xLeftEye-widthEye*5/32, yLeftEye+heightEye/2, widthEye/4+.1, 0, Math.PI * 2, true);
    // ctx.arc(xRightEye-widthEye*5/32, yRightEye+heightEye/2, widthEye/4+.1, 0, Math.PI * 2, true);

    // Up
    // const xLeftEye = 92;
    // const yLeftEye = 92;
    // const xRightEye = 102;
    // const yRightEye = 92;
    // ctx.arc(xLeftEye, yLeftEye+widthEye*5/16, widthEye/4+.1, 0, Math.PI * 2, true);
    // ctx.arc(xRightEye, yRightEye+widthEye*5/16, widthEye/4+.1, 0, Math.PI * 2, true);
    
    const widthEye = 8.5;
    const heightEye = 9.5;
    
    const xLeftEye = 90;
    const yLeftEye = 95;
    const xRightEye = 100;
    const yRightEye = 95;


    // Eyes sclera
    ctx.fillStyle = colors.ghostEyeColor[0];
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
    ctx.fillStyle = colors.ghostEyeColor[1];
    ctx.beginPath();
    ctx.arc(xLeftEye-widthEye*5/32, yLeftEye+heightEye/2, widthEye/4+.1, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(xRightEye-widthEye*5/32, yRightEye+heightEye/2, widthEye/4+.1, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

customElements.define("lb-ghost", Ghost);
export default Ghost;