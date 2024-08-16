const path = require('path');
const webpack = require('webpack');
module.exports = {
    mode: 'development',
    entry: { app: './JSX/main.jsx' },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'Public'),
    },
    module: {
        rules: [{
            test: /\.jsx?$/, exclude: /node_modules/, use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                ie: '11',
                                chrome: '49',
                            }
                        }
                        ],
                        '@babel/preset-react',
                    ],
                },
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'Images/[name].[ext]',
                },
              },
            ],
          },
        ],
    },
    
    optimization: {
        splitChunks: { name: 'vendor', chunks: 'all', },
    },
};
