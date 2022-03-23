'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/ping', server.loopback.status());
  router.get('/', (req, res) => {
    res.render('index', {title: 'Hey', message: 'Hello there!'});
  });
  server.use(router);
};
