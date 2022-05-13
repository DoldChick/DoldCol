const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const resolve = dir => path.join(__dirname, dir)

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: `src/${name}/index.html`,
    filename: `${name}.html`
  };
});

const copyFiles = [
  {
    from: path.resolve("src/assets"),
    to: path.resolve("dist/assets")
  }, {
    from: path.resolve("src/components"),
    to: path.resolve("dist/components")
  }, {
    from: path.resolve("src/router"),
    to: path.resolve("dist/router")
  }, {
    from: path.resolve("src/js/"),
    to: path.resolve("dist/js/")
  }
]

const plugins =
  process.env.NODE_ENV === "production"
    ? [
      {
        from: path.resolve("src/manifest.production.json"),
        to: `${path.resolve("dist")}/manifest.json`
      }
    ].concat(copyFiles)
    : [
      {
        from: path.resolve("src/manifest.development.json"),
        to: `${path.resolve("dist")}/manifest.json`
      }
    ].concat(copyFiles);

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [CopyWebpackPlugin(plugins)]
  },
  //配置代理
  devServer: {},
  // 配置svg
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons')) //对应下面配置svg的路径
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) //对应下面配置svg的路径
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
  },
};
