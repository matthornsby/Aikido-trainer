module.exports = function(grunt) {
 
const sass = require('node-sass');


grunt.loadNpmTasks('grunt-contrib-watch'); 
require('load-grunt-tasks')(grunt);
 
grunt.initConfig({
    sass: {
        options: {
            implementation: sass,
            sourceMap: true
        },
        dist: {
            files: {
              'css/style.css': 'scss/style.scss'
            }
        }
    },
    watch: {
      scripts: {
        files: ['scss/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
    }
});
 
grunt.registerTask("build", ["sass", "watch"]);

};