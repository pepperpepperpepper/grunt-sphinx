'use strict';
var path = require('path');

module.exports = function(grunt) {
  var target = "something to remove";
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
      if (!process._sphinx_session) {
        grunt.log.error("first time".red);
        process._sphinx_session = true;
      }else{
        grunt.log.error("restart".red);
      }
      var that = this;
      if(server){ console.log("server is true!"); } else {console.log("server is false") };
//      console.log("these are the servers" + JSON.stringify(process._servers));
      console.log("this is target" + JSON.stringify(target))
      if (server) {
        this.stop(options);
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
        server = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, donefunc);
        process._servers[target] =  
        server.stderr.on('data', function(data) {
            if (!options.debug) { 
//              finished();
            } else {
              var message = "" + data;
            }
          });
        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);

      process.on('exit', finished);
//      process.on('exit', function(){ that.stop(options);});
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
      finished();
    }
  };
};

