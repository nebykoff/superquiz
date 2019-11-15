const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const smartgrid = require('smart-grid');

const stylesPath = './scss';

var plugins = [
    autoprefixer({ grid: true, browsers: ['last 2 versions', 'ie 10-11', 'Firefox > 20']})    
];

gulp.task('build:css', function () {
    return gulp.src(stylesPath+'/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss(plugins)) 
        // .pipe(gcmq()) //Группировка медиа запросов
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css/'))
})

gulp.task('watch', function () {
    gulp.watch(stylesPath+'/**/*.scss', gulp.series('build:css'))
})


/* It's principal settings in smart grid project */
var sgSettings = {
    filename: '_smart-grid',
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px'            
        },
        xs: {
            width: '560px'
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};

gulp.task('smart-grid', function (cb) {
    smartgrid(stylesPath, sgSettings);
    cb();
});