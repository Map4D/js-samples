import gulp from "gulp";
import { path } from "../config/path.js";

export function files() {
    return gulp.src(path.src.files)
        .pipe(gulp.dest(path.build.files));
}