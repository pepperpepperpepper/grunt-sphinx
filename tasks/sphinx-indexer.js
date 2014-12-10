'use strict';

var path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('sphinx-indexer', 'run the sphinx indexer', function() {

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
    
    if (!grunt.file.exists(options.conf_file)) {
      grunt.log.error('Could not find sphinx configuration file: ' + options.conf_file);

      return false;
    }
    grunt.log.writeln('Running '.green + (options.background ? 'background' : 'foreground') + ' Sphinx indexer cmd');

    var done = grunt.task.current.async();

      var donefunc = function(error, result, code){
        if (result){
          if (result.code === 1){
            if (result.stderr.match(/Error: not found:/)){
              grunt.log.error("Could not find the indexer cmd, please specify its location in the Gruntfile!".red);
              process.exit(1);
            }else if(result.stdout.match(/ERROR: nothing to do./)){
              grunt.log.writeln("Sphinx indexes have already been created.".grey);
            }
          }

        }
      };
      var cmd = grunt.util.spawn({
        cmd:      options.cmd,
        args:     options.args,
        env:      process.env,
        fallback: options.fallback
      }, donefunc);

      if (options.debug) {
        cmd.stdout.on('data', function(data) {
          grunt.log.error('debug is on');
          var message = "" + data;
          grunt.log.error(message.yellow);
          cmd.stdout.pipe(process.stdout);
          cmd.stderr.pipe(process.stderr);
        });
      }

    process.on('exit', donefunc);
  });
};
