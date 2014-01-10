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
                    'src/core/countnotifier.js',
                    'src/core/outro.js',

                    'src/extension/intro.js',
                    'src/extension/retryextension.js',
                    'src/extension/convertextension.js',
                    'src/extension/outro.js',

                    'src/directive/intro.js',
                    'src/directive/rpcommand.js',
                    'src/directive/rpsubmit.js',
                    'src/directive/rpevent.js'
                ],
                dest: 'reactiveproperty-angular.js'
            }
        },
        watch: {
            rxprop: {
                files: ['src/**/*.js'],
                tasks: ['compile']
            }
        }
    });

    grunt.registerTask('setup', ['bower']);

    grunt.registerTask('compile', ['concat:rxprop']);

    grunt.registerTask('default', ['setup', 'compile']);

    grunt.registerTask('run', ['compile', 'watch:rxprop']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};