import gulp from "gulp";
import { path } from "../config/path.js";
import { plugins } from "../config/plugins.js";
import { isBuild } from "../constants/isBuild.js";

import imagemin, { mozjpeg, optipng, svgo } from "gulp-imagemin";
import imageminWebp from "imagemin-webp";
import extReplace from "gulp-ext-replace";

export function images() {
    return gulp.src(path.src.images)
        .pipe(plugins.newer(path.build.images))
        .pipe(imagemin([
            imageminWebp({
                quality: 90,
            }),
        ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest(path.build.images))
        .pipe(gulp.src(path.src.images))
        .pipe(plugins.newer(path.build.images))
        .pipe(plugins.gulpIf(
            isBuild,
            imagemin([
                mozjpeg({ quality: 90, progressive: true }),
                optipng({ optimizationLevel: 5 }),
                svgo({
                    plugins: [
                        { removeViewBox: false },
                        { cleanupIDs: false },
                    ]
                })
            ])
        ))
        .pipe(gulp.dest(path.build.images))
        .pipe(gulp.src(path.src.svg))
        .pipe(gulp.dest(path.build.images));
}