gridPixelLayer = function(canvasEl, baseLayer) {
    
  this.baseLayer = baseLayer;

	// Canvas Stuff
	this.canvas = new canvas(canvasEl, baseLayer.canvas.maxWidth, baseLayer.canvas.maxHeight);
	this.canvas.layer = this;

	// Pixel Window Dimensions
	this.canvas.resize(baseLayer.cols * baseLayer.pixelSize, baseLayer.rows * baseLayer.pixelSize);

	// Hover vars
	this.hovering = false;
	this.hoverPixelX;
	this.hoverPixelY;
}

gridPixelLayer.prototype.repaint = function() {
    var that = this;
}

gridPixelLayer.prototype.drawPixel = function(x, y, color) {
  this.canvas.graphics.fillStyle = color;
	this.canvas.graphics.fillRect(x * this.pixelSize,
                                  y * this.pixelSize,
                                  this.pixelSize,
                                  this.pixelSize);
}

gridPixelLayer.prototype.resize = function() {
	// Clear the canvas
	this.canvas.clear();

	// Set the new max size of the canvas
	this.canvas.maxWidth = this.baseLayer.canvas.maxWidth;
	this.canvas.maxHeight = this.baseLayer.canvas.maxHeight;
	
	// Resize canvas element
	this.canvas.resize(this.baseLayer.cols * this.baseLayer.pixelSize,
	                   this.baseLayer.rows * this.baseLayer.pixelSize);

	// Repaint the pixel window
	this.repaint();
}

gridPixelLayer.prototype.repaint = function() {

  // Clear the rectangle and draw the new hover pixel
  this.canvas.clear();
  if (this.hovering) {
    this.drawGrid();
    this.drawPixelHover(this.hoverPixelX, this.hoverPixelY);
  }
}

gridPixelLayer.prototype.drawPixelHover = function(x, y) {

  var p = this.baseLayer.pixelSize;

  // Thick layer - white
  this.canvas.graphics.lineWidth = 3;
  this.canvas.graphics.strokeStyle = 'rgba(255,255,255,0.7)';
  this.canvas.graphics.strokeRect((x * p) + 0.5, (y * p) + 0.5, p - 1, p - 1);

  // Thin layer - black or grey
  this.canvas.graphics.lineWidth = 1;
  var selected = false;  // no selections for now
  if (selected) {
    this.canvas.graphics.strokeStyle = 'rgba(0,0,0,0.7)';
  } else {
    this.canvas.graphics.strokeStyle = 'rgba(119,119,119,0.7)';
  }
  this.canvas.graphics.strokeRect((x * p) + 0.5, (y * p) + 0.5, p - 1, p - 1);
}

gridPixelLayer.prototype.drawGrid = function() {

  var p = this.baseLayer.pixelSize;
  var rows = Math.floor(this.canvas.height / p);
  var cols = Math.floor(this.canvas.width / p);

  this.canvas.graphics.lineWidth = 1;
  this.canvas.graphics.strokeStyle = 'rgba(110,110,110,.25)';

  // draw rows
  for (var i = 1; i < rows; i++) {

      var y = i * p;

      this.canvas.graphics.beginPath();
      this.canvas.graphics.moveTo(0, y + 0.5);
      this.canvas.graphics.lineTo(this.canvas.width, y + 0.5);
      this.canvas.graphics.stroke();
  }

  // draw cols
  for (var i = 1; i < cols; i++) {

      var x = i * p;

      this.canvas.graphics.beginPath();
      this.canvas.graphics.moveTo(x + 0.5, 0);
      this.canvas.graphics.lineTo(x + 0.5, this.canvas.height);
      this.canvas.graphics.stroke();
  }
}
