const path = require("path");
const FunctionSchemaPlugin = require("./functionSchemaPlugin");

module.exports = {
  // 入口文件
  entry: "./src/index.ts",

  // 输出配置
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },

  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  // 插件
  plugins: [
    new FunctionSchemaPlugin({
      directory: path.resolve(__dirname, "src/tools"),
    }),
  ],

  // 开发工具
  devtool: "source-map",
};
