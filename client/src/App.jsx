import React, { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const oldInputRef = useRef(null);
  const newInputRef = useRef(null);

  const handleFileDrop = (e, setFile) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!oldFile || !newFile) {
      setError("Please select both document versions before comparing.");
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
      setError(err.message || "An unexpected error occurred while analyzing files.");
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
    <div className="app-container">
      {/* Background glow effects */}
      <div className="bg-glow glow-top-left" />
      <div className="bg-glow glow-bottom-right" />

      {/* Navigation Header */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">CW</div>
          <span className="brand-name">ChangeWatch</span>
          <span className="badge-pill">AI Document Diff</span>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span>Groq AI Online</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <div className="hero-text">
          <h1>Compare Document Versions with Precision</h1>
          <p>
            Detect subtle edits, score adjustments, numerical modifications, and updated
            clauses across PDF revisions instantly.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleCompare} className="workspace-card">
          <div className="dropzone-grid">
            {/* Old Document Dropzone */}
            <div
              className={`dropzone ${oldFile ? "has-file" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, setOldFile)}
              onClick={() => oldInputRef.current.click()}
            >
              <input
                type="file"
                ref={oldInputRef}
                accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                onChange={(e) => e.target.files[0] && setOldFile(e.target.files[0])}
              />
              <div className="dropzone-icon">📄</div>
              <div className="dropzone-title">Original Document (v1)</div>
              {oldFile ? (
                <div className="file-info">
                  <span className="file-name">{oldFile.name}</span>
                  <span className="file-size">({(oldFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div className="dropzone-hint">Click or drag & drop previous PDF</div>
              )}
            </div>

            {/* Comparison Arrow */}
            <div className="diff-arrow">➜</div>

            {/* New Document Dropzone */}
            <div
              className={`dropzone ${newFile ? "has-file" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, setNewFile)}
              onClick={() => newInputRef.current.click()}
            >
              <input
                type="file"
                ref={newInputRef}
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => e.target.files[0] && setNewFile(e.target.files[0])}
              />
              <div className="dropzone-icon">✨</div>
              <div className="dropzone-title">Revised Document (v2)</div>
              {newFile ? (
                <div className="file-info">
                  <span className="file-name">{newFile.name}</span>
                  <span className="file-size">({(newFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div className="dropzone-hint">Click or drag & drop new revision PDF</div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !oldFile || !newFile}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing documents with AI...
                </>
              ) : (
                "Run Comparison Analysis"
              )}
            </button>
            {(oldFile || newFile || result) && (
              <button type="button" onClick={resetAll} className="btn btn-secondary">
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="alert-card error-alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">{error}</div>
          </div>
        )}

        {/* Comparison Results */}
        {result && (
          <div className="results-container">
            <div className="results-header">
              <div>
                <h2>Audit Findings</h2>
                <p className="summary-paragraph">{result.summary}</p>
              </div>
              <div className="metric-badge">
                <span className="metric-number">{result.totalChanges || 0}</span>
                <span className="metric-label">
                  {result.totalChanges === 1 ? "Change" : "Changes"} Identified
                </span>
              </div>
            </div>

            {/* Changes List */}
            {result.changes && result.changes.length > 0 ? (
              <div className="changes-list">
                {result.changes.map((item, idx) => (
                  <div key={idx} className={`change-card ${item.importance}`}>
                    <div className="change-meta">
                      <span className={`tag-badge type-${item.type || "modified"}`}>
                        {item.type || "Modified"}
                      </span>
                      <span className={`tag-badge priority-${item.importance || "normal"}`}>
                        {item.importance === "important" ? "Critical Priority" : "Standard"}
                      </span>
                      <h3 className="change-title">{item.title}</h3>
                    </div>

                    <div className="diff-comparison-grid">
                      <div className="diff-box old-value">
                        <span className="diff-label">Previous Value</span>
                        <div className="diff-text">{item.oldValue || "—"}</div>
                      </div>
                      <div className="diff-divider">→</div>
                      <div className="diff-box new-value">
                        <span className="diff-label">Updated Value</span>
                        <div className="diff-text">{item.newValue || "—"}</div>
                      </div>
                    </div>

                    {item.explanation && (
                      <p className="change-explanation">{item.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="zero-state">
                <p>No textual or numerical discrepancies detected between these files.</p>
              </div>
            )}

            {/* Action Items */}
            {result.actions && result.actions.length > 0 && (
              <div className="actions-section">
                <h3>Recommended Action Items</h3>
                <ul className="action-list">
                  {result.actions.map((act, i) => (
                    <li key={i} className="action-item">
                      <span className="check-bullet">✔</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
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