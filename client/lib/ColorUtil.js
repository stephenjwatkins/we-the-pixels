ColorUtil = {
  isDarkColor: function(r, g, b) {
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return (luma < 40);
  }
};