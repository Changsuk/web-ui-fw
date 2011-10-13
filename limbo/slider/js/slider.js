/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors:
 */

/**
 * Because the slider 'change' event is so rubbish (it gets triggered
 * whenever the slider handle moves, not just when the slider
 * value changes), intercept it to provide a new 'update' event,
 * which only fires when the value of the slider is updated.
 */
(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        _create: function() {
            this.currentValue = null;

            var self = this,
                inputElement = $(this.element),
                slider,
                handle,
                handleText,
                showPopup,
                hidePopup,
                positionPopup,
                updateSlider,
                popup = $('<div class="ui-slider-popup ui-slider-handle ui-shadow"></div>');

            // apply jqm slider
            inputElement.slider();

            // hide the slider input element proper
            inputElement.hide();

            // get the actual slider added by jqm
            slider = inputElement.next('.ui-slider');

            // get the handle
            handle = slider.find('.ui-slider-handle');

            // remove the rounded corners
            slider.removeClass('ui-btn-corner-all');

            // add a popup element (hidden initially)
            slider.before(popup);
            popup.hide();

            // get the element where value can be displayed
            handleText = slider.find('.ui-btn-text');

            // show the popup
            showPopup = function () {
                if (!self.popupVisible) {
                    popup.show();
                    self.popupVisible = true;
                }
            };

            // hide the popup
            hidePopup = function () {
                if (self.popupVisible) {
                    popup.hide();
                    self.popupVisible = false;
                }
            };

            // position the popup
            positionPopup = function () {
                popup.position({my: 'center bottom',
                                at: 'center top',
                                offset: '0 -5px',
                                of: handle});
            };

            // show value on the handle and in popup
            updateSlider = function () {
                positionPopup();

                // remove the title attribute from the handle (which is
                // responsible for the annoying tooltip); NB we have
                // to do it here as the jqm slider sets it every time
                // the slider's value changes :(
                handle.removeAttr('title');

                var newValue = self.element.val();

                if (newValue !== self.currentValue) {
                    self.currentValue = newValue;
                    handleText.html(newValue);
                    popup.html(newValue);
                    self.element.trigger('update', newValue);
                }
            };

            // set initial value
            updateSlider();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', updateSlider);

            // bind clicks on the handle to show the popup
            handle.bind('vmousedown', showPopup);

            // watch events on the document to turn off the slider popup
            slider.add(document).bind('vmouseup', hidePopup);
        },
    });

    // stop jqm from initialising sliders
    $(document).bind("pagebeforecreate", function (e) {
        if ($.data(window, "realInitSelector") === undefined ) {
            $.data(window,"realInitSelector", $.mobile.slider.prototype.options.initSelector);
            $.mobile.slider.prototype.options.initSelector = null;
        }
    });

    // initialise sliders with our own slider
    $(document).bind("pagecreate", function(e) {
        var realInitSelector = $.data(window,"realInitSelector");
        $(e.target).find(realInitSelector).todonsslider();
    });

})(jQuery, this);
