'use client';

import { IJob } from '@/models/Job';
import { useEffect } from 'react';

interface JobDetailModalProps {
  job: IJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const getDaysLeftText = (deadlineStr: Date | string) => {
    const today = new Date();
    const dl = new Date(deadlineStr);
    today.setHours(0, 0, 0, 0);
    dl.setHours(0, 0, 0, 0);
    const diffTime = dl.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Ends today';
    } else {
      return `${diffDays} days left`;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSING_SOON':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXAM_PHASE':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      OPEN: 'Applications Open',
      CLOSING_SOON: 'Closing Soon',
      EXAM_PHASE: 'Exam Scheduled',
      CLOSED: 'Closed',
    };
    return labels[status.toUpperCase()] || status;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#1a3a6b] text-white p-6 flex items-start justify-between rounded-t-lg sticky top-0 z-10">
          <div>
            <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">
              {job.organization} – {job.organizationFullName}
            </p>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900 text-white font-bold">
                {job.jobType === 'GATE' ? 'GATE REQUIRED' : job.jobType === 'NON_GATE' ? 'NON-GATE' : 'MIXED'}
              </span>
              {job.category && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-bold">
                  {job.category}
                </span>
              )}
              {job.isNewJob && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500 text-white font-bold">
                  NEW
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getStatusClass(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Vacancies</p>
              <p className="font-bold text-slate-800">{job.numberOfPositions.toLocaleString()} Posts</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Salary</p>
              <p className="font-bold text-green-700">{job.salary}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Age Limit</p>
              <p className="font-bold text-slate-800">{job.ageLimit}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Deadline</p>
              <p className="font-bold text-slate-800">
                {new Date(job.deadline).toLocaleDateString()} ({getDaysLeftText(job.deadline)})
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Qualification</p>
              <p className="font-bold text-slate-800">{job.qualification || 'B.Tech / BE'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Min Marks</p>
              <p className="font-bold text-slate-800">{job.minMarks || 'Pass aggregate'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Selection Process</p>
              <p className="font-bold text-slate-800">{job.selectionProcess || 'Written Exam / Interview'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Bond</p>
              <p className="font-bold text-slate-800">{job.bond || 'No bond'}</p>
            </div>
          </div>

          {/* Timeline */}
          {job.timeline && job.timeline.length > 0 && (
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-3">Recruitment Timeline</h3>
              
              {job.timeline.some((t) => t.status === 'ACTIVE') && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 text-amber-800 text-xs">
                  <span className="font-bold block">⚡ Current Stage: {job.timeline.find((t) => t.status === 'ACTIVE')?.event}</span>
                  <span className="block mt-1 text-slate-600">
                    {job.timeline.find((t) => t.status === 'ACTIVE')?.description || 'Application submission window open'}
                  </span>
                </div>
              )}

              <div className="relative pl-6 ml-1 border-l-2 border-slate-200 space-y-4">
                {job.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center z-10 ${
                      item.status === 'COMPLETED' ? 'border-green-600 bg-green-600 text-white text-[9px] font-bold' :
                      item.status === 'ACTIVE' ? 'border-orange-500 border-4' : 'border-slate-300 bg-slate-300'
                    }`}>
                      {item.status === 'COMPLETED' && '✓'}
                    </span>
                    <div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-bold text-slate-800">{item.event}</span>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                      {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility At A Glance */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-3">Eligibility At A Glance</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">GATE Required?</label>
                <span className={`font-bold ${job.jobType === 'GATE' ? 'text-green-700' : 'text-slate-700'}`}>
                  {job.jobType === 'GATE' ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Final Year Students?</label>
                <span className={`font-bold ${job.eligibilityFinalYear ? 'text-green-700' : 'text-red-600'}`}>
                  {job.eligibilityFinalYear ? 'Yes - Eligible' : 'No - Degree Required'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Non-Engineering?</label>
                <span className={`font-bold ${job.openToNonEngineering ? 'text-green-700' : 'text-red-600'}`}>
                  {job.openToNonEngineering ? 'Yes - Open' : 'No - Engineering Only'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Applicable Branches</label>
                <span className="font-bold text-slate-800">{job.eligibleBranches.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-2">About This Position</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Notes */}
          {job.importantNotes && job.importantNotes.length > 0 && (
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-2">Important Notes</h3>
              <ul className="space-y-2 pl-1">
                {job.importantNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                    <span className="text-[#1976d2] font-bold">▸</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex gap-2 justify-end bg-slate-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 font-bold transition-colors text-xs"
          >
            Close
          </button>
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-[#e07b00] hover:bg-[#c56b00] text-white rounded-lg font-bold transition-colors text-xs uppercase"
          >
            Apply On Official Website →
          </a>
        </div>
      </div>
    </div>
  );
}
