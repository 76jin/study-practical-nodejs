var jade = require('jade'),
  fs = require('fs');

var data = {
  title: 'Practical Node.js',
  author: {
    twitter: '@azat_co',
    name: 'Azat'
  },
  tags: ['express', 'node', 'javascript']
};
data.body = process.argv[2];

fs.readFile('jadeExample.jade', 'utf8', function (error, source) {
  var template = jade.compile(source)
  var html = template(data)
  console.log(html)
});

//pug.render

// fs.readFile('pug-example.pug', 'utf-8', (error, source) => {
//   const html = pug.render(source, data)
//   console.log(html)
// })

//pug.renderFile

// jade.renderFile('./jade-example.jade', data, (error, html) => {
//   if (err) { console.log(err); return; }

//   console.log(html)
// })
