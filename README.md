#git-handler

I created `git-handler` mostly because I am using [webpack](https://webpack.github.io/) to bundle an
electron application, and I needed some way to pull down a template structure that is being hosted on
github. I tried a lot of the other git modules available, and though they are good they weren't compatible
with `webpack`. Hence, the only (that I know of) git module that works with `webpack`.

##Usage

Some new features have been added for version 2 including the ability to do `git add`, `git checkout`, `git clone`,
`git commit`, `git pull` and `git push`. Again, if you have any ideas or issues please post them to the git repository
located [here](https://github.com/browerjosiahdev/git-handler).

```javascript
import Git from 'git-handler'; // If using ES6 import statement.
const Git = require('git-handler'); // If using ES Vanilla.

const RepoUrl = 'https://github.com/user/repo.git';
const LocalUrl = '/path/to/local/repository/';

/**
 * @method add
 *
 * Called to add changed items to the local repository so they are ready to be staged.
 *
 * @param Path to the local git repository.
 * @param Callback method for when the process completes.
**/
Git.add(LocalUrl, function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log(details.stdout);
  console.log(details.stderr);
});

/**
 * @method checkout
 *
 * Called to checkout a new or existing branch.
 *
 * @param Path to the local git repository.
 * @param Name of the existing or new branch.
 * @param True to force creation of new branch if doesn't exist, false to throw an error.
 * @param Callback method for when the process completes.
**/
Git.checkout(LocalUrl, 'new-branch', true, function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log(details.stdout);
  console.log(details.stderr);
});

/**
 * @method clone
 *
 * Called to clone a repository.
 *
 * @param HTTPS path to the remote repository.
 * @param Path to where on your machine you would like to clone the repository.
 * @param (optional) array of flags to use with the clone command.
 * @param Callback method for when the process completes.
**/
Git.clone(RepoUrl, '/path/to/clone/to', ['-l', '-s'], function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log('YAY! The repository was cloned successfully.');
});

/**
 * @method commit
 *
 * Called to commit unstaged changes to the local repository.
 *
 * @param Path to the local git repository.
 * @param Message to commit with.
 * @param Callback method for when the process completes.
 *
 * NOTE: Commit automatically calls the 'add' method!
**/
Git.commit(LocalUrl, 'Commit message', function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log(details.stdout);
  console.log(details.stderr);
});

/**
 * @method pull
 *
 * Called to pull the latest from the remote repository.
 *
 * @param Path to the local git repository.
 * @param HTTPS path to the remote repository.
 * @param Name of the branch to pull.
 * @param Callback method for when the process completes.
**/
Git.pull(LocalUrl, RepoUrl, 'master', function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log(details.stdout);
  console.log(details.stderr);
});

/**
 * @method push
 *
 * Called to push the staged changes from your local repository to the remote repository.
 *
 * @param Path to the local git repository.
 * @param HTTPS path to the remote repository.
 * @param Name of the branch to push to.
 * @param Credentials object containing { password, userName }
 * @param Callback method for when the process completes.
**/
Git.push(LocalUrl, RepoUrl, 'master', { password: '*****', userName: 'unibrowdev' }, function (details) {
  if (details.err) {
    console.error(details.err);
    return;
  }
  console.log(details.stdout);
  console.log(details.stderr);
});
```
