'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },
    // Before generating any new files, remove any previously-created files.
//    clean: {
//      tests: ['tmp'],
//    },
//{{{ watch task...don't worry about it
    watch: {
      sphinx: {
        options: {
          livereload: true,
//          spawn: false
        },
        files: [
          'sphinx.conf'
        ],
        tasks: ['sphinx-searchd', 'sphinx-indexer']
      }
    },
//}}}
//{{{
    // Unit tests.
//    nodeunit: {
//      defaults: {
//        src: 'test/defaults_test.js'
//      },
//      custom_cmd: {
//        src: 'test/custom_cmd_test.js'
//      },
//      custom_args: {
//        src: 'test/custom_args_test.js'
//      },
//      custom_port: {
//        src: 'test/custom_port_test.js'
//      },
//      custom_node_env: {
//        src: 'test/custom_node_env_test.js'
//      },
//      custom_delay: {
//        src: 'test/custom_delay_test.js'
//      },
//      custom_output: {
//        src: 'test/custom_output_test.js'
//      },
//      stoppable: {
//        src: 'test/stoppable_test.js'
//      }
//    },
//}}}
    'sphinx-searchd': {
      //customize options here
      defaults : {
        options: { 
          conf_file : 'sphinx.conf',            //REQUIRED
          pid_file : 'sphinx/logs/searchd.pid', //REQUIRED
          cmd : 'sphinx-searchd',               //REQUIRED
          debug : false,
          args : [], //any additional args to pass to the searchd command
        },
      }
    },
    'sphinx-indexer': {
      defaults: {
        //customize options here
        options: { 
          conf_file : 'sphinx.conf',         // REQUIRED
          cmd : 'sphinx-indexer',            // REQUIRED
          indeces: [ '--all' ],              // REQUIRED
          debug : false,
          args : [], //any additional args to pass to the indexer command
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
//  grunt.loadNpmTasks('grunt-contrib-clean');
//  grunt.loadNpmTasks('grunt-contrib-nodeunit');

//{{{ more test stuff
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
//  grunt.registerTask('test', [
//    'clean',
//    'sphinx:defaults',         'nodeunit:defaults',        'sphinx:defaults:stop',
//    'sphinx:custom_args',      'nodeunit:custom_args',     'sphinx:custom_args:stop',
//    'sphinx:custom_port',      'nodeunit:custom_port',     'sphinx:custom_port:stop',
//    'sphinx:custom_delay',     'nodeunit:custom_delay',    'sphinx:custom_delay:stop',
//    'sphinx:custom_output',    'nodeunit:custom_output',   'sphinx:custom_output:stop',
//    'sphinx:stoppable',        'sphinx:stoppable:stop',   'nodeunit:stoppable',
//
//    // Multiple servers
//    'sphinx:custom_port',      'sphinx:defaults',
//    'nodeunit:defaults',        'nodeunit:custom_port',
//    'sphinx:custom_port:stop', 'sphinx:defaults:stop',
//  ]);
//}}}
  // By default, lint and run all tests.
//  grunt.registerTask('default', ['jshint', 'sphinx-indexer']);
//  grunt.registerTask('default', ['jshint', 'sphinx-searchd', 'sphinx-indexer']);
  grunt.registerTask('default', ['sphinx-searchd','watch']);
//  grunt.registerTask('default', ['jshint', 'test']);

};
