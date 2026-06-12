'use client';

import { IJob } from '@/models/Job';

interface JobCardProps {
  job: IJob;
  onViewDetails: (job: IJob) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-accent/20 text-accent border-accent';
      case 'CLOSING_SOON':
        return 'bg-secondary/20 text-secondary border-secondary';
      case 'CLOSED':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'EXAM_PHASE':
        return 'bg-primary/20 text-primary border-primary';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted';
    }
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'GATE':
        return 'bg-primary/10 text-primary';
      case 'NON_GATE':
        return 'bg-secondary/10 text-secondary';
      case 'MIXED':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => onViewDetails(job)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary mb-2">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.organization}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
          {job.status === 'CLOSING_SOON' ? '⚠️ ' : job.status === 'OPEN' ? '✓ ' : ''}
          {job.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(job.jobType)}`}>
          {job.jobType === 'GATE' ? '🏆 GATE' : job.jobType === 'NON_GATE' ? '🎓 Non-GATE' : '🎯 Mixed'}
        </span>
        {job.openToNonEngineering && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100/50 text-accent">
            🌍 Non-Engineers Welcome
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs font-semibold">Salary</p>
          <p className="font-bold text-primary">{job.salary}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold">Age Limit</p>
          <p className="font-bold text-primary">{job.ageLimit}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold">Positions</p>
          <p className="font-bold text-primary">{job.numberOfPositions}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold">Deadline</p>
          <p className={`font-bold ${daysUntilDeadline <= 3 ? 'text-destructive' : daysUntilDeadline <= 7 ? 'text-secondary' : 'text-primary'}`}>
            {daysUntilDeadline > 0 ? `${daysUntilDeadline}d left` : 'Expired'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.eligibleBranches.slice(0, 3).map((branch) => (
          <span key={branch} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
            {branch}
          </span>
        ))}
        {job.eligibleBranches.length > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
            +{job.eligibleBranches.length - 3} more
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(job);
        }}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
      >
        View Details & Apply
      </button>
    </div>
  );
}
