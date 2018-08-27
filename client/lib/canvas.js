canvas = function(canvasEl, maxWidth, maxHeight)
{
	this.width = 0;
	this.height = 0;
	this.maxWidth = maxWidth;
	this.maxHeight = maxHeight;
	this.canvasEl = canvasEl;
	this.graphics = canvasEl.getContext('2d');
	//this.layerObj = null;
}

canvas.prototype.resize = function(width, height)
{
	this.canvasEl.width = this.width = width;
	this.canvasEl.height = this.height = height;
}

canvas.prototype.clear = function()
{
	this.graphics.clearRect(0, 0, this.width, this.height);
}