const path = require("path");
require("dotenv").config();

// react-scripts 5 still hands webpack-dev-server the v4 option names; map them onto the v5 API.
function toDevServerV5(options) {
  const { https, onAfterSetupMiddleware, onBeforeSetupMiddleware, onListening, setupMiddlewares, ...rest } = options;

  rest.server = typeof https === "object" ? { type: "https", options: https } : https ? "https" : "http";
  rest.headers = { ...rest.headers, "Cross-Origin-Resource-Policy": "same-origin" };

  if (onBeforeSetupMiddleware || setupMiddlewares) {
    rest.setupMiddlewares = (middlewares, devServer) => {
      if (onBeforeSetupMiddleware) onBeforeSetupMiddleware(devServer);
      return setupMiddlewares ? setupMiddlewares(middlewares, devServer) : middlewares;
    };
  }

  rest.onListening = (devServer) => {
    devServer.close ??= (callback) => devServer.stopCallback(callback);
    if (onListening) onListening(devServer);
    if (onAfterSetupMiddleware) onAfterSetupMiddleware(devServer);
  };

  return rest;
}

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: { "@": path.resolve(__dirname, "src") },
    configure: (config) => {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**", "**/build/**", "**/dist/**", "**/coverage/**", "**/public/**"],
      };
      return config;
    },
  },
  devServer: (options) => toDevServerV5(options),
};
