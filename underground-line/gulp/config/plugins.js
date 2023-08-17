import replace from "gulp-replace";
import rename from "gulp-rename";
import browserSync from "browser-sync";
import newer from "gulp-newer";
import gulpIf from "gulp-if";

export const plugins = {
    replace,
    rename,
    browserSync: browserSync.create(),
    newer,
    gulpIf,
}