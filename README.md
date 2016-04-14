@author Roger Saner
@email rsaner@deloitte.co.za
@twitter twitter.com/rogersaner

# First run

* Clone the repo
* $ npm install
* $ lineman run

Open http://localhost:8000

# TODO

Document how to get this project up and running

Document a lineman setup and usage

Include:

* website
* how to install
* how to use

# Development

* Livereload

# Deployment

Server must be configured to run in HTML5 mode.
@see https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode

# Importing instructors

$ node app/instructor-import/instructor-export.js

More details in that file.

# Running on IIS

Install the ASP module on IIS by opening Server Manager, click "Manage" then "Add roles and features". Click next until the Server Roles screen. Select the ASP role inside Application Development inside Web Server inside Webserver (IIS) and keep clicking next to install.

Add the following into ```Web.config```

```
<add name="html" path="*.html" verb="*" modules="IsapiModule" scriptProcessor="%windir%\system32\inetsrv\asp.dll" resourceType="Unspecified" requireAccess="None" />
```

All this insane config is just to allow a POST to html i.e. the simple login form. Because IIS doesn't know how to handle something that isanely complex and difficult.

# How styles work

* Foundation
* Customising Foundation with colours etc
* Sass and compass (compass mixins, because I couldn't get lineman to work). Install libsass on your platform (it's much quicker than the ruby implementation). Source: https://github.com/sass/libsass

At some point I had to re-install node-sass (due to the later version - 4.2.2 - of node, I think, so had to

```bash
$ cd node_modules/grunt-sass
$ npm rebuild node-sass
```

# Interacting with an API

There are 2 options: using an actual API (via a local proxy) or using local JSON files.

## Actual API

Enable the apiProxy in ```config/application.js``` which will forward any requests starting with ```varockstar``` to the backend API via a local proxy, which can be started with:

```$ node config/proxy.js```

## Backend API mocking with JSON files

Lineman lets us include static JSON files to mock an API.

Include the following little hack for lineman to recognise changed json files without a restart
https://github.com/linemanjs/lineman/issues/318#issuecomment-137464341

 Edit ```node_modules/lineman/tasks/server.coffee``` and change the following lines from

```
  resetRoutesOnServerConfigChange = (app) ->
    watchr grunt.file.expand('config/server.*'), (err, watcher) ->
```

to

```
  resetRoutesOnServerConfigChange = (app) ->
    watchr grunt.file.expand('config/server.*', 'config/stubs/**/*'), (err, watcher) ->
```

This allows for file changes without restarting lineman, but for some reason livereload doesn't trigger. I'd love to know how to put this change into config/application.js


http://zurb.com/building-blocks/off-canvas-sidebar-component


# Angular Development approach

I've used Angular 1.4 keeping in mind an upgrade to 1.5 when it releases, and Angular 2.0 sometime in 2016. This means using some future-proof conventions which pave the
upgrade path as smoothly as possible, rather than a massive refactor down the line:

* using ngNewRouter rather than ui-router.
* using "Controller As" syntax. @see http://toddmotto.com/digging-into-angulars-controller-as-syntax/
* no $scope, anywhere. @see http://www.matheuslima.com/angularjs-stop-using-scope-variables/ http://www.technofattie.com/2014/03/21/five-guidelines-for-avoiding-scope-soup-in-angular.html

### Some smarter approaches

* Follow John Papa's Angular Style guide. @see https://github.com/johnpapa/angular-styleguide
* no ng-controller. Rather, use custom components which consist of an html template and controller. @see http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html
* Controllers only used to control communication between different parts of the app. No model data should be created or persisted in the Controller. @see http://jonathancreamer.com/the-state-of-angularjs-controllers/ http://toddmotto.com/rethinking-angular-js-controllers/
* Data is instantiated and persisted in Factories; changed in Services. @see http://www.sitepoint.com/tidy-angular-controllers-factories-services/
* Typescript used to generate Javascript.
* Factories and Services use the Revealing Module pattern for easier readability. @see http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
  and http://webcache.googleusercontent.com/search?q=cache:JZ_dF3h505kJ:www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code/+&cd=1&hl=en&ct=clnk&gl=za

### Issues

* ngNewRouter can't instantiate a controller with $scope injected. This will probably be solved in Angular 1.5 but until then, even better reason to not use $scope. @see https://github.com/angular/router/issues/313

So I'm using ui-router instead, and doing my best to not use $scope anywhere (which is mostly true).

This section last updated: 2 December 2015


# Unit testing with lineman

Tests are run with lineman, which uses the testem runner and Jasmine 1.3. To run tests:

```$ lineman spec```

Testing controllers which call promises from Factories looks like this:
http://jasonmore.net/unit-testing-http-service-angular-js/

Jasmine 1.3 docs are at http://jasmine.github.io/1.3/introduction.html


# End-to-end testing with protractor

### Installation

```bash
$ npm install selenium-standalone@latest -g
$ selenium-standalone install
$ selenium-standalone start
$ npm install chromedriver
```

### Usage

```bash
$ ./node_modules/protractor/bin/protractor config/spec-e2e.js
```


# ngNewRouter

### Adding components/login/login.html to the template cache and watching the ngNewRouter component structure

Edit ```node_modules/lineman-angular/config/plugins/ngtemplates.coffee``` and ensure the following is in there:

```
    ngtemplates:
      app:
        options:
          base: "app/templates"
        src: ["app/templates/**/*.html", "app/js/components/**/*.html"]
        dest: "<%= files.ngtemplates.dest %>"

    watch:
      ngtemplates:
        files: ["app/templates/**/*.html", "app/js/components/**/*.html"]
        tasks: ["ngtemplates", "concat_sourcemap:js"]
```

### template-cache.js

The lineman-angular plugin defines which folders to watch for template files so it can put them into the template cache.

The specific file is at ```node_modules/lineman-angular/config/plugins/ngtemplates.coffee```

I've structured my directives slightly differently from the lineman-angular way and similar to components, in that each directive lives in a sub-folder (so it's easy to jump between the javascript and the template file).

### controller-as syntax

ngNewRouter wants all controllers to use controller-as syntax. Google it. A common error when refactoring is:

### Could not instantiate controller

Means that there's an error in the controller construction, probably that you've done this:

```$scope.functionname = function() {```

instead of

```this.functionname = function() {```

ngNewRouter will throw that error any time something is screwing up in a controller, and it might not be obvious where that error is. So comment out lines of code until you find it.


# Changing stub files

When changing json stubs, express doesn't automatically pick it up. Here's how to configure it to.

https://github.com/linemanjs/lineman/issues/318#issuecomment-137464341


# JSHint error: 'PlaylistService' was used before it was defined.

This uses a technique called 'hoisting' where a function is used before it is defined. Fine for newer browsers.

@see http://stackoverflow.com/a/26321623

Change ```latedef``` to ```false``` in node_modules/lineman/config/plugins/jshint.coffee