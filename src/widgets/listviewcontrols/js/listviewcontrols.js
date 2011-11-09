/*
 * jQuery Mobile Widget @VERSION - listview controls
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// This extension supplies API to toggle the "mode" in which a list
// is displayed. The modes available is configurable, but defaults
// to ['edit', 'view']. A list can also have a control panel associated
// with it. The visibility of the control panel is governed by the current
// mode (by default, it is visible in 'edit' mode); elements within
// the listview can also be marked up to be visible in one or more of the
// available modes.
//
// One example use case would be a control panel with a "Select all" checkbox
// which, when clicked, selects all of the checkboxes in the associated
// listview items.
//
// The control panel itself should be defined as a form element.
// By default, the control panel will be hidden when the listview is
// initialised, unless you supply mode="edit" as a
// data-listview-controls option (when using the default modes). If you
// want the control panel to be visible in some mode other than
// the default, use a data-listviewcontrols-show-in="<mode>" attribute
// on the control panel element.
//
// Example usage (using the default 'edit' and 'view' modes):
//
// <!-- this is the controls element, displayed in 'edit' mode by default -->
// <form id="listviewcontrols-control-panel">
//   <fieldset data-role="controlgroup">
//     <input type="checkbox" id="listviewcontrols-demo-checkbox-uber" />
//     <label for="listviewcontrols-demo-checkbox-uber">Select all</label>
//   </fieldset>
// </form>
//
// <!-- this is the list associated with the controls -->
// <ul data-role="listview" data-listviewcontrols="#listviewcontrols-control-panel">
//
//   <li>
//
//     <!-- this element is only visible in 'edit' mode -->
//     <fieldset data-role="controlgroup" data-listviewcontrols-show-in="edit">
//       <input type="checkbox" id="listviewcontrols-demo-checkbox-1" />
//       <label for="listviewcontrols-demo-checkbox-1">Greg</label>
//     </fieldset>
//
//     <!-- this element is only visible in 'view' mode -->
//     <span data-listviewcontrols-show-in="view">Greg</span>
//
//   </li>
//
//   ... more li elements marked up the same way ...
//
// </ul>
//
// To associate the listview with the control panel, add
// data-listviewcontrols="..selector.." to a listview, where
// selector selects a single element (the control panel
// you defined). If you then call
// listviewcontrols('option', 'mode', 'edit') on the
// listview, the controls are made visible (this is just a proxy for
// calling show() on the associated form containing the controls).
//
// Inside the listview's items, add controls to each item
// which are only visible when in one of the modes. To do this,
// add form elements (e.g. checkboxes) to the items as you see fit. Then,
// mark each form element with data-listviewcontrols-show-in="<mode>".
// The control's visibility now depends on the mode of the listviewcontrols:
// it is only shown when its <mode> setting matches the current mode
// of the listviewcontrols widget. You are responsible for properly
// styling the form elements inside the listview so the listview looks
// correct when they are hidden or visible.
//
// The control panel (by default, visible when in "show" mode) is flexible
// and can contain any valid form elements (or other jqm components). It's
// up to you to define the behaviour associated with interactions on
// the control panel and/or controls inside list items.
//
// Methods:
//
//   visibleListItems
//     Returns a jQuery object containing all the li elements in the
//     listview which are currently visible and not dividers. (This
//     is just a convenience to make operating on the list as a whole
//     slightly simpler.)
//
// Options (set in options hash passed to constructor, or via the
// option method, or declaratively by attribute described below):
//
//   controlPanelSelector {String}
//     Selector string for selecting the element representing the
//     control panel for the listview. The context for find() is the
//     document (to give the most flexibility), so your selector
//     should be specific. Set declaratively with
//       data-listviewcontrols="...selector...".
//
//   modesAvailable {String[]; default=['edit', 'view']}
//     An array of the modes available for these controls.
//
//   mode {String}
//     Current mode for the widget, which governs the visibility
//     of the listview control panel and any elements marked
//     with data-listviewcontrols-show-in="<mode>".
//     Set declaratively with
//       data-listviewcontrols-options='{"mode":"<mode>"}'.
//
//   controlPanelShowIn {String}
//     The mode in which the control panel is visible; defaults to the
//     first element of modesAvailable. Can be set declaratively
//     on the listview controls element with
//       data-listviewcontrols-show-in="<mode>"

(function ($) {

$.widget("todons.listviewcontrols", $.mobile.widget, {
    _defaults: {
        controlPanelSelector: null,
        modesAvailable: ['edit', 'view'],
        mode: 'view',
        controlPanelShowIn: null
    },

    _listviewCssClass: 'ui-listviewcontrols-listview',
    _controlsCssClass: 'ui-listviewcontrols-panel',

    _create: function () {
        var self = this,
            o = this.options,
            optionsValid = true,
            page = this.element.closest('.ui-page'),
            controlPanelSelectorAttr = 'data-' + $.mobile.ns + 'listviewcontrols',
            controlPanelSelector = this.element.attr(controlPanelSelectorAttr),
            dataOptions = this.element.jqmData('listviewcontrols-options');

        o.controlPanelSelector = o.controlPanelSelector || controlPanelSelector;

        // precedence for options: defaults < jqmData attribute < options arg
        o = $.extend({}, this._defaults, dataOptions, o);

        optionsValid = (this._validOption('modesAvailable', o.modesAvailable, o) &
                        this._validOption('controlPanelSelector', o.controlPanelSelector, o) &
                        this._validOption('mode', o.mode, o));

        if (!optionsValid) {
            console.error('Could not create listviewcontrols widget due to ' +
                          'invalid option(s)');
            return false;
        }

        // get the controls element
        this.controlPanel = $(document).find(o.controlPanelSelector).first();

        if (this.controlPanel.length === 0) {
            console.error('Could not create listviewcontrols widget: ' +
                          'controlPanelSelector didn\'t select any elements');
            return false;
        }

        // once we have the controls element, we may need to override the
        // mode in which controls are shown
        o.controlPanelShowIn = this.controlPanel.jqmData('listviewcontrols-show-in') || o.controlPanelShowIn;

        if (!this._validOption('controlPanelShowIn', o.controlPanelShowIn, o)) {
            console.error('Could not create listviewcontrols widget due to ' +
                          'invalid show-in option on controls element');
            return;
        }
        else {
            o.controlPanelShowIn = o.modesAvailable[0];
        }

        // mark the controls and the list with a class to demonstrate
        this.element.removeClass(this._listviewCssClass).addClass(this._listviewCssClass);
        this.controlPanel.removeClass(this._controlsCssClass).addClass(this._controlsCssClass);

        // show the widget
        if (page && !page.is(':visible')) {
            page.bind('pageshow', function () { self.refresh(); });
        }
        else {
            this.refresh();
        }
    },

    _validOption: function (varName, value, otherOptions) {
        var ok = false;

        if (varName === 'mode') {
            ok = ($.inArray(value, otherOptions.modesAvailable) >= 0);

            if (!ok) {
                console.error('Invalid mode for listviewcontrols widget ' +
                              '(should be one of modesAvailable)');
            }
        }
        else if (varName === 'controlPanelSelector') {
            ok = ($.type(value) === 'string');

            if (!ok) {
                console.error('Invalid controlPanelSelector for ' +
                              'listviewcontrols widget');
            }
        }
        else if (varName === 'modesAvailable') {
            ok = ($.isArray(value) && value.length > 1);

            if (ok) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] === '' || $.type(value[i]) !== 'string') {
                        ok = false;
                    }
                }
            }

            if (!ok) {
                console.error('Invalid modesAvailable for listviewcontrols ' +
                              'widget (should be array of strings with at least ' +
                              '2 members)');
            }
        }
        else if (varName === 'controlPanelShowIn') {
            ok = ($.inArray(value, otherOptions.modesAvailable) >= 0);

            if (!ok) {
                console.error('Invalid controlPanelShowIn mode');
            }
        }

        return ok;
    },

    _setOption: function (varName, value) {
        var oldValue = this.options[varName];

        if (oldValue !== value && this._validOption(varName, value)) {
            this.options[varName] = value;
            this.refresh();
        }
    },

    visibleListItems: function () {
        return this.element.find('li:not(:jqmData(role=list-divider)):visible');
    },

    refresh: function () {
        var self = this,
            triggerUpdateLayout = false,
            isVisible = null,
            showIn,
            modalElements;

        // hide/show the control panel and hide/show controls inside
        // list items based on their "show-in" option
        isVisible = this.controlPanel.is(':visible');

        if (this.options.mode === this.options.controlPanelShowIn) {
            this.controlPanel.show();
        }
        else {
            this.controlPanel.hide();
        }

        if (this.controlPanel.is(':visible') !== isVisible) {
            triggerUpdateLayout = true;
        }

        // we only operate on elements inside list items which aren't dividers
        modalElements = this.element.find('li:not(:jqmData(role=list-divider))')
                                    .find(':jqmData(listviewcontrols-show-in)');

        modalElements.each(function () {
            showIn = $(this).jqmData('listviewcontrols-show-in');

            isVisible = $(this).is(':visible');

            if (showIn === self.options.mode) {
                $(this).show();
            }
            else {
                $(this).hide();
            }

            if ($(this).is(':visible') !== isVisible) {
                triggerUpdateLayout = true;
            }
        });

        if (triggerUpdateLayout) {
            this.element.trigger('updatelayout');
        }
    }
});

$('ul').live('listviewcreate', function () {
	var list = $(this);

	if (list.is(':jqmData(listviewcontrols)')) {
		list.listviewcontrols();
	}
});

})(jQuery);
