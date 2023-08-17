import gulp from "gulp";
import { path } from "../config/path.js";
import fileinclude from "gulp-file-include";
import { plugins } from "../config/plugins.js";
import { isBuild } from "../constants/isBuild.js";

import htmlmin from "gulp-htmlmin";

export function html() {
    return gulp.src(path.src.html)
        .pipe(fileinclude())
        .pipe(plugins.replace(/href="\.\/svgicons\/(.+)\.svg"/g, 'href="./sprite/sprite.svg#$1"'))
        .pipe(plugins.gulpIf(
            isBuild,
            htmlmin({
                collapseWhitespace: true,
                removeComments: true,
            })
        ))
        .pipe(gulp.dest(path.build.html))
        .pipe(plugins.browserSync.stream());
}