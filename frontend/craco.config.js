module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            resolve: {
              fullySpecified: false
            }
          }
        ]
      }
    }
  }
};
