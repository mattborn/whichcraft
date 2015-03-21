module.exports = function (grunt) {

  grunt.initConfig({
    assemble: {
      build: {
        files: [{
          cwd: 'src',
          dest: 'build',
          expand: true,
          src: ['**/*.hbs']
        }]
      }
    },
    connect: {
      build: {
        options: {
          port: 1996,
          base: 'build'
        }
      }
    },
    watch: {
      assemble: {
        files: ['src/**/*.hbs'],
        tasks: ['assemble'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },
    'gh-pages': {
      options: {
        base: 'build'
      },
      src: '**/*'
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('build', ['assemble']);
  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);
  grunt.registerTask('default', [
    'build',
    'connect',
    'watch'
  ]);

};