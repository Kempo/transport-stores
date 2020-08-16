module.exports = {
  onPreBuild: ({ utils }) => {
    utils.build.cancelBuild('ALERT: Cancelling both builds.');
  }
}
