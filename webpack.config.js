const path = require('path');

module.exports = (env, argv = {}) => ({
  entry: './src/ambient.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : 'none',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
    ]
  },
  externals : {
    react: 'react',
    reactDom: 'react-dom'
  }
});
