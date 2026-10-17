import { useState, useRef } from "react";
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

const CpuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
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

// Pre-packaged realistic sample comparison for instant 1-click test
const SAMPLE_AUDIT_DATA = {
  summary:
    "Round 2 Counseling Cutoff revision detected significant rank shifts across Computer Science and AI branches. Closing ranks relaxed by an average of +440 ranks across premier institutes, intake capacity was doubled for AICTE-approved AI specializations, and the physical reporting window was extended.",
  totalChanges: 4,
  changes: [
    {
      title: "Computer Science & Engineering (B.E.) — General Merit Cutoff",
      type: "Rank / Cutoff Shift",
      importance: "important",
      oldValue: "Closing Cutoff Rank: 2,450 (Round 1 Allotment)",
      newValue: "Closing Cutoff Rank: 2,890 (Round 2 Revised Allotment)",
      explanation:
        "The cutoff relaxed by +440 ranks in Round 2, increasing admission eligibility for waitlisted candidates."
    },
    {
      title: "Artificial Intelligence & Data Science — Sanctioned Intake",
      type: "Capacity Metric",
      importance: "important",
      oldValue: "Sanctioned Seats: 60 Seats",
      newValue: "Sanctioned Seats: 120 Seats (AICTE Approved Extension)",
      explanation:
        "Branch intake capacity doubled from 60 to 120 seats, which significantly reduced rank competition."
    },
    {
      title: "Tuition & Laboratory Caution Deposit Schedule",
      type: "Fee Alteration",
      importance: "standard",
      oldValue: "Annual Tuition: ₹85,000 / Semester",
      newValue: "Annual Tuition: ₹85,000 + ₹6,500 Refundable Lab & Library Deposit",
      explanation:
        "A mandatory refundable caution deposit has been newly added in the revised counseling notification."
    },
    {
      title: "Physical Document Verification & Reporting Deadline",
      type: "Date Extension",
      importance: "standard",
      oldValue: "Reporting Deadline: October 20, 2026 (5:00 PM)",
      newValue: "Extended Deadline: October 26, 2026 (5:00 PM)",
      explanation:
        "Verification and fee submission window has been officially extended by 6 days."
    }
  ],
  actions: [
    "Verify your updated Round 2 cutoff rank against candidate allotment lists.",
    "Ensure the ₹6,500 laboratory deposit receipt is carried during in-person verification.",
    "Complete reporting before the extended deadline of October 26, 2026 (5:00 PM)."
  ]
};

export default function App() {
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [isDraggingOld, setIsDraggingOld] = useState(false);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const oldInputRef = useRef(null);
  const newInputRef = useRef(null);
  const resultsRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

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
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleDemo = () => {
    setError(null);
    setOldFile({
      name: "Engineering_Cutoff_Round1.pdf",
      size: 1420 * 1024,
      isDemo: true
    });
    setNewFile({
      name: "Engineering_Cutoff_Round2_Revised.pdf",
      size: 1540 * 1024,
      isDemo: true
    });
    setResult(SAMPLE_AUDIT_DATA);
    showToast("Loaded Sample Demo: Round 1 vs Round 2 Cutoff Revision");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const copySummaryToClipboard = () => {
    if (!result) return;
    const summaryText = `ChangeWatch AI Document Audit Summary:\n${result.summary}\n\nTotal Changes: ${result.totalChanges || 0}\n\nKey Action Items:\n${(result.actions || []).map((a, i) => `${i + 1}. ${a}`).join("\n")}`;
    navigator.clipboard.writeText(summaryText);
    showToast("Copied Audit Summary to clipboard!");
  };

  const downloadReportFile = () => {
    if (!result) return;
    const reportContent = `ChangeWatch AI Document Audit Report
======================================================
Base Document:     ${oldFile?.name || "Version 1"}
Revised Document:  ${newFile?.name || "Version 2"}
Generated on:      ${new Date().toLocaleString()}
Total Differences: ${result.totalChanges || 0}

EXECUTIVE AUDIT SUMMARY:
${result.summary}

DETAILED DIFFERENCES:
------------------------------------------------------
${(result.changes || [])
  .map(
    (c, i) => `
[Change #${i + 1}] ${c.title}
Priority:   ${c.importance === "important" ? "CRITICAL" : "STANDARD"}
Category:   ${c.type || "General"}
Previous:   ${c.oldValue || "—"}
Revised:    ${c.newValue || "—"}
Analysis:   ${c.explanation || "N/A"}
------------------------------------------------------`
  )
  .join("\n")}

RECOMMENDED ACTION ITEMS:
${(result.actions || []).map((act, i) => `${i + 1}. ${act}`).join("\n")}

======================================================
Generated by ChangeWatch AI Engine • Powered by Groq LPU
Architected by Shree Navaneetha V R
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ChangeWatch_Audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded text audit report!");
  };

  const resetAll = () => {
    setOldFile(null);
    setNewFile(null);
    setResult(null);
    setError(null);
    if (oldInputRef.current) oldInputRef.current.value = "";
    if (newInputRef.current) newInputRef.current.value = "";
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="layout">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-pill">
          <CheckIcon />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Atmosphere Glows */}
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

          <nav className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#architecture">Architecture</a>
            <a href="#faq">FAQ</a>
            <a href="#founder">Founder</a>
          </nav>

          <div className="nav-actions">
            <button onClick={loadSampleDemo} className="btn-demo-pill" type="button">
              <SparkleIcon />
              <span>Try Demo</span>
            </button>
            <div className="system-status">
              <span className="pulse-dot" />
              <span>Groq Neural LPU</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="content">
        <div className="hero">
          <div className="hero-pill">
            <span className="sparkle">✦</span> Autonomous Document Audit Engine
          </div>
          <h1>Intelligent Document Diff & Change Audit</h1>
          <p>
            Upload any two versions of a document. ChangeWatch uses multi-modal optical extraction and Groq-accelerated
            neural reasoning to pinpoint score adjustments, cutoff shifts, numerical discrepancies, and altered clauses.
          </p>

          <div className="hero-quick-cta">
            <button onClick={loadSampleDemo} className="btn-hero-sample">
              <SparkleIcon />
              <span>Instant Live Demo (Cutoff Round 1 vs Round 2)</span>
            </button>
          </div>
        </div>

        {/* 3-Step Guide: How to Use ChangeWatch */}
        <section id="how-it-works" className="steps-onboarding-container">
          <div className="steps-title-row">
            <span className="steps-badge">QUICK START</span>
            <h2>How Everyone Can Use ChangeWatch in 3 Simple Steps</h2>
          </div>
          <div className="steps-three-grid">
            <div className="step-item">
              <div className="step-num">01</div>
              <h4>Upload Base & Revised Files</h4>
              <p>Drag and drop your original document and the updated revision. Accepts PDF, Word (.docx), Excel, TXT, or scanned images.</p>
            </div>
            <div className="step-item step-item-active">
              <div className="step-num">02</div>
              <h4>Neural Multi-Modal Extraction</h4>
              <p>Embedded OCR processes printed scans and mark sheets. Groq LPU models parse tables, marks, and clause revisions semantically.</p>
            </div>
            <div className="step-item">
              <div className="step-num">03</div>
              <h4>Audit Summary & Action Items</h4>
              <p>Inspect exact previous vs revised values, critical vs standard alerts, and export or copy your audit report.</p>
            </div>
          </div>
        </section>

        {/* Upload Card */}
        <div className="card glass-card" id="workbench">
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
                      <span className="file-chip-size">
                        {oldFile.size ? `${(oldFile.size / 1024).toFixed(1)} KB` : "Sample File"} • Ready
                      </span>
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
                    <div className="dropzone-label">1. Original Version (Base)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Scanned Image</p>
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
                      <span className="file-chip-size">
                        {newFile.size ? `${(newFile.size / 1024).toFixed(1)} KB` : "Sample File"} • Ready
                      </span>
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
                    <div className="dropzone-label">2. Updated Version (Target)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Scanned Image</p>
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

              <button
                type="button"
                onClick={loadSampleDemo}
                className="btn-secondary"
              >
                <SparkleIcon />
                <span>Try Demo Sample</span>
              </button>

              {(oldFile || newFile || result) && (
                <button type="button" onClick={resetAll} className="btn-ghost">
                  Reset
                </button>
              )}
            </div>

            {loading && (
              <div className="cold-start-note">
                <span>⚡ Running neural comparison via Groq LPU. (Note: On the first request, the Render server may take ~30s to wake up if dormant.)</span>
              </div>
            )}
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
          <div ref={resultsRef} className="results card">
            <div className="results-top">
              <div>
                <div className="audit-badge-pill">AUDIT VERIFIED</div>
                <h2>Audit Summary</h2>
                <p className="results-summary">{result.summary}</p>
              </div>
              <div className="results-right-col">
                <div className="metric-tag">
                  <span className="metric-val">{result.totalChanges || 0}</span>
                  <span className="metric-title">{result.totalChanges === 1 ? "Change" : "Changes"}</span>
                </div>
                <div className="result-action-btns">
                  <button onClick={copySummaryToClipboard} className="btn-icon-action" title="Copy summary">
                    <CopyIcon />
                    <span>Copy</span>
                  </button>
                  <button onClick={downloadReportFile} className="btn-icon-action" title="Download report text">
                    <DownloadIcon />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {result.changes && result.changes.length > 0 ? (
              <div className="diff-list">
                {result.changes.map((item, idx) => (
                  <div key={idx} className={`diff-card ${item.importance}`}>
                    <div className="diff-card-head">
                      <span className={`chip type-${(item.type || "modified").toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                        {item.type || "Modified"}
                      </span>
                      <span className={`chip priority-${item.importance || "normal"}`}>
                        {item.importance === "important" ? "Critical Priority" : "Standard"}
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

            <div className="results-bottom-actions">
              <button onClick={downloadReportFile} className="btn-primary">
                <DownloadIcon />
                <span>Download Full Audit Report (.txt)</span>
              </button>
              <button onClick={resetAll} className="btn-secondary">
                Compare Another Document
              </button>
            </div>
          </div>
        )}

        {/* Brochure Section */}
        <section id="architecture" className="brochure-section">
          <div className="brochure-header">
            <div className="hero-pill">
              <span className="sparkle">✦</span> Architecture & Capabilities
            </div>
            <h2>What is ChangeWatch & How Does It Work?</h2>
            <p>
              ChangeWatch is an autonomous document discrepancy detection engine engineered to eliminate 
              manual line-by-line verification across critical academic scorecards, legal contracts, and financial reports.
            </p>
          </div>

          <div className="brochure-grid">
            {/* Feature 1 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><ZapIcon /></div>
              <h3>1. Universal Format Extraction</h3>
              <p>
                Eliminates file format boundaries. ChangeWatch accepts <strong>PDFs, Word (.docx), Excel spreadsheets (.xlsx, .csv), plain text</strong>, 
                and image-based scans with zero manual reformatting.
              </p>
              <div className="feature-tags">
                <span>PDF Parsing</span>
                <span>Spreadsheets</span>
                <span>Word Documents</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><CpuIcon /></div>
              <h3>2. High-Accuracy OCR Engine</h3>
              <p>
                Equipped with optical character recognition to extract data directly from 
                <strong> screenshots, printed certificates, mark sheets, and scanned forms</strong> where plain text extraction fails.
              </p>
              <div className="feature-tags">
                <span>Image OCR</span>
                <span>Scan Detection</span>
                <span>Multi-Resolution</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><ShieldIcon /></div>
              <h3>3. Neural Difference Audit</h3>
              <p>
                Powered by Groq-accelerated neural inference models that understand semantic context. It isolates score updates, 
                detects altered clauses, calculates net score variance, and outputs prioritized action items.
              </p>
              <div className="feature-tags">
                <span>Groq LPU Speed</span>
                <span>Risk Prioritization</span>
                <span>Smart Summaries</span>
              </div>
            </div>
          </div>

          {/* Use cases Strip */}
          <div className="usecases-strip">
            <div className="usecase-col">
              <span className="usecase-number">01</span>
              <h4>Scorecards & Rank Lists</h4>
              <p>Audit marks, ranks, and cutoff revisions across entrance exam updates.</p>
            </div>
            <div className="usecase-col">
              <span className="usecase-number">02</span>
              <h4>Legal & Service Agreements</h4>
              <p>Spot hidden clause revisions, payment shifts, and altered penalty clauses.</p>
            </div>
            <div className="usecase-col">
              <span className="usecase-number">03</span>
              <h4>Financial Spreadsheets</h4>
              <p>Track balance sheet alterations, formula recalculations, and revised projections.</p>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section id="faq" className="faq-section">
          <div className="brochure-header">
            <div className="hero-pill">
              <span className="sparkle">✦</span> Common Questions
            </div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about comparing documents with ChangeWatch.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "How do I use ChangeWatch?",
                a: "Simply upload your baseline file into Box 1 and your updated revision into Box 2, then click 'Compare Documents'. If you don't have files ready, click 'Try Demo' at the top to see an instant sample comparison!"
              },
              {
                q: "What file formats are supported?",
                a: "ChangeWatch supports PDF (.pdf), Microsoft Word (.docx), Excel spreadsheets (.xlsx, .csv), plain text (.txt), and scanned image files (.png, .jpg, .webp) with embedded OCR."
              },
              {
                q: "Why does the first comparison take ~30 seconds?",
                a: "Our neural processing server on Render sleeps after 15 minutes of inactivity to save energy. When a new request arrives, it spins up in about 30 seconds. Subsequent comparisons process at high speed via Groq LPUs."
              },
              {
                q: "Are my uploaded files confidential and safe?",
                a: "Yes. Files are processed in temporary in-memory buffers solely to generate the diff audit, and are deleted immediately after analysis. No documents are permanently stored or shared."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`faq-card ${openFaq === idx ? "open" : ""}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-q-row">
                  <h4>{faq.q}</h4>
                  <span className="faq-arrow">{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* =========================================================
          EXECUTIVE FOUNDER & VERIFIED IDENTITY SECTION
      ========================================================= */}
      <footer id="founder" className="footer-wrapper">
        <div className="executive-card">
          <div className="card-ambient-light" />
          
          <div className="executive-content">
            {/* Left Column: Founder Bio & Verification */}
            <div className="founder-section">
              <div className="status-badge-container">
                <span className="badge-founder">FOUNDER & LEAD DEVELOPER</span>
                <span className="badge-pulse">
                  <span className="pulse-circle"></span>
                  1st Year BE (CSE)
                </span>
              </div>

              <h2 className="executive-name">Shree Navaneetha V R</h2>

              <p className="executive-degree">
                Bachelor of Engineering (B.E.) in Computer Science & Engineering
              </p>

              <div className="divider-line" />

              <p className="executive-bio">
                Designed, architected, and engineered ChangeWatch from scratch as an independent full-stack AI project. 
                Built the multi-format ingestion pipelines, embedded OCR processing, client-side glassmorphic architecture, 
                and Groq-accelerated neural comparison workflows.
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
                    <span className="channel-sub">shree-navaneetha-v-r-91aa42417</span>
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