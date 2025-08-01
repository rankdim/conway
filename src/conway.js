export class ConwayGameOfLife {
  static DEFAULT_OPTIONS = {
    cellSize: 10,
    gridWidth: 50,
    gridHeight: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    cellColor: "rgba(13, 63, 68, 1)",
    deadCellColor: "rgba(215, 74, 74, 0.5)",
    gridColor: "rgba(0, 0, 0, 0.1)",
    showGrid: true,
    showDead: true,
    animationSpeed: 600,
    toroidal: true,
  };

  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found.`);
    }

    this.ctx = this.canvas.getContext("2d");

    this.options = {
      ...ConwayGameOfLife.DEFAULT_OPTIONS,
      ...options,
    };

    this.grid = this.createEmptyGrid();
    this.isRunning = false;
    this.generation = 0;
    this.animationId = null;

    this.setupCanvas();
  }

  // =================================================================================
  // PUBLIC API
  // =================================================================================

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
    }
  }

  step() {
    if (this.isRunning) return;
    this.nextGeneration();
    this.render();
  }

  place(pattern, offsetX = 0, offsetY = 0) {
    if (!Array.isArray(pattern) || !Array.isArray(pattern[0])) {
      throw new Error("Pattern must be a 2D array.");
    }

    const patternHeight = pattern.length;
    const patternWidth = pattern[0].length;
    const gridHeight = this.options.gridHeight;
    const gridWidth = this.options.gridWidth;

    if (
      offsetX < 0 ||
      offsetY < 0 ||
      offsetX + patternWidth > gridWidth ||
      offsetY + patternHeight > gridHeight
    ) {
      throw new Error(
        `Pattern does not fit in the grid at offset (${offsetX}, ${offsetY}).`
      );
    }

    for (let y = 0; y < patternHeight; y++) {
      for (let x = 0; x < patternWidth; x++) {
        const gridX = x + offsetX;
        const gridY = y + offsetY;

        this.grid[gridY][gridX] = pattern[y][x] ? 1 : 0;
      }
    }
    this.render();
  }

  clear() {
    this.stop();
    this.grid = this.createEmptyGrid();
    this.generation = 0;
    this.render();
  }

  randomize(probability = 0.3) {
    this.stop();
    for (let y = 0; y < this.options.gridHeight; y++) {
      for (let x = 0; x < this.options.gridWidth; x++) {
        this.grid[y][x] = Math.random() < probability ? 1 : 0;
      }
    }
    this.generation = 0;
    this.render();
  }

  // =================================================================================
  // INTERNAL GAME LOGIC
  // =================================================================================

  nextGeneration() {
    const newGrid = this.createEmptyGrid();

    for (let y = 0; y < this.options.gridHeight; y++) {
      for (let x = 0; x < this.options.gridWidth; x++) {
        const neighbors = this.countNeighbors(x, y);
        const isAlive = this.grid[y][x] === 1;

        if (isAlive) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 2;
        } else {
          newGrid[y][x] = neighbors === 3 ? 1 : 0;
        }
      }
    }

    this.grid = newGrid;
    this.generation++;
  }

  countNeighbors(x, y) {
    let count = 0;
    const { gridWidth, gridHeight, toroidal } = this.options;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        let nx = x + dx;
        let ny = y + dy;

        if (toroidal) {
          nx = (nx + gridWidth) % gridWidth;
          ny = (ny + gridHeight) % gridHeight;
          if (this.grid[ny][nx] === 1) count++;
        } else if (this.isValidPosition(nx, ny) && this.grid[ny][nx] === 1) {
          count++;
        }
      }
    }
    return count;
  }

  // =================================================================================
  // RENDERING
  // =================================================================================

  render() {
    this.clearCanvas();
    this.drawCells();
    if (this.options.showGrid) {
      this.drawGrid();
    }
  }

  drawGrid() {
    const { cellSize } = this.options;
    const { width, height } = this.canvas;
    this.ctx.strokeStyle = this.options.gridColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(width, y + 0.5);
    }

    this.ctx.stroke();
  }

  drawCells() {
    const {
      cellSize,
      cellColor,
      deadCellColor,
      showDead,
      gridHeight,
      gridWidth,
    } = this.options;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const state = this.grid[y][x];
        const xPos = x * cellSize;
        const yPos = y * cellSize;

        if (state === 1) {
          this.ctx.fillStyle = cellColor;
          this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
        } else if (showDead && state === 2) {
          this.ctx.fillStyle = deadCellColor;
          this.ctx.fillRect(xPos, yPos, cellSize, cellSize);
        }
      }
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // =================================================================================
  // SETUP & HELPERS
  // =================================================================================

  setupCanvas() {
    const { cellSize, gridWidth, gridHeight } = this.options;
    this.canvas.width = gridWidth * cellSize;
    this.canvas.height = gridHeight * cellSize;
  }

  createEmptyGrid() {
    const { gridWidth, gridHeight } = this.options;
    const grid = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[y] = new Array(gridWidth).fill(0);
    }
    return grid;
  }

  isValidPosition(x, y) {
    return (
      x >= 0 &&
      x < this.options.gridWidth &&
      y >= 0 &&
      y < this.options.gridHeight
    );
  }

  animate() {
    if (!this.isRunning) return;

    this.nextGeneration();
    this.render();

    this.animationId = setTimeout(
      () => this.animate(),
      this.options.animationSpeed
    );
  }
}

export const conway = (canvasId, options) =>
  new ConwayGameOfLife(canvasId, options);
