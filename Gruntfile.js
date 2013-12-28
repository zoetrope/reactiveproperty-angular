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