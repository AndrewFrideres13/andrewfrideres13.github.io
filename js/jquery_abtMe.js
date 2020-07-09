;(function($, window, undefined) { //Privatize the scope, pass in JQUERY ($) the window object (Which will be local) and explicitly state what undefined will be
  var Modernizr = window.Modernizr;
  $.abtRotator = {
    defaults: {
      rotateSpeed: 15000,
      pauseOnHoverEnabled: true,
      prevNextButtonsEnabled: true
    }
  }

  $.fn.extend({
    abtRotator: function(config) {
      var config = $.extend(true, {}, $.abtRotator.defaults, config); //Combines the default with user passed in config, telling us how the rotator will behave
      return this.each(function() {
        var rotation; //Interval rotation
        var aboutMeElements = $(this);
        var list_items = aboutMeElements.find('.quoteContent');
        var rotationIsActive = true;
        var rotateSpeed = config.rotateSpeed < 2000 ? 2000 : config.rotateSpeed;
        
        var add_active_class = function() {
          var active_class_not_already_applied = aboutMeElements.find('.quoteContent.active').length === 0;
          aboutMeElements.find('.quoteContent:first').addClass('active');
        }();
        
        var get_next_quote = function(quote) {
          return quote.next('.quoteContent').length ? quote.next('.quoteContent') : aboutMeElements.find('.quoteContent:first'); //If we are not the end of the list of elements return next..else restart at the first (0)
        }
        
        var get_previous_quote = function(quote) {
          return quote.prev('.quoteContent').length ? quote.prev('.quoteContent') : aboutMeElements.find('.quoteContent:last');
        }
        
        var rotate_quotes = function(direction) {
          var active_quote = aboutMeElements.find('.quoteContent.active');
          var next_quote = direction === 'forward' ? get_next_quote(active_quote) : get_previous_quote(active_quote)
          
          active_quote.animate({
            opacity: 0
          }, 800, function() {
            active_quote.hide();
            list_items.css('opacity', 1);
            next_quote.fadeIn(800);
          });
          
          active_quote.removeClass('active'); //Remove current active class and set teh net one to be active (Aka hide prev, show next)
          next_quote.addClass('active');
        }; //End rotate_quotes
        
        var autoRotate = function() { //Auto rotate based off passed in interval
          rotation = setInterval(function() {
            if (rotationIsActive) { rotate_quotes('forward'); }
          }, rotateSpeed);
        };

        var pauseRotation = function() { // If hovering set rotation to false and stop slide, otherwise on out resume rotating
          aboutMeElements.hover(function() {
            rotationIsActive = false;
          }, function() {
            rotationIsActive = true;
          });
        };
        
        var addNextPrevBttns = function() {
          aboutMeElements.append( //Append to our list our Prev/Next Bttns
            '<div class="nxtPrevButtons">\
              <button class="prevBttn"> Prev </button>\
              <button class="nextBttn"> Next </button>\
            </div>'
          );
          aboutMeElements.find('button').click(function() { //functionality behind bttns, also clears interval to kickoff next element
            clearInterval(rotation);
            rotate_quotes( $(this).hasClass('nextBttn') ? 'forward' : 'backward' ); //Determines if we go forward or back depending on bttn press
            autoRotate();//Resume auto rotation...
          });
        };
        if (config.prevNextButtonsEnabled) { addNextPrevBttns(); } //If T enable Prev/Next Bttns
        if (config.pauseOnHoverEnabled) { pauseRotation(); } //If T enable rotation pause on hover
        list_items.not('.active').hide();//Everything that currently doesn't have active hide
        autoRotate();//Kick off auto rotation
      })//End of return this.each
    }
  })//End of the prototype function
})(jQuery, window); //Immediately run it upon being created