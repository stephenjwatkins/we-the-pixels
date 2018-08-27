WTPImage = {

  isCanvasStale: function(lastSave, lastPaint) {

    var threshold = 1 * 60 * 1000; // 1 minute

    if (!lastSave || lastSave < 0) { // never been saved
      return true;
    }

    if (lastPaint < 0) { // never been painted
      return false;
    }

    return (lastPaint.getTime() > lastSave.getTime()) && 
             (((new Date()).getTime() - lastSave) > threshold);
  }

};