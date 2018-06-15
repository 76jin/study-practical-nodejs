exports.list = function (req, res) {
    res.send('respond with a resource.');
};

exports.login = function (req, res) {
    res.render('login');
};

exports.logout = function (req, res) {
    res.redirect('/');
};

exports.authenticate = function (req, res) {
    res.redirect('/admin');
};
