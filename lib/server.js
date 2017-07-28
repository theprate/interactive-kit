const express = require('express');
const interactiveFrame = require('interactive-frame');
const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('index.hbs');
});

app.get('/interactive-frame', function(req, res) {
  res.send(interactiveFrame('latest')('/bundle/bundle.js'));
});
app.use('/iframe-resizer', express.static(`${require.resolve('iframe-resizer/js').slice(0, -8)}`));
app.use('/bundle', express.static(`${process.cwd()}/dev`));

module.exports = function() {
  app.listen('2334');
  console.log('View at http://localhost:2334');
}
