const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const spawn = require('cross-spawn');
const argv = require('yargs').argv;

const testDirFiles = fs.readdirSync(path.join(__dirname, '../testProjects'));
const folders = _.chain(testDirFiles)
  .reject(s => s.match(/^\./))
  .filter(file => {
    const toInclude = argv.folders || argv.projects;
    if (toInclude) {
      return _.includes(toInclude, file);
    }
    return true;
  })
  .value();

folders.forEach(folder => {
  spawn.sync('yarn', ['install', '--cwd', `testProjects/${folder}`], {
    stdio: 'inherit'
  });

  fs.copySync(
    'dist/index.js',
    `testProjects/${folder}/.serverless_plugins/serverless-plugin-iopipe/index.js`
  );

  spawn.sync('yarn', ['--cwd', `testProjects/${folder}`, 'test'], {
    stdio: 'inherit'
  });
});