const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    plugins: [new CompressionPlugin()],
};
module.exports = {
    plugins: [
        new webpack.DefinePlugin({ 
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new CompressionPlugin({ 
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
          }),
    ],

};


