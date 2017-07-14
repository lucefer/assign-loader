# 连等语法加载器
为了方便大家使用我设计的连等语法，特开发了该语法的webpack加载器。
[查看连等语法介绍](https://github.com/lucefer/continue-assign-parser)
## 安装
```
npm install -D assign-loader
```
## 使用
在webpack的配置文件中关于模块加载器这一项，assign-loader一定要配置在js文件编译的第一个阶段。因为大部分js加载器都不支持我们的连等语法，如果我们不在第一步进行转译的话，后续js加载器会报语法错误。配置示例如下
```
module:{
    rules:[
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /(node_modules)/
        },
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          enforce: 'pre',
          options: {
            eslint: {
              configFile: '.eslintrc'
            }
          }
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                postcss: [require('postcss-bem')(),require('postcss-cssnext')()]
              }
            }
          ],
        },
        {
          test: /\.(jsd|vue|js)$/,
          loader: 'assign-loader',
          exclude: /node_modules/
        },
        {
          //设置对应的资源后缀.
          test: /\.(css|scss)$/,
          //设置后缀对应的加载器.
          loader: ExtractTextPlugin.extract({
          loader: 'css-loader?modules'
        })
        }
    ]
  }
```
>大家可以看到我的assign-loader的test规则定义的是'jsd'和'vue',为什么是jsd，而不是js呢？
jsd文件是为了防止eslinter等代码规范检查器报语法错误，而将**连等语法**的js文件后缀改为jsd，如果不在乎eslinter的**连等语法**报错，那就不必把自己的入口文件改成jsd。
