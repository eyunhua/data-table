const path = require('path');
function resolve(dir) {
    return path.resolve(__dirname, dir);
}

module.exports = {
    pages: {
        index: {
            entry: './demo/main.js',
        }
    },
    lintOnSave: 'warning',
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true
                }
            }
        }
    },
    transpileDependencies: [
        'veui',
    ],
    chainWebpack: config => {
        config.module
            .rule('veui')
            .test(/\.vue$/)
            .pre()
            .use('veui-loader')
            .loader('veui-loader')
            .tap(() => {
                return {
                modules: [
                    {
                        package: 'veui-theme-blue',
                        fileName: '{module}.less'
                    },
                    {
                        package: 'veui-theme-blue',
                        fileName: '{module}.js',
                        transform: false
                    }
                ]
                }
            })
        config.resolve.alias
            .set('data-table', resolve('src'))
    }
}