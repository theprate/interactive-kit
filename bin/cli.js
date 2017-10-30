#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const program = require('commander');
const bundling = require('../lib/bundling');
const config = require('../lib/config');
const publish = require('../lib/publish');

/* setup global stuff */
program
  .version('0.1.0')

/* Command: dev server */
program
  .command('dev')
  .action(function dev() {
    const slug = require(path.resolve(process.cwd(), './package.json')).name.slice(12);
    console.log(`${chalk.bold('Developing:')} ${chalk.white(slug)}`)
  
    bundling.development(config.getConfig());
  })

/* Command: build for production */
program
  .command('dist')
  .action(function dist() {
    // clear the dist directory
    bundling.dist(config.getConfig());
  })

/* Command: publish version to lowdown */
program
  .command('publish')
  .action(function performPublish() {
    publish(config.getConfig());
  })



program.parse(process.argv)
