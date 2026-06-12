'use client';

import { IJob } from '@/models/Job';
import { useState, useEffect } from 'react';

interface AdminJobFormProps {
  job?: IJob | null;
  onSubmit: (job: IJob) => Promise<void>;
  onCancel: () => void;
}

const BRANCHES = [
  'CSE',
  'ECE',
  'ME',
  'CIVIL',
  'CHEMICAL',
  'PRODUCTION',
  'METALLURGY',
  'MINING',
];

export function AdminJobForm({ job, onSubmit, onCancel }: AdminJobFormProps) {
  const [formData, setFormData] = useState<IJob>({
    title: job?.title || '',
    organization: job?.organization || '',
    organizationFullName: job?.organizationFullName || '',
    category: job?.category || 'PSU',
    jobType: job?.jobType || 'GATE',
    eligibleBranches: job?.eligibleBranches || [],
    openToNonEngineering: job?.openToNonEngineering || false,
    numberOfPositions: job?.numberOfPositions || 0,
    salary: job?.salary || '',
    ageLimit: job?.ageLimit || '',
    eligibility: job?.eligibility || [],
    eligibilityFinalYear: job?.eligibilityFinalYear || false,
    applicationUrl: job?.applicationUrl || '',
    deadline: job?.deadline ? new Date(job.deadline) : new Date(),
    status: job?.status || 'OPEN',
    description: job?.description || '',
    qualification: job?.qualification || '',
    minMarks: job?.minMarks || '',
    selectionProcess: job?.selectionProcess || '',
    bond: job?.bond || '',
    isNewJob: job?.isNewJob || false,
    showPhases: job?.showPhases || false,
  });

  const [notesText, setNotesText] = useState(
    job?.importantNotes ? job.importantNotes.join('\n') : ''
  );

  const [timeline, setTimeline] = useState<any[]>(job?.timeline || []);
  const [newEvent, setNewEvent] = useState({ event: '', date: '', description: '', status: 'UPCOMING' });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newEligibility, setNewEligibility] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPositions' ? parseInt(value) || 0 : value,
    }));
  };

  const handleBranchToggle = (branch: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch],
    }));
  };

  const addEligibility = () => {
    if (newEligibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        eligibility: [...prev.eligibility, newEligibility.trim()],
      }));
      setNewEligibility('');
    }
  };

  const removeEligibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: prev.eligibility.filter((_, i) => i !== index),
    }));
  };

  const addTimelineEvent = () => {
    if (newEvent.event.trim() && newEvent.date.trim()) {
      setTimeline((prev) => [...prev, { ...newEvent }]);
      setNewEvent({ event: '', date: '', description: '', status: 'UPCOMING' });
    }
  };

  const removeTimelineEvent = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.title || !formData.organization || !formData.organizationFullName || !formData.applicationUrl) {
        setError('Please fill all required fields');
        setIsLoading(false);
        return;
      }

      if (formData.eligibleBranches.length === 0) {
        setError('Please select at least one eligible branch');
        setIsLoading(false);
        return;
      }

      if (formData.eligibility.length === 0) {
        setError('Please add at least one eligibility criterion');
        setIsLoading(false);
        return;
      }

      const notes = notesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dl = new Date(formData.deadline);
      dl.setHours(0, 0, 0, 0);
      const computedStatus = today.getTime() <= dl.getTime() ? 'OPEN' : 'CLOSED';

      const finalJobData: IJob = {
        ...formData,
        status: computedStatus,
        importantNotes: notes,
        timeline: timeline,
      };

      if (job?._id) {
        finalJobData._id = job._id;
      }

      await onSubmit(finalJobData);
    } catch (err: any) {
      setError(err.message || 'Error saving job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-border">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Junior Engineer (JE)"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Org Abbreviation *</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            placeholder="e.g., BHEL"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Organization Full Name *</label>
          <input
            type="text"
            name="organizationFullName"
            value={formData.organizationFullName}
            onChange={handleInputChange}
            placeholder="e.g., Bharat Heavy Electricals Ltd"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Job Category, Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Job Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            disabled={isLoading}
          >
            <option value="PSU">PSU</option>
            <option value="CENTRAL">Central Govt</option>
            <option value="DEFENCE">Defence / DRDO / ISRO</option>
            <option value="RAILWAY">Railway</option>
            <option value="STATE">State Govt</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">GATE Requirement</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            disabled={isLoading}
          >
            <option value="GATE">GATE</option>
            <option value="NON_GATE">Non-GATE</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Status</label>
          <div className="w-full px-4 py-2 bg-slate-50 border border-border rounded-lg text-sm font-semibold text-slate-700">
            {formData.deadline && new Date(formData.deadline).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? '🟢 Applications Open' : '🔴 Closed'}
            <span className="text-[10px] font-normal text-muted-foreground block mt-1">(Auto-computed from deadline)</span>
          </div>
        </div>
      </div>

      {/* Salary, Age, Positions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="₹ 40,000 - 1,40,000/mo"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Age Limit</label>
          <input
            type="text"
            name="ageLimit"
            value={formData.ageLimit}
            onChange={handleInputChange}
            placeholder="18-27 yrs (SC/ST +5, OBC +3)"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Number of Positions</label>
          <input
            type="number"
            name="numberOfPositions"
            value={formData.numberOfPositions}
            onChange={handleInputChange}
            placeholder="1200"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Detailed Parameters (Qual, Min Marks, Selection, Bond) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            placeholder="e.g. B.Tech / BE"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Minimum Marks</label>
          <input
            type="text"
            name="minMarks"
            value={formData.minMarks}
            onChange={handleInputChange}
            placeholder="e.g. 60% aggregate"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Selection Process</label>
          <input
            type="text"
            name="selectionProcess"
            value={formData.selectionProcess}
            onChange={handleInputChange}
            placeholder="e.g. GATE Score -> Interview"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Bond Details</label>
          <input
            type="text"
            name="bond"
            value={formData.bond}
            onChange={handleInputChange}
            placeholder="e.g. No bond"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              deadline: new Date(e.target.value),
            }))
          }
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          disabled={isLoading}
        />
      </div>

      {/* Checkboxes: isNewJob, openToNonEngineering, eligibilityFinalYear */}
      <div className="flex flex-col md:flex-row gap-6 bg-muted/40 p-4 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isNewJob}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isNewJob: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded border-border"
            disabled={isLoading}
          />
          <span className="text-sm font-semibold text-primary">Mark as "NEW" Job</span>
        </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showPhases}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  showPhases: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border"
              disabled={isLoading}
            />
            <span className="text-sm font-semibold text-primary">Show Recruitment Phases</span>
          </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.openToNonEngineering}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                openToNonEngineering: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded border-border"
            disabled={isLoading}
          />
          <span className="text-sm font-semibold text-primary">Open to Non-Engineers</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.eligibilityFinalYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                eligibilityFinalYear: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded border-border"
            disabled={isLoading}
          />
          <span className="text-sm font-semibold text-primary">Final Year Students Eligible</span>
        </label>
      </div>

      {/* Eligible Branches */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3">Eligible Branches *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BRANCHES.map((branch) => (
            <label key={branch} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.eligibleBranches.includes(branch)}
                onChange={() => handleBranchToggle(branch)}
                className="w-4 h-4 rounded border-border"
                disabled={isLoading}
              />
              <span className="text-sm">{branch}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Eligibility Criteria (Simple List) */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3">Eligibility Criteria *</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newEligibility}
            onChange={(e) => setNewEligibility(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addEligibility();
              }
            }}
            placeholder="e.g. BE/B.Tech in Mechanical or Electrical"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={addEligibility}
            className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-sm"
            disabled={isLoading}
          >
            Add
          </button>
        </div>

        {formData.eligibility.length > 0 && (
          <div className="space-y-2">
            {formData.eligibility.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/60 p-2.5 rounded-lg text-sm">
                <span>{criterion}</span>
                <button
                  type="button"
                  onClick={() => removeEligibility(index)}
                  className="text-destructive hover:text-destructive/80 font-bold"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recruitment Timeline Editor */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3">Recruitment Timeline</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input
            type="text"
            placeholder="Event (e.g. Written Exam)"
            value={newEvent.event}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, event: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Date (e.g. Aug 2026)"
            value={newEvent.date}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newEvent.description}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <select
              value={newEvent.status}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary flex-1"
              disabled={isLoading}
            >
              <option value="COMPLETED">Completed</option>
              <option value="ACTIVE">Active</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
            <button
              type="button"
              onClick={addTimelineEvent}
              className="px-4 py-1.5 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-sm"
              disabled={isLoading}
            >
              Add
            </button>
          </div>
        </div>

        {timeline.length > 0 && (
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {timeline.map((evt, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted/60 p-2 rounded-lg text-sm">
                <div>
                  <span className="font-semibold text-primary">{evt.event}</span> ({evt.date})
                  {evt.description && <span className="text-muted-foreground text-xs ml-2">- {evt.description}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded ml-2 font-bold ${
                    evt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    evt.status === 'ACTIVE' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{evt.status}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeTimelineEvent(idx)}
                  className="text-destructive font-bold"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Important Notes (One note per line)</label>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Verify all details on official website.&#10;Keep ready: Degree certificate, etc."
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Application URL */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Application URL *</label>
        <input
          type="url"
          name="applicationUrl"
          value={formData.applicationUrl}
          onChange={handleInputChange}
          placeholder="https://example.com/apply"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed job description"
          rows={5}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 pt-6 border-t border-border font-semibold text-sm">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-8 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 border border-border transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
