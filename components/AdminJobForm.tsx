'use client';

import { IJob } from '@/models/Job';
import { useState } from 'react';

interface AdminJobFormProps {
  job?: IJob | null;
  onSubmit: (job: IJob) => Promise<void>;
  onCancel: () => void;
}

const BRANCHES = ['CSE', 'ECE', 'ME', 'CIVIL', 'CHEMICAL', 'PRODUCTION', 'METALLURGY', 'MINING'];

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

  // Date validation state
  const [deadlineRaw, setDeadlineRaw] = useState(
    job?.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
  );
  const [deadlineError, setDeadlineError] = useState('');

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPositions' ? parseInt(value) || 0 : value,
    }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineRaw(e.target.value);
    setDeadlineError('');
  };

  const handleDeadlineBlur = () => {
    if (!deadlineRaw) {
      setDeadlineError('Deadline is required.');
      return;
    }
    const parsed = new Date(deadlineRaw);
    if (isNaN(parsed.getTime())) {
      setDeadlineError('Invalid date. Please enter a valid date (YYYY-MM-DD).');
      return;
    }
    setDeadlineError('');
    setFormData((prev) => ({ ...prev, deadline: parsed }));
  };

  const handleSelectAllBranches = () => {
    const allSelected = BRANCHES.every((b) => formData.eligibleBranches.includes(b));
    setFormData((prev) => ({
      ...prev,
      eligibleBranches: allSelected ? [] : [...BRANCHES],
    }));
    if (fieldErrors.eligibleBranches) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n.eligibleBranches; return n; });
    }
  };

  const handleBranchToggle = (branch: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch],
    }));
    if (fieldErrors.eligibleBranches) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n.eligibleBranches; return n; });
    }
  };

  const addEligibility = () => {
    if (newEligibility.trim()) {
      setFormData((prev) => ({ ...prev, eligibility: [...prev.eligibility, newEligibility.trim()] }));
      setNewEligibility('');
      if (fieldErrors.eligibility) {
        setFieldErrors((prev) => { const n = { ...prev }; delete n.eligibility; return n; });
      }
    }
  };

  const removeEligibility = (index: number) => {
    setFormData((prev) => ({ ...prev, eligibility: prev.eligibility.filter((_, i) => i !== index) }));
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

    // Validate required fields (only title, organization, organizationFullName)
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Job Title is required.';
    if (!formData.organization.trim()) errors.organization = 'Org Abbreviation is required.';
    if (!formData.organizationFullName.trim()) errors.organizationFullName = 'Organization Full Name is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields (marked with *).');
      return;
    }

    setIsLoading(true);
    try {
      const notes = notesText.split('\n').map((l) => l.trim()).filter(Boolean);
      const dl = new Date(deadlineRaw);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dl.setHours(0, 0, 0, 0);
      const computedStatus = today.getTime() <= dl.getTime() ? 'OPEN' : 'CLOSED';

      const finalJobData: IJob = {
        ...formData,
        deadline: dl,
        status: computedStatus,
        importantNotes: notes,
        timeline,
      };
      if (job?._id) finalJobData._id = job._id;
      await onSubmit(finalJobData);
    } catch (err: any) {
      setError(err.message || 'Error saving job');
    } finally {
      setIsLoading(false);
    }
  };

  const allBranchesSelected = BRANCHES.every((b) => formData.eligibleBranches.includes(b));

  const fieldClass = (name: string) =>
    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
      fieldErrors[name]
        ? 'border-red-400 focus:ring-red-400 bg-red-50'
        : 'border-border focus:ring-primary'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-border">
      {/* Global error banner */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm flex items-start gap-2">
          <span className="text-lg leading-none">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Required note */}
      <p className="text-xs text-muted-foreground">
        Fields marked with <span className="text-red-500 font-bold">*</span> are required.
      </p>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Junior Engineer (JE)"
            className={fieldClass('title')}
            disabled={isLoading}
          />
          {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Org Abbreviation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            placeholder="e.g., BHEL"
            className={fieldClass('organization')}
            disabled={isLoading}
          />
          {fieldErrors.organization && <p className="text-red-500 text-xs mt-1">{fieldErrors.organization}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Organization Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="organizationFullName"
            value={formData.organizationFullName}
            onChange={handleInputChange}
            placeholder="e.g., Bharat Heavy Electricals Ltd"
            className={fieldClass('organizationFullName')}
            disabled={isLoading}
          />
          {fieldErrors.organizationFullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.organizationFullName}</p>}
        </div>
      </div>

      {/* Job Category, Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Job Category <span className="text-red-500">*</span>
          </label>
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
            <option value="GENERAL">General</option>
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
            {deadlineRaw && !deadlineError && new Date(deadlineRaw).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)
              ? '🟢 Applications Open'
              : '🔴 Closed'}
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

      {/* Qual, Min Marks, Selection, Bond */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Qualification</label>
          <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange}
            placeholder="e.g. B.Tech / BE"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Minimum Marks</label>
          <input type="text" name="minMarks" value={formData.minMarks} onChange={handleInputChange}
            placeholder="e.g. 60% aggregate"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Selection Process</label>
          <input type="text" name="selectionProcess" value={formData.selectionProcess} onChange={handleInputChange}
            placeholder="e.g. GATE Score -> Interview"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Bond Details</label>
          <input type="text" name="bond" value={formData.bond} onChange={handleInputChange}
            placeholder="e.g. No bond"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading} />
        </div>
      </div>

      {/* Deadline — validate on blur, no crash */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Deadline
        </label>
        <input
          type="date"
          value={deadlineRaw}
          onChange={handleDeadlineChange}
          onBlur={handleDeadlineBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
            deadlineError ? 'border-red-400 focus:ring-red-400 bg-red-50' : 'border-border focus:ring-primary'
          }`}
          disabled={isLoading}
        />
        {deadlineError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠️</span> {deadlineError}
          </p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col md:flex-row gap-6 bg-muted/40 p-4 rounded-lg">
        {[
          { key: 'isNewJob', label: 'Mark as "NEW" Job' },
          { key: 'showPhases', label: 'Show Recruitment Phases' },
          { key: 'openToNonEngineering', label: 'Open to Non-Engineers' },
          { key: 'eligibilityFinalYear', label: 'Final Year Students Eligible' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(formData as any)[key]}
              onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.checked }))}
              className="w-4 h-4 rounded border-border"
              disabled={isLoading}
            />
            <span className="text-sm font-semibold text-primary">{label}</span>
          </label>
        ))}
      </div>

      {/* Eligible Branches with Select All */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-semibold text-primary">
            Eligible Branches
          </label>
          <button
            type="button"
            onClick={handleSelectAllBranches}
            className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all ${
              allBranchesSelected
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-primary border-primary hover:bg-primary/10'
            }`}
            disabled={isLoading}
          >
            {allBranchesSelected ? '✓ All Selected' : 'Select All'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border border-border">
          {BRANCHES.map((branch) => (
            <label
              key={branch}
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                formData.eligibleBranches.includes(branch)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-border text-foreground hover:border-primary/50'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.eligibleBranches.includes(branch)}
                onChange={() => handleBranchToggle(branch)}
                className="w-4 h-4 rounded border-border"
                disabled={isLoading}
              />
              {branch}
            </label>
          ))}
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3">
          Eligibility Criteria
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newEligibility}
            onChange={(e) => setNewEligibility(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEligibility(); } }}
            placeholder="e.g. BE/B.Tech in Mechanical or Electrical"
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
          <button type="button" onClick={addEligibility}
            className="px-6 py-2 rounded-md font-semibold text-sm text-white transition-all duration-150 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 2px 8px rgba(99,102,241,0.4)', minWidth: 80 }}
            disabled={isLoading}>
            Add
          </button>
        </div>

        {formData.eligibility.length > 0 && (
          <div className="space-y-2">
            {formData.eligibility.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/60 p-2.5 rounded-lg text-sm">
                <span>{criterion}</span>
                <button type="button" onClick={() => removeEligibility(index)}
                  className="text-destructive hover:text-destructive/80 font-bold" disabled={isLoading}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recruitment Timeline */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3">Recruitment Timeline</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input type="text" placeholder="Event (e.g. Written Exam)" value={newEvent.event}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, event: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading} />
          <input type="text" placeholder="Date (e.g. Aug 2026)" value={newEvent.date}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading} />
          <input type="text" placeholder="Description (optional)" value={newEvent.description}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
            className="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading} />
          <div className="flex gap-2">
            <select value={newEvent.status}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary flex-1"
              disabled={isLoading}>
              <option value="COMPLETED">Completed</option>
              <option value="ACTIVE">Active</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
            <button type="button" onClick={addTimelineEvent}
              className="px-6 py-1.5 rounded-md font-semibold text-sm text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)', minWidth: 80 }}
              disabled={isLoading}>Add</button>
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
                    'bg-gray-100 text-gray-700'}`}>{evt.status}</span>
                </div>
                <button type="button" onClick={() => removeTimelineEvent(idx)}
                  className="text-destructive font-bold" disabled={isLoading}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Important Notes <span className="text-muted-foreground text-xs font-normal">(One note per line)</span></label>
        <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)}
          placeholder={"Verify all details on official website.\nKeep ready: Degree certificate, etc."}
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          disabled={isLoading} />
      </div>

      {/* Application URL */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">
          Application URL
        </label>
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
        <textarea name="description" value={formData.description} onChange={handleInputChange}
          placeholder="Detailed job description"
          rows={5}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          disabled={isLoading} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md font-bold text-sm text-white transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 50%, #1e3a5f 100%)', boxShadow: '0 4px 14px rgba(30,58,95,0.45)', letterSpacing: '0.3px', minWidth: 160, padding: '12px 40px' }}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>{job ? '✏️ Update Job' : '✚ Create Job'}</>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md font-bold text-sm transition-all duration-150 hover:opacity-80 active:scale-95 disabled:opacity-50 border-2"
          style={{ background: 'transparent', borderColor: '#cbd5e1', color: '#64748b', minWidth: 140, padding: '12px 40px' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          ✕ Cancel
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
