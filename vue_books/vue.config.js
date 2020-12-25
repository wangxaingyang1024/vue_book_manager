const path = require("path"); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  devServer: {
    host: "localhost",
    open: true,
    proxy: {
      "/api": {
        // /api 的意义在于，声明axios中url已/api开头的请求都适用于该规则，
        // 注意是以/api开头，即：axios.post({url: '/api/xxx/xxx'})
        // target:
        // process.env.NODE_ENV === "production"
        //   ? "http://182.92.77.213:8899"
        //   : "http://192.168.2.103:8891",
        target: "http://182.92.77.213:8899",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
  chainWebpack: (config) => {
    //配置路径别名
    config.resolve.alias.set("assets", resolve("./src/assets"));
    config.resolve.alias.set("components", resolve("./src/components"));
    //发布模式
    config.when(process.env.NODE_ENV === "production", (config) => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js");
      //使用externals设置排除项
      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        nprogress: "NProgress",
      });
      //自定义首页
      config.plugin("html").tap((args) => {
        args[0].isProd = true;
        return args;
      });
    });
    //开发模式
    config.when(process.env.NODE_ENV === "development", (config) => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");
      config.plugin("html").tap((args) => {
        args[0].isProd = false;
        return args;
      });
    });
  },
};
