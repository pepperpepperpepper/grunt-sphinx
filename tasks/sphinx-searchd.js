'use strict';

var path = require('path');

module.exports = function(grunt) {

var server;

  grunt.registerTask('sphinx-searchd', 'Start a sphinx search server', function() {
    server = require('./lib/server')(grunt);
    //{{{load options
    var options = this.options();
    options.fallback = function() { /* Prevent EADDRINUSE from breaking Grunt */ };
    
    if (!grunt.file.exists(options.conf_file)) {
      grunt.log.error('Could not find sphinx configuration file: ' + options.conf_file);
      return false;
    }
    options.conf_file = path.resolve(options.conf_file);
    options.pid_file = path.resolve(options.pid_file);
    options.args.unshift('--config', options.conf_file);
    
    if (options.foreground){
    //Server is run in current process
      options.args.unshift('--console');
    }
    //}}}

    //choose action
    grunt.event.once('watch',function(){
      process._watch = true;
    });

    var action  = this.args.shift() || 'start';
    var done = this.async();

    if(process._watch && action === 'start'){
       if (typeof(options.watch_delay) !== 'number'){
         grunt.log.error("ERROR: Must specify watch_delay option to use sphinx-searchd with watch".red);
         process.exit(1);
       }
       if (grunt.file.exists(options.pid_file)){
         server['stop'](options, function(){
            server['start'](options, function(){ done(); });
         });
       }else{
         server['start'](options, function(){ done(); });
       }
    }else{
      server[action](options, function(){ done(); }); //call start or stop
    }
  });
};



