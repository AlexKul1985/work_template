const gulp = require('gulp');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const concat = require('gulp-concat');
const del = require('del');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const spritesmith = require("gulp.spritesmith");



const config = {
    src: {
        main:'./src',
        pug:'/pug/pages/*.pug',
        html:'/',
        less: '/less/*.*',
        css:'/css/',
        jsPre:'/js/',
        jsLib:['./src/libs/gradient/lib.gradient.js','./src/js/mysripts/mygradient.js','./src/libs/jquery/jquery.js','./src/libs/slick/slick.js','./src/js/mysripts/main.js','./src/js/mysripts/equalHeight/equal-height.js'],// Установка порядка конкатенации JS файлов
        img:'/image/*.*',
        fonts:'/fonts/**/*.*',
        sprite:'/image/sprite/',
        spriteName:'sprite.png'
    },
    build: {
        main:'./build',
        html:'./build/',
        css:'/css/',
        js:'/js/',
        img:'/image/',
        fonts:'/fonts/'
    },
    watch:{
        pug: ['./src/pug/**/*.pug','./src/pug/sections/*.pug'],
        html:'./src/*.html',
        less:'./src/less/**/*.*',
        js:['./src/js/**/*.js','./src/libs/**/*.js']
    }

};
        
 
 gulp.task('html', function() {
    return gulp.src(config.src.main+config.src.pug)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest(config.src.main + config.src.html));
         
       
});


 gulp.task('css',function(){
    gulp.src(config.src.main+config.src.less)
        .pipe(less())
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        
        .pipe(gcmq())
        .pipe(sourcemaps.init())
     .pipe(autoprefixer({
                browsers: ['> 0.001%','ie 9','ie 8','ie 7'],
                cascade: false
            }))
            // .pipe(cleanCSS({
            //     level: 2
            // }))
             .pipe(sourcemaps.write('.'))

            .pipe(gulp.dest(config.src.main + config.src.css))
            .pipe(browserSync.reload({
                stream: true
            }));

 });

 gulp.task('js',function(){
    gulp.src(config.src.jsLib)
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.src.main + config.src.jsPre))
        .pipe(browserSync.reload({
            stream: true
        }));
 });


 gulp.task('build:fonts', function(){
    gulp.src(config.src.main + config.src.fonts)
        .pipe(gulp.dest(config.build.main + config.build.fonts));
});

gulp.task('build:img', function(){
    gulp.src(config.src.main + config.src.img)
        .pipe(imagemin({
            progressive: true,
            use:[pngquant()]
        }))
        .pipe(gulp.dest(config.build.main + config.build.img));
});


 gulp.task('del', function(){
    let path = config.build.main + '/*';
    
    if(path.substr(0, 1) === '/'){
        console.log("never delete files from root :)");
    }
    else{
        del.sync(path);
    }
});   


gulp.task('cleansprite', function() {
    return del.sync(config.src.main + config.src.sprite + config.src.spriteName);
});



gulp.task('spritemade', function() {
    var spriteData =
        gulp.src(config.src.main + config.src.sprite + '*.*')
        .pipe(spritesmith({
            imgName: config.src.spriteName,
            cssName: 'sprite.less',
            padding: 5,
             cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name;
            }
            
        }));

    spriteData.img.pipe(gulp.dest(config.src.main + config.src.sprite)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(config.src.main+'/less/lib/')); // путь, куда сохраняем стили
});

gulp.task('sprite', ['cleansprite', 'spritemade']);//Сборка спрайта


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.src.main
        }
    });
});


gulp.task('build',['del','js','css','build:img','build:fonts'],function(){
    gulp.src(config.src.main+'/*.html')
    .pipe(gulp.dest(config.build.main));
    gulp.src(config.src.main + config.src.css+'*.*')
    .pipe(gulp.dest(config.build.main + config.build.css));
    gulp.src(config.src.main + config.src.jsPre+'all.min.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.build.main + config.build.js));
    gulp.src(config.src.main + config.src.sprite + config.src.spriteName) 
    .pipe(imagemin({
            progressive: true,
            use:[pngquant()]
        }))
      .pipe(gulp.dest(config.build.main + config.build.img+'sprite/'));
      browserSync.init({
        server: {
            baseDir: config.build.main
        }
    });
});

    
gulp.task('watch', ['browserSync','html','css','js'], function () {
    gulp.watch(config.watch.pug,['html']);
    gulp.watch(config.watch.html, browserSync.reload);
    gulp.watch(config.watch.less,['css']);
    gulp.watch(config.watch.js,['js']);
    
});

    
gulp.task('default',['watch']);
       

        


