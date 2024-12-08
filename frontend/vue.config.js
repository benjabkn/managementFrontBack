module.exports = {
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Puedes habilitar más flags según lo que necesites
      }),
    ],
  },
};

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://backend:3003', // Redirige las solicitudes al backend
        changeOrigin: true,
      },
    },
  },
};