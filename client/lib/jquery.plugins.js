// Smart background images
(function($) {
  $.fn.smartBackgroundImage = function(url) {
    var t = this;
    //create an img so the browser will download the image:
    $('<img />')
      .attr('src', url)
      .load(function(){ //attach onload to set background-image
         t.each(function(){ 
            $(this).css('backgroundImage', 'url('+url+'?c=' + (new Date()).getTime() + ')' );
         });
      });
     return this;
  };
}(jQuery));

// Tooltip Plugin
(function($) {

  var offset = 12,
      instantiated = [];

  $.fn.tooltip = function() {
    return this.each(function() {
      var $this = $(this),
          selector = $this.selector,
          message = $this.data('tooltip'),
          anchor = $this.data('tooltip-anchor'),
          color = $this.data('tooltip-color');

      if (_.contains(instantiated, $this[0])) {
        return;
      }

      instantiated.push($this[0]);

      $this.on('mouseenter', function(e) {

        var $tooltip = $('<div class="tooltip tooltip-' + anchor + ' ' + color + '"><span class="arrow"></span><span class="message"></span></div>').prependTo($('body'));

        $tooltip.find('.message').html(message);
        $tooltip.css({
          'position': 'absolute'
        });

        if (anchor == 'bottom') {
          $tooltip.css({
            'top': $this.offset().top + $this.outerHeight() + offset,
            'left': $this.offset().left - ($tooltip.outerWidth() / 2) + ($this.outerWidth() / 2)
          });
        } else if (anchor == 'right') {
          $tooltip.css({
            'top': $this.offset().top - ($tooltip.outerHeight() / 2) + ($this.outerHeight() / 2),
            'left': $this.offset().left + $this.outerWidth() + offset
          });
        }

      });

      $this.on('mouseleave', function(e) {
        $('.tooltip').remove();
      });

    });
  };
}(jQuery));