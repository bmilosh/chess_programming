const path = require('path');

module.exports = {
    entry: './assets/index.js',  // path to our input file
    devtool: 'inline-source-map', // helps eliminate "source map errors" in the browser
    output: {
        filename: 'index-bundle.js',  // output bundle file name
        path: path.resolve(__dirname, './static'),  // path to our Django static directory
    },
    cache: false,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env", ["@babel/preset-react", { "runtime": "automatic" }]] }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            
        ]
    },
};