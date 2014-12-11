'use strict';
var path = require('path');

module.exports = function(grunt) {
  var done    = null;
  var server; 

  var donefunc = function() {
    if (done) {
      done();
      done = null;
    }
  };

  return {
    start: function start(options) {
      grunt.log.writeln('Starting '.green + (options.foreground ? 'foreground' : 'background') + ' Sphinx server');
      done = grunt.task.current.async();

        server = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, donefunc);
//{{{ output
        server.stdout.on('data', function(data) {
          var message = data.toString();
          if (options.debug) {
            grunt.log.error(message.yellow);
          }else{
            if(message.match(/ERROR: nothing to do./)){
              grunt.log.writeln("Sphinx indexes have already been created.".grey);
            }else if( message.match(/FATAL: failed to lock pid file/)){
              grunt.log.error('Sphinx failed to lock pid file. Process may be running already.'.grey);
            }
          }
        });
        server.stderr.on('data', function(data) {
          var message = data.toString();
          if (options.debug) {
            grunt.log.error(message.red);
          }else{
            if (message.match(/Error: not found:/)){
              grunt.log.error("Could not find the searchd cmd, please specify its location in Gruntfile!".red);
              process.exit(1);
            }
          }
        });
//}}}
        process.on('exit', donefunc);
        var that = this;
        process.on('SIGINT', function(){ 
          that.stop(options); 
          process.exit();
        });
    },

    stop: function stop(options) {
        if (process._watch){
          done = grunt.task.current.async();
        }
        if ((typeof(options.pid_file) === 'undefined' ) || !(grunt.file.exists(options.pid_file))){
          grunt.log.error(
            'Could not find sphinx pid file or pid_file not specified in options.\n'+
            'Cannot stop sphinx-searchd. Process may have already been stopped.'.red
          );
       }else{
         grunt.log.writeln('Stopping'.red + ' Sphinx server');
         var pid = grunt.file.read(options.pid_file);
         process.kill(pid, 'SIGTERM');
      }
      process.removeListener('exit', donefunc);
      server = false;
    }
  };
};

