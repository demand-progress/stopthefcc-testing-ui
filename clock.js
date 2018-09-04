let CronJob = require('cron').CronJob;
let worker = require('./worker.js');

let job = new CronJob({
  cronTime: '15 10,11,16,20,22 * * *', // everyday, 9:13, 11:13, 4:13, 8:13,
  onTick: worker.start(),
  start: true,
  timeZone: 'America/Los_Angeles',
});

job.start();
