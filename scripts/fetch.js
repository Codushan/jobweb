// Run this script to fetch existing data from MongoDB: node --env-file=.env scripts/fetch.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your environment');
  process.exit(1);
}

const jobSchema = new mongoose.Schema({
  title: String,
  organization: String,
  organizationFullName: String,
  category: String,
  jobType: String,
  eligibleBranches: [String],
  openToNonEngineering: Boolean,
  numberOfPositions: Number,
  salary: String,
  ageLimit: String,
  eligibility: [String],
  eligibilityFinalYear: Boolean,
  applicationUrl: String,
  deadline: Date,
  status: String,
  description: String,
  qualification: String,
  minMarks: String,
  selectionProcess: String,
  bond: String,
  timeline: [
    {
      event: String,
      date: String,
      description: String,
      status: String,
    },
  ],
  importantNotes: [String],
  isNewJob: Boolean,
  showPhases: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const notificationSchema = new mongoose.Schema({
  text: String,
  createdAt: Date,
  updatedAt: Date,
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

async function fetchData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // --- Fetch Jobs ---
    const jobs = await Job.find({}).lean();
    console.log(`📋 Found ${jobs.length} job(s) in the database:\n`);
    console.log('='.repeat(60));

    jobs.forEach((job, i) => {
      console.log(`\n[${i + 1}] ${job.title} — ${job.organization}`);
      console.log(`    Full Name  : ${job.organizationFullName}`);
      console.log(`    Category   : ${job.category}`);
      console.log(`    Job Type   : ${job.jobType}`);
      console.log(`    Status     : ${job.status}`);
      console.log(`    Positions  : ${job.numberOfPositions}`);
      console.log(`    Salary     : ${job.salary}`);
      console.log(`    Deadline   : ${job.deadline ? new Date(job.deadline).toDateString() : 'N/A'}`);
      console.log(`    Branches   : ${job.eligibleBranches?.join(', ') || 'All'}`);
      console.log(`    Apply URL  : ${job.applicationUrl}`);
      console.log(`    ID         : ${job._id}`);
    });

    console.log('\n' + '='.repeat(60));

    // --- Fetch Notifications ---
    const notifications = await Notification.find({}).lean();
    console.log(`\n🔔 Found ${notifications.length} notification(s):\n`);
    notifications.forEach((n, i) => {
      console.log(`  [${i + 1}] ${n.text}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log(`\nSummary: ${jobs.length} jobs, ${notifications.length} notifications found on server.`);

    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB.');
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  }
}

fetchData();
