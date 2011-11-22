web-ui-fw is a set of widgets and other components for jQuery Mobile.
It also includes a (slightly deprecated, as it was built
using the rc1 CSS approach) custom theme.

The project is complementary to jQuery Mobile and the components
should slot into existing projects. In almost all cases, the colours
and styling of the widgets should broadly adhere to the jQuery Mobile
styling approach.

This document is intended for end users. If you are interested in
working on web-ui-fw itself, please see HACKING.md.

Requirements
============

You will need to pull jQuery and jQuery Mobile into your
project.

web-ui-fw is written against 1.0-stable branch of jQuery Mobile. So you
should use the 1.0 version of jQuery Mobile as explained at:

  http://jquerymobile.com/download/

For an example of the HTML elements you'll need, see the "Using web-ui-fw"
section.

Dependencies
============

web-ui-fw-libs.js incorporates the following third party libraries
either in full or in part:

* jLayout (all of it)
* jLayout jQuery plugin (all of it)
* jSizes (all of it)
* Underscore (a copy of the _.keys() method is in our namespace)
* jQuery UI (only the position() method)
* some experimental elements of jQuery Mobile, especially scrollview

There is no need to download these libraries, as they are included
in the project and the built JavaScript.

If you have any of these libraries in your project, you may need to
be careful of unwanted interactions.

See COPYING for their individual licences and further information.

Licence
=======

The project is MIT licensed.

Maintainers
===========

The project is maintained by Intel's Open Source Technology Centre.

Using a web-ui-fw distribution
==============================

This document explains how to use one of the web-ui-fw distribution
files (available under **Downloads**).

A distribution file contains the following:

<pre>
docs/                   basic API documentation
COPYING                 licence file
README                  this file
web-ui-fw-libs.js       3rd party libraries web-ui-fw depends on (see below)
web-ui-fw.js            the web UI widgets, components etc.
web-ui-fw-widget.css    CSS styling for the web UI widgets
</pre>

The JavaScript files will be minified (via uglify-js) if you got the
.min.tar.gz file and are less suitable for debugging.

To use the archive, follow the steps in the next section.

Step by step
------------

1. Download the tarball and unpack it somewhere. This should give you
   a web-ui-fw directory.
2. Copy the files from there to your project (it's up to you where they go).
3. Add stylesheet and script elements to load the web-ui-fw files in the
   correct order, _after_ the lines you added to load jQuery and jQuery Mobile.

For example, if your project had a layout like this:

<pre>
/ (root directory)
  index.html (the entry point to your application)
  js/
    app.js (your application's JavaScript)
  css/
    app.css (your application's CSS)
</pre>

You could add the web-ui-fw directory to your project like this:

<pre>
/
  index.html
  js/
    app.js
  css/
    app.css
  web-ui-fw/
    web-ui-fw-libs.js (3rd party dependencies of web-ui-fw)
    web-ui-fw.js (web UI components)
    web-ui-fw-widget.css (web UI widget styling)
    web-ui-fw-theme.css (optional)
</pre>

Note that the web-ui-fw-theme.css file is optional. If you want to
use it, see the "Using the custom theme" section.

The boilerplate for a basic web-ui-fw project, pulling in all
the required files in the right order, is shown in the next section.

Boilerplate index.html
----------------------

(This assumes the directory layout from the previous section.)

<pre>
<!DOCTYPE html>
<html>

  <head>

    <title>My app</title>

    <!-- jQuery Mobile stylesheet -->
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />

    <!-- web-ui-fw widget styling -->
    <link rel="stylesheet" href="web-ui-fw/web-ui-fw-widget.css" />

    <!-- your application stylesheet -->
    <link rel="stylesheet" href="css/app.css" />

    <!-- jQuery and jQuery Mobile JS -->
    <script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>

    <!-- web-ui-fw JS -->
    <script src="web-ui-fw/web-ui-fw-libs.js"></script>
    <script src="web-ui-fw/web-ui-fw.js"></script>

    <!-- your application JS -->
    <script src="js/app.js"></script>

  </head>

  <body>

    <div data-role="page" id="home">
      <div data-role="header">
        <h1>page header</h1>
      </div>

      <div data-role="content">
        <ul data-role="listview" data-autodividers="alpha">
          <li>Albert</li>
          <li>Aldo</li>
          <li>Betty</li>
          <li>Brian</li>
          <li>Carrie</li>
          <li>Dave</li>
          <li>Ethel</li>
          <li>Grant</li>
          <li>Greta</li>
        </ul>
      </div>
    </div>

  </body>

</html>
</pre>

If you can see list dividers with alphabetical letters in them, you
can be fairly confident that web-ui-fw has loaded correctly.

Using the custom theme
----------------------

Replace the standard jQuery Mobile theme file with the
web-ui-fw-theme.css file. For example:

<pre>
<!-- load the custom theme instead of jquery.mobile-1.0.min.css -->
<link rel="stylesheet" href="web-ui-fw/web-ui-fw-theme.css" />

<!-- load jQuery and jQuery Mobile JavaScript-->
<script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
<script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>

<!-- load the web-ui-fw as above -->
...
</pre>
