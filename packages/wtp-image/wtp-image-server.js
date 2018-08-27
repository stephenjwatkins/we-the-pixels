var gm = Npm.require("gm");
var knox = Npm.require("knox");
Npm.require("bufferjs");

var client = knox.createClient({
    key: 'AKIAIMDYBT56IRTJMI5Q'
  , secret: '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'
  , bucket: Meteor.settings.public.s3Bucket
});

WTPImage = {

  createPNG: function(args) {

    var canvas = args.canvas,
        pixelSize = args.pixelSize,
        pixels = args.pixels,
        s3Path = args.s3Path;

    // start with a blank image
    var gmImage = gm(pixelSize * canvas.cols, pixelSize * canvas.rows, '#000000ff');

    // Draw the pixels on the new blank image
    pixels.forEach(function(pixel) {

      var startX = pixel.x * pixelSize;
      var startY = pixel.y * pixelSize;

      gmImage.fill(pixel.color)
        .drawRectangle(startX, startY, startX +  pixelSize - 1, startY +  pixelSize - 1);

    });

    console.log('Creating image (pixel size ' + pixelSize + ') for canvas ' + canvas.canvasId);
    gmImage.stream('png', function (err, stdout, stderr) {

      var i = [];
      stdout.on( 'data', function(data) {
        i.push( data );
      });

      stdout.on( 'close', function() {

        // put the stream in the s3 bucket
        client.putBuffer(Buffer.concat(i), s3Path + canvas.canvasId + '.png',
          {'Content-Type': 'image/png'}, function (err, res) {
          
          if (!err) {
            console.log('successfully put stream for canvas ' + canvas.canvasId + ' to s3: ' + res);
          } else {
            console.error(err);
          }

        });

      });        

    });

  }

};