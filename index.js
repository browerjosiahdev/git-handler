// NOTE: Requiring 'child_process' this way so the module is friendly
// with things like webpack.
var childProcess;
var window;
try {
  if (window) {
    childProcess = window['require']('child_process');
  } else {
    childProcess = require('child_process');
  }
} catch (err) {
  childProcess = {};
}

var methods = {};

/**
 * @method add
 *
 * Called to add unstaged changes to the local repository.
 *
 * @param cwd - Path to the local repository.
 * @param callback - Method to callback when the child process finishes.
**/
methods.add = function (cwd, callback) {
  childProcess.exec('git add --all', { cwd: cwd }, function (err, stdout, stderr) {
    if (err) {
      callback({ err: err });
      return;
    }
    callback({ stderr: stderr, stdout: stdout });
  });
}.bind(methods);

/**
 * @method checkout
 *
 * Called to checkout a branch.
 *
 * @param cwd - Path to the local repository.
 * @param branch - Name of the branch to switch to.
 * @param force - (false) true to force creation of a new branch if it doesn't exist.
 * @param callback - Method to callback when the child process finishes.
**/
methods.checkout = function (cwd, branch, force, callback) {
  childProcess.exec('git checkout ' + branch, { cwd: cwd }, function (err, stdout, stderr) {
    if (err) {
      if (force && err && err.toString().match(/(did not match)/g)) {
        childProcess.exec('git checkout -b ' + branch, { cwd: cwd }, function (err, stdout, stderr) {
          if (err) {
            callback({ err: err });
            return;
          }
          callback({ stderr: stderr, stdout: stdout });
        });
      } else {
        callback({ err: err });
        return;
      }
    }
    callback({ stderr: stderr, stdout: stdout });
  });
}.bind(methods);

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
methods.clone = function (repoUrl, clonePath, flags, callback) {
  if (typeof flags == 'function') {
    callback = flags;
    flags = [];
  } else if (!flags || !flags.length) {
    flags = [];
  }

  var args = flags.concat(['"' + repoUrl + '"', '"' + clonePath + '"']);
  var exec = 'git clone ' + args.join(' ');
  childProcess.exec(exec, {}, function (err) {
    callback({ err: err });
  });
}.bind(methods);

/**
 * @method commit
 *
 * Called to commit unstaged changes to the local repository.
 *
 * @param cwd - Path to the local repository.
 * @param message - Message to make the commit with.
 * @param callback - Method to callback when the child process finishes.
**/
methods.commit = function (cwd, message, callback) {
  this.add(cwd, function (details) {
    if (details.err) {
      callback(details);
    }
    childProcess.exec('git commit -m "' + message + '"', { cwd: cwd }, function (err, stdout, stderr) {
      if (err) {
        callback({ err: err });
        return;
      }
      callback({ stderr: stderr, stdout: stdout });
    });
  });
}.bind(methods);

/**
 * @method hasUnstaged
 *
 * Called to check if there are unstaged changes.
 *
 * @param cwd - Path to the local repository.
 * @param callback - Method to callback when the child process finishes.
**/
methods.hasUnstaged = function (cwd, callback) {
  childProcess.exec('git status', { cwd: cwd }, function (err, stdout, stderr) {
    if (err) {
      callback({ err: err });
      return;
    }
    callback({
      response: (stdout && stdout.match(/(not staged)/)),
      stderr: stderr,
      stdout: stdout
    });
  });
}.bind(methods);

/**
 * @method pull
 *
 * Called to pull from the remote repository.
 *
 * @param cwd - Path to the local repository.
 * @param repoUrl - Path to the remote repository.
 * @param branch - Branch to pull from.
 * @param callback - Method to callback when the child process finishes.
**/
methods.pull = function (cwd, repoUrl, branch, callback) {
  childProcess.exec(('git pull ' + repoUrl + ' '  + branch), function (err, stdout, stderr) {
    if (err) {
      callback({ err: err });
      return;
    }
    callback({ stderr: stderr, stdout: stdout });
  });
}

/**
 * @method push
 *
 * Called to push the staged changes to the remote repository.
 *
 * @param cwd - Path to the local repository.
 * @param repoUrl - Path to the remote repository.
 * @param branch - Branch to push the changes to.
 * @param credentials - Object containing username and password { password, userName }
 * @param callback - Method to callback when the child process finishes.
**/
methods.push = function (cwd, repoUrl, branch, credentials, callback) {
  var push = function () {
    repoUrl = repoUrl.replace(/(https:\/\/)|(http:\/\/)|(www\.)/g, '');
    repoUrl = 'https://' + credentials.userName + ':' + credentials.password + '@' + repoUrl;
    childProcess.exec(('git push ' + repoUrl + ' ' + branch), function (err, stdout, stderr) {
      if (err) {
        callback({ err: err });
        return;
      }
      callback({ stdout: stdout, stderr: stderr });
    });
  }.bind(this);
  this.hasUnstaged(cwd, function (details) {
    if (details.err) {
      callback({ err: details.err });
      return;
    } else if (details.response) {
      this.add(cwd, function (details) {
        if (details.err) {
          callback({ err: details.err });
          return;
        }
        // TODO: Add in a way so we can callback and request a commit message.
        this.commit(cwd, 'Updated via git-handler', function (details) {
          if (details.err) {
            callback({ err: details.err });
            return;
          }
          push();
        }.bind(this));
      }.bind(this));
    } else {
      push();
    }
  }.bind(this));
}.bind(methods);
module.exports = methods;
