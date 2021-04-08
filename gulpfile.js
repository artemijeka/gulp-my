'use strict';



var CONFIG = {
    'MOVE_FILES': false,
    'CLEAN_DEV': false,
    'HTML_MIN': false,
    'PUG': false,
    'AUTOPREFIXER': ['last 10 version', 'safari 5', 'ie 8', 'ie 9', 'ie 10', 'opera 12.1', 'ios 6', 'android 4'],//['last 10 versions']
};



var DEV_ROOT = './dev.loc/'
var DEV = {
    FILES: [
        DEV_ROOT + '*.*',
        DEV_ROOT + 'fonts/**/*',
        DEV_ROOT + '**/img/**/*.*',
        DEV_ROOT + '**/.htaccess',
        DEV_ROOT + '**/*.html',
        // './src/**/*.php',
        // './src/**/*.settings'
    ],
    // HTML: './dev/**/*.html',
    CSS: {
        ROOT: DEV_ROOT + 'css/',
        LIBS: DEV_ROOT + 'css/libs/',
        HEADER: [DEV_ROOT + 'css/libs/header.min.css', DEV_ROOT + 'css/header.min.css'],
        FOOTER: [DEV_ROOT + 'css/libs/footer.min.css', DEV_ROOT + 'css/footer.min.css'],
    },
    JS: {
        ROOT: DEV_ROOT + 'js/',
        LIBS: DEV_ROOT + 'js/libs/',
        HEADER: [DEV_ROOT + 'js/libs/header.min.js', DEV_ROOT + 'js/header.min.js'],
        FOOTER: [DEV_ROOT + 'js/libs/footer.min.js', DEV_ROOT + 'js/footer.min.js'],
    },
    IMAGES: DEV_ROOT + 'img/',
    // FONTS: ['./dev/fonts/'],
};

var SRC = {
    FILES: [
        './src/*.*',
        './src/**/*.+(eot|svg|ttf|woff|woff2|mp4)',
        './src/**/.htaccess',
        '!./src/**/*.html',
        '!./src/**/*.pug',
        './src/**/*.php',
        // './src/**/*.settings'
    ],
    PUG: [
        './src/**/*.pug',
    ],
    HTML: [
        './src/**/*.html'
    ],
    // FONTS: ['./src/fonts/*'],
    IMAGES: './src/img/**/*.+(ico|svg|png|jpg|gif|webp)',
    SCSS: {
        HEADER: ['./src/scss/header/**/*.scss'],
        LIBS: {
            HEADER: ['./src/scss/libs/header/**/*.scss'],
            FOOTER: ['./src/scss/libs/footer/**/*.scss'],
        },
        FOOTER: ['./src/scss/footer/**/*.scss'],
    },
    JS: {
        HEADER: './src/js/header/*.js',
        FOOTER: './src/js/footer/*.js',
        LIBS: {
            HEADER: './src/js/libs/header/*.js',
            FOOTER: './src/js/libs/footer/*.js',
        },
    },
};

/* PRODACTION TO DIST */
var DIST = {
    ROOT: './dist/',
    CSS: './dist/css/',
    JS: './dist/js/'
};



var gulp = require('gulp'),
    // ftp = require('vinyl-ftp'),
    // gutil = require('gulp-util'),
    browserSync = require('browser-sync'),
    pug = require('gulp-pug'),
    htmlmin = require('gulp-htmlmin'),
    clean = require('gulp-clean'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
    webp = require('imagemin-webp'),
    extReplace = require("gulp-ext-replace"),
    // ggcmq = require('gulp-group-css-media-queries'),
    // gcmq = require('gulp-combine-media-queries'),
    // // cmq = require('gulp-combine-media-queries'),
    // postcss = require('gulp-postcss'),
    // sourcemaps = require('gulp-sourcemaps'),
    // responsive = require('gulp-responsive'),//https://www.npmjs.com/package/gulp-responsive
    uglify = require('gulp-uglify-es').default;
// $ = require('gulp-load-plugins')();



gulp.task('clean_dev', function () {
    //сначала очистка
    return gulp.src(DEV_ROOT, { read: true, allowEmpty: true })
        .pipe(clean());
});



gulp.task('move_files', function () {
    return gulp.src(SRC.FILES)
        .pipe(gulp.dest(DEV_ROOT));
});



gulp.task('pug', function () {
    return gulp.src(SRC.PUG)
        .pipe(pug({ pretty: '\t' }))
        .pipe(gulp.dest(DEV_ROOT))
        .pipe(browserSync.stream());
});



// Gulp task to minify HTML files
gulp.task('minhtml', function () {
    return gulp.src(SRC.HTML)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(DEV_ROOT))
        .pipe(browserSync.stream());
});



// Gulp task to trans HTML files
gulp.task('html', function () {
    return gulp.src(SRC.HTML)
        .pipe(gulp.dest(DEV_ROOT))
        .pipe(browserSync.stream());
});



gulp.task('scss_header', function () {
    //сначала очистка
    gulp.src(DEV.CSS.ROOT + 'header.min.css', { read: true, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.SCSS.HEADER)
        .pipe(scss())
        .pipe(cleanCss({ 
            compatibility: 'ie8',
            level: { 1: { specialComments: 0 } },/* format: 'beautify' */ 
        })) // Минификация css
        .pipe(concat('header.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(autoprefixer({
            overrideBrowserslist: CONFIG.AUTOPREFIXER,
            cascade: false,
            grid: true,
            // grid: 'autoplace',
            remove: false
        }))
        .pipe(gulp.dest(DEV.CSS.ROOT))
        .pipe(browserSync.stream());
});



gulp.task('scss_footer', function () {
    //сначала очистка
    gulp.src(DEV.CSS.ROOT + 'footer.min.css', { read: true, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.SCSS.FOOTER, { allowEmpty: true })
        .pipe(scss())
        .pipe(cleanCss({ 
            compatibility: 'ie8',
            level: { 1: { specialComments: 0 } },/* format: 'beautify' */ 
        })) // Минификация css 
        .pipe(concat('footer.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],//CONFIG.AUTOPREFIXER
            cascade: false,
            grid: true,
            // grid: 'autoplace',
            remove: false
        }))
        .pipe(gulp.dest(DEV.CSS.ROOT))
        .pipe(browserSync.stream());
});



gulp.task('scss_libs_header', function () {
    //сначала очистка
    gulp.src(DEV.CSS.LIBS + 'header.min.css', { read: true, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.SCSS.LIBS.HEADER)
        .pipe(scss())
        .pipe(concat('header.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DEV.CSS.LIBS))
        .pipe(browserSync.stream());
});



gulp.task('scss_libs_footer', function () {
    //сначала очистка
    gulp.src(DEV.CSS.LIBS + 'footer.min.css', { read: true, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.SCSS.LIBS.FOOTER, { allowEmpty: true })
        .pipe(scss())
        .pipe(concat('footer.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DEV.CSS.LIBS))
        .pipe(browserSync.stream());
});



gulp.task('js_libs_header', function () {
    //сначала очистка
    gulp.src(DEV.JS.LIBS + 'header.min.js', { read: false, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.JS.LIBS.HEADER, { allowEmpty: true })
        .pipe(concat('header.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(DEV.JS.LIBS));
});



gulp.task('js_libs_footer', function () {
    //сначала очистка
    gulp.src(DEV.JS.LIBS + 'footer.min.js', { read: false, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.JS.LIBS.FOOTER, { allowEmpty: true })
        .pipe(concat('footer.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({}))
        .pipe(gulp.dest(DEV.JS.LIBS));
});



gulp.task('js_header', function () {
    //сначала очистка
    gulp.src(DEV.JS.ROOT + 'header.js', { read: false, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.JS.HEADER)
        .pipe(concat('header.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest(DEV.JS.ROOT));
});



gulp.task('js_footer', function () {
    //сначала очистка
    gulp.src(DEV.JS.ROOT + 'footer.min.js', { read: false, allowEmpty: true })
        .pipe(clean());

    return gulp.src(SRC.JS.FOOTER)
        .pipe(concat('footer.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest(DEV.JS.ROOT));
});



//очистка старых изображений
// gulp.task('clean_img', function () {
//     return gulp.src(DEV.IMAGES, { read: false, allowEmpty: true })
//         .pipe(clean());
// });



gulp.task('imagemin', function () {
    return gulp.src(SRC.IMAGES)
        .pipe(imagemin([
            pngquant({ quality: [0.89, 0.91] }),
            mozjpeg({ quality: 90 })
        ]))
        .pipe(gulp.dest(DEV.IMAGES))
});



// export to webp
gulp.task("ewebp", function () {
    return gulp.src(SRC.IMAGES)
        .pipe(
            imagemin([
                webp({
                    quality: 90
                })
            ]))
        .pipe(extReplace(".webp"))
        .pipe(gulp.dest(DEV.IMAGES));
});



// Static Server + watching scss/html files
gulp.task('run_dev_server', function (done) {
    browserSync.init({ // browser sync
        server: DEV_ROOT
    });
    gulp.watch(SRC.HTML, gulp.series((CONFIG.HTML_MIN)?'minhtml':'html'));
    // gulp.watch(SRC.PUG, gulp.series('pug'));
    gulp.watch(SRC.SCSS.HEADER, gulp.series('scss_header'));
    gulp.watch(SRC.SCSS.FOOTER, gulp.series('scss_footer'));
    gulp.watch(SRC.SCSS.LIBS.HEADER, gulp.series('scss_libs_header'));
    gulp.watch(SRC.SCSS.LIBS.FOOTER, gulp.series('scss_libs_footer'));
    gulp.watch(SRC.JS.LIBS.HEADER, gulp.series('js_libs_header'));
    gulp.watch(SRC.JS.LIBS.FOOTER, gulp.series('js_libs_footer'));
    gulp.watch(SRC.JS.HEADER, gulp.series('js_header'));
    gulp.watch(SRC.JS.FOOTER, gulp.series('js_footer'));
    if (CONFIG.MOVE_FILES) { gulp.watch(SRC.FILES, gulp.series('move_files')); }
    done();
});



gulp.task('plug', function () {
    return gulp.src('.', {allowEmpty: true});
});



gulp.task( 'default', gulp.series( ((CONFIG.CLEAN_DEV)?'clean_dev':'plug'), ((CONFIG.PUG)?'pug':'plug'), ((CONFIG.HTML_MIN)?'minhtml':'html'), ((CONFIG.MOVE_FILES)?'move_files':'plug'), 'scss_libs_header', 'scss_libs_footer', 'scss_header', 'scss_footer', 'js_libs_header', 'js_libs_footer', 'js_header', 'js_footer', 'imagemin', 'ewebp', 'run_dev_server' ) );



/*************************************************************************************************/
/********************************************* DIST: *********************************************/
/*************************************************************************************************/
gulp.task('clean_dist', function () {
    //сначала очистка
    return gulp.src(DIST.ROOT, { read: true, allowEmpty: true })
        .pipe(clean());
});



// Gulp task to minify HTML files
gulp.task('move_files_dist', function () {
    return gulp.src(DEV.FILES)
        .pipe(gulp.dest(DIST.ROOT));
});



gulp.task('css_header_concat', function () {
    return gulp.src(DEV.CSS.HEADER, { allowEmpty: true })
        .pipe(concat('header.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST.CSS))
        .pipe(browserSync.stream());
});



gulp.task('css_footer_concat', function () {
    return gulp.src(DEV.CSS.FOOTER, { allowEmpty: true })
        .pipe(concat('footer.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST.CSS))
        .pipe(browserSync.stream());
});



gulp.task('js_header_concat', function () {
    return gulp.src(DEV.JS.HEADER, { allowEmpty: true })
        .pipe(concat('header.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest(DIST.JS));
});



gulp.task('js_footer_concat', function () {
    return gulp.src(DEV.JS.FOOTER, { allowEmpty: true })
        .pipe(concat('footer.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest(DIST.JS));
});



gulp.task('dist', gulp.series('clean_dist', 'move_files_dist', 'css_header_concat', 'css_footer_concat', 'js_header_concat', 'js_footer_concat'));