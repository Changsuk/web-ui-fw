/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

/**
 * TODO: documentation.
 */

(function ($, window, undefined) {
    $.widget("todons.personpicker", $.mobile.widget, {
        options: {
            addressBook: new $.mobile.todons.AddressBook()
        },

        _data: {
            ui: undefined
        },

        _personArraySuccessCallback: function(personArray) {
            var list = self._data.ui.list;
            personArray.foreach(function(p) {
                list.append("<li>" + p.id() + "</li>");
            });
        },

        _create: function () {
            var self = this,
                ui = self._data.ui;

            ui = {
                personpicker: ".ui-personpicker",
                list: ".ui-personpicker > ul"
            };

            // Prepare.
            ui = $.mobile.todons.loadPrototype("personpicker", ui); 
            ui.personpicker.scrollview({direction: "y"});
 
            // Load persons.
            if (self.options.addressBook !== undefined) {
                // Replace this with actuall call when implemented.
                self.options.addressBook.findPersons(
                    self._personArraySuccessCallback,
                    undefined, undefined, undefined, undefined);
            }

            this.element.append(ui.personpicker);
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker')").personpicker();
    });
})(jQuery, this);

