import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

import { files } from "./gulp/tasks/files.js";
import { cleanDist } from "./gulp/tasks/clean.js";
import { html } from "./gulp/tasks/html.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { fonts } from "./gulp/tasks/fonts.js";
import { svgSprite } from "./gulp/tasks/svgSprite.js";
import { server } from "./gulp/tasks/server.js";

const { series, parallel, watch } = gulp;

function reload(done) {
    plugins.browserSync.reload();
    done();
};

function watcher() {
    watch(path.watch.html, html);
    watch(path.watch.scss, scss);
    watch(path.watch.files, series(files, reload));
    watch(path.watch.js, series(js, reload));
    watch(path.watch.images, series(images, reload));
    watch(path.watch.svgicons, series(svgSprite, reload));
}

const mainTasks = parallel(fonts, scss, files, html, svgSprite, js, images);
const startServer = parallel(server, watcher);

export const dev = series(cleanDist, mainTasks, startServer);
export const build = series(cleanDist, mainTasks);