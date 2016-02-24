// NOTE: Requiring 'child_process' this way so the module is friendly
// with things like webpack.
var childProcess;
try {
  childProcess = window['require']('child_process');
} catch (err) {
  childProcess = {};
}

module.exports = {
  /**
   * @method clone
   *
   * Called to clone the given repository to the given path.
   *
   * @param repoUrl - String value of the url pointing to the repository to clone.
   * @param clonePath - String value of the path on the machine to clone the repository to.
   * @param flags - Array of flags to use with the clone.
   * @param callback - Function to callback when the process has finished.
  **/
  clone: function (repoUrl, clonePath, flags, callback) {
    if (repoUrl.indexOf('https://') > -1) {
      console.warn('Need to use SSH for cloning repositories, but https link was given');
      return;
    }

    if (typeof flags == 'function') {
      callback = flags;
      flags = [];
    } else if (!flags || !flags.length) {
      flags = [];
    }

    var args = flags.concat(['"' + repoUrl + '"', '"' + clonePath + '"']);
    var exec = 'git clone ' + args.join(' ');
    childProcess.exec(exec, {}, function (err) {
      callback(err);
    });
  }
};
