Virgin Group Cycle Instructor App

# Table of contents

- [Installation and configuration](#markdown-header-installation-and-configuration)
    - [First run](#markdown-header-first-run)
    - [Configure lineman](#markdown-header-configure-lineman)
    - [Hoisting](#markdown-header-hoisting)
    - [Angular codebase structuring](#markdown-header-angular-codebase-structuring)
    - [SASS](#markdown-header-sass)
- [Development](#markdown-header-developments)
    - [Environments](#markdown-header-environments)
    - [Repository structuring](#markdown-header-repository-structuring)
    - [API integration](#markdown-header-api-integration)
        - [Proxy](#markdown-header-proxy)
        - [Swagger](#markdown-header-swagger)
            - [Swagger usage](#markdown-header-swagger-usage)
    - [Backend API mocking](#markdown-header-backend-api-mocking)
        - [Changing stub files](#markdown-header-changing-stub-files)
    - [Supplementary scripts](#markdown-header-supplementary-scripts)
        - [Importing instructors](#markdown-header-importing-instructors)
        - [Updating translation files](#markdown-header-updating-translation-files)
- [Multiple languages](#markdown-header-multiple-languages)
- [Testing](#markdown-header-testing)
    - [Unit testing](#markdown-header-unit-testing)
    - [End-to-end testing](#markdown-header-end-to-end-testing)
        - [Installation](#markdown-header-installation)
        - [Usage](#markdown-header-usage)
- [Server config](#markdown-header-server-config)
    - [Running on IIS](#markdown-header-running-on-iis)
- [CSS](#markdown-header-css)
- [Angular Development approach](#markdown-header-angular-development-approach)
    - [Some smarter approaches for the future](#markdown-header-some-smarter-approaches-for-the-future)
    - [Issues](#markdown-header-issues)
- [TODO](#markdown-header-todo)


# Installation and configuration

## First run

Clone the repo, then:

```bash
$ git checkout develop
$ npm install
$ npm install -g pm2
$ pm2 start config/proxy.js
$ lineman run
```

Open http://localhost:8000 in a web browser.

## Configure lineman

Lineman is a light wrapper around grunt and gives us a nice dev environment, like livereload, backend server mocking, tests, etc. It's been customised a bit for this specific project. What follows needs to be manually applied to the lineman codebase.

### Hoisting

(i.e. JSHint error: 'PlaylistService' was used before it was defined.)

A technique called 'hoisting' allows for a function to be used before it is defined. Fine for newer browsers.

Change ```latedef``` to ```nofunc``` in ```node_modules/lineman/config/plugins/jshint.coffee```

See http://stackoverflow.com/a/26321623

### Angular codebase structuring

Directives are structured slightly differently from the lineman-angular way (and similar to components), in that each directive lives in a sub-folder (so it's easy to jump between the javascript and the template file).

Make sure that ```node_modules/lineman-angular/config/plugins/ngtemplates.coffee``` has the following in it:

```
    ngtemplates:
      app:
        options:
          base: "app/templates"
        src: ["app/templates/**/*.html", "app/js/components/**/*.html", "app/js/directives/**/*.html"]
        dest: "<%= files.ngtemplates.dest %>"

    watch:
      ngtemplates:
        files: ["app/templates/**/*.html", "app/js/components/**/*.html", "app/js/directives/**/*.html"]
        tasks: ["ngtemplates", "concat_sourcemap:js"]
```

### SASS

* Sass and compass (compass mixins, because I couldn't get lineman to work). Install libsass on your platform (it's much quicker than the ruby implementation). Source: https://github.com/sass/libsass

At some point I had to re-install node-sass (due to the later version - 4.2.2 - of node, I think, so had to

```bash
$ cd node_modules/grunt-sass
$ npm rebuild node-sass
```


# Development

## Environments

* dev: https://virgin.digitaldisruption.co.za
* staging: https://cyclingappuat.azurewebsites.net
* production: https://ride.virginactive.co.za/

Dev is an AWS box set up by Deloitte. Staging and production were set up by Virgin Active SA on their Infrastructure-as-a-Service. All boxes are Windows Server installs running IIS and SQL server.

## Repository structuring

The repo uses the git branching model - see http://nvie.com/posts/a-successful-git-branching-model/

It's recommended to install ```git-flow``` or use a git gui which has that in it.

The branches are as follows:

* master: deployed to production
* release/1.0: deployed to staging for User Acceptance Tests. Merged into master and develop once approved, and deleted.
* develop: deployed to dev many times a day.
* feature branches: each new feature is branched off dev, and merged back in whenever it's ready to be deployed on dev.

Major/minor version released are documented in ```CHANGELOG.txt```

## API integration

The backend .net API can be interacted with via a local proxy, via Swagger, or mocked by lineman (with local JSON files).

### Proxy

When the ```apiProxy``` setting in ```config/application.js``` is enabled (which it is in this codebase), any requests starting with ```api``` will be forwarded to the backend API via a local proxy, which can be started with:

```bash
$ node config/proxy.js
```

Note that there are urls in the proxy for dev, staging and live environments - so pick which one you want to use (hint: should be a dev url).

The proxy needs to be run by some node uptime tool like ```pm2``` so that when it crashed it's auto-restarted, by doing:

```bash
$ pm2 start config/proxy.js
$ pm2 list
```

### Swagger

Swagger is an open source self-documenting frontend to the backend API. It's accessible at ```/swagger``` on each environment, so for dev it is ```https://virgin.digitaldisruption.co.za/swagger/ui/index```

#### Usage

Swagger requires token-based authentication. A token can be acquired by posting a username/password combo to ```/api/auth``` (hint: use swagger to do that!) or simply log to using the Instructor App website, open up dev tools and copy the value of ```token```) then authenticate all future requests to Swagger by adding ```Token <token>``` into the ```Authorization``` textbox in the particular API request.

## Backend API mocking

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

### Changing stub files

When changing json stubs (for mocking backend responses) , express doesn't automatically pick it up. Here's how to configure it to.

https://github.com/linemanjs/lineman/issues/318#issuecomment-137464341


## Supplementary scripts

### Importing instructors

To get a JSON file out of the google spreadsheet (which can then be manually pasted into swagger):

```bash
$ cd app/support-scripts/
$ node instructor-export.js
```

More details in that file.

### Updating translation files

```bash
$ cd app/support-scripts
$ node app/instructor-import/instructor-export.js
```

# Multiple languages

The website can be translated into multiple languages. This is done by domain (mapped in ```app/js/app/translations.config.js```). The default language is English, and the fallback language (in case of a missing translation) is also English.

Languages can't be manually switched in the interface (although admin users can do this on their own user profile - this gets stored in LocalStorage).

# Testing

## Unit testing

Tests are run with lineman, which uses the testem runner and Jasmine 1.3. To run tests:

```bash
$ lineman spec
```

The specific tests to be run are available in the ```spec``` folder.

Testing controllers which call promises from Factories looks like this:
http://jasonmore.net/unit-testing-http-service-angular-js/

Jasmine 1.3 docs are at http://jasmine.github.io/1.3/introduction.html

## End-to-end testing

...with protractor.

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

The specific tests to be run are available in the ```spec-e2e``` folder.

# Server config

The server must be configured to run in HTML5 mode.
See https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode

## Running on IIS

Install the ASP module on IIS by opening Server Manager, click "Manage" then "Add roles and features". Click next until the Server Roles screen. Select the ASP role inside Application Development inside Web Server inside Webserver (IIS) and keep clicking next to install.

Add the following into ```Web.config```

```
<add name="html" path="*.html" verb="*" modules="IsapiModule" scriptProcessor="%windir%\system32\inetsrv\asp.dll" resourceType="Unspecified" requireAccess="None" />
```

All this insane config is just to allow a POST to html i.e. the simple login form. Because IIS doesn't know how to handle something that isanely complex and difficult.


# CSS

* Foundation 5 takes care of the html framework side (note: no jQuery!).
* The ```app/css``` folder contains all styling. ```main.scss``` includes the necessary css files, and ```_settings.scss``` is the Foundation-specific css configuration.

# Angular Development approach

Current angular version (18 April 2016) is 1.4.8) using some Angular-Foundation components.

* Use "Controller As" syntax. See http://toddmotto.com/digging-into-angulars-controller-as-syntax/
* No $scope, anywhere. Seriously. See http://www.matheuslima.com/angularjs-stop-using-scope-variables/ http://www.technofattie.com/2014/03/21/five-guidelines-for-avoiding-scope-soup-in-angular.html
* No ng-controller. Rather, use custom components which consist of an html template and controller. See http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html
* Controllers only used to control communication between different parts of the app. No model data should be created or persisted in the Controller. See http://jonathancreamer.com/the-state-of-angularjs-controllers/ http://toddmotto.com/rethinking-angular-js-controllers/
* Factories and Services use the Revealing Module pattern for easier readability. See http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
  and http://webcache.googleusercontent.com/search?q=cache:JZ_dF3h505kJ:www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code/+&cd=1&hl=en&ct=clnk&gl=za
* Note: when binding a variable to a directive using '=' (i.e. two-way data binding) take note if the variable is a primitive. If it it, dot notation must be used, otherwise changes within this directive scope won't propogate up to the parent scope. This is because javascript is a pass-by-value language, and so primitives are copied within a nested scope. See http://zcourts.com/2013/05/31/angularjs-if-you-dont-have-a-dot-youre-doing-it-wrong/

### Some smarter approaches for the future

* Follow John Papa's Angular Style guide. See https://github.com/johnpapa/angular-styleguide
* Data is instantiated and persisted in Factories; changed in Services. See http://www.sitepoint.com/tidy-angular-controllers-factories-services/
* Typescript used to generate Javascript.



- Author: Roger Saner
- Email: rsaner@deloitte.co.za
- Twitter: twitter.com/rogersaner