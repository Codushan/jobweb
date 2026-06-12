import mongoose from 'mongoose';

export interface IJob {
  _id?: string;
  title: string;
  organization: string;
  organizationFullName: string;
  category: 'PSU' | 'CENTRAL' | 'DEFENCE' | 'RAILWAY' | 'STATE';
  jobType: 'GATE' | 'NON_GATE' | 'MIXED';
  eligibleBranches: string[];
  openToNonEngineering: boolean;
  numberOfPositions: number;
  salary: string;
  ageLimit: string;
  eligibility: string[];
  eligibilityFinalYear: boolean;
  applicationUrl: string;
  deadline: Date;
  status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'EXAM_PHASE' | 'RESULT' | 'INTERVIEW';
  description: string;
  qualification?: string;
  minMarks?: string;
  selectionProcess?: string;
  bond?: string;
  timeline?: {
    event: string;
    date: string;
    description: string;
    status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
  }[];
  importantNotes?: string[];
  isNewJob?: boolean;
  showPhases?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Please add an organization name'],
      trim: true,
    },
    organizationFullName: {
      type: String,
      required: [true, 'Please add the organization full name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['PSU', 'CENTRAL', 'DEFENCE', 'RAILWAY', 'STATE'],
      required: true,
    },
    jobType: {
      type: String,
      enum: ['GATE', 'NON_GATE', 'MIXED'],
      required: true,
    },
    eligibleBranches: {
      type: [String],
      required: true,
    },
    openToNonEngineering: {
      type: Boolean,
      default: false,
    },
    numberOfPositions: {
      type: Number,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    ageLimit: {
      type: String,
      required: true,
    },
    eligibility: {
      type: [String],
      required: true,
    },
    eligibilityFinalYear: {
      type: Boolean,
      default: false,
    },
    applicationUrl: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSING_SOON', 'CLOSED', 'EXAM_PHASE', 'RESULT', 'INTERVIEW'],
      default: 'OPEN',
    },
    description: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      default: '',
    },
    minMarks: {
      type: String,
      default: '',
    },
    selectionProcess: {
      type: String,
      default: '',
    },
    bond: {
      type: String,
      default: '',
    },
    timeline: {
      type: [
        {
          event: String,
          date: String,
          description: String,
          status: {
            type: String,
            enum: ['COMPLETED', 'ACTIVE', 'UPCOMING'],
            default: 'UPCOMING',
          },
        },
      ],
      default: [],
    },
    importantNotes: {
      type: [String],
      default: [],
    },
    isNewJob: {
      type: Boolean,
      default: false,
    },
    showPhases: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
