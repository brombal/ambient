const path = require('path');

module.exports = (env, argv = {}) => ({
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : 'none',
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
    ]
  }
});
