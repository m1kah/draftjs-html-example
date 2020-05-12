const path = require("path");

module.exports = ({ mode }) => {
    return {
        mode,
        devtool: mode === "development"
            ? "source-map"
            : "none",
        entry: {
            index: "./src/js/index.js"
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "[name].bundle.js",
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /.jsx?$/,
                    exclude: /node_modules\/@?babel/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react"
                            ]
                        }
                    }
                },
            ]
        },
        devServer: {
            port: 8080,
            contentBase: ["./src/html"],
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
            }
        }
    }
};
