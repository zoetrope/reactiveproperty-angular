module.exports = function (grunt) {

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: 'sample/lib',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        concat: {
            rxprop: {
                src: [
                    'src/core/intro.js',
                    'src/core/reactiveproperty.js',
                    'src/core/reactivecollection.js',
                    'src/core/reactivecommand.js',
                    'src/core/outro.js',

                    'src/extension/torxprop.js',

                    'src/directive/intro.js',
                    'src/directive/rxcommand.js',
                    'src/directive/rxmodel.js'
                ],
                dest: 'rxprop.ng.js'
            }
        },
        watch: {
            views: {
                files: ['app/**/*.html'],
                tasks: ['copy:views']
            },
            ts: {
                files: ['app/**/*.ts'],
                tasks: ['ts-compile']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['compile']
            }
        }
    });

    grunt.registerTask('setup',['clean', 'bower', 'exec:tsd']);

    grunt.registerTask('ts-compile',['copy:ts', 'typescript']);
    grunt.registerTask('compile',['concat:rxprop']);

    grunt.registerTask('build',['clean:dist', 'bower', 'copy:views', 'ts-compile', 'js-compile']);

    grunt.registerTask('serve',['build','connect:dist:keepalive']);

    grunt.registerTask('run',['build','connect:dist','watch']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};