import { colors } from './consts.js';

class PacMan extends HTMLElement {
  constructor() {
    super();

    this.id = 'pacman';
    this.mouthSize = 2;
    this.radius = 13;
    this.isOpen = true;
    this.idDirection = 0;
    this.direction = 'right';
    this.speed = 50 / 10;
    this.isMissPacman = false;
    
    this.idMove = this.getIdMove();
    this.getIdAnimationMouth = this.getIdAnimationMouth();

    this.setXPacMan(37);
    this.setYPacMan(37);
  }

  setIsMissPacman(value) {
    this.isMissPacman = value;
  }

  getIdAnimationMouth() {
    return setInterval(() => {
      this.isOpen = !this.isOpen;
    }, 150);
  };

  getIdMove() {
    return setInterval(() => {
      if (this.parentNode && 
          this.parentNode.getElementById("canvas").width > this.getAttribute("xPacMan") &&
          0 < this.getAttribute("xPacMan") &&
          this.parentNode.getElementById("canvas").height > this.getAttribute("yPacMan") &&
          0 < this.getAttribute("yPacMan")
        ) {
        switch (this.direction) {
          case 'right': 
            this.setXPacMan(this.getXPacMan() + this.speed);
            break;
          case 'down': 
            this.setYPacMan(this.getYPacMan() + this.speed);
            break;
          case 'left': 
            this.setXPacMan(this.getXPacMan() - this.speed);
            break;
          case 'up': 
            this.setYPacMan(this.getYPacMan() - this.speed);
            break;
        }
      }
    }, fps);
  }

  erasePacMan = (ctx, x, y, colors, radius) => {
    ctx.fillStyle = colors.backgroundColor;
    ctx.beginPath();
    ctx.arc(x-1, y-1, radius+2, 0, 2*Math.PI, false);
    ctx.fill();
  }

  printPacMan = (ctx, x, y, idDirection, direction, isOpen, colors, mouthSize, radius ) => {
    
    const thisRadius = radius || 13;
  
    // Pacman
    ctx.fillStyle = colors.pacManColor;
    ctx.beginPath();
  
    if (isOpen) {
      // Resizable mouth
      let mouthX = x;
      let mouthY = y;
      const thisMouthSize = mouthSize || 2;
  
      switch (direction) {
        case 'right':
          mouthX -= thisMouthSize;
          this.idDirection = 0;
          break;
        case 'down':
          mouthY -= thisMouthSize;
          this.idDirection = 1;
          break;
        case 'left':
          mouthX += thisMouthSize;
          this.idDirection = 2;
          break;
        case 'up':
          mouthY += thisMouthSize;
          this.idDirection = 3;
          break;
      }
  
      ctx.lineTo(mouthX, mouthY);
      ctx.arc(x, y, thisRadius, Math.PI / 7 + (Math.PI / 2) * idDirection, -Math.PI / 7 + (Math.PI / 2) * idDirection, false);
    } else {
      ctx.arc(x, y, thisRadius, 0, 2*Math.PI, false);
    }
    ctx.fill();
    
    if (this.isMissPacman) {
      this.printBow(ctx, x, y, idDirection, direction, colors, 3.5, thisRadius);
    }
  }

  printBow = (ctx, x, y, idDirection, direction, colors, size, radius) => {
    const knotSize = size*5/8;
    
    let xBow = x;
    let yBow = y;
    let xKnot = knotSize;
    let yKnot = knotSize;

    switch (direction) {
      case 'right':
        xBow -= radius/2;
        yBow -= radius/2;
        break;
      case 'down':
        xKnot *= -1;
        xBow += radius/2;
        yBow -= radius/2;
        break;
      case 'left':
        xKnot *= -1;
        xBow += radius/2;
        yBow -= radius/2;
        break;
      case 'up':
        xKnot *= -1;
        xBow -= radius/2;
        yBow += radius/2;
        break;
    }


    // Draw a bow
    ctx.fillStyle = colors.bowColor || 'red';
    ctx.beginPath();
    
    ctx.arc(xBow - xKnot, yBow + yKnot, size, 0, Math.PI * 2, true);
    ctx.arc(xBow + xKnot, yBow - yKnot, size, 0, Math.PI * 2, true);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(xBow, yBow, knotSize, 0, Math.PI * 2, true);
    ctx.fill();
  }

  setDirection(direction) {
    this.direction = direction;
    
    switch (direction) {
      case 'right':
        this.idDirection = 0;
        break;
      case 'down':
        this.idDirection = 1;
        break;
      case 'left':
        this.idDirection = 2;
        break;
      case 'up':
        this.idDirection = 3;
        break;
    }
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