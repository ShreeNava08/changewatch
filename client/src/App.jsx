import React, { useState, useRef } from "react";
import "./App.css";

// Crisp SVG Icons
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
      setError("Please select both document versions before running the comparison.");
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
      {/* Background Mesh Elements */}
      <div className="radial-glow glow-1" />
      <div className="radial-glow glow-2" />

      {/* Navigation Header */}
      <header className="header">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-badge">CW</div>
            <span className="brand-title">ChangeWatch</span>
            <span className="brand-tag">v2.0</span>
          </div>
          <div className="system-status">
            <span className="pulse-dot" />
            <span>Inference Engine Ready</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="content">
        <div className="hero">
          <div className="hero-pill">
            <span className="sparkle">✦</span> AI Document Audit System
          </div>
          <h1>Intelligent Document Diff & Change Audit</h1>
          <p>
            Upload any two versions of a document. ChangeWatch uses multi-modal extraction to pinpoint
            score adjustments, clause changes, line updates, and numerical discrepancies.
          </p>
        </div>

        {/* Upload Container */}
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

            {/* Actions */}
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

        {/* Results */}
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

      <footer className="footer">
        <p>ChangeWatch Engine • Powered by High-Speed Neural Inference</p>
      </footer>
    </div>
  );
}