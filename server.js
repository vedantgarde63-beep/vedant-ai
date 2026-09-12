import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Add it to .env before using real AI.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];

    const safeMessages = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }));

    if (!safeMessages.length) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      instructions:
        "You are Vedant AI, a helpful, friendly general-purpose assistant. " +
        "Give clear, accurate answers. Do not claim to be a human.",
      input: safeMessages
    });

    res.json({ reply: response.output_text || "Sorry, I could not generate a response." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI request failed. Check your API key, model access, and server logs."
    });
  }
});

app.listen(port, () => {
  console.log(`Vedant AI running at http://localhost:${port}`);
});