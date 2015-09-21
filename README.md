@author Roger Saner
@email rsaner@deloitte.co.za
@twitter twitter.com/rogersaner

TODO
----

Document how to get this project up and running

Document a lineman setup and usage

Include:

* website
* how to install
* how to use

Development
-----------

* Livereload


How styles work
----------------

* Foundation
* Customising Foundation with colours etc
* Sass and compass (compass mixings, because I couldn't get lineman to work)


Backend API mocking
-------------------

Including the little hack for lineman to recognise changed json files without a restart
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

Angular Development approach
----------------------------

I've used Angular 1.4 keeping in mind an upgrade to 1.5 when it releases, and Angular 2.0 sometime in 2016. This means using some future-proof conventions which pave the
upgrade path as smoothly as possible, rather than a massive refactor down the line:

* using ngNewRouter rather than ui-router.
* using "Controller As" syntax. @see http://toddmotto.com/digging-into-angulars-controller-as-syntax/
* no $scope, anywhere. @see http://www.matheuslima.com/angularjs-stop-using-scope-variables/ http://www.technofattie.com/2014/03/21/five-guidelines-for-avoiding-scope-soup-in-angular.html

Some smarter approaches:

* Follow John Papa's Angular Style guide. @see https://github.com/johnpapa/angular-styleguide
* no ng-controller. Rather, use custom components which consist of an html template and controller. @see http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html
* Controllers only used to control communication between different parts of the app. No model data should be created or persisted in the Controller. @see http://jonathancreamer.com/the-state-of-angularjs-controllers/ http://toddmotto.com/rethinking-angular-js-controllers/
* Data is instantiated and persisted in Factories; changed in Services. @see http://www.sitepoint.com/tidy-angular-controllers-factories-services/
* Typescript used to generate Javascript.

Issues:
* ngNewRouter can't instantiate a controller with $scope injected. This will probably be solved in Angular 1.5 but until then, even better reason to not use $scope. @see https://github.com/angular/router/issues/313

This section last updated: 21 September 2015

ngNewRouter
-----------

#### Adding components/login/login.html to the template cache and watching the ngNewRouter component structure

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

#### controller-as syntax

ngNewRouter wants all controllers to use controller-as syntax. Google it. A common error when refactoring is:

#### Could not instantiate controller

Means that there's an error in the controller construction, probably that you've done this:

```$scope.functionname = function() {```

instead of

```this.functionname = function() {```


Changing stub files
-------------------

When changing json stubs, express doesn't automatically pick it up. Here's how to configure it to.

https://github.com/linemanjs/lineman/issues/318#issuecomment-137464341

JSHint error: 'PlaylistService' was used before it was defined.
---------------------------------------------------------------

This uses a technique called 'hoisting' where a function is used before it is defined. Fine for newer browsers.

@see http://stackoverflow.com/a/26321623

Change ```latedef``` to ```false``` in node_modules/lineman/config/plugins/jshint.coffee