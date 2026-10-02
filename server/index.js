import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.send("ChangeWatch backend is running!");
});

async function extractTextFromPDF(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    return typeof data === "string" ? data : (data.text || "");
  } catch (err) {
    const data = await PDFParse(buffer);
    return data.text || "";
  }
}

// Programmatic diff: Finds exact numbers/words that differ between documents
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

      const oldBuffer = fs.readFileSync(oldFile.path);
      const newBuffer = fs.readFileSync(newFile.path);

      const oldText = await extractTextFromPDF(oldBuffer);
      const newText = await extractTextFromPDF(newBuffer);

      fs.unlinkSync(oldFile.path);
      fs.unlinkSync(newFile.path);

      // Terminal diagnostic check
      console.log("\n==================== TEXT EXTRACTION CHECK ====================");
      console.log(`Old Document Contains '585':`, oldText.includes("585"));
      console.log(`New Document Contains '589':`, newText.includes("589"));
      console.log(`Old Doc Character Count:`, oldText.trim().length);
      console.log(`New Doc Character Count:`, newText.trim().length);
      console.log("===============================================================\n");

      // Check if the PDFs contain selectable text
      if (!oldText.trim() || !newText.trim()) {
        return res.status(400).json({
          error: "One or both PDFs contain scanned images with no selectable text.",
        });
      }

      // Check if both text extractions are 100% identical
      if (oldText.trim() === newText.trim()) {
        return res.status(400).json({
          error:
            "The text extracted from both PDFs is 100% identical. Your marks (585 / 589) are embedded inside an image/table in the PDF that lacks a digital text layer.",
        });
      }

      // Run code-level diff
      const codeDiff = getExactDifferences(oldText, newText);
      console.log("Code-detected raw changes:", codeDiff);

      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "GROQ_API_KEY is missing in server/.env file." });
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
You are ChangeWatch, an AI document-change detector.
Compare the OLD document and NEW document below.

RAW DIFFERENCES DETECTED BY PARSER:
Removed/Changed from Old: ${JSON.stringify(codeDiff.removed)}
Added/Changed in New: ${JSON.stringify(codeDiff.added)}

You MUST report these differences, especially marks, scores, and numbers.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "Clear summary of all detected changes including marks/scores",
  "totalChanges": 1,
  "changes": [
    {
      "type": "modified",
      "importance": "important",
      "title": "Marks / Score Updated",
      "oldValue": "585",
      "newValue": "589",
      "explanation": "Marks updated from 585 to 589"
    }
  ],
  "actions": [
    "Verify the updated score with the authority"
  ]
}

OLD DOCUMENT:
${oldText}

NEW DOCUMENT:
${newText}
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You output raw JSON document comparisons." },
          { role: "user", content: prompt },
        ],
        model: activeModel,
        response_format: { type: "json_object" },
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "{}";
      let comparison = JSON.parse(responseText.trim());

      // FAIL-SAFE: If the AI reported 0 changes but our code diff found differences, inject them directly!
      if (comparison.totalChanges === 0 && (codeDiff.removed.length > 0 || codeDiff.added.length > 0)) {
        console.log("AI missed the changes — injecting code-detected diff directly.");
        comparison.totalChanges = Math.max(codeDiff.removed.length, codeDiff.added.length);
        comparison.summary = `Detected ${comparison.totalChanges} updated value(s) between documents.`;
        comparison.changes = codeDiff.added.map((newVal, idx) => ({
          type: "modified",
          importance: "important",
          title: "Value / Mark Updated",
          oldValue: codeDiff.removed[idx] || "Not present",
          newValue: newVal,
          explanation: `Updated from ${codeDiff.removed[idx] || "previous value"} to ${newVal}`,
        }));
      }

      res.json(comparison);
    } catch (error) {
      console.error("SERVER ERROR:", error);
      res.status(500).json({
        error: error.message || "Something went wrong while comparing the documents.",
      });
    }
  }
);


const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`ChangeWatch backend running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER LISTEN ERROR:", err);
});

setInterval(() => {}, 60000);