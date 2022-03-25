'use strict';

module.exports = function(options) {
  return function customHandler(req, res, next) {
    var ignoreRequest = req.path.startsWith('/api') ||
    req.path == '/' ||
    req.path == '/explorer' ||
    req.path.startsWith('/vendor');
    if (!ignoreRequest) {
      var sessionToken = req.headers.token || req.query.token;
      if (!sessionToken) {
        res.redirect('/');
      } else {
        req.app.models.Session.findOne({
          where: {token: req.headers.token || req.query.token},
        }, (err, session)=>{
          if (session) {
            next();
          } else res.redirect('/');
        });
      }
    } else next();
  };
};
