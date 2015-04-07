module.exports = function (grunt) {

  grunt.initConfig({
    assemble: {
      options: {
        layoutdir: 'src/layouts',
        partials: 'src/partials/**/*.hbs',
        permalinks: {
          preset: 'pretty'
        },
        plugins: 'assemble-contrib-permalinks'
      },
      pages: {
        options: {
          layout: 'pages.hbs'
        },
        files: [{
          cwd: 'src',
          dest: 'build',
          expand: true,
          src: ['**/*.hbs', '!layouts/**', '!partials/**']
        }]
      }
    },
    connect: {
      task: {
        options: {
          base: 'build',
          port: 1996
        }
      }
    },
    copy: {
      task: {
        files: [
          {
            dest: 'build',
            expand: true,
            src: [
              'LICENSE',
              'README.md'
            ]
          },
          {
            dest: 'build/style.css',
            src: 'src/style.css'
          }
        ]
      }
    },
    watch: {
      assemble: {
        options: {
          livereload: true,
          spawn: false
        },
        files: ['src/**/*.hbs', 'src/**/*.md'],
        tasks: 'assemble'
      },
      styles: {
        options: {
          livereload: true,
          spawn: false
        },
        files: 'src/*.css',
        tasks: 'copy'
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['assemble', 'copy']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);

};