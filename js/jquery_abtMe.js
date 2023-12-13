;
(function($, window, undefined) { //Privatize the scope, pass in JQUERY ($) the window object (Which will be local) and explicitly state what undefined will be
    $.abtRotator = {
        defaults: {
            rotateSpeed: 15000,
            prevNextButtonsEnabled: true
        }
    }

    $.fn.extend({
        abtRotator: function(config) {
            const _config = $.extend(true, {}, $.abtRotator.defaults, config); //Combines the default with user passed in config, telling us how the rotator will behave
            return this.each(function() {
                const $proj_container = $(this);
                const header = $('.headerContainer');
                const list_items = $proj_container.find('.quoteContent');
                const rotateSpeed = _config.rotateSpeed < 3500 ? 3500 : _config.rotateSpeed;

                var rotationIsActive = true;

                
                let get_next_quote = function(quote) {
                    return quote.next('.quoteContent').length ? quote.next('.quoteContent') : $proj_container.find('.quoteContent:first'); //If we are not the end of the list of elements return next..else restart at the first (0)
                }


                let get_previous_quote = function(quote) {
                    return quote.prev('.quoteContent').length ? quote.prev('.quoteContent') : $proj_container.find('.quoteContent:last');
                }


                let rotate_quotes = function(direction = 'forward') {
                    rotationIsActive = false;
                    var active_quote = $proj_container.find('.quoteContent.active');
                    var next_quote = direction === 'forward' ? get_next_quote(active_quote) : get_previous_quote(active_quote);

                    active_quote.animate({
                        opacity: 0
                    }, 800, function() {
                        active_quote.hide();
                        list_items.css('opacity', 1);
                        next_quote.fadeIn(800);
                    });

                    active_quote.removeClass('active'); //Remove current active class and set the new one to be active (Aka hide prev slide show next)
                    next_quote.addClass('active');
                    rotationIsActive = true;
                }; //End rotate_quotes


                let autoRotate = function() { //Auto rotate based off passed in interval
                    setInterval(function() {
                        if (rotationIsActive) { rotate_quotes(); }
                    }, rotateSpeed);
                };


                let addNextPrevBttns = function() {
                    header.append( //Append to our list our Prev/Next Bttns
                        '<div class="nxtPrevButtons">\
                            <button class="prevBttn"> Prev </button>\
                            <h2>Fake Element</h2>\
                            <button class="nextBttn"> Next </button>\
                        </div>'
                    );
                    
                    function Click(e) { //functionality behind bttns, also clears interval to kickoff next element
                        if (rotationIsActive) { 
                            autoRotate(); //Resume auto rotation...
                            // Adds a delay in so we do NOT get multiple clicks and prevents slide breakage
                            
                            rotate_quotes($(e.target).hasClass('nextBttn') ? 'forward' : 'backward'); //if we've clicked nextBttn move forward, else we clicked prevBttn, so go back
                            setTimeout(function() {
                                $(this).one('click', Click);
                            }, 2000);
                        }
                    }
                    
                    $(this).one('click', Click);
                };
                if (_config.prevNextButtonsEnabled) { addNextPrevBttns(); } //If T enable Prev/Next Bttns
                list_items.not('.active').hide(); //Everything that currently doesn't have active hide
                autoRotate(); //Kick off auto rotation
            }) //End of return this.each
        }
    }) //End of the prototype function
})(jQuery, window); //Immediately run it upon being created