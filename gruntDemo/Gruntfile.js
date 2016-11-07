module.exports = function (grunt) {
    // 任务配置, 所有插件的配置信息
    grunt.initConfig({
        // 获取package.json的信息
        pkg: grunt.file.readJSON('package.json'),

        // uglify插件的配置信息
        uglify: {
            options: {
                // 文件头的注释
                stripBanners: true,
                banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/test.js',
                dest: 'build/<%=pkg.name%>-<%=pkg.version%>.min.js'
            }
        },
        // jshint插件的配置信息
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            build: ['Gruntfile.js', 'src/*.js']
        },
        watch: {
            build: {
                files: ['src/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {spawn: false}
            }
        }
    });

    // grunt加载插件
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt命令执行内容
    grunt.registerTask('default', ['jshint', 'uglify']);
    // 命令名字不能和任务相同
    grunt.registerTask('Mwatch', ['watch']);
};