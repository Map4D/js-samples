import gulp from "gulp";
import { path } from "../config/path.js";
import { plugins } from "../config/plugins.js";
import { isBuild } from "../constants/isBuild.js";

import sassPkg from "sass";
import gulpSass from "gulp-sass";
import autoPrefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import cleanCss from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";

const sass = gulpSass(sassPkg);

export function scss() {
    return gulp.src(path.src.scss)
        .pipe(plugins.gulpIf(
            !isBuild,
            sourcemaps.init()
        ))
        .pipe(sass())
        .pipe(plugins.gulpIf(
            !isBuild,
            sourcemaps.write()
        ))
        .pipe(plugins.gulpIf(
            isBuild,
            groupCssMediaQueries()
        ))
        .pipe(plugins.gulpIf(
            isBuild,
            autoPrefixer()
        ))
        .pipe(plugins.gulpIf(
            isBuild,
            cleanCss()
        ))
        .pipe(plugins.rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(plugins.browserSync.stream());
};