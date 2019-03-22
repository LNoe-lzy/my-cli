const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = function(creator, options, callback) {
  const { name, description } = options;

  // 获取当前命令的执行目录，注意和项目目录区分
  const cwd = process.cwd();
  // 项目目录
  const projectPath = path.join(cwd, name);
  const buildPath = path.join(projectPath, 'build');
  const pagePath = path.join(projectPath, 'page');
  const srcPath = path.join(projectPath, 'src');

  // 新建项目目录
  // 同步创建目录，以免文件目录不对齐
  fs.mkdirSync(projectPath);
  fs.mkdirSync(buildPath);
  fs.mkdirSync(pagePath);
  fs.mkdirSync(srcPath);

  creator.copyTpl('packagejson', path.join(projectPath, 'package.json'), {
    name,
    description,
  });

  creator.copy('build/build.js', path.join(buildPath, 'build.js'));

  creator.copy('page/index.html', path.join(pagePath, 'index.html'));

  creator.copy('src/index.js', path.join(srcPath, 'index.js'));

  creator.fs.commit(() => {
    console.log();
    console.log(`${chalk.grey(`创建项目: ${name}`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建目录: ${name}/build`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建目录: ${name}/page`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建目录: ${name}/src`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建文件: ${name}/build/build.js`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建文件: ${name}/page/index.html`)} ${chalk.green('✔ ')}`);
    console.log(`${chalk.grey(`创建文件: ${name}/src/index.js`)} ${chalk.green('✔ ')}`);

    callback();
  });
}