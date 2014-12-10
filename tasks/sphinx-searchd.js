'use strict';

var path = require('path');

module.exports = function(grunt) {

//  var servers = {};
var server;

  grunt.registerTask('sphinx-searchd', 'Start a sphinx search server', function() {
//    if (!process._sphinx_session) {
//      grunt.log.error("first time".red);
//      process._sphinx_session = true;
//    }else{
//      grunt.log.error("restart".red);
//    }
    server = require('./lib/server')(grunt);
    var action  = this.args.shift() || 'start';
    //{{{load options
    var options = this.options();
    options.fallback = function() { /* Prevent EADDRINUSE from breaking Grunt */ }
    
    if (!grunt.file.exists(options.conf_file)) {
      grunt.log.error('Could not find sphinx configuration file: ' + options.conf_file);
      return false;
    }
    options.conf_file = path.resolve(options.conf_file);
    options.pid_file = path.resolve(options.pid_file);
    options.args.unshift('--config', options.conf_file);
    
    if (options.foreground){
    //Server is run in current process
    //just add args to run server in current process --console
      options.args.unshift('--console');
    }
    //}}}
    server[action](options); //call start or stop
  });
};
