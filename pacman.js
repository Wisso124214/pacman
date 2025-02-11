import { colors } from './consts.js';

class PacMan extends HTMLElement {
  constructor() {
    super();

    this.id = 'pacman';
    this.mouthSize = 2;
    this.radius = 13;
    this.isOpen = true;
    this.direction = 0;
    this.strDirection = 'right';
    this.speed = 10;
    this.idAnimationMouth = this.getIdAnimationMouth();
    this.idMove = this.getIdMove();

    this.setXPacMan(37);
    this.setYPacMan(37);
  }

  getIdAnimationMouth() {
    return setInterval(() => {
      this.isOpen = !this.isOpen;
      //this.printPacMan(ctx, this.getXPacMan(), this.getYPacMan(), this.direction, this.strDirection, this.isOpen, colors, this.mouthSize, this.radius);
    }, 150);
  }

  getIdMove() {
    return setInterval(() => {

      if (this.parentNode.getElementById("canvas").width > this.getAttribute("xPacMan")) {        
        this.setXPacMan(this.getXPacMan() + this.speed);
      }
    }, 150);
  }

  erasePacMan = (ctx, x, y, colors, radius) => {
    ctx.fillStyle = colors.backgroundColor;
    ctx.beginPath();
    ctx.arc(x-1, y-1, radius+2, 0, 2*Math.PI, false);
    ctx.fill();
  }

  printPacMan = (ctx, x, y, pacManDirection, strPacManDirection, isPacmanOpen, colors, mouthSizePacMan, radiusPacMan ) => {
    const radius = radiusPacMan || 13;
  
    this.erasePacMan(ctx, x, y, radius, colors);
  
    // Pacman
    ctx.fillStyle = colors.pacManColor;
    ctx.beginPath();
  
    if (isPacmanOpen) {
      // Resizable mouth
      let mouthX = x;
      let mouthY = y;
      const mouthSize = mouthSizePacMan || 2;
  
      switch (strPacManDirection) {
        case 'right':
          mouthX -= mouthSize;
          break;
        case 'down':
          mouthY -= mouthSize;
          break;
        case 'left':
          mouthX += mouthSize;
          break;
        case 'up':
          mouthY += mouthSize;
          break;
      }
  
      ctx.lineTo(mouthX, mouthY);
      ctx.arc(x, y, radius, Math.PI / 7 + (Math.PI / 2) * pacManDirection, -Math.PI / 7 + (Math.PI / 2) * pacManDirection, false);
    } else {
      ctx.arc(x, y, radius, 0, 2*Math.PI, false);
    }
    ctx.fill();
  }


  static get observedAttributes() {
    return ['xpacman', 'ypacman'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'xpacman' || name === 'ypacman') {
      globalThis[name] = parseInt(newValue);
    } else {
      console.log(`The attribute ${name} has changed from ${oldValue} to ${newValue}`);
    }
  }

  setXPacMan(value) {   this.setAttribute("xPacMan", value);  }
  setYPacMan(value) {   this.setAttribute("yPacMan", value);  }

  getXPacMan() {  return parseInt(this.getAttribute("xPacMan"), 10);  }
  getYPacMan() {  return parseInt(this.getAttribute("yPacMan"), 10);  }
}

customElements.define("lb-pacman", PacMan);
export default PacMan;