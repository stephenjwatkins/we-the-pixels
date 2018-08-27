Meteor.methods({
  getCanvasesDynamicData: function() {
    var data = Canvases.find({}, {
      fields: { canvasId: 1, lastSave: 1, lastPaint: 1},
      sort: { createdAt: -1 },
      limit: 21
    }).fetch();

    var formatedData = {};
    data.forEach(function(canvas) {
      formatedData[canvas.canvasId] = {};
      formatedData[canvas.canvasId].lastSave = canvas.lastSave;
      formatedData[canvas.canvasId].lastPaint = canvas.lastPaint;
    });

    return formatedData;
  },
  isValidUser: function() {
    return Meteor.user() && Meteor.user().emails[0].verified;
  },
  subscribeUserToNews: function(user) {
    WTPMail.subscribeUserToNews(user);
  },
  paintBatch: function(paints, lifeKey) {
    this.unblock();

    paints.forEach(function(paint) {
      Meteor.call('paint', paint.canvasId, paint.xPixel, paint.yPixel, paint.hexColor, lifeKey);
    });
  },
  eraseBatch: function(erases, lifeKey) {
    this.unblock();
    
    erases.forEach(function(erase) {
      Meteor.call('erase', erase.canvasId, erase.xPixel, erase.yPixel, lifeKey);
    });
  },
  paint: function(canvasId, xPixel, yPixel, hexColor, lifeKey) {
    this.unblock();

    // update pixel color
    CurrentPaints.update({
      canvasId: canvasId,
      x: xPixel,
      y: yPixel
    }, { $set: { color: hexColor } }, { upsert: true });

    // Save paint to the paint history
    var newAllPaint = {
      canvasId: canvasId,
      x: xPixel,
      y: yPixel,
      color: hexColor,
      date: new Date()
    };
    if (Meteor.userId()) {
      newAllPaint.userId = Meteor.userId();
    }
    AllPaints.insert(newAllPaint);

    // Update lastPaint
    Canvases.update({ 
      canvasId: canvasId
    }, { $set: { lastPaint: new Date() } });

    Meteor.call('sendLifeActivity', canvasId, lifeKey);
  },
  erase: function(canvasId, xPixel, yPixel, lifeKey) {
    this.unblock();

    CurrentPaints.remove({ 
      canvasId: canvasId,
      x: xPixel,
      y: yPixel
    });

    // Update lastPaint
    Canvases.update({ 
      canvasId: canvasId
    }, { $set: { lastPaint: new Date() } });

    Meteor.call('sendLifeActivity', canvasId, lifeKey);
  },
  getOwnerAccountFromId: function(ownerId) {
    var owner = Meteor.users.findOne({ _id: ownerId });
    return owner;
  },
  createCanvas: function(owner, subject, rows, cols) {
    var id = Meteor.call('getShortId', 'canvas');
    Canvases.insert({
      owner: owner,
      subject: subject,
      rows: rows,
      cols: cols,
      canvasId: id,
      createdAt: new Date(),
      lastPaint: -1,
      lastSave: -1
    });
    return id;
  },
  getShortId: function(counter) {
    Counter.update(
      { _id: counter },
      { $inc: { seq: 1 } }
    );
    return Counter.findOne({ _id: counter }).seq.toString(36);
  },
  createPNG: function(canvasId) {

    var canvas = Canvases.findOne({ canvasId: canvasId });

    // Create Small Canvas Image - 128
    WTPImage.createPNG({
      canvas: canvas,
      pixelSize: Meteor.call('calculatePixelSize', canvas.cols, canvas.rows, 128, 128, "cover"),
      pixels: CurrentPaints.find({ canvasId: canvasId }).fetch(),
      s3Path: "images/128/"
    });
    // Create Medium Canvas Image - 512
    WTPImage.createPNG({
      canvas: canvas,
      pixelSize: Meteor.call('calculatePixelSize', canvas.cols, canvas.rows, 512, 512, "cover"),
      pixels: CurrentPaints.find({ canvasId: canvasId }).fetch(),
      s3Path: "images/512/"
    });
    // Create Large Canvas Image - 1080
    WTPImage.createPNG({
      canvas: canvas,
      pixelSize: Meteor.call('calculatePixelSize', canvas.cols, canvas.rows, 1080, 1080, "cover"),
      pixels: CurrentPaints.find({ canvasId: canvasId }).fetch(),
      s3Path: "images/1080/"
    });

    // update last save for a canvas
    Canvases.update( {
      canvasId: canvasId
    }, { $set: { lastSave: new Date() } });

  },
  calculatePixelSize: function(cols, rows, maxWidth, maxHeight, sizeMode) {
    var size = 0;
    
    if ((cols > rows)) {    // Widescreen Image
            
        if (sizeMode == 'contain') {

        size = Math.floor(maxWidth / cols);
        var tempHeight = rows * size;

        // If the height is still taller than the container
        if (tempHeight > maxHeight) {
          size = Math.floor(maxHeight / rows);
        }
      } else if (sizeMode == 'cover') {

        size = Math.ceil(maxWidth / cols);
        var tempHeight = rows * size;

        // If the height is not equal to or taller than the container
        if (tempHeight < maxHeight) {
          size = Math.ceil(maxHeight / rows);
        }
      }
          
    } else {    // Tallscreen Image

          if (sizeMode == 'contain') {

        size = Math.floor(maxHeight / rows);
        var tempWidth = cols * size;

        // If the width is still wider than the container
        if (tempWidth > maxWidth) {
          size = Math.floor(maxWidth / cols);
        }
          } else if (sizeMode == 'cover') {

        size = Math.ceil(maxHeight / rows);
        var tempWidth = cols * size;

        // If the width is not equal to or wider than the container
        if (tempWidth < maxWidth) {
          size = Math.ceil(maxWidth / cols);
        }
      }
    }

    // // Min size for a pixel
    // if (size < minPixelSize) {
    //   size = minPixelSize;
    // }

    return size;
  }
});