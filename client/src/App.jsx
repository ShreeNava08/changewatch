import { useState } from "react";

export default function App() {
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!oldFile || !newFile) {
      setError("Please select both the Old Document and New Document.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("oldDocument", oldFile);
    formData.append("newDocument", newFile);

    try {
      const response = await fetch("http://localhost:5000/api/compare", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to compare documents");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 850, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "#2563eb" }}>ChangeWatch</h1>
      <p style={{ textAlign: "center", color: "#64748b" }}>
        Upload the older and newer version of your document to detect key changes.
      </p>

      <form
        onSubmit={handleCompare}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          background: "#f8fafc",
          padding: 24,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          marginTop: 20,
        }}
      >
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            Old Document (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setOldFile(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            New Document (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setNewFile(e.target.files[0])}
            required
          />
        </div>

        <div style={{ gridColumn: "span 2", textAlign: "center", marginTop: 10 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 24px",
              backgroundColor: loading ? "#94a3b8" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {loading ? "Analyzing Differences..." : "Compare Documents"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: "#dc2626", marginTop: 20, background: "#fee2e2", padding: 12, borderRadius: 6 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>Summary</h2>
          <p style={{ background: "#f1f5f9", padding: 12, borderRadius: 6 }}>{result.summary}</p>
          <p><strong>Total Changes Found:</strong> {result.totalChanges}</p>

          <h3>Detected Changes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.changes?.map((ch, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  padding: 14,
                  backgroundColor: ch.importance === "important" ? "#fffbeb" : "#fff",
                  borderLeft: ch.importance === "important" ? "6px solid #f59e0b" : "6px solid #3b82f6",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0 }}>{ch.title}</h4>
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: "#e2e8f0",
                    }}
                  >
                    {ch.type}
                  </span>
                </div>
                <p style={{ margin: "8px 0 4px", fontSize: 14 }}><strong>Old:</strong> {ch.oldValue || "N/A"}</p>
                <p style={{ margin: "4px 0", fontSize: 14 }}><strong>New:</strong> {ch.newValue || "N/A"}</p>
                <p style={{ margin: "8px 0 0", color: "#475569", fontSize: 14 }}>
                  <em>{ch.explanation}</em>
                </p>
              </div>
            ))}
          </div>

          {result.actions && result.actions.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3>Recommended Actions</h3>
              <ul>
                {result.actions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
