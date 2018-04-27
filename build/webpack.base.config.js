const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname,'..',dir)
}

// 页面目录文件字典
const entryJson = require("../config/entry.json")

// 多页面配置输出目录
let HtmlPlugins = entryJson.map(page => {
    return new HtmlWebpackPlugin({
        title: page.title,
        filename: resolve(`/dist/${page.url}.html`),
        template: resolve(`src/views/${page.url}/index.html`),
        inject: true,
        minify: {
            caseSensitive: false,
            collapseBooleanAttributes: true, 
            collapseWhitespace: true
        }
    })
})

// 引入入口文件 
let entry = {

}

entryJson.map(page => {
    entry[page.url] = path.resolve(__dirname,`../src/views/${page.url}/iswipper.js`)
})

module.exports = {
    entry: entry,
    output: {
        path: resolve('dist'),
        filename: "js/[name].js"
    },
    module: {
      rules: [
        //  zepto
        {
            test: require.resolve('zepto'),
            use: ['exports-loader?window.Zepto','script-loader']
        },
        // css
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader","postcss-loader"],
                publicPath:'../'
          })
        },
        // sass
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader","postcss-loader","sass-loader"],
                publicPath:'../'
                // use:[
                //     {
                //         loader: "css-loader",
                //         options: {
                //             minimize: true
                //         }
                //     }, {
                //         loader: "sass-loader"
                //     }
                // ]
            }),
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: "url-loader",
                    options: { 
                        limit: 5000, 
                        name: "images/[name].[ext]" ,
                    }
                }
            ],
        },
        { 
            test: /\.js$/,
            exclude: /node_modules/, 
            include:resolve('src'),
            use:[ "babel-loader"] 
        }
        // {
        //   test: /\.(woff|woff2|eot|ttf|otf)$/,
        //   use: [
        //     { loader: "file-loader?limit=1024&name=fonts/[name].[ext]" }
        //   ]
        // },
        // {
        //   test: /\.ejs$/,
        //   use: ["ejs-html-loader"]
        // }
      ]
    },
  
    // resolve: {
    //     extensions: [".js", ".scss", ".json"],
    //     alias: {
    //         common: "../../common",
    //         assets:resolve('src/assets')
    //     }
    // },
  
    plugins: [
        ...HtmlPlugins,
        new ExtractTextPlugin({
            //从bundle中提取出
            filename: getPath => {
                return getPath("css/[name]_[chunkhash:8].css").replace("css/js", "css");
            },
            disable: false //禁用插件为false
            // allChunks:true
        })
    ]
  };
  