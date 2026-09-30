import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Add it to your environment variables.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];

    const safeMessages = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 12000)
      }));

    if (!safeMessages.length || !safeMessages.some(m => m.role === "user")) {
      return res.status(400).json({ error: "Please send a message." });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are Vedant AI, a helpful general-purpose AI assistant. " +
        "Answer clearly and accurately. If you are unsure, say so instead of inventing facts. " +
        "Keep answers appropriate for a general audience. " +
        "Use simple explanations when the user asks for help learning.",
      input: safeMessages
    });

    res.json({
      reply: response.output_text || "I couldn't generate a response."
    });
  } catch (error) {
    console.error("OpenAI API error:", error);

    const message =
      error?.status === 401
        ? "The OpenAI API key is invalid or missing."
        : "Sorry, Vedant AI could not answer right now.";

    res.status(500).json({ error: message });
  }
});

app.get("*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Vedant AI running on port ${port}`);
});