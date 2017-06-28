import gulp from 'gulp'
import browserSync from 'browser-sync'
import gulpLoadPlugins from 'gulp-load-plugins'


let plugin = gulpLoadPlugins(),
    sync = browserSync.create();

console.log('availiable plugins', Object.keys(plugin).join(', '));

function onerror(e) {
  console.log('>>> error:\n', e.name);
  console.log('---> message <---\n', e.message);
  console.log('---> reason <---\n', e.reason);
  this.emit('end');
}


gulp.task('browser-sync', () => {
    sync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp
    .task('pug', () => {
    let mask = 'src/templates/**/**/**/**.pug';
    function run() {
        return gulp
            .src(mask)
            .pipe(plugin.pug())
            .on('error', onerror)
            .pipe(gulp.dest('dist/'))
            .pipe(sync.reload({ stream: true }));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('stylus', () => {
    let mask = 'src/templates/**/**/**/**.styl';
    function run() {
        return gulp
            .src(mask)
            .pipe(plugin.stylus())
            .on('error', onerror)
            .pipe(gulp.dest('src/css/stylus'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('sass', () => {
    let mask = 'src/sass/**.scss';
    function run() {
        return gulp
            .src(mask)
            .pipe(plugin.sass())
            .on('error', onerror)
            .pipe(gulp.dest('src/css/sass'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('css.stylus.concat', () => {
    let mask = 'src/css/stylus/**/**/**/**.css';
    function run() {
        return gulp
            .src(mask)
            .pipe(plugin.concat('styles.css'))
            .on('error', onerror)
            .pipe(gulp.dest('src/css/compiled'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('css.concat', () => {
    let mask = [
      'src/css/sass/bootstrap.css',
      'src/css/compiled/sprite.css',
      'src/css/compiled/styles.css'
    ];
        
    function run() {
        return gulp
            .src(mask)
            .pipe(plugin.concat('all.css'))
            .on('error', onerror)
            .pipe(gulp.dest('src/css/compiled'));
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('css.min', () => {
    let mask = 'src/css/concat/all.css';
    function run() {
        return gulp
            .src(mask)
            .on('error', onerror)
            .pipe(plugin.rename({suffix: '.min'}))
            .pipe(gulp.dest('dist/css'))
            .pipe(sync.reload({ stream: true }))
    }
    plugin.watch(mask, run);
    return run();
    });

gulp
    .task('css', [ 
    'stylus',
    'sass',
    'css.stylus.concat',
    'css.concat',
    'css.min'
    ]);
    
gulp
  .task('sprites', () => {
    let mask = 'src/sprites/*.*';
    function run() {
      var spriteOutput = gulp.src(mask)
        .pipe(plugin.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            cssTemplate: './src/sprites.handlebars'
          }));

      spriteOutput.css.pipe(gulp.dest("./src/css/compiled"));
      spriteOutput.img.pipe(gulp.dest("./dist/img"));

      return spriteOutput;
    }
    plugin.watch(mask, run);
    return run();
    });
    
gulp
    .task('default', [
    'pug', 
    'css',
    'browser-sync',
    ]);