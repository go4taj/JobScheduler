/* eslint-disable max-len */
'use strict';
const later = require('@breejs/later');
const constants = require('../constants.json');
const retryCount = parseInt(process.env.RETRY_COUNT) || 1;

module.exports = function queseProcessor(server) {
  var schedPeriod = later.parse.text('every 1 minutes');
  later.setInterval(onTick, schedPeriod);

  function onTick() {
    server.models.jobs.findOne({
      where: {
        status: {
          inq: [constants.STATUS.FAILED, constants.STATUS.IN_PROCESS],
        },
        retries: {lt: retryCount},
      },
      order: 'id asc',
    }, (err, jobInProgress)=>{
      if (!jobInProgress || jobInProgress.status === constants.STATUS.FAILED) {
        server.models.jobs.findOne({
          where: {
            status: {
              inq: [constants.STATUS.FAILED, constants.STATUS.IN_QUEUE],
            },
            retries: {lt: retryCount},
          },
          order: 'id asc',
        }, (err, job)=>{
          if (job) {
            if (job.status === constants.STATUS.FAILED) {
              job.retries++;
            }
            job.status = constants.STATUS.IN_PROCESS;
            job.updatedAt = new Date();
            job.save((err, saved)=>{
              setTimeout(()=>{
                try {
                  if (saved.info.throwError) {
                    throw new Error('Invalid processing');
                  }
                  saved.status = constants.STATUS.COMPLETE;
                  saved.updatedAt = new Date();
                  saved.save();
                } catch (error) {
                  saved.updatedAt = new Date();
                  saved.error = error.message;
                  saved.status = constants.STATUS.FAILED;
                  saved.save();
                }
              }, 5000);
            });
          }
        });
      }
    });
  }
};
