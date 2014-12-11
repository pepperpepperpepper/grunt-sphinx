# grunt-sphinx

> Start your sphinx search server from grunt 

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

## Tasks

There are two tasks that you can use in your Gruntfile:
```js
'sphinx-indexer'
```
and
```js
'sphinx-searchd'
```
Each needs configuration from within the Gruntfile. You must specify the path to your sphinx.conf file,
as well as the path to the pid file for sphinxd. It must match the pid file path specified in searchd block
of your sphinx.conf.
Here's my example setup.

### Setup

```js
  grunt.initConfig({
    'sphinx-searchd': {
      //customize options here
      options: { 
        conf_file : 'sphinx.conf',            //REQUIRED
        pid_file : 'sphinx/logs/searchd.pid', //REQUIRED
        cmd : 'sphinx-searchd',               //REQUIRED
        debug : false,
        args : [], //any additional args to pass to the searchd command
        watch_delay : 2000, //only required if used with the grunt watch task
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
```
Once the plugin has been installed and configured, enable it inside your Gruntfile:

```js
grunt.loadNpmTasks('grunt-sphinx');
```

### Options 

The options should be easily inferred from looking at the example Gruntfile config above. 
Any valid command-line arguments can be passed to either the searchd or indexer command by means of the
'args' option in the config block. The arguments must be listed as elements in the array.

I'd be happy to add more options, such as a callback once the searchd command or indexer have completed,
just submit an issue request. 



#### Stopping and starting the searchd server

The searchd server typically runs as a background process, but can be easily stopped and started from within grunt,
as stop and start are registered tasks.
```js
$> grunt sphinx-searchd:stop
$> grunt sphinx-searchd:start

```


#### With [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

```js
grunt.initConfig({
  watch: {
    sphinx: {
      files:  [ 'sphinx.conf' ],
      tasks:  [ 'sphinx-searchd', 'sphinx-indexer' ],
      options: {
        spawn : false, // IMPORTANT. Will not work without this.
      }
    }
  }
});

grunt.registerTask('server', [ 'sphinx-indexer', 'sphinx-searchd', 'watch' ]);
```

