'use strict';
var path = require('path');

module.exports = function(grunt) {
  var server;


  return {
    start: function start(options, callback) {
      grunt.log.writeln('Starting '.green + (options.foreground ? 'foreground' : 'background') + ' Sphinx server');

        server = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, callback);
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
        process.on('exit', callback);
        var that = this;
        process.on('SIGINT', function(){
          that.stop(options, function(){
            process.exit(); 
          });
        });
    },

    stop: function stop(options, callback) {
        server = false;
        process.removeListener('exit', callback);
 
        if ((typeof(options.pid_file) === 'undefined' ) || !(grunt.file.exists(options.pid_file))){
          grunt.log.error(
            'Could not find sphinx pid file or pid_file not specified in options.\n'+
            'Cannot stop sphinx-searchd. Process may have already been stopped.'.red
          );
          return callback();
       }
      grunt.log.writeln('Stopping'.red + ' Sphinx server');
      var pid = grunt.file.read(options.pid_file);
      process.kill(pid, 'SIGTERM');
      var retries = 3;
      (function recursiveSync(){
        if (!grunt.file.exists(options.pid_file)){
          return callback();
        }
        if (! retries){
          grunt.log.error('Unable to kill process '+pid+' between starts. Trying increasing delay length?'.red);
          return callback();
        }
        retries--;
        if (options.debug){ grunt.log.error('Checking if searchd was killed successfully'.yellow); }
        setTimeout(recursiveSync, options.watch_delay);
      })();
    }
  };
};

