'use client';

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const displayDate = lastUpdated || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <header>
      <div className="hdr-top">
        EngineerNaukri &nbsp;|&nbsp; Employment Portal for Engineers &nbsp;|&nbsp; Updated: {displayDate}
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
  );
}
