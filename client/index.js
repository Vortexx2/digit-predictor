const API = 'http://localhost:8000/';

class Canvas {
  constructor(canvas_id, draw, coord, bgColor, penColor) {
    this.canvas_id = canvas_id;
    this.draw = draw;
    this.coord = coord;
    this.bgColor = bgColor;
    this.penColor = penColor;

    const canvas = document.getElementById(this.canvas_id);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  startDrawing(event) {
    this.draw = true;
    const canvas = document.getElementById(this.canvas_id);
    this.coord.x = event.clientX - canvas.getBoundingClientRect().left;
    this.coord.y = event.clientY - canvas.getBoundingClientRect().top;
  }

  drawSketch(event) {
    if (!this.draw) return 0;

    const canvas = document.getElementById(this.canvas_id);
    const ctx = canvas.getContext('2d');

    // start the line
    ctx.beginPath();

    // Pull from the color and width from the associated controls. The line cap is hardcoded to be rounded, because it looks more natural for a drawing application
    ctx.strokeStyle = this.penColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = 20;

    // Start moving to the coordinates determined by mouse movement. The position is updated as the cursor moves
    ctx.moveTo(this.coord.x, this.coord.y);
    this.coord.x = event.clientX - canvas.getBoundingClientRect().left;
    this.coord.y = event.clientY - canvas.getBoundingClientRect().top;

    // Specify where the line ends
    ctx.lineTo(this.coord.x, this.coord.y);

    // Draw the line
    ctx.stroke();
  }

  /**
   * Sets draw to false on event (mouseup)
   * @param {MouseEvent} event
   */
  stopDrawing(event) {
    this.draw = false;
  }

  clear() {
    const canvas = document.getElementById(this.canvas_id);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, canvas.width + 10, canvas.height + 10);
  }

  getDataURL() {
    const canvas = document.getElementById(this.canvas_id);
    return canvas.toDataURL('image/jpeg');
  }
}

function main() {
  const canvas = new Canvas('sketch', false, { x: 0, y: 0 }, 'black', 'white');

  // Add event listeners for the mousedown, mouseup, and mousemove
  document.addEventListener('mousedown', function (e) {
    canvas.startDrawing(e);
  });

  document.addEventListener('mouseup', function (e) {
    canvas.stopDrawing(e);
  });

  document.addEventListener('mousemove', function (e) {
    canvas.drawSketch(e);
  });

  const clearButton = document.getElementById('clear');
  clearButton.addEventListener('click', () => {
    canvas.clear();
  });

  const predictButton = document.getElementById('predict');
  predictButton.addEventListener('click', async () => {
    const dataUrl = canvas.getDataURL();
    const data64 = dataUrl.split(',')[1];
    const body = {
      generated_at: new Date().toISOString(),
      image: data64,
    };

    const response = await fetch(API + 'predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => response.json());

    console.log(response);
  });
}

window.addEventListener('load', () => {
  main();
});
