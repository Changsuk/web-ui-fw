/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

// Displays a simple two-state switch.
//
// To apply, add the attribute data-role="switch" to a <div>
// element inside a page. Alternatively, call switch() 
// on an element, like this :
//
//     $("#myswitch").switch();
// where the html might be :
//     <div id="myswitch"></div>
//
// Options:
//     checked: Boolean; the state of the switch
//     Default: true (up)
//
// Events:
//     changed: Emitted when the switch is changed

(function($, undefined) {

$.widget("todons.switch", $.todons.widgetex, {
    options: {
        checked: true,
        initSelector: ":jqmData(role='switch')"
    },

    _htmlProto: {
        ui: {
            outer:            "#switch",
            normalBackground: "#switch-inner-normal",
            activeBackground: "#switch-inner-active",
            tButton:          "#switch-button-t",
            fButton:          "#switch-button-f",
            realButton:       "#switch-button-outside-real",
            refButton:        "#switch-button-outside-ref"
        }
    },

    _create: function() {
        var self = this,
            dstAttr = this.element.is("input") ? "checked" : "data-checked";

        this.element.append(this._ui.outer);
        this._ui.outer.find("a").buttonMarkup({inline: true, corners: true});

        $.extend(this, {
            realized: false,
            dstAttr: dstAttr
        });

        $.mobile.todons.parseOptions(this, true);

        if (this.element.closest(".ui-page").is(":visible"))
            this._realize();
        else
            this.element.closest(".ui-page").bind("pageshow", function() { self._realize(); });

        this._ui.realButton.bind("vclick", function(e) {
            self._toggle();
            e.stopPropagation();
        });

        this._ui.normalBackground.bind("vclick", function(e) {
            self._toggle();
            e.stopPropagation();
        });
    },

    _toggle: function() {
        this._setChecked(!(this.options.checked));
    },

    _setOption: function(key, value, unconditional) {
        if (undefined === unconditional)
            unconditional = false;
        if (key === "checked")
            this._setChecked(value, unconditional);
    },

    _realize: function() {
        this._ui.realButton
            .position({
                my: "center center",
                at: "center center",
                of: this._ui[(this.options.checked ? "t" : "f") + "Button"]
            })
            .removeClass("switch-button-transparent");
        this._ui.activeBackground.find("a").addClass("switch-button-transparent");
        this._ui.normalBackground.find("a").addClass("switch-button-transparent");
        this._ui.normalBackground.css({"opacity": this.options.checked ? 0.0 : 1.0});
        this._ui.activeBackground.css({"opacity": this.options.checked ? 1.0 : 0.0});

        this.rendered = true;
    },

    _setChecked: function(checked, unconditional) {
        if (this.options.checked != checked || unconditional) {
            if (this.rendered) {
                this._ui.refButton.position({
                    my: "center center", 
                    at: "center center",
                    of: this._ui[(checked ? "t" : "f") + "Button"]
                });
                this._ui.realButton.animate({"top": this._ui.refButton.position().top});
            }

            this._ui.normalBackground.animate({"opacity": checked ? 0.0 : 1.0});
            this._ui.activeBackground.animate({"opacity": checked ? 1.0 : 0.0});

            this.options.checked = checked;
            this.element.attr(this.dstAttr, checked ? "true" : "false");
            this.element.triggerHandler("changed", checked);
        }
    },
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.switch.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .switch();
});

})(jQuery);
