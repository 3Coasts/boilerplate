var webpack = require('webpack'),
  version = new Date().getTime();

module.exports = function (grunt) {
  grunt.initConfig({
    compass: {
      browser: {
        options: {
          sassDir: 'sass',
          cssDir: 'public',
          outputStyle: 'expanded',
          specify: 'sass/browser.sass'
        }
      },
      prod: {
        options: {
          sassDir: 'sass',
          cssDir: 'public',
          outputStyle: 'compressed',
          specify: 'sass/screen.sass'
        }
      }
    },

    exec: {
      moveCSSToProd: 'mv public/screen.css public/build/gs-' + version + '.css',
      moveJSToProd: 'echo "window.version = new Date(' + version + ')" >> ./public/gs.js; mv ./public/gs.js ./public/build/gs-' + version + '.js;',
    },

    webpack: {
      prod: {
        entry: ["./client/app.js"],
        output: { path: "public/", filename: 'app.js' },
        resolve: { modulesDirectories: ['node_modules'] },
        module: { loaders: [{ test: /\.html$/, loader: "html"}] },
        plugins: [new webpack.optimize.UglifyJsPlugin(), new webpack.IgnorePlugin(/\.DS_Store/)],
        stats: { colors: false, modules: true, reasons: true },
        watch: false,
        keepalive: false
      },
      dev: {
        entry: ["./client/app.js"],
        output: { path: "public/", filename: 'app.js' },
        resolve: { modulesDirectories: ['node_modules'] },
        module: { loaders: [{ test: /\.html$/, loader: "html" }] },
        plugins: [
          new webpack.IgnorePlugin(/\.DS_Store/),
          new webpack.SourceMapDevToolPlugin('gs.map.js', null, "[absolute-resource-path]", "[absolute-resource-path]")
        ],
        stats: { colors: false, modules: false, reasons: true },
        watch: true,
        keepalive: true,
        failOnError: false
      }
    },

    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js,coffee',
          watch: ['routes','models','bin'],
          delay: 1000,
          legacyWatch: true
        }
      }
    },

    'node-inspector': {
      dev: {}
    },


    concurrent: {
      dev: {
        tasks: ['webpack:dev','nodemon','node-inspector'],
        options: { logConcurrentOutput: true }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-node-inspector');

  grunt.registerTask('dev', ['concurrent']);
  grunt.registerTask('compile', [
    'compass:prod',
    'compass:browser',
    'exec:moveCSSToProd',
    'webpack:prod',
    'exec:moveJSToProd'
  ]);

};