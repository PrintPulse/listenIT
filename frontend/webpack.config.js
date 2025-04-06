const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
   entry: './src/index.tsx',
   output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
   },
   resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
         '@styles': path.resolve(__dirname, 'src/styles')
      }
   },
      module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
         },
         {
            test: /\.(ts|tsx)$/,
            exclude: [
               /node_modules/,
               /__tests__/,
               /coverage/,
               /apiMock/
            ],
            use: 'ts-loader'
         }
      ]
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: '[name].[contenthash].css'
      })
   ]
}