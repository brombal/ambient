const path = require('path');

module.exports = {
  entry: './src/browser.ts',
  output: {
    path: path.join(__dirname, 'dist/browser'),
    filename: 'index.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              "target": "es5",
              "module": "commonjs",
              "lib": [
                "es2015",
                "dom"
              ]
            }
          }
        }]
      },
    ]
  },
  externals: {
    react: 'React'
  }
};
