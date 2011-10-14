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
            addressBook: new $.mobile.todons.AddressBook(),
            multipleSelection: true,
        },

        _data: {
            ui: undefined,
            row: undefined,
            checked: new Array()
        },

        _personArraySuccessCallback: function(persons) {
            var self = this;
            var list = self._data.ui.list;
            var li = self._data.row.li;

            li.remove();
            persons.forEach(function(p) {
                currentListItem = li.clone();
                currentCheckbox = currentListItem.find('.switch');
                currentName = currentListItem.find('.name');
                currentAvatar = currentListItem.find('.avatar');

                currentName.text(p.id());
                currentAvatar.find("img").attr({src: p.avatar(), alt: p.id()});
                list.append(currentListItem);

                currentCheckbox
                    .switch({"checked": false})
                    .data("Person", p)
                    .bind("changed", function(e, checked) {
                        var p = $(this).data("Person");
                        if (checked) {
                            if (!self.options.multipleSelection) {
                                self._data.checked.forEach(function(item) {
                                    item.switch("option", "checked", false);
                                });
                                self._data.checked.length = 0;
                            }
                            if ($.inArray(p, self._data.checked) == -1) {
                                self._data.checked.push($(this));
                            }
                        } else {
                            self._data.checked = $.grep(
                                self._data.checked, function(value) {
                                    return value != $(this);
                                });
                        }
                    });
            });
            list.listview();
        },

        _create: function () {
            var self = this;

            self._data.ui = {
                personpicker: ".ui-personpicker",
                list: ".ui-personpicker > ul",
                cancel: ".ui-personpicker .cancel-btn",
                done: ".ui-personpicker .done-btn"
            };

            self._data.row = {
                li: "li.ui-personpicker-row",
                container: "div.ui-personpicker-row-container",
                checkbox: "div.switch",
                name: "h3.name",
                avatar: "div.avatar"
            };

            // Prepare.
            self._data.ui = $.mobile.todons.loadPrototype("personpicker", self._data.ui); 
            self._data.row = $.mobile.todons.loadPrototype("personpicker-row", self._data.row);

            $.mobile.todons.parseOptions(self, true);
 
            // Load persons.
            if (self.options.addressBook !== undefined) {
                // Replace this with actuall call when implemented.
                self.options.addressBook.findPersons(
                    function(persons) { self._personArraySuccessCallback(persons); },
                    undefined, undefined, undefined, undefined);
            }

            this.element.append(self._data.ui.personpicker);

            self._data.ui.cancel.buttonMarkup({shadow: true, inline: true});
            self._data.ui.done.buttonMarkup({shadow: true, inline: true});
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker')").personpicker();
    });
})(jQuery, this);

