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

 Edit node_modules/lineman/tasks/server.coffee and change the following lines from

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


Changing stub files
-------------------

When changing json stubs, express doesn't automatically pick it up. Here's how to configure it to.

https://github.com/linemanjs/lineman/issues/318#issuecomment-137464341