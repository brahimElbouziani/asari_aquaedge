module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  devServer: {
    // Disable Hot Module Replacement (HMR) and live reload.
    // Note: the console error you saw (WebSocketClient.js / initSocket in socket.js)
    // comes from webpack-dev-server's injected client, not from our app code.
    hot: false,
    liveReload: false,
    // Fully disable webpack-dev-server client injection (removes WS connection attempts)
    client: false,
    // Fully disable the websocket server used by the dev client (HMR / liveReload)
    webSocketServer: false
  },
  chainWebpack: config => {
    // Remove HMR plugin to prevent WebSocket client injection
    if (process.env.NODE_ENV === 'development') {
      config.plugins.delete('hmr')
    }
  },
  css: {
    loaderOptions: {
      sass: {
        // Suppress Sass deprecation warnings from Vuetify and custom SCSS
        sassOptions: {
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'slash-div', 'color-functions']
        }
      },
      scss: {
        sassOptions: {
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'slash-div', 'color-functions']
        }
      }
    }
  }
}