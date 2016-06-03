module.exports = function(grunt){
    grunt.option('force', true);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["public/build/**"],
        watch : {
            js : {
                files : ['app/js/**/*.js', 'app_user/js/**/*.js', 'app_admin/js/**/*.js', 'app_third/js/**/*.js'],
                tasks : ['uglify'],
                //options : {
                    //livereload : true
                //}
            },

            css : {
                files : ['app/scss/**/*.scss', 'app_admin/scss/**/*.scss', 'app_third/scss/**/*.scss', 'app_user/scss/**/*.scss'],
                tasks : ['sass']
            }
        },
        nodemon : {
            dev : {
                script: 'bin/www',
                options : {
                    args : ['daily'],
                    cwd: __dirname,
                    watch: ['./'],
                    delay: 1000
                }
            }
        },
        concurrent : {
            tasks : ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        sass: {
            css: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'public/build/css/admin.css' : 'app_admin/scss/admin.scss',
                    'public/build/css/third.css' : 'app_third/scss/third.scss',
                    'public/build/css/user.css' : 'app_user/scss/user.scss'
                }
            }
        },
        uglify: {
            options: {
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
                banner: '',
                sourceMap : true,
                mangle : false
                //sourceMapIncludeSources: true,
            },
            js : {
                files : {
                    'public/build/js/admin.min.js': ['app/js/**/*.js', 'app_admin/js/**/*.js'],
                    'public/build/js/third.min.js': ['app/js/**/*.js', 'app_third/js/**/*.js'],
                    'public/build/js/user.min.js': ['app/js/**/*.js', 'app_user/js/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('default', ['clean', 'sass', 'uglify', 'concurrent']);
    grunt.registerTask('build', ['clean', 'sass', 'uglify']);
};