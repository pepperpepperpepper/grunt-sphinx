'use strict';

var path = require('path');

module.exports = function(grunt) {

  var servers = {};

  grunt.registerMultiTask('sphinx-searchd', 'Start a sphinx search server', function() {
    if (!servers[this.target]) {
      servers[this.target] = require('./lib/server')(grunt, this.target);
    }
    var server  = servers[this.target];
    var action  = this.args.shift() || 'start';
    //DEFAULT OPTIONS GO HERE
    var options = this.options({
      cmd:           'searchd',
      conf_file:     '/etc/sphinxsearch/sphinx.conf',
      args:          [ ],
      background:    true,
      fallback:      function() { /* Prevent EADDRINUSE from breaking Grunt */ },
//      NOT YET IMPLEMENTED
//      delay:         0,
//      output:        ".+",
      debug:         false
    });

    
    if (!grunt.file.exists(options.conf_file)) {
      grunt.log.error('Could not find sphinx configuration file: ' + options.conf_file);

      return false;
    }
    options.conf_file = path.resolve(options.conf_file);
    options.pid_file = path.resolve(options.pid_file);
    options.args.unshift('--config', options.conf_file);
    
    if (! options.background){
    // Server is run in current process
    //just add args to run server in current process --console
      options.args.unshift('--console');
    }

    server[action](options);
  });
};
