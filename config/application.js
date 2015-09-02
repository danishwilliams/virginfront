/* Exports a function which returns an object that overrides the default &
 *   plugin grunt configuration object.
 *
 * You can familiarize yourself with Lineman's defaults by checking out:
 *
 *   - https://github.com/linemanjs/lineman/blob/master/config/application.coffee
 *   - https://github.com/linemanjs/lineman/blob/master/config/plugins
 *
 * You can also ask Lineman's about config from the command line:
 *
 *   $ lineman config #=> to print the entire config
 *   $ lineman config concat.js #=> to see the JS config for the concat task.
 */
module.exports = function(lineman) {

  //Override application configuration here. Common examples follow in the comments.
  return {
    // grunt-angular-templates assumes your module is named "app", but
    // you can override it like so:
    //
    // ngtemplates: {
    //   options: {
    //     module: "myModuleName"
    //   }
    // }

    server: {
      pushState: true
      // API Proxying
      //
      // During development, you'll likely want to make XHR (AJAX) requests to an API on the same
      // port as your lineman development server. By enabling the API proxy and setting the port, all
      // requests for paths that don't match a static asset in ./generated will be forwarded to
      // whatever service might be running on the specified port.
      //
      // apiProxy: {
      //   enabled: true,
      //   host: 'localhost',
      //   port: 3000
      // }
    },

    // Sass
    //
    // Lineman supports Sass via grunt-contrib-sass, which requires you first
    // have Ruby installed as well as the `sass` gem. To enable it, comment out the
    // following line:
    //
    enableSass: true,

    /*
    // Alternative way of getting sass working
    // Not using it because I don't think I can get compass to work with it
    loadNpmTasks: lineman.config.application.loadNpmTasks.concat("grunt-sass"),

    prependTasks: {
      common: lineman.config.application.prependTasks.common.concat("sass"),
    },
    */

    // Compass
    // @see https://github.com/linemanjs/lineman/issues/94#issuecomment-28547208
    /*
    prependTasks: {
      common: ["compass:compile"]
    },

    loadNpmTasks: ["grunt-contrib-compass"],
    */


    /*
    // Couldn't get this to work
    removeTasks: {
      common: ["less", "handlebars"]
    },

    loadNpmTasks: lineman.config.application.loadNpmTasks.concat("grunt-contrib-compass"),

    prependTasks: {
      common: lineman.config.application.prependTasks.common.concat("compass:compile"),
    },

    compass: {
      compile: {
        options: {
          basePath: 'app',
          sassDir: 'css',
          imagesDir: 'img',
          fontsDir: 'fonts',
          javascriptsDir: 'js',
          cssDir: '../generated/css',
          generatedImagesPath: 'generated/img',
          importPath: ['app/css'],
          httpPath: '../',
          relativeAssets: false
        }
      }
    },*/

    livereload: true

    // Asset Fingerprints
    //
    // Lineman can fingerprint your static assets by appending a hash to the filename
    // and logging a manifest of logical-to-hashed filenames in dist/assets.json
    // via grunt-asset-fingerprint
    //
    // enableAssetFingerprint: true

  };
};
