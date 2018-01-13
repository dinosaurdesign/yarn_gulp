var
    gulp            = require('gulp'),
    sass            = require('gulp-sass'), // препроцессор sass
    autoprefixer    = require('gulp-autoprefixer'), // вендорные префексы css
    sourcemaps      = require('gulp-sourcemaps'), // создание sourcemap
    concat          = require('gulp-concat'),
    browsersync     = require('browser-sync'),
    watch           = require('gulp-watch'),
    imagemin        = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant        = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    del             = require('del'), // Подключаем библиотеку для удаления файлов и папок
    cache           = require('gulp-cache'); // Подключаем библиотеку кеширования
//переменные путей
var path = {
    src: {
        pug:    'src/pug/pages',
        html:   'src/*.html',
        css:    'src/css/',
        sass:   'src/sass/**/*.*',
        js:     'src/js/**/*.*',
        php:    'src/**/*.php',
        img:    'src/img/**/*.*',
        fonts:  'src/fonts**/*.*'
    },
    dist: {
        folders:'dist',
        php:    'dist/**/*.php',
        html:   'dist/*.html',
        css:    'dist/css/',
        js:     'dist/js/*/*.*',
        img:    'dist/img**/*.*',
        fonts:  'dist/fonts**/*.*'
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

gulp.task('img', function() {
    return gulp.src(path.src.img) // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest(path.dist.img)); // Выгружаем на продакшен
});
gulp.task('clean', function() {
    return del.sync(path.dist.folders); // Удаляем папку dist перед сборкой
});
gulp.task('build', ['clean', 'img', 'sass'], function() {

    var buildCss = gulp.src(path.src.css)
        .pipe(gulp.dest(path.dist.css))

    var buildFonts = gulp.src(path.src.fonts) // Переносим шрифты в продакшен
        .pipe(gulp.dest(path.dist.fonts))

    var buildJs = gulp.src(path.src.js) // Переносим скрипты в продакшен
        .pipe(gulp.dest(path.dist.js))

    var buildHtml = gulp.src(path.src.html) // Переносим HTML в продакшен
        .pipe(gulp.dest(path.dist.html));

    var buildPHP = gulp.src(path.src.php) // Переносим PHP в продакшен
        .pipe(gulp.dest(path.dist.php));
});

gulp.task('default', ['watch']);