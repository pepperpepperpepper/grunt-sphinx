'use strict';

var path = require('path');

module.exports = function(grunt) {
  grunt.registerTask('sphinx-indexer', 'run the sphinx indexer', function() {

    var finished = function() {
      if (done) {
        done();
        done = null;
      }
    };
    //DEFAULT OPTIONS GO HERE
    var options = this.options({
      cmd:           'indexer',
      conf_file:     '/etc/sphinxsearch/sphinx.conf',
      indeces:       [ '--all' ],
      args:          [ ],
      fallback:      function() { /* Prevent EADDRINUSE from breaking Grunt */ },
      debug:         false
    });

    options.conf_file = path.resolve(options.conf_file);
    options.args.unshift('--config', options.conf_file);

    options.args.push.apply(options.args, options.indeces);

    if (!grunt.file.exists(options.conf_file)) {
      grunt.log.error('Could not find sphinx configuration file: ' + options.conf_file);

      return false;
    }
    grunt.log.writeln('Running Sphinx indexer cmd'.green);

    var done = grunt.task.current.async();

      var donefunc = finished;
      var cmd = grunt.util.spawn({
        cmd:      options.cmd,
        args:     options.args,
        env:      process.env,
        fallback: options.fallback
      }, donefunc);

        cmd.stdout.on('data', function(data) {
          var message = "" + data;
          if (options.debug) {
            grunt.log.error('debug is on'.yellow);
            grunt.log.error(message.yellow);
          }else{
            if(message.match(/ERROR: nothing to do./)){
              grunt.log.writeln("Sphinx indexes have already been created.".grey);
            }
          }
        });
        cmd.stderr.on('data', function(data) {
          var message = "" + data;
          if (options.debug) {
            grunt.log.error('debug is on'.yellow);
            grunt.log.error(message.red);
          }else{
            if (message.match(/Error: not found:/)){
              grunt.log.error("Could not find the indexer cmd, please specify its location in the Gruntfile!".red);
              process.exit(1);
            }
            grunt.log.writeln(data.grey);
          }
        });

    process.on('exit', finished);
  });
};
