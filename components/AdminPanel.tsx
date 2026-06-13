'use client';

import { useState, useEffect } from 'react';
import { IJob } from '@/models/Job';
import { AdminJobForm } from './AdminJobForm';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const isJobOpen = (deadlineStr: Date | string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dl = new Date(deadlineStr);
    dl.setHours(0, 0, 0, 0);
    return today.getTime() <= dl.getTime();
  };

  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Ticker notifications state
  const [activeTab, setActiveTab] = useState<'jobs' | 'ticker'>('jobs');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotifText, setNewNotifText] = useState('');
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchNotifications();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error loading jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsNotifLoading(true);
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error loading notifications');
    } finally {
      setIsNotifLoading(false);
    }
  };

  const handleCreateJob = async (job: IJob) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create job');
      }

      await fetchJobs();
      setIsFormOpen(false);
      setSelectedJob(null);
    } catch (err: any) {
      setError(err.message || 'Error creating job');
    }
  };

  const handleUpdateJob = async (job: IJob) => {
    if (!job._id) return;

    try {
      const response = await fetch(`/api/jobs?id=${job._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update job');
      }

      await fetchJobs();
      setIsFormOpen(false);
      setSelectedJob(null);
    } catch (err: any) {
      setError(err.message || 'Error updating job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs?id=${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete job');

      await fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Error deleting job');
    }
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifText.trim()) return;

    try {
      setIsNotifLoading(true);
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNotifText.trim() }),
      });

      if (!response.ok) throw new Error('Failed to add notification');

      setNewNotifText('');
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message || 'Error adding notification');
    } finally {
      setIsNotifLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      setIsNotifLoading(true);
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      await fetchNotifications();
    } catch (err: any) {
      setError(err.message || 'Error deleting notification');
    } finally {
      setIsNotifLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organizationFullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`
        header > div {
          max-width: 1280px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          width: 100% !important;
        }
        main {
          max-width: 1280px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          width: 100% !important;
        }
      `}</style>
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-blue-200">EngineerNaukri Portal</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition-colors text-sm"
            style={{ padding: '10px 24px' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg flex justify-between items-center text-sm">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-destructive hover:text-destructive/80 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab switcher */}
        <div className="admin-tabs-container">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`admin-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            📋 Manage Jobs
          </button>
          <button
            onClick={() => setActiveTab('ticker')}
            className={`admin-tab-btn ${activeTab === 'ticker' ? 'active' : ''}`}
          >
            📢 Edit Notifications
          </button>
        </div>

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            {/* Actions Bar */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs by title or organization..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedJob(null);
                  setIsFormOpen(true);
                }}
                className="w-full sm:w-auto rounded-md font-bold text-sm text-white whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)', boxShadow: '0 3px 12px rgba(30,58,95,0.4)', letterSpacing: '0.2px', minWidth: 150, padding: '10px 28px' }}
              >
                ＋ Add New Job
              </button>
            </div>

            {/* Form Section */}
            {isFormOpen && (
              <div className="mb-8">
                <AdminJobForm
                  job={selectedJob}
                  onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedJob(null);
                  }}
                />
              </div>
            )}

            {/* Jobs Table */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-border shadow-sm">
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'No jobs found matching your search.' : 'No jobs created yet.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      setIsFormOpen(true);
                    }}
                    className="mt-4 rounded-md font-bold text-sm text-white transition-all duration-150 hover:opacity-90 active:scale-95 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)', boxShadow: '0 3px 12px rgba(30,58,95,0.4)', padding: '10px 32px' }}
                  >
                    ＋ Create First Job
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-full overflow-x-auto bg-white rounded-lg border border-border shadow-sm" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full border-collapse" style={{ minWidth: 700 }}>
                  <thead className="bg-slate-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">GATE Req.</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, index) => (
                      <tr key={job._id} className={`border-b border-border hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                            {job.isNewJob && (
                              <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-primary text-sm">{job.organization}</p>
                          <p className="text-xs text-muted-foreground">{job.organizationFullName}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-700">
                          {job.category}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.jobType === 'GATE' ? 'bg-blue-100 text-blue-800' :
                              job.jobType === 'NON_GATE' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isJobOpen(job.deadline) ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-green-100 text-green-800">
                              Open
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-100 text-red-800">
                              Closed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-muted-foreground font-semibold">
                            {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedJob(job);
                                setIsFormOpen(true);
                              }}
                              className="rounded-md text-xs font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', boxShadow: '0 2px 6px rgba(37,99,235,0.35)', minWidth: 56, padding: '7px 14px' }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => job._id && handleDeleteJob(job._id)}
                              className="rounded-md text-xs font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 2px 6px rgba(220,38,38,0.35)', minWidth: 64, padding: '7px 14px' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TICKER TAB */}
        {activeTab === 'ticker' && (
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              📢 Manage Notification Ticker
            </h3>

            {/* Form to create notification */}
            <form onSubmit={handleAddNotification} className="mb-6 flex gap-2">
              <input
                type="text"
                value={newNotifText}
                onChange={(e) => setNewNotifText(e.target.value)}
                placeholder="Type new notification text (e.g. BHEL JE Recruitment 2026 – 1200 Posts Open)"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                disabled={isNotifLoading}
              />
              <button
                type="submit"
                className="rounded-md font-bold text-sm text-white whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)', boxShadow: '0 3px 12px rgba(30,58,95,0.4)', minWidth: 160, padding: '10px 28px' }}
                disabled={isNotifLoading}
              >
                ＋ Add Ticker Info
              </button>
            </form>

            {/* List notifications */}
            {isNotifLoading ? (
              <p className="text-muted-foreground text-center py-4 text-sm">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground text-sm">No ticker notifications created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="flex items-center justify-between border border-border bg-slate-50/50 p-4 rounded-lg text-sm transition-all hover:bg-slate-50"
                  >
                    <span className="font-semibold text-slate-800">{notif.text}</span>
                    <button
                      onClick={() => handleDeleteNotification(notif._id)}
                      className="rounded-md text-xs font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 2px 6px rgba(220,38,38,0.3)', padding: '7px 14px' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
