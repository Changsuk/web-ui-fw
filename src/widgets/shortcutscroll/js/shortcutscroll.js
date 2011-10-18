/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * shortcutscroll is a scrollview controller, which binds
 * a scrollview to a a list of short cuts; the shortcuts are built
 * from the text on dividers in the list. Clicking on a shortcut
 * instantaneously jumps the scrollview to the selected list divider;
 * mouse movements on the shortcut column move the scrollview to the
 * list divider matching the text currently under the touch; a popup
 * with the text currently under the touch is also displayed.
 *
 * To apply, add the attribute data-shortcutscroll="true" to a listview
 * (a <ul> or <ol> element inside a page). Alternatively, call
 * shortcutscroll() on an element (this allows configuration of
 * the scrollview to be controlled).
 *
 * If a scrollview is not passed as an option to the widget, the parent
 * of the listview is assumed to be the scrollview under control.
 *
 * If a listview has no dividers or a single divider, the widget won't
 * display.
 *
 * Options:
 *
 *   scrollview:   Element to use as the scrollview for the shortcutscroll.
 *                 Can only be set programmatically. Defaults to the parent
 *                 element of the list which has data-shortcutscroll="true"
 *                 set on it.
 */
(function( $, undefined ) {

$.widget( "todons.shortcutscroll", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(shortcutscroll)",
        scrollview: null
    },

    _create: function () {
        var $el = this.element,
            o = this.options,
            shortcutsContainer = $('<div class="ui-shortcutscroll"/>'),
            shortcutsList = $('<ul></ul>'),
            dividers = $el.find(':jqmData(role="list-divider")'),
            lastListItem = null,
            shortcutscroll = this,
            $popup;

        if (dividers.length < 2) {
          return;
        }

        // if no scrollview has been specified, use the parent of the listview
        if (o.scrollview === null) {
            o.scrollview = $el.closest('.ui-scrollview-clip');
        }

        // popup for the hovering character
        $popup = shortcutsContainer.find('.ui-shortcutscroll-popup');
        if (!$popup.size()) {
            // create popup, add it to shortcutsContainer
            shortcutsContainer.append($('<div class="ui-shortcutscroll-popup"></div>'));
            $popup = shortcutsContainer.find('.ui-shortcutscroll-popup');
        }

        // find the bottom of the last item in the listview
        lastListItem = $el.children().last();

        // get all the dividers from the list and turn them into
        // shortcuts
        var jumpToDivider = function(divider) {
                // get the vertical position of the divider (so we can
                // scroll to it)
                var dividerY = $(divider).position().top;

                // find the bottom of the last list item
                var bottomOffset = lastListItem.outerHeight(true) +
                                   lastListItem.position().top;

                var scrollviewHeight = o.scrollview.height();

                // check that after the candidate scroll, the bottom of the
                // last item will still be at the bottom of the scroll view
                // and not some way up the page
                var maxScroll = bottomOffset - scrollviewHeight;
                dividerY = (dividerY > maxScroll ? maxScroll : dividerY);

                // apply the scroll
                o.scrollview.scrollview('scrollTo', 0, -dividerY);

                $popup.text($(divider).text())
                      .position({my: 'center center',
                                 at: 'center center',
                                 of: o.scrollview})
                      .show();
        };

        shortcutsList
        // bind mouse over so it moves the scroller to the divider
        .bind('touchstart mousedown vmousedown touchmove vmousemove vmouseover', function (e) {
            // Get coords relative to the element
            var coords = $.mobile.targetRelativeCoordsFromEvent(e);

            // If the element is a list item, get coordinates relative to the shortcuts list
            if (e.target.tagName.toLowerCase() === "li") {
                coords.x += $(e.target).offset().left - shortcutsList.offset().left;
                coords.y += $(e.target).offset().top  - shortcutsList.offset().top;
            }

            // Hit test each list item
            shortcutsList.find('li').each(function() {
                var listItem = $(this),
                    l = listItem.offset().left - shortcutsList.offset().left,
                    t = listItem.offset().top  - shortcutsList.offset().top,
                    r = l + Math.abs(listItem.outerWidth(true)),
                    b = t + Math.abs(listItem.outerHeight(true));

                if (coords.x >= l && coords.x <= r && coords.y >= t && coords.y <= b) {
                    jumpToDivider($(listItem.data('divider')));
                    return false;
                }
                return true;
            });

            e.preventDefault();
            e.stopPropagation();
        })
        // bind mouseout of the shortcutscroll container to remove popup
        .bind('touchend mouseup vmouseup vmouseout', function () {
            $popup.hide();
        });

        dividers.each(function (index, divider) {
            shortcutsList.append($('<li>' + $(divider).text() + '</li>').data('divider', divider));
        });

        shortcutsContainer.append(shortcutsList);
        o.scrollview.append(shortcutsContainer);
    }
});

$(document).bind( "pagecreate create", function (e) {
    $($.todons.shortcutscroll.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .shortcutscroll();
});

})( jQuery );
