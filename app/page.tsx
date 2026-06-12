'use client';

import { useEffect, useState } from 'react';
import type { IJob } from '@/models/Job';
import { AdBanner } from '@/components/AdBanner';

export default function Home() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [notifications, setNotifications] = useState<{ text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');

  // Filter state
  const [fGate, setFGate] = useState('all');
  const [fBranch, setFBranch] = useState('all');
  const [fType, setFType] = useState('all'); // category
  const [fStatus, setFStatus] = useState('all');
  const [fCandidates, setFCandidates] = useState('all');
  const [fSearch, setFSearch] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, fGate, fBranch, fType, fStatus, fCandidates, fSearch, sortBy]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const isJobOpen = (deadlineStr: Date | string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dl = new Date(deadlineStr);
    dl.setHours(0, 0, 0, 0);
    return today.getTime() <= dl.getTime();
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Filter by GATE requirement
    if (fGate !== 'all') {
      filtered = filtered.filter((job) => job.jobType === fGate);
    }

    // Filter by branch
    if (fBranch !== 'all') {
      filtered = filtered.filter((job) => job.eligibleBranches.includes(fBranch));
    }

    // Filter by Category
    if (fType !== 'all') {
      filtered = filtered.filter((job) => job.category === fType);
    }

    // Filter by status (dynamically computed)
    if (fStatus !== 'all') {
      filtered = filtered.filter((job) => {
        const open = isJobOpen(job.deadline);
        return fStatus === 'OPEN' ? open : !open;
      });
    }

    // Filter by candidates
    if (fCandidates === 'final_year') {
      filtered = filtered.filter((job) => job.eligibilityFinalYear === true);
    } else if (fCandidates === 'non_engg') {
      filtered = filtered.filter((job) => job.openToNonEngineering === true);
    }

    // Search
    if (fSearch.trim()) {
      const search = fSearch.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search) ||
          job.organization.toLowerCase().includes(search) ||
          job.organizationFullName.toLowerCase().includes(search)
      );
    }

    // Sort — open jobs always on top, closed always at bottom
    filtered.sort((a, b) => {
      const aOpen = isJobOpen(a.deadline);
      const bOpen = isJobOpen(b.deadline);

      // Closed jobs always sink to bottom
      if (aOpen !== bOpen) return aOpen ? -1 : 1;

      // Within open jobs: respect secondary sort
      if (aOpen) {
        if (sortBy === 'salary') {
          const aNum = parseInt(b.salary.replace(/\D/g, '')) || 0;
          const bNum = parseInt(a.salary.replace(/\D/g, '')) || 0;
          return aNum - bNum;
        } else if (sortBy === 'vacancies') {
          return b.numberOfPositions - a.numberOfPositions;
        } else if (sortBy === 'new') {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        } else {
          // deadline (default): soonest deadline first so users see urgent jobs first
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
      }

      // Within closed jobs: latest deadline first
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });

    setFilteredJobs(filtered);
  };

  const resetFilters = () => {
    setFGate('all');
    setFBranch('all');
    setFType('all');
    setFStatus('all');
    setFCandidates('all');
    setFSearch('');
    setSortBy('new');
  };

  const openJobDetail = (job: IJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      PSU: 'PSU',
      CENTRAL: 'Central Govt',
      DEFENCE: 'Defence / DRDO / ISRO',
      RAILWAY: 'Railway',
      STATE: 'State Govt',
    };
    return labels[cat.toUpperCase()] || cat;
  };

  const getDeadlineClass = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'dl-over';
    if (daysLeft < 7) return 'dl-urgent';
    if (daysLeft < 15) return 'dl-soon';
    return 'dl-ok';
  };

  const formatDeadlineDayMonth = (deadlineStr: string) => {
    const d = new Date(deadlineStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]}`;
  };

  const formatDeadlineFull = (deadlineStr: string) => {
    const d = new Date(deadlineStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = d.getFullYear();
    return `${day} ${months[d.getMonth()]} ${year}`;
  };

  const getDaysLeftText = (deadlineStr: string) => {
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

  // We want to make sure the scroll track is wide enough to fill the container and repeat seamlessly
  const getRepeatedNotifications = () => {
    if (notifications.length === 0) return [];
    let repeated = [...notifications];
    // Keep appending the notifications array until it has at least 8 items
    // to ensure sufficient width for seamless infinite marquee scroll
    while (repeated.length < 8) {
      repeated = [...repeated, ...notifications];
    }
    return repeated;
  };

  const repeatedNotifs = getRepeatedNotifications();
  // We compute a dynamic duration based on length to keep scroll speed constant and slow.
  // 15 seconds per notification item in the repeated list gives a very steady, slow pace.
  const tickerDuration = Math.max(repeatedNotifs.length * 15, 90);

  const getLastUpdatedText = () => {
    let latestDate: Date | null = null;

    jobs.forEach((job) => {
      if (job.updatedAt) {
        const d = new Date(job.updatedAt);
        if (!isNaN(d.getTime())) {
          if (!latestDate || d > latestDate) latestDate = d;
        }
      }
      if (job.createdAt) {
        const d = new Date(job.createdAt);
        if (!isNaN(d.getTime())) {
          if (!latestDate || d > latestDate) latestDate = d;
        }
      }
    });

    notifications.forEach((notif) => {
      if (notif.updatedAt) {
        const d = new Date(notif.updatedAt);
        if (!isNaN(d.getTime())) {
          if (!latestDate || d > latestDate) latestDate = d;
        }
      }
      if (notif.createdAt) {
        const d = new Date(notif.createdAt);
        if (!isNaN(d.getTime())) {
          if (!latestDate || d > latestDate) latestDate = d;
        }
      }
    });

    // Fallback: if no date is found, use current date
    const targetDate = latestDate || new Date();
    
    const day = targetDate.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[targetDate.getMonth()];
    const year = targetDate.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <style>{`
        :root {
          --navy: #1a3a6b;
          --navy-dark: #0d2147;
          --saffron: #e07b00;
          --saffron-light: #f59e2f;
          --green: #1a7a3c;
          --sky: #1976d2;
          --sky-light: #e8f0fb;
          --bg: #f5f7fa;
          --white: #fff;
          --text: #1a1a2e;
          --muted: #5c6785;
          --border: #d0d8e8;
          --red: #c13b2e;
          --shadow: 0 2px 12px rgba(26,58,107,0.09);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Hind', 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; -ms-overflow-style: none; scrollbar-width: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, ::-webkit-scrollbar { display: none !important; }
        
        header { background: var(--navy-dark); border-bottom: 4px solid var(--saffron); position: sticky; top: 0; z-index: 200; }
        .hdr-top { background: var(--navy); padding: 5px 0; font-size: 11px; color: #a8bbdd; text-align: center; }
        .hdr-main { max-width: 1280px; margin: 0 auto; padding: 8px 16px; display: flex; align-items: center; gap: 12px; }
        .logo-circle { width: 46px; height: 46px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .logo-text h1 { font-family: 'Baloo 2', sans-serif; font-size: 20px; font-weight: 800; color: #fff; line-height: 1.1; margin: 0; }
        .logo-text p { font-size: 10px; color: #a8bbdd; margin: 0; }
        .hdr-nav { margin-left: auto; display: flex; gap: 2px; }
        .hdr-nav a { color: #c8d8f0; text-decoration: none; font-size: 12px; padding: 5px 10px; border-radius: 5px; transition: background 0.2s; }
        .hdr-nav a:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
        
        .hero-ticker {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          border-radius: 30px;
          padding: 8px 16px;
          max-width: 800px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        .hero-ticker-lbl {
          background: var(--saffron);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .hero-ticker-scroll {
          overflow: hidden;
          flex: 1;
          display: flex;
          position: relative;
        }
        .hero-ticker-track {
          display: flex;
          width: max-content;
          animation: scrollTxt 80s linear infinite;
        }
        .hero-ticker-track:hover {
          animation-play-state: paused;
        }
        .hero-ticker-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .hero-ticker-text {
          font-size: 12px;
          color: #e2e8f0;
        }
        .ticker-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .ticker-link:hover {
          color: var(--saffron-light) !important;
          text-decoration: underline !important;
        }
        .ticker-bullet {
          color: var(--saffron-light);
          margin: 0 12px;
        }
        @keyframes scrollTxt {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        
        .hero { background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, #1a4a8a 100%); padding: 28px 16px 22px; position: relative; overflow: hidden; }
        .hero::after { content: ''; position: absolute; bottom: -40px; left: 10%; width: 200px; height: 200px; border-radius: 50%; background: rgba(224, 123, 0, 0.07); }
        .hero-inner { max-width: 1280px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); color: #c8e0ff; font-size: 11px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; font-weight: 500; }
        .hero-badge span { width: 6px; height: 6px; background: #4cfa8e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .hero h2 { font-family: 'Baloo 2', sans-serif; font-size: 30px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 8px; }
        .hero h2 em { color: var(--saffron-light); font-style: normal; }
        .hero p { color: #a8c4e8; font-size: 13px; max-width: 560px; margin: 0 auto 18px; }
        .hero-stats { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
        .hero-stats .num { font-family: 'Baloo 2', sans-serif; font-size: 26px; font-weight: 800; color: #fff; line-height: 1; }
        .hero-stat .lbl { font-size: 11px; color: #7a9dc8; margin-top: 1px; }
        
        .filter-bar { background: var(--white); border-bottom: 2px solid var(--border); padding: 10px 16px; position: sticky; top: 88px; z-index: 190; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06); }
        .filter-row { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .filter-row select, .filter-row input[type='text'] { padding: 6px 10px; border: 1.5px solid var(--border); border-radius: 7px; font-family: 'Hind', sans-serif; font-size: 12px; color: var(--text); background: var(--white); outline: none; cursor: pointer; flex-shrink: 0; height: 34px; transition: border-color 0.2s; }
        .filter-row select:focus, .filter-row input:focus { border-color: var(--sky); }
        .btn-go { background: var(--navy); color: #fff; border: none; padding: 0 16px; height: 34px; border-radius: 7px; font-family: 'Hind', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0; white-space: nowrap; transition: background 0.2s; }
        .btn-go:hover { background: var(--navy-dark); }
        .btn-rst { background: none; color: var(--muted); border: 1.5px solid var(--border); padding: 0 12px; height: 34px; border-radius: 7px; font-size: 12px; font-family: 'Hind', sans-serif; cursor: pointer; flex-shrink: 0; transition: all 0.2s; }
        .btn-rst:hover { border-color: var(--sky); color: var(--sky); }
        .job-count-badge { background: var(--sky-light); color: var(--sky); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        
        .wrap { max-width: 1280px; margin: 0 auto; padding: 20px 16px 60px; display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: start; }
        .sidebar { position: sticky; top: 160px; }
        .sb-card { background: var(--white); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 14px; overflow: hidden; box-shadow: var(--shadow); }
        .sb-head { background: var(--navy); color: #fff; font-size: 12px; font-weight: 700; padding: 8px 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .sb-list { list-style: none; }
        .sb-list li { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--bg); font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .sb-list li:hover { background: var(--sky-light); color: var(--sky); }
        .sb-list li.active-cat { background-color: #1a3a6b; color: #fff; font-weight: bold; }
        .sb-list li.active-cat .cnt-badge { background: #white; color: var(--navy); background-color: #fff; }
        .sb-list li:last-child { border-bottom: none; }
        .cnt-badge { background: var(--sky-light); color: var(--sky); font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 20px; }
        .sb-notice { background: #fff8ed; border: 1px solid #fcd794; border-radius: 10px; padding: 10px 12px; font-size: 11px; color: #7a4800; line-height: 1.5; margin: 0 0 14px; }
        .sb-notice strong { color: #c45e00; display: block; margin-bottom: 3px; }
        
        .jobs-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .jobs-hdr h2 { font-family: 'Baloo 2', sans-serif; font-size: 18px; font-weight: 700; color: var(--navy); margin: 0; }
        .sort-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
        .sort-row select { padding: 5px 8px; border: 1px solid var(--border); border-radius: 5px; font-size: 12px; font-family: 'Hind', sans-serif; cursor: pointer; background: var(--white); outline: none; }
        
        .job-table { width: 100%; border-collapse: collapse; background: var(--white); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); margin-bottom: 20px; }
        .job-table thead tr { background: var(--navy); }
        .job-table thead th { color: #fff; font-size: 11px; font-weight: 700; padding: 8px 14px 8px 6px; text-align: left; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
        .job-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .job-table tbody tr:hover { background: #f0f5ff; }
        .job-table tbody tr:nth-child(even) { background: #fafbfd; }
        .job-table td { padding: 8px 14px 8px 6px; font-size: 12px; vertical-align: middle; }
        .org-name { font-weight: 700; color: var(--navy); font-size: 13px; }
        .org-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
        .post-name { font-weight: 700; color: var(--text); font-size: 13px; }
        .td-org { width: 150px; min-width: 150px; }
        .td-post { width: 180px; min-width: 180px; position: relative; }
        .td-tags { width: 300px; min-width: 300px; }
        .td-salary { color: var(--green); font-weight: 700; font-size: 13px; width: 110px; min-width: 110px; }
        .td-status { width: 65px; min-width: 65px; text-align: center; }
        .td-deadline { width: 75px; min-width: 75px; font-weight: 700; }
        .td-action { width: 145px; min-width: 145px; text-align: center; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 4px; max-width: 300px; width: 100%; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
        .s-open { background: #e6f7ee; color: #1a6b38; }
        .s-closed { background: #fde8e8; color: #c13b2e; }
        
        .tag { font-size: 10px; font-weight: 600; padding: 2px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px; display: inline-block; margin: 2px 2px 2px 0; }
        .tag.tg { background: #e0f2fe; color: #0369a1; }
        .tag.tng { background: #dcfce7; color: #15803d; }
        .tag.tmx { background: #faf5ff; color: #6b21a8; }
        .tag.tcat { background: #f3e8ff; color: #6b21a8; }
        .tag.tbr { background: #ffedd5; color: #9a3412; }
        .tag.tnew { background: #ff7a00; color: #fff; font-weight: 700; font-size: 9px; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 3px; }
        
        .dl-urgent { color: var(--red); font-weight: 700; font-size: 11px; }
        .dl-soon { color: #b45e00; font-weight: 700; font-size: 11px; }
        .dl-ok { color: var(--muted); font-weight: 700; font-size: 11px; }
        .dl-over { color: #999; font-weight: 700; font-size: 11px; text-decoration: line-through; }
        
        .btn-detail-outline { background: #white; border: 1.5px solid var(--navy); color: var(--navy); padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.18s; outline: none; background: #fff; }
        .btn-detail-outline:hover { background: var(--navy); color: #fff; }
        .btn-apply-orange { background: var(--saffron); border: none; color: #fff; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.18s; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
        .btn-apply-orange:hover { background: #c56b00; }
        
        .overlay { position: fixed; inset: 0; background: rgba(10, 25, 55, 0.65); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 12px; opacity: 0; pointer-events: none; transition: opacity 0.22s; overflow-y: auto; }
        .overlay.on { opacity: 1; pointer-events: all; }
        .modal { background: var(--white); border-radius: 12px; width: 100%; max-width: 680px; max-height: 92vh; overflow-y: auto; transform: translateY(16px) scale(0.97); transition: transform 0.25s; box-shadow: 0 20px 60px rgba(10, 25, 55, 0.3); display: flex; flex-direction: column; }
        .overlay.on .modal { transform: translateY(0) scale(1); }
        
        .mhdr { background: var(--navy); padding: 22px 24px; border-radius: 12px 12px 0 0; position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: flex-start; }
        .morg { font-size: 10px; color: #93c5fd; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; }
        .mtitle { font-family: 'Baloo 2', sans-serif; font-size: 22px; font-weight: 800; color: #fff; line-height: 1.2; margin: 0 0 10px 0; }
        .mclose { background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 10px; transition: background 0.2s; }
        .mclose:hover { background: rgba(255, 255, 255, 0.2); }
        
        .mbody { padding: 20px 24px; overflow-y: auto; flex: 1; }
        .m-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .m-info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
        .m-info-box label { font-size: 10px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 3px; }
        .m-info-box .val { font-size: 13px; font-weight: 700; color: #1e293b; }
        .m-info-box .val.sal { color: var(--green); }
        
        .timeline-section { margin-bottom: 24px; }
        .timeline-alert { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; color: #92400e; display: flex; flex-direction: column; }
        .timeline-alert strong { font-size: 12px; font-weight: 700; display: block; }
        .timeline-alert span { font-size: 11px; margin-top: 2px; }
        
        .v-timeline { position: relative; padding-left: 24px; margin-left: 4px; }
        .v-timeline::before { content: ''; position: absolute; left: 7px; top: 6px; bottom: 6px; width: 2px; background: #e2e8f0; }
        .timeline-item { position: relative; margin-bottom: 16px; }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-dot { position: absolute; left: -24px; top: 4px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; border: 2px solid #cbd5e1; z-index: 1; }
        .timeline-dot.completed { background: #1a7a3c; border-color: #1a7a3c; color: #fff; font-size: 10px; font-weight: 700; }
        .timeline-dot.active { background: #fff; border-color: var(--saffron); border-width: 4px; }
        .timeline-dot.upcoming { background: #cbd5e1; border-color: #cbd5e1; }
        .timeline-content { font-size: 12px; }
        .timeline-header { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .timeline-event { font-weight: 700; color: #1e293b; }
        .timeline-date { color: var(--muted); font-size: 11px; }
        .timeline-desc { color: var(--muted); font-size: 11px; margin-top: 2px; }
        
        .elig-glance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .elig-glance-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; }
        .elig-glance-box label { font-size: 10px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
        .elig-glance-box .val { font-size: 12px; font-weight: 700; }
        .elig-glance-box .val.yes { color: var(--green); }
        .elig-glance-box .val.no { color: var(--red); }
        
        .sec-head { font-size: 12px; font-weight: 700; color: var(--navy); margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid var(--sky-light); text-transform: uppercase; letter-spacing: 0.5px; }
        .notes-list { list-style: none; margin-bottom: 20px; }
        .notes-list li { padding: 6px 0; border-bottom: 1px solid var(--bg); font-size: 12px; display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }
        .notes-list li::before { content: '▸'; color: var(--sky); flex-shrink: 0; margin-top: 1px; font-weight: bold; }
        .notes-list li:last-child { border-bottom: none; }
        
        .mfooter { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; background: #white; border-radius: 0 0 12px 12px; background-color: #fff; }
        .btn-apbig { background: var(--saffron); border: none; color: #fff; padding: 10px 24px; border-radius: 6px; font-family: 'Hind', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.18s; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
        .btn-apbig:hover { background: #c56b00; }
        .btn-closem { background: none; border: 1.5px solid var(--border); color: var(--muted); padding: 9px 18px; border-radius: 6px; font-family: 'Hind', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.18s; }
        .btn-closem:hover { border-color: var(--navy); color: var(--navy); }
        
        .no-results { text-align: center; padding: 50px 20px; color: var(--muted); }
        .no-results h3 { font-family: 'Baloo 2', sans-serif; font-size: 18px; color: var(--navy); margin: 10px 0 6px; }
        
        footer { background: var(--navy); color: #fff; text-align: center; padding: 20px 16px; font-size: 12px; }
        footer a { color: #a8c4e8; text-decoration: none; }
        footer a:hover { text-decoration: underline; }
      `}</style>

      <header>
        <div className="hdr-top">
          EngineerNaukri &nbsp;|&nbsp; Employment Portal for Engineers &nbsp;|&nbsp; Updated: {getLastUpdatedText()}
        </div>
        <div className="hdr-main">
          <div className="logo-circle">⚙️</div>
          <div className="logo-text">
            <h1>EngineerNaukri</h1>
            <p>Employment Portal for Engineers | इंजीनियर रोजगार पोर्टल</p>
          </div>
          <nav className="hdr-nav">
            <a href="#">Home</a>
            <a href="#">Results</a>
            <a href="#">Admit Cards</a>
            <a href="#">Syllabus</a>
            <a href="#">Help</a>
          </nav>
        </div>
      </header>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span></span> Live Portal — Active Job Openings
          </div>
          <h2>
            Find Your Dream <em>Engineering Job</em>
            <br />
            in PSU & Public Sectors
          </h2>
          <p>One portal for all GATE & Non-GATE engineering jobs — PSUs, Defence, Railways, and more. Apply directly.</p>
          
          <div className="hero-ticker">
            <span className="hero-ticker-lbl">🔔 Latest</span>
            <div className="hero-ticker-scroll">
              {notifications.length > 0 ? (
                <div 
                  className="hero-ticker-track" 
                  style={{ animationDuration: `${tickerDuration}s` }}
                >
                  <div className="hero-ticker-content">
                    {repeatedNotifs.map((notif, index) => {
                      const matchingJob = jobs.find(
                        (j) =>
                          notif.text.toLowerCase().includes(j.organization.toLowerCase()) ||
                          notif.text.toLowerCase().includes(j.title.toLowerCase())
                      );
                      const url = matchingJob ? matchingJob.applicationUrl : `https://www.google.com/search?q=${encodeURIComponent(notif.text)}`;
                      
                      return (
                        <span key={`ticker-1-${notif._id || index}-${index}`}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ticker-link"
                            title={matchingJob ? `Go to ${matchingJob.organization} website` : `Search: ${notif.text}`}
                          >
                            {notif.text}
                          </a>
                          <span className="ticker-bullet">  •  </span>
                        </span>
                      );
                    })}
                  </div>
                  <div className="hero-ticker-content" aria-hidden="true">
                    {repeatedNotifs.map((notif, index) => {
                      const matchingJob = jobs.find(
                        (j) =>
                          notif.text.toLowerCase().includes(j.organization.toLowerCase()) ||
                          notif.text.toLowerCase().includes(j.title.toLowerCase())
                      );
                      const url = matchingJob ? matchingJob.applicationUrl : `https://www.google.com/search?q=${encodeURIComponent(notif.text)}`;
                      
                      return (
                        <span key={`ticker-2-${notif._id || index}-${index}`}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ticker-link"
                            title={matchingJob ? `Go to ${matchingJob.organization} website` : `Search: ${notif.text}`}
                          >
                            {notif.text}
                          </a>
                          <span className="ticker-bullet">  •  </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <span className="hero-ticker-text">No active notifications at the moment.</span>
              )}
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{jobs.length}</div>
              <div className="lbl">Active Jobs</div>
            </div>
            <div className="hero-stat">
              <div className="num">48+</div>
              <div className="lbl">Organisations</div>
            </div>
            <div className="hero-stat">
              <div className="num">
                {jobs.reduce((sum, j) => sum + j.numberOfPositions, 0).toLocaleString()}+
              </div>
              <div className="lbl">Total Vacancies</div>
            </div>
            <div className="hero-stat">
              <div className="num">9</div>
              <div className="lbl">Branch Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* AdSense Top Banner */}
      <AdBanner adSlot="1234567890" adFormat="horizontal" />

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-row">
          <select value={fGate} onChange={(e) => setFGate(e.target.value)}>
            <option value="all">All (GATE + Non-GATE)</option>
            <option value="GATE">GATE Required</option>
            <option value="NON_GATE">Non-GATE</option>
            <option value="MIXED">Mixed</option>
          </select>
          <select value={fBranch} onChange={(e) => setFBranch(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="CSE">CS / IT</option>
            <option value="ECE">ECE</option>
            <option value="EE">Electrical</option>
            <option value="ME">Mechanical</option>
            <option value="CIVIL">Civil</option>
            <option value="CHEMICAL">Chemical</option>
            <option value="PRODUCTION">Production</option>
            <option value="METALLURGY">Metallurgy</option>
            <option value="MINING">Mining</option>
          </select>
          <select value={fType} onChange={(e) => setFType(e.target.value)}>
            <option value="all">All Job Types</option>
            <option value="PSU">PSU</option>
            <option value="CENTRAL">Central Govt</option>
            <option value="DEFENCE">Defence / DRDO / ISRO</option>
            <option value="RAILWAY">Railway</option>
            <option value="STATE">State Govt</option>
          </select>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="OPEN">Applications Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={fCandidates} onChange={(e) => setFCandidates(e.target.value)}>
            <option value="all">All Candidates</option>
            <option value="final_year">Final Year Eligible</option>
            <option value="non_engg">Open to Non-Engineers</option>
          </select>
          <input
            type="text"
            placeholder="🔍 Search org, post..."
            value={fSearch}
            onChange={(e) => setFSearch(e.target.value)}
          />
          <button className="btn-go">Search</button>
          <button className="btn-rst" onClick={resetFilters}>
            Reset
          </button>
          <span className="job-count-badge">{filteredJobs.length} jobs</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          {/* Category List */}
          <div className="sb-card">
            <div className="sb-head">Job Categories</div>
            <ul className="sb-list">
              <li
                className={fType === 'PSU' ? 'active-cat' : ''}
                onClick={() => setFType(fType === 'PSU' ? 'all' : 'PSU')}
              >
                PSU <span className="cnt-badge">{jobs.filter((j) => j.category === 'PSU').length}</span>
              </li>
              <li
                className={fType === 'DEFENCE' ? 'active-cat' : ''}
                onClick={() => setFType(fType === 'DEFENCE' ? 'all' : 'DEFENCE')}
              >
                Defence <span className="cnt-badge">{jobs.filter((j) => j.category === 'DEFENCE').length}</span>
              </li>
              <li
                className={fType === 'CENTRAL' ? 'active-cat' : ''}
                onClick={() => setFType(fType === 'CENTRAL' ? 'all' : 'CENTRAL')}
              >
                Central Govt <span className="cnt-badge">{jobs.filter((j) => j.category === 'CENTRAL').length}</span>
              </li>
              <li
                className={fType === 'RAILWAY' ? 'active-cat' : ''}
                onClick={() => setFType(fType === 'RAILWAY' ? 'all' : 'RAILWAY')}
              >
                Railway <span className="cnt-badge">{jobs.filter((j) => j.category === 'RAILWAY').length}</span>
              </li>
              <li
                className={fType === 'STATE' ? 'active-cat' : ''}
                onClick={() => setFType(fType === 'STATE' ? 'all' : 'STATE')}
              >
                State Govt <span className="cnt-badge">{jobs.filter((j) => j.category === 'STATE').length}</span>
              </li>
            </ul>
          </div>

          {/* Status List */}
          <div className="sb-card">
            <div className="sb-head">Job Status</div>
            <ul className="sb-list">
              <li
                className={fStatus === 'OPEN' ? 'active-cat' : ''}
                onClick={() => setFStatus(fStatus === 'OPEN' ? 'all' : 'OPEN')}
              >
                ✓ Applications Open <span className="cnt-badge">{jobs.filter((j) => isJobOpen(j.deadline)).length}</span>
              </li>
              <li
                className={fStatus === 'CLOSED' ? 'active-cat' : ''}
                onClick={() => setFStatus(fStatus === 'CLOSED' ? 'all' : 'CLOSED')}
              >
                ✕ Closed <span className="cnt-badge">{jobs.filter((j) => !isJobOpen(j.deadline)).length}</span>
              </li>
            </ul>
          </div>

          <div className="sb-card">
            <div className="sb-head">Quick Sort</div>
            <ul className="sb-list">
              <li onClick={() => setSortBy('deadline')}>⏰ By Deadline</li>
              <li onClick={() => setSortBy('salary')}>💰 By Salary</li>
              <li onClick={() => setSortBy('vacancies')}>👥 By Vacancies</li>
              <li onClick={() => setSortBy('new')}>🆕 Newest First</li>
            </ul>
          </div>

          <div className="sb-notice">
            <strong>⚠️ Disclaimer</strong>Verify all details on official organisation website. Beware of fake recruitment fraud. Portal aggregates public data only.
          </div>
        </aside>

        {/* JOBS TABLE */}
        <div>
          <div className="jobs-hdr">
            <h2>📋 Current Job Openings</h2>
            <div className="sort-row">
              Sort:
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="new">Newest</option>
                <option value="deadline">Deadline</option>
                <option value="salary">Salary</option>
                <option value="vacancies">Vacancies</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="no-results" style={{ display: 'block' }}>
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="no-results" style={{ display: 'block' }}>
              <div style={{ fontSize: '40px' }}>🔍</div>
              <h3>No Jobs Found</h3>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <table className="job-table">
              <thead>
                <tr>
                  <th className="td-org">Organisation</th>
                  <th className="td-post">Post / Position</th>
                  <th className="td-tags">Tags</th>
                  <th className="td-salary">Salary</th>
                  <th className="td-status">Status</th>
                  <th className="td-deadline">Deadline</th>
                  <th className="td-action" style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="td-org">
                      <div className="org-name">{job.organization}</div>
                      <div className="org-sub">{job.organizationFullName}</div>
                    </td>
                    <td className="td-post">
                      <div className="post-name">{job.title}</div>
                      {job.isNewJob && <span className="tag tnew">NEW</span>}
                    </td>
                    <td className="td-tags">
                      <div className="tags-container">
                        {job.jobType === 'GATE' && <span className="tag tg">GATE</span>}
                        {job.jobType === 'NON_GATE' && <span className="tag tng">Non-GATE</span>}
                        {job.jobType === 'MIXED' && <span className="tag tmx">Mixed</span>}

                        {job.category && (
                          <span className="tag tcat">{getCategoryLabel(job.category)}</span>
                        )}

                        {job.eligibleBranches.map((branch) => (
                          <span key={branch} className="tag tbr">
                            {branch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="td-salary">{job.salary}</td>
                    <td className="td-status">
                      {isJobOpen(job.deadline) ? (
                        <span className="status-pill s-open">Open</span>
                      ) : (
                        <span className="status-pill s-closed">Closed</span>
                      )}
                    </td>
                    <td className="td-deadline">
                      <span className={getDeadlineClass(job.deadline.toString())}>
                        {formatDeadlineDayMonth(job.deadline.toString())}
                      </span>
                    </td>
                    <td className="td-action" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      <button className="btn-detail-outline" onClick={() => openJobDetail(job)}>
                        Details
                      </button>
                      &nbsp;
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-apply-orange"
                      >
                        Apply →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* AdSense Bottom Banner */}
      <AdBanner adSlot="9876543210" adFormat="auto" />

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className={`overlay ${isModalOpen ? 'on' : ''}`} onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="mhdr">
              <div>
                <div className="morg">
                  {selectedJob.organization} – {selectedJob.organizationFullName}
                </div>
                <div className="mtitle">{selectedJob.title}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="tag tg" style={{ background: '#1e3a8a', color: '#fff' }}>
                    {selectedJob.jobType === 'GATE'
                      ? 'GATE REQUIRED'
                      : selectedJob.jobType === 'NON_GATE'
                        ? 'NON-GATE'
                        : 'MIXED'}
                  </span>
                  {selectedJob.category && (
                    <span className="tag tcat" style={{ background: '#ddd6fe', color: '#4c1d95' }}>
                      {getCategoryLabel(selectedJob.category)}
                    </span>
                  )}
                  {selectedJob.eligibleBranches.map((branch) => (
                    <span key={branch} className="tag tbr" style={{ background: '#fed7aa', color: '#7c2d12' }}>
                      {branch}
                    </span>
                  ))}
                  {selectedJob.isNewJob && (
                    <span className="tag tnew" style={{ margin: 0 }}>
                      NEW
                    </span>
                  )}
                  {isJobOpen(selectedJob.deadline) ? (
                    <span className="status-pill s-open">Applications Open</span>
                  ) : (
                    <span className="status-pill s-closed">Closed</span>
                  )}
                </div>
              </div>
              <button className="mclose" onClick={closeModal} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="mbody">
              {/* Info grid (8 boxes) */}
              <div className="m-info-grid">
                <div className="m-info-box">
                  <label>Total Vacancies</label>
                  <div className="val">{selectedJob.numberOfPositions.toLocaleString()} Posts</div>
                </div>
                <div className="m-info-box">
                  <label>Salary</label>
                  <div className="val sal">{selectedJob.salary}</div>
                </div>
                <div className="m-info-box">
                  <label>Age Limit</label>
                  <div className="val">{selectedJob.ageLimit}</div>
                </div>
                <div className="m-info-box">
                  <label>Application Deadline</label>
                  <div className="val">
                    {formatDeadlineFull(selectedJob.deadline.toString())} ({getDaysLeftText(selectedJob.deadline.toString())})
                  </div>
                </div>
                <div className="m-info-box">
                  <label>Qualification</label>
                  <div className="val">{selectedJob.qualification || 'B.Tech / BE'}</div>
                </div>
                <div className="m-info-box">
                  <label>Min Marks</label>
                  <div className="val">{selectedJob.minMarks || 'Pass aggregate'}</div>
                </div>
                <div className="m-info-box">
                  <label>Selection Process</label>
                  <div className="val">{selectedJob.selectionProcess || 'Written Test / Interview'}</div>
                </div>
                <div className="m-info-box">
                  <label>Bond</label>
                  <div className="val">{selectedJob.bond || 'No bond'}</div>
                </div>
              </div>

              {/* Recruitment Timeline Section */}
              {selectedJob.showPhases && selectedJob.timeline && selectedJob.timeline.length > 0 && (
                <div className="timeline-section">
                  <div className="sec-head">Recruitment Timeline</div>

                  {/* Stage Alert */}
                  {selectedJob.timeline.some((t) => t.status === 'ACTIVE') && (
                    <div className="timeline-alert">
                      <strong>
                        ⚡ Current Stage: {selectedJob.timeline.find((t) => t.status === 'ACTIVE')?.event}
                      </strong>
                      <span>
                        {selectedJob.timeline.find((t) => t.status === 'ACTIVE')?.description ||
                          'Application submission stage ongoing'}
                      </span>
                    </div>
                  )}

                  {/* Vertical Timeline */}
                  <div className="v-timeline">
                    {selectedJob.timeline.map((item, idx) => (
                      <div key={idx} className="timeline-item">
                        <div
                          className={`timeline-dot ${item.status === 'COMPLETED'
                              ? 'completed'
                              : item.status === 'ACTIVE'
                                ? 'active'
                                : 'upcoming'
                            }`}
                        >
                          {item.status === 'COMPLETED' && '✓'}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-event">{item.event}</span>
                            <span className="timeline-date">{item.date}</span>
                          </div>
                          {item.description && <div className="timeline-desc">{item.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility At A Glance Grid */}
              <div className="sec-head">Eligibility At A Glance</div>
              <div className="elig-glance-grid">
                <div className="elig-glance-box">
                  <label>GATE Required?</label>
                  <div className={`val ${selectedJob.jobType === 'GATE' ? 'yes' : 'no'}`}>
                    {selectedJob.jobType === 'GATE'
                      ? 'Yes – Valid GATE Score Needed'
                      : 'No – GATE Score Not Required'}
                  </div>
                </div>
                <div className="elig-glance-box">
                  <label>Final Year Students?</label>
                  <div className={`val ${selectedJob.eligibilityFinalYear ? 'yes' : 'no'}`}>
                    {selectedJob.eligibilityFinalYear
                      ? 'Yes – Eligible to Apply'
                      : 'No – Degree Must Be Complete'}
                  </div>
                </div>
                <div className="elig-glance-box">
                  <label>Non-Engineering?</label>
                  <div className={`val ${selectedJob.openToNonEngineering ? 'yes' : 'no'}`}>
                    {selectedJob.openToNonEngineering ? 'Yes – Open to Non-Engineers' : 'No – Engineering Only'}
                  </div>
                </div>
                <div className="elig-glance-box">
                  <label>Applicable Branches</label>
                  <div className="val" style={{ color: 'var(--navy)' }}>
                    {selectedJob.eligibleBranches.join(', ')}
                  </div>
                </div>
              </div>

              {/* About Position */}
              <div className="sec-head">About This Position</div>
              <p style={{ fontSize: '12px', color: 'var(--text)', marginBottom: '20px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {selectedJob.description}
              </p>

              {/* Important Notes */}
              {selectedJob.importantNotes && selectedJob.importantNotes.length > 0 && (
                <>
                  <div className="sec-head">Important Notes</div>
                  <ul className="notes-list">
                    {selectedJob.importantNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="mfooter">
              <button className="btn-closem" onClick={closeModal}>
                Close
              </button>
              <a
                href={selectedJob.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apbig"
              >
                Apply On Official Website →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '7px', background: '#FF9933' }}></div>
          <div style={{ width: '36px', height: '7px', background: '#fff' }}></div>
          <div style={{ width: '36px', height: '7px', background: '#138808' }}></div>
        </div>
        <strong>EngineerNaukri Portal</strong> — National Employment Resource for Engineers<br />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '10px 0', flexWrap: 'wrap' }}>
          <a href="#">About</a>
          <a href="#">Disclaimer</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
        <span style={{ fontSize: '11px' }}>© 2026 EngineerNaukri | Aggregates publicly available information. Not affiliated with any government body.</span>
      </footer>
    </>
  );
}
