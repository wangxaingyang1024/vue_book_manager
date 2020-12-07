module.exports = {
    devServer: {
        host: 'localhost',
        open: true,
        //host: "localhost",
        proxy: {
            '/api': {
                // /api 的意义在于，声明axios中url已/api开头的请求都适用于该规则，
                // 注意是以/api开头，即：axios.post({url: '/api/xxx/xxx'})
                target: 'http://192.168.2.103:8899', //'http://192.168.6.163:8080/'
                changeOrigin: true,
                pathRewrite: { '^/api': '/api' },
            }
        }
    }
}