function draw() {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    
    const backgroundColor = "black";
    const shapesColor = "blue";
    const pacManColor = "yellow";
    const dotsColor = "white";
    const ghostColor = "red";
    const ghostEyeColor = ['white', 'black'];

    let isPacmanOpen = true;
    let pacManDirection = 0;
    let strPacManDirection = 'right';
    
    setInterval(() => {
      isPacmanOpen = !isPacmanOpen;
      printPacMan();
    }, 150);
    
    setInterval(() => {
      pacManDirection = (pacManDirection + 1) % 4;
      strPacManDirection = ['right', 'down', 'left', 'up'][pacManDirection];
      printPacMan();
    }, 1500);


    const ctx = canvas.getContext("2d");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Map shapes 
    ctx.strokeStyle = shapesColor;
    roundedRect(ctx, 12, 12, 150, 150, 15);
    roundedRect(ctx, 19, 19, 150, 150, 9);
    roundedRect(ctx, 53, 53, 49, 33, 10);
    roundedRect(ctx, 53, 119, 49, 16, 6);
    roundedRect(ctx, 135, 53, 49, 33, 10);
    roundedRect(ctx, 135, 119, 25, 49, 10);
    
    const printPacMan = () => {

      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.arc(37-1, 37-1, 13+2, 0, 2*Math.PI, false);
      ctx.fill();

      // Pacman
      ctx.fillStyle = pacManColor;
      ctx.beginPath();

      if (isPacmanOpen) {

        // Resizable mouth
        let mouthX = 37;
        let mouthY = 37;
        const mouthSize = 3;

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
        ctx.arc(37, 37, 13, Math.PI / 7 + (Math.PI / 2) * pacManDirection, -Math.PI / 7 + (Math.PI / 2) * pacManDirection, false);
      } else {
        ctx.arc(37, 37, 13, 0, 2*Math.PI, false);
      }
      ctx.fill();
    }
    printPacMan();
    
    // Dots
    ctx.fillStyle = dotsColor;
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 35, 4, 4);
    }
    
    for (i = 0; i < 6; i++) {
      ctx.fillRect(115, 51 + i * 16, 4, 4);
    }
    
    for (i = 0; i < 8; i++) {
      ctx.fillRect(51 + i * 16, 99, 4, 4);
    }
    
    // Ghost
    ctx.fillStyle = ghostColor;
    ctx.beginPath();
    ctx.moveTo(83, 116);
    ctx.lineTo(83, 102);
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    ctx.lineTo(111, 116);
    ctx.lineTo(106.333, 111.333);
    ctx.lineTo(101.666, 116);
    ctx.lineTo(97, 111.333);
    ctx.lineTo(92.333, 116);
    ctx.lineTo(87.666, 111.333);
    ctx.lineTo(83, 116);
    ctx.fill();

    // Ghost eyes
    ctx.fillStyle = ghostEyeColor[0];
    ctx.beginPath();
    ctx.moveTo(91, 96);
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
    ctx.moveTo(103, 96);
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
    ctx.fill();

    
    ctx.fillStyle = ghostEyeColor[1];
    ctx.beginPath();
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

// Una función auxiliar para dibujar un rectángulo con esquinas redondeadas.

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}