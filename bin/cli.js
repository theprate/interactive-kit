#!/usr/bin/env node

const program = require('commander');
const bundling = require('../lib/bundling');

/* setup global stuff */
program
  .version('0.1.0')

/* Command: dev server */
program
  .command('dev')
  .action(function dev() {
    bundling.development();
  })

/* Command: build for production */
program
  .command('dist')
  .action(function dist() {
    bundling.dist();
  })

/* Command: publish version to lowdown */
program
  .command('publish')
  .action(function dist() {
    bundling.dist()
//      .then(publish(());
  })



program.parse(process.argv)
