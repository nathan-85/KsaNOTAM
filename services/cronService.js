const cron = require('node-cron');
const notamService = require('./notamService');

class CronService {
  constructor() {
    this.jobs = [];
  }

  setupCronJobs() {
    console.log('Setting up cron jobs for NOTAM updates...');

    // Update NOTAMs every 6 hours
    const notamUpdateJob = cron.schedule('0 */6 * * *', async () => {
      console.log('Running scheduled NOTAM update...');
      try {
        await notamService.refreshNotamData();
        console.log('Scheduled NOTAM update completed successfully');
      } catch (error) {
        console.error('Error in scheduled NOTAM update:', error);
      }
    }, {
      scheduled: false
    });

    // Clean up expired NOTAMs daily at 2 AM
    const cleanupJob = cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled NOTAM cleanup...');
      try {
        await this.cleanupExpiredNOTAMs();
        console.log('Scheduled NOTAM cleanup completed successfully');
      } catch (error) {
        console.error('Error in scheduled NOTAM cleanup:', error);
      }
    }, {
      scheduled: false
    });

    // Cache refresh every 2 hours
    const cacheRefreshJob = cron.schedule('0 */2 * * *', async () => {
      console.log('Running scheduled cache refresh...');
      try {
        await this.refreshCache();
        console.log('Scheduled cache refresh completed successfully');
      } catch (error) {
        console.error('Error in scheduled cache refresh:', error);
      }
    }, {
      scheduled: false
    });

    this.jobs = [notamUpdateJob, cleanupJob, cacheRefreshJob];

    // Start all jobs
    this.jobs.forEach(job => job.start());

    console.log('Cron jobs setup completed');
  }

  async cleanupExpiredNOTAMs() {
    try {
      const currentDate = new Date();
      const notams = await notamService.getKSANotams();
      
      const activeNotams = notams.notams.filter(notam => {
        const endDate = new Date(notam.endDate);
        return endDate > currentDate;
      });

      // Update the service with only active NOTAMs
      notamService.notamData = activeNotams;
      await notamService.saveToCache();

      console.log(`Cleaned up ${notams.notams.length - activeNotams.length} expired NOTAMs`);
    } catch (error) {
      console.error('Error cleaning up expired NOTAMs:', error);
      throw error;
    }
  }

  async refreshCache() {
    try {
      // This would refresh any additional caches or perform maintenance
      console.log('Cache refresh completed');
    } catch (error) {
      console.error('Error refreshing cache:', error);
      throw error;
    }
  }

  stopAllJobs() {
    this.jobs.forEach(job => job.stop());
    console.log('All cron jobs stopped');
  }

  getJobStatus() {
    return this.jobs.map((job, index) => ({
      id: index,
      running: job.running,
      nextRun: job.nextDate().toISOString()
    }));
  }
}

module.exports = new CronService();