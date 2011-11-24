/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Max Waterman <max.waterman@intel.com>
 */

// Todonsslider modifies the JQuery Mobile slider and is created in the same way.
//
// See the JQuery Mobile slider widget for more information :
//     http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-slider.html
//
// The JQuery Mobile slider option:
//     theme: specify the theme using the 'data-theme' attribute
//
// Options:
//     theme: string; the theme to use if none is specified using the 'data-theme' attribute
//            default: 'c'
//     popupEnabled: boolean; controls whether the popup is displayed or not
//                   specify if the popup is enabled using the 'data-popupEnabled' attribute
//                   set from javascript using .todonsslider('option','popupEnabled',newValue)
//     initDeselector: string; the selector that is used to determine which elements should be
//                     regular jQuery Mobile sliders
//                     default: 'select, .useJqmSlider'
//
// Events:
//     changed: triggers when the value is changed (rather than when the handle is moved)
//
// Examples:
//
//     <a href="#" id="popupEnabler" data-role="button" data-inline="true">Enable popup</a>
//     <a href="#" id="popupDisabler" data-role="button" data-inline="true">Disable popup</a>
//     <div data-role="fieldcontain">
//         <input id="mySlider" data-theme='a' data-popupenabled='false' type="range" name="slider" value="7" min="0" max="9" />
//     </div>
//     <div data-role="fieldcontain">
//         <input id="mySlider2" type="range" name="slider" value="77" min="0" max="777" />
//     </div>
//
//     // disable popup from javascript
//     $('#mySlider').todonsslider('option','popupEnabled',false);
//
//     // from buttons
//     $('#popupEnabler').bind('vclick', function() {
//         $('#mySlider').todonsslider('option','popupEnabled',true);
//     });
//     $('#popupDisabler').bind('vclick', function() {
//         $('#mySlider').todonsslider('option','popupEnabled',false);
//     });
//     <div data-role="fieldcontain">
//         <label for="myJqmSlider">Use jQuery Mobile slider</label>
//         <input id="myJqmSlider" name="myJqmSlider" type="range" value="77" min="0" max="99" class="useJqmSlider"/>
//     </div>

(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        options: {
            theme: 'c',
            popupEnabled: true,
            initDeselector: 'select, .useJqmSlider'
        },

        popup: null,
        handle: null,
        handleText: null,

        _create: function() {
            this.currentValue = null;
            this.popupVisible = false;

            var self = this,
                inputElement = $(this.element),
                themeClass,
                slider,
                showPopup,
                hidePopup,
                positionPopup,
                updateSlider;

            // apply jqm slider
            inputElement.slider();

            // hide the slider input element proper
            inputElement.hide();

            // theming; override default with the slider's theme if present
            this.options.theme = this.element.data('theme') || this.options.theme;
            themeClass = 'ui-body-' + this.options.theme;
            self.popup = $('<div class="' + themeClass + ' ui-slider-popup ui-shadow"></div>');

            // set the popupEnabled according to the html attribute
            var popupEnabledAttr = inputElement.attr('data-popupenabled');
            if ( popupEnabledAttr !== undefined ) {
                self.options.popupEnabled = popupEnabledAttr==='true';
            }

            // get the actual slider added by jqm
            slider = inputElement.next('.ui-slider');

            // get the handle
            self.handle = slider.find('.ui-slider-handle');

            // remove the rounded corners from the slider and its children
            slider.removeClass('ui-btn-corner-all');
            slider.find('*').removeClass('ui-btn-corner-all');

            // add a popup element (hidden initially)
            slider.before(self.popup);
            self.popup.hide();

            // get the element where value can be displayed
            self.handleText = slider.find('.ui-btn-text');

            // set initial value
            self.updateSlider();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', function () {
                self.updateSlider();
            });

            // bind clicks on the handle to show the popup
            self.handle.bind('vmousedown', function () {
                self.showPopup();
            });

            // watch events on the document to turn off the slider popup
            slider.add(document).bind('vmouseup', function () {
                self.hidePopup();
            });
        },

        // position the popup centered 5px above the handle
        positionPopup: function () {
            var dstOffset = this.handle.offset();
            this.popup.offset({
                left: dstOffset.left + (this.handle.width() - this.popup.width()) / 2,
                top:  dstOffset.top  - this.popup.outerHeight() - 5});
        },

        // show value on the handle and in popup
        updateSlider: function () {
            this.positionPopup();

            // remove the title attribute from the handle (which is
            // responsible for the annoying tooltip); NB we have
            // to do it here as the jqm slider sets it every time
            // the slider's value changes :(
            this.handle.removeAttr('title');

            var newValue = this.element.val();

            if (newValue !== this.currentValue) {
                this.currentValue = newValue;
                this.handleText.html(newValue);
                this.popup.html(newValue);
                this.element.trigger('update', newValue);
            }
        },

        // show the popup
        showPopup: function () {
            var needToShow = (this.options.popupEnabled && !this.popupVisible);
            if (needToShow) {
                this.handleText.hide();
                this.popup.show();
                this.popupVisible = true;
            }
        },

        // hide the popup
        hidePopup: function () {
            var needToHide = (this.options.popupEnabled && this.popupVisible);
            if (needToHide) {
                this.handleText.show();
                this.popup.hide();
                this.popupVisible = false;
            }
        },

        _setOption: function(key, value) {
            var needToChange = value !== this.options[key];
            switch (key) {
            case 'popupEnabled':
                if (needToChange) {
                    this.options.popupEnabled = value;
                    if (this.options.popupEnabled) {
                        this.updateSlider();
                    } else {
                        this.hidePopup();
                    }
                }
                break;
            }
        },

    });

    // stop jqm from initialising sliders
    $(document).bind("pagebeforecreate", function (e) {
        if ($.data(window, "jqmSliderInitSelector") === undefined ) {
            $.data(window,"jqmSliderInitSelector", $.mobile.slider.prototype.options.initSelector);
            $.mobile.slider.prototype.options.initSelector = null;
        }
    });

    // initialise sliders with our own slider
    $(document).bind("pagecreate", function(e) {
        var jqmSliderInitSelector = $.data(window,"jqmSliderInitSelector");
        $(e.target).find(jqmSliderInitSelector).not($.todons.todonsslider.prototype.options.initDeselector).todonsslider();
        $(e.target).find(jqmSliderInitSelector).filter('select').slider();
    });

})(jQuery, this);
