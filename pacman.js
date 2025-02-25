import { colors } from './consts.js';

class PacMan extends HTMLElement {
  constructor() {
    super();

    this.id = 'pacman';
    this.isOpen = true;
    this.idDirection = 0;
    this.direction = 'right';
    this.nextDirection = 'right';
    
    this.lives = 3;
    this.mouthSize = 3;
    this.radius = 14;
    this.speed = 60 / 10;
    this.isMissPacman = false;
    this.scorePellets = 10;
    this.scorePowerPellets = 50;
    this.scoreGhost = [200, 400, 800, 1600];

    this.startCheckCollision = performance.now();
    
    this.idMove = this.getIdMove();
    this.getIdAnimationMouth = this.getIdAnimationMouth();

    globalThis.onkeydown = (e) => this.pacmanMove(e);
  }

  connectedCallback() {
    this.parent = document.getElementById("pacman-game");

    this.hallWidth = this.parent.getHallWidth();
    this.sizeOffset = this.parent.getSizeOffset();

    this.pacmanOffset = this.sizeOffset + this.radius/2 + (this.hallWidth-this.radius)/2;

    this.setXPacMan(14*this.hallWidth + this.pacmanOffset);
    this.setYPacMan(17*this.hallWidth + this.pacmanOffset);
    

    setInterval(() => {
      this.checkMapsCollision();
      
      this.checkIsFreeDirection(this.nextDirection) && this.setDirection(this.nextDirection);
    }, fps);
  }

  checkIsFreeDirection = (direction) => {
    let x = this.getXPacMan() - this.sizeOffset;
    let y = this.getYPacMan() - this.sizeOffset;

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

    const objCollision = this.parent.isColliding(x, y);

    return objCollision.char !== 'wall';
  }
  
  checkMapsCollision() {
    const offsetWalls = this.hallWidth / 4;
    let x = this.getXPacMan() - this.sizeOffset;
    let y = this.getYPacMan() - this.sizeOffset;

    switch (this.direction) {
      case 'right':
        x += offsetWalls;
        break;
      case 'down':
        y += offsetWalls;
        break;
      case 'left':
        x -= offsetWalls;
        break;
      case 'up':
        y -= offsetWalls;
    }

    const objCollision = this.parent.isColliding(x, y);

    if (objCollision.char === 'wall') {
      if (this.direction === 'right') {
        this.setXPacMan(this.getXPacMan() - this.speed);
      } else if (this.direction === 'down') {
        this.setYPacMan(this.getYPacMan() - this.speed);
      } else if (this.direction === 'left') {
        this.setXPacMan(this.getXPacMan() + this.speed);
      } else if (this.direction === 'up') {
        this.setYPacMan(this.getYPacMan() + this.speed);
      }
    } else if (objCollision.char === '.') {
      const newMap = this.parent.getMap().map(row => row.split(''));
      newMap[objCollision.y][objCollision.x - 1] = ' ';
      this.parent.setMap(newMap.map(row => row.join('')));

      this.parent.increaseScore(this.scorePellets);
    } else if (objCollision.char === '*') {
      const newMap = this.parent.getMap().map(row => row.split(''));
      newMap[objCollision.y][objCollision.x - 1] = ' ';
      this.parent.setMap(newMap.map(row => row.join('')));

      this.parent.increaseScore(this.scorePowerPellets);
      this.parent.setGhostsVulnerable();
    }
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
    
    this.radius = radius || 13;
  
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
      ctx.arc(x, y, this.radius, Math.PI / 7 + (Math.PI / 2) * idDirection, -Math.PI / 7 + (Math.PI / 2) * idDirection, false);
    } else {
      ctx.arc(x, y, this.radius, 0, 2*Math.PI, false);
    }
    ctx.fill();
    
    if (this.isMissPacman) {
      this.printBow(ctx, x, y, idDirection, direction, colors, 3.5, this.radius);
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

  setNextDirection(direction) {
    this.nextDirection = direction;
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
  
  pacmanMove(e) {
    {
      
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
          this.setNextDirection('right');
      } else 
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
          this.setNextDirection('down');
      } else 
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
          this.setNextDirection('left');
      } else 
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
          this.setNextDirection('up');
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

  setXPacMan(value) {   this.setAttribute("xPacMan", value);  }
  setYPacMan(value) {   this.setAttribute("yPacMan", value);  }

  getXPacMan() {  return parseInt(this.getAttribute("xPacMan"), 10);  }
  getYPacMan() {  return parseInt(this.getAttribute("yPacMan"), 10);  }

  getLives() {
    return this.lives;
  }
}

customElements.define("lb-pacman", PacMan);
export default PacMan;