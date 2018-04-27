const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.config.js')

module.exports = merge(baseWebpackConfig, {
    watch: true,
    watchOptions: {
        // 不监听的文件或文件夹，支持正则匹配
        // 默认为空
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
        // 默认为 300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
        // 默认每秒问 1000 次
        poll: 1000
    },
    devServer: {
        port: 8888,
        contentBase: path.join(__dirname,'dist'),
        publicPath: '/',
        compress: true,
        host: 'localhost',
        overlay: true,
        hot: true
        // open: true
    },
    plugins:[
        // new webpack.HotModuleReplacementPlugin()
    ]
})