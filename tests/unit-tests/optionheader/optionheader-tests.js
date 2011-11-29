/*
 * optionheader unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  module("Option header");

  asyncTest("Should set options from data-options", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-options');
      },

      function() {
        var $new_page = $('#optionheader-test-options');

        ok($new_page.hasClass('ui-page-active'));

        // test default options set
        var defaultOh = $($new_page.find('#optionheader-test-options-default'));
        equal(defaultOh.optionheader('option', 'showIndicator'), true);
        equal(defaultOh.optionheader('option', 'theme'), 'b');
        equal(defaultOh.optionheader('option', 'startCollapsed'), false);
        equal(defaultOh.optionheader('option', 'expandable'), true);
        equal(defaultOh.optionheader('option', 'duration'), 0.25);

        // test custom options set
        var customOh  = $($new_page.find('#optionheader-test-options-custom'));
        equal(customOh.optionheader('option', 'showIndicator'), false);
        equal(customOh.optionheader('option', 'theme'), 'a');
        equal(customOh.optionheader('option', 'startCollapsed'), true);
        equal(customOh.optionheader('option', 'expandable'), false);
        equal(customOh.optionheader('option', 'duration'), 0.5);

        // test data-theme attribute - should override data-options
        var themedOh = $($new_page.find('#optionheader-test-theme-attr'));
        equal(themedOh.optionheader('option', 'theme'), 'c');

        start();
      }
    ]);
  });

  asyncTest("Should create correct markup", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-markup');
      },

      function() {
        var $new_page = $('#optionheader-test-markup');

        ok($new_page.hasClass('ui-page-active'));

        // test indicator markup
        var withIndicator = $($new_page.find('#optionheader-test-markup-indicator'));
        equal(withIndicator.siblings('.ui-option-header-triangle-arrow').length, 1);
        var withoutIndicator = $($new_page.find('#optionheader-test-markup-no-indicator'));
        equal(withoutIndicator.siblings('.ui-option-header-triangle-arrow').length, 0);

        // test for classes
        ok(withIndicator.hasClass('ui-option-header'), 'should have base class');
        ok(withIndicator.hasClass('ui-option-header-1-row'), 'should default to 1 row');
        ok(withIndicator.hasClass('ui-body-b'), 'should have class for default b theme');

        // test for custom theme class
        var themeSet = $($new_page.find('#optionheader-test-markup-custom-theme'));
        ok(themeSet.hasClass('ui-body-c'), 'should have class for theme c set in options');

        start();
      }
    ]);
  });
})(jQuery);
