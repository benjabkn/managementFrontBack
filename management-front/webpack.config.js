const webpack = require('webpack');

module.exports = {
  mode: 'production', // o 'development' dependiendo del entorno
  plugins: [
    new webpack.DefinePlugin({
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // O 'true' dependiendo de tus necesidades
    }),
  ],
};
