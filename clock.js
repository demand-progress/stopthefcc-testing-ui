let CronJob = require('cron').CronJob;
let worker = require('./worker.js');

let job = new CronJob({
  cronTime: '0 */10 * * * *', // every 10 minutes,
  onTick: worker.start(),
  start: true,
  timeZone: 'America/Los_Angeles',
});

job.start();
