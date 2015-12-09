// Generated on 2015-12-04 using generator-web-data-connector 1.0.1

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'js/*.js',
        '!js/scripts.min.js'
      ]
    },
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/tableau/dist/*.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'src/swapi.min.js',
          'src/columnHeaders.js',
          'src/util.js',
          'src/wrapper.js',
          'src/crawl.js',
          'src/**/*.js'
        ],
        dest: 'build/all.js'
      }
    },
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: true
      },
      target: {
        src: 'build/all.js',
        dest: 'build/all.min.js'
      }
    },
    connect: {
      server: {
        options: {
          base: './',
          port: 9001
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: [
          'jshint',
          'concat',
          'uglify'
        ]
      }
    },
    'gh-pages': {
      options: {
        base: '.'
      },
      src: ['**'],
      travisDeploy: {
        options: {
          user: {
            name: 'Travis Deployment',
            email: 'noreply@travis-ci.org'
          },
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/tableau-mkt/swapi-wdc.git',
          message: 'Auto-deploy via Travis CI',
          silent: true
        },
        src: ['**']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', [
    'build',
    'run'
  ]);

  grunt.registerTask('run', [
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

  grunt.registerTask('autoDeploy', [
    'build',
    'gh-pages:travisDeploy'
  ]);
};
