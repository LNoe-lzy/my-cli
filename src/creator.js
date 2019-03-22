const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const memFs = require('mem-fs');
const memFsEditor = require('mem-fs-editor');
const path = require('path');

class Creator {
  constructor() {
    // 创建内存store
    const store = memFs.create();
    this.fs = memFsEditor.create(store);

    this.options = {
      name: '',
      description: '',
    };

    this.rootPath = path.resolve(__dirname, '../');
    this.tplDirPath = path.join(this.rootPath, 'template');
  }

  init() {
    console.log(chalk.green('my cli 开始'));
    console.log();
    this.ask().then((answers) => {
      this.options = Object.assign({}, this.options, answers);

      this.write();
    });
  }

  ask() {
    // 问题
    const prompt = [];

    prompt.push({
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
      validate(input) {
        if (!input) {
          return '请输入项目名称!';
        }

        if (fs.existsSync(input)) {
          return '项目名已重复!'
        }

        return true;
      }
    });

    prompt.push({
      type: 'input',
      name: 'description',
      message: '请输入项目描述',
    });

    // 返回promise
    return inquirer.prompt(prompt);
  }

  write() {
    console.log(chalk.green('my cli 构建开始'));
    const tplBuilder = require('../template/index.js');
    tplBuilder(this, this.options, () => {
      console.log(chalk.green('my cli 构建完成'));
      console.log();
      console.log(chalk.grey(`开始项目:  cd ${this.options.name } && npm install`));
    });
  }

  getTplPath(file) {
    return path.join(this.tplDirPath, file);
  }
  
  copyTpl(file, to, data = {}) {
    const tplPath = this.getTplPath(file);
    this.fs.copyTpl(tplPath, to, data);
  }
  
  copy(file, to) {
    const tplPath = this.getTplPath(file);
    this.fs.copy(tplPath, to);
  }
}

module.exports = Creator;