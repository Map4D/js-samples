const buildFolder = './dist';
const srcFolder = './src';

export const path = {
    build: {
        js: `${buildFolder}/js/`,
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        images: `${buildFolder}/images/`,
        svgicons: `${buildFolder}/sprite/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
    },
    src: {
        js: `${srcFolder}/js/index.js`,
        html: `${srcFolder}/*.html`,
        scss: `${srcFolder}/scss/style.scss`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
        svgicons: `${srcFolder}/svgicons/*.svg`,
        svg: `${srcFolder}/images/**/*.svg`,
        fonts: `${srcFolder}/fonts/*.{ttf,woff,woff2}`,
        files: `${srcFolder}/files/**/*.*`,
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        html: `${srcFolder}/**/*.html`,
        scss: `${srcFolder}/scss/**/*.scss`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,svg,ico }`,
        svgicons: `${srcFolder}/svgicons/*.svg`,
        files: `${srcFolder}/files/**/*.*`,
    },
    clean: buildFolder,
    buildFolder,
    srcFolder,
};