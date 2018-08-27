var minPixelSize = 10;


basePixelLayer = function(canvasId, canvasEl, rows, cols, sizeMode, containerEl, containerPadding) {
    
  // Canvas Stuff
  this.canvasId = canvasId;
  this.sizeMode = sizeMode;
  this.containerEl = containerEl;
  this.containerPadding = containerPadding;
  if (this.sizeMode == 'contain') {
    this.canvas = new canvas(canvasEl,
                             containerEl.width() - containerPadding,
                             containerEl.height() - containerPadding);
  } else if (this.sizeMode == 'cover') {
    this.canvas = new canvas(canvasEl,
                             containerEl.width(),
                             containerEl.height());
  }
  this.canvas.layer = this;

  // Pixel Window Dimensions
  this.cols = cols;
  this.rows = rows;
  this.pixelSize = this.calculatePixelSize();
  this.canvas.resize(this.cols * this.pixelSize, this.rows * this.pixelSize);
}

basePixelLayer.prototype.calculatePixelSize = function() {
	var size = 0;
	
	if ((this.cols > this.rows)) {    // Widescreen Image
	        
	    if (this.sizeMode == 'contain') {

			size = Math.floor(this.canvas.maxWidth / this.cols);
			var tempHeight = this.rows * size;

			// If the height is still taller than the container
			if (tempHeight > this.canvas.maxHeight) {
				size = Math.floor(this.canvas.maxHeight / this.rows);
			}
		} else if (this.sizeMode == 'cover') {

			size = Math.ceil(this.canvas.maxWidth / this.cols);
			var tempHeight = this.rows * size;

			// If the height is not equal to or taller than the container
			if (tempHeight < this.canvas.maxHeight) {
				size = Math.ceil(this.canvas.maxHeight / this.rows);
			}
		}
        
	} else {    // Tallscreen Image

        if (this.sizeMode == 'contain') {

			size = Math.floor(this.canvas.maxHeight / this.rows);
			var tempWidth = this.cols * size;

			// If the width is still wider than the container
			if (tempWidth > this.canvas.maxWidth) {
				size = Math.floor(this.canvas.maxWidth / this.cols);
			}
        } else if (this.sizeMode == 'cover') {

			size = Math.ceil(this.canvas.maxHeight / this.rows);
			var tempWidth = this.cols * size;

			// If the width is not equal to or wider than the container
			if (tempWidth < this.canvas.maxWidth) {
				size = Math.ceil(this.canvas.maxWidth / this.cols);
			}
		}
	}

    // Min size for a pixel
	if (size < minPixelSize) {
		size = minPixelSize;
	}

	return size;
}

basePixelLayer.prototype.repaint = function() {
    var that = this;
    
    // Get existing paints and update the canvas
    CurrentPaints.find({ canvasId: this.canvasId }).forEach(function(pixelPaint) {
        that.drawPixel(pixelPaint.x, pixelPaint.y, pixelPaint.color);
    });
}

basePixelLayer.prototype.drawPixel = function(x, y, color) {
    this.canvas.graphics.fillStyle = color;
		this.canvas.graphics.fillRect(x * this.pixelSize,
                                  y * this.pixelSize,
                                  this.pixelSize,
                                  this.pixelSize);
}

basePixelLayer.prototype.erasePixel = function(x, y) {
		this.canvas.graphics.clearRect(x * this.pixelSize,
                                  y * this.pixelSize,
                                  this.pixelSize,
                                  this.pixelSize);
}

basePixelLayer.prototype.resize = function() {
	// Clear the canvas
	this.canvas.clear();
    
	var newWidth;
	var newHeight;
	if (this.sizeMode == 'contain') {
		newWidth = this.containerEl.width() - this.containerPadding;
		newHeight = this.containerEl.height() - this.containerPadding;
	} else if (this.sizeMode == 'cover') {
		newWidth = this.containerEl.width();
		newHeight = this.containerEl.height();
	}

    // Set the new max size of the canvas
	this.canvas.maxWidth = newWidth;
	this.canvas.maxHeight = newHeight;
	
	// Recalculate the Pixel Size and resize canvas element
	this.pixelSize = this.calculatePixelSize();
	this.canvas.resize(this.cols * this.pixelSize, this.rows * this.pixelSize);

	// Repaint the pixel window
	this.repaint();
}

basePixelLayer.prototype.contain = function() {
  this.sizeMode = 'contain';
  this.resize();
}

basePixelLayer.prototype.cover = function() {
  this.sizeMode = 'cover';
  this.resize();
}
