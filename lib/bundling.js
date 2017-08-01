const chokidar = require('chokidar');
const rollup = require('rollup');
const postcss = require('rollup-plugin-postcss');
const url = require('rollup-plugin-url');
const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const uglifyLib = require('uglify-js');

const startServer = require('./server');

let cache;

const urlPluginDevelopment = url({
  limit: 20 * 1024, // inline files < 20k, copy files > 20k
  include: [
    '**/*.svg',
    '**/*.png',
    '**/*.jpg',
    '**/*.gif',
    '**/*.json',
  ], // defaults to .svg, .png, .jpg and .gif files
  publicPath: `/bundle/`
});

const basePlugins = (config) => ([
  nodeResolve({
    module: true, // Default: true
    jsnext: true,  // Default: false
    main: true,  // Default: true
    browser: true,
    extensions: ['.js'],  // Default: ['.js']
    preferBuiltins: false,
  }),
  commonjs(),
  postcss({
    extensions: ['.css'],
  }),
  buble({
    jsx: config.jsx
  }),
]);

function development(config) {
  const writeOptions = {
    format: 'iife',
    dest: `dev/bundle.js`
  };

  const generate = () => {
    console.log('Rebundling');
    return rollup.rollup({
      entry: 'src/entry.js',
      plugins: [
        ...basePlugins(config),
        urlPluginDevelopment,
        replace({
          ENVIROMENT: JSON.stringify('development'),
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
      ],
      cache: cache
    })
    .then(bundle => {
      return bundle.write(writeOptions)
        .then(() => {
          console.log('Done!')
        })
    })
    .then(() => urlPluginDevelopment.write(writeOptions))
    .catch(err => {
      console.log(err);
    });
  }

  const watcher = chokidar.watch('src', {
    ignored: /[\/\\]\./,
    persistent: true
  });

  watcher.on('change', () => {
    generate();
  });

  generate();

  startServer();
}

function dist(config, publicPath) {
  const writeOptions = {
    format: 'iife',
    dest: 'dist/bundle.js'
  };

  const urlPluginProduction = url({
    limit: 20 * 1024, // inline files < 20k, copy files > 20k
    include: [
      '**/*.svg',
      '**/*.png',
      '**/*.jpg',
      '**/*.gif',
      '**/*.json',
    ], // defaults to .svg, .png, .jpg and .gif files
    publicPath: `https://interactives.theprate.com/${publicPath}`,
  });

  return rollup.rollup({
    entry: 'src/entry.js',
    plugins: [
      ...basePlugins(config),
      urlPluginProduction,
      uglify({}, uglifyLib.minify),
      replace({
        ENVIROMENT: JSON.stringify('production'),
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
    ],
    cache: cache
  })
  .then(bundle => {
    return bundle.write(writeOptions)
  })
  .then(() => {
    return urlPluginProduction.write(writeOptions)
  });
}


exports.development = development;
exports.dist = dist;
