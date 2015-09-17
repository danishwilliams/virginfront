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