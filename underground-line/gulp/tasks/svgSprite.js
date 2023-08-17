import gulp from "gulp";
import { path } from "../config/path.js";
import { plugins } from "../config/plugins.js";
import { isBuild } from "../constants/isBuild.js";

import svgSymbols from "gulp-svg-symbols";
import svgmin from 'gulp-svgmin';

export function svgSprite() {
    return gulp.src(path.src.svgicons)
        .pipe(plugins.gulpIf(
            isBuild,
            svgmin()
        ))
        .pipe(svgSymbols({
            templates: ["default-svg"],
        }))
        .pipe(plugins.gulpIf(
            isBuild,
            plugins.replace('\n', ''))
        )
        .pipe(plugins.rename({
            basename: 'sprite',
        }))
        .pipe(gulp.dest(path.build.svgicons));
}