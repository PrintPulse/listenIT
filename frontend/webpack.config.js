const path = require('path');

module.exports = {
   entry: './src/index.tsx',
   output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
   },
   resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
   },
      module: {
      rules: [
         {
            test: /\.scss$/,
            use: [
            'style-loader',
            'css-loader',
            'sass-loader'
            ]
         },
         {
            test: /\.(ts|tsx)$/,
            exclude: [
            /node_modules/,
            /__tests__/,
            /apiMock/
            ],
            use: 'ts-loader'
         }
      ]
   }
}