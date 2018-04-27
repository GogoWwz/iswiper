const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.config.js')

let ROOT_PATH = path.resolve(__dirname,'..')
let pathsToClean = ['dist']
let cleanOptions = {
    root: ROOT_PATH ,   // 根目录
    verbose: true,      // 开启在控制台输出信息
    dry: true           // 启动时删除文件
}

module.exports = merge(baseWebpackConfig, {
    plugins: [
        new CleanWebpackPlugin(pathsToClean,cleanOptions),
        new webpack.optimize.UglifyJsPlugin()
    ]
})