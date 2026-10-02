import React, { useState, useRef } from "react";
import "./App.css";

// SVG UI Icons
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Official Brand SVGs
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22 6c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v.38l10 6.67 10-6.67V6z" />
    <path fill="#34A853" d="M2 7.78V18c0 .55.45 1 1 1h4v-7.67L2 7.78z" />
    <path fill="#EA4335" d="M22 7.78l-5 3.55V19h4c.55 0 1-.45 1-1V7.78z" />
    <path fill="#FBBC05" d="M7 19h10V11.33L12 14.67 7 11.33V19z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function App() {
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [isDraggingOld, setIsDraggingOld] = useState(false);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const oldInputRef = useRef(null);
  const newInputRef = useRef(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!oldFile || !newFile) {
      setError("Please upload both document versions before comparing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("oldDocument", oldFile);
    formData.append("newDocument", newFile);

    try {
      const response = await fetch("https://changewatch.onrender.com/api/compare", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to compare documents.");
      }
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setOldFile(null);
    setNewFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="layout">
      {/* Background Ambience */}
      <div className="radial-glow glow-1" />
      <div className="radial-glow glow-2" />

      {/* Navigation */}
      <header className="header">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-badge">CW</div>
            <span className="brand-title">ChangeWatch</span>
            <span className="brand-tag">v2.0</span>
          </div>
          <div className="system-status">
            <span className="pulse-dot" />
            <span>Neural Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="content">
        <div className="hero">
          <div className="hero-pill">
            <span className="sparkle">✦</span> AI Document Audit System
          </div>
          <h1>Intelligent Document Diff & Change Audit</h1>
          <p>
            Upload any two versions of a document. ChangeWatch uses multi-modal extraction to pinpoint
            score adjustments, clause revisions, line updates, and numerical discrepancies.
          </p>
        </div>

        {/* Upload Card */}
        <div className="card glass-card">
          <form onSubmit={handleCompare}>
            <div className="upload-grid">
              {/* Document 1 */}
              <div
                className={`dropzone ${oldFile ? "active" : ""} ${isDraggingOld ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOld(true); }}
                onDragLeave={() => setIsDraggingOld(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOld(false);
                  if (e.dataTransfer.files?.[0]) setOldFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !oldFile && oldInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={oldInputRef}
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && setOldFile(e.target.files[0])}
                />
                {oldFile ? (
                  <div className="file-chip">
                    <div className="file-chip-icon"><FileIcon /></div>
                    <div className="file-chip-meta">
                      <span className="file-chip-name">{oldFile.name}</span>
                      <span className="file-chip-size">{(oldFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); setOldFile(null); }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon"><UploadIcon /></div>
                    <div className="dropzone-label">Original Version (Base)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Image</p>
                  </>
                )}
              </div>

              {/* Arrow */}
              <div className="arrow-divider">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>

              {/* Document 2 */}
              <div
                className={`dropzone ${newFile ? "active" : ""} ${isDraggingNew ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingNew(true); }}
                onDragLeave={() => setIsDraggingNew(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingNew(false);
                  if (e.dataTransfer.files?.[0]) setNewFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !newFile && newInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={newInputRef}
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && setNewFile(e.target.files[0])}
                />
                {newFile ? (
                  <div className="file-chip">
                    <div className="file-chip-icon"><FileIcon /></div>
                    <div className="file-chip-meta">
                      <span className="file-chip-name">{newFile.name}</span>
                      <span className="file-chip-size">{(newFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); setNewFile(null); }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon"><UploadIcon /></div>
                    <div className="dropzone-label">Updated Version (Target)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Image</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="btn-row">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !oldFile || !newFile}
              >
                {loading ? (
                  <>
                    <span className="loader" />
                    Analyzing Document Differences...
                  </>
                ) : (
                  "Compare Documents"
                )}
              </button>
              {(oldFile || newFile || result) && (
                <button type="button" onClick={resetAll} className="btn-secondary">
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="error-box">
              <span className="error-dot" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <div className="results card">
            <div className="results-top">
              <div>
                <h2>Audit Summary</h2>
                <p className="results-summary">{result.summary}</p>
              </div>
              <div className="metric-tag">
                <span className="metric-val">{result.totalChanges || 0}</span>
                <span className="metric-title">{result.totalChanges === 1 ? "Change" : "Changes"}</span>
              </div>
            </div>

            {result.changes && result.changes.length > 0 ? (
              <div className="diff-list">
                {result.changes.map((item, idx) => (
                  <div key={idx} className={`diff-card ${item.importance}`}>
                    <div className="diff-card-head">
                      <span className={`chip type-${item.type || "modified"}`}>{item.type || "Modified"}</span>
                      <span className={`chip priority-${item.importance || "normal"}`}>
                        {item.importance === "important" ? "Critical" : "Standard"}
                      </span>
                      <span className="diff-title">{item.title}</span>
                    </div>

                    <div className="diff-values">
                      <div className="val-box val-old">
                        <span className="val-tag">Previous Version</span>
                        <div className="val-text">{item.oldValue || "—"}</div>
                      </div>
                      <div className="val-arrow">→</div>
                      <div className="val-box val-new">
                        <span className="val-tag">Revised Version</span>
                        <div className="val-text">{item.newValue || "—"}</div>
                      </div>
                    </div>

                    {item.explanation && (
                      <p className="diff-desc">{item.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-notice">
                <p>No structural, textual, or numerical differences identified between these documents.</p>
              </div>
            )}

            {result.actions && result.actions.length > 0 && (
              <div className="action-box">
                <h3>Recommended Action Items</h3>
                <div className="action-items">
                  {result.actions.map((act, i) => (
                    <div key={i} className="action-row">
                      <span className="action-check"><CheckIcon /></span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Founder & Lead Developer Showcase Section */}
      <footer className="footer-wrapper">
        <div className="executive-card">
          <div className="card-ambient-light" />
          
          <div className="executive-content">
            {/* Left Column: Founder Bio & Verification */}
            <div className="founder-section">
              <div className="status-badge-container">
                <span className="badge-founder">FOUNDER & LEAD DEVELOPER</span>
                <span className="badge-pulse">
                  <span className="pulse-circle"></span>
                  1st Year CSE (B.E.)
                </span>
              </div>

              <h2 className="executive-name">Shree Navaneetha V R</h2>

              <p className="executive-degree">
                Bachelor of Engineering • Computer Science & Engineering
              </p>

              <div className="divider-line" />

              <p className="executive-bio">
                Designed, architected, and deployed the ChangeWatch document diff system from scratch. 
                Engineered the backend multi-modal file extraction, OCR parsing pipeline, and Groq-powered 
                neural analysis engine.
              </p>
            </div>

            {/* Right Column: Direct Channels & Profiles */}
            <div className="channels-section">
              <span className="channels-header">DIRECT CONTACT & PROFILES</span>

              <div className="channel-buttons">
                {/* LinkedIn Profile Button */}
                <a
                  href="https://www.linkedin.com/in/shree-navaneetha-v-r-91aa42417"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-channel channel-linkedin"
                >
                  <div className="btn-channel-icon"><LinkedInIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">Connect on LinkedIn</span>
                    <span className="channel-sub">Professional Network</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>

                {/* Email Direct Channel Button */}
                <a
                  href="mailto:shreenava2008@gmail.com"
                  className="btn-channel channel-gmail"
                >
                  <div className="btn-channel-icon"><GmailIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">Send Direct Email</span>
                    <span className="channel-sub">shreenava2008@gmail.com</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>

                {/* GitHub Repository Button */}
                <a
                  href="https://github.com/ShreeNava08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-channel channel-github"
                >
                  <div className="btn-channel-icon"><GitHubIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">GitHub Profile</span>
                    <span className="channel-sub">@ShreeNava08 • Source Code</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="card-footer-strip">
            <span>ChangeWatch Engine • Designed & Developed by Shree Navaneetha V R</span>
            <span>Production Deployment • Powered by Groq LPU & Vercel Edge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}