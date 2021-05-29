
const Webpack = require("webpack");

const addZero = (num) => {
    return ("00" + num).slice(-2);
};
const now = new Date();
const versionCode = `${now.getFullYear()}${addZero(now.getMonth() + 1)}${addZero(now.getDate())}${addZero(now.getHours())}${addZero(now.getMinutes())}`;

module.exports = {
    publicPath: "./",
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        loaderOptions: {
            sass: {
                prependData: '@import "@/assets/css/variables.scss";',
            },
        },
    },
    configureWebpack: {
        plugins: [
            new Webpack.DefinePlugin({
                isDev: process.env.NODE_ENV === "development",
                versionCode: versionCode,
            }),
        ],
    },
};
