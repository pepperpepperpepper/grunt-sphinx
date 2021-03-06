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
//    clean: {
//      tests: ['tmp'],
//    },
    watch: {
      sphinx: {
        options: {
          spawn : false,
        },
        files: [
          'sphinx.conf'
        ],
        tasks: ['sphinx-searchd', 'sphinx-indexer']
      }
    },
    // Unit tests.
//    not yet implemented
//    nodeunit: {
//      stop: {
//        src: 'test/stop.js'
//      },
//      start: {
//        src: 'test/start.js'
//      },
//      watch: {
//        src: 'test/watch.js'
//      },
//    },
    'sphinx-searchd': {
      //customize options here
      options: { 
        conf_file : 'sphinx.conf',            //REQUIRED
        pid_file : 'sphinx/logs/searchd.pid', //REQUIRED
        cmd : 'sphinx-searchd',               //REQUIRED
        debug : false,
        args : [], //any additional args to pass to the searchd command
        watch_delay : 200, //only required if used with the grunt watch task
      },
    },
    'sphinx-indexer': {
      //customize options here
      options: { 
        conf_file : 'sphinx.conf',         // REQUIRED
        cmd : 'sphinx-indexer',            // REQUIRED
        indeces: [ '--all' ],              // REQUIRED
        debug : false,
        args : [], //any additional args to pass to the indexer command
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
//    'nodeunit:stoppable',
//    'nodeunit:defaults', 
//  ]);
//}}}
  // By default, lint and run all tests.
  grunt.registerTask('default', [ 'jshint', 'sphinx-searchd','watch']);
//  grunt.registerTask('default', ['jshint', 'test']);

};
