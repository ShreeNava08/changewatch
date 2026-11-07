import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

app.get("/", (req, res) => {
  res.send("ChangeWatch backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ChangeWatch AI Engine",
    provider: "Groq LPU (LLaMA 3.3 70B)",
    uptime: Math.round(process.uptime()),
    timestamp: Date.now()
  });
});

// Universal file extractor supporting PDF, Word, Excel, Plain Text, and Images
async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  // 1. PDF Files
  if (ext === ".pdf") {
    const buffer = fs.readFileSync(file.path);
    try {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      await parser.destroy();
      return typeof data === "string" ? data : (data.text || "");
    } catch {
      const data = await PDFParse(buffer);
      return data.text || "";
    }
  }

  // 2. Microsoft Word (.docx)
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value || "";
  }

  // 3. Excel Spreadsheets & CSV (.xlsx, .xls, .csv)
  if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
    const workbook = XLSX.readFile(file.path);
    let extracted = "";
    for (const sheetName of workbook.SheetNames) {
      extracted += `\n--- Sheet: ${sheetName} ---\n`;
      extracted += XLSX.utils.sheet_to_txt(workbook.Sheets[sheetName]) + "\n";
    }
    return extracted;
  }

  // 4. Plain Text & Markdown (.txt, .md, .rtf, .json)
  if ([".txt", ".md", ".rtf", ".json", ".log"].includes(ext)) {
    return fs.readFileSync(file.path, "utf-8");
  }

  // 5. Scanned Images & Photos (.png, .jpg, .jpeg, .webp) -> OCR Engine
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    console.log(`Running OCR on image file: ${file.originalname}...`);
    const { data } = await Tesseract.recognize(file.path, "eng");
    return data.text || "";
  }

  // Fallback: try raw text reading
  return fs.readFileSync(file.path, "utf-8");
}

function getExactDifferences(oldText, newText) {
  const oldWords = oldText.split(/\s+/).filter(Boolean);
  const newWords = newText.split(/\s+/).filter(Boolean);

  const oldSet = new Set(oldWords);
  const newSet = new Set(newWords);

  const removed = [...new Set(oldWords.filter((w) => !newSet.has(w)))];
  const added = [...new Set(newWords.filter((w) => !oldSet.has(w)))];

  return { removed, added };
}

app.post(
  "/api/compare",
  upload.fields([
    { name: "oldDocument", maxCount: 1 },
    { name: "newDocument", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files?.oldDocument || !req.files?.newDocument) {
        return res.status(400).json({ error: "Please upload both documents." });
      }

      const oldFile = req.files.oldDocument[0];
      const newFile = req.files.newDocument[0];

      // Extract text based on file format
      const oldText = await extractTextFromFile(oldFile);
      const newText = await extractTextFromFile(newFile);

      // Clean up uploaded files from disk
      if (fs.existsSync(oldFile.path)) fs.unlinkSync(oldFile.path);
      if (fs.existsSync(newFile.path)) fs.unlinkSync(newFile.path);

      if (!oldText.trim() && !newText.trim()) {
        return res.status(400).json({
          error: "Could not extract readable text from the uploaded files.",
        });
      }

      if (oldText.trim() === newText.trim()) {
        return res.json({
          summary: "Both documents are 100% identical. No textual or numerical differences were detected.",
          totalChanges: 0,
          changes: [],
          actions: ["No action required."],
        });
      }

      const codeDiff = getExactDifferences(oldText, newText);

      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "GROQ_API_KEY is missing." });
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const modelsList = await groq.models.list();
      const chatModels = modelsList.data
        .map((m) => m.id)
        .filter((id) => !id.includes("whisper") && !id.includes("guard") && !id.includes("embed"));

      const activeModel =
        chatModels.find((id) => id.includes("llama") || id.includes("mixtral") || id.includes("qwen")) ||
        chatModels[0];

      const prompt = `
You are ChangeWatch, an automated document difference analyzer.
Compare the OLD document and NEW document below line-by-line, word-by-word, and number-by-number.

Known raw differences detected:
Removed from Old: ${JSON.stringify(codeDiff.removed.slice(0, 50))}
Added to New: ${JSON.stringify(codeDiff.added.slice(0, 50))}

Find and report:
- Score / mark updates, numbers, totals, percentages
- Clause additions, modifications, or removals
- Dates, deadlines, terms, and names

Return ONLY valid JSON in this exact structure without markdown backticks:
{
  "summary": "Clear executive summary of what changed",
  "totalChanges": 1,
  "changes": [
    {
      "type": "added | removed | modified",
      "importance": "important | normal",
      "title": "Short title describing the change",
      "oldValue": "old value or snippet",
      "newValue": "new value or snippet",
      "explanation": "explanation of what changed"
    }
  ],
  "actions": [
    "Recommended next step"
  ]
}

OLD DOCUMENT:
${oldText.slice(0, 15000)}

NEW DOCUMENT:
${newText.slice(0, 15000)}
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output valid JSON document audits." },
          { role: "user", content: prompt },
        ],
        model: activeModel,
        response_format: { type: "json_object" },
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "{}";
      let comparison = JSON.parse(responseText.trim());

      // Code-level fallback if AI misses subtle word changes
      if (comparison.totalChanges === 0 && (codeDiff.removed.length > 0 || codeDiff.added.length > 0)) {
        comparison.totalChanges = Math.max(codeDiff.removed.length, codeDiff.added.length);
        comparison.summary = `Detected ${comparison.totalChanges} updated value(s) between documents.`;
        comparison.changes = codeDiff.added.map((newVal, idx) => ({
          type: "modified",
          importance: "important",
          title: "Value / Text Updated",
          oldValue: codeDiff.removed[idx] || "—",
          newValue: newVal,
          explanation: `Updated from "${codeDiff.removed[idx] || "previous"}" to "${newVal}"`,
        }));
      }

      res.json(comparison);
    } catch (error) {
      console.error("SERVER ERROR:", error);
      res.status(500).json({
        error: error.message || "Failed to compare documents.",
      });
    }
  }
);

// Real-Time Neural Chat Route: Grounded Q&A on Diff Context
app.post("/api/chat", async (req, res) => {
  try {
    const { message, diffContext, history } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing on server." });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Select active model
    let activeModel = "llama-3.3-70b-versatile";
    try {
      const modelsList = await groq.models.list();
      const chatModels = modelsList.data
        .map((m) => m.id)
        .filter((id) => !id.includes("whisper") && !id.includes("guard") && !id.includes("embed"));

      activeModel =
        chatModels.find(
          (id) =>
            id.includes("llama-3.3") ||
            id.includes("llama-3.1-70b") ||
            id.includes("llama-3.1-8b") ||
            id.includes("llama") ||
            id.includes("mixtral") ||
            id.includes("qwen")
        ) ||
        chatModels[0] ||
        "llama-3.3-70b-versatile";
    } catch {
      activeModel = "llama-3.3-70b-versatile";
    }

    const hasDiffContext = Boolean(diffContext && diffContext.summary);
    const systemPrompt = hasDiffContext
      ? `You are ChangeWatch AI, a warm, highly perceptive, and human-friendly document audit partner (think of yourself as an experienced colleague with ChatGPT-level conversational fluency).
You specialize in helping users understand, verify, and act on differences between document versions.

HOW YOU COMMUNICATE:
1. Speak like a real human expert: warm, conversational, clear, thoughtful, and empathetic. Never sound robotic, stiff, or like a terminal command script.
2. Translate raw differences into real-world meaning: don't just paste previous vs revised text — explain what it actually means for the user's wallet, schedule, liability, or admission chances.
3. Be proactive and practical: summarize key takeaways first, break down details with natural, easy-to-read bullet points, and offer sensible next steps.
4. If asked to write an email or memo, craft a clean, ready-to-use draft in a natural human voice.
5. Use markdown formatting naturally (bolding key numbers/dates, readable paragraphs, friendly bullet points).

=== ACTIVE DOCUMENT AUDIT CONTEXT ===
Domain Mode: ${diffContext?.mode || "General"}
Base Document: ${diffContext?.oldFileName || "Version 1"}
Revised Document: ${diffContext?.newFileName || "Version 2"}
Executive Diff Summary: ${diffContext?.summary || "No summary provided"}
Total Changes Detected: ${diffContext?.totalChanges || 0}
Detailed Differences:
${JSON.stringify(diffContext?.changes || [], null, 2)}
Recommended Action Checklist:
${JSON.stringify(diffContext?.actions || [], null, 2)}
=== END AUDIT CONTEXT ===`
      : `You are ChangeWatch AI, a warm, conversational, and helpful assistant for ChangeWatch (think ChatGPT, but specialized in document intelligence).
ChangeWatch is an autonomous document discrepancy detection engine architected by Shree Navaneetha V R (1st Year BE CSE).
It compares any two versions of PDFs, Word files (.docx), Excel sheets (.xlsx, .csv), scanned images/marksheets (.png, .jpg, .webp) with embedded OCR, and plain text using Groq LPUs.

HOW YOU COMMUNICATE:
- Speak like a friendly human expert: warm, engaging, and clear.
- Explain how ChangeWatch works in simple terms: 1) Pick an audit mode, 2) Drop two files, 3) Review side-by-side differences and export an official PDF certificate.
- Encourage users to click '⚡ Run Instant Live Demo' to see how the engine catches sneaky changes in action.
- Answer questions about supported formats, OCR accuracy, or specific domain needs thoughtfully.`;

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: String(item.content || ""),
        }))
      : [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message.trim() },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: activeModel,
      temperature: 0.3,
      max_tokens: 1024,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "I couldn't generate a response based on the document diff.";
    res.json({ reply });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);
    res.status(500).json({
      error: error.message || "Failed to process question with Groq AI.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ChangeWatch server running on port ${PORT}`);
});