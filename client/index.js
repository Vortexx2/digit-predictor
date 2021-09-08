class Canvas {
  constructor(canvas_id, draw, coord) {
    this.canvas_id = canvas_id;
    this.draw = draw;
    this.coord = coord;
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
    ctx.strokeStyle = 'white';
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
  }
}

function main() {
  const canvas = new Canvas('sketch', false, { x: 0, y: 0 });

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
  clearButton.addEventListener("click", () => {
    canvas.clear();
  })
}

window.addEventListener('load', () => {
  main();
});
