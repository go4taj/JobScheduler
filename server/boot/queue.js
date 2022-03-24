'use strict';
const later = require('@breejs/later');
const constants = require('../constants.json');

module.exports = function queseProcessor(server) {
  var schedPeriod = later.parse.text('every 1 minutes');
  later.setInterval(onTick, schedPeriod);

  function onTick() {
    server.models.jobs.findOne({
      where: {status: constants.STATUS.IN_QUEUE},
      order: 'id asc',
    }, (err, job)=>{
      if (job) {
        job.status = constants.STATUS.IN_PROCESS;
        job.save((err, saved)=>{
          setTimeout(()=>{
            try {
              if (saved.info.throwError) {
                throw new Error('Invalid processing');
              }
              saved.status = constants.STATUS.COMPLETE;
              saved.save();
            } catch (error) {
              saved.error = error.message;
              saved.status = constants.STATUS.FAILED;
              saved.save();
            }
          }, 5000);
        });
      }
    });
  }
};
