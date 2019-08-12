const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

/** @type import("webpack").Configuration */
const baseConfig = {
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
};
module.exports = [
    // ブラウザで動く機能をバンドル
    merge(baseConfig, {
        entry: "./src/client",
        output: {
            filename: "client.js",
            path: `${__dirname}/dist`,
        },
        module: {
            rules: [
                {
                    // bootstrapのcssを読み込む際に必要
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        }
    }),
    // Nodeサーバーで動く機能をバンドル
    merge(baseConfig, {
        entry: "./src/server",
        output: {
            filename: "server.js",
            path: `${__dirname}/dist`,
        },
        target: "node",
        node: {
            // expressを使うときにはこの設定をしないと失敗します
            // 参考：https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
            __dirname: false,
            __filename: false,
        },
        externals: [
            // webpackで生成したファイルを、`node bundle.js` と実行する場合に
            // node_modulesのファイルを一緒にバンドルしている必要はないので、
            // node_modulesを無視して外部関数として扱うようにバンドルしてくれる
            nodeExternals()
        ],
        plugins: [
            // nodeのサーバ用のjsファイルを編集した時に自動でサーバを再起動してくれる
            // nodemonのwebpack用のプラグイン
            new NodemonPlugin(),
        ],
    }),
];
