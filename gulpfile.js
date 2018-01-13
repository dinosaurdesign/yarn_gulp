var
    gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    browsersync     = require('browser-sync'),
    watch           = require('gulp-watch'),
    imagemin        = require('gulp-imagemin');
//переменные путей
var path = {
    src: {
        pug:    'src/pug/pages',
        html:   'src/*.html',
        css:    'src/css/',
        sass:   'src/sass/**/*.*',
        js:     'src/js/**/*.*',
        php:    'src/**/*.php',
        img:    'src/img**/*.*'
    },
    dist: {
        pug:    'src/pug/*.*',
        css:    'src/css/',
        sass:   'src/sass/*/*.*',
        js:     'src/js/*/*.*',
        img:    'src/img**/*.*'
    }
};
// tasks
gulp.task('sass', function () {// компиляция sass
    return gulp.src(path.src.sass) // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // Создаем префиксы
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.src.css)) // Выгружаем результата в папку
        .pipe(browsersync.reload({stream: true})) // Обновляем CSS на странице при изменении
});
gulp.task('browsersync', function () {
    browsersync({
        proxy: "kubak.loc/src",
        notify: false
    });
});
gulp.task('watch', ['browsersync', 'sass'], function () {
    gulp.watch(path.src.sass, ['sass']); // Наблюдение за sass файлами в папке sass
    //gulp.watch(path.src.html, browsersync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(path.src.php, browsersync.reload); // Наблюдение за HTML файлами в корне проекта
});
gulp.task('imagemin', function() {
    return gulp.src(path.src.img)
        .pipe(cache(imagemin())) // Cache Images
        .pipe(gulp.dest('dist/img'));
});