'use strict';
var path = require('path');

module.exports = function(grunt, target) {
  if (!process._servers) {
    process._servers = {};
  }

  var done    = null;
  var server  = process._servers[target]; // Store server between live reloads to close/restart 

  var finished = function() {
    if (done) {
      done();

      done = null;
    }
  };

  return {
    start: function start(options) {
      var that = this;
      if (server) {
        this.stop(options);

        if (grunt.task.current.flags.stop) {
          finished();

          return;
        }
      }

      grunt.log.writeln('Starting '.green + (options.background ? 'background' : 'foreground') + ' Sphinx server');

      done = grunt.task.current.async();

        var donefunc;
//        if (options.delay || options.output){
          donefunc = function(error, result, code) { 
            if(result.stdout) { grunt.log.writeln(result.stdout.grey); }
            if(result.stderr) { grunt.log.writeln(result.stderr.red); }

            if (result.stderr.match(/Error: not found:/)){
              grunt.log.error("Could not find the searchd cmd, please specify its location in Gruntfile!".red);
              process.exit(1);
            }
          };
//        }else{ 
          donefunc = finished;
//        }
//        server = grunt.util.spawn({
        server = process._servers[target] = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, donefunc);

//        if (options.delay) {
//          setTimeout(finished, options.delay);
//        }
//
//        if (options.output) {
//          server.stdout.on('data', function(data) {
//            var message = "" + data;
//            var regex = new RegExp(options.output, "gi");
//            if (message.match(regex)) {
//              finished();
//            }
//          });
//        }
        server.stderr.on('data', function(data) {
            if (!options.debug) { 
//              finished();
            } else {
              var message = "" + data;
              var regex = new RegExp('debugger listening', "gi");
              if (!message.match(regex)) {
//                finished();
              }
            }
          });
        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);

      process.on('exit', finished);
      process.on('exit', function(){ that.stop(options);});
    },

    stop: function stop(options) {
        if ((typeof(options.pid_file) === 'undefined' ) || !(grunt.file.exists(options.pid_file))){
          grunt.log.error(
            'Could not find sphinx pid file or pid_file not specified in options.\n'+
            'Cannot stop sphinx-searchd'.red
          );
          console.log("these are the options"+JSON.stringify(options));
       }else{
         grunt.log.writeln('Stopping'.red + ' Sphinx server');
         options.pid = grunt.file.read(options.pid_file);
         process.kill(options.pid, 'SIGTERM');
         if (server) {
          console.log("yes server is present"); //REMOVE
          process.removeListener('exit', finished);
          process.removeListener('exit', stop);
          server = process._servers[target] = null;
        }
      }

//      finished();
    }
  };
};





