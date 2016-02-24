#git-handler

I created `git-handler` mostly because I am using [webpack](https://webpack.github.io/) to bundle an
electron application, and I needed some way to pull down a template structure that is being hosted on
github. I tried a lot of the other git modules available, and though they are good they weren't compatible
with `webpack`. Hence, the only (that I know of) git module that works with `webpack`.

##Usage

As of right now the only available command is for cloning (that is all I needed at the moment) but I plan to
add more great features in the future. Feel free to let me know if you have any requests, and I will do my
best to get them implemented.

```javascript
import Git from 'git-handler';

/**
 * @method clone
 *
 * Called to clone a repository.
 *
 * @param SSH (cannot be HTTPS) link to the git repository to clone.
 * @param Path to where on your machine you would like to clone the repository.
 * @param (optional) array of flags to use with the clone command.
 * @param callback method to call when done cloning the repository, or if an error is thrown.
**/
Git.clone('git@github.com:user/repo.git', '/path/to/clone/to', ['-l', '-s'], (err) => {
  if (err) {
    console.warn(`Error cloning repository - ${err}`);
  }

  console.log('YAY! The repository was cloned successfully.');
});
```
