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
        },
        connect: {
            options: {
                port: 9002,
                hostname: 'localhost'
            },
            samples: {
                options: {
                    base: './'
                }
            }
        },
        protractor: {
            options: {
                configFile: "node_modules/protractor/referenceConf.js",
                keepAlive: true,
                noColor: false
            },
            e2e_test: {
                options: {
                    configFile: "test/conf.js"
                }
            }
        },
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: "./node_modules/protractor/bin/webdriver-manager start",
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_install: {
                command: "./node_modules/protractor/bin/webdriver-manager update"
            }
        }
    });

    grunt.registerTask('setup', ['bower']);

    grunt.registerTask('build', ['concat:rxprop']);

    grunt.registerTask('default', ['setup', 'build']);

    grunt.registerTask('run', ['build', 'watch:rxprop']);

    grunt.registerTask('prepare_test', ['shell:protractor_install', 'shell:selenium']);
    grunt.registerTask('test', ['build', 'connect:samples', 'protractor:e2e_test']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};