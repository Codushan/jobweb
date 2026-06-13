// Run this script to seed sample job data: node --env-file=.env scripts/seed.js

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
  category: {
    type: String,
    enum: ['PSU', 'CENTRAL', 'DEFENCE', 'RAILWAY', 'STATE', 'GENERAL'],
  },
  jobType: {
    type: String,
    enum: ['GATE', 'NON_GATE', 'MIXED'],
  },
  eligibleBranches: [String],
  openToNonEngineering: Boolean,
  numberOfPositions: Number,
  salary: String,
  ageLimit: String,
  eligibility: [String],
  eligibilityFinalYear: Boolean,
  applicationUrl: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['OPEN', 'CLOSING_SOON', 'CLOSED', 'EXAM_PHASE', 'RESULT', 'INTERVIEW'],
  },
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
      status: {
        type: String,
        enum: ['COMPLETED', 'ACTIVE', 'UPCOMING'],
      },
    },
  ],
  importantNotes: [String],
  isNewJob: Boolean,
  showPhases: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

const notificationSchema = new mongoose.Schema({
  text: String,
  createdAt: Date,
  updatedAt: Date,
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// ─── Synced from live MongoDB Atlas on 2026-06-13 ───────────────────────────
const sampleJobs = [
  {
    title: 'Junior Engineer (JE)',
    organization: 'BHEL',
    organizationFullName: 'Bharat Heavy Electricals Ltd',
    category: 'PSU',
    jobType: 'GATE',
    eligibleBranches: ['ME', 'EE'],
    openToNonEngineering: false,
    numberOfPositions: 1200,
    salary: '₹40,000 - ₹1,40,000/mo',
    ageLimit: '18-27 yrs (SC/ST +5, OBC +3)',
    eligibility: [
      'BE/B.Tech in Mechanical or Electrical Engineering',
      'Minimum 60% aggregate or equivalent CGPA in degree',
      'Valid GATE 2026 scorecard in respective paper',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://careers.bhel.in/',
    deadline: new Date('2026-05-28T00:00:00.000Z'),
    status: 'CLOSED',
    description: 'BHEL is recruiting Junior Engineers across major manufacturing units. GATE 2026 score is mandatory. Selected candidates will be posted across India - Haridwar, Bhopal, Trichy, Ranipet.',
    qualification: 'B.Tech / BE (Relevant Branch)',
    minMarks: '60% aggregate',
    selectionProcess: 'GATE Score -> Document Verification -> Medical',
    bond: 'No bond',
    isNewJob: false,
    showPhases: true,
    timeline: [
      { event: 'Notification Released', date: '12 May 2026', description: 'Official PDF available on bhel.in', status: 'COMPLETED' },
      { event: 'Application Window Open', date: '20 May 2026', description: 'Online applications active', status: 'COMPLETED' },
      { event: 'Application Last Date', date: '15 Jul 2026', description: 'Submit before 11:59 PM', status: 'ACTIVE' },
      { event: 'GATE Score Shortlisting', date: 'Aug 2026', description: 'GATE 2024/2025/2026 scores considered', status: 'UPCOMING' },
      { event: 'Document Verification', date: 'Sep 2026', description: 'At corporate office, New Delhi', status: 'UPCOMING' },
      { event: 'Medical Examination', date: 'Oct 2026', description: 'At BHEL authorized hospitals', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Verify all details on the official organisation website before applying.',
      'Keep ready: Degree certificate, GATE scorecard (if required), ID proof, caste certificate.',
      'Application fee may apply - check official notification.',
      'Age/qualification relaxation for reserved categories as per Govt norms.',
    ],
  },
  {
    title: 'Scientist / Engineer SC',
    organization: 'ISRO',
    organizationFullName: 'Indian Space Research Organisation',
    category: 'DEFENCE',
    jobType: 'NON_GATE',
    eligibleBranches: ['ECE', 'CSE', 'ME'],
    openToNonEngineering: false,
    numberOfPositions: 320,
    salary: '₹56,100 - ₹1,77,500/mo',
    ageLimit: '18-35 yrs (as of last date)',
    eligibility: [
      'BE/B.Tech or equivalent in first class with aggregate minimum of 65% marks',
      'M.Tech students can apply if UG criteria met',
    ],
    eligibilityFinalYear: true,
    applicationUrl: 'https://www.isro.gov.in/Careers.html',
    deadline: new Date('2026-04-12T00:00:00.000Z'),
    status: 'CLOSED',
    description: "ISRO Centralised Recruitment Board (ICRB) is inviting applications for Scientist/Engineer 'SC' posts. Recruitment will be based on a written test followed by interview.",
    qualification: 'B.Tech / BE or equivalent',
    minMarks: '65% aggregate or 6.84 CGPA',
    selectionProcess: 'Written Test -> Personal Interview',
    bond: 'No bond',
    isNewJob: false,
    showPhases: false,
    timeline: [
      { event: 'Notification Released', date: '1 May 2026', description: 'Official notification published', status: 'COMPLETED' },
      { event: 'Application Form Open', date: '10 May 2026', description: 'Online registration started', status: 'COMPLETED' },
      { event: 'Last Date of Registration', date: '30 Jun 2026', description: 'Fees must be paid by this date', status: 'ACTIVE' },
      { event: 'Written Examination', date: 'Aug 2026', description: 'Scheduled in major cities', status: 'UPCOMING' },
      { event: 'Interview Call Letters', date: 'Sep 2026', description: 'Shortlist based on exam cutoffs', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Candidates awaiting final results are eligible to apply.',
      'Written exam pattern: 80 Multiple Choice Questions (MCQ) of 1 mark each.',
    ],
  },
  {
    title: 'Engineer Trainee (ET)',
    organization: 'NTPC',
    organizationFullName: 'National Thermal Power Corporation',
    category: 'PSU',
    jobType: 'GATE',
    eligibleBranches: ['ME', 'EE'],
    openToNonEngineering: false,
    numberOfPositions: 800,
    salary: '₹40,000 - ₹1,40,000/mo + DA',
    ageLimit: 'Max 27 years',
    eligibility: [
      'Full time Bachelor degree in Engineering with not less than 65% marks',
      'GATE 2026 qualification',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://careers.ntpc.co.in/',
    deadline: new Date('2026-05-29T00:00:00.000Z'),
    status: 'CLOSED',
    description: 'NTPC is looking for promising, energetic young engineers for Executive Trainee positions. Training is for 1 year followed by regular placement.',
    qualification: 'Full-time BE / B.Tech',
    minMarks: '65% aggregate (55% for SC/ST/PwBD)',
    selectionProcess: 'GATE score followed by GD and Personal Interview',
    bond: 'Service Agreement Bond of ₹2,50,000',
    isNewJob: false,
    showPhases: true,
    timeline: [
      { event: 'Notification Out', date: '10 Jun 2026', description: 'Detailed advt released', status: 'COMPLETED' },
      { event: 'Online Registration', date: '18 Jun 2026', description: 'Applications start online', status: 'ACTIVE' },
      { event: 'Last Date of Application', date: '30 Jul 2026', description: 'Last day to apply online', status: 'UPCOMING' },
      { event: 'GD & Interview', date: 'Sep 2026', description: 'Conducted at regional headquarters', status: 'UPCOMING' },
    ],
    importantNotes: [
      'SC/ST/PwBD candidates are exempted from registration fees.',
    ],
  },
  {
    title: 'Scientific Officer (OCES/DGFS)',
    organization: 'BARC',
    organizationFullName: 'Bhabha Atomic Research Centre',
    category: 'CENTRAL',
    jobType: 'MIXED',
    eligibleBranches: ['ME', 'CHEMICAL', 'METALLURGY', 'MINING'],
    openToNonEngineering: false,
    numberOfPositions: 220,
    salary: '₹56,100 - ₹1,77,500/mo',
    ageLimit: 'Max 26 years',
    eligibility: [
      'BE/B.Tech/B.Sc (Engg) with minimum 60% aggregate',
      'Selection based on Online Exam OR GATE scorecard',
    ],
    eligibilityFinalYear: true,
    applicationUrl: 'https://barconlineexam.com/',
    deadline: new Date('2026-01-31T00:00:00.000Z'),
    status: 'CLOSED',
    description: 'BARC Training Schools recruit OCES and DGFS Scientific Officers. Highly competitive program for research-oriented engineers.',
    qualification: 'BE / B.Tech / B.Sc (Engg)',
    minMarks: '60% marks',
    selectionProcess: 'Online Test or GATE Score -> Personal Interview',
    bond: '3 Years Service Bond',
    isNewJob: false,
    showPhases: true,
    timeline: [
      { event: 'Advt Published', date: '10 Feb 2026', description: 'National news notification', status: 'COMPLETED' },
      { event: 'Online Exam Slot Booking', date: 'Apr 2026', description: 'Test booking active', status: 'COMPLETED' },
      { event: 'BARC Online Exam', date: '1-10 Jun 2026', description: 'CBT examination across centres', status: 'COMPLETED' },
      { event: 'Interview Shortlists', date: '15 Jun 2026', description: 'Releasing lists on portal', status: 'ACTIVE' },
      { event: 'Personal Interviews', date: 'Jul-Aug 2026', description: 'At BARC Training School, Mumbai', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Candidates shortlisted through GATE do not need to appear for online test.',
    ],
  },
  {
    title: 'Graduate Engineer Trainee',
    organization: 'HPCL',
    organizationFullName: 'Hindustan Petroleum Corporation Ltd',
    category: 'PSU',
    jobType: 'NON_GATE',
    eligibleBranches: ['ME', 'EE', 'CIVIL', 'CHEMICAL'],
    openToNonEngineering: false,
    numberOfPositions: 290,
    salary: '₹50,000 - ₹1,60,000/mo',
    ageLimit: 'Max 25 years',
    eligibility: [
      'Four-year full time Engineering degree with 60% marks',
      'Selection via computer-based test (CBT) conducted by HPCL',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://www.hindustanpetroleum.com/',
    deadline: new Date('2026-06-05T23:59:59.000Z'),
    status: 'CLOSED',
    description: 'HPCL GET recruitment through proprietary examination. High pay package PSU with multiple core discipline posts.',
    qualification: 'Four Year BE / B.Tech',
    minMarks: '60% (50% for SC/ST/PwBD)',
    selectionProcess: 'Computer Based Test -> Group Task -> Personal Interview',
    bond: '4 Years Service Bond (₹1,50,000)',
    isNewJob: false,
    showPhases: false,
    timeline: [
      { event: 'Advt Out', date: '10 Apr 2026', description: 'Notification detailed copy', status: 'COMPLETED' },
      { event: 'Registration Closes', date: '5 Jun 2026', description: 'Closed on official portal', status: 'COMPLETED' },
      { event: 'CBT Exams', date: 'Jul 2026', description: 'To be held online', status: 'UPCOMING' },
    ],
    importantNotes: [
      'No GATE score required. Proprietary syllabus includes General Aptitude and Technical sections.',
    ],
  },
  {
    title: 'Research Associate (Aero)',
    organization: 'DRDO - ADE',
    organizationFullName: 'Aeronautical Development Establishment',
    category: 'DEFENCE',
    jobType: 'NON_GATE',
    eligibleBranches: ['ME', 'ECE'],
    openToNonEngineering: false,
    numberOfPositions: 15,
    salary: '₹54,000/mo',
    ageLimit: 'Max 28 years (General)',
    eligibility: [
      'PhD or equivalent degree in Aeronautical/Mechanical/Electronics OR M.Tech with 3 years research experience',
      'No GATE score required. Selection based on interview.',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://www.drdo.gov.in/',
    deadline: new Date('2026-03-24T00:00:00.000Z'),
    status: 'CLOSED',
    description: 'Aeronautical Development Establishment (ADE) is holding walk-in/scheduled interviews for Research Associates in aerospace development.',
    qualification: 'M.Tech / PhD in engineering',
    minMarks: 'First class in PG',
    selectionProcess: 'Screening -> Interview Board',
    bond: 'No bond',
    isNewJob: false,
    showPhases: false,
    timeline: [
      { event: 'Interview Notification', date: '2 Jun 2026', description: 'ADE advertisement published', status: 'COMPLETED' },
      { event: 'Application Submission Last Date', date: '29 Jun 2026', description: 'Submit via email/post', status: 'ACTIVE' },
      { event: 'Interview Date', date: 'Jul 2026', description: 'Conducted at ADE Bangalore', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Fellowship is initially for a period of two years.',
    ],
  },
  {
    title: 'Deputy Manager (Technical)',
    organization: 'NHAI',
    organizationFullName: 'National Highways Authority of India',
    category: 'CENTRAL',
    jobType: 'GATE',
    eligibleBranches: ['CIVIL'],
    openToNonEngineering: false,
    numberOfPositions: 120,
    salary: '₹15,600 - ₹39,100 + GP 5,400/mo',
    ageLimit: 'Max 30 years',
    eligibility: [
      'Degree in Civil Engineering from recognized university',
      'Valid GATE 2026 score in Civil Engineering paper',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://nhai.gov.in/',
    deadline: new Date('2026-06-01T23:59:59.000Z'),
    status: 'CLOSED',
    description: 'NHAI is recruiting Deputy Managers in Civil engineering through GATE 2026. Permanent jobs under Central Govt.',
    qualification: 'Degree in Civil Engineering',
    minMarks: 'Pass standard in degree',
    selectionProcess: 'GATE Score card selection directly',
    bond: 'Service agreement bond of 2 years',
    isNewJob: false,
    showPhases: false,
    timeline: [
      { event: 'Notification Released', date: '10 Apr 2026', description: 'Detailed notifications on nhai.gov.in', status: 'COMPLETED' },
      { event: 'Application Link Close', date: '1 Jun 2026', description: 'Closed online submissions', status: 'COMPLETED' },
      { event: 'Shortlisted candidates list', date: 'Jul 2026', description: 'Selected list to be published', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Selection is direct based on GATE score; no interviews are scheduled.',
    ],
  },
  {
    title: 'Combined Graduate Level (CGL) 2026',
    organization: 'SSC',
    organizationFullName: 'Staff Selection Commission',
    category: 'GENERAL',
    jobType: 'NON_GATE',
    eligibleBranches: ['CSE', 'ECE', 'ME', 'CIVIL', 'MINING', 'METALLURGY', 'PRODUCTION', 'CHEMICAL'],
    openToNonEngineering: true,
    numberOfPositions: 17000,
    salary: '₹25,500 - ₹1,51,100/mo',
    ageLimit: '18-32 years (varies by post)',
    eligibility: [
      "Bachelor's Degree in any discipline from a recognised university",
      'No engineering degree required — open to all graduates',
      'Selection: Tier-I CBT → Tier-II CBT → Skill Test / Document Verification',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://ssc.gov.in/',
    deadline: new Date('2026-06-22T00:00:00.000Z'),
    status: 'OPEN',
    description: "SSC CGL 2026 is one of the largest central government recruitment exams open to all graduates. Posts include Inspector, Auditor, Tax Assistant, Sub-Inspector (CBI), Statistical Investigator, and more across central ministries and departments.",
    qualification: "Any Bachelor's Degree (Engineering graduates can also apply)",
    minMarks: 'Pass standard in graduation',
    selectionProcess: 'Tier-I CBT → Tier-II CBT → Skill Test / Document Verification',
    bond: 'No bond',
    isNewJob: true,
    showPhases: true,
    timeline: [
      { event: 'Official Notification Released', date: '22 Jun 2026', description: 'SSC CGL 2026 detailed advt on ssc.gov.in', status: 'COMPLETED' },
      { event: 'Online Applications Open', date: '22 Jun 2026', description: 'Registration on ssc.gov.in portal', status: 'ACTIVE' },
      { event: 'Application Last Date', date: '10 Aug 2026', description: 'Submit before 11:59 PM', status: 'UPCOMING' },
      { event: 'Tier-I Exam (CBT)', date: 'Sep–Oct 2026', description: 'Computer-based test across exam centres', status: 'UPCOMING' },
      { event: 'Tier-II Exam (CBT)', date: 'Dec 2026', description: 'For shortlisted candidates from Tier-I', status: 'UPCOMING' },
      { event: 'Skill Test / Document Verification', date: 'Jan–Feb 2027', description: 'Post-specific skill tests and DV', status: 'UPCOMING' },
    ],
    importantNotes: [
      'Open to graduates from any stream — not limited to engineering.',
      'Engineers are eligible and often benefit from technical aptitude in the exam.',
      'Negative marking: 0.50 marks for each wrong answer in Tier-I and Tier-II.',
      'Age relaxation: SC/ST +5 yrs, OBC +3 yrs, PwBD +10 yrs, Ex-Servicemen as per norms.',
      'Over 17,000 vacancies expected across Group B and Group C posts.',
    ],
  },
  {
    title: 'Management Trainee (MT)',
    organization: 'CIL',
    organizationFullName: 'Coal India Limited',
    category: 'PSU',
    jobType: 'NON_GATE',
    eligibleBranches: ['CSE', 'CHEMICAL', 'ECE', 'ME', 'CIVIL', 'MINING', 'METALLURGY', 'PRODUCTION'],
    openToNonEngineering: false,
    numberOfPositions: 660,
    salary: '₹50,000 - ₹1,60,000/mo (E-2 Grade)',
    ageLimit: '30 years',
    eligibility: [
      'BE/B.Tech',
      'Diploma',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://www.coalindia.in/career-cil/jobs-coal-india/',
    deadline: new Date('2026-06-21T00:00:00.000Z'),
    status: 'OPEN',
    description: '',
    qualification: 'BE/B.Tech',
    minMarks: '60%',
    selectionProcess: 'CBT Only',
    bond: 'No Bond',
    isNewJob: true,
    showPhases: false,
    timeline: [],
    importantNotes: [],
  },
  {
    title: 'Assistant Engineer',
    organization: 'GPSC',
    organizationFullName: 'Gujarat Public Service Commission',
    category: 'STATE',
    jobType: 'NON_GATE',
    eligibleBranches: ['CIVIL', 'ME'],
    openToNonEngineering: false,
    numberOfPositions: 26,
    salary: '₹44900-142400/mo',
    ageLimit: '35 yrs',
    eligibility: [
      'BE/B.Tech in Civil or Mechanical',
    ],
    eligibilityFinalYear: false,
    applicationUrl: 'https://gpsc.gujarat.gov.in/dashboard?stage=Advertisement',
    deadline: new Date('2026-06-19T00:00:00.000Z'),
    status: 'OPEN',
    description: `Educational Qualification Possesses:
(i) a bachelor's degree in Engineering (Mechanical) or in Technology (Mechanical) obtained from any of the Universities established or incorporated by or under the Central or State Act in India; or any other educational institution recognized as such or declared to be a deemed university under section 3 of the University Grants Commission Act, 1956; or possess an equivalent qualification recognized as such by the Government,
(ii) the basic knowledge of computer application as prescribed in the Gujarat Civil Services Classification and Recruitment (General) Rules, 1967, and
(iii) the adequate knowledge of Gujarati or Hindi or both.
Age: Maximum up to 35 years. (Age will be calculated as on the last date of receipt of application)
Pay Scale According to 7th pay commission pay matrix Level-08 (Rs.44900-142400/-)`,
    qualification: 'BE/B.Tech',
    minMarks: '',
    selectionProcess: 'Prelims (I & II)->Interview',
    bond: 'No',
    isNewJob: true,
    showPhases: true,
    timeline: [
      { event: 'Part-I (General Studies)', date: '26/07/2026', description: 'Prelims paper 1', status: 'UPCOMING' },
      { event: 'Part-II (Concerned Subject)', date: '30/08/2026', description: 'Prelims Paper 2', status: 'UPCOMING' },
      { event: 'Interview', date: 'Soon to be announced', description: '', status: 'UPCOMING' },
    ],
    importantNotes: [],
  },
];

const sampleNotifications = [
  { text: 'BHEL JE Recruitment 2026 – 1200 Posts Open | Apply before 15 Jul' },
  { text: 'ISRO Scientist/Engineer SC 2026 – Last Date 30 Jun' },
  { text: 'ONGC Graduate Trainee 2026 – Applications Open' },
  { text: 'NTPC Engineer Trainee 2026 – 800 Vacancies | GATE Score Required' },
  { text: 'DRDO Scientist B 2026 – Written Test on 25 Aug 2026' },
  { text: 'BEL Project Engineer 2026 – Apply Before 15 Jul' },
  { text: 'HAL Aerospace Engineer 2026 – Written Test Admit Cards Released' },
  { text: 'SSC CGL 2026 – 17,000+ Posts | All Graduates Eligible | Apply before 10 Aug' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully seeded ${sampleJobs.length} job postings!`);

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    // Insert sample notifications
    await Notification.insertMany(sampleNotifications);
    console.log(`✅ Successfully seeded ${sampleNotifications.length} notifications!`);

    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
