var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');

// DB
var mongoskin = require('mongoskin');
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog';

var db = mongoskin.db(dbUrl)
var collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
};

// Web
var session = require('express-session');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'blog-express';

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// add collection object.
app.use(function (req, res, next) {
    if (!collections.articles || !collections.users) {
        return next(new Error('No collections.'));
    }

    req.collections = collections;
    return next();
});

// add Web middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// dev
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Pages and Routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', routes.article.admin);
app.get('/post', routes.article.post);
app.post('/port', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API Routes
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/article/:id', routes.article.edit);
app.del('/api/article/:id', routes.article.del);

app.all('*', function (req, res) {
    res.send(404);
});

// http.createServer(app).listen(app.get('port'), function () {
//     console.log('Express.js server listening on port ' + app.get('port'));
// });

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function () {
        console.log('Express.js server listening on port ' + app.get('port'));
    });
};

var shutdown = function () {
    server.close();
};

if (require.main === module) {
    console.info('Running app...');
    boot();
} else {
    console.info('Running app as a module. port:' + app.get('port'));
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}
