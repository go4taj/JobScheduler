'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/ping', server.loopback.status());
  router.get('/', (req, res) => {
    res.render('index', {title: 'Login'});
  });
  router.get('/dashboard', (req, res) => {
    req.app.models.jobs.find({}, (err, jobs)=>{
      res.render('screens/dashboard', {title: 'Dashboard', jobs});
    });
  });
  server.use(router);
};
