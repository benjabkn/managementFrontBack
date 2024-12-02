const webpack = require('webpack');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin').default;

module.exports = {
  mode: 'production', // o 'development' dependiendo del entorno
  plugins: [
    new webpack.DefinePlugin({
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // O 'true' dependiendo de tus necesidades
    }),
  ],
};
module.exports = {
  // Otras configuraciones de Webpack
  plugins: [
    new UnusedFilesWebpackPlugin({
      patterns: ['src/**/*.js'],  // Busca en todos los archivos JS
      failOnUnused: false,  // Si es true, dará un error si hay archivos no utilizados
      // Otras opciones de configuración
    })
  ]
};