/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

(function($, window, undefined) {
    $.widget("mobile.datetimepicker", $.mobile.widget, {
        options: {
            showDate: true,
            showTime: true,
            header: "",
            timeSeparator: ":",
            months: ["January", "February", "March", "April", "May",
                     "June", "July", "August", "September", "October",
                     "November", "December"],
            animationDuration: 500,
            yearsRange: 30 
        },

        data: {
            now: 0,
            uuid: 0,

            year: 0,
            month: 0,
            day: 0,

            hours: 0,
            minutes: 0
        },

        _initDateTime: function() {
            this.data.year = this.data.now.getFullYear();
            this.data.month = this.data.now.getMonth();
            this.data.day = this.data.now.getDate();

            this.data.hour = this.data.now.getHours();
            this.data.minutes = this.data.now.getMinutes();
        },

        _createHeader: function() {
            var div = $("<div/>", {
                id: "header"
            }).text(this.options.header);
            return div;
        },

        _createDate: function() {
            var div = $("<div/>", {
                class: "date ui-grid-b"
            });

            var w = this;

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            var dataItems = {
                0: ["ui-datetimepicker-year", this.data.year],
                1: ["ui-datetimepicker-month", this.options.months[this.data.month]],
                2: ["ui-datetimepicker-day", this.data.day],
            };

            for (var data in dataItems) {
                var props = dataItems[data];
                var item = $("<span/>", {
                    class: "data " + props[0]
                }).text(props[1]);
                div.append(item);
            }

            return div;
        },

        _createTime: function() {
            var div = $("<div/>", {
                class: "time ui-grid-b"
            });

            var w = this;

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            var dataItems = {
                0: ["ui-datetimepicker-hours", this.data.hours],
                1: ["ui-datetimepicker-separator", this.options.timeSeparator],
                2: ["ui-datetimepicker-minutes", this.data.minutes],
            };

            for (var data in dataItems) {
                var props = dataItems[data];
                var item = $("<span/>", {
                    class: "data " + props[0]
                }).text(props[1]);
                div.append(item);
            }

            return div;
        },

        _createDateTime: function() {
            var div = $("<div/>", {
                id: "main"
            });

            if (this.options.showDate && this.options.showTime) {
                div.addClass("ui-grid-a");
            }

            if (this.options.showDate) {
                div.append(this._createDate());
            }
            if (this.options.showTime) {
                div.append(this._createTime());
            }

            return div;
        },

        _createDataSelector: function() {
            var div = $("<div/>", {
                class: "selector"
            });

            return div;
        },

        _showDataSelector: function(selector, owner) {
            /* TODO: find out if it'd be better to prepopulate this, or
             * do some caching at least. */
            var klass = owner.attr("class");
            if (klass.search("ui-datetimepicker-year")) {
                this._populateYears(selector);
            }
            selector.slideDown(this.options.animationDuration);
        },

        _populateYears: function(selector) {
            var currentYear = this.data.year;
            var startYear = currentYear - Math.floor(this.options.yearsRange / 2);
            var endYear = currentYear + Math.round(this.options.yearsRange / 2);

            var container = $("<div/>", {
                class: "container container-years"
            });
            container.attr("data-scroll", "x");

            view = $("<div/>", {class: "view"});

            container.html(view);

            container.scrollview({direction: "x"});

            var i = 0;
            for (i = startYear; i <= endYear; i++) {
                w = $("<div />", {
                    class: "item"
                }).html($("<a />", {
                    href: "#"
                }).text(i));
                if (i == currentYear) {
                    w.addClass("current");
                }
                view.append(w);
            }

            selector.html(container);
        },

        _create: function() {
            var container = this.element;
            var obj = this;

            /* We must display either time or date: if the user set both to
             * false, we override that.
             */
            if (!this.options.showDate && !this.options.showTime) {
                this.options.showDate = true;
            }

            this._initDateTime();

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            container.attr("id", "ui-datetimepicker-" + this.data.uuid);

            var header = this._createHeader();
            var dateTime = this._createDateTime();
            var selector = this._createDataSelector();

            var innerContainer = $("<div/>", {
                id: "inner-container",
            });
            innerContainer.append(header, dateTime);

            container.append(innerContainer, selector);

            dateTime.find(".data").each(function() {
                $(this).click(function() {
                    obj._showDataSelector(selector, $(this));
                });
            });

        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.datetimepicker.prototype.data.now = now);
    $($.mobile.datetimepicker.prototype.data.uuid = now.getTime());
})(jQuery, this);

