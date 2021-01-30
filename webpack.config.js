const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'client', 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'users.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css)/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        loader: 'file-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'src', 'index.html')
    })
  ]
};